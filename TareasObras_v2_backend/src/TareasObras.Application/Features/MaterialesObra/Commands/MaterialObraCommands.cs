using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;

namespace TareasObras.Application.Features.MaterialesObra.Commands;

public record CreateMaterialObraCommand(Guid ObraId, string Descripcion, string Unidad, decimal Cantidad, decimal PrecioUnitario, DateTime Fecha, Guid? ProveedorId, string? NumeroAlbaran, string? NumeroFactura, string? Observaciones) : IRequest<Guid>;
public record UpdateMaterialObraCommand(Guid Id, string Descripcion, string Unidad, decimal Cantidad, decimal PrecioUnitario, DateTime Fecha, Guid? ProveedorId, string? NumeroAlbaran, string? NumeroFactura, string? Observaciones) : IRequest<bool>;
public record DeleteMaterialObraCommand(Guid Id) : IRequest<bool>;

public class CreateMaterialObraHandler : IRequestHandler<CreateMaterialObraCommand, Guid>
{
    private readonly IUnitOfWork _uow;
    public CreateMaterialObraHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<Guid> Handle(CreateMaterialObraCommand r, CancellationToken ct)
    {
        var mat = MaterialObra.Create(r.ObraId, r.Descripcion, r.Unidad, r.Cantidad, r.PrecioUnitario, r.Fecha, r.ProveedorId, r.NumeroAlbaran, r.NumeroFactura, r.Observaciones);
        await _uow.MaterialesObra.AddAsync(mat, ct);
        await _uow.SaveChangesAsync(ct);
        return mat.Id;
    }
}

public class UpdateMaterialObraHandler : IRequestHandler<UpdateMaterialObraCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public UpdateMaterialObraHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(UpdateMaterialObraCommand r, CancellationToken ct)
    {
        var mat = await _uow.MaterialesObra.GetByIdAsync(r.Id, ct);
        if (mat is null) return false;
        mat.Update(r.Descripcion, r.Unidad, r.Cantidad, r.PrecioUnitario, r.Fecha, r.ProveedorId, r.NumeroAlbaran, r.NumeroFactura, r.Observaciones);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

public class DeleteMaterialObraHandler : IRequestHandler<DeleteMaterialObraCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public DeleteMaterialObraHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(DeleteMaterialObraCommand r, CancellationToken ct)
    {
        var mat = await _uow.MaterialesObra.GetByIdAsync(r.Id, ct);
        if (mat is null) return false;
        _uow.MaterialesObra.Delete(mat);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}
