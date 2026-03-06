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
  ConfirmDialog,
  ConfirmDialogModule
} from "./chunk-EMCAN4RA.js";
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
import {
  Tooltip,
  TooltipModule
} from "./chunk-L4SADYLI.js";
import {
  AuthService
} from "./chunk-OQT6XM2C.js";
import {
  Skeleton,
  SkeletonModule
} from "./chunk-7GMJRA7U.js";
import {
  TagModule
} from "./chunk-27HUIXQT.js";
import {
  Textarea,
  TextareaModule
} from "./chunk-5RITPKHD.js";
import {
  ObrasStore
} from "./chunk-7N3R4COU.js";
import "./chunk-E57F7IJQ.js";
import {
  DatePicker,
  DatePickerModule
} from "./chunk-X6AQCLEH.js";
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
import "./chunk-HQ4N7DEE.js";
import {
  Button,
  ButtonModule
} from "./chunk-UD3KEAH2.js";
import {
  ActivatedRoute,
  RouterLink
} from "./chunk-ZWO6PBPF.js";
import {
  CommonModule,
  ConfirmationService,
  DatePipe,
  DecimalPipe,
  HttpClient,
  MessageService,
  PrimeTemplate
} from "./chunk-LHMGNLDW.js";
import {
  Component,
  Injectable,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-UYBFJOBI.js";
import {
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/core/services/presupuestos.service.ts
var API = "/api";
var PresupuestosService = class _PresupuestosService {
  http = inject(HttpClient);
  getByObra(obraId) {
    return this.http.get(`${API}/presupuestos/obra/${obraId}`);
  }
  getById(id) {
    return this.http.get(`${API}/presupuestos/${id}`);
  }
  create(data) {
    return this.http.post(`${API}/presupuestos`, data);
  }
  aprobar(id) {
    return this.http.patch(`${API}/presupuestos/${id}/aprobar`, {});
  }
  delete(id) {
    return this.http.delete(`${API}/presupuestos/${id}`);
  }
  static \u0275fac = function PresupuestosService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PresupuestosService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PresupuestosService, factory: _PresupuestosService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PresupuestosService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/services/registro-horas.service.ts
var API2 = "/api";
var RegistroHorasService = class _RegistroHorasService {
  http = inject(HttpClient);
  getByObra(obraId) {
    return this.http.get(`${API2}/registrohoras/obra/${obraId}`);
  }
  create(data) {
    return this.http.post(`${API2}/registrohoras`, data);
  }
  update(id, data) {
    return this.http.put(`${API2}/registrohoras/${id}`, data);
  }
  delete(id) {
    return this.http.delete(`${API2}/registrohoras/${id}`);
  }
  static \u0275fac = function RegistroHorasService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RegistroHorasService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RegistroHorasService, factory: _RegistroHorasService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RegistroHorasService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/services/materiales-obra.service.ts
var API3 = "/api";
var MaterialesObraService = class _MaterialesObraService {
  http = inject(HttpClient);
  getByObra(obraId) {
    return this.http.get(`${API3}/materialesobra/obra/${obraId}`);
  }
  create(data) {
    return this.http.post(`${API3}/materialesobra`, data);
  }
  update(id, data) {
    return this.http.put(`${API3}/materialesobra/${id}`, data);
  }
  delete(id) {
    return this.http.delete(`${API3}/materialesobra/${id}`);
  }
  static \u0275fac = function MaterialesObraService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MaterialesObraService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MaterialesObraService, factory: _MaterialesObraService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MaterialesObraService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/services/partidas.service.ts
var API4 = "/api";
var PartidasService = class _PartidasService {
  http = inject(HttpClient);
  getByPresupuesto(presupuestoId) {
    return this.http.get(`${API4}/partidas/presupuesto/${presupuestoId}`);
  }
  create(data) {
    return this.http.post(`${API4}/partidas`, data);
  }
  update(id, data) {
    return this.http.put(`${API4}/partidas/${id}`, data);
  }
  delete(id) {
    return this.http.delete(`${API4}/partidas/${id}`);
  }
  addLineaMaterial(partidaId, data) {
    return this.http.post(`${API4}/partidas/${partidaId}/lineas/material`, data);
  }
  addLineaManoObra(partidaId, data) {
    return this.http.post(`${API4}/partidas/${partidaId}/lineas/manoobra`, data);
  }
  updateLinea(id, data) {
    return this.http.put(`${API4}/partidas/lineas/${id}`, data);
  }
  deleteLinea(id) {
    return this.http.delete(`${API4}/partidas/lineas/${id}`);
  }
  static \u0275fac = function PartidasService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PartidasService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PartidasService, factory: _PartidasService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PartidasService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/features/obras/components/obra-detail.component.ts
var _c0 = () => ({ width: "min(480px, 95vw)" });
var _c1 = () => ({ width: "min(440px, 95vw)" });
var _c2 = (a0) => ["/obras", a0, "tareas"];
var _c3 = (a0) => ["/obras", a0, "editar"];
var _forTrack0 = ($index, $item) => $item.id;
function ObraDetailComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275element(1, "p-skeleton", 27)(2, "p-skeleton", 28);
    \u0275\u0275elementEnd();
  }
}
function ObraDetailComponent_Conditional_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "a", 66);
    \u0275\u0275element(2, "p-button", 67);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "a", 66);
    \u0275\u0275element(4, "p-button", 68);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(3, _c2, ctx_r1.store.selectedObra().id));
    \u0275\u0275advance();
    \u0275\u0275property("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(5, _c3, ctx_r1.store.selectedObra().id));
  }
}
function ObraDetailComponent_Conditional_2_Conditional_78_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.store.selectedObra().descripcion);
  }
}
function ObraDetailComponent_Conditional_2_Conditional_84_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 69);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_Conditional_84_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.dlgPresupuesto = true);
    });
    \u0275\u0275elementEnd();
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 72);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r5.descripcion);
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 84);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_For_86_Conditional_15_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r6);
      const p_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.aprobarPresupuesto(p_r5.id));
    });
    \u0275\u0275elementEnd();
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_36_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 89);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_For_86_Conditional_36_Conditional_4_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.abrirNuevaPartida());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("text", true);
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const partida_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(partida_r8.descripcion);
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 96);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_10_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r9);
      const partida_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.abrirEditarPartida(partida_r8));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 97);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_10_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r9);
      const partida_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.abrirNuevaLinea(partida_r8.id, "Material"));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p-button", 98);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_10_Template_p_button_onClick_2_listener() {
      \u0275\u0275restoreView(_r9);
      const partida_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.abrirNuevaLinea(partida_r8.id, "ManoObra"));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p-button", 99);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_10_Template_p_button_onClick_3_listener() {
      \u0275\u0275restoreView(_r9);
      const partida_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.confirmarEliminarPartida(partida_r8.id));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("text", true);
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_11_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "th", 105);
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_11_For_18_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 108);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const linea_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("(", linea_r10.categoriaNombre, ")");
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_11_For_18_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 112)(1, "p-button", 113);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_11_For_18_Conditional_18_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r11);
      const linea_r10 = \u0275\u0275nextContext().$implicit;
      const partida_r8 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.abrirEditarLinea(linea_r10, partida_r8.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p-button", 114);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_11_For_18_Conditional_18_Template_p_button_onClick_2_listener() {
      \u0275\u0275restoreView(_r11);
      const linea_r10 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.confirmarEliminarLinea(linea_r10.id));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_11_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 107)(1, "td", 101)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 102);
    \u0275\u0275text(5);
    \u0275\u0275template(6, ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_11_For_18_Conditional_6_Template, 2, 1, "span", 108);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 109);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 103);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 110);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 111);
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275template(18, ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_11_For_18_Conditional_18_Template, 3, 2, "td", 112);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const linea_r10 = ctx.$implicit;
    const p_r5 = \u0275\u0275nextContext(4).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("px-1.5 py-0.5 rounded text-xs font-medium " + (linea_r10.tipo === "Material" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", linea_r10.tipo === "Material" ? "Mat" : "M.O.", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", linea_r10.descripcion, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(linea_r10.categoriaNombre ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(linea_r10.unidad);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(11, 10, linea_r10.cantidad, "1.0-3"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(14, 13, linea_r10.precioUnitario, "1.2-2"), " \u20AC");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(17, 16, linea_r10.importe, "1.2-2"), " \u20AC");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.auth.isSupervisor() && !p_r5.esAprobado ? 18 : -1);
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 94)(1, "thead")(2, "tr", 100)(3, "th", 101);
    \u0275\u0275text(4, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 102);
    \u0275\u0275text(6, "Descripcion");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 102);
    \u0275\u0275text(8, "Ud");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 103);
    \u0275\u0275text(10, "Cantidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 103);
    \u0275\u0275text(12, "Precio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 104);
    \u0275\u0275text(14, "Importe");
    \u0275\u0275elementEnd();
    \u0275\u0275template(15, ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_11_Conditional_15_Template, 1, 0, "th", 105);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "tbody", 106);
    \u0275\u0275repeaterCreate(17, ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_11_For_18_Template, 19, 19, "tr", 107, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const partida_r8 = \u0275\u0275nextContext().$implicit;
    const p_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(15);
    \u0275\u0275conditional(ctx_r1.auth.isSupervisor() && !p_r5.esAprobado ? 15 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(partida_r8.lineas);
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 95);
    \u0275\u0275text(1, "Sin lineas. Usa los botones + para anadir materiales o mano de obra.");
    \u0275\u0275elementEnd();
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 87)(1, "div", 90)(2, "div", 73)(3, "span", 91);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_5_Template, 2, 1, "span", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 92)(7, "span", 93);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_10_Template, 4, 4);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(11, ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_11_Template, 19, 1, "table", 94)(12, ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Conditional_12_Template, 2, 0, "p", 95);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const partida_r8 = ctx.$implicit;
    const p_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(partida_r8.nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional(partida_r8.descripcion ? 5 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(9, 5, partida_r8.total, "1.2-2"), " \u20AC");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.auth.isSupervisor() && !p_r5.esAprobado ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(partida_r8.lineas.length ? 11 : 12);
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_36_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 88);
    \u0275\u0275text(1, "No hay partidas. Crea la primera con el boton de arriba.");
    \u0275\u0275elementEnd();
  }
}
function ObraDetailComponent_Conditional_2_For_86_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 83)(1, "div", 54)(2, "p", 85);
    \u0275\u0275text(3, "Partidas");
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, ObraDetailComponent_Conditional_2_For_86_Conditional_36_Conditional_4_Template, 1, 1, "p-button", 86);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, ObraDetailComponent_Conditional_2_For_86_Conditional_36_For_6_Template, 13, 8, "div", 87, _forTrack0);
    \u0275\u0275template(7, ObraDetailComponent_Conditional_2_For_86_Conditional_36_Conditional_7_Template, 2, 0, "p", 88);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.auth.isSupervisor() && !p_r5.esAprobado ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.partidas());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.partidas().length ? 7 : -1);
  }
}
function ObraDetailComponent_Conditional_2_For_86_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 57)(1, "div", 70)(2, "div", 33)(3, "span", 71);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 9);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, ObraDetailComponent_Conditional_2_For_86_Conditional_10_Template, 2, 1, "span", 72);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 73)(12, "span", 74);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275template(15, ObraDetailComponent_Conditional_2_For_86_Conditional_15_Template, 1, 0, "p-button", 75);
    \u0275\u0275elementStart(16, "p-button", 76);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_For_86_Template_p_button_onClick_16_listener() {
      const p_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.presupuestoSeleccionado() === p_r5.id ? ctx_r1.presupuestoSeleccionado.set(null) : ctx_r1.seleccionarPresupuesto(p_r5.id));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "div", 77)(18, "div", 78)(19, "p", 79);
    \u0275\u0275text(20, "Materiales");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "p", 80);
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 78)(25, "p", 79);
    \u0275\u0275text(26, "Mano de obra");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "p", 80);
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 81)(31, "p", 82);
    \u0275\u0275text(32, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "p", 22);
    \u0275\u0275text(34);
    \u0275\u0275pipe(35, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(36, ObraDetailComponent_Conditional_2_For_86_Conditional_36_Template, 8, 2, "div", 83);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r5.numero || "v" + p_r5.version);
    \u0275\u0275advance();
    \u0275\u0275classMap("px-2 py-0.5 rounded-full text-xs font-medium " + (p_r5.esAprobado ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r5.estadoNombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(9, 15, p_r5.fecha, "dd/MM/yyyy"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r5.descripcion ? 10 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(14, 18, p_r5.total, "1.0-0"), " \u20AC");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!p_r5.esAprobado && ctx_r1.auth.isSupervisor() ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("label", ctx_r1.presupuestoSeleccionado() === p_r5.id ? "Cerrar" : "Ver partidas")("icon", ctx_r1.presupuestoSeleccionado() === p_r5.id ? "pi pi-chevron-up" : "pi pi-chevron-down")("outlined", true);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(23, 21, p_r5.totalMaterial, "1.0-0"), " \u20AC");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(29, 24, p_r5.totalHoras, "1.0-0"), " \u20AC");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(35, 27, p_r5.total, "1.0-0"), " \u20AC");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.presupuestoSeleccionado() === p_r5.id ? 36 : -1);
  }
}
function ObraDetailComponent_Conditional_2_Conditional_87_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58);
    \u0275\u0275element(1, "i", 115);
    \u0275\u0275text(2, "No hay presupuestos ");
    \u0275\u0275elementEnd();
  }
}
function ObraDetailComponent_Conditional_2_Conditional_103_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 116);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_Conditional_103_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.abrirNuevasHoras());
    });
    \u0275\u0275elementEnd();
  }
}
function ObraDetailComponent_Conditional_2_ng_template_106_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Operario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Categoria");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 117);
    \u0275\u0275text(8, "Horas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 117);
    \u0275\u0275text(10, "Euros/h");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 117);
    \u0275\u0275text(12, "Coste");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "th");
    \u0275\u0275elementEnd();
  }
}
function ObraDetailComponent_Conditional_2_ng_template_107_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 113);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_ng_template_107_Conditional_18_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r13);
      const r_r14 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.abrirEditarHoras(r_r14));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 114);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_ng_template_107_Conditional_18_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r13);
      const r_r14 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.confirmarEliminarHoras(r_r14.id));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("text", true);
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
  }
}
function ObraDetailComponent_Conditional_2_ng_template_107_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 118);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 119);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 120);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 121);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 122);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 123);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 117);
    \u0275\u0275template(18, ObraDetailComponent_Conditional_2_ng_template_107_Conditional_18_Template, 2, 2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r14 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r14.operarioNombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r14.categoriaNombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(7, 7, r_r14.fecha, "dd/MM/yyyy"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(10, 10, r_r14.horas, "1.0-1"), " h");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(13, 13, r_r14.costeHoraAplicado, "1.2-2"), " \u20AC");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(16, 16, r_r14.costeTotal, "1.2-2"), " \u20AC");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.auth.isSupervisor() ? 18 : -1);
  }
}
function ObraDetailComponent_Conditional_2_ng_template_108_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 124);
    \u0275\u0275text(2, "No hay registros de horas");
    \u0275\u0275elementEnd()();
  }
}
function ObraDetailComponent_Conditional_2_Conditional_120_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 125);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_Conditional_120_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.abrirNuevoMaterial());
    });
    \u0275\u0275elementEnd();
  }
}
function ObraDetailComponent_Conditional_2_ng_template_123_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Descripcion");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Unidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 117);
    \u0275\u0275text(8, "Cantidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 117);
    \u0275\u0275text(10, "Precio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 117);
    \u0275\u0275text(12, "Importe");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "th");
    \u0275\u0275elementEnd();
  }
}
function ObraDetailComponent_Conditional_2_ng_template_124_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 113);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_ng_template_124_Conditional_18_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r16);
      const m_r17 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.abrirEditarMaterial(m_r17));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 114);
    \u0275\u0275listener("onClick", function ObraDetailComponent_Conditional_2_ng_template_124_Conditional_18_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r16);
      const m_r17 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.confirmarEliminarMaterial(m_r17.id));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("text", true);
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
  }
}
function ObraDetailComponent_Conditional_2_ng_template_124_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 118);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 119);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 120);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 117);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 122);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 123);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 117);
    \u0275\u0275template(18, ObraDetailComponent_Conditional_2_ng_template_124_Conditional_18_Template, 2, 2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const m_r17 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r17.descripcion);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r17.unidad);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(7, 7, m_r17.fecha, "dd/MM/yyyy"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(10, 10, m_r17.cantidad, "1.0-3"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(13, 13, m_r17.precioUnitario, "1.2-2"), " \u20AC");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(16, 16, m_r17.importeReal, "1.2-2"), " \u20AC");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.auth.isSupervisor() ? 18 : -1);
  }
}
function ObraDetailComponent_Conditional_2_ng_template_125_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 124);
    \u0275\u0275text(2, "No hay materiales registrados");
    \u0275\u0275elementEnd()();
  }
}
function ObraDetailComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 30)(2, "a", 31);
    \u0275\u0275element(3, "p-button", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "div", 33)(6, "span", 34);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "h1", 35);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(12, ObraDetailComponent_Conditional_2_Conditional_12_Template, 5, 7, "div", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 37)(14, "div", 38)(15, "p", 39);
    \u0275\u0275text(16, "Presupuesto aprobado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p", 40);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 38)(21, "p", 39);
    \u0275\u0275text(22, "Coste real");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "p", 41);
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 38)(27, "p", 39);
    \u0275\u0275text(28, "Desviacion");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "p", 41);
    \u0275\u0275text(30);
    \u0275\u0275pipe(31, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 38)(33, "p", 39);
    \u0275\u0275text(34, "Tareas pendientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "p", 42);
    \u0275\u0275text(36);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "p-tabs", 43);
    \u0275\u0275twoWayListener("valueChange", function ObraDetailComponent_Conditional_2_Template_p_tabs_valueChange_37_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.activeTab, $event) || (ctx_r1.activeTab = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(38, "p-tablist")(39, "p-tab", 44);
    \u0275\u0275text(40, "Informacion");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "p-tab", 45);
    \u0275\u0275text(42, "Presupuesto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "p-tab", 46);
    \u0275\u0275text(44, "Mano de Obra");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "p-tab", 47);
    \u0275\u0275text(46, "Materiales");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "p-tabpanels")(48, "p-tabpanel", 44)(49, "div", 48)(50, "div", 49)(51, "div")(52, "span", 50);
    \u0275\u0275text(53, "Cliente:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "span", 51);
    \u0275\u0275text(55);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(56, "div")(57, "span", 50);
    \u0275\u0275text(58, "Direccion:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "span", 51);
    \u0275\u0275text(60);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(61, "div")(62, "span", 50);
    \u0275\u0275text(63, "Inicio:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "span", 51);
    \u0275\u0275text(65);
    \u0275\u0275pipe(66, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(67, "div")(68, "span", 50);
    \u0275\u0275text(69, "Fin previsto:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "span", 51);
    \u0275\u0275text(71);
    \u0275\u0275pipe(72, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(73, "div")(74, "span", 50);
    \u0275\u0275text(75, "Creado por:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "span", 51);
    \u0275\u0275text(77);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(78, ObraDetailComponent_Conditional_2_Conditional_78_Template, 2, 1, "p", 52);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(79, "p-tabpanel", 45)(80, "div", 53)(81, "div", 54)(82, "h3", 55);
    \u0275\u0275text(83, "Versiones de presupuesto");
    \u0275\u0275elementEnd();
    \u0275\u0275template(84, ObraDetailComponent_Conditional_2_Conditional_84_Template, 1, 0, "p-button", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(85, ObraDetailComponent_Conditional_2_For_86_Template, 37, 30, "div", 57, _forTrack0);
    \u0275\u0275template(87, ObraDetailComponent_Conditional_2_Conditional_87_Template, 3, 0, "div", 58);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(88, "p-tabpanel", 46)(89, "div", 59)(90, "div", 54)(91, "div")(92, "h3", 55);
    \u0275\u0275text(93, "Registros de horas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(94, "p", 21);
    \u0275\u0275text(95, "Total: ");
    \u0275\u0275elementStart(96, "strong");
    \u0275\u0275text(97);
    \u0275\u0275pipe(98, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275text(99, " - Coste: ");
    \u0275\u0275elementStart(100, "strong");
    \u0275\u0275text(101);
    \u0275\u0275pipe(102, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(103, ObraDetailComponent_Conditional_2_Conditional_103_Template, 1, 0, "p-button", 60);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "div", 57)(105, "p-table", 61);
    \u0275\u0275template(106, ObraDetailComponent_Conditional_2_ng_template_106_Template, 14, 0, "ng-template", 62)(107, ObraDetailComponent_Conditional_2_ng_template_107_Template, 19, 19, "ng-template", 63)(108, ObraDetailComponent_Conditional_2_ng_template_108_Template, 3, 0, "ng-template", 64);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(109, "p-tabpanel", 47)(110, "div", 59)(111, "div", 54)(112, "div")(113, "h3", 55);
    \u0275\u0275text(114, "Materiales consumidos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(115, "p", 21);
    \u0275\u0275text(116, "Total real: ");
    \u0275\u0275elementStart(117, "strong");
    \u0275\u0275text(118);
    \u0275\u0275pipe(119, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(120, ObraDetailComponent_Conditional_2_Conditional_120_Template, 1, 0, "p-button", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(121, "div", 57)(122, "p-table", 61);
    \u0275\u0275template(123, ObraDetailComponent_Conditional_2_ng_template_123_Template, 14, 0, "ng-template", 62)(124, ObraDetailComponent_Conditional_2_ng_template_124_Template, 19, 19, "ng-template", 63)(125, ObraDetailComponent_Conditional_2_ng_template_125_Template, 3, 0, "ng-template", 64);
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("text", true);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.store.selectedObra().codigo);
    \u0275\u0275advance();
    \u0275\u0275classMap("px-2 py-0.5 rounded-full text-xs font-medium " + ctx_r1.estadoBadge(ctx_r1.store.selectedObra().estado));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.store.selectedObra().estadoNombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.store.selectedObra().nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.auth.isSupervisor() ? 12 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(19, 32, ctx_r1.presupuestoAprobadoTotal(), "1.0-0"), " \u20AC");
    \u0275\u0275advance(5);
    \u0275\u0275classMap(ctx_r1.costeReal() > ctx_r1.presupuestoAprobadoTotal() ? "text-red-600" : "text-green-600");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(25, 35, ctx_r1.costeReal(), "1.0-0"), " \u20AC");
    \u0275\u0275advance(5);
    \u0275\u0275classMap(ctx_r1.desviacion() > 0 ? "text-red-600" : "text-green-600");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r1.desviacion() > 0 ? "+" : "", "", \u0275\u0275pipeBind2(31, 38, ctx_r1.desviacion(), "1.0-0"), " \u20AC");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.store.selectedObra().tareasPendientes);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("value", ctx_r1.activeTab);
    \u0275\u0275advance(18);
    \u0275\u0275textInterpolate(ctx_r1.store.selectedObra().cliente || "-");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.store.selectedObra().direccion || "-");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(66, 41, ctx_r1.store.selectedObra().fechaInicio, "dd/MM/yyyy"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.store.selectedObra().fechaFinPrevista ? \u0275\u0275pipeBind2(72, 44, ctx_r1.store.selectedObra().fechaFinPrevista, "dd/MM/yyyy") : "-");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.store.selectedObra().createdBy || "-");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.store.selectedObra().descripcion ? 78 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r1.auth.isSupervisor() ? 84 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.presupuestos());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.presupuestos().length ? 87 : -1);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(98, 47, ctx_r1.totalHorasReales(), "1.0-1"), " h");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(102, 50, ctx_r1.totalCosteHoras(), "1.0-0"), " \u20AC");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.auth.isSupervisor() ? 103 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.registrosHoras());
    \u0275\u0275advance(13);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(119, 53, ctx_r1.totalMaterialesReal(), "1.0-0"), " \u20AC");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.auth.isSupervisor() ? 120 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.materiales());
  }
}
function ObraDetailComponent_ng_template_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 126);
    \u0275\u0275listener("onClick", function ObraDetailComponent_ng_template_21_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.dlgPresupuesto = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 127);
    \u0275\u0275listener("onClick", function ObraDetailComponent_ng_template_21_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.guardarPresupuesto());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.saving());
  }
}
function ObraDetailComponent_ng_template_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 126);
    \u0275\u0275listener("onClick", function ObraDetailComponent_ng_template_36_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.dlgPartida = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 128);
    \u0275\u0275listener("onClick", function ObraDetailComponent_ng_template_36_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.guardarPartida());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275property("label", ctx_r1.editandoPartidaId() ? "Guardar" : "Crear partida")("loading", ctx_r1.saving());
  }
}
function ObraDetailComponent_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "label", 4);
    \u0275\u0275text(2, "Categoria *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p-select", 129);
    \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Conditional_39_Template_p_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.lineaForm.categoriaOperarioId, $event) || (ctx_r1.lineaForm.categoriaOperarioId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("onChange", function ObraDetailComponent_Conditional_39_Template_p_select_onChange_3_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCategoriaLineaChange());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.lineaForm.categoriaOperarioId);
    \u0275\u0275property("options", ctx_r1.categorias());
  }
}
function ObraDetailComponent_ng_template_63_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 126);
    \u0275\u0275listener("onClick", function ObraDetailComponent_ng_template_63_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r21);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.dlgLinea = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 128);
    \u0275\u0275listener("onClick", function ObraDetailComponent_ng_template_63_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r21);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.guardarLinea());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275property("label", ctx_r1.editandoLineaId() ? "Guardar" : "Anadir linea")("loading", ctx_r1.saving());
  }
}
function ObraDetailComponent_ng_template_87_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 126);
    \u0275\u0275listener("onClick", function ObraDetailComponent_ng_template_87_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cerrarDlgHoras());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 128);
    \u0275\u0275listener("onClick", function ObraDetailComponent_ng_template_87_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.guardarHoras());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275property("label", ctx_r1.editandoHorasId() ? "Guardar cambios" : "Registrar")("loading", ctx_r1.saving());
  }
}
function ObraDetailComponent_ng_template_116_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 126);
    \u0275\u0275listener("onClick", function ObraDetailComponent_ng_template_116_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cerrarDlgMaterial());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 128);
    \u0275\u0275listener("onClick", function ObraDetailComponent_ng_template_116_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.guardarMaterial());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275property("label", ctx_r1.editandoMaterialId() ? "Guardar cambios" : "Anadir")("loading", ctx_r1.saving());
  }
}
var ObraDetailComponent = class _ObraDetailComponent {
  store = inject(ObrasStore);
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  msg = inject(MessageService);
  confirm = inject(ConfirmationService);
  presupuestosSvc = inject(PresupuestosService);
  registroHorasSvc = inject(RegistroHorasService);
  materialesSvc = inject(MaterialesObraService);
  operariosSvc = inject(OperariosService);
  categoriasSvc = inject(CategoriasOperarioService);
  partidasSvc = inject(PartidasService);
  activeTab = signal("info");
  saving = signal(false);
  obraId = signal("");
  presupuestos = signal([]);
  partidas = signal([]);
  presupuestoSeleccionado = signal(null);
  registrosHoras = signal([]);
  materiales = signal([]);
  operarios = signal([]);
  categorias = signal([]);
  // dialogs
  dlgPresupuesto = false;
  dlgPartida = false;
  dlgLinea = false;
  dlgHoras = false;
  dlgMaterial = false;
  // signals de edicion
  editandoHorasId = signal(null);
  editandoMaterialId = signal(null);
  editandoPartidaId = signal(null);
  editandoLineaId = signal(null);
  lineaPartidaId = signal(null);
  tipoLinea = signal("Material");
  // forms
  presupuestoForm = { numero: "", fecha: /* @__PURE__ */ new Date(), descripcion: "" };
  partidaForm = { nombre: "", descripcion: "", orden: 1 };
  lineaForm = { descripcion: "", unidad: "", cantidad: 0, precioUnitario: 0, categoriaOperarioId: null };
  horasForm = { operarioId: null, categoriaOperarioId: null, fecha: /* @__PURE__ */ new Date(), horas: 8, costeHoraAplicado: 0, observaciones: "" };
  materialForm = { descripcion: "", unidad: "", cantidad: 0, precioUnitario: 0, fecha: /* @__PURE__ */ new Date(), observaciones: "" };
  // computed
  presupuestoAprobado = computed(() => this.presupuestos().find((p) => p.esAprobado));
  presupuestoAprobadoTotal = computed(() => this.presupuestoAprobado()?.total ?? 0);
  presupuestoAprobadoMaterial = computed(() => this.presupuestoAprobado()?.totalMaterial ?? 0);
  presupuestoAprobadoHoras = computed(() => this.presupuestoAprobado()?.totalHoras ?? 0);
  totalHorasReales = computed(() => this.registrosHoras().reduce((s, r) => s + r.horas, 0));
  totalCosteHoras = computed(() => this.registrosHoras().reduce((s, r) => s + r.costeTotal, 0));
  totalMaterialesReal = computed(() => this.materiales().reduce((s, m) => s + m.importeReal, 0));
  costeReal = computed(() => this.totalCosteHoras() + this.totalMaterialesReal());
  desviacion = computed(() => this.costeReal() - this.presupuestoAprobadoTotal());
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    this.obraId.set(id);
    this.store.loadObraById(id);
    this.cargarDatos(id);
  }
  cargarDatos(id) {
    this.presupuestosSvc.getByObra(id).subscribe((p) => this.presupuestos.set(p));
    this.registroHorasSvc.getByObra(id).subscribe((r) => this.registrosHoras.set(r));
    this.materialesSvc.getByObra(id).subscribe((m) => this.materiales.set(m));
    this.operariosSvc.getAll().subscribe((o) => this.operarios.set(o));
    this.categoriasSvc.getAll().subscribe((c) => this.categorias.set(c));
  }
  // ── Presupuesto ──────────────────────────────────────────────────────────
  guardarPresupuesto() {
    this.saving.set(true);
    this.presupuestosSvc.create({
      obraId: this.obraId(),
      numero: this.presupuestoForm.numero,
      fecha: this.presupuestoForm.fecha,
      descripcion: this.presupuestoForm.descripcion,
      lineasMaterial: [],
      lineasHoras: []
    }).subscribe({
      next: () => {
        this.dlgPresupuesto = false;
        this.saving.set(false);
        this.presupuestoForm = { numero: "", fecha: /* @__PURE__ */ new Date(), descripcion: "" };
        this.presupuestosSvc.getByObra(this.obraId()).subscribe((p) => this.presupuestos.set(p));
        this.msg.add({ severity: "success", summary: "Presupuesto creado" });
      },
      error: () => {
        this.saving.set(false);
        this.msg.add({ severity: "error", summary: "Error al guardar" });
      }
    });
  }
  aprobarPresupuesto(id) {
    this.presupuestosSvc.aprobar(id).subscribe({
      next: () => {
        this.presupuestosSvc.getByObra(this.obraId()).subscribe((p) => this.presupuestos.set(p));
        this.msg.add({ severity: "success", summary: "Presupuesto aprobado" });
      }
    });
  }
  seleccionarPresupuesto(id) {
    this.presupuestoSeleccionado.set(id);
    this.partidasSvc.getByPresupuesto(id).subscribe((p) => this.partidas.set(p));
  }
  // ── Partidas ─────────────────────────────────────────────────────────────
  abrirNuevaPartida() {
    this.editandoPartidaId.set(null);
    this.partidaForm = { nombre: "", descripcion: "", orden: this.partidas().length + 1 };
    this.dlgPartida = true;
  }
  abrirEditarPartida(p) {
    this.editandoPartidaId.set(p.id);
    this.partidaForm = { nombre: p.nombre, descripcion: p.descripcion ?? "", orden: p.orden };
    this.dlgPartida = true;
  }
  guardarPartida() {
    this.saving.set(true);
    const editId = this.editandoPartidaId();
    const obs = editId ? this.partidasSvc.update(editId, this.partidaForm) : this.partidasSvc.create(__spreadValues({ presupuestoId: this.presupuestoSeleccionado() }, this.partidaForm));
    obs.subscribe({
      next: () => {
        this.dlgPartida = false;
        this.saving.set(false);
        this.editandoPartidaId.set(null);
        this.partidasSvc.getByPresupuesto(this.presupuestoSeleccionado()).subscribe((p) => this.partidas.set(p));
        this.msg.add({ severity: "success", summary: editId ? "Partida actualizada" : "Partida creada" });
      },
      error: () => {
        this.saving.set(false);
        this.msg.add({ severity: "error", summary: "Error al guardar" });
      }
    });
  }
  confirmarEliminarPartida(id) {
    this.confirm.confirm({
      message: "Eliminar esta partida y sus lineas?",
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.partidasSvc.delete(id).subscribe({
          next: () => {
            this.partidasSvc.getByPresupuesto(this.presupuestoSeleccionado()).subscribe((p) => this.partidas.set(p));
            this.msg.add({ severity: "success", summary: "Partida eliminada" });
          }
        });
      }
    });
  }
  // ── Lineas ───────────────────────────────────────────────────────────────
  abrirNuevaLinea(partidaId, tipo) {
    this.editandoLineaId.set(null);
    this.lineaPartidaId.set(partidaId);
    this.tipoLinea.set(tipo);
    this.lineaForm = { descripcion: "", unidad: tipo === "ManoObra" ? "h" : "", cantidad: 0, precioUnitario: 0, categoriaOperarioId: null };
    this.dlgLinea = true;
  }
  abrirEditarLinea(l, partidaId) {
    this.editandoLineaId.set(l.id);
    this.lineaPartidaId.set(partidaId);
    this.tipoLinea.set(l.tipo);
    this.lineaForm = {
      descripcion: l.descripcion,
      unidad: l.unidad,
      cantidad: l.cantidad,
      precioUnitario: l.precioUnitario,
      categoriaOperarioId: l.categoriaOperarioId ?? null
    };
    this.dlgLinea = true;
  }
  onCategoriaLineaChange() {
    const cat = this.categorias().find((c) => c.id === this.lineaForm.categoriaOperarioId);
    if (cat)
      this.lineaForm.precioUnitario = cat.costeHoraBase;
  }
  guardarLinea() {
    this.saving.set(true);
    const editId = this.editandoLineaId();
    let obs;
    if (editId) {
      obs = this.partidasSvc.updateLinea(editId, this.lineaForm);
    } else if (this.tipoLinea() === "Material") {
      obs = this.partidasSvc.addLineaMaterial(this.lineaPartidaId(), this.lineaForm);
    } else {
      obs = this.partidasSvc.addLineaManoObra(this.lineaPartidaId(), this.lineaForm);
    }
    obs.subscribe({
      next: () => {
        this.dlgLinea = false;
        this.saving.set(false);
        this.editandoLineaId.set(null);
        this.partidasSvc.getByPresupuesto(this.presupuestoSeleccionado()).subscribe((p) => this.partidas.set(p));
        this.msg.add({ severity: "success", summary: editId ? "Linea actualizada" : "Linea anadida" });
      },
      error: () => {
        this.saving.set(false);
        this.msg.add({ severity: "error", summary: "Error al guardar" });
      }
    });
  }
  confirmarEliminarLinea(id) {
    this.confirm.confirm({
      message: "Eliminar esta linea?",
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.partidasSvc.deleteLinea(id).subscribe({
          next: () => {
            this.partidasSvc.getByPresupuesto(this.presupuestoSeleccionado()).subscribe((p) => this.partidas.set(p));
            this.msg.add({ severity: "success", summary: "Linea eliminada" });
          }
        });
      }
    });
  }
  // ── Horas ────────────────────────────────────────────────────────────────
  abrirNuevasHoras() {
    this.editandoHorasId.set(null);
    this.horasForm = { operarioId: null, categoriaOperarioId: null, fecha: /* @__PURE__ */ new Date(), horas: 8, costeHoraAplicado: 0, observaciones: "" };
    this.dlgHoras = true;
  }
  abrirEditarHoras(r) {
    this.editandoHorasId.set(r.id);
    this.horasForm = {
      operarioId: r.operarioId,
      categoriaOperarioId: r.categoriaOperarioId,
      fecha: new Date(r.fecha),
      horas: r.horas,
      costeHoraAplicado: r.costeHoraAplicado,
      observaciones: r.observaciones ?? ""
    };
    this.dlgHoras = true;
  }
  cerrarDlgHoras() {
    this.dlgHoras = false;
    this.editandoHorasId.set(null);
  }
  onOperarioChange() {
    const op = this.operarios().find((o) => o.id === this.horasForm.operarioId);
    if (op) {
      this.horasForm.categoriaOperarioId = op.categoriaOperarioId;
      this.horasForm.costeHoraAplicado = op.costeHoraBase;
    }
  }
  guardarHoras() {
    this.saving.set(true);
    const editId = this.editandoHorasId();
    const obs = editId ? this.registroHorasSvc.update(editId, {
      fecha: this.horasForm.fecha,
      horas: this.horasForm.horas,
      costeHoraAplicado: this.horasForm.costeHoraAplicado,
      observaciones: this.horasForm.observaciones
    }) : this.registroHorasSvc.create({
      obraId: this.obraId(),
      operarioId: this.horasForm.operarioId,
      categoriaOperarioId: this.horasForm.categoriaOperarioId,
      fecha: this.horasForm.fecha,
      horas: this.horasForm.horas,
      costeHoraAplicado: this.horasForm.costeHoraAplicado,
      observaciones: this.horasForm.observaciones
    });
    obs.subscribe({
      next: () => {
        this.cerrarDlgHoras();
        this.saving.set(false);
        this.registroHorasSvc.getByObra(this.obraId()).subscribe((r) => this.registrosHoras.set(r));
        this.msg.add({ severity: "success", summary: editId ? "Horas actualizadas" : "Horas registradas" });
      },
      error: () => {
        this.saving.set(false);
        this.msg.add({ severity: "error", summary: "Error al guardar" });
      }
    });
  }
  confirmarEliminarHoras(id) {
    this.confirm.confirm({
      message: "Eliminar este registro de horas?",
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.registroHorasSvc.delete(id).subscribe({
          next: () => {
            this.registroHorasSvc.getByObra(this.obraId()).subscribe((r) => this.registrosHoras.set(r));
            this.msg.add({ severity: "success", summary: "Registro eliminado" });
          }
        });
      }
    });
  }
  // ── Materiales ───────────────────────────────────────────────────────────
  abrirNuevoMaterial() {
    this.editandoMaterialId.set(null);
    this.materialForm = { descripcion: "", unidad: "", cantidad: 0, precioUnitario: 0, fecha: /* @__PURE__ */ new Date(), observaciones: "" };
    this.dlgMaterial = true;
  }
  abrirEditarMaterial(m) {
    this.editandoMaterialId.set(m.id);
    this.materialForm = {
      descripcion: m.descripcion,
      unidad: m.unidad,
      cantidad: m.cantidad,
      precioUnitario: m.precioUnitario,
      fecha: new Date(m.fecha),
      observaciones: m.observaciones ?? ""
    };
    this.dlgMaterial = true;
  }
  cerrarDlgMaterial() {
    this.dlgMaterial = false;
    this.editandoMaterialId.set(null);
  }
  guardarMaterial() {
    this.saving.set(true);
    const editId = this.editandoMaterialId();
    const obs = editId ? this.materialesSvc.update(editId, this.materialForm) : this.materialesSvc.create(__spreadValues({ obraId: this.obraId() }, this.materialForm));
    obs.subscribe({
      next: () => {
        this.cerrarDlgMaterial();
        this.saving.set(false);
        this.materialesSvc.getByObra(this.obraId()).subscribe((m) => this.materiales.set(m));
        this.msg.add({ severity: "success", summary: editId ? "Material actualizado" : "Material anadido" });
      },
      error: () => {
        this.saving.set(false);
        this.msg.add({ severity: "error", summary: "Error al guardar" });
      }
    });
  }
  confirmarEliminarMaterial(id) {
    this.confirm.confirm({
      message: "Eliminar este material?",
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.materialesSvc.delete(id).subscribe({
          next: () => {
            this.materialesSvc.getByObra(this.obraId()).subscribe((m) => this.materiales.set(m));
            this.msg.add({ severity: "success", summary: "Material eliminado" });
          }
        });
      }
    });
  }
  estadoBadge(estado) {
    const map = {
      0: "bg-slate-100 text-slate-600",
      1: "bg-blue-100 text-blue-700",
      2: "bg-amber-100 text-amber-700",
      3: "bg-green-100 text-green-700",
      4: "bg-red-100 text-red-700"
    };
    return map[estado] ?? "";
  }
  static \u0275fac = function ObraDetailComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ObraDetailComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ObraDetailComponent, selectors: [["app-obra-detail"]], decls: 117, vars: 78, consts: [[1, "space-y-5", "animate-fade-in"], [1, "space-y-4"], ["header", "Nuevo Presupuesto", "appendTo", "body", 3, "visibleChange", "visible", "modal", "draggable"], [1, "space-y-4", "pt-2"], [1, "block", "text-sm", "font-medium", "mb-1.5"], ["pInputText", "", "placeholder", "Ej: PPTO-2026-001", 1, "w-full", 3, "ngModelChange", "ngModel"], [1, "grid", "grid-cols-2", "gap-4"], ["appendTo", "body", "dateFormat", "dd/mm/yy", "styleClass", "w-full", 3, "ngModelChange", "ngModel", "showIcon"], ["pInputText", "", "placeholder", "Ej: Revision inicial", 1, "w-full", 3, "ngModelChange", "ngModel"], [1, "text-xs", "text-surface-400"], ["pTemplate", "footer"], ["appendTo", "body", 3, "visibleChange", "visible", "header", "modal", "draggable"], ["pInputText", "", "placeholder", "Ej: Estructura, Albanileria...", 1, "w-full", 3, "ngModelChange", "ngModel"], ["pTextarea", "", "rows", "2", 1, "w-full", 3, "ngModelChange", "ngModel"], ["styleClass", "w-full", 3, "ngModelChange", "ngModel", "min"], ["pInputText", "", "placeholder", "Ej: Cemento Portland, Oficial 1a montaje...", 1, "w-full", 3, "ngModelChange", "ngModel"], [1, "grid", "grid-cols-3", "gap-3"], ["pInputText", "", "placeholder", "kg, m2, h...", 1, "w-full", 3, "ngModelChange", "ngModel"], ["styleClass", "w-full", 3, "ngModelChange", "ngModel", "minFractionDigits", "maxFractionDigits"], ["styleClass", "w-full", 3, "ngModelChange", "ngModel", "minFractionDigits"], [1, "bg-surface-50", "dark:bg-surface-800", "rounded-lg", "p-3", "flex", "justify-between", "items-center"], [1, "text-sm", "text-surface-500"], [1, "font-bold", "text-blue-600"], ["appendTo", "body", "optionLabel", "nombreCompleto", "optionValue", "id", "placeholder", "Selecciona operario", "styleClass", "w-full", 3, "ngModelChange", "onChange", "ngModel", "options", "disabled"], ["styleClass", "w-full", 3, "ngModelChange", "ngModel", "minFractionDigits", "min", "max"], ["pInputText", "", "placeholder", "Ej: Cemento Portland", 1, "w-full", 3, "ngModelChange", "ngModel"], ["pInputText", "", "placeholder", "kg, m2, ud...", 1, "w-full", 3, "ngModelChange", "ngModel"], ["height", "60px"], ["height", "200px"], [1, "flex", "flex-col", "sm:flex-row", "items-start", "sm:items-center", "justify-between", "gap-4"], [1, "flex", "items-center", "gap-3"], ["routerLink", "/obras"], ["icon", "pi pi-arrow-left", "severity", "secondary", "size", "small", 3, "text"], [1, "flex", "items-center", "gap-2", "flex-wrap"], [1, "font-mono", "text-sm", "bg-surface-100", "dark:bg-surface-800", "px-2", "py-0.5", "rounded", "text-surface-500"], [1, "text-2xl", "font-bold", "text-surface-900", "dark:text-surface-50", "mt-1"], [1, "flex", "gap-2"], [1, "grid", "grid-cols-2", "sm:grid-cols-4", "gap-4"], [1, "bg-white", "dark:bg-surface-900", "rounded-xl", "p-4", "border", "border-surface-200", "dark:border-surface-700"], [1, "text-xs", "text-surface-500"], [1, "text-xl", "font-bold", "text-surface-900", "dark:text-surface-50", "mt-1"], [1, "text-xl", "font-bold", "mt-1"], [1, "text-xl", "font-bold", "text-amber-600", "mt-1"], [3, "valueChange", "value"], ["value", "info"], ["value", "presupuesto"], ["value", "horas"], ["value", "materiales"], [1, "bg-white", "dark:bg-surface-900", "rounded-xl", "border", "border-surface-200", "dark:border-surface-700", "p-6", "mt-4"], [1, "grid", "grid-cols-1", "sm:grid-cols-3", "gap-4", "text-sm", "mb-6", "pb-6", "border-b", "border-surface-100", "dark:border-surface-700"], [1, "text-surface-500"], [1, "ml-2", "font-medium"], [1, "text-surface-600", "dark:text-surface-300", "text-sm"], [1, "space-y-3", "mt-4"], [1, "flex", "justify-between", "items-center"], [1, "font-semibold", "text-surface-900", "dark:text-surface-50"], ["label", "Nuevo presupuesto", "icon", "pi pi-plus", "size", "small"], [1, "bg-white", "dark:bg-surface-900", "rounded-xl", "border", "border-surface-200", "dark:border-surface-700", "overflow-hidden"], [1, "text-center", "py-10", "text-surface-400", "bg-white", "dark:bg-surface-900", "rounded-xl", "border", "border-surface-200", "dark:border-surface-700"], [1, "space-y-4", "mt-4"], ["label", "Registrar horas", "icon", "pi pi-plus", "size", "small"], ["styleClass", "p-datatable-sm", 3, "value"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], ["label", "Anadir material", "icon", "pi pi-plus", "size", "small"], [3, "routerLink"], ["label", "Kanban", "icon", "pi pi-list-check", "size", "small", 3, "outlined"], ["label", "Editar", "icon", "pi pi-pencil", "size", "small"], ["label", "Nuevo presupuesto", "icon", "pi pi-plus", "size", "small", 3, "onClick"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-2", "p-4", "border-b", "border-surface-100", "dark:border-surface-700"], [1, "font-mono", "font-semibold", "text-sm"], [1, "text-xs", "text-surface-500", "italic"], [1, "flex", "items-center", "gap-2"], [1, "font-bold", "text-blue-600", "text-sm"], ["label", "Aprobar", "icon", "pi pi-check", "size", "small", "severity", "success"], ["size", "small", 3, "onClick", "label", "icon", "outlined"], [1, "grid", "grid-cols-3", "gap-0", "text-sm", "border-b", "border-surface-100", "dark:border-surface-700"], [1, "text-center", "p-3", "border-r", "border-surface-100", "dark:border-surface-700"], [1, "text-surface-400", "text-xs"], [1, "font-semibold"], [1, "text-center", "p-3"], [1, "text-blue-500", "text-xs"], [1, "p-4", "space-y-3", "bg-surface-50", "dark:bg-surface-800"], ["label", "Aprobar", "icon", "pi pi-check", "size", "small", "severity", "success", 3, "onClick"], [1, "text-sm", "font-semibold", "text-surface-700", "dark:text-surface-300"], ["label", "Nueva partida", "icon", "pi pi-plus", "size", "small", 3, "text"], [1, "bg-white", "dark:bg-surface-900", "rounded-lg", "border", "border-surface-200", "dark:border-surface-700", "overflow-hidden"], [1, "text-center", "py-4", "text-surface-400", "text-sm"], ["label", "Nueva partida", "icon", "pi pi-plus", "size", "small", 3, "onClick", "text"], [1, "flex", "items-center", "justify-between", "px-3", "py-2", "bg-surface-50", "dark:bg-surface-800", "border-b", "border-surface-100", "dark:border-surface-700"], [1, "font-medium", "text-sm"], [1, "flex", "items-center", "gap-1"], [1, "text-sm", "font-bold", "text-blue-600", "mr-2"], [1, "w-full", "text-xs"], [1, "text-center", "py-3", "text-surface-400", "text-xs", "bg-white", "dark:bg-surface-900"], ["icon", "pi pi-pencil", "size", "small", "pTooltip", "Editar partida", 3, "onClick", "text"], ["icon", "pi pi-plus", "size", "small", "severity", "success", "pTooltip", "Anadir material", 3, "onClick", "text"], ["icon", "pi pi-user", "size", "small", "severity", "info", "pTooltip", "Anadir mano de obra", 3, "onClick", "text"], ["icon", "pi pi-trash", "severity", "danger", "size", "small", "pTooltip", "Eliminar partida", 3, "onClick", "text"], [1, "text-left", "text-surface-400", "border-b", "border-surface-100", "dark:border-surface-700", "bg-white", "dark:bg-surface-900"], [1, "px-3", "py-1.5"], [1, "py-1.5"], [1, "py-1.5", "text-right"], [1, "py-1.5", "text-right", "pr-3"], [1, "py-1.5", "pr-1"], [1, "bg-white", "dark:bg-surface-900"], [1, "border-b", "border-surface-50", "dark:border-surface-800"], [1, "text-surface-400", "ml-1"], [1, "py-1.5", "text-surface-400"], [1, "py-1.5", "text-right", "text-surface-500"], [1, "py-1.5", "text-right", "font-medium", "pr-3"], [1, "py-1.5", "pr-1", "text-right"], ["icon", "pi pi-pencil", "size", "small", 3, "onClick", "text"], ["icon", "pi pi-trash", "severity", "danger", "size", "small", 3, "onClick", "text"], [1, "pi", "pi-file", "text-3xl", "block", "mb-2"], ["label", "Registrar horas", "icon", "pi pi-plus", "size", "small", 3, "onClick"], [1, "text-right"], [1, "font-medium"], [1, "text-surface-500", "text-sm"], [1, "text-sm"], [1, "text-right", "font-medium"], [1, "text-right", "text-surface-500"], [1, "text-right", "font-medium", "text-blue-600"], ["colspan", "7", 1, "text-center", "py-8", "text-surface-400"], ["label", "Anadir material", "icon", "pi pi-plus", "size", "small", 3, "onClick"], ["label", "Cancelar", "severity", "secondary", 3, "onClick", "outlined"], ["label", "Crear presupuesto", "icon", "pi pi-check", 3, "onClick", "loading"], ["icon", "pi pi-check", 3, "onClick", "label", "loading"], ["appendTo", "body", "optionLabel", "nombre", "optionValue", "id", "placeholder", "Selecciona categoria", "styleClass", "w-full", 3, "ngModelChange", "onChange", "ngModel", "options"]], template: function ObraDetailComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275template(1, ObraDetailComponent_Conditional_1_Template, 3, 0, "div", 1)(2, ObraDetailComponent_Conditional_2_Template, 126, 56);
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "p-confirmdialog");
      \u0275\u0275elementStart(4, "p-dialog", 2);
      \u0275\u0275twoWayListener("visibleChange", function ObraDetailComponent_Template_p_dialog_visibleChange_4_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.dlgPresupuesto, $event) || (ctx.dlgPresupuesto = $event);
        return $event;
      });
      \u0275\u0275elementStart(5, "div", 3)(6, "div")(7, "label", 4);
      \u0275\u0275text(8, "Numero de presupuesto *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "input", 5);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_input_ngModelChange_9_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.presupuestoForm.numero, $event) || (ctx.presupuestoForm.numero = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 6)(11, "div")(12, "label", 4);
      \u0275\u0275text(13, "Fecha *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "p-datepicker", 7);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_p_datepicker_ngModelChange_14_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.presupuestoForm.fecha, $event) || (ctx.presupuestoForm.fecha = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "div")(16, "label", 4);
      \u0275\u0275text(17, "Descripcion");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "input", 8);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_input_ngModelChange_18_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.presupuestoForm.descripcion, $event) || (ctx.presupuestoForm.descripcion = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(19, "p", 9);
      \u0275\u0275text(20, "Tras crear el presupuesto podras anadir partidas con materiales y mano de obra.");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(21, ObraDetailComponent_ng_template_21_Template, 2, 2, "ng-template", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "p-dialog", 11);
      \u0275\u0275twoWayListener("visibleChange", function ObraDetailComponent_Template_p_dialog_visibleChange_22_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.dlgPartida, $event) || (ctx.dlgPartida = $event);
        return $event;
      });
      \u0275\u0275elementStart(23, "div", 3)(24, "div")(25, "label", 4);
      \u0275\u0275text(26, "Nombre *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "input", 12);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_input_ngModelChange_27_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.partidaForm.nombre, $event) || (ctx.partidaForm.nombre = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "div")(29, "label", 4);
      \u0275\u0275text(30, "Descripcion");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "textarea", 13);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_textarea_ngModelChange_31_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.partidaForm.descripcion, $event) || (ctx.partidaForm.descripcion = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "div")(33, "label", 4);
      \u0275\u0275text(34, "Orden");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "p-inputNumber", 14);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_p_inputNumber_ngModelChange_35_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.partidaForm.orden, $event) || (ctx.partidaForm.orden = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(36, ObraDetailComponent_ng_template_36_Template, 2, 3, "ng-template", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "p-dialog", 11);
      \u0275\u0275twoWayListener("visibleChange", function ObraDetailComponent_Template_p_dialog_visibleChange_37_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.dlgLinea, $event) || (ctx.dlgLinea = $event);
        return $event;
      });
      \u0275\u0275elementStart(38, "div", 3);
      \u0275\u0275template(39, ObraDetailComponent_Conditional_39_Template, 4, 2, "div");
      \u0275\u0275elementStart(40, "div")(41, "label", 4);
      \u0275\u0275text(42, "Descripcion *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "input", 15);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_input_ngModelChange_43_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.lineaForm.descripcion, $event) || (ctx.lineaForm.descripcion = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(44, "div", 16)(45, "div")(46, "label", 4);
      \u0275\u0275text(47, "Unidad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "input", 17);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_input_ngModelChange_48_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.lineaForm.unidad, $event) || (ctx.lineaForm.unidad = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "div")(50, "label", 4);
      \u0275\u0275text(51, "Cantidad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "p-inputNumber", 18);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_p_inputNumber_ngModelChange_52_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.lineaForm.cantidad, $event) || (ctx.lineaForm.cantidad = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(53, "div")(54, "label", 4);
      \u0275\u0275text(55, "Precio (euros)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "p-inputNumber", 19);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_p_inputNumber_ngModelChange_56_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.lineaForm.precioUnitario, $event) || (ctx.lineaForm.precioUnitario = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(57, "div", 20)(58, "span", 21);
      \u0275\u0275text(59, "Importe total:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "span", 22);
      \u0275\u0275text(61);
      \u0275\u0275pipe(62, "number");
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(63, ObraDetailComponent_ng_template_63_Template, 2, 3, "ng-template", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "p-dialog", 11);
      \u0275\u0275twoWayListener("visibleChange", function ObraDetailComponent_Template_p_dialog_visibleChange_64_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.dlgHoras, $event) || (ctx.dlgHoras = $event);
        return $event;
      });
      \u0275\u0275elementStart(65, "div", 3)(66, "div")(67, "label", 4);
      \u0275\u0275text(68, "Operario *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(69, "p-select", 23);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_p_select_ngModelChange_69_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.horasForm.operarioId, $event) || (ctx.horasForm.operarioId = $event);
        return $event;
      });
      \u0275\u0275listener("onChange", function ObraDetailComponent_Template_p_select_onChange_69_listener() {
        return ctx.onOperarioChange();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(70, "div", 6)(71, "div")(72, "label", 4);
      \u0275\u0275text(73, "Fecha *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(74, "p-datepicker", 7);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_p_datepicker_ngModelChange_74_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.horasForm.fecha, $event) || (ctx.horasForm.fecha = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(75, "div")(76, "label", 4);
      \u0275\u0275text(77, "Horas *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(78, "p-inputNumber", 24);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_p_inputNumber_ngModelChange_78_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.horasForm.horas, $event) || (ctx.horasForm.horas = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(79, "div")(80, "label", 4);
      \u0275\u0275text(81, "Coste euros/hora");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(82, "p-inputNumber", 19);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_p_inputNumber_ngModelChange_82_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.horasForm.costeHoraAplicado, $event) || (ctx.horasForm.costeHoraAplicado = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(83, "div")(84, "label", 4);
      \u0275\u0275text(85, "Observaciones");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(86, "textarea", 13);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_textarea_ngModelChange_86_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.horasForm.observaciones, $event) || (ctx.horasForm.observaciones = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(87, ObraDetailComponent_ng_template_87_Template, 2, 3, "ng-template", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(88, "p-dialog", 11);
      \u0275\u0275twoWayListener("visibleChange", function ObraDetailComponent_Template_p_dialog_visibleChange_88_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.dlgMaterial, $event) || (ctx.dlgMaterial = $event);
        return $event;
      });
      \u0275\u0275elementStart(89, "div", 3)(90, "div")(91, "label", 4);
      \u0275\u0275text(92, "Descripcion *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(93, "input", 25);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_input_ngModelChange_93_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.materialForm.descripcion, $event) || (ctx.materialForm.descripcion = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(94, "div", 6)(95, "div")(96, "label", 4);
      \u0275\u0275text(97, "Unidad *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(98, "input", 26);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_input_ngModelChange_98_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.materialForm.unidad, $event) || (ctx.materialForm.unidad = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(99, "div")(100, "label", 4);
      \u0275\u0275text(101, "Fecha *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(102, "p-datepicker", 7);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_p_datepicker_ngModelChange_102_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.materialForm.fecha, $event) || (ctx.materialForm.fecha = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(103, "div", 6)(104, "div")(105, "label", 4);
      \u0275\u0275text(106, "Cantidad *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(107, "p-inputNumber", 18);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_p_inputNumber_ngModelChange_107_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.materialForm.cantidad, $event) || (ctx.materialForm.cantidad = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(108, "div")(109, "label", 4);
      \u0275\u0275text(110, "Precio unitario (euros) *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(111, "p-inputNumber", 19);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_p_inputNumber_ngModelChange_111_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.materialForm.precioUnitario, $event) || (ctx.materialForm.precioUnitario = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(112, "div")(113, "label", 4);
      \u0275\u0275text(114, "Observaciones");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(115, "textarea", 13);
      \u0275\u0275twoWayListener("ngModelChange", function ObraDetailComponent_Template_textarea_ngModelChange_115_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.materialForm.observaciones, $event) || (ctx.materialForm.observaciones = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(116, ObraDetailComponent_ng_template_116_Template, 2, 3, "ng-template", 10);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.store.loading() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.store.loading() && ctx.store.selectedObra() ? 2 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(73, _c0));
      \u0275\u0275twoWayProperty("visible", ctx.dlgPresupuesto);
      \u0275\u0275property("modal", true)("draggable", false);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.presupuestoForm.numero);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.presupuestoForm.fecha);
      \u0275\u0275property("showIcon", true);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.presupuestoForm.descripcion);
      \u0275\u0275advance(4);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(74, _c1));
      \u0275\u0275twoWayProperty("visible", ctx.dlgPartida);
      \u0275\u0275property("header", ctx.editandoPartidaId() ? "Editar partida" : "Nueva partida")("modal", true)("draggable", false);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.partidaForm.nombre);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.partidaForm.descripcion);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.partidaForm.orden);
      \u0275\u0275property("min", 1);
      \u0275\u0275advance(2);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(75, _c0));
      \u0275\u0275twoWayProperty("visible", ctx.dlgLinea);
      \u0275\u0275property("header", ctx.editandoLineaId() ? "Editar linea" : ctx.tipoLinea() === "Material" ? "Anadir material" : "Anadir mano de obra")("modal", true)("draggable", false);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.tipoLinea() === "ManoObra" ? 39 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.lineaForm.descripcion);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.lineaForm.unidad);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.lineaForm.cantidad);
      \u0275\u0275property("minFractionDigits", 0)("maxFractionDigits", 3);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.lineaForm.precioUnitario);
      \u0275\u0275property("minFractionDigits", 2);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(62, 70, ctx.lineaForm.cantidad * ctx.lineaForm.precioUnitario, "1.2-2"), " \u20AC");
      \u0275\u0275advance(3);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(76, _c0));
      \u0275\u0275twoWayProperty("visible", ctx.dlgHoras);
      \u0275\u0275property("header", ctx.editandoHorasId() ? "Editar horas" : "Registrar horas")("modal", true)("draggable", false);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.horasForm.operarioId);
      \u0275\u0275property("options", ctx.operarios())("disabled", !!ctx.editandoHorasId());
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.horasForm.fecha);
      \u0275\u0275property("showIcon", true);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.horasForm.horas);
      \u0275\u0275property("minFractionDigits", 1)("min", 0.5)("max", 24);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.horasForm.costeHoraAplicado);
      \u0275\u0275property("minFractionDigits", 2);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.horasForm.observaciones);
      \u0275\u0275advance(2);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(77, _c0));
      \u0275\u0275twoWayProperty("visible", ctx.dlgMaterial);
      \u0275\u0275property("header", ctx.editandoMaterialId() ? "Editar material" : "Anadir material")("modal", true)("draggable", false);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.materialForm.descripcion);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.materialForm.unidad);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.materialForm.fecha);
      \u0275\u0275property("showIcon", true);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.materialForm.cantidad);
      \u0275\u0275property("minFractionDigits", 0)("maxFractionDigits", 3);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.materialForm.precioUnitario);
      \u0275\u0275property("minFractionDigits", 2);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.materialForm.observaciones);
    }
  }, dependencies: [CommonModule, DecimalPipe, DatePipe, RouterLink, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, ButtonModule, Button, PrimeTemplate, SkeletonModule, Skeleton, TabsModule, Tabs, TabPanels, TabPanel, TabList, Tab, TableModule, Table, DialogModule, Dialog, ConfirmDialogModule, ConfirmDialog, InputTextModule, InputText, InputNumberModule, InputNumber, SelectModule, Select, DatePickerModule, DatePicker, TextareaModule, Textarea, TagModule, TooltipModule, Tooltip], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ObraDetailComponent, [{
    type: Component,
    args: [{
      selector: "app-obra-detail",
      standalone: true,
      imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        ButtonModule,
        SkeletonModule,
        TabsModule,
        TableModule,
        DialogModule,
        ConfirmDialogModule,
        InputTextModule,
        InputNumberModule,
        SelectModule,
        DatePickerModule,
        TextareaModule,
        TagModule,
        TooltipModule
      ],
      template: `
    <div class="space-y-5 animate-fade-in">
      @if (store.loading()) {
        <div class="space-y-4"><p-skeleton height="60px" /><p-skeleton height="200px" /></div>
      }
      @if (!store.loading() && store.selectedObra()) {

        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <a routerLink="/obras">
              <p-button icon="pi pi-arrow-left" [text]="true" severity="secondary" size="small" />
            </a>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-mono text-sm bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded text-surface-500">{{ store.selectedObra()!.codigo }}</span>
                <span [class]="'px-2 py-0.5 rounded-full text-xs font-medium ' + estadoBadge(store.selectedObra()!.estado)">{{ store.selectedObra()!.estadoNombre }}</span>
              </div>
              <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 mt-1">{{ store.selectedObra()!.nombre }}</h1>
            </div>
          </div>
          @if (auth.isSupervisor()) {
            <div class="flex gap-2">
              <a [routerLink]="['/obras', store.selectedObra()!.id, 'tareas']">
                <p-button label="Kanban" icon="pi pi-list-check" size="small" [outlined]="true" />
              </a>
              <a [routerLink]="['/obras', store.selectedObra()!.id, 'editar']">
                <p-button label="Editar" icon="pi pi-pencil" size="small" />
              </a>
            </div>
          }
        </div>

        <!-- KPIs -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-surface-900 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
            <p class="text-xs text-surface-500">Presupuesto aprobado</p>
            <p class="text-xl font-bold text-surface-900 dark:text-surface-50 mt-1">{{ presupuestoAprobadoTotal() | number:'1.0-0' }} \u20AC</p>
          </div>
          <div class="bg-white dark:bg-surface-900 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
            <p class="text-xs text-surface-500">Coste real</p>
            <p class="text-xl font-bold mt-1" [class]="costeReal() > presupuestoAprobadoTotal() ? 'text-red-600' : 'text-green-600'">{{ costeReal() | number:'1.0-0' }} \u20AC</p>
          </div>
          <div class="bg-white dark:bg-surface-900 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
            <p class="text-xs text-surface-500">Desviacion</p>
            <p class="text-xl font-bold mt-1" [class]="desviacion() > 0 ? 'text-red-600' : 'text-green-600'">{{ desviacion() > 0 ? '+' : '' }}{{ desviacion() | number:'1.0-0' }} \u20AC</p>
          </div>
          <div class="bg-white dark:bg-surface-900 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
            <p class="text-xs text-surface-500">Tareas pendientes</p>
            <p class="text-xl font-bold text-amber-600 mt-1">{{ store.selectedObra()!.tareasPendientes }}</p>
          </div>
        </div>

        <!-- Tabs -->
        <p-tabs [(value)]="activeTab">
          <p-tablist>
            <p-tab value="info">Informacion</p-tab>
            <p-tab value="presupuesto">Presupuesto</p-tab>
            <p-tab value="horas">Mano de Obra</p-tab>
            <p-tab value="materiales">Materiales</p-tab>
          </p-tablist>
          <p-tabpanels>

            <!-- TAB INFO -->
            <p-tabpanel value="info">
              <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 p-6 mt-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-6 pb-6 border-b border-surface-100 dark:border-surface-700">
                  <div><span class="text-surface-500">Cliente:</span><span class="ml-2 font-medium">{{ store.selectedObra()!.cliente || '-' }}</span></div>
                  <div><span class="text-surface-500">Direccion:</span><span class="ml-2 font-medium">{{ store.selectedObra()!.direccion || '-' }}</span></div>
                  <div><span class="text-surface-500">Inicio:</span><span class="ml-2 font-medium">{{ store.selectedObra()!.fechaInicio | date:'dd/MM/yyyy' }}</span></div>
                  <div><span class="text-surface-500">Fin previsto:</span><span class="ml-2 font-medium">{{ store.selectedObra()!.fechaFinPrevista ? (store.selectedObra()!.fechaFinPrevista | date:'dd/MM/yyyy') : '-' }}</span></div>
                  <div><span class="text-surface-500">Creado por:</span><span class="ml-2 font-medium">{{ store.selectedObra()!.createdBy || '-' }}</span></div>
                </div>
                @if (store.selectedObra()!.descripcion) {
                  <p class="text-surface-600 dark:text-surface-300 text-sm">{{ store.selectedObra()!.descripcion }}</p>
                }
              </div>
            </p-tabpanel>

            <!-- TAB PRESUPUESTO -->
            <p-tabpanel value="presupuesto">
              <div class="space-y-3 mt-4">
                <div class="flex justify-between items-center">
                  <h3 class="font-semibold text-surface-900 dark:text-surface-50">Versiones de presupuesto</h3>
                  @if (auth.isSupervisor()) {
                    <p-button label="Nuevo presupuesto" icon="pi pi-plus" size="small" (onClick)="dlgPresupuesto = true" />
                  }
                </div>

                @for (p of presupuestos(); track p.id) {
                  <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                    <!-- Cabecera presupuesto -->
                    <div class="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-surface-100 dark:border-surface-700">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="font-mono font-semibold text-sm">{{ p.numero || ('v' + p.version) }}</span>
                        <span [class]="'px-2 py-0.5 rounded-full text-xs font-medium ' + (p.esAprobado ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')">{{ p.estadoNombre }}</span>
                        <span class="text-xs text-surface-400">{{ p.fecha | date:'dd/MM/yyyy' }}</span>
                        @if (p.descripcion) { <span class="text-xs text-surface-500 italic">{{ p.descripcion }}</span> }
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-blue-600 text-sm">{{ p.total | number:'1.0-0' }} \u20AC</span>
                        @if (!p.esAprobado && auth.isSupervisor()) {
                          <p-button label="Aprobar" icon="pi pi-check" size="small" severity="success" (onClick)="aprobarPresupuesto(p.id)" />
                        }
                        <p-button [label]="presupuestoSeleccionado() === p.id ? 'Cerrar' : 'Ver partidas'"
                                  [icon]="presupuestoSeleccionado() === p.id ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                                  size="small" [outlined]="true"
                                  (onClick)="presupuestoSeleccionado() === p.id ? presupuestoSeleccionado.set(null) : seleccionarPresupuesto(p.id)" />
                      </div>
                    </div>

                    <!-- Totales -->
                    <div class="grid grid-cols-3 gap-0 text-sm border-b border-surface-100 dark:border-surface-700">
                      <div class="text-center p-3 border-r border-surface-100 dark:border-surface-700">
                        <p class="text-surface-400 text-xs">Materiales</p>
                        <p class="font-semibold">{{ p.totalMaterial | number:'1.0-0' }} \u20AC</p>
                      </div>
                      <div class="text-center p-3 border-r border-surface-100 dark:border-surface-700">
                        <p class="text-surface-400 text-xs">Mano de obra</p>
                        <p class="font-semibold">{{ p.totalHoras | number:'1.0-0' }} \u20AC</p>
                      </div>
                      <div class="text-center p-3">
                        <p class="text-blue-500 text-xs">Total</p>
                        <p class="font-bold text-blue-600">{{ p.total | number:'1.0-0' }} \u20AC</p>
                      </div>
                    </div>

                    <!-- Partidas (expandible) -->
                    @if (presupuestoSeleccionado() === p.id) {
                      <div class="p-4 space-y-3 bg-surface-50 dark:bg-surface-800">
                        <div class="flex justify-between items-center">
                          <p class="text-sm font-semibold text-surface-700 dark:text-surface-300">Partidas</p>
                          @if (auth.isSupervisor() && !p.esAprobado) {
                            <p-button label="Nueva partida" icon="pi pi-plus" size="small" [text]="true" (onClick)="abrirNuevaPartida()" />
                          }
                        </div>

                        @for (partida of partidas(); track partida.id) {
                          <div class="bg-white dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
                            <!-- Cabecera partida -->
                            <div class="flex items-center justify-between px-3 py-2 bg-surface-50 dark:bg-surface-800 border-b border-surface-100 dark:border-surface-700">
                              <div class="flex items-center gap-2">
                                <span class="font-medium text-sm">{{ partida.nombre }}</span>
                                @if (partida.descripcion) { <span class="text-xs text-surface-400">{{ partida.descripcion }}</span> }
                              </div>
                              <div class="flex items-center gap-1">
                                <span class="text-sm font-bold text-blue-600 mr-2">{{ partida.total | number:'1.2-2' }} \u20AC</span>
                                @if (auth.isSupervisor() && !p.esAprobado) {
                                  <p-button icon="pi pi-pencil" [text]="true" size="small" pTooltip="Editar partida" (onClick)="abrirEditarPartida(partida)" />
                                  <p-button icon="pi pi-plus" [text]="true" size="small" severity="success" pTooltip="Anadir material" (onClick)="abrirNuevaLinea(partida.id, 'Material')" />
                                  <p-button icon="pi pi-user" [text]="true" size="small" severity="info" pTooltip="Anadir mano de obra" (onClick)="abrirNuevaLinea(partida.id, 'ManoObra')" />
                                  <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" pTooltip="Eliminar partida" (onClick)="confirmarEliminarPartida(partida.id)" />
                                }
                              </div>
                            </div>
                            <!-- Lineas -->
                            @if (partida.lineas.length) {
                              <table class="w-full text-xs">
                                <thead>
                                  <tr class="text-left text-surface-400 border-b border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-900">
                                    <th class="px-3 py-1.5">Tipo</th>
                                    <th class="py-1.5">Descripcion</th>
                                    <th class="py-1.5">Ud</th>
                                    <th class="py-1.5 text-right">Cantidad</th>
                                    <th class="py-1.5 text-right">Precio</th>
                                    <th class="py-1.5 text-right pr-3">Importe</th>
                                    @if (auth.isSupervisor() && !p.esAprobado) { <th class="py-1.5 pr-1"></th> }
                                  </tr>
                                </thead>
                                <tbody class="bg-white dark:bg-surface-900">
                                  @for (linea of partida.lineas; track linea.id) {
                                    <tr class="border-b border-surface-50 dark:border-surface-800">
                                      <td class="px-3 py-1.5">
                                        <span [class]="'px-1.5 py-0.5 rounded text-xs font-medium ' + (linea.tipo === 'Material' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700')">
                                          {{ linea.tipo === 'Material' ? 'Mat' : 'M.O.' }}
                                        </span>
                                      </td>
                                      <td class="py-1.5">{{ linea.descripcion }}
                                        @if (linea.categoriaNombre) { <span class="text-surface-400 ml-1">({{ linea.categoriaNombre }})</span> }
                                      </td>
                                      <td class="py-1.5 text-surface-400">{{ linea.unidad }}</td>
                                      <td class="py-1.5 text-right">{{ linea.cantidad | number:'1.0-3' }}</td>
                                      <td class="py-1.5 text-right text-surface-500">{{ linea.precioUnitario | number:'1.2-2' }} \u20AC</td>
                                      <td class="py-1.5 text-right font-medium pr-3">{{ linea.importe | number:'1.2-2' }} \u20AC</td>
                                      @if (auth.isSupervisor() && !p.esAprobado) {
                                        <td class="py-1.5 pr-1 text-right">
                                          <p-button icon="pi pi-pencil" [text]="true" size="small" (onClick)="abrirEditarLinea(linea, partida.id)" />
                                          <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" (onClick)="confirmarEliminarLinea(linea.id)" />
                                        </td>
                                      }
                                    </tr>
                                  }
                                </tbody>
                              </table>
                            } @else {
                              <p class="text-center py-3 text-surface-400 text-xs bg-white dark:bg-surface-900">Sin lineas. Usa los botones + para anadir materiales o mano de obra.</p>
                            }
                          </div>
                        }
                        @if (!partidas().length) {
                          <p class="text-center py-4 text-surface-400 text-sm">No hay partidas. Crea la primera con el boton de arriba.</p>
                        }
                      </div>
                    }
                  </div>
                }

                @if (!presupuestos().length) {
                  <div class="text-center py-10 text-surface-400 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700">
                    <i class="pi pi-file text-3xl block mb-2"></i>No hay presupuestos
                  </div>
                }
              </div>
            </p-tabpanel>

            <!-- TAB MANO DE OBRA -->
            <p-tabpanel value="horas">
              <div class="space-y-4 mt-4">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="font-semibold text-surface-900 dark:text-surface-50">Registros de horas</h3>
                    <p class="text-sm text-surface-500">Total: <strong>{{ totalHorasReales() | number:'1.0-1' }} h</strong> - Coste: <strong>{{ totalCosteHoras() | number:'1.0-0' }} \u20AC</strong></p>
                  </div>
                  @if (auth.isSupervisor()) {
                    <p-button label="Registrar horas" icon="pi pi-plus" size="small" (onClick)="abrirNuevasHoras()" />
                  }
                </div>
                <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                  <p-table [value]="registrosHoras()" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                      <tr>
                        <th>Operario</th><th>Categoria</th><th>Fecha</th>
                        <th class="text-right">Horas</th><th class="text-right">Euros/h</th><th class="text-right">Coste</th><th></th>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-r>
                      <tr>
                        <td class="font-medium">{{ r.operarioNombre }}</td>
                        <td class="text-surface-500 text-sm">{{ r.categoriaNombre }}</td>
                        <td class="text-sm">{{ r.fecha | date:'dd/MM/yyyy' }}</td>
                        <td class="text-right font-medium">{{ r.horas | number:'1.0-1' }} h</td>
                        <td class="text-right text-surface-500">{{ r.costeHoraAplicado | number:'1.2-2' }} \u20AC</td>
                        <td class="text-right font-medium text-blue-600">{{ r.costeTotal | number:'1.2-2' }} \u20AC</td>
                        <td class="text-right">
                          @if (auth.isSupervisor()) {
                            <p-button icon="pi pi-pencil" [text]="true" size="small" (onClick)="abrirEditarHoras(r)" />
                            <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" (onClick)="confirmarEliminarHoras(r.id)" />
                          }
                        </td>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                      <tr><td colspan="7" class="text-center py-8 text-surface-400">No hay registros de horas</td></tr>
                    </ng-template>
                  </p-table>
                </div>
              </div>
            </p-tabpanel>

            <!-- TAB MATERIALES -->
            <p-tabpanel value="materiales">
              <div class="space-y-4 mt-4">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="font-semibold text-surface-900 dark:text-surface-50">Materiales consumidos</h3>
                    <p class="text-sm text-surface-500">Total real: <strong>{{ totalMaterialesReal() | number:'1.0-0' }} \u20AC</strong></p>
                  </div>
                  @if (auth.isSupervisor()) {
                    <p-button label="Anadir material" icon="pi pi-plus" size="small" (onClick)="abrirNuevoMaterial()" />
                  }
                </div>
                <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                  <p-table [value]="materiales()" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                      <tr>
                        <th>Descripcion</th><th>Unidad</th><th>Fecha</th>
                        <th class="text-right">Cantidad</th><th class="text-right">Precio</th><th class="text-right">Importe</th><th></th>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-m>
                      <tr>
                        <td class="font-medium">{{ m.descripcion }}</td>
                        <td class="text-surface-500 text-sm">{{ m.unidad }}</td>
                        <td class="text-sm">{{ m.fecha | date:'dd/MM/yyyy' }}</td>
                        <td class="text-right">{{ m.cantidad | number:'1.0-3' }}</td>
                        <td class="text-right text-surface-500">{{ m.precioUnitario | number:'1.2-2' }} \u20AC</td>
                        <td class="text-right font-medium text-blue-600">{{ m.importeReal | number:'1.2-2' }} \u20AC</td>
                        <td class="text-right">
                          @if (auth.isSupervisor()) {
                            <p-button icon="pi pi-pencil" [text]="true" size="small" (onClick)="abrirEditarMaterial(m)" />
                            <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" (onClick)="confirmarEliminarMaterial(m.id)" />
                          }
                        </td>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                      <tr><td colspan="7" class="text-center py-8 text-surface-400">No hay materiales registrados</td></tr>
                    </ng-template>
                  </p-table>
                </div>
              </div>
            </p-tabpanel>

          </p-tabpanels>
        </p-tabs>
      }
    </div>

    <p-confirmdialog />

    <!-- Dialog Presupuesto -->
    <p-dialog [(visible)]="dlgPresupuesto" header="Nuevo Presupuesto" [modal]="true" appendTo="body" [style]="{width:'min(480px, 95vw)'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div>
          <label class="block text-sm font-medium mb-1.5">Numero de presupuesto *</label>
          <input pInputText [(ngModel)]="presupuestoForm.numero" class="w-full" placeholder="Ej: PPTO-2026-001" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">Fecha *</label>
            <p-datepicker [(ngModel)]="presupuestoForm.fecha" appendTo="body" dateFormat="dd/mm/yy" styleClass="w-full" [showIcon]="true" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Descripcion</label>
            <input pInputText [(ngModel)]="presupuestoForm.descripcion" class="w-full" placeholder="Ej: Revision inicial" />
          </div>
        </div>
        <p class="text-xs text-surface-400">Tras crear el presupuesto podras anadir partidas con materiales y mano de obra.</p>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dlgPresupuesto = false" />
        <p-button label="Crear presupuesto" icon="pi pi-check" (onClick)="guardarPresupuesto()" [loading]="saving()" />
      </ng-template>
    </p-dialog>

    <!-- Dialog Partida -->
    <p-dialog [(visible)]="dlgPartida" [header]="editandoPartidaId() ? 'Editar partida' : 'Nueva partida'" [modal]="true" appendTo="body" [style]="{width:'min(440px, 95vw)'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div>
          <label class="block text-sm font-medium mb-1.5">Nombre *</label>
          <input pInputText [(ngModel)]="partidaForm.nombre" class="w-full" placeholder="Ej: Estructura, Albanileria..." />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Descripcion</label>
          <textarea pTextarea [(ngModel)]="partidaForm.descripcion" rows="2" class="w-full"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Orden</label>
          <p-inputNumber [(ngModel)]="partidaForm.orden" [min]="1" styleClass="w-full" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dlgPartida = false" />
        <p-button [label]="editandoPartidaId() ? 'Guardar' : 'Crear partida'" icon="pi pi-check" (onClick)="guardarPartida()" [loading]="saving()" />
      </ng-template>
    </p-dialog>

    <!-- Dialog Linea -->
    <p-dialog [(visible)]="dlgLinea" [header]="editandoLineaId() ? 'Editar linea' : (tipoLinea() === 'Material' ? 'Anadir material' : 'Anadir mano de obra')"
              [modal]="true" appendTo="body" [style]="{width:'min(480px, 95vw)'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        @if (tipoLinea() === 'ManoObra') {
          <div>
            <label class="block text-sm font-medium mb-1.5">Categoria *</label>
            <p-select [(ngModel)]="lineaForm.categoriaOperarioId" appendTo="body" [options]="categorias()"
                      optionLabel="nombre" optionValue="id" placeholder="Selecciona categoria" styleClass="w-full"
                      (onChange)="onCategoriaLineaChange()" />
          </div>
        }
        <div>
          <label class="block text-sm font-medium mb-1.5">Descripcion *</label>
          <input pInputText [(ngModel)]="lineaForm.descripcion" class="w-full" placeholder="Ej: Cemento Portland, Oficial 1a montaje..." />
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1.5">Unidad</label>
            <input pInputText [(ngModel)]="lineaForm.unidad" class="w-full" placeholder="kg, m2, h..." />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Cantidad</label>
            <p-inputNumber [(ngModel)]="lineaForm.cantidad" [minFractionDigits]="0" [maxFractionDigits]="3" styleClass="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Precio (euros)</label>
            <p-inputNumber [(ngModel)]="lineaForm.precioUnitario" [minFractionDigits]="2" styleClass="w-full" />
          </div>
        </div>
        <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-3 flex justify-between items-center">
          <span class="text-sm text-surface-500">Importe total:</span>
          <span class="font-bold text-blue-600">{{ lineaForm.cantidad * lineaForm.precioUnitario | number:'1.2-2' }} \u20AC</span>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dlgLinea = false" />
        <p-button [label]="editandoLineaId() ? 'Guardar' : 'Anadir linea'" icon="pi pi-check" (onClick)="guardarLinea()" [loading]="saving()" />
      </ng-template>
    </p-dialog>

    <!-- Dialog Horas -->
    <p-dialog [(visible)]="dlgHoras" [header]="editandoHorasId() ? 'Editar horas' : 'Registrar horas'"
              [modal]="true" appendTo="body" [style]="{width:'min(480px, 95vw)'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div>
          <label class="block text-sm font-medium mb-1.5">Operario *</label>
          <p-select [(ngModel)]="horasForm.operarioId" appendTo="body" [options]="operarios()" optionLabel="nombreCompleto" optionValue="id"
                    placeholder="Selecciona operario" styleClass="w-full" (onChange)="onOperarioChange()" [disabled]="!!editandoHorasId()" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">Fecha *</label>
            <p-datepicker [(ngModel)]="horasForm.fecha" appendTo="body" dateFormat="dd/mm/yy" styleClass="w-full" [showIcon]="true" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Horas *</label>
            <p-inputNumber [(ngModel)]="horasForm.horas" [minFractionDigits]="1" [min]="0.5" [max]="24" styleClass="w-full" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Coste euros/hora</label>
          <p-inputNumber [(ngModel)]="horasForm.costeHoraAplicado" [minFractionDigits]="2" styleClass="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Observaciones</label>
          <textarea pTextarea [(ngModel)]="horasForm.observaciones" rows="2" class="w-full"></textarea>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="cerrarDlgHoras()" />
        <p-button [label]="editandoHorasId() ? 'Guardar cambios' : 'Registrar'" icon="pi pi-check" (onClick)="guardarHoras()" [loading]="saving()" />
      </ng-template>
    </p-dialog>

    <!-- Dialog Material -->
    <p-dialog [(visible)]="dlgMaterial" [header]="editandoMaterialId() ? 'Editar material' : 'Anadir material'"
              [modal]="true" appendTo="body" [style]="{width:'min(480px, 95vw)'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div>
          <label class="block text-sm font-medium mb-1.5">Descripcion *</label>
          <input pInputText [(ngModel)]="materialForm.descripcion" class="w-full" placeholder="Ej: Cemento Portland" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">Unidad *</label>
            <input pInputText [(ngModel)]="materialForm.unidad" class="w-full" placeholder="kg, m2, ud..." />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Fecha *</label>
            <p-datepicker [(ngModel)]="materialForm.fecha" appendTo="body" dateFormat="dd/mm/yy" styleClass="w-full" [showIcon]="true" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">Cantidad *</label>
            <p-inputNumber [(ngModel)]="materialForm.cantidad" [minFractionDigits]="0" [maxFractionDigits]="3" styleClass="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Precio unitario (euros) *</label>
            <p-inputNumber [(ngModel)]="materialForm.precioUnitario" [minFractionDigits]="2" styleClass="w-full" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Observaciones</label>
          <textarea pTextarea [(ngModel)]="materialForm.observaciones" rows="2" class="w-full"></textarea>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="cerrarDlgMaterial()" />
        <p-button [label]="editandoMaterialId() ? 'Guardar cambios' : 'Anadir'" icon="pi pi-check" (onClick)="guardarMaterial()" [loading]="saving()" />
      </ng-template>
    </p-dialog>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ObraDetailComponent, { className: "ObraDetailComponent", filePath: "src/app/features/obras/components/obra-detail.component.ts", lineNumber: 507 });
})();
export {
  ObraDetailComponent
};
//# sourceMappingURL=chunk-BTEHFNWX.js.map
