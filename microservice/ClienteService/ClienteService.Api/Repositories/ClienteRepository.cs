using Microsoft.EntityFrameworkCore;
using ClienteService.Api.Models;

namespace ClienteService.Api.Repositories
{
    public class ClienteRepository : IClienteRepository
{
    private readonly AppDbContext _ctx;
    public ClienteRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task AddAsync(Cliente cliente) => await _ctx.Clientes.AddAsync(cliente);

    public async Task<List<Cliente>> GetAllAsync() => await _ctx.Clientes.ToListAsync();

    public async Task<Cliente?> GetByRucAsync(string ruc) =>
        await _ctx.Clientes.FirstOrDefaultAsync(c => c.Ruc == ruc);

    public async Task<List<Cliente>> SearchByRazonSocialAsync(string razon) =>
        await _ctx.Clientes.Where(c => EF.Functions.Like(c.RazonSocial, $"%{razon}%")).ToListAsync();

    public void Remove(Cliente cliente) => _ctx.Clientes.Remove(cliente);

    public void Update(Cliente cliente) => _ctx.Clientes.Update(cliente);

    // Use CountAsync or FirstOrDefaultAsync to avoid AnyAsync/Oracle bug
    public async Task<bool> ExistsByRucAsync(string ruc) =>
        (await _ctx.Clientes.FirstOrDefaultAsync(c => c.Ruc == ruc)) != null;

    public async Task<int> SaveChangesAsync() => await _ctx.SaveChangesAsync();
}
}
