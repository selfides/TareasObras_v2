import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest, UsuarioDto } from '../models';

const API = '/api';

export interface UpdateUsuarioRequest {
  nombre: string;
  apellidos: string;
  email: string;
  rol: string;
  activo: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private http = inject(HttpClient);

  getAll() { return this.http.get<UsuarioDto[]>(`${API}/usuarios`); }
  register(data: RegisterRequest) { return this.http.post<any>(`${API}/auth/register`, data); }
  update(id: string, data: UpdateUsuarioRequest) { return this.http.put<any>(`${API}/usuarios/${id}`, data); }
  delete(id: string) { return this.http.delete<any>(`${API}/usuarios/${id}`); }
  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post(`${API}/auth/change-password`, { currentPassword, newPassword });
  }
}
