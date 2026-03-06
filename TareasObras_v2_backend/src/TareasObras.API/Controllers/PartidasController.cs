using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Features.Partidas.Commands;
using TareasObras.Application.Features.Partidas.Queries;

namespace TareasObras.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PartidasController : ControllerBase
{
    private readonly IMediator _mediator;
    public PartidasController(IMediator mediator) => _mediator = mediator;

    [HttpGet("presupuesto/{presupuestoId:guid}")]
    public async Task<IActionResult> GetByPresupuesto(Guid presupuestoId, CancellationToken ct)
        => Ok(await _mediator.Send(new GetPartidasByPresupuestoQuery(presupuestoId), ct));

    [HttpPost]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Create([FromBody] CreatePartidaCommand cmd, CancellationToken ct)
    {
        var id = await _mediator.Send(cmd, ct);
        return CreatedAtAction(nameof(GetByPresupuesto), new { presupuestoId = cmd.PresupuestoId }, new { id });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePartidaRequest req, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdatePartidaCommand(id, req.Nombre, req.Descripcion, req.Orden), ct);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new DeletePartidaCommand(id), ct);
        return result ? NoContent() : NotFound();
    }

    [HttpPost("{id:guid}/lineas/material")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> AddMaterial(Guid id, [FromBody] AddLineaMaterialRequest req, CancellationToken ct)
    {
        var lineaId = await _mediator.Send(new AddLineaMaterialCommand(id, req.Descripcion, req.Unidad, req.Cantidad, req.PrecioUnitario), ct);
        return CreatedAtAction(nameof(GetByPresupuesto), new { }, new { id = lineaId });
    }

    [HttpPost("{id:guid}/lineas/manoobra")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> AddManoObra(Guid id, [FromBody] AddLineaManoObraRequest req, CancellationToken ct)
    {
        var lineaId = await _mediator.Send(new AddLineaManoObraCommand(id, req.CategoriaOperarioId, req.Descripcion, req.Unidad, req.Cantidad, req.PrecioUnitario), ct);
        return CreatedAtAction(nameof(GetByPresupuesto), new { }, new { id = lineaId });
    }

    [HttpPut("lineas/{id:guid}")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> UpdateLinea(Guid id, [FromBody] UpdateLineaRequest req, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateLineaPartidaCommand(id, req.Descripcion, req.Unidad, req.Cantidad, req.PrecioUnitario, req.CategoriaOperarioId), ct);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("lineas/{id:guid}")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> DeleteLinea(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new DeleteLineaPartidaCommand(id), ct);
        return result ? NoContent() : NotFound();
    }
}

public record UpdatePartidaRequest(string Nombre, string? Descripcion, int Orden);
public record AddLineaMaterialRequest(string Descripcion, string Unidad, decimal Cantidad, decimal PrecioUnitario);
public record AddLineaManoObraRequest(Guid CategoriaOperarioId, string Descripcion, string Unidad, decimal Cantidad, decimal PrecioUnitario);
public record UpdateLineaRequest(string Descripcion, string Unidad, decimal Cantidad, decimal PrecioUnitario, Guid? CategoriaOperarioId);
