using Microsoft.EntityFrameworkCore;

namespace ClienteService.Api.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }
        public DbSet<Cliente> Clientes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>(entity =>
            {
                entity.HasIndex(c => c.Ruc)
                    .IsUnique();

                // Configurar campos opcionales para permitir NULL
                entity.Property(e => e.Telefono)
                    .IsRequired(false)
                    .HasDefaultValue(null);

                entity.Property(e => e.Correo)
                    .IsRequired(false)
                    .HasDefaultValue(null);

                entity.Property(e => e.Direccion)
                    .IsRequired(false)
                    .HasDefaultValue(null);

                // Configurar campos requeridos
                entity.Property(e => e.Ruc)
                    .IsRequired(true)
                    .HasMaxLength(11);

                entity.Property(e => e.RazonSocial)
                    .IsRequired(true)
                    .HasMaxLength(200);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
