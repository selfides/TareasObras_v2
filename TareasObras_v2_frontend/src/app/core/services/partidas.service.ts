import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = '/api';

export interface LineaPartidaDto {
  id: string;
  tipo: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
  categoriaOperarioId?: string;
  categoriaNombre?: string;
}

export interface PartidaDto {
  id: string;
  presupuestoId: string;
  nombre: string;
  descripcion?: string;
  orden: number;
  totalMaterial: number;
  totalManoObra: number;
  total: number;
  lineas: LineaPartidaDto[];
}

@Injectable({ providedIn: 'root' })
export class PartidasService {
  private http = inject(HttpClient);

  getByPresupuesto(presupuestoId: string) {
    return this.http.get<PartidaDto[]>(`${API}/partidas/presupuesto/${presupuestoId}`);
  }
  create(data: { presupuestoId: string; nombre: string; descripcion?: string; orden: number }) {
    return this.http.post<{ id: string }>(`${API}/partidas`, data);
  }
  update(id: string, data: { nombre: string; descripcion?: string; orden: number }) {
    return this.http.put(`${API}/partidas/${id}`, data);
  }
  delete(id: string) { return this.http.delete(`${API}/partidas/${id}`); }

  addLineaMaterial(partidaId: string, data: { descripcion: string; unidad: string; cantidad: number; precioUnitario: number }) {
    return this.http.post<{ id: string }>(`${API}/partidas/${partidaId}/lineas/material`, data);
  }
  addLineaManoObra(partidaId: string, data: { categoriaOperarioId: string; descripcion: string; unidad: string; cantidad: number; precioUnitario: number }) {
    return this.http.post<{ id: string }>(`${API}/partidas/${partidaId}/lineas/manoobra`, data);
  }
  updateLinea(id: string, data: any) { return this.http.put(`${API}/partidas/lineas/${id}`, data); }
  deleteLinea(id: string) { return this.http.delete(`${API}/partidas/lineas/${id}`); }
}
