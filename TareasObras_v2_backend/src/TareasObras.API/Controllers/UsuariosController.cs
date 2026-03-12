using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TareasObras.Infrastructure.Persistence;

namespace TareasObras.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsuariosController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;

    public UsuariosController(UserManager<AppUser> userManager)
        => _userManager = userManager;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var usuarios = await _userManager.Users
            .OrderBy(u => u.Nombre)
            .ToListAsync();

        var result = new List<object>();
        foreach (var u in usuarios)
        {
            var roles = await _userManager.GetRolesAsync(u);
            result.Add(new
            {
                id = u.Id,
                nombre = u.Nombre,
                apellidos = u.Apellidos,
                email = u.Email,
                rol = roles.FirstOrDefault() ?? "Operario",
                activo = u.Activo,
                createdAt = u.CreatedAt
            });
        }

        return Ok(result);
    }

    /// <summary>Actualizar usuario (solo Admin)</summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateUsuarioRequest request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return NotFound(new { message = "Usuario no encontrado." });

        user.Nombre = request.Nombre;
        user.Apellidos = request.Apellidos;
        user.Email = request.Email;
        user.UserName = request.Email;
        user.NormalizedEmail = request.Email.ToUpperInvariant();
        user.NormalizedUserName = request.Email.ToUpperInvariant();
        user.Activo = request.Activo;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return BadRequest(new { message = string.Join(", ", updateResult.Errors.Select(e => e.Description)) });

        // Actualizar rol
        var currentRoles = await _userManager.GetRolesAsync(user);
        if (currentRoles.Any())
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, request.Rol);

        return Ok(new { message = "Usuario actualizado correctamente." });
    }

    /// <summary>Eliminar usuario - soft delete (solo Admin)</summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (id == currentUserId)
            return BadRequest(new { message = "No puedes eliminarte a ti mismo." });

        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return NotFound(new { message = "Usuario no encontrado." });

        user.Activo = false;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(new { message = "No se pudo desactivar el usuario." });

        return Ok(new { message = "Usuario eliminado correctamente." });
    }
}

public record UpdateUsuarioRequest(string Nombre, string Apellidos, string Email, string Rol, bool Activo);
