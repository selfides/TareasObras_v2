using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Text.Json;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;
using TareasObras.Infrastructure.Persistence;

namespace TareasObras.Infrastructure.Audit;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        => _httpContextAccessor = httpContextAccessor;

    public string? UserId
        => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

    public string? UserName
        => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Name);

    public string? Role
        => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

    public bool IsAuthenticated
        => _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;
}

public class AuditService : IAuditService
{
    private readonly AppDbContext _ctx;
    private readonly ICurrentUserService _currentUser;

    public AuditService(AppDbContext ctx, ICurrentUserService currentUser)
        => (_ctx, _currentUser) = (ctx, currentUser);

    public async Task LogAsync(string accion, string entidad, string? entidadId,
        object? valoresAnteriores = null, object? valoresNuevos = null,
        CancellationToken ct = default)
    {
        var log = new AuditLog
        {
            UsuarioId = _currentUser.UserId ?? "system",
            UsuarioNombre = _currentUser.UserName ?? "system",
            Accion = accion,
            Entidad = entidad,
            EntidadId = entidadId,
            ValoresAnteriores = valoresAnteriores is not null
                ? JsonSerializer.Serialize(valoresAnteriores)
                : null,
            ValoresNuevos = valoresNuevos is not null
                ? JsonSerializer.Serialize(valoresNuevos)
                : null,
            FechaHora = DateTime.UtcNow
        };

        // Añadimos directamente al contexto sin llamar SaveChangesAsync aquí.
        // El SaveChanges del comando ya persiste todo en la misma transacción.
        await _ctx.AuditLogs.AddAsync(log, ct);
        await _ctx.SaveChangesAsync(ct);
    }
}
