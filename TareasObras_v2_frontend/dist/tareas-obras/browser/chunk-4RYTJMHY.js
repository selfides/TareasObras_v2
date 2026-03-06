import {
  Password,
  PasswordModule
} from "./chunk-4QR5UYFX.js";
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
import {
  TagModule
} from "./chunk-27HUIXQT.js";
import "./chunk-X6AQCLEH.js";
import "./chunk-RMMU6WOA.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  InputText,
  InputTextModule,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
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
  DatePipe,
  HttpClient,
  MessageService,
  PrimeTemplate
} from "./chunk-LHMGNLDW.js";
import {
  Component,
  Injectable,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
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

// src/app/core/services/usuarios.service.ts
var API = "/api";
var UsuariosService = class _UsuariosService {
  http = inject(HttpClient);
  getAll() {
    return this.http.get(`${API}/usuarios`);
  }
  register(data) {
    return this.http.post(`${API}/auth/register`, data);
  }
  changePassword(currentPassword, newPassword) {
    return this.http.post(`${API}/auth/change-password`, { currentPassword, newPassword });
  }
  static \u0275fac = function UsuariosService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UsuariosService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UsuariosService, factory: _UsuariosService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UsuariosService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/features/usuarios/components/usuarios.component.ts
var _c0 = () => ({ width: "480px" });
function UsuariosComponent_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Rol");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Alta");
    \u0275\u0275elementEnd()();
  }
}
function UsuariosComponent_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 21);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td")(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td")(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 22);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const u_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", u_r1.nombre, " ", u_r1.apellidos, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r1.email);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("px-2 py-0.5 rounded-full text-xs font-medium " + ctx_r1.rolBadge(u_r1.rol));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(u_r1.rol);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("px-2 py-0.5 rounded-full text-xs font-medium " + (u_r1.activo ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", u_r1.activo ? "Activo" : "Inactivo", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(13, 10, u_r1.createdAt, "dd/MM/yyyy"));
  }
}
function UsuariosComponent_ng_template_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 23);
    \u0275\u0275element(2, "i", 24);
    \u0275\u0275text(3, "No hay usuarios ");
    \u0275\u0275elementEnd()();
  }
}
function UsuariosComponent_ng_template_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 25);
    \u0275\u0275listener("onClick", function UsuariosComponent_ng_template_37_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.dialogVisible = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 26);
    \u0275\u0275listener("onClick", function UsuariosComponent_ng_template_37_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.crear());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.form.invalid)("loading", ctx_r1.saving());
  }
}
var UsuariosComponent = class _UsuariosComponent {
  service = inject(UsuariosService);
  msg = inject(MessageService);
  fb = inject(FormBuilder);
  usuarios = signal([]);
  loading = signal(true);
  saving = signal(false);
  dialogVisible = false;
  rolOptions = [
    { label: "Admin", value: "Admin" },
    { label: "Supervisor", value: "Supervisor" },
    { label: "Operario", value: "Operario" }
  ];
  form = this.fb.group({
    nombre: ["", Validators.required],
    apellidos: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
    rol: ["Operario", Validators.required]
  });
  ngOnInit() {
    this.service.getAll().subscribe({
      next: (u) => {
        this.usuarios.set(u);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  crear() {
    if (this.form.invalid)
      return;
    this.saving.set(true);
    const v = this.form.value;
    this.service.register({ email: v.email, password: v.password, nombre: v.nombre, apellidos: v.apellidos, rol: v.rol }).subscribe({
      next: () => {
        this.msg.add({ severity: "success", summary: "Usuario creado", detail: v.email });
        this.dialogVisible = false;
        this.saving.set(false);
        this.ngOnInit();
      },
      error: () => {
        this.saving.set(false);
        this.msg.add({ severity: "error", summary: "Error", detail: "No se pudo crear el usuario" });
      }
    });
  }
  rolBadge(rol) {
    const map = {
      "Admin": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      "Supervisor": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "Operario": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    };
    return map[rol] ?? "";
  }
  static \u0275fac = function UsuariosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UsuariosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UsuariosComponent, selectors: [["app-usuarios"]], decls: 38, vars: 12, consts: [[1, "space-y-5", "animate-fade-in"], [1, "flex", "items-center", "justify-between"], [1, "text-2xl", "font-bold", "text-surface-900", "dark:text-surface-50"], [1, "text-surface-500", "dark:text-surface-400", "text-sm", "mt-0.5"], ["label", "Nuevo Usuario", "icon", "pi pi-user-plus", "size", "small", 3, "onClick"], [1, "bg-white", "dark:bg-surface-900", "rounded-xl", "border", "border-surface-200", "dark:border-surface-700", "overflow-hidden"], ["styleClass", "p-datatable-sm", 3, "value", "loading"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], ["header", "Nuevo Usuario", 3, "visibleChange", "visible", "modal", "draggable"], [1, "space-y-4", "pt-2", 3, "formGroup"], [1, "grid", "grid-cols-2", "gap-4"], [1, "block", "text-sm", "font-medium", "text-surface-700", "dark:text-surface-300", "mb-1.5"], ["pInputText", "", "formControlName", "nombre", 1, "w-full"], ["pInputText", "", "formControlName", "apellidos", 1, "w-full"], ["pInputText", "", "formControlName", "email", "type", "email", 1, "w-full"], ["formControlName", "password", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "feedback", "toggleMask"], ["formControlName", "rol", "appendTo", "body", "optionLabel", "label", "optionValue", "value", "styleClass", "w-full", "placeholder", "Selecciona rol", 3, "options"], ["pTemplate", "footer"], [1, "font-medium", "text-surface-900", "dark:text-surface-100"], [1, "text-surface-500", "dark:text-surface-400", "text-sm"], [1, "text-sm", "text-surface-400"], ["colspan", "5", 1, "text-center", "py-10", "text-surface-400"], [1, "pi", "pi-users", "text-3xl", "block", "mb-2"], ["label", "Cancelar", "severity", "secondary", 3, "onClick", "outlined"], ["label", "Crear Usuario", "icon", "pi pi-check", 3, "onClick", "disabled", "loading"]], template: function UsuariosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
      \u0275\u0275text(4, "Usuarios");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 3);
      \u0275\u0275text(6, "Gesti\xF3n de accesos y roles");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "p-button", 4);
      \u0275\u0275listener("onClick", function UsuariosComponent_Template_p_button_onClick_7_listener() {
        return ctx.dialogVisible = true;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 5)(9, "p-table", 6);
      \u0275\u0275template(10, UsuariosComponent_ng_template_10_Template, 11, 0, "ng-template", 7)(11, UsuariosComponent_ng_template_11_Template, 14, 13, "ng-template", 8)(12, UsuariosComponent_ng_template_12_Template, 4, 0, "ng-template", 9);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(13, "p-dialog", 10);
      \u0275\u0275twoWayListener("visibleChange", function UsuariosComponent_Template_p_dialog_visibleChange_13_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.dialogVisible, $event) || (ctx.dialogVisible = $event);
        return $event;
      });
      \u0275\u0275elementStart(14, "form", 11)(15, "div", 12)(16, "div")(17, "label", 13);
      \u0275\u0275text(18, "Nombre *");
      \u0275\u0275elementEnd();
      \u0275\u0275element(19, "input", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "div")(21, "label", 13);
      \u0275\u0275text(22, "Apellidos *");
      \u0275\u0275elementEnd();
      \u0275\u0275element(23, "input", 15);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "div")(25, "label", 13);
      \u0275\u0275text(26, "Email *");
      \u0275\u0275elementEnd();
      \u0275\u0275element(27, "input", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "div", 12)(29, "div")(30, "label", 13);
      \u0275\u0275text(31, "Contrase\xF1a *");
      \u0275\u0275elementEnd();
      \u0275\u0275element(32, "p-password", 17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "div")(34, "label", 13);
      \u0275\u0275text(35, "Rol *");
      \u0275\u0275elementEnd();
      \u0275\u0275element(36, "p-select", 18);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(37, UsuariosComponent_ng_template_37_Template, 2, 3, "ng-template", 19);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("value", ctx.usuarios())("loading", ctx.loading());
      \u0275\u0275advance(4);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(11, _c0));
      \u0275\u0275twoWayProperty("visible", ctx.dialogVisible);
      \u0275\u0275property("modal", true)("draggable", false);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(18);
      \u0275\u0275property("feedback", true)("toggleMask", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.rolOptions);
    }
  }, dependencies: [CommonModule, DatePipe, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, ReactiveFormsModule, FormGroupDirective, FormControlName, TableModule, Table, PrimeTemplate, ButtonModule, Button, DialogModule, Dialog, InputTextModule, InputText, SelectModule, Select, PasswordModule, Password, TagModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UsuariosComponent, [{
    type: Component,
    args: [{
      selector: "app-usuarios",
      standalone: true,
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        PasswordModule,
        TagModule
      ],
      template: `
    <div class="space-y-5 animate-fade-in">

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Usuarios</h1>
          <p class="text-surface-500 dark:text-surface-400 text-sm mt-0.5">Gesti\xF3n de accesos y roles</p>
        </div>
        <p-button label="Nuevo Usuario" icon="pi pi-user-plus" size="small" (onClick)="dialogVisible = true" />
      </div>

      <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <p-table [value]="usuarios()" [loading]="loading()" styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Alta</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-u>
            <tr>
              <td class="font-medium text-surface-900 dark:text-surface-100">{{ u.nombre }} {{ u.apellidos }}</td>
              <td class="text-surface-500 dark:text-surface-400 text-sm">{{ u.email }}</td>
              <td>
                <span [class]="'px-2 py-0.5 rounded-full text-xs font-medium ' + rolBadge(u.rol)">{{ u.rol }}</span>
              </td>
              <td>
                <span [class]="'px-2 py-0.5 rounded-full text-xs font-medium ' + (u.activo ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700')">
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="text-sm text-surface-400">{{ u.createdAt | date:'dd/MM/yyyy' }}</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr><td colspan="5" class="text-center py-10 text-surface-400">
              <i class="pi pi-users text-3xl block mb-2"></i>No hay usuarios
            </td></tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <!-- Dialog nuevo usuario -->
    <p-dialog [(visible)]="dialogVisible" header="Nuevo Usuario" [modal]="true"
              [style]="{width:'480px'}" [draggable]="false">
      <form [formGroup]="form" class="space-y-4 pt-2">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Nombre *</label>
            <input pInputText formControlName="nombre" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Apellidos *</label>
            <input pInputText formControlName="apellidos" class="w-full" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email *</label>
          <input pInputText formControlName="email" type="email" class="w-full" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Contrase\xF1a *</label>
            <p-password formControlName="password" [feedback]="true" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Rol *</label>
            <p-select formControlName="rol" appendTo="body" [options]="rolOptions" optionLabel="label" optionValue="value"
                        styleClass="w-full" placeholder="Selecciona rol" />
          </div>
        </div>
      </form>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dialogVisible = false" />
        <p-button label="Crear Usuario" icon="pi pi-check" (onClick)="crear()" [disabled]="form.invalid" [loading]="saving()" />
      </ng-template>
    </p-dialog>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UsuariosComponent, { className: "UsuariosComponent", filePath: "src/app/features/usuarios/components/usuarios.component.ts", lineNumber: 103 });
})();
export {
  UsuariosComponent
};
//# sourceMappingURL=chunk-4RYTJMHY.js.map
