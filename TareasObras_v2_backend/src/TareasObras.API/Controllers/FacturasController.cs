using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Application.Features.Facturas.Commands;
using TareasObras.Application.Features.Facturas.DTOs;

namespace TareasObras.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FacturasController : ControllerBase
{
    private readonly IFacturaOcrService _ocrService;
    private readonly IFileStorageService _storageService;
    private readonly IUnitOfWork _uow;
    private readonly IMediator _mediator;

    public FacturasController(
        IFacturaOcrService ocrService,
        IFileStorageService storageService,
        IUnitOfWork uow,
        IMediator mediator)
    {
        _ocrService = ocrService;
        _storageService = storageService;
        _uow = uow;
        _mediator = mediator;
    }

    /// <summary>
    /// Imputa las líneas verificadas de una factura o ticket a la obra seleccionada.
    /// Crea en bloque los registros de MaterialObra, da de alta al proveedor si es nuevo y actualiza el coste real.
    /// </summary>
    [HttpPost("imputar")]
    [Authorize(Roles = "Admin,Supervisor")]
    [ProducesResponseType(typeof(ImputarFacturaResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ImputarFactura(
        [FromBody] ImputarFacturaCommand command,
        CancellationToken ct)
    {
        var resultado = await _mediator.Send(command, ct);
        return Ok(resultado);
    }

    /// <summary>
    /// Sube una factura, albarán o ticket (PDF o imagen) y extrae sus datos estructurados mediante IA multimodal.
    /// Cruza los datos extraídos con la base de datos de proveedores, obras y partidas presupuestarias.
    /// </summary>
    [HttpPost("analizar")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(FacturaExtraidaDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AnalizarFactura(
        [FromForm] IFormFile archivo,
        [FromQuery] Guid? obraId,
        CancellationToken ct)
    {
        if (archivo == null || archivo.Length == 0)
        {
            return BadRequest(new { message = "No se ha proporcionado ningún archivo para analizar." });
        }

        var extension = Path.GetExtension(archivo.FileName).ToLowerInvariant();
        var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png", ".webp" };
        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = $"El formato '{extension}' no está soportado. Solo se admiten PDFs o imágenes (.jpg, .jpeg, .png, .webp)." });
        }

        const long maxSizeBytes = 25 * 1024 * 1024; // 25 MB
        if (archivo.Length > maxSizeBytes)
        {
            return BadRequest(new { message = "El tamaño del archivo supera el límite permitido de 25 MB." });
        }

        await using var stream = archivo.OpenReadStream();
        var resultado = await _ocrService.AnalizarDocumentoAsync(
            stream,
            archivo.FileName,
            archivo.ContentType,
            obraId,
            ct);

        return Ok(resultado);
    }

    /// <summary>
    /// Verifica si un documento ya fue contabilizado anteriormente a través de su hash SHA-256.
    /// </summary>
    [HttpGet("verificar-hash/{hash}")]
    public async Task<IActionResult> VerificarHash(string hash, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(hash))
        {
            return BadRequest(new { message = "Hash no válido." });
        }

        var material = await _uow.MaterialesObra.GetByHashAsync(hash.Trim(), ct);
        if (material != null)
        {
            return Ok(new
            {
                esDuplicado = true,
                mensaje = $"El justificante ya fue imputado en la obra '{material.Obra?.Nombre}' el {material.Fecha:dd/MM/yyyy}.",
                materialId = material.Id,
                obraId = material.ObraId,
                obraNombre = material.Obra?.Nombre,
                numeroFactura = material.NumeroFactura,
                fecha = material.Fecha
            });
        }

        return Ok(new { esDuplicado = false });
    }

    /// <summary>
    /// Sube un ticket de caja o albarán capturado rápidamente (por ejemplo, desde el móvil del operario).
    /// </summary>
    [HttpPost("tickets-pendientes")]
    [Consumes("multipart/form-data")]
    [Authorize(Roles = "Admin,Supervisor,Operario")]
    [ProducesResponseType(typeof(TicketPendienteDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SubirTicketPendiente(
        [FromForm] IFormFile archivo,
        [FromForm] Guid obraId,
        [FromForm] string? comentario,
        [FromForm] bool analizarConIa = true,
        CancellationToken ct = default)
    {
        if (archivo == null || archivo.Length == 0)
        {
            return BadRequest(new { message = "No se ha proporcionado ninguna foto o documento del ticket." });
        }

        await using var stream = archivo.OpenReadStream();
        var command = new CrearTicketPendienteCommand
        {
            ArchivoStream = stream,
            FileName = archivo.FileName,
            ContentType = archivo.ContentType,
            ObraId = obraId,
            Comentario = comentario,
            AnalizarConIa = analizarConIa
        };


        var resultado = await _mediator.Send(command, ct);
        return Ok(resultado);
    }

    /// <summary>
    /// Obtiene la bandeja de tickets pendientes de validación o contabilización.
    /// Los operarios ven sus propios tickets; administradores y supervisores ven los de todas las obras.
    /// </summary>
    [HttpGet("tickets-pendientes")]
    [Authorize(Roles = "Admin,Supervisor,Operario")]
    [ProducesResponseType(typeof(List<TicketPendienteDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTicketsPendientes(
        [FromQuery] Domain.Enums.EstadoTicketPendiente? estado,
        [FromQuery] Guid? obraId,
        CancellationToken ct)
    {
        var query = new Application.Features.Facturas.Queries.GetTicketsPendientesQuery
        {
            Estado = estado,
            ObraId = obraId
        };

        var list = await _mediator.Send(query, ct);
        return Ok(list);
    }

    /// <summary>
    /// Rechaza un ticket pendiente de validación con un motivo explicativo.
    /// </summary>
    [HttpPost("tickets-pendientes/{id:guid}/rechazar")]
    [Authorize(Roles = "Admin,Supervisor")]
    public async Task<IActionResult> RechazarTicket(
        Guid id,
        [FromBody] RechazarTicketRequest request,
        CancellationToken ct)
    {
        var result = await _mediator.Send(new RechazarTicketPendienteCommand
        {
            Id = id,
            Motivo = request.Motivo
        }, ct);

        if (!result) return NotFound(new { message = "Ticket no encontrado." });
        return Ok(new { success = true });
    }

    /// <summary>
    /// Descarga o previsualiza de forma segura el documento o foto de un ticket pendiente.
    /// </summary>
    [HttpGet("tickets-pendientes/{id:guid}/documento")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDocumentoTicket(Guid id, CancellationToken ct)
    {
        var ticket = await _uow.TicketsPendientes.GetByIdAsync(id, ct);
        if (ticket == null || string.IsNullOrWhiteSpace(ticket.DocumentoUrl))
        {
            return NotFound("Ticket o archivo no encontrado.");
        }

        var stream = await _storageService.GetFileAsync(ticket.DocumentoUrl, ct);
        if (stream == null)
        {
            return NotFound("Archivo físico no encontrado.");
        }

        var ext = Path.GetExtension(ticket.DocumentoUrl).ToLowerInvariant();
        var contentType = ext switch
        {
            ".pdf" => "application/pdf",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };

        return File(stream, contentType, enableRangeProcessing: true);
    }
}

public record RechazarTicketRequest(string Motivo);

