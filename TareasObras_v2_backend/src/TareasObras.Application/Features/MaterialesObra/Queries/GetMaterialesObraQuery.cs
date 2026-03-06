using MediatR;
using TareasObras.Application.Common.Interfaces;

namespace TareasObras.Application.Features.MaterialesObra.Queries;

public record MaterialObraDto
{
    public Guid Id { get; init; }
    public Guid ObraId { get; init; }
    public string Descripcion { get; init; } = "";
    public string Unidad { get; init; } = "";
    public decimal Cantidad { get; init; }
    public decimal PrecioUnitario { get; init; }
    public decimal ImporteReal { get; init; }
    public DateTime Fecha { get; init; }
    public string? Observaciones { get; init; }
}

public record GetMaterialesByObraQuery(Guid ObraId) : IRequest<IEnumerable<MaterialObraDto>>;

public class GetMaterialesByObraHandler : IRequestHandler<GetMaterialesByObraQuery, IEnumerable<MaterialObraDto>>
{
    private readonly IUnitOfWork _uow;
    public GetMaterialesByObraHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<MaterialObraDto>> Handle(GetMaterialesByObraQuery r, CancellationToken ct)
    {
        var mats = await _uow.MaterialesObra.GetByObraIdAsync(r.ObraId, ct);
        return mats.Select(m => new MaterialObraDto
        {
            Id = m.Id, ObraId = m.ObraId, Descripcion = m.Descripcion,
            Unidad = m.Unidad, Cantidad = m.Cantidad, PrecioUnitario = m.PrecioUnitario,
            ImporteReal = m.ImporteReal, Fecha = m.Fecha, Observaciones = m.Observaciones
        });
    }
}
