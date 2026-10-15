using MediatR;
using TareasObras.Application.Common.Interfaces;
using TareasObras.Application.Features.Facturas.DTOs;
using TareasObras.Domain.Enums;

namespace TareasObras.Application.Features.Facturas.Queries;

public class GetTicketsPendientesQuery : IRequest<List<TicketPendienteDto>>
{
    public EstadoTicketPendiente? Estado { get; set; }
    public Guid? ObraId { get; set; }
}

public class GetTicketsPendientesHandler : IRequestHandler<GetTicketsPendientesQuery, List<TicketPendienteDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public GetTicketsPendientesHandler(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    public async Task<List<TicketPendienteDto>> Handle(GetTicketsPendientesQuery request, CancellationToken ct)
    {
        // Si el usuario es Operario, solo ve sus propios tickets subidos.
        // Si es Admin o Supervisor, ve los tickets de todas las obras para aprobación.
        string? filtroUsuario = null;
        if (_currentUser.Role == "Operario")
        {
            filtroUsuario = _currentUser.UserId;
        }

        var tickets = await _uow.TicketsPendientes.GetAllAsync(
            estado: request.Estado,
            obraId: request.ObraId,
            usuarioId: filtroUsuario,
            ct: ct);

        return tickets.Select(t => new TicketPendienteDto
        {
            Id = t.Id,
            ObraId = t.ObraId,
            ObraNombre = t.Obra?.Nombre ?? "",
            ObraCodigo = t.Obra?.Codigo ?? "",
            UsuarioId = t.UsuarioId,
            UsuarioNombre = t.UsuarioNombre,
            DocumentoUrl = t.DocumentoUrl,
            DocumentoHash = t.DocumentoHash,
            NombreArchivoOriginal = t.NombreArchivoOriginal,
            ContentType = t.ContentType,
            Estado = t.Estado.ToString(),
            FechaSubida = t.CreatedAt,
            FechaGasto = t.FechaGasto,
            TotalEstimado = t.TotalEstimado,
            ProveedorSugerido = t.ProveedorSugerido,
            CifSugerido = t.CifSugerido,
            NumeroFacturaSugerido = t.NumeroFacturaSugerido,
            ComentarioOperario = t.ComentarioOperario,
            DatosExtraidosJson = t.DatosExtraidosJson,
            MaterialObraId = t.MaterialObraId,
            MotivoRechazo = t.MotivoRechazo,
            RevisadoPor = t.RevisadoPor,
            FechaRevision = t.FechaRevision
        }).ToList();
    }
}
