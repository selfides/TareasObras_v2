using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TareasObras.Application.Common.Interfaces;

namespace TareasObras.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    /// <summary>Login y obtención de token JWT</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await _authService.LoginAsync(request.Email, request.Password, ct);
        if (!result.Success)
            return Unauthorized(new { message = result.Error });

        return Ok(new { token = result.Token, user = result.User });
    }

    /// <summary>Registro de nuevo usuario (solo Admin)</summary>
    [HttpPost("register")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        var result = await _authService.RegisterAsync(
            request.Email, request.Password, request.Nombre,
            request.Apellidos, request.Rol, ct);

        if (!result.Success)
            return BadRequest(new { message = result.Error });

        return Ok(new { message = "Usuario creado correctamente.", user = result.User });
    }

    /// <summary>Cambio de contraseña</summary>
    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken ct)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Unauthorized();

        var success = await _authService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword, ct);
        return success ? Ok(new { message = "Contraseña actualizada." }) : BadRequest(new { message = "Contraseña actual incorrecta." });
    }
}

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Email, string Password, string Nombre, string Apellidos, string Rol);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
