import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-950 dark:to-surface-900 p-4">

      <button (click)="toggleTheme()" class="fixed top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-surface-800 shadow-md text-surface-600 dark:text-surface-400">
        <i [class]="(theme.isDark() ? 'pi pi-sun' : 'pi pi-moon')"></i>
      </button>

      <div class="w-full max-w-md animate-slide-up">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 shadow-lg mb-4">
            <i class="pi pi-building text-white text-2xl"></i>
          </div>
          <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">TareasObras</h1>
          <p class="text-surface-500 dark:text-surface-400 mt-1">Gestión de obras y proyectos</p>
        </div>

        <div class="bg-white dark:bg-surface-900 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 p-8">
          <h2 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-6">Iniciar sesión</h2>

          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
              <input pInputText formControlName="email" type="email" placeholder="admin@tareasObras.com" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Contraseña</label>
              <p-password formControlName="password" [feedback]="false" [toggleMask]="true"
                          styleClass="w-full" inputStyleClass="w-full" placeholder="••••••••" />
            </div>

            @if (error()) {
              <div class="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                <i class="pi pi-exclamation-circle text-red-500 text-sm"></i>
                <span class="text-red-700 dark:text-red-300 text-sm">{{ error() }}</span>
              </div>
            }

            <p-button type="submit" label="Entrar" icon="pi pi-sign-in" iconPos="right"
                      styleClass="w-full" [loading]="loading()" [disabled]="form.invalid" />
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  theme = inject(ThemeService);

  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  toggleTheme() { this.theme.toggle(); }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    const { email, password } = this.form.value;

    this.auth.login({ email: email!, password: password! }).subscribe({
      next: (res) => {
        // Verify token was saved before navigating
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
          this.router.navigate(['/dashboard']);
        } else {
          // Fallback: save manually and navigate
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/dashboard']);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Credenciales incorrectas. Verifica tu email y contraseña.');
        this.loading.set(false);
      }
    });
  }
}
