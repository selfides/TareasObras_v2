import {
  CategoriasOperarioService,
  OperariosService,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TabsModule
} from "./chunk-WTFPI5BT.js";
import {
  Table,
  TableModule
} from "./chunk-BIOXLGQX.js";
import {
  Dialog,
  DialogModule,
  Select,
  SelectModule
} from "./chunk-5KKJJ7OR.js";
import "./chunk-TAMMXLL3.js";
import "./chunk-L4SADYLI.js";
import "./chunk-X6AQCLEH.js";
import {
  InputNumber,
  InputNumberModule
} from "./chunk-RMMU6WOA.js";
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
import {
  Button,
  ButtonModule
} from "./chunk-UD3KEAH2.js";
import {
  CommonModule,
  DecimalPipe,
  MessageService,
  PrimeTemplate
} from "./chunk-LHMGNLDW.js";
import {
  Component,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-UYBFJOBI.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/operarios/components/operarios.component.ts
var _c0 = () => ({ width: "500px" });
var _c1 = () => ({ width: "400px" });
function OperariosComponent_ng_template_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "DNI");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Categor\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "\u20AC/hora");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "th");
    \u0275\u0275elementEnd();
  }
}
function OperariosComponent_ng_template_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 26);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 27);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 27);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td")(8, "span", 28);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 29);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td")(14, "span");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 30)(17, "p-button", 31);
    \u0275\u0275listener("onClick", function OperariosComponent_ng_template_21_Template_p_button_onClick_17_listener() {
      const o_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.abrirDlgOperario(o_r2));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "p-button", 32);
    \u0275\u0275listener("onClick", function OperariosComponent_ng_template_21_Template_p_button_onClick_18_listener() {
      const o_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.eliminarOperario(o_r2.id));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const o_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(o_r2.nombreCompleto);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(o_r2.dni || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(o_r2.telefono || "\u2014");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(o_r2.categoriaNombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(12, 10, o_r2.costeHoraBase, "1.2-2"), " \u20AC");
    \u0275\u0275advance(3);
    \u0275\u0275classMap("px-2 py-0.5 rounded-full text-xs font-medium " + (o_r2.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(o_r2.activo ? "Activo" : "Inactivo");
    \u0275\u0275advance(2);
    \u0275\u0275property("text", true);
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
  }
}
function OperariosComponent_ng_template_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 33);
    \u0275\u0275element(2, "i", 34);
    \u0275\u0275text(3, "No hay operarios ");
    \u0275\u0275elementEnd()();
  }
}
function OperariosComponent_ng_template_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 30);
    \u0275\u0275text(4, "\u20AC/hora base");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 30);
    \u0275\u0275text(6, "Operarios");
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "th");
    \u0275\u0275elementEnd();
  }
}
function OperariosComponent_ng_template_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 26);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 35);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td", 36);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 30)(9, "p-button", 31);
    \u0275\u0275listener("onClick", function OperariosComponent_ng_template_30_Template_p_button_onClick_9_listener() {
      const c_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.abrirDlgCategoria(c_r5));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p-button", 32);
    \u0275\u0275listener("onClick", function OperariosComponent_ng_template_30_Template_p_button_onClick_10_listener() {
      const c_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.eliminarCategoria(c_r5.id));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const c_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r5.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(5, 5, c_r5.costeHoraBase, "1.2-2"), " \u20AC");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r5.totalOperarios);
    \u0275\u0275advance(2);
    \u0275\u0275property("text", true);
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
  }
}
function OperariosComponent_ng_template_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 37);
    \u0275\u0275element(2, "i", 38);
    \u0275\u0275text(3, "No hay categor\xEDas ");
    \u0275\u0275elementEnd()();
  }
}
function OperariosComponent_ng_template_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 39);
    \u0275\u0275listener("onClick", function OperariosComponent_ng_template_56_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.dlgOperario = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 40);
    \u0275\u0275listener("onClick", function OperariosComponent_ng_template_56_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.guardarOperario());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275property("label", ctx_r2.editandoOperario ? "Guardar cambios" : "Crear operario")("loading", ctx_r2.saving());
  }
}
function OperariosComponent_ng_template_67_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 39);
    \u0275\u0275listener("onClick", function OperariosComponent_ng_template_67_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.dlgCategoria = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 40);
    \u0275\u0275listener("onClick", function OperariosComponent_ng_template_67_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.guardarCategoria());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275property("label", ctx_r2.editandoCategoria ? "Guardar cambios" : "Crear categoria")("loading", ctx_r2.saving());
  }
}
var OperariosComponent = class _OperariosComponent {
  operariosSvc = inject(OperariosService);
  categoriasSvc = inject(CategoriasOperarioService);
  msg = inject(MessageService);
  operarios = signal([]);
  categorias = signal([]);
  loading = signal(true);
  saving = signal(false);
  activeTab = signal("operarios");
  dlgOperario = false;
  dlgCategoria = false;
  editandoOperario = null;
  editandoCategoria = null;
  operarioForm = { nombre: "", apellidos: "", dni: "", telefono: "", categoriaOperarioId: null };
  categoriaForm = { nombre: "", costeHoraBase: 0 };
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.loading.set(true);
    this.operariosSvc.getAll(false).subscribe((o) => {
      this.operarios.set(o);
      this.loading.set(false);
    });
    this.categoriasSvc.getAll().subscribe((c) => this.categorias.set(c));
  }
  abrirDlgOperario(o) {
    this.editandoOperario = o?.id ?? null;
    this.operarioForm = o ? { nombre: o.nombre, apellidos: o.apellidos, dni: o.dni ?? "", telefono: o.telefono ?? "", categoriaOperarioId: o.categoriaOperarioId } : { nombre: "", apellidos: "", dni: "", telefono: "", categoriaOperarioId: null };
    this.dlgOperario = true;
  }
  guardarOperario() {
    if (!this.operarioForm.nombre || !this.operarioForm.categoriaOperarioId)
      return;
    this.saving.set(true);
    const obs = this.editandoOperario ? this.operariosSvc.update(this.editandoOperario, this.operarioForm) : this.operariosSvc.create(this.operarioForm);
    obs.subscribe({
      next: () => {
        this.dlgOperario = false;
        this.saving.set(false);
        this.cargar();
        this.msg.add({ severity: "success", summary: this.editandoOperario ? "Operario actualizado" : "Operario creado" });
      },
      error: () => {
        this.saving.set(false);
        this.msg.add({ severity: "error", summary: "Error al guardar" });
      }
    });
  }
  eliminarOperario(id) {
    this.operariosSvc.delete(id).subscribe({
      next: () => {
        this.cargar();
        this.msg.add({ severity: "success", summary: "Operario eliminado" });
      },
      error: () => this.msg.add({ severity: "error", summary: "No se puede eliminar" })
    });
  }
  abrirDlgCategoria(c) {
    this.editandoCategoria = c?.id ?? null;
    this.categoriaForm = c ? { nombre: c.nombre, costeHoraBase: c.costeHoraBase } : { nombre: "", costeHoraBase: 0 };
    this.dlgCategoria = true;
  }
  guardarCategoria() {
    if (!this.categoriaForm.nombre)
      return;
    this.saving.set(true);
    const obs = this.editandoCategoria ? this.categoriasSvc.update(this.editandoCategoria, this.categoriaForm) : this.categoriasSvc.create(this.categoriaForm);
    obs.subscribe({
      next: () => {
        this.dlgCategoria = false;
        this.saving.set(false);
        this.cargar();
        this.msg.add({ severity: "success", summary: this.editandoCategoria ? "Categoria actualizada" : "Categoria creada" });
      },
      error: () => {
        this.saving.set(false);
        this.msg.add({ severity: "error", summary: "Error al guardar" });
      }
    });
  }
  eliminarCategoria(id) {
    this.categoriasSvc.delete(id).subscribe({
      next: () => {
        this.cargar();
        this.msg.add({ severity: "success", summary: "Categoria eliminada" });
      },
      error: () => this.msg.add({ severity: "error", summary: "No se puede eliminar - tiene operarios asignados" })
    });
  }
  static \u0275fac = function OperariosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OperariosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OperariosComponent, selectors: [["app-operarios"]], decls: 68, vars: 29, consts: [[1, "space-y-5", "animate-fade-in"], [1, "flex", "items-center", "justify-between"], [1, "text-2xl", "font-bold", "text-surface-900", "dark:text-surface-50"], [1, "text-surface-500", "text-sm", "mt-0.5"], [3, "valueChange", "value"], ["value", "operarios"], ["value", "categorias"], [1, "space-y-4", "mt-4"], [1, "flex", "justify-end"], ["label", "Nuevo operario", "icon", "pi pi-plus", "size", "small", 3, "onClick"], [1, "bg-white", "dark:bg-surface-900", "rounded-xl", "border", "border-surface-200", "dark:border-surface-700", "overflow-hidden"], ["styleClass", "p-datatable-sm", 3, "value", "loading"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], ["label", "Nueva categor\xEDa", "icon", "pi pi-plus", "size", "small", 3, "onClick"], ["styleClass", "p-datatable-sm", 3, "value"], [3, "visibleChange", "visible", "header", "modal", "draggable"], [1, "space-y-4", "pt-2"], [1, "grid", "grid-cols-2", "gap-4"], [1, "block", "text-sm", "font-medium", "mb-1.5"], ["pInputText", "", 1, "w-full", 3, "ngModelChange", "ngModel"], ["appendTo", "body", "optionLabel", "nombre", "optionValue", "id", "placeholder", "Selecciona categor\xEDa", "styleClass", "w-full", 3, "ngModelChange", "ngModel", "options"], ["pTemplate", "footer"], ["pInputText", "", "placeholder", "Ej: Oficial 1a", 1, "w-full", 3, "ngModelChange", "ngModel"], ["styleClass", "w-full", "placeholder", "0,00", 3, "ngModelChange", "ngModel", "minFractionDigits"], [1, "font-medium"], [1, "text-surface-500", "text-sm"], [1, "px-2", "py-0.5", "rounded-full", "text-xs", "font-medium", "bg-blue-100", "text-blue-700"], [1, "font-medium", "text-green-600"], [1, "text-right"], ["icon", "pi pi-pencil", "size", "small", 3, "onClick", "text"], ["icon", "pi pi-trash", "severity", "danger", "size", "small", 3, "onClick", "text"], ["colspan", "7", 1, "text-center", "py-10", "text-surface-400"], [1, "pi", "pi-hard-hat", "text-3xl", "block", "mb-2"], [1, "text-right", "font-medium", "text-green-600"], [1, "text-right", "text-surface-500"], ["colspan", "4", 1, "text-center", "py-10", "text-surface-400"], [1, "pi", "pi-tag", "text-3xl", "block", "mb-2"], ["label", "Cancelar", "severity", "secondary", 3, "onClick", "outlined"], ["icon", "pi pi-check", 3, "onClick", "label", "loading"]], template: function OperariosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
      \u0275\u0275text(4, "Operarios");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 3);
      \u0275\u0275text(6, "Gesti\xF3n de operarios y categor\xEDas");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(7, "p-tabs", 4);
      \u0275\u0275twoWayListener("valueChange", function OperariosComponent_Template_p_tabs_valueChange_7_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.activeTab, $event) || (ctx.activeTab = $event);
        return $event;
      });
      \u0275\u0275elementStart(8, "p-tablist")(9, "p-tab", 5);
      \u0275\u0275text(10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "p-tab", 6);
      \u0275\u0275text(12);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "p-tabpanels")(14, "p-tabpanel", 5)(15, "div", 7)(16, "div", 8)(17, "p-button", 9);
      \u0275\u0275listener("onClick", function OperariosComponent_Template_p_button_onClick_17_listener() {
        return ctx.abrirDlgOperario();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 10)(19, "p-table", 11);
      \u0275\u0275template(20, OperariosComponent_ng_template_20_Template, 14, 0, "ng-template", 12)(21, OperariosComponent_ng_template_21_Template, 19, 13, "ng-template", 13)(22, OperariosComponent_ng_template_22_Template, 4, 0, "ng-template", 14);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(23, "p-tabpanel", 6)(24, "div", 7)(25, "div", 8)(26, "p-button", 15);
      \u0275\u0275listener("onClick", function OperariosComponent_Template_p_button_onClick_26_listener() {
        return ctx.abrirDlgCategoria();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "div", 10)(28, "p-table", 16);
      \u0275\u0275template(29, OperariosComponent_ng_template_29_Template, 8, 0, "ng-template", 12)(30, OperariosComponent_ng_template_30_Template, 11, 8, "ng-template", 13)(31, OperariosComponent_ng_template_31_Template, 4, 0, "ng-template", 14);
      \u0275\u0275elementEnd()()()()()()();
      \u0275\u0275elementStart(32, "p-dialog", 17);
      \u0275\u0275twoWayListener("visibleChange", function OperariosComponent_Template_p_dialog_visibleChange_32_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.dlgOperario, $event) || (ctx.dlgOperario = $event);
        return $event;
      });
      \u0275\u0275elementStart(33, "div", 18)(34, "div", 19)(35, "div")(36, "label", 20);
      \u0275\u0275text(37, "Nombre *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "input", 21);
      \u0275\u0275twoWayListener("ngModelChange", function OperariosComponent_Template_input_ngModelChange_38_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.operarioForm.nombre, $event) || (ctx.operarioForm.nombre = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "div")(40, "label", 20);
      \u0275\u0275text(41, "Apellidos *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "input", 21);
      \u0275\u0275twoWayListener("ngModelChange", function OperariosComponent_Template_input_ngModelChange_42_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.operarioForm.apellidos, $event) || (ctx.operarioForm.apellidos = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(43, "div", 19)(44, "div")(45, "label", 20);
      \u0275\u0275text(46, "DNI");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "input", 21);
      \u0275\u0275twoWayListener("ngModelChange", function OperariosComponent_Template_input_ngModelChange_47_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.operarioForm.dni, $event) || (ctx.operarioForm.dni = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(48, "div")(49, "label", 20);
      \u0275\u0275text(50, "Tel\xE9fono");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "input", 21);
      \u0275\u0275twoWayListener("ngModelChange", function OperariosComponent_Template_input_ngModelChange_51_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.operarioForm.telefono, $event) || (ctx.operarioForm.telefono = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(52, "div")(53, "label", 20);
      \u0275\u0275text(54, "Categor\xEDa *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "p-select", 22);
      \u0275\u0275twoWayListener("ngModelChange", function OperariosComponent_Template_p_select_ngModelChange_55_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.operarioForm.categoriaOperarioId, $event) || (ctx.operarioForm.categoriaOperarioId = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(56, OperariosComponent_ng_template_56_Template, 2, 3, "ng-template", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "p-dialog", 17);
      \u0275\u0275twoWayListener("visibleChange", function OperariosComponent_Template_p_dialog_visibleChange_57_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.dlgCategoria, $event) || (ctx.dlgCategoria = $event);
        return $event;
      });
      \u0275\u0275elementStart(58, "div", 18)(59, "div")(60, "label", 20);
      \u0275\u0275text(61, "Nombre *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "input", 24);
      \u0275\u0275twoWayListener("ngModelChange", function OperariosComponent_Template_input_ngModelChange_62_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.categoriaForm.nombre, $event) || (ctx.categoriaForm.nombre = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(63, "div")(64, "label", 20);
      \u0275\u0275text(65, "Coste euros/hora *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "p-inputNumber", 25);
      \u0275\u0275twoWayListener("ngModelChange", function OperariosComponent_Template_p_inputNumber_ngModelChange_66_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.categoriaForm.costeHoraBase, $event) || (ctx.categoriaForm.costeHoraBase = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(67, OperariosComponent_ng_template_67_Template, 2, 3, "ng-template", 23);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("value", ctx.activeTab);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1("Operarios (", ctx.operarios().length, ")");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("Categor\xEDas (", ctx.categorias().length, ")");
      \u0275\u0275advance(7);
      \u0275\u0275property("value", ctx.operarios())("loading", ctx.loading());
      \u0275\u0275advance(9);
      \u0275\u0275property("value", ctx.categorias());
      \u0275\u0275advance(4);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(27, _c0));
      \u0275\u0275twoWayProperty("visible", ctx.dlgOperario);
      \u0275\u0275property("header", ctx.editandoOperario ? "Editar operario" : "Nuevo operario")("modal", true)("draggable", false);
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.operarioForm.nombre);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.operarioForm.apellidos);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.operarioForm.dni);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.operarioForm.telefono);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.operarioForm.categoriaOperarioId);
      \u0275\u0275property("options", ctx.categorias());
      \u0275\u0275advance(2);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(28, _c1));
      \u0275\u0275twoWayProperty("visible", ctx.dlgCategoria);
      \u0275\u0275property("header", ctx.editandoCategoria ? "Editar categor\xEDa" : "Nueva categor\xEDa")("modal", true)("draggable", false);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.categoriaForm.nombre);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.categoriaForm.costeHoraBase);
      \u0275\u0275property("minFractionDigits", 2);
    }
  }, dependencies: [CommonModule, DecimalPipe, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, TableModule, Table, PrimeTemplate, ButtonModule, Button, DialogModule, Dialog, InputTextModule, InputText, InputNumberModule, InputNumber, SelectModule, Select, TabsModule, Tabs, TabPanels, TabPanel, TabList, Tab], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OperariosComponent, [{
    type: Component,
    args: [{
      selector: "app-operarios",
      standalone: true,
      imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        InputNumberModule,
        SelectModule,
        TabsModule
      ],
      template: `
    <div class="space-y-5 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Operarios</h1>
          <p class="text-surface-500 text-sm mt-0.5">Gesti\xF3n de operarios y categor\xEDas</p>
        </div>
      </div>

      <p-tabs [(value)]="activeTab">
        <p-tablist>
          <p-tab value="operarios">Operarios ({{ operarios().length }})</p-tab>
          <p-tab value="categorias">Categor\xEDas ({{ categorias().length }})</p-tab>
        </p-tablist>
        <p-tabpanels>

          <!-- TAB OPERARIOS -->
          <p-tabpanel value="operarios">
            <div class="space-y-4 mt-4">
              <div class="flex justify-end">
                <p-button label="Nuevo operario" icon="pi pi-plus" size="small" (onClick)="abrirDlgOperario()" />
              </div>
              <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                <p-table [value]="operarios()" [loading]="loading()" styleClass="p-datatable-sm">
                  <ng-template pTemplate="header">
                    <tr>
                      <th>Nombre</th><th>DNI</th><th>Tel\xE9fono</th>
                      <th>Categor\xEDa</th><th>\u20AC/hora</th><th>Estado</th><th></th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-o>
                    <tr>
                      <td class="font-medium">{{ o.nombreCompleto }}</td>
                      <td class="text-surface-500 text-sm">{{ o.dni || '\u2014' }}</td>
                      <td class="text-surface-500 text-sm">{{ o.telefono || '\u2014' }}</td>
                      <td><span class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{{ o.categoriaNombre }}</span></td>
                      <td class="font-medium text-green-600">{{ o.costeHoraBase | number:'1.2-2' }} \u20AC</td>
                      <td><span [class]="'px-2 py-0.5 rounded-full text-xs font-medium ' + (o.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')">{{ o.activo ? 'Activo' : 'Inactivo' }}</span></td>
                      <td class="text-right">
                        <p-button icon="pi pi-pencil" [text]="true" size="small" (onClick)="abrirDlgOperario(o)" />
                        <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" (onClick)="eliminarOperario(o.id)" />
                      </td>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="emptymessage">
                    <tr><td colspan="7" class="text-center py-10 text-surface-400">
                      <i class="pi pi-hard-hat text-3xl block mb-2"></i>No hay operarios
                    </td></tr>
                  </ng-template>
                </p-table>
              </div>
            </div>
          </p-tabpanel>

          <!-- TAB CATEGORIAS -->
          <p-tabpanel value="categorias">
            <div class="space-y-4 mt-4">
              <div class="flex justify-end">
                <p-button label="Nueva categor\xEDa" icon="pi pi-plus" size="small" (onClick)="abrirDlgCategoria()" />
              </div>
              <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                <p-table [value]="categorias()" styleClass="p-datatable-sm">
                  <ng-template pTemplate="header">
                    <tr><th>Nombre</th><th class="text-right">\u20AC/hora base</th><th class="text-right">Operarios</th><th></th></tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-c>
                    <tr>
                      <td class="font-medium">{{ c.nombre }}</td>
                      <td class="text-right font-medium text-green-600">{{ c.costeHoraBase | number:'1.2-2' }} \u20AC</td>
                      <td class="text-right text-surface-500">{{ c.totalOperarios }}</td>
                      <td class="text-right">
                        <p-button icon="pi pi-pencil" [text]="true" size="small" (onClick)="abrirDlgCategoria(c)" />
                        <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" (onClick)="eliminarCategoria(c.id)" />
                      </td>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="emptymessage">
                    <tr><td colspan="4" class="text-center py-10 text-surface-400">
                      <i class="pi pi-tag text-3xl block mb-2"></i>No hay categor\xEDas
                    </td></tr>
                  </ng-template>
                </p-table>
              </div>
            </div>
          </p-tabpanel>

        </p-tabpanels>
      </p-tabs>
    </div>

    <!-- Dialog Operario -->
    <p-dialog [(visible)]="dlgOperario" [header]="editandoOperario ? 'Editar operario' : 'Nuevo operario'"
              [modal]="true" [style]="{width:'500px'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">Nombre *</label>
            <input pInputText [(ngModel)]="operarioForm.nombre" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Apellidos *</label>
            <input pInputText [(ngModel)]="operarioForm.apellidos" class="w-full" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">DNI</label>
            <input pInputText [(ngModel)]="operarioForm.dni" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Tel\xE9fono</label>
            <input pInputText [(ngModel)]="operarioForm.telefono" class="w-full" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Categor\xEDa *</label>
          <p-select [(ngModel)]="operarioForm.categoriaOperarioId" appendTo="body"
                    [options]="categorias()" optionLabel="nombre" optionValue="id"
                    placeholder="Selecciona categor\xEDa" styleClass="w-full" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dlgOperario = false" />
        <p-button [label]="editandoOperario ? 'Guardar cambios' : 'Crear operario'" icon="pi pi-check"
                  (onClick)="guardarOperario()" [loading]="saving()" />
      </ng-template>
    </p-dialog>

    <!-- Dialog Categoria -->
    <p-dialog [(visible)]="dlgCategoria" [header]="editandoCategoria ? 'Editar categor\xEDa' : 'Nueva categor\xEDa'"
              [modal]="true" [style]="{width:'400px'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div>
          <label class="block text-sm font-medium mb-1.5">Nombre *</label>
          <input pInputText [(ngModel)]="categoriaForm.nombre" class="w-full" placeholder="Ej: Oficial 1a" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Coste euros/hora *</label>
          <p-inputNumber [(ngModel)]="categoriaForm.costeHoraBase" [minFractionDigits]="2" styleClass="w-full" placeholder="0,00" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dlgCategoria = false" />
        <p-button [label]="editandoCategoria ? 'Guardar cambios' : 'Crear categoria'" icon="pi pi-check"
                  (onClick)="guardarCategoria()" [loading]="saving()" />
      </ng-template>
    </p-dialog>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OperariosComponent, { className: "OperariosComponent", filePath: "src/app/features/operarios/components/operarios.component.ts", lineNumber: 170 });
})();
export {
  OperariosComponent
};
//# sourceMappingURL=chunk-SLYXXZYC.js.map
