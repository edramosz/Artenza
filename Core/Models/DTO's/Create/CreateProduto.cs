using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Create
{
    public class CreateProduto
    {
        [Required] public string Nome { get; set; }
        [Required] public decimal Preco { get; set; }
        public string Descricao { get; set; }
        public List<string> UrlImagens { get; set; } = new List<string>();
        public string Categoria { get; set; } // Exemplo: "Roupas", "Acessórios"
        [Required] public int Estoque { get; set; }
        public List<string> Tamanhos { get; set; }
        public string Material { get; set; }
        public string Cor { get; set; }
        public string Genero { get; set; }
        public string Tipo { get; set; }      // Para acessórios (Exemplo: "Relógio", "Colar")
        public string Marca { get; set; }
    }
}
