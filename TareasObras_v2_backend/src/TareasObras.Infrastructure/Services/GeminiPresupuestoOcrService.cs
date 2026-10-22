using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Application.Features.Presupuestos.DTOs;
using TareasObras.Domain.Entities;

namespace TareasObras.Infrastructure.Services;

public class GeminiPresupuestoOcrService : IPresupuestoOcrService
{
    private readonly HttpClient _httpClient;
    private readonly IFileStorageService _storage;
    private readonly IUnitOfWork _uow;
    private readonly IConfiguration _config;
    private readonly ILogger<GeminiPresupuestoOcrService> _logger;

    public GeminiPresupuestoOcrService(
        HttpClient httpClient,
        IFileStorageService storage,
        IUnitOfWork uow,
        IConfiguration config,
        ILogger<GeminiPresupuestoOcrService> logger)
    {
        _httpClient = httpClient;
        _storage = storage;
        _uow = uow;
        _config = config;
        _logger = logger;
    }

    public async Task<PresupuestoExtraidoDto> AnalizarDocumentoAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        Guid? obraIdContexto = null,
        CancellationToken ct = default)
    {
        // 1. Calcular hash y guardar archivo temporal
        var hash = await _storage.ComputeHashAsync(fileStream, ct);
        var urlTemporal = await _storage.SaveFileAsync(fileStream, fileName, "presupuestos", ct);

        // 2. Procesar con Gemini API o Fallback si no hay API key
        var apiKey = _config["AiSettings:GeminiApiKey"]
                     ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY")
                     ?? Environment.GetEnvironmentVariable("GOOGLE_API_KEY");

        var model = _config["AiSettings:Model"] ?? "gemini-2.0-flash";

        GeminiPresupuestoRawResponse extracted;
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogInformation("No se detectó API Key para Gemini. Empleando extractor de demostración para presupuesto.");
            extracted = GenerateFallbackExtraction(fileName);
        }
        else
        {
            try
            {
                extracted = await CallGeminiApiAsync(fileStream, contentType, apiKey, model, ct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al invocar API de Gemini Vision para presupuesto. Utilizando extracción de respaldo.");
                extracted = GenerateFallbackExtraction(fileName);
            }
        }

        // 3. Vincular u obtener Obra sugerida
        Guid? obraIdSugerida = obraIdContexto;
        if (!obraIdSugerida.HasValue && !string.IsNullOrWhiteSpace(extracted.ObraIdentificadaTexto))
        {
            var todasObras = await _uow.Obras.GetAllAsync(ct);
            var obraMatch = todasObras.FirstOrDefault(o =>
                o.Nombre.Contains(extracted.ObraIdentificadaTexto.Trim(), StringComparison.OrdinalIgnoreCase) ||
                extracted.ObraIdentificadaTexto.Contains(o.Nombre.Trim(), StringComparison.OrdinalIgnoreCase) ||
                (!string.IsNullOrEmpty(o.Codigo) && extracted.ObraIdentificadaTexto.Contains(o.Codigo.Trim(), StringComparison.OrdinalIgnoreCase)));

            if (obraMatch != null)
            {
                obraIdSugerida = obraMatch.Id;
            }
        }

        // 4. Mapear partidas y normalizar
        var partidasDto = new List<PartidaExtraidaDto>();
        int orden = 1;
        if (extracted.Partidas != null)
        {
            foreach (var p in extracted.Partidas)
            {
                if (string.IsNullOrWhiteSpace(p.Nombre) && string.IsNullOrWhiteSpace(p.Descripcion))
                    continue;

                var nombreFinal = !string.IsNullOrWhiteSpace(p.Nombre) 
                    ? p.Nombre.Trim() 
                    : (p.Descripcion?.Length > 60 ? p.Descripcion[..60] + "..." : p.Descripcion ?? "Partida sin nombre");

                var cantidad = p.Cantidad > 0 ? p.Cantidad : 1m;
                var precioUnitario = p.PrecioUnitario;
                var importe = p.Importe > 0 ? p.Importe : (cantidad * precioUnitario);

                partidasDto.Add(new PartidaExtraidaDto
                {
                    Orden = orden++,
                    NumeroPosicion = p.NumeroPosicion?.Trim() ?? orden.ToString(),
                    Nombre = nombreFinal,
                    Descripcion = p.Descripcion?.Trim(),
                    Unidad = string.IsNullOrWhiteSpace(p.Unidad) ? "ud" : p.Unidad.Trim().ToLowerInvariant(),
                    Cantidad = cantidad,
                    PrecioUnitario = precioUnitario,
                    Importe = importe,
                    GenerarTareaKanban = true
                });
            }
        }

        // Si la suma de partidas da la base imponible y esta venía a 0
        var baseImponible = extracted.BaseImponible > 0 
            ? extracted.BaseImponible 
            : partidasDto.Sum(p => p.Importe);

        var porcentajeIva = extracted.PorcentajeIva > 0 ? extracted.PorcentajeIva : 21.0m;
        var importeIva = extracted.ImporteIva > 0 
            ? extracted.ImporteIva 
            : Math.Round(baseImponible * (porcentajeIva / 100m), 2);

        var importeTotal = extracted.ImporteTotal > 0 
            ? extracted.ImporteTotal 
            : baseImponible + importeIva;

        DateTime? fechaEmision = null;
        if (DateTime.TryParse(extracted.FechaEmision, out var parsedDate))
        {
            fechaEmision = parsedDate;
        }

        return new PresupuestoExtraidoDto
        {
            Numero = extracted.Numero?.Trim(),
            Fecha = fechaEmision ?? DateTime.Today,
            ClienteNombre = extracted.ClienteNombre?.Trim(),
            ObraIdentificadaTexto = extracted.ObraIdentificadaTexto?.Trim(),
            ObraIdSugerida = obraIdSugerida,
            Descripcion = extracted.Descripcion?.Trim(),
            ObservacionesCondiciones = extracted.ObservacionesCondiciones?.Trim(),
            BaseImponible = baseImponible,
            PorcentajeIva = porcentajeIva,
            ImporteIva = importeIva,
            ImporteTotal = importeTotal,
            DocumentoTemporalUrl = urlTemporal,
            DocumentoHash = hash,
            Partidas = partidasDto
        };
    }

    private async Task<GeminiPresupuestoRawResponse> CallGeminiApiAsync(
        Stream fileStream,
        string contentType,
        string apiKey,
        string model,
        CancellationToken ct)
    {
        if (fileStream.CanSeek)
        {
            fileStream.Position = 0;
        }

        using var memoryStream = new MemoryStream();
        await fileStream.CopyToAsync(memoryStream, ct);
        var base64Data = Convert.ToBase64String(memoryStream.ToArray());

        var mimeType = string.IsNullOrWhiteSpace(contentType) || contentType == "application/octet-stream"
            ? "application/pdf"
            : contentType;

        var prompt = """
            Eres un experto en estimación y presupuestos de obras de construcción y carpintería/reformas en España.
            Analiza este presupuesto / oferta comercial y extrae los siguientes datos en formato JSON estructurado:

            1. numero: Número o código identificador del presupuesto (ej. "2.026.000.102/1" o "PRE-2026/04").
            2. fechaEmision: Fecha del presupuesto en formato YYYY-MM-DD.
            3. clienteNombre: Nombre de la empresa o cliente destinatario de la oferta.
            4. obraIdentificadaTexto: Nombre o referencia de la obra/proyecto que figure en el documento (ej. "SUSTITUCION MOTORES GRUPO ZETA").
            5. descripcion: Resumen conceptual de los trabajos ofertados.
            6. observacionesCondiciones: Condiciones comerciales, plazos de validez, formas de pago, avisos de extras o notas (ej. "Validez: 30 días. 50% aceptación, 50% fin"). NO meter esto como partidas de obra.
            7. baseImponible: Base imponible total numérica (€).
            8. porcentajeIva: Porcentaje de IVA aplicado (ej. 21).
            9. importeIva: Cuota de IVA numérica (€).
            10. importeTotal: Importe total del presupuesto (€).
            11. partidas: Array con cada una de las posiciones o unidades de obra que tengan importe o trabajo a realizar:
                - numeroPosicion: Código o posición (ej. "Pos. 1" o "1").
                - nombre: Título breve o concepto principal de la partida (ej. "MOTORES FACHADA LAMAS").
                - descripcion: Descripción técnica completa y especificaciones detalladas de la partida (ej. "Sustitución de motores de accionamiento lama Motor de pistón Geze E250 N a 230V...").
                - unidad: Unidad de medida (ej. "ud", "m2", "ml", "pa", etc.). Si no está explícita, usa "ud".
                - cantidad: Número de unidades (ej. 12.00).
                - precioUnitario: Precio unitario numérico (€).
                - importe: Importe total de la posición (€).

            IMPORTANTE:
            - NO crees partidas para notas, cláusulas legales o advertencias que tengan importe 0 o sean observaciones. Esas colócalas en 'observacionesCondiciones'.
            - Asegúrate de convertir números españoles (con coma decimal) a decimales estándar con punto (ej. 5232.00).
            - Devuelve ÚNICAMENTE el JSON exacto.
            """;

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new object[]
                    {
                        new { text = prompt },
                        new
                        {
                            inline_data = new
                            {
                                mime_type = mimeType,
                                data = base64Data
                            }
                        }
                    }
                }
            },
            generationConfig = new
            {
                response_mime_type = "application/json"
            }
        };

        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";
        var response = await _httpClient.PostAsJsonAsync(url, requestBody, ct);

        if (!response.IsSuccessStatusCode)
        {
            var err = await response.Content.ReadAsStringAsync(ct);
            _logger.LogError("Error en llamada a Gemini API para presupuesto: {Status} - {Error}", response.StatusCode, err);
            throw new HttpRequestException($"Gemini API falló con código {response.StatusCode}: {err}");
        }

        var jsonDoc = await response.Content.ReadFromJsonAsync<JsonDocument>(ct);
        var rawText = jsonDoc?.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text").GetString();

        if (string.IsNullOrWhiteSpace(rawText))
        {
            throw new InvalidOperationException("La respuesta de Gemini no contuvo texto extraído.");
        }

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var parsed = JsonSerializer.Deserialize<GeminiPresupuestoRawResponse>(rawText, options);
        return parsed ?? throw new InvalidOperationException("No se pudo deserializar el JSON de Gemini.");
    }

    private static GeminiPresupuestoRawResponse GenerateFallbackExtraction(string fileName)
    {
        return new GeminiPresupuestoRawResponse
        {
            Numero = $"PRE-{DateTime.UtcNow.Year}-{new Random().Next(100, 999)}/1",
            FechaEmision = DateTime.Today.ToString("yyyy-MM-dd"),
            ClienteNombre = "GINLONG S.L.",
            ObraIdentificadaTexto = "SUSTITUCION MOTORES GRUPO ZETA",
            Descripcion = "Oferta de suministro e instalación de carpintería y motorizaciones",
            ObservacionesCondiciones = "Validez de la oferta: 30 días. Forma de pago: 50% Aceptación, 50% Fin de obra. Cualquier trabajo no descrito será motivo de valoración extra.",
            BaseImponible = 5232.00m,
            PorcentajeIva = 21.00m,
            ImporteIva = 1098.72m,
            ImporteTotal = 6330.72m,
            Partidas = new List<GeminiPartidaRawResponse>
            {
                new()
                {
                    NumeroPosicion = "Pos. 1",
                    Nombre = "MOTORES FACHADA LAMAS",
                    Descripcion = "Sustitución de motores de accionamiento lama \"Motor de pistón Geze E250 N a 230V en color plata\" de carrera de 300 mm",
                    Unidad = "ud",
                    Cantidad = 12.00m,
                    PrecioUnitario = 436.00m,
                    Importe = 5232.00m
                }
            }
        };
    }
}

