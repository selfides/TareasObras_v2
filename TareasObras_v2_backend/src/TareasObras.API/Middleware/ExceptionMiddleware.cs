using FluentValidation;
using System.Net;
using System.Text.Json;

namespace TareasObras.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        => (_next, _logger) = (next, logger);

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning("Validación fallida: {Errors}", ex.Message);
            await WriteResponse(context, HttpStatusCode.BadRequest, new
            {
                type = "ValidationError",
                errors = ex.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage })
            });
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning("Recurso no encontrado: {Message}", ex.Message);
            await WriteResponse(context, HttpStatusCode.NotFound, new
            {
                type = "NotFound",
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Operación inválida: {Message}", ex.Message);
            await WriteResponse(context, HttpStatusCode.Conflict, new
            {
                type = "Conflict",
                message = ex.Message
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            await WriteResponse(context, HttpStatusCode.Forbidden, new
            {
                type = "Forbidden",
                message = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error no controlado");
            await WriteResponse(context, HttpStatusCode.InternalServerError, new
            {
                type = "ServerError",
                message = "Ha ocurrido un error interno. Contacte con el administrador."
            });
        }
    }

    private static async Task WriteResponse(HttpContext ctx, HttpStatusCode status, object body)
    {
        ctx.Response.StatusCode = (int)status;
        ctx.Response.ContentType = "application/json";
        await ctx.Response.WriteAsync(JsonSerializer.Serialize(body,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}
