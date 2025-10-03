using AutoMapper;
using ClienteService.Api.Models;
using ClienteService.Api.DTOs;

namespace ClienteService.Api.Mapping
{
    public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Cliente, ClienteDto>().ReverseMap();
        CreateMap<ClienteCreateDto, Cliente>();
        CreateMap<ClienteUpdateDto, Cliente>();
    }
}
}
