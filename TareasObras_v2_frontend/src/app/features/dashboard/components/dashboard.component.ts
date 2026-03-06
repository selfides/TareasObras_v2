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
  template: `
    <div class="space-y-6 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Dashboard</h1>
          <p class="text-surface-500 dark:text-surface-400 text-sm mt-0.5">Resumen general del proyecto</p>
        </div>
        <a routerLink="/obras/nueva">
          <p-button label="Nueva Obra" icon="pi pi-plus" size="small" />
        </a>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        @for (kpi of kpis(); track kpi.label) {
          <div class="bg-white dark:bg-surface-900 rounded-xl p-5 border border-surface-200 dark:border-surface-700 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-surface-500 dark:text-surface-400">{{ kpi.label }}</p>
                <p class="text-3xl font-bold text-surface-900 dark:text-surface-50 mt-1">{{ kpi.value }}</p>
                @if (kpi.sub) {
                  <p class="text-xs text-surface-400 dark:text-surface-500 mt-1">{{ kpi.sub }}</p>
                }
              </div>
              <div [class]="'w-10 h-10 rounded-lg flex items-center justify-center ' + kpi.color">
                <i [class]="kpi.icon + ' text-white'"></i>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Charts row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Estado obras -->
        <div class="bg-white dark:bg-surface-900 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
          <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">Estado de Obras</h3>
          @if (loading()) {
            <p-skeleton height="240px" />
          } @else {
            <p-chart type="doughnut" [data]="estadoData()" [options]="doughnutOptions" height="240px" />
          }
        </div>

        <!-- Presupuesto por obra -->
        <div class="bg-white dark:bg-surface-900 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
          <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">Presupuesto por Obra (€)</h3>
          @if (loading()) {
            <p-skeleton height="240px" />
          } @else {
            <p-chart type="bar" [data]="presupuestoData()" [options]="barOptions" height="240px" />
          }
        </div>
      </div>

      <!-- Obras recientes -->
      <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700">
        <div class="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
          <h3 class="font-semibold text-surface-900 dark:text-surface-100">Obras Recientes</h3>
          <a routerLink="/obras" class="text-primary-600 dark:text-primary-400 text-sm hover:underline">Ver todas →</a>
        </div>
        <div class="overflow-x-auto">
          @if (loading()) {
            <div class="p-4 space-y-3">
              @for (i of [1,2,3]; track i) { <p-skeleton height="40px" /> }
            </div>
          } @else {
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-surface-50 dark:bg-surface-800 text-left">
                  <th class="px-4 py-3 font-semibold text-surface-600 dark:text-surface-400">Código</th>
                  <th class="px-4 py-3 font-semibold text-surface-600 dark:text-surface-400">Nombre</th>
                  <th class="px-4 py-3 font-semibold text-surface-600 dark:text-surface-400">Estado</th>
                  <th class="px-4 py-3 font-semibold text-surface-600 dark:text-surface-400">Tareas</th>
                  <th class="px-4 py-3 font-semibold text-surface-600 dark:text-surface-400">Presupuesto</th>
                </tr>
              </thead>
              <tbody>
                @for (obra of obras().slice(0, 5); track obra.id) {
                  <tr class="border-t border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800 cursor-pointer"
                      [routerLink]="['/obras', obra.id]">
                    <td class="px-4 py-3 font-mono text-xs text-surface-500">{{ obra.codigo }}</td>
                    <td class="px-4 py-3 font-medium text-surface-900 dark:text-surface-100">{{ obra.nombre }}</td>
                    <td class="px-4 py-3">
                      <span [class]="'px-2 py-0.5 rounded-full text-xs font-medium ' + estadoBadge(obra.estado)">
                        {{ obra.estadoNombre }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="text-surface-700 dark:text-surface-300">{{ obra.tareasPendientes }}</span>
                      <span class="text-surface-400"> / {{ obra.totalTareas }}</span>
                    </td>
                    <td class="px-4 py-3 font-medium text-surface-900 dark:text-surface-100">
                      {{ obra.presupuestoEstimado | number:'1.0-0' }} €
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    </div>
  `
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
