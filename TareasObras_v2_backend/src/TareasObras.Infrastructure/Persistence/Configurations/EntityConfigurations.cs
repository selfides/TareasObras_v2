using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TareasObras.Domain.Entities;

namespace TareasObras.Infrastructure.Persistence.Configurations;

public class ObraConfiguration : IEntityTypeConfiguration<Obra>
{
    public void Configure(EntityTypeBuilder<Obra> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.Codigo)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(o => o.Nombre)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(o => o.Descripcion).HasMaxLength(2000);
        builder.Property(o => o.Direccion).HasMaxLength(500);
        builder.Property(o => o.Cliente).HasMaxLength(200);

        builder.Property(o => o.PresupuestoEstimado)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.PresupuestoReal)
            .HasColumnType("decimal(18,2)");

        builder.HasIndex(o => o.Codigo).IsUnique();

        builder.HasMany(o => o.Tareas)
            .WithOne(t => t.Obra)
            .HasForeignKey(t => t.ObraId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class TareaConfiguration : IEntityTypeConfiguration<Tarea>
{
    public void Configure(EntityTypeBuilder<Tarea> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Titulo)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(t => t.Descripcion).HasMaxLength(2000);
        builder.Property(t => t.Observaciones).HasMaxLength(1000);

        builder.Property(t => t.HorasEstimadas)
            .HasColumnType("decimal(8,2)");

        builder.Property(t => t.HorasReales)
            .HasColumnType("decimal(8,2)");

        builder.HasOne(t => t.Cuadrilla)
            .WithMany(c => c.Tareas)
            .HasForeignKey(t => t.CuadrillaId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class CuadrillaConfiguration : IEntityTypeConfiguration<Cuadrilla>
{
    public void Configure(EntityTypeBuilder<Cuadrilla> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Nombre).IsRequired().HasMaxLength(100);
    }
}

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Accion).IsRequired().HasMaxLength(50);
        builder.Property(a => a.Entidad).IsRequired().HasMaxLength(100);
        builder.Property(a => a.UsuarioId).HasMaxLength(450);
        builder.Property(a => a.UsuarioNombre).HasMaxLength(200);
        builder.Property(a => a.EntidadId).HasMaxLength(100);
        builder.Property(a => a.IpAddress).HasMaxLength(50);
        builder.Property(a => a.ValoresAnteriores).HasColumnType("nvarchar(max)");
        builder.Property(a => a.ValoresNuevos).HasColumnType("nvarchar(max)");

        builder.HasIndex(a => a.FechaHora);
        builder.HasIndex(a => new { a.Entidad, a.EntidadId });
    }
}
