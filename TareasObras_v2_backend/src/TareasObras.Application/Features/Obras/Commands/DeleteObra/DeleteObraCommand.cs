using MediatR;
using TareasObras.Application.Common.Interfaces;

namespace TareasObras.Application.Features.Obras.Commands.DeleteObra
{
    public record DeleteObraCommand(Guid Id) : IRequest<bool>;

    public class DeleteObraHandler : IRequestHandler<DeleteObraCommand, bool>
    {
        private readonly IUnitOfWork _uow;
        private readonly IAuditService _audit;

        public DeleteObraHandler(IUnitOfWork uow, IAuditService audit)
            => (_uow, _audit) = (uow, audit);

        public async Task<bool> Handle(DeleteObraCommand request, CancellationToken ct)
        {
            var obra = await _uow.Obras.GetByIdAsync(request.Id, ct);
            if (obra is null) return false;

            _uow.Obras.Delete(obra);
            await _uow.SaveChangesAsync(ct);
            await _audit.LogAsync("DELETE", "Obra", obra.Id.ToString(),
                new { obra.Nombre, obra.Codigo }, null, ct);

            return true;
        }
    }
}
