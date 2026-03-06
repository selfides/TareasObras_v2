import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ObrasStore } from '../store/obras.store';
import { AuthService } from '../../../core/auth/auth.service';
import { PresupuestosService } from '../../../core/services/presupuestos.service';
import { RegistroHorasService } from '../../../core/services/registro-horas.service';
import { MaterialesObraService } from '../../../core/services/materiales-obra.service';
import { OperariosService } from '../../../core/services/operarios.service';
import { CategoriasOperarioService } from '../../../core/services/categorias-operario.service';
import { PartidasService, PartidaDto, LineaPartidaDto } from '../../../core/services/partidas.service';
import { PresupuestoDto, RegistroHorasDto, MaterialObraDto, OperarioDto, CategoriaOperarioDto } from '../../../core/models';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-obra-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonModule, SkeletonModule,
            TabsModule, TableModule, DialogModule, ConfirmDialogModule, InputTextModule,
            InputNumberModule, SelectModule, DatePickerModule, TextareaModule, TagModule, TooltipModule],
  template: `
    <div class="space-y-5 animate-fade-in">
      @if (store.loading()) {
        <div class="space-y-4"><p-skeleton height="60px" /><p-skeleton height="200px" /></div>
      }
      @if (!store.loading() && store.selectedObra()) {

        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <a routerLink="/obras">
              <p-button icon="pi pi-arrow-left" [text]="true" severity="secondary" size="small" />
            </a>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-mono text-sm bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded text-surface-500">{{ store.selectedObra()!.codigo }}</span>
                <span [class]="'px-2 py-0.5 rounded-full text-xs font-medium ' + estadoBadge(store.selectedObra()!.estado)">{{ store.selectedObra()!.estadoNombre }}</span>
              </div>
              <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 mt-1">{{ store.selectedObra()!.nombre }}</h1>
            </div>
          </div>
          @if (auth.isSupervisor()) {
            <div class="flex gap-2">
              <a [routerLink]="['/obras', store.selectedObra()!.id, 'tareas']">
                <p-button label="Kanban" icon="pi pi-list-check" size="small" [outlined]="true" />
              </a>
              <a [routerLink]="['/obras', store.selectedObra()!.id, 'editar']">
                <p-button label="Editar" icon="pi pi-pencil" size="small" />
              </a>
            </div>
          }
        </div>

        <!-- KPIs -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-surface-900 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
            <p class="text-xs text-surface-500">Presupuesto aprobado</p>
            <p class="text-xl font-bold text-surface-900 dark:text-surface-50 mt-1">{{ presupuestoAprobadoTotal() | number:'1.0-0' }} €</p>
          </div>
          <div class="bg-white dark:bg-surface-900 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
            <p class="text-xs text-surface-500">Coste real</p>
            <p class="text-xl font-bold mt-1" [class]="costeReal() > presupuestoAprobadoTotal() ? 'text-red-600' : 'text-green-600'">{{ costeReal() | number:'1.0-0' }} €</p>
          </div>
          <div class="bg-white dark:bg-surface-900 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
            <p class="text-xs text-surface-500">Desviacion</p>
            <p class="text-xl font-bold mt-1" [class]="desviacion() > 0 ? 'text-red-600' : 'text-green-600'">{{ desviacion() > 0 ? '+' : '' }}{{ desviacion() | number:'1.0-0' }} €</p>
          </div>
          <div class="bg-white dark:bg-surface-900 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
            <p class="text-xs text-surface-500">Tareas pendientes</p>
            <p class="text-xl font-bold text-amber-600 mt-1">{{ store.selectedObra()!.tareasPendientes }}</p>
          </div>
        </div>

        <!-- Tabs -->
        <p-tabs [(value)]="activeTab">
          <p-tablist>
            <p-tab value="info">Informacion</p-tab>
            <p-tab value="presupuesto">Presupuesto</p-tab>
            <p-tab value="horas">Mano de Obra</p-tab>
            <p-tab value="materiales">Materiales</p-tab>
          </p-tablist>
          <p-tabpanels>

            <!-- TAB INFO -->
            <p-tabpanel value="info">
              <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 p-6 mt-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-6 pb-6 border-b border-surface-100 dark:border-surface-700">
                  <div><span class="text-surface-500">Cliente:</span><span class="ml-2 font-medium">{{ store.selectedObra()!.cliente || '-' }}</span></div>
                  <div><span class="text-surface-500">Direccion:</span><span class="ml-2 font-medium">{{ store.selectedObra()!.direccion || '-' }}</span></div>
                  <div><span class="text-surface-500">Inicio:</span><span class="ml-2 font-medium">{{ store.selectedObra()!.fechaInicio | date:'dd/MM/yyyy' }}</span></div>
                  <div><span class="text-surface-500">Fin previsto:</span><span class="ml-2 font-medium">{{ store.selectedObra()!.fechaFinPrevista ? (store.selectedObra()!.fechaFinPrevista | date:'dd/MM/yyyy') : '-' }}</span></div>
                  <div><span class="text-surface-500">Creado por:</span><span class="ml-2 font-medium">{{ store.selectedObra()!.createdBy || '-' }}</span></div>
                </div>
                @if (store.selectedObra()!.descripcion) {
                  <p class="text-surface-600 dark:text-surface-300 text-sm">{{ store.selectedObra()!.descripcion }}</p>
                }
              </div>
            </p-tabpanel>

            <!-- TAB PRESUPUESTO -->
            <p-tabpanel value="presupuesto">
              <div class="space-y-3 mt-4">
                <div class="flex justify-between items-center">
                  <h3 class="font-semibold text-surface-900 dark:text-surface-50">Versiones de presupuesto</h3>
                  @if (auth.isSupervisor()) {
                    <p-button label="Nuevo presupuesto" icon="pi pi-plus" size="small" (onClick)="dlgPresupuesto = true" />
                  }
                </div>

                @for (p of presupuestos(); track p.id) {
                  <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                    <!-- Cabecera presupuesto -->
                    <div class="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-surface-100 dark:border-surface-700">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="font-mono font-semibold text-sm">{{ p.numero || ('v' + p.version) }}</span>
                        <span [class]="'px-2 py-0.5 rounded-full text-xs font-medium ' + (p.esAprobado ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')">{{ p.estadoNombre }}</span>
                        <span class="text-xs text-surface-400">{{ p.fecha | date:'dd/MM/yyyy' }}</span>
                        @if (p.descripcion) { <span class="text-xs text-surface-500 italic">{{ p.descripcion }}</span> }
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-blue-600 text-sm">{{ p.total | number:'1.0-0' }} €</span>
                        @if (!p.esAprobado && auth.isSupervisor()) {
                          <p-button label="Aprobar" icon="pi pi-check" size="small" severity="success" (onClick)="aprobarPresupuesto(p.id)" />
                        }
                        <p-button [label]="presupuestoSeleccionado() === p.id ? 'Cerrar' : 'Ver partidas'"
                                  [icon]="presupuestoSeleccionado() === p.id ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                                  size="small" [outlined]="true"
                                  (onClick)="presupuestoSeleccionado() === p.id ? presupuestoSeleccionado.set(null) : seleccionarPresupuesto(p.id)" />
                      </div>
                    </div>

                    <!-- Totales -->
                    <div class="grid grid-cols-3 gap-0 text-sm border-b border-surface-100 dark:border-surface-700">
                      <div class="text-center p-3 border-r border-surface-100 dark:border-surface-700">
                        <p class="text-surface-400 text-xs">Materiales</p>
                        <p class="font-semibold">{{ p.totalMaterial | number:'1.0-0' }} €</p>
                      </div>
                      <div class="text-center p-3 border-r border-surface-100 dark:border-surface-700">
                        <p class="text-surface-400 text-xs">Mano de obra</p>
                        <p class="font-semibold">{{ p.totalHoras | number:'1.0-0' }} €</p>
                      </div>
                      <div class="text-center p-3">
                        <p class="text-blue-500 text-xs">Total</p>
                        <p class="font-bold text-blue-600">{{ p.total | number:'1.0-0' }} €</p>
                      </div>
                    </div>

                    <!-- Partidas (expandible) -->
                    @if (presupuestoSeleccionado() === p.id) {
                      <div class="p-4 space-y-3 bg-surface-50 dark:bg-surface-800">
                        <div class="flex justify-between items-center">
                          <p class="text-sm font-semibold text-surface-700 dark:text-surface-300">Partidas</p>
                          @if (auth.isSupervisor() && !p.esAprobado) {
                            <p-button label="Nueva partida" icon="pi pi-plus" size="small" [text]="true" (onClick)="abrirNuevaPartida()" />
                          }
                        </div>

                        @for (partida of partidas(); track partida.id) {
                          <div class="bg-white dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
                            <!-- Cabecera partida -->
                            <div class="flex items-center justify-between px-3 py-2 bg-surface-50 dark:bg-surface-800 border-b border-surface-100 dark:border-surface-700">
                              <div class="flex items-center gap-2">
                                <span class="font-medium text-sm">{{ partida.nombre }}</span>
                                @if (partida.descripcion) { <span class="text-xs text-surface-400">{{ partida.descripcion }}</span> }
                              </div>
                              <div class="flex items-center gap-1">
                                <span class="text-sm font-bold text-blue-600 mr-2">{{ partida.total | number:'1.2-2' }} €</span>
                                @if (auth.isSupervisor() && !p.esAprobado) {
                                  <p-button icon="pi pi-pencil" [text]="true" size="small" pTooltip="Editar partida" (onClick)="abrirEditarPartida(partida)" />
                                  <p-button icon="pi pi-plus" [text]="true" size="small" severity="success" pTooltip="Anadir material" (onClick)="abrirNuevaLinea(partida.id, 'Material')" />
                                  <p-button icon="pi pi-user" [text]="true" size="small" severity="info" pTooltip="Anadir mano de obra" (onClick)="abrirNuevaLinea(partida.id, 'ManoObra')" />
                                  <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" pTooltip="Eliminar partida" (onClick)="confirmarEliminarPartida(partida.id)" />
                                }
                              </div>
                            </div>
                            <!-- Lineas -->
                            @if (partida.lineas.length) {
                              <table class="w-full text-xs">
                                <thead>
                                  <tr class="text-left text-surface-400 border-b border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-900">
                                    <th class="px-3 py-1.5">Tipo</th>
                                    <th class="py-1.5">Descripcion</th>
                                    <th class="py-1.5">Ud</th>
                                    <th class="py-1.5 text-right">Cantidad</th>
                                    <th class="py-1.5 text-right">Precio</th>
                                    <th class="py-1.5 text-right pr-3">Importe</th>
                                    @if (auth.isSupervisor() && !p.esAprobado) { <th class="py-1.5 pr-1"></th> }
                                  </tr>
                                </thead>
                                <tbody class="bg-white dark:bg-surface-900">
                                  @for (linea of partida.lineas; track linea.id) {
                                    <tr class="border-b border-surface-50 dark:border-surface-800">
                                      <td class="px-3 py-1.5">
                                        <span [class]="'px-1.5 py-0.5 rounded text-xs font-medium ' + (linea.tipo === 'Material' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700')">
                                          {{ linea.tipo === 'Material' ? 'Mat' : 'M.O.' }}
                                        </span>
                                      </td>
                                      <td class="py-1.5">{{ linea.descripcion }}
                                        @if (linea.categoriaNombre) { <span class="text-surface-400 ml-1">({{ linea.categoriaNombre }})</span> }
                                      </td>
                                      <td class="py-1.5 text-surface-400">{{ linea.unidad }}</td>
                                      <td class="py-1.5 text-right">{{ linea.cantidad | number:'1.0-3' }}</td>
                                      <td class="py-1.5 text-right text-surface-500">{{ linea.precioUnitario | number:'1.2-2' }} €</td>
                                      <td class="py-1.5 text-right font-medium pr-3">{{ linea.importe | number:'1.2-2' }} €</td>
                                      @if (auth.isSupervisor() && !p.esAprobado) {
                                        <td class="py-1.5 pr-1 text-right">
                                          <p-button icon="pi pi-pencil" [text]="true" size="small" (onClick)="abrirEditarLinea(linea, partida.id)" />
                                          <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" (onClick)="confirmarEliminarLinea(linea.id)" />
                                        </td>
                                      }
                                    </tr>
                                  }
                                </tbody>
                              </table>
                            } @else {
                              <p class="text-center py-3 text-surface-400 text-xs bg-white dark:bg-surface-900">Sin lineas. Usa los botones + para anadir materiales o mano de obra.</p>
                            }
                          </div>
                        }
                        @if (!partidas().length) {
                          <p class="text-center py-4 text-surface-400 text-sm">No hay partidas. Crea la primera con el boton de arriba.</p>
                        }
                      </div>
                    }
                  </div>
                }

                @if (!presupuestos().length) {
                  <div class="text-center py-10 text-surface-400 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700">
                    <i class="pi pi-file text-3xl block mb-2"></i>No hay presupuestos
                  </div>
                }
              </div>
            </p-tabpanel>

            <!-- TAB MANO DE OBRA -->
            <p-tabpanel value="horas">
              <div class="space-y-4 mt-4">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="font-semibold text-surface-900 dark:text-surface-50">Registros de horas</h3>
                    <p class="text-sm text-surface-500">Total: <strong>{{ totalHorasReales() | number:'1.0-1' }} h</strong> - Coste: <strong>{{ totalCosteHoras() | number:'1.0-0' }} €</strong></p>
                  </div>
                  @if (auth.isSupervisor()) {
                    <p-button label="Registrar horas" icon="pi pi-plus" size="small" (onClick)="abrirNuevasHoras()" />
                  }
                </div>
                <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                  <p-table [value]="registrosHoras()" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                      <tr>
                        <th>Operario</th><th>Categoria</th><th>Fecha</th>
                        <th class="text-right">Horas</th><th class="text-right">Euros/h</th><th class="text-right">Coste</th><th></th>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-r>
                      <tr>
                        <td class="font-medium">{{ r.operarioNombre }}</td>
                        <td class="text-surface-500 text-sm">{{ r.categoriaNombre }}</td>
                        <td class="text-sm">{{ r.fecha | date:'dd/MM/yyyy' }}</td>
                        <td class="text-right font-medium">{{ r.horas | number:'1.0-1' }} h</td>
                        <td class="text-right text-surface-500">{{ r.costeHoraAplicado | number:'1.2-2' }} €</td>
                        <td class="text-right font-medium text-blue-600">{{ r.costeTotal | number:'1.2-2' }} €</td>
                        <td class="text-right">
                          @if (auth.isSupervisor()) {
                            <p-button icon="pi pi-pencil" [text]="true" size="small" (onClick)="abrirEditarHoras(r)" />
                            <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" (onClick)="confirmarEliminarHoras(r.id)" />
                          }
                        </td>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                      <tr><td colspan="7" class="text-center py-8 text-surface-400">No hay registros de horas</td></tr>
                    </ng-template>
                  </p-table>
                </div>
              </div>
            </p-tabpanel>

            <!-- TAB MATERIALES -->
            <p-tabpanel value="materiales">
              <div class="space-y-4 mt-4">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="font-semibold text-surface-900 dark:text-surface-50">Materiales consumidos</h3>
                    <p class="text-sm text-surface-500">Total real: <strong>{{ totalMaterialesReal() | number:'1.0-0' }} €</strong></p>
                  </div>
                  @if (auth.isSupervisor()) {
                    <p-button label="Anadir material" icon="pi pi-plus" size="small" (onClick)="abrirNuevoMaterial()" />
                  }
                </div>
                <div class="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                  <p-table [value]="materiales()" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                      <tr>
                        <th>Descripcion</th><th>Unidad</th><th>Fecha</th>
                        <th class="text-right">Cantidad</th><th class="text-right">Precio</th><th class="text-right">Importe</th><th></th>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-m>
                      <tr>
                        <td class="font-medium">{{ m.descripcion }}</td>
                        <td class="text-surface-500 text-sm">{{ m.unidad }}</td>
                        <td class="text-sm">{{ m.fecha | date:'dd/MM/yyyy' }}</td>
                        <td class="text-right">{{ m.cantidad | number:'1.0-3' }}</td>
                        <td class="text-right text-surface-500">{{ m.precioUnitario | number:'1.2-2' }} €</td>
                        <td class="text-right font-medium text-blue-600">{{ m.importeReal | number:'1.2-2' }} €</td>
                        <td class="text-right">
                          @if (auth.isSupervisor()) {
                            <p-button icon="pi pi-pencil" [text]="true" size="small" (onClick)="abrirEditarMaterial(m)" />
                            <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" (onClick)="confirmarEliminarMaterial(m.id)" />
                          }
                        </td>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                      <tr><td colspan="7" class="text-center py-8 text-surface-400">No hay materiales registrados</td></tr>
                    </ng-template>
                  </p-table>
                </div>
              </div>
            </p-tabpanel>

          </p-tabpanels>
        </p-tabs>
      }
    </div>

    <p-confirmdialog />

    <!-- Dialog Presupuesto -->
    <p-dialog [(visible)]="dlgPresupuesto" header="Nuevo Presupuesto" [modal]="true" appendTo="body" [style]="{width:'min(480px, 95vw)'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div>
          <label class="block text-sm font-medium mb-1.5">Numero de presupuesto *</label>
          <input pInputText [(ngModel)]="presupuestoForm.numero" class="w-full" placeholder="Ej: PPTO-2026-001" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">Fecha *</label>
            <p-datepicker [(ngModel)]="presupuestoForm.fecha" appendTo="body" dateFormat="dd/mm/yy" styleClass="w-full" [showIcon]="true" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Descripcion</label>
            <input pInputText [(ngModel)]="presupuestoForm.descripcion" class="w-full" placeholder="Ej: Revision inicial" />
          </div>
        </div>
        <p class="text-xs text-surface-400">Tras crear el presupuesto podras anadir partidas con materiales y mano de obra.</p>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dlgPresupuesto = false" />
        <p-button label="Crear presupuesto" icon="pi pi-check" (onClick)="guardarPresupuesto()" [loading]="saving()" />
      </ng-template>
    </p-dialog>

    <!-- Dialog Partida -->
    <p-dialog [(visible)]="dlgPartida" [header]="editandoPartidaId() ? 'Editar partida' : 'Nueva partida'" [modal]="true" appendTo="body" [style]="{width:'min(440px, 95vw)'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div>
          <label class="block text-sm font-medium mb-1.5">Nombre *</label>
          <input pInputText [(ngModel)]="partidaForm.nombre" class="w-full" placeholder="Ej: Estructura, Albanileria..." />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Descripcion</label>
          <textarea pTextarea [(ngModel)]="partidaForm.descripcion" rows="2" class="w-full"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Orden</label>
          <p-inputNumber [(ngModel)]="partidaForm.orden" [min]="1" styleClass="w-full" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dlgPartida = false" />
        <p-button [label]="editandoPartidaId() ? 'Guardar' : 'Crear partida'" icon="pi pi-check" (onClick)="guardarPartida()" [loading]="saving()" />
      </ng-template>
    </p-dialog>

    <!-- Dialog Linea -->
    <p-dialog [(visible)]="dlgLinea" [header]="editandoLineaId() ? 'Editar linea' : (tipoLinea() === 'Material' ? 'Anadir material' : 'Anadir mano de obra')"
              [modal]="true" appendTo="body" [style]="{width:'min(480px, 95vw)'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        @if (tipoLinea() === 'ManoObra') {
          <div>
            <label class="block text-sm font-medium mb-1.5">Categoria *</label>
            <p-select [(ngModel)]="lineaForm.categoriaOperarioId" appendTo="body" [options]="categorias()"
                      optionLabel="nombre" optionValue="id" placeholder="Selecciona categoria" styleClass="w-full"
                      (onChange)="onCategoriaLineaChange()" />
          </div>
        }
        <div>
          <label class="block text-sm font-medium mb-1.5">Descripcion *</label>
          <input pInputText [(ngModel)]="lineaForm.descripcion" class="w-full" placeholder="Ej: Cemento Portland, Oficial 1a montaje..." />
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1.5">Unidad</label>
            <input pInputText [(ngModel)]="lineaForm.unidad" class="w-full" placeholder="kg, m2, h..." />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Cantidad</label>
            <p-inputNumber [(ngModel)]="lineaForm.cantidad" [minFractionDigits]="0" [maxFractionDigits]="3" styleClass="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Precio (euros)</label>
            <p-inputNumber [(ngModel)]="lineaForm.precioUnitario" [minFractionDigits]="2" styleClass="w-full" />
          </div>
        </div>
        <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-3 flex justify-between items-center">
          <span class="text-sm text-surface-500">Importe total:</span>
          <span class="font-bold text-blue-600">{{ lineaForm.cantidad * lineaForm.precioUnitario | number:'1.2-2' }} €</span>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dlgLinea = false" />
        <p-button [label]="editandoLineaId() ? 'Guardar' : 'Anadir linea'" icon="pi pi-check" (onClick)="guardarLinea()" [loading]="saving()" />
      </ng-template>
    </p-dialog>

    <!-- Dialog Horas -->
    <p-dialog [(visible)]="dlgHoras" [header]="editandoHorasId() ? 'Editar horas' : 'Registrar horas'"
              [modal]="true" appendTo="body" [style]="{width:'min(480px, 95vw)'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div>
          <label class="block text-sm font-medium mb-1.5">Operario *</label>
          <p-select [(ngModel)]="horasForm.operarioId" appendTo="body" [options]="operarios()" optionLabel="nombreCompleto" optionValue="id"
                    placeholder="Selecciona operario" styleClass="w-full" (onChange)="onOperarioChange()" [disabled]="!!editandoHorasId()" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">Fecha *</label>
            <p-datepicker [(ngModel)]="horasForm.fecha" appendTo="body" dateFormat="dd/mm/yy" styleClass="w-full" [showIcon]="true" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Horas *</label>
            <p-inputNumber [(ngModel)]="horasForm.horas" [minFractionDigits]="1" [min]="0.5" [max]="24" styleClass="w-full" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Coste euros/hora</label>
          <p-inputNumber [(ngModel)]="horasForm.costeHoraAplicado" [minFractionDigits]="2" styleClass="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Observaciones</label>
          <textarea pTextarea [(ngModel)]="horasForm.observaciones" rows="2" class="w-full"></textarea>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="cerrarDlgHoras()" />
        <p-button [label]="editandoHorasId() ? 'Guardar cambios' : 'Registrar'" icon="pi pi-check" (onClick)="guardarHoras()" [loading]="saving()" />
      </ng-template>
    </p-dialog>

    <!-- Dialog Material -->
    <p-dialog [(visible)]="dlgMaterial" [header]="editandoMaterialId() ? 'Editar material' : 'Anadir material'"
              [modal]="true" appendTo="body" [style]="{width:'min(480px, 95vw)'}" [draggable]="false">
      <div class="space-y-4 pt-2">
        <div>
          <label class="block text-sm font-medium mb-1.5">Descripcion *</label>
          <input pInputText [(ngModel)]="materialForm.descripcion" class="w-full" placeholder="Ej: Cemento Portland" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">Unidad *</label>
            <input pInputText [(ngModel)]="materialForm.unidad" class="w-full" placeholder="kg, m2, ud..." />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Fecha *</label>
            <p-datepicker [(ngModel)]="materialForm.fecha" appendTo="body" dateFormat="dd/mm/yy" styleClass="w-full" [showIcon]="true" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">Cantidad *</label>
            <p-inputNumber [(ngModel)]="materialForm.cantidad" [minFractionDigits]="0" [maxFractionDigits]="3" styleClass="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Precio unitario (euros) *</label>
            <p-inputNumber [(ngModel)]="materialForm.precioUnitario" [minFractionDigits]="2" styleClass="w-full" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Observaciones</label>
          <textarea pTextarea [(ngModel)]="materialForm.observaciones" rows="2" class="w-full"></textarea>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="cerrarDlgMaterial()" />
        <p-button [label]="editandoMaterialId() ? 'Guardar cambios' : 'Anadir'" icon="pi pi-check" (onClick)="guardarMaterial()" [loading]="saving()" />
      </ng-template>
    </p-dialog>
  `
})
export class ObraDetailComponent implements OnInit {
  store           = inject(ObrasStore);
  auth            = inject(AuthService);
  private route   = inject(ActivatedRoute);
  private msg     = inject(MessageService);
  private confirm = inject(ConfirmationService);
  private presupuestosSvc  = inject(PresupuestosService);
  private registroHorasSvc = inject(RegistroHorasService);
  private materialesSvc    = inject(MaterialesObraService);
  private operariosSvc     = inject(OperariosService);
  private categoriasSvc    = inject(CategoriasOperarioService);
  private partidasSvc      = inject(PartidasService);

