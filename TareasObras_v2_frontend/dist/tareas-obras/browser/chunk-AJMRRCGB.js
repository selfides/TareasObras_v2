import {
  Password,
  PasswordModule
} from "./chunk-4QR5UYFX.js";
import {
  ThemeService
} from "./chunk-LO6XWNHG.js";
import {
  AuthService
} from "./chunk-OQT6XM2C.js";
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
import {
  Button,
  ButtonModule
} from "./chunk-UD3KEAH2.js";
import {
  Router
} from "./chunk-ZWO6PBPF.js";
import {
  CommonModule
} from "./chunk-LHMGNLDW.js";
import {
  Component,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-UYBFJOBI.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/auth/components/login.component.ts
function LoginComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275element(1, "i", 16);
    \u0275\u0275elementStart(2, "span", 17);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
var LoginComponent = class _LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  theme = inject(ThemeService);
  loading = signal(false);
  error = signal("");
  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required]
  });
  toggleTheme() {
    this.theme.toggle();
  }
  submit() {
    if (this.form.invalid)
      return;
    this.loading.set(true);
    this.error.set("");
    const { email, password } = this.form.value;
    this.auth.login({ email, password }).subscribe({
      next: (res) => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          this.router.navigate(["/dashboard"]);
        } else {
          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify(res.user));
          this.router.navigate(["/dashboard"]);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set("Credenciales incorrectas. Verifica tu email y contrase\xF1a.");
        this.loading.set(false);
      }
    });
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 25, vars: 8, consts: [[1, "min-h-screen", "flex", "items-center", "justify-center", "bg-gradient-to-br", "from-surface-100", "to-surface-200", "dark:from-surface-950", "dark:to-surface-900", "p-4"], [1, "fixed", "top-4", "right-4", "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-xl", "bg-white", "dark:bg-surface-800", "shadow-md", "text-surface-600", "dark:text-surface-400", 3, "click"], [1, "w-full", "max-w-md", "animate-slide-up"], [1, "text-center", "mb-8"], [1, "inline-flex", "items-center", "justify-center", "w-16", "h-16", "rounded-2xl", "bg-primary-600", "shadow-lg", "mb-4"], [1, "pi", "pi-building", "text-white", "text-2xl"], [1, "text-3xl", "font-bold", "text-surface-900", "dark:text-surface-50", "tracking-tight"], [1, "text-surface-500", "dark:text-surface-400", "mt-1"], [1, "bg-white", "dark:bg-surface-900", "rounded-2xl", "shadow-xl", "border", "border-surface-200", "dark:border-surface-700", "p-8"], [1, "text-xl", "font-semibold", "text-surface-900", "dark:text-surface-100", "mb-6"], [1, "space-y-5", 3, "ngSubmit", "formGroup"], [1, "block", "text-sm", "font-medium", "text-surface-700", "dark:text-surface-300", "mb-1.5"], ["pInputText", "", "formControlName", "email", "type", "email", "placeholder", "admin@tareasObras.com", 1, "w-full"], ["formControlName", "password", "styleClass", "w-full", "inputStyleClass", "w-full", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", 3, "feedback", "toggleMask"], [1, "flex", "items-center", "gap-2", "p-3", "rounded-lg", "bg-red-50", "dark:bg-red-950", "border", "border-red-200", "dark:border-red-800"], ["type", "submit", "label", "Entrar", "icon", "pi pi-sign-in", "iconPos", "right", "styleClass", "w-full", 3, "loading", "disabled"], [1, "pi", "pi-exclamation-circle", "text-red-500", "text-sm"], [1, "text-red-700", "dark:text-red-300", "text-sm"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "button", 1);
      \u0275\u0275listener("click", function LoginComponent_Template_button_click_1_listener() {
        return ctx.toggleTheme();
      });
      \u0275\u0275element(2, "i");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2)(4, "div", 3)(5, "div", 4);
      \u0275\u0275element(6, "i", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "h1", 6);
      \u0275\u0275text(8, "TareasObras");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 7);
      \u0275\u0275text(10, "Gesti\xF3n de obras y proyectos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 8)(12, "h2", 9);
      \u0275\u0275text(13, "Iniciar sesi\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "form", 10);
      \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_14_listener() {
        return ctx.submit();
      });
      \u0275\u0275elementStart(15, "div")(16, "label", 11);
      \u0275\u0275text(17, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275element(18, "input", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div")(20, "label", 11);
      \u0275\u0275text(21, "Contrase\xF1a");
      \u0275\u0275elementEnd();
      \u0275\u0275element(22, "p-password", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275template(23, LoginComponent_Conditional_23_Template, 4, 1, "div", 14);
      \u0275\u0275element(24, "p-button", 15);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275classMap(ctx.theme.isDark() ? "pi pi-sun" : "pi pi-moon");
      \u0275\u0275advance(12);
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(8);
      \u0275\u0275property("feedback", false)("toggleMask", true);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 23 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("loading", ctx.loading())("disabled", ctx.form.invalid);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, ButtonModule, Button, InputTextModule, InputText, PasswordModule, Password, CommonModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{
      selector: "app-login",
      standalone: true,
      imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, CommonModule],
      template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-950 dark:to-surface-900 p-4">

      <button (click)="toggleTheme()" class="fixed top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-surface-800 shadow-md text-surface-600 dark:text-surface-400">
        <i [class]="(theme.isDark() ? 'pi pi-sun' : 'pi pi-moon')"></i>
      </button>

      <div class="w-full max-w-md animate-slide-up">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 shadow-lg mb-4">
            <i class="pi pi-building text-white text-2xl"></i>
          </div>
          <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">TareasObras</h1>
          <p class="text-surface-500 dark:text-surface-400 mt-1">Gesti\xF3n de obras y proyectos</p>
        </div>

        <div class="bg-white dark:bg-surface-900 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 p-8">
          <h2 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-6">Iniciar sesi\xF3n</h2>

          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
              <input pInputText formControlName="email" type="email" placeholder="admin@tareasObras.com" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Contrase\xF1a</label>
              <p-password formControlName="password" [feedback]="false" [toggleMask]="true"
                          styleClass="w-full" inputStyleClass="w-full" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" />
            </div>

            @if (error()) {
              <div class="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                <i class="pi pi-exclamation-circle text-red-500 text-sm"></i>
                <span class="text-red-700 dark:text-red-300 text-sm">{{ error() }}</span>
              </div>
            }

            <p-button type="submit" label="Entrar" icon="pi pi-sign-in" iconPos="right"
                      styleClass="w-full" [loading]="loading()" [disabled]="form.invalid" />
          </form>
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/features/auth/components/login.component.ts", lineNumber: 60 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-AJMRRCGB.js.map
