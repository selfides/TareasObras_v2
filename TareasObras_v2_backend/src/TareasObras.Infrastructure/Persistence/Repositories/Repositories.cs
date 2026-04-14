using Microsoft.EntityFrameworkCore;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Entities;

namespace TareasObras.Infrastructure.Persistence.Repositories;

public class ObraRepository : IObraRepository
{
    private readonly AppDbContext _ctx;
    public ObraRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Obra?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.Obras.Include(o => o.Tareas).FirstOrDefaultAsync(o => o.Id == id, ct);

    public async Task<Obra?> GetByCodigoAsync(string codigo, CancellationToken ct = default)
        => await _ctx.Obras.FirstOrDefaultAsync(o => o.Codigo == codigo.ToUpper(), ct);

    public async Task<IEnumerable<Obra>> GetAllAsync(CancellationToken ct = default)
        => await _ctx.Obras.Include(o => o.Tareas).OrderBy(o => o.Codigo).ToListAsync(ct);

    public async Task<IEnumerable<Obra>> GetFilteredAsync(string? search, string? estado, CancellationToken ct = default)
    {
        var query = _ctx.Obras.Include(o => o.Tareas).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(o => o.Nombre.Contains(search) || o.Codigo.Contains(search) || (o.Cliente != null && o.Cliente.Contains(search)));
        if (!string.IsNullOrWhiteSpace(estado) && Enum.TryParse<Domain.Enums.EstadoObra>(estado, out var estadoEnum))
            query = query.Where(o => o.Estado == estadoEnum);
        return await query.OrderByDescending(o => o.CreatedAt).ToListAsync(ct);
    }

    public async Task AddAsync(Obra obra, CancellationToken ct = default) => await _ctx.Obras.AddAsync(obra, ct);
    public void Update(Obra obra) => _ctx.Obras.Update(obra);
    public void Delete(Obra obra) => _ctx.Obras.Remove(obra);
}

public class TareaRepository : ITareaRepository
{
    private readonly AppDbContext _ctx;
    public TareaRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Tarea?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.Tareas.Include(t => t.Cuadrilla).FirstOrDefaultAsync(t => t.Id == id, ct);

    public async Task<IEnumerable<Tarea>> GetAllAsync(CancellationToken ct = default)
        => await _ctx.Tareas.Include(t => t.Cuadrilla).Include(t => t.Obra)
            .OrderBy(t => t.Prioridad).ThenBy(t => t.FechaLimite).ToListAsync(ct);

    public async Task<IEnumerable<Tarea>> GetByObraIdAsync(Guid obraId, CancellationToken ct = default)
        => await _ctx.Tareas.Include(t => t.Cuadrilla).Include(t => t.LineaPartida).Where(t => t.ObraId == obraId)
            .OrderBy(t => t.Prioridad).ThenBy(t => t.FechaLimite).ToListAsync(ct);

    public async Task<IEnumerable<Tarea>> GetByUsuarioIdAsync(string usuarioId, CancellationToken ct = default)
        => await _ctx.Tareas.Include(t => t.Obra)
            .Where(t => t.UsuarioAsignadoId.HasValue && t.UsuarioAsignadoId.ToString() == usuarioId)
            .OrderByDescending(t => t.Prioridad).ToListAsync(ct);

    public async Task<IEnumerable<Tarea>> GetByFechaAsync(DateTime fecha, CancellationToken ct = default)
        => await _ctx.Tareas.Include(t => t.Cuadrilla).Include(t => t.Obra)
            .Where(t => t.CreatedAt.Date == fecha.Date)
            .OrderBy(t => t.Prioridad).ThenBy(t => t.FechaLimite).ToListAsync(ct);

    public async Task AddAsync(Tarea tarea, CancellationToken ct = default) => await _ctx.Tareas.AddAsync(tarea, ct);
    public void Update(Tarea tarea) => _ctx.Tareas.Update(tarea);
    public void Delete(Tarea tarea) => _ctx.Tareas.Remove(tarea);
}

public class CuadrillaRepository : ICuadrillaRepository
{
    private readonly AppDbContext _ctx;
    public CuadrillaRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Cuadrilla?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.Cuadrillas.FirstOrDefaultAsync(c => c.Id == id, ct);

