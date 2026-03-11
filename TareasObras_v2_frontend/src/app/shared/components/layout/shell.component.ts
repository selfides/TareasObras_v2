import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';

interface NavItem { label: string; icon: string; route: string; roles?: string[]; }

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, TooltipModule, AvatarModule, CommonModule],
  template: `
    <div class="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-950">

      <!-- Sidebar -->
      <aside [class]="(collapsed() ? 'w-16' : 'w-64') + ' flex flex-col h-full bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 transition-all duration-300 z-20'">

        <!-- Logo -->
        <div class="flex items-center gap-3 px-4 py-5 border-b border-surface-200 dark:border-surface-700">
          <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
            <i class="pi pi-building text-white text-sm"></i>
          </div>
          @if (!collapsed()) {
            <span class="font-bold text-surface-900 dark:text-surface-100 text-lg tracking-tight">TareasObras</span>
          }
        </div>

        <!-- Nav -->
        <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          @for (item of visibleNav(); track item.route) {
            <a [routerLink]="item.route" routerLinkActive="bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
               [pTooltip]="collapsed() ? item.label : ''" tooltipPosition="right">
              <i [class]="item.icon + ' text-base w-4 flex-shrink-0'"></i>
              @if (!collapsed()) {
                <span class="text-sm font-medium">{{ item.label }}</span>
              }
            </a>
          }
        </nav>

        <!-- User + collapse -->
        <div class="border-t border-surface-200 dark:border-surface-700 p-3 space-y-2">
          @if (!collapsed()) {
            <div class="flex items-center gap-3 px-2 py-2 rounded-lg">
              <p-avatar [label]="userInitials()" styleClass="flex-shrink-0" size="normal"
                        shape="circle" [style]="{'background-color': '#3b82f6', 'color': '#fff'}"/>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">{{ auth.user()?.nombreCompleto }}</p>
                <p class="text-xs text-surface-500 truncate">{{ auth.user()?.rol }}</p>
              </div>
            </div>
          }
          <button (click)="toggleCollapse()"
                  class="w-full flex items-center justify-center p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <i [class]="(collapsed() ? 'pi pi-chevron-right' : 'pi pi-chevron-left')"></i>
          </button>
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1 flex flex-col overflow-hidden">

        <!-- Topbar -->
        <header class="h-14 flex items-center justify-between px-6 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 flex-shrink-0">
          <h1 class="text-sm font-semibold text-surface-700 dark:text-surface-300">
            Bienvenido, <span class="text-primary-600 dark:text-primary-400">{{ auth.user()?.nombreCompleto }}</span>
          </h1>
          <div class="flex items-center gap-2">
            <button (click)="toggleTheme()"
                    class="w-9 h-9 flex items-center justify-center rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <i [class]="(theme.isDark() ? 'pi pi-sun' : 'pi pi-moon')"></i>
            </button>
            <button (click)="logout()"
                    class="w-9 h-9 flex items-center justify-center rounded-lg text-surface-600 dark:text-surface-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors"
                    pTooltip="Cerrar sesión" tooltipPosition="left">
              <i class="pi pi-sign-out"></i>
            </button>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class ShellComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  collapsed = signal(false);

  private navItems: NavItem[] = [
    { label: 'Dashboard',  icon: 'pi pi-chart-bar',  route: '/dashboard' },
    { label: 'Obras',      icon: 'pi pi-building',   route: '/obras' },
    { label: 'Usuarios',   icon: 'pi pi-users',      route: '/usuarios',  roles: ['Admin'] },
    { label: 'Operarios',  icon: 'pi pi-id-card',   route: '/operarios', roles: ['Admin', 'Supervisor'] },
  ];

  visibleNav() {
    return this.navItems.filter(n => !n.roles || n.roles.includes(this.auth.user()?.rol ?? ''));
  }

  userInitials() {
    const name = this.auth.user()?.nombreCompleto ?? '';
    return name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
  }

  toggleCollapse() { this.collapsed.set(!this.collapsed()); }
  toggleTheme()    { this.theme.toggle(); }
  logout()         { this.auth.logout(); }
}
