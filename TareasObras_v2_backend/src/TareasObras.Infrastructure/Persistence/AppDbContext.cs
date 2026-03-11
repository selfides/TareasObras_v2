using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Domain.Common;
using TareasObras.Domain.Entities;

namespace TareasObras.Infrastructure.Persistence;

// Extendemos IdentityUser para agregar datos del usuario
public class AppUser : IdentityUser
{
    public string Nombre { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class AppDbContext : IdentityDbContext<AppUser>
{
    private readonly ICurrentUserService _currentUser;

    public DbSet<Obra> Obras => Set<Obra>();
    public DbSet<Tarea> Tareas => Set<Tarea>();
    public DbSet<Cuadrilla> Cuadrillas => Set<Cuadrilla>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Operario> Operarios => Set<Operario>();
    public DbSet<CategoriaOperario> CategoriasOperario => Set<CategoriaOperario>();
    public DbSet<RegistroHoras> RegistrosHoras => Set<RegistroHoras>();
    public DbSet<Presupuesto> Presupuestos => Set<Presupuesto>();
    public DbSet<PartidaPresupuesto> PartidasPresupuesto { get; set; }
    public DbSet<LineaPartida> LineasPartida { get; set; }
    public DbSet<LineaPresupuestoMaterial> LineasPresupuestoMaterial => Set<LineaPresupuestoMaterial>();
    public DbSet<LineaPresupuestoHoras> LineasPresupuestoHoras => Set<LineaPresupuestoHoras>();
    public DbSet<MaterialObra> MaterialesObra => Set<MaterialObra>();
    public DbSet<Proveedor> Proveedores => Set<Proveedor>();

    public AppDbContext(DbContextOptions<AppDbContext> options, ICurrentUserService currentUser)
        : base(options)
    {
        _currentUser = currentUser;
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Renombrar tablas de Identity para mayor claridad
        builder.Entity<AppUser>().ToTable("Usuarios");
        builder.Entity<IdentityRole>().ToTable("Roles");
        builder.Entity<IdentityUserRole<string>>().ToTable("UsuarioRoles");
        builder.Entity<IdentityUserClaim<string>>().ToTable("UsuarioClaims");
        builder.Entity<IdentityUserLogin<string>>().ToTable("UsuarioLogins");
        builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
        builder.Entity<IdentityUserToken<string>>().ToTable("UsuarioTokens");

        // Soft delete global filter
        builder.Entity<Obra>().HasQueryFilter(o => !o.IsDeleted);
        builder.Entity<Tarea>().HasQueryFilter(t => !t.IsDeleted);
        builder.Entity<Cuadrilla>().HasQueryFilter(c => !c.IsDeleted);
        builder.Entity<Operario>().HasQueryFilter(o => !o.IsDeleted);
        builder.Entity<Presupuesto>().HasQueryFilter(p => !p.IsDeleted);
        builder.Entity<RegistroHoras>().HasQueryFilter(r => !r.IsDeleted);
        builder.Entity<MaterialObra>().HasQueryFilter(m => !m.IsDeleted);
        builder.Entity<Proveedor>().HasQueryFilter(p => !p.IsDeleted);

        // Presupuesto → Obra
        builder.Entity<Presupuesto>()
            .HasOne(p => p.Obra)
            .WithMany(o => o.Presupuestos)
            .HasForeignKey(p => p.ObraId)
            .OnDelete(DeleteBehavior.Cascade);

        // LineaPresupuestoMaterial → Presupuesto
        builder.Entity<LineaPresupuestoMaterial>()
            .HasOne(l => l.Presupuesto)
            .WithMany(p => p.LineasMaterial)
            .HasForeignKey(l => l.PresupuestoId)
            .OnDelete(DeleteBehavior.Cascade);

        // LineaPresupuestoHoras → Presupuesto + CategoriaOperario
        builder.Entity<LineaPresupuestoHoras>()
            .HasOne(l => l.Presupuesto)
            .WithMany(p => p.LineasHoras)
            .HasForeignKey(l => l.PresupuestoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<LineaPresupuestoHoras>()
            .HasOne(l => l.Categoria)
            .WithMany(c => c.LineasPresupuesto)
            .HasForeignKey(l => l.CategoriaOperarioId)
            .OnDelete(DeleteBehavior.Restrict);

        // Operario → CategoriaOperario
        builder.Entity<Operario>()
            .HasOne(o => o.Categoria)
            .WithMany(c => c.Operarios)
            .HasForeignKey(o => o.CategoriaOperarioId)
            .OnDelete(DeleteBehavior.Restrict);

        // Operario → Cuadrilla
        builder.Entity<Operario>()
            .HasOne(o => o.Cuadrilla)
            .WithMany(c => c.Operarios)
            .HasForeignKey(o => o.CuadrillaId)
            .OnDelete(DeleteBehavior.SetNull);

        // RegistroHoras → Obra, Operario, CategoriaOperario
        builder.Entity<RegistroHoras>()
            .HasOne(r => r.Obra)
            .WithMany(o => o.RegistrosHoras)
            .HasForeignKey(r => r.ObraId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<RegistroHoras>()
            .HasOne(r => r.Operario)
            .WithMany(o => o.RegistrosHoras)
            .HasForeignKey(r => r.OperarioId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<RegistroHoras>()
            .HasOne(r => r.Categoria)
            .WithMany(c => c.RegistrosHoras)
            .HasForeignKey(r => r.CategoriaOperarioId)
            .OnDelete(DeleteBehavior.Restrict);

        // MaterialObra → Obra
        builder.Entity<MaterialObra>()
            .HasOne(m => m.Obra)
            .WithMany(o => o.Materiales)
            .HasForeignKey(m => m.ObraId)
            .OnDelete(DeleteBehavior.Cascade);

        // MaterialObra → Proveedor
        builder.Entity<MaterialObra>()
            .HasOne(m => m.Proveedor)
            .WithMany()
            .HasForeignKey(m => m.ProveedorId)
            .OnDelete(DeleteBehavior.SetNull);

        // Presupuesto: versión única por obra en estado Aprobado
        builder.Entity<Presupuesto>()
            .HasIndex(p => new { p.ObraId, p.Version })
            .IsUnique();

        // Decimales precision
        builder.Entity<CategoriaOperario>()
            .Property(c => c.CosteHoraBase).HasPrecision(10, 2);
        builder.Entity<RegistroHoras>()
            .Property(r => r.Horas).HasPrecision(6, 2);
        builder.Entity<RegistroHoras>()
            .Property(r => r.CosteHoraAplicado).HasPrecision(10, 2);
        builder.Entity<LineaPresupuestoMaterial>()
            .Property(l => l.Cantidad).HasPrecision(12, 3);
        builder.Entity<LineaPresupuestoMaterial>()
            .Property(l => l.PrecioUnitario).HasPrecision(10, 2);
        builder.Entity<LineaPresupuestoHoras>()
            .Property(l => l.HorasEstimadas).HasPrecision(8, 2);
        builder.Entity<LineaPresupuestoHoras>()
            .Property(l => l.CosteHoraEstimado).HasPrecision(10, 2);
        builder.Entity<MaterialObra>()
            .Property(m => m.Cantidad).HasPrecision(12, 3);
        builder.Entity<MaterialObra>()
            .Property(m => m.PrecioUnitario).HasPrecision(10, 2);
    }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        // Auto-audit: set CreatedBy / UpdatedBy / timestamps
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedBy = _currentUser.UserName;
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedBy = _currentUser.UserName;
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Deleted:
                    // Soft delete
                    entry.State = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        return base.SaveChangesAsync(ct);
    }
}
