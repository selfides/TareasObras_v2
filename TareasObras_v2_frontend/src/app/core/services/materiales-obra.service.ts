import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaterialObraDto } from '../models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class MaterialesObraService {
  private http = inject(HttpClient);

  getByObra(obraId: string)   { return this.http.get<MaterialObraDto[]>(`${API}/materialesobra/obra/${obraId}`); }
  create(data: any)           { return this.http.post<{id:string}>(`${API}/materialesobra`, data); }
  update(id: string, data: any) { return this.http.put(`${API}/materialesobra/${id}`, data); }
  delete(id: string)          { return this.http.delete(`${API}/materialesobra/${id}`); }
}
