import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DisponibilidadCodigo, ConfiguracionNumeracionDto, UpdateConfiguracionNumeracionRequest } from '../models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class NumeracionService {
  private http = inject(HttpClient);
  private base = `${API}/numeracion`;

  getSiguiente(tipo: 'obra' | 'presupuesto' | 'tarea', ambitoId?: string): Observable<{ codigo: string }> {
    let params = new HttpParams();
    if (ambitoId) params = params.set('ambitoId', ambitoId);
    return this.http.get<{ codigo: string }>(`${this.base}/${tipo}/siguiente`, { params });
  }

  comprobarDisponible(tipo: 'obra' | 'presupuesto' | 'tarea', codigo: string): Observable<DisponibilidadCodigo> {
    const params = new HttpParams().set('codigo', codigo);
    return this.http.get<DisponibilidadCodigo>(`${this.base}/${tipo}/disponible`, { params });
  }

  getConfiguraciones(): Observable<ConfiguracionNumeracionDto[]> {
    return this.http.get<ConfiguracionNumeracionDto[]>(`${this.base}/configuracion`);
  }

  actualizarConfiguracion(tipo: 'obra' | 'presupuesto' | 'tarea', data: UpdateConfiguracionNumeracionRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/configuracion/${tipo}`, data);
  }
}
