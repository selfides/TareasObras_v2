using TareasObras.Domain.Common;

namespace TareasObras.Domain.Entities;

public class Proveedor : BaseEntity
{
    public string Nombre { get; private set; } = string.Empty;
    public string? CifNif { get; private set; }
    public string? Direccion { get; private set; }
    public string? Telefono { get; private set; }
    public string? Email { get; private set; }
    public string? Observaciones { get; private set; }

    private Proveedor() { }

    public static Proveedor Create(string nombre, string? cifNif, string? direccion, string? telefono, string? email, string? observaciones = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(nombre);

        return new Proveedor
        {
            Nombre = nombre.Trim(),
            CifNif = cifNif?.Trim(),
            Direccion = direccion?.Trim(),
            Telefono = telefono?.Trim(),
            Email = email?.Trim(),
            Observaciones = observaciones?.Trim()
        };
    }

    public void Update(string nombre, string? cifNif, string? direccion, string? telefono, string? email, string? observaciones)
    {
        Nombre = nombre.Trim();
        CifNif = cifNif?.Trim();
        Direccion = direccion?.Trim();
        Telefono = telefono?.Trim();
        Email = email?.Trim();
        Observaciones = observaciones?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }
}
