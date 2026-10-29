import { Component, inject, OnInit, OnDestroy, model, input, output, signal, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { ObrasService } from '../../../core/services/obras.service';
import { NumeracionService } from '../../../core/services/numeracion.service';
import { ObrasStore } from '../store/obras.store';
import { ObraDetailDto, DisponibilidadCodigo } from '../../../core/models';

@Component({
  selector: 'app-obra-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    TextareaModule,
    SelectModule,
    SkeletonModule,
    TooltipModule
  ],
  templateUrl: './obra-dialog.component.html',
  styles: [
    `
      .label-form {
        @apply block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5;
      }
      .error-msg {
        @apply text-red-500 text-xs mt-1;
      }
    `,
  ],
})
export class ObraDialogComponent implements OnInit, OnDestroy {
  visible = model<boolean>(false);
  obraId = input<string | null>(null);

  saved = output<void>();
  closed = output<void>();

  private fb = inject(FormBuilder);
  private obrasService = inject(ObrasService);
  private numeracionService = inject(NumeracionService);
  private store = inject(ObrasStore);
  private msg = inject(MessageService);

  loadingData = signal(false);
  saving = signal(false);

  // Estados de numeración
  codigoModo = signal<'auto' | 'manual'>('auto');
  codigoSugerido = signal<string>('');
  cargandoSiguiente = signal<boolean>(false);
  codigoChecking = signal<boolean>(false);
  codigoDisponibilidad = signal<DisponibilidadCodigo | null>(null);
  restaurando = signal<boolean>(false);

  private codigoSubject = new Subject<string>();
  private subCodigo?: Subscription;

  estadoOptions = [
    { label: 'Planificada', value: 1 },
    { label: 'En Curso',    value: 2 },
    { label: 'Pausada',     value: 3 },
    { label: 'Completada',  value: 4 },
    { label: 'Cancelada',   value: 5 },
  ];

