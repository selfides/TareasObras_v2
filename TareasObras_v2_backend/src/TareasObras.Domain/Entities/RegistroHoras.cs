using TareasObras.Domain.Common;

namespace TareasObras.Domain.Entities;

public class RegistroHoras : BaseEntity
{
    public Guid ObraId { get; private set; }
    public Guid OperarioId { get; private set; }
    public Guid CategoriaOperarioId { get; private set; }
    public Guid? TareaId { get; private set; }
    public DateTime Fecha { get; private set; }
    public TimeSpan HoraInicio { get; private set; }
    public TimeSpan HoraFin { get; private set; }
    public decimal Horas { get; private set; }
    public decimal CosteHoraAplicado { get; private set; }
    public string? Observaciones { get; private set; }

    // Control de presencia móvil y geolocalización
    public bool EnCurso { get; private set; } = false;
    public decimal? LatitudInicio { get; private set; }
    public decimal? LongitudInicio { get; private set; }
    public decimal? LatitudFin { get; private set; }
    public decimal? LongitudFin { get; private set; }
    public DateTime? TimestampInicioDispositivo { get; private set; }
    public DateTime? TimestampFinDispositivo { get; private set; }
    public bool SincronizadoOffline { get; private set; } = false;

    public Obra Obra { get; private set; } = null!;
    public Operario Operario { get; private set; } = null!;
    public CategoriaOperario Categoria { get; private set; } = null!;
    public Tarea? Tarea { get; private set; }

    private RegistroHoras() { }

    private static DateTime NormalizeUtcDate(DateTime value)
        => DateTime.SpecifyKind(value.Date, DateTimeKind.Utc);

    private static DateTime NormalizeUtcTimestamp(DateTime? value)
    {
        if (!value.HasValue)
            return DateTime.UtcNow;

        return value.Value.Kind switch
        {
            DateTimeKind.Utc => value.Value,
            DateTimeKind.Local => value.Value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value.Value, DateTimeKind.Utc)
        };
    }

    public static RegistroHoras IniciarFichaje(
        Guid obraId,
        Guid operarioId,
        Guid categoriaOperarioId,
        Guid? tareaId,
        DateTime fecha,
        TimeSpan horaInicio,
        decimal costeHoraAplicado,
        decimal? latitud = null,
        decimal? longitud = null,
        DateTime? timestampDispositivo = null,
        bool sincronizadoOffline = false,
        string? observaciones = null)
    {
        return new RegistroHoras
        {
            ObraId = obraId,
            OperarioId = operarioId,
            CategoriaOperarioId = categoriaOperarioId,
            TareaId = tareaId,
            Fecha = NormalizeUtcDate(fecha),
            HoraInicio = horaInicio,
            HoraFin = horaInicio,
            Horas = 0,
            CosteHoraAplicado = costeHoraAplicado,
            EnCurso = true,
            LatitudInicio = latitud,
            LongitudInicio = longitud,
            TimestampInicioDispositivo = NormalizeUtcTimestamp(timestampDispositivo),
            SincronizadoOffline = sincronizadoOffline,
            Observaciones = observaciones?.Trim()
        };
    }

    public void FinalizarFichaje(
        TimeSpan horaFin,
        decimal? latitud = null,
        decimal? longitud = null,
        DateTime? timestampDispositivo = null,
        string? observacionesAdicionales = null)
    {
        var endTimestampUtc = NormalizeUtcTimestamp(timestampDispositivo);
        TimeSpan duracion;
        if (horaFin >= HoraInicio)
        {
            duracion = horaFin - HoraInicio;
        }
        else if (endTimestampUtc.Date > Fecha.Date)
        {
            duracion = (TimeSpan.FromHours(24) - HoraInicio) + horaFin;
        }
        else
        {
            duracion = TimeSpan.Zero;
        }

        HoraFin = horaFin;
        Horas = Math.Max(0, Math.Round((decimal)duracion.TotalHours, 2));
        EnCurso = false;
        LatitudFin = latitud;
        LongitudFin = longitud;
        TimestampFinDispositivo = endTimestampUtc;
        if (!string.IsNullOrWhiteSpace(observacionesAdicionales))
        {
            Observaciones = string.IsNullOrWhiteSpace(Observaciones)
                ? observacionesAdicionales.Trim()
                : $"{Observaciones} | {observacionesAdicionales.Trim()}";
        }
        UpdatedAt = DateTime.UtcNow;
    }


    public static RegistroHoras Create(Guid obraId, Guid operarioId, Guid categoriaOperarioId, Guid? tareaId, DateTime fecha, TimeSpan horaInicio, TimeSpan horaFin, decimal costeHoraAplicado, string? observaciones = null)
    {
        return new RegistroHoras
        {
            ObraId = obraId,
            OperarioId = operarioId,
            CategoriaOperarioId = categoriaOperarioId,
            TareaId = tareaId,
            Fecha = NormalizeUtcDate(fecha),
            HoraInicio = horaInicio,
            HoraFin = horaFin,
            Horas = Math.Round((decimal)(horaFin - horaInicio).TotalHours, 2),
            CosteHoraAplicado = costeHoraAplicado,
            Observaciones = observaciones?.Trim()
        };
    }

    public void Update(Guid? tareaId, DateTime fecha, TimeSpan horaInicio, TimeSpan horaFin, decimal costeHoraAplicado, string? observaciones)
    {
        TareaId = tareaId;
        Fecha = NormalizeUtcDate(fecha);
        HoraInicio = horaInicio;
        HoraFin = horaFin;
        Horas = Math.Round((decimal)(horaFin - horaInicio).TotalHours, 2);
        CosteHoraAplicado = costeHoraAplicado;
        Observaciones = observaciones?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public decimal CosteTotal => Horas * CosteHoraAplicado;
}
