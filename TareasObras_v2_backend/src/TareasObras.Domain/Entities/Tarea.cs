using TareasObras.Domain.Common;
using TareasObras.Domain.Enums;

namespace TareasObras.Domain.Entities;

public class Tarea : BaseEntity
{
    public Guid ObraId { get; private set; }
    public string Titulo { get; private set; } = string.Empty;
    public string? Descripcion { get; private set; }
    public EstadoTarea Estado { get; private set; } = EstadoTarea.Pendiente;
    public PrioridadTarea Prioridad { get; private set; } = PrioridadTarea.Media;
    public DateTime? FechaLimite { get; private set; }
    public decimal HorasEstimadas { get; private set; }
    public decimal HorasReales { get; private set; }
    public Guid? CuadrillaId { get; private set; }
    public Guid? UsuarioAsignadoId { get; private set; }
    public Guid? LineaPartidaId { get; private set; }
    public string? Observaciones { get; private set; }

    // Navigation
    public Obra Obra { get; private set; } = null!;
    public Cuadrilla? Cuadrilla { get; private set; }
    public LineaPartida? LineaPartida { get; private set; }

    private Tarea() { } // EF Core

    public static Tarea Create(
        Guid obraId,
        string titulo,
        string? descripcion,
        PrioridadTarea prioridad,
        DateTime? fechaLimite,
        decimal horasEstimadas,
        Guid? cuadrillaId = null,
        Guid? usuarioAsignadoId = null,
        Guid? lineaPartidaId = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(titulo);

        return new Tarea
        {
            ObraId = obraId,
            Titulo = titulo.Trim(),
            Descripcion = descripcion?.Trim(),
            Prioridad = prioridad,
            FechaLimite = fechaLimite,
            HorasEstimadas = horasEstimadas,
            CuadrillaId = cuadrillaId,
            UsuarioAsignadoId = usuarioAsignadoId,
            LineaPartidaId = lineaPartidaId
        };
    }

    public void Update(
        string titulo,
        string? descripcion,
        PrioridadTarea prioridad,
        DateTime? fechaLimite,
        decimal horasEstimadas,
        Guid? cuadrillaId,
        Guid? usuarioAsignadoId)
    {
        Titulo = titulo.Trim();
        Descripcion = descripcion?.Trim();
        Prioridad = prioridad;
        FechaLimite = fechaLimite;
        HorasEstimadas = horasEstimadas;
        CuadrillaId = cuadrillaId;
        UsuarioAsignadoId = usuarioAsignadoId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void CambiarEstado(EstadoTarea nuevoEstado, string? observaciones = null)
    {
        Estado = nuevoEstado;
        if (observaciones is not null)
            Observaciones = observaciones;
        UpdatedAt = DateTime.UtcNow;
    }

    public void CambiarPrioridad(PrioridadTarea nuevaPrioridad)
    {
        Prioridad = nuevaPrioridad;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RegistrarHoras(decimal horas)
    {
        HorasReales += horas;
        UpdatedAt = DateTime.UtcNow;
    }
}
