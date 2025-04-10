using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Create
{
    public class CreateUsuario
    {
        [Required]
        public string NomeCompleto { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Telefone { get; set; }
        [Required]
        public DateOnly DataNascimento { get; set; }
        [Required]
        public string SenhaHash { get; set; }
    }
}
