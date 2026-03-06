import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoriaOperarioDto } from '../models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class CategoriasOperarioService {
  private http = inject(HttpClient);

  getAll()                    { return this.http.get<CategoriaOperarioDto[]>(`${API}/categoriasoperario`); }
  create(data: {nombre: string, costeHoraBase: number}) { return this.http.post<{id:string}>(`${API}/categoriasoperario`, data); }
  update(id: string, data: {nombre: string, costeHoraBase: number}) { return this.http.put(`${API}/categoriasoperario/${id}`, data); }
  delete(id: string)          { return this.http.delete(`${API}/categoriasoperario/${id}`); }
}
