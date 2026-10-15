import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';

import { FacturasService } from '../../../core/services/facturas.service';
import { ObrasService } from '../../../core/services/obras.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ObraListDto, TicketPendienteDto } from '../../../core/models';
import { OfflineDbService } from '../../../core/services/offline-db.service';
import { OperarioPortalService } from '../../../core/services/operario-portal.service';

@Component({
  selector: 'app-ticket-captura-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    ProgressBarModule
  ],
  template: `
    <p-dialog 
      [visible]="visible()" 
      (visibleChange)="cerrar()"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      styleClass="w-full max-w-lg mx-3 rounded-2xl overflow-hidden shadow-2xl border-0"
      header="Subir Ticket / Compra Rápida">

      <div class="space-y-4 p-1">

        <!-- Selector de Obra -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-600 dark:text-surface-400 mb-1.5">
            Obra Asignada <span class="text-red-500">*</span>
          </label>
          <p-select 
            [options]="obras()" 
            [ngModel]="obraSeleccionadaId()"
            (ngModelChange)="obraSeleccionadaId.set($event)"
            optionLabel="nombre" 
            optionValue="id" 
            placeholder="Selecciona la obra..."
            [filter]="true"
            filterBy="nombre,codigo"
            styleClass="w-full">
            <ng-template #item let-item>
              <div class="flex items-center justify-between w-full">
                <span class="font-medium text-surface-900 dark:text-surface-100">{{ item.nombre }}</span>
                <span class="text-xs px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-600">{{ item.codigo }}</span>
              </div>
            </ng-template>
          </p-select>
        </div>

        <!-- Área de Captura de Foto o Archivo -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-600 dark:text-surface-400 mb-1.5">
            Foto del Ticket / Factura <span class="text-red-500">*</span>
          </label>

          <!-- Input oculto para cámara directa móvil -->
          <input #cameraInput type="file" accept="image/*" capture="environment" class="hidden" (change)="onFileChanged($event)">
          <!-- Input oculto para explorador de archivos / galería -->
          <input #fileInput type="file" accept="image/*,application/pdf" class="hidden" (change)="onFileChanged($event)">

          @if (!archivo()) {
            <div class="grid grid-cols-2 gap-3">
              <!-- Botón Hacer Foto -->
              <button 
                type="button" 
                (click)="cameraInput.click()"
                class="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-950/30 hover:bg-primary-100/60 transition-all text-primary-700 dark:text-primary-300 group cursor-pointer">
                <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <i class="pi pi-camera text-2xl text-primary-600 dark:text-primary-400"></i>
                </div>
                <span class="font-semibold text-sm">Hacer Foto</span>
                <span class="text-xs text-surface-500">Cámara del móvil</span>
              </button>

              <!-- Botón Subir Archivo -->
              <button 
                type="button" 
                (click)="fileInput.click()"
                class="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50 hover:bg-surface-100 transition-all text-surface-700 dark:text-surface-300 group cursor-pointer">
                <div class="w-12 h-12 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <i class="pi pi-upload text-2xl text-surface-600 dark:text-surface-400"></i>
                </div>
                <span class="font-semibold text-sm">Galería / PDF</span>
                <span class="text-xs text-surface-500">Documento guardado</span>
              </button>
            </div>
          } @else {
            <!-- Previsualización del archivo seleccionado -->
            <div class="relative rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 bg-surface-900 flex items-center justify-center min-h-[220px] max-h-[300px]">
              @if (previewUrl()) {
                <img [src]="previewUrl()" alt="Ticket" class="max-h-[300px] w-auto object-contain">
              } @else {
                <div class="flex flex-col items-center p-6 text-white text-center">
                  <i class="pi pi-file-pdf text-5xl text-red-400 mb-2"></i>
                  <span class="font-medium text-sm truncate max-w-xs">{{ archivo()?.name }}</span>
                </div>
              }

              <!-- Botón para cambiar foto -->
              <button 
                type="button" 
                (click)="quitarArchivo()"
                class="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                <i class="pi pi-times text-xs"></i>
              </button>

              <div class="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-sm">
                {{ archivo()?.name }}
              </div>
            </div>
          }
        </div>

        <!-- Comentario u Observaciones -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-600 dark:text-surface-400 mb-1.5">
            Comentario / Concepto (Opcional)
          </label>
          <textarea 
            pTextarea 
            [(ngModel)]="comentario" 
            rows="2" 
            placeholder="Ej. Tornillos y tacos para montaje baño 1..."
            class="w-full text-sm">
          </textarea>
        </div>

        @if (subiendo()) {
          <div class="p-3 bg-primary-50 dark:bg-primary-950/40 rounded-xl space-y-2">
            <div class="flex items-center justify-between text-xs font-medium text-primary-700 dark:text-primary-300">
              <span class="flex items-center gap-2">
                <i class="pi pi-spin pi-spinner"></i>
                Procesando ticket y analizando con IA...
              </span>
            </div>
            <p-progressBar mode="indeterminate" styleClass="h-1.5"></p-progressBar>
          </div>
        }

      </div>

      <ng-template #footer>
        <div class="flex flex-col sm:flex-row items-center justify-end gap-2 w-full pt-3 border-t border-surface-200 dark:border-surface-700">
          <p-button 
            label="Cancelar" 
            severity="secondary" 
            [text]="true" 
            (onClick)="cerrar()" 
            [disabled]="subiendo()">
          </p-button>

          <!-- Modo Express: Enviar para validar en oficina -->
          <p-button 
            label="Enviar a Oficina (Express)" 
            icon="pi pi-send" 
            severity="success" 
            [loading]="subiendo()"
            [disabled]="!archivo() || !obraSeleccionadaId()" 
            (onClick)="enviarExpress()">
          </p-button>

          <!-- Si es Supervisor/Admin, opción de abrir imputación completa -->
          @if (puedeImputarDirecto()) {
            <p-button 
              label="Revisar e Imputar Ahora" 
              icon="pi pi-sparkles" 
              severity="primary" 
              [disabled]="!archivo() || !obraSeleccionadaId() || subiendo()" 
              (onClick)="abrirImputacionCompleta()">
            </p-button>
          }
        </div>
      </ng-template>

    </p-dialog>
  `
})
export class TicketCapturaModalComponent {
  private facturasSvc = inject(FacturasService);
  private obrasSvc = inject(ObrasService);
  private auth = inject(AuthService);
  private msg = inject(MessageService);
  private offlineDb = inject(OfflineDbService);
  private portalSvc = inject(OperarioPortalService);

