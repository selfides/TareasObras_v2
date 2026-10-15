export interface Point {
  x: number;
  y: number;
}

export interface QuadCorners {
  tl: Point;
  tr: Point;
  br: Point;
  bl: Point;
}

export type ScanFilterType = 'enhanced' | 'bw' | 'original';

/**
 * Utilidad matemática de corrección de perspectiva y filtros de escáner.
 * Implementa homografía proyectiva exacta (Heckbert 1989) a nivel de píxel
 * ejecutada en memoria con TypedArrays para máxima velocidad en navegadores móviles.
 */
export class PerspectiveTransformer {

  /**
   * Corrige la perspectiva de una imagen basándose en las 4 esquinas seleccionadas
   * y aplica el filtro de mejora de documento seleccionado.
   */
  static warpAndEnhance(
    sourceImg: HTMLImageElement | HTMLCanvasElement,
    quad: QuadCorners,
    filter: ScanFilterType = 'enhanced',
    maxOutputDimension: number = 1800
  ): HTMLCanvasElement {
    // 1. Obtener canvas del source original
    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = sourceImg.width;
    srcCanvas.height = sourceImg.height;
    const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true });
    if (!srcCtx) throw new Error('No se pudo inicializar contexto 2D');
    srcCtx.drawImage(sourceImg, 0, 0);

    const srcW = srcCanvas.width;
    const srcH = srcCanvas.height;
    const srcImageData = srcCtx.getImageData(0, 0, srcW, srcH);
    const srcData32 = new Uint32Array(srcImageData.data.buffer);

    // Coordenadas absolutas de las 4 esquinas en la imagen original
    const p0 = quad.tl; // Top-Left
    const p1 = quad.tr; // Top-Right
    const p2 = quad.br; // Bottom-Right
    const p3 = quad.bl; // Bottom-Left

    // 2. Calcular dimensiones óptimas del documento plano resultante
    const topW = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const bottomW = Math.hypot(p2.x - p3.x, p2.y - p3.y);
    const leftH = Math.hypot(p3.x - p0.x, p3.y - p0.y);
    const rightH = Math.hypot(p2.x - p1.x, p2.y - p1.y);

    let targetW = Math.round(Math.max(topW, bottomW));
    let targetH = Math.round(Math.max(leftH, rightH));

    if (targetW < 10) targetW = 10;
    if (targetH < 10) targetH = 10;

    // Escalar si excede la dimensión máxima para mantener peso ligero y alta velocidad
    const maxDim = Math.max(targetW, targetH);
    if (maxDim > maxOutputDimension) {
      const scale = maxOutputDimension / maxDim;
      targetW = Math.round(targetW * scale);
      targetH = Math.round(targetH * scale);
    }

    // 3. Crear canvas de salida
    const outCanvas = document.createElement('canvas');
    outCanvas.width = targetW;
    outCanvas.height = targetH;
    const outCtx = outCanvas.getContext('2d');
    if (!outCtx) throw new Error('No se pudo inicializar canvas de salida');

    const outImageData = outCtx.createImageData(targetW, targetH);
    const outData32 = new Uint32Array(outImageData.data.buffer);

    // 4. Calcular coeficientes de homografía de unidad a cuadrilátero (Heckbert 1989)
    const dx1 = p1.x - p2.x;
    const dx2 = p3.x - p2.x;
    const dx3 = p0.x - p1.x + p2.x - p3.x;

    const dy1 = p1.y - p2.y;
    const dy2 = p3.y - p2.y;
    const dy3 = p0.y - p1.y + p2.y - p3.y;

    let a11 = 0, a12 = 0, a13 = 0;
    let a21 = 0, a22 = 0, a23 = 0;
    let a31 = 0, a32 = 0, a33 = 1;

    if (Math.abs(dx3) < 0.0001 && Math.abs(dy3) < 0.0001) {
      // Caso afín puro
      a11 = p1.x - p0.x;
      a12 = p3.x - p0.x;
      a13 = p0.x;
      a21 = p1.y - p0.y;
      a22 = p3.y - p0.y;
      a23 = p0.y;
      a31 = 0;
      a32 = 0;
      a33 = 1;
    } else {
      // Caso proyectivo completo
      const det = dx1 * dy2 - dx2 * dy1 || 0.00001;
      a31 = (dx3 * dy2 - dx2 * dy3) / det;
      a32 = (dx1 * dy3 - dx3 * dy1) / det;
      a33 = 1;
      a11 = p1.x - p0.x + a31 * p1.x;
      a12 = p3.x - p0.x + a32 * p3.x;
      a13 = p0.x;
      a21 = p1.y - p0.y + a31 * p1.y;
      a22 = p3.y - p0.y + a32 * p3.y;
      a23 = p0.y;
    }

    // 5. Bucle ultrarrápido de muestreo con interpolación bilineal/vecino
    const uStep = 1.0 / targetW;
    const vStep = 1.0 / targetH;
    let destIdx = 0;

    for (let y = 0; y < targetH; y++) {
      const v = y * vStep;
      let numX = a12 * v + a13;
      let numY = a22 * v + a23;
      let denom = a32 * v + a33;

      const dNumX = a11 * uStep;
      const dNumY = a21 * uStep;
      const dDenom = a31 * uStep;

      for (let x = 0; x < targetW; x++) {
        const invD = 1.0 / (denom || 0.00001);
        const sx = (numX * invD) | 0;
        const sy = (numY * invD) | 0;

        const clampedX = sx < 0 ? 0 : (sx >= srcW ? srcW - 1 : sx);
        const clampedY = sy < 0 ? 0 : (sy >= srcH ? srcH - 1 : sy);

        outData32[destIdx++] = srcData32[clampedY * srcW + clampedX];

        numX += dNumX;
        numY += dNumY;
        denom += dDenom;
      }
    }

    // 6. Aplicar filtro de realce de documento
    if (filter === 'enhanced') {
      this.applyDocumentEnhancement(outImageData.data);
    } else if (filter === 'bw') {
      this.applyBlackAndWhite(outImageData.data);
    }

    outCtx.putImageData(outImageData, 0, 0);
    return outCanvas;
  }

  /**
   * Filtro de documento inteligente:
   * Aclara el papel (elimina sombras y tonos amarillos/grises de fondo)
   * y oscurece la tinta impresa para máxima legibilidad de cara al OCR.
   */
  private static applyDocumentEnhancement(data: Uint8ClampedArray) {
    const len = data.length;
    for (let i = 0; i < len; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Luminancia estándar
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // Curva en S de contraste con corrección de fondo
      // Si es claro (papel), empujarlo suavemente hacia blanco limpio (255)
      // Si es oscuro (tinta), saturarlo hacia negro
      let factor = 1.0;
      if (lum > 150) {
        // Fondo de papel: aclarar eliminando sombras suaves
        const boost = (lum - 150) / 105; // 0 a 1
        r = Math.min(255, r + (255 - r) * boost * 0.7);
        g = Math.min(255, g + (255 - g) * boost * 0.7);
        b = Math.min(255, b + (255 - b) * boost * 0.7);
      } else if (lum < 110) {
        // Texto/tinta: oscurecer
        factor = 0.85;
        r = Math.max(0, r * factor);
        g = Math.max(0, g * factor);
        b = Math.max(0, b * factor);
      }

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
  }

  /**
   * Filtro Blanco y Negro con umbralización adaptable:
   * Ideal para tickets térmicos (de supermercado/ferretería) poco contrastados.
   */
  private static applyBlackAndWhite(data: Uint8ClampedArray) {
    const len = data.length;
    // Calcular luminancia media
    let sum = 0;
    const step = 8 * 4; // Muestreo rápido
    let count = 0;
    for (let i = 0; i < len; i += step) {
      sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      count++;
    }
    const avgLum = count > 0 ? (sum / count) * 0.92 : 128;

    for (let i = 0; i < len; i += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const val = lum < avgLum ? 0 : 255;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
  }

  /**
   * Convierte un canvas a un objeto File con formato JPEG optimizado.
   */
  static canvasToFile(canvas: HTMLCanvasElement, fileName: string, quality: number = 0.88): Promise<File> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('No se pudo generar imagen desde el canvas'));
            return;
          }
          const finalName = fileName.replace(/\.[^/.]+$/, '') + '_escaneado.jpg';
          const file = new File([blob], finalName, { type: 'image/jpeg', lastModified: Date.now() });
          resolve(file);
        },
        'image/jpeg',
        quality
      );
    });
  }

  /**
   * Genera las 4 esquinas iniciales con un margen interior razonable (ej. 6%)
   */
  static getInitialCorners(width: number, height: number, marginPercent: number = 0.05): QuadCorners {
    const mx = width * marginPercent;
    const my = height * marginPercent;
    return {
      tl: { x: mx, y: my },
      tr: { x: width - mx, y: my },
      br: { x: width - mx, y: height - my },
      bl: { x: mx, y: height - my }
    };
  }
}
