using AutoMapper;
using TareasObras.Application.Features.Obras.Queries.GetObraById;
using TareasObras.Application.Features.Obras.Queries.GetObras;
using TareasObras.Application.Features.Tareas.Queries.GetTareasByObra;
using TareasObras.Domain.Entities;

namespace TareasObras.Application.Common.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Obra, ObraListDto>()
                .ForMember(d => d.TotalTareas, o => o.MapFrom(s => s.Tareas.Count))
                .ForMember(d => d.TareasPendientes, o => o.MapFrom(s =>
                    s.Tareas.Count(t =>
                        t.Estado == Domain.Enums.EstadoTarea.Pendiente ||
                        t.Estado == Domain.Enums.EstadoTarea.EnProgreso)))
                .ForMember(d => d.EstadoNombre, o => o.MapFrom(s => s.Estado.ToString()));

            CreateMap<Obra, ObraDetailDto>()
                .ForMember(d => d.EstadoNombre, o => o.MapFrom(s => s.Estado.ToString()))
                .ForMember(d => d.Tareas, o => o.MapFrom(s => s.Tareas));

            CreateMap<Tarea, TareaDto>()
                .ForMember(d => d.EstadoNombre, o => o.MapFrom(s => s.Estado.ToString()))
                .ForMember(d => d.PrioridadNombre, o => o.MapFrom(s => s.Prioridad.ToString()));
        }
    }
}
