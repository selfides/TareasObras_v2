import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PresupuestoDto, PresupuestoExtraidoDto, ImportarPresupuestoEscaneadoDto } from '../models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class PresupuestosService {
  private http = inject(HttpClient);

  getByObra(obraId: string)   { return this.http.get<PresupuestoDto[]>(`${API}/presupuestos/obra/${obraId}`); }
  getById(id: string)         { return this.http.get<PresupuestoDto>(`${API}/presupuestos/${id}`); }
  create(data: any)           { return this.http.post<{id:string}>(`${API}/presupuestos`, data); }
  update(id: string, data: any) { return this.http.put(`${API}/presupuestos/${id}`, data); }
  aprobar(id: string)         { return this.http.patch(`${API}/presupuestos/${id}/aprobar`, {}); }
  aplicarBeneficioGlobal(id: string, importeBeneficioGlobal: number) {
    return this.http.patch(`${API}/presupuestos/${id}/beneficio-global`, { importeBeneficioGlobal });
  }
  generarTareas(id: string)   { return this.http.post<{tareasGeneradas: number}>(`${API}/presupuestos/${id}/generar-tareas`, {}); }
  delete(id: string)          { return this.http.delete(`${API}/presupuestos/${id}`); }

  analizarDocumento(archivo: File, obraId?: string) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    const params = obraId ? `?obraId=${obraId}` : '';
    return this.http.post<PresupuestoExtraidoDto>(`${API}/presupuestos/analizar-documento${params}`, formData);
  }

  importarEscaneado(data: ImportarPresupuestoEscaneadoDto) {
    return this.http.post<{ id: string; mensaje: string }>(`${API}/presupuestos/importar-escaneado`, data);
  }
}
