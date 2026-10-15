using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using TareasObras.Application.Common.Interfaces;

namespace TareasObras.Infrastructure.Storage;

public class LocalFileStorageService : IFileStorageService
{
    private readonly string _basePath;
    private readonly ILogger<LocalFileStorageService> _logger;

    public LocalFileStorageService(IConfiguration config, ILogger<LocalFileStorageService> logger)
    {
        _logger = logger;
        var configPath = config["Storage:BasePath"] ?? "uploads";
        _basePath = Path.IsPathRooted(configPath)
            ? Path.GetFullPath(configPath)
            : Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), configPath));

        if (!Directory.Exists(_basePath))
        {
            Directory.CreateDirectory(_basePath);
            _logger.LogInformation("Directorio de almacenamiento de archivos creado en: {Path}", _basePath);
        }
    }

    public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string subDirectory, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var targetDir = Path.Combine(_basePath, subDirectory.Trim('/', '\\'), now.Year.ToString(), now.Month.ToString("D2"));
        if (!Directory.Exists(targetDir))
        {
            Directory.CreateDirectory(targetDir);
        }

        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        var cleanFileName = Path.GetFileNameWithoutExtension(fileName);
        // Sanitizar nombre de archivo
        cleanFileName = string.Join("_", cleanFileName.Split(Path.GetInvalidFileNameChars())).Replace(" ", "_");
        if (cleanFileName.Length > 40)
        {
            cleanFileName = cleanFileName[..40];
        }

        var uniqueName = $"{Guid.NewGuid():N}_{cleanFileName}{ext}";
        var fullFilePath = Path.Combine(targetDir, uniqueName);

        if (fileStream.CanSeek && fileStream.Position != 0)
        {
            fileStream.Position = 0;
        }

        await using (var outputStream = new FileStream(fullFilePath, FileMode.Create, FileAccess.Write, FileShare.None, 4096, useAsync: true))
        {
            await fileStream.CopyToAsync(outputStream, ct);
        }

        // Devolver ruta relativa normalizada con barras inclinadas
        var relativePath = Path.GetRelativePath(_basePath, fullFilePath).Replace('\\', '/');
        var publicPath = $"uploads/{relativePath}";
        _logger.LogInformation("Archivo guardado con éxito: {PublicPath}", publicPath);
        return publicPath;
    }

    public Task<Stream?> GetFileAsync(string relativePath, CancellationToken ct = default)
    {
        var fullPath = ResolveSafeFullPath(relativePath);
        if (!File.Exists(fullPath))
        {
            _logger.LogWarning("Archivo no encontrado en ruta: {FullPath}", fullPath);
            return Task.FromResult<Stream?>(null);
        }

        Stream stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
        return Task.FromResult<Stream?>(stream);
    }

    public Task<bool> DeleteFileAsync(string relativePath, CancellationToken ct = default)
    {
        try
        {
            var fullPath = ResolveSafeFullPath(relativePath);
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                _logger.LogInformation("Archivo eliminado: {FullPath}", fullPath);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar archivo: {RelativePath}", relativePath);
            return Task.FromResult(false);
        }
    }

    public Task<bool> FileExistsAsync(string relativePath, CancellationToken ct = default)
    {
        var fullPath = ResolveSafeFullPath(relativePath);
        return Task.FromResult(File.Exists(fullPath));
    }

    public async Task<string> ComputeHashAsync(Stream fileStream, CancellationToken ct = default)
    {
        long originalPosition = 0;
        if (fileStream.CanSeek)
        {
            originalPosition = fileStream.Position;
            fileStream.Position = 0;
        }

        using var sha256 = SHA256.Create();
        var hashBytes = await sha256.ComputeHashAsync(fileStream, ct);

        if (fileStream.CanSeek)
        {
            fileStream.Position = originalPosition;
        }

        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }

    private string ResolveSafeFullPath(string relativePath)
    {
        // Limpiar prefijo 'uploads/' si viene incluido
        var clean = relativePath.Trim().Replace('\\', '/');
        if (clean.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
        {
            clean = clean[8..];
        }
        clean = clean.TrimStart('/');

        var combined = Path.GetFullPath(Path.Combine(_basePath, clean));
        if (!combined.StartsWith(_basePath, StringComparison.OrdinalIgnoreCase))
        {
            throw new UnauthorizedAccessException("Intento de acceso a ruta no permitida fuera del directorio de subidas.");
        }

        return combined;
    }
}
