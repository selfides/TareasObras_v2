using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TareasObras.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTicketsPendientesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Cantidad",
                table: "LineasPartida",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(12,3)",
                oldPrecision: 12,
                oldScale: 3);

            migrationBuilder.CreateTable(
                name: "TicketsPendientes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ObraId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UsuarioId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UsuarioNombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DocumentoUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DocumentoHash = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    NombreArchivoOriginal = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Estado = table.Column<int>(type: "int", nullable: false),
                    FechaGasto = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TotalEstimado = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: true),
                    ProveedorSugerido = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CifSugerido = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NumeroFacturaSugerido = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ComentarioOperario = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DatosExtraidosJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaterialObraId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    MotivoRechazo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RevisadoPor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FechaRevision = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketsPendientes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TicketsPendientes_MaterialesObra_MaterialObraId",
                        column: x => x.MaterialObraId,
                        principalTable: "MaterialesObra",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TicketsPendientes_Obras_ObraId",
                        column: x => x.ObraId,
                        principalTable: "Obras",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TicketsPendientes_DocumentoHash",
                table: "TicketsPendientes",
                column: "DocumentoHash");

            migrationBuilder.CreateIndex(
                name: "IX_TicketsPendientes_MaterialObraId",
                table: "TicketsPendientes",
                column: "MaterialObraId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketsPendientes_ObraId",
                table: "TicketsPendientes",
                column: "ObraId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TicketsPendientes");

            migrationBuilder.AlterColumn<decimal>(
                name: "Cantidad",
                table: "LineasPartida",
                type: "decimal(12,3)",
                precision: 12,
                scale: 3,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");
        }
    }
}
