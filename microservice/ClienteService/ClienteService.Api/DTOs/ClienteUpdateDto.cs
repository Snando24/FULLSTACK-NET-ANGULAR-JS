using System.ComponentModel.DataAnnotations;

namespace ClienteService.Api.DTOs
{
    public class ClienteUpdateDto
{
    [Required, StringLength(11)]
    public string Ruc { get; set; } // keep for validation match with URL

    [Required, StringLength(200)]
    public string RazonSocial { get; set; }

    [StringLength(20)]
    public string? Telefono { get; set; }

    [EmailAddress, StringLength(100)]
    public string? Correo { get; set; }

    [StringLength(200)]
    public string? Direccion { get; set; }
}
}
