using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TareasObras.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOperarioFichajeAndGeolocalizacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "OperarioId",
                table: "Usuarios",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EnCurso",
                table: "RegistrosHoras",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "LatitudFin",
                table: "RegistrosHoras",
                type: "decimal(10,7)",
                precision: 10,
                scale: 7,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "LatitudInicio",
                table: "RegistrosHoras",
                type: "decimal(10,7)",
                precision: 10,
                scale: 7,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "LongitudFin",
                table: "RegistrosHoras",
                type: "decimal(10,7)",
                precision: 10,
                scale: 7,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "LongitudInicio",
                table: "RegistrosHoras",
                type: "decimal(10,7)",
                precision: 10,
                scale: 7,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SincronizadoOffline",
                table: "RegistrosHoras",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "TimestampFinDispositivo",
                table: "RegistrosHoras",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TimestampInicioDispositivo",
                table: "RegistrosHoras",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Operarios",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_OperarioId",
                table: "Usuarios",
                column: "OperarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Operarios_OperarioId",
                table: "Usuarios",
                column: "OperarioId",
                principalTable: "Operarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Operarios_OperarioId",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_OperarioId",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "OperarioId",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "EnCurso",
                table: "RegistrosHoras");

            migrationBuilder.DropColumn(
                name: "LatitudFin",
                table: "RegistrosHoras");

            migrationBuilder.DropColumn(
                name: "LatitudInicio",
                table: "RegistrosHoras");

            migrationBuilder.DropColumn(
                name: "LongitudFin",
                table: "RegistrosHoras");

            migrationBuilder.DropColumn(
                name: "LongitudInicio",
                table: "RegistrosHoras");

            migrationBuilder.DropColumn(
                name: "SincronizadoOffline",
                table: "RegistrosHoras");

            migrationBuilder.DropColumn(
                name: "TimestampFinDispositivo",
                table: "RegistrosHoras");

            migrationBuilder.DropColumn(
                name: "TimestampInicioDispositivo",
                table: "RegistrosHoras");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Operarios");
        }
    }
}
