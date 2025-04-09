using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Core.Models.DTO_s.Create;

namespace Core.Models.DTO_s
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Usuario, CreateUsuario>();
            CreateMap<CreateUsuario, Usuario>();

        }
    }
}
