using FluentValidation;
using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;

namespace TareasObras.Application.Features.Obras.Commands.CreateObra
{
    public record CreateObraCommand(
        string Codigo,
        string Nombre,
        string? Descripcion,
        string? Direccion,
        string? Cliente,
        DateTime FechaInicio,
        DateTime? FechaFinPrevista,
        decimal PresupuestoEstimado) : IRequest<Guid>;

    public class CreateObraValidator : AbstractValidator<CreateObraCommand>
    {
        public CreateObraValidator()
        {
            RuleFor(x => x.Codigo)
                .NotEmpty().WithMessage("El código es obligatorio.")
                .MaximumLength(20).WithMessage("El código no puede superar 20 caracteres.");

            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(200).WithMessage("El nombre no puede superar 200 caracteres.");

            RuleFor(x => x.FechaInicio)
                .NotEmpty().WithMessage("La fecha de inicio es obligatoria.");

            RuleFor(x => x.FechaFinPrevista)
                .GreaterThan(x => x.FechaInicio)
                .When(x => x.FechaFinPrevista.HasValue)
                .WithMessage("La fecha de fin debe ser posterior a la de inicio.");

            RuleFor(x => x.PresupuestoEstimado)
                .GreaterThanOrEqualTo(0).WithMessage("El presupuesto no puede ser negativo.");
        }
    }

    public class CreateObraHandler : IRequestHandler<CreateObraCommand, Guid>
    {
        private readonly IUnitOfWork _uow;
        private readonly IAuditService _audit;

        public CreateObraHandler(IUnitOfWork uow, IAuditService audit)
            => (_uow, _audit) = (uow, audit);

        public async Task<Guid> Handle(CreateObraCommand request, CancellationToken ct)
        {
            var existing = await _uow.Obras.GetByCodigoAsync(request.Codigo, ct);
            if (existing is not null)
                throw new InvalidOperationException($"Ya existe una obra con el código '{request.Codigo}'.");

            var obra = Obra.Create(
                request.Codigo,
                request.Nombre,
                request.Descripcion,
                request.Direccion,
                request.Cliente,
                request.FechaInicio,
                request.FechaFinPrevista,
                request.PresupuestoEstimado);

            await _uow.Obras.AddAsync(obra, ct);
            await _uow.SaveChangesAsync(ct);
            await _audit.LogAsync("CREATE", "Obra", obra.Id.ToString(),
                null, new { obra.Codigo, obra.Nombre }, ct);

            return obra.Id;
        }
    }
}
