using TareasObras.Application.Features.Facturas.DTOs;

namespace TareasObras.Application.Common.Interfaces;

public interface IFacturaOcrService
{
    /// <summary>
    /// Analiza un documento (PDF o Imagen) mediante IA multimodal, extrayendo datos fiscales, importes y líneas,
    /// y cruzándolos con proveedores, obras y partidas existentes.
    /// </summary>
    Task<FacturaExtraidaDto> AnalizarDocumentoAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        Guid? obraIdContexto = null,
        CancellationToken ct = default);
}
