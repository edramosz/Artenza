using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Create
{
    public class CreateCupom
    {
        public string Codigo { get; set; }
        public string TipoDesconto { get; set; }
        public bool Aplicado { get; set; }
        public double Valor { get; set; }
        public bool Resgatado { get; set; }
        public DateTime Validade { get; set; }
    }
}
