using MediatR;
using TareasObras.Application.Common.Interfaces;

namespace TareasObras.Application.Features.CategoriasOperario.Queries;

public record CategoriaOperarioDto
{
    public Guid Id { get; init; }
    public string Nombre { get; init; } = "";
    public decimal CosteHoraBase { get; init; }
    public bool Activo { get; init; }
    public int TotalOperarios { get; init; }
}

public record GetCategoriasOperarioQuery : IRequest<IEnumerable<CategoriaOperarioDto>>;

public class GetCategoriasOperarioHandler : IRequestHandler<GetCategoriasOperarioQuery, IEnumerable<CategoriaOperarioDto>>
{
    private readonly IUnitOfWork _uow;
    public GetCategoriasOperarioHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<CategoriaOperarioDto>> Handle(GetCategoriasOperarioQuery r, CancellationToken ct)
    {
        var cats = await _uow.CategoriasOperario.GetAllAsync(ct);
        return cats.Select(c => new CategoriaOperarioDto
        {
            Id = c.Id,
            Nombre = c.Nombre,
            CosteHoraBase = c.CosteHoraBase,
            Activo = c.Activo,
            TotalOperarios = c.Operarios?.Count ?? 0
        });
    }
}
