using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class CodigoVerificacao
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string ? Codigo { get; set; }
        public DateTime DataExpiracao { get; set; }
    }

}
