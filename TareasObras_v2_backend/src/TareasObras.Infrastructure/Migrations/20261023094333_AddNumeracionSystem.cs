using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TareasObras.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNumeracionSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ConfiguracionesNumeracion",
                columns: table => new
                {
                    Tipo = table.Column<int>(type: "integer", nullable: false),
                    Formato = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Relleno = table.Column<int>(type: "integer", nullable: false),
                    ReinicioAnual = table.Column<bool>(type: "boolean", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConfiguracionesNumeracion", x => x.Tipo);
                });

            migrationBuilder.CreateTable(
                name: "Secuencias",
                columns: table => new
                {
                    Clave = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Anio = table.Column<int>(type: "integer", nullable: false),
                    UltimoValor = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Secuencias", x => new { x.Clave, x.Anio });
                });

            migrationBuilder.InsertData(
                table: "ConfiguracionesNumeracion",
                columns: new[] { "Tipo", "Formato", "ReinicioAnual", "Relleno", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, "OBR-{yyyy}-{n}", true, 4, null, null },
                    { 2, "PRE-{yyyy}-{n}", true, 4, null, null },
                    { 3, "{obra}-T{n}", false, 3, null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConfiguracionesNumeracion");

            migrationBuilder.DropTable(
                name: "Secuencias");
        }
    }
}
