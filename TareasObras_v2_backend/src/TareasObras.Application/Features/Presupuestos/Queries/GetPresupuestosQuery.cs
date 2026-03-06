using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Enums;

namespace TareasObras.Application.Features.Presupuestos.Queries;

public record LineaMaterialDto
{
    public Guid Id { get; init; }
    public string Descripcion { get; init; } = "";
    public string Unidad { get; init; } = "";
    public decimal Cantidad { get; init; }
    public decimal PrecioUnitario { get; init; }
    public decimal ImporteEstimado { get; init; }
}

public record LineaHorasDto
{
    public Guid Id { get; init; }
    public Guid CategoriaOperarioId { get; init; }
    public string CategoriaNombre { get; init; } = "";
    public decimal HorasEstimadas { get; init; }
    public decimal CosteHoraEstimado { get; init; }
    public decimal ImporteEstimado { get; init; }
}

public record PresupuestoDto
{
    public Guid Id { get; init; }
    public Guid ObraId { get; init; }
    public int Version { get; init; }
    public DateTime Fecha { get; init; }
    public string? Descripcion { get; init; }
    public string? Numero { get; init; }
    public string EstadoNombre { get; init; } = "";
    public bool EsAprobado { get; init; }
    public decimal TotalMaterial { get; init; }
    public decimal TotalHoras { get; init; }
    public decimal Total { get; init; }
    public List<LineaMaterialDto> LineasMaterial { get; init; } = [];
    public List<LineaHorasDto> LineasHoras { get; init; } = [];
}

public record GetPresupuestosByObraQuery(Guid ObraId) : IRequest<IEnumerable<PresupuestoDto>>;
public record GetPresupuestoByIdQuery(Guid Id) : IRequest<PresupuestoDto?>;

public class GetPresupuestosByObraHandler : IRequestHandler<GetPresupuestosByObraQuery, IEnumerable<PresupuestoDto>>
{
    private readonly IUnitOfWork _uow;
    public GetPresupuestosByObraHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<PresupuestoDto>> Handle(GetPresupuestosByObraQuery r, CancellationToken ct)
    {
        var presupuestos = await _uow.Presupuestos.GetByObraIdAsync(r.ObraId, ct);
        return presupuestos.Select(PresupuestoDtoMapper.MapToDto);
    }
}

public class GetPresupuestoByIdHandler : IRequestHandler<GetPresupuestoByIdQuery, PresupuestoDto?>
{
    private readonly IUnitOfWork _uow;
    public GetPresupuestoByIdHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<PresupuestoDto?> Handle(GetPresupuestoByIdQuery r, CancellationToken ct)
    {
        var p = await _uow.Presupuestos.GetByIdWithLinesAsync(r.Id, ct);
        return p is null ? null : PresupuestoDtoMapper.MapToDto(p);
    }
}

internal static class PresupuestoDtoMapper
{
    public static PresupuestoDto MapToDto(TareasObras.Domain.Entities.Presupuesto p) => new()
    {
        Id = p.Id,
        ObraId = p.ObraId,
        Version = p.Version,
        Fecha = p.Fecha,
        Descripcion = p.Descripcion,
        EstadoNombre = p.Estado.ToString(),
        EsAprobado = p.Estado == EstadoPresupuesto.Aprobado,
        TotalMaterial = p.LineasMaterial?.Sum(l => l.ImporteEstimado) ?? 0,
        TotalHoras = p.LineasHoras?.Sum(l => l.ImporteEstimado) ?? 0,
        Total = (p.LineasMaterial?.Sum(l => l.ImporteEstimado) ?? 0) + (p.LineasHoras?.Sum(l => l.ImporteEstimado) ?? 0),
        LineasMaterial = p.LineasMaterial?.Select(l => new LineaMaterialDto
        {
            Id = l.Id, Descripcion = l.Descripcion, Unidad = l.Unidad,
            Cantidad = l.Cantidad, PrecioUnitario = l.PrecioUnitario, ImporteEstimado = l.ImporteEstimado
        }).ToList() ?? [],
        LineasHoras = p.LineasHoras?.Select(l => new LineaHorasDto
        {
            Id = l.Id, CategoriaOperarioId = l.CategoriaOperarioId,
            CategoriaNombre = l.Categoria?.Nombre ?? "",
            HorasEstimadas = l.HorasEstimadas, CosteHoraEstimado = l.CosteHoraEstimado,
            ImporteEstimado = l.ImporteEstimado
        }).ToList() ?? []
    };
}