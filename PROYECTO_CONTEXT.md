# PROYECTO_CONTEXT.md
> Guía de arquitectura para LLMs — TareasObras v2
> Última actualización: Sesión 7 (marzo 2026)

---

## 1. VISIÓN GENERAL

**TareasObras v2** es una aplicación de gestión de obras de construcción que reemplaza un sistema WinForms legacy. Permite gestionar obras, tareas (kanban), operarios, presupuestos por partidas y control de costes reales vs presupuestados.

| Capa | Tecnología |
|---|---|
| Backend API | C# .NET 8, Clean Architecture, CQRS + MediatR |
| Base de datos | SQL Server en Proxmox (192.168.1.204,1433) |
| Frontend | Angular 19, PrimeNG 19, NgRx Signals |
| Auth | JWT Bearer tokens |
| ORM | Entity Framework Core 8 |

**⚠️ IMPORTANTE:** Existe una segunda base de datos `TareasObras` (legacy WinForms). **NO TOCAR.**
La base de datos activa es `TareasObrasDB`.

---

## 2. BACKEND — CLEAN ARCHITECTURE

### 2.1 Estructura de proyectos

```
src/
├── TareasObras.Domain/          # Entidades, enums, value objects
├── TareasObras.Application/     # CQRS handlers, interfaces, DTOs
├── TareasObras.Infrastructure/  # EF Core, repositorios, implementaciones
└── TareasObras.API/             # Controllers, middleware, DI config
```

### 2.2 Patrón CQRS + MediatR

Cada operación es un Command o Query con su Handler:

```csharp
// Command
public record CreateObraCommand(string Codigo, string Nombre, ...) : IRequest<Guid>;

// Handler
public class CreateObraCommandHandler : IRequestHandler<CreateObraCommand, Guid>
{
    private readonly IUnitOfWork _uow;
    public async Task<Guid> Handle(CreateObraCommand cmd, CancellationToken ct)
    {
        var obra = Obra.Create(cmd.Codigo, cmd.Nombre, ...);
        await _uow.Obras.AddAsync(obra, ct);
        await _uow.SaveChangesAsync(ct);
        return obra.Id;
    }
}
```

**Convención de namespaces:**
- Commands: `TareasObras.Application.Features.{Entidad}.Commands`
- Queries:  `TareasObras.Application.Features.{Entidad}.Queries`

### 2.3 Unit of Work + Repository Pattern

```csharp
public interface IUnitOfWork
{
    IObraRepository                     Obras { get; }
    ITareaRepository                    Tareas { get; }
    ICuadrillaRepository                Cuadrillas { get; }
    ICategoriaOperarioRepository        CategoriasOperario { get; }
    IOperarioRepository                 Operarios { get; }
    IRegistroHorasRepository            RegistrosHoras { get; }
    IPresupuestoRepository              Presupuestos { get; }
    ILineaPresupuestoMaterialRepository LineasPresupuestoMaterial { get; }
    ILineaPresupuestoHorasRepository    LineasPresupuestoHoras { get; }
    IMaterialObraRepository             MaterialesObra { get; }
    IPartidaPresupuestoRepository       PartidasPresupuesto { get; }
    ILineaPartidaRepository             LineasPartida { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
```

### 2.4 Entidades del Dominio

#### Obras y Tareas

```csharp
Obra
  Id, Codigo, Nombre, Descripcion, Cliente, Direccion
  Estado (enum: Planificada=0, EnCurso=1, Pausada=2, Completada=3, Cancelada=4)
  FechaInicio, FechaFinPrevista, FechaFinReal
  IsDeleted (soft delete)
  → Tareas (ICollection<Tarea>)

Tarea
  Id, ObraId, Titulo, Descripcion
  Estado (enum: Pendiente=0, EnProgreso=1, Completada=2, Bloqueada=3)
  Prioridad (enum: Baja=0, Media=1, Alta=2, Critica=3)
  FechaVencimiento, AsignadoAUserId
  IsDeleted
```

#### Operarios y Categorías

