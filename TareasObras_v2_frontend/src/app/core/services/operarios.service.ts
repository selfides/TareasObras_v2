import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OperarioDto } from '../models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class OperariosService {
  private http = inject(HttpClient);

  getAll(soloActivos = true)  { return this.http.get<OperarioDto[]>(`${API}/operarios?soloActivos=${soloActivos}`); }
  create(data: any)           { return this.http.post<{id:string}>(`${API}/operarios`, data); }
  update(id: string, data: any) { return this.http.put(`${API}/operarios/${id}`, data); }
  delete(id: string)          { return this.http.delete(`${API}/operarios/${id}`); }
}
