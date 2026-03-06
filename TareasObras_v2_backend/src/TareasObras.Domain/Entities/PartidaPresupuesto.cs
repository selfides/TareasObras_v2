namespace TareasObras.Domain.Entities;

public class PartidaPresupuesto
{
    public Guid Id { get; private set; }
    public Guid PresupuestoId { get; private set; }
    public string Nombre { get; private set; } = "";
    public string? Descripcion { get; private set; }
    public int Orden { get; private set; }
    public bool IsDeleted { get; private set; }

    public Presupuesto Presupuesto { get; private set; } = null!;
    public ICollection<LineaPartida> Lineas { get; private set; } = new List<LineaPartida>();

    public decimal TotalMaterial => Lineas.Where(l => !l.IsDeleted && l.Tipo == TipoLineaPartida.Material).Sum(l => l.Importe);
    public decimal TotalManoObra => Lineas.Where(l => !l.IsDeleted && l.Tipo == TipoLineaPartida.ManoObra).Sum(l => l.Importe);
    public decimal Total => TotalMaterial + TotalManoObra;

    private PartidaPresupuesto() { }

    public static PartidaPresupuesto Create(Guid presupuestoId, string nombre, string? descripcion, int orden)
        => new() { Id = Guid.NewGuid(), PresupuestoId = presupuestoId, Nombre = nombre, Descripcion = descripcion, Orden = orden };

    public void Update(string nombre, string? descripcion, int orden)
    {
        Nombre = nombre;
        Descripcion = descripcion;
        Orden = orden;
    }

    public void Delete() => IsDeleted = true;
}

public enum TipoLineaPartida { Material = 0, ManoObra = 1 }

public class LineaPartida
{
    public Guid Id { get; private set; }
    public Guid PartidaId { get; private set; }
    public TipoLineaPartida Tipo { get; private set; }
    public string Descripcion { get; private set; } = "";
    public string Unidad { get; private set; } = "";
    public decimal Cantidad { get; private set; }
    public decimal PrecioUnitario { get; private set; }
    public Guid? CategoriaOperarioId { get; private set; }
    public bool IsDeleted { get; private set; }

    public PartidaPresupuesto Partida { get; private set; } = null!;
    public CategoriaOperario? CategoriaOperario { get; private set; }

    public decimal Importe => Cantidad * PrecioUnitario;

    private LineaPartida() { }

    public static LineaPartida CreateMaterial(Guid partidaId, string descripcion, string unidad, decimal cantidad, decimal precioUnitario)
        => new() { Id = Guid.NewGuid(), PartidaId = partidaId, Tipo = TipoLineaPartida.Material,
                   Descripcion = descripcion, Unidad = unidad, Cantidad = cantidad, PrecioUnitario = precioUnitario };

    public static LineaPartida CreateManoObra(Guid partidaId, Guid categoriaOperarioId, string descripcion, string unidad, decimal cantidad, decimal precioUnitario)
        => new() { Id = Guid.NewGuid(), PartidaId = partidaId, Tipo = TipoLineaPartida.ManoObra,
                   Descripcion = descripcion, Unidad = unidad, Cantidad = cantidad, PrecioUnitario = precioUnitario,
                   CategoriaOperarioId = categoriaOperarioId };

    public void Update(string descripcion, string unidad, decimal cantidad, decimal precioUnitario, Guid? categoriaOperarioId)
    {
        Descripcion = descripcion; Unidad = unidad; Cantidad = cantidad;
        PrecioUnitario = precioUnitario; CategoriaOperarioId = categoriaOperarioId;
    }

    public void Delete() => IsDeleted = true;
}