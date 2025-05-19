using AutoMapper;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Read;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s
{
    class UsuarioProfile : Profile
    {
        public UsuarioProfile()
        {
            CreateMap<CreateUsuario, Usuario>();
            CreateMap<Usuario, ReadUsuario>();
        }
    }
}
