import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ObrasStore } from '../store/obras.store';
import { AuthService } from '../../../core/auth/auth.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-obras-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TableModule, ButtonModule,
            InputTextModule, SelectModule, TagModule, ConfirmDialogModule, TooltipModule, SkeletonModule],
  providers: [ConfirmationService],
  templateUrl: './obras-list.component.html'
})
export class ObrasListComponent implements OnInit {
  store = inject(ObrasStore);
  auth = inject(AuthService);
  private confirm = inject(ConfirmationService);
  private msg = inject(MessageService);

  searchText = '';
  estadoFiltro = '';

  estadoOptions = [
    { label: 'Planificada', value: 'Planificada' },
    { label: 'En Curso',    value: 'EnCurso' },
    { label: 'Pausada',     value: 'Pausada' },
    { label: 'Completada',  value: 'Completada' },
    { label: 'Cancelada',   value: 'Cancelada' },
  ];

  ngOnInit() { this.store.loadObras({}); }

  onSearch() { this.store.loadObras({ search: this.searchText, estado: this.estadoFiltro }); }
  onFiltro() { this.store.loadObras({ search: this.searchText, estado: this.estadoFiltro }); }

  confirmDelete(obra: any) {
    this.confirm.confirm({
      message: `¿Eliminar la obra <strong>${obra.nombre}</strong>?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar', rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.deleteObra(obra.id);
        this.msg.add({ severity: 'success', summary: 'Eliminada', detail: obra.nombre });
      }
    });
  }

  estadoBadge(estado: number): string {
    const map: Record<number,string> = {
      1:'badge-planificada', 2:'badge-encurso', 3:'badge-pausada', 4:'badge-completada', 5:'badge-cancelada'
    };
    return map[estado] ?? '';
  }
}
