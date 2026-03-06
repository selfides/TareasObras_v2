using TareasObras.Domain.Common;

namespace TareasObras.Domain.Entities;

public class Cuadrilla : BaseEntity
{
    public string Nombre { get; private set; } = string.Empty;
    public Guid? ResponsableId { get; private set; }

    public ICollection<Tarea> Tareas { get; private set; } = new List<Tarea>();
    public ICollection<Operario> Operarios { get; private set; } = new List<Operario>();

    private Cuadrilla() { }

    public static Cuadrilla Create(string nombre, Guid? responsableId = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(nombre);
        return new Cuadrilla { Nombre = nombre.Trim(), ResponsableId = responsableId };
    }

    public void Update(string nombre, Guid? responsableId)
    {
        Nombre = nombre.Trim();
        ResponsableId = responsableId;
        UpdatedAt = DateTime.UtcNow;
    }
}

public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UsuarioId { get; set; } = string.Empty;
    public string UsuarioNombre { get; set; } = string.Empty;
    public string Accion { get; set; } = string.Empty;
    public string Entidad { get; set; } = string.Empty;
    public string? EntidadId { get; set; }
    public string? ValoresAnteriores { get; set; }
    public string? ValoresNuevos { get; set; }
    public DateTime FechaHora { get; set; } = DateTime.UtcNow;
    public string? IpAddress { get; set; }
}
