using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;

namespace TareasObras.Application.Features.Partidas.Queries;

public record LineaPartidaDto
{
    public Guid Id { get; init; }
    public string Tipo { get; init; } = "";
    public string Descripcion { get; init; } = "";
    public string Unidad { get; init; } = "";
    public decimal Cantidad { get; init; }
    public decimal PrecioUnitario { get; init; }
    public decimal Importe { get; init; }
    public Guid? CategoriaOperarioId { get; init; }
    public string? CategoriaNombre { get; init; }
}

public record PartidaDto
{
    public Guid Id { get; init; }
    public Guid PresupuestoId { get; init; }
    public string Nombre { get; init; } = "";
    public string? Descripcion { get; init; }
    public int Orden { get; init; }
    public decimal TotalMaterial { get; init; }
    public decimal TotalManoObra { get; init; }
    public decimal Total { get; init; }
    public List<LineaPartidaDto> Lineas { get; init; } = [];
}

public record GetPartidasByPresupuestoQuery(Guid PresupuestoId) : IRequest<IEnumerable<PartidaDto>>;

public class GetPartidasByPresupuestoHandler : IRequestHandler<GetPartidasByPresupuestoQuery, IEnumerable<PartidaDto>>
{
    private readonly IUnitOfWork _uow;
    public GetPartidasByPresupuestoHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<PartidaDto>> Handle(GetPartidasByPresupuestoQuery r, CancellationToken ct)
    {
        var partidas = await _uow.PartidasPresupuesto.GetByPresupuestoIdAsync(r.PresupuestoId, ct);
        return partidas.Select(p => new PartidaDto
        {
            Id = p.Id, PresupuestoId = p.PresupuestoId, Nombre = p.Nombre,
            Descripcion = p.Descripcion, Orden = p.Orden,
            TotalMaterial = p.TotalMaterial, TotalManoObra = p.TotalManoObra, Total = p.Total,
            Lineas = p.Lineas.Select(l => new LineaPartidaDto
            {
                Id = l.Id, Tipo = l.Tipo.ToString(), Descripcion = l.Descripcion,
                Unidad = l.Unidad, Cantidad = l.Cantidad, PrecioUnitario = l.PrecioUnitario,
                Importe = l.Importe, CategoriaOperarioId = l.CategoriaOperarioId,
                CategoriaNombre = l.CategoriaOperario?.Nombre
            }).ToList()
        });
    }
}
