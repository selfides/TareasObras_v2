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

    public void Update(string? numero, DateTime fecha, string? descripcion)
    {
        Numero = numero?.Trim();
        Fecha = fecha.Date;
        Descripcion = descripcion?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public decimal TotalMaterial => (Partidas?.Where(p => !p.IsDeleted).Sum(p => p.TotalMaterial) ?? 0) + (LineasMaterial?.Sum(l => l.ImporteEstimado) ?? 0);
    public decimal TotalHoras    => (Partidas?.Where(p => !p.IsDeleted).Sum(p => p.TotalManoObra) ?? 0) + (LineasHoras?.Sum(l => l.ImporteEstimado) ?? 0);
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
    public Guid? LineaPartidaId { get; private set; }
    public string Descripcion { get; private set; } = string.Empty;
    public string Unidad { get; private set; } = string.Empty;
    public decimal Cantidad { get; private set; }
    public decimal PrecioUnitario { get; private set; }
    public DateTime Fecha { get; private set; }
    public string? NumeroAlbaran { get; private set; }
    public string? NumeroFactura { get; private set; }
    public string? Observaciones { get; private set; }

    // Campos de Justificante / Factura / Ticket
    public string? DocumentoAdjuntoUrl { get; private set; }
    public string? DocumentoHash { get; private set; }
    public string? CifProveedor { get; private set; }
    public decimal? PorcentajeIva { get; private set; }
    public decimal? ImporteIva { get; private set; }
    public decimal? BaseImponible { get; private set; }

    public Obra Obra { get; private set; } = null!;
    public Proveedor? Proveedor { get; private set; }
    public LineaPartida? LineaPartida { get; private set; }

    private MaterialObra() { }

    public static MaterialObra Create(
        Guid obraId,
        string descripcion,
        string unidad,
        decimal cantidad,
        decimal precioUnitario,
        DateTime fecha,
        Guid? proveedorId = null,
        string? numeroAlbaran = null,
        string? numeroFactura = null,
        string? observaciones = null,
        Guid? lineaPartidaId = null,
        string? documentoAdjuntoUrl = null,
        string? documentoHash = null,
        string? cifProveedor = null,
        decimal? porcentajeIva = null,
        decimal? importeIva = null,
        decimal? baseImponible = null)
    {
        return new MaterialObra
        {
            ObraId = obraId,
            ProveedorId = proveedorId,
            LineaPartidaId = lineaPartidaId,
            Descripcion = descripcion.Trim(),
            Unidad = unidad.Trim(),
            Cantidad = cantidad,
            PrecioUnitario = precioUnitario,
            Fecha = fecha.Date,
            NumeroAlbaran = numeroAlbaran?.Trim(),
            NumeroFactura = numeroFactura?.Trim(),
            Observaciones = observaciones?.Trim(),
            DocumentoAdjuntoUrl = documentoAdjuntoUrl?.Trim(),
            DocumentoHash = documentoHash?.Trim(),
            CifProveedor = cifProveedor?.Trim(),
            PorcentajeIva = porcentajeIva,
            ImporteIva = importeIva,
            BaseImponible = baseImponible
        };
    }

    public void Update(
        string descripcion,
        string unidad,
        decimal cantidad,
        decimal precioUnitario,
        DateTime fecha,
        Guid? proveedorId,
        string? numeroAlbaran,
        string? numeroFactura,
        string? observaciones,
        Guid? lineaPartidaId,
        string? documentoAdjuntoUrl = null,
        string? documentoHash = null,
        string? cifProveedor = null,
        decimal? porcentajeIva = null,
        decimal? importeIva = null,
        decimal? baseImponible = null)
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
        LineaPartidaId = lineaPartidaId;
        if (documentoAdjuntoUrl != null) DocumentoAdjuntoUrl = documentoAdjuntoUrl.Trim();
        if (documentoHash != null) DocumentoHash = documentoHash.Trim();
        if (cifProveedor != null) CifProveedor = cifProveedor.Trim();
        if (porcentajeIva.HasValue) PorcentajeIva = porcentajeIva;
        if (importeIva.HasValue) ImporteIva = importeIva;
        if (baseImponible.HasValue) BaseImponible = baseImponible;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetDocumento(string? url, string? hash)
    {
        DocumentoAdjuntoUrl = url?.Trim();
        DocumentoHash = hash?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetDatosFiscales(string? cifProveedor, decimal? porcentajeIva, decimal? importeIva, decimal? baseImponible)
    {
        CifProveedor = cifProveedor?.Trim();
        PorcentajeIva = porcentajeIva;
        ImporteIva = importeIva;
        BaseImponible = baseImponible;
        UpdatedAt = DateTime.UtcNow;
    }

    public decimal ImporteReal => Cantidad * PrecioUnitario;
}
