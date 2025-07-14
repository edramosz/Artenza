namespace Core.Models
{
    public class Endereco
    {
        public string Id { get; set; }
        public string UsuarioId { get; set; }
        public string CEP { get; set; }
        public string Estado { get; set; }
        public string Cidade { get; set; }
        public string Bairro { get; set; }
        public string Rua { get; set; }
        public string Numero { get; set; }
        public bool Ativo { get; set; }
        public string Complemento { get; set; }
    }
}
