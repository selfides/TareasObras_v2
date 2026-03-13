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
import { SelectModule } from "primeng/select";
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
    SelectModule
  ],
  templateUrl: './obra-form.component.html',
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
  estadoOptions = [
    { label: 'Planificada', value: 1 },
    { label: 'En Curso',    value: 2 },
    { label: 'Pausada',     value: 3 },
    { label: 'Completada',  value: 4 },
    { label: 'Cancelada',   value: 5 },
  ];

  form = this.fb.group({
    codigo: ["", [Validators.required, Validators.maxLength(20)]],
    nombre: ["", [Validators.required, Validators.maxLength(200)]],
    descripcion: [""],
    cliente: [""],
    direccion: [""],
    fechaInicio: [null as Date | null, Validators.required],
    fechaFinPrevista: [null as Date | null],
    presupuestoEstimado: [0, [Validators.required, Validators.min(0)]],
    estado: [2, Validators.required]
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
            estado: obra.estado
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
      const currentEstado = this.store.selectedObra()?.estado;
      if (v.estado && v.estado !== currentEstado) {
        this.store.cambiarEstadoObra(this.obraId()!, v.estado);
      }
      this.msg.add({
        severity: "success",
        summary: "Guardado",
        detail: "Obra actualizada",
      });
    } else {
      this.store.createObra({ data: { codigo: v.codigo!, ...payload }, estado: v.estado! });
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
