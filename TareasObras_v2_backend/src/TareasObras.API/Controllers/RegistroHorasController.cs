using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Features.RegistroHoras.Commands;
using TareasObras.Application.Features.RegistroHoras.Queries;

namespace TareasObras.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RegistroHorasController : ControllerBase
{
    private readonly IMediator _mediator;
    public RegistroHorasController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DateTime? fecha, CancellationToken ct)
    {
        var uow = HttpContext.RequestServices.GetRequiredService<TareasObras.Application.Common.Interfaces.IUnitOfWork>();
        IEnumerable<Domain.Entities.RegistroHoras> registros;
        if (fecha.HasValue)
            registros = await uow.RegistrosHoras.GetByFechaAsync(fecha.Value, ct);
        else
            registros = await uow.RegistrosHoras.GetAllAsync(ct);

        var result = registros.Select(r => new {
            id = r.Id, obraId = r.ObraId,
            obraNombre = r.Obra?.Nombre ?? "",
            obraCodigo = r.Obra?.Codigo ?? "",
            operarioId = r.OperarioId,
            operarioNombre = $"{r.Operario?.Nombre} {r.Operario?.Apellidos}".Trim(),
            categoriaNombre = r.Categoria?.Nombre ?? "",
            fecha = r.Fecha, 
            horaInicio = r.HoraInicio, 
            horaFin = r.HoraFin, 
            horas = r.Horas,
            costeHoraAplicado = r.CosteHoraAplicado,
            costeTotal = r.CosteTotal,
            tareaId = r.TareaId,
            observaciones = r.Observaciones
        });
        return Ok(result);
    }

    [HttpGet("obra/{obraId:guid}")]
    public async Task<IActionResult> GetByObra(Guid obraId, CancellationToken ct)
        => Ok(await _mediator.Send(new GetRegistroHorasByObraQuery(obraId), ct));

    [HttpPost]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Create([FromBody] CreateRegistroHorasCommand command, CancellationToken ct)
    {
        var id = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetByObra), new { obraId = command.ObraId }, new { id });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateRegistroHorasRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateRegistroHorasCommand(id, request.TareaId, request.Fecha, request.HoraInicio, request.HoraFin, request.CosteHoraAplicado, request.Observaciones), ct);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new DeleteRegistroHorasCommand(id), ct);
        return result ? NoContent() : NotFound();
    }
}

public record UpdateRegistroHorasRequest(Guid? TareaId, DateTime Fecha, TimeSpan HoraInicio, TimeSpan HoraFin, decimal CosteHoraAplicado, string? Observaciones);
