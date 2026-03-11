using MediatR;
using TareasObras.Application.Common.Interfaces;

namespace TareasObras.Application.Features.Proveedores.Queries;

public record ProveedorDto
{
    public Guid Id { get; init; }
    public string Nombre { get; init; } = "";
    public string? CifNif { get; init; }
    public string? Direccion { get; init; }
    public string? Telefono { get; init; }
    public string? Email { get; init; }
    public string? Observaciones { get; init; }
}

public record GetAllProveedoresQuery() : IRequest<IEnumerable<ProveedorDto>>;

public class GetAllProveedoresHandler : IRequestHandler<GetAllProveedoresQuery, IEnumerable<ProveedorDto>>
{
    private readonly IUnitOfWork _uow;
    public GetAllProveedoresHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<ProveedorDto>> Handle(GetAllProveedoresQuery request, CancellationToken ct)
    {
        var proveedores = await _uow.Proveedores.GetAllAsync(ct);
        return proveedores.Select(p => new ProveedorDto
        {
            Id = p.Id,
            Nombre = p.Nombre,
            CifNif = p.CifNif,
            Direccion = p.Direccion,
            Telefono = p.Telefono,
            Email = p.Email,
            Observaciones = p.Observaciones
        });
    }
}
