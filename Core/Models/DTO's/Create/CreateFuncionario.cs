using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Create
{
    public class CreateFuncionario
    {
        public string NomeCompleto { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string CPF { get; set; }
        public DateOnly DataNascimento { get; set; }
        public string SenhaHash { get; set; }
        public decimal Salario { get; set; }
    }
}
