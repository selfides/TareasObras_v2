using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Features.Presupuestos.Commands;
using TareasObras.Application.Features.Presupuestos.Queries;

using TareasObras.Application.Common.Interfaces;
using TareasObras.Application.Features.Presupuestos.DTOs;

namespace TareasObras.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PresupuestosController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IPresupuestoOcrService _presupuestoOcrService;

    public PresupuestosController(IMediator mediator, IPresupuestoOcrService presupuestoOcrService)
    {
        _mediator = mediator;
        _presupuestoOcrService = presupuestoOcrService;
    }

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

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePresupuestoRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdatePresupuestoCommand(id, request.Numero, request.Fecha, request.Descripcion), ct);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new DeletePresupuestoCommand(id), ct);
        return result ? NoContent() : NotFound();
    }

    /// <summary>Generar/regenerar tareas de mano de obra desde un presupuesto aprobado</summary>
    [HttpPost("{id:guid}/generar-tareas")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> GenerarTareas(Guid id, CancellationToken ct)
    {
        var count = await _mediator.Send(new GenerarTareasPresupuestoCommand(id), ct);
        return Ok(new { tareasGeneradas = count });
    }

    /// <summary>
    /// Sube un documento de presupuesto (PDF o imagen) y extrae sus partidas, cabecera y condiciones mediante IA multimodal.
    /// </summary>
    [HttpPost("analizar-documento")]
    [Consumes("multipart/form-data")]
    [Authorize(Roles = "Admin,Supervisor")]
    [ProducesResponseType(typeof(PresupuestoExtraidoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AnalizarDocumento(
        [FromForm] IFormFile archivo,
        [FromQuery] Guid? obraId,
        CancellationToken ct)
    {
        if (archivo == null || archivo.Length == 0)
            return BadRequest(new { mensaje = "Debe proporcionar un archivo de presupuesto válido (PDF o Imagen)." });

        var extensionesPermitidas = new[] { ".pdf", ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(archivo.FileName).ToLowerInvariant();
        if (!extensionesPermitidas.Contains(ext))
            return BadRequest(new { mensaje = $"Formato no soportado ({ext}). Formatos válidos: PDF, JPG, PNG, WEBP." });

        if (archivo.Length > 25 * 1024 * 1024)
            return BadRequest(new { mensaje = "El archivo excede el límite máximo permitido (25 MB)." });

        using var stream = archivo.OpenReadStream();
        var resultado = await _presupuestoOcrService.AnalizarDocumentoAsync(
            stream,
            archivo.FileName,
            archivo.ContentType,
            obraId,
            ct);

        return Ok(resultado);
    }

    /// <summary>
    /// Guarda el presupuesto escaneado tras la revisión del usuario, creando sus partidas y opcionalmente las tareas en Kanban.
    /// </summary>
    [HttpPost("importar-escaneado")]
    [Authorize(Roles = "Admin,Supervisor")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ImportarEscaneado(
        [FromBody] ImportarPresupuestoEscaneadoCommand command,
        CancellationToken ct)
    {
        var id = await _mediator.Send(command, ct);
        return Ok(new { id, mensaje = "Presupuesto importado exitosamente." });
    }
}

public record UpdatePresupuestoRequest(string? Numero, DateTime Fecha, string? Descripcion);
