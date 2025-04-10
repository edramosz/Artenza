using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Transacao
    {
        public string Id { get; set; }
        public string VendaId { get; set; }
        public DateOnly Data { get; set; }
        public int Parcelamento { get; set; }
        public string MetodoPagamento { get; set; }
    }
}
