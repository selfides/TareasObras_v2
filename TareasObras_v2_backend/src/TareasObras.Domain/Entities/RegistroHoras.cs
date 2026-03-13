using TareasObras.Domain.Common;

namespace TareasObras.Domain.Entities;

public class RegistroHoras : BaseEntity
{
    public Guid ObraId { get; private set; }
    public Guid OperarioId { get; private set; }
    public Guid CategoriaOperarioId { get; private set; }
    public Guid? TareaId { get; private set; }
    public DateTime Fecha { get; private set; }
    public decimal Horas { get; private set; }
    public decimal CosteHoraAplicado { get; private set; }
    public string? Observaciones { get; private set; }

    public Obra Obra { get; private set; } = null!;
    public Operario Operario { get; private set; } = null!;
    public CategoriaOperario Categoria { get; private set; } = null!;
    public Tarea? Tarea { get; private set; }

    private RegistroHoras() { }

    public static RegistroHoras Create(Guid obraId, Guid operarioId, Guid categoriaOperarioId, Guid? tareaId, DateTime fecha, decimal horas, decimal costeHoraAplicado, string? observaciones = null)
    {
        return new RegistroHoras
        {
            ObraId = obraId,
            OperarioId = operarioId,
            CategoriaOperarioId = categoriaOperarioId,
            TareaId = tareaId,
            Fecha = fecha.Date,
            Horas = horas,
            CosteHoraAplicado = costeHoraAplicado,
            Observaciones = observaciones?.Trim()
        };
    }

    public void Update(Guid? tareaId, DateTime fecha, decimal horas, decimal costeHoraAplicado, string? observaciones)
    {
        TareaId = tareaId;
        Fecha = fecha.Date;
        Horas = horas;
        CosteHoraAplicado = costeHoraAplicado;
        Observaciones = observaciones?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public decimal CosteTotal => Horas * CosteHoraAplicado;
}
