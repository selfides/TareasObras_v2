using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;

namespace TareasObras.Application.Features.Partidas.Commands;

public record CreatePartidaCommand(Guid PresupuestoId, string Nombre, string? Descripcion, int Orden) : IRequest<Guid>;
public record UpdatePartidaCommand(Guid Id, string Nombre, string? Descripcion, int Orden) : IRequest<bool>;
public record DeletePartidaCommand(Guid Id) : IRequest<bool>;
public record AddLineaMaterialCommand(Guid PartidaId, string Descripcion, string Unidad, decimal Cantidad, decimal PrecioUnitario) : IRequest<Guid>;
public record AddLineaManoObraCommand(Guid PartidaId, Guid CategoriaOperarioId, string Descripcion, string Unidad, decimal Cantidad, decimal PrecioUnitario) : IRequest<Guid>;
public record UpdateLineaPartidaCommand(Guid Id, string Descripcion, string Unidad, decimal Cantidad, decimal PrecioUnitario, Guid? CategoriaOperarioId) : IRequest<bool>;
public record DeleteLineaPartidaCommand(Guid Id) : IRequest<bool>;

public class CreatePartidaHandler : IRequestHandler<CreatePartidaCommand, Guid>
{
    private readonly IUnitOfWork _uow;
    public CreatePartidaHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<Guid> Handle(CreatePartidaCommand r, CancellationToken ct)
    {
        var partida = PartidaPresupuesto.Create(r.PresupuestoId, r.Nombre, r.Descripcion, r.Orden);
        await _uow.PartidasPresupuesto.AddAsync(partida, ct);
        await _uow.SaveChangesAsync(ct);
        return partida.Id;
    }
}

public class UpdatePartidaHandler : IRequestHandler<UpdatePartidaCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public UpdatePartidaHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(UpdatePartidaCommand r, CancellationToken ct)
    {
        var p = await _uow.PartidasPresupuesto.GetByIdAsync(r.Id, ct);
        if (p is null) return false;
        p.Update(r.Nombre, r.Descripcion, r.Orden);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

public class DeletePartidaHandler : IRequestHandler<DeletePartidaCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public DeletePartidaHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(DeletePartidaCommand r, CancellationToken ct)
    {
        var p = await _uow.PartidasPresupuesto.GetByIdAsync(r.Id, ct);
        if (p is null) return false;
        _uow.PartidasPresupuesto.Delete(p);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

public class AddLineaMaterialHandler : IRequestHandler<AddLineaMaterialCommand, Guid>
{
    private readonly IUnitOfWork _uow;
    public AddLineaMaterialHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<Guid> Handle(AddLineaMaterialCommand r, CancellationToken ct)
    {
        var linea = LineaPartida.CreateMaterial(r.PartidaId, r.Descripcion, r.Unidad, r.Cantidad, r.PrecioUnitario);
        await _uow.LineasPartida.AddAsync(linea, ct);
        await _uow.SaveChangesAsync(ct);
        return linea.Id;
    }
}

public class AddLineaManoObraHandler : IRequestHandler<AddLineaManoObraCommand, Guid>
{
    private readonly IUnitOfWork _uow;
    public AddLineaManoObraHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<Guid> Handle(AddLineaManoObraCommand r, CancellationToken ct)
    {
        var linea = LineaPartida.CreateManoObra(r.PartidaId, r.CategoriaOperarioId, r.Descripcion, r.Unidad, r.Cantidad, r.PrecioUnitario);
        await _uow.LineasPartida.AddAsync(linea, ct);
        await _uow.SaveChangesAsync(ct);
        return linea.Id;
    }
}

public class UpdateLineaPartidaHandler : IRequestHandler<UpdateLineaPartidaCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public UpdateLineaPartidaHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(UpdateLineaPartidaCommand r, CancellationToken ct)
    {
        var l = await _uow.LineasPartida.GetByIdAsync(r.Id, ct);
        if (l is null) return false;
        l.Update(r.Descripcion, r.Unidad, r.Cantidad, r.PrecioUnitario, r.CategoriaOperarioId);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

public class DeleteLineaPartidaHandler : IRequestHandler<DeleteLineaPartidaCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public DeleteLineaPartidaHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(DeleteLineaPartidaCommand r, CancellationToken ct)
    {
        var l = await _uow.LineasPartida.GetByIdAsync(r.Id, ct);
        if (l is null) return false;
        _uow.LineasPartida.Delete(l);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}