```csharp
CategoriaOperario
  Id, Nombre, Descripcion, CosteHoraBase
  IsDeleted
  → Operarios (ICollection<Operario>)

Operario
  Id, Nombre, Apellidos, DNI, Email, Telefono
  CategoriaOperarioId (FK)
  CosteHoraBase (override de categoría, nullable)
  FechaAlta, FechaBaja (nullable)
  IsDeleted
  Computed: NombreCompleto, CosteHoraEfectivo
```

#### Presupuesto — Estructura Jerárquica

```
Presupuesto
└── PartidaPresupuesto (1..N)
    └── LineaPartida (1..N)  →  tipo: Material | ManoObra
```

```csharp
Presupuesto
  Id, ObraId
  Numero (string libre, ej: "PPTO-2026-001")
  Version (int, auto-incrementado por obra)
  Fecha, Descripcion
  Estado (enum: Borrador=0, Aprobado=1, Rechazado=2)
  IsDeleted
  Computed: TotalMaterial, TotalHoras, Total
  → Partidas (ICollection<PartidaPresupuesto>)

PartidaPresupuesto
  Id, PresupuestoId, Nombre, Descripcion, Orden
  IsDeleted
  Computed: TotalMaterial, TotalManoObra, Total
  → Lineas (ICollection<LineaPartida>)

LineaPartida
  Id, PartidaId
  Tipo (enum: Material=0, ManoObra=1)
  Descripcion, Unidad
  Cantidad (decimal 12,3)
  PrecioUnitario (decimal 10,2)
  CategoriaOperarioId (nullable — solo ManoObra)
  IsDeleted
  Computed: Importe = Cantidad * PrecioUnitario
```

#### Control de Costes Reales

```csharp
RegistroHoras
  Id, ObraId, OperarioId, CategoriaOperarioId
  Fecha, Horas, CosteHoraAplicado, Observaciones
  IsDeleted
  Computed: CosteTotal = Horas * CosteHoraAplicado

MaterialObra
  Id, ObraId
  Descripcion, Unidad, Cantidad, PrecioUnitario
  Fecha, Observaciones
  IsDeleted
  Computed: ImporteReal = Cantidad * PrecioUnitario
```

### 2.5 Soft Delete

Todas las entidades tienen `IsDeleted`. EF Core aplica filtro global:

```csharp
// En AppDbContext.OnModelCreating:
modelBuilder.Entity<Obra>().HasQueryFilter(e => !e.IsDeleted);
// ... repetido para cada entidad
```

### 2.6 Autorización

Roles: `Admin`, `Supervisor`, `Operario`

```csharp
[Authorize(Roles = "Admin,Supervisor")]  // escritura general
[Authorize(Roles = "Admin")]             // operaciones destructivas
[Authorize]                              // cualquier autenticado (lectura)
```

### 2.7 Endpoints principales de la API

```
GET/POST        /api/obras
GET/PUT/DELETE  /api/obras/{id}

GET/POST        /api/tareas
GET/PUT/DELETE  /api/tareas/{id}
PATCH           /api/tareas/{id}/estado

GET/POST        /api/operarios
GET/PUT/DELETE  /api/operarios/{id}

GET/POST        /api/categorias-operario
GET/PUT/DELETE  /api/categorias-operario/{id}

GET/POST        /api/presupuestos
GET             /api/presupuestos/obra/{obraId}
POST            /api/presupuestos/{id}/aprobar

GET             /api/partidas/presupuesto/{presupuestoId}
POST            /api/partidas
PUT/DELETE      /api/partidas/{id}
POST            /api/partidas/{id}/lineas/material
POST            /api/partidas/{id}/lineas/manoobra
PUT/DELETE      /api/partidas/lineas/{id}

GET/POST        /api/registro-horas
GET             /api/registro-horas/obra/{obraId}
PUT/DELETE      /api/registro-horas/{id}

GET/POST        /api/materiales-obra
GET             /api/materiales-obra/obra/{obraId}
PUT/DELETE      /api/materiales-obra/{id}
```

---

## 3. FRONTEND — ANGULAR 19 + NGRX SIGNALS

