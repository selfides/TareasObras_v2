import { Component, inject, OnInit, input, output, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';

import { AuthService } from '../../../../../core/auth/auth.service';
import { PresupuestosService } from '../../../../../core/services/presupuestos.service';
import { PartidasService, PartidaDto, LineaPartidaDto } from '../../../../../core/services/partidas.service';
import { CategoriasOperarioService } from '../../../../../core/services/categorias-operario.service';
import { PresupuestoDto, CategoriaOperarioDto } from '../../../../../core/models';
import { PresupuestoImportarDialogComponent } from '../../../../presupuestos/components/presupuesto-importar-dialog.component';

@Component({
  selector: 'app-obra-tab-presupuestos',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TableModule, 
    DialogModule, 
    ConfirmDialogModule, 
    ButtonModule, 
    SelectModule, 
    DatePickerModule, 
    InputTextModule, 
    InputNumberModule, 
    TextareaModule, 
    TooltipModule,
    PresupuestoImportarDialogComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './obra-tab-presupuestos.component.html'
})
export class ObraTabPresupuestosComponent implements OnInit {
  obraId = input.required<string>();
  
  presupuestoAprobadoChange = output<PresupuestoDto | null>();
  partidasChange = output<PartidaDto[]>();

  auth = inject(AuthService);
  private presupuestosSvc = inject(PresupuestosService);
  private partidasSvc = inject(PartidasService);
  private categoriasSvc = inject(CategoriasOperarioService);
  private msg = inject(MessageService);
  private confirm = inject(ConfirmationService);

  presupuestos = signal<PresupuestoDto[]>([]);
  partidas = signal<PartidaDto[]>([]);
  categorias = signal<CategoriaOperarioDto[]>([]);
  presupuestoSeleccionado = signal<string | null>(null);

  // Dialogs
  dlgPresupuesto = false;
  dlgPartida = false;
  dlgLinea = false;
  dlgBeneficioGlobal = false;
  dlgEscanearPresupuesto = signal<boolean>(false);

  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.dlgLinea) {
      this.dlgLinea = false;
    } else if (this.dlgPartida) {
      this.dlgPartida = false;
    } else if (this.dlgBeneficioGlobal) {
      this.dlgBeneficioGlobal = false;
    } else if (this.dlgPresupuesto) {
      this.dlgPresupuesto = false;
    }
  }

  // Edit signals
  editandoPresupuestoId = signal<string | null>(null);
  editandoPartidaId = signal<string | null>(null);
  editandoLineaId = signal<string | null>(null);
  lineaPartidaId = signal<string | null>(null);
  tipoLinea = signal<'Material' | 'ManoObra'>('Material');
  saving = signal(false);
  guardandoBeneficioPartidaId = signal<string | null>(null);

  // Beneficio Global state
  presupuestoBeneficioGlobal = signal<PresupuestoDto | null>(null);
  beneficioGlobalImporte = signal<number>(0);

  // Track original beneficio values per partida to detect changes on blur
  private beneficioOriginalMap = new Map<string, number>();

  // Forms
  presupuestoForm: any = { numero: '', fecha: new Date(), descripcion: '' };
  partidaForm: any = { nombre: '', descripcion: '', orden: 1 };
  lineaForm: any = { descripcion: '', unidad: '', cantidad: 0, precioUnitario: 0, categoriaOperarioId: null };

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.presupuestosSvc.getByObra(this.obraId()).subscribe(p => {
      this.presupuestos.set(p);
      const aprobado = p.find(x => x.esAprobado);
      this.presupuestoAprobadoChange.emit(aprobado || null);
      if (aprobado) {
        this.partidasSvc.getByPresupuesto(aprobado.id).subscribe(part => {
          this.sincronizarMapaBeneficios(part);
          this.partidas.set(part);
          this.partidasChange.emit(part);
        });
      } else {
        this.partidas.set([]);
        this.partidasChange.emit([]);
      }
    });
    this.categoriasSvc.getAll().subscribe(c => this.categorias.set(c));
  }

  private sincronizarMapaBeneficios(partidas: PartidaDto[]) {
    this.beneficioOriginalMap.clear();
    for (const pt of partidas) {
      this.beneficioOriginalMap.set(pt.id, pt.importeBeneficioMaterial ?? 0);
    }
  }

  // ── Beneficio Partida a Partida ──────────────────────────────────────────
  calcularPorcentajePartida(partida: PartidaDto): number {
    const coste = partida.costeMaterial ?? 0;
    const beneficio = partida.importeBeneficioMaterial ?? 0;
    if (coste <= 0) return 0;
    return Math.round((beneficio / coste) * 10000) / 100;
  }

  calcularTotalMaterialPartida(partida: PartidaDto): number {
    return (partida.costeMaterial ?? 0) + (partida.importeBeneficioMaterial ?? 0);
  }

  calcularTotalPartida(partida: PartidaDto): number {
    return this.calcularTotalMaterialPartida(partida) + (partida.totalManoObra ?? 0);
  }

  haCambiadoBeneficioPartida(partida: PartidaDto): boolean {
    const original = this.beneficioOriginalMap.get(partida.id) ?? 0;
    const actual = partida.importeBeneficioMaterial ?? 0;
    return Math.abs(actual - original) >= 0.005;
  }

  guardarBeneficioPartida(partida: PartidaDto, forzar = false) {
    if (!forzar && !this.haCambiadoBeneficioPartida(partida)) return;

    const importe = Math.round((partida.importeBeneficioMaterial ?? 0) * 100) / 100;
    this.guardandoBeneficioPartidaId.set(partida.id);

    this.partidasSvc.updateBeneficio(partida.id, importe).subscribe({
      next: () => {
        this.beneficioOriginalMap.set(partida.id, importe);
        this.guardandoBeneficioPartidaId.set(null);
        this.recargarPartidasSeleccionadas();
        this.recargarPresupuestos();
        this.msg.add({
          severity: 'success',
          summary: 'Beneficio actualizado',
          detail: `${partida.nombre}: ${importe.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € (${this.calcularPorcentajePartida(partida).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)`
        });
      },
      error: () => {
        this.guardandoBeneficioPartidaId.set(null);
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el beneficio de la partida' });
      }
    });
  }

  // ── Beneficio Global del Presupuesto ─────────────────────────────────────
  abrirDialogoBeneficioGlobal(p: PresupuestoDto) {
    this.presupuestoBeneficioGlobal.set(p);
    this.beneficioGlobalImporte.set(p.totalBeneficioMaterial ?? 0);
    this.dlgBeneficioGlobal = true;
  }

  calcularPorcentajeGlobalPreview(): number {
    const p = this.presupuestoBeneficioGlobal();
    if (!p || !p.totalCosteMaterial || p.totalCosteMaterial <= 0) return 0;
    return Math.round(((this.beneficioGlobalImporte() ?? 0) / p.totalCosteMaterial) * 10000) / 100;
  }

  aplicarBeneficioGlobal() {
    const p = this.presupuestoBeneficioGlobal();
    if (!p) return;

    const importe = Math.round((this.beneficioGlobalImporte() ?? 0) * 100) / 100;
    this.saving.set(true);

    this.presupuestosSvc.aplicarBeneficioGlobal(p.id, importe).subscribe({
      next: () => {
        this.saving.set(false);
        this.dlgBeneficioGlobal = false;
        this.recargarPresupuestos();
        if (this.presupuestoSeleccionado() === p.id) {
          this.recargarPartidasSeleccionadas();
        }
        this.msg.add({
          severity: 'success',
          summary: 'Beneficio global aplicado',
          detail: `Se han repartido ${importe.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € proporcionalmente entre las partidas.`
        });
      },
      error: () => {
        this.saving.set(false);
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo aplicar el beneficio global' });
      }
    });
  }

  // ── Presupuesto ──────────────────────────────────────────────────────────
  abrirEscanearPresupuesto() {
    this.dlgEscanearPresupuesto.set(true);
  }

  onPresupuestoImportado(presupuestoId: string) {
    this.cargarDatos();
    this.seleccionarPresupuesto(presupuestoId);
  }

  abrirNuevoPresupuesto() {
    this.editandoPresupuestoId.set(null);
    const m = new Date().getFullYear();
    this.presupuestoForm = { numero: `PPTO-${m}-${this.presupuestos().length + 1}`, fecha: new Date(), descripcion: '' };
    this.dlgPresupuesto = true;
  }

  abrirEditarPresupuesto(p: PresupuestoDto) {
    this.editandoPresupuestoId.set(p.id);
    this.presupuestoForm = { numero: p.numero ?? '', fecha: new Date(p.fecha), descripcion: p.descripcion ?? '' };
    this.dlgPresupuesto = true;
  }

  guardarPresupuesto() {
    this.saving.set(true);
    const editId = this.editandoPresupuestoId();
    if (editId) {
      this.presupuestosSvc.update(editId, {
        numero: this.presupuestoForm.numero,
        fecha: this.presupuestoForm.fecha,
        descripcion: this.presupuestoForm.descripcion
      }).subscribe({
        next: () => {
          this.dlgPresupuesto = false; this.saving.set(false);
          this.recargarPresupuestos();
        },
        error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error' }); }
      });
    } else {
      this.presupuestosSvc.create({ obraId: this.obraId(), numero: this.presupuestoForm.numero,
        fecha: this.presupuestoForm.fecha, descripcion: this.presupuestoForm.descripcion,
        lineasMaterial: [], lineasHoras: [] }).subscribe({
        next: () => {
          this.dlgPresupuesto = false; this.saving.set(false);
          this.recargarPresupuestos();
        },
        error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error' }); }
      });
    }
  }

  confirmarEliminarPresupuesto(id: string) {
    this.confirm.confirm({
      message: '¿Eliminar este presupuesto y todas sus partidas?', header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.presupuestosSvc.delete(id).subscribe({
          next: () => {
            if (this.presupuestoSeleccionado() === id) {
              this.presupuestoSeleccionado.set(null);
              this.partidas.set([]);
              this.partidasChange.emit([]);
            }
            this.recargarPresupuestos();
            this.msg.add({ severity: 'success', summary: 'Presupuesto eliminado' });
          }
        });
      }
    });
  }

  aprobarPresupuesto(id: string) {
    this.presupuestosSvc.aprobar(id).subscribe({
      next: () => { this.recargarPresupuestos(); }
    });
  }

  generarTareasPresupuesto(id: string) {
    this.presupuestosSvc.generarTareas(id).subscribe({
      next: (res) => {
        if (res.tareasGeneradas > 0) {
          this.msg.add({ severity: 'success', summary: 'Tareas generadas', detail: `Se han creado ${res.tareasGeneradas} tareas en el Kanban` });
        } else {
          this.msg.add({ severity: 'info', summary: 'Sin cambios', detail: 'Todas las tareas ya existían en el Kanban' });
        }
      },
      error: () => { this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron generar las tareas' }); }
    });
  }

  seleccionarPresupuesto(id: string) {
    this.presupuestoSeleccionado.set(id);
    this.partidasSvc.getByPresupuesto(id).subscribe(p => { 
      this.sincronizarMapaBeneficios(p);
      this.partidas.set(p);
      this.partidasChange.emit(p);
    });
  }

  private recargarPresupuestos() {
    this.presupuestosSvc.getByObra(this.obraId()).subscribe(p => {
      this.presupuestos.set(p);
      const aprobado = p.find(x => x.esAprobado);
      this.presupuestoAprobadoChange.emit(aprobado || null);
    });
  }

  // ── Partidas ─────────────────────────────────────────────────────────────
  abrirNuevaPartida() {
    this.editandoPartidaId.set(null);
    this.partidaForm = { nombre: '', descripcion: '', orden: this.partidas().length + 1 };
    this.dlgPartida = true;
  }

  abrirEditarPartida(p: PartidaDto) {
    this.editandoPartidaId.set(p.id);
    this.partidaForm = { nombre: p.nombre, descripcion: p.descripcion ?? '', orden: p.orden };
    this.dlgPartida = true;
  }

  guardarPartida() {
    this.saving.set(true);
    const editId = this.editandoPartidaId();
    const obs = editId
      ? this.partidasSvc.update(editId, this.partidaForm)
      : this.partidasSvc.create({ presupuestoId: this.presupuestoSeleccionado()!, ...this.partidaForm });
    obs.subscribe({
      next: () => {
        this.dlgPartida = false; this.saving.set(false); this.editandoPartidaId.set(null);
        this.recargarPartidasSeleccionadas();
        this.recargarPresupuestos();
        this.msg.add({ severity: 'success', summary: 'Guardado' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  confirmarEliminarPartida(id: string) {
    this.confirm.confirm({ message: 'Eliminar esta partida y sus lineas?', header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => { this.partidasSvc.delete(id).subscribe({
        next: () => { this.recargarPartidasSeleccionadas(); this.recargarPresupuestos(); }
      }); }
    });
  }

  // ── Lineas ───────────────────────────────────────────────────────────────
  abrirNuevaLinea(partidaId: string, tipo: 'Material' | 'ManoObra') {
    this.editandoLineaId.set(null);
    this.lineaPartidaId.set(partidaId);
    this.tipoLinea.set(tipo);
    this.lineaForm = { descripcion: '', unidad: tipo === 'ManoObra' ? 'h' : '', cantidad: 0, precioUnitario: 0, categoriaOperarioId: null };
    this.dlgLinea = true;
  }

  abrirEditarLinea(l: LineaPartidaDto, partidaId: string) {
    this.editandoLineaId.set(l.id);
    this.lineaPartidaId.set(partidaId);
    this.tipoLinea.set(l.tipo as 'Material' | 'ManoObra');
    this.lineaForm = { descripcion: l.descripcion, unidad: l.unidad, cantidad: l.cantidad,
      precioUnitario: l.precioUnitario, categoriaOperarioId: l.categoriaOperarioId ?? null };
    this.dlgLinea = true;
  }

  onCategoriaLineaChange() {
    const cat = this.categorias().find(c => c.id === this.lineaForm.categoriaOperarioId);
    if (cat) this.lineaForm.precioUnitario = cat.costeHoraBase;
  }

  guardarLinea() {
    this.saving.set(true);
    const editId = this.editandoLineaId();
    let obs: any;
    if (editId) obs = this.partidasSvc.updateLinea(editId, this.lineaForm);
    else if (this.tipoLinea() === 'Material') obs = this.partidasSvc.addLineaMaterial(this.lineaPartidaId()!, this.lineaForm);
    else obs = this.partidasSvc.addLineaManoObra(this.lineaPartidaId()!, this.lineaForm);
    
    obs.subscribe({
      next: () => {
        this.dlgLinea = false; this.saving.set(false); this.editandoLineaId.set(null);
        this.recargarPartidasSeleccionadas();
        this.recargarPresupuestos();
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  confirmarEliminarLinea(id: string) {
    this.confirm.confirm({ message: 'Eliminar esta linea?', header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => { this.partidasSvc.deleteLinea(id).subscribe({
        next: () => { this.recargarPartidasSeleccionadas(); this.recargarPresupuestos(); }
      }); }
    });
  }

  private recargarPartidasSeleccionadas() {
    if (this.presupuestoSeleccionado()) {
      this.partidasSvc.getByPresupuesto(this.presupuestoSeleccionado()!).subscribe(p => {
        this.sincronizarMapaBeneficios(p);
        this.partidas.set(p);
        this.partidasChange.emit(p);
      });
    }
  }
}
