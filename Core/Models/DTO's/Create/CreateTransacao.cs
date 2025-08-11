using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Create
{
    public class CreateTransacao
    {
        public string VendaId { get; set; }
        public DateOnly Data { get; set; }
        public int Parcelamento { get; set; }
        public string MetodoPagamento { get; set; }
    }
}