  activeTab = signal('info');
  saving    = signal(false);
  obraId    = signal('');

  presupuestos            = signal<PresupuestoDto[]>([]);
  partidas                = signal<PartidaDto[]>([]);
  presupuestoSeleccionado = signal<string | null>(null);
  registrosHoras          = signal<RegistroHorasDto[]>([]);
  materiales              = signal<MaterialObraDto[]>([]);
  operarios               = signal<OperarioDto[]>([]);
  categorias              = signal<CategoriaOperarioDto[]>([]);

  // dialogs
  dlgPresupuesto = false;
  dlgPartida     = false;
  dlgLinea       = false;
  dlgHoras       = false;
  dlgMaterial    = false;

  // signals de edicion
  editandoHorasId    = signal<string | null>(null);
  editandoMaterialId = signal<string | null>(null);
  editandoPartidaId  = signal<string | null>(null);
  editandoLineaId    = signal<string | null>(null);
  lineaPartidaId     = signal<string | null>(null);
  tipoLinea          = signal<'Material' | 'ManoObra'>('Material');

  // forms
  presupuestoForm: any = { numero: '', fecha: new Date(), descripcion: '' };
  partidaForm: any     = { nombre: '', descripcion: '', orden: 1 };
  lineaForm: any       = { descripcion: '', unidad: '', cantidad: 0, precioUnitario: 0, categoriaOperarioId: null };
  horasForm: any       = { operarioId: null, categoriaOperarioId: null, fecha: new Date(), horas: 8, costeHoraAplicado: 0, observaciones: '' };
  materialForm: any    = { descripcion: '', unidad: '', cantidad: 0, precioUnitario: 0, fecha: new Date(), observaciones: '' };

