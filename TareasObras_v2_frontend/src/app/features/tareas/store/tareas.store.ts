import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { TareasService } from '../../../core/services/tareas.service';
import { TareaDto, CreateTareaRequest, UpdateTareaRequest, CambiarEstadoRequest, EstadoTarea } from '../../../core/models';

interface TareasState {
  tareas: TareaDto[];
  loading: boolean;
  error: string | null;
  currentObraId: string | null;
}

const initialState: TareasState = {
  tareas: [], loading: false, error: null, currentObraId: null
};

export const TareasStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ tareas }) => ({
    pendientes:  computed(() => tareas().filter(t => t.estado === EstadoTarea.Pendiente)),
    enProgreso:  computed(() => tareas().filter(t => t.estado === EstadoTarea.EnProgreso)),
    bloqueadas:  computed(() => tareas().filter(t => t.estado === EstadoTarea.Bloqueada)),
    completadas: computed(() => tareas().filter(t => t.estado === EstadoTarea.Completada)),
    horasTotalesEstimadas: computed(() => tareas().reduce((s, t) => s + t.horasEstimadas, 0)),
    horasTotalesReales:    computed(() => tareas().reduce((s, t) => s + t.horasReales, 0)),
  })),
  withMethods((store, service = inject(TareasService)) => {

    const _reload = () => {
      const obraId = store.currentObraId();
      if (obraId) {
        service.getByObra(obraId).subscribe({
          next: (tareas: TareaDto[]) => patchState(store, { tareas, loading: false }),
          error: () => patchState(store, { loading: false, error: 'Error al cargar tareas' })
        });
      }
    };

    return {
      loadByObra(obraId: string) {
        patchState(store, { loading: true, currentObraId: obraId });
        service.getByObra(obraId).subscribe({
          next: (tareas: TareaDto[]) => patchState(store, { tareas, loading: false }),
          error: () => patchState(store, { loading: false, error: 'Error al cargar tareas' })
        });
      },

      createTarea(data: CreateTareaRequest) {
        service.create(data).subscribe({
          next: () => _reload(),
          error: () => patchState(store, { error: 'Error al crear tarea' })
        });
      },

      updateTarea(payload: { id: string; data: UpdateTareaRequest }) {
        service.update(payload.id, payload.data).subscribe({
          next: () => _reload(),
          error: () => patchState(store, { error: 'Error al actualizar tarea' })
        });
      },

      cambiarEstado(payload: { id: string; data: CambiarEstadoRequest }) {
        service.cambiarEstado(payload.id, payload.data).subscribe({
          next: () => _reload(),
          error: () => patchState(store, { error: 'Error al cambiar estado' })
        });
      },

      deleteTarea(id: string) {
        service.delete(id).subscribe({
          next: () => _reload(),
          error: () => patchState(store, { error: 'Error al eliminar tarea' })
        });
      },
    };
  })
);
