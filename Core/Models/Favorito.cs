using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Favorito
    {
        public string Id { get; set; }
        public string UsuarioId { get; set; }
        public string ProdutoId { get; set; }
    }
}
