import {
  Textarea,
  TextareaModule
} from "./chunk-5RITPKHD.js";
import {
  CardModule
} from "./chunk-BK6HRP2L.js";
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
  FormBuilder,
  FormControlName,
  FormGroupDirective,
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
import "./chunk-HQ4N7DEE.js";
import {
  Button,
  ButtonModule
} from "./chunk-UD3KEAH2.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-ZWO6PBPF.js";
import {
  CommonModule,
  MessageService
} from "./chunk-LHMGNLDW.js";
import {
  Component,
  HostListener,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresolveWindow,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-UYBFJOBI.js";
import {
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/features/obras/components/obra-form.component.ts
function ObraFormComponent_Conditional_12_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1, " C\xF3digo obligatorio (m\xE1x. 20 caracteres) ");
    \u0275\u0275elementEnd();
  }
}
function ObraFormComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "label", 9);
    \u0275\u0275text(2, "C\xF3digo *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 21);
    \u0275\u0275template(4, ObraFormComponent_Conditional_12_Conditional_4_Template, 2, 0, "p", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.invalid("codigo") ? 4 : -1);
  }
}
function ObraFormComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1, "Nombre obligatorio");
    \u0275\u0275elementEnd();
  }
}
function ObraFormComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1, "Fecha de inicio obligatoria");
    \u0275\u0275elementEnd();
  }
}
function ObraFormComponent_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1, "Presupuesto inv\xE1lido");
    \u0275\u0275elementEnd();
  }
}
var ObraFormComponent = class _ObraFormComponent {
  store = inject(ObrasStore);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  msg = inject(MessageService);
  isEdit = signal(false);
  loading = signal(false);
  obraId = signal(null);
  form = this.fb.group({
    codigo: ["", [Validators.required, Validators.maxLength(20)]],
    nombre: ["", [Validators.required, Validators.maxLength(200)]],
    descripcion: [""],
    cliente: [""],
    direccion: [""],
    fechaInicio: [null, Validators.required],
    fechaFinPrevista: [null],
    presupuestoEstimado: [0, [Validators.required, Validators.min(0)]]
  });
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEdit.set(true);
      this.obraId.set(id);
      this.form.get("codigo")?.disable();
      this.store.loadObraById(id);
      setTimeout(() => {
        const obra = this.store.selectedObra();
        if (obra) {
          this.form.patchValue({
            nombre: obra.nombre,
            descripcion: obra.descripcion,
            cliente: obra.cliente,
            direccion: obra.direccion,
            presupuestoEstimado: obra.presupuestoEstimado,
            fechaInicio: new Date(obra.fechaInicio),
            fechaFinPrevista: obra.fechaFinPrevista ? new Date(obra.fechaFinPrevista) : null
          });
        }
      }, 500);
    }
  }
  invalid(field) {
    const c = this.form.get(field);
    return c?.invalid && c?.touched;
  }
  submit() {
    if (this.form.invalid)
      return;
    this.loading.set(true);
    const v = this.form.value;
    const payload = {
      nombre: v.nombre,
      descripcion: v.descripcion ?? void 0,
      cliente: v.cliente ?? void 0,
      direccion: v.direccion ?? void 0,
      fechaInicio: v.fechaInicio.toISOString(),
      fechaFinPrevista: v.fechaFinPrevista?.toISOString(),
      presupuestoEstimado: v.presupuestoEstimado ?? 0
    };
    if (this.isEdit()) {
      this.store.updateObra({ id: this.obraId(), data: payload });
      this.msg.add({
        severity: "success",
        summary: "Guardado",
        detail: "Obra actualizada"
      });
    } else {
      this.store.createObra(__spreadValues({ codigo: v.codigo }, payload));
      this.msg.add({
        severity: "success",
        summary: "Creada",
        detail: "Obra creada correctamente"
      });
    }
    setTimeout(() => this.router.navigate(["/obras"]), 300);
  }
  onKeyDown(event) {
    if (event.key === "Escape") {
      this.router.navigate(["/obras"]);
    }
  }
  static \u0275fac = function ObraFormComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ObraFormComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ObraFormComponent, selectors: [["app-obra-form"]], hostBindings: function ObraFormComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown", function ObraFormComponent_keydown_HostBindingHandler($event) {
        return ctx.onKeyDown($event);
      }, false, \u0275\u0275resolveWindow);
    }
  }, decls: 49, vars: 16, consts: [[1, "max-w-2xl", "mx-auto", "space-y-5", "animate-fade-in"], [1, "flex", "items-center", "gap-3"], ["routerLink", "/obras"], ["icon", "pi pi-arrow-left", "severity", "secondary", "size", "small", 3, "text"], [1, "text-2xl", "font-bold", "text-surface-900", "dark:text-surface-50"], [1, "text-surface-500", "dark:text-surface-400", "text-sm"], [1, "bg-white", "dark:bg-surface-900", "rounded-xl", "border", "border-surface-200", "dark:border-surface-700", "p-6"], [1, "space-y-5", 3, "ngSubmit", "formGroup"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "gap-4"], [1, "label-form"], ["pInputText", "", "formControlName", "nombre", "placeholder", "Nombre de la obra", 1, "w-full"], [1, "error-msg"], ["pTextarea", "", "formControlName", "descripcion", "rows", "3", "placeholder", "Descripci\xF3n opcional...", 1, "w-full"], ["pInputText", "", "formControlName", "cliente", "placeholder", "Nombre del cliente", 1, "w-full"], ["pInputText", "", "formControlName", "direccion", "placeholder", "Direcci\xF3n de la obra", 1, "w-full"], ["formControlName", "fechaInicio", "appendTo", "body", "dateFormat", "dd/mm/yy", "styleClass", "w-full", "placeholder", "Selecciona fecha", 3, "showIcon"], ["formControlName", "fechaFinPrevista", "appendTo", "body", "dateFormat", "dd/mm/yy", "styleClass", "w-full", "placeholder", "Selecciona fecha", 3, "showIcon"], ["formControlName", "presupuestoEstimado", "mode", "currency", "currency", "EUR", "locale", "es-ES", "styleClass", "w-full", "placeholder", "0,00"], [1, "flex", "justify-end", "gap-3", "pt-2", "border-t", "border-surface-100", "dark:border-surface-700"], ["label", "Cancelar", "severity", "secondary", 3, "outlined"], ["type", "submit", "icon", "pi pi-check", 3, "label", "loading", "disabled"], ["pInputText", "", "formControlName", "codigo", "placeholder", "OBR-001", 1, "w-full"]], template: function ObraFormComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "a", 2);
      \u0275\u0275element(3, "p-button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "h1", 4);
      \u0275\u0275text(6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p", 5);
      \u0275\u0275text(8);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(9, "div", 6)(10, "form", 7);
      \u0275\u0275listener("ngSubmit", function ObraFormComponent_Template_form_ngSubmit_10_listener() {
        return ctx.submit();
      });
      \u0275\u0275elementStart(11, "div", 8);
      \u0275\u0275template(12, ObraFormComponent_Conditional_12_Template, 5, 1, "div");
      \u0275\u0275elementStart(13, "div")(14, "label", 9);
      \u0275\u0275text(15, "Nombre *");
      \u0275\u0275elementEnd();
      \u0275\u0275element(16, "input", 10);
      \u0275\u0275template(17, ObraFormComponent_Conditional_17_Template, 2, 0, "p", 11);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div")(19, "label", 9);
      \u0275\u0275text(20, "Descripci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275element(21, "textarea", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "div", 8)(23, "div")(24, "label", 9);
      \u0275\u0275text(25, "Cliente");
      \u0275\u0275elementEnd();
      \u0275\u0275element(26, "input", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "div")(28, "label", 9);
      \u0275\u0275text(29, "Direcci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275element(30, "input", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "div")(32, "label", 9);
      \u0275\u0275text(33, "Fecha Inicio *");
      \u0275\u0275elementEnd();
      \u0275\u0275element(34, "p-datepicker", 15);
      \u0275\u0275template(35, ObraFormComponent_Conditional_35_Template, 2, 0, "p", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "div")(37, "label", 9);
      \u0275\u0275text(38, "Fecha Fin Prevista");
      \u0275\u0275elementEnd();
      \u0275\u0275element(39, "p-datepicker", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "div")(41, "label", 9);
      \u0275\u0275text(42, "Presupuesto Estimado (\u20AC) *");
      \u0275\u0275elementEnd();
      \u0275\u0275element(43, "p-inputNumber", 17);
      \u0275\u0275template(44, ObraFormComponent_Conditional_44_Template, 2, 0, "p", 11);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(45, "div", 18)(46, "a", 2);
      \u0275\u0275element(47, "p-button", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275element(48, "p-button", 20);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275property("text", true);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ctx.isEdit() ? "Editar Obra" : "Nueva Obra", " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.isEdit() ? "Modifica los datos de la obra" : "Rellena los datos para crear una nueva obra", " ");
      \u0275\u0275advance(2);
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.isEdit() ? 12 : -1);
      \u0275\u0275advance();
      \u0275\u0275classProp("sm:col-span-2", ctx.isEdit());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.invalid("nombre") ? 17 : -1);
      \u0275\u0275advance(17);
      \u0275\u0275property("showIcon", true);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.invalid("fechaInicio") ? 35 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("showIcon", true);
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.invalid("presupuestoEstimado") ? 44 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275property("outlined", true);
      \u0275\u0275advance();
      \u0275\u0275property("label", ctx.isEdit() ? "Guardar cambios" : "Crear Obra")("loading", ctx.loading())("disabled", ctx.form.invalid);
    }
  }, dependencies: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    FormGroupDirective,
    FormControlName,
    ButtonModule,
    Button,
    InputTextModule,
    InputText,
    InputNumberModule,
    InputNumber,
    DatePickerModule,
    DatePicker,
    TextareaModule,
    Textarea,
    CardModule
  ], styles: ["\n\n.label-form[_ngcontent-%COMP%] {\n  margin-bottom: 0.375rem;\n  display: block;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n  --tw-text-opacity: 1;\n  color: rgb(51 65 85 / var(--tw-text-opacity, 1));\n}\n.label-form[_ngcontent-%COMP%]:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(203 213 225 / var(--tw-text-opacity, 1));\n}\n.error-msg[_ngcontent-%COMP%] {\n  margin-top: 0.25rem;\n  font-size: 0.75rem;\n  line-height: 1rem;\n  --tw-text-opacity: 1;\n  color: rgb(239 68 68 / var(--tw-text-opacity, 1));\n}\n/*# sourceMappingURL=obra-form.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ObraFormComponent, [{
    type: Component,
    args: [{ selector: "app-obra-form", standalone: true, imports: [
      CommonModule,
      RouterLink,
      ReactiveFormsModule,
      ButtonModule,
      InputTextModule,
      InputNumberModule,
      DatePickerModule,
      TextareaModule,
      CardModule
    ], template: `
    <div class="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <a routerLink="/obras">
          <p-button
            icon="pi pi-arrow-left"
            [text]="true"
            severity="secondary"
            size="small"
          />
        </a>
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">
            {{ isEdit() ? "Editar Obra" : "Nueva Obra" }}
          </h1>
          <p class="text-surface-500 dark:text-surface-400 text-sm">
            {{
              isEdit()
                ? "Modifica los datos de la obra"
                : "Rellena los datos para crear una nueva obra"
            }}
          </p>
        </div>
      </div>

      <!-- Form -->
      <div
        class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 p-6"
      >
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- C\xF3digo -->
            @if (!isEdit()) {
              <div>
                <label class="label-form">C\xF3digo *</label>
                <input
                  pInputText
                  formControlName="codigo"
                  placeholder="OBR-001"
                  class="w-full"
                />
                @if (invalid("codigo")) {
                  <p class="error-msg">
                    C\xF3digo obligatorio (m\xE1x. 20 caracteres)
                  </p>
                }
              </div>
            }
            <!-- Nombre -->
            <div [class.sm:col-span-2]="isEdit()">
              <label class="label-form">Nombre *</label>
              <input
                pInputText
                formControlName="nombre"
                placeholder="Nombre de la obra"
                class="w-full"
              />
              @if (invalid("nombre")) {
                <p class="error-msg">Nombre obligatorio</p>
              }
            </div>
          </div>

          <!-- Descripci\xF3n -->
          <div>
            <label class="label-form">Descripci\xF3n</label>
            <textarea
              pTextarea
              formControlName="descripcion"
              rows="3"
              class="w-full"
              placeholder="Descripci\xF3n opcional..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Cliente -->
            <div>
              <label class="label-form">Cliente</label>
              <input
                pInputText
                formControlName="cliente"
                placeholder="Nombre del cliente"
                class="w-full"
              />
            </div>
            <!-- Direcci\xF3n -->
            <div>
              <label class="label-form">Direcci\xF3n</label>
              <input
                pInputText
                formControlName="direccion"
                placeholder="Direcci\xF3n de la obra"
                class="w-full"
              />
            </div>
            <!-- Fecha inicio -->
            <div>
              <label class="label-form">Fecha Inicio *</label>
              <p-datepicker
                formControlName="fechaInicio"
                appendTo="body"
                dateFormat="dd/mm/yy"
                styleClass="w-full"
                [showIcon]="true"
                placeholder="Selecciona fecha"
              />
              @if (invalid("fechaInicio")) {
                <p class="error-msg">Fecha de inicio obligatoria</p>
              }
            </div>
            <!-- Fecha fin prevista -->
            <div>
              <label class="label-form">Fecha Fin Prevista</label>
              <p-datepicker
                formControlName="fechaFinPrevista"
                appendTo="body"
                dateFormat="dd/mm/yy"
                styleClass="w-full"
                [showIcon]="true"
                placeholder="Selecciona fecha"
              />
            </div>
            <!-- Presupuesto -->
            <div>
              <label class="label-form">Presupuesto Estimado (\u20AC) *</label>
              <p-inputNumber
                formControlName="presupuestoEstimado"
                mode="currency"
                currency="EUR"
                locale="es-ES"
                styleClass="w-full"
                placeholder="0,00"
              />
              @if (invalid("presupuestoEstimado")) {
                <p class="error-msg">Presupuesto inv\xE1lido</p>
              }
            </div>
          </div>

          <!-- Actions -->
          <div
            class="flex justify-end gap-3 pt-2 border-t border-surface-100 dark:border-surface-700"
          >
            <a routerLink="/obras">
              <p-button
                label="Cancelar"
                severity="secondary"
                [outlined]="true"
              />
            </a>
            <p-button
              type="submit"
              [label]="isEdit() ? 'Guardar cambios' : 'Crear Obra'"
              icon="pi pi-check"
              [loading]="loading()"
              [disabled]="form.invalid"
            />
          </div>
        </form>
      </div>
    </div>
  `, styles: ["/* angular:styles/component:css;23292f9a8b0002d4b441d53a0bf359f966a94d86c4baf43040ca491e95edc515;D:/Programacion/GitHub/TareasObras_v2_Frontend/src/app/features/obras/components/obra-form.component.ts */\n.label-form {\n  margin-bottom: 0.375rem;\n  display: block;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n  --tw-text-opacity: 1;\n  color: rgb(51 65 85 / var(--tw-text-opacity, 1));\n}\n.label-form:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(203 213 225 / var(--tw-text-opacity, 1));\n}\n.error-msg {\n  margin-top: 0.25rem;\n  font-size: 0.75rem;\n  line-height: 1rem;\n  --tw-text-opacity: 1;\n  color: rgb(239 68 68 / var(--tw-text-opacity, 1));\n}\n/*# sourceMappingURL=obra-form.component.css.map */\n"] }]
  }], null, { onKeyDown: [{
    type: HostListener,
    args: ["window:keydown", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ObraFormComponent, { className: "ObraFormComponent", filePath: "src/app/features/obras/components/obra-form.component.ts", lineNumber: 203 });
})();
export {
  ObraFormComponent
};
//# sourceMappingURL=chunk-JKQY5BZZ.js.map
