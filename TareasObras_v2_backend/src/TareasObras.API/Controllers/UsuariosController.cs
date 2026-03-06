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
            .Where(u => u.Activo)
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
}
