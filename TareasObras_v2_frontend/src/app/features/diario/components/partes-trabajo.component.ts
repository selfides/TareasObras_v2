import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistroHorasService } from '../../../core/services/registro-horas.service';
import { ObrasService } from '../../../core/services/obras.service';
import { OperariosService } from '../../../core/services/operarios.service';
import { TareasService } from '../../../core/services/tareas.service';
import { ObraListDto, OperarioDto, TareaDto } from '../../../core/models';
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
import { TooltipModule } from 'primeng/tooltip';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

interface RegistroHorasGlobalDto {
  id: string; obraId: string; obraNombre: string; obraCodigo: string;
  operarioId: string; operarioNombre: string; categoriaNombre: string;
  fecha: string; horas: number; costeHoraAplicado: number;
  costeTotal: number; tareaId?: string; tareaTitulo?: string; observaciones?: string;
}

@Component({
  selector: 'app-partes-trabajo',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
            ConfirmDialogModule, InputTextModule, InputNumberModule, SelectModule,
            DatePickerModule, TextareaModule, TooltipModule, ToggleSwitchModule],
  providers: [ConfirmationService],
  templateUrl: './partes-trabajo.component.html'
})
export class PartesTrabajoComponent implements OnInit {
  private registroService = inject(RegistroHorasService);
  private obrasService = inject(ObrasService);
  private operariosService = inject(OperariosService);
  private tareasService = inject(TareasService);
  private msg = inject(MessageService);
  private confirmService = inject(ConfirmationService);

  obras = signal<ObraListDto[]>([]);
  operarios = signal<OperarioDto[]>([]);
  registros = signal<RegistroHorasGlobalDto[]>([]);
  tareas = signal<TareaDto[]>([]);
  loading = signal(true);
  saving = signal(false);
  dialogVisible = false;
  editingId = signal<string | null>(null);

  // Filtros
  selectedDate = signal<Date>(new Date());
  filterByDate = signal(true);
  selectedObraFilter = signal<string | null>(null);

  filteredRegistros = computed(() => {
    const obraId = this.selectedObraFilter();
    const all = this.registros();
    return obraId ? all.filter(r => r.obraId === obraId) : all;
  });

  form: any = {
    obraId: null, operarioId: null, tareaId: null, fecha: new Date(),
    horas: 0, observaciones: ''
  };

  // Stats
  totalHoras = computed(() => this.filteredRegistros().reduce((s, r) => s + r.horas, 0));
  totalCoste = computed(() => this.filteredRegistros().reduce((s, r) => s + r.costeTotal, 0));

  ngOnInit() {
    this.obrasService.getAll().subscribe(o => this.obras.set(o));
    this.operariosService.getAll().subscribe(op => this.operarios.set(op));
    this.loadRegistros();
  }

  loadRegistros() {
    this.loading.set(true);
    const fecha = this.filterByDate() ? this.formatDate(this.selectedDate()) : undefined;
    this.registroService.getAll(fecha).subscribe({
      next: r => { this.registros.set(r); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onDateChange(date: Date) {
    this.selectedDate.set(date);
    this.loadRegistros();
  }

  onFilterToggle() {
    this.loadRegistros();
  }

  goDay(offset: number) {
    const d = new Date(this.selectedDate());
    d.setDate(d.getDate() + offset);
    this.selectedDate.set(d);
    this.loadRegistros();
  }

  goToday() {
    this.selectedDate.set(new Date());
    this.loadRegistros();
  }

  openNew() {
    this.editingId.set(null);
    this.form = {
      obraId: this.obras().length ? this.obras()[0].id : null,
      operarioId: this.operarios().length ? this.operarios()[0].id : null,
      tareaId: null,
      fecha: this.selectedDate(),
      horas: 8, observaciones: ''
    };
    if (this.form.obraId) this.loadTareas(this.form.obraId);
    this.dialogVisible = true;
  }

  onObraChange() {
    this.form.tareaId = null;
    if (this.form.obraId) this.loadTareas(this.form.obraId);
    else this.tareas.set([]);
  }

  private loadTareas(obraId: string) {
    this.tareasService.getByObra(obraId).subscribe(t => this.tareas.set(t));
  }

  openEdit(reg: RegistroHorasGlobalDto) {
    this.editingId.set(reg.id);
    this.form = {
      obraId: reg.obraId,
      operarioId: reg.operarioId,
      tareaId: reg.tareaId,
      fecha: new Date(reg.fecha),
      horas: reg.horas,
      observaciones: reg.observaciones ?? ''
    };
    this.loadTareas(reg.obraId);
    this.dialogVisible = true;
  }

  guardar() {
    if (!this.form.obraId || !this.form.operarioId || this.form.horas <= 0) return;
    
    this.saving.set(true);
    if (this.editingId()) {
      const original = this.registros().find(r => r.id === this.editingId());
      const data = {
        fecha: this.form.fecha,
        horas: this.form.horas,
        tareaId: this.form.tareaId,
        costeHoraAplicado: original?.costeHoraAplicado ?? 0,
        observaciones: this.form.observaciones
      };
      this.registroService.update(this.editingId()!, data).subscribe({
        next: () => {
          this.msg.add({ severity: 'success', summary: 'Registro actualizado' });
          this.dialogVisible = false; this.saving.set(false); this.loadRegistros();
        },
        error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error' }); }
      });
    } else {
      const op = this.operarios().find(o => o.id === this.form.operarioId);
      const data = {
        obraId: this.form.obraId,
        operarioId: this.form.operarioId,
        categoriaOperarioId: op?.categoriaOperarioId,
        tareaId: this.form.tareaId,
        fecha: this.form.fecha,
        horas: this.form.horas,
        costeHoraAplicado: op?.costeHoraBase ?? 0,
        observaciones: this.form.observaciones
      };
      this.registroService.create(data).subscribe({
        next: () => {
          this.msg.add({ severity: 'success', summary: 'Trabajo registrado' });
          this.dialogVisible = false; this.saving.set(false); this.loadRegistros();
        },
        error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error' }); }
      });
    }
  }

  confirmDelete(reg: RegistroHorasGlobalDto) {
    this.confirmService.confirm({
      message: `¿Eliminar el registro de <b>${reg.operarioNombre}</b>?`,
      header: 'Confirmar eliminación', icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.registroService.delete(reg.id).subscribe({
          next: () => { this.msg.add({ severity: 'success', summary: 'Registro eliminado' }); this.loadRegistros(); },
          error: () => this.msg.add({ severity: 'error', summary: 'Error' })
        });
      }
    });
  }

  private formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
