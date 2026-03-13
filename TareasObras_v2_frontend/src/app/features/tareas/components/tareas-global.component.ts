import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareasService } from '../../../core/services/tareas.service';
import { ObrasService } from '../../../core/services/obras.service';
import { ObraListDto, EstadoTarea, PrioridadTarea, CreateTareaRequest, UpdateTareaRequest } from '../../../core/models';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

interface TareaGlobalDto {
  id: string; obraId: string; obraNombre: string; obraCodigo: string;
  titulo: string; descripcion?: string;
  estadoNombre: string; estado: EstadoTarea;
  prioridadNombre: string; prioridad: PrioridadTarea;
  fechaLimite?: string; horasEstimadas: number; horasReales: number;
  cuadrillaId?: string; usuarioAsignadoId?: string; observaciones?: string;
  createdAt: string;
}

@Component({
  selector: 'app-tareas-global',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
            ConfirmDialogModule, InputTextModule, InputNumberModule, SelectModule,
            DatePickerModule, TextareaModule, TagModule, TooltipModule, ToggleSwitchModule],
  providers: [ConfirmationService],
  templateUrl: './tareas-global.component.html'
})
export class TareasGlobalComponent implements OnInit {
  private tareasService = inject(TareasService);
  private obrasService = inject(ObrasService);
  private msg = inject(MessageService);
  private confirmService = inject(ConfirmationService);

  obras = signal<ObraListDto[]>([]);
  tareas = signal<TareaGlobalDto[]>([]);
  loading = signal(true);
  saving = signal(false);
  dialogVisible = false;
  editingTarea = signal<TareaGlobalDto | null>(null);

  // Filtros
  selectedDate = signal<Date>(new Date());
  filterByDate = signal(true);
  selectedObraFilter = signal<string | null>(null);
  selectedPrioridadFilter = signal<PrioridadTarea | null>(null);
  selectedEstadoFilter = signal<EstadoTarea | null>(null);

  filteredTareas = computed(() => {
    const obraId = this.selectedObraFilter();
    const priority = this.selectedPrioridadFilter();
    const status = this.selectedEstadoFilter();
    let all = this.tareas();
    
    if (obraId) all = all.filter(t => t.obraId === obraId);
    if (priority !== null) all = all.filter(t => t.prioridad === priority);
    if (status !== null) all = all.filter(t => t.estado === status);
    
    return all;
  });

  prioridadOptions = [
    { label: 'Baja',    value: PrioridadTarea.Baja },
    { label: 'Media',   value: PrioridadTarea.Media },
    { label: 'Alta',    value: PrioridadTarea.Alta },
    { label: 'Crítica', value: PrioridadTarea.Critica },
  ];

  estadoOptions = [
    { label: 'Pendiente',   value: EstadoTarea.Pendiente },
    { label: 'En Progreso', value: EstadoTarea.EnProgreso },
    { label: 'Bloqueada',   value: EstadoTarea.Bloqueada },
    { label: 'Completada',  value: EstadoTarea.Completada },
  ];

  tareaForm: any = {
    obraId: null, titulo: '', descripcion: '', prioridad: PrioridadTarea.Media, horasEstimadas: 0
  };

  // Stats
  totalTareas = computed(() => this.filteredTareas().length);
  tareasPendientes = computed(() => this.filteredTareas().filter(t => t.estado === EstadoTarea.Pendiente).length);
  tareasEnProgreso = computed(() => this.filteredTareas().filter(t => t.estado === EstadoTarea.EnProgreso).length);
  tareasCompletadas = computed(() => this.filteredTareas().filter(t => t.estado === EstadoTarea.Completada).length);

  ngOnInit() {
    this.obrasService.getAll().subscribe(o => this.obras.set(o));
    this.loadTareas();
  }

  loadTareas() {
    this.loading.set(true);
    const fecha = this.filterByDate() ? this.formatDate(this.selectedDate()) : undefined;
    this.tareasService.getAll(fecha).subscribe({
      next: t => { this.tareas.set(t); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onDateChange(date: Date) {
    this.selectedDate.set(date);
    this.loadTareas();
  }

  onFilterToggle() {
    this.loadTareas();
  }

  goToday() {
    this.selectedDate.set(new Date());
    this.loadTareas();
  }

  goDay(offset: number) {
    const d = new Date(this.selectedDate());
    d.setDate(d.getDate() + offset);
    this.selectedDate.set(d);
    this.loadTareas();
  }

  openNew() {
    this.editingTarea.set(null);
    this.tareaForm = {
      obraId: this.obras().length ? this.obras()[0].id : null,
      titulo: '', descripcion: '',
      prioridad: PrioridadTarea.Media, horasEstimadas: 0
    };
    this.dialogVisible = true;
  }

  openEdit(tarea: TareaGlobalDto) {
    this.editingTarea.set(tarea);
    this.tareaForm = {
      obraId: tarea.obraId,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion ?? '',
      prioridad: tarea.prioridad,
      horasEstimadas: tarea.horasEstimadas
    };
    this.dialogVisible = true;
  }

  guardar() {
    if (this.editingTarea()) { this.actualizar(); } else { this.crear(); }
  }

  crear() {
    if (!this.tareaForm.titulo || !this.tareaForm.obraId) return;
    this.saving.set(true);
    const data: CreateTareaRequest = {
      obraId: this.tareaForm.obraId, titulo: this.tareaForm.titulo,
      descripcion: this.tareaForm.descripcion, prioridad: this.tareaForm.prioridad,
      horasEstimadas: this.tareaForm.horasEstimadas
    };
    this.tareasService.create(data).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Tarea creada', detail: data.titulo });
        this.dialogVisible = false; this.saving.set(false); this.loadTareas();
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la tarea' }); }
    });
  }

  actualizar() {
    if (!this.editingTarea()) return;
    this.saving.set(true);
    const data: UpdateTareaRequest = {
      titulo: this.tareaForm.titulo, descripcion: this.tareaForm.descripcion,
      prioridad: this.tareaForm.prioridad, horasEstimadas: this.tareaForm.horasEstimadas
    };
    this.tareasService.update(this.editingTarea()!.id, data).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Tarea actualizada', detail: data.titulo });
        this.dialogVisible = false; this.saving.set(false); this.loadTareas();
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' }); }
    });
  }

  confirmDelete(tarea: TareaGlobalDto) {
    this.confirmService.confirm({
      message: `¿Eliminar la tarea <b>${tarea.titulo}</b>?`,
      header: 'Confirmar eliminación', icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.tareasService.delete(tarea.id).subscribe({
          next: () => { this.msg.add({ severity: 'success', summary: 'Tarea eliminada' }); this.loadTareas(); },
          error: () => this.msg.add({ severity: 'error', summary: 'Error' })
        });
      }
    });
  }

  cambiarEstado(tarea: TareaGlobalDto, nuevoEstado: EstadoTarea) {
    this.tareasService.cambiarEstado(tarea.id, { nuevoEstado }).subscribe({
      next: () => { this.msg.add({ severity: 'success', summary: 'Estado actualizado' }); this.loadTareas(); },
      error: () => this.msg.add({ severity: 'error', summary: 'Error al cambiar estado' })
    });
  }

  prioridadBadge(p: PrioridadTarea): string {
    const map: Record<number, string> = {
      1: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
      2: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      3: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
      4: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    };
    return map[p] ?? '';
  }

  estadoBadge(e: EstadoTarea): string {
    const map: Record<number, string> = {
      1: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
      2: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      3: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      4: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      5: 'bg-surface-100 text-surface-500',
    };
    return map[e] ?? '';
  }

  private formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
