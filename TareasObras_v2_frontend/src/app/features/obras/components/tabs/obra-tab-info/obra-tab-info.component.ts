import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../../core/auth/auth.service';
import { ObrasStore } from '../../../store/obras.store';

@Component({
  selector: 'app-obra-tab-info',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule],
  templateUrl: './obra-tab-info.component.html'
})
export class ObraTabInfoComponent {
  auth = inject(AuthService);
  store = inject(ObrasStore);
  private msg = inject(MessageService);

  estadoOptions = [
    { label: 'Planificada', value: 1 },
    { label: 'En Progreso', value: 2 },
    { label: 'Finalizada', value: 3 },
    { label: 'Cancelada', value: 4 }
  ];

  cambiarEstado(nuevoEstado: number) {
    const obraId = this.store.selectedObra()?.id;
    if (!obraId) return;
    this.store.cambiarEstadoObra(obraId, nuevoEstado);
    this.msg.add({ severity: 'success', summary: 'Estado actualizado correctamente' });
  }

  estadoBadge(estado: number): string {
    const map: Record<number, string> = {
      0: 'bg-slate-100 text-slate-600', 1: 'bg-blue-100 text-blue-700',
      2: 'bg-amber-100 text-amber-700', 3: 'bg-green-100 text-green-700', 4: 'bg-red-100 text-red-700'
    };
    return map[estado] ?? '';
  }
}
