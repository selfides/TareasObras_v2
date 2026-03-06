namespace TareasObras.Domain.Enums;

public enum EstadoObra
{
    Planificada = 1,
    EnCurso = 2,
    Pausada = 3,
    Completada = 4,
    Cancelada = 5
}

public enum EstadoTarea
{
    Pendiente = 1,
    EnProgreso = 2,
    Bloqueada = 3,
    Completada = 4,
    Cancelada = 5
}

public enum PrioridadTarea
{
    Baja = 1,
    Media = 2,
    Alta = 3,
    Critica = 4
}

public enum RolUsuario
{
    Admin = 1,
    Supervisor = 2,
    Operario = 3
}


public enum EstadoPresupuesto { Borrador = 0, Aprobado = 1, Anulado = 2 }