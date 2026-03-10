import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperariosService } from '../../../core/services/operarios.service';
import { CategoriasOperarioService } from '../../../core/services/categorias-operario.service';
import { OperarioDto, CategoriaOperarioDto } from '../../../core/models';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-operarios',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
            InputTextModule, InputNumberModule, SelectModule, TabsModule],
  templateUrl: './operarios.component.html'
})
export class OperariosComponent implements OnInit {
  private operariosSvc  = inject(OperariosService);
  private categoriasSvc = inject(CategoriasOperarioService);
  private msg           = inject(MessageService);

  operarios  = signal<OperarioDto[]>([]);
  categorias = signal<CategoriaOperarioDto[]>([]);
  loading    = signal(true);
  saving     = signal(false);
  activeTab  = signal('operarios');

  dlgOperario  = false;
  dlgCategoria = false;
  editandoOperario:  string | null = null;
  editandoCategoria: string | null = null;

  operarioForm:  any = { nombre: '', apellidos: '', dni: '', telefono: '', categoriaOperarioId: null };
  categoriaForm: any = { nombre: '', costeHoraBase: 0 };

  ngOnInit() { this.cargar(); }

  cargar() {
    this.loading.set(true);
    this.operariosSvc.getAll(false).subscribe(o => { this.operarios.set(o); this.loading.set(false); });
    this.categoriasSvc.getAll().subscribe(c => this.categorias.set(c));
  }

  abrirDlgOperario(o?: OperarioDto) {
    this.editandoOperario = o?.id ?? null;
    this.operarioForm = o
      ? { nombre: o.nombre, apellidos: o.apellidos, dni: o.dni ?? '', telefono: o.telefono ?? '', categoriaOperarioId: o.categoriaOperarioId }
      : { nombre: '', apellidos: '', dni: '', telefono: '', categoriaOperarioId: null };
    this.dlgOperario = true;
  }

  guardarOperario() {
    if (!this.operarioForm.nombre || !this.operarioForm.categoriaOperarioId) return;
    this.saving.set(true);
    const obs = this.editandoOperario
      ? this.operariosSvc.update(this.editandoOperario, this.operarioForm)
      : this.operariosSvc.create(this.operarioForm);
    obs.subscribe({
      next: () => {
        this.dlgOperario = false; this.saving.set(false);
        this.cargar();
        this.msg.add({ severity: 'success', summary: this.editandoOperario ? 'Operario actualizado' : 'Operario creado' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  eliminarOperario(id: string) {
    this.operariosSvc.delete(id).subscribe({
      next: () => { this.cargar(); this.msg.add({ severity: 'success', summary: 'Operario eliminado' }); },
      error: () => this.msg.add({ severity: 'error', summary: 'No se puede eliminar' })
    });
  }

  abrirDlgCategoria(c?: CategoriaOperarioDto) {
    this.editandoCategoria = c?.id ?? null;
    this.categoriaForm = c ? { nombre: c.nombre, costeHoraBase: c.costeHoraBase } : { nombre: '', costeHoraBase: 0 };
    this.dlgCategoria = true;
  }

  guardarCategoria() {
    if (!this.categoriaForm.nombre) return;
    this.saving.set(true);
    const obs = this.editandoCategoria
      ? this.categoriasSvc.update(this.editandoCategoria, this.categoriaForm)
      : this.categoriasSvc.create(this.categoriaForm);
    obs.subscribe({
      next: () => {
        this.dlgCategoria = false; this.saving.set(false);
        this.cargar();
        this.msg.add({ severity: 'success', summary: this.editandoCategoria ? 'Categoria actualizada' : 'Categoria creada' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  eliminarCategoria(id: string) {
    this.categoriasSvc.delete(id).subscribe({
      next: () => { this.cargar(); this.msg.add({ severity: 'success', summary: 'Categoria eliminada' }); },
      error: () => this.msg.add({ severity: 'error', summary: 'No se puede eliminar - tiene operarios asignados' })
    });
  }
}