import {
  Dialog,
  DialogModule,
  Select,
  SelectModule
} from "./chunk-5KKJJ7OR.js";
import "./chunk-TAMMXLL3.js";
import {
  TooltipModule
} from "./chunk-L4SADYLI.js";
import {
  AuthService
} from "./chunk-OQT6XM2C.js";
import {
  Textarea,
  TextareaModule
} from "./chunk-5RITPKHD.js";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState
} from "./chunk-E57F7IJQ.js";
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
  ActivatedRoute,
  RouterLink
} from "./chunk-ZWO6PBPF.js";
import {
  CommonModule,
  DatePipe,
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
import "./chunk-WDMUDEB6.js";

// src/app/core/services/tareas.service.ts
var API = "/api";
var TareasService = class _TareasService {
  http = inject(HttpClient);
  base = `${API}/tareas`;
  getByObra(obraId) {
    return this.http.get(`${this.base}/obra/${obraId}`);
  }
  getMisTareas() {
    return this.http.get(`${this.base}/mis-tareas`);
  }
  getById(id) {
    return this.http.get(`${this.base}/${id}`);
  }
  create(data) {
    return this.http.post(this.base, data);
  }
  update(id, data) {
    return this.http.put(`${this.base}/${id}`, data);
  }
  cambiarEstado(id, data) {
    return this.http.patch(`${this.base}/${id}/estado`, data);
  }
  delete(id) {
    return this.http.delete(`${this.base}/${id}`);
  }
  static \u0275fac = function TareasService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TareasService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TareasService, factory: _TareasService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TareasService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/models/index.ts
var EstadoObra;
(function(EstadoObra2) {
  EstadoObra2[EstadoObra2["Planificada"] = 1] = "Planificada";
  EstadoObra2[EstadoObra2["EnCurso"] = 2] = "EnCurso";
  EstadoObra2[EstadoObra2["Pausada"] = 3] = "Pausada";
  EstadoObra2[EstadoObra2["Completada"] = 4] = "Completada";
  EstadoObra2[EstadoObra2["Cancelada"] = 5] = "Cancelada";
})(EstadoObra || (EstadoObra = {}));
var EstadoTarea;
(function(EstadoTarea2) {
  EstadoTarea2[EstadoTarea2["Pendiente"] = 1] = "Pendiente";
  EstadoTarea2[EstadoTarea2["EnProgreso"] = 2] = "EnProgreso";
  EstadoTarea2[EstadoTarea2["Bloqueada"] = 3] = "Bloqueada";
  EstadoTarea2[EstadoTarea2["Completada"] = 4] = "Completada";
  EstadoTarea2[EstadoTarea2["Cancelada"] = 5] = "Cancelada";
})(EstadoTarea || (EstadoTarea = {}));
var PrioridadTarea;
(function(PrioridadTarea2) {
  PrioridadTarea2[PrioridadTarea2["Baja"] = 1] = "Baja";
  PrioridadTarea2[PrioridadTarea2["Media"] = 2] = "Media";
  PrioridadTarea2[PrioridadTarea2["Alta"] = 3] = "Alta";
  PrioridadTarea2[PrioridadTarea2["Critica"] = 4] = "Critica";
})(PrioridadTarea || (PrioridadTarea = {}));
var EstadoMaterial;
(function(EstadoMaterial2) {
  EstadoMaterial2[EstadoMaterial2["Pendiente"] = 1] = "Pendiente";
  EstadoMaterial2[EstadoMaterial2["Pedido"] = 2] = "Pedido";
  EstadoMaterial2[EstadoMaterial2["Recibido"] = 3] = "Recibido";
  EstadoMaterial2[EstadoMaterial2["Instalado"] = 4] = "Instalado";
})(EstadoMaterial || (EstadoMaterial = {}));

// src/app/features/tareas/store/tareas.store.ts
var initialState = {
  tareas: [],
  loading: false,
  error: null,
  currentObraId: null
};
var TareasStore = signalStore({ providedIn: "root" }, withState(initialState), withComputed(({ tareas }) => ({
  pendientes: computed(() => tareas().filter((t) => t.estado === EstadoTarea.Pendiente)),
  enProgreso: computed(() => tareas().filter((t) => t.estado === EstadoTarea.EnProgreso)),
  bloqueadas: computed(() => tareas().filter((t) => t.estado === EstadoTarea.Bloqueada)),
  completadas: computed(() => tareas().filter((t) => t.estado === EstadoTarea.Completada)),
  horasTotalesEstimadas: computed(() => tareas().reduce((s, t) => s + t.horasEstimadas, 0)),
  horasTotalesReales: computed(() => tareas().reduce((s, t) => s + t.horasReales, 0))
})), withMethods((store, service = inject(TareasService)) => {
  const _reload = () => {
    const obraId = store.currentObraId();
    if (obraId) {
      service.getByObra(obraId).subscribe({
        next: (tareas) => patchState(store, { tareas, loading: false }),
        error: () => patchState(store, { loading: false, error: "Error al cargar tareas" })
      });
    }
  };
  return {
    loadByObra(obraId) {
      patchState(store, { loading: true, currentObraId: obraId });
      service.getByObra(obraId).subscribe({
        next: (tareas) => patchState(store, { tareas, loading: false }),
        error: () => patchState(store, { loading: false, error: "Error al cargar tareas" })
      });
    },
    createTarea(data) {
      service.create(data).subscribe({
        next: () => _reload(),
        error: () => patchState(store, { error: "Error al crear tarea" })
      });
    },
    updateTarea(payload) {
      service.update(payload.id, payload.data).subscribe({
        next: () => _reload(),
        error: () => patchState(store, { error: "Error al actualizar tarea" })
      });
    },
    cambiarEstado(payload) {
      service.cambiarEstado(payload.id, payload.data).subscribe({
        next: () => _reload(),
        error: () => patchState(store, { error: "Error al cambiar estado" })
      });
    },
    deleteTarea(id) {
      service.delete(id).subscribe({
        next: () => _reload(),
        error: () => patchState(store, { error: "Error al eliminar tarea" })
      });
    }
  };
}));

// src/app/features/tareas/components/tareas-kanban.component.ts
var _c0 = (a0) => ["/obras", a0];
var _c1 = () => ({ width: "520px" });
var _forTrack0 = ($index, $item) => $item.estado;
var _forTrack1 = ($index, $item) => $item.id;
function TareasKanbanComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 19);
    \u0275\u0275listener("onClick", function TareasKanbanComponent_Conditional_10_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openNew());
    });
    \u0275\u0275elementEnd();
  }
}
function TareasKanbanComponent_For_13_For_9_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 35);
    \u0275\u0275listener("click", function TareasKanbanComponent_For_13_For_9_Conditional_4_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      const tarea_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r1.deleteTarea(tarea_r6));
    });
    \u0275\u0275element(1, "i", 36);
    \u0275\u0275elementEnd();
  }
}
function TareasKanbanComponent_For_13_For_9_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tarea_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tarea_r6.descripcion);
  }
}
function TareasKanbanComponent_For_13_For_9_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275element(1, "i", 37);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tarea_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.estaVencida(tarea_r6.fechaLimite) ? "text-red-500" : "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(3, 3, tarea_r6.fechaLimite, "dd/MM"), " ");
  }
}
function TareasKanbanComponent_For_13_For_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275listener("dragstart", function TareasKanbanComponent_For_13_For_9_Template_div_dragstart_0_listener($event) {
      const tarea_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onDragStart($event, tarea_r6));
    })("click", function TareasKanbanComponent_For_13_For_9_Template_div_click_0_listener() {
      const tarea_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openEdit(tarea_r6));
    });
    \u0275\u0275elementStart(1, "div", 28)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, TareasKanbanComponent_For_13_For_9_Conditional_4_Template, 2, 0, "button", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h4", 30);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, TareasKanbanComponent_For_13_For_9_Conditional_7_Template, 2, 1, "p", 31);
    \u0275\u0275elementStart(8, "div", 32)(9, "span");
    \u0275\u0275element(10, "i", 33);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275template(12, TareasKanbanComponent_For_13_For_9_Conditional_12_Template, 4, 6, "span", 34);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const tarea_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("px-2 py-0.5 rounded text-xs font-medium " + ctx_r1.prioridadBadge(tarea_r6.prioridad));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tarea_r6.prioridadNombre, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.auth.isSupervisor() ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(tarea_r6.titulo);
    \u0275\u0275advance();
    \u0275\u0275conditional(tarea_r6.descripcion ? 7 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", tarea_r6.horasReales, "h / ", tarea_r6.horasEstimadas, "h");
    \u0275\u0275advance();
    \u0275\u0275conditional(tarea_r6.fechaLimite ? 12 : -1);
  }
}
function TareasKanbanComponent_For_13_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275text(1, " Arrastra tareas aqu\xED ");
    \u0275\u0275elementEnd();
  }
}
function TareasKanbanComponent_For_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275listener("dragover", function TareasKanbanComponent_For_13_Template_div_dragover_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      return \u0275\u0275resetView($event.preventDefault());
    })("drop", function TareasKanbanComponent_For_13_Template_div_drop_0_listener($event) {
      const col_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onDrop($event, col_r4.estado));
    });
    \u0275\u0275elementStart(1, "div", 21)(2, "div", 22);
    \u0275\u0275element(3, "div");
    \u0275\u0275elementStart(4, "span", 23);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 24);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275repeaterCreate(8, TareasKanbanComponent_For_13_For_9_Template, 13, 9, "div", 25, _forTrack1);
    \u0275\u0275template(10, TareasKanbanComponent_For_13_Conditional_10_Template, 2, 0, "div", 26);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const col_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275classMap("w-2.5 h-2.5 rounded-full " + col_r4.color);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(col_r4.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.tareasEnEstado(col_r4.estado).length, " ");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.tareasEnEstado(col_r4.estado));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.tareasEnEstado(col_r4.estado).length === 0 ? 10 : -1);
  }
}
function TareasKanbanComponent_ng_template_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 38);
    \u0275\u0275listener("onClick", function TareasKanbanComponent_ng_template_33_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.dialogVisible = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 39);
    \u0275\u0275listener("onClick", function TareasKanbanComponent_ng_template_33_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveTarea());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275property("label", ctx_r1.editingTarea() ? "Guardar" : "Crear")("disabled", !ctx_r1.tareaForm.titulo);
  }
}
var TareasKanbanComponent = class _TareasKanbanComponent {
  store = inject(TareasStore);
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  msg = inject(MessageService);
  obraId = signal("");
  dialogVisible = false;
  editingTarea = signal(null);
  draggingTarea = null;
  tareaForm = { titulo: "", descripcion: "", prioridad: PrioridadTarea.Media, horasEstimadas: 0 };
  columns = [
    { label: "Pendiente", estado: EstadoTarea.Pendiente, color: "bg-slate-400", headerColor: "bg-slate-100" },
    { label: "En Progreso", estado: EstadoTarea.EnProgreso, color: "bg-blue-500", headerColor: "bg-blue-100" },
    { label: "Bloqueada", estado: EstadoTarea.Bloqueada, color: "bg-red-500", headerColor: "bg-red-100" },
    { label: "Completada", estado: EstadoTarea.Completada, color: "bg-green-500", headerColor: "bg-green-100" }
  ];
  prioridadOptions = [
    { label: "Baja", value: PrioridadTarea.Baja },
    { label: "Media", value: PrioridadTarea.Media },
    { label: "Alta", value: PrioridadTarea.Alta },
    { label: "Cr\xEDtica", value: PrioridadTarea.Critica }
  ];
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    this.obraId.set(id);
    this.store.loadByObra(id);
  }
  tareasEnEstado(estado) {
    return this.store.tareas().filter((t) => t.estado === estado);
  }
  onDragStart(event, tarea) {
    this.draggingTarea = tarea;
    event.dataTransfer?.setData("text/plain", tarea.id);
  }
  onDrop(event, nuevoEstado) {
    event.preventDefault();
    if (this.draggingTarea && this.draggingTarea.estado !== nuevoEstado) {
      this.store.cambiarEstado({ id: this.draggingTarea.id, data: { nuevoEstado } });
    }
    this.draggingTarea = null;
  }
  openNew() {
    this.editingTarea.set(null);
    this.tareaForm = { titulo: "", descripcion: "", prioridad: PrioridadTarea.Media, horasEstimadas: 0 };
    this.dialogVisible = true;
  }
  openEdit(tarea) {
    this.editingTarea.set(tarea);
    this.tareaForm = { titulo: tarea.titulo, descripcion: tarea.descripcion ?? "", prioridad: tarea.prioridad, horasEstimadas: tarea.horasEstimadas };
    this.dialogVisible = true;
  }
  saveTarea() {
    if (this.editingTarea()) {
      this.store.updateTarea({
        id: this.editingTarea().id,
        data: {
          titulo: this.tareaForm.titulo,
          descripcion: this.tareaForm.descripcion,
          prioridad: this.tareaForm.prioridad,
          horasEstimadas: this.tareaForm.horasEstimadas,
          fechaLimite: void 0,
          cuadrillaId: void 0,
          usuarioAsignadoId: void 0
        }
      });
      this.msg.add({ severity: "success", summary: "Guardado", detail: "Tarea actualizada" });
    } else {
      this.store.createTarea({
        obraId: this.obraId(),
        titulo: this.tareaForm.titulo,
        descripcion: this.tareaForm.descripcion,
        prioridad: this.tareaForm.prioridad,
        horasEstimadas: this.tareaForm.horasEstimadas
      });
      this.msg.add({ severity: "success", summary: "Creada", detail: "Tarea creada" });
    }
    this.dialogVisible = false;
  }
  deleteTarea(tarea) {
    this.store.deleteTarea(tarea.id);
    this.msg.add({ severity: "success", summary: "Eliminada", detail: tarea.titulo });
  }
  estaVencida(fecha) {
    return new Date(fecha) < /* @__PURE__ */ new Date();
  }
  prioridadBadge(p) {
    const map = {
      1: "badge-baja",
      2: "badge-media",
      3: "badge-alta",
      4: "badge-critica"
    };
    return map[p] ?? "";
  }
  static \u0275fac = function TareasKanbanComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TareasKanbanComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TareasKanbanComponent, selectors: [["app-tareas-kanban"]], decls: 34, vars: 20, consts: [[1, "space-y-4", "animate-fade-in"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-3"], [3, "routerLink"], ["icon", "pi pi-arrow-left", "severity", "secondary", "size", "small", 3, "text"], [1, "text-2xl", "font-bold", "text-surface-900", "dark:text-surface-50"], [1, "text-surface-500", "text-sm", "mt-0.5"], ["label", "Nueva Tarea", "icon", "pi pi-plus", "size", "small"], [1, "flex", "gap-4", "overflow-x-auto", "pb-4"], [1, "kanban-col", "flex-shrink-0", "w-72"], [3, "visibleChange", "visible", "header", "modal", "draggable"], [1, "space-y-4", "pt-2"], [1, "block", "text-sm", "font-medium", "text-surface-700", "dark:text-surface-300", "mb-1.5"], ["pInputText", "", "placeholder", "T\xEDtulo de la tarea", 1, "w-full", 3, "ngModelChange", "ngModel"], ["pTextarea", "", "rows", "3", "placeholder", "Descripci\xF3n opcional...", 1, "w-full", 3, "ngModelChange", "ngModel"], [1, "grid", "grid-cols-2", "gap-4"], ["appendTo", "body", "optionLabel", "label", "optionValue", "value", "styleClass", "w-full", 3, "ngModelChange", "ngModel", "options"], ["styleClass", "w-full", "suffix", " h", 3, "ngModelChange", "ngModel", "min"], ["pTemplate", "footer"], ["label", "Nueva Tarea", "icon", "pi pi-plus", "size", "small", 3, "onClick"], [1, "kanban-col", "flex-shrink-0", "w-72", 3, "dragover", "drop"], [1, "flex", "items-center", "justify-between", "mb-3"], [1, "flex", "items-center", "gap-2"], [1, "text-sm", "font-semibold", "text-surface-700", "dark:text-surface-300"], [1, "text-xs", "bg-surface-200", "dark:bg-surface-700", "text-surface-600", "dark:text-surface-400", "px-1.5", "py-0.5", "rounded-full"], ["draggable", "true", 1, "kanban-card"], [1, "border-2", "border-dashed", "border-surface-300", "dark:border-surface-600", "rounded-lg", "p-6", "text-center", "text-surface-400", "text-xs"], ["draggable", "true", 1, "kanban-card", 3, "dragstart", "click"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "text-surface-400", "hover:text-red-500", "transition-colors", "opacity-0", "group-hover:opacity-100"], [1, "text-sm", "font-semibold", "text-surface-900", "dark:text-surface-100", "mb-1", "line-clamp-2"], [1, "text-xs", "text-surface-500", "dark:text-surface-400", "line-clamp-2", "mb-2"], [1, "flex", "items-center", "justify-between", "text-xs", "text-surface-400", "mt-2", "pt-2", "border-t", "border-surface-100", "dark:border-surface-700"], [1, "pi", "pi-clock", "mr-1"], [3, "class"], [1, "text-surface-400", "hover:text-red-500", "transition-colors", "opacity-0", "group-hover:opacity-100", 3, "click"], [1, "pi", "pi-times", "text-xs"], [1, "pi", "pi-calendar", "mr-1"], ["label", "Cancelar", "severity", "secondary", 3, "onClick", "outlined"], ["icon", "pi pi-check", 3, "onClick", "label", "disabled"]], template: function TareasKanbanComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "a", 3);
      \u0275\u0275element(4, "p-button", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div")(6, "h1", 5);
      \u0275\u0275text(7, "Kanban de Tareas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "p", 6);
      \u0275\u0275text(9);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(10, TareasKanbanComponent_Conditional_10_Template, 1, 0, "p-button", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 8);
      \u0275\u0275repeaterCreate(12, TareasKanbanComponent_For_13_Template, 11, 5, "div", 9, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "p-dialog", 10);
      \u0275\u0275twoWayListener("visibleChange", function TareasKanbanComponent_Template_p_dialog_visibleChange_14_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.dialogVisible, $event) || (ctx.dialogVisible = $event);
        return $event;
      });
      \u0275\u0275elementStart(15, "div", 11)(16, "div")(17, "label", 12);
      \u0275\u0275text(18, "T\xEDtulo *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "input", 13);
      \u0275\u0275twoWayListener("ngModelChange", function TareasKanbanComponent_Template_input_ngModelChange_19_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tareaForm.titulo, $event) || (ctx.tareaForm.titulo = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div")(21, "label", 12);
      \u0275\u0275text(22, "Descripci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "textarea", 14);
      \u0275\u0275twoWayListener("ngModelChange", function TareasKanbanComponent_Template_textarea_ngModelChange_23_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tareaForm.descripcion, $event) || (ctx.tareaForm.descripcion = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "div", 15)(25, "div")(26, "label", 12);
      \u0275\u0275text(27, "Prioridad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "p-select", 16);
      \u0275\u0275twoWayListener("ngModelChange", function TareasKanbanComponent_Template_p_select_ngModelChange_28_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tareaForm.prioridad, $event) || (ctx.tareaForm.prioridad = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "div")(30, "label", 12);
      \u0275\u0275text(31, "Horas estimadas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "p-inputNumber", 17);
      \u0275\u0275twoWayListener("ngModelChange", function TareasKanbanComponent_Template_p_inputNumber_ngModelChange_32_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tareaForm.horasEstimadas, $event) || (ctx.tareaForm.horasEstimadas = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(33, TareasKanbanComponent_ng_template_33_Template, 2, 3, "ng-template", 18);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(17, _c0, ctx.obraId()));
      \u0275\u0275advance();
      \u0275\u0275property("text", true);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate2(" ", ctx.store.horasTotalesReales(), "h reales \xB7 ", ctx.store.horasTotalesEstimadas(), "h estimadas ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.auth.isSupervisor() ? 10 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.columns);
      \u0275\u0275advance(2);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(19, _c1));
      \u0275\u0275twoWayProperty("visible", ctx.dialogVisible);
      \u0275\u0275property("header", ctx.editingTarea() ? "Editar Tarea" : "Nueva Tarea")("modal", true)("draggable", false);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.tareaForm.titulo);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.tareaForm.descripcion);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.tareaForm.prioridad);
      \u0275\u0275property("options", ctx.prioridadOptions);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.tareaForm.horasEstimadas);
      \u0275\u0275property("min", 0);
    }
  }, dependencies: [CommonModule, DatePipe, RouterLink, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, ButtonModule, Button, PrimeTemplate, DialogModule, Dialog, InputTextModule, InputText, SelectModule, Select, TextareaModule, Textarea, InputNumberModule, InputNumber, TooltipModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TareasKanbanComponent, [{
    type: Component,
    args: [{
      selector: "app-tareas-kanban",
      standalone: true,
      imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        TextareaModule,
        InputNumberModule,
        TooltipModule
      ],
      template: `
    <div class="space-y-4 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <a [routerLink]="['/obras', obraId()]">
            <p-button icon="pi pi-arrow-left" [text]="true" severity="secondary" size="small" />
          </a>
          <div>
            <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Kanban de Tareas</h1>
            <p class="text-surface-500 text-sm mt-0.5">
              {{ store.horasTotalesReales() }}h reales \xB7 {{ store.horasTotalesEstimadas() }}h estimadas
            </p>
          </div>
        </div>
        @if (auth.isSupervisor()) {
          <p-button label="Nueva Tarea" icon="pi pi-plus" size="small" (onClick)="openNew()" />
        }
      </div>

      <!-- Kanban board -->
      <div class="flex gap-4 overflow-x-auto pb-4">
        @for (col of columns; track col.estado) {
          <div class="kanban-col flex-shrink-0 w-72"
               (dragover)="$event.preventDefault()"
               (drop)="onDrop($event, col.estado)">

            <!-- Column header -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div [class]="'w-2.5 h-2.5 rounded-full ' + col.color"></div>
                <span class="text-sm font-semibold text-surface-700 dark:text-surface-300">{{ col.label }}</span>
                <span class="text-xs bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400 px-1.5 py-0.5 rounded-full">
                  {{ tareasEnEstado(col.estado).length }}
                </span>
              </div>
            </div>

            <!-- Cards -->
            @for (tarea of tareasEnEstado(col.estado); track tarea.id) {
              <div class="kanban-card"
                   draggable="true"
                   (dragstart)="onDragStart($event, tarea)"
                   (click)="openEdit(tarea)">

                <!-- Priority badge -->
                <div class="flex items-center justify-between mb-2">
                  <span [class]="'px-2 py-0.5 rounded text-xs font-medium ' + prioridadBadge(tarea.prioridad)">
                    {{ tarea.prioridadNombre }}
                  </span>
                  @if (auth.isSupervisor()) {
                    <button (click)="$event.stopPropagation(); deleteTarea(tarea)"
                            class="text-surface-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <i class="pi pi-times text-xs"></i>
                    </button>
                  }
                </div>

                <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-1 line-clamp-2">{{ tarea.titulo }}</h4>
                @if (tarea.descripcion) {
                  <p class="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 mb-2">{{ tarea.descripcion }}</p>
                }

                <div class="flex items-center justify-between text-xs text-surface-400 mt-2 pt-2 border-t border-surface-100 dark:border-surface-700">
                  <span><i class="pi pi-clock mr-1"></i>{{ tarea.horasReales }}h / {{ tarea.horasEstimadas }}h</span>
                  @if (tarea.fechaLimite) {
                    <span [class]="estaVencida(tarea.fechaLimite) ? 'text-red-500' : ''">
                      <i class="pi pi-calendar mr-1"></i>{{ tarea.fechaLimite | date:'dd/MM' }}
                    </span>
                  }
                </div>
              </div>
            }

            <!-- Drop zone hint -->
            @if (tareasEnEstado(col.estado).length === 0) {
              <div class="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg p-6 text-center text-surface-400 text-xs">
                Arrastra tareas aqu\xED
              </div>
            }
          </div>
        }
      </div>
    </div>

    <!-- Dialog nueva/editar tarea -->
    <p-dialog [(visible)]="dialogVisible" [header]="editingTarea() ? 'Editar Tarea' : 'Nueva Tarea'"
              [modal]="true" [style]="{width: '520px'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">T\xEDtulo *</label>
          <input pInputText [(ngModel)]="tareaForm.titulo" class="w-full" placeholder="T\xEDtulo de la tarea" />
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Descripci\xF3n</label>
          <textarea pTextarea [(ngModel)]="tareaForm.descripcion" rows="3" class="w-full" placeholder="Descripci\xF3n opcional..."></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Prioridad</label>
            <p-select [(ngModel)]="tareaForm.prioridad" appendTo="body" [options]="prioridadOptions"
                        optionLabel="label" optionValue="value" styleClass="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Horas estimadas</label>
            <p-inputNumber [(ngModel)]="tareaForm.horasEstimadas" [min]="0" styleClass="w-full" suffix=" h" />
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dialogVisible = false" />
        <p-button [label]="editingTarea() ? 'Guardar' : 'Crear'" icon="pi pi-check"
                  (onClick)="saveTarea()" [disabled]="!tareaForm.titulo" />
      </ng-template>
    </p-dialog>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TareasKanbanComponent, { className: "TareasKanbanComponent", filePath: "src/app/features/tareas/components/tareas-kanban.component.ts", lineNumber: 143 });
})();
export {
  TareasKanbanComponent
};
//# sourceMappingURL=chunk-XNTO4STU.js.map
