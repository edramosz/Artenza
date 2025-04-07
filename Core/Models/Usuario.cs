namespace Core.Models
{
    public class Usuario
    {
        public string Id { get; set; }
        public string IdEndereco { get; set; }
        public string NomeCompleto { get; set; }
        public string Email { get; set; }
        public int Telefone { get; set; }
        public string DataNascimento { get; set; }
        public string Senha { get; set; }
        public DateOnly DataCadastro { get; set; }
    }
}
