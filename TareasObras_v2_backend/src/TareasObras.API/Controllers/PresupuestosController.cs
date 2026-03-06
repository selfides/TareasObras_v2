using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Features.Presupuestos.Commands;
using TareasObras.Application.Features.Presupuestos.Queries;

namespace TareasObras.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PresupuestosController : ControllerBase
{
    private readonly IMediator _mediator;
    public PresupuestosController(IMediator mediator) => _mediator = mediator;

    [HttpGet("obra/{obraId:guid}")]
    public async Task<IActionResult> GetByObra(Guid obraId, CancellationToken ct)
        => Ok(await _mediator.Send(new GetPresupuestosByObraQuery(obraId), ct));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetPresupuestoByIdQuery(id), ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Create([FromBody] CreatePresupuestoCommand command, CancellationToken ct)
    {
        var id = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPatch("{id:guid}/aprobar")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Aprobar(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new AprobarPresupuestoCommand(id), ct);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new DeletePresupuestoCommand(id), ct);
        return result ? NoContent() : NotFound();
    }
}
