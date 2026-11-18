import {
  Component,
  computed,
  inject,
  signal,
  HostListener,
} from "@angular/core";
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../../core/auth/auth.service";
import { ThemeService } from "../../../core/services/theme.service";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { AvatarModule } from "primeng/avatar";
import { CommonModule } from "@angular/common";

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
  badge?: string;
  badgeClass?: string;
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

interface OmniboxItem {
  label: string;
  category: string;
  icon: string;
  route?: string;
  action?: () => void;
  badge?: string;
}

@Component({
  selector: "app-shell",
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ButtonModule,
    TooltipModule,
    AvatarModule,
    CommonModule,
  ],

  template: `
    <div
      class="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-950 font-sans"
    >
      <!-- Backdrop en pantallas móviles cuando el panel lateral está desplegado -->
      @if (isMobileOpen()) {
        <div
          class="fixed inset-0 bg-surface-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          (click)="closeMobile()"
          aria-hidden="true"
        ></div>
      }

      <!-- Espacio reservado en layout de escritorio para no desplazar el contenido al fijar/desfijar -->
      <div
        [class]="
          (isPinned() ? 'w-64' : 'w-16') +
          ' flex-shrink-0 transition-all duration-300 hidden lg:block'
        "
        aria-hidden="true"
      ></div>

      <!-- Panel Lateral Sensible (Sidebar / Drawer móvil) -->
      <aside
        [class]="
          [
            'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 transition-transform lg:transition-all duration-300 ease-out select-none',
            isMobileOpen()
              ? 'translate-x-0 w-72 max-w-[85vw] shadow-2xl'
              : '-translate-x-full lg:translate-x-0',
            isExpanded() ? 'lg:w-64' : 'lg:w-16',
            !isPinned() && isHovered()
              ? 'lg:shadow-2xl lg:ring-1 lg:ring-black/10 dark:lg:ring-white/10'
              : '',
          ].join(' ')
        "
        (mouseenter)="onSidebarMouseEnter()"
        (mouseleave)="onSidebarMouseLeave()"
        (focusin)="onSidebarMouseEnter()"
        role="navigation"
        aria-label="Panel de navegación principal"
      >
        <!-- Cabecera del Panel (Logo y Acciones de fijado/cierre) -->
        <div
          class="flex items-center justify-between px-3.5 py-4 border-b border-surface-200 dark:border-surface-700 h-16 flex-shrink-0"
        >
          <div class="flex items-center gap-3 overflow-hidden">
            <div
              class="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-700 to-primary-500 flex items-center justify-center flex-shrink-0 shadow-sm text-white"
            >
              <i class="pi pi-building text-base"></i>
            </div>
            @if (isExpanded() || isMobileOpen()) {
              <div
                class="flex flex-col min-w-0 transition-opacity duration-200"
              >
                <span
                  class="font-bold text-surface-900 dark:text-surface-100 text-base tracking-tight truncate"
                  >TareasObras</span
                >
                <span
                  class="text-[10px] font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider"
                  >Gestión & Control</span
                >
              </div>
            }
          </div>

          <!-- Botones superiores: Fijar en desktop, Cerrar en móvil -->
          <div class="flex items-center">
            @if (isExpanded()) {
              <!-- Botón fijar/desanclar panel (solo desktop) -->
              <button
                (click)="togglePin()"
                type="button"
                class="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                [pTooltip]="
                  isPinned()
                    ? 'Desanclar panel (modo sensible flotante)'
                    : 'Fijar panel abierto'
                "
                tooltipPosition="bottom"
                [attr.aria-label]="
                  isPinned() ? 'Desanclar panel' : 'Fijar panel'
                "
              >
                <i
                  [class]="
                    'pi pi-thumbtack text-xs transition-transform duration-200 ' +
                    (isPinned()
                      ? 'text-primary-600 rotate-0'
                      : '-rotate-45 text-surface-400')
                  "
                ></i>
              </button>
            }

            <!-- Botón cerrar en móvil (44x44px accesible para touch) -->
            <button
              (click)="closeMobile()"
              type="button"
              class="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 active:scale-95 transition-all"
              aria-label="Cerrar panel lateral"
            >
              <i class="pi pi-times text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Indicador de modo sensible flotante cuando está colapsado y se posiciona encima (solo desktop) -->
        @if (!isPinned() && isHovered() && isExpanded()) {
          <div
            class="hidden lg:flex items-center justify-between px-3 py-1.5 bg-primary-50/70 dark:bg-primary-950/40 border-b border-primary-100 dark:border-primary-900/50 text-[11px] text-primary-700 dark:text-primary-300"
          >
            <span class="flex items-center gap-1.5 font-medium truncate">
              <i class="pi pi-sparkles text-[10px]"></i>
              Modo sensible activo
            </span>
            <button
              (click)="togglePin()"
              class="hover:underline font-semibold text-[10px] cursor-pointer"
            >
              Fijar
            </button>
          </div>
        }

        <!-- Grupos de Navegación -->
        <nav
          class="flex-1 px-2 py-3 overflow-y-auto space-y-3 overscroll-contain"
        >
          @for (
            group of visibleGroups();
            track group.name;
            let isFirst = $first
          ) {
            <div class="space-y-1">
              @if (isExpanded() || isMobileOpen()) {
                <div
                  class="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500 truncate"
                >
                  {{ group.name }}
                </div>
              } @else if (!isFirst) {
                <div
                  class="my-2 mx-2 border-t border-surface-200 dark:border-surface-700/60"
                  aria-hidden="true"
                ></div>
              }

              @for (item of group.items; track item.route) {
                <a
                  [routerLink]="item.route"
                  routerLinkActive="bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 font-semibold shadow-sm border-l-4 border-primary-600"
                  (click)="onNavClick()"
                  class="group flex items-center gap-3 px-3 py-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 transition-all duration-150 min-h-[44px] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 border-l-4 border-transparent"
                  [pTooltip]="
                    !isExpanded() && !isMobileOpen() ? item.label : ''
                  "
                  tooltipPosition="right"
                >
                  <i
                    [class]="
                      item.icon +
                      ' text-base w-5 text-center flex-shrink-0 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'
                    "
                  ></i>
                  @if (isExpanded() || isMobileOpen()) {
                    <span class="text-sm truncate flex-1">{{
                      item.label
                    }}</span>
                    @if (item.badge) {
                      <span
                        [class]="
                          'px-1.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide flex-shrink-0 ' +
                          (item.badgeClass ||
                            'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300')
                        "
                      >
                        {{ item.badge }}
                      </span>
                    }
                  }
                </a>
              }
            </div>
          }
        </nav>

        <!-- Pie del Panel: Usuario y alternador de estado -->
        <div
          class="border-t border-surface-200 dark:border-surface-700 p-2.5 bg-surface-50/50 dark:bg-surface-900/50 flex-shrink-0 space-y-2"
        >
          @if (isExpanded() || isMobileOpen()) {
            <div
              class="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-white dark:bg-surface-800/60 border border-surface-200/70 dark:border-surface-700/60 shadow-xs"
            >
              <p-avatar
                [label]="userInitials()"
                styleClass="flex-shrink-0"
                size="normal"
                shape="circle"
                [style]="{
                  'background-color': '#2563eb',
                  color: '#fff',
                  'font-weight': '600',
                }"
              />
              <div class="min-w-0 flex-1">
                <p
                  class="text-xs font-semibold text-surface-900 dark:text-surface-100 truncate"
                >
                  {{ auth.user()?.nombreCompleto }}
                </p>
                <span
                  class="inline-block px-1.5 py-0.2 rounded text-[10px] font-medium bg-primary-100 dark:bg-primary-950 text-primary-800 dark:text-primary-300 truncate"
                >
                  {{ auth.user()?.rol }}
                </span>
              </div>
            </div>
          } @else {
            <div class="flex justify-center py-1">
              <p-avatar
                [label]="userInitials()"
                styleClass="flex-shrink-0 cursor-pointer"
                size="normal"
                shape="circle"
                [style]="{ 'background-color': '#2563eb', color: '#fff' }"
                [pTooltip]="
                  auth.user()?.nombreCompleto + ' (' + auth.user()?.rol + ')'
                "
                tooltipPosition="right"
              />
            </div>
          }

          <!-- Botón de colapsar/expandir rápido (solo desktop) -->
          <button
            (click)="toggleCollapseClick()"
            type="button"
            class="hidden lg:flex w-full items-center justify-center gap-2 p-2 rounded-lg text-surface-500 hover:text-surface-800 dark:hover:text-surface-200 hover:bg-surface-200/60 dark:hover:bg-surface-800 transition-colors text-xs font-medium"
            [pTooltip]="isExpanded() ? 'Reducir panel' : 'Expandir panel'"
            [tooltipPosition]="isExpanded() ? 'top' : 'right'"
            [attr.aria-label]="
              isExpanded() ? 'Reducir panel' : 'Expandir panel'
            "
          >
            <i
              [class]="
                isExpanded() ? 'pi pi-chevron-left' : 'pi pi-chevron-right'
              "
            ></i>
            @if (isExpanded()) {
              <span class="text-xs">{{
                isPinned() ? "Colapsar panel" : "Fijar abierto"
              }}</span>
            }
          </button>
        </div>
      </aside>

      <!-- Panel Principal -->
      <div
        class="flex-1 flex flex-col min-w-0 overflow-hidden"
        (mouseenter)="onMainMouseEnter()"
      >
        <!-- Topbar ERP -->
        <header
          class="h-16 flex items-center justify-between px-3 sm:px-6 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 flex-shrink-0 shadow-2xs z-10"
        >
          <div class="flex items-center gap-2 sm:gap-4 min-w-0">
            <!-- Botón de apertura en móviles (44x44px accesible con parada de propagación) -->
            <button
              (click)="toggleMobile($event)"
              type="button"
              class="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl text-surface-700 dark:text-surface-200 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 flex-shrink-0"
              [attr.aria-expanded]="isMobileOpen()"
              aria-label="Abrir panel lateral de navegación"
            >
              <i class="pi pi-bars text-xl"></i>
            </button>

            <!-- Saludo o título contextual -->
            <div class="min-w-0">
              <h1
                class="text-xs sm:text-sm font-semibold text-surface-700 dark:text-surface-300 truncate"
              >
                Bienvenido,
                <span
                  class="text-primary-600 dark:text-primary-400 font-bold"
                  >{{ auth.user()?.nombreCompleto }}</span
                >
              </h1>
              <p
                class="hidden sm:block text-[11px] text-surface-400 dark:text-surface-500"
              >
                Panel de control de proyectos y partes de trabajo
              </p>
            </div>

            <!-- Buscador Global Omnibox ERP (Ctrl + K) -->
            <button
              (click)="openOmnibox()"
              type="button"
              class="hidden md:flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/80 hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 text-xs transition-colors w-56 lg:w-64 cursor-pointer"
              aria-label="Buscar en ERP (Ctrl + K)"
            >
              <span class="flex items-center gap-2 truncate">
                <i class="pi pi-search text-xs text-surface-400"></i>
                <span class="truncate">Buscar en ERP...</span>
              </span>
              <kbd
                class="px-1.5 py-0.5 rounded bg-surface-200/80 dark:bg-surface-700/80 font-mono text-[10px] text-surface-500 dark:text-surface-400 border border-surface-300/60 dark:border-surface-600/60"
              >
                Ctrl K
              </kbd>
            </button>
          </div>

          <div class="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <!-- Badge Corporativo ERP (Desktop) -->
            <div
              class="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-100/70 dark:bg-surface-800/70 border border-surface-200/80 dark:border-surface-700/80 text-[11px] font-medium text-surface-600 dark:text-surface-400"
            >
              <span
                class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
              ></span>
              <span class="font-semibold text-surface-800 dark:text-surface-200"
                >TareasObras Cloud</span
              >
              <span class="text-surface-300 dark:text-surface-600">•</span>
              <span class="font-mono text-primary-600 dark:text-primary-400"
                >Ej. 2026</span
              >
            </div>

            <!-- Botón Acceso Rápido Móvil Operario -->
            <a
              routerLink="/portal-operario"
              class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 font-semibold text-xs transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800/60 min-h-[40px]"
              pTooltip="Abrir Portal Móvil de Fichaje y Albaranes"
              tooltipPosition="bottom"
            >
              <i class="pi pi-mobile text-sm"></i>
              <span class="hidden md:inline">Portal Operario</span>
            </a>

            <!-- Alertas / Notificaciones Operativas ERP -->
            <div class="relative">
              <button
                (click)="toggleNotifications($event)"
                type="button"
                class="w-10 h-10 flex items-center justify-center rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 relative"
                [pTooltip]="'Centro de notificaciones operativas'"
                tooltipPosition="bottom"
                aria-label="Notificaciones operativas"
              >
                <i class="pi pi-bell text-base"></i>
                <span
                  class="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-surface-900"
                ></span>
              </button>

              <!-- Panel Desplegable de Notificaciones Operativas -->
              @if (isNotificationsOpen()) {
                <div
                  class="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-2xl z-50 p-3 space-y-2 text-xs"
                >
                  <div
                    class="flex items-center justify-between pb-2 border-b border-surface-100 dark:border-surface-800"
                  >
                    <span
                      class="font-bold text-surface-900 dark:text-surface-100 flex items-center gap-1.5"
                    >
                      <i class="pi pi-bell text-xs text-primary-600"></i>
                      Alertas del Sistema ERP
                    </span>
                    <span
                      class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"
                    >
                      3 pendientes
                    </span>
                  </div>

                  <div class="space-y-1.5 max-h-60 overflow-y-auto">
                    <div
                      class="p-2 rounded-lg bg-surface-50 dark:bg-surface-800/60 border border-surface-100 dark:border-surface-700/60 flex items-start gap-2.5"
                    >
                      <i
                        class="pi pi-exclamation-triangle text-amber-500 text-sm mt-0.5"
                      ></i>
                      <div class="min-w-0 flex-1">
                        <p
                          class="font-semibold text-surface-800 dark:text-surface-200 text-xs"
                        >
                          Desviación en Presupuesto
                        </p>
                        <p
                          class="text-[11px] text-surface-500 dark:text-surface-400 truncate"
                        >
                          Obra 'Residencial Los Álamos' supera el 5% estimado
                        </p>
                      </div>
                    </div>
                    <div
                      class="p-2 rounded-lg bg-surface-50 dark:bg-surface-800/60 border border-surface-100 dark:border-surface-700/60 flex items-start gap-2.5"
                    >
                      <i class="pi pi-clock text-blue-500 text-sm mt-0.5"></i>
                      <div class="min-w-0 flex-1">
                        <p
                          class="font-semibold text-surface-800 dark:text-surface-200 text-xs"
                        >
                          Partes de Trabajo Pendientes
                        </p>
                        <p
                          class="text-[11px] text-surface-500 dark:text-surface-400 truncate"
                        >
                          Hay 2 partes de ayer esperando validación de
                          supervisor
                        </p>
                      </div>
                    </div>
                    <div
                      class="p-2 rounded-lg bg-surface-50 dark:bg-surface-800/60 border border-surface-100 dark:border-surface-700/60 flex items-start gap-2.5"
                    >
                      <i class="pi pi-box text-emerald-500 text-sm mt-0.5"></i>
                      <div class="min-w-0 flex-1">
                        <p
                          class="font-semibold text-surface-800 dark:text-surface-200 text-xs"
                        >
                          Stock de Materiales
                        </p>
                        <p
                          class="text-[11px] text-surface-500 dark:text-surface-400 truncate"
                        >
                          Cemento y Yeso bajo umbral de seguridad en almacén
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    class="pt-2 border-t border-surface-100 dark:border-surface-800 flex justify-between items-center text-[11px]"
                  >
                    <a
                      routerLink="/dashboard"
                      (click)="isNotificationsOpen.set(false)"
                      class="text-primary-600 hover:underline font-medium"
                      >Ver panel de control</a
                    >
                    <button
                      (click)="isNotificationsOpen.set(false)"
                      class="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Alternador de Tema Oscuro / Claro -->
            <button
              (click)="toggleTheme()"
              type="button"
              class="w-10 h-10 flex items-center justify-center rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              [pTooltip]="
                theme.isDark()
                  ? 'Cambiar a modo claro'
                  : 'Cambiar a modo oscuro'
              "
              tooltipPosition="bottom"
              [attr.aria-label]="
                theme.isDark() ? 'Activar modo claro' : 'Activar modo oscuro'
              "
            >
              <i
                [class]="
                  theme.isDark() ? 'pi pi-sun text-amber-400' : 'pi pi-moon'
                "
              ></i>
            </button>

            <!-- Cerrar Sesión -->
            <button
              (click)="logout()"
              type="button"
              class="w-10 h-10 flex items-center justify-center rounded-lg text-surface-600 dark:text-surface-400 hover:bg-red-50 dark:hover:bg-red-950/70 hover:text-red-600 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              pTooltip="Cerrar sesión"
              tooltipPosition="bottom"
              aria-label="Cerrar sesión"
            >
              <i class="pi pi-sign-out"></i>
            </button>
          </div>
        </header>

        <!-- Modal Buscador Global Omnibox ERP (Ctrl + K) -->
        @if (isOmniboxOpen()) {
          <div
            class="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
          >
            <!-- Backdrop -->
            <div
              class="fixed inset-0 bg-surface-950/60 backdrop-blur-xs transition-opacity"
              (click)="closeOmnibox()"
              aria-hidden="true"
            ></div>

            <!-- Ventana del Omnibox -->
            <div
              class="relative w-full max-w-2xl bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden flex flex-col z-10 animate-fade-in"
              role="dialog"
              aria-label="Buscador global ERP"
            >
              <!-- Cabecera de búsqueda con Input -->
              <div
                class="flex items-center gap-3 px-4 py-3 border-b border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-950/50"
              >
                <i class="pi pi-search text-surface-400 text-base"></i>
                <input
                  #omniboxInput
                  type="text"
                  [ngModel]="omniboxQuery()"
                  (ngModelChange)="omniboxQuery.set($event)"
                  placeholder="Buscar módulo, obra, parte, operario o acción rápida..."
                  class="flex-1 bg-transparent border-0 text-surface-900 dark:text-surface-100 placeholder-surface-400 text-sm focus:outline-none"
                  autofocus
                />
                <kbd
                  class="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface-200 dark:bg-surface-800 font-mono text-[10px] text-surface-500 border border-surface-300 dark:border-surface-700"
                >
                  ESC
                </kbd>
                <button
                  (click)="closeOmnibox()"
                  class="text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 text-sm p-1"
                  aria-label="Cerrar"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>

              <!-- Lista de Resultados Filtrados -->
              <div class="max-h-96 overflow-y-auto p-2 space-y-1">
                @if (filteredOmniboxItems().length === 0) {
                  <div class="p-8 text-center text-surface-400">
                    <i class="pi pi-search text-2xl mb-2 opacity-50"></i>
                    <p class="text-sm">
                      No se encontraron resultados para "{{ omniboxQuery() }}"
                    </p>
                  </div>
                } @else {
                  @for (item of filteredOmniboxItems(); track item.label) {
                    <div
                      (click)="selectOmniboxItem(item)"
                      class="group flex items-center justify-between p-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/60 cursor-pointer transition-colors"
                    >
                      <div class="flex items-center gap-3 min-w-0">
                        <div
                          class="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900 flex items-center justify-center text-surface-600 dark:text-surface-300 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors"
                        >
                          <i [class]="item.icon + ' text-sm'"></i>
                        </div>
                        <div class="min-w-0">
                          <p
                            class="text-sm font-semibold text-surface-800 dark:text-surface-100 group-hover:text-primary-700 dark:group-hover:text-primary-300 truncate"
                          >
                            {{ item.label }}
                          </p>
                          <p
                            class="text-[11px] text-surface-400 dark:text-surface-500 truncate"
                          >
                            {{ item.category }}
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        @if (item.badge) {
                          <span
                            class="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400"
                          >
                            {{ item.badge }}
                          </span>
                        }
                        <i
                          class="pi pi-chevron-right text-xs text-surface-300 group-hover:text-primary-500 transition-colors"
                        ></i>
                      </div>
                    </div>
                  }
                }
              </div>

              <!-- Pie de ayuda del Omnibox -->
              <div
                class="px-4 py-2 border-t border-surface-100 dark:border-surface-800/80 bg-surface-50/50 dark:bg-surface-950/30 flex items-center justify-between text-[11px] text-surface-400"
              >
                <span class="flex items-center gap-2">
                  <span class="font-mono">↵</span> Seleccionar
                  <span class="font-mono ml-2">ESC</span> Salir
                </span>
                <span class="font-medium text-surface-500"
                  >Navegación Rápida ERP</span
                >
              </div>
            </div>
          </div>
        }

        <!-- Contenedor del contenido principal de la ruta -->
        <main
          (click)="onMainContentClick()"
          class="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 lg:pb-6 bg-surface-50 dark:bg-surface-950 focus:outline-none"
          tabindex="-1"
        >
          <router-outlet />
        </main>

        <!-- Barra de Navegación Inferior Móvil (Bottom Navigation Bar) -->
        <nav
          class="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md border-t border-surface-200 dark:border-surface-800 z-30 flex items-center justify-around px-1 pb-[env(safe-area-inset-bottom)] shadow-lg"
          role="navigation"
          aria-label="Navegación rápida móvil"
        >
          <a
            routerLink="/dashboard"
            routerLinkActive="text-primary-600 dark:text-primary-400 font-semibold"
            [routerLinkActiveOptions]="{ exact: true }"
            class="flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <i class="pi pi-chart-bar text-lg"></i>
            <span class="text-[10px] mt-0.5">Inicio</span>
          </a>

          <a
            routerLink="/obras"
            routerLinkActive="text-primary-600 dark:text-primary-400 font-semibold"
            class="flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <i class="pi pi-building text-lg"></i>
            <span class="text-[10px] mt-0.5">Obras</span>
          </a>

          <a
            routerLink="/tareas"
            routerLinkActive="text-primary-600 dark:text-primary-400 font-semibold"
            class="flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <i class="pi pi-list-check text-lg"></i>
            <span class="text-[10px] mt-0.5">Tareas</span>
          </a>

          <a
            routerLink="/portal-operario"
            routerLinkActive="text-emerald-600 dark:text-emerald-400 font-semibold"
            class="flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 text-surface-500 dark:text-surface-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <i
              class="pi pi-mobile text-lg text-emerald-600 dark:text-emerald-400"
            ></i>
            <span
              class="text-[10px] mt-0.5 text-emerald-600 dark:text-emerald-400 font-medium"
              >Portal</span
            >
          </a>

          <button
            (click)="toggleMobile($event)"
            type="button"
            class="flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors active:scale-95"
            aria-label="Abrir menú completo"
          >
            <i class="pi pi-bars text-lg"></i>
            <span class="text-[10px] mt-0.5 font-medium">Menú</span>
          </button>
        </nav>
      </div>
    </div>
  `,
})
export class ShellComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  private router = inject(Router);

  // Estado del panel lateral
  isPinned = signal<boolean>(this.loadPinnedPreference());
  isHovered = signal<boolean>(false);
  isMobileOpen = signal<boolean>(false);

  // Estado del Buscador Omnibox ERP & Notificaciones
  isOmniboxOpen = signal<boolean>(false);
  omniboxQuery = signal<string>("");
  isNotificationsOpen = signal<boolean>(false);

  // Computado: ¿debe mostrarse con contenido expandido (nombres, grupos, badges)?
  isExpanded = computed(
    () => this.isPinned() || this.isHovered() || this.isMobileOpen(),
  );

  private leaveTimeout: ReturnType<typeof setTimeout> | null = null;

  private allOmniboxItems: OmniboxItem[] = [
    {
      label: "Dashboard General",
      category: "Navegación ERP",
      icon: "pi pi-chart-bar",
      route: "/dashboard",
    },
    {
      label: "Obras y Proyectos",
      category: "Navegación ERP",
      icon: "pi pi-building",
      route: "/obras",
    },
    {
      label: "Nueva Obra",
      category: "Acciones Rápidas",
      icon: "pi pi-plus-circle",
      route: "/obras",
      badge: "Supervisor",
    },
    {
      label: "Diario de Obra (Partes de Trabajo)",
      category: "Navegación ERP",
      icon: "pi pi-book",
      route: "/partes-trabajo",
    },
    {
      label: "Registrar Horas / Parte",
      category: "Acciones Rápidas",
      icon: "pi pi-calendar-plus",
      route: "/partes-trabajo",
    },
    {
      label: "Tareas y Kanban",
      category: "Navegación ERP",
      icon: "pi pi-list-check",
      route: "/tareas",
    },
    {
      label: "Materiales y Suministros",
      category: "Navegación ERP",
      icon: "pi pi-box",
      route: "/materiales",
    },
    {
      label: "Proveedores",
      category: "Navegación ERP",
      icon: "pi pi-truck",
      route: "/proveedores",
    },
    {
      label: "Operarios y Personal",
      category: "Navegación ERP",
      icon: "pi pi-id-card",
      route: "/operarios",
    },
    {
      label: "Portal Móvil Operario (Fichaje)",
      category: "Portal Móvil",
      icon: "pi pi-mobile",
      route: "/portal-operario",
      badge: "Operario",
    },
    {
      label: "Gestión de Usuarios y Roles",
      category: "Administración",
      icon: "pi pi-users",
      route: "/usuarios",
      badge: "Admin",
    },
    {
      label: "Alternar Modo Oscuro / Claro",
      category: "Ajustes",
      icon: "pi pi-palette",
      action: () => this.toggleTheme(),
    },
  ];

  filteredOmniboxItems = computed(() => {
    const q = this.omniboxQuery().trim().toLowerCase();
    if (!q) {
      return this.allOmniboxItems;
    }
    return this.allOmniboxItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  });

  @HostListener("window:keydown", ["$event"])
  handleGlobalShortcuts(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      this.isOmniboxOpen.update((v) => !v);
      if (this.isOmniboxOpen()) {
        this.omniboxQuery.set("");
      }
    } else if (event.key === "Escape" && this.isOmniboxOpen()) {
      this.closeOmnibox();
    }
  }

  openOmnibox(): void {
    this.omniboxQuery.set("");
    this.isOmniboxOpen.set(true);
  }

  closeOmnibox(): void {
    this.isOmniboxOpen.set(false);
  }

  selectOmniboxItem(item: OmniboxItem): void {
    this.closeOmnibox();
    if (item.action) {
      item.action();
    } else if (item.route) {
      this.router.navigateByUrl(item.route);
    }
  }

  toggleNotifications(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isNotificationsOpen.update((v) => !v);
  }

  private navGroups: NavGroup[] = [
    {
      name: "Principal",
      items: [
        { label: "Dashboard", icon: "pi pi-chart-bar", route: "/dashboard" },
      ],
    },
    {
      name: "Gestión de Obras",
      items: [
        { label: "Obras", icon: "pi pi-building", route: "/obras" },
        { label: "Diario Obra", icon: "pi pi-book", route: "/partes-trabajo" },
        { label: "Tareas", icon: "pi pi-list-check", route: "/tareas" },
      ],
    },
    {
      name: "Recursos & Logística",
      items: [
        { label: "Materiales", icon: "pi pi-box", route: "/materiales" },
        {
          label: "Proveedores",
          icon: "pi pi-truck",
          route: "/proveedores",
          roles: ["Admin", "Supervisor"],
        },
        {
          label: "Operarios",
          icon: "pi pi-id-card",
          route: "/operarios",
          roles: ["Admin", "Supervisor"],
        },
      ],
    },
    {
      name: "Administración & Móvil",
      items: [
        {
          label: "Usuarios",
          icon: "pi pi-users",
          route: "/usuarios",
          roles: ["Admin"],
        },
        {
          label: "Portal Móvil",
          icon: "pi pi-mobile",
          route: "/portal-operario",
          badge: "Operario",
          badgeClass:
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
        },
      ],
    },
  ];

  private loadPinnedPreference(): boolean {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = localStorage.getItem("to_sidebar_pinned");
      if (saved !== null) {
        return saved === "true";
      }
    }
    return true; // Por defecto fijado
  }

  visibleGroups(): NavGroup[] {
    const userRole = this.auth.user()?.rol ?? "";
    return this.navGroups
      .map((group) => ({
        name: group.name,
        items: group.items.filter(
          (item) => !item.roles || item.roles.includes(userRole),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }

  userInitials(): string {
    const name = this.auth.user()?.nombreCompleto ?? "";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  togglePin(): void {
    const next = !this.isPinned();
    this.isPinned.set(next);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("to_sidebar_pinned", String(next));
    }
    if (next) {
      this.isHovered.set(false);
    }
  }

  toggleCollapseClick(): void {
    if (this.isPinned()) {
      // Si estaba fijado, desanclar y colapsar a modo sensible
      this.isPinned.set(false);
      this.isHovered.set(false);
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("to_sidebar_pinned", "false");
      }
    } else {
      // Si estaba desanclado, fijarlo abierto
      this.isPinned.set(true);
      this.isHovered.set(false);
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("to_sidebar_pinned", "true");
      }
    }
  }

  toggleMobile(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isMobileOpen.update((v) => !v);
  }

  closeMobile(): void {
    this.isMobileOpen.set(false);
  }

  onSidebarMouseEnter(): void {
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout);
      this.leaveTimeout = null;
    }
    if (!this.isPinned()) {
      this.isHovered.set(true);
    }
  }

  onSidebarMouseLeave(): void {
    if (!this.isPinned()) {
      this.leaveTimeout = setTimeout(() => {
        this.isHovered.set(false);
      }, 140);
    }
  }

  onMainMouseEnter(): void {
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout);
      this.leaveTimeout = null;
    }
    if (!this.isPinned() && this.isHovered()) {
      this.isHovered.set(false);
    }
  }

  onMainContentClick(): void {
    if (!this.isPinned() && this.isHovered()) {
      this.isHovered.set(false);
    }
  }

  onNavClick(): void {
    if (this.isMobileOpen()) {
      this.isMobileOpen.set(false);
    }
    if (!this.isPinned()) {
      this.isHovered.set(false);
    }
  }

  toggleTheme(): void {
    this.theme.toggle();
  }

  logout(): void {
    this.auth.logout();
  }
}
