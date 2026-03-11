using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Features.MaterialesObra.Commands;
using TareasObras.Application.Features.MaterialesObra.Queries;

namespace TareasObras.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MaterialesObraController : ControllerBase
{
    private readonly IMediator _mediator;
    public MaterialesObraController(IMediator mediator) => _mediator = mediator;

    [HttpGet("obra/{obraId:guid}")]
    public async Task<IActionResult> GetByObra(Guid obraId, CancellationToken ct)
        => Ok(await _mediator.Send(new GetMaterialesByObraQuery(obraId), ct));

    [HttpPost]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Create([FromBody] CreateMaterialObraCommand command, CancellationToken ct)
    {
        var id = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetByObra), new { obraId = command.ObraId }, new { id });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMaterialObraRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateMaterialObraCommand(id, request.Descripcion, request.Unidad, request.Cantidad, request.PrecioUnitario, request.Fecha, request.ProveedorId, request.NumeroAlbaran, request.NumeroFactura, request.Observaciones), ct);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new DeleteMaterialObraCommand(id), ct);
        return result ? NoContent() : NotFound();
    }
}

public record UpdateMaterialObraRequest(string Descripcion, string Unidad, decimal Cantidad, decimal PrecioUnitario, DateTime Fecha, Guid? ProveedorId, string? NumeroAlbaran, string? NumeroFactura, string? Observaciones);
