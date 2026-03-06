using MediatR;
using TareasObras.Application.Common.Interfaces;

namespace TareasObras.Application.Features.Operarios.Queries;

public record OperarioDto
{
    public Guid Id { get; init; }
    public string Nombre { get; init; } = "";
    public string Apellidos { get; init; } = "";
    public string NombreCompleto { get; init; } = "";
    public string? DNI { get; init; }
    public string? Telefono { get; init; }
    public bool Activo { get; init; }
    public Guid CategoriaOperarioId { get; init; }
    public string CategoriaNombre { get; init; } = "";
    public decimal CosteHoraBase { get; init; }
    public Guid? CuadrillaId { get; init; }
    public string? CuadrillaNombre { get; init; }
}

public record GetOperariosQuery(bool SoloActivos = true) : IRequest<IEnumerable<OperarioDto>>;

public class GetOperariosHandler : IRequestHandler<GetOperariosQuery, IEnumerable<OperarioDto>>
{
    private readonly IUnitOfWork _uow;
    public GetOperariosHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<OperarioDto>> Handle(GetOperariosQuery r, CancellationToken ct)
    {
        var ops = await _uow.Operarios.GetAllWithDetailsAsync(ct);
        if (r.SoloActivos) ops = ops.Where(o => o.Activo);
        return ops.Select(o => new OperarioDto
        {
            Id = o.Id,
            Nombre = o.Nombre,
            Apellidos = o.Apellidos,
            NombreCompleto = $"{o.Nombre} {o.Apellidos}",
            DNI = o.DNI,
            Telefono = o.Telefono,
            Activo = o.Activo,
            CategoriaOperarioId = o.CategoriaOperarioId,
            CategoriaNombre = o.Categoria?.Nombre ?? "",
            CosteHoraBase = o.Categoria?.CosteHoraBase ?? 0,
            CuadrillaId = o.CuadrillaId,
            CuadrillaNombre = o.Cuadrilla?.Nombre
        });
    }
}
