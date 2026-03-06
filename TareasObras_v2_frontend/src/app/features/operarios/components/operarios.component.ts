import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperariosService } from '../../../core/services/operarios.service';
import { CategoriasOperarioService } from '../../../core/services/categorias-operario.service';
import { OperarioDto, CategoriaOperarioDto } from '../../../core/models';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-operarios',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
            InputTextModule, InputNumberModule, SelectModule, TabsModule],
  template: `
    <div class="space-y-5 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Operarios</h1>
          <p class="text-surface-500 text-sm mt-0.5">Gestión de operarios y categorías</p>
        </div>
      </div>

      <p-tabs [(value)]="activeTab">
        <p-tablist>
          <p-tab value="operarios">Operarios ({{ operarios().length }})</p-tab>
          <p-tab value="categorias">Categorías ({{ categorias().length }})</p-tab>
        </p-tablist>
        <p-tabpanels>

          <!-- TAB OPERARIOS -->
          <p-tabpanel value="operarios">
            <div class="space-y-4 mt-4">
              <div class="flex justify-end">
                <p-button label="Nuevo operario" icon="pi pi-plus" size="small" (onClick)="abrirDlgOperario()" />
              </div>
              <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                <p-table [value]="operarios()" [loading]="loading()" styleClass="p-datatable-sm">
                  <ng-template pTemplate="header">
                    <tr>
                      <th>Nombre</th><th>DNI</th><th>Teléfono</th>
                      <th>Categoría</th><th>€/hora</th><th>Estado</th><th></th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-o>
                    <tr>
                      <td class="font-medium">{{ o.nombreCompleto }}</td>
                      <td class="text-surface-500 text-sm">{{ o.dni || '—' }}</td>
                      <td class="text-surface-500 text-sm">{{ o.telefono || '—' }}</td>
                      <td><span class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{{ o.categoriaNombre }}</span></td>
                      <td class="font-medium text-green-600">{{ o.costeHoraBase | number:'1.2-2' }} €</td>
                      <td><span [class]="'px-2 py-0.5 rounded-full text-xs font-medium ' + (o.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')">{{ o.activo ? 'Activo' : 'Inactivo' }}</span></td>
                      <td class="text-right">
                        <p-button icon="pi pi-pencil" [text]="true" size="small" (onClick)="abrirDlgOperario(o)" />
                        <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" (onClick)="eliminarOperario(o.id)" />
                      </td>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="emptymessage">
                    <tr><td colspan="7" class="text-center py-10 text-surface-400">
                      <i class="pi pi-hard-hat text-3xl block mb-2"></i>No hay operarios
                    </td></tr>
                  </ng-template>
                </p-table>
              </div>
            </div>
          </p-tabpanel>

          <!-- TAB CATEGORIAS -->
          <p-tabpanel value="categorias">
            <div class="space-y-4 mt-4">
              <div class="flex justify-end">
                <p-button label="Nueva categoría" icon="pi pi-plus" size="small" (onClick)="abrirDlgCategoria()" />
              </div>
              <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                <p-table [value]="categorias()" styleClass="p-datatable-sm">
                  <ng-template pTemplate="header">
                    <tr><th>Nombre</th><th class="text-right">€/hora base</th><th class="text-right">Operarios</th><th></th></tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-c>
                    <tr>
                      <td class="font-medium">{{ c.nombre }}</td>
                      <td class="text-right font-medium text-green-600">{{ c.costeHoraBase | number:'1.2-2' }} €</td>
                      <td class="text-right text-surface-500">{{ c.totalOperarios }}</td>
                      <td class="text-right">
                        <p-button icon="pi pi-pencil" [text]="true" size="small" (onClick)="abrirDlgCategoria(c)" />
                        <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" (onClick)="eliminarCategoria(c.id)" />
                      </td>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="emptymessage">
                    <tr><td colspan="4" class="text-center py-10 text-surface-400">
                      <i class="pi pi-tag text-3xl block mb-2"></i>No hay categorías
                    </td></tr>
                  </ng-template>
                </p-table>
              </div>
            </div>
          </p-tabpanel>

        </p-tabpanels>
      </p-tabs>
    </div>

    <!-- Dialog Operario -->
    <p-dialog [(visible)]="dlgOperario" [header]="editandoOperario ? 'Editar operario' : 'Nuevo operario'"
              [modal]="true" [style]="{width:'500px'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">Nombre *</label>
            <input pInputText [(ngModel)]="operarioForm.nombre" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Apellidos *</label>
            <input pInputText [(ngModel)]="operarioForm.apellidos" class="w-full" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">DNI</label>
            <input pInputText [(ngModel)]="operarioForm.dni" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Teléfono</label>
            <input pInputText [(ngModel)]="operarioForm.telefono" class="w-full" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Categoría *</label>
          <p-select [(ngModel)]="operarioForm.categoriaOperarioId" appendTo="body"
                    [options]="categorias()" optionLabel="nombre" optionValue="id"
                    placeholder="Selecciona categoría" styleClass="w-full" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dlgOperario = false" />
        <p-button [label]="editandoOperario ? 'Guardar cambios' : 'Crear operario'" icon="pi pi-check"
                  (onClick)="guardarOperario()" [loading]="saving()" />
      </ng-template>
    </p-dialog>

    <!-- Dialog Categoria -->
    <p-dialog [(visible)]="dlgCategoria" [header]="editandoCategoria ? 'Editar categoría' : 'Nueva categoría'"
              [modal]="true" [style]="{width:'400px'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div>
          <label class="block text-sm font-medium mb-1.5">Nombre *</label>
          <input pInputText [(ngModel)]="categoriaForm.nombre" class="w-full" placeholder="Ej: Oficial 1a" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Coste euros/hora *</label>
          <p-inputNumber [(ngModel)]="categoriaForm.costeHoraBase" [minFractionDigits]="2" styleClass="w-full" placeholder="0,00" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dlgCategoria = false" />
        <p-button [label]="editandoCategoria ? 'Guardar cambios' : 'Crear categoria'" icon="pi pi-check"
                  (onClick)="guardarCategoria()" [loading]="saving()" />
      </ng-template>
    </p-dialog>
  `
})
export class OperariosComponent implements OnInit {
  private operariosSvc  = inject(OperariosService);
  private categoriasSvc = inject(CategoriasOperarioService);
  private msg           = inject(MessageService);

