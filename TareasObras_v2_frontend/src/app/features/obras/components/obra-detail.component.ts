import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ObrasStore } from '../store/obras.store';
import { AuthService } from '../../../core/auth/auth.service';
import { PresupuestoDto } from '../../../core/models';
import { PartidaDto, LineaPartidaDto } from '../../../core/services/partidas.service';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';
import { ObraTabInfoComponent } from './tabs/obra-tab-info/obra-tab-info.component';
import { ObraTabPresupuestosComponent } from './tabs/obra-tab-presupuestos/obra-tab-presupuestos.component';
import { ObraTabManoObraComponent } from './tabs/obra-tab-mano-obra/obra-tab-mano-obra.component';
import { ObraTabMaterialesComponent } from './tabs/obra-tab-materiales/obra-tab-materiales.component';
import { ObraDialogComponent } from './obra-dialog.component';

@Component({
  selector: 'app-obra-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonModule, SkeletonModule,
            TabsModule,
            ObraTabInfoComponent, ObraTabPresupuestosComponent, ObraTabManoObraComponent, ObraTabMaterialesComponent,
            ObraDialogComponent],
  templateUrl: './obra-detail.component.html'
})
export class ObraDetailComponent implements OnInit {
  store           = inject(ObrasStore);
  auth            = inject(AuthService);
  private route   = inject(ActivatedRoute);

  // signals principales
  obraId = signal<string>('');
  activeTab = signal<string>('info');

  partidas = signal<PartidaDto[]>([]);
  presupuestoAprobado = signal<PresupuestoDto | null>(null);

  // Totales locales recibidos de las pestanas hijas
  totalCosteHoras = signal<number | null>(null);
  totalMaterialesReal = signal<number | null>(null);

  dlgEditarObra = signal(false);

  // computed
  availableMaterialBudgetLines = computed(() => {
    const res: any[] = [];
    this.partidas().forEach(p => {
      p.lineas.filter(l => l.tipo === 'Material').forEach(l => {
        res.push({ label: `${p.nombre} - ${l.descripcion}`, value: l.id });
      });
    });
    return res;
  });
  presupuestoAprobadoTotal    = computed(() => this.presupuestoAprobado()?.total ?? 0);
  presupuestoAprobadoMaterial = computed(() => this.presupuestoAprobado()?.totalMaterial ?? 0);
  presupuestoAprobadoHoras    = computed(() => this.presupuestoAprobado()?.totalHoras ?? 0);
  costeReal                   = computed(() => {
    const h = this.totalCosteHoras();
    const m = this.totalMaterialesReal();
    if (h !== null && m !== null) {
      return h + m;
    }
    return this.store.selectedObra()?.presupuestoReal ?? 0;
  });
  desviacion                  = computed(() => this.costeReal() - this.presupuestoAprobadoTotal());

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.obraId.set(id);
    this.store.loadObraById(id);

    this.route.queryParamMap.subscribe(params => {
      if (params.get('editar') === 'true') {
        this.abrirEditarObra();
      }
    });
  }

  abrirEditarObra() {
    this.dlgEditarObra.set(true);
  }

  onObraGuardada() {
    this.store.loadObraById(this.obraId());
  }

  onTotalesHoras(event: {horas: number, coste: number}) {
    this.totalCosteHoras.set(event.coste);
  }

  onTotalesMateriales(coste: number) {
    this.totalMaterialesReal.set(coste);
  }

  estadoBadge(estado: number): string {
    const map: Record<number, string> = {
      0: 'bg-slate-100 text-slate-600', 1: 'bg-blue-100 text-blue-700',
      2: 'bg-amber-100 text-amber-700', 3: 'bg-green-100 text-green-700', 4: 'bg-red-100 text-red-700'
    };
    return map[estado] ?? '';
  }
}