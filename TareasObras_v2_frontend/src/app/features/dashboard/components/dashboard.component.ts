import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ObrasService } from '../../../core/services/obras.service';
import { TareasService } from '../../../core/services/tareas.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ObraListDto } from '../../../core/models';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { ObraDialogComponent } from '../../obras/components/obra-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule,
    ChartModule,
    TagModule,
    SkeletonModule,
    TooltipModule,
    ObraDialogComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private obrasService = inject(ObrasService);
  private tareasService = inject(TareasService);
  auth = inject(AuthService);

  loading = signal(true);
  obras = signal<ObraListDto[]>([]);
  kpis = signal<any[]>([]);
  estadoData = signal<any>({});
  presupuestoData = signal<any>({});
  tareasUrgentes = signal<any[]>([]);
  obrasDesviadas = signal<ObraListDto[]>([]);
  dlgNuevaObra = signal(false);

  resumenFinanciero = signal({
    totalEstimado: 0,
    totalReal: 0,
    desviacionTotal: 0,
    porcentajeEjecutado: 0
  });

  doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, boxWidth: 8, padding: 16 }
      }
    },
    cutout: '68%',
    maintainAspectRatio: false
  };

  barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { usePointStyle: true, boxWidth: 8 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `${value} €`
        }
      }
    }
  };

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading.set(true);
    this.obrasService.getAll().subscribe({
      next: (obras) => {
        this.obras.set(obras);
        this.buildKpis(obras);
        this.buildCharts(obras);
        this.obrasDesviadas.set(
          obras.filter(o => o.presupuestoEstimado > 0 && o.presupuestoReal > o.presupuestoEstimado)
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    this.tareasService.getAll().subscribe({
      next: (tareas) => {
        const urgentes = (tareas || []).filter((t: any) =>
          (t.prioridad >= 3 && t.estado !== 4) || t.estado === 3
        ).slice(0, 5);
        this.tareasUrgentes.set(urgentes);
      },
      error: () => this.tareasUrgentes.set([])
    });
  }

  private buildKpis(obras: ObraListDto[]) {
    const enCurso = obras.filter(o => o.estado === 2).length;
    const totalTareas = obras.reduce((s, o) => s + (o.totalTareas || 0), 0);
    const pendientes = obras.reduce((s, o) => s + (o.tareasPendientes || 0), 0);
    const totalEstimado = obras.reduce((s, o) => s + (o.presupuestoEstimado || 0), 0);
    const totalReal = obras.reduce((s, o) => s + (o.presupuestoReal || 0), 0);
    const porcentaje = totalEstimado > 0 ? (totalReal / totalEstimado) * 100 : 0;

    this.resumenFinanciero.set({
      totalEstimado,
      totalReal,
      desviacionTotal: totalReal - totalEstimado,
      porcentajeEjecutado: porcentaje
    });

    this.kpis.set([
      {
        label: 'Total Obras',
        value: obras.length,
        icon: 'pi pi-building',
        colorClass: 'bg-blue-500 text-white',
        lightBg: 'group-hover:border-blue-300 dark:group-hover:border-blue-700',
        sub: `${enCurso} en curso activa${enCurso === 1 ? '' : 's'}`,
        route: ['/obras'],
        queryParams: {},
        linkText: 'Ver listado'
      },
      {
        label: 'Obras En Curso',
        value: enCurso,
        icon: 'pi pi-hammer',
        colorClass: 'bg-emerald-500 text-white',
        lightBg: 'group-hover:border-emerald-300 dark:group-hover:border-emerald-700',
        sub: `${obras.length - enCurso} en otros estados`,
        route: ['/obras'],
        queryParams: { estado: 'EnCurso' },
        linkText: 'Filtrar en curso'
      },
      {
        label: 'Tareas Pendientes',
        value: pendientes,
        icon: 'pi pi-clock',
        colorClass: 'bg-amber-500 text-white',
        lightBg: 'group-hover:border-amber-300 dark:group-hover:border-amber-700',
        sub: `de ${totalTareas} tareas totales`,
        route: ['/tareas'],
        queryParams: { sinFecha: 'true', estado: 'Pendiente' },
        linkText: 'Ver tareas pendientes'
      },
      {
        label: 'Presupuesto Global',
        value: `${(totalEstimado / 1000).toFixed(1)}k €`,
        icon: 'pi pi-wallet',
        colorClass: 'bg-purple-500 text-white',
        lightBg: 'group-hover:border-purple-300 dark:group-hover:border-purple-700',
        sub: `Real: ${(totalReal / 1000).toFixed(1)}k € (${porcentaje.toFixed(0)}%)`,
        route: ['/obras'],
        queryParams: {},
        linkText: 'Ver finanzas obras'
      },
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
      datasets: [{
        data: estados,
        backgroundColor: ['#94a3b8', '#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
        borderWidth: 0
      }]
    });

    const top6 = obras.slice(0, 6);
    this.presupuestoData.set({
      labels: top6.map(o => o.codigo),
      datasets: [
        {
          label: 'Presupuesto Estimado (€)',
          data: top6.map(o => o.presupuestoEstimado),
          backgroundColor: '#3b82f6',
          borderRadius: 6
        },
        {
          label: 'Coste Real (€)',
          data: top6.map(o => o.presupuestoReal),
          backgroundColor: '#8b5cf6',
          borderRadius: 6
        }
      ]
    });
  }

  abrirNuevaObra() {
    this.dlgNuevaObra.set(true);
  }

  onObraGuardada() {
    this.cargarDatos();
  }

  estadoBadge(estado: number): string {
    const map: Record<number, string> = {
      1: 'badge-planificada', 2: 'badge-encurso', 3: 'badge-pausada',
      4: 'badge-completada',  5: 'badge-cancelada'
    };
    return map[estado] ?? '';
  }

  prioridadBadge(prioridad: number): string {
    const map: Record<number, string> = {
      1: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
      2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      3: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      4: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    };
    return map[prioridad] ?? '';
  }
}
