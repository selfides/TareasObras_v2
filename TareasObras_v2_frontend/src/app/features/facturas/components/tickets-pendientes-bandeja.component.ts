import { Component, inject, OnInit, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';

import { FacturasService } from '../../../core/services/facturas.service';
import { ObrasService } from '../../../core/services/obras.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ObraListDto, TicketPendienteDto } from '../../../core/models';

@Component({
  selector: 'app-tickets-pendientes-bandeja',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    SelectModule,
    DialogModule,
    TextareaModule
  ],
  template: `
    <div class="space-y-4">

      <!-- Barra de Filtros y Acciones -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <i class="pi pi-inbox text-xl"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              Bandeja de Tickets Móviles
              @if (contadorPendientes() > 0) {
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                  {{ contadorPendientes() }} pendientes
                </span>
              }
            </h3>
            <p class="text-xs text-surface-500">Tickets de caja y albaranes subidos por operarios desde el móvil para revisión y contabilización.</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Filtro Estado -->
          <p-select 
            [options]="estadosOpciones" 
            [(ngModel)]="filtroEstado" 
            (onChange)="cargarTickets()"
            optionLabel="label" 
            optionValue="value"
            placeholder="Estado"
            styleClass="w-36 text-xs">
          </p-select>

          <!-- Filtro Obra -->
          <p-select 
            [options]="obrasOpciones()" 
            [(ngModel)]="filtroObraId" 
            (onChange)="cargarTickets()"
            optionLabel="nombre" 
            optionValue="id"
            placeholder="Todas las obras"
            [filter]="true"
            styleClass="w-48 text-xs">
          </p-select>

          <p-button 
            icon="pi pi-refresh" 
            [text]="true" 
            severity="secondary" 
            [loading]="cargando()" 
            (onClick)="cargarTickets()" 
            pTooltip="Actualizar bandeja" 
            tooltipPosition="bottom">
          </p-button>
        </div>
      </div>

      <!-- Tabla de Tickets -->
      <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden">
        <p-table 
          [value]="tickets()" 
          [loading]="cargando()" 
          [paginator]="true" 
          [rows]="10"
          [rowsPerPageOptions]="[10, 25, 50]"
          styleClass="p-datatable-sm"
          responsiveLayout="stack">

          <ng-template #header>
            <tr class="text-xs font-semibold uppercase tracking-wider text-surface-500 bg-surface-50 dark:bg-surface-800/50">
              <th class="w-20">Doc</th>
              <th>Fecha / Operario</th>
              <th>Obra</th>
              <th>Datos Extraídos (IA)</th>
              <th>Comentario</th>
              <th>Total Est.</th>
              <th>Estado</th>
              <th class="text-right w-44">Acciones</th>
            </tr>
          </ng-template>

          <ng-template #body let-t>
            <tr class="hover:bg-surface-50/60 dark:hover:bg-surface-800/30 transition-colors text-sm">

              <!-- Miniatura / Documento -->
              <td>
                <div 
                  (click)="abrirDocumento(t)" 
                  class="w-12 h-12 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden bg-surface-100 dark:bg-surface-800 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                  @if (esImagen(t)) {
                    <img [src]="getDocUrl(t)" alt="Ticket" class="w-full h-full object-cover">
                  } @else {
                    <i class="pi pi-file-pdf text-xl text-red-500"></i>
                  }
                </div>
              </td>

              <!-- Fecha y Operario -->
              <td>
                <div class="font-medium text-surface-900 dark:text-surface-100">
                  {{ t.fechaSubida | date:'dd/MM/yyyy HH:mm' }}
                </div>
                <div class="text-xs text-surface-500 flex items-center gap-1 mt-0.5">
                  <i class="pi pi-user text-xs"></i>
                  {{ t.usuarioNombre || 'Operario' }}
                </div>
              </td>

              <!-- Obra -->
              <td>
                <div class="font-medium text-surface-900 dark:text-surface-100">
                  {{ t.obraNombre }}
                </div>
                <span class="text-xs px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-600 font-mono">
                  {{ t.obraCodigo }}
                </span>
              </td>

              <!-- Datos extraídos por IA -->
              <td>
                <div class="space-y-0.5">
                  <div class="font-semibold text-surface-800 dark:text-surface-200 text-xs">
                    {{ t.proveedorSugerido || 'Proveedor no identificado' }}
                  </div>
                  @if (t.cifSugerido) {
                    <div class="text-xs text-surface-500">CIF: {{ t.cifSugerido }}</div>
                  }
                  @if (t.numeroFacturaSugerido) {
                    <div class="text-xs text-surface-500 font-mono">Nº: {{ t.numeroFacturaSugerido }}</div>
                  }
                </div>
              </td>

              <!-- Comentario del operario -->
              <td class="max-w-xs">
                @if (t.comentarioOperario) {
                  <span class="text-xs text-surface-700 dark:text-surface-300 italic">
                    "{{ t.comentarioOperario }}"
                  </span>
                } @else {
                  <span class="text-xs text-surface-400">-</span>
                }
              </td>

              <!-- Total Estimado -->
              <td>
                @if (t.totalEstimado != null) {
                  <span class="font-bold text-sm text-surface-900 dark:text-surface-100">
                    {{ t.totalEstimado | number:'1.2-2' }} €
                  </span>
                } @else {
                  <span class="text-xs text-surface-400">Por determinar</span>
                }
              </td>

              <!-- Estado -->
              <td>
                @switch (t.estado) {
                  @case ('Pendiente') {
                    <p-tag severity="warn" value="Pendiente" icon="pi pi-clock"></p-tag>
                  }
                  @case ('Aprobado') {
                    <p-tag severity="success" value="Imputado" icon="pi pi-check"></p-tag>
                  }
                  @case ('Rechazado') {
                    <p-tag severity="danger" value="Rechazado" icon="pi pi-times" [pTooltip]="t.motivoRechazo || ''"></p-tag>
                  }
                }
              </td>

              <!-- Acciones -->
              <td class="text-right">
                <div class="flex items-center justify-end gap-1">
                  @if (t.estado === 'Pendiente' && esGestor()) {
                    <!-- Botón Revisar e Imputar -->
                    <p-button 
                      label="Revisar" 
                      icon="pi pi-sparkles" 
                      size="small" 
                      severity="primary" 
                      (onClick)="revisarTicket.emit(t)" 
                      pTooltip="Revisar líneas con IA e imputar" 
                      tooltipPosition="left">
                    </p-button>

                    <!-- Botón Rechazar -->
                    <p-button 
                      icon="pi pi-times" 
                      size="small" 
                      severity="danger" 
                      [text]="true" 
                      (onClick)="iniciarRechazo(t)" 
                      pTooltip="Rechazar ticket" 
                      tooltipPosition="top">
                    </p-button>
                  }

                  <!-- Botón Ver Justificante -->
                  <p-button 
                    icon="pi pi-eye" 
                    size="small" 
                    severity="secondary" 
                    [text]="true" 
                    (onClick)="abrirDocumento(t)" 
                    pTooltip="Ver documento original" 
                    tooltipPosition="top">
                  </p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template #emptymessage>
            <tr>
              <td colspan="8" class="text-center py-10 text-surface-500">
                <i class="pi pi-check-circle text-3xl text-green-500 mb-2 block"></i>
                <span class="font-medium text-sm">No hay tickets pendientes que coincidan con el filtro.</span>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

    </div>

    <!-- Modal Rechazar Ticket -->
    <p-dialog 
      header="Rechazar Ticket" 
      [(visible)]="modalRechazoVisible" 
      [modal]="true" 
      [style]="{ width: '420px' }">
      <div class="space-y-3 p-1">
        <p class="text-sm text-surface-600 dark:text-surface-300">
          Indica el motivo por el cual rechazas este justificante para informar al operario:
        </p>
        <textarea 
          pTextarea 
          [(ngModel)]="motivoRechazo" 
          rows="3" 
          placeholder="Ej. Ticket ilegible / borroso, gasto no autorizado, etc."
          class="w-full text-sm">
        </textarea>
      </div>
      <ng-template #footer>
        <div class="flex items-center justify-end gap-2 pt-2">
          <p-button label="Cancelar" [text]="true" severity="secondary" (onClick)="modalRechazoVisible = false"></p-button>
          <p-button 
            label="Confirmar Rechazo" 
            severity="danger" 
            [loading]="guardandoRechazo()" 
            [disabled]="!motivoRechazo.trim()" 
            (onClick)="confirmarRechazo()">
          </p-button>
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class TicketsPendientesBandejaComponent implements OnInit {
  private facturasSvc = inject(FacturasService);
  private obrasSvc = inject(ObrasService);
  private auth = inject(AuthService);
  private msg = inject(MessageService);

  revisarTicket = output<TicketPendienteDto>();
  onContadorCambiado = output<number>();

  tickets = signal<TicketPendienteDto[]>([]);
  obras = signal<ObraListDto[]>([]);
  cargando = signal<boolean>(false);

  filtroEstado = 'Pendiente';
  filtroObraId: string | null = null;

  estadosOpciones = [
    { label: 'Pendientes', value: 'Pendiente' },
    { label: 'Aprobados', value: 'Aprobado' },
    { label: 'Rechazados', value: 'Rechazado' },
    { label: 'Todos', value: '' }
  ];

  obrasOpciones = computed(() => {
    return [{ id: null, nombre: 'Todas las obras' }, ...this.obras().map(o => ({ id: o.id, nombre: `${o.codigo} - ${o.nombre}` }))];
  });

  contadorPendientes = computed(() => {
    return this.tickets().filter(t => t.estado === 'Pendiente').length;
  });

  // Modal Rechazo
  modalRechazoVisible = false;
  ticketARechazar: TicketPendienteDto | null = null;
  motivoRechazo = '';
  guardandoRechazo = signal<boolean>(false);

  ngOnInit() {
    this.cargarObras();
    this.cargarTickets();
  }

  cargarObras() {
    this.obrasSvc.getAll().subscribe({
      next: (list) => this.obras.set(list)
    });
  }

  cargarTickets() {
    this.cargando.set(true);
    const estado = this.filtroEstado ? this.filtroEstado : undefined;
    const obraId = this.filtroObraId ? this.filtroObraId : undefined;

    this.facturasSvc.getTicketsPendientes(estado, obraId).subscribe({
      next: (data) => {
        this.tickets.set(data);
        this.cargando.set(false);
        const count = data.filter(t => t.estado === 'Pendiente').length;
        this.onContadorCambiado.emit(count);
      },
      error: () => {
        this.cargando.set(false);
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tickets.' });
      }
    });
  }

  esGestor(): boolean {
    const rol = this.auth.user()?.rol;
    return rol === 'Admin' || rol === 'Supervisor';
  }

  esImagen(t: TicketPendienteDto): boolean {
    return t.contentType ? t.contentType.startsWith('image/') : !t.documentoUrl.endsWith('.pdf');
  }

  getDocUrl(t: TicketPendienteDto): string {
    return this.facturasSvc.obtenerDocumentoTicketUrl(t.id);
  }

  abrirDocumento(t: TicketPendienteDto) {
    window.open(this.getDocUrl(t), '_blank');
  }

  iniciarRechazo(t: TicketPendienteDto) {
    this.ticketARechazar = t;
    this.motivoRechazo = '';
    this.modalRechazoVisible = true;
  }

  confirmarRechazo() {
    if (!this.ticketARechazar || !this.motivoRechazo.trim()) return;

    this.guardandoRechazo.set(true);
    this.facturasSvc.rechazarTicket(this.ticketARechazar.id, this.motivoRechazo.trim()).subscribe({
      next: () => {
        this.guardandoRechazo.set(false);
        this.modalRechazoVisible = false;
        this.msg.add({ severity: 'info', summary: 'Ticket Rechazado', detail: 'Se ha registrado el rechazo del ticket.' });
        this.cargarTickets();
      },
      error: () => {
        this.guardandoRechazo.set(false);
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo rechazar el ticket.' });
      }
    });
  }
}
