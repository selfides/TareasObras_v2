using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TareasObras.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFacturaCamposAndDocumentos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "BaseImponible",
                table: "MaterialesObra",
                type: "decimal(10,2)",
                precision: 10,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CifProveedor",
                table: "MaterialesObra",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DocumentoAdjuntoUrl",
                table: "MaterialesObra",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DocumentoHash",
                table: "MaterialesObra",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ImporteIva",
                table: "MaterialesObra",
                type: "decimal(10,2)",
                precision: 10,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PorcentajeIva",
                table: "MaterialesObra",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MaterialesObra_DocumentoHash",
                table: "MaterialesObra",
                column: "DocumentoHash");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MaterialesObra_DocumentoHash",
                table: "MaterialesObra");

            migrationBuilder.DropColumn(
                name: "BaseImponible",
                table: "MaterialesObra");

            migrationBuilder.DropColumn(
                name: "CifProveedor",
                table: "MaterialesObra");

            migrationBuilder.DropColumn(
                name: "DocumentoAdjuntoUrl",
                table: "MaterialesObra");

            migrationBuilder.DropColumn(
                name: "DocumentoHash",
                table: "MaterialesObra");

            migrationBuilder.DropColumn(
                name: "ImporteIva",
                table: "MaterialesObra");

            migrationBuilder.DropColumn(
                name: "PorcentajeIva",
                table: "MaterialesObra");
        }
    }
}