  operarios  = signal<OperarioDto[]>([]);
  categorias = signal<CategoriaOperarioDto[]>([]);
  loading    = signal(true);
  saving     = signal(false);
  activeTab  = signal('operarios');

  dlgOperario  = false;
  dlgCategoria = false;
  editandoOperario:  string | null = null;
  editandoCategoria: string | null = null;

  operarioForm:  any = { nombre: '', apellidos: '', dni: '', telefono: '', categoriaOperarioId: null };
  categoriaForm: any = { nombre: '', costeHoraBase: 0 };

  ngOnInit() { this.cargar(); }

  cargar() {
    this.loading.set(true);
    this.operariosSvc.getAll(false).subscribe(o => { this.operarios.set(o); this.loading.set(false); });
    this.categoriasSvc.getAll().subscribe(c => this.categorias.set(c));
  }

  abrirDlgOperario(o?: OperarioDto) {
    this.editandoOperario = o?.id ?? null;
    this.operarioForm = o
      ? { nombre: o.nombre, apellidos: o.apellidos, dni: o.dni ?? '', telefono: o.telefono ?? '', categoriaOperarioId: o.categoriaOperarioId }
      : { nombre: '', apellidos: '', dni: '', telefono: '', categoriaOperarioId: null };
    this.dlgOperario = true;
  }

  guardarOperario() {
    if (!this.operarioForm.nombre || !this.operarioForm.categoriaOperarioId) return;
    this.saving.set(true);
    const obs = this.editandoOperario
      ? this.operariosSvc.update(this.editandoOperario, this.operarioForm)
      : this.operariosSvc.create(this.operarioForm);
    obs.subscribe({
      next: () => {
        this.dlgOperario = false; this.saving.set(false);
        this.cargar();
        this.msg.add({ severity: 'success', summary: this.editandoOperario ? 'Operario actualizado' : 'Operario creado' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  eliminarOperario(id: string) {
    this.operariosSvc.delete(id).subscribe({
      next: () => { this.cargar(); this.msg.add({ severity: 'success', summary: 'Operario eliminado' }); },
      error: () => this.msg.add({ severity: 'error', summary: 'No se puede eliminar' })
    });
  }

  abrirDlgCategoria(c?: CategoriaOperarioDto) {
    this.editandoCategoria = c?.id ?? null;
    this.categoriaForm = c ? { nombre: c.nombre, costeHoraBase: c.costeHoraBase } : { nombre: '', costeHoraBase: 0 };
    this.dlgCategoria = true;
  }

  guardarCategoria() {
    if (!this.categoriaForm.nombre) return;
    this.saving.set(true);
    const obs = this.editandoCategoria
      ? this.categoriasSvc.update(this.editandoCategoria, this.categoriaForm)
      : this.categoriasSvc.create(this.categoriaForm);
    obs.subscribe({
      next: () => {
        this.dlgCategoria = false; this.saving.set(false);
        this.cargar();
        this.msg.add({ severity: 'success', summary: this.editandoCategoria ? 'Categoria actualizada' : 'Categoria creada' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  eliminarCategoria(id: string) {
    this.categoriasSvc.delete(id).subscribe({
      next: () => { this.cargar(); this.msg.add({ severity: 'success', summary: 'Categoria eliminada' }); },
      error: () => this.msg.add({ severity: 'error', summary: 'No se puede eliminar - tiene operarios asignados' })
    });
  }
}