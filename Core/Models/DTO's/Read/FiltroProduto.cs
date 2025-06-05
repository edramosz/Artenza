using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Read
{
    public class FiltroProduto
    {
        public string[]? Tamanhos { get; set; }
        public string[]? Cores { get; set; }
        public string[]? Categorias { get; set; }
        public string[]? Generos { get; set; }
        public decimal? PrecoMin { get; set; }
        public decimal? PrecoMax { get; set; }
    }
}
