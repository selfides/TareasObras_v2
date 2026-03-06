using MediatR;
using TareasObras.Application.Common.Interfaces;

namespace TareasObras.Application.Features.RegistroHoras.Commands;

public record CreateRegistroHorasCommand(Guid ObraId, Guid OperarioId, Guid CategoriaOperarioId, DateTime Fecha, decimal Horas, decimal CosteHoraAplicado, string? Observaciones) : IRequest<Guid>;
public record UpdateRegistroHorasCommand(Guid Id, DateTime Fecha, decimal Horas, decimal CosteHoraAplicado, string? Observaciones) : IRequest<bool>;
public record DeleteRegistroHorasCommand(Guid Id) : IRequest<bool>;

public class CreateRegistroHorasHandler : IRequestHandler<CreateRegistroHorasCommand, Guid>
{
    private readonly IUnitOfWork _uow;
    public CreateRegistroHorasHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<Guid> Handle(CreateRegistroHorasCommand r, CancellationToken ct)
    {
        var reg = Domain.Entities.RegistroHoras.Create(r.ObraId, r.OperarioId, r.CategoriaOperarioId, r.Fecha, r.Horas, r.CosteHoraAplicado, r.Observaciones);
        await _uow.RegistrosHoras.AddAsync(reg, ct);
        await _uow.SaveChangesAsync(ct);
        return reg.Id;
    }
}

public class UpdateRegistroHorasHandler : IRequestHandler<UpdateRegistroHorasCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public UpdateRegistroHorasHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(UpdateRegistroHorasCommand r, CancellationToken ct)
    {
        var reg = await _uow.RegistrosHoras.GetByIdAsync(r.Id, ct);
        if (reg is null) return false;
        reg.Update(r.Fecha, r.Horas, r.CosteHoraAplicado, r.Observaciones);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

public class DeleteRegistroHorasHandler : IRequestHandler<DeleteRegistroHorasCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public DeleteRegistroHorasHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(DeleteRegistroHorasCommand r, CancellationToken ct)
    {
        var reg = await _uow.RegistrosHoras.GetByIdAsync(r.Id, ct);
        if (reg is null) return false;
        _uow.RegistrosHoras.Delete(reg);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}