### 3.1 Estructura de directorios

```
src/app/
├── core/
│   ├── auth/
│   │   └── auth.service.ts
│   ├── models/
│   │   └── index.ts                      # Todos los DTOs/interfaces
│   └── services/
│       ├── obras.service.ts
│       ├── tareas.service.ts
│       ├── operarios.service.ts
│       ├── categorias-operario.service.ts
│       ├── presupuestos.service.ts
│       ├── partidas.service.ts           # partidas + líneas
│       ├── registro-horas.service.ts
│       └── materiales-obra.service.ts
├── features/
│   ├── obras/
│   │   ├── components/
│   │   │   ├── obras-list.component.ts
│   │   │   ├── obra-detail.component.ts  # componente principal del detalle
│   │   │   └── obra-form.component.ts
│   │   └── store/
│   │       └── obras.store.ts            # NgRx SignalStore
│   ├── tareas/
│   │   └── tareas-kanban.component.ts    # drag & drop
│   ├── operarios/
│   │   └── operarios.component.ts        # tabs: Operarios + Categorías
│   ├── usuarios/
│   └── auth/
└── shell/
    └── shell.component.ts                # layout + nav
```

### 3.2 Estrategia de Estado

**Estado global** — NgRx `signalStore` para obras:

```typescript
export const ObrasStore = signalStore(
  { providedIn: 'root' },
  withState<ObrasState>({ obras: [], selectedObra: null, loading: false, error: null }),
  withMethods((store, obrasSvc = inject(ObrasService)) => ({
    loadObras(filters?) { ... },
    loadObraById(id: string) { ... },
    createObra(data) { ... },
    updateObra(id, data) { ... },
    deleteObra(id) { ... },
  }))
);
```

**Estado local** — signals en componentes para datos secundarios:

```typescript
presupuestos            = signal<PresupuestoDto[]>([]);
partidas                = signal<PartidaDto[]>([]);
presupuestoSeleccionado = signal<string | null>(null);
registrosHoras          = signal<RegistroHorasDto[]>([]);
materiales              = signal<MaterialObraDto[]>([]);
saving                  = signal(false);
editandoXxxId           = signal<string | null>(null);
```

### 3.3 Modelos principales del Frontend (`core/models/index.ts`)

```typescript
interface ObraDto {
  id: string; codigo: string; nombre: string; descripcion?: string;
  cliente?: string; direccion?: string;
  estado: number; estadoNombre: string;
  fechaInicio: string; fechaFinPrevista?: string; fechaFinReal?: string;
  tareasPendientes: number; createdBy?: string;
}

interface PresupuestoDto {
  id: string; obraId: string; numero?: string; version: number;
  fecha: string; descripcion?: string;
  estadoNombre: string; esAprobado: boolean;
  totalMaterial: number; totalHoras: number; total: number;
  lineasMaterial: LineaPresupuestoMaterialDto[];
  lineasHoras: LineaPresupuestoHorasDto[];
}

interface PartidaDto {
  id: string; presupuestoId: string; nombre: string;
  descripcion?: string; orden: number;
  totalMaterial: number; totalManoObra: number; total: number;
  lineas: LineaPartidaDto[];
}

interface LineaPartidaDto {
  id: string; tipo: string;   // 'Material' | 'ManoObra'
  descripcion: string; unidad: string;
  cantidad: number; precioUnitario: number; importe: number;
  categoriaOperarioId?: string; categoriaNombre?: string;
}

interface OperarioDto {
  id: string; nombre: string; apellidos: string; nombreCompleto: string;
  categoriaOperarioId: string; categoriaNombre: string;
  costeHoraBase: number; activo: boolean;
}

interface CategoriaOperarioDto {
  id: string; nombre: string; descripcion?: string; costeHoraBase: number;
}

interface RegistroHorasDto {
  id: string; obraId: string; operarioId: string; operarioNombre: string;
  categoriaOperarioId: string; categoriaNombre: string;
  fecha: string; horas: number; costeHoraAplicado: number; costeTotal: number;
  observaciones?: string;
}

interface MaterialObraDto {
  id: string; obraId: string; descripcion: string; unidad: string;
  cantidad: number; precioUnitario: number; importeReal: number;
  fecha: string; observaciones?: string;
}
```

