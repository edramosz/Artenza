using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Update
{
    public class UpdateProduto
    {
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        public string Descricao { get; set; }
        public List<string> UrlImagens { get; set; } = new List<string>();
        public string Categoria { get; set; } // Exemplo: "Roupas", "Acessórios"
        public int Estoque { get; set; }
        public string Tamanho { get; set; }
        public List<string> Tamanhos { get; set; }
        public string Cor { get; set; }
        public string Genero { get; set; }
        public string Tipo { get; set; }      // Para acessórios (Exemplo: "Relógio", "Colar")
        public string Marca { get; set; }
    }
}
