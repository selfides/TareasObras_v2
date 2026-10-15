import { Component, inject, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageService } from 'primeng/api';

import { FacturasService } from '../../../core/services/facturas.service';
import { ObrasService } from '../../../core/services/obras.service';
import { ProveedoresService } from '../../../core/services/proveedores.service';
import { PresupuestosService } from '../../../core/services/presupuestos.service';
import { PartidasService } from '../../../core/services/partidas.service';
import { 
  FacturaExtraidaDto, 
  ImputarFacturaCommand, 
  ImputarFacturaResultDto, 
  ObraListDto, 
  ProveedorDto,
  TicketPendienteDto
} from '../../../core/models';


export interface LineaEditable {
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
  lineaPartidaId?: string;
  observaciones?: string;
}

export interface LineaPartidaOpcion {
  id: string;
  label: string;
  partidaNombre: string;
}

@Component({
  selector: 'app-factura-imputar-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    TagModule,
    TooltipModule,
    ProgressBarModule,
    ToggleSwitchModule
  ],
  templateUrl: './factura-imputar-dialog.component.html',
  styleUrls: ['./factura-imputar-dialog.component.css']
})
export class FacturaImputarDialogComponent {
  private facturasSvc = inject(FacturasService);
  private obrasSvc = inject(ObrasService);
  private proveedoresSvc = inject(ProveedoresService);
  private presupuestosSvc = inject(PresupuestosService);
  private partidasSvc = inject(PartidasService);
  private msg = inject(MessageService);
  private sanitizer = inject(DomSanitizer);

  // Inputs & Outputs
  visible = input<boolean>(false);
  obraIdContexto = input<string | undefined>(undefined);
  ticketPendiente = input<TicketPendienteDto | null>(null);
  onVisibleChange = output<boolean>();
  onFacturaImputada = output<ImputarFacturaResultDto>();


  // Estados del asistente
  paso = signal<'subida' | 'analizando' | 'revision'>('subida');
  archivoSeleccionado = signal<File | null>(null);
  esPdf = signal<boolean>(false);
  documentoUrlSegura = signal<SafeResourceUrl | null>(null);
  documentoBlobUrl = signal<string | null>(null);
  isDragOver = signal<boolean>(false);

  // Visor de imagen (rotación y zoom)
  rotacion = signal<number>(0);
  zoom = signal<number>(1);

  // Catálogos
  obras = signal<ObraListDto[]>([]);
  proveedores = signal<ProveedorDto[]>([]);
  lineasPartidasDisponibles = signal<LineaPartidaOpcion[]>([]);

  // Datos extraídos y editables
  datosExtraidos = signal<FacturaExtraidaDto | null>(null);
  obraSeleccionadaId = signal<string | null>(null);
  proveedorSeleccionadoId = signal<string | null>(null);
  proveedorNombreInput = signal<string>('');
  proveedorCifInput = signal<string>('');
  crearProveedorAuto = signal<boolean>(true);
  numeroFactura = signal<string>('');
  numeroAlbaran = signal<string>('');
  fechaEmision = signal<Date>(new Date());
  porcentajeIva = signal<number>(21);
  observaciones = signal<string>('');
  lineas = signal<LineaEditable[]>([]);

  // Estado de carga
  guardando = signal<boolean>(false);

  // Cálculos reactivos
  totalBaseImponible = computed(() => {
    return this.lineas().reduce((acc, l) => acc + (l.cantidad * l.precioUnitario), 0);
  });

  cuotaIvaCalculada = computed(() => {
    const base = this.totalBaseImponible();
    const pct = this.porcentajeIva() || 0;
    return Math.round((base * pct / 100) * 100) / 100;
  });

  totalFacturaCalculado = computed(() => {
    return this.totalBaseImponible() + this.cuotaIvaCalculada();
  });

  diferenciaConTicket = computed(() => {
    const extraido = this.datosExtraidos();
    if (!extraido || !extraido.importeTotal) return 0;
    return Math.abs(this.totalFacturaCalculado() - extraido.importeTotal);
  });

  constructor() {
    // Al abrir el diálogo, cargar catálogos y resetear si procede
    effect(() => {
      if (this.visible()) {
        this.cargarCatalogos();
        if (this.ticketPendiente()) {
          this.cargarTicketPendiente(this.ticketPendiente()!);
        } else if (this.obraIdContexto()) {
          this.obraSeleccionadaId.set(this.obraIdContexto()!);
          this.cargarPartidasDeObra(this.obraIdContexto()!);
        }
      } else {
        this.resetDialog();
      }
    });
  }

