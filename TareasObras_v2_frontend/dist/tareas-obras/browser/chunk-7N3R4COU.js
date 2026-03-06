import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState
} from "./chunk-E57F7IJQ.js";
import {
  ObrasService
} from "./chunk-HQ4N7DEE.js";
import {
  computed,
  inject
} from "./chunk-UYBFJOBI.js";

// src/app/features/obras/store/obras.store.ts
var initialState = {
  obras: [],
  selectedObra: null,
  loading: false,
  error: null,
  search: "",
  estadoFiltro: ""
};
var ObrasStore = signalStore({ providedIn: "root" }, withState(initialState), withComputed(({ obras }) => ({
  totalObras: computed(() => obras().length),
  obrasPorEstado: computed(() => ({
    planificadas: obras().filter((o) => o.estado === 1).length,
    enCurso: obras().filter((o) => o.estado === 2).length,
    completadas: obras().filter((o) => o.estado === 4).length
  })),
  presupuestoTotal: computed(() => obras().reduce((s, o) => s + o.presupuestoEstimado, 0))
})), withMethods((store, service = inject(ObrasService)) => {
  const _loadObras = (search, estado) => {
    patchState(store, { loading: true, error: null });
    service.getAll(search, estado).subscribe({
      next: (obras) => patchState(store, { obras, loading: false }),
      error: () => patchState(store, { loading: false, error: "Error al cargar obras" })
    });
  };
  return {
    loadObras(params = {}) {
      _loadObras(params.search, params.estado);
    },
    loadObraById(id) {
      patchState(store, { loading: true });
      service.getById(id).subscribe({
        next: (obra) => patchState(store, { selectedObra: obra, loading: false }),
        error: () => patchState(store, { loading: false, error: "Error al cargar obra" })
      });
    },
    createObra(data) {
      service.create(data).subscribe({
        next: () => _loadObras(),
        error: () => patchState(store, { error: "Error al crear obra" })
      });
    },
    updateObra(payload) {
      service.update(payload.id, payload.data).subscribe({
        next: () => _loadObras(),
        error: () => patchState(store, { error: "Error al actualizar obra" })
      });
    },
    deleteObra(id) {
      service.delete(id).subscribe({
        next: () => _loadObras(),
        error: () => patchState(store, { error: "Error al eliminar obra" })
      });
    },
    setSearch(search) {
      patchState(store, { search });
    },
    setEstadoFiltro(estadoFiltro) {
      patchState(store, { estadoFiltro });
    },
    clearSelected() {
      patchState(store, { selectedObra: null });
    }
  };
}));

export {
  ObrasStore
};
//# sourceMappingURL=chunk-7N3R4COU.js.map
