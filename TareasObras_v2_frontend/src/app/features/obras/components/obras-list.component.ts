import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ObrasStore } from '../store/obras.store';
import { AuthService } from '../../../core/auth/auth.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-obras-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TableModule, ButtonModule,
            InputTextModule, SelectModule, TagModule, ConfirmDialogModule, TooltipModule, SkeletonModule],
  providers: [ConfirmationService],
  template: `
    <div class="space-y-5 animate-fade-in">
      <p-confirmDialog />

      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Obras</h1>
          <p class="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
            {{ store.totalObras() }} obras · {{ store.obrasPorEstado().enCurso }} en curso
          </p>
        </div>
        @if (auth.isSupervisor()) {
          <a routerLink="/obras/nueva">
            <p-button label="Nueva Obra" icon="pi pi-plus" size="small" />
          </a>
        }
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-surface-900 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
        <div class="flex flex-col sm:flex-row gap-3">
          <input pInputText [(ngModel)]="searchText" (ngModelChange)="onSearch()" placeholder="Buscar por código, nombre o cliente..."
                 class="flex-1 text-sm" />
          <p-select [(ngModel)]="estadoFiltro" [options]="estadoOptions" optionLabel="label" optionValue="value"
                      placeholder="Todos los estados" [showClear]="true" (onChange)="onFiltro()"
                      styleClass="w-full sm:w-48 text-sm" />
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <p-table [value]="store.obras()" [loading]="store.loading()" responsiveLayout="scroll"
                 [paginator]="true" [rows]="15" [rowsPerPageOptions]="[10,15,25,50]"
                 styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="codigo">Código <p-sortIcon field="codigo"/></th>
              <th pSortableColumn="nombre">Nombre <p-sortIcon field="nombre"/></th>
              <th>Cliente</th>
              <th pSortableColumn="estado">Estado <p-sortIcon field="estado"/></th>
              <th>Tareas</th>
              <th pSortableColumn="presupuestoEstimado">Presupuesto <p-sortIcon field="presupuestoEstimado"/></th>
              <th>Fecha Inicio</th>
              <th class="text-center">Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-obra>
            <tr class="cursor-pointer" [routerLink]="['/obras', obra.id]">
              <td><span class="font-mono text-xs bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded">{{ obra.codigo }}</span></td>
              <td class="font-medium text-surface-900 dark:text-surface-100 max-w-xs truncate">{{ obra.nombre }}</td>
              <td class="text-surface-500 dark:text-surface-400 text-sm">{{ obra.cliente || '—' }}</td>
              <td>
                <span [class]="'px-2 py-0.5 rounded-full text-xs font-medium ' + estadoBadge(obra.estado)">
                  {{ obra.estadoNombre }}
                </span>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-1.5 w-16">
                    <div class="bg-primary-500 h-1.5 rounded-full transition-all"
                         [style.width.%]="obra.totalTareas ? (obra.totalTareas - obra.tareasPendientes) / obra.totalTareas * 100 : 0"></div>
                  </div>
                  <span class="text-xs text-surface-500">{{ obra.totalTareas - obra.tareasPendientes }}/{{ obra.totalTareas }}</span>
                </div>
              </td>
              <td class="font-medium text-surface-900 dark:text-surface-100">{{ obra.presupuestoEstimado | number:'1.0-0' }} €</td>
              <td class="text-sm text-surface-500 dark:text-surface-400">{{ obra.fechaInicio | date:'dd/MM/yyyy' }}</td>
              <td class="text-center" (click)="$event.stopPropagation()">
                <div class="flex items-center justify-center gap-1">
                  <a [routerLink]="['/obras', obra.id, 'tareas']">
                    <p-button icon="pi pi-list-check" size="small" [text]="true" pTooltip="Ver tareas" tooltipPosition="top" />
                  </a>
                  @if (auth.isSupervisor()) {
                    <a [routerLink]="['/obras', obra.id, 'editar']">
                      <p-button icon="pi pi-pencil" size="small" [text]="true" severity="secondary" pTooltip="Editar" tooltipPosition="top" />
                    </a>
                  }
                  @if (auth.isAdmin()) {
                    <p-button icon="pi pi-trash" size="small" [text]="true" severity="danger"
                              pTooltip="Eliminar" tooltipPosition="top" (onClick)="confirmDelete(obra)" />
                  }
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr><td colspan="8" class="text-center py-12 text-surface-400">
              <i class="pi pi-building text-4xl block mb-3"></i>
              No hay obras que mostrar
            </td></tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `
})
export class ObrasListComponent implements OnInit {
  store = inject(ObrasStore);
  auth = inject(AuthService);
  private confirm = inject(ConfirmationService);
  private msg = inject(MessageService);

  searchText = '';
  estadoFiltro = '';

  estadoOptions = [
    { label: 'Planificada', value: 'Planificada' },
    { label: 'En Curso',    value: 'EnCurso' },
    { label: 'Pausada',     value: 'Pausada' },
    { label: 'Completada',  value: 'Completada' },
    { label: 'Cancelada',   value: 'Cancelada' },
  ];

  ngOnInit() { this.store.loadObras({}); }

  onSearch() { this.store.loadObras({ search: this.searchText, estado: this.estadoFiltro }); }
  onFiltro() { this.store.loadObras({ search: this.searchText, estado: this.estadoFiltro }); }

  confirmDelete(obra: any) {
    this.confirm.confirm({
      message: `¿Eliminar la obra <strong>${obra.nombre}</strong>?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar', rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.deleteObra(obra.id);
        this.msg.add({ severity: 'success', summary: 'Eliminada', detail: obra.nombre });
      }
    });
  }

  estadoBadge(estado: number): string {
    const map: Record<number,string> = {
      1:'badge-planificada', 2:'badge-encurso', 3:'badge-pausada', 4:'badge-completada', 5:'badge-cancelada'
    };
    return map[estado] ?? '';
  }
}
