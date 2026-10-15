namespace TareasObras.Application.Features.Facturas.DTOs;

public record FacturaExtraidaDto
{
    public string? ProveedorNombre { get; init; }
    public string? ProveedorCif { get; init; }
    public Guid? ProveedorIdSugerido { get; init; }
    public string? NumeroFactura { get; init; }
    public string? NumeroAlbaran { get; init; }
    public DateTime? FechaEmision { get; init; }
    public decimal BaseImponible { get; init; }
    public decimal PorcentajeIva { get; init; }
    public decimal ImporteIva { get; init; }
    public decimal ImporteTotal { get; init; }
    public string? ObraIdentificadaTexto { get; init; }
    public Guid? ObraIdSugerida { get; init; }
    public string DocumentoTemporalUrl { get; init; } = "";
    public string DocumentoHash { get; init; } = "";
    public bool EsDuplicado { get; init; }
    public string? AdvertenciaDuplicado { get; init; }
    public List<LineaMaterialExtraidaDto> Lineas { get; init; } = new();
}

public record LineaMaterialExtraidaDto
{
    public string Descripcion { get; init; } = "";
    public string Unidad { get; init; } = "ud";
    public decimal Cantidad { get; init; }
    public decimal PrecioUnitario { get; init; }
    public decimal Importe { get; init; }
    public Guid? LineaPartidaIdSugerida { get; init; }
    public string? PartidaSugeridaNombre { get; init; }
}
