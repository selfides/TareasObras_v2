using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;

namespace TareasObras.Application.Features.Presupuestos.Commands;

public record LineaMaterialRequest(string Descripcion, string Unidad, decimal Cantidad, decimal PrecioUnitario);
public record LineaHorasRequest(Guid CategoriaOperarioId, decimal HorasEstimadas, decimal CosteHoraEstimado);

public record CreatePresupuestoCommand(Guid ObraId, string? Numero, DateTime Fecha, string? Descripcion, List<LineaMaterialRequest> LineasMaterial, List<LineaHorasRequest> LineasHoras) : IRequest<Guid>;
public record UpdatePresupuestoCommand(Guid Id, string? Numero, DateTime Fecha, string? Descripcion) : IRequest<bool>;
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

public class CreatePresupuestoHandler : IRequestHandler<CreatePresupuestoCommand, Guid>
{
    private readonly IUnitOfWork _uow;
    public CreatePresupuestoHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<Guid> Handle(CreatePresupuestoCommand r, CancellationToken ct)
    {
        var version = await _uow.Presupuestos.GetNextVersionAsync(r.ObraId, ct);
        var presupuesto = Presupuesto.Create(r.ObraId, r.Numero, version, r.Fecha, r.Descripcion);
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

            // Generar tareas para cada linea de mano de obra
            if (p.Partidas != null)
            {
                foreach (var partida in p.Partidas.Where(pt => !pt.IsDeleted))
                {
                    foreach (var linea in partida.Lineas.Where(l => !l.IsDeleted && l.Tipo == TipoLineaPartida.ManoObra))
                    {
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
                        
                        await _uow.Tareas.AddAsync(tarea, ct);
                    }
                }
            }
        }

        await _uow.SaveChangesAsync(ct);
        return true;
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
