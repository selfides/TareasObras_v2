using TareasObras.Domain.Common;
using TareasObras.Domain.Enums;

namespace TareasObras.Domain.Entities;

public class Obra : BaseEntity
{
    public string Codigo { get; private set; } = string.Empty;
    public string Nombre { get; private set; } = string.Empty;
    public string? Descripcion { get; private set; }
    public string? Direccion { get; private set; }
    public string? Cliente { get; private set; }
    public DateTime FechaInicio { get; private set; }
    public DateTime? FechaFinPrevista { get; private set; }
    public DateTime? FechaFinReal { get; private set; }
    public EstadoObra Estado { get; private set; } = EstadoObra.Planificada;
    public decimal PresupuestoEstimado { get; private set; }
    public decimal PresupuestoReal { get; private set; }

    // Navigation
    public ICollection<Tarea> Tareas { get; private set; } = new List<Tarea>();
    public ICollection<Presupuesto> Presupuestos { get; private set; } = new List<Presupuesto>();
    public ICollection<RegistroHoras> RegistrosHoras { get; private set; } = new List<RegistroHoras>();
    public ICollection<MaterialObra> Materiales { get; private set; } = new List<MaterialObra>();

    private Obra() { } // EF Core

    public static Obra Create(
        string codigo,
        string nombre,
        string? descripcion,
        string? direccion,
        string? cliente,
        DateTime fechaInicio,
        DateTime? fechaFinPrevista,
        decimal presupuestoEstimado)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(codigo);
        ArgumentException.ThrowIfNullOrWhiteSpace(nombre);

        return new Obra
        {
            Codigo = codigo.Trim().ToUpper(),
            Nombre = nombre.Trim(),
            Descripcion = descripcion?.Trim(),
            Direccion = direccion?.Trim(),
            Cliente = cliente?.Trim(),
            FechaInicio = fechaInicio,
            FechaFinPrevista = fechaFinPrevista,
            PresupuestoEstimado = presupuestoEstimado
        };
    }

    public void Update(
        string nombre,
        string? descripcion,
        string? direccion,
        string? cliente,
        DateTime fechaInicio,
        DateTime? fechaFinPrevista,
        decimal presupuestoEstimado)
    {
        Nombre = nombre.Trim();
        Descripcion = descripcion?.Trim();
        Direccion = direccion?.Trim();
        Cliente = cliente?.Trim();
        FechaInicio = fechaInicio;
        FechaFinPrevista = fechaFinPrevista;
        PresupuestoEstimado = presupuestoEstimado;
        UpdatedAt = DateTime.UtcNow;
    }

    public void CambiarEstado(EstadoObra nuevoEstado)
    {
        Estado = nuevoEstado;
        if (nuevoEstado == EstadoObra.Completada)
            FechaFinReal = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ActualizarPresupuestoReal(decimal importe)
    {
        PresupuestoReal += importe;
        UpdatedAt = DateTime.UtcNow;
    }
}
