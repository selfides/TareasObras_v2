import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialesObraService } from '../../../core/services/materiales-obra.service';
import { ObrasService } from '../../../core/services/obras.service';
import { ProveedoresService } from '../../../core/services/proveedores.service';
import { PresupuestosService } from '../../../core/services/presupuestos.service';
import { PartidasService, PartidaDto } from '../../../core/services/partidas.service';
import { ObraListDto, ProveedorDto } from '../../../core/models';
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

interface MaterialGlobalDto {
  id: string; obraId: string; obraNombre: string; obraCodigo: string;
  proveedorId?: string; lineaPartidaId?: string; lineaPartidaNombre?: string;
  descripcion: string; unidad: string;
  cantidad: number; precioUnitario: number; importeReal: number;
  fecha: string; numeroAlbaran?: string; numeroFactura?: string; observaciones?: string;
}

@Component({
  selector: 'app-materiales-global',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
            ConfirmDialogModule, InputTextModule, InputNumberModule, SelectModule,
            DatePickerModule, TextareaModule, TagModule, TooltipModule, ToggleSwitchModule],
  providers: [ConfirmationService],
  templateUrl: './materiales-global.component.html'
})
export class MaterialesGlobalComponent implements OnInit {
  private materialesService = inject(MaterialesObraService);
  private obrasService = inject(ObrasService);
  private proveedoresService = inject(ProveedoresService);
  private presupuestosService = inject(PresupuestosService);
  private partidasService = inject(PartidasService);
  private msg = inject(MessageService);
  private confirmService = inject(ConfirmationService);

  obras = signal<ObraListDto[]>([]);
  materiales = signal<MaterialGlobalDto[]>([]);
  proveedores = signal<ProveedorDto[]>([]);
  partidas = signal<PartidaDto[]>([]);
  loading = signal(true);
  saving = signal(false);
  dialogVisible = false;
  dlgProveedor = false;
  editingMaterialId = signal<string | null>(null);

  // Filtros
  selectedDate = signal<Date>(new Date());
  filterByDate = signal(true);
  selectedObraFilter = signal<string | null>(null);

  filteredMateriales = computed(() => {
    const obraId = this.selectedObraFilter();
    const all = this.materiales();
    return obraId ? all.filter(m => m.obraId === obraId) : all;
  });

  materialForm: any = {
    obraId: null, descripcion: '', unidad: '', cantidad: 0, precioUnitario: 0,
    fecha: new Date(), proveedorId: null, numeroAlbaran: '',
    numeroFactura: '', observaciones: '', lineaPartidaId: null
  };

  proveedorForm: any = {
    nombre: '', cifNif: '', direccion: '', telefono: '', email: '', observaciones: ''
  };

  // Stats
  totalMateriales = computed(() => this.filteredMateriales().length);
  totalImporte = computed(() => this.filteredMateriales().reduce((s, m) => s + m.importeReal, 0));

  availableMaterialBudgetLines = computed(() => {
    const res: any[] = [];
    this.partidas().forEach(p => {
      p.lineas.filter(l => l.tipo === 'Material').forEach(l => {
        res.push({ label: `${p.nombre} - ${l.descripcion}`, value: l.id });
      });
    });
    return res;
  });

  ngOnInit() {
    this.obrasService.getAll().subscribe(o => this.obras.set(o));
    this.proveedoresService.getAll().subscribe(p => this.proveedores.set(p));
    this.loadMateriales();
  }

