import { 
  Component, 
  ElementRef, 
  ViewChild, 
  input, 
  output, 
  signal, 
  effect, 
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { 
  PerspectiveTransformer, 
  QuadCorners, 
  Point, 
  ScanFilterType 
} from '../../../core/utils/perspective-transformer';

@Component({
  selector: 'app-document-cropper',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="flex flex-col h-full w-full bg-slate-950 text-white rounded-2xl overflow-hidden select-none">

      <!-- Header de herramientas -->
      <div class="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 z-10">
        <div class="flex items-center gap-2">
          <i class="pi pi-crop text-emerald-400 text-base"></i>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-200">
            {{ vistaProcesada() ? 'Filtros de Escáner' : 'Ajustar Esquinas del Ticket' }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          @if (!vistaProcesada()) {
            <button 
              type="button"
              (click)="rotar90()"
              title="Rotar 90º"
              class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition">
              <i class="pi pi-refresh text-xs"></i>
              <span class="hidden sm:inline">Rotar</span>
            </button>
            <button 
              type="button"
              (click)="resetCorners()"
              title="Reiniciar esquinas"
              class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition">
              <i class="pi pi-undo text-xs"></i>
              <span class="hidden sm:inline">Reset</span>
            </button>
          }
          <button 
            type="button"
            (click)="cancelar()"
            class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 flex items-center justify-center transition">
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Área central de trabajo -->
      <div class="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden min-h-[320px] max-h-[62vh] p-2">

        @if (!vistaProcesada()) {
          <!-- MODO 1: EDITOR DE 4 ESQUINAS -->
          <div 
            #editorContainer
            class="relative inline-block touch-none max-w-full max-h-full"
            (pointermove)="onPointerMove($event)"
            (pointerup)="onPointerUp($event)"
            (pointercancel)="onPointerUp($event)">
            
            <!-- Imagen base a encuadrar -->
            <img 
              #baseImage
              [src]="imageSrc()" 
              (load)="onImageLoaded()"
              alt="Documento a escanear"
              class="block max-h-[56vh] max-w-full object-contain mx-auto pointer-events-none rounded shadow-lg" />

            <!-- Capa SVG con máscara oscura, líneas de recorte y tiradores -->
            @if (imageReady()) {
              <svg 
                class="absolute inset-0 w-full h-full pointer-events-none"
                [attr.viewBox]="'0 0 ' + dispW() + ' ' + dispH()">
                
                <defs>
                  <mask id="cropMask">
                    <!-- Relleno blanco total -->
                    <rect x="0" y="0" [attr.width]="dispW()" [attr.height]="dispH()" fill="white" />
                    <!-- Agujero negro para el área del ticket -->
                    <polygon [attr.points]="svgPolygonPoints()" fill="black" />
                  </mask>
                </defs>

                <!-- Sombra oscura sobre el fondo que quedará fuera -->
                <rect 
                  x="0" y="0" 
                  [attr.width]="dispW()" 
                  [attr.height]="dispH()" 
                  fill="rgba(0, 0, 0, 0.55)" 
                  mask="url(#cropMask)" />

                <!-- Cuadrícula 3x3 sutil de ayuda -->
                <line [attr.x1]="gridLine(0, 'x1')" [attr.y1]="gridLine(0, 'y1')" [attr.x2]="gridLine(0, 'x2')" [attr.y2]="gridLine(0, 'y2')" stroke="rgba(16, 185, 129, 0.25)" stroke-width="1" stroke-dasharray="3,3" />
                <line [attr.x1]="gridLine(1, 'x1')" [attr.y1]="gridLine(1, 'y1')" [attr.x2]="gridLine(1, 'x2')" [attr.y2]="gridLine(1, 'y2')" stroke="rgba(16, 185, 129, 0.25)" stroke-width="1" stroke-dasharray="3,3" />
                <line [attr.x1]="gridLine(2, 'x1')" [attr.y1]="gridLine(2, 'y1')" [attr.x2]="gridLine(2, 'x2')" [attr.y2]="gridLine(2, 'y2')" stroke="rgba(16, 185, 129, 0.25)" stroke-width="1" stroke-dasharray="3,3" />
                <line [attr.x1]="gridLine(3, 'x1')" [attr.y1]="gridLine(3, 'y1')" [attr.x2]="gridLine(3, 'x2')" [attr.y2]="gridLine(3, 'y2')" stroke="rgba(16, 185, 129, 0.25)" stroke-width="1" stroke-dasharray="3,3" />

                <!-- Polígono del ticket con borde verde esmeralda brillante -->
                <polygon 
                  [attr.points]="svgPolygonPoints()" 
                  fill="rgba(16, 185, 129, 0.12)" 
                  stroke="#10b981" 
                  stroke-width="2.5" 
                  stroke-linejoin="round" />
              </svg>

              <!-- Tiradores táctiles interactivos en cada una de las 4 esquinas -->
              @for (c of cornerHandles; track c.key) {
                <div 
                  class="absolute pointer-events-auto cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center touch-none z-20"
                  [style.left.px]="dispCorners()[c.key].x"
                  [style.top.px]="dispCorners()[c.key].y"
                  [style.width.px]="44"
                  [style.height.px]="44"
                  (pointerdown)="onCornerPointerDown($event, c.key)">
                  
                  <!-- Anillo pulsante al arrastrar -->
                  <div class="w-7 h-7 rounded-full bg-emerald-500/30 border-2 border-white shadow-lg flex items-center justify-center">
                    <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                </div>
              }

              <!-- Lupa táctil (Magnifier) situada sobre el dedo para máxima precisión -->
              @if (activeCornerKey() && magnifierActive()) {
                <div 
                  class="absolute z-30 pointer-events-none rounded-full overflow-hidden border-2 border-emerald-400 shadow-2xl bg-black"
                  [style.width.px]="90"
                  [style.height.px]="90"
                  [style.left.px]="magnifierPos().x - 45"
                  [style.top.px]="magnifierPos().y - 110">
                  <canvas #magnifierCanvas class="w-full h-full block"></canvas>
                  <!-- Cruz de puntería en la lupa -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-3 h-0.5 bg-emerald-400/80"></div>
                    <div class="w-0.5 h-3 bg-emerald-400/80 absolute"></div>
                  </div>
                </div>
              }
            }

          </div>
        } @else {
          <!-- MODO 2: VISTA PREVIA ENDEREZADA CON FILTRO -->
          <div class="flex flex-col items-center justify-center w-full h-full p-2 animate-fade-in">
            <div class="relative max-h-[54vh] max-w-full rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-black flex items-center justify-center">
              <img 
                [src]="processedDataUrl()" 
                alt="Ticket enderezado" 
                class="max-h-[52vh] max-w-full object-contain mx-auto" />
              
              <div class="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 border border-emerald-500/30">
                <i class="pi pi-check text-xs"></i>
                Perspectiva corregida
              </div>
            </div>
          </div>
        }

      </div>

      <!-- Barra de herramientas y botones inferiores -->
      <div class="p-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-2">
        
        @if (!vistaProcesada()) {
          <!-- Instrucción rápida y botón principal de escaneo -->
          <div class="flex items-center justify-between gap-2">
            <span class="text-[11px] text-slate-400 flex items-center gap-1.5">
              <i class="pi pi-hand text-emerald-400 text-xs"></i>
              Arrastra las 4 esquinas sobre los bordes del ticket
            </span>

            <button 
              type="button"
              (click)="aplicarPerspectivaYFiltro('enhanced')"
              [disabled]="procesando()"
              class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50">
              @if (procesando()) {
                <i class="pi pi-spin pi-spinner text-xs"></i>
                <span>Procesando...</span>
              } @else {
                <i class="pi pi-sparkles text-xs"></i>
                <span>ENDEREZAR Y MEJORAR</span>
              }
            </button>
          </div>
        } @else {
          <!-- Selector de filtros de escáner y botón de confirmación -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <!-- Botones de filtros -->
            <div class="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700/60 w-full sm:w-auto justify-center">
              <button 
                type="button"
                (click)="cambiarFiltro('enhanced')"
                [class.bg-emerald-600]="filtroActual() === 'enhanced'"
                [class.text-white]="filtroActual() === 'enhanced'"
                [class.text-slate-300]="filtroActual() !== 'enhanced'"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition">
                <i class="pi pi-sparkles text-[10px]"></i>
                Realzado
              </button>
              <button 
                type="button"
                (click)="cambiarFiltro('bw')"
                [class.bg-emerald-600]="filtroActual() === 'bw'"
                [class.text-white]="filtroActual() === 'bw'"
                [class.text-slate-300]="filtroActual() !== 'bw'"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition">
                <i class="pi pi-file text-[10px]"></i>
                B/N Puro
              </button>
              <button 
                type="button"
                (click)="cambiarFiltro('original')"
                [class.bg-emerald-600]="filtroActual() === 'original'"
                [class.text-white]="filtroActual() === 'original'"
                [class.text-slate-300]="filtroActual() !== 'original'"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition">
                <i class="pi pi-image text-[10px]"></i>
                Original
              </button>
            </div>

            <!-- Acciones: Volver a encuadrar o Aceptar recorte -->
            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button 
                type="button"
                (click)="volverAEncuadrar()"
                class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition">
                Reajustar esquinas
              </button>
              <button 
                type="button"
                (click)="confirmarRecorte()"
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-900/50 flex items-center gap-1.5 transition cursor-pointer">
                <i class="pi pi-check text-xs"></i>
                USAR ESTE TICKET
              </button>
            </div>

          </div>
        }

      </div>

    </div>
  `
})
export class DocumentCropperComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContainer') editorContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('baseImage') baseImageRef?: ElementRef<HTMLImageElement>;
  @ViewChild('magnifierCanvas') magnifierCanvas?: ElementRef<HTMLCanvasElement>;

  imageSrc = input.required<string>();
  fileName = input<string>('ticket.jpg');

  onCropped = output<{ file: File; dataUrl: string }>();
  onCancel = output<void>();

  cornerHandles = [
    { key: 'tl' as const, label: 'Superior Izq.' },
    { key: 'tr' as const, label: 'Superior Der.' },
    { key: 'br' as const, label: 'Inferior Der.' },
    { key: 'bl' as const, label: 'Inferior Izq.' }
  ];

  imageReady = signal<boolean>(false);
  procesando = signal<boolean>(false);
  vistaProcesada = signal<boolean>(false);
  filtroActual = signal<ScanFilterType>('enhanced');

  // Dimensiones del elemento <img> visible en pantalla
  dispW = signal<number>(300);
  dispH = signal<number>(400);

  // Esquinas en coordenadas visuales mostradas en pantalla
  dispCorners = signal<QuadCorners>({
    tl: { x: 20, y: 20 },
    tr: { x: 280, y: 20 },
    br: { x: 280, y: 380 },
    bl: { x: 20, y: 380 }
  });

  // Esquinas normalizadas (0 a 1) para que no se pierdan al redimensionar la ventana
  normCorners = signal<QuadCorners>({
    tl: { x: 0.05, y: 0.05 },
    tr: { x: 0.95, y: 0.05 },
    br: { x: 0.95, y: 0.95 },
    bl: { x: 0.05, y: 0.95 }
  });

  activeCornerKey = signal<keyof QuadCorners | null>(null);
  magnifierActive = signal<boolean>(false);
  magnifierPos = signal<Point>({ x: 0, y: 0 });

  processedDataUrl = signal<string>('');
  processedFile = signal<File | null>(null);

  private currentRotation = 0;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit() {
    if (typeof ResizeObserver !== 'undefined' && this.editorContainer) {
      this.resizeObserver = new ResizeObserver(() => this.recalcDisplayDimensions());
      this.resizeObserver.observe(this.editorContainer.nativeElement);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  onImageLoaded() {
    this.recalcDisplayDimensions();
    this.imageReady.set(true);
  }

  private recalcDisplayDimensions() {
    const img = this.baseImageRef?.nativeElement;
    if (!img) return;

    const w = img.clientWidth || img.width || 300;
    const h = img.clientHeight || img.height || 400;

    this.dispW.set(w);
    this.dispH.set(h);

    // Mapear desde coordenadas normalizadas
    const norm = this.normCorners();
    this.dispCorners.set({
      tl: { x: norm.tl.x * w, y: norm.tl.y * h },
      tr: { x: norm.tr.x * w, y: norm.tr.y * h },
      br: { x: norm.br.x * w, y: norm.br.y * h },
      bl: { x: norm.bl.x * w, y: norm.bl.y * h }
    });
  }

  resetCorners() {
    const defaultNorm: QuadCorners = {
      tl: { x: 0.05, y: 0.05 },
      tr: { x: 0.95, y: 0.05 },
      br: { x: 0.95, y: 0.95 },
      bl: { x: 0.05, y: 0.95 }
    };
    this.normCorners.set(defaultNorm);
    const w = this.dispW();
    const h = this.dispH();
    this.dispCorners.set({
      tl: { x: defaultNorm.tl.x * w, y: defaultNorm.tl.y * h },
      tr: { x: defaultNorm.tr.x * w, y: defaultNorm.tr.y * h },
      br: { x: defaultNorm.br.x * w, y: defaultNorm.br.y * h },
      bl: { x: defaultNorm.bl.x * w, y: defaultNorm.bl.y * h }
    });
  }

  svgPolygonPoints(): string {
    const c = this.dispCorners();
    return `${c.tl.x},${c.tl.y} ${c.tr.x},${c.tr.y} ${c.br.x},${c.br.y} ${c.bl.x},${c.bl.y}`;
  }

  gridLine(idx: number, coord: 'x1' | 'y1' | 'x2' | 'y2'): number {
    const c = this.dispCorners();
    if (idx === 0) {
      // 1/3 horizontal
      if (coord === 'x1') return c.tl.x + (c.bl.x - c.tl.x) * (1 / 3);
      if (coord === 'y1') return c.tl.y + (c.bl.y - c.tl.y) * (1 / 3);
      if (coord === 'x2') return c.tr.x + (c.br.x - c.tr.x) * (1 / 3);
      return c.tr.y + (c.br.y - c.tr.y) * (1 / 3);
    } else if (idx === 1) {
      // 2/3 horizontal
      if (coord === 'x1') return c.tl.x + (c.bl.x - c.tl.x) * (2 / 3);
      if (coord === 'y1') return c.tl.y + (c.bl.y - c.tl.y) * (2 / 3);
      if (coord === 'x2') return c.tr.x + (c.br.x - c.tr.x) * (2 / 3);
      return c.tr.y + (c.br.y - c.tr.y) * (2 / 3);
    } else if (idx === 2) {
      // 1/3 vertical
      if (coord === 'x1') return c.tl.x + (c.tr.x - c.tl.x) * (1 / 3);
      if (coord === 'y1') return c.tl.y + (c.tr.y - c.tl.y) * (1 / 3);
      if (coord === 'x2') return c.bl.x + (c.br.x - c.bl.x) * (1 / 3);
      return c.bl.y + (c.br.y - c.bl.y) * (1 / 3);
    } else {
      // 2/3 vertical
      if (coord === 'x1') return c.tl.x + (c.tr.x - c.tl.x) * (2 / 3);
      if (coord === 'y1') return c.tl.y + (c.tr.y - c.tl.y) * (2 / 3);
      if (coord === 'x2') return c.bl.x + (c.br.x - c.bl.x) * (2 / 3);
      return c.bl.y + (c.br.y - c.bl.y) * (2 / 3);
    }
  }

  onCornerPointerDown(e: PointerEvent, key: keyof QuadCorners) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this.activeCornerKey.set(key);
    this.magnifierActive.set(true);
    this.updateCornerFromPointer(e);
  }

  onPointerMove(e: PointerEvent) {
    if (this.activeCornerKey()) {
      this.updateCornerFromPointer(e);
    }
  }

  onPointerUp(e: PointerEvent) {
    if (this.activeCornerKey()) {
      this.activeCornerKey.set(null);
      this.magnifierActive.set(false);
    }
  }

  private updateCornerFromPointer(e: PointerEvent) {
    const key = this.activeCornerKey();
    const container = this.editorContainer?.nativeElement;
    const img = this.baseImageRef?.nativeElement;
    if (!key || !container || !img) return;

    const rect = img.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Clamping dentro de los límites de la imagen
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    const current = { ...this.dispCorners() };
    current[key] = { x, y };
    this.dispCorners.set(current);

    // Guardar normalizadas
    const w = rect.width || 1;
    const h = rect.height || 1;
    const norm = { ...this.normCorners() };
    norm[key] = { x: x / w, y: y / h };
    this.normCorners.set(norm);

    // Actualizar posición de la lupa
    this.magnifierPos.set({ x, y });
    this.drawMagnifier(x, y);
  }

  private drawMagnifier(dispX: number, dispY: number) {
    const img = this.baseImageRef?.nativeElement;
    const canvas = this.magnifierCanvas?.nativeElement;
    if (!img || !canvas) return;

    canvas.width = 90;
    canvas.height = 90;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = img.naturalWidth / (img.clientWidth || 1);
    const scaleY = img.naturalHeight / (img.clientHeight || 1);

    const realX = dispX * scaleX;
    const realY = dispY * scaleY;

    const zoomSize = 80; // Área de recorte en pixeles reales
    ctx.drawImage(
      img,
      realX - zoomSize / 2,
      realY - zoomSize / 2,
      zoomSize,
      zoomSize,
      0,
      0,
      90,
      90
    );
  }

  rotar90() {
    const img = this.baseImageRef?.nativeElement;
    if (!img) return;

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalHeight;
    canvas.height = img.naturalWidth;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((90 * Math.PI) / 180);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

    this.currentRotation = (this.currentRotation + 90) % 360;
    const rotatedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

    // Al rotar, actualizar la imagen y reiniciar esquinas
    (this.baseImageRef!.nativeElement as any).src = rotatedDataUrl;
    setTimeout(() => {
      this.recalcDisplayDimensions();
      this.resetCorners();
    }, 100);
  }

  async aplicarPerspectivaYFiltro(filter: ScanFilterType) {
    const img = this.baseImageRef?.nativeElement;
    if (!img) return;

    this.procesando.set(true);
    this.filtroActual.set(filter);

    // Calcular esquinas en pixeles reales de la imagen natural
    const norm = this.normCorners();
    const natW = img.naturalWidth;
    const natH = img.naturalHeight;

    const realQuad: QuadCorners = {
      tl: { x: norm.tl.x * natW, y: norm.tl.y * natH },
      tr: { x: norm.tr.x * natW, y: norm.tr.y * natH },
      br: { x: norm.br.x * natW, y: norm.br.y * natH },
      bl: { x: norm.bl.x * natW, y: norm.bl.y * natH }
    };

    try {
      // Warp en background a alta velocidad
      await new Promise((r) => setTimeout(r, 20)); // Permitir render de spinner
      const warpedCanvas = PerspectiveTransformer.warpAndEnhance(img, realQuad, filter);
      const dataUrl = warpedCanvas.toDataURL('image/jpeg', 0.88);
      const file = await PerspectiveTransformer.canvasToFile(warpedCanvas, this.fileName(), 0.88);

      this.processedDataUrl.set(dataUrl);
      this.processedFile.set(file);
      this.vistaProcesada.set(true);
    } catch (e) {
      console.error('Error al procesar perspectiva:', e);
    } finally {
      this.procesando.set(false);
    }
  }

  cambiarFiltro(filter: ScanFilterType) {
    if (this.filtroActual() === filter) return;
    this.aplicarPerspectivaYFiltro(filter);
  }

  volverAEncuadrar() {
    this.vistaProcesada.set(false);
  }

  confirmarRecorte() {
    const file = this.processedFile();
    const dataUrl = this.processedDataUrl();
    if (file && dataUrl) {
      this.onCropped.emit({ file, dataUrl });
    }
  }

  cancelar() {
    this.onCancel.emit();
  }
}