    public async Task<IEnumerable<Cuadrilla>> GetAllAsync(CancellationToken ct = default)
        => await _ctx.Cuadrillas.OrderBy(c => c.Nombre).ToListAsync(ct);

    public async Task AddAsync(Cuadrilla cuadrilla, CancellationToken ct = default) => await _ctx.Cuadrillas.AddAsync(cuadrilla, ct);
    public void Update(Cuadrilla cuadrilla) => _ctx.Cuadrillas.Update(cuadrilla);
}

public class CategoriaOperarioRepository : ICategoriaOperarioRepository
{
    private readonly AppDbContext _ctx;
    public CategoriaOperarioRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<CategoriaOperario?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.CategoriasOperario.Include(c => c.Operarios).FirstOrDefaultAsync(c => c.Id == id, ct);

    public async Task<IEnumerable<CategoriaOperario>> GetAllAsync(CancellationToken ct = default)
        => await _ctx.CategoriasOperario.Include(c => c.Operarios).OrderBy(c => c.Nombre).ToListAsync(ct);

    public async Task AddAsync(CategoriaOperario cat, CancellationToken ct = default) => await _ctx.CategoriasOperario.AddAsync(cat, ct);
    public void Update(CategoriaOperario cat) => _ctx.CategoriasOperario.Update(cat);
    public void Delete(CategoriaOperario cat) => _ctx.CategoriasOperario.Remove(cat);
}

public class OperarioRepository : IOperarioRepository
{
    private readonly AppDbContext _ctx;
    public OperarioRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Operario?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.Operarios.Include(o => o.Categoria).Include(o => o.Cuadrilla).FirstOrDefaultAsync(o => o.Id == id, ct);

    public async Task<IEnumerable<Operario>> GetAllAsync(CancellationToken ct = default)
        => await _ctx.Operarios.OrderBy(o => o.Apellidos).ToListAsync(ct);

    public async Task<IEnumerable<Operario>> GetAllWithDetailsAsync(CancellationToken ct = default)
        => await _ctx.Operarios.Include(o => o.Categoria).Include(o => o.Cuadrilla).OrderBy(o => o.Apellidos).ToListAsync(ct);

    public async Task AddAsync(Operario op, CancellationToken ct = default) => await _ctx.Operarios.AddAsync(op, ct);
    public void Update(Operario op) => _ctx.Operarios.Update(op);
    public void Delete(Operario op) => _ctx.Operarios.Remove(op);
}

public class RegistroHorasRepository : IRegistroHorasRepository
{
    private readonly AppDbContext _ctx;
    public RegistroHorasRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Domain.Entities.RegistroHoras?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.RegistrosHoras.Include(r => r.Operario).Include(r => r.Categoria).Include(r => r.Tarea).FirstOrDefaultAsync(r => r.Id == id, ct);

    public async Task<IEnumerable<Domain.Entities.RegistroHoras>> GetAllAsync(CancellationToken ct = default)
        => await _ctx.RegistrosHoras.Include(r => r.Operario).Include(r => r.Categoria).Include(r => r.Obra).Include(r => r.Tarea)
            .OrderByDescending(r => r.Fecha).ToListAsync(ct);

    public async Task<IEnumerable<Domain.Entities.RegistroHoras>> GetByObraIdAsync(Guid obraId, CancellationToken ct = default)
        => await _ctx.RegistrosHoras.Include(r => r.Operario).Include(r => r.Categoria).Include(r => r.Tarea)
            .Where(r => r.ObraId == obraId).OrderByDescending(r => r.Fecha).ToListAsync(ct);

    public async Task<IEnumerable<Domain.Entities.RegistroHoras>> GetByFechaAsync(DateTime fecha, CancellationToken ct = default)
        => await _ctx.RegistrosHoras.Include(r => r.Operario).Include(r => r.Categoria).Include(r => r.Obra).Include(r => r.Tarea)
            .Where(r => r.Fecha.Date == fecha.Date).OrderByDescending(r => r.Fecha).ToListAsync(ct);

    public async Task AddAsync(Domain.Entities.RegistroHoras reg, CancellationToken ct = default) => await _ctx.RegistrosHoras.AddAsync(reg, ct);
    public void Update(Domain.Entities.RegistroHoras reg) => _ctx.RegistrosHoras.Update(reg);
    public void Delete(Domain.Entities.RegistroHoras reg) => _ctx.RegistrosHoras.Remove(reg);
}

