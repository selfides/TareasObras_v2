using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;

namespace TareasObras.Application.Features.Presupuestos.Commands;

public record LineaMaterialRequest(string Descripcion, string Unidad, decimal Cantidad, decimal PrecioUnitario);
public record LineaHorasRequest(Guid CategoriaOperarioId, decimal HorasEstimadas, decimal CosteHoraEstimado);

public record CreatePresupuestoCommand(Guid ObraId, string? Numero, DateTime Fecha, string? Descripcion, List<LineaMaterialRequest> LineasMaterial, List<LineaHorasRequest> LineasHoras) : IRequest<Guid>;
public record UpdatePresupuestoCommand(Guid Id, string? Numero, DateTime Fecha, string? Descripcion) : IRequest<bool>;
public record AplicarBeneficioGlobalCommand(Guid Id, decimal ImporteBeneficioGlobal) : IRequest<bool>;
public record AprobarPresupuestoCommand(Guid Id) : IRequest<bool>;
public record DeletePresupuestoCommand(Guid Id) : IRequest<bool>;

public class UpdatePresupuestoHandler : IRequestHandler<UpdatePresupuestoCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public UpdatePresupuestoHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(UpdatePresupuestoCommand r, CancellationToken ct)
    {
        var p = await _uow.Presupuestos.GetByIdAsync(r.Id, ct);
        if (p is null) return false;
        
        p.Update(r.Numero, r.Fecha, r.Descripcion);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

public class AplicarBeneficioGlobalHandler : IRequestHandler<AplicarBeneficioGlobalCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public AplicarBeneficioGlobalHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(AplicarBeneficioGlobalCommand r, CancellationToken ct)
    {
        var p = await _uow.Presupuestos.GetByIdWithLinesAsync(r.Id, ct);
        if (p is null) return false;

        p.AplicarBeneficioGlobal(r.ImporteBeneficioGlobal);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

public class CreatePresupuestoHandler : IRequestHandler<CreatePresupuestoCommand, Guid>
{
    private readonly IUnitOfWork _uow;
    private readonly INumeracionService _numeracion;
    public CreatePresupuestoHandler(IUnitOfWork uow, INumeracionService numeracion)
        => (_uow, _numeracion) = (uow, numeracion);

    public async Task<Guid> Handle(CreatePresupuestoCommand r, CancellationToken ct)
    {
        var numero = string.IsNullOrWhiteSpace(r.Numero)
            ? await _numeracion.ReservarAsync(Domain.Enums.TipoNumeracion.Presupuesto, null, ct)
            : r.Numero.Trim();

        var version = await _uow.Presupuestos.GetNextVersionAsync(r.ObraId, ct);
        var presupuesto = Presupuesto.Create(r.ObraId, numero, version, r.Fecha, r.Descripcion);
        await _uow.Presupuestos.AddAsync(presupuesto, ct);
        await _uow.SaveChangesAsync(ct);

        foreach (var l in r.LineasMaterial)
        {
            var linea = LineaPresupuestoMaterial.Create(presupuesto.Id, l.Descripcion, l.Unidad, l.Cantidad, l.PrecioUnitario);
            await _uow.LineasPresupuestoMaterial.AddAsync(linea, ct);
        }
        foreach (var l in r.LineasHoras)
        {
            var linea = LineaPresupuestoHoras.Create(presupuesto.Id, l.CategoriaOperarioId, l.HorasEstimadas, l.CosteHoraEstimado);
            await _uow.LineasPresupuestoHoras.AddAsync(linea, ct);
        }
        await _uow.SaveChangesAsync(ct);
        return presupuesto.Id;
    }
}

public class AprobarPresupuestoHandler : IRequestHandler<AprobarPresupuestoCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public AprobarPresupuestoHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(AprobarPresupuestoCommand r, CancellationToken ct)
    {
        var p = await _uow.Presupuestos.GetByIdWithLinesAsync(r.Id, ct);
        if (p is null) return false;
        
        if (p.Estado != Domain.Enums.EstadoPresupuesto.Aprobado)
        {
            p.Aprobar();
            await PresupuestoTaskGenerator.GenerarTareasDesdePartidas(p, _uow, ct);
        }

        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

public record GenerarTareasPresupuestoCommand(Guid PresupuestoId) : IRequest<int>;

public class GenerarTareasPresupuestoHandler : IRequestHandler<GenerarTareasPresupuestoCommand, int>
{
    private readonly IUnitOfWork _uow;
    public GenerarTareasPresupuestoHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<int> Handle(GenerarTareasPresupuestoCommand r, CancellationToken ct)
    {
        var p = await _uow.Presupuestos.GetByIdWithLinesAsync(r.PresupuestoId, ct);
        if (p is null || p.Estado != Domain.Enums.EstadoPresupuesto.Aprobado) return 0;

        var count = await PresupuestoTaskGenerator.GenerarTareasDesdePartidas(p, _uow, ct);
        await _uow.SaveChangesAsync(ct);
        return count;
    }
}

// Shared helper for task generation from budget partidas
file static class PresupuestoTaskGenerator
{
    public static async Task<int> GenerarTareasDesdePartidas(Presupuesto p, IUnitOfWork uow, CancellationToken ct)
    {
        if (p.Partidas is null) return 0;

        // Get existing tasks for this obra to avoid duplicates
        var tareasExistentes = await uow.Tareas.GetByObraIdAsync(p.ObraId, ct);
        var lineasConTarea = new HashSet<Guid>(
            tareasExistentes.Where(t => t.LineaPartidaId.HasValue).Select(t => t.LineaPartidaId!.Value));

        int count = 0;
        foreach (var partida in p.Partidas.Where(pt => !pt.IsDeleted))
        {
            foreach (var linea in partida.Lineas.Where(l => !l.IsDeleted && l.Tipo == TipoLineaPartida.ManoObra))
            {
                if (lineasConTarea.Contains(linea.Id)) continue; // skip if task already exists

                var nombreTarea = $"{partida.Nombre} - {linea.Descripcion}";
                if (nombreTarea.Length > 300) nombreTarea = nombreTarea.Substring(0, 300);

                var horasEstimadas = linea.Unidad.ToLower() == "h" ? linea.Cantidad : 0;

                var tarea = Tarea.Create(
                    p.ObraId, 
                    nombreTarea, 
                    $"Tarea generada automáticamente de la partida: {partida.Nombre}. Línea: {linea.Descripcion}", 
                    Domain.Enums.PrioridadTarea.Media, 
                    null, 
                    horasEstimadas,
                    null,
                    null,
                    linea.Id
                );
                
                await uow.Tareas.AddAsync(tarea, ct);
                count++;
            }
        }
        return count;
    }
}


public class DeletePresupuestoHandler : IRequestHandler<DeletePresupuestoCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public DeletePresupuestoHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(DeletePresupuestoCommand r, CancellationToken ct)
    {
        var p = await _uow.Presupuestos.GetByIdAsync(r.Id, ct);
        if (p is null) return false;
        _uow.Presupuestos.Delete(p);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

public record PartidaImportarRequest(
    string Nombre,
    string? Descripcion,
    int Orden,
    string Unidad,
    decimal Cantidad,
    decimal PrecioUnitario,
    bool GenerarTareaKanban,
    decimal ImporteBeneficioMaterial = 0
);

public record ImportarPresupuestoEscaneadoCommand(
    Guid ObraId,
    string? Numero,
    DateTime Fecha,
    string? Descripcion,
    string? ObservacionesCondiciones,
    bool AprobarInmediatamente,
    string? DocumentoTemporalUrl,
    List<PartidaImportarRequest> Partidas
) : IRequest<Guid>;

public class ImportarPresupuestoEscaneadoHandler : IRequestHandler<ImportarPresupuestoEscaneadoCommand, Guid>
{
    private readonly IUnitOfWork _uow;
    private readonly INumeracionService _numeracion;
    public ImportarPresupuestoEscaneadoHandler(IUnitOfWork uow, INumeracionService numeracion)
        => (_uow, _numeracion) = (uow, numeracion);

    public async Task<Guid> Handle(ImportarPresupuestoEscaneadoCommand r, CancellationToken ct)
    {
        var numero = string.IsNullOrWhiteSpace(r.Numero)
            ? await _numeracion.ReservarAsync(Domain.Enums.TipoNumeracion.Presupuesto, null, ct)
            : r.Numero.Trim();

        var version = await _uow.Presupuestos.GetNextVersionAsync(r.ObraId, ct);

        var descripcionCompleta = r.Descripcion;
        if (!string.IsNullOrWhiteSpace(r.ObservacionesCondiciones))
        {
            descripcionCompleta = string.IsNullOrWhiteSpace(descripcionCompleta)
                ? $"Condiciones: {r.ObservacionesCondiciones}"
                : $"{descripcionCompleta}\n\nCondiciones: {r.ObservacionesCondiciones}";
        }

        var presupuesto = Presupuesto.Create(r.ObraId, numero, version, r.Fecha, descripcionCompleta);
        if (r.AprobarInmediatamente)
        {
            presupuesto.Aprobar();
        }

        await _uow.Presupuestos.AddAsync(presupuesto, ct);
        await _uow.SaveChangesAsync(ct);

        int orden = 1;
        foreach (var p in r.Partidas)
        {
            var partida = PartidaPresupuesto.Create(presupuesto.Id, p.Nombre, p.Descripcion, p.Orden > 0 ? p.Orden : orden++, p.ImporteBeneficioMaterial);
            await _uow.PartidasPresupuesto.AddAsync(partida, ct);
            await _uow.SaveChangesAsync(ct);

            // Crear línea representativa de la unidad de obra completa
            var linea = LineaPartida.CreateMaterial(
                partida.Id,
                string.IsNullOrWhiteSpace(p.Descripcion) ? p.Nombre : p.Descripcion,
                string.IsNullOrWhiteSpace(p.Unidad) ? "ud" : p.Unidad,
                p.Cantidad > 0 ? p.Cantidad : 1m,
                p.PrecioUnitario
            );
            await _uow.LineasPartida.AddAsync(linea, ct);
            await _uow.SaveChangesAsync(ct);

            // Generar tarea en Kanban si está seleccionado
            if (p.GenerarTareaKanban)
            {
                var nombreTarea = p.Nombre;
                if (!string.IsNullOrWhiteSpace(p.Descripcion))
                {
                    nombreTarea = $"{p.Nombre} - {p.Descripcion}";
                }
                if (nombreTarea.Length > 290)
                {
                    nombreTarea = nombreTarea[..290] + "...";
                }

                var tarea = Tarea.Create(
                    r.ObraId,
                    nombreTarea,
                    $"Tarea generada desde el presupuesto {presupuesto.Numero ?? "S/N"}. Posición: {p.Nombre}. Cantidad: {p.Cantidad} {p.Unidad}.",
                    Domain.Enums.PrioridadTarea.Media,
                    null,
                    0,
                    null,
                    null,
                    linea.Id
                );
                await _uow.Tareas.AddAsync(tarea, ct);
            }
        }

        await _uow.SaveChangesAsync(ct);
        return presupuesto.Id;
    }
}
