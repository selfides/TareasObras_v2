using MediatR;
using TareasObras.Application.Common.Interfaces;

namespace TareasObras.Application.Features.Obras.Commands.RestaurarObra;

public record RestaurarObraCommand(Guid Id) : IRequest<bool>;

public class RestaurarObraHandler : IRequestHandler<RestaurarObraCommand, bool>
{
    private readonly IUnitOfWork _uow;
    private readonly IAuditService _audit;

    public RestaurarObraHandler(IUnitOfWork uow, IAuditService audit)
        => (_uow, _audit) = (uow, audit);

    public async Task<bool> Handle(RestaurarObraCommand request, CancellationToken ct)
    {
        var obra = await _uow.Obras.GetByIdIncludingDeletedAsync(request.Id, ct);
        if (obra is null || !obra.IsDeleted) return false;

        obra.Restaurar();
        await _uow.SaveChangesAsync(ct);
        await _audit.LogAsync("RESTORE", "Obra", obra.Id.ToString(),
            new { obra.Nombre, obra.Codigo, IsDeleted = true },
            new { obra.Nombre, obra.Codigo, IsDeleted = false }, ct);

        return true;
    }
}
