using Microsoft.OpenApi;
using Serilog;
using TareasObras.API.Middleware;
using TareasObras.Application;
using TareasObras.Infrastructure;

// ─── Serilog bootstrap ─────────────────────────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // ─── Serilog ──────────────────────────────────────────────────────────
    builder.Host.UseSerilog((ctx, lc) => lc
        .ReadFrom.Configuration(ctx.Configuration)
        .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext}: {Message:lj}{NewLine}{Exception}")
        .WriteTo.File("logs/tareasObras-.log", rollingInterval: RollingInterval.Day));

    // ─── Layers ───────────────────────────────────────────────────────────
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

    // ─── API ──────────────────────────────────────────────────────────────
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();

    // ─── CORS ─────────────────────────────────────────────────────────────
    var configuredOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
    var allowedOrigins = new HashSet<string>(configuredOrigins, StringComparer.OrdinalIgnoreCase)
    {
        "http://localhost:4200",
        "https://tu-dominio.com"
    };

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("Frontend", policy =>
            policy.SetIsOriginAllowed(origin =>
                  {
                      if (string.IsNullOrWhiteSpace(origin)) return false;
                      if (allowedOrigins.Contains(origin)) return true;
                      if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri)) return false;

                      var host = uri.Host;
                      if (host.Equals("localhost", StringComparison.OrdinalIgnoreCase) || host == "127.0.0.1")
                          return true;

                      if (System.Net.IPAddress.TryParse(host, out var ip) &&
                          ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                      {
                          var bytes = ip.GetAddressBytes();
                          // Redes privadas RFC1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
                          return bytes[0] == 10 ||
                                 (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31) ||
                                 (bytes[0] == 192 && bytes[1] == 168);
                      }

                      return false;
                  })
                  .AllowAnyHeader()
                  .AllowAnyMethod());
    });

    // ─── Swagger con JWT ──────────────────────────────────────────────────
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "TareasObras API",
            Version = "v1",
            Description = "API para gestión de obras, tareas y documentos"
        });

        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Introduce el token JWT: Bearer {tu_token}"
        });

        c.AddSecurityRequirement(doc => new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecuritySchemeReference("Bearer", doc),
                new List<string>()
            }
        });
    });

    var app = builder.Build();

    // ─── Seed DB ──────────────────────────────────────────────────────────
    await DatabaseSeeder.SeedAsync(app.Services);

    // ─── Middleware pipeline ───────────────────────────────────────────────
    app.UseMiddleware<ExceptionMiddleware>();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "TareasObras API v1"));
    }

    app.UseSerilogRequestLogging();
    app.UseHttpsRedirection();
    app.UseCors("Frontend");
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    Log.Information("🚀 TareasObras API iniciando en {Env}", app.Environment.EnvironmentName);
    await app.RunAsync();
}
catch (HostAbortedException)
{
    throw;
}
catch (Exception ex)
{
    Log.Fatal(ex, "La aplicación falló al iniciar.");
}
finally
{
    Log.CloseAndFlush();
}
