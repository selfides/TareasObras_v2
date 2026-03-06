# TareasObras Frontend — Fase 2

## Stack
- Angular 19 (standalone components)
- PrimeNG 19 + tema Aura (dark/light toggle)
- Tailwind CSS 3
- NgRx Signals (estado reactivo)
- Chart.js (dashboards)

## Requisitos
- Node.js 20+
- npm 10+
- API backend corriendo en `http://localhost:52191`

## Instalación

```powershell
# 1. Instalar dependencias
npm install

# 2. Arrancar en desarrollo
npm start
```

Abre `http://localhost:4200`

## Si el puerto de la API cambia
Edita `proxy.conf.json`:
```json
{ "/api": { "target": "http://localhost:TU_PUERTO" } }
```

## Estructura
```
src/app/
├── core/
│   ├── auth/          → AuthService (JWT + signals)
│   ├── guards/        → authGuard, adminGuard, supervisorGuard
│   ├── interceptors/  → JWT automático + manejo 401
│   ├── models/        → DTOs tipados (espejo del backend)
│   └── services/      → ObrasService, TareasService, UsuariosService
├── features/
│   ├── auth/          → Login
│   ├── dashboard/     → KPIs + gráficas
│   ├── obras/         → Lista, formulario, detalle + store NgRx
│   ├── tareas/        → Kanban drag&drop + store NgRx
│   ├── materiales/    → (preparado para Fase 3)
│   └── usuarios/      → Gestión usuarios (solo Admin)
└── shared/
    └── components/
        └── layout/    → Shell (sidebar + topbar + theme toggle)
```

## Pantallas disponibles
| Ruta | Descripción | Rol |
|------|-------------|-----|
| /auth/login | Login | Público |
| /dashboard | KPIs y gráficas | Todos |
| /obras | Tabla con filtros | Todos |
| /obras/nueva | Crear obra | Admin/Supervisor |
| /obras/:id | Detalle obra | Todos |
| /obras/:id/editar | Editar obra | Admin/Supervisor |
| /obras/:id/tareas | Kanban tareas | Todos |
| /usuarios | Gestión usuarios | Admin |

## Credenciales por defecto
- Email: `admin@tareasObras.com`
- Password: `Admin@1234`
