import {
  ThemeService
} from "./chunk-LO6XWNHG.js";
import {
  Tooltip,
  TooltipModule
} from "./chunk-L4SADYLI.js";
import {
  AuthService
} from "./chunk-OQT6XM2C.js";
import "./chunk-N6MHAP3Q.js";
import {
  ButtonModule
} from "./chunk-UD3KEAH2.js";
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from "./chunk-ZWO6PBPF.js";
import {
  BaseComponent,
  BaseStyle,
  CommonModule,
  NgClass,
  NgIf,
  SharedModule
} from "./chunk-LHMGNLDW.js";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Injectable,
  Input,
  NgModule,
  Output,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-UYBFJOBI.js";
import "./chunk-WDMUDEB6.js";

// node_modules/primeng/fesm2022/primeng-avatar.mjs
var _c0 = ["*"];
function Avatar_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.label);
  }
}
function Avatar_ng_template_2_span_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 5);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r0.icon);
    \u0275\u0275property("ngClass", "p-avatar-icon");
  }
}
function Avatar_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, Avatar_ng_template_2_span_0_Template, 1, 3, "span", 4);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    const imageTemplate_r2 = \u0275\u0275reference(5);
    \u0275\u0275property("ngIf", ctx_r0.icon)("ngIfElse", imageTemplate_r2);
  }
}
function Avatar_ng_template_4_img_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 7);
    \u0275\u0275listener("error", function Avatar_ng_template_4_img_0_Template_img_error_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.imageError($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx_r0.image, \u0275\u0275sanitizeUrl);
    \u0275\u0275attribute("aria-label", ctx_r0.ariaLabel);
  }
}
function Avatar_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, Avatar_ng_template_4_img_0_Template, 1, 2, "img", 6);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngIf", ctx_r0.image);
  }
}
var theme = ({
  dt
}) => `
.p-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${dt("avatar.width")};
    height: ${dt("avatar.height")};
    font-size: ${dt("avatar.font.size")};
    color: ${dt("avatar.color")};
    background: ${dt("avatar.background")};
    border-radius: ${dt("avatar.border.radius")};
}

.p-avatar-image {
    background: transparent;
}

.p-avatar-circle {
    border-radius: 50%;
}

.p-avatar-circle img {
    border-radius: 50%;
}

.p-avatar-icon {
    font-size: ${dt("avatar.icon.size")};
    width: ${dt("avatar.icon.size")};
    height: ${dt("avatar.icon.size")};
}

.p-avatar img {
    width: 100%;
    height: 100%;
}

.p-avatar-lg {
    width: ${dt("avatar.lg.width")};
    height: ${dt("avatar.lg.width")};
    font-size: ${dt("avatar.lg.font.size")};
}

.p-avatar-lg .p-avatar-icon {
    font-size: ${dt("avatar.lg.icon.size")};
    width: ${dt("avatar.lg.icon.size")};
    height: ${dt("avatar.lg.icon.size")};
}

.p-avatar-xl {
    width: ${dt("avatar.xl.width")};
    height: ${dt("avatar.xl.width")};
    font-size: ${dt("avatar.xl.font.size")};
}

.p-avatar-xl .p-avatar-icon {
    font-size: ${dt("avatar.xl.font.size")};
    width: ${dt("avatar.xl.icon.size")};
    height: ${dt("avatar.xl.icon.size")};
}

.p-avatar-group {
    display: flex;
    align-items: center;
}

.p-avatar-group .p-avatar + .p-avatar {
    margin-inline-start: ${dt("avatar.group.offset")};
}

.p-avatar-group .p-avatar {
    border: 2px solid ${dt("avatar.group.border.color")};
}

.p-avatar-group .p-avatar-lg + .p-avatar-lg {
    margin-inline-start: ${dt("avatar.lg.group.offset")};
}

.p-avatar-group .p-avatar-xl + .p-avatar-xl {
    margin-inline-start: ${dt("avatar.xl.group.offset")};
}
`;
var classes = {
  root: ({
    props
  }) => ["p-avatar p-component", {
    "p-avatar-image": props.image != null,
    "p-avatar-circle": props.shape === "circle",
    "p-avatar-lg": props.size === "large",
    "p-avatar-xl": props.size === "xlarge"
  }],
  label: "p-avatar-label",
  icon: "p-avatar-icon"
};
var AvatarStyle = class _AvatarStyle extends BaseStyle {
  name = "avatar";
  theme = theme;
  classes = classes;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275AvatarStyle_BaseFactory;
    return function AvatarStyle_Factory(__ngFactoryType__) {
      return (\u0275AvatarStyle_BaseFactory || (\u0275AvatarStyle_BaseFactory = \u0275\u0275getInheritedFactory(_AvatarStyle)))(__ngFactoryType__ || _AvatarStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _AvatarStyle,
    factory: _AvatarStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AvatarStyle, [{
    type: Injectable
  }], null, null);
})();
var AvatarClasses;
(function(AvatarClasses2) {
  AvatarClasses2["root"] = "p-avatar";
  AvatarClasses2["label"] = "p-avatar-label";
  AvatarClasses2["icon"] = "p-avatar-icon";
})(AvatarClasses || (AvatarClasses = {}));
var Avatar = class _Avatar extends BaseComponent {
  /**
   * Defines the text to display.
   * @group Props
   */
  label;
  /**
   * Defines the icon to display.
   * @group Props
   */
  icon;
  /**
   * Defines the image to display.
   * @group Props
   */
  image;
  /**
   * Size of the element.
   * @group Props
   */
  size = "normal";
  /**
   * Shape of the element.
   * @group Props
   */
  shape = "square";
  /**
   * Inline style of the element.
   * @group Props
   */
  style;
  /**
   * Class of the element.
   * @group Props
   */
  styleClass;
  /**
   * Establishes a string value that labels the component.
   * @group Props
   */
  ariaLabel;
  /**
   * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
   * @group Props
   */
  ariaLabelledBy;
  /**
   * This event is triggered if an error occurs while loading an image file.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  onImageError = new EventEmitter();
  _componentStyle = inject(AvatarStyle);
  imageError(event) {
    this.onImageError.emit(event);
  }
  get hostClass() {
    return this.styleClass;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275Avatar_BaseFactory;
    return function Avatar_Factory(__ngFactoryType__) {
      return (\u0275Avatar_BaseFactory || (\u0275Avatar_BaseFactory = \u0275\u0275getInheritedFactory(_Avatar)))(__ngFactoryType__ || _Avatar);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _Avatar,
    selectors: [["p-avatar"]],
    hostVars: 19,
    hostBindings: function Avatar_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("data-pc-name", "avatar")("aria-label", ctx.ariaLabel)("aria-labelledby", ctx.ariaLabelledBy);
        \u0275\u0275styleMap(ctx.style);
        \u0275\u0275classMap(ctx.hostClass);
        \u0275\u0275classProp("p-avatar", true)("p-component", true)("p-avatar-circle", ctx.shape === "circle")("p-avatar-lg", ctx.size === "large")("p-avatar-xl", ctx.size === "xlarge")("p-avatar-image", ctx.image != null);
      }
    },
    inputs: {
      label: "label",
      icon: "icon",
      image: "image",
      size: "size",
      shape: "shape",
      style: "style",
      styleClass: "styleClass",
      ariaLabel: "ariaLabel",
      ariaLabelledBy: "ariaLabelledBy"
    },
    outputs: {
      onImageError: "onImageError"
    },
    features: [\u0275\u0275ProvidersFeature([AvatarStyle]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 6,
    vars: 2,
    consts: [["iconTemplate", ""], ["imageTemplate", ""], ["class", "p-avatar-text", 4, "ngIf", "ngIfElse"], [1, "p-avatar-text"], [3, "class", "ngClass", 4, "ngIf", "ngIfElse"], [3, "ngClass"], [3, "src", "error", 4, "ngIf"], [3, "error", "src"]],
    template: function Avatar_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275projection(0);
        \u0275\u0275template(1, Avatar_span_1_Template, 2, 1, "span", 2)(2, Avatar_ng_template_2_Template, 1, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(4, Avatar_ng_template_4_Template, 1, 1, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      }
      if (rf & 2) {
        const iconTemplate_r4 = \u0275\u0275reference(3);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.label)("ngIfElse", iconTemplate_r4);
      }
    },
    dependencies: [CommonModule, NgClass, NgIf, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Avatar, [{
    type: Component,
    args: [{
      selector: "p-avatar",
      standalone: true,
      imports: [CommonModule, SharedModule],
      template: `
        <ng-content></ng-content>
        <span class="p-avatar-text" *ngIf="label; else iconTemplate">{{ label }}</span>
        <ng-template #iconTemplate><span [class]="icon" [ngClass]="'p-avatar-icon'" *ngIf="icon; else imageTemplate"></span></ng-template>
        <ng-template #imageTemplate> <img [src]="image" *ngIf="image" (error)="imageError($event)" [attr.aria-label]="ariaLabel" /></ng-template>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        "[class.p-avatar]": "true",
        "[class.p-component]": "true",
        "[class.p-avatar-circle]": 'shape === "circle"',
        "[class.p-avatar-lg]": 'size === "large"',
        "[class.p-avatar-xl]": 'size === "xlarge"',
        "[class.p-avatar-image]": "image != null",
        "[attr.data-pc-name]": '"avatar"',
        "[attr.aria-label]": "ariaLabel",
        "[attr.aria-labelledby]": "ariaLabelledBy",
        "[style]": "style"
      },
      providers: [AvatarStyle]
    }]
  }], null, {
    label: [{
      type: Input
    }],
    icon: [{
      type: Input
    }],
    image: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    shape: [{
      type: Input
    }],
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    ariaLabelledBy: [{
      type: Input
    }],
    onImageError: [{
      type: Output
    }],
    hostClass: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var AvatarModule = class _AvatarModule {
  static \u0275fac = function AvatarModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AvatarModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _AvatarModule,
    imports: [Avatar, SharedModule],
    exports: [Avatar, SharedModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [Avatar, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AvatarModule, [{
    type: NgModule,
    args: [{
      imports: [Avatar, SharedModule],
      exports: [Avatar, SharedModule]
    }]
  }], null, null);
})();

// src/app/shared/components/layout/shell.component.ts
var _c02 = () => ({ "background-color": "#3b82f6", "color": "#fff" });
var _forTrack0 = ($index, $item) => $item.route;
function ShellComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275text(1, "TareasObras");
    \u0275\u0275elementEnd();
  }
}
function ShellComponent_For_8_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r1.label);
  }
}
function ShellComponent_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 6);
    \u0275\u0275element(1, "i");
    \u0275\u0275template(2, ShellComponent_For_8_Conditional_2_Template, 2, 1, "span", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("routerLink", item_r1.route)("pTooltip", ctx_r1.collapsed() ? item_r1.label : "");
    \u0275\u0275advance();
    \u0275\u0275classMap(item_r1.icon + " text-base w-4 flex-shrink-0");
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.collapsed() ? 2 : -1);
  }
}
function ShellComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "p-avatar", 20);
    \u0275\u0275elementStart(2, "div", 21)(3, "p", 22);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 23);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(5, _c02));
    \u0275\u0275property("label", ctx_r1.userInitials());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r1.auth.user()) == null ? null : tmp_3_0.nombreCompleto);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r1.auth.user()) == null ? null : tmp_4_0.rol);
  }
}
var ShellComponent = class _ShellComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  collapsed = signal(false);
  navItems = [
    { label: "Dashboard", icon: "pi pi-chart-bar", route: "/dashboard" },
    { label: "Obras", icon: "pi pi-building", route: "/obras" },
    { label: "Usuarios", icon: "pi pi-users", route: "/usuarios", roles: ["Admin"] },
    { label: "Operarios", icon: "pi pi-id-card", route: "/operarios", roles: ["Admin", "Supervisor"] }
  ];
  visibleNav() {
    return this.navItems.filter((n) => !n.roles || n.roles.includes(this.auth.user()?.rol ?? ""));
  }
  userInitials() {
    const name = this.auth.user()?.nombreCompleto ?? "";
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  }
  toggleCollapse() {
    this.collapsed.set(!this.collapsed());
  }
  toggleTheme() {
    this.theme.toggle();
  }
  logout() {
    this.auth.logout();
  }
  static \u0275fac = function ShellComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ShellComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ShellComponent, selectors: [["app-shell"]], decls: 26, vars: 9, consts: [[1, "flex", "h-screen", "overflow-hidden", "bg-surface-50", "dark:bg-surface-950"], [1, "flex", "items-center", "gap-3", "px-4", "py-5", "border-b", "border-surface-200", "dark:border-surface-700"], [1, "w-8", "h-8", "rounded-lg", "bg-primary-600", "flex", "items-center", "justify-center", "flex-shrink-0"], [1, "pi", "pi-building", "text-white", "text-sm"], [1, "font-bold", "text-surface-900", "dark:text-surface-100", "text-lg", "tracking-tight"], [1, "flex-1", "px-2", "py-4", "space-y-1", "overflow-y-auto"], ["routerLinkActive", "bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300", "tooltipPosition", "right", 1, "flex", "items-center", "gap-3", "px-3", "py-2.5", "rounded-lg", "text-surface-600", "dark:text-surface-400", "hover:bg-surface-100", "dark:hover:bg-surface-800", "transition-colors", 3, "routerLink", "pTooltip"], [1, "border-t", "border-surface-200", "dark:border-surface-700", "p-3", "space-y-2"], [1, "flex", "items-center", "gap-3", "px-2", "py-2", "rounded-lg"], [1, "w-full", "flex", "items-center", "justify-center", "p-2", "rounded-lg", "text-surface-500", "hover:bg-surface-100", "dark:hover:bg-surface-800", "transition-colors", 3, "click"], [1, "flex-1", "flex", "flex-col", "overflow-hidden"], [1, "h-14", "flex", "items-center", "justify-between", "px-6", "bg-white", "dark:bg-surface-900", "border-b", "border-surface-200", "dark:border-surface-700", "flex-shrink-0"], [1, "text-sm", "font-semibold", "text-surface-700", "dark:text-surface-300"], [1, "text-primary-600", "dark:text-primary-400"], [1, "flex", "items-center", "gap-2"], [1, "w-9", "h-9", "flex", "items-center", "justify-center", "rounded-lg", "text-surface-600", "dark:text-surface-400", "hover:bg-surface-100", "dark:hover:bg-surface-800", "transition-colors", 3, "click"], ["pTooltip", "Cerrar sesi\xF3n", "tooltipPosition", "left", 1, "w-9", "h-9", "flex", "items-center", "justify-center", "rounded-lg", "text-surface-600", "dark:text-surface-400", "hover:bg-red-50", "dark:hover:bg-red-950", "hover:text-red-600", "transition-colors", 3, "click"], [1, "pi", "pi-sign-out"], [1, "flex-1", "overflow-y-auto", "p-6"], [1, "text-sm", "font-medium"], ["styleClass", "flex-shrink-0", "size", "normal", "shape", "circle", 3, "label"], [1, "min-w-0"], [1, "text-sm", "font-semibold", "text-surface-900", "dark:text-surface-100", "truncate"], [1, "text-xs", "text-surface-500", "truncate"]], template: function ShellComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "aside")(2, "div", 1)(3, "div", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275template(5, ShellComponent_Conditional_5_Template, 2, 0, "span", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "nav", 5);
      \u0275\u0275repeaterCreate(7, ShellComponent_For_8_Template, 3, 5, "a", 6, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 7);
      \u0275\u0275template(10, ShellComponent_Conditional_10_Template, 7, 6, "div", 8);
      \u0275\u0275elementStart(11, "button", 9);
      \u0275\u0275listener("click", function ShellComponent_Template_button_click_11_listener() {
        return ctx.toggleCollapse();
      });
      \u0275\u0275element(12, "i");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(13, "div", 10)(14, "header", 11)(15, "h1", 12);
      \u0275\u0275text(16, " Bienvenido, ");
      \u0275\u0275elementStart(17, "span", 13);
      \u0275\u0275text(18);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "div", 14)(20, "button", 15);
      \u0275\u0275listener("click", function ShellComponent_Template_button_click_20_listener() {
        return ctx.toggleTheme();
      });
      \u0275\u0275element(21, "i");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "button", 16);
      \u0275\u0275listener("click", function ShellComponent_Template_button_click_22_listener() {
        return ctx.logout();
      });
      \u0275\u0275element(23, "i", 17);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(24, "main", 18);
      \u0275\u0275element(25, "router-outlet");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_5_0;
      \u0275\u0275advance();
      \u0275\u0275classMap((ctx.collapsed() ? "w-16" : "w-64") + " flex flex-col h-full bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 transition-all duration-300 z-20");
      \u0275\u0275advance(4);
      \u0275\u0275conditional(!ctx.collapsed() ? 5 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.visibleNav());
      \u0275\u0275advance(3);
      \u0275\u0275conditional(!ctx.collapsed() ? 10 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275classMap(ctx.collapsed() ? "pi pi-chevron-right" : "pi pi-chevron-left");
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate((tmp_5_0 = ctx.auth.user()) == null ? null : tmp_5_0.nombreCompleto);
      \u0275\u0275advance(3);
      \u0275\u0275classMap(ctx.theme.isDark() ? "pi pi-sun" : "pi pi-moon");
    }
  }, dependencies: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, TooltipModule, Tooltip, AvatarModule, Avatar, CommonModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ShellComponent, [{
    type: Component,
    args: [{
      selector: "app-shell",
      standalone: true,
      imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, TooltipModule, AvatarModule, CommonModule],
      template: `
    <div class="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-950">

      <!-- Sidebar -->
      <aside [class]="(collapsed() ? 'w-16' : 'w-64') + ' flex flex-col h-full bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 transition-all duration-300 z-20'">

        <!-- Logo -->
        <div class="flex items-center gap-3 px-4 py-5 border-b border-surface-200 dark:border-surface-700">
          <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
            <i class="pi pi-building text-white text-sm"></i>
          </div>
          @if (!collapsed()) {
            <span class="font-bold text-surface-900 dark:text-surface-100 text-lg tracking-tight">TareasObras</span>
          }
        </div>

        <!-- Nav -->
        <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          @for (item of visibleNav(); track item.route) {
            <a [routerLink]="item.route" routerLinkActive="bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
               [pTooltip]="collapsed() ? item.label : ''" tooltipPosition="right">
              <i [class]="item.icon + ' text-base w-4 flex-shrink-0'"></i>
              @if (!collapsed()) {
                <span class="text-sm font-medium">{{ item.label }}</span>
              }
            </a>
          }
        </nav>

        <!-- User + collapse -->
        <div class="border-t border-surface-200 dark:border-surface-700 p-3 space-y-2">
          @if (!collapsed()) {
            <div class="flex items-center gap-3 px-2 py-2 rounded-lg">
              <p-avatar [label]="userInitials()" styleClass="flex-shrink-0" size="normal"
                        shape="circle" [style]="{'background-color': '#3b82f6', 'color': '#fff'}"/>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">{{ auth.user()?.nombreCompleto }}</p>
                <p class="text-xs text-surface-500 truncate">{{ auth.user()?.rol }}</p>
              </div>
            </div>
          }
          <button (click)="toggleCollapse()"
                  class="w-full flex items-center justify-center p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <i [class]="(collapsed() ? 'pi pi-chevron-right' : 'pi pi-chevron-left')"></i>
          </button>
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1 flex flex-col overflow-hidden">

        <!-- Topbar -->
        <header class="h-14 flex items-center justify-between px-6 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 flex-shrink-0">
          <h1 class="text-sm font-semibold text-surface-700 dark:text-surface-300">
            Bienvenido, <span class="text-primary-600 dark:text-primary-400">{{ auth.user()?.nombreCompleto }}</span>
          </h1>
          <div class="flex items-center gap-2">
            <button (click)="toggleTheme()"
                    class="w-9 h-9 flex items-center justify-center rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <i [class]="(theme.isDark() ? 'pi pi-sun' : 'pi pi-moon')"></i>
            </button>
            <button (click)="logout()"
                    class="w-9 h-9 flex items-center justify-center rounded-lg text-surface-600 dark:text-surface-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors"
                    pTooltip="Cerrar sesi\xF3n" tooltipPosition="left">
              <i class="pi pi-sign-out"></i>
            </button>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ShellComponent, { className: "ShellComponent", filePath: "src/app/shared/components/layout/shell.component.ts", lineNumber: 94 });
})();
export {
  ShellComponent
};
//# sourceMappingURL=chunk-SM5HFLQO.js.map
