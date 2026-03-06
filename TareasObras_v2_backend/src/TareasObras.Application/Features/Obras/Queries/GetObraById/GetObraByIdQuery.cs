using AutoMapper;
using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Application.Features.Tareas.Queries.GetTareasByObra;
using TareasObras.Domain.Enums;

namespace TareasObras.Application.Features.Obras.Queries.GetObraById
{
    public record ObraDetailDto
    {
        public Guid Id { get; init; }
        public string Codigo { get; init; } = "";
        public string Nombre { get; init; } = "";
        public string? Descripcion { get; init; }
        public string? Cliente { get; init; }
        public string? Direccion { get; init; }
        public DateTime FechaInicio { get; init; }
        public DateTime? FechaFinPrevista { get; init; }
        public DateTime? FechaFinReal { get; init; }
        public string EstadoNombre { get; init; } = "";
        public EstadoObra Estado { get; init; }
        public decimal PresupuestoEstimado { get; init; }
        public decimal PresupuestoReal { get; init; }
        public DateTime CreatedAt { get; init; }
        public string? CreatedBy { get; init; }
        public IEnumerable<TareaDto> Tareas { get; init; } = [];
    }

    public record GetObraByIdQuery(Guid Id) : IRequest<ObraDetailDto?>;

    public class GetObraByIdHandler : IRequestHandler<GetObraByIdQuery, ObraDetailDto?>
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public GetObraByIdHandler(IUnitOfWork uow, IMapper mapper)
            => (_uow, _mapper) = (uow, mapper);

        public async Task<ObraDetailDto?> Handle(GetObraByIdQuery request, CancellationToken ct)
        {
            var obra = await _uow.Obras.GetByIdAsync(request.Id, ct);
            return obra is null ? null : _mapper.Map<ObraDetailDto>(obra);
        }
    }
}
