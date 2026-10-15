using MediatR;
using Microsoft.Extensions.Logging;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;

namespace TareasObras.Application.Features.Facturas.Commands;

public class ImputarFacturaCommand : IRequest<ImputarFacturaResultDto>
{
    public Guid ObraId { get; set; }
    public Guid? ProveedorId { get; set; }
    public string? ProveedorNombre { get; set; }
    public string? ProveedorCif { get; set; }
    public bool CrearProveedorSiNoExiste { get; set; } = true;
    public string? NumeroFactura { get; set; }
    public string? NumeroAlbaran { get; set; }
    public DateTime Fecha { get; set; } = DateTime.UtcNow.Date;
    public decimal? PorcentajeIva { get; set; }
    public string? DocumentoAdjuntoUrl { get; set; }
    public string? DocumentoHash { get; set; }
    public string? Observaciones { get; set; }
    public Guid? TicketPendienteId { get; set; }
    public List<LineaImputarFacturaDto> Lineas { get; set; } = new();
}



public class LineaImputarFacturaDto
{
    public string Descripcion { get; set; } = "";
    public string Unidad { get; set; } = "ud";
    public decimal Cantidad { get; set; } = 1;
    public decimal PrecioUnitario { get; set; }
    public decimal Importe { get; set; }
    public Guid? LineaPartidaId { get; set; }
    public string? Observaciones { get; set; }
}

public record ImputarFacturaResultDto
{
    public bool Success { get; init; }
    public string Mensaje { get; init; } = "";
    public int MaterialesCreados { get; init; }
    public decimal TotalCosteImputado { get; init; }
    public decimal NuevoCosteRealObra { get; init; }
    public Guid? ProveedorId { get; init; }
    public string? ProveedorNombre { get; init; }
    public List<Guid> MaterialIds { get; init; } = new();
}

public class ImputarFacturaHandler : IRequestHandler<ImputarFacturaCommand, ImputarFacturaResultDto>
{
    private readonly IUnitOfWork _uow;
    private readonly IAuditService _audit;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<ImputarFacturaHandler> _logger;

    public ImputarFacturaHandler(
        IUnitOfWork uow,
        IAuditService audit,
        ICurrentUserService currentUser,
        ILogger<ImputarFacturaHandler> logger)
    {
        _uow = uow;
        _audit = audit;
        _currentUser = currentUser;
        _logger = logger;
    }


