using TareasObras.Domain.Entities;

namespace TareasObras.Application.Common.Interfaces;

public interface IObraRepository
{
    Task<Obra?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Obra?> GetByCodigoAsync(string codigo, CancellationToken ct = default);
    Task<IEnumerable<Obra>> GetAllAsync(CancellationToken ct = default);
    Task<IEnumerable<Obra>> GetFilteredAsync(string? search, string? estado, CancellationToken ct = default);
    Task AddAsync(Obra obra, CancellationToken ct = default);
    void Update(Obra obra);
    void Delete(Obra obra);
}

public interface ITareaRepository
{
    Task<Tarea?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Tarea>> GetAllAsync(CancellationToken ct = default);
    Task<IEnumerable<Tarea>> GetByObraIdAsync(Guid obraId, CancellationToken ct = default);
    Task<IEnumerable<Tarea>> GetByUsuarioIdAsync(string usuarioId, CancellationToken ct = default);
    Task<IEnumerable<Tarea>> GetByFechaAsync(DateTime fecha, CancellationToken ct = default);
    Task AddAsync(Tarea tarea, CancellationToken ct = default);
    void Update(Tarea tarea);
    void Delete(Tarea tarea);
}

public interface ICuadrillaRepository
{
    Task<Cuadrilla?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Cuadrilla>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(Cuadrilla cuadrilla, CancellationToken ct = default);
    void Update(Cuadrilla cuadrilla);
}

public interface ICategoriaOperarioRepository
{
    Task<CategoriaOperario?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<CategoriaOperario>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(CategoriaOperario categoria, CancellationToken ct = default);
    void Update(CategoriaOperario categoria);
    void Delete(CategoriaOperario categoria);
}

public interface IOperarioRepository
{
    Task<Operario?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Operario>> GetAllAsync(CancellationToken ct = default);
    Task<IEnumerable<Operario>> GetAllWithDetailsAsync(CancellationToken ct = default);
    Task AddAsync(Operario operario, CancellationToken ct = default);
    void Update(Operario operario);
    void Delete(Operario operario);
}

public interface IRegistroHorasRepository
{
    Task<RegistroHoras?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<RegistroHoras>> GetAllAsync(CancellationToken ct = default);
    Task<IEnumerable<RegistroHoras>> GetByObraIdAsync(Guid obraId, CancellationToken ct = default);
    Task<IEnumerable<RegistroHoras>> GetByFechaAsync(DateTime fecha, CancellationToken ct = default);
    Task AddAsync(RegistroHoras registro, CancellationToken ct = default);
    void Update(RegistroHoras registro);
    void Delete(RegistroHoras registro);
}

public interface IPresupuestoRepository
{
    Task<Presupuesto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Presupuesto?> GetByIdWithLinesAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Presupuesto>> GetByObraIdAsync(Guid obraId, CancellationToken ct = default);
    Task<int> GetNextVersionAsync(Guid obraId, CancellationToken ct = default);
    Task AddAsync(Presupuesto presupuesto, CancellationToken ct = default);
    void Update(Presupuesto presupuesto);
    void Delete(Presupuesto presupuesto);
}

public interface ILineaPresupuestoMaterialRepository
{
    Task AddAsync(LineaPresupuestoMaterial linea, CancellationToken ct = default);
    void Delete(LineaPresupuestoMaterial linea);
}

public interface ILineaPresupuestoHorasRepository
{
    Task AddAsync(LineaPresupuestoHoras linea, CancellationToken ct = default);
    void Delete(LineaPresupuestoHoras linea);
}

public interface IMaterialObraRepository
{
    Task<MaterialObra?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<MaterialObra>> GetAllAsync(CancellationToken ct = default);
    Task<IEnumerable<MaterialObra>> GetByObraIdAsync(Guid obraId, CancellationToken ct = default);
    Task<IEnumerable<MaterialObra>> GetByFechaAsync(DateTime fecha, CancellationToken ct = default);
    Task AddAsync(MaterialObra material, CancellationToken ct = default);
    void Update(MaterialObra material);
    void Delete(MaterialObra material);
}

public interface IPartidaPresupuestoRepository
{
    Task<PartidaPresupuesto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<PartidaPresupuesto>> GetByPresupuestoIdAsync(Guid presupuestoId, CancellationToken ct = default);
    Task AddAsync(PartidaPresupuesto partida, CancellationToken ct = default);
    void Update(PartidaPresupuesto partida);
    void Delete(PartidaPresupuesto partida);
}

public interface ILineaPartidaRepository
{
    Task<LineaPartida?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(LineaPartida linea, CancellationToken ct = default);
    void Update(LineaPartida linea);
    void Delete(LineaPartida linea);
}

public interface IProveedorRepository
{
    Task<Proveedor?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Proveedor>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(Proveedor proveedor, CancellationToken ct = default);
    void Update(Proveedor proveedor);
    void Delete(Proveedor proveedor);
}

public interface IUnitOfWork
{
    IObraRepository Obras { get; }
    ITareaRepository Tareas { get; }
    ICuadrillaRepository Cuadrillas { get; }
    ICategoriaOperarioRepository CategoriasOperario { get; }
    IOperarioRepository Operarios { get; }
    IRegistroHorasRepository RegistrosHoras { get; }
    IPresupuestoRepository Presupuestos { get; }
    ILineaPresupuestoMaterialRepository LineasPresupuestoMaterial { get; }
    ILineaPresupuestoHorasRepository LineasPresupuestoHoras { get; }
    IMaterialObraRepository MaterialesObra { get; }
    IPartidaPresupuestoRepository PartidasPresupuesto { get; }
    ILineaPartidaRepository LineasPartida { get; }
    IProveedorRepository Proveedores { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

public interface ICurrentUserService
{
    string? UserId { get; }
    string? UserName { get; }
    string? Role { get; }
    bool IsAuthenticated { get; }
}

public interface IAuditService
{
    Task LogAsync(string accion, string entidad, string? entidadId,
        object? valoresAnteriores = null, object? valoresNuevos = null,
        CancellationToken ct = default);
}