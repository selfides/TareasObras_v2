import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService, UpdateUsuarioRequest } from '../../../core/services/usuarios.service';
import { UsuarioDto } from '../../../core/models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule,
            DialogModule, InputTextModule, SelectModule, PasswordModule, TagModule,
            ConfirmDialogModule, ToggleSwitchModule],
  providers: [ConfirmationService],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  private service = inject(UsuariosService);
  private msg = inject(MessageService);
  private confirmService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  usuarios = signal<UsuarioDto[]>([]);
  loading = signal(true);
  saving = signal(false);
  dialogVisible = false;
  editMode = false;
  editingUserId: string | null = null;

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
    activo:   [true],
  });

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: u => { this.usuarios.set(u); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openNew() {
    this.editMode = false;
    this.editingUserId = null;
    this.form.reset({ nombre: '', apellidos: '', email: '', password: '', rol: 'Operario', activo: true });
    this.form.get('password')!.setValidators([Validators.required, Validators.minLength(8)]);
    this.form.get('password')!.updateValueAndValidity();
    this.dialogVisible = true;
  }

  openEdit(usuario: UsuarioDto) {
    this.editMode = true;
    this.editingUserId = usuario.id;
    this.form.patchValue({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
    });
    // En edición la contraseña no es obligatoria
    this.form.get('password')!.clearValidators();
    this.form.get('password')!.updateValueAndValidity();
    this.form.get('password')!.setValue('');
    this.dialogVisible = true;
  }

  guardar() {
    if (this.editMode) {
      this.actualizar();
    } else {
      this.crear();
    }
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
          this.loadUsuarios();
        },
        error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario' }); }
      });
  }

  actualizar() {
    if (this.form.invalid || !this.editingUserId) return;
    this.saving.set(true);
    const v = this.form.value;
    const data: UpdateUsuarioRequest = {
      nombre: v.nombre!,
      apellidos: v.apellidos!,
      email: v.email!,
      rol: v.rol!,
      activo: v.activo!
    };
    this.service.update(this.editingUserId, data)
      .subscribe({
        next: () => {
          this.msg.add({ severity: 'success', summary: 'Usuario actualizado', detail: v.email! });
          this.dialogVisible = false;
          this.saving.set(false);
          this.loadUsuarios();
        },
        error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el usuario' }); }
      });
  }

  confirmDelete(usuario: UsuarioDto) {
    this.confirmService.confirm({
      message: `¿Desactivar al usuario <b>${usuario.nombre} ${usuario.apellidos}</b>?<br>El usuario no podrá iniciar sesión.`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.service.delete(usuario.id).subscribe({
          next: () => {
            this.msg.add({ severity: 'success', summary: 'Usuario eliminado', detail: `${usuario.nombre} ${usuario.apellidos}` });
            this.loadUsuarios();
          },
          error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario' })
        });
      }
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
