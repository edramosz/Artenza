using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Create
{
    public class CreateFeedback
    {
        public string Titulo { get; set; }
        public string Comentario { get; set; }
        public int Nota { get; set; }
        public string NomeUsuario { get; set; }
        public DateTime DataCriacao { get; set; }
    }
}
