import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest, UsuarioDto } from '../models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private http = inject(HttpClient);

  getAll() { return this.http.get<UsuarioDto[]>(`${API}/usuarios`); }
  register(data: RegisterRequest) { return this.http.post<any>(`${API}/auth/register`, data); }
  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post(`${API}/auth/change-password`, { currentPassword, newPassword });
  }
}
