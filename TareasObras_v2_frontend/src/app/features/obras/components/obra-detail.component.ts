import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ObrasStore } from '../store/obras.store';
import { AuthService } from '../../../core/auth/auth.service';
import { PresupuestosService } from '../../../core/services/presupuestos.service';
import { RegistroHorasService } from '../../../core/services/registro-horas.service';
import { MaterialesObraService } from '../../../core/services/materiales-obra.service';
import { OperariosService } from '../../../core/services/operarios.service';
import { CategoriasOperarioService } from '../../../core/services/categorias-operario.service';
import { ProveedoresService } from '../../../core/services/proveedores.service';
import { PartidasService, PartidaDto, LineaPartidaDto } from '../../../core/services/partidas.service';
import { PresupuestoDto, RegistroHorasDto, MaterialObraDto, OperarioDto, CategoriaOperarioDto, ProveedorDto } from '../../../core/models';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-obra-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonModule, SkeletonModule,
            TabsModule, TableModule, DialogModule, ConfirmDialogModule, InputTextModule,
            InputNumberModule, SelectModule, DatePickerModule, TextareaModule, TagModule, TooltipModule],
  templateUrl: './obra-detail.component.html'
})
export class ObraDetailComponent implements OnInit {
  store           = inject(ObrasStore);
  auth            = inject(AuthService);
  private route   = inject(ActivatedRoute);
  private msg     = inject(MessageService);
  private confirm = inject(ConfirmationService);
  private presupuestosSvc  = inject(PresupuestosService);
  private registroHorasSvc = inject(RegistroHorasService);
  private materialesSvc    = inject(MaterialesObraService);
  private operariosSvc     = inject(OperariosService);
  private categoriasSvc    = inject(CategoriasOperarioService);
  private proveedoresSvc   = inject(ProveedoresService);
  private partidasSvc      = inject(PartidasService);

  activeTab = signal('info');
  saving    = signal(false);
  obraId    = signal('');

  presupuestos            = signal<PresupuestoDto[]>([]);
  partidas                = signal<PartidaDto[]>([]);
  presupuestoSeleccionado = signal<string | null>(null);
  registrosHoras          = signal<RegistroHorasDto[]>([]);
  materiales              = signal<MaterialObraDto[]>([]);
  operarios               = signal<OperarioDto[]>([]);
  categorias              = signal<CategoriaOperarioDto[]>([]);
  proveedores             = signal<ProveedorDto[]>([]);

  estadoOptions = [
    { label: 'Planificada', value: 1 },
    { label: 'En Curso',    value: 2 },
    { label: 'Pausada',     value: 3 },
    { label: 'Completada',  value: 4 },
    { label: 'Cancelada',   value: 5 },
  ];

  // dialogs
  dlgPresupuesto = false;
  dlgPartida     = false;
  dlgLinea       = false;
  dlgHoras       = false;
  dlgMaterial    = false;
  dlgProveedor   = false;

  // signals de edicion
  editandoPresupuestoId = signal<string | null>(null);
  editandoHorasId    = signal<string | null>(null);
  editandoMaterialId = signal<string | null>(null);
  editandoPartidaId  = signal<string | null>(null);
  editandoLineaId    = signal<string | null>(null);
  lineaPartidaId     = signal<string | null>(null);
  tipoLinea          = signal<'Material' | 'ManoObra'>('Material');

  // forms
  presupuestoForm: any = { numero: '', fecha: new Date(), descripcion: '' };
  partidaForm: any     = { nombre: '', descripcion: '', orden: 1 };
  lineaForm: any       = { descripcion: '', unidad: '', cantidad: 0, precioUnitario: 0, categoriaOperarioId: null };
  horasForm: any       = { operarioId: null, categoriaOperarioId: null, fecha: new Date(), horas: 8, costeHoraAplicado: 0, observaciones: '' };
  materialForm: any    = { descripcion: '', unidad: '', cantidad: 0, precioUnitario: 0, fecha: new Date(), proveedorId: null, numeroAlbaran: '', numeroFactura: '', observaciones: '', lineaPartidaId: null };
  proveedorForm: any   = { nombre: '', cifNif: '', direccion: '', telefono: '', email: '', observaciones: '' };

