using TareasObras.Domain.Enums;

namespace TareasObras.Domain.Entities;

/// <summary>
/// Formato de numeración configurable por tipo de documento.
/// Tokens soportados en <see cref="Formato"/>:
///   {yyyy} año con 4 cifras · {yy} año con 2 cifras · {n} contador (relleno con <see cref="Relleno"/> ceros)
///   {obra} código de la obra (solo para numeraciones con ámbito de obra, p. ej. Tareas)
/// </summary>
public class ConfiguracionNumeracion
{
    public TipoNumeracion Tipo { get; set; }
    public string Formato { get; set; } = string.Empty;
    public int Relleno { get; set; } = 4;
    public bool ReinicioAnual { get; set; } = true;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}

/// <summary>
/// Contador atómico. Nunca se decrementa: los números consumidos no se reutilizan,
/// aunque el registro asociado se elimine.
/// </summary>
public class Secuencia
{
    /// <summary>Ej.: "Obra", "Presupuesto", "Tarea:{obraId}"</summary>
    public string Clave { get; set; } = string.Empty;
    /// <summary>Año del contador, o 0 si no reinicia anualmente.</summary>
    public int Anio { get; set; }
    public int UltimoValor { get; set; }
}
