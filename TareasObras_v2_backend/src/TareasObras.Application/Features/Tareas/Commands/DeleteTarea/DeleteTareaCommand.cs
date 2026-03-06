using MediatR;
using TareasObras.Application.Common.Interfaces;

namespace TareasObras.Application.Features.Tareas.Commands.DeleteTarea
{
    public record DeleteTareaCommand(Guid Id) : IRequest<bool>;

    public class DeleteTareaHandler : IRequestHandler<DeleteTareaCommand, bool>
    {
        private readonly IUnitOfWork _uow;
        private readonly IAuditService _audit;

        public DeleteTareaHandler(IUnitOfWork uow, IAuditService audit)
            => (_uow, _audit) = (uow, audit);

        public async Task<bool> Handle(DeleteTareaCommand request, CancellationToken ct)
        {
            var tarea = await _uow.Tareas.GetByIdAsync(request.Id, ct);
            if (tarea is null) return false;

            _uow.Tareas.Delete(tarea);
            await _uow.SaveChangesAsync(ct);
            await _audit.LogAsync("DELETE", "Tarea", tarea.Id.ToString(),
                new { tarea.Titulo, tarea.ObraId, Estado = tarea.Estado.ToString() }, null, ct);

            return true;
        }
    }
}
