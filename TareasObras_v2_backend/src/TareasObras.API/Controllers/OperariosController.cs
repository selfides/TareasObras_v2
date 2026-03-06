using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Features.Operarios.Commands;
using TareasObras.Application.Features.Operarios.Queries;

namespace TareasObras.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OperariosController : ControllerBase
{
    private readonly IMediator _mediator;
    public OperariosController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool soloActivos = true, CancellationToken ct = default)
        => Ok(await _mediator.Send(new GetOperariosQuery(soloActivos), ct));

    [HttpPost]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Create([FromBody] CreateOperarioCommand command, CancellationToken ct)
    {
        var id = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetAll), new { id }, new { id });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateOperarioRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateOperarioCommand(id, request.Nombre, request.Apellidos, request.DNI, request.Telefono, request.CategoriaOperarioId, request.CuadrillaId), ct);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new DeleteOperarioCommand(id), ct);
        return result ? NoContent() : NotFound();
    }
}

public record UpdateOperarioRequest(string Nombre, string Apellidos, string? DNI, string? Telefono, Guid CategoriaOperarioId, Guid? CuadrillaId);
