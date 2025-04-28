using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
    public class Usuario
    {
        public string Id { get; set; }
        public string IdEndereco { get; set; }
        public string NomeCompleto { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public int DiaNascimento { get; set; }
        public int MesNascimento { get; set; }
        public int AnoNascimento { get; set; }
        public string SenhaHash { get; set; }
        public DateTime DataCadastro { get; set; }
        public bool isAdmin { get; set; }

    }
}
