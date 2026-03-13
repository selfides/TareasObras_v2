import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { ObrasService } from '../../../core/services/obras.service';
import { ObraListDto, ObraDetailDto, CreateObraRequest, UpdateObraRequest } from '../../../core/models';

interface ObrasState {
  obras: ObraListDto[];
  selectedObra: ObraDetailDto | null;
  loading: boolean;
  error: string | null;
  search: string;
  estadoFiltro: string;
}

const initialState: ObrasState = {
  obras: [], selectedObra: null, loading: false, error: null, search: '', estadoFiltro: ''
};

export const ObrasStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ obras }) => ({
    totalObras: computed(() => obras().length),
    obrasPorEstado: computed(() => ({
      planificadas: obras().filter(o => o.estado === 1).length,
      enCurso:      obras().filter(o => o.estado === 2).length,
      completadas:  obras().filter(o => o.estado === 4).length,
    })),
    presupuestoTotal: computed(() => obras().reduce((s, o) => s + o.presupuestoEstimado, 0)),
  })),
  withMethods((store, service = inject(ObrasService)) => {

    const _loadObras = (search?: string, estado?: string) => {
      patchState(store, { loading: true, error: null });
      service.getAll(search, estado).subscribe({
        next: (obras: ObraListDto[]) => patchState(store, { obras, loading: false }),
        error: () => patchState(store, { loading: false, error: 'Error al cargar obras' })
      });
    };

    return {
      loadObras(params: { search?: string; estado?: string } = {}) {
        _loadObras(params.search, params.estado);
      },

      loadObraById(id: string) {
        patchState(store, { loading: true });
        service.getById(id).subscribe({
          next: (obra: ObraDetailDto) => patchState(store, { selectedObra: obra, loading: false }),
          error: () => patchState(store, { loading: false, error: 'Error al cargar obra' })
        });
      },

      createObra(payload: { data: CreateObraRequest, estado?: number }) {
        service.create(payload.data).subscribe({
          next: (res) => {
            if (payload.estado && payload.estado !== 1) { // 1 = Planificada (default)
              service.cambiarEstado(res.id, payload.estado).subscribe(() => _loadObras());
            } else {
              _loadObras();
            }
          },
          error: () => patchState(store, { error: 'Error al crear obra' })
        });
      },

      updateObra(payload: { id: string; data: UpdateObraRequest }) {
        service.update(payload.id, payload.data).subscribe({
          next: () => _loadObras(),
          error: () => patchState(store, { error: 'Error al actualizar obra' })
        });
      },

      cambiarEstadoObra(id: string, nuevoEstado: number) {
        service.cambiarEstado(id, nuevoEstado).subscribe({
          next: () => {
            _loadObras();
            if (store.selectedObra()?.id === id) {
              service.getById(id).subscribe(obra => patchState(store, { selectedObra: obra }));
            }
          },
          error: () => patchState(store, { error: 'Error al cambiar estado' })
        });
      },

      deleteObra(id: string) {
        service.delete(id).subscribe({
          next: () => _loadObras(),
          error: () => patchState(store, { error: 'Error al eliminar obra' })
        });
      },

      setSearch(search: string) { patchState(store, { search }); },
      setEstadoFiltro(estadoFiltro: string) { patchState(store, { estadoFiltro }); },
      clearSelected() { patchState(store, { selectedObra: null }); },
    };
  })
);
