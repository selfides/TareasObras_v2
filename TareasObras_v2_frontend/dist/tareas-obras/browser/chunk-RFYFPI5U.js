import {
  ConfirmDialog,
  ConfirmDialogModule
} from "./chunk-EMCAN4RA.js";
import {
  SortIcon,
  SortableColumn,
  Table,
  TableModule
} from "./chunk-BIOXLGQX.js";
import {
  Select,
  SelectModule
} from "./chunk-5KKJJ7OR.js";
import "./chunk-TAMMXLL3.js";
import {
  Tooltip,
  TooltipModule
} from "./chunk-L4SADYLI.js";
import {
  AuthService
} from "./chunk-OQT6XM2C.js";
import {
  SkeletonModule
} from "./chunk-7GMJRA7U.js";
import {
  TagModule
} from "./chunk-27HUIXQT.js";
import {
  ObrasStore
} from "./chunk-7N3R4COU.js";
import "./chunk-E57F7IJQ.js";
import "./chunk-X6AQCLEH.js";
import "./chunk-RMMU6WOA.js";
import {
  DefaultValueAccessor,
  FormsModule,
  InputText,
  InputTextModule,
  NgControlStatus,
  NgModel
} from "./chunk-4G557CJ4.js";
import "./chunk-JU3Q6H73.js";
import "./chunk-DKVWDFSI.js";
import "./chunk-N6MHAP3Q.js";
import "./chunk-HQ4N7DEE.js";
import {
  Button,
  ButtonModule
} from "./chunk-UD3KEAH2.js";
import {
  RouterLink
} from "./chunk-ZWO6PBPF.js";
import {
  CommonModule,
  ConfirmationService,
  DatePipe,
  DecimalPipe,
  MessageService,
  PrimeTemplate
} from "./chunk-LHMGNLDW.js";
import {
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-UYBFJOBI.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/obras/components/obras-list.component.ts
var _c0 = () => [10, 15, 25, 50];
var _c1 = (a0) => ["/obras", a0];
var _c2 = (a0) => ["/obras", a0, "tareas"];
var _c3 = (a0) => ["/obras", a0, "editar"];
function ObrasListComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 4);
    \u0275\u0275element(1, "p-button", 14);
    \u0275\u0275elementEnd();
  }
}
function ObrasListComponent_ng_template_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 15);
    \u0275\u0275text(2, "C\xF3digo ");
    \u0275\u0275element(3, "p-sortIcon", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 17);
    \u0275\u0275text(5, "Nombre ");
    \u0275\u0275element(6, "p-sortIcon", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 19);
    \u0275\u0275text(10, "Estado ");
    \u0275\u0275element(11, "p-sortIcon", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Tareas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 21);
    \u0275\u0275text(15, "Presupuesto ");
    \u0275\u0275element(16, "p-sortIcon", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Fecha Inicio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th", 23);
    \u0275\u0275text(20, "Acciones");
    \u0275\u0275elementEnd()();
  }
}
function ObrasListComponent_ng_template_16_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 36);
    \u0275\u0275element(1, "p-button", 39);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const obra_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(2, _c3, obra_r2.id));
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
  }
}
function ObrasListComponent_ng_template_16_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 40);
    \u0275\u0275listener("onClick", function ObrasListComponent_ng_template_16_Conditional_28_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r3);
      const obra_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.confirmDelete(obra_r2));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("text", true);
  }
}
function ObrasListComponent_ng_template_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 24)(1, "td")(2, "span", 25);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 26);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td", 27);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td")(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td")(12, "div", 28)(13, "div", 29);
    \u0275\u0275element(14, "div", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 31);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "td", 32);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 33);
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "td", 34);
    \u0275\u0275listener("click", function ObrasListComponent_ng_template_16_Template_td_click_23_listener($event) {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(24, "div", 35)(25, "a", 36);
    \u0275\u0275element(26, "p-button", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275template(27, ObrasListComponent_ng_template_16_Conditional_27_Template, 2, 4, "a", 36)(28, ObrasListComponent_ng_template_16_Conditional_28_Template, 1, 1, "p-button", 38);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const obra_r2 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(23, _c1, obra_r2.id));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(obra_r2.codigo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(obra_r2.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(obra_r2.cliente || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275classMap("px-2 py-0.5 rounded-full text-xs font-medium " + ctx_r3.estadoBadge(obra_r2.estado));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", obra_r2.estadoNombre, " ");
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("width", obra_r2.totalTareas ? (obra_r2.totalTareas - obra_r2.tareasPendientes) / obra_r2.totalTareas * 100 : 0, "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", obra_r2.totalTareas - obra_r2.tareasPendientes, "/", obra_r2.totalTareas, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(19, 17, obra_r2.presupuestoEstimado, "1.0-0"), " \u20AC");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(22, 20, obra_r2.fechaInicio, "dd/MM/yyyy"));
    \u0275\u0275advance(4);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(25, _c2, obra_r2.id));
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.auth.isSupervisor() ? 27 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.auth.isAdmin() ? 28 : -1);
  }
}
function ObrasListComponent_ng_template_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 41);
    \u0275\u0275element(2, "i", 42);
    \u0275\u0275text(3, " No hay obras que mostrar ");
    \u0275\u0275elementEnd()();
  }
}
var ObrasListComponent = class _ObrasListComponent {
  store = inject(ObrasStore);
  auth = inject(AuthService);
  confirm = inject(ConfirmationService);
  msg = inject(MessageService);
  searchText = "";
  estadoFiltro = "";
  estadoOptions = [
    { label: "Planificada", value: "Planificada" },
    { label: "En Curso", value: "EnCurso" },
    { label: "Pausada", value: "Pausada" },
    { label: "Completada", value: "Completada" },
    { label: "Cancelada", value: "Cancelada" }
  ];
  ngOnInit() {
    this.store.loadObras({});
  }
  onSearch() {
    this.store.loadObras({ search: this.searchText, estado: this.estadoFiltro });
  }
  onFiltro() {
    this.store.loadObras({ search: this.searchText, estado: this.estadoFiltro });
  }
  confirmDelete(obra) {
    this.confirm.confirm({
      message: `\xBFEliminar la obra <strong>${obra.nombre}</strong>?`,
      header: "Confirmar eliminaci\xF3n",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.store.deleteObra(obra.id);
        this.msg.add({ severity: "success", summary: "Eliminada", detail: obra.nombre });
      }
    });
  }
  estadoBadge(estado) {
    const map = {
      1: "badge-planificada",
      2: "badge-encurso",
      3: "badge-pausada",
      4: "badge-completada",
      5: "badge-cancelada"
    };
    return map[estado] ?? "";
  }
  static \u0275fac = function ObrasListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ObrasListComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ObrasListComponent, selectors: [["app-obras-list"]], features: [\u0275\u0275ProvidersFeature([ConfirmationService])], decls: 18, vars: 13, consts: [[1, "space-y-5", "animate-fade-in"], [1, "flex", "flex-col", "sm:flex-row", "items-start", "sm:items-center", "justify-between", "gap-4"], [1, "text-2xl", "font-bold", "text-surface-900", "dark:text-surface-50"], [1, "text-surface-500", "dark:text-surface-400", "text-sm", "mt-0.5"], ["routerLink", "/obras/nueva"], [1, "bg-white", "dark:bg-surface-900", "rounded-xl", "p-4", "border", "border-surface-200", "dark:border-surface-700"], [1, "flex", "flex-col", "sm:flex-row", "gap-3"], ["pInputText", "", "placeholder", "Buscar por c\xF3digo, nombre o cliente...", 1, "flex-1", "text-sm", 3, "ngModelChange", "ngModel"], ["optionLabel", "label", "optionValue", "value", "placeholder", "Todos los estados", "styleClass", "w-full sm:w-48 text-sm", 3, "ngModelChange", "onChange", "ngModel", "options", "showClear"], [1, "bg-white", "dark:bg-surface-900", "rounded-xl", "border", "border-surface-200", "dark:border-surface-700", "overflow-hidden"], ["responsiveLayout", "scroll", "styleClass", "p-datatable-sm", 3, "value", "loading", "paginator", "rows", "rowsPerPageOptions"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], ["label", "Nueva Obra", "icon", "pi pi-plus", "size", "small"], ["pSortableColumn", "codigo"], ["field", "codigo"], ["pSortableColumn", "nombre"], ["field", "nombre"], ["pSortableColumn", "estado"], ["field", "estado"], ["pSortableColumn", "presupuestoEstimado"], ["field", "presupuestoEstimado"], [1, "text-center"], [1, "cursor-pointer", 3, "routerLink"], [1, "font-mono", "text-xs", "bg-surface-100", "dark:bg-surface-800", "px-2", "py-0.5", "rounded"], [1, "font-medium", "text-surface-900", "dark:text-surface-100", "max-w-xs", "truncate"], [1, "text-surface-500", "dark:text-surface-400", "text-sm"], [1, "flex", "items-center", "gap-2"], [1, "flex-1", "bg-surface-200", "dark:bg-surface-700", "rounded-full", "h-1.5", "w-16"], [1, "bg-primary-500", "h-1.5", "rounded-full", "transition-all"], [1, "text-xs", "text-surface-500"], [1, "font-medium", "text-surface-900", "dark:text-surface-100"], [1, "text-sm", "text-surface-500", "dark:text-surface-400"], [1, "text-center", 3, "click"], [1, "flex", "items-center", "justify-center", "gap-1"], [3, "routerLink"], ["icon", "pi pi-list-check", "size", "small", "pTooltip", "Ver tareas", "tooltipPosition", "top", 3, "text"], ["icon", "pi pi-trash", "size", "small", "severity", "danger", "pTooltip", "Eliminar", "tooltipPosition", "top", 3, "text"], ["icon", "pi pi-pencil", "size", "small", "severity", "secondary", "pTooltip", "Editar", "tooltipPosition", "top", 3, "text"], ["icon", "pi pi-trash", "size", "small", "severity", "danger", "pTooltip", "Eliminar", "tooltipPosition", "top", 3, "onClick", "text"], ["colspan", "8", 1, "text-center", "py-12", "text-surface-400"], [1, "pi", "pi-building", "text-4xl", "block", "mb-3"]], template: function ObrasListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "p-confirmDialog");
      \u0275\u0275elementStart(2, "div", 1)(3, "div")(4, "h1", 2);
      \u0275\u0275text(5, "Obras");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 3);
      \u0275\u0275text(7);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, ObrasListComponent_Conditional_8_Template, 2, 0, "a", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 5)(10, "div", 6)(11, "input", 7);
      \u0275\u0275twoWayListener("ngModelChange", function ObrasListComponent_Template_input_ngModelChange_11_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchText, $event) || (ctx.searchText = $event);
        return $event;
      });
      \u0275\u0275listener("ngModelChange", function ObrasListComponent_Template_input_ngModelChange_11_listener() {
        return ctx.onSearch();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "p-select", 8);
      \u0275\u0275twoWayListener("ngModelChange", function ObrasListComponent_Template_p_select_ngModelChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.estadoFiltro, $event) || (ctx.estadoFiltro = $event);
        return $event;
      });
      \u0275\u0275listener("onChange", function ObrasListComponent_Template_p_select_onChange_12_listener() {
        return ctx.onFiltro();
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(13, "div", 9)(14, "p-table", 10);
      \u0275\u0275template(15, ObrasListComponent_ng_template_15_Template, 21, 0, "ng-template", 11)(16, ObrasListComponent_ng_template_16_Template, 29, 27, "ng-template", 12)(17, ObrasListComponent_ng_template_17_Template, 4, 0, "ng-template", 13);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate2(" ", ctx.store.totalObras(), " obras \xB7 ", ctx.store.obrasPorEstado().enCurso, " en curso ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.auth.isSupervisor() ? 8 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchText);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("ngModel", ctx.estadoFiltro);
      \u0275\u0275property("options", ctx.estadoOptions)("showClear", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("value", ctx.store.obras())("loading", ctx.store.loading())("paginator", true)("rows", 15)("rowsPerPageOptions", \u0275\u0275pureFunction0(12, _c0));
    }
  }, dependencies: [CommonModule, DecimalPipe, DatePipe, RouterLink, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, TableModule, Table, PrimeTemplate, SortableColumn, SortIcon, ButtonModule, Button, InputTextModule, InputText, SelectModule, Select, TagModule, ConfirmDialogModule, ConfirmDialog, TooltipModule, Tooltip, SkeletonModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ObrasListComponent, [{
    type: Component,
    args: [{
      selector: "app-obras-list",
      standalone: true,
      imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        TagModule,
        ConfirmDialogModule,
        TooltipModule,
        SkeletonModule
      ],
      providers: [ConfirmationService],
      template: `
    <div class="space-y-5 animate-fade-in">
      <p-confirmDialog />

      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Obras</h1>
          <p class="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
            {{ store.totalObras() }} obras \xB7 {{ store.obrasPorEstado().enCurso }} en curso
          </p>
        </div>
        @if (auth.isSupervisor()) {
          <a routerLink="/obras/nueva">
            <p-button label="Nueva Obra" icon="pi pi-plus" size="small" />
          </a>
        }
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-surface-900 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
        <div class="flex flex-col sm:flex-row gap-3">
          <input pInputText [(ngModel)]="searchText" (ngModelChange)="onSearch()" placeholder="Buscar por c\xF3digo, nombre o cliente..."
                 class="flex-1 text-sm" />
          <p-select [(ngModel)]="estadoFiltro" [options]="estadoOptions" optionLabel="label" optionValue="value"
                      placeholder="Todos los estados" [showClear]="true" (onChange)="onFiltro()"
                      styleClass="w-full sm:w-48 text-sm" />
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <p-table [value]="store.obras()" [loading]="store.loading()" responsiveLayout="scroll"
                 [paginator]="true" [rows]="15" [rowsPerPageOptions]="[10,15,25,50]"
                 styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="codigo">C\xF3digo <p-sortIcon field="codigo"/></th>
              <th pSortableColumn="nombre">Nombre <p-sortIcon field="nombre"/></th>
              <th>Cliente</th>
              <th pSortableColumn="estado">Estado <p-sortIcon field="estado"/></th>
              <th>Tareas</th>
              <th pSortableColumn="presupuestoEstimado">Presupuesto <p-sortIcon field="presupuestoEstimado"/></th>
              <th>Fecha Inicio</th>
              <th class="text-center">Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-obra>
            <tr class="cursor-pointer" [routerLink]="['/obras', obra.id]">
              <td><span class="font-mono text-xs bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded">{{ obra.codigo }}</span></td>
              <td class="font-medium text-surface-900 dark:text-surface-100 max-w-xs truncate">{{ obra.nombre }}</td>
              <td class="text-surface-500 dark:text-surface-400 text-sm">{{ obra.cliente || '\u2014' }}</td>
              <td>
                <span [class]="'px-2 py-0.5 rounded-full text-xs font-medium ' + estadoBadge(obra.estado)">
                  {{ obra.estadoNombre }}
                </span>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-1.5 w-16">
                    <div class="bg-primary-500 h-1.5 rounded-full transition-all"
                         [style.width.%]="obra.totalTareas ? (obra.totalTareas - obra.tareasPendientes) / obra.totalTareas * 100 : 0"></div>
                  </div>
                  <span class="text-xs text-surface-500">{{ obra.totalTareas - obra.tareasPendientes }}/{{ obra.totalTareas }}</span>
                </div>
              </td>
              <td class="font-medium text-surface-900 dark:text-surface-100">{{ obra.presupuestoEstimado | number:'1.0-0' }} \u20AC</td>
              <td class="text-sm text-surface-500 dark:text-surface-400">{{ obra.fechaInicio | date:'dd/MM/yyyy' }}</td>
              <td class="text-center" (click)="$event.stopPropagation()">
                <div class="flex items-center justify-center gap-1">
                  <a [routerLink]="['/obras', obra.id, 'tareas']">
                    <p-button icon="pi pi-list-check" size="small" [text]="true" pTooltip="Ver tareas" tooltipPosition="top" />
                  </a>
                  @if (auth.isSupervisor()) {
                    <a [routerLink]="['/obras', obra.id, 'editar']">
                      <p-button icon="pi pi-pencil" size="small" [text]="true" severity="secondary" pTooltip="Editar" tooltipPosition="top" />
                    </a>
                  }
                  @if (auth.isAdmin()) {
                    <p-button icon="pi pi-trash" size="small" [text]="true" severity="danger"
                              pTooltip="Eliminar" tooltipPosition="top" (onClick)="confirmDelete(obra)" />
                  }
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr><td colspan="8" class="text-center py-12 text-surface-400">
              <i class="pi pi-building text-4xl block mb-3"></i>
              No hay obras que mostrar
            </td></tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ObrasListComponent, { className: "ObrasListComponent", filePath: "src/app/features/obras/components/obras-list.component.ts", lineNumber: 120 });
})();
export {
  ObrasListComponent
};
//# sourceMappingURL=chunk-RFYFPI5U.js.map
