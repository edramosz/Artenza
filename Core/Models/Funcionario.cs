namespace Core.Models
{
    public class Funcionario
    {
        public string Id { get; set; }
        public string NomeCompleto { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string CPF { get; set; }
        public DateOnly DataNascimento { get; set; }
        public string SenhaHash { get; set; }
        public DateOnly DataContratacao { get; set; }
        public decimal Salario { get; set; }
    }
}
