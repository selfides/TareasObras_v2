using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;

namespace TareasObras.Application.Features.Proveedores.Commands;

public record CreateProveedorCommand(string Nombre, string? CifNif, string? Direccion, string? Telefono, string? Email, string? Observaciones) : IRequest<Guid>;
public record UpdateProveedorCommand(Guid Id, string Nombre, string? CifNif, string? Direccion, string? Telefono, string? Email, string? Observaciones) : IRequest<bool>;
public record DeleteProveedorCommand(Guid Id) : IRequest<bool>;

public class CreateProveedorHandler : IRequestHandler<CreateProveedorCommand, Guid>
{
    private readonly IUnitOfWork _uow;
    public CreateProveedorHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<Guid> Handle(CreateProveedorCommand r, CancellationToken ct)
    {
        var proveedor = Proveedor.Create(r.Nombre, r.CifNif, r.Direccion, r.Telefono, r.Email, r.Observaciones);
        await _uow.Proveedores.AddAsync(proveedor, ct);
        await _uow.SaveChangesAsync(ct);
        return proveedor.Id;
    }
}

public class UpdateProveedorHandler : IRequestHandler<UpdateProveedorCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public UpdateProveedorHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(UpdateProveedorCommand r, CancellationToken ct)
    {
        var proveedor = await _uow.Proveedores.GetByIdAsync(r.Id, ct);
        if (proveedor is null) return false;
        proveedor.Update(r.Nombre, r.CifNif, r.Direccion, r.Telefono, r.Email, r.Observaciones);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

public class DeleteProveedorHandler : IRequestHandler<DeleteProveedorCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public DeleteProveedorHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(DeleteProveedorCommand r, CancellationToken ct)
    {
        var proveedor = await _uow.Proveedores.GetByIdAsync(r.Id, ct);
        if (proveedor is null) return false;
        _uow.Proveedores.Delete(proveedor);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}
