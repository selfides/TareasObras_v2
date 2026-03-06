using AutoMapper;
using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Enums;

namespace TareasObras.Application.Features.Obras.Queries.GetObras
{
    public record ObraListDto
    {
        public Guid Id { get; init; }
        public string Codigo { get; init; } = "";
        public string Nombre { get; init; } = "";
        public string? Cliente { get; init; }
        public int Estado { get; init; }
        public decimal PresupuestoEstimado { get; init; }
        public DateTime FechaInicio { get; init; }
        public DateTime? FechaFinPrevista { get; init; }
        public int TotalTareas { get; init; }
        public int TareasPendientes { get; init; }
        public int TareasCompletadas { get; init; }
        public string EstadoNombre { get; init; } = "";
    }

    public record GetObrasQuery(string? Search = null, string? Estado = null)
        : IRequest<IEnumerable<ObraListDto>>;

    public class GetObrasHandler : IRequestHandler<GetObrasQuery, IEnumerable<ObraListDto>>
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public GetObrasHandler(IUnitOfWork uow, IMapper mapper)
            => (_uow, _mapper) = (uow, mapper);

        public async Task<IEnumerable<ObraListDto>> Handle(GetObrasQuery request, CancellationToken ct)
        {
            var obras = await _uow.Obras.GetFilteredAsync(request.Search, request.Estado, ct);
            return _mapper.Map<IEnumerable<ObraListDto>>(obras);
        }
    }
}
