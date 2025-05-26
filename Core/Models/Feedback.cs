using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Feedback
    {
        public string Id { get; set; }
        public string IdProduto { get; set; }
        public string IdUsuario { get; set; }
        public string Comentario { get; set; }
        public int Nota { get; set; }
    }
}
