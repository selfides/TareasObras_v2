using FluentValidation;
using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Enums;

namespace TareasObras.Application.Features.Tareas.Commands.UpdateTarea
{
    public record UpdateTareaCommand(
        Guid Id,
        string Titulo,
        string? Descripcion,
        PrioridadTarea Prioridad,
        DateTime? FechaLimite,
        decimal HorasEstimadas,
        Guid? CuadrillaId,
        Guid? UsuarioAsignadoId) : IRequest<bool>;

    public class UpdateTareaValidator : AbstractValidator<UpdateTareaCommand>
    {
        public UpdateTareaValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Titulo).NotEmpty().MaximumLength(300);
            RuleFor(x => x.HorasEstimadas).GreaterThanOrEqualTo(0);
        }
    }

    public class UpdateTareaHandler : IRequestHandler<UpdateTareaCommand, bool>
    {
        private readonly IUnitOfWork _uow;

        public UpdateTareaHandler(IUnitOfWork uow) => _uow = uow;

        public async Task<bool> Handle(UpdateTareaCommand request, CancellationToken ct)
        {
            var tarea = await _uow.Tareas.GetByIdAsync(request.Id, ct);
            if (tarea is null) return false;

            tarea.Update(request.Titulo, request.Descripcion, request.Prioridad,
                         request.FechaLimite, request.HorasEstimadas,
                         request.CuadrillaId, request.UsuarioAsignadoId);

            _uow.Tareas.Update(tarea);
            await _uow.SaveChangesAsync(ct);
            return true;
        }
    }
}
