using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Enums;

namespace TareasObras.Application.Features.Tareas.Commands.CambiarEstadoTarea
{
    public record CambiarEstadoTareaCommand(Guid Id, EstadoTarea NuevoEstado, string? Observaciones) : IRequest<bool>;

    public class CambiarEstadoTareaHandler : IRequestHandler<CambiarEstadoTareaCommand, bool>
    {
        private readonly IUnitOfWork _uow;
        private readonly IAuditService _audit;

        public CambiarEstadoTareaHandler(IUnitOfWork uow, IAuditService audit)
            => (_uow, _audit) = (uow, audit);

        public async Task<bool> Handle(CambiarEstadoTareaCommand request, CancellationToken ct)
        {
            var tarea = await _uow.Tareas.GetByIdAsync(request.Id, ct);
            if (tarea is null) return false;

            var estadoAnterior = tarea.Estado;
            tarea.CambiarEstado(request.NuevoEstado, request.Observaciones);

            _uow.Tareas.Update(tarea);
            await _uow.SaveChangesAsync(ct);
            await _audit.LogAsync("ESTADO_CHANGE", "Tarea", tarea.Id.ToString(),
                new { Estado = estadoAnterior.ToString() },
                new { Estado = request.NuevoEstado.ToString() }, ct);

            return true;
        }
    }
}
