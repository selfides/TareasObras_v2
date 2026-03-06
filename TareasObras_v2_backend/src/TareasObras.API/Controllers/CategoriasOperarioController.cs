using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Features.CategoriasOperario.Commands;
using TareasObras.Application.Features.CategoriasOperario.Queries;

namespace TareasObras.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriasOperarioController : ControllerBase
{
    private readonly IMediator _mediator;
    public CategoriasOperarioController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await _mediator.Send(new GetCategoriasOperarioQuery(), ct));

    [HttpPost]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Create([FromBody] CreateCategoriaOperarioCommand command, CancellationToken ct)
    {
        var id = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetAll), new { id }, new { id });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoriaOperarioRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateCategoriaOperarioCommand(id, request.Nombre, request.CosteHoraBase), ct);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new DeleteCategoriaOperarioCommand(id), ct);
        return result ? NoContent() : NotFound();
    }
}

public record UpdateCategoriaOperarioRequest(string Nombre, decimal CosteHoraBase);
