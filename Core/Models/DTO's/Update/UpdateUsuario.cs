using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Update
{
    public class UpdateUsuario
    {
        public string NomeCompleto { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public int DiaNascimento { get; set; }
        public int MesNascimento { get; set; }
        public int AnoNascimento { get; set; }
        public string SenhaHash { get; set; }
        public bool isAdmin { get; set; }
        public string PerfilUrl { get; set; } = "";  // Valor padrão vazio
    }

}
