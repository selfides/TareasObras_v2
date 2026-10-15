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

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DateTime? fecha, CancellationToken ct)
    {
        var uow = HttpContext.RequestServices.GetRequiredService<TareasObras.Application.Common.Interfaces.IUnitOfWork>();
        IEnumerable<Domain.Entities.MaterialObra> materiales;
        if (fecha.HasValue)
            materiales = await uow.MaterialesObra.GetByFechaAsync(fecha.Value, ct);
        else
            materiales = await uow.MaterialesObra.GetAllAsync(ct);

        var result = materiales.Select(m => new {
            id = m.Id, obraId = m.ObraId,
            obraNombre = m.Obra?.Nombre ?? "",
            obraCodigo = m.Obra?.Codigo ?? "",
            proveedorId = m.ProveedorId, 
            lineaPartidaId = m.LineaPartidaId,
            lineaPartidaNombre = m.LineaPartida?.Descripcion ?? "",
            descripcion = m.Descripcion,
            unidad = m.Unidad, cantidad = m.Cantidad,
            precioUnitario = m.PrecioUnitario, importeReal = m.ImporteReal,
            fecha = m.Fecha, numeroAlbaran = m.NumeroAlbaran,
            numeroFactura = m.NumeroFactura, observaciones = m.Observaciones,
            documentoAdjuntoUrl = m.DocumentoAdjuntoUrl,
            documentoHash = m.DocumentoHash,
            cifProveedor = m.CifProveedor,
            porcentajeIva = m.PorcentajeIva,
            importeIva = m.ImporteIva,
            baseImponible = m.BaseImponible
        });
        return Ok(result);
    }

    [HttpGet("obra/{obraId:guid}")]
    public async Task<IActionResult> GetByObra(Guid obraId, CancellationToken ct)
        => Ok(await _mediator.Send(new GetMaterialesByObraQuery(obraId), ct));

    [HttpGet("documento/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDocumento(Guid id, [FromServices] TareasObras.Application.Common.Interfaces.IFileStorageService storage, CancellationToken ct)
    {
        var uow = HttpContext.RequestServices.GetRequiredService<TareasObras.Application.Common.Interfaces.IUnitOfWork>();
        var mat = await uow.MaterialesObra.GetByIdAsync(id, ct);
        if (mat is null || string.IsNullOrWhiteSpace(mat.DocumentoAdjuntoUrl))
            return NotFound("Material o documento no encontrado.");

        var stream = await storage.GetFileAsync(mat.DocumentoAdjuntoUrl, ct);
        if (stream is null)
            return NotFound("Archivo físico no encontrado.");

        var ext = Path.GetExtension(mat.DocumentoAdjuntoUrl).ToLowerInvariant();
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

    [HttpPost("subir-documento")]
    [Authorize(Roles = "Admin,Supervisor,Operario")]
    public async Task<IActionResult> SubirDocumento(
        [FromForm] IFormFile archivo,
        [FromServices] TareasObras.Application.Common.Interfaces.IFileStorageService storage,
        CancellationToken ct)
    {
        if (archivo == null || archivo.Length == 0)
            return BadRequest("No se ha enviado ningún archivo.");

        var extension = Path.GetExtension(archivo.FileName).ToLowerInvariant();
        var allowed = new[] { ".pdf", ".jpg", ".jpeg", ".png", ".webp" };
        if (!allowed.Contains(extension))
            return BadRequest($"Formato no soportado ({extension}). Solo se admiten archivos PDF o imágenes.");

        if (archivo.Length > 25 * 1024 * 1024)
            return BadRequest("El archivo supera el límite de 25 MB.");

        await using var stream = archivo.OpenReadStream();
        var hash = await storage.ComputeHashAsync(stream, ct);
        var url = await storage.SaveFileAsync(stream, archivo.FileName, "facturas", ct);

        return Ok(new { url, hash, nombreOriginal = archivo.FileName });
    }

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
        var result = await _mediator.Send(new UpdateMaterialObraCommand(
            id, request.Descripcion, request.Unidad, request.Cantidad, request.PrecioUnitario,
            request.Fecha, request.ProveedorId, request.NumeroAlbaran, request.NumeroFactura,
            request.Observaciones, request.LineaPartidaId, request.DocumentoAdjuntoUrl,
            request.DocumentoHash, request.CifProveedor, request.PorcentajeIva, request.ImporteIva, request.BaseImponible), ct);
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

public record UpdateMaterialObraRequest(
    string Descripcion,
    string Unidad,
    decimal Cantidad,
    decimal PrecioUnitario,
    DateTime Fecha,
    Guid? ProveedorId,
    string? NumeroAlbaran,
    string? NumeroFactura,
    string? Observaciones,
    Guid? LineaPartidaId,
    string? DocumentoAdjuntoUrl = null,
    string? DocumentoHash = null,
    string? CifProveedor = null,
    decimal? PorcentajeIva = null,
    decimal? ImporteIva = null,
    decimal? BaseImponible = null);
