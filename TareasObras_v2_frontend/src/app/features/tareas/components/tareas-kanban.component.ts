import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TareasStore } from '../store/tareas.store';
import { AuthService } from '../../../core/auth/auth.service';
import { TareaDto, EstadoTarea, PrioridadTarea } from '../../../core/models';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';

interface KanbanCol { label: string; estado: EstadoTarea; color: string; headerColor: string; }

@Component({
  selector: 'app-tareas-kanban',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonModule, DialogModule,
            InputTextModule, SelectModule, TextareaModule, InputNumberModule, TooltipModule],
  template: `
    <div class="space-y-4 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <a [routerLink]="['/obras', obraId()]">
            <p-button icon="pi pi-arrow-left" [text]="true" severity="secondary" size="small" />
          </a>
          <div>
            <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Kanban de Tareas</h1>
            <p class="text-surface-500 text-sm mt-0.5">
              {{ store.horasTotalesReales() }}h reales · {{ store.horasTotalesEstimadas() }}h estimadas
            </p>
          </div>
        </div>
        @if (auth.isSupervisor()) {
          <p-button label="Nueva Tarea" icon="pi pi-plus" size="small" (onClick)="openNew()" />
        }
      </div>

      <!-- Kanban board -->
      <div class="flex gap-4 overflow-x-auto pb-4">
        @for (col of columns; track col.estado) {
          <div class="kanban-col flex-shrink-0 w-72"
               (dragover)="$event.preventDefault()"
               (drop)="onDrop($event, col.estado)">

            <!-- Column header -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div [class]="'w-2.5 h-2.5 rounded-full ' + col.color"></div>
                <span class="text-sm font-semibold text-surface-700 dark:text-surface-300">{{ col.label }}</span>
                <span class="text-xs bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400 px-1.5 py-0.5 rounded-full">
                  {{ tareasEnEstado(col.estado).length }}
                </span>
              </div>
            </div>

            <!-- Cards -->
            @for (tarea of tareasEnEstado(col.estado); track tarea.id) {
              <div class="kanban-card"
                   draggable="true"
                   (dragstart)="onDragStart($event, tarea)"
                   (click)="openEdit(tarea)">

                <!-- Priority badge -->
                <div class="flex items-center justify-between mb-2">
                  <span [class]="'px-2 py-0.5 rounded text-xs font-medium ' + prioridadBadge(tarea.prioridad)">
                    {{ tarea.prioridadNombre }}
                  </span>
                  @if (auth.isSupervisor()) {
                    <button (click)="$event.stopPropagation(); deleteTarea(tarea)"
                            class="text-surface-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <i class="pi pi-times text-xs"></i>
                    </button>
                  }
                </div>

                <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-1 line-clamp-2">{{ tarea.titulo }}</h4>
                @if (tarea.descripcion) {
                  <p class="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 mb-2">{{ tarea.descripcion }}</p>
                }

                <div class="flex items-center justify-between text-xs text-surface-400 mt-2 pt-2 border-t border-surface-100 dark:border-surface-700">
                  <span><i class="pi pi-clock mr-1"></i>{{ tarea.horasReales }}h / {{ tarea.horasEstimadas }}h</span>
                  @if (tarea.fechaLimite) {
                    <span [class]="estaVencida(tarea.fechaLimite) ? 'text-red-500' : ''">
                      <i class="pi pi-calendar mr-1"></i>{{ tarea.fechaLimite | date:'dd/MM' }}
                    </span>
                  }
                </div>
              </div>
            }

            <!-- Drop zone hint -->
            @if (tareasEnEstado(col.estado).length === 0) {
              <div class="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg p-6 text-center text-surface-400 text-xs">
                Arrastra tareas aquí
              </div>
            }
          </div>
        }
      </div>
    </div>

    <!-- Dialog nueva/editar tarea -->
    <p-dialog [(visible)]="dialogVisible" [header]="editingTarea() ? 'Editar Tarea' : 'Nueva Tarea'"
              [modal]="true" [style]="{width: '520px'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Título *</label>
          <input pInputText [(ngModel)]="tareaForm.titulo" class="w-full" placeholder="Título de la tarea" />
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Descripción</label>
          <textarea pTextarea [(ngModel)]="tareaForm.descripcion" rows="3" class="w-full" placeholder="Descripción opcional..."></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Prioridad</label>
            <p-select [(ngModel)]="tareaForm.prioridad" appendTo="body" [options]="prioridadOptions"
                        optionLabel="label" optionValue="value" styleClass="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Horas estimadas</label>
            <p-inputNumber [(ngModel)]="tareaForm.horasEstimadas" [min]="0" styleClass="w-full" suffix=" h" />
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dialogVisible = false" />
        <p-button [label]="editingTarea() ? 'Guardar' : 'Crear'" icon="pi pi-check"
                  (onClick)="saveTarea()" [disabled]="!tareaForm.titulo" />
      </ng-template>
    </p-dialog>
  `
})
export class TareasKanbanComponent implements OnInit {
  store = inject(TareasStore);
  auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private msg = inject(MessageService);

