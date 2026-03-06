import {
  Router
} from "./chunk-ZWO6PBPF.js";
import {
  HttpClient
} from "./chunk-LHMGNLDW.js";
import {
  Injectable,
  computed,
  inject,
  setClassMetadata,
  signal,
  tap,
  ɵɵdefineInjectable
} from "./chunk-UYBFJOBI.js";

// src/app/core/auth/auth.service.ts
var API_URL = "/api";
var AuthService = class _AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  _user = signal(this.loadUser());
  _token = signal(localStorage.getItem("token"));
  user = this._user.asReadonly();
  token = this._token.asReadonly();
  isAuthenticated = computed(() => !!this._token());
  isAdmin = computed(() => this._user()?.rol === "Admin");
  isSupervisor = computed(() => this._user()?.rol === "Supervisor" || this.isAdmin());
  currentRole = computed(() => this._user()?.rol ?? "");
  login(request) {
    return this.http.post(`${API_URL}/auth/login`, request).pipe(tap((res) => {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      this._token.set(res.token);
      this._user.set(res.user);
    }));
  }
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(["/auth/login"]);
  }
  register(request) {
    return this.http.post(`${API_URL}/auth/register`, request);
  }
  loadUser() {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  AuthService
};
//# sourceMappingURL=chunk-OQT6XM2C.js.map
