using TareasObras.Domain.Enums;
using TareasObras.Domain.Common;

namespace TareasObras.Domain.Entities;

public class Presupuesto : BaseEntity
{
    public Guid ObraId { get; private set; }
    public int Version { get; private set; }
    public DateTime Fecha { get; private set; }
    public string? Descripcion { get; private set; }
    public string? Numero { get; private set; }
    public EstadoPresupuesto Estado { get; private set; } = EstadoPresupuesto.Borrador;

    public Obra Obra { get; private set; } = null!;
    public ICollection<PartidaPresupuesto> Partidas { get; private set; } = new List<PartidaPresupuesto>();
    public ICollection<LineaPresupuestoMaterial> LineasMaterial { get; private set; } = new List<LineaPresupuestoMaterial>();
    public ICollection<LineaPresupuestoHoras> LineasHoras { get; private set; } = new List<LineaPresupuestoHoras>();

    private Presupuesto() { }

    public static Presupuesto Create(Guid obraId, string? numero, int version, DateTime fecha, string? descripcion)
    {
        return new Presupuesto
        {
            ObraId = obraId,
            Version = version,
            Fecha = fecha.Date,
            Descripcion = descripcion?.Trim(),
            Estado = EstadoPresupuesto.Borrador
        };
    }

    public void Aprobar() { Estado = EstadoPresupuesto.Aprobado; UpdatedAt = DateTime.UtcNow; }
    public void Anular()  { Estado = EstadoPresupuesto.Anulado;  UpdatedAt = DateTime.UtcNow; }

    public decimal TotalMaterial => LineasMaterial.Sum(l => l.ImporteEstimado);
    public decimal TotalHoras    => LineasHoras.Sum(l => l.ImporteEstimado);
    public decimal Total         => TotalMaterial + TotalHoras;
}

public class LineaPresupuestoMaterial : BaseEntity
{
    public Guid PresupuestoId { get; private set; }
    public string Descripcion { get; private set; } = string.Empty;
    public string Unidad { get; private set; } = string.Empty;
    public decimal Cantidad { get; private set; }
    public decimal PrecioUnitario { get; private set; }

    public Presupuesto Presupuesto { get; private set; } = null!;

    private LineaPresupuestoMaterial() { }

    public static LineaPresupuestoMaterial Create(Guid presupuestoId, string descripcion, string unidad, decimal cantidad, decimal precioUnitario)
    {
        return new LineaPresupuestoMaterial
        {
            PresupuestoId = presupuestoId,
            Descripcion = descripcion.Trim(),
            Unidad = unidad.Trim(),
            Cantidad = cantidad,
            PrecioUnitario = precioUnitario
        };
    }

    public void Update(string descripcion, string unidad, decimal cantidad, decimal precioUnitario)
    {
        Descripcion = descripcion.Trim();
        Unidad = unidad.Trim();
        Cantidad = cantidad;
        PrecioUnitario = precioUnitario;
        UpdatedAt = DateTime.UtcNow;
    }

    public decimal ImporteEstimado => Cantidad * PrecioUnitario;
}

public class LineaPresupuestoHoras : BaseEntity
{
    public Guid PresupuestoId { get; private set; }
    public Guid CategoriaOperarioId { get; private set; }
    public decimal HorasEstimadas { get; private set; }
    public decimal CosteHoraEstimado { get; private set; }

    public Presupuesto Presupuesto { get; private set; } = null!;
    public CategoriaOperario Categoria { get; private set; } = null!;

    private LineaPresupuestoHoras() { }

    public static LineaPresupuestoHoras Create(Guid presupuestoId, Guid categoriaOperarioId, decimal horasEstimadas, decimal costeHoraEstimado)
    {
        return new LineaPresupuestoHoras
        {
            PresupuestoId = presupuestoId,
            CategoriaOperarioId = categoriaOperarioId,
            HorasEstimadas = horasEstimadas,
            CosteHoraEstimado = costeHoraEstimado
        };
    }

    public void Update(decimal horasEstimadas, decimal costeHoraEstimado)
    {
        HorasEstimadas = horasEstimadas;
        CosteHoraEstimado = costeHoraEstimado;
        UpdatedAt = DateTime.UtcNow;
    }

    public decimal ImporteEstimado => HorasEstimadas * CosteHoraEstimado;
}

public class MaterialObra : BaseEntity
{
    public Guid ObraId { get; private set; }
    public Guid? ProveedorId { get; private set; }
    public string Descripcion { get; private set; } = string.Empty;
    public string Unidad { get; private set; } = string.Empty;
    public decimal Cantidad { get; private set; }
    public decimal PrecioUnitario { get; private set; }
    public DateTime Fecha { get; private set; }
    public string? NumeroAlbaran { get; private set; }
    public string? NumeroFactura { get; private set; }
    public string? Observaciones { get; private set; }

    public Obra Obra { get; private set; } = null!;
    public Proveedor? Proveedor { get; private set; }

    private MaterialObra() { }

    public static MaterialObra Create(Guid obraId, string descripcion, string unidad, decimal cantidad, decimal precioUnitario, DateTime fecha, Guid? proveedorId = null, string? numeroAlbaran = null, string? numeroFactura = null, string? observaciones = null)
    {
        return new MaterialObra
        {
            ObraId = obraId,
            ProveedorId = proveedorId,
            Descripcion = descripcion.Trim(),
            Unidad = unidad.Trim(),
            Cantidad = cantidad,
            PrecioUnitario = precioUnitario,
            Fecha = fecha.Date,
            NumeroAlbaran = numeroAlbaran?.Trim(),
            NumeroFactura = numeroFactura?.Trim(),
            Observaciones = observaciones?.Trim()
        };
    }

    public void Update(string descripcion, string unidad, decimal cantidad, decimal precioUnitario, DateTime fecha, Guid? proveedorId, string? numeroAlbaran, string? numeroFactura, string? observaciones)
    {
        Descripcion = descripcion.Trim();
        Unidad = unidad.Trim();
        Cantidad = cantidad;
        PrecioUnitario = precioUnitario;
        Fecha = fecha.Date;
        ProveedorId = proveedorId;
        NumeroAlbaran = numeroAlbaran?.Trim();
        NumeroFactura = numeroFactura?.Trim();
        Observaciones = observaciones?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public decimal ImporteReal => Cantidad * PrecioUnitario;
}
