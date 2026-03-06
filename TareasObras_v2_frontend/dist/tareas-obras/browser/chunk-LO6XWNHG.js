import {
  Injectable,
  effect,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-UYBFJOBI.js";

// src/app/core/services/theme.service.ts
var ThemeService = class _ThemeService {
  isDark = signal(localStorage.getItem("theme") === "dark");
  constructor() {
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem("theme", dark ? "dark" : "light");
    });
    document.documentElement.classList.toggle("dark", this.isDark());
  }
  toggle() {
    this.isDark.update((v) => !v);
  }
  static \u0275fac = function ThemeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThemeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

export {
  ThemeService
};
//# sourceMappingURL=chunk-LO6XWNHG.js.map
