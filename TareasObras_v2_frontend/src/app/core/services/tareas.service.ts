import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TareaDto, CreateTareaRequest, UpdateTareaRequest, CambiarEstadoRequest, CambiarPrioridadRequest } from '../models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class TareasService {
  private http = inject(HttpClient);
  private base = `${API}/tareas`;

  getAll(fecha?: string) {
    let params = new HttpParams();
    if (fecha) params = params.set('fecha', fecha);
    return this.http.get<any[]>(this.base, { params });
  }
  getByObra(obraId: string) { return this.http.get<TareaDto[]>(`${this.base}/obra/${obraId}`); }
  getMisTareas() { return this.http.get<TareaDto[]>(`${this.base}/mis-tareas`); }
  getById(id: string) { return this.http.get<TareaDto>(`${this.base}/${id}`); }
  create(data: CreateTareaRequest) { return this.http.post<{ id: string }>(this.base, data); }
  update(id: string, data: UpdateTareaRequest) { return this.http.put(`${this.base}/${id}`, data); }
  cambiarEstado(id: string, data: CambiarEstadoRequest) { return this.http.patch(`${this.base}/${id}/estado`, data); }
  cambiarPrioridad(id: string, data: CambiarPrioridadRequest) { return this.http.patch(`${this.base}/${id}/prioridad`, data); }
  delete(id: string) { return this.http.delete(`${this.base}/${id}`); }
}