    public async Task<ImputarFacturaResultDto> Handle(ImputarFacturaCommand r, CancellationToken ct)
    {
        // 1. Validar que la obra exista
        var obra = await _uow.Obras.GetByIdAsync(r.ObraId, ct);
        if (obra is null)
        {
            throw new KeyNotFoundException($"No se encontró la obra con ID {r.ObraId}.");
        }

        // 2. Resolver o dar de alta el Proveedor automáticamente
        Guid? resolvedProveedorId = r.ProveedorId;
        string? resolvedProveedorNombre = r.ProveedorNombre;

        if (resolvedProveedorId.HasValue)
        {
            var prov = await _uow.Proveedores.GetByIdAsync(resolvedProveedorId.Value, ct);
            if (prov != null)
            {
                resolvedProveedorNombre = prov.Nombre;
            }
        }
        else if (!string.IsNullOrWhiteSpace(r.ProveedorNombre))
        {
            var cleanNombre = r.ProveedorNombre.Trim();
            var todosProveedores = await _uow.Proveedores.GetAllAsync(ct);

            var provExistente = todosProveedores.FirstOrDefault(p =>
                (!string.IsNullOrWhiteSpace(r.ProveedorCif) && !string.IsNullOrWhiteSpace(p.CifNif) &&
                 p.CifNif.Replace("-", "").Replace(" ", "").Equals(r.ProveedorCif.Replace("-", "").Replace(" ", ""), StringComparison.OrdinalIgnoreCase)) ||
                p.Nombre.Equals(cleanNombre, StringComparison.OrdinalIgnoreCase));

            if (provExistente != null)
            {
                resolvedProveedorId = provExistente.Id;
                resolvedProveedorNombre = provExistente.Nombre;
            }
            else if (r.CrearProveedorSiNoExiste || !string.IsNullOrWhiteSpace(cleanNombre))
            {
                var nuevoProv = Proveedor.Create(
                    cleanNombre,
                    r.ProveedorCif,
                    direccion: null,
                    telefono: null,
                    email: null,
                    observaciones: "Alta automática generada al imputar factura/ticket");

                await _uow.Proveedores.AddAsync(nuevoProv, ct);
                resolvedProveedorId = nuevoProv.Id;
                resolvedProveedorNombre = nuevoProv.Nombre;
                _logger.LogInformation("Proveedor '{Nombre}' (CIF: {Cif}) creado automáticamente al imputar factura.", cleanNombre, r.ProveedorCif);
            }
        }

        // 3. Validar duplicado por hash de documento
        if (!string.IsNullOrWhiteSpace(r.DocumentoHash))
        {
            var existente = await _uow.MaterialesObra.GetByHashAsync(r.DocumentoHash, ct);
            if (existente != null)
            {
                throw new InvalidOperationException($"El documento ya fue imputado previamente a la obra '{existente.Obra?.Nombre ?? "existente"}' el {existente.Fecha:dd/MM/yyyy}.");
            }
        }

        // 4. Crear los registros de MaterialObra en bloque
        if (r.Lineas == null || r.Lineas.Count == 0)
        {
            throw new InvalidOperationException("Debe proporcionar al menos una línea de material para imputar a la obra.");
        }

        var materialIds = new List<Guid>();
        decimal totalImputado = 0;
        var pctIva = r.PorcentajeIva ?? 21m;

        foreach (var linea in r.Lineas)
        {
            var cantidad = linea.Cantidad > 0 ? linea.Cantidad : 1;
            var precioUnitario = linea.PrecioUnitario >= 0 ? linea.PrecioUnitario : linea.Importe;
            var baseImponible = linea.Importe > 0 ? linea.Importe : (cantidad * precioUnitario);
            var importeIva = Math.Round(baseImponible * (pctIva / 100m), 2);

            var material = MaterialObra.Create(
                obraId: r.ObraId,
                descripcion: linea.Descripcion,
                unidad: string.IsNullOrWhiteSpace(linea.Unidad) ? "ud" : linea.Unidad,
                cantidad: cantidad,
                precioUnitario: precioUnitario,
                fecha: r.Fecha.Date,
                proveedorId: resolvedProveedorId,
                numeroAlbaran: r.NumeroAlbaran,
                numeroFactura: r.NumeroFactura,
                observaciones: linea.Observaciones ?? r.Observaciones,
                lineaPartidaId: linea.LineaPartidaId,
                documentoAdjuntoUrl: r.DocumentoAdjuntoUrl,
                documentoHash: r.DocumentoHash,
                cifProveedor: r.ProveedorCif,
                porcentajeIva: pctIva,
                importeIva: importeIva,
                baseImponible: baseImponible);

            await _uow.MaterialesObra.AddAsync(material, ct);
            materialIds.Add(material.Id);
            totalImputado += material.ImporteReal;
        }

        // 5. Si proviene de un Ticket Pendiente, marcarlo como Aprobado
        if (r.TicketPendienteId.HasValue)
        {
            var ticket = await _uow.TicketsPendientes.GetByIdAsync(r.TicketPendienteId.Value, ct);
            if (ticket != null)
            {
                ticket.Aprobar(materialIds.FirstOrDefault(), _currentUser.UserName ?? "Sistema");
                _uow.TicketsPendientes.Update(ticket);
            }
        }

        // 6. Actualizar coste real de la obra y guardar cambios
        obra.ActualizarPresupuestoReal(totalImputado);
        await _uow.SaveChangesAsync(ct);


        // 6. Registrar en auditoría
        await _audit.LogAsync(
            accion: "FacturaImputada",
            entidad: "Obra",
            entidadId: obra.Id.ToString(),
            valoresAnteriores: null,
            valoresNuevos: new
            {
                NumeroFactura = r.NumeroFactura,
                NumeroAlbaran = r.NumeroAlbaran,
                Proveedor = resolvedProveedorNombre,
                LineasCount = r.Lineas.Count,
                TotalCosteImputado = totalImputado,
                DocumentoUrl = r.DocumentoAdjuntoUrl
            },
            ct: ct);

        // 7. Calcular nuevo coste real consolidado
        var nuevoCosteReal = await _uow.Obras.GetCosteRealAsync(obra.Id, ct);

        return new ImputarFacturaResultDto
        {
            Success = true,
            Mensaje = $"Se han imputado con éxito {materialIds.Count} materiales a la obra '{obra.Nombre}' por un importe total de {totalImputado:N2} €.",
            MaterialesCreados = materialIds.Count,
            TotalCosteImputado = totalImputado,
            NuevoCosteRealObra = nuevoCosteReal,
            ProveedorId = resolvedProveedorId,
            ProveedorNombre = resolvedProveedorNombre,
            MaterialIds = materialIds
        };
    }
}
