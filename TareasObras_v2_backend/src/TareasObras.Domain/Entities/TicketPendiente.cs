using TareasObras.Domain.Common;
using TareasObras.Domain.Enums;

namespace TareasObras.Domain.Entities;

public class TicketPendiente : BaseEntity
{
    public Guid ObraId { get; set; }
    public Obra Obra { get; set; } = null!;

    public string? UsuarioId { get; set; }
    public string? UsuarioNombre { get; set; }

    public string DocumentoUrl { get; set; } = string.Empty;
    public string DocumentoHash { get; set; } = string.Empty;
    public string NombreArchivoOriginal { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;

    public EstadoTicketPendiente Estado { get; set; } = EstadoTicketPendiente.Pendiente;

    public DateTime? FechaGasto { get; set; }
    public decimal? TotalEstimado { get; set; }
    public string? ProveedorSugerido { get; set; }
    public string? CifSugerido { get; set; }
    public string? NumeroFacturaSugerido { get; set; }

    public string? ComentarioOperario { get; set; }
    public string? DatosExtraidosJson { get; set; }

    public Guid? MaterialObraId { get; set; }
    public MaterialObra? MaterialObra { get; set; }

    public string? MotivoRechazo { get; set; }
    public string? RevisadoPor { get; set; }
    public DateTime? FechaRevision { get; set; }

    public TicketPendiente() { }

    public static TicketPendiente Create(
        Guid obraId,
        string documentoUrl,
        string documentoHash,
        string nombreArchivoOriginal,
        string contentType,
        string? usuarioId,
        string? usuarioNombre,
        string? comentarioOperario)
    {
        return new TicketPendiente
        {
            ObraId = obraId,
            DocumentoUrl = documentoUrl,
            DocumentoHash = documentoHash,
            NombreArchivoOriginal = nombreArchivoOriginal,
            ContentType = contentType,
            UsuarioId = usuarioId,
            UsuarioNombre = usuarioNombre,
            ComentarioOperario = comentarioOperario,
            Estado = EstadoTicketPendiente.Pendiente
        };
    }

    public void SetDatosExtraidos(
        string datosJson,
        decimal? total,
        string? proveedor,
        string? cif,
        string? numeroFactura,
        DateTime? fechaGasto)
    {
        DatosExtraidosJson = datosJson;
        TotalEstimado = total;
        ProveedorSugerido = proveedor;
        CifSugerido = cif;
        NumeroFacturaSugerido = numeroFactura;
        FechaGasto = fechaGasto;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Aprobar(Guid? materialObraId, string revisor)
    {
        Estado = EstadoTicketPendiente.Aprobado;
        MaterialObraId = materialObraId;
        RevisadoPor = revisor;
        FechaRevision = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Rechazar(string motivo, string revisor)
    {
        Estado = EstadoTicketPendiente.Rechazado;
        MotivoRechazo = motivo;
        RevisadoPor = revisor;
        FechaRevision = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}
