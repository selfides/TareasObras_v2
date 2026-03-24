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
import { MaterialesObraService } from '../../../../../core/services/materiales-obra.service';
import { ProveedoresService } from '../../../../../core/services/proveedores.service';
import { MaterialObraDto, ProveedorDto } from '../../../../../core/models';

@Component({
  selector: 'app-obra-tab-materiales',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, SelectModule,
            DatePickerModule, InputTextModule, InputNumberModule, TextareaModule, TooltipModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './obra-tab-materiales.component.html'
})
export class ObraTabMaterialesComponent implements OnInit {
  obraId = input.required<string>();
  availableMaterialBudgetLines = input<any[]>([]); // Pasado desde el detail para vincular presupuesto
  totalesActualizados = output<number>();

  auth = inject(AuthService);
  private materialesSvc = inject(MaterialesObraService);
  private proveedoresSvc = inject(ProveedoresService);
  private msg = inject(MessageService);
  private confirm = inject(ConfirmationService);

  materiales = signal<MaterialObraDto[]>([]);
  proveedores = signal<ProveedorDto[]>([]);

  // Dialog State
  dlgMaterial = false;
  dlgProveedor = false;
  editandoMaterialId = signal<string | null>(null);
  saving = signal(false);

  materialForm: any = { 
    descripcion: '', unidad: '', cantidad: 0, precioUnitario: 0, fecha: new Date(), 
    proveedorId: null, numeroAlbaran: '', numeroFactura: '', observaciones: '', lineaPartidaId: null 
  };
  proveedorForm: any = { nombre: '', cifNif: '', direccion: '', telefono: '', email: '', observaciones: '' };

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.materialesSvc.getByObra(this.obraId()).subscribe(m => {
      this.materiales.set(m);
      this.emitTotales(m);
    });
    this.proveedoresSvc.getAll().subscribe(p => this.proveedores.set(p));
  }

  emitTotales(mats: MaterialObraDto[]) {
    const coste = mats.reduce((s, m) => s + m.importeReal, 0);
    this.totalesActualizados.emit(coste);
  }

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
    const payload = { obraId: this.obraId(), ...this.materialForm };
    
    const obs = editId
      ? this.materialesSvc.update(editId, this.materialForm)
      : this.materialesSvc.create(payload);

    obs.subscribe({
      next: () => {
        this.cerrarDlgMaterial(); this.saving.set(false);
        this.materialesSvc.getByObra(this.obraId()).subscribe(m => {
          this.materiales.set(m);
          this.emitTotales(m);
        });
        this.msg.add({ severity: 'success', summary: editId ? 'Material actualizado' : 'Material añadido' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  confirmarEliminarMaterial(id: string) {
    this.confirm.confirm({ message: 'Eliminar este material?', header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => { this.materialesSvc.delete(id).subscribe({
        next: () => { 
          this.materialesSvc.getByObra(this.obraId()).subscribe(m => {
            this.materiales.set(m);
            this.emitTotales(m);
          });
          this.msg.add({ severity: 'success', summary: 'Material eliminado' }); 
        }
      }); }
    });
  }

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

  getProveedorNombre(id?: string): string {
    if (!id) return '';
    return this.proveedores().find(p => p.id === id)?.nombre || '';
  }
}