public class PresupuestoRepository : IPresupuestoRepository
{
    private readonly AppDbContext _ctx;
    public PresupuestoRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Presupuesto?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.Presupuestos.FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<Presupuesto?> GetByIdWithLinesAsync(Guid id, CancellationToken ct = default)
        => await _ctx.Presupuestos
            .Include(p => p.LineasMaterial)
            .Include(p => p.LineasHoras).ThenInclude(l => l.Categoria)
            .Include(p => p.Partidas).ThenInclude(p => p.Lineas)
            .FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<IEnumerable<Presupuesto>> GetByObraIdAsync(Guid obraId, CancellationToken ct = default)
        => await _ctx.Presupuestos
            .Include(p => p.LineasMaterial)
            .Include(p => p.LineasHoras).ThenInclude(l => l.Categoria)
            .Include(p => p.Partidas).ThenInclude(p => p.Lineas)
            .Where(p => p.ObraId == obraId).OrderByDescending(p => p.Version).ToListAsync(ct);

    public async Task<int> GetNextVersionAsync(Guid obraId, CancellationToken ct = default)
    {
        var max = await _ctx.Presupuestos.Where(p => p.ObraId == obraId).MaxAsync(p => (int?)p.Version, ct);
        return (max ?? 0) + 1;
    }

    public async Task AddAsync(Presupuesto p, CancellationToken ct = default) => await _ctx.Presupuestos.AddAsync(p, ct);
    public void Update(Presupuesto p) => _ctx.Presupuestos.Update(p);
    public void Delete(Presupuesto p) => _ctx.Presupuestos.Remove(p);
}

public class LineaPresupuestoMaterialRepository : ILineaPresupuestoMaterialRepository
{
    private readonly AppDbContext _ctx;
    public LineaPresupuestoMaterialRepository(AppDbContext ctx) => _ctx = ctx;
    public async Task AddAsync(LineaPresupuestoMaterial l, CancellationToken ct = default) => await _ctx.LineasPresupuestoMaterial.AddAsync(l, ct);
    public void Delete(LineaPresupuestoMaterial l) => _ctx.LineasPresupuestoMaterial.Remove(l);
}

public class LineaPresupuestoHorasRepository : ILineaPresupuestoHorasRepository
{
    private readonly AppDbContext _ctx;
    public LineaPresupuestoHorasRepository(AppDbContext ctx) => _ctx = ctx;
    public async Task AddAsync(LineaPresupuestoHoras l, CancellationToken ct = default) => await _ctx.LineasPresupuestoHoras.AddAsync(l, ct);
    public void Delete(LineaPresupuestoHoras l) => _ctx.LineasPresupuestoHoras.Remove(l);
}

public class MaterialObraRepository : IMaterialObraRepository
{
    private readonly AppDbContext _ctx;
    public MaterialObraRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<MaterialObra?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.MaterialesObra.FirstOrDefaultAsync(m => m.Id == id, ct);

    public async Task<IEnumerable<MaterialObra>> GetAllAsync(CancellationToken ct = default)
        => await _ctx.MaterialesObra.Include(m => m.Obra).Include(m => m.LineaPartida)
            .OrderByDescending(m => m.Fecha).ToListAsync(ct);

    public async Task<IEnumerable<MaterialObra>> GetByObraIdAsync(Guid obraId, CancellationToken ct = default)
        => await _ctx.MaterialesObra.Include(m => m.LineaPartida).Where(m => m.ObraId == obraId).OrderByDescending(m => m.Fecha).ToListAsync(ct);

    public async Task<IEnumerable<MaterialObra>> GetByFechaAsync(DateTime fecha, CancellationToken ct = default)
        => await _ctx.MaterialesObra.Include(m => m.Obra).Include(m => m.LineaPartida)
            .Where(m => m.Fecha.Date == fecha.Date)
            .OrderByDescending(m => m.Fecha).ToListAsync(ct);

    public async Task AddAsync(MaterialObra m, CancellationToken ct = default) => await _ctx.MaterialesObra.AddAsync(m, ct);
    public void Update(MaterialObra m) => _ctx.MaterialesObra.Update(m);
    public void Delete(MaterialObra m) => _ctx.MaterialesObra.Remove(m);
}

