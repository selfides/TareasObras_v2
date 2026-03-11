import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProveedorDto, CreateProveedorRequest } from '../models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class ProveedoresService {
  private http = inject(HttpClient);

  getAll()                    { return this.http.get<ProveedorDto[]>(`${API}/proveedores`); }
  create(data: CreateProveedorRequest) { return this.http.post<{id:string}>(`${API}/proveedores`, data); }
  update(id: string, data: any) { return this.http.put(`${API}/proveedores/${id}`, data); }
  delete(id: string)          { return this.http.delete(`${API}/proveedores/${id}`); }
}
