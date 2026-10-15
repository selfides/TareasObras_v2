using System.Text.Json;
using MediatR;
using Microsoft.Extensions.Logging;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Application.Features.Facturas.DTOs;
using TareasObras.Domain.Entities;

namespace TareasObras.Application.Features.Facturas.Commands;

public class CrearTicketPendienteCommand : IRequest<TicketPendienteDto>
{
    public Stream ArchivoStream { get; set; } = null!;
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public Guid ObraId { get; set; }
    public string? Comentario { get; set; }
    public bool AnalizarConIa { get; set; } = true;
}


public class CrearTicketPendienteHandler : IRequestHandler<CrearTicketPendienteCommand, TicketPendienteDto>
{
    private readonly IUnitOfWork _uow;
    private readonly IFileStorageService _storage;
    private readonly IFacturaOcrService _ocrService;
    private readonly ICurrentUserService _currentUser;
    private readonly IAuditService _audit;
    private readonly ILogger<CrearTicketPendienteHandler> _logger;

    public CrearTicketPendienteHandler(
        IUnitOfWork uow,
        IFileStorageService storage,
        IFacturaOcrService ocrService,
        ICurrentUserService currentUser,
        IAuditService audit,
        ILogger<CrearTicketPendienteHandler> logger)
    {
        _uow = uow;
        _storage = storage;
        _ocrService = ocrService;
        _currentUser = currentUser;
        _audit = audit;
        _logger = logger;
    }

    public async Task<TicketPendienteDto> Handle(CrearTicketPendienteCommand request, CancellationToken ct)
    {
        if (request.ArchivoStream == null)
        {
            throw new ArgumentException("No se ha enviado ningún archivo para el ticket.");
        }

        var obra = await _uow.Obras.GetByIdAsync(request.ObraId, ct);
        if (obra == null)
        {
            throw new KeyNotFoundException($"No se encontró la obra con ID {request.ObraId}.");
        }

        // 1. Copiar a memoria para poder calcular hash, guardar y ejecutar OCR
        using var memoryStream = new MemoryStream();
        await request.ArchivoStream.CopyToAsync(memoryStream, ct);
        memoryStream.Position = 0;

        var hash = await _storage.ComputeHashAsync(memoryStream, ct);
        var url = await _storage.SaveFileAsync(memoryStream, request.FileName, "facturas", ct);

        // 2. Crear entidad TicketPendiente
        var ticket = TicketPendiente.Create(
            obraId: request.ObraId,
            documentoUrl: url,
            documentoHash: hash,
            nombreArchivoOriginal: request.FileName,
            contentType: request.ContentType,
            usuarioId: _currentUser.UserId,
            usuarioNombre: _currentUser.UserName,
            comentarioOperario: request.Comentario);

        // 3. Ejecutar análisis OCR de Gemini si se solicita
        if (request.AnalizarConIa)
        {
            try
            {
                memoryStream.Position = 0;
                var extraida = await _ocrService.AnalizarDocumentoAsync(
                    memoryStream,
                    request.FileName,
                    request.ContentType,
                    request.ObraId,
                    ct);


                // Serializar datos extraídos para recuperación instantánea en la bandeja de revisión
                var json = JsonSerializer.Serialize(extraida, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                ticket.SetDatosExtraidos(
                    datosJson: json,
                    total: extraida.ImporteTotal,
                    proveedor: extraida.ProveedorNombre,
                    cif: extraida.ProveedorCif,
                    numeroFactura: extraida.NumeroFactura,
                    fechaGasto: extraida.FechaEmision);

            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error al extraer OCR del ticket pendiente para obra {ObraId}", request.ObraId);
            }
        }

        await _uow.TicketsPendientes.AddAsync(ticket, ct);
        await _uow.SaveChangesAsync(ct);

        await _audit.LogAsync(
            accion: "TicketPendienteSubido",
            entidad: "TicketPendiente",
            entidadId: ticket.Id.ToString(),
            valoresAnteriores: null,
            valoresNuevos: new
            {
                ObraId = ticket.ObraId,
                Usuario = ticket.UsuarioNombre,
                Total = ticket.TotalEstimado,
                Proveedor = ticket.ProveedorSugerido
            },
            ct: ct);

        return new TicketPendienteDto
        {
            Id = ticket.Id,
            ObraId = ticket.ObraId,
            ObraNombre = obra.Nombre,
            ObraCodigo = obra.Codigo,
            UsuarioId = ticket.UsuarioId,
            UsuarioNombre = ticket.UsuarioNombre,
            DocumentoUrl = ticket.DocumentoUrl,
            DocumentoHash = ticket.DocumentoHash,
            NombreArchivoOriginal = ticket.NombreArchivoOriginal,
            ContentType = ticket.ContentType,
            Estado = ticket.Estado.ToString(),
            FechaSubida = ticket.CreatedAt,
            FechaGasto = ticket.FechaGasto,
            TotalEstimado = ticket.TotalEstimado,
            ProveedorSugerido = ticket.ProveedorSugerido,
            CifSugerido = ticket.CifSugerido,
            NumeroFacturaSugerido = ticket.NumeroFacturaSugerido,
            ComentarioOperario = ticket.ComentarioOperario,
            DatosExtraidosJson = ticket.DatosExtraidosJson,
            MaterialObraId = ticket.MaterialObraId,
            MotivoRechazo = ticket.MotivoRechazo,
            RevisadoPor = ticket.RevisadoPor,
            FechaRevision = ticket.FechaRevision
        };
    }
}
