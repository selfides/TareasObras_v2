import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest, UserDto } from '../models';

const API_URL = '/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _user = signal<UserDto | null>(this.loadUser());
  private _token = signal<string | null>(localStorage.getItem('token'));

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());
  readonly isAdmin = computed(() => this._user()?.rol === 'Admin');
  readonly isSupervisor = computed(() => this._user()?.rol === 'Supervisor' || this.isAdmin());
  readonly currentRole = computed(() => this._user()?.rol ?? '');

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, request).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this._token.set(res.token);
        this._user.set(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/auth/login']);
  }

  register(request: RegisterRequest) {
    return this.http.post<any>(`${API_URL}/auth/register`, request);
  }

  private loadUser(): UserDto | null {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  }
}
