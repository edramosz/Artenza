using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Create
{
    public class CreateCarrinho
    {
        public string IdUsuario { get; set; }
        public string IdProduto { get; set; }
        public int Quantidade { get; set; }
    }
}
