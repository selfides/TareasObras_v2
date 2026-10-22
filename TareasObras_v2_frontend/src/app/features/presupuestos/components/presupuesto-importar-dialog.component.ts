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
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';

import { PresupuestosService } from '../../../core/services/presupuestos.service';
import { ObrasService } from '../../../core/services/obras.service';
import { 
  PresupuestoExtraidoDto, 
  PartidaExtraidaDto, 
  ImportarPresupuestoEscaneadoDto, 
  ObraListDto 
} from '../../../core/models';

export interface PartidaEditable extends PartidaExtraidaDto {}

@Component({
  selector: 'app-presupuesto-importar-dialog',
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
    ToggleSwitchModule,
    TextareaModule
  ],
  templateUrl: './presupuesto-importar-dialog.component.html',
  styleUrls: ['./presupuesto-importar-dialog.component.css']
})
export class PresupuestoImportarDialogComponent {
  private presupuestosSvc = inject(PresupuestosService);
  private obrasSvc = inject(ObrasService);
  private msg = inject(MessageService);
  private sanitizer = inject(DomSanitizer);

  // Inputs & Outputs
  visible = input<boolean>(false);
  obraIdContexto = input<string | undefined>(undefined);
  onVisibleChange = output<boolean>();
  onPresupuestoImportado = output<string>();

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

  // Catálogo de obras
  obras = signal<ObraListDto[]>([]);
  obraSeleccionadaId = signal<string | null>(null);

  // Datos extraídos y editables
  datosExtraidos = signal<PresupuestoExtraidoDto | null>(null);
  numeroPresupuesto = signal<string>('');
  fechaPresupuesto = signal<Date>(new Date());
  clienteNombre = signal<string>('');
  descripcionPresupuesto = signal<string>('');
  observacionesCondiciones = signal<string>('');
  aprobarInmediatamente = signal<boolean>(false);
  partidas = signal<PartidaEditable[]>([]);

  // Estado de guardado
  guardando = signal<boolean>(false);

  // Cálculos reactivos
  totalBaseImponible = computed(() => {
    return this.partidas().reduce((acc, p) => acc + (p.cantidad * p.precioUnitario), 0);
  });

  totalPartidasConTarea = computed(() => {
    return this.partidas().filter(p => p.generarTareaKanban).length;
  });

  cuotaIvaEstimada = computed(() => {
    return Math.round((this.totalBaseImponible() * 0.21) * 100) / 100;
  });

