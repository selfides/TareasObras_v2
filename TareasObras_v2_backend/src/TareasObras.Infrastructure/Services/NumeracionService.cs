using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;
using TareasObras.Domain.Enums;
using TareasObras.Infrastructure.Persistence;

namespace TareasObras.Infrastructure.Services;

/// <summary>
/// Numeración resiliente:
///  - El contador se incrementa con una única sentencia atómica (INSERT ... ON CONFLICT DO UPDATE ... RETURNING),
///    por lo que dos peticiones simultáneas nunca obtienen el mismo número.
///  - Los números consumidos no se reutilizan (aunque el registro se elimine).
///  - Si el código generado ya existe (p. ej. creado a mano antes de este sistema, o tras cambiar el formato),
///    se salta automáticamente al siguiente.
/// </summary>
public class NumeracionService : INumeracionService
{
    private const int MaxIntentos = 1000;
    private const int LongitudMaxCodigoObra = 20;

    public static readonly IReadOnlyDictionary<TipoNumeracion, ConfiguracionNumeracion> Defaults =
        new Dictionary<TipoNumeracion, ConfiguracionNumeracion>
        {
            [TipoNumeracion.Obra]        = new() { Tipo = TipoNumeracion.Obra,        Formato = "OBR-{yyyy}-{n}", Relleno = 4, ReinicioAnual = true },
            [TipoNumeracion.Presupuesto] = new() { Tipo = TipoNumeracion.Presupuesto, Formato = "PRE-{yyyy}-{n}", Relleno = 4, ReinicioAnual = true },
            [TipoNumeracion.Tarea]       = new() { Tipo = TipoNumeracion.Tarea,       Formato = "{obra}-T{n}",    Relleno = 3, ReinicioAnual = false },
        };

    private readonly AppDbContext _ctx;
    private readonly ICurrentUserService _currentUser;

    public NumeracionService(AppDbContext ctx, ICurrentUserService currentUser)
        => (_ctx, _currentUser) = (ctx, currentUser);

    // ─── API pública ──────────────────────────────────────────────────────

    public async Task<string> PrevisualizarAsync(TipoNumeracion tipo, Guid? ambitoId = null, CancellationToken ct = default)
    {
        var (config, clave, anio, codigoObra) = await PrepararAsync(tipo, ambitoId, ct);

        var actual = await _ctx.Secuencias.AsNoTracking()
            .Where(s => s.Clave == clave && s.Anio == anio)
            .Select(s => (int?)s.UltimoValor)
            .FirstOrDefaultAsync(ct) ?? 0;

        for (var n = actual + 1; n <= actual + MaxIntentos; n++)
        {
            var codigo = Formatear(config, n, anio, codigoObra);
            if (!await ExisteAsync(tipo, codigo, ct)) return codigo;
        }
        throw new InvalidOperationException($"No se ha encontrado un código libre para {tipo}. Revise el formato de numeración.");
    }

    public async Task<string> ReservarAsync(TipoNumeracion tipo, Guid? ambitoId = null, CancellationToken ct = default)
    {
        var (config, clave, anio, codigoObra) = await PrepararAsync(tipo, ambitoId, ct);

        for (var i = 0; i < MaxIntentos; i++)
        {
            var n = await IncrementarAsync(clave, anio, ct);
            var codigo = Formatear(config, n, anio, codigoObra);
            if (!await ExisteAsync(tipo, codigo, ct)) return codigo;
        }
        throw new InvalidOperationException($"No se ha encontrado un código libre para {tipo}. Revise el formato de numeración.");
    }

    public async Task<DisponibilidadCodigo> ComprobarAsync(TipoNumeracion tipo, string codigo, CancellationToken ct = default)
    {
        var normalizado = Normalizar(tipo, codigo);
        if (string.IsNullOrEmpty(normalizado))
            return new DisponibilidadCodigo(normalizado, false, null, null, null);

        switch (tipo)
        {
            case TipoNumeracion.Obra:
            {
                var obra = await _ctx.Obras.IgnoreQueryFilters().AsNoTracking()
                    .Where(o => o.Codigo == normalizado)
                    .Select(o => new { o.Id, o.Nombre, o.IsDeleted })
                    .FirstOrDefaultAsync(ct);
                return obra is null
                    ? new DisponibilidadCodigo(normalizado, true, null, null, null)
                    : new DisponibilidadCodigo(normalizado, false, obra.IsDeleted ? "Eliminada" : "Activa", obra.Id, obra.Nombre);
            }
            case TipoNumeracion.Presupuesto:
            {
                var p = await _ctx.Presupuestos.IgnoreQueryFilters().AsNoTracking()
                    .Where(x => x.Numero == normalizado)
                    .Select(x => new { x.Id, x.Descripcion, x.IsDeleted })
                    .FirstOrDefaultAsync(ct);
                return p is null
                    ? new DisponibilidadCodigo(normalizado, true, null, null, null)
                    : new DisponibilidadCodigo(normalizado, false, p.IsDeleted ? "Eliminada" : "Activa", p.Id, p.Descripcion);
            }
            default:
                // Las tareas aún no tienen campo Codigo (Fase 4).
                return new DisponibilidadCodigo(normalizado, true, null, null, null);
        }
    }

