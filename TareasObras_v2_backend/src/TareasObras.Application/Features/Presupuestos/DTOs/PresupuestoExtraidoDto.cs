namespace TareasObras.Application.Features.Presupuestos.DTOs;

public record PresupuestoExtraidoDto
{
    public string? Numero { get; init; }
    public DateTime? Fecha { get; init; }
    public string? ClienteNombre { get; init; }
    public string? ObraIdentificadaTexto { get; init; }
    public Guid? ObraIdSugerida { get; init; }
    public string? Descripcion { get; init; }
    public string? ObservacionesCondiciones { get; init; }
    public decimal BaseImponible { get; init; }
    public decimal PorcentajeIva { get; init; }
    public decimal ImporteIva { get; init; }
    public decimal ImporteTotal { get; init; }
    public string DocumentoTemporalUrl { get; init; } = string.Empty;
    public string DocumentoHash { get; init; } = string.Empty;
    public string? Advertencia { get; init; }
    public List<PartidaExtraidaDto> Partidas { get; init; } = new();
}

public record PartidaExtraidaDto
{
    public int Orden { get; init; }
    public string? NumeroPosicion { get; init; }
    public string Nombre { get; init; } = string.Empty;
    public string? Descripcion { get; init; }
    public string Unidad { get; init; } = "ud";
    public decimal Cantidad { get; init; } = 1;
    public decimal PrecioUnitario { get; init; }
    public decimal Importe { get; init; }
    public bool GenerarTareaKanban { get; init; } = true;
}
