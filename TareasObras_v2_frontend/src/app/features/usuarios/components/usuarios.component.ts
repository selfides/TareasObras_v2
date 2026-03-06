import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { UsuarioDto } from '../../../core/models';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule,
            DialogModule, InputTextModule, SelectModule, PasswordModule, TagModule],
  template: `
    <div class="space-y-5 animate-fade-in">

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Usuarios</h1>
          <p class="text-surface-500 dark:text-surface-400 text-sm mt-0.5">Gestión de accesos y roles</p>
        </div>
        <p-button label="Nuevo Usuario" icon="pi pi-user-plus" size="small" (onClick)="dialogVisible = true" />
      </div>

      <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <p-table [value]="usuarios()" [loading]="loading()" styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Alta</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-u>
            <tr>
              <td class="font-medium text-surface-900 dark:text-surface-100">{{ u.nombre }} {{ u.apellidos }}</td>
              <td class="text-surface-500 dark:text-surface-400 text-sm">{{ u.email }}</td>
              <td>
                <span [class]="'px-2 py-0.5 rounded-full text-xs font-medium ' + rolBadge(u.rol)">{{ u.rol }}</span>
              </td>
              <td>
                <span [class]="'px-2 py-0.5 rounded-full text-xs font-medium ' + (u.activo ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700')">
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="text-sm text-surface-400">{{ u.createdAt | date:'dd/MM/yyyy' }}</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr><td colspan="5" class="text-center py-10 text-surface-400">
              <i class="pi pi-users text-3xl block mb-2"></i>No hay usuarios
            </td></tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <!-- Dialog nuevo usuario -->
    <p-dialog [(visible)]="dialogVisible" header="Nuevo Usuario" [modal]="true"
              [style]="{width:'480px'}" [draggable]="false">
      <form [formGroup]="form" class="space-y-4 pt-2">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Nombre *</label>
            <input pInputText formControlName="nombre" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Apellidos *</label>
            <input pInputText formControlName="apellidos" class="w-full" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email *</label>
          <input pInputText formControlName="email" type="email" class="w-full" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Contraseña *</label>
            <p-password formControlName="password" [feedback]="true" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Rol *</label>
            <p-select formControlName="rol" appendTo="body" [options]="rolOptions" optionLabel="label" optionValue="value"
                        styleClass="w-full" placeholder="Selecciona rol" />
          </div>
        </div>
      </form>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dialogVisible = false" />
        <p-button label="Crear Usuario" icon="pi pi-check" (onClick)="crear()" [disabled]="form.invalid" [loading]="saving()" />
      </ng-template>
    </p-dialog>
  `
})
export class UsuariosComponent implements OnInit {
  private service = inject(UsuariosService);
  private msg = inject(MessageService);
  private fb = inject(FormBuilder);

  usuarios = signal<UsuarioDto[]>([]);
  loading = signal(true);
  saving = signal(false);
  dialogVisible = false;

  rolOptions = [
    { label: 'Admin',      value: 'Admin' },
    { label: 'Supervisor', value: 'Supervisor' },
    { label: 'Operario',   value: 'Operario' },
  ];

  form = this.fb.group({
    nombre:   ['', Validators.required],
    apellidos:['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rol:      ['Operario', Validators.required],
  });

  ngOnInit() {
    this.service.getAll().subscribe({
      next: u => { this.usuarios.set(u); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  crear() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const v = this.form.value;
    this.service.register({ email: v.email!, password: v.password!, nombre: v.nombre!, apellidos: v.apellidos!, rol: v.rol! })
      .subscribe({
        next: () => {
          this.msg.add({ severity: 'success', summary: 'Usuario creado', detail: v.email! });
          this.dialogVisible = false;
          this.saving.set(false);
          this.ngOnInit();
        },
        error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario' }); }
      });
  }

  rolBadge(rol: string): string {
    const map: Record<string,string> = {
      'Admin': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'Supervisor': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'Operario': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    };
    return map[rol] ?? '';
  }
}