  totalGeneralCalculado = computed(() => {
    return this.totalBaseImponible() + this.cuotaIvaEstimada();
  });

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.cargarObras();
        if (this.obraIdContexto()) {
          this.obraSeleccionadaId.set(this.obraIdContexto()!);
        }
      } else {
        this.resetearEstado();
      }
    });
  }

  private cargarObras() {
    this.obrasSvc.getAll().subscribe({
      next: (data) => this.obras.set(data),
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las obras' })
    });
  }

  // ── Drag & Drop y Selección de Archivo ──
  onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragOver.set(false);
  }

  onFileDropped(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragOver.set(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      this.procesarArchivo(e.dataTransfer.files[0]);
    }
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.procesarArchivo(input.files[0]);
    }
  }

  procesarArchivo(file: File) {
    const permitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!permitidos.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
      this.msg.add({ severity: 'warn', summary: 'Formato no soportado', detail: 'Seleccione un archivo PDF, JPG, PNG o WEBP.' });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      this.msg.add({ severity: 'warn', summary: 'Archivo demasiado grande', detail: 'El archivo excede el límite máximo de 25 MB.' });
      return;
    }

    this.archivoSeleccionado.set(file);
    const esPdfDoc = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    this.esPdf.set(esPdfDoc);

    const blobUrl = URL.createObjectURL(file);
    this.documentoBlobUrl.set(blobUrl);
    this.documentoUrlSegura.set(this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));

    // Ejecutar análisis IA
    this.analizarConIA(file);
  }

  analizarConIA(file: File) {
    this.paso.set('analizando');
    const obraId = this.obraSeleccionadaId() || this.obraIdContexto() || undefined;

    this.presupuestosSvc.analizarDocumento(file, obraId).subscribe({
      next: (res) => {
        this.datosExtraidos.set(res);
        this.numeroPresupuesto.set(res.numero || '');
        this.fechaPresupuesto.set(res.fecha ? new Date(res.fecha) : new Date());
        this.clienteNombre.set(res.clienteNombre || '');
        this.descripcionPresupuesto.set(res.descripcion || '');
        this.observacionesCondiciones.set(res.observacionesCondiciones || '');

        if (res.obraIdSugerida && !this.obraSeleccionadaId()) {
          this.obraSeleccionadaId.set(res.obraIdSugerida);
        }

        // Mapear partidas extraídas
        const partidasEdit: PartidaEditable[] = (res.partidas || []).map((p, idx) => ({
          ...p,
          orden: p.orden || (idx + 1),
          generarTareaKanban: p.generarTareaKanban !== false
        }));
        this.partidas.set(partidasEdit);

        this.paso.set('revision');
        this.msg.add({
          severity: 'success',
          summary: 'Análisis completado',
          detail: `Se detectaron ${partidasEdit.length} partidas y las condiciones del presupuesto.`
        });
      },
      error: (err) => {
        this.paso.set('subida');
        this.msg.add({
          severity: 'error',
          summary: 'Error en análisis',
          detail: err.error?.mensaje || 'No se pudo analizar el presupuesto. Compruebe el documento e inténtelo de nuevo.'
        });
      }
    });
  }

  // ── Controles de Visor de Imagen ──
  rotarDerecha() {
    this.rotacion.update(r => (r + 90) % 360);
  }

  zoomIn() {
    this.zoom.update(z => Math.min(z + 0.25, 3));
  }

  zoomOut() {
    this.zoom.update(z => Math.max(z - 0.25, 0.5));
  }

  zoomReset() {
    this.zoom.set(1);
    this.rotacion.set(0);
  }

  // ── Gestión de Partidas ──
  recalcularImporte(partida: PartidaEditable) {
    partida.importe = Math.round((partida.cantidad * partida.precioUnitario) * 100) / 100;
  }

  agregarPartidaManual() {
    const orden = this.partidas().length + 1;
    this.partidas.update(list => [
      ...list,
      {
        orden,
        numeroPosicion: `Pos. ${orden}`,
        nombre: 'Nueva Partida',
        descripcion: '',
        unidad: 'ud',
        cantidad: 1,
        precioUnitario: 0,
        importe: 0,
        generarTareaKanban: true
      }
    ]);
  }

  eliminarPartida(index: number) {
    this.partidas.update(list => list.filter((_, i) => i !== index));
  }

  toggleGenerarTareasTodas(marcar: boolean) {
    this.partidas.update(list => list.map(p => ({ ...p, generarTareaKanban: marcar })));
  }

  // ── Confirmar e Importar Presupuesto ──
  guardarPresupuesto() {
    const obraId = this.obraSeleccionadaId();
    if (!obraId) {
      this.msg.add({ severity: 'warn', summary: 'Seleccione obra', detail: 'Debe asignar el presupuesto a una obra.' });
      return;
    }

    if (this.partidas().length === 0) {
      this.msg.add({ severity: 'warn', summary: 'Sin partidas', detail: 'El presupuesto debe incluir al menos una partida.' });
      return;
    }

    this.guardando.set(true);

    const payload: ImportarPresupuestoEscaneadoDto = {
      obraId,
      numero: this.numeroPresupuesto().trim() || undefined,
      fecha: this.fechaPresupuesto().toISOString(),
      descripcion: this.descripcionPresupuesto().trim() || undefined,
      observacionesCondiciones: this.observacionesCondiciones().trim() || undefined,
      aprobarInmediatamente: this.aprobarInmediatamente(),
      documentoTemporalUrl: this.datosExtraidos()?.documentoTemporalUrl,
      partidas: this.partidas().map(p => ({
        nombre: p.nombre.trim(),
        descripcion: p.descripcion?.trim(),
        orden: p.orden,
        unidad: p.unidad?.trim() || 'ud',
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario,
        generarTareaKanban: p.generarTareaKanban
      }))
    };

    this.presupuestosSvc.importarEscaneado(payload).subscribe({
      next: (res) => {
        this.guardando.set(false);
        this.msg.add({
          severity: 'success',
          summary: '¡Presupuesto importado!',
          detail: this.aprobarInmediatamente() 
            ? 'Presupuesto creado y aprobado. Se han volcado las tareas al Kanban.' 
            : 'Presupuesto guardado en borrador con todas sus partidas.'
        });
        this.onPresupuestoImportado.emit(res.id);
        this.cerrar();
      },
      error: (err) => {
        this.guardando.set(false);
        this.msg.add({
          severity: 'error',
          summary: 'Error al importar',
          detail: err.error?.mensaje || 'Ocurrió un error al guardar el presupuesto.'
        });
      }
    });
  }

  cerrar() {
    this.onVisibleChange.emit(false);
    this.resetearEstado();
  }

  private resetearEstado() {
    if (this.documentoBlobUrl()) {
      URL.revokeObjectURL(this.documentoBlobUrl()!);
    }
    this.paso.set('subida');
    this.archivoSeleccionado.set(null);
    this.documentoUrlSegura.set(null);
    this.documentoBlobUrl.set(null);
    this.datosExtraidos.set(null);
    this.partidas.set([]);
    this.numeroPresupuesto.set('');
    this.descripcionPresupuesto.set('');
    this.observacionesCondiciones.set('');
    this.aprobarInmediatamente.set(false);
    this.guardando.set(false);
    this.zoom.set(1);
    this.rotacion.set(0);
  }
}