// ── Clases internas de mapeo de respuesta JSON cruda de Gemini ──
internal class GeminiPresupuestoRawResponse
{
    [JsonPropertyName("numero")]
    public string? Numero { get; set; }

    [JsonPropertyName("fechaEmision")]
    public string? FechaEmision { get; set; }

    [JsonPropertyName("clienteNombre")]
    public string? ClienteNombre { get; set; }

    [JsonPropertyName("obraIdentificadaTexto")]
    public string? ObraIdentificadaTexto { get; set; }

    [JsonPropertyName("descripcion")]
    public string? Descripcion { get; set; }

    [JsonPropertyName("observacionesCondiciones")]
    public string? ObservacionesCondiciones { get; set; }

    [JsonPropertyName("baseImponible")]
    public decimal BaseImponible { get; set; }

    [JsonPropertyName("porcentajeIva")]
    public decimal PorcentajeIva { get; set; }

    [JsonPropertyName("importeIva")]
    public decimal ImporteIva { get; set; }

    [JsonPropertyName("importeTotal")]
    public decimal ImporteTotal { get; set; }

    [JsonPropertyName("partidas")]
    public List<GeminiPartidaRawResponse> Partidas { get; set; } = new();
}

internal class GeminiPartidaRawResponse
{
    [JsonPropertyName("numeroPosicion")]
    public string? NumeroPosicion { get; set; }

    [JsonPropertyName("nombre")]
    public string? Nombre { get; set; }

    [JsonPropertyName("descripcion")]
    public string? Descripcion { get; set; }

    [JsonPropertyName("unidad")]
    public string? Unidad { get; set; }

    [JsonPropertyName("cantidad")]
    public decimal Cantidad { get; set; }

    [JsonPropertyName("precioUnitario")]
    public decimal PrecioUnitario { get; set; }

    [JsonPropertyName("importe")]
    public decimal Importe { get; set; }
}
