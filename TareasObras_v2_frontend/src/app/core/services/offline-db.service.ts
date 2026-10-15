import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

export interface FichajeOfflineItem {
  id: string; // ID local único (e.g. uuidv4 o timestamp)
  tipo: 'ENTRADA' | 'SALIDA' | 'COMPLETO';
  serverId?: string;
  obraId: string;
  obraNombre?: string;
  tareaId?: string;
  tareaTitulo?: string;
  fecha: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm:ss
  horaFin?: string;
  latitudInicio?: number;
  longitudInicio?: number;
  latitudFin?: number;
  longitudFin?: number;
  timestampInicio: string;
  timestampFin?: string;
  observaciones?: string;
  creadoEn: number;
  intentos: number;
  ultimoError?: string;
}

export interface TicketOfflineItem {
  id: string;
  archivoBase64: string;
  nombreArchivo: string;
  obraId: string;
  proveedor?: string;
  numeroFactura?: string;
  total?: number;
  fecha?: string;
  creadoEn: number;
}

export interface ObraCacheItem {
  id: string;
  codigo: string;
  nombre: string;
  direccion?: string;
  cliente?: string;
  estado?: string;
  actualizadoEn: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineDbService extends Dexie {
  fichajes!: Table<FichajeOfflineItem, string>;
  ticketsOffline!: Table<TicketOfflineItem, string>;
  obrasCache!: Table<ObraCacheItem, string>;

  constructor() {
    super('TareasObrasPwaDB');
    this.version(1).stores({
      fichajes: 'id, tipo, obraId, creadoEn',
      ticketsOffline: 'id, obraId, creadoEn',
      obrasCache: 'id, codigo, nombre'
    });
  }

  // Helper methods
  async guardarFichajeOffline(item: FichajeOfflineItem): Promise<void> {
    await this.fichajes.put(item);
  }

  async obtenerFichajesPendientes(): Promise<FichajeOfflineItem[]> {
    return await this.fichajes.orderBy('creadoEn').toArray();
  }

  async eliminarFichajeOffline(id: string): Promise<void> {
    await this.fichajes.delete(id);
  }

  async guardarTicketOffline(item: TicketOfflineItem): Promise<void> {
    await this.ticketsOffline.put(item);
  }

  async obtenerTicketsOfflinePendientes(): Promise<TicketOfflineItem[]> {
    return await this.ticketsOffline.orderBy('creadoEn').toArray();
  }

  async eliminarTicketOffline(id: string): Promise<void> {
    await this.ticketsOffline.delete(id);
  }

  async actualizarObrasCache(obras: Array<{ id: string; codigo: string; nombre: string; direccion?: string; cliente?: string; estado?: string }>): Promise<void> {
    const items: ObraCacheItem[] = obras.map(o => ({
      ...o,
      actualizadoEn: Date.now()
    }));
    await this.obrasCache.bulkPut(items);
  }

  async obtenerObrasCache(): Promise<ObraCacheItem[]> {
    return await this.obrasCache.toArray();
  }
}
