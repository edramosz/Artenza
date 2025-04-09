using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Read
{
    public class ReadCarrinho
    {
        public string Id { get; set; }
        public string IdUsuario { get; set; }
        public string IdProduto { get; set; }

        // Campos adicionais para facilitar a exibição:
        public string NomeProduto { get; set; }
        public decimal PrecoProduto { get; set; }
        public int Quantidade { get; set; }
    }
}
