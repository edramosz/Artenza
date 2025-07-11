﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Venda
    {
        public string Id { get; set; }
        public string UsuarioId { get; set; }
        public string EnderecoId { get; set; }
        public DateTime DataVenda { get; set; }
        public decimal ValorTotal { get; set; }
        public List<ItemVenda> Produtos { get; set; } = new List<ItemVenda>();
    }

}
