using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;

namespace TareasObras.Application.Features.CategoriasOperario.Commands;

public record CreateCategoriaOperarioCommand(string Nombre, decimal CosteHoraBase) : IRequest<Guid>;
public record UpdateCategoriaOperarioCommand(Guid Id, string Nombre, decimal CosteHoraBase) : IRequest<bool>;
public record DeleteCategoriaOperarioCommand(Guid Id) : IRequest<bool>;

public class CreateCategoriaOperarioHandler : IRequestHandler<CreateCategoriaOperarioCommand, Guid>
{
    private readonly IUnitOfWork _uow;
    public CreateCategoriaOperarioHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<Guid> Handle(CreateCategoriaOperarioCommand r, CancellationToken ct)
    {
        var cat = CategoriaOperario.Create(r.Nombre, r.CosteHoraBase);
        await _uow.CategoriasOperario.AddAsync(cat, ct);
        await _uow.SaveChangesAsync(ct);
        return cat.Id;
    }
}

public class UpdateCategoriaOperarioHandler : IRequestHandler<UpdateCategoriaOperarioCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public UpdateCategoriaOperarioHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(UpdateCategoriaOperarioCommand r, CancellationToken ct)
    {
        var cat = await _uow.CategoriasOperario.GetByIdAsync(r.Id, ct);
        if (cat is null) return false;
        cat.Update(r.Nombre, r.CosteHoraBase);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

public class DeleteCategoriaOperarioHandler : IRequestHandler<DeleteCategoriaOperarioCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public DeleteCategoriaOperarioHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(DeleteCategoriaOperarioCommand r, CancellationToken ct)
    {
        var cat = await _uow.CategoriasOperario.GetByIdAsync(r.Id, ct);
        if (cat is null) return false;
        _uow.CategoriasOperario.Delete(cat);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}
