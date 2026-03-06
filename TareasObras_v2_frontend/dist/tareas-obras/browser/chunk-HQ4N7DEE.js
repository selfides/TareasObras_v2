import {
  HttpClient,
  HttpParams
} from "./chunk-LHMGNLDW.js";
import {
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-UYBFJOBI.js";

// src/app/core/services/obras.service.ts
var API = "/api";
var ObrasService = class _ObrasService {
  http = inject(HttpClient);
  base = `${API}/obras`;
  getAll(search, estado) {
    let params = new HttpParams();
    if (search)
      params = params.set("search", search);
    if (estado)
      params = params.set("estado", estado);
    return this.http.get(this.base, { params });
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
  cambiarEstado(id, nuevoEstado) {
    return this.http.patch(`${this.base}/${id}/estado`, { nuevoEstado });
  }
  delete(id) {
    return this.http.delete(`${this.base}/${id}`);
  }
  static \u0275fac = function ObrasService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ObrasService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ObrasService, factory: _ObrasService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ObrasService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  ObrasService
};
//# sourceMappingURL=chunk-HQ4N7DEE.js.map
