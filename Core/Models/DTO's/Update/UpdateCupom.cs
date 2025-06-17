using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Update
{
    public class UpdateCupom
    {
        public string Codigo { get; set; }
        public double Valor { get; set; }
        public bool Ativo { get; set; }
    }
}
