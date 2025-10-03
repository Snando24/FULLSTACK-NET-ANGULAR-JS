using ClienteService.Api.DTOs;

namespace ClienteService.Api.Services
{
    public interface IClienteService
{
    Task<ClienteDto?> GetByRucAsync(string ruc);
    Task<List<ClienteDto>> SearchByRazonSocialAsync(string razon);
    Task<List<ClienteDto>> GetAllAsync();
    Task<ClienteDto> CreateAsync(ClienteCreateDto dto);
    Task UpdateAsync(string ruc, ClienteUpdateDto dto);
    Task DeleteAsync(string ruc);
}
}
