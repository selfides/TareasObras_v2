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
  templateUrl: './login.component.html'
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
