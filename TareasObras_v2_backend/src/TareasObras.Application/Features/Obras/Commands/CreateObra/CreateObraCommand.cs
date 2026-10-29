using FluentValidation;
using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;
using TareasObras.Domain.Enums;

namespace TareasObras.Application.Features.Obras.Commands.CreateObra
{
    public record CreateObraCommand(
        string? Codigo,
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
                .MaximumLength(20).WithMessage("El código no puede superar 20 caracteres.")
                .When(x => !string.IsNullOrWhiteSpace(x.Codigo));

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
        private readonly INumeracionService _numeracion;

        public CreateObraHandler(IUnitOfWork uow, IAuditService audit, INumeracionService numeracion)
            => (_uow, _audit, _numeracion) = (uow, audit, numeracion);

        public async Task<Guid> Handle(CreateObraCommand request, CancellationToken ct)
        {
            string codigoFinal;

            if (string.IsNullOrWhiteSpace(request.Codigo) || request.Codigo.Trim().Equals("AUTO", StringComparison.OrdinalIgnoreCase))
            {
                codigoFinal = await _numeracion.ReservarAsync(TipoNumeracion.Obra, null, ct);
            }
            else
            {
                var normalizado = request.Codigo.Trim().ToUpperInvariant();
                var disp = await _numeracion.ComprobarAsync(TipoNumeracion.Obra, normalizado, ct);
                if (!disp.Disponible)
                {
                    if (disp.Motivo == "Eliminada")
                    {
                        throw new InvalidOperationException($"El código '{normalizado}' pertenece a la obra eliminada '{disp.Nombre}'. Puede restaurarla (Id: {disp.EntidadId}) o usar un código diferente.");
                    }
                    throw new InvalidOperationException($"Ya existe una obra con el código '{normalizado}'.");
                }
                codigoFinal = normalizado;
            }

            var obra = Obra.Create(
                codigoFinal,
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