  visible = input<boolean>(false);
  obraIdDefecto = input<string | undefined>(undefined);
  onVisibleChange = output<boolean>();
  onTicketEnviado = output<TicketPendienteDto>();
  onAbrirAsistenteCompleto = output<{ file: File; obraId: string }>();

  obras = signal<ObraListDto[]>([]);
  obraSeleccionadaId = signal<string | null>(null);
  archivo = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  comentario = signal<string>('');
  subiendo = signal<boolean>(false);

  puedeImputarDirecto = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.cargarObras();
        const rol = this.auth.user()?.rol;
        this.puedeImputarDirecto.set(rol === 'Admin' || rol === 'Supervisor');

        if (this.obraIdDefecto()) {
          this.obraSeleccionadaId.set(this.obraIdDefecto()!);
        }
      } else {
        this.reset();
      }
    });
  }

  cargarObras() {
    this.obrasSvc.getAll().subscribe({
      next: (list) => {
        this.obras.set(list);
        if (!this.obraSeleccionadaId() && list.length > 0) {
          this.obraSeleccionadaId.set(list[0].id);
        }
      }
    });
  }

  onFileChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.archivo.set(file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        this.previewUrl.set(null);
      }
    }
  }

  quitarArchivo() {
    this.archivo.set(null);
    this.previewUrl.set(null);
  }

  enviarExpress() {
    const file = this.archivo();
    const obraId = this.obraSeleccionadaId();
    if (!file || !obraId) return;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.guardarTicketOfflineLocal(file, obraId);
      return;
    }

    this.subiendo.set(true);
    this.facturasSvc.subirTicketPendiente(file, obraId, this.comentario(), true).subscribe({
      next: (ticket) => {
        this.subiendo.set(false);
        this.msg.add({
          severity: 'success',
          summary: '¡Ticket Enviado!',
          detail: 'Se ha registrado en la bandeja de oficina con extracción IA completada.'
        });
        this.onTicketEnviado.emit(ticket);
        this.cerrar();
      },
      error: (err) => {
        this.subiendo.set(false);
        if (err.status === 0 || err.status >= 500) {
          this.guardarTicketOfflineLocal(file, obraId);
        } else {
          this.msg.add({
            severity: 'error',
            summary: 'Error al subir',
            detail: err?.error?.message || 'No se pudo enviar el ticket.'
          });
        }
      }
    });
  }

  private guardarTicketOfflineLocal(file: File, obraId: string) {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        await this.offlineDb.guardarTicketOffline({
          id: `ticket-offline-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          archivoBase64: base64,
          nombreArchivo: file.name,
          obraId: obraId,
          creadoEn: Date.now()
        });
        await this.portalSvc.actualizarContadorPendientes();
        this.portalSvc.vibrar([50, 50, 100]);

        this.msg.add({
          severity: 'warn',
          summary: 'Guardado Offline',
          detail: 'Albarán guardado en el teléfono sin cobertura. Se enviará a la central automáticamente en cuanto recuperes señal.'
        });
        this.onTicketEnviado.emit({
          id: 'offline-temp',
          nombreArchivoOriginal: file.name,
          obraId: obraId,
          obraNombre: 'Obra actual',
          estado: 'Pendiente',
          estadoNombre: 'Pendiente de sincronización',
          createdAt: new Date().toISOString()
        } as any);
        this.cerrar();
      } catch (e) {
        this.msg.add({ severity: 'error', summary: 'Error local', detail: 'No se pudo guardar el archivo en la memoria del dispositivo.' });
      }
    };
    reader.readAsDataURL(file);
  }

  abrirImputacionCompleta() {
    const file = this.archivo();
    const obraId = this.obraSeleccionadaId();
    if (!file || !obraId) return;

    this.onAbrirAsistenteCompleto.emit({ file, obraId });
    this.cerrar();
  }

  cerrar() {
    this.onVisibleChange.emit(false);
  }

  reset() {
    this.archivo.set(null);
    this.previewUrl.set(null);
    this.comentario.set('');
    this.subiendo.set(false);
  }
}
