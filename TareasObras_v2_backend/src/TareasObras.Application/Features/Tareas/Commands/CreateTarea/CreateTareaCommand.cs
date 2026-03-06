using FluentValidation;
using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;
using TareasObras.Domain.Enums;

namespace TareasObras.Application.Features.Tareas.Commands.CreateTarea
{
    public record CreateTareaCommand(
        Guid ObraId,
        string Titulo,
        string? Descripcion,
        PrioridadTarea Prioridad,
        DateTime? FechaLimite,
        decimal HorasEstimadas,
        Guid? CuadrillaId,
        Guid? UsuarioAsignadoId) : IRequest<Guid>;

    public class CreateTareaValidator : AbstractValidator<CreateTareaCommand>
    {
        public CreateTareaValidator()
        {
            RuleFor(x => x.ObraId).NotEmpty().WithMessage("La obra es obligatoria.");
            RuleFor(x => x.Titulo).NotEmpty().MaximumLength(300);
            RuleFor(x => x.HorasEstimadas).GreaterThanOrEqualTo(0);
        }
    }

    public class CreateTareaHandler : IRequestHandler<CreateTareaCommand, Guid>
    {
        private readonly IUnitOfWork _uow;
        private readonly IAuditService _audit;

        public CreateTareaHandler(IUnitOfWork uow, IAuditService audit)
            => (_uow, _audit) = (uow, audit);

        public async Task<Guid> Handle(CreateTareaCommand request, CancellationToken ct)
        {
            _ = await _uow.Obras.GetByIdAsync(request.ObraId, ct)
                ?? throw new KeyNotFoundException($"Obra {request.ObraId} no encontrada.");

            var tarea = Tarea.Create(
                request.ObraId,
                request.Titulo,
                request.Descripcion,
                request.Prioridad,
                request.FechaLimite,
                request.HorasEstimadas,
                request.CuadrillaId,
                request.UsuarioAsignadoId);

            await _uow.Tareas.AddAsync(tarea, ct);
            await _uow.SaveChangesAsync(ct);
            await _audit.LogAsync("CREATE", "Tarea", tarea.Id.ToString(),
                null, new { tarea.Titulo, tarea.ObraId }, ct);

            return tarea.Id;
        }
    }
}
