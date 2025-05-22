using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Create
{
    public class CreateVenda
    {
        public DateTime DataVenda { get; set; }
        public decimal ValorTotal { get; set; }
        public List<ItemVenda> Produtos { get; set; } = new List<ItemVenda>();
    }
}
