import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ObraListDto, ObraDetailDto, CreateObraRequest, UpdateObraRequest } from '../models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class ObrasService {
  private http = inject(HttpClient);
  private base = `${API}/obras`;

  getAll(search?: string, estado?: string) {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (estado) params = params.set('estado', estado);
    return this.http.get<ObraListDto[]>(this.base, { params });
  }
  getById(id: string) { return this.http.get<ObraDetailDto>(`${this.base}/${id}`); }
  create(data: CreateObraRequest) { return this.http.post<{ id: string }>(this.base, data); }
  update(id: string, data: UpdateObraRequest) { return this.http.put(`${this.base}/${id}`, data); }
  cambiarEstado(id: string, nuevoEstado: number) { return this.http.patch(`${this.base}/${id}/estado`, { nuevoEstado }); }
  delete(id: string) { return this.http.delete(`${this.base}/${id}`); }
}
