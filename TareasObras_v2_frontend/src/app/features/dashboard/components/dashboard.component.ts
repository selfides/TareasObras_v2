import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ObrasService } from '../../../core/services/obras.service';
import { TareasService } from '../../../core/services/tareas.service';
import { ObraListDto } from '../../../core/models';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, ButtonModule, ChartModule, TagModule, SkeletonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private obrasService = inject(ObrasService);
  loading = signal(true);
  obras = signal<ObraListDto[]>([]);

  kpis = signal<any[]>([]);
  estadoData = signal<any>({});
  presupuestoData = signal<any>({});

  doughnutOptions = { plugins: { legend: { position: 'bottom' } }, cutout: '65%' };
  barOptions = { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };

  ngOnInit() {
    this.obrasService.getAll().subscribe(obras => {
      this.obras.set(obras);
      this.loading.set(false);
      this.buildKpis(obras);
      this.buildCharts(obras);
    });
  }

  private buildKpis(obras: ObraListDto[]) {
    const enCurso = obras.filter(o => o.estado === 2).length;
    const totalTareas = obras.reduce((s, o) => s + o.totalTareas, 0);
    const pendientes = obras.reduce((s, o) => s + o.tareasPendientes, 0);
    const presupuesto = obras.reduce((s, o) => s + o.presupuestoEstimado, 0);
    this.kpis.set([
      { label: 'Total Obras',       value: obras.length, icon: 'pi pi-building',   color: 'bg-blue-500',   sub: `${enCurso} en curso` },
      { label: 'Tareas Pendientes', value: pendientes,   icon: 'pi pi-clock',      color: 'bg-amber-500',  sub: `de ${totalTareas} totales` },
      { label: 'Obras En Curso',    value: enCurso,      icon: 'pi pi-hammer',     color: 'bg-green-500',  sub: 'activas ahora' },
      { label: 'Presupuesto Total', value: `${(presupuesto/1000).toFixed(0)}K €`, icon: 'pi pi-euro', color: 'bg-purple-500', sub: 'estimado' },
    ]);
  }

  private buildCharts(obras: ObraListDto[]) {
    const estados = [
      obras.filter(o => o.estado === 1).length,
      obras.filter(o => o.estado === 2).length,
      obras.filter(o => o.estado === 3).length,
      obras.filter(o => o.estado === 4).length,
      obras.filter(o => o.estado === 5).length,
    ];
    this.estadoData.set({
      labels: ['Planificada', 'En Curso', 'Pausada', 'Completada', 'Cancelada'],
      datasets: [{ data: estados, backgroundColor: ['#94a3b8','#3b82f6','#f59e0b','#22c55e','#ef4444'], borderWidth: 0 }]
    });
    const top5 = obras.slice(0, 6);
    this.presupuestoData.set({
      labels: top5.map(o => o.codigo),
      datasets: [{
        data: top5.map(o => o.presupuestoEstimado),
        backgroundColor: '#3b82f6', borderRadius: 6
      }]
    });
  }

  estadoBadge(estado: number): string {
    const map: Record<number, string> = {
      1: 'badge-planificada', 2: 'badge-encurso', 3: 'badge-pausada',
      4: 'badge-completada',  5: 'badge-cancelada'
    };
    return map[estado] ?? '';
  }
}
