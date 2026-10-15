import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  OperarioPerfilDto,
  OperarioEstadoHoyDto,
  FicharEntradaRequest,
  FicharSalidaRequest,
  MisHorasResponseDto
} from '../models';
import { OfflineDbService, FichajeOfflineItem, TicketOfflineItem } from './offline-db.service';
import { FacturasService } from './facturas.service';

const API_URL = '/api/operario';

@Injectable({
  providedIn: 'root'
})
export class OperarioPortalService {
  private http = inject(HttpClient);
  private offlineDb = inject(OfflineDbService);
  private facturasSvc = inject(FacturasService);

  // Señales de reactividad en tiempo real
  readonly isOnline = signal<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  readonly fichajesPendientesCount = signal<number>(0);
  readonly sincronizando = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline.set(true);
        this.sincronizarPendientesSiHayRed();
      });
      window.addEventListener('offline', () => {
        this.isOnline.set(false);
      });

      this.actualizarContadorPendientes();

      // Heartbeat de sincronización automática cada 45 segundos si hay red
      setInterval(() => {
        if (this.isOnline() && this.fichajesPendientesCount() > 0 && !this.sincronizando()) {
          this.sincronizarPendientesSiHayRed();
        }
      }, 45000);
    }
  }

  async actualizarContadorPendientes(): Promise<number> {
    try {
      const fichajes = await this.offlineDb.obtenerFichajesPendientes();
      const tickets = await this.offlineDb.obtenerTicketsOfflinePendientes();
      const total = fichajes.length + tickets.length;
      this.fichajesPendientesCount.set(total);
      return total;
    } catch {
      return 0;
    }
  }

  // Feedback háptico en móvil
  vibrar(patron: number | number[] = 40): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(patron);
      } catch {
        // Silencioso si no está permitido
      }
    }
  }

  // Captura de GPS precisa para fichaje en obra
  async obtenerGeolocalizacion(): Promise<{ latitud: number; longitud: number } | null> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return null;
    }
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        pos => {
          resolve({
            latitud: Number(pos.coords.latitude.toFixed(7)),
            longitud: Number(pos.coords.longitude.toFixed(7))
          });
        },
        _err => {
          // Si el usuario deniega o hay timeout de GPS, continuar sin bloquear la jornada
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 30000 }
      );
    });
  }

  getMe(operarioId?: string): Observable<OperarioPerfilDto> {
    const params = operarioId ? `?operarioId=${operarioId}` : '';
    return this.http.get<OperarioPerfilDto>(`${API_URL}/me${params}`).pipe(
      tap(perfil => {
        if (perfil.obrasActivas && perfil.obrasActivas.length > 0) {
          this.offlineDb.actualizarObrasCache(perfil.obrasActivas);
        }
        try {
          localStorage.setItem('perfil_operario_cache', JSON.stringify(perfil));
        } catch {}
      }),
      catchError(() => from(this.recuperarPerfilOffline()))
    );
  }

  getEstadoHoy(operarioId?: string): Observable<OperarioEstadoHoyDto> {
    const params = operarioId ? `?operarioId=${operarioId}` : '';
    return this.http.get<OperarioEstadoHoyDto>(`${API_URL}/estado-hoy${params}`).pipe(
      catchError(() => from(this.recuperarEstadoHoyOffline()))
    );
  }

  ficharEntrada(req: FicharEntradaRequest, operarioId?: string, obraNombre?: string): Observable<any> {
    const params = operarioId ? `?operarioId=${operarioId}` : '';

    if (!this.isOnline()) {
      return from(this.guardarFichajeEntradaOffline(req, obraNombre));
    }

    return this.http.post(`${API_URL}/fichar-entrada${params}`, req).pipe(
      tap(() => this.vibrar([50, 40, 50])),
      catchError(err => {
        // Si hay corte de red durante la llamada, guardar offline
        if (err.status === 0 || err.status >= 500) {
          return from(this.guardarFichajeEntradaOffline(req, obraNombre));
        }
        return throwError(() => err);
      })
    );
  }

  ficharSalida(req: FicharSalidaRequest, operarioId?: string): Observable<any> {
    const params = operarioId ? `?operarioId=${operarioId}` : '';

    if (!this.isOnline()) {
      return from(this.guardarFichajeSalidaOffline(req));
    }

    return this.http.post(`${API_URL}/fichar-salida${params}`, req).pipe(
      tap(() => this.vibrar([80, 50, 80])),
      catchError(err => {
        if (err.status === 0 || err.status >= 500) {
          return from(this.guardarFichajeSalidaOffline(req));
        }
        return throwError(() => err);
      })
    );
  }

  getMisHoras(desde?: string, hasta?: string, operarioId?: string): Observable<MisHorasResponseDto> {
    const query = new URLSearchParams();
    if (desde) query.set('desde', desde);
    if (hasta) query.set('hasta', hasta);
    if (operarioId) query.set('operarioId', operarioId);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.http.get<MisHorasResponseDto>(`${API_URL}/mis-horas${qs}`).pipe(
      catchError(() => of({
        operarioId: operarioId || '',
        desde: desde || '',
        hasta: hasta || '',
        totalHoras: 0,
        diasTrabajados: 0,
        registros: []
      }))
    );
  }

  // Persistencia local en caso de desconexión
  private async guardarFichajeEntradaOffline(req: FicharEntradaRequest, obraNombre?: string): Promise<any> {
    const ahora = new Date();
    const item: FichajeOfflineItem = {
      id: `offline-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      tipo: 'ENTRADA',
      obraId: req.obraId,
      obraNombre: obraNombre || 'Obra actual',
      tareaId: req.tareaId,
      fecha: ahora.toISOString().split('T')[0],
      horaInicio: ahora.toTimeString().substring(0, 8),
      latitudInicio: req.latitud,
      longitudInicio: req.longitud,
      timestampInicio: ahora.toISOString(),
      observaciones: req.observaciones,
      creadoEn: Date.now(),
      intentos: 0
    };

    await this.offlineDb.guardarFichajeOffline(item);
    await this.actualizarContadorPendientes();
    this.vibrar([100, 50, 100]);

    return {
      mensaje: 'Fichaje de entrada guardado en el dispositivo (modo offline). Se sincronizará automáticamente al recuperar cobertura.',
      guardadoOffline: true,
      horaInicio: item.horaInicio.substring(0, 5),
      fecha: item.fecha
    };
  }

  private async guardarFichajeSalidaOffline(req: FicharSalidaRequest): Promise<any> {
    const ahora = new Date();
    const item: FichajeOfflineItem = {
      id: `offline-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      tipo: 'SALIDA',
      serverId: req.registroHorasId,
      obraId: '',
      fecha: ahora.toISOString().split('T')[0],
      horaInicio: '',
      horaFin: ahora.toTimeString().substring(0, 8),
      latitudFin: req.latitud,
      longitudFin: req.longitud,
      timestampInicio: ahora.toISOString(),
      timestampFin: ahora.toISOString(),
      observaciones: req.observacionesAdicionales,
      creadoEn: Date.now(),
      intentos: 0
    };

    await this.offlineDb.guardarFichajeOffline(item);
    await this.actualizarContadorPendientes();
    this.vibrar([150, 50, 150]);

    return {
      mensaje: 'Fichaje de salida guardado en el dispositivo (modo offline). Se calcularán las horas exactas en la central al sincronizar.',
      guardadoOffline: true,
      horaFin: item.horaFin?.substring(0, 5)
    };
  }

  private async recuperarPerfilOffline(): Promise<OperarioPerfilDto> {
    try {
      const cached = localStorage.getItem('perfil_operario_cache');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}

    const obrasLocales = await this.offlineDb.obtenerObrasCache();
    return {
      id: 'local-operario',
      nombre: 'Operario',
      apellidos: 'en Obra',
      nombreCompleto: 'Operario en Obra',
      activo: true,
      categoria: { id: '', nombre: 'Montador', costeHoraBase: 0 },
      obrasActivas: obrasLocales.map(o => ({
        id: o.id,
        codigo: o.codigo,
        nombre: o.nombre,
        direccion: o.direccion,
        cliente: o.cliente,
        estado: o.estado || 'EnCurso'
      }))
    };
  }

  private async recuperarEstadoHoyOffline(): Promise<OperarioEstadoHoyDto> {
    const hoy = new Date().toISOString().split('T')[0];
    const pendientes = await this.offlineDb.obtenerFichajesPendientes();
    const entradas = pendientes.filter(p => p.tipo === 'ENTRADA');
    const salidas = pendientes.filter(p => p.tipo === 'SALIDA');

    // Si hay una entrada offline sin salida offline
    const tieneEntradaActiva = entradas.length > salidas.length;
    const ultimaEntrada = entradas[entradas.length - 1];

    return {
      operarioId: '',
      fecha: hoy,
      hayFichajeActivo: tieneEntradaActiva,
      fichajeActivo: tieneEntradaActiva && ultimaEntrada ? {
        id: ultimaEntrada.id,
        obraId: ultimaEntrada.obraId,
        obraNombre: ultimaEntrada.obraNombre || 'Obra offline',
        obraCodigo: '',
        fecha: ultimaEntrada.fecha,
        horaInicio: ultimaEntrada.horaInicio.substring(0, 5),
        minutosTranscurridos: 0,
        latitudInicio: ultimaEntrada.latitudInicio,
        longitudInicio: ultimaEntrada.longitudInicio,
        observaciones: ultimaEntrada.observaciones
      } : null,
      totalHorasHoy: 0,
      registros: []
    };
  }

  async sincronizarPendientesSiHayRed(): Promise<void> {
    if (!this.isOnline() || this.sincronizando()) return;

    const pendientes = await this.offlineDb.obtenerFichajesPendientes();
    const ticketsOffline = await this.offlineDb.obtenerTicketsOfflinePendientes();

    if (pendientes.length === 0 && ticketsOffline.length === 0) return;

    this.sincronizando.set(true);

    try {
      // 1. Sincronizar Fichajes
      if (pendientes.length > 0) {
        const itemsPayload = pendientes.map(p => ({
          localId: p.id,
          tipo: p.tipo,
          serverId: p.serverId,
          obraId: p.obraId,
          tareaId: p.tareaId,
          fecha: p.fecha,
          horaInicio: p.horaInicio,
          horaFin: p.horaFin,
          latitudInicio: p.latitudInicio,
          longitudInicio: p.longitudInicio,
          latitudFin: p.latitudFin,
          longitudFin: p.longitudFin,
          timestampInicio: p.timestampInicio,
          timestampFin: p.timestampFin,
          observaciones: p.observaciones
        }));

        const res = await this.http.post<any>(`${API_URL}/sincronizar-batch`, { items: itemsPayload }).toPromise();
        if (res && res.resultados) {
          for (const r of res.resultados) {
            if (r.success) {
              await this.offlineDb.eliminarFichajeOffline(r.localId);
            }
          }
        }
      }

      // 2. Sincronizar Tickets y Albaranes Offline
      if (ticketsOffline.length > 0) {
        for (const t of ticketsOffline) {
          try {
            const file = this.base64ToFile(t.archivoBase64, t.nombreArchivo);
            await this.facturasSvc.subirTicketPendiente(file, t.obraId, 'Sincronizado offline desde el móvil', true).toPromise();
            await this.offlineDb.eliminarTicketOffline(t.id);
          } catch (err) {
            console.error('Error sincronizando ticket offline', err);
          }
        }
      }

      await this.actualizarContadorPendientes();
    } catch {
      // Reintentará en el próximo ciclo
    } finally {
      this.sincronizando.set(false);
    }
  }

  private base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1] || arr[0]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
