using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TareasObras.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialPostgreSql : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: false),
                    UsuarioNombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Accion = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Entidad = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    EntidadId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ValoresAnteriores = table.Column<string>(type: "text", nullable: true),
                    ValoresNuevos = table.Column<string>(type: "text", nullable: true),
                    FechaHora = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IpAddress = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CategoriasOperario",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    CosteHoraBase = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Activo = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoriasOperario", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Cuadrillas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ResponsableId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cuadrillas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Obras",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Codigo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Descripcion = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    Direccion = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Cliente = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    FechaInicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FechaFinPrevista = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FechaFinReal = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Estado = table.Column<int>(type: "integer", nullable: false),
                    PresupuestoEstimado = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    PresupuestoReal = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Obras", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Proveedores",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    CifNif = table.Column<string>(type: "text", nullable: true),
                    Direccion = table.Column<string>(type: "text", nullable: true),
                    Telefono = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Observaciones = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Proveedores", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Operarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    Apellidos = table.Column<string>(type: "text", nullable: false),
                    DNI = table.Column<string>(type: "text", nullable: true),
                    Telefono = table.Column<string>(type: "text", nullable: true),
                    Activo = table.Column<bool>(type: "boolean", nullable: false),
                    CategoriaOperarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    CuadrillaId = table.Column<Guid>(type: "uuid", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Operarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Operarios_CategoriasOperario_CategoriaOperarioId",
                        column: x => x.CategoriaOperarioId,
                        principalTable: "CategoriasOperario",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Operarios_Cuadrillas_CuadrillaId",
                        column: x => x.CuadrillaId,
                        principalTable: "Cuadrillas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Presupuestos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ObraId = table.Column<Guid>(type: "uuid", nullable: false),
                    Version = table.Column<int>(type: "integer", nullable: false),
                    Fecha = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: true),
                    Numero = table.Column<string>(type: "text", nullable: true),
                    Estado = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Presupuestos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Presupuestos_Obras_ObraId",
                        column: x => x.ObraId,
                        principalTable: "Obras",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoleClaims_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    Apellidos = table.Column<string>(type: "text", nullable: false),
                    Activo = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    OperarioId = table.Column<Guid>(type: "uuid", nullable: true),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Usuarios_Operarios_OperarioId",
                        column: x => x.OperarioId,
                        principalTable: "Operarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "LineasPresupuestoHoras",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PresupuestoId = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoriaOperarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    HorasEstimadas = table.Column<decimal>(type: "numeric(8,2)", precision: 8, scale: 2, nullable: false),
                    CosteHoraEstimado = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LineasPresupuestoHoras", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LineasPresupuestoHoras_CategoriasOperario_CategoriaOperario~",
                        column: x => x.CategoriaOperarioId,
                        principalTable: "CategoriasOperario",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LineasPresupuestoHoras_Presupuestos_PresupuestoId",
                        column: x => x.PresupuestoId,
                        principalTable: "Presupuestos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LineasPresupuestoMaterial",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PresupuestoId = table.Column<Guid>(type: "uuid", nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: false),
                    Unidad = table.Column<string>(type: "text", nullable: false),
                    Cantidad = table.Column<decimal>(type: "numeric(12,3)", precision: 12, scale: 3, nullable: false),
                    PrecioUnitario = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LineasPresupuestoMaterial", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LineasPresupuestoMaterial_Presupuestos_PresupuestoId",
                        column: x => x.PresupuestoId,
                        principalTable: "Presupuestos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PartidasPresupuesto",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PresupuestoId = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: true),
                    Orden = table.Column<int>(type: "integer", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
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
                name: "UsuarioClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsuarioClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UsuarioClaims_Usuarios_UserId",
                        column: x => x.UserId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UsuarioLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsuarioLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_UsuarioLogins_Usuarios_UserId",
                        column: x => x.UserId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UsuarioRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    RoleId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsuarioRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UsuarioRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UsuarioRoles_Usuarios_UserId",
                        column: x => x.UserId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UsuarioTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsuarioTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_UsuarioTokens_Usuarios_UserId",
                        column: x => x.UserId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LineasPartida",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PartidaId = table.Column<Guid>(type: "uuid", nullable: false),
                    Tipo = table.Column<int>(type: "integer", nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: false),
                    Unidad = table.Column<string>(type: "text", nullable: false),
                    Cantidad = table.Column<decimal>(type: "numeric", nullable: false),
                    PrecioUnitario = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    CategoriaOperarioId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "MaterialesObra",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ObraId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProveedorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LineaPartidaId = table.Column<Guid>(type: "uuid", nullable: true),
                    Descripcion = table.Column<string>(type: "text", nullable: false),
                    Unidad = table.Column<string>(type: "text", nullable: false),
                    Cantidad = table.Column<decimal>(type: "numeric(12,3)", precision: 12, scale: 3, nullable: false),
                    PrecioUnitario = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Fecha = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NumeroAlbaran = table.Column<string>(type: "text", nullable: true),
                    NumeroFactura = table.Column<string>(type: "text", nullable: true),
                    Observaciones = table.Column<string>(type: "text", nullable: true),
                    DocumentoAdjuntoUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    DocumentoHash = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    CifProveedor = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    PorcentajeIva = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    ImporteIva = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    BaseImponible = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaterialesObra", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MaterialesObra_LineasPartida_LineaPartidaId",
                        column: x => x.LineaPartidaId,
                        principalTable: "LineasPartida",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MaterialesObra_Obras_ObraId",
                        column: x => x.ObraId,
                        principalTable: "Obras",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MaterialesObra_Proveedores_ProveedorId",
                        column: x => x.ProveedorId,
                        principalTable: "Proveedores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Tareas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ObraId = table.Column<Guid>(type: "uuid", nullable: false),
                    Titulo = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    Descripcion = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    Estado = table.Column<int>(type: "integer", nullable: false),
                    Prioridad = table.Column<int>(type: "integer", nullable: false),
                    FechaLimite = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    HorasEstimadas = table.Column<decimal>(type: "numeric(8,2)", nullable: false),
                    HorasReales = table.Column<decimal>(type: "numeric(8,2)", nullable: false),
                    CuadrillaId = table.Column<Guid>(type: "uuid", nullable: true),
                    UsuarioAsignadoId = table.Column<Guid>(type: "uuid", nullable: true),
                    LineaPartidaId = table.Column<Guid>(type: "uuid", nullable: true),
                    Observaciones = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tareas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tareas_Cuadrillas_CuadrillaId",
                        column: x => x.CuadrillaId,
                        principalTable: "Cuadrillas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Tareas_LineasPartida_LineaPartidaId",
                        column: x => x.LineaPartidaId,
                        principalTable: "LineasPartida",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Tareas_Obras_ObraId",
                        column: x => x.ObraId,
                        principalTable: "Obras",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TicketsPendientes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ObraId = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<string>(type: "text", nullable: true),
                    UsuarioNombre = table.Column<string>(type: "text", nullable: true),
                    DocumentoUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    DocumentoHash = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    NombreArchivoOriginal = table.Column<string>(type: "text", nullable: false),
                    ContentType = table.Column<string>(type: "text", nullable: false),
                    Estado = table.Column<int>(type: "integer", nullable: false),
                    FechaGasto = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TotalEstimado = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: true),
                    ProveedorSugerido = table.Column<string>(type: "text", nullable: true),
                    CifSugerido = table.Column<string>(type: "text", nullable: true),
                    NumeroFacturaSugerido = table.Column<string>(type: "text", nullable: true),
                    ComentarioOperario = table.Column<string>(type: "text", nullable: true),
                    DatosExtraidosJson = table.Column<string>(type: "text", nullable: true),
                    MaterialObraId = table.Column<Guid>(type: "uuid", nullable: true),
                    MotivoRechazo = table.Column<string>(type: "text", nullable: true),
                    RevisadoPor = table.Column<string>(type: "text", nullable: true),
                    FechaRevision = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "RegistrosHoras",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ObraId = table.Column<Guid>(type: "uuid", nullable: false),
                    OperarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoriaOperarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    TareaId = table.Column<Guid>(type: "uuid", nullable: true),
                    Fecha = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    HoraInicio = table.Column<TimeSpan>(type: "interval", nullable: false),
                    HoraFin = table.Column<TimeSpan>(type: "interval", nullable: false),
                    Horas = table.Column<decimal>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: false),
                    CosteHoraAplicado = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Observaciones = table.Column<string>(type: "text", nullable: true),
                    EnCurso = table.Column<bool>(type: "boolean", nullable: false),
                    LatitudInicio = table.Column<decimal>(type: "numeric(10,7)", precision: 10, scale: 7, nullable: true),
                    LongitudInicio = table.Column<decimal>(type: "numeric(10,7)", precision: 10, scale: 7, nullable: true),
                    LatitudFin = table.Column<decimal>(type: "numeric(10,7)", precision: 10, scale: 7, nullable: true),
                    LongitudFin = table.Column<decimal>(type: "numeric(10,7)", precision: 10, scale: 7, nullable: true),
                    TimestampInicioDispositivo = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TimestampFinDispositivo = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SincronizadoOffline = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrosHoras", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrosHoras_CategoriasOperario_CategoriaOperarioId",
                        column: x => x.CategoriaOperarioId,
                        principalTable: "CategoriasOperario",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RegistrosHoras_Obras_ObraId",
                        column: x => x.ObraId,
                        principalTable: "Obras",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RegistrosHoras_Operarios_OperarioId",
                        column: x => x.OperarioId,
                        principalTable: "Operarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RegistrosHoras_Tareas_TareaId",
                        column: x => x.TareaId,
                        principalTable: "Tareas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_Entidad_EntidadId",
                table: "AuditLogs",
                columns: new[] { "Entidad", "EntidadId" });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_FechaHora",
                table: "AuditLogs",
                column: "FechaHora");

            migrationBuilder.CreateIndex(
                name: "IX_LineasPartida_CategoriaOperarioId",
                table: "LineasPartida",
                column: "CategoriaOperarioId");

            migrationBuilder.CreateIndex(
                name: "IX_LineasPartida_PartidaId",
                table: "LineasPartida",
                column: "PartidaId");

            migrationBuilder.CreateIndex(
                name: "IX_LineasPresupuestoHoras_CategoriaOperarioId",
                table: "LineasPresupuestoHoras",
                column: "CategoriaOperarioId");

            migrationBuilder.CreateIndex(
                name: "IX_LineasPresupuestoHoras_PresupuestoId",
                table: "LineasPresupuestoHoras",
                column: "PresupuestoId");

            migrationBuilder.CreateIndex(
                name: "IX_LineasPresupuestoMaterial_PresupuestoId",
                table: "LineasPresupuestoMaterial",
                column: "PresupuestoId");

            migrationBuilder.CreateIndex(
                name: "IX_MaterialesObra_DocumentoHash",
                table: "MaterialesObra",
                column: "DocumentoHash");

            migrationBuilder.CreateIndex(
                name: "IX_MaterialesObra_LineaPartidaId",
                table: "MaterialesObra",
                column: "LineaPartidaId");

            migrationBuilder.CreateIndex(
                name: "IX_MaterialesObra_ObraId",
                table: "MaterialesObra",
                column: "ObraId");

            migrationBuilder.CreateIndex(
                name: "IX_MaterialesObra_ProveedorId",
                table: "MaterialesObra",
                column: "ProveedorId");

            migrationBuilder.CreateIndex(
                name: "IX_Obras_Codigo",
                table: "Obras",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Operarios_CategoriaOperarioId",
                table: "Operarios",
                column: "CategoriaOperarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Operarios_CuadrillaId",
                table: "Operarios",
                column: "CuadrillaId");

            migrationBuilder.CreateIndex(
                name: "IX_PartidasPresupuesto_PresupuestoId",
                table: "PartidasPresupuesto",
                column: "PresupuestoId");

            migrationBuilder.CreateIndex(
                name: "IX_Presupuestos_ObraId_Version",
                table: "Presupuestos",
                columns: new[] { "ObraId", "Version" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosHoras_CategoriaOperarioId",
                table: "RegistrosHoras",
                column: "CategoriaOperarioId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosHoras_ObraId",
                table: "RegistrosHoras",
                column: "ObraId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosHoras_OperarioId",
                table: "RegistrosHoras",
                column: "OperarioId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosHoras_TareaId",
                table: "RegistrosHoras",
                column: "TareaId");

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_RoleId",
                table: "RoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "Roles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tareas_CuadrillaId",
                table: "Tareas",
                column: "CuadrillaId");

            migrationBuilder.CreateIndex(
                name: "IX_Tareas_LineaPartidaId",
                table: "Tareas",
                column: "LineaPartidaId");

            migrationBuilder.CreateIndex(
                name: "IX_Tareas_ObraId",
                table: "Tareas",
                column: "ObraId");

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

            migrationBuilder.CreateIndex(
                name: "IX_UsuarioClaims_UserId",
                table: "UsuarioClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UsuarioLogins_UserId",
                table: "UsuarioLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UsuarioRoles_RoleId",
                table: "UsuarioRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "Usuarios",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_OperarioId",
                table: "Usuarios",
                column: "OperarioId");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "Usuarios",
                column: "NormalizedUserName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "LineasPresupuestoHoras");

            migrationBuilder.DropTable(
                name: "LineasPresupuestoMaterial");

            migrationBuilder.DropTable(
                name: "RegistrosHoras");

            migrationBuilder.DropTable(
                name: "RoleClaims");

            migrationBuilder.DropTable(
                name: "TicketsPendientes");

            migrationBuilder.DropTable(
                name: "UsuarioClaims");

            migrationBuilder.DropTable(
                name: "UsuarioLogins");

            migrationBuilder.DropTable(
                name: "UsuarioRoles");

            migrationBuilder.DropTable(
                name: "UsuarioTokens");

            migrationBuilder.DropTable(
                name: "Tareas");

            migrationBuilder.DropTable(
                name: "MaterialesObra");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "LineasPartida");

            migrationBuilder.DropTable(
                name: "Proveedores");

            migrationBuilder.DropTable(
                name: "Operarios");

            migrationBuilder.DropTable(
                name: "PartidasPresupuesto");

            migrationBuilder.DropTable(
                name: "CategoriasOperario");

            migrationBuilder.DropTable(
                name: "Cuadrillas");

            migrationBuilder.DropTable(
                name: "Presupuestos");

            migrationBuilder.DropTable(
                name: "Obras");
        }
    }
}