  loadMateriales() {
    this.loading.set(true);
    const fecha = this.filterByDate() ? this.formatDate(this.selectedDate()) : undefined;
    this.materialesService.getAll(fecha).subscribe({
      next: m => { this.materiales.set(m); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onDateChange(date: Date) {
    this.selectedDate.set(date);
    this.loadMateriales();
  }

  onFilterToggle() {
    this.loadMateriales();
  }

  goToday() {
    this.selectedDate.set(new Date());
    this.loadMateriales();
  }

  goDay(offset: number) {
    const d = new Date(this.selectedDate());
    d.setDate(d.getDate() + offset);
    this.selectedDate.set(d);
    this.loadMateriales();
  }

  openNew() {
    this.editingMaterialId.set(null);
    this.materialForm = {
      obraId: this.obras().length ? this.obras()[0].id : null,
      descripcion: '', unidad: '', cantidad: 0, precioUnitario: 0,
      fecha: new Date(), proveedorId: null, numeroAlbaran: '',
      numeroFactura: '', observaciones: '', lineaPartidaId: null
    };
    this.dialogVisible = true;
    this.onObraChange();
  }

  openEdit(material: MaterialGlobalDto) {
    this.editingMaterialId.set(material.id);
    this.materialForm = {
      obraId: material.obraId,
      descripcion: material.descripcion, unidad: material.unidad,
      cantidad: material.cantidad, precioUnitario: material.precioUnitario,
      fecha: new Date(material.fecha), proveedorId: material.proveedorId ?? null,
      numeroAlbaran: material.numeroAlbaran ?? '',
      numeroFactura: material.numeroFactura ?? '',
      observaciones: material.observaciones ?? '',
      lineaPartidaId: material.lineaPartidaId
    };
    this.dialogVisible = true;
    this.onObraChange(); // Cargar partidas para esta obra
  }

  onObraChange() {
    const obraId = this.materialForm.obraId;
    if (!obraId) {
      this.partidas.set([]);
      this.materialForm.lineaPartidaId = null;
      return;
    }

    this.presupuestosService.getByObra(obraId).subscribe(pptos => {
      const aprobado = pptos.find(p => p.esAprobado);
      if (aprobado) {
        this.partidasService.getByPresupuesto(aprobado.id).subscribe(part => {
          this.partidas.set(part);
        });
      } else {
        this.partidas.set([]);
        this.materialForm.lineaPartidaId = null;
      }
    });
  }

  getLineaPartidaNombre(lineaId?: string): string {
    if (!lineaId) return '';
    for (const p of this.partidas()) {
      const linea = p.lineas.find(l => l.id === lineaId);
      if (linea) return `${p.nombre} > ${linea.descripcion}`;
    }
    return '';
  }

  guardar() {
    if (this.editingMaterialId()) { this.actualizar(); } else { this.crear(); }
  }

  crear() {
    if (!this.materialForm.descripcion || !this.materialForm.obraId) return;
    this.saving.set(true);
    const { obraId, ...rest } = this.materialForm;
    this.materialesService.create({ obraId, ...rest }).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Material añadido', detail: this.materialForm.descripcion });
        this.dialogVisible = false; this.saving.set(false); this.loadMateriales();
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo añadir' }); }
    });
  }

  actualizar() {
    if (!this.editingMaterialId()) return;
    this.saving.set(true);
    const { obraId, ...rest } = this.materialForm;
    this.materialesService.update(this.editingMaterialId()!, rest).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Material actualizado' });
        this.dialogVisible = false; this.saving.set(false); this.editingMaterialId.set(null);
        this.loadMateriales();
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error' }); }
    });
  }

  confirmDelete(material: MaterialGlobalDto) {
    this.confirmService.confirm({
      message: `¿Eliminar el material <b>${material.descripcion}</b>?`,
      header: 'Confirmar eliminación', icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.materialesService.delete(material.id).subscribe({
          next: () => { this.msg.add({ severity: 'success', summary: 'Material eliminado' }); this.loadMateriales(); },
          error: () => this.msg.add({ severity: 'error', summary: 'Error' })
        });
      }
    });
  }

  getProveedorNombre(id?: string): string {
    if (!id) return '';
    return this.proveedores().find(p => p.id === id)?.nombre || '';
  }

  // ── Proveedores ──────────────────────────────────────────────────────────
  abrirNuevoProveedor() {
    this.proveedorForm = { nombre: '', cifNif: '', direccion: '', telefono: '', email: '', observaciones: '' };
    this.dlgProveedor = true;
  }

  guardarProveedor() {
    if (!this.proveedorForm.nombre) return;
    this.saving.set(true);
    this.proveedoresService.create(this.proveedorForm).subscribe({
      next: (prov) => {
        this.msg.add({ severity: 'success', summary: 'Proveedor creado' });
        this.dlgProveedor = false;
        this.saving.set(false);
        this.proveedoresService.getAll().subscribe(p => {
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

  private formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
