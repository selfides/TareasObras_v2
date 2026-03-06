using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;

namespace TareasObras.Application.Features.Operarios.Commands;

public record CreateOperarioCommand(string Nombre, string Apellidos, string? DNI, string? Telefono, Guid CategoriaOperarioId, Guid? CuadrillaId) : IRequest<Guid>;
public record UpdateOperarioCommand(Guid Id, string Nombre, string Apellidos, string? DNI, string? Telefono, Guid CategoriaOperarioId, Guid? CuadrillaId) : IRequest<bool>;
public record DeleteOperarioCommand(Guid Id) : IRequest<bool>;

public class CreateOperarioHandler : IRequestHandler<CreateOperarioCommand, Guid>
{
    private readonly IUnitOfWork _uow;
    public CreateOperarioHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<Guid> Handle(CreateOperarioCommand r, CancellationToken ct)
    {
        var op = Operario.Create(r.Nombre, r.Apellidos, r.DNI, r.Telefono, r.CategoriaOperarioId, r.CuadrillaId);
        await _uow.Operarios.AddAsync(op, ct);
        await _uow.SaveChangesAsync(ct);
        return op.Id;
    }
}

public class UpdateOperarioHandler : IRequestHandler<UpdateOperarioCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public UpdateOperarioHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(UpdateOperarioCommand r, CancellationToken ct)
    {
        var op = await _uow.Operarios.GetByIdAsync(r.Id, ct);
        if (op is null) return false;
        op.Update(r.Nombre, r.Apellidos, r.DNI, r.Telefono, r.CategoriaOperarioId, r.CuadrillaId);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

public class DeleteOperarioHandler : IRequestHandler<DeleteOperarioCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public DeleteOperarioHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(DeleteOperarioCommand r, CancellationToken ct)
    {
        var op = await _uow.Operarios.GetByIdAsync(r.Id, ct);
        if (op is null) return false;
        _uow.Operarios.Delete(op);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}
