namespace API.Models
{
    public class Usuario
    {
        public Usuario()
        {
            Id = Guid.NewGuid().ToString();
            DataCadastro = DateTime.Now;
        }

        public string Id { get; set; }
        public string IdEndereco { get; set; }
        public string NomeCompleto { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string DataNascimento { get; set; }
        public string Senha { get; set; }
        public DateTime DataCadastro { get; set; }
    }
}