  form = this.fb.group({
    codigo: [''],
    nombre: ['', [Validators.required, Validators.maxLength(200)]],
    descripcion: [''],
    cliente: [''],
    direccion: [''],
    fechaInicio: [new Date() as Date | null, Validators.required],
    fechaFinPrevista: [null as Date | null],
    presupuestoEstimado: [0, [Validators.required, Validators.min(0)]],
    estado: [2, Validators.required]
  });

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      const id = this.obraId();
      if (isVisible) {
        if (id) {
          this.cargarObra(id);
        } else {
          this.resetNuevo();
        }
      }
    });
  }

  ngOnInit() {
    this.subCodigo = this.codigoSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((cod) => {
        const trimmed = cod.trim();
        if (!trimmed || this.codigoModo() !== 'manual') {
          this.codigoChecking.set(false);
          this.codigoDisponibilidad.set(null);
          return [];
        }
        this.codigoChecking.set(true);
        return this.numeracionService.comprobarDisponible('obra', trimmed);
      })
    ).subscribe({
      next: (disp) => {
        this.codigoChecking.set(false);
        this.codigoDisponibilidad.set(disp);
      },
      error: () => {
        this.codigoChecking.set(false);
      }
    });
  }

  ngOnDestroy() {
    this.subCodigo?.unsubscribe();
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.visible()) {
      this.visible.set(false);
      this.closed.emit();
    }
  }

  private resetNuevo() {
    this.loadingData.set(false);
    this.codigoModo.set('auto');
    this.codigoDisponibilidad.set(null);
    this.codigoChecking.set(false);

    this.form.reset({
      codigo: '',
      nombre: '',
      descripcion: '',
      cliente: '',
      direccion: '',
      fechaInicio: new Date(),
      fechaFinPrevista: null,
      presupuestoEstimado: 0,
      estado: 2
    });

    this.form.get('codigo')?.enable();
    this.form.get('codigo')?.clearValidators();
    this.form.get('codigo')?.updateValueAndValidity();

    this.recargarSiguienteCodigo();
  }

  recargarSiguienteCodigo() {
    this.cargandoSiguiente.set(true);
    this.numeracionService.getSiguiente('obra').subscribe({
      next: (res) => {
        this.codigoSugerido.set(res.codigo);
        this.cargandoSiguiente.set(false);
        if (this.codigoModo() === 'auto') {
          this.form.patchValue({ codigo: res.codigo });
        }
      },
      error: () => {
        this.cargandoSiguiente.set(false);
      }
    });
  }

  setModoCodigo(modo: 'auto' | 'manual') {
    this.codigoModo.set(modo);
    const codigoControl = this.form.get('codigo');

    if (modo === 'auto') {
      codigoControl?.clearValidators();
      codigoControl?.updateValueAndValidity();
      this.codigoDisponibilidad.set(null);
      this.codigoChecking.set(false);
      if (this.codigoSugerido()) {
        codigoControl?.setValue(this.codigoSugerido());
      } else {
        this.recargarSiguienteCodigo();
      }
    } else {
      codigoControl?.setValidators([Validators.required, Validators.maxLength(20)]);
      codigoControl?.updateValueAndValidity();
      codigoControl?.markAsUntouched();
      const actual = codigoControl?.value || '';
      if (actual) {
        this.codigoSubject.next(actual);
      }
    }
  }

  onCodigoManualInput() {
    if (this.codigoModo() === 'manual') {
      const valor = this.form.get('codigo')?.value || '';
      this.codigoSubject.next(valor);
    }
  }

  restaurarObraExistente(id: string) {
    this.restaurando.set(true);
    this.obrasService.restaurar(id).subscribe({
      next: (res) => {
        this.restaurando.set(false);
        this.msg.add({
          severity: 'success',
          summary: 'Obra Restaurada',
          detail: res?.message || 'La obra ha sido restaurada con éxito.'
        });
        this.visible.set(false);
        this.saved.emit();
        this.store.loadObras({});
      },
      error: (err) => {
        this.restaurando.set(false);
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message || 'No se pudo restaurar la obra'
        });
      }
    });
  }

  private cargarObra(id: string) {
    this.loadingData.set(true);
    this.form.get('codigo')?.disable();

    this.obrasService.getById(id).subscribe({
      next: (obra: ObraDetailDto) => {
        this.form.patchValue({
          codigo: obra.codigo,
          nombre: obra.nombre,
          descripcion: obra.descripcion || '',
          cliente: obra.cliente || '',
          direccion: obra.direccion || '',
          presupuestoEstimado: obra.presupuestoEstimado,
          fechaInicio: obra.fechaInicio ? new Date(obra.fechaInicio) : null,
          fechaFinPrevista: obra.fechaFinPrevista ? new Date(obra.fechaFinPrevista) : null,
          estado: obra.estado
        });
        this.loadingData.set(false);
      },
      error: () => {
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la información de la obra'
        });
        this.loadingData.set(false);
        this.visible.set(false);
      }
    });
  }

  invalid(field: string) {
    const c = this.form.get(field);
    return c?.invalid && c?.touched;
  }

  submit() {
    if (this.saving()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.obraId();
    const v = this.form.getRawValue();

    // Verificación si en manual el código está ocupado
    if (!id && this.codigoModo() === 'manual') {
      const disp = this.codigoDisponibilidad();
      if (disp && !disp.disponible) {
        this.msg.add({
          severity: 'warn',
          summary: 'Código no disponible',
          detail: disp.motivo === 'Eliminada'
            ? 'Este código pertenece a una obra eliminada. Puede restaurarla o elegir otro código.'
            : 'Este código ya está en uso por una obra activa.'
        });
        return;
      }
    }

    this.saving.set(true);

    const payload = {
      nombre: v.nombre!,
      descripcion: v.descripcion || undefined,
      cliente: v.cliente || undefined,
      direccion: v.direccion || undefined,
      fechaInicio: v.fechaInicio ? v.fechaInicio.toISOString() : new Date().toISOString(),
      fechaFinPrevista: v.fechaFinPrevista ? v.fechaFinPrevista.toISOString() : undefined,
      presupuestoEstimado: v.presupuestoEstimado ?? 0,
    };

    if (id) {
      this.obrasService.update(id, payload).subscribe({
        next: () => {
          if (v.estado) {
            this.obrasService.cambiarEstado(id, v.estado).subscribe({
              next: () => this.finalizarGuardado('Obra actualizada correctamente'),
              error: () => this.finalizarGuardado('Obra actualizada')
            });
          } else {
            this.finalizarGuardado('Obra actualizada correctamente');
          }
        },
        error: () => {
          this.saving.set(false);
          this.msg.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la obra'
          });
        }
      });
    } else {
      const codigoToSend = this.codigoModo() === 'auto'
        ? (this.codigoSugerido() || '')
        : (v.codigo?.trim() || '');

      this.obrasService.create({ codigo: codigoToSend, ...payload }).subscribe({
        next: (res) => {
          if (v.estado && v.estado !== 1) {
            this.obrasService.cambiarEstado(res.id, v.estado).subscribe({
              next: () => this.finalizarGuardado('Obra creada correctamente'),
              error: () => this.finalizarGuardado('Obra creada correctamente')
            });
          } else {
            this.finalizarGuardado('Obra creada correctamente');
          }
        },
        error: (err) => {
          this.saving.set(false);
          const errorMsg = err?.error?.message || 'No se pudo crear la obra';
          this.msg.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMsg
          });
        }
      });
    }
  }

  private finalizarGuardado(mensaje: string) {
    this.saving.set(false);
    this.msg.add({
      severity: 'success',
      summary: 'Éxito',
      detail: mensaje
    });
    this.visible.set(false);
    this.saved.emit();
    this.store.loadObras({});
  }

  onHide() {
    this.visible.set(false);
    this.closed.emit();
  }
}
