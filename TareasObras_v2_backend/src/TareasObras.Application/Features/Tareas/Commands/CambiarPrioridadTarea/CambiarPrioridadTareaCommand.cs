using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Enums;

namespace TareasObras.Application.Features.Tareas.Commands.CambiarPrioridadTarea
{
    public record CambiarPrioridadTareaCommand(Guid Id, PrioridadTarea NuevaPrioridad) : IRequest<bool>;

    public class CambiarPrioridadTareaHandler : IRequestHandler<CambiarPrioridadTareaCommand, bool>
    {
        private readonly IUnitOfWork _uow;
        private readonly IAuditService _audit;

        public CambiarPrioridadTareaHandler(IUnitOfWork uow, IAuditService audit)
            => (_uow, _audit) = (uow, audit);

        public async Task<bool> Handle(CambiarPrioridadTareaCommand request, CancellationToken ct)
        {
            var tarea = await _uow.Tareas.GetByIdAsync(request.Id, ct);
            if (tarea is null) return false;

            var prioridadAnterior = tarea.Prioridad;
            tarea.CambiarPrioridad(request.NuevaPrioridad);

            _uow.Tareas.Update(tarea);
            await _uow.SaveChangesAsync(ct);
            
            await _audit.LogAsync("PRIORIDAD_CHANGE", "Tarea", tarea.Id.ToString(),
                new { Prioridad = prioridadAnterior.ToString() },
                new { Prioridad = request.NuevaPrioridad.ToString() }, ct);

            return true;
        }
    }
}
