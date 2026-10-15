using MediatR;
using TareasObras.Application.Common.Interfaces;

namespace TareasObras.Application.Features.Facturas.Commands;

public class RechazarTicketPendienteCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Motivo { get; set; } = string.Empty;
}

public class RechazarTicketPendienteHandler : IRequestHandler<RechazarTicketPendienteCommand, bool>
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;
    private readonly IAuditService _audit;

    public RechazarTicketPendienteHandler(
        IUnitOfWork uow,
        ICurrentUserService currentUser,
        IAuditService audit)
    {
        _uow = uow;
        _currentUser = currentUser;
        _audit = audit;
    }

    public async Task<bool> Handle(RechazarTicketPendienteCommand request, CancellationToken ct)
    {
        var ticket = await _uow.TicketsPendientes.GetByIdAsync(request.Id, ct);
        if (ticket == null)
            return false;

        ticket.Rechazar(request.Motivo, _currentUser.UserName ?? "Sistema");
        _uow.TicketsPendientes.Update(ticket);
        await _uow.SaveChangesAsync(ct);

        await _audit.LogAsync(
            accion: "TicketPendienteRechazado",
            entidad: "TicketPendiente",
            entidadId: ticket.Id.ToString(),
            valoresAnteriores: null,
            valoresNuevos: new { Motivo = request.Motivo, Revisor = _currentUser.UserName },
            ct: ct);

        return true;
    }
}
