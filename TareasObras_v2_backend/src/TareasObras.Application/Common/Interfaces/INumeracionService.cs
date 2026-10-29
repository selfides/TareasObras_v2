using TareasObras.Domain.Enums;

namespace TareasObras.Application.Common.Interfaces;

public interface INumeracionService
{
    /// <summary>Devuelve el próximo código libre SIN consumirlo (para sugerirlo en pantalla).</summary>
    Task<string> PrevisualizarAsync(TipoNumeracion tipo, Guid? ambitoId = null, CancellationToken ct = default);

    /// <summary>Consume y devuelve el siguiente código libre. Seguro ante concurrencia.</summary>
    Task<string> ReservarAsync(TipoNumeracion tipo, Guid? ambitoId = null, CancellationToken ct = default);

    /// <summary>Comprueba si un código ya está usado, incluyendo registros eliminados.</summary>
    Task<DisponibilidadCodigo> ComprobarAsync(TipoNumeracion tipo, string codigo, CancellationToken ct = default);

    Task<IReadOnlyList<ConfiguracionNumeracionDto>> GetConfiguracionesAsync(CancellationToken ct = default);
    Task ActualizarConfiguracionAsync(TipoNumeracion tipo, string formato, int relleno, bool reinicioAnual, CancellationToken ct = default);
}

public record DisponibilidadCodigo(
    string Codigo,
    bool Disponible,
    string? Motivo,        // null | "Activa" | "Eliminada"
    Guid? EntidadId,
    string? Nombre);

public record ConfiguracionNumeracionDto(
    TipoNumeracion Tipo,
    string Formato,
    int Relleno,
    bool ReinicioAnual,
    string Ejemplo);
