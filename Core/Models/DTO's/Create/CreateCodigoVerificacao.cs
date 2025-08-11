using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Create
{
    public class CreateCodigoVerificacao
    {
        public string Email { get; set; }
        public string ? Codigo { get; set; }
        public DateTime DataExpiracao { get; set; }
    }
}
