using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Update
{
    public class UpdateFeedback
    {
        public string Comentario { get; set; }
        public int Nota { get; set; }
        public string Titulo { get; set; }
        public string NomeUsuario { get; set; }
        public DateTime DataCriacao { get; set; }
        public string PerfilUrl { get; set; }
        public string? URLMidia { get; set; }
    }
}
