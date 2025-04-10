namespace Core.Models
{
    public class Usuario
    {
        public string Id { get; set; }
        public string IdEndereco { get; set; }
        public string NomeCompleto { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public DateOnly DataNascimento { get; set; }
        public string SenhaHash { get; set; }
        public DateOnly DataCadastro { get; set; }
    }
}