  cargarTicketPendiente(t: TicketPendienteDto) {
    this.obraSeleccionadaId.set(t.obraId);
    this.cargarPartidasDeObra(t.obraId);

    const url = this.facturasSvc.obtenerDocumentoTicketUrl(t.id);
    this.documentoBlobUrl.set(url);
    const esPdf = t.contentType?.includes('pdf') || t.documentoUrl?.endsWith('.pdf');
    this.esPdf.set(esPdf);
    this.documentoUrlSegura.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));

    if (t.comentarioOperario) {
      this.observaciones.set(t.comentarioOperario);
    }

    if (t.datosExtraidosJson) {
      try {
        const extraido: FacturaExtraidaDto = JSON.parse(t.datosExtraidosJson);
        this.datosExtraidos.set(extraido);
        this.mapearDatosExtraidos(extraido);
      } catch (e) {
        console.error('Error parseando datos de ticket', e);
      }
    } else {
      if (t.proveedorSugerido) this.proveedorNombreInput.set(t.proveedorSugerido);
      if (t.cifSugerido) this.proveedorCifInput.set(t.cifSugerido);
      if (t.numeroFacturaSugerido) this.numeroFactura.set(t.numeroFacturaSugerido);
      if (t.totalEstimado) {
        this.lineas.set([{
          descripcion: t.comentarioOperario || 'Ticket de gasto',
          unidad: 'ud',
          cantidad: 1,
          precioUnitario: t.totalEstimado,
          importe: t.totalEstimado
        }]);

      }
    }
    this.paso.set('revision');
  }


  cargarCatalogos() {
    this.obrasSvc.getAll().subscribe({
      next: (data) => this.obras.set(data),
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las obras.' })
    });

    this.proveedoresSvc.getAll().subscribe({
      next: (data) => this.proveedores.set(data),
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los proveedores.' })
    });
  }

  onObraChanged(nuevaObraId: string | null) {
    this.obraSeleccionadaId.set(nuevaObraId);
    if (nuevaObraId) {
      this.cargarPartidasDeObra(nuevaObraId);
    } else {
      this.lineasPartidasDisponibles.set([]);
    }
  }

  cargarPartidasDeObra(obraId: string) {
    this.presupuestosSvc.getByObra(obraId).subscribe({
      next: (pptos) => {
        const presActivo = pptos.find(p => p.esAprobado) || pptos[0];
        if (presActivo) {
          this.partidasSvc.getByPresupuesto(presActivo.id).subscribe({
            next: (partidas) => {
              const opciones: LineaPartidaOpcion[] = [];
              for (const part of partidas) {
                if (part.lineas) {
                  for (const lin of part.lineas.filter(l => l.tipo === 'Material')) {
                    opciones.push({
                      id: lin.id,
                      label: `${part.nombre} → ${lin.descripcion}`,
                      partidaNombre: part.nombre
                    });
                  }
                }
              }
              this.lineasPartidasDisponibles.set(opciones);
            }
          });
        } else {
          this.lineasPartidasDisponibles.set([]);
        }
      }
    });
  }

  // Gestión de subida de archivo
  onFileDropped(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.procesarArchivo(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.procesarArchivo(input.files[0]);
    }
  }

  procesarArchivo(file: File) {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const validas = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
    if (!validas.includes(ext)) {
      this.msg.add({
        severity: 'warn',
        summary: 'Formato no soportado',
        detail: 'Por favor sube un PDF o una foto de ticket (.jpg, .png, .webp)'
      });
      return;
    }

    this.archivoSeleccionado.set(file);
    const esPdfDoc = ext === '.pdf';
    this.esPdf.set(esPdfDoc);

    // Crear URL blob local para visor inmediato
    if (this.documentoBlobUrl()) {
      URL.revokeObjectURL(this.documentoBlobUrl()!);
    }
    const blobUrl = URL.createObjectURL(file);
    this.documentoBlobUrl.set(blobUrl);
    this.documentoUrlSegura.set(this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));

    // Iniciar análisis IA
    this.analizarConIa(file);
  }

  analizarConIa(file: File) {
    this.paso.set('analizando');
    const obraId = this.obraSeleccionadaId() || this.obraIdContexto();

    this.facturasSvc.analizar(file, obraId).subscribe({
      next: (res) => {
        this.datosExtraidos.set(res);
        this.mapearDatosExtraidos(res);
        this.paso.set('revision');
        this.msg.add({
          severity: 'success',
          summary: 'Análisis completado',
          detail: `Extracción exitosa (${res.lineas.length} líneas detectadas)`
        });
      },
      error: (err) => {
        this.paso.set('subida');
        this.msg.add({
          severity: 'error',
          summary: 'Error en análisis',
          detail: err?.error?.message || 'No se pudo procesar el documento con IA.'
        });
      }
    });
  }

  mapearDatosExtraidos(dto: FacturaExtraidaDto) {
    if (dto.obraIdSugerida && !this.obraSeleccionadaId()) {
      this.obraSeleccionadaId.set(dto.obraIdSugerida);
      this.cargarPartidasDeObra(dto.obraIdSugerida);
    }

    this.proveedorSeleccionadoId.set(dto.proveedorIdSugerido || null);
    this.proveedorNombreInput.set(dto.proveedorNombre || '');
    this.proveedorCifInput.set(dto.proveedorCif || '');
    this.crearProveedorAuto.set(!dto.proveedorIdSugerido && !!dto.proveedorNombre);
    this.numeroFactura.set(dto.numeroFactura || '');
    this.numeroAlbaran.set(dto.numeroAlbaran || '');
    this.fechaEmision.set(dto.fechaEmision ? new Date(dto.fechaEmision) : new Date());
    this.porcentajeIva.set(dto.porcentajeIva || 21);

    const editableLines: LineaEditable[] = dto.lineas.map(l => ({
      descripcion: l.descripcion,
      unidad: l.unidad || 'ud',
      cantidad: l.cantidad || 1,
      precioUnitario: l.precioUnitario || 0,
      importe: l.importe || (l.cantidad * l.precioUnitario),
      lineaPartidaId: l.lineaPartidaIdSugerida,
      observaciones: ''
    }));

    this.lineas.set(editableLines);
  }

  // Manipulación de visor de imagen
  rotarImagen() {
    this.rotacion.update(r => (r + 90) % 360);
  }

  ajustarZoom(delta: number) {
    this.zoom.update(z => Math.max(0.5, Math.min(3, z + delta)));
  }

  resetearVisor() {
    this.rotacion.set(0);
    this.zoom.set(1);
  }

  // Edición de líneas
  anadirLinea() {
    this.lineas.update(actuales => [
      ...actuales,
      {
        descripcion: '',
        unidad: 'ud',
        cantidad: 1,
        precioUnitario: 0,
        importe: 0,
        lineaPartidaId: undefined
      }
    ]);
  }

  eliminarLinea(index: number) {
    this.lineas.update(actuales => actuales.filter((_, i) => i !== index));
  }

  actualizarImporteLinea(index: number) {
    this.lineas.update(actuales => {
      const linea = actuales[index];
      if (linea) {
        linea.importe = Math.round(linea.cantidad * linea.precioUnitario * 100) / 100;
      }
      return [...actuales];
    });
  }

  // Guardar e Imputar
  imputarFactura() {
    const obraId = this.obraSeleccionadaId();
    if (!obraId) {
      this.msg.add({ severity: 'warn', summary: 'Atención', detail: 'Debes seleccionar una Obra a la que imputar los gastos.' });
      return;
    }

    if (this.lineas().length === 0) {
      this.msg.add({ severity: 'warn', summary: 'Atención', detail: 'Debe haber al menos una línea de material para imputar.' });
      return;
    }

    const extraido = this.datosExtraidos();
    const command: ImputarFacturaCommand = {
      obraId,
      proveedorId: this.proveedorSeleccionadoId() || undefined,
      proveedorNombre: this.proveedorNombreInput() || undefined,
      proveedorCif: this.proveedorCifInput() || undefined,
      crearProveedorSiNoExiste: this.crearProveedorAuto(),
      numeroFactura: this.numeroFactura() || undefined,
      numeroAlbaran: this.numeroAlbaran() || undefined,
      fecha: this.fechaEmision().toISOString().split('T')[0],
      porcentajeIva: this.porcentajeIva(),
      documentoAdjuntoUrl: this.ticketPendiente()?.documentoUrl || extraido?.documentoTemporalUrl,
      documentoHash: this.ticketPendiente()?.documentoHash || extraido?.documentoHash,
      ticketPendienteId: this.ticketPendiente()?.id,
      observaciones: this.observaciones() || undefined,

      lineas: this.lineas().map(l => ({
        descripcion: l.descripcion,
        unidad: l.unidad,
        cantidad: l.cantidad,
        precioUnitario: l.precioUnitario,
        importe: l.cantidad * l.precioUnitario,
        lineaPartidaId: l.lineaPartidaId || undefined,
        observaciones: l.observaciones || undefined
      }))
    };

    this.guardando.set(true);
    this.facturasSvc.imputar(command).subscribe({
      next: (res) => {
        this.guardando.set(false);
        this.msg.add({
          severity: 'success',
          summary: '¡Factura Imputada!',
          detail: res.mensaje
        });
        this.onFacturaImputada.emit(res);
        this.cerrarDialogo();
      },
      error: (err) => {
        this.guardando.set(false);
        this.msg.add({
          severity: 'error',
          summary: 'Error al imputar',
          detail: err?.error?.message || 'Ocurrió un error al guardar los materiales.'
        });
      }
    });
  }

  cerrarDialogo() {
    this.onVisibleChange.emit(false);
  }

  resetDialog() {
    if (this.documentoBlobUrl()) {
      URL.revokeObjectURL(this.documentoBlobUrl()!);
    }
    this.paso.set('subida');
    this.archivoSeleccionado.set(null);
    this.documentoBlobUrl.set(null);
    this.documentoUrlSegura.set(null);
    this.datosExtraidos.set(null);
    this.rotacion.set(0);
    this.zoom.set(1);
    this.lineas.set([]);
  }
}
