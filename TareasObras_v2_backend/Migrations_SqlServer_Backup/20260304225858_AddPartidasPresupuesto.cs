using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TareasObras.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPartidasPresupuesto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Numero",
                table: "Presupuestos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PartidasPresupuesto",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PresupuestoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Orden = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PartidasPresupuesto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PartidasPresupuesto_Presupuestos_PresupuestoId",
                        column: x => x.PresupuestoId,
                        principalTable: "Presupuestos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LineasPartida",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PartidaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Tipo = table.Column<int>(type: "int", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Unidad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Cantidad = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PrecioUnitario = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CategoriaOperarioId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LineasPartida", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LineasPartida_CategoriasOperario_CategoriaOperarioId",
                        column: x => x.CategoriaOperarioId,
                        principalTable: "CategoriasOperario",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LineasPartida_PartidasPresupuesto_PartidaId",
                        column: x => x.PartidaId,
                        principalTable: "PartidasPresupuesto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LineasPartida_CategoriaOperarioId",
                table: "LineasPartida",
                column: "CategoriaOperarioId");

            migrationBuilder.CreateIndex(
                name: "IX_LineasPartida_PartidaId",
                table: "LineasPartida",
                column: "PartidaId");

            migrationBuilder.CreateIndex(
                name: "IX_PartidasPresupuesto_PresupuestoId",
                table: "PartidasPresupuesto",
                column: "PresupuestoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LineasPartida");

            migrationBuilder.DropTable(
                name: "PartidasPresupuesto");

            migrationBuilder.DropColumn(
                name: "Numero",
                table: "Presupuestos");
        }
    }
}
