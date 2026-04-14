using AutoMapper;
using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Enums;

namespace TareasObras.Application.Features.Tareas.Queries.GetTareasByObra
{
    public record TareaDto
    {
        public Guid Id { get; init; }
        public Guid ObraId { get; init; }
        public string Titulo { get; init; } = "";
        public string? Descripcion { get; init; }
        public string EstadoNombre { get; init; } = "";
        public EstadoTarea Estado { get; init; }
        public string PrioridadNombre { get; init; } = "";
        public PrioridadTarea Prioridad { get; init; }
        public DateTime? FechaLimite { get; init; }
        public decimal HorasEstimadas { get; init; }
        public decimal HorasReales { get; init; }
        public Guid? CuadrillaId { get; init; }
        public Guid? UsuarioAsignadoId { get; init; }
        public string? Observaciones { get; init; }
        public Guid? LineaPartidaId { get; init; }
        public string? LineaPartidaDescripcion { get; init; }
        public DateTime CreatedAt { get; init; }
    }

    public record GetTareasByObraQuery(Guid ObraId) : IRequest<IEnumerable<TareaDto>>;

    public class GetTareasByObraHandler : IRequestHandler<GetTareasByObraQuery, IEnumerable<TareaDto>>
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public GetTareasByObraHandler(IUnitOfWork uow, IMapper mapper)
            => (_uow, _mapper) = (uow, mapper);

        public async Task<IEnumerable<TareaDto>> Handle(GetTareasByObraQuery request, CancellationToken ct)
        {
            var tareas = await _uow.Tareas.GetByObraIdAsync(request.ObraId, ct);
            return _mapper.Map<IEnumerable<TareaDto>>(tareas);
        }
    }
}
