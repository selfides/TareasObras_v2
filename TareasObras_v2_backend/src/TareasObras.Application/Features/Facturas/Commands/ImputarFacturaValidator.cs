using FluentValidation;

namespace TareasObras.Application.Features.Facturas.Commands;

public class ImputarFacturaValidator : AbstractValidator<ImputarFacturaCommand>
{
    public ImputarFacturaValidator()
    {
        RuleFor(x => x.ObraId)
            .NotEmpty().WithMessage("El ID de la obra es obligatorio.");

        RuleFor(x => x.Lineas)
            .NotNull().WithMessage("Debe incluir una lista de líneas.")
            .Must(l => l != null && l.Count > 0).WithMessage("Debe incluir al menos una línea de material.");

        RuleForEach(x => x.Lineas).ChildRules(linea =>
        {
            linea.RuleFor(l => l.Descripcion)
                .NotEmpty().WithMessage("La descripción del material es obligatoria.");

            linea.RuleFor(l => l.Cantidad)
                .GreaterThan(0).WithMessage("La cantidad debe ser mayor a cero.");

            linea.RuleFor(l => l.PrecioUnitario)
                .GreaterThanOrEqualTo(0).WithMessage("El precio unitario no puede ser negativo.");
        });
    }
}
