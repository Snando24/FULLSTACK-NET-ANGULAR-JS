using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClienteService.Api.Models
{
    [Table("CLIENTE")]
    public class Cliente
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("RUC")]
        [StringLength(11)]
        public string Ruc { get; set; }

        [Required]
        [Column("RAZONSOCIAL")]
        [StringLength(200)]
        public string RazonSocial { get; set; }

        [Column("TELEFONO")]
        [StringLength(20)]
        public string? Telefono { get; set; } = string.Empty;

        [Column("CORREO")]
        [StringLength(100)]
        public string? Correo { get; set; } = string.Empty;

        [Column("DIRECCION")]
        [StringLength(200)]
        public string? Direccion { get; set; } = string.Empty;
    }
}
