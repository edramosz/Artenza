using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Create
{
    public class CreateContato
    {
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Servico { get; set; }
        public string Mensagem { get; set; }

        public DateTime DataEnvio { get; set; } = DateTime.UtcNow;

    }
}
