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
        public string Aplicado { get; set; }
        public double Valor { get; set; }
        public bool Resgatado { get; set; }
        public DateTime Validade { get; set; }
    }
}
