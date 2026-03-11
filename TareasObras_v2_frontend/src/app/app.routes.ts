import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/guards';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/components/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'obras',
        loadComponent: () => import('./features/obras/components/obras-list.component').then(m => m.ObrasListComponent)
      },
      {
        path: 'obras/nueva',
        loadComponent: () => import('./features/obras/components/obra-form.component').then(m => m.ObraFormComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'obras/:id',
        loadComponent: () => import('./features/obras/components/obra-detail.component').then(m => m.ObraDetailComponent)
      },
      {
        path: 'obras/:id/editar',
        loadComponent: () => import('./features/obras/components/obra-form.component').then(m => m.ObraFormComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'obras/:id/tareas',
        loadComponent: () => import('./features/tareas/components/tareas-kanban.component').then(m => m.TareasKanbanComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/usuarios/components/usuarios.component').then(m => m.UsuariosComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'operarios',
        loadComponent: () => import('./features/operarios/components/operarios.component').then(m => m.OperariosComponent)
      },
      {
        path: 'proveedores',
        loadComponent: () => import('./features/proveedores/components/proveedores.component').then(m => m.ProveedoresComponent)
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
