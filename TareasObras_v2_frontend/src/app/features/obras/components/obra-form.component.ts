import { Component, inject, OnInit, signal, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ObrasStore } from "../store/obras.store";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { DatePickerModule } from "primeng/datepicker";
import { TextareaModule } from "primeng/textarea";
import { CardModule } from "primeng/card";

@Component({
  selector: "app-obra-form",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    TextareaModule,
    CardModule,
  ],
  template: `
    <div class="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <a routerLink="/obras">
          <p-button
            icon="pi pi-arrow-left"
            [text]="true"
            severity="secondary"
            size="small"
          />
        </a>
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">
            {{ isEdit() ? "Editar Obra" : "Nueva Obra" }}
          </h1>
          <p class="text-surface-500 dark:text-surface-400 text-sm">
            {{
              isEdit()
                ? "Modifica los datos de la obra"
                : "Rellena los datos para crear una nueva obra"
            }}
          </p>
        </div>
      </div>

      <!-- Form -->
      <div
        class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 p-6"
      >
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Código -->
            @if (!isEdit()) {
              <div>
                <label class="label-form">Código *</label>
                <input
                  pInputText
                  formControlName="codigo"
                  placeholder="OBR-001"
                  class="w-full"
                />
                @if (invalid("codigo")) {
                  <p class="error-msg">
                    Código obligatorio (máx. 20 caracteres)
                  </p>
                }
              </div>
            }
            <!-- Nombre -->
            <div [class.sm:col-span-2]="isEdit()">
              <label class="label-form">Nombre *</label>
              <input
                pInputText
                formControlName="nombre"
                placeholder="Nombre de la obra"
                class="w-full"
              />
              @if (invalid("nombre")) {
                <p class="error-msg">Nombre obligatorio</p>
              }
            </div>
          </div>

          <!-- Descripción -->
          <div>
            <label class="label-form">Descripción</label>
            <textarea
              pTextarea
              formControlName="descripcion"
              rows="3"
              class="w-full"
              placeholder="Descripción opcional..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Cliente -->
            <div>
              <label class="label-form">Cliente</label>
              <input
                pInputText
                formControlName="cliente"
                placeholder="Nombre del cliente"
                class="w-full"
              />
            </div>
            <!-- Dirección -->
            <div>
              <label class="label-form">Dirección</label>
              <input
                pInputText
                formControlName="direccion"
                placeholder="Dirección de la obra"
                class="w-full"
              />
            </div>
            <!-- Fecha inicio -->
            <div>
              <label class="label-form">Fecha Inicio *</label>
              <p-datepicker
                formControlName="fechaInicio"
                appendTo="body"
                dateFormat="dd/mm/yy"
                styleClass="w-full"
                [showIcon]="true"
                placeholder="Selecciona fecha"
              />
              @if (invalid("fechaInicio")) {
                <p class="error-msg">Fecha de inicio obligatoria</p>
              }
            </div>
            <!-- Fecha fin prevista -->
            <div>
              <label class="label-form">Fecha Fin Prevista</label>
              <p-datepicker
                formControlName="fechaFinPrevista"
                appendTo="body"
                dateFormat="dd/mm/yy"
                styleClass="w-full"
                [showIcon]="true"
                placeholder="Selecciona fecha"
              />
            </div>
            <!-- Presupuesto -->
            <div>
              <label class="label-form">Presupuesto Estimado (€) *</label>
              <p-inputNumber
                formControlName="presupuestoEstimado"
                mode="currency"
                currency="EUR"
                locale="es-ES"
                styleClass="w-full"
                placeholder="0,00"
              />
              @if (invalid("presupuestoEstimado")) {
                <p class="error-msg">Presupuesto inválido</p>
              }
            </div>
          </div>

          <!-- Actions -->
          <div
            class="flex justify-end gap-3 pt-2 border-t border-surface-100 dark:border-surface-700"
          >
            <a routerLink="/obras">
              <p-button
                label="Cancelar"
                severity="secondary"
                [outlined]="true"
              />
            </a>
            <p-button
              type="submit"
              [label]="isEdit() ? 'Guardar cambios' : 'Crear Obra'"
              icon="pi pi-check"
              [loading]="loading()"
              [disabled]="form.invalid"
            />
          </div>
        </form>
      </div>
    </div>
  `,
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
export class ObraFormComponent implements OnInit {
  private store = inject(ObrasStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private msg = inject(MessageService);

  isEdit = signal(false);
  loading = signal(false);
  obraId = signal<string | null>(null);

  form = this.fb.group({
    codigo: ["", [Validators.required, Validators.maxLength(20)]],
    nombre: ["", [Validators.required, Validators.maxLength(200)]],
    descripcion: [""],
    cliente: [""],
    direccion: [""],
    fechaInicio: [null as Date | null, Validators.required],
    fechaFinPrevista: [null as Date | null],
    presupuestoEstimado: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEdit.set(true);
      this.obraId.set(id);
      this.form.get("codigo")?.disable();
      this.store.loadObraById(id);
      setTimeout(() => {
        const obra = this.store.selectedObra();
        if (obra) {
          this.form.patchValue({
            nombre: obra.nombre,
            descripcion: obra.descripcion,
            cliente: obra.cliente,
            direccion: obra.direccion,
            presupuestoEstimado: obra.presupuestoEstimado,
            fechaInicio: new Date(obra.fechaInicio),
            fechaFinPrevista: obra.fechaFinPrevista
              ? new Date(obra.fechaFinPrevista)
              : null,
          });
        }
      }, 500);
    }
  }

  invalid(field: string) {
    const c = this.form.get(field);
    return c?.invalid && c?.touched;
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    const v = this.form.value;
    const payload = {
      nombre: v.nombre!,
      descripcion: v.descripcion ?? undefined,
      cliente: v.cliente ?? undefined,
      direccion: v.direccion ?? undefined,
      fechaInicio: v.fechaInicio!.toISOString(),
      fechaFinPrevista: v.fechaFinPrevista?.toISOString(),
      presupuestoEstimado: v.presupuestoEstimado ?? 0,
    };

    if (this.isEdit()) {
      this.store.updateObra({ id: this.obraId()!, data: payload });
      this.msg.add({
        severity: "success",
        summary: "Guardado",
        detail: "Obra actualizada",
      });
    } else {
      this.store.createObra({ codigo: v.codigo!, ...payload });
      this.msg.add({
        severity: "success",
        summary: "Creada",
        detail: "Obra creada correctamente",
      });
    }
    setTimeout(() => this.router.navigate(["/obras"]), 300);
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.router.navigate(["/obras"]);
    }
  }
}
