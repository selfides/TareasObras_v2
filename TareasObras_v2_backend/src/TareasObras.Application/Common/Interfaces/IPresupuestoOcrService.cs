using TareasObras.Application.Features.Presupuestos.DTOs;

namespace TareasObras.Application.Common.Interfaces;

public interface IPresupuestoOcrService
{
    /// <summary>
    /// Analiza un documento de presupuesto (PDF o Imagen) mediante IA multimodal,
    /// extrayendo cabecera, condiciones y partidas de obra a precio cerrado o unitario.
    /// </summary>
    Task<PresupuestoExtraidoDto> AnalizarDocumentoAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        Guid? obraIdContexto = null,
        CancellationToken ct = default);
}
