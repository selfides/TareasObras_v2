import { Component, inject, OnInit, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AuthService } from '../../../../../core/auth/auth.service';
import { RegistroHorasService } from '../../../../../core/services/registro-horas.service';
import { OperariosService } from '../../../../../core/services/operarios.service';
import { CategoriasOperarioService } from '../../../../../core/services/categorias-operario.service';
import { RegistroHorasDto, OperarioDto, CategoriaOperarioDto } from '../../../../../core/models';

@Component({
  selector: 'app-obra-tab-mano-obra',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, SelectModule,
            DatePickerModule, InputTextModule, InputNumberModule, TextareaModule, TooltipModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './obra-tab-mano-obra.component.html'
})
export class ObraTabManoObraComponent implements OnInit {
  obraId = input.required<string>();
  totalesActualizados = output<{horas: number, coste: number}>();

  auth = inject(AuthService);
  private registroHorasSvc = inject(RegistroHorasService);
  private operariosSvc = inject(OperariosService);
  private categoriasSvc = inject(CategoriasOperarioService);
  private msg = inject(MessageService);
  private confirm = inject(ConfirmationService);

  registrosHoras = signal<RegistroHorasDto[]>([]);
  operarios = signal<OperarioDto[]>([]);
  categorias = signal<CategoriaOperarioDto[]>([]);

  // dialog state
  dlgHoras = false;
  editandoHorasId = signal<string | null>(null);
  saving = signal(false);

  horasForm: any = { 
    operarioId: null, categoriaOperarioId: null, fecha: new Date(), 
    horaInicioStr: '08:00', horaFinStr: '09:00', costeHoraAplicado: 0, observaciones: '' 
  };

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.registroHorasSvc.getByObra(this.obraId()).subscribe(r => {
      this.registrosHoras.set(r);
      this.emitTotales(r);
    });
    this.operariosSvc.getAll().subscribe(o => this.operarios.set(o));
    this.categoriasSvc.getAll().subscribe(c => this.categorias.set(c));
  }

  emitTotales(registros: RegistroHorasDto[]) {
    const horas = registros.reduce((s, r) => s + r.horas, 0);
    const coste = registros.reduce((s, r) => s + r.costeTotal, 0);
    this.totalesActualizados.emit({ horas, coste });
  }

  abrirNuevasHoras() {
    this.editandoHorasId.set(null);
    this.horasForm = { operarioId: null, categoriaOperarioId: null, fecha: new Date(), horaInicioStr: '08:00', horaFinStr: '09:00', costeHoraAplicado: 0, observaciones: '' };
    this.dlgHoras = true;
  }

  abrirEditarHoras(r: RegistroHorasDto) {
    this.editandoHorasId.set(r.id);
    const [hI, mI] = (r.horaInicio || '00:00:00').split(':');
    const [hF, mF] = (r.horaFin || '00:00:00').split(':');

    this.horasForm = { 
      operarioId: r.operarioId, 
      categoriaOperarioId: r.categoriaOperarioId,
      fecha: new Date(r.fecha), 
      horaInicioStr: `${String(hI).padStart(2, '0')}:${String(mI).padStart(2, '0')}`,
      horaFinStr: `${String(hF).padStart(2, '0')}:${String(mF).padStart(2, '0')}`, 
      costeHoraAplicado: r.costeHoraAplicado, 
      observaciones: r.observaciones ?? '' 
    };
    this.dlgHoras = true;
  }

  cerrarDlgHoras() { this.dlgHoras = false; this.editandoHorasId.set(null); }

  onOperarioChange() {
    const op = this.operarios().find(o => o.id === this.horasForm.operarioId);
    if (op) { this.horasForm.categoriaOperarioId = op.categoriaOperarioId; this.horasForm.costeHoraAplicado = op.costeHoraBase; }
  }

  onTimeBlur(field: 'inicio' | 'fin') {
    let val = field === 'inicio' ? this.horasForm.horaInicioStr : this.horasForm.horaFinStr;
    if (!val) return;
    val = val.toString().trim().replace(',', '.');
    
    let hours = 0; let mins = 0;
    if (val.includes(':')) {
      const parts = val.split(':');
      hours = parseInt(parts[0], 10) || 0;
      mins = parseInt(parts[1], 10) || 0;
    } else {
      const asNum = parseFloat(val);
      if (!isNaN(asNum)) {
        hours = Math.floor(asNum);
        mins = Math.round((asNum - hours) * 60);
      }
    }
    
    hours = Math.max(0, Math.min(23, hours));
    mins = Math.max(0, Math.min(59, mins));
    
    const formatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    if (field === 'inicio') this.horasForm.horaInicioStr = formatted;
    else this.horasForm.horaFinStr = formatted;
  }

  guardarHoras(continuar: boolean = false) {
    this.saving.set(true);
    const editId = this.editandoHorasId();
    const payload = {
      obraId: this.obraId(),
      ...this.horasForm,
      fecha: this.horasForm.fecha,
      horaInicio: this.horasForm.horaInicioStr + ':00',
      horaFin: this.horasForm.horaFinStr + ':00'
    };

    const obs = editId
      ? this.registroHorasSvc.update(editId, payload)
      : this.registroHorasSvc.create(payload);

    obs.subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: editId ? 'Horas actualizadas' : 'Horas registradas' });
        this.registroHorasSvc.getByObra(this.obraId()).subscribe(r => {
          this.registrosHoras.set(r);
          this.emitTotales(r);
        });
        
        if (continuar && !editId) {
          const oldFin = this.horasForm.horaFinStr;
          this.horasForm.horaInicioStr = oldFin;
          
          let [h, m] = oldFin.split(':').map(Number);
          h = (h + 1) % 24;
          this.horasForm.horaFinStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
          this.horasForm.observaciones = '';
          this.saving.set(false);
        } else {
          this.cerrarDlgHoras(); 
          this.saving.set(false);
        }
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  confirmarEliminarHoras(id: string) {
    this.confirm.confirm({ message: 'Eliminar este registro de horas?', header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => { this.registroHorasSvc.delete(id).subscribe({
        next: () => { 
          this.registroHorasSvc.getByObra(this.obraId()).subscribe(r => {
            this.registrosHoras.set(r);
            this.emitTotales(r);
          });
          this.msg.add({ severity: 'success', summary: 'Registro eliminado' }); 
        }
      }); }
    });
  }
}
