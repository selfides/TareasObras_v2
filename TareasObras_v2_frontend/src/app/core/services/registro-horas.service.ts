import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistroHorasDto } from '../models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class RegistroHorasService {
  private http = inject(HttpClient);

  getByObra(obraId: string)   { return this.http.get<RegistroHorasDto[]>(`${API}/registrohoras/obra/${obraId}`); }
  create(data: any)           { return this.http.post<{id:string}>(`${API}/registrohoras`, data); }
  update(id: string, data: any) { return this.http.put(`${API}/registrohoras/${id}`, data); }
  delete(id: string)          { return this.http.delete(`${API}/registrohoras/${id}`); }
}
