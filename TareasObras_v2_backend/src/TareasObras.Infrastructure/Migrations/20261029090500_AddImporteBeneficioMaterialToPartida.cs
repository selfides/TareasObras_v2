using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TareasObras.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddImporteBeneficioMaterialToPartida : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ImporteBeneficioMaterial",
                table: "PartidasPresupuesto",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImporteBeneficioMaterial",
                table: "PartidasPresupuesto");
        }
    }
}

