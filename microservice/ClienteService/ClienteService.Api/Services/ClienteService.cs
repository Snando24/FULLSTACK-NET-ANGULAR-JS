using AutoMapper;
using ClienteService.Api.Models;
using ClienteService.Api.DTOs;
using ClienteService.Api.Repositories;

namespace ClienteService.Api.Services
{
    public class ClienteService : IClienteService
{
    private readonly IClienteRepository _repo;
    private readonly IMapper _mapper;

    public ClienteService(IClienteRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<ClienteDto?> GetByRucAsync(string ruc)
    {
        var c = await _repo.GetByRucAsync(ruc);
        return c == null ? null : _mapper.Map<ClienteDto>(c);
    }

    public async Task<List<ClienteDto>> SearchByRazonSocialAsync(string razon)
    {
        var list = await _repo.SearchByRazonSocialAsync(razon);
        return _mapper.Map<List<ClienteDto>>(list);
    }

    public async Task<List<ClienteDto>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return _mapper.Map<List<ClienteDto>>(list);
    }

    public async Task<ClienteDto> CreateAsync(ClienteCreateDto dto)
    {
        if (await _repo.ExistsByRucAsync(dto.Ruc))
            throw new InvalidOperationException($"Ya existe un cliente con RUC {dto.Ruc}.");

        var entity = _mapper.Map<Cliente>(dto);
        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();
        return _mapper.Map<ClienteDto>(entity);
    }

    public async Task UpdateAsync(string ruc, ClienteUpdateDto dto)
    {
        var existing = await _repo.GetByRucAsync(ruc);
        if (existing == null) throw new KeyNotFoundException($"No existe cliente con RUC {ruc}.");

        // update fields
        existing.RazonSocial = dto.RazonSocial;
        existing.Telefono = dto.Telefono;
        existing.Correo = dto.Correo;
        existing.Direccion = dto.Direccion;

        _repo.Update(existing);
        await _repo.SaveChangesAsync();
    }

    public async Task DeleteAsync(string ruc)
    {
        var existing = await _repo.GetByRucAsync(ruc);
        if (existing == null) throw new KeyNotFoundException($"No existe cliente con RUC {ruc}.");
        _repo.Remove(existing);
        await _repo.SaveChangesAsync();
    }
}
}
