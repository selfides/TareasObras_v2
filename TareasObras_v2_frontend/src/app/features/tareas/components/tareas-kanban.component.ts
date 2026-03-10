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
  templateUrl: './tareas-kanban.component.html'
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
