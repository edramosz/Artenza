using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Create
{
    public class CreateNewsletter
    {
        public string Email { get; set; }

        public DateTime DataInscricao { get; set; } = DateTime.UtcNow;
    }
}
