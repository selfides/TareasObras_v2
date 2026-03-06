namespace TareasObras.Application.Common.Interfaces;

public record AuthResult(bool Success, string? Token, string? RefreshToken, string? Error, UserDto? User);

public record UserDto(string Id, string Email, string NombreCompleto, string Rol);

public interface IAuthService
{
    Task<AuthResult> LoginAsync(string email, string password, CancellationToken ct = default);
    Task<AuthResult> RegisterAsync(string email, string password, string nombre, string apellidos, string rol, CancellationToken ct = default);
    Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword, CancellationToken ct = default);
}
