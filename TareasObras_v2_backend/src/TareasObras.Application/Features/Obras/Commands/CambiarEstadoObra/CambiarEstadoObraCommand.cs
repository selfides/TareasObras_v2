using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Enums;

namespace TareasObras.Application.Features.Obras.Commands.CambiarEstadoObra
{
    public record CambiarEstadoObraCommand(Guid Id, EstadoObra NuevoEstado) : IRequest<bool>;

    public class CambiarEstadoObraHandler : IRequestHandler<CambiarEstadoObraCommand, bool>
    {
        private readonly IUnitOfWork _uow;
        private readonly IAuditService _audit;

        public CambiarEstadoObraHandler(IUnitOfWork uow, IAuditService audit)
            => (_uow, _audit) = (uow, audit);

        public async Task<bool> Handle(CambiarEstadoObraCommand request, CancellationToken ct)
        {
            var obra = await _uow.Obras.GetByIdAsync(request.Id, ct);
            if (obra is null) return false;

            var estadoAnterior = obra.Estado;
            obra.CambiarEstado(request.NuevoEstado);

            _uow.Obras.Update(obra);
            await _uow.SaveChangesAsync(ct);
            await _audit.LogAsync("ESTADO_CHANGE", "Obra", obra.Id.ToString(),
                new { Estado = estadoAnterior.ToString() },
                new { Estado = request.NuevoEstado.ToString() }, ct);

            return true;
        }
    }
}
