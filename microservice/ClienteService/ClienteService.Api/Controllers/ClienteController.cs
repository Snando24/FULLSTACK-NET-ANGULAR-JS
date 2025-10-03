using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClienteService.Api.Models;

namespace ClienteService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClienteController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{ruc}")]
        public async Task<ActionResult<Cliente>> GetByRuc(string ruc)
        {
            if (string.IsNullOrWhiteSpace(ruc))
                return BadRequest("El RUC es obligatorio.");

            try
            {
                var cliente = await _context.Clientes
                    .FromSqlRaw(@"
                        SELECT 
                            ID,
                            RUC,
                            RAZONSOCIAL,
                            NVL(TELEFONO, '') AS TELEFONO,
                            NVL(CORREO, '') AS CORREO,
                            NVL(DIRECCION, '') AS DIRECCION
                        FROM CLIENTE 
                        WHERE RUC = {0}", ruc)
                    .Select(c => new Cliente
                    {
                        Id = c.Id,
                        Ruc = c.Ruc,
                        RazonSocial = c.RazonSocial,
                        Telefono = c.Telefono,
                        Correo = c.Correo,
                        Direccion = c.Direccion
                    })
                    .FirstOrDefaultAsync();

                if (cliente == null) return NotFound($"No se encontró cliente con RUC {ruc}.");

                return Ok(cliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Cliente>>> Search(string razonSocial)
        {
            if (string.IsNullOrWhiteSpace(razonSocial))
                return BadRequest("El parámetro 'razonSocial' es obligatorio.");

            try
            {
                var clientes = await _context.Clientes
                    .FromSqlRaw(@"
                        SELECT 
                            ID,
                            RUC,
                            RAZONSOCIAL,
                            NVL(TELEFONO, '') AS TELEFONO,
                            NVL(CORREO, '') AS CORREO,
                            NVL(DIRECCION, '') AS DIRECCION
                        FROM CLIENTE 
                        WHERE RAZONSOCIAL LIKE {0}", $"%{razonSocial}%")
                    .Select(c => new Cliente
                    {
                        Id = c.Id,
                        Ruc = c.Ruc,
                        RazonSocial = c.RazonSocial,
                        Telefono = c.Telefono,
                        Correo = c.Correo,
                        Direccion = c.Direccion
                    })
                    .ToListAsync();

                if (!clientes.Any()) return NotFound("No se encontraron clientes que coincidan con la búsqueda.");

                return Ok(clientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetAll()
        {
            try
            {
                var clientes = await _context.Clientes
                    .FromSqlRaw("SELECT ID, RUC, RAZONSOCIAL, NVL(TELEFONO, '') AS TELEFONO, NVL(CORREO, '') AS CORREO, NVL(DIRECCION, '') AS DIRECCION FROM CLIENTE")
                    .ToListAsync();
                
                return Ok(clientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Cliente>> Create(Cliente cliente)
        {
            if (cliente == null) return BadRequest("El cliente no puede ser nulo.");
            if (string.IsNullOrWhiteSpace(cliente.Ruc)) return BadRequest("El RUC es obligatorio.");

            var existe = await _context.Clientes.FirstOrDefaultAsync(c => c.Ruc == cliente.Ruc);
            if (existe != null)
            {
                return BadRequest(new { 
                    message = $"Ya existe un cliente con RUC {cliente.Ruc}.",
                    ruc = cliente.Ruc 
                });
            }

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByRuc), new { ruc = cliente.Ruc }, cliente);
        }

        [HttpPut("{ruc}")]
        public async Task<IActionResult> Update(string ruc, Cliente cliente)
        {
            if (cliente == null) return BadRequest("El cliente no puede ser nulo.");
            if (string.IsNullOrWhiteSpace(ruc) || string.IsNullOrWhiteSpace(cliente.Ruc))
                return BadRequest("El RUC es obligatorio.");

            var clienteExistente = await _context.Clientes.FirstOrDefaultAsync(c => c.Ruc == ruc);
            if (clienteExistente == null) return NotFound($"No se encontró un cliente con RUC {ruc}.");
            if (ruc != cliente.Ruc)
            {
                var existeNuevoRuc = await _context.Clientes.FirstOrDefaultAsync(c => c.Ruc == cliente.Ruc);
                if (existeNuevoRuc != null)
                {
                    return BadRequest(new { 
                        message = $"Ya existe un cliente con RUC {cliente.Ruc}.",
                        ruc = cliente.Ruc 
                    });
                }
            }
            clienteExistente.Ruc = cliente.Ruc;
            clienteExistente.RazonSocial = cliente.RazonSocial;
            clienteExistente.Telefono = cliente.Telefono;
            clienteExistente.Correo = cliente.Correo;
            clienteExistente.Direccion = cliente.Direccion;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{ruc}")]
        public async Task<IActionResult> PartialUpdate(string ruc, [FromBody] Dictionary<string, object> cambios)
        {
            if (cambios == null || !cambios.Any())
                return BadRequest("Debe enviar al menos un campo a actualizar.");

            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Ruc == ruc);
            if (cliente == null) return NotFound($"No se encontró un cliente con RUC {ruc}.");

            foreach (var cambio in cambios)
            {
                switch (cambio.Key.ToLower())
                {
                    case "razonsocial":
                        cliente.RazonSocial = cambio.Value?.ToString();
                        break;
                    case "telefono":
                        cliente.Telefono = cambio.Value?.ToString();
                        break;
                    case "correo":
                        cliente.Correo = cambio.Value?.ToString();
                        break;
                    case "direccion":
                        cliente.Direccion = cambio.Value?.ToString();
                        break;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(cliente);
        }

        [HttpDelete("{ruc}")]
        public async Task<IActionResult> Delete(string ruc)
        {
            if (string.IsNullOrWhiteSpace(ruc)) return BadRequest("El RUC es obligatorio.");

            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Ruc == ruc);
            if (cliente == null) return NotFound($"No se encontró un cliente con RUC {ruc}.");

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
