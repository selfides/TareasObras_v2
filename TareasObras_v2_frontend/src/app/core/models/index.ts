// ─── Auth ──────────────────────────────────────────────────────────────────
export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { email: string; password: string; nombre: string; apellidos: string; rol: string; }
export interface AuthResponse { token: string; user: UserDto; }
export interface UserDto { id: string; email: string; nombreCompleto: string; rol: string; }

// ─── Obras ─────────────────────────────────────────────────────────────────
export interface ObraListDto {
  id: string; codigo: string; nombre: string; cliente?: string; direccion?: string;
  fechaInicio: string; fechaFinPrevista?: string; estadoNombre: string; estado: EstadoObra;
  presupuestoEstimado: number; presupuestoReal: number; totalTareas: number; tareasPendientes: number;
}
export interface ObraDetailDto extends ObraListDto {
  descripcion?: string; fechaFinReal?: string; createdAt: string; createdBy?: string;
  tareas: TareaDto[];
}
export interface CreateObraRequest {
  codigo: string; nombre: string; descripcion?: string; direccion?: string; cliente?: string;
  fechaInicio: string; fechaFinPrevista?: string; presupuestoEstimado: number;
}
export interface UpdateObraRequest {
  nombre: string; descripcion?: string; direccion?: string; cliente?: string;
  fechaInicio: string; fechaFinPrevista?: string; presupuestoEstimado: number;
}

// ─── Tareas ────────────────────────────────────────────────────────────────
export interface TareaDto {
  id: string; obraId: string; titulo: string; descripcion?: string;
  estadoNombre: string; estado: EstadoTarea; prioridadNombre: string; prioridad: PrioridadTarea;
  fechaLimite?: string; horasEstimadas: number; horasReales: number;
  cuadrillaId?: string; usuarioAsignadoId?: string; observaciones?: string; createdAt: string;
}
export interface CreateTareaRequest {
  obraId: string; titulo: string; descripcion?: string; prioridad: PrioridadTarea;
  fechaLimite?: string; horasEstimadas: number; cuadrillaId?: string; usuarioAsignadoId?: string;
}
export interface UpdateTareaRequest {
  titulo: string; descripcion?: string; prioridad: PrioridadTarea;
  fechaLimite?: string; horasEstimadas: number; cuadrillaId?: string; usuarioAsignadoId?: string;
}
export interface CambiarEstadoRequest { nuevoEstado: EstadoTarea; observaciones?: string; }

// ─── Materiales ────────────────────────────────────────────────────────────
export interface MaterialDto {
  id: string; obraId: string; nombre: string; descripcion?: string;
  unidad: string; cantidad: number; precioUnitario: number; precioTotal: number;
  proveedor?: string; fechaEntrega?: string; estado: EstadoMaterial; estadoNombre: string;
  createdAt: string;
}
export interface CreateMaterialRequest {
  obraId: string; nombre: string; descripcion?: string; unidad: string;
  cantidad: number; precioUnitario: number; proveedor?: string; fechaEntrega?: string;
}

// ─── Usuarios ──────────────────────────────────────────────────────────────
export interface UsuarioDto {
  id: string; email: string; nombre: string; apellidos: string;
  nombreCompleto: string; rol: string; activo: boolean; createdAt: string;
}

// ─── Enums ─────────────────────────────────────────────────────────────────
export enum EstadoObra { Planificada = 1, EnCurso = 2, Pausada = 3, Completada = 4, Cancelada = 5 }
export enum EstadoTarea { Pendiente = 1, EnProgreso = 2, Bloqueada = 3, Completada = 4, Cancelada = 5 }
export enum PrioridadTarea { Baja = 1, Media = 2, Alta = 3, Critica = 4 }
export enum EstadoMaterial { Pendiente = 1, Pedido = 2, Recibido = 3, Instalado = 4 }

// ─── Shared ────────────────────────────────────────────────────────────────
export interface ApiResponse<T> { data: T; message?: string; }
export interface PagedResult<T> { items: T[]; total: number; page: number; pageSize: number; }
export interface SelectOption { label: string; value: any; }

// ─── Categorías Operario ───────────────────────────────────────────────────
export interface CategoriaOperarioDto {
  id: string;
  nombre: string;
  costeHoraBase: number;
  activo: boolean;
  totalOperarios: number;
}

// ─── Operarios ────────────────────────────────────────────────────────────
export interface OperarioDto {
  id: string;
  nombre: string;
  apellidos: string;
  nombreCompleto: string;
  dni?: string;
  telefono?: string;
  activo: boolean;
  categoriaOperarioId: string;
  categoriaNombre: string;
  costeHoraBase: number;
  cuadrillaId?: string;
  cuadrillaNombre?: string;
}

// ─── Registro Horas ───────────────────────────────────────────────────────
export interface RegistroHorasDto {
  id: string;
  obraId: string;
  operarioId: string;
  operarioNombre: string;
  categoriaOperarioId: string;
  categoriaNombre: string;
  fecha: string;
  horas: number;
  costeHoraAplicado: number;
  costeTotal: number;
  observaciones?: string;
}

// ─── Presupuestos ─────────────────────────────────────────────────────────
export interface LineaMaterialDto {
  id: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  importeEstimado: number;
}

export interface LineaHorasDto {
  id: string;
  categoriaOperarioId: string;
  categoriaNombre: string;
  horasEstimadas: number;
  costeHoraEstimado: number;
  importeEstimado: number;
}

export interface PresupuestoDto {
  numero?: string;
  id: string;
  obraId: string;
  version: number;
  fecha: string;
  descripcion?: string;
  estadoNombre: string;
  esAprobado: boolean;
  totalMaterial: number;
  totalHoras: number;
  total: number;
  lineasMaterial: LineaMaterialDto[];
  lineasHoras: LineaHorasDto[];
}

// ─── Materiales Obra ──────────────────────────────────────────────────────
export interface MaterialObraDto {
  id: string;
  obraId: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  importeReal: number;
  fecha: string;
  observaciones?: string;
}