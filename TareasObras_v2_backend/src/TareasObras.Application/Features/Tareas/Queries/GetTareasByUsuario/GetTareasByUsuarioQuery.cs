using AutoMapper;
using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Application.Features.Tareas.Queries.GetTareasByObra;

namespace TareasObras.Application.Features.Tareas.Queries.GetTareasByUsuario
{
    public record GetTareasByUsuarioQuery(string UsuarioId) : IRequest<IEnumerable<TareaDto>>;

    public class GetTareasByUsuarioHandler : IRequestHandler<GetTareasByUsuarioQuery, IEnumerable<TareaDto>>
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public GetTareasByUsuarioHandler(IUnitOfWork uow, IMapper mapper)
            => (_uow, _mapper) = (uow, mapper);

        public async Task<IEnumerable<TareaDto>> Handle(GetTareasByUsuarioQuery request, CancellationToken ct)
        {
            var tareas = await _uow.Tareas.GetByUsuarioIdAsync(request.UsuarioId, ct);
            return _mapper.Map<IEnumerable<TareaDto>>(tareas);
        }
    }
}
