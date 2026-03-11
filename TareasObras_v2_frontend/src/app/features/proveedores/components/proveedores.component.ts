import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProveedoresService } from '../../../core/services/proveedores.service';
import { ProveedorDto } from '../../../core/models';
import { AuthService } from '../../../core/auth/auth.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableModule, ButtonModule, DialogModule, InputTextModule, TextareaModule, ConfirmDialogModule],
  template: `
    <div class="space-y-4 animate-fade-in">
      <div class="flex justify-between items-center bg-white dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Proveedores</h1>
          <p class="text-surface-500 mt-1">Gestion de proveedores y subcontratas</p>
        </div>
        <p-button label="Nuevo Proveedor" icon="pi pi-plus" (onClick)="abrirNuevo()" *ngIf="auth.isAdmin() || auth.isSupervisor()" />
      </div>

      <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <p-table [value]="proveedores()" [paginator]="true" [rows]="10" styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="nombre">Nombre <p-sortIcon field="nombre"></p-sortIcon></th>
              <th>CIF/NIF</th>
              <th>Telefono</th>
              <th>Email</th>
              <th class="w-24"></th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-prov>
            <tr>
              <td class="font-medium">{{ prov.nombre }}</td>
              <td class="text-surface-600 truncate max-w-xs">{{ prov.cifNif || '-' }}</td>
              <td class="text-surface-600">{{ prov.telefono || '-' }}</td>
              <td class="text-surface-600">{{ prov.email || '-' }}</td>
              <td class="text-right whitespace-nowrap">
                <p-button icon="pi pi-pencil" [text]="true" size="small" (onClick)="abrirEditar(prov)" *ngIf="auth.isAdmin() || auth.isSupervisor()" />
                <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" (onClick)="confirmarEliminar(prov.id)" *ngIf="auth.isAdmin()" />
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr><td colspan="5" class="text-center p-8 text-surface-500">No hay proveedores registrados</td></tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <!-- Dialog -->
    <p-dialog [(visible)]="dlgVisible" [header]="editId() ? 'Editar Proveedor' : 'Nuevo Proveedor'" [modal]="true" appendTo="body" [style]="{width:'min(500px, 95vw)'}" [draggable]="false">
      <div class="space-y-4 pt-4">
        <div>
          <label class="block text-sm font-medium mb-1.5">Nombre comercial / Razon social *</label>
          <input pInputText [(ngModel)]="form.nombre" class="w-full" placeholder="Ej: Materiales Hermanos SL" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">CIF/NIF</label>
            <input pInputText [(ngModel)]="form.cifNif" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Telefono</label>
            <input pInputText [(ngModel)]="form.telefono" class="w-full" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Email</label>
          <input pInputText [(ngModel)]="form.email" class="w-full" type="email" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Direccion</label>
          <input pInputText [(ngModel)]="form.direccion" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Observaciones</label>
          <textarea pTextarea [(ngModel)]="form.observaciones" rows="3" class="w-full"></textarea>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dlgVisible = false" />
        <p-button [label]="editId() ? 'Guardar Cambios' : 'Crear Proveedor'" icon="pi pi-check" (onClick)="guardar()" [loading]="saving()" [disabled]="!form.nombre" />
      </ng-template>
    </p-dialog>

    <p-confirmdialog />
  `
})
export class ProveedoresComponent implements OnInit {
  svc = inject(ProveedoresService);
  auth = inject(AuthService);
  private msg = inject(MessageService);
  private confirm = inject(ConfirmationService);

  proveedores = signal<ProveedorDto[]>([]);
  dlgVisible = false;
  saving = signal(false);
  editId = signal<string | null>(null);

  form = { nombre: '', cifNif: '', direccion: '', telefono: '', email: '', observaciones: '' };

  ngOnInit() { this.load(); }
  load() { this.svc.getAll().subscribe(p => this.proveedores.set(p)); }

  abrirNuevo() {
    this.editId.set(null);
    this.form = { nombre: '', cifNif: '', direccion: '', telefono: '', email: '', observaciones: '' };
    this.dlgVisible = true;
  }

  abrirEditar(p: ProveedorDto) {
    this.editId.set(p.id);
    this.form = { nombre: p.nombre, cifNif: p.cifNif || '', direccion: p.direccion || '', telefono: p.telefono || '', email: p.email || '', observaciones: p.observaciones || '' };
    this.dlgVisible = true;
  }

  guardar() {
    if (!this.form.nombre) return;
    this.saving.set(true);
    const obId = this.editId();
    const sub = obId ? this.svc.update(obId, this.form) : this.svc.create(this.form);
    
    sub.subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: obId ? 'Actualizado' : 'Creado' });
        this.dlgVisible = false;
        this.saving.set(false);
        this.load();
      },
      error: () => {
        this.saving.set(false);
        this.msg.add({ severity: 'error', summary: 'Error al procesar' });
      }
    });
  }

  confirmarEliminar(id: string) {
    this.confirm.confirm({
      message: '¿Estas seguro de que deseas eliminar este proveedor?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.svc.delete(id).subscribe({
          next: () => {
            this.msg.add({ severity: 'success', summary: 'Eliminado' });
            this.load();
          }
        });
      }
    });
  }
}
