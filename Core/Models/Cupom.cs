using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Cupom
    {
        public string Id { get; set; }
        public string Codigo { get; set; }
        public double Valor { get; set; }
        public bool Ativo { get; set; }
    }
}