public class PartidaPresupuestoRepository : IPartidaPresupuestoRepository
{
    private readonly AppDbContext _ctx;
    public PartidaPresupuestoRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<PartidaPresupuesto?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.PartidasPresupuesto.Include(p => p.Lineas).ThenInclude(l => l.CategoriaOperario)
            .FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<IEnumerable<PartidaPresupuesto>> GetByPresupuestoIdAsync(Guid presupuestoId, CancellationToken ct = default)
        => await _ctx.PartidasPresupuesto.Include(p => p.Lineas).ThenInclude(l => l.CategoriaOperario)
            .Where(p => p.PresupuestoId == presupuestoId).OrderBy(p => p.Orden).ToListAsync(ct);

    public async Task AddAsync(PartidaPresupuesto p, CancellationToken ct = default) => await _ctx.PartidasPresupuesto.AddAsync(p, ct);
    public void Update(PartidaPresupuesto p) => _ctx.PartidasPresupuesto.Update(p);
    public void Delete(PartidaPresupuesto p) => _ctx.PartidasPresupuesto.Remove(p);
}

public class LineaPartidaRepository : ILineaPartidaRepository
{
    private readonly AppDbContext _ctx;
    public LineaPartidaRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<LineaPartida?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.LineasPartida.FirstOrDefaultAsync(l => l.Id == id, ct);

    public async Task AddAsync(LineaPartida l, CancellationToken ct = default) => await _ctx.LineasPartida.AddAsync(l, ct);
    public void Update(LineaPartida l) => _ctx.LineasPartida.Update(l);
    public void Delete(LineaPartida l) => _ctx.LineasPartida.Remove(l);
}

public class ProveedorRepository : IProveedorRepository
{
    private readonly AppDbContext _ctx;
    public ProveedorRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Proveedor?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.Proveedores.FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<IEnumerable<Proveedor>> GetAllAsync(CancellationToken ct = default)
        => await _ctx.Proveedores.OrderBy(p => p.Nombre).ToListAsync(ct);

    public async Task AddAsync(Proveedor p, CancellationToken ct = default) => await _ctx.Proveedores.AddAsync(p, ct);
    public void Update(Proveedor p) => _ctx.Proveedores.Update(p);
    public void Delete(Proveedor p) => _ctx.Proveedores.Remove(p);
}

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _ctx;

    public IObraRepository Obras { get; }
    public ITareaRepository Tareas { get; }
    public ICuadrillaRepository Cuadrillas { get; }
    public ICategoriaOperarioRepository CategoriasOperario { get; }
    public IOperarioRepository Operarios { get; }
    public IRegistroHorasRepository RegistrosHoras { get; }
    public IPresupuestoRepository Presupuestos { get; }
    public ILineaPresupuestoMaterialRepository LineasPresupuestoMaterial { get; }
    public ILineaPresupuestoHorasRepository LineasPresupuestoHoras { get; }
    public IMaterialObraRepository MaterialesObra { get; }
    public IPartidaPresupuestoRepository PartidasPresupuesto { get; }
    public ILineaPartidaRepository LineasPartida { get; }
    public IProveedorRepository Proveedores { get; }

    public UnitOfWork(AppDbContext ctx)
    {
        _ctx = ctx;
        Obras = new ObraRepository(ctx);
        Tareas = new TareaRepository(ctx);
        Cuadrillas = new CuadrillaRepository(ctx);
        CategoriasOperario = new CategoriaOperarioRepository(ctx);
        Operarios = new OperarioRepository(ctx);
        RegistrosHoras = new RegistroHorasRepository(ctx);
        Presupuestos = new PresupuestoRepository(ctx);
        LineasPresupuestoMaterial = new LineaPresupuestoMaterialRepository(ctx);
        LineasPresupuestoHoras = new LineaPresupuestoHorasRepository(ctx);
        MaterialesObra = new MaterialObraRepository(ctx);
        PartidasPresupuesto = new PartidaPresupuestoRepository(ctx);
        LineasPartida = new LineaPartidaRepository(ctx);
        Proveedores = new ProveedorRepository(ctx);
    }

    public Task<int> SaveChangesAsync(CancellationToken ct = default) => _ctx.SaveChangesAsync(ct);
}