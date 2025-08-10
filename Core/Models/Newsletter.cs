using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Newsletter
    {
        public string Id { get; set; }
        public string Email { get; set; }

        public DateTime DataInscricao { get; set; } = DateTime.UtcNow;
    }
}