    public async Task<IReadOnlyList<ConfiguracionNumeracionDto>> GetConfiguracionesAsync(CancellationToken ct = default)
    {
        var enBd = await _ctx.ConfiguracionesNumeracion.AsNoTracking().ToListAsync(ct);
        var anio = DateTime.Now.Year;

        return Enum.GetValues<TipoNumeracion>()
            .Select(t => enBd.FirstOrDefault(c => c.Tipo == t) ?? Defaults[t])
            .Select(c => new ConfiguracionNumeracionDto(
                c.Tipo, c.Formato, c.Relleno, c.ReinicioAnual,
                Formatear(c, 1, anio, "OBR-2026-0001")))
            .ToList();
    }

    public async Task ActualizarConfiguracionAsync(TipoNumeracion tipo, string formato, int relleno, bool reinicioAnual, CancellationToken ct = default)
    {
        formato = (formato ?? string.Empty).Trim();
        var errores = new List<ValidationFailure>();

        if (!formato.Contains("{n}"))
            errores.Add(new ValidationFailure("formato", "El formato debe contener el token {n} (contador)."));
        if (relleno is < 1 or > 8)
            errores.Add(new ValidationFailure("relleno", "El relleno debe estar entre 1 y 8 cifras."));
        if (tipo == TipoNumeracion.Tarea && !formato.Contains("{obra}"))
            errores.Add(new ValidationFailure("formato", "El formato de tareas debe contener el token {obra}."));

        var ejemplo = Formatear(new ConfiguracionNumeracion { Formato = formato, Relleno = relleno }, 1, DateTime.Now.Year, "OBR-2026-0001");
        if (tipo == TipoNumeracion.Obra && ejemplo.Length > LongitudMaxCodigoObra)
            errores.Add(new ValidationFailure("formato", $"El código resultante ('{ejemplo}') supera {LongitudMaxCodigoObra} caracteres."));

        if (errores.Count > 0) throw new ValidationException(errores);

        var config = await _ctx.ConfiguracionesNumeracion.FirstOrDefaultAsync(c => c.Tipo == tipo, ct);
        if (config is null)
        {
            config = new ConfiguracionNumeracion { Tipo = tipo };
            _ctx.ConfiguracionesNumeracion.Add(config);
        }

        config.Formato = formato;
        config.Relleno = relleno;
        config.ReinicioAnual = reinicioAnual;
        config.UpdatedAt = DateTime.UtcNow;
        config.UpdatedBy = _currentUser.UserName;

        await _ctx.SaveChangesAsync(ct);
    }

    // ─── Internos ─────────────────────────────────────────────────────────

    private async Task<(ConfiguracionNumeracion config, string clave, int anio, string? codigoObra)> PrepararAsync(
        TipoNumeracion tipo, Guid? ambitoId, CancellationToken ct)
    {
        var config = await _ctx.ConfiguracionesNumeracion.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Tipo == tipo, ct) ?? Defaults[tipo];

        var anio = config.ReinicioAnual ? DateTime.Now.Year : 0;
        string? codigoObra = null;
        var clave = tipo.ToString();

        if (tipo == TipoNumeracion.Tarea)
        {
            if (ambitoId is null)
                throw new InvalidOperationException("La numeración de tareas requiere indicar la obra.");

            codigoObra = await _ctx.Obras.IgnoreQueryFilters().AsNoTracking()
                .Where(o => o.Id == ambitoId)
                .Select(o => o.Codigo)
                .FirstOrDefaultAsync(ct)
                ?? throw new KeyNotFoundException("Obra no encontrada.");

            clave = $"Tarea:{ambitoId}";
        }

        return (config, clave, anio, codigoObra);
    }

    private async Task<int> IncrementarAsync(string clave, int anio, CancellationToken ct)
    {
        // Sentencia atómica: crea el contador si no existe o lo incrementa. Segura ante concurrencia.
        var resultado = await _ctx.Database.SqlQuery<int>($"""
            INSERT INTO "Secuencias" ("Clave", "Anio", "UltimoValor")
            VALUES ({clave}, {anio}, 1)
            ON CONFLICT ("Clave", "Anio")
            DO UPDATE SET "UltimoValor" = "Secuencias"."UltimoValor" + 1
            RETURNING "UltimoValor" AS "Value"
            """).ToListAsync(ct);

        return resultado.Single();
    }

    private Task<bool> ExisteAsync(TipoNumeracion tipo, string codigo, CancellationToken ct) => tipo switch
    {
        TipoNumeracion.Obra        => _ctx.Obras.IgnoreQueryFilters().AnyAsync(o => o.Codigo == codigo, ct),
        TipoNumeracion.Presupuesto => _ctx.Presupuestos.IgnoreQueryFilters().AnyAsync(p => p.Numero == codigo, ct),
        _                          => Task.FromResult(false) // Tareas: sin campo Codigo hasta la Fase 4
    };

    private static string Normalizar(TipoNumeracion tipo, string? codigo)
    {
        var c = (codigo ?? string.Empty).Trim();
        return tipo == TipoNumeracion.Obra ? c.ToUpperInvariant() : c;
    }

    public static string Formatear(ConfiguracionNumeracion config, int valor, int anio, string? codigoObra)
    {
        var a = anio == 0 ? DateTime.Now.Year : anio;
        return config.Formato
            .Replace("{yyyy}", a.ToString("D4"))
            .Replace("{yy}", (a % 100).ToString("D2"))
            .Replace("{obra}", codigoObra ?? string.Empty)
            .Replace("{n}", valor.ToString().PadLeft(config.Relleno, '0'));
    }
}