  // computed
  presupuestoAprobado         = computed(() => this.presupuestos().find(p => p.esAprobado));
  presupuestoAprobadoTotal    = computed(() => this.presupuestoAprobado()?.total ?? 0);
  presupuestoAprobadoMaterial = computed(() => this.presupuestoAprobado()?.totalMaterial ?? 0);
  presupuestoAprobadoHoras    = computed(() => this.presupuestoAprobado()?.totalHoras ?? 0);
  totalHorasReales    = computed(() => this.registrosHoras().reduce((s, r) => s + r.horas, 0));
  totalCosteHoras     = computed(() => this.registrosHoras().reduce((s, r) => s + r.costeTotal, 0));
  totalMaterialesReal = computed(() => this.materiales().reduce((s, m) => s + m.importeReal, 0));
  costeReal           = computed(() => this.totalCosteHoras() + this.totalMaterialesReal());
  desviacion          = computed(() => this.costeReal() - this.presupuestoAprobadoTotal());

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.obraId.set(id);
    this.store.loadObraById(id);
    this.cargarDatos(id);
  }

  cargarDatos(id: string) {
    this.presupuestosSvc.getByObra(id).subscribe(p => this.presupuestos.set(p));
    this.registroHorasSvc.getByObra(id).subscribe(r => this.registrosHoras.set(r));
    this.materialesSvc.getByObra(id).subscribe(m => this.materiales.set(m));
    this.operariosSvc.getAll().subscribe(o => this.operarios.set(o));
    this.categoriasSvc.getAll().subscribe(c => this.categorias.set(c));
  }

  // ── Presupuesto ──────────────────────────────────────────────────────────
  guardarPresupuesto() {
    this.saving.set(true);
    this.presupuestosSvc.create({ obraId: this.obraId(), numero: this.presupuestoForm.numero,
      fecha: this.presupuestoForm.fecha, descripcion: this.presupuestoForm.descripcion,
      lineasMaterial: [], lineasHoras: [] }).subscribe({
      next: () => {
        this.dlgPresupuesto = false; this.saving.set(false);
        this.presupuestoForm = { numero: '', fecha: new Date(), descripcion: '' };
        this.presupuestosSvc.getByObra(this.obraId()).subscribe(p => this.presupuestos.set(p));
        this.msg.add({ severity: 'success', summary: 'Presupuesto creado' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  aprobarPresupuesto(id: string) {
    this.presupuestosSvc.aprobar(id).subscribe({
      next: () => { this.presupuestosSvc.getByObra(this.obraId()).subscribe(p => this.presupuestos.set(p));
        this.msg.add({ severity: 'success', summary: 'Presupuesto aprobado' }); }
    });
  }

  seleccionarPresupuesto(id: string) {
    this.presupuestoSeleccionado.set(id);
    this.partidasSvc.getByPresupuesto(id).subscribe(p => this.partidas.set(p));
  }

  // ── Partidas ─────────────────────────────────────────────────────────────
  abrirNuevaPartida() {
    this.editandoPartidaId.set(null);
    this.partidaForm = { nombre: '', descripcion: '', orden: this.partidas().length + 1 };
    this.dlgPartida = true;
  }

  abrirEditarPartida(p: PartidaDto) {
    this.editandoPartidaId.set(p.id);
    this.partidaForm = { nombre: p.nombre, descripcion: p.descripcion ?? '', orden: p.orden };
    this.dlgPartida = true;
  }

  guardarPartida() {
    this.saving.set(true);
    const editId = this.editandoPartidaId();
    const obs = editId
      ? this.partidasSvc.update(editId, this.partidaForm)
      : this.partidasSvc.create({ presupuestoId: this.presupuestoSeleccionado()!, ...this.partidaForm });
    obs.subscribe({
      next: () => {
        this.dlgPartida = false; this.saving.set(false); this.editandoPartidaId.set(null);
        this.partidasSvc.getByPresupuesto(this.presupuestoSeleccionado()!).subscribe(p => this.partidas.set(p));
        this.msg.add({ severity: 'success', summary: editId ? 'Partida actualizada' : 'Partida creada' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  confirmarEliminarPartida(id: string) {
    this.confirm.confirm({ message: 'Eliminar esta partida y sus lineas?', header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => { this.partidasSvc.delete(id).subscribe({
        next: () => { this.partidasSvc.getByPresupuesto(this.presupuestoSeleccionado()!).subscribe(p => this.partidas.set(p));
          this.msg.add({ severity: 'success', summary: 'Partida eliminada' }); }
      }); }
    });
  }

  // ── Lineas ───────────────────────────────────────────────────────────────
  abrirNuevaLinea(partidaId: string, tipo: 'Material' | 'ManoObra') {
    this.editandoLineaId.set(null);
    this.lineaPartidaId.set(partidaId);
    this.tipoLinea.set(tipo);
    this.lineaForm = { descripcion: '', unidad: tipo === 'ManoObra' ? 'h' : '', cantidad: 0, precioUnitario: 0, categoriaOperarioId: null };
    this.dlgLinea = true;
  }

  abrirEditarLinea(l: LineaPartidaDto, partidaId: string) {
    this.editandoLineaId.set(l.id);
    this.lineaPartidaId.set(partidaId);
    this.tipoLinea.set(l.tipo as 'Material' | 'ManoObra');
    this.lineaForm = { descripcion: l.descripcion, unidad: l.unidad, cantidad: l.cantidad,
      precioUnitario: l.precioUnitario, categoriaOperarioId: l.categoriaOperarioId ?? null };
    this.dlgLinea = true;
  }

  onCategoriaLineaChange() {
    const cat = this.categorias().find(c => c.id === this.lineaForm.categoriaOperarioId);
    if (cat) this.lineaForm.precioUnitario = cat.costeHoraBase;
  }

  guardarLinea() {
    this.saving.set(true);
    const editId = this.editandoLineaId();
    let obs: any;
    if (editId) {
      obs = this.partidasSvc.updateLinea(editId, this.lineaForm);
    } else if (this.tipoLinea() === 'Material') {
      obs = this.partidasSvc.addLineaMaterial(this.lineaPartidaId()!, this.lineaForm);
    } else {
      obs = this.partidasSvc.addLineaManoObra(this.lineaPartidaId()!, this.lineaForm);
    }
    obs.subscribe({
      next: () => {
        this.dlgLinea = false; this.saving.set(false); this.editandoLineaId.set(null);
        this.partidasSvc.getByPresupuesto(this.presupuestoSeleccionado()!).subscribe(p => this.partidas.set(p));
        this.msg.add({ severity: 'success', summary: editId ? 'Linea actualizada' : 'Linea anadida' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  confirmarEliminarLinea(id: string) {
    this.confirm.confirm({ message: 'Eliminar esta linea?', header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => { this.partidasSvc.deleteLinea(id).subscribe({
        next: () => { this.partidasSvc.getByPresupuesto(this.presupuestoSeleccionado()!).subscribe(p => this.partidas.set(p));
          this.msg.add({ severity: 'success', summary: 'Linea eliminada' }); }
      }); }
    });
  }

  // ── Horas ────────────────────────────────────────────────────────────────
  abrirNuevasHoras() {
    this.editandoHorasId.set(null);
    this.horasForm = { operarioId: null, categoriaOperarioId: null, fecha: new Date(), horas: 8, costeHoraAplicado: 0, observaciones: '' };
    this.dlgHoras = true;
  }

  abrirEditarHoras(r: RegistroHorasDto) {
    this.editandoHorasId.set(r.id);
    this.horasForm = { operarioId: r.operarioId, categoriaOperarioId: r.categoriaOperarioId,
      fecha: new Date(r.fecha), horas: r.horas, costeHoraAplicado: r.costeHoraAplicado, observaciones: r.observaciones ?? '' };
    this.dlgHoras = true;
  }

  cerrarDlgHoras() { this.dlgHoras = false; this.editandoHorasId.set(null); }

  onOperarioChange() {
    const op = this.operarios().find(o => o.id === this.horasForm.operarioId);
    if (op) { this.horasForm.categoriaOperarioId = op.categoriaOperarioId; this.horasForm.costeHoraAplicado = op.costeHoraBase; }
  }

  guardarHoras() {
    this.saving.set(true);
    const editId = this.editandoHorasId();
    const obs = editId
      ? this.registroHorasSvc.update(editId, { fecha: this.horasForm.fecha, horas: this.horasForm.horas,
          costeHoraAplicado: this.horasForm.costeHoraAplicado, observaciones: this.horasForm.observaciones })
      : this.registroHorasSvc.create({ obraId: this.obraId(), operarioId: this.horasForm.operarioId,
          categoriaOperarioId: this.horasForm.categoriaOperarioId, fecha: this.horasForm.fecha,
          horas: this.horasForm.horas, costeHoraAplicado: this.horasForm.costeHoraAplicado, observaciones: this.horasForm.observaciones });
    obs.subscribe({
      next: () => {
        this.cerrarDlgHoras(); this.saving.set(false);
        this.registroHorasSvc.getByObra(this.obraId()).subscribe(r => this.registrosHoras.set(r));
        this.msg.add({ severity: 'success', summary: editId ? 'Horas actualizadas' : 'Horas registradas' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  confirmarEliminarHoras(id: string) {
    this.confirm.confirm({ message: 'Eliminar este registro de horas?', header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => { this.registroHorasSvc.delete(id).subscribe({
        next: () => { this.registroHorasSvc.getByObra(this.obraId()).subscribe(r => this.registrosHoras.set(r));
          this.msg.add({ severity: 'success', summary: 'Registro eliminado' }); }
      }); }
    });
  }

  // ── Materiales ───────────────────────────────────────────────────────────
  abrirNuevoMaterial() {
    this.editandoMaterialId.set(null);
    this.materialForm = { descripcion: '', unidad: '', cantidad: 0, precioUnitario: 0, fecha: new Date(), observaciones: '' };
    this.dlgMaterial = true;
  }

  abrirEditarMaterial(m: MaterialObraDto) {
    this.editandoMaterialId.set(m.id);
    this.materialForm = { descripcion: m.descripcion, unidad: m.unidad, cantidad: m.cantidad,
      precioUnitario: m.precioUnitario, fecha: new Date(m.fecha), observaciones: m.observaciones ?? '' };
    this.dlgMaterial = true;
  }

  cerrarDlgMaterial() { this.dlgMaterial = false; this.editandoMaterialId.set(null); }

  guardarMaterial() {
    this.saving.set(true);
    const editId = this.editandoMaterialId();
    const obs = editId
      ? this.materialesSvc.update(editId, this.materialForm)
      : this.materialesSvc.create({ obraId: this.obraId(), ...this.materialForm });
    obs.subscribe({
      next: () => {
        this.cerrarDlgMaterial(); this.saving.set(false);
        this.materialesSvc.getByObra(this.obraId()).subscribe(m => this.materiales.set(m));
        this.msg.add({ severity: 'success', summary: editId ? 'Material actualizado' : 'Material anadido' });
      },
      error: () => { this.saving.set(false); this.msg.add({ severity: 'error', summary: 'Error al guardar' }); }
    });
  }

  confirmarEliminarMaterial(id: string) {
    this.confirm.confirm({ message: 'Eliminar este material?', header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => { this.materialesSvc.delete(id).subscribe({
        next: () => { this.materialesSvc.getByObra(this.obraId()).subscribe(m => this.materiales.set(m));
          this.msg.add({ severity: 'success', summary: 'Material eliminado' }); }
      }); }
    });
  }

  estadoBadge(estado: number): string {
    const map: Record<number, string> = {
      0: 'bg-slate-100 text-slate-600', 1: 'bg-blue-100 text-blue-700',
      2: 'bg-amber-100 text-amber-700', 3: 'bg-green-100 text-green-700', 4: 'bg-red-100 text-red-700'
    };
    return map[estado] ?? '';
  }
}