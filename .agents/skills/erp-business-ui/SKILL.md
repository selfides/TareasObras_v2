---
name: erp-business-ui
description: "Directrices y estándares de diseño para transformar la interfaz de usuario en un ERP de negocios moderno (estilo SAP/Odoo/NetSuite) con Angular 20, PrimeNG 20 y Tailwind CSS."
---

# Guía de Diseño y UI para ERP Empresarial (TareasObras)

Esta skill establece las normas arquitectónicas y visuales para mantener una interfaz coherente, profesional y de alta densidad para la gestión de obras, presupuestos, partes de trabajo y recursos.

---

## 1. Principios de Diseño ERP

1. **Alta Densidad de Información**:
   - En software de negocios (ERP), los usuarios necesitan consultar y comparar grandes volúmenes de datos sin scrolls excesivos.
   - Usar tamaños compactos para tablas y formularios (`p-datatable-sm`, inputs `p-inputtext-sm`, padding vertical controlado `py-1.5` o `py-2`).
   - Evitar espacios vacíos desproporcionados; preferir jerarquías visuales limpias basadas en sutiles bordes (`border-surface-200 dark:border-surface-700/80`).

2. **Tipografía y Legibilidad**:
   - Títulos de sección: `font-semibold text-surface-900 dark:text-surface-100 tracking-tight text-base sm:text-lg`.
   - Etiquetas de datos y metadatos: `text-xs font-medium text-surface-500 dark:text-surface-400`.
   - Números, importes monetarios y códigos: Fuente monospace (`font-mono`) o tabular (`tabular-nums`) para alineación precisa de decimales y monedas.

3. **Semántica de Colores y Estados**:
   - **Éxito / Aprobado / Cobrado**: Esmeralda / Verde (`emerald-600`, fondos `emerald-50 dark:bg-emerald-950/40`, texto `emerald-700 dark:text-emerald-300`).
   - **En Curso / Activo / En Obra**: Azul corporativo (`primary-600`, `blue-500`).
   - **Pendiente / Precaución / Desviación leve**: Ámbar (`amber-500`, fondos `amber-50 dark:bg-amber-950/40`).
   - **Peligro / Rechazado / Desvío crítico**: Rojo (`rose-600`, `red-500`).
   - **Borrador / Inactivo / Neutral**: Gris pizarra (`surface-500`, `slate-400`).

---

## 2. Componentes Base de Negocio

### A. Tarjetas KPI de Resumen (KPI Metric Cards)
Colocar siempre en la parte superior de cada módulo para dar una panorámica instantánea:
```html
<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
  <div class="bg-white dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-800 shadow-2xs flex flex-col justify-between">
    <div class="flex items-center justify-between text-surface-500 dark:text-surface-400 mb-2">
      <span class="text-xs font-semibold uppercase tracking-wider">Total Presupuestado</span>
      <div class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center text-primary-600">
        <i class="pi pi-wallet text-sm"></i>
      </div>
    </div>
    <div class="flex items-baseline gap-2">
      <span class="text-xl sm:text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-50 font-mono">142.500 €</span>
      <span class="inline-flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
        <i class="pi pi-arrow-up-right text-[10px] mr-0.5"></i>+8.2%
      </span>
    </div>
    <span class="text-[11px] text-surface-400 dark:text-surface-500 mt-1">Comparado con mes anterior</span>
  </div>
</div>
```

### B. Barra de Herramientas de Tabla ERP (Data Grid Toolbar)
Cada vista de catálogo o tabla debe contar con una cabecera de control que agrupe:
- Búsqueda global en tiempo real.
- Filtro por estado / categoría en chips o dropdown.
- Botones de acción principales: **Exportar Excel/PDF**, **Selector de Columnas** y **+ Nuevo Registro**.

### C. Paneles Laterales Deslizantes (Side Drawers)
En lugar de modales pequeños o redirecciones completas para ediciones rápidas (e.g. ver desglose de factura o asignar operario a tarea), utilizar cajones laterales (`p-drawer` o overlay flotante `w-full max-w-xl fixed right-0 top-0 bottom-0 z-50`). Esto permite al gestor mantener visible el contexto de la tabla mientras edita.

### D. Badges de Estado Estandarizados
Usar la clase unificada con punto indicador de pulso o color:
```html
<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
  En Curso
</span>
```

---

## 3. Acciones Globales & Omnibox (Ctrl + K)

Todo ERP avanzado cuenta con una paleta de comandos o buscador rápido (`Ctrl + K` / `Cmd + K`) que permite:
- Saltar a una obra escribiendo su código o nombre.
- Buscar un operario o parte de trabajo.
- Acceder a acciones directas (e.g., "Nuevo Parte de Obra", "Crear Tarea", "Descargar Informe").
