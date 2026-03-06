import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PresupuestoDto } from '../models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class PresupuestosService {
  private http = inject(HttpClient);

  getByObra(obraId: string)   { return this.http.get<PresupuestoDto[]>(`${API}/presupuestos/obra/${obraId}`); }
  getById(id: string)         { return this.http.get<PresupuestoDto>(`${API}/presupuestos/${id}`); }
  create(data: any)           { return this.http.post<{id:string}>(`${API}/presupuestos`, data); }
  aprobar(id: string)         { return this.http.patch(`${API}/presupuestos/${id}/aprobar`, {}); }
  delete(id: string)          { return this.http.delete(`${API}/presupuestos/${id}`); }
}
