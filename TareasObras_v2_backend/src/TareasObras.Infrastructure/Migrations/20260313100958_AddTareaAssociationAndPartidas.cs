using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TareasObras.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTareaAssociationAndPartidas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "LineaPartidaId",
                table: "Tareas",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TareaId",
                table: "RegistrosHoras",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tareas_LineaPartidaId",
                table: "Tareas",
                column: "LineaPartidaId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosHoras_TareaId",
                table: "RegistrosHoras",
                column: "TareaId");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrosHoras_Tareas_TareaId",
                table: "RegistrosHoras",
                column: "TareaId",
                principalTable: "Tareas",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Tareas_LineasPartida_LineaPartidaId",
                table: "Tareas",
                column: "LineaPartidaId",
                principalTable: "LineasPartida",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RegistrosHoras_Tareas_TareaId",
                table: "RegistrosHoras");

            migrationBuilder.DropForeignKey(
                name: "FK_Tareas_LineasPartida_LineaPartidaId",
                table: "Tareas");

            migrationBuilder.DropIndex(
                name: "IX_Tareas_LineaPartidaId",
                table: "Tareas");

            migrationBuilder.DropIndex(
                name: "IX_RegistrosHoras_TareaId",
                table: "RegistrosHoras");

            migrationBuilder.DropColumn(
                name: "LineaPartidaId",
                table: "Tareas");

            migrationBuilder.DropColumn(
                name: "TareaId",
                table: "RegistrosHoras");
        }
    }
}
