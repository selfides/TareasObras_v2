import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { OperarioPortalService } from '../../core/services/operario-portal.service';
import { AuthService } from '../../core/auth/auth.service';
import {
  OperarioPerfilDto,
  OperarioEstadoHoyDto,
  FichajeActivoDto,
  ObraActivaOperarioDto,
  MisHorasResponseDto
} from '../../core/models';
import { TicketCapturaModalComponent } from '../facturas/components/ticket-captura-modal.component';

@Component({
  selector: 'app-portal-operario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    ButtonModule,
    ToastModule,
    TicketCapturaModalComponent
  ],
  template: `
    <p-toast position="top-center"></p-toast>

    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">

      <!-- TOP BAR MÓVIL FIJA -->
      <header class="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-blue-600 p-0.5 shadow-md shadow-blue-900/30 flex items-center justify-center">
            <div class="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <i class="pi pi-briefcase text-amber-400 text-lg"></i>
            </div>
          </div>
          <div>
            <h1 class="text-sm font-bold tracking-tight text-white leading-tight">
              {{ perfil()?.nombreCompleto || 'Portal Operario' }}
            </h1>
            <p class="text-xs text-slate-400 font-medium">
              {{ perfil()?.categoria?.nombre || 'Montador en Obra' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Indicador de Red / Offline -->
          <div 
            [class]="portalService.isOnline() ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'"
            class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold">
            <span class="w-2 h-2 rounded-full" [class]="portalService.isOnline() ? 'bg-emerald-400' : 'bg-amber-400'"></span>
            <span>{{ portalService.isOnline() ? 'Online' : 'Offline' }}</span>
            @if (portalService.fichajesPendientesCount() > 0) {
              <span class="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black rounded-full text-[10px]">
                {{ portalService.fichajesPendientesCount() }}
              </span>
            }
          </div>

          <!-- Acceso a escritorio si es admin o supervisor -->
          @if (authService.isAdmin() || authService.isSupervisor()) {
            <button 
              (click)="irAlDashboard()" 
              title="Volver a vista de gestión"
              class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center transition border border-slate-700">
              <i class="pi pi-desktop text-sm"></i>
            </button>
          }

          <!-- Logout -->
          <button 
            (click)="cerrarSesion()" 
            title="Cerrar sesión"
            class="w-9 h-9 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 text-rose-400 flex items-center justify-center transition border border-rose-500/20">
            <i class="pi pi-sign-out text-sm"></i>
          </button>
        </div>
      </header>

      <!-- CONTENIDO PRINCIPAL SCROLLEABLE -->
      <main class="flex-1 pb-28 pt-3 px-4 max-w-lg mx-auto w-full">

        <!-- ========================================== -->
        <!-- PESTAÑA 1: FICHAJE Y JORNADA EN CURSO      -->
        <!-- ========================================== -->
        @if (activeTab() === 'fichaje') {
          <div class="space-y-4 animate-fade-in">

            <!-- ALERTA SI HAY JORNADA ACTIVA -->
            @if (estadoHoy()?.hayFichajeActivo) {
              <div class="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-800 to-slate-850 border border-rose-500/30 shadow-xl relative overflow-hidden">
                <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                    <span class="text-xs font-bold uppercase tracking-wider text-rose-400">Jornada en Curso</span>
                  </div>
                  <span class="text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300 font-mono border border-slate-700">
                    Entrada: {{ estadoHoy()?.fichajeActivo?.horaInicio }}
                  </span>
                </div>

                <div class="text-white font-bold text-lg mb-1 flex items-center gap-2">
                  <i class="pi pi-building text-blue-400"></i>
                  <span>{{ estadoHoy()?.fichajeActivo?.obraNombre }}</span>
                </div>

                <!-- Cronómetro digital -->
                <div class="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span class="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Tiempo transcurrido</span>
                    <span class="text-2xl font-black font-mono tracking-tight text-amber-400">
                      {{ tiempoTranscurridoTexto() }}
                    </span>
                  </div>
                  <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <i class="pi pi-stopwatch text-xl animate-pulse"></i>
                  </div>
                </div>
              </div>
            } @else {
              <!-- SELECTOR DE OBRA PARA NUEVA ENTRADA -->
              <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg space-y-3">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  <i class="pi pi-map-marker text-amber-400 mr-1"></i> Selecciona la Obra de hoy
                </label>

                <p-select 
                  [options]="obras()" 
                  [(ngModel)]="obraSeleccionadaId" 
                  optionLabel="nombre" 
                  optionValue="id" 
                  placeholder="Selecciona la obra donde estás..." 
                  [filter]="true" 
                  filterBy="nombre,codigo"
                  styleClass="w-full text-sm">
                  <ng-template #item let-o>
                    <div class="py-1">
                      <div class="font-bold text-slate-900 dark:text-white text-sm">{{ o.nombre }}</div>
                      <div class="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span class="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">{{ o.codigo }}</span>
                        @if (o.direccion) { <span>{{ o.direccion }}</span> }
                      </div>
                    </div>
                  </ng-template>
                </p-select>

                <!-- Observaciones opcionales -->
                <div>
                  <input 
                    type="text" 
                    [(ngModel)]="observacionesEntrada"
                    placeholder="Observaciones o tarea (opcional)..."
                    class="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition" />
                </div>
              </div>
            }

            <!-- GRAN BOTÓN DE ACCIÓN PRINCIPAL (FICHAJE) -->
            <div class="flex flex-col items-center justify-center py-6">
              @if (!estadoHoy()?.hayFichajeActivo) {
                <!-- BOTÓN ENTRADA (VERDE/AZUL) -->
                <button 
                  (click)="ejecutarFicharEntrada()"
                  [disabled]="!obraSeleccionadaId || cargandoAccion()"
                  class="group relative w-48 h-48 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-blue-600 p-1.5 shadow-2xl shadow-emerald-950/60 transition transform active:scale-95 disabled:opacity-50 disabled:grayscale cursor-pointer">
                  <div class="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center gap-2 group-hover:bg-slate-900/90 transition">
                    <div class="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                      <i class="pi pi-play text-2xl font-bold ml-1"></i>
                    </div>
                    <span class="text-base font-black tracking-wide text-white uppercase">FICHAR ENTRADA</span>
                    <span class="text-[11px] text-emerald-400 font-semibold tracking-wider flex items-center gap-1">
                      <i class="pi pi-map-marker text-xs"></i> GPS Activo
                    </span>
                  </div>
                </button>
              } @else {
                <!-- BOTÓN SALIDA (ROJO/ROSA) -->
                <button 
                  (click)="ejecutarFicharSalida()"
                  [disabled]="cargandoAccion()"
                  class="group relative w-48 h-48 rounded-full bg-gradient-to-tr from-rose-600 via-red-500 to-amber-600 p-1.5 shadow-2xl shadow-rose-950/80 transition transform active:scale-95 disabled:opacity-50 cursor-pointer">
                  <div class="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center gap-2 group-hover:bg-slate-900/90 transition">
                    <div class="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
                      <i class="pi pi-stop text-2xl font-bold"></i>
                    </div>
                    <span class="text-base font-black tracking-wide text-white uppercase">FICHAR SALIDA</span>
                    <span class="text-[11px] text-rose-400 font-semibold tracking-wider">
                      Finalizar jornada
                    </span>
                  </div>
                </button>
              }

              <!-- Indicador GPS de presencia -->
              <p class="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
                <i class="pi pi-shield text-blue-400"></i>
                Se registra geolocalización de presencia al fichar.
              </p>
            </div>

            <!-- RESUMEN DE HOY -->
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg">
              <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-700/60">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-300">Jornadas Registradas Hoy</span>
                <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Total: {{ estadoHoy()?.totalHorasHoy || 0 }}h
                </span>
              </div>

              @if (estadoHoy()?.registros?.length === 0) {
                <div class="text-center py-4 text-xs text-slate-400">
                  <i class="pi pi-clock text-slate-500 text-lg mb-1 block"></i>
                  Aún no has finalizado ninguna jornada hoy.
                </div>
              } @else {
                <div class="space-y-2">
                  @for (r of estadoHoy()?.registros; track r.id) {
                    <div class="p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/40 flex items-center justify-between text-xs">
                      <div>
                        <span class="font-bold text-white block">{{ r.obraNombre }}</span>
                        <span class="text-slate-400 text-[11px]">
                          {{ r.horaInicio }} - {{ r.enCurso ? 'En curso' : r.horaFin }}
                        </span>
                      </div>
                      <div class="text-right">
                        @if (r.enCurso) {
                          <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            Activo
                          </span>
                        } @else {
                          <span class="font-mono font-bold text-emerald-400 text-sm">
                            {{ r.horas }}h
                          </span>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- ACCESO DIRECTO RÁPIDO A SUBIR ALBARÁN DESDE FICHAJE -->
            <button 
              (click)="abrirModalTicket()"
              class="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-800 border border-blue-500/30 text-white flex items-center justify-between shadow-lg active:scale-98 transition">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <i class="pi pi-camera text-xl"></i>
                </div>
                <div class="text-left">
                  <div class="font-bold text-sm">¿Has recibido materiales o comprado algo?</div>
                  <div class="text-xs text-slate-400">Haz una foto al albarán o ticket aquí</div>
                </div>
              </div>
              <i class="pi pi-chevron-right text-slate-400"></i>
            </button>

          </div>
        }

        <!-- ========================================== -->
        <!-- PESTAÑA 2: SUBIDA DE ALBARANES Y TICKETS   -->
        <!-- ========================================== -->
        @if (activeTab() === 'albaranes') {
          <div class="space-y-4 animate-fade-in">
            <div class="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-800 to-slate-850 border border-indigo-500/30 shadow-xl text-center space-y-4">
              <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-900/40">
                <i class="pi pi-camera text-3xl"></i>
              </div>

              <div>
                <h2 class="text-lg font-black text-white">Subir Albarán o Ticket con el Móvil</h2>
                <p class="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                  Haz una foto desde la cámara al albarán de entrega o al ticket de compra. Nuestro sistema OCR extraerá proveedor, fecha e importes automáticamente.
                </p>
              </div>

              <button 
                (click)="abrirModalTicket()"
                class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-98 text-white font-black text-base shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2 transition cursor-pointer">
                <i class="pi pi-camera text-xl"></i>
                <span>ABRIR CÁMARA / SUBIR FOTO</span>
              </button>
            </div>

            <!-- Consejos para el montador -->
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg space-y-2.5">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                <i class="pi pi-info-circle text-amber-400 mr-1"></i> Consejos para una captura nítida
              </span>
              <ul class="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Coloca el papel sobre una superficie lisa y bien iluminada.</li>
                <li>Asegúrate de que se lea claramente el nombre de la empresa proveedora y la fecha.</li>
                <li>No te preocupes por picar datos: administración los validará en oficina.</li>
              </ul>
            </div>
          </div>
        }

        <!-- ========================================== -->
        <!-- PESTAÑA 3: HISTORIAL "MIS HORAS"           -->
        <!-- ========================================== -->
        @if (activeTab() === 'mis-horas') {
          <div class="space-y-4 animate-fade-in">

            <!-- KPIs de Horas -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Horas (30d)</span>
                <span class="text-2xl font-black font-mono text-emerald-400">{{ misHoras()?.totalHoras || 0 }}h</span>
              </div>
              <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Días Trabajados</span>
                <span class="text-2xl font-black font-mono text-blue-400">{{ misHoras()?.diasTrabajados || 0 }}</span>
              </div>
            </div>

            <!-- Listado de registros -->
            <div class="space-y-2.5">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">Partes Registrados</span>

              @if (misHoras()?.registros?.length === 0) {
                <div class="p-8 text-center text-xs text-slate-500 bg-slate-800/50 rounded-2xl border border-slate-800">
                  No hay jornadas registradas en este período.
                </div>
              } @else {
                @for (item of misHoras()?.registros; track item.id) {
                  <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow flex items-center justify-between text-xs">
                    <div class="space-y-1">
                      <div class="font-bold text-white text-sm flex items-center gap-2">
                        <span>{{ item.obraNombre }}</span>
                        @if (item.sincronizadoOffline) {
                          <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Offline
                          </span>
                        }
                      </div>
                      <div class="text-slate-400 flex items-center gap-2">
                        <i class="pi pi-calendar text-[11px]"></i>
                        <span>{{ item.fecha }}</span>
                        <span>•</span>
                        <span>{{ item.horaInicio }} - {{ item.horaFin }}</span>
                      </div>
                      @if (item.observaciones) {
                        <p class="text-[11px] text-slate-300 italic">{{ item.observaciones }}</p>
                      }
                    </div>

                    <div class="text-right pl-3">
                      <span class="text-lg font-black font-mono text-emerald-400">{{ item.horas }}h</span>
                    </div>
                  </div>
                }
              }
            </div>

          </div>
        }

        <!-- ========================================== -->
        <!-- PESTAÑA 4: PERFIL Y SINCRONIZACIÓN         -->
        <!-- ========================================== -->
        @if (activeTab() === 'perfil') {
          <div class="space-y-4 animate-fade-in">

            <!-- Card de Datos Operario -->
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg space-y-3">
              <div class="flex items-center gap-3 pb-3 border-b border-slate-700/60">
                <div class="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-lg">
                  {{ (perfil()?.nombre || 'O').charAt(0) }}
                </div>
                <div>
                  <h3 class="font-bold text-white text-base leading-tight">{{ perfil()?.nombreCompleto }}</h3>
                  <p class="text-xs text-slate-400">{{ perfil()?.categoria?.nombre }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2 rounded-xl bg-slate-900/60 border border-slate-700/40">
                  <span class="text-slate-500 block text-[10px] uppercase font-bold">DNI / NIE</span>
                  <span class="text-white font-mono font-medium">{{ perfil()?.dni || 'Sin registrar' }}</span>
                </div>
                <div class="p-2 rounded-xl bg-slate-900/60 border border-slate-700/40">
                  <span class="text-slate-500 block text-[10px] uppercase font-bold">Teléfono</span>
                  <span class="text-white font-medium">{{ perfil()?.telefono || 'Sin registrar' }}</span>
                </div>
                <div class="p-2 rounded-xl bg-slate-900/60 border border-slate-700/40 col-span-2">
                  <span class="text-slate-500 block text-[10px] uppercase font-bold">Cuadrilla</span>
                  <span class="text-white font-medium">{{ perfil()?.cuadrilla?.nombre || 'Asignación individual' }}</span>
                </div>
              </div>
            </div>

            <!-- Card de Sincronización Offline -->
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-300">Sincronización Local</span>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold" [class]="portalService.fichajesPendientesCount() > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'">
                  {{ portalService.fichajesPendientesCount() }} pendientes
                </span>
              </div>

              <p class="text-xs text-slate-400 leading-relaxed">
                Los fichajes tomados en zonas de obra sin cobertura móvil se guardan de forma segura en la memoria de este teléfono y se transmiten automáticamente cuando vuelve la red.
              </p>

              <button 
                (click)="sincronizarManualmente()"
                [disabled]="portalService.sincronizando() || !portalService.isOnline() || portalService.fichajesPendientesCount() === 0"
                class="w-full py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer">
                <i class="pi pi-sync" [class.animate-spin]="portalService.sincronizando()"></i>
                <span>{{ portalService.sincronizando() ? 'Sincronizando con la central...' : 'Sincronizar ahora' }}</span>
              </button>
            </div>

            <!-- Botón Cerrar Sesión Móvil -->
            <button 
              (click)="cerrarSesion()"
              class="w-full py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer">
              <i class="pi pi-sign-out"></i>
              <span>Cerrar sesión en este dispositivo</span>
            </button>

          </div>
        }

      </main>

      <!-- ========================================== -->
      <!-- BOTTOM NAVIGATION BAR FIJA ACCESIBLE       -->
      <!-- ========================================== -->
      <nav class="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-4 py-2 safe-bottom shadow-2xl">
        <div class="max-w-lg mx-auto grid grid-cols-4 gap-1">

          <!-- Botón Tab Fichaje -->
          <button 
            (click)="cambiarTab('fichaje')"
            [class]="activeTab() === 'fichaje' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'"
            class="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer active:scale-95">
            <div class="relative">
              <i class="pi pi-clock text-xl mb-0.5"></i>
              @if (estadoHoy()?.hayFichajeActivo) {
                <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              }
            </div>
            <span class="text-[11px] tracking-tight">Fichar</span>
          </button>

          <!-- Botón Tab Albaranes -->
          <button 
            (click)="cambiarTab('albaranes')"
            [class]="activeTab() === 'albaranes' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'"
            class="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer active:scale-95">
            <i class="pi pi-camera text-xl mb-0.5"></i>
            <span class="text-[11px] tracking-tight">Albarán</span>
          </button>

          <!-- Botón Tab Mis Horas -->
          <button 
            (click)="cambiarTab('mis-horas')"
            [class]="activeTab() === 'mis-horas' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'"
            class="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer active:scale-95">
            <i class="pi pi-chart-bar text-xl mb-0.5"></i>
            <span class="text-[11px] tracking-tight">Mis Horas</span>
          </button>

          <!-- Botón Tab Perfil -->
          <button 
            (click)="cambiarTab('perfil')"
            [class]="activeTab() === 'perfil' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'"
            class="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer active:scale-95">
            <div class="relative">
              <i class="pi pi-user text-xl mb-0.5"></i>
              @if (portalService.fichajesPendientesCount() > 0) {
                <span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"></span>
              }
            </div>
            <span class="text-[11px] tracking-tight">Perfil</span>
          </button>

        </div>
      </nav>

      <!-- MODAL DE CAPTURA RÁPIDA DE ALBARÁN / TICKET -->
      <app-ticket-captura-modal
        [visible]="modalTicketVisible()"
        [obraIdDefecto]="obraSeleccionadaId || estadoHoy()?.fichajeActivo?.obraId || undefined"
        (onVisibleChange)="modalTicketVisible.set($event)"
        (onTicketEnviado)="onTicketCreado($event)">
      </app-ticket-captura-modal>

    </div>
  `,
  styles: [`
    .safe-bottom {
      padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class PortalOperarioComponent implements OnInit, OnDestroy {
  readonly portalService = inject(OperarioPortalService);
  readonly authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  // Estados de interfaz reactivos con Signals
  readonly activeTab = signal<'fichaje' | 'albaranes' | 'mis-horas' | 'perfil'>('fichaje');
  readonly perfil = signal<OperarioPerfilDto | null>(null);
  readonly estadoHoy = signal<OperarioEstadoHoyDto | null>(null);
  readonly misHoras = signal<MisHorasResponseDto | null>(null);
  readonly modalTicketVisible = signal<boolean>(false);
  readonly cargandoAccion = signal<boolean>(false);

  // Campos de formulario
  obraSeleccionadaId: string | null = null;
  observacionesEntrada: string = '';

  // Cronómetro local
  private timerInterval: any = null;
  readonly tiempoTranscurridoSegundos = signal<number>(0);

  readonly tiempoTranscurridoTexto = computed(() => {
    const totalSeg = this.tiempoTranscurridoSegundos();
    const h = Math.floor(totalSeg / 3600);
    const m = Math.floor((totalSeg % 3600) / 60);
    const s = totalSeg % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  });

  readonly obras = computed(() => this.perfil()?.obrasActivas || []);

  ngOnInit(): void {
    // Restaurar última obra seleccionada en el dispositivo
    const lastObra = localStorage.getItem('portal_operario_last_obra');
    if (lastObra) {
      this.obraSeleccionadaId = lastObra;
    }

    this.cargarDatosIniciales();

    // Actualizar timer de jornada en curso cada segundo
    this.timerInterval = setInterval(() => {
      const activo = this.estadoHoy()?.fichajeActivo;
      if (activo && activo.horaInicio) {
        const [h, m] = activo.horaInicio.split(':').map(Number);
        const ahora = new Date();
        const inicio = new Date();
        inicio.setHours(h, m, 0, 0);
        const diffSeg = Math.max(0, Math.floor((ahora.getTime() - inicio.getTime()) / 1000));
        this.tiempoTranscurridoSegundos.set(diffSeg);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  cambiarTab(tab: 'fichaje' | 'albaranes' | 'mis-horas' | 'perfil'): void {
    this.activeTab.set(tab);
    this.portalService.vibrar(20);
    if (tab === 'mis-horas') {
      this.cargarMisHoras();
    }
  }

  cargarDatosIniciales(): void {
    this.portalService.getMe().subscribe({
      next: p => {
        this.perfil.set(p);
        if (!this.obraSeleccionadaId && p.obrasActivas && p.obrasActivas.length > 0) {
          this.obraSeleccionadaId = p.obrasActivas[0].id;
        }
      },
      error: _err => {
        // Fallback silencioso si está offline
      }
    });

    this.recargarEstadoHoy();
  }

  recargarEstadoHoy(): void {
    this.portalService.getEstadoHoy().subscribe({
      next: estado => {
        this.estadoHoy.set(estado);
        if (estado.fichajeActivo) {
          this.obraSeleccionadaId = estado.fichajeActivo.obraId;
        }
      },
      error: _err => {}
    });
  }

  cargarMisHoras(): void {
    this.portalService.getMisHoras().subscribe({
      next: res => this.misHoras.set(res),
      error: _err => {}
    });
  }

  async ejecutarFicharEntrada(): Promise<void> {
    if (!this.obraSeleccionadaId) {
      this.messageService.add({ severity: 'warn', summary: 'Selecciona una obra', detail: 'Debes indicar la obra donde estás trabajando.' });
      return;
    }

    this.cargandoAccion.set(true);
    localStorage.setItem('portal_operario_last_obra', this.obraSeleccionadaId);

    // Capturar GPS
    const coords = await this.portalService.obtenerGeolocalizacion();
    const obraObj = this.obras().find(o => o.id === this.obraSeleccionadaId);

    this.portalService.ficharEntrada({
      obraId: this.obraSeleccionadaId,
      latitud: coords?.latitud,
      longitud: coords?.longitud,
      observaciones: this.observacionesEntrada?.trim() || undefined
    }, undefined, obraObj?.nombre).subscribe({
      next: res => {
        this.cargandoAccion.set(false);
        this.observacionesEntrada = '';
        this.messageService.add({ severity: 'success', summary: '¡Jornada iniciada!', detail: res.mensaje || 'Fichaje de entrada registrado correctamente.' });
        this.recargarEstadoHoy();
      },
      error: err => {
        this.cargandoAccion.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al fichar',
          detail: err?.error?.mensaje || 'No se ha podido registrar la entrada.'
        });
      }
    });
  }

  async ejecutarFicharSalida(): Promise<void> {
    this.cargandoAccion.set(true);

    const coords = await this.portalService.obtenerGeolocalizacion();
    const activo = this.estadoHoy()?.fichajeActivo;

    this.portalService.ficharSalida({
      registroHorasId: activo?.id,
      latitud: coords?.latitud,
      longitud: coords?.longitud
    }).subscribe({
      next: res => {
        this.cargandoAccion.set(false);
        this.tiempoTranscurridoSegundos.set(0);
        this.messageService.add({
          severity: 'success',
          summary: '¡Jornada finalizada!',
          detail: res.mensaje || `Salida registrada con éxito. Horas: ${res.horasTotales || ''}h`
        });
        this.recargarEstadoHoy();
        this.cargarMisHoras();
      },
      error: err => {
        this.cargandoAccion.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al fichar salida',
          detail: err?.error?.mensaje || 'No se ha podido registrar la salida.'
        });
      }
    });
  }

  abrirModalTicket(): void {
    this.modalTicketVisible.set(true);
    this.portalService.vibrar(30);
  }

  onTicketCreado(_ticket: any): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Albarán Subido',
      detail: 'El documento ha sido cargado e imputado a la obra.'
    });
  }

  async sincronizarManualmente(): Promise<void> {
    await this.portalService.sincronizarPendientesSiHayRed();
    this.messageService.add({
      severity: 'info',
      summary: 'Sincronización',
      detail: 'Comprobación con la central completada.'
    });
    this.recargarEstadoHoy();
  }

  irAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}
