using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Features.Obras.Commands.CambiarEstadoObra;
using TareasObras.Application.Features.Obras.Commands.CreateObra;
using TareasObras.Application.Features.Obras.Commands.DeleteObra;
using TareasObras.Application.Features.Obras.Commands.UpdateObra;
using TareasObras.Application.Features.Obras.Queries.GetObraById;
using TareasObras.Application.Features.Obras.Queries.GetObras;
using TareasObras.Domain.Enums;

namespace TareasObras.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ObrasController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ObrasController(IMediator mediator) => _mediator = mediator;

        /// <summary>Obtener listado de obras con filtros opcionales</summary>
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] string? estado,
            CancellationToken ct)
        {
            var result = await _mediator.Send(new GetObrasQuery(search, estado), ct);
            return Ok(result);
        }

        /// <summary>Obtener detalle de una obra por ID</summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        {
            var result = await _mediator.Send(new GetObraByIdQuery(id), ct);
            return result is null ? NotFound() : Ok(result);
        }

        /// <summary>Crear nueva obra (Admin y Supervisor)</summary>
        [HttpPost]
        [Authorize(Roles = "Admin,Supervisor")]
        public async Task<IActionResult> Create([FromBody] CreateObraCommand command, CancellationToken ct)
        {
            var id = await _mediator.Send(command, ct);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        /// <summary>Actualizar obra completa (Admin y Supervisor)</summary>
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin,Supervisor")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateObraRequest request, CancellationToken ct)
        {
            var command = new UpdateObraCommand(
                id, request.Nombre, request.Descripcion, request.Direccion,
                request.Cliente, request.FechaInicio, request.FechaFinPrevista,
                request.PresupuestoEstimado);

            var result = await _mediator.Send(command, ct);
            return result ? NoContent() : NotFound();
        }

        /// <summary>Cambiar solo el estado de una obra</summary>
        [HttpPatch("{id:guid}/estado")]
        [Authorize(Roles = "Admin,Supervisor")]
        public async Task<IActionResult> CambiarEstado(Guid id, [FromBody] CambiarEstadoObraRequest request, CancellationToken ct)
        {
            var result = await _mediator.Send(new CambiarEstadoObraCommand(id, request.NuevoEstado), ct);
            return result ? NoContent() : NotFound();
        }

        /// <summary>Eliminar obra — soft delete, solo Admin</summary>
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            var result = await _mediator.Send(new DeleteObraCommand(id), ct);
            return result ? NoContent() : NotFound();
        }
    }

    public record UpdateObraRequest(
        string Nombre,
        string? Descripcion,
        string? Direccion,
        string? Cliente,
        DateTime FechaInicio,
        DateTime? FechaFinPrevista,
        decimal PresupuestoEstimado);

    public record CambiarEstadoObraRequest(EstadoObra NuevoEstado);
}
