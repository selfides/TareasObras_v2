using TareasObras.Domain.Common;

namespace TareasObras.Domain.Entities;

public class CategoriaOperario : BaseEntity
{
    public string Nombre { get; private set; } = string.Empty;
    public decimal CosteHoraBase { get; private set; }
    public bool Activo { get; private set; } = true;

    public ICollection<Operario> Operarios { get; private set; } = new List<Operario>();
    public ICollection<LineaPresupuestoHoras> LineasPresupuesto { get; private set; } = new List<LineaPresupuestoHoras>();
    public ICollection<RegistroHoras> RegistrosHoras { get; private set; } = new List<RegistroHoras>();

    private CategoriaOperario() { }

    public static CategoriaOperario Create(string nombre, decimal costeHoraBase)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(nombre);
        return new CategoriaOperario { Nombre = nombre.Trim(), CosteHoraBase = costeHoraBase, Activo = true };
    }

    public void Update(string nombre, decimal costeHoraBase)
    {
        Nombre = nombre.Trim();
        CosteHoraBase = costeHoraBase;
        UpdatedAt = DateTime.UtcNow;
    }
}

public class Operario : BaseEntity
{
    public string Nombre { get; private set; } = string.Empty;
    public string Apellidos { get; private set; } = string.Empty;
    public string? DNI { get; private set; }
    public string? Telefono { get; private set; }
    public bool Activo { get; private set; } = true;
    public Guid CategoriaOperarioId { get; private set; }
    public Guid? CuadrillaId { get; private set; }

    public CategoriaOperario Categoria { get; private set; } = null!;
    public Cuadrilla? Cuadrilla { get; private set; }
    public ICollection<RegistroHoras> RegistrosHoras { get; private set; } = new List<RegistroHoras>();

    private Operario() { }

    public static Operario Create(string nombre, string apellidos, string? dni, string? telefono, Guid categoriaOperarioId, Guid? cuadrillaId = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(nombre);
        return new Operario
        {
            Nombre = nombre.Trim(),
            Apellidos = apellidos.Trim(),
            DNI = dni?.Trim(),
            Telefono = telefono?.Trim(),
            CategoriaOperarioId = categoriaOperarioId,
            CuadrillaId = cuadrillaId,
            Activo = true
        };
    }

    public void Update(string nombre, string apellidos, string? dni, string? telefono, Guid categoriaOperarioId, Guid? cuadrillaId)
    {
        Nombre = nombre.Trim();
        Apellidos = apellidos.Trim();
        DNI = dni?.Trim();
        Telefono = telefono?.Trim();
        CategoriaOperarioId = categoriaOperarioId;
        CuadrillaId = cuadrillaId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Desactivar() { Activo = false; UpdatedAt = DateTime.UtcNow; }
    public void Activar()    { Activo = true;  UpdatedAt = DateTime.UtcNow; }
}
