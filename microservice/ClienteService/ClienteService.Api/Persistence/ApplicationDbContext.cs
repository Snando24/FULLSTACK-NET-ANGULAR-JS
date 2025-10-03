using Microsoft.EntityFrameworkCore;
using ClienteService.Api.Models;

namespace ClienteService.Api.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Cliente> Clientes { get; set; }
    }
}
