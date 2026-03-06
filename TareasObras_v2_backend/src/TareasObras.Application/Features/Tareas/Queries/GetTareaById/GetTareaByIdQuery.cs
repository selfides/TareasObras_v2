using AutoMapper;
using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Application.Features.Tareas.Queries.GetTareasByObra;

namespace TareasObras.Application.Features.Tareas.Queries.GetTareaById
{
    public record GetTareaByIdQuery(Guid Id) : IRequest<TareaDto?>;

    public class GetTareaByIdHandler : IRequestHandler<GetTareaByIdQuery, TareaDto?>
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public GetTareaByIdHandler(IUnitOfWork uow, IMapper mapper)
            => (_uow, _mapper) = (uow, mapper);

        public async Task<TareaDto?> Handle(GetTareaByIdQuery request, CancellationToken ct)
        {
            var tarea = await _uow.Tareas.GetByIdAsync(request.Id, ct);
            return tarea is null ? null : _mapper.Map<TareaDto>(tarea);
        }
    }
}
