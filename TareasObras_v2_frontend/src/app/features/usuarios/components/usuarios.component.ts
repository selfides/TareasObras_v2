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
  templateUrl: './usuarios.component.html'
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
