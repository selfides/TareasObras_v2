using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Features.Tareas.Commands.CambiarEstadoTarea;
using TareasObras.Application.Features.Tareas.Commands.CreateTarea;
using TareasObras.Application.Features.Tareas.Commands.DeleteTarea;
using TareasObras.Application.Features.Tareas.Commands.UpdateTarea;
using TareasObras.Application.Features.Tareas.Queries.GetTareaById;
using TareasObras.Application.Features.Tareas.Queries.GetTareasByObra;
using TareasObras.Application.Features.Tareas.Queries.GetTareasByUsuario;
using TareasObras.Domain.Enums;

namespace TareasObras.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TareasController : ControllerBase
    {
        private readonly IMediator _mediator;
        public TareasController(IMediator mediator) => _mediator = mediator;

        /// <summary>Obtener tareas asignadas al usuario autenticado</summary>
        [HttpGet("mis-tareas")]
        public async Task<IActionResult> GetMisTareas(CancellationToken ct)
        {
            var usuarioId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (usuarioId is null) return Unauthorized();

            var result = await _mediator.Send(new GetTareasByUsuarioQuery(usuarioId), ct);
            return Ok(result);
        }

        /// <summary>Obtener todas las tareas (opcionalmente filtradas por fecha)</summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] DateTime? fecha, CancellationToken ct)
        {
            IEnumerable<Domain.Entities.Tarea> tareas;
            if (fecha.HasValue)
            {
                var uow = HttpContext.RequestServices.GetRequiredService<TareasObras.Application.Common.Interfaces.IUnitOfWork>();
                tareas = await uow.Tareas.GetByFechaAsync(fecha.Value, ct);
            }
            else
            {
                var uow = HttpContext.RequestServices.GetRequiredService<TareasObras.Application.Common.Interfaces.IUnitOfWork>();
                tareas = await uow.Tareas.GetAllAsync(ct);
            }
            var mapper = HttpContext.RequestServices.GetRequiredService<AutoMapper.IMapper>();
            var result = tareas.Select(t => new {
                id = t.Id, obraId = t.ObraId,
                obraNombre = t.Obra?.Nombre ?? "",
                obraCodigo = t.Obra?.Codigo ?? "",
                titulo = t.Titulo, descripcion = t.Descripcion,
                estadoNombre = t.Estado.ToString(), estado = t.Estado,
                prioridadNombre = t.Prioridad.ToString(), prioridad = t.Prioridad,
                fechaLimite = t.FechaLimite, horasEstimadas = t.HorasEstimadas,
                horasReales = t.HorasReales, cuadrillaId = t.CuadrillaId,
                usuarioAsignadoId = t.UsuarioAsignadoId, observaciones = t.Observaciones,
                createdAt = t.CreatedAt
            });
            return Ok(result);
        }

        /// <summary>Obtener tareas de una obra</summary>
        [HttpGet("obra/{obraId:guid}")]
        public async Task<IActionResult> GetByObra(Guid obraId, CancellationToken ct)
        {
            var result = await _mediator.Send(new GetTareasByObraQuery(obraId), ct);
            return Ok(result);
        }

        /// <summary>Obtener tarea por ID</summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        {
            var result = await _mediator.Send(new GetTareaByIdQuery(id), ct);
            return result is null ? NotFound() : Ok(result);
        }

        /// <summary>Crear nueva tarea (Admin y Supervisor)</summary>
        [HttpPost]
        [Authorize(Roles = "Admin,Supervisor")]
        public async Task<IActionResult> Create([FromBody] CreateTareaCommand command, CancellationToken ct)
        {
            var id = await _mediator.Send(command, ct);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        /// <summary>Actualizar tarea (Admin y Supervisor)</summary>
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin,Supervisor")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTareaRequest request, CancellationToken ct)
        {
            var command = new UpdateTareaCommand(
                id, request.Titulo, request.Descripcion, request.Prioridad,
                request.FechaLimite, request.HorasEstimadas,
                request.CuadrillaId, request.UsuarioAsignadoId);

            var result = await _mediator.Send(command, ct);
            return result ? NoContent() : NotFound();
        }

        /// <summary>Cambiar estado de una tarea (todos los roles)</summary>
        [HttpPatch("{id:guid}/estado")]
        public async Task<IActionResult> CambiarEstado(Guid id, [FromBody] CambiarEstadoRequest request, CancellationToken ct)
        {
            var result = await _mediator.Send(
                new CambiarEstadoTareaCommand(id, request.NuevoEstado, request.Observaciones), ct);
            return result ? NoContent() : NotFound();
        }

        /// <summary>Eliminar tarea — soft delete (Admin y Supervisor)</summary>
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin,Supervisor")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            var result = await _mediator.Send(new DeleteTareaCommand(id), ct);
            return result ? NoContent() : NotFound();
        }
    }

    public record UpdateTareaRequest(
        string Titulo,
        string? Descripcion,
        PrioridadTarea Prioridad,
        DateTime? FechaLimite,
        decimal HorasEstimadas,
        Guid? CuadrillaId,
        Guid? UsuarioAsignadoId);

    public record CambiarEstadoRequest(EstadoTarea NuevoEstado, string? Observaciones);
}
