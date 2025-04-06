namespace API.Models
{
    public class Funcionario
    {
        public string Id { get; set; }
        public string NomeCompleto { get; set; }
        public string Email { get; set; }
        public int Telefone { get; set; }
        public int CPF { get; set; }
        public string DataNascimento { get; set; }
        public string Senha { get; set; }
        public DateOnly DataContratacao { get; set; }
        public double Salario { get; set; }
    }
}