### 3.4 PrimeNG 19 — Componentes y sus imports correctos

| Componente | Import module | Package |
|---|---|---|
| `p-button` | `ButtonModule` | `primeng/button` |
| `p-dialog` | `DialogModule` | `primeng/dialog` |
| `p-confirmdialog` | `ConfirmDialogModule` | `primeng/confirmdialog` |
| `p-table` | `TableModule` | `primeng/table` |
| `p-tabs/p-tab/p-tabpanels` | `TabsModule` | `primeng/tabs` |
| `p-select` *(antes p-dropdown)* | `SelectModule` | `primeng/select` |
| `p-datepicker` *(antes p-calendar)* | `DatePickerModule` | `primeng/datepicker` |
| `p-inputNumber` | `InputNumberModule` | `primeng/inputnumber` |
| `pInputText` | `InputTextModule` | `primeng/inputtext` |
| `pTextarea` | `TextareaModule` | `primeng/textarea` |
| `p-tag` | `TagModule` | `primeng/tag` |
| `pTooltip` | `TooltipModule` | `primeng/tooltip` |
| `p-skeleton` | `SkeletonModule` | `primeng/skeleton` |
| `p-toast` | `ToastModule` | `primeng/toast` |

**Siempre añadir `appendTo="body"` a `p-dialog` y `p-select`** para evitar problemas de z-index.

### 3.5 Autenticación en Frontend

```typescript
// auth.service.ts — métodos de uso frecuente
isSupervisor(): boolean   // true para Admin y Supervisor
isAdmin(): boolean        // true solo para Admin
isAuthenticated(): boolean
```

Guards: `authGuard` (cualquier autenticado), `supervisorGuard` (Admin o Supervisor)

### 3.6 Proxy de desarrollo

```json
// proxy.conf.json
{ "/api": { "target": "https://localhost:52190", "secure": false } }
```

---

## 4. BASE DE DATOS

### 4.1 Migraciones aplicadas

| Migración | Contenido |
|---|---|
| `InitialCreate` | Obras, Tareas, Cuadrillas, AspNetUsers |
| `AddOperariosYPresupuesto` | Operarios, CategoriaOperario, RegistroHoras, Presupuesto, LineasMaterial/Horas |
| `AddMaterialObra` | MaterialObra |
| `AddPartidasPresupuesto` | PartidaPresupuesto, LineaPartida, Presupuesto.Numero |

### 4.2 Configuraciones EF Core relevantes

```csharp
// Precisiones numéricas
LineaPartida.Cantidad:       HasPrecision(12, 3)
LineaPartida.PrecioUnitario: HasPrecision(10, 2)

// Comportamiento de eliminación en cascada
LineaPartida → PartidaPresupuesto:  OnDelete(Cascade)
PartidaPresupuesto → Presupuesto:   OnDelete(Cascade)
LineaPartida → CategoriaOperario:   OnDelete(Restrict)  // FK nullable
```

---

## 5. FLUJOS CLAVE

### 5.1 Crear Presupuesto con Partidas

```
1. POST /api/presupuestos
   Body: { obraId, numero, fecha, descripcion, lineasMaterial:[], lineasHoras:[] }

2. GET /api/partidas/presupuesto/{presupuestoId}
   → muestra las partidas existentes

3. POST /api/partidas
   Body: { presupuestoId, nombre, descripcion, orden }

4. POST /api/partidas/{id}/lineas/material
   Body: { descripcion, unidad, cantidad, precioUnitario }

5. POST /api/partidas/{id}/lineas/manoobra
   Body: { categoriaOperarioId, descripcion, unidad, cantidad, precioUnitario }

6. POST /api/presupuestos/{id}/aprobar
   → bloquea edición, estado pasa a Aprobado
```

### 5.2 KPIs de Desviación

