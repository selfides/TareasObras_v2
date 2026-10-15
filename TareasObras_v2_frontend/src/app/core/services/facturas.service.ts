import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FacturaExtraidaDto, ImputarFacturaCommand, ImputarFacturaResultDto } from '../models';

const API = '/api/facturas';

@Injectable({ providedIn: 'root' })
export class FacturasService {
  private http = inject(HttpClient);

  analizar(archivo: File, obraId?: string) {
    const formData = new FormData();
    formData.append('archivo', archivo);

    let params = new HttpParams();
    if (obraId) {
      params = params.set('obraId', obraId);
    }

    return this.http.post<FacturaExtraidaDto>(`${API}/analizar`, formData, { params });
  }

  imputar(command: ImputarFacturaCommand) {
    return this.http.post<ImputarFacturaResultDto>(`${API}/imputar`, command);
  }

  verificarHash(hash: string) {
    return this.http.get<{
      esDuplicado: boolean;
      mensaje?: string;
      materialId?: string;
      obraNombre?: string;
      numeroFactura?: string;
      fecha?: string;
    }>(`${API}/verificar-hash/${hash}`);
  }

  obtenerDocumentoUrl(materialId: string): string {
    return `/api/materialesobra/documento/${materialId}`;
  }

  subirTicketPendiente(archivo: File, obraId: string, comentario?: string, analizarConIa = true) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('obraId', obraId);
    if (comentario) {
      formData.append('comentario', comentario);
    }
    formData.append('analizarConIa', String(analizarConIa));

    return this.http.post<import('../models').TicketPendienteDto>(`${API}/tickets-pendientes`, formData);
  }

  getTicketsPendientes(estado?: string, obraId?: string) {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    if (obraId) params = params.set('obraId', obraId);

    return this.http.get<import('../models').TicketPendienteDto[]>(`${API}/tickets-pendientes`, { params });
  }

  rechazarTicket(id: string, motivo: string) {
    return this.http.post<{ success: boolean }>(`${API}/tickets-pendientes/${id}/rechazar`, { motivo });
  }

  obtenerDocumentoTicketUrl(ticketId: string): string {
    return `/api/facturas/tickets-pendientes/${ticketId}/documento`;
  }
}

