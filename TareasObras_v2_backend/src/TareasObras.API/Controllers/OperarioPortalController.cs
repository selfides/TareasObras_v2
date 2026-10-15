using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;
using TareasObras.Domain.Enums;

namespace TareasObras.API.Controllers;

[ApiController]
[Route("api/operario")]
[Authorize]
public class OperarioPortalController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<OperarioPortalController> _logger;

    public OperarioPortalController(
        IUnitOfWork uow,
        ICurrentUserService currentUserService,
        ILogger<OperarioPortalController> logger)
    {
        _uow = uow;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    private async Task<Operario?> ObtenerOperarioActualAsync(Guid? operarioIdParam = null, CancellationToken ct = default)
    {
        // 1. Si es Admin/Supervisor y especifica un operarioId, permitirlo (útil para pruebas o delegación)
        var esAdminOSupervisor = _currentUserService.Role is "Admin" or "Supervisor";
        if (esAdminOSupervisor && operarioIdParam.HasValue)
        {
            return await _uow.Operarios.GetByIdAsync(operarioIdParam.Value, ct);
        }

        // 2. Si el token JWT tiene el claim operario_id
        if (_currentUserService.OperarioId.HasValue)
        {
            return await _uow.Operarios.GetByIdAsync(_currentUserService.OperarioId.Value, ct);
        }

        // 3. Buscar por UserId del usuario autenticado
        if (!string.IsNullOrEmpty(_currentUserService.UserId))
        {
            var operario = await _uow.Operarios.GetByUserIdAsync(_currentUserService.UserId, ct);
            if (operario != null) return operario;
        }

        // 4. Fallback: Si es admin y no está vinculado, devolver el primer operario activo para facilitar pruebas en desarrollo
        if (esAdminOSupervisor)
        {
            var todos = await _uow.Operarios.GetAllWithDetailsAsync(ct);
            return todos.FirstOrDefault(o => o.Activo);
        }

        return null;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe([FromQuery] Guid? operarioId, CancellationToken ct)
    {
        var operario = await ObtenerOperarioActualAsync(operarioId, ct);
        if (operario == null)
        {
            return NotFound(new { mensaje = "No se ha encontrado un perfil de operario vinculado a esta cuenta de usuario." });
        }

        var todasObras = await _uow.Obras.GetAllAsync(ct);
        var obrasActivas = todasObras
            .Where(o => o.Estado != EstadoObra.Completada && o.Estado != EstadoObra.Cancelada)
            .Select(o => new
            {
                id = o.Id,
                codigo = o.Codigo,
                nombre = o.Nombre,
                direccion = o.Direccion,
                cliente = o.Cliente,
                estado = o.Estado.ToString()
            })
            .OrderBy(o => o.nombre)
            .ToList();

        var perfil = new
        {
            id = operario.Id,
            nombre = operario.Nombre,
            apellidos = operario.Apellidos,
            nombreCompleto = $"{operario.Nombre} {operario.Apellidos}".Trim(),
            dni = operario.DNI,
            telefono = operario.Telefono,
            activo = operario.Activo,
            categoria = new
            {
                id = operario.Categoria.Id,
                nombre = operario.Categoria.Nombre,
                costeHoraBase = operario.Categoria.CosteHoraBase
            },
            cuadrilla = operario.Cuadrilla != null ? new
            {
                id = operario.Cuadrilla.Id,
                nombre = operario.Cuadrilla.Nombre
            } : null,
            obrasActivas = obrasActivas
        };

        return Ok(perfil);
    }

    [HttpGet("estado-hoy")]
    public async Task<IActionResult> GetEstadoHoy([FromQuery] Guid? operarioId, CancellationToken ct)
    {
        var operario = await ObtenerOperarioActualAsync(operarioId, ct);
        if (operario == null)
            return NotFound(new { mensaje = "Operario no encontrado" });

        var hoy = DateTime.Today;
        var fichajeActivo = await _uow.RegistrosHoras.GetFichajeActivoAsync(operario.Id, ct);
        var registrosHoy = (await _uow.RegistrosHoras.GetByOperarioAsync(operario.Id, hoy, hoy, ct)).ToList();

        var totalHorasHoy = registrosHoy.Where(r => !r.EnCurso).Sum(r => r.Horas);

        var ahora = DateTime.Now.TimeOfDay;
        var fichajeActivoDto = fichajeActivo == null ? null : new
        {
            id = fichajeActivo.Id,
            obraId = fichajeActivo.ObraId,
            obraNombre = fichajeActivo.Obra?.Nombre ?? "",
            obraCodigo = fichajeActivo.Obra?.Codigo ?? "",
            tareaId = fichajeActivo.TareaId,
            tareaTitulo = fichajeActivo.Tarea?.Titulo,
            fecha = fichajeActivo.Fecha,
            horaInicio = fichajeActivo.HoraInicio.ToString(@"hh\:mm"),
            minutosTranscurridos = (int)Math.Max(0, (ahora - fichajeActivo.HoraInicio).TotalMinutes),
            latitudInicio = fichajeActivo.LatitudInicio,
            longitudInicio = fichajeActivo.LongitudInicio,
            observaciones = fichajeActivo.Observaciones
        };

        var registrosHoyDto = registrosHoy.Select(r => new
        {
            id = r.Id,
            obraId = r.ObraId,
            obraNombre = r.Obra?.Nombre ?? "",
            horaInicio = r.HoraInicio.ToString(@"hh\:mm"),
            horaFin = r.HoraFin.ToString(@"hh\:mm"),
            horas = r.Horas,
            enCurso = r.EnCurso,
            observaciones = r.Observaciones
        });

        return Ok(new
        {
            operarioId = operario.Id,
            fecha = hoy.ToString("yyyy-MM-dd"),
            hayFichajeActivo = fichajeActivo != null,
            fichajeActivo = fichajeActivoDto,
            totalHorasHoy,
            registros = registrosHoyDto
        });
    }

    [HttpPost("fichar-entrada")]
    public async Task<IActionResult> FicharEntrada([FromBody] FicharEntradaRequest req, [FromQuery] Guid? operarioId, CancellationToken ct)
    {
        var operario = await ObtenerOperarioActualAsync(operarioId, ct);
        if (operario == null)
            return NotFound(new { mensaje = "Operario no encontrado" });

        var activoExistente = await _uow.RegistrosHoras.GetFichajeActivoAsync(operario.Id, ct);
        if (activoExistente != null)
        {
            return BadRequest(new
            {
                mensaje = "Ya dispones de una jornada en curso. Finaliza la jornada activa antes de iniciar una nueva.",
                fichajeActivoId = activoExistente.Id,
                horaInicio = activoExistente.HoraInicio.ToString(@"hh\:mm")
            });
        }

        var obra = await _uow.Obras.GetByIdAsync(req.ObraId, ct);
        if (obra == null)
            return BadRequest(new { mensaje = "La obra seleccionada no existe." });

        var timestampLocal = req.TimestampDispositivo ?? DateTime.Now;
        var horaInicio = timestampLocal.TimeOfDay;
        var fecha = timestampLocal.Date;
        var costeHora = operario.Categoria?.CosteHoraBase ?? 0m;

        var nuevoRegistro = RegistroHoras.IniciarFichaje(
            obraId: req.ObraId,
            operarioId: operario.Id,
            categoriaOperarioId: operario.CategoriaOperarioId,
            tareaId: req.TareaId,
            fecha: fecha,
            horaInicio: horaInicio,
            costeHoraAplicado: costeHora,
            latitud: req.Latitud,
            longitud: req.Longitud,
            timestampDispositivo: timestampLocal,
            sincronizadoOffline: req.SincronizadoOffline ?? false,
            observaciones: req.Observaciones
        );

        await _uow.RegistrosHoras.AddAsync(nuevoRegistro, ct);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Fichaje de entrada registrado para operario {OperarioId} en obra {ObraId} a las {Hora}",
            operario.Id, req.ObraId, horaInicio);

        return Ok(new
        {
            mensaje = "Entrada fichada correctamente.",
            id = nuevoRegistro.Id,
            obraId = nuevoRegistro.ObraId,
            obraNombre = obra.Nombre,
            horaInicio = nuevoRegistro.HoraInicio.ToString(@"hh\:mm"),
            fecha = nuevoRegistro.Fecha.ToString("yyyy-MM-dd")
        });
    }

    [HttpPost("fichar-salida")]
    public async Task<IActionResult> FicharSalida([FromBody] FicharSalidaRequest req, [FromQuery] Guid? operarioId, CancellationToken ct)
    {
        var operario = await ObtenerOperarioActualAsync(operarioId, ct);
        if (operario == null)
            return NotFound(new { mensaje = "Operario no encontrado" });

        RegistroHoras? registro;
        if (req.RegistroHorasId.HasValue)
        {
            registro = await _uow.RegistrosHoras.GetByIdAsync(req.RegistroHorasId.Value, ct);
        }
        else
        {
            registro = await _uow.RegistrosHoras.GetFichajeActivoAsync(operario.Id, ct);
        }

        if (registro == null || !registro.EnCurso || registro.OperarioId != operario.Id)
        {
            return BadRequest(new { mensaje = "No se ha encontrado ninguna jornada activa en curso para registrar la salida." });
        }

        var timestampLocal = req.TimestampDispositivo ?? DateTime.Now;
        var horaFin = timestampLocal.TimeOfDay;

        // Si la hora de fin es anterior a la hora de inicio por cambio de día, asegurar que al menos sea igual
        if (horaFin < registro.HoraInicio && timestampLocal.Date == registro.Fecha)
        {
            horaFin = registro.HoraInicio;
        }

        registro.FinalizarFichaje(
            horaFin: horaFin,
            latitud: req.Latitud,
            longitud: req.Longitud,
            timestampDispositivo: timestampLocal,
            observacionesAdicionales: req.ObservacionesAdicionales
        );

        _uow.RegistrosHoras.Update(registro);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Fichaje de salida registrado para operario {OperarioId}. Total horas calculadas: {Horas}",
            operario.Id, registro.Horas);

        return Ok(new
        {
            mensaje = "Salida registrada con éxito.",
            id = registro.Id,
            horaInicio = registro.HoraInicio.ToString(@"hh\:mm"),
            horaFin = registro.HoraFin.ToString(@"hh\:mm"),
            horasTotales = registro.Horas,
            costeTotal = registro.CosteTotal
        });
    }

    [HttpGet("mis-horas")]
    public async Task<IActionResult> GetMisHoras(
        [FromQuery] DateTime? desde,
        [FromQuery] DateTime? hasta,
        [FromQuery] Guid? operarioId,
        CancellationToken ct)
    {
        var operario = await ObtenerOperarioActualAsync(operarioId, ct);
        if (operario == null)
            return NotFound(new { mensaje = "Operario no encontrado" });

        var fechaDesde = desde ?? DateTime.Today.AddDays(-30);
        var fechaHasta = hasta ?? DateTime.Today;

        var registros = await _uow.RegistrosHoras.GetByOperarioAsync(operario.Id, fechaDesde, fechaHasta, ct);
        var lista = registros.Select(r => new
        {
            id = r.Id,
            obraId = r.ObraId,
            obraNombre = r.Obra?.Nombre ?? "",
            obraCodigo = r.Obra?.Codigo ?? "",
            tareaId = r.TareaId,
            tareaTitulo = r.Tarea?.Titulo,
            fecha = r.Fecha.ToString("yyyy-MM-dd"),
            horaInicio = r.HoraInicio.ToString(@"hh\:mm"),
            horaFin = r.HoraFin.ToString(@"hh\:mm"),
            horas = r.Horas,
            enCurso = r.EnCurso,
            observaciones = r.Observaciones,
            sincronizadoOffline = r.SincronizadoOffline,
            latitudInicio = r.LatitudInicio,
            longitudInicio = r.LongitudInicio
        }).ToList();

        var totalHoras = lista.Where(r => !r.enCurso).Sum(r => r.horas);
        var diasTrabajados = lista.Select(r => r.fecha).Distinct().Count();

        return Ok(new
        {
            operarioId = operario.Id,
            desde = fechaDesde.ToString("yyyy-MM-dd"),
            hasta = fechaHasta.ToString("yyyy-MM-dd"),
            totalHoras,
            diasTrabajados,
            registros = lista
        });
    }

    [HttpPost("sincronizar-batch")]
    public async Task<IActionResult> SincronizarBatch(
        [FromBody] SincronizarBatchRequest request,
        [FromQuery] Guid? operarioId,
        CancellationToken ct)
    {
        var operario = await ObtenerOperarioActualAsync(operarioId, ct);
        if (operario == null)
            return NotFound(new { mensaje = "Operario no encontrado" });

        var resultados = new List<SyncBatchItemResult>();

        foreach (var item in request.Items)
        {
            try
            {
                if (item.Tipo.Equals("ENTRADA", StringComparison.OrdinalIgnoreCase))
                {
                    var obra = await _uow.Obras.GetByIdAsync(item.ObraId, ct);
                    if (obra == null)
                    {
                        resultados.Add(new SyncBatchItemResult(item.LocalId, false, null, "Obra no encontrada"));
                        continue;
                    }

                    var ts = item.TimestampInicio ?? item.Fecha;
                    var reg = RegistroHoras.IniciarFichaje(
                        obraId: item.ObraId,
                        operarioId: operario.Id,
                        categoriaOperarioId: operario.CategoriaOperarioId,
                        tareaId: item.TareaId,
                        fecha: item.Fecha.Date,
                        horaInicio: item.HoraInicio,
                        costeHoraAplicado: operario.Categoria?.CosteHoraBase ?? 0m,
                        latitud: item.LatitudInicio,
                        longitud: item.LongitudInicio,
                        timestampDispositivo: ts,
                        sincronizadoOffline: true,
                        observaciones: item.Observaciones
                    );

                    await _uow.RegistrosHoras.AddAsync(reg, ct);
                    await _uow.SaveChangesAsync(ct);
                    resultados.Add(new SyncBatchItemResult(item.LocalId, true, reg.Id, null));
                }
                else if (item.Tipo.Equals("SALIDA", StringComparison.OrdinalIgnoreCase))
                {
                    RegistroHoras? reg = null;
                    if (item.ServerId.HasValue)
                    {
                        reg = await _uow.RegistrosHoras.GetByIdAsync(item.ServerId.Value, ct);
                    }
                    else
                    {
                        reg = await _uow.RegistrosHoras.GetFichajeActivoAsync(operario.Id, ct);
                    }

                    if (reg == null)
                    {
                        resultados.Add(new SyncBatchItemResult(item.LocalId, false, null, "No se encontró el registro para finalizar"));
                        continue;
                    }

                    var horaFin = item.HoraFin ?? item.HoraInicio;
                    reg.FinalizarFichaje(
                        horaFin: horaFin,
                        latitud: item.LatitudFin,
                        longitud: item.LongitudFin,
                        timestampDispositivo: item.TimestampFin,
                        observacionesAdicionales: item.Observaciones
                    );

                    _uow.RegistrosHoras.Update(reg);
                    await _uow.SaveChangesAsync(ct);
                    resultados.Add(new SyncBatchItemResult(item.LocalId, true, reg.Id, null));
                }
                else if (item.Tipo.Equals("COMPLETO", StringComparison.OrdinalIgnoreCase))
                {
                    // Fichaje que empezó y terminó offline
                    var obra = await _uow.Obras.GetByIdAsync(item.ObraId, ct);
                    if (obra == null)
                    {
                        resultados.Add(new SyncBatchItemResult(item.LocalId, false, null, "Obra no encontrada"));
                        continue;
                    }

                    var reg = RegistroHoras.IniciarFichaje(
                        obraId: item.ObraId,
                        operarioId: operario.Id,
                        categoriaOperarioId: operario.CategoriaOperarioId,
                        tareaId: item.TareaId,
                        fecha: item.Fecha.Date,
                        horaInicio: item.HoraInicio,
                        costeHoraAplicado: operario.Categoria?.CosteHoraBase ?? 0m,
                        latitud: item.LatitudInicio,
                        longitud: item.LongitudInicio,
                        timestampDispositivo: item.TimestampInicio,
                        sincronizadoOffline: true,
                        observaciones: item.Observaciones
                    );

                    var horaFin = item.HoraFin ?? item.HoraInicio;
                    reg.FinalizarFichaje(
                        horaFin: horaFin,
                        latitud: item.LatitudFin,
                        longitud: item.LongitudFin,
                        timestampDispositivo: item.TimestampFin,
                        observacionesAdicionales: null
                    );

                    await _uow.RegistrosHoras.AddAsync(reg, ct);
                    await _uow.SaveChangesAsync(ct);
                    resultados.Add(new SyncBatchItemResult(item.LocalId, true, reg.Id, null));
                }
                else
                {
                    resultados.Add(new SyncBatchItemResult(item.LocalId, false, null, $"Tipo '{item.Tipo}' no soportado"));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sincronizando item offline {LocalId}", item.LocalId);
                resultados.Add(new SyncBatchItemResult(item.LocalId, false, null, ex.Message));
            }
        }

        return Ok(new
        {
            totalProcesados = request.Items.Count,
            exitosos = resultados.Count(r => r.Success),
            fallidos = resultados.Count(r => !r.Success),
            resultados
        });
    }
}

public record FicharEntradaRequest(
    Guid ObraId,
    Guid? TareaId,
    decimal? Latitud,
    decimal? Longitud,
    DateTime? TimestampDispositivo,
    bool? SincronizadoOffline,
    string? Observaciones
);

public record FicharSalidaRequest(
    Guid? RegistroHorasId,
    decimal? Latitud,
    decimal? Longitud,
    DateTime? TimestampDispositivo,
    string? ObservacionesAdicionales
);

public record SincronizarBatchRequest(List<SyncBatchItem> Items);

public record SyncBatchItem(
    string LocalId,
    string Tipo, // "ENTRADA", "SALIDA", "COMPLETO"
    Guid? ServerId,
    Guid ObraId,
    Guid? TareaId,
    DateTime Fecha,
    TimeSpan HoraInicio,
    TimeSpan? HoraFin,
    decimal? LatitudInicio,
    decimal? LongitudInicio,
    decimal? LatitudFin,
    decimal? LongitudFin,
    DateTime? TimestampInicio,
    DateTime? TimestampFin,
    string? Observaciones
);

public record SyncBatchItemResult(
    string LocalId,
    bool Success,
    Guid? ServerId,
    string? Error
);
