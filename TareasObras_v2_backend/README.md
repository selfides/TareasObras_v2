# TareasObras API — Fase 1

## Stack
- ASP.NET Core 8 Web API
- Entity Framework Core 8 + SQL Server
- ASP.NET Identity + JWT
- MediatR (CQRS) + FluentValidation + AutoMapper
- Serilog

## Arquitectura (Clean Architecture)
```
TareasObras.sln
├── Domain        → Entities, Enums (sin dependencias externas)
├── Application   → CQRS Commands/Queries, Validators, Interfaces, Mappings
├── Infrastructure → EF Core, Identity, JWT, Repositories, Audit
└── API           → Controllers, Middleware, Program.cs
```

---

## Puesta en marcha paso a paso

### 1. Requisitos previos
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server (local, SQLEXPRESS, o Docker)
- Visual Studio 2022 / Rider / VS Code

### 2. Instalar dotnet-ef (herramienta global — solo una vez)
```powershell
dotnet tool install --global dotnet-ef
```
> Si ya lo tienes instalado y falla: `dotnet tool update --global dotnet-ef`

### 3. Configurar la cadena de conexión
Edita `src/TareasObras.API/appsettings.Development.json` con tu servidor:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=TareasObrasDB_Dev;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

### 4. Configurar el secreto JWT (desde la raíz de la solución)
```powershell
cd src/TareasObras.API
dotnet user-secrets init
dotnet user-secrets set "JwtSettings:SecretKey" "TuClaveSecretaMuyLargaMin32Chars!!"
cd ../..
```
> ⚠️ La clave debe tener **mínimo 32 caracteres**. Nunca la subas a Git.

### 5. Crear la migración inicial
```powershell
dotnet ef migrations add InitialCreate `
  --project src/TareasObras.Infrastructure `
  --startup-project src/TareasObras.API
```

### 6. Ejecutar la API
```powershell
dotnet run --project src/TareasObras.API
```
Al arrancar la primera vez:
- Se aplican las migraciones automáticamente
- Se crean los roles (Admin, Supervisor, Operario)
- Se crea el usuario administrador por defecto

### 7. Acceder a Swagger
```
https://localhost:7000/swagger
```

---

## Usuario administrador por defecto
| Campo | Valor |
|---|---|
| Email | admin@tareasObras.com |
| Password | Admin@1234 |
| Rol | Admin |

> ⚠️ Cambia esta contraseña en producción.

---

## Endpoints

### Auth
| Método | Ruta | Rol requerido |
|--------|------|---------------|
| POST | /api/auth/login | Público |
| POST | /api/auth/register | Admin |
| POST | /api/auth/change-password | Autenticado |

### Obras
| Método | Ruta | Rol requerido |
|--------|------|---------------|
| GET | /api/obras | Autenticado |
| GET | /api/obras/{id} | Autenticado |
| POST | /api/obras | Admin, Supervisor |
| PUT | /api/obras/{id} | Admin, Supervisor |
| PATCH | /api/obras/{id}/estado | Admin, Supervisor |
| DELETE | /api/obras/{id} | Admin |

### Tareas
| Método | Ruta | Rol requerido |
|--------|------|---------------|
| GET | /api/tareas/mis-tareas | Autenticado |
| GET | /api/tareas/obra/{obraId} | Autenticado |
| GET | /api/tareas/{id} | Autenticado |
| POST | /api/tareas | Admin, Supervisor |
| PUT | /api/tareas/{id} | Admin, Supervisor |
| PATCH | /api/tareas/{id}/estado | Todos |
| DELETE | /api/tareas/{id} | Admin, Supervisor |

---

## Usar Swagger con JWT
1. Haz POST a `/api/auth/login` con `{ "email": "...", "password": "..." }`
2. Copia el `token` de la respuesta
3. Pulsa **Authorize** (🔒) en Swagger
4. Introduce: `Bearer {tu_token}`

---

## Próximas fases
- **Fase 2:** Frontend Angular 17 + PrimeNG + Tailwind
- **Fase 3:** OCR con Azure Document Intelligence para albaranes/facturas
- **Fase 4:** Dashboards y reportes
- **Fase 5:** Migración de datos desde BD existente