```
Presupuesto aprobado = Presupuesto con esAprobado=true → .total
Coste real           = Σ RegistroHoras.costeTotal + Σ MaterialObra.importeReal
Desviación           = CosteReal - PresupuestoAprobado
```

### 5.3 Kanban

```
Estados columnas: Pendiente | EnProgreso | Completada | Bloqueada
Drag & drop → PATCH /api/tareas/{id}/estado  body: { estado: number }
```

---

## 6. CONVENCIONES PARA EL LLM

### Añadir nueva entidad — checklist

**Backend (en orden):**
1. Entidad en `Domain/Entities/` con factory methods estáticos (`Create`, `Update`, `Delete`)
2. Interface de repositorio en `Application/Common/Interfaces/IRepositories.cs`
3. Añadir propiedad en `IUnitOfWork`
4. DTOs + Command/Query handlers en `Application/Features/{Entidad}/`
5. Implementación del repositorio en `Infrastructure/Persistence/Repositories/Repositories.cs`
6. Instanciar en constructor del `UnitOfWork` e implementar la propiedad
7. DbSet + configuración en `AppDbContext`
8. Controller en `API/Controllers/`
9. Migración: `dotnet ef migrations add {Nombre}` + `dotnet ef database update`

**Frontend (en orden):**
1. Interface/DTO en `core/models/index.ts`
2. Service en `core/services/{entidad}.service.ts`
3. Componente standalone en `features/{modulo}/components/`
4. Ruta en `app.routes.ts` con guard apropiado
5. Item en el menú del `shell.component.ts`

### Errores comunes en PowerShell al editar ficheros

```powershell
# MAL — PowerShell interpreta como 3 argumentos:
$d = $d -replace "patron", $variable + "texto"

# BIEN — usar variable intermedia:
$replacement = $variable + "texto"
$d = $d -replace "patron", $replacement

# BIEN — usar .Replace() para strings exactos (sin regex):
$d = $d.Replace("texto exacto", "nuevo texto")

# Para reescritura completa (más fiable para ficheros grandes):
[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)

# Verificar antes de asumir que el reemplazo funcionó:
$d | Select-String "termino_buscado"
```

### Comandos habituales

```powershell
# Backend — directorio raíz: D:\Programacion\GitHub\TareasObras_v2
dotnet build src\TareasObras.API 2>&1 | Select-String "error|succeeded"
dotnet ef migrations add {Nombre} --project src\TareasObras.Infrastructure --startup-project src\TareasObras.API
dotnet ef database update --project src\TareasObras.Infrastructure --startup-project src\TareasObras.API

# Frontend — directorio raíz: D:\Programacion\GitHub\TareasObras_v2_Frontend
npx ng build --configuration development 2>&1 | Select-String "error|Error"
npm start   # http://localhost:4200 con proxy a https://localhost:52190
```

---

## 7. ESTADO ACTUAL (Sesión 7 — marzo 2026)

### Completado ✅
- CRUD completo: Obras, Tareas, Operarios, Categorías de operario
- Kanban drag & drop con cambio de estado entre columnas
- Presupuestos con versiones, número libre y aprobación
- Estructura jerárquica Presupuesto → Partidas → Líneas mixtas (Material + ManoObra)
- Registros de horas reales por obra y operario
- Materiales reales consumidos por obra
- KPIs: presupuesto aprobado, coste real, desviación, tareas pendientes
- PrimeNG 19 completamente migrado (p-select, p-datepicker)
- Dialogs con ConfirmationService para operaciones destructivas
- JWT auth con roles (Admin / Supervisor / Operario)
- Edit/delete en registros de horas y materiales

### Pendiente / Sugerencias próximas sesiones
- [ ] Exportación PDF de presupuestos por partidas
- [ ] Dashboard con gráficos de desviación (Chart.js / Recharts)
- [ ] Alertas cuando coste real supera % del presupuesto aprobado
- [ ] Gestión de cuadrillas (entidad existe en BD, sin UI)
- [ ] Filtros avanzados y paginación en lista de obras
- [ ] PWA / app móvil para registro de horas en campo
- [ ] Campo `numero` visible en `presupuestos.service.ts` al hacer create
