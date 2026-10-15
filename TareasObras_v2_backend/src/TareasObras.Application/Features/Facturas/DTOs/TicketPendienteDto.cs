namespace TareasObras.Application.Features.Facturas.DTOs;

public class TicketPendienteDto
{
    public Guid Id { get; set; }
    public Guid ObraId { get; set; }
    public string ObraNombre { get; set; } = string.Empty;
    public string ObraCodigo { get; set; } = string.Empty;

    public string? UsuarioId { get; set; }
    public string? UsuarioNombre { get; set; }

    public string DocumentoUrl { get; set; } = string.Empty;
    public string DocumentoHash { get; set; } = string.Empty;
    public string NombreArchivoOriginal { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;

    public string Estado { get; set; } = string.Empty;
    public DateTime FechaSubida { get; set; }

    public DateTime? FechaGasto { get; set; }
    public decimal? TotalEstimado { get; set; }
    public string? ProveedorSugerido { get; set; }
    public string? CifSugerido { get; set; }
    public string? NumeroFacturaSugerido { get; set; }

    public string? ComentarioOperario { get; set; }
    public string? DatosExtraidosJson { get; set; }

    public Guid? MaterialObraId { get; set; }
    public string? MotivoRechazo { get; set; }
    public string? RevisadoPor { get; set; }
    public DateTime? FechaRevision { get; set; }
}
