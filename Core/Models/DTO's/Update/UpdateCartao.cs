using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Update
{
    public class UpdateCartao
    {
        public string NumeroCartao { get; set; }
        public string NomeTitular { get; set; }
        public DateTime Validade { get; set; }
        public string CVV { get; set; }
    }
}
