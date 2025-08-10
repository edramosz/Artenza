using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Create
{
    public class CreateCartao
    {
        public string UsuarioId { get; set; }
        public string NumeroCartao { get; set; }
        public string NomeTitular { get; set; }
        public DateTime Validade { get; set; }
        public string CVV { get; set; }
    }
}
