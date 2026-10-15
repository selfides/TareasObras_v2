using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Infrastructure.Persistence;

namespace TareasObras.Infrastructure.Identity;

public class AuthService : IAuthService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IConfiguration _config;
    private readonly Persistence.AppDbContext _db;

    public AuthService(UserManager<AppUser> userManager, IConfiguration config, Persistence.AppDbContext db)
        => (_userManager, _config, _db) = (userManager, config, db);

    public async Task<AuthResult> LoginAsync(string email, string password, CancellationToken ct = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null || !user.Activo)
            return new AuthResult(false, null, null, "Credenciales incorrectas.", null);

        if (!await _userManager.CheckPasswordAsync(user, password))
            return new AuthResult(false, null, null, "Credenciales incorrectas.", null);

        var roles = await _userManager.GetRolesAsync(user);
        var rol = roles.FirstOrDefault() ?? "Operario";

        // Auto-vincular con Operario si aún no tiene OperarioId asignado
        if (!user.OperarioId.HasValue)
        {
            var op = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.FirstOrDefaultAsync(
                _db.Operarios, 
                o => (o.Nombre == user.Nombre && o.Apellidos == user.Apellidos) || o.UserId == user.Id, 
                ct);

            if (op != null)
            {
                user.OperarioId = op.Id;
                if (string.IsNullOrEmpty(op.UserId))
                {
                    op.VincularUsuario(user.Id);
                }
                await _userManager.UpdateAsync(user);
                await _db.SaveChangesAsync(ct);
            }
        }

        var token = GenerateJwtToken(user, rol);
        var userDto = new UserDto(user.Id, user.Email!, $"{user.Nombre} {user.Apellidos}", rol, user.OperarioId);
        return new AuthResult(true, token, null, null, userDto);
    }


    public async Task<AuthResult> RegisterAsync(string email, string password, string nombre,
        string apellidos, string rol, CancellationToken ct = default)
    {
        var existing = await _userManager.FindByEmailAsync(email);
        if (existing is not null)
            return new AuthResult(false, null, null, "El email ya está registrado.", null);

        var user = new AppUser
        {
            UserName = email,
            Email = email,
            Nombre = nombre,
            Apellidos = apellidos,
            Activo = true
        };

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return new AuthResult(false, null, null, errors, null);
        }

        await _userManager.AddToRoleAsync(user, rol);
        var token = GenerateJwtToken(user, rol);
        var userDto = new UserDto(user.Id, email, $"{nombre} {apellidos}", rol);
        return new AuthResult(true, token, null, null, userDto);
    }

    public async Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword, CancellationToken ct = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) return false;
        var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        return result.Succeeded;
    }

    private string GenerateJwtToken(AppUser user, string rol)
    {
        var jwtSettings = _config.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(ClaimTypes.Name, $"{user.Nombre} {user.Apellidos}"),
            new Claim(ClaimTypes.Role, rol),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        if (user.OperarioId.HasValue)
        {
            claims.Add(new Claim("operario_id", user.OperarioId.Value.ToString()));
        }

        var token = new JwtSecurityToken(

            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(double.Parse(jwtSettings["ExpiresInHours"] ?? "8")),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
