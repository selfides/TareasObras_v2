import { Component, inject, OnInit, model, input, output, signal, effect, HostListener } from '@angular/core';
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

import { ObrasService } from '../../../core/services/obras.service';
import { ObrasStore } from '../store/obras.store';
import { ObraDetailDto } from '../../../core/models';

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
    SkeletonModule
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
export class ObraDialogComponent implements OnInit {
  visible = model<boolean>(false);
  obraId = input<string | null>(null);

  saved = output<void>();
  closed = output<void>();

  private fb = inject(FormBuilder);
  private obrasService = inject(ObrasService);
  private store = inject(ObrasStore);
  private msg = inject(MessageService);

  loadingData = signal(false);
  saving = signal(false);

  estadoOptions = [
    { label: 'Planificada', value: 1 },
    { label: 'En Curso',    value: 2 },
    { label: 'Pausada',     value: 3 },
    { label: 'Completada',  value: 4 },
    { label: 'Cancelada',   value: 5 },
  ];

  form = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(20)]],
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

  ngOnInit() {}

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.visible()) {
      this.visible.set(false);
      this.closed.emit();
    }
  }

  private resetNuevo() {
    this.loadingData.set(false);
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const v = this.form.getRawValue();
    const id = this.obraId();

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
      this.obrasService.create({ codigo: v.codigo!, ...payload }).subscribe({
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
