using FluentValidation;
using MediatR;
using TareasObras.Application.Common.Interfaces;

namespace TareasObras.Application.Features.Obras.Commands.UpdateObra
{
    public record UpdateObraCommand(
        Guid Id,
        string Nombre,
        string? Descripcion,
        string? Direccion,
        string? Cliente,
        DateTime FechaInicio,
        DateTime? FechaFinPrevista,
        decimal PresupuestoEstimado) : IRequest<bool>;

    public class UpdateObraValidator : AbstractValidator<UpdateObraCommand>
    {
        public UpdateObraValidator()
        {
            RuleFor(x => x.Nombre).NotEmpty().MaximumLength(200);
            RuleFor(x => x.FechaInicio).NotEmpty();
            RuleFor(x => x.FechaFinPrevista)
                .GreaterThan(x => x.FechaInicio)
                .When(x => x.FechaFinPrevista.HasValue)
                .WithMessage("La fecha de fin debe ser posterior a la de inicio.");
            RuleFor(x => x.PresupuestoEstimado).GreaterThanOrEqualTo(0);
        }
    }

    public class UpdateObraHandler : IRequestHandler<UpdateObraCommand, bool>
    {
        private readonly IUnitOfWork _uow;
        private readonly IAuditService _audit;

        public UpdateObraHandler(IUnitOfWork uow, IAuditService audit)
            => (_uow, _audit) = (uow, audit);

        public async Task<bool> Handle(UpdateObraCommand request, CancellationToken ct)
        {
            var obra = await _uow.Obras.GetByIdAsync(request.Id, ct);
            if (obra is null) return false;

            var anterior = new { obra.Nombre, obra.Estado, obra.PresupuestoEstimado };

            obra.Update(request.Nombre, request.Descripcion, request.Direccion,
                        request.Cliente, request.FechaInicio, request.FechaFinPrevista,
                        request.PresupuestoEstimado);

            _uow.Obras.Update(obra);
            await _uow.SaveChangesAsync(ct);
            await _audit.LogAsync("UPDATE", "Obra", obra.Id.ToString(), anterior,
                new { obra.Nombre, obra.PresupuestoEstimado }, ct);

            return true;
        }
    }
}
