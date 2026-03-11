using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Features.Proveedores.Commands;
using TareasObras.Application.Features.Proveedores.Queries;

namespace TareasObras.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProveedoresController : ControllerBase
{
    private readonly IMediator _mediator;
    public ProveedoresController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var res = await _mediator.Send(new GetAllProveedoresQuery());
        return Ok(res);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProveedorCommand command)
    {
        var res = await _mediator.Send(command);
        return Ok(res);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateProveedorCommand command)
    {
        if (id != command.Id) return BadRequest();
        var res = await _mediator.Send(command);
        return res ? Ok() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var res = await _mediator.Send(new DeleteProveedorCommand(id));
        return res ? Ok() : NotFound();
    }
}
