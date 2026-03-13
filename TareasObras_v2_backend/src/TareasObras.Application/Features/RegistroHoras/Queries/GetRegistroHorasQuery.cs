using MediatR;
using TareasObras.Application.Common.Interfaces;

namespace TareasObras.Application.Features.RegistroHoras.Queries;

public record RegistroHorasDto
{
    public Guid Id { get; init; }
    public Guid ObraId { get; init; }
    public Guid OperarioId { get; init; }
    public string OperarioNombre { get; init; } = "";
    public Guid CategoriaOperarioId { get; init; }
    public string CategoriaNombre { get; init; } = "";
    public DateTime Fecha { get; init; }
    public decimal Horas { get; init; }
    public decimal CosteHoraAplicado { get; init; }
    public decimal CosteTotal { get; init; }
    public Guid? TareaId { get; init; }
    public string? TareaTitulo { get; init; }
    public string? Observaciones { get; init; }
}

public record GetRegistroHorasByObraQuery(Guid ObraId) : IRequest<IEnumerable<RegistroHorasDto>>;

public class GetRegistroHorasByObraHandler : IRequestHandler<GetRegistroHorasByObraQuery, IEnumerable<RegistroHorasDto>>
{
    private readonly IUnitOfWork _uow;
    public GetRegistroHorasByObraHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<RegistroHorasDto>> Handle(GetRegistroHorasByObraQuery r, CancellationToken ct)
    {
        var regs = await _uow.RegistrosHoras.GetByObraIdAsync(r.ObraId, ct);
        return regs.Select(r => new RegistroHorasDto
        {
            Id = r.Id,
            ObraId = r.ObraId,
            OperarioId = r.OperarioId,
            OperarioNombre = $"{r.Operario?.Nombre} {r.Operario?.Apellidos}",
            CategoriaOperarioId = r.CategoriaOperarioId,
            CategoriaNombre = r.Categoria?.Nombre ?? "",
            Fecha = r.Fecha,
            Horas = r.Horas,
            CosteHoraAplicado = r.CosteHoraAplicado,
            CosteTotal = r.CosteTotal,
            TareaId = r.TareaId,
            TareaTitulo = r.Tarea?.Titulo,
            Observaciones = r.Observaciones
        });
    }
}