  // computed
  presupuestoAprobado         = computed(() => this.presupuestos().find(p => p.esAprobado));
  availableMaterialBudgetLines = computed(() => {
    const res: any[] = [];
    this.partidas().forEach(p => {
      p.lineas.filter(l => l.tipo === 'Material').forEach(l => {
        res.push({ label: `${p.nombre} - ${l.descripcion}`, value: l.id });
      });
    });
    return res;
  });
  presupuestoAprobadoTotal    = computed(() => this.presupuestoAprobado()?.total ?? 0);
  presupuestoAprobadoMaterial = computed(() => this.presupuestoAprobado()?.totalMaterial ?? 0);
  presupuestoAprobadoHoras    = computed(() => this.presupuestoAprobado()?.totalHoras ?? 0);
  totalHorasReales    = computed(() => this.registrosHoras().reduce((s, r) => s + r.horas, 0));
  totalCosteHoras     = computed(() => this.registrosHoras().reduce((s, r) => s + r.costeTotal, 0));
  totalMaterialesReal = computed(() => this.materiales().reduce((s, m) => s + m.importeReal, 0));
  costeReal           = computed(() => this.totalCosteHoras() + this.totalMaterialesReal());
  desviacion          = computed(() => this.costeReal() - this.presupuestoAprobadoTotal());

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.obraId.set(id);
    this.store.loadObraById(id);
    this.cargarDatos(id);
  }

  cargarDatos(id: string) {
    this.presupuestosSvc.getByObra(id).subscribe(p => {
      this.presupuestos.set(p);
      const aprobado = p.find(x => x.esAprobado);
      if (aprobado) {
        this.partidasSvc.getByPresupuesto(aprobado.id).subscribe(part => this.partidas.set(part));
      }
    });
    this.registroHorasSvc.getByObra(id).subscribe(r => this.registrosHoras.set(r));
    this.materialesSvc.getByObra(id).subscribe(m => this.materiales.set(m));
    this.operariosSvc.getAll().subscribe(o => this.operarios.set(o));
    this.categoriasSvc.getAll().subscribe(c => this.categorias.set(c));
    this.proveedoresSvc.getAll().subscribe(p => this.proveedores.set(p));
  }

  // ── Presupuesto ──────────────────────────────────────────────────────────
  abrirNuevoPresupuesto() {
    this.editandoPresupuestoId.set(null);
    this.presupuestoForm = { numero: '', fecha: new Date(), descripcion: '' };
    this.dlgPresupuesto = true;
  }

  abrirEditarPresupuesto(p: any) {
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
          this.presupuestosSvc.getByObra(this.obraId()).subscribe(p => this.presupuestos.set(p));
          this.msg.add({ severity: 'success', summary: 'Presupuesto actualizado' });
        },
        error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al modificar' }); }
      });
    } else {
      this.presupuestosSvc.create({ obraId: this.obraId(), numero: this.presupuestoForm.numero,
        fecha: this.presupuestoForm.fecha, descripcion: this.presupuestoForm.descripcion,
        lineasMaterial: [], lineasHoras: [] }).subscribe({
        next: () => {
          this.dlgPresupuesto = false; this.saving.set(false);
          this.presupuestosSvc.getByObra(this.obraId()).subscribe(p => this.presupuestos.set(p));
          this.msg.add({ severity: 'success', summary: 'Presupuesto creado' });
        },
        error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al crear' }); }
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
            this.msg.add({ severity: 'success', summary: 'Presupuesto eliminado' });
            if (this.presupuestoSeleccionado() === id) {
              this.presupuestoSeleccionado.set(null);
              this.partidas.set([]);
            }
            this.presupuestosSvc.getByObra(this.obraId()).subscribe(p => this.presupuestos.set(p));
          },
          error: () => this.msg.add({ severity: 'error', summary: 'Error' })
        });
      }
    });
  }

  aprobarPresupuesto(id: string) {
    this.presupuestosSvc.aprobar(id).subscribe({
      next: () => { this.presupuestosSvc.getByObra(this.obraId()).subscribe(p => this.presupuestos.set(p));
        this.msg.add({ severity: 'success', summary: 'Presupuesto aprobado' }); }
    });
  }

  seleccionarPresupuesto(id: string) {
    this.presupuestoSeleccionado.set(id);
    this.partidasSvc.getByPresupuesto(id).subscribe(p => this.partidas.set(p));
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
        this.partidasSvc.getByPresupuesto(this.presupuestoSeleccionado()!).subscribe(p => this.partidas.set(p));
        this.msg.add({ severity: 'success', summary: editId ? 'Partida actualizada' : 'Partida creada' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  confirmarEliminarPartida(id: string) {
    this.confirm.confirm({ message: 'Eliminar esta partida y sus lineas?', header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => { this.partidasSvc.delete(id).subscribe({
        next: () => { this.partidasSvc.getByPresupuesto(this.presupuestoSeleccionado()!).subscribe(p => this.partidas.set(p));
          this.msg.add({ severity: 'success', summary: 'Partida eliminada' }); }
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
    if (editId) {
      obs = this.partidasSvc.updateLinea(editId, this.lineaForm);
    } else if (this.tipoLinea() === 'Material') {
      obs = this.partidasSvc.addLineaMaterial(this.lineaPartidaId()!, this.lineaForm);
    } else {
      obs = this.partidasSvc.addLineaManoObra(this.lineaPartidaId()!, this.lineaForm);
    }
    obs.subscribe({
      next: () => {
        this.dlgLinea = false; this.saving.set(false); this.editandoLineaId.set(null);
        this.partidasSvc.getByPresupuesto(this.presupuestoSeleccionado()!).subscribe(p => this.partidas.set(p));
        this.msg.add({ severity: 'success', summary: editId ? 'Linea actualizada' : 'Linea anadida' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  confirmarEliminarLinea(id: string) {
    this.confirm.confirm({ message: 'Eliminar esta linea?', header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => { this.partidasSvc.deleteLinea(id).subscribe({
        next: () => { this.partidasSvc.getByPresupuesto(this.presupuestoSeleccionado()!).subscribe(p => this.partidas.set(p));
          this.msg.add({ severity: 'success', summary: 'Linea eliminada' }); }
      }); }
    });
  }

  // ── Horas ────────────────────────────────────────────────────────────────
  abrirNuevasHoras() {
    this.editandoHorasId.set(null);
    this.horasForm = { operarioId: null, categoriaOperarioId: null, fecha: new Date(), horas: 8, costeHoraAplicado: 0, observaciones: '' };
    this.dlgHoras = true;
  }

  abrirEditarHoras(r: RegistroHorasDto) {
    this.editandoHorasId.set(r.id);
    this.horasForm = { operarioId: r.operarioId, categoriaOperarioId: r.categoriaOperarioId,
      fecha: new Date(r.fecha), horas: r.horas, costeHoraAplicado: r.costeHoraAplicado, observaciones: r.observaciones ?? '' };
    this.dlgHoras = true;
  }

  cerrarDlgHoras() { this.dlgHoras = false; this.editandoHorasId.set(null); }

  onOperarioChange() {
    const op = this.operarios().find(o => o.id === this.horasForm.operarioId);
    if (op) { this.horasForm.categoriaOperarioId = op.categoriaOperarioId; this.horasForm.costeHoraAplicado = op.costeHoraBase; }
  }

  guardarHoras() {
    this.saving.set(true);
    const editId = this.editandoHorasId();
    const obs = editId
      ? this.registroHorasSvc.update(editId, { fecha: this.horasForm.fecha, horas: this.horasForm.horas,
          costeHoraAplicado: this.horasForm.costeHoraAplicado, observaciones: this.horasForm.observaciones })
      : this.registroHorasSvc.create({ obraId: this.obraId(), operarioId: this.horasForm.operarioId,
          categoriaOperarioId: this.horasForm.categoriaOperarioId, fecha: this.horasForm.fecha,
          horas: this.horasForm.horas, costeHoraAplicado: this.horasForm.costeHoraAplicado, observaciones: this.horasForm.observaciones });
    obs.subscribe({
      next: () => {
        this.cerrarDlgHoras(); this.saving.set(false);
        this.registroHorasSvc.getByObra(this.obraId()).subscribe(r => this.registrosHoras.set(r));
        this.msg.add({ severity: 'success', summary: editId ? 'Horas actualizadas' : 'Horas registradas' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  confirmarEliminarHoras(id: string) {
    this.confirm.confirm({ message: 'Eliminar este registro de horas?', header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => { this.registroHorasSvc.delete(id).subscribe({
        next: () => { this.registroHorasSvc.getByObra(this.obraId()).subscribe(r => this.registrosHoras.set(r));
          this.msg.add({ severity: 'success', summary: 'Registro eliminado' }); }
      }); }
    });
  }

  // ── Materiales ───────────────────────────────────────────────────────────
  abrirNuevoMaterial() {
    this.editandoMaterialId.set(null);
    this.materialForm = { descripcion: '', unidad: '', cantidad: 0, precioUnitario: 0, fecha: new Date(), proveedorId: null, numeroAlbaran: '', numeroFactura: '', observaciones: '', lineaPartidaId: null };
    this.dlgMaterial = true;
  }

  abrirEditarMaterial(m: MaterialObraDto) {
    this.editandoMaterialId.set(m.id);
    this.materialForm = { 
      descripcion: m.descripcion, unidad: m.unidad, cantidad: m.cantidad,
      precioUnitario: m.precioUnitario, fecha: new Date(m.fecha), 
      proveedorId: m.proveedorId, numeroAlbaran: m.numeroAlbaran ?? '', 
      numeroFactura: m.numeroFactura ?? '', observaciones: m.observaciones ?? '',
      lineaPartidaId: m.lineaPartidaId
    };
    this.dlgMaterial = true;
  }

  cerrarDlgMaterial() { this.dlgMaterial = false; this.editandoMaterialId.set(null); }

  guardarMaterial() {
    this.saving.set(true);
    const editId = this.editandoMaterialId();
    const obs = editId
      ? this.materialesSvc.update(editId, this.materialForm)
      : this.materialesSvc.create({ obraId: this.obraId(), ...this.materialForm });
    obs.subscribe({
      next: () => {
        this.cerrarDlgMaterial(); this.saving.set(false);
        this.materialesSvc.getByObra(this.obraId()).subscribe(m => this.materiales.set(m));
        this.msg.add({ severity: 'success', summary: editId ? 'Material actualizado' : 'Material anadido' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  confirmarEliminarMaterial(id: string) {
    this.confirm.confirm({ message: 'Eliminar este material?', header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => { this.materialesSvc.delete(id).subscribe({
        next: () => { this.materialesSvc.getByObra(this.obraId()).subscribe(m => this.materiales.set(m));
          this.msg.add({ severity: 'success', summary: 'Material eliminado' }); }
      }); }
    });
  }

  // ── Proveedores ──────────────────────────────────────────────────────────
  abrirNuevoProveedor() {
    this.proveedorForm = { nombre: '', cifNif: '', direccion: '', telefono: '', email: '', observaciones: '' };
    this.dlgProveedor = true;
  }

  guardarProveedor() {
    if (!this.proveedorForm.nombre) return;
    this.saving.set(true);
    this.proveedoresSvc.create(this.proveedorForm).subscribe({
      next: (prov) => {
        this.msg.add({ severity: 'success', summary: 'Proveedor creado' });
        this.dlgProveedor = false;
        this.saving.set(false);
        // Recargar proveedores y seleccionar el nuevo
        this.proveedoresSvc.getAll().subscribe(p => {
          this.proveedores.set(p);
          this.materialForm.proveedorId = prov.id;
        });
      },
      error: () => {
        this.saving.set(false);
        this.msg.add({ severity: 'error', summary: 'Error al crear proveedor' });
      }
    });
  }

  cambiarEstado(nuevoEstado: number) {
    this.store.cambiarEstadoObra(this.obraId(), nuevoEstado);
    this.msg.add({ severity: 'success', summary: 'Estado actualizado correctamente' });
  }

  estadoBadge(estado: number): string {
    const map: Record<number, string> = {
      0: 'bg-slate-100 text-slate-600', 1: 'bg-blue-100 text-blue-700',
      2: 'bg-amber-100 text-amber-700', 3: 'bg-green-100 text-green-700', 4: 'bg-red-100 text-red-700'
    };
    return map[estado] ?? '';
  }

  getProveedorNombre(id?: string): string {
    if (!id) return '';
    return this.proveedores().find(p => p.id === id)?.nombre || '';
  }

  getLineaPartidaNombre(id: string): string {
    for (const p of this.partidas()) {
      const linea = p.lineas.find(l => l.id === id);
      if (linea) return `${p.nombre} > ${linea.descripcion}`;
    }
    return '';
  }
}