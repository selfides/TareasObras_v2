using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TareasObras.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMaterialAssociationToBudgetPartida : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "LineaPartidaId",
                table: "MaterialesObra",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MaterialesObra_LineaPartidaId",
                table: "MaterialesObra",
                column: "LineaPartidaId");

            migrationBuilder.AddForeignKey(
                name: "FK_MaterialesObra_LineasPartida_LineaPartidaId",
                table: "MaterialesObra",
                column: "LineaPartidaId",
                principalTable: "LineasPartida",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MaterialesObra_LineasPartida_LineaPartidaId",
                table: "MaterialesObra");

            migrationBuilder.DropIndex(
                name: "IX_MaterialesObra_LineaPartidaId",
                table: "MaterialesObra");

            migrationBuilder.DropColumn(
                name: "LineaPartidaId",
                table: "MaterialesObra");
        }
    }
}