  obraId = signal('');
  dialogVisible = false;
  editingTarea = signal<TareaDto | null>(null);
  draggingTarea: TareaDto | null = null;

  tareaForm = { titulo: '', descripcion: '', prioridad: PrioridadTarea.Media, horasEstimadas: 0 };

  columns: KanbanCol[] = [
    { label: 'Pendiente',   estado: EstadoTarea.Pendiente,  color: 'bg-slate-400',  headerColor: 'bg-slate-100' },
    { label: 'En Progreso', estado: EstadoTarea.EnProgreso, color: 'bg-blue-500',   headerColor: 'bg-blue-100' },
    { label: 'Bloqueada',   estado: EstadoTarea.Bloqueada,  color: 'bg-red-500',    headerColor: 'bg-red-100' },
    { label: 'Completada',  estado: EstadoTarea.Completada, color: 'bg-green-500',  headerColor: 'bg-green-100' },
  ];

  prioridadOptions = [
    { label: 'Baja',    value: PrioridadTarea.Baja },
    { label: 'Media',   value: PrioridadTarea.Media },
    { label: 'Alta',    value: PrioridadTarea.Alta },
    { label: 'Crítica', value: PrioridadTarea.Critica },
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.obraId.set(id);
    this.store.loadByObra(id);
  }

  tareasEnEstado(estado: EstadoTarea): TareaDto[] {
    return this.store.tareas().filter(t => t.estado === estado);
  }

  onDragStart(event: DragEvent, tarea: TareaDto) {
    this.draggingTarea = tarea;
    event.dataTransfer?.setData('text/plain', tarea.id);
  }

  onDrop(event: DragEvent, nuevoEstado: EstadoTarea) {
    event.preventDefault();
    if (this.draggingTarea && this.draggingTarea.estado !== nuevoEstado) {
      this.store.cambiarEstado({ id: this.draggingTarea.id, data: { nuevoEstado } });
    }
    this.draggingTarea = null;
  }

  openNew() {
    this.editingTarea.set(null);
    this.tareaForm = { titulo: '', descripcion: '', prioridad: PrioridadTarea.Media, horasEstimadas: 0 };
    this.dialogVisible = true;
  }

  openEdit(tarea: TareaDto) {
    this.editingTarea.set(tarea);
    this.tareaForm = { titulo: tarea.titulo, descripcion: tarea.descripcion ?? '', prioridad: tarea.prioridad, horasEstimadas: tarea.horasEstimadas };
    this.dialogVisible = true;
  }

  saveTarea() {
    if (this.editingTarea()) {
      this.store.updateTarea({
        id: this.editingTarea()!.id,
        data: { titulo: this.tareaForm.titulo, descripcion: this.tareaForm.descripcion,
                prioridad: this.tareaForm.prioridad, horasEstimadas: this.tareaForm.horasEstimadas,
                fechaLimite: undefined, cuadrillaId: undefined, usuarioAsignadoId: undefined }
      });
      this.msg.add({ severity: 'success', summary: 'Guardado', detail: 'Tarea actualizada' });
    } else {
      this.store.createTarea({
        obraId: this.obraId(), titulo: this.tareaForm.titulo, descripcion: this.tareaForm.descripcion,
        prioridad: this.tareaForm.prioridad, horasEstimadas: this.tareaForm.horasEstimadas
      });
      this.msg.add({ severity: 'success', summary: 'Creada', detail: 'Tarea creada' });
    }
    this.dialogVisible = false;
  }

  deleteTarea(tarea: TareaDto) {
    this.store.deleteTarea(tarea.id);
    this.msg.add({ severity: 'success', summary: 'Eliminada', detail: tarea.titulo });
  }

  estaVencida(fecha: string): boolean { return new Date(fecha) < new Date(); }

  prioridadBadge(p: PrioridadTarea): string {
    const map: Record<number,string> = {
      1:'badge-baja', 2:'badge-media', 3:'badge-alta', 4:'badge-critica'
    };
    return map[p] ?? '';
  }
}
