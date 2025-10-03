using ClienteService.Api.Models;

namespace ClienteService.Api.Repositories
{
    public interface IClienteRepository
{
    Task<Cliente?> GetByRucAsync(string ruc);
    Task<List<Cliente>> SearchByRazonSocialAsync(string razon);
    Task<List<Cliente>> GetAllAsync();
    Task AddAsync(Cliente cliente);
    void Update(Cliente cliente);
    void Remove(Cliente cliente);
    Task<bool> ExistsByRucAsync(string ruc);
    Task<int> SaveChangesAsync();
}
}
