using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Enums;

namespace TareasObras.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NumeracionController : ControllerBase
{
    private readonly INumeracionService _numeracion;
    public NumeracionController(INumeracionService numeracion) => _numeracion = numeracion;

    /// <summary>Sugiere el próximo código libre sin consumirlo. Ej.: GET /api/numeracion/obra/siguiente</summary>
    [HttpGet("{tipo}/siguiente")]
    public async Task<IActionResult> Siguiente(string tipo, [FromQuery] Guid? ambitoId, CancellationToken ct)
    {
        if (!TryParseTipo(tipo, out var t)) return BadRequest(new { message = $"Tipo de numeración no válido: '{tipo}'." });
        var codigo = await _numeracion.PrevisualizarAsync(t, ambitoId, ct);
        return Ok(new { codigo });
    }

    /// <summary>Comprueba si un código está libre (incluye registros eliminados). Ej.: GET /api/numeracion/obra/disponible?codigo=OBR-2026-0001</summary>
    [HttpGet("{tipo}/disponible")]
    public async Task<IActionResult> Disponible(string tipo, [FromQuery] string codigo, CancellationToken ct)
    {
        if (!TryParseTipo(tipo, out var t)) return BadRequest(new { message = $"Tipo de numeración no válido: '{tipo}'." });
        return Ok(await _numeracion.ComprobarAsync(t, codigo, ct));
    }

    /// <summary>Formatos de numeración configurados.</summary>
    [HttpGet("configuracion")]
    public async Task<IActionResult> GetConfiguracion(CancellationToken ct)
        => Ok(await _numeracion.GetConfiguracionesAsync(ct));

    /// <summary>Modifica el formato de un tipo (solo Admin).</summary>
    [HttpPut("configuracion/{tipo}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateConfiguracion(string tipo, [FromBody] UpdateConfiguracionNumeracionRequest request, CancellationToken ct)
    {
        if (!TryParseTipo(tipo, out var t)) return BadRequest(new { message = $"Tipo de numeración no válido: '{tipo}'." });
        await _numeracion.ActualizarConfiguracionAsync(t, request.Formato, request.Relleno, request.ReinicioAnual, ct);
        return NoContent();
    }

    private static bool TryParseTipo(string tipo, out TipoNumeracion t)
        => Enum.TryParse(tipo, ignoreCase: true, out t) && Enum.IsDefined(t) && !int.TryParse(tipo, out _);
}

public record UpdateConfiguracionNumeracionRequest(string Formato, int Relleno, bool ReinicioAnual);
