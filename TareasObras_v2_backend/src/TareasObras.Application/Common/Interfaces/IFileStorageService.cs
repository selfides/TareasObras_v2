namespace TareasObras.Application.Common.Interfaces;

public interface IFileStorageService
{
    /// <summary>
    /// Guarda un archivo a partir de un Stream y devuelve la ruta relativa accesible o identificador del archivo.
    /// </summary>
    Task<string> SaveFileAsync(Stream fileStream, string fileName, string subDirectory, CancellationToken ct = default);

    /// <summary>
    /// Obtiene el Stream de lectura de un archivo almacenado a partir de su ruta relativa.
    /// </summary>
    Task<Stream?> GetFileAsync(string relativePath, CancellationToken ct = default);

    /// <summary>
    /// Elimina un archivo físico almacenado si existe.
    /// </summary>
    Task<bool> DeleteFileAsync(string relativePath, CancellationToken ct = default);

    /// <summary>
    /// Comprueba si un archivo existe en el almacenamiento.
    /// </summary>
    Task<bool> FileExistsAsync(string relativePath, CancellationToken ct = default);

    /// <summary>
    /// Calcula el hash SHA-256 en formato hexadecimal del contenido del stream.
    /// </summary>
    Task<string> ComputeHashAsync(Stream fileStream, CancellationToken ct = default);
}
