using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;

namespace Core.Models.DTO_s
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // CREATE

            CreateMap<Usuario, CreateUsuario>();
            CreateMap<CreateUsuario, Usuario>();

            CreateMap<Endereco, CreateEndereco>();
            CreateMap<CreateEndereco, Endereco>();

            CreateMap<Produto, CreateProduto>();
            CreateMap<CreateProduto, Produto>();

            CreateMap<Venda, CreateVenda>();
            CreateMap<CreateVenda, Venda>();

            CreateMap<Transacao, CreateTransacao>();
            CreateMap<CreateTransacao, Transacao>();

            CreateMap<Carrinho, CreateCarrinho>();
            CreateMap<CreateCarrinho, Carrinho>();

            CreateMap<ItemVenda, CreateItemVenda>();
            CreateMap<CreateItemVenda, ItemVenda>();

            CreateMap<Feedback, CreateFeedback>();
            CreateMap<CreateFeedback, Feedback>();

            CreateMap<Cupom, CreateCupom>();
            CreateMap<CreateCupom, Cupom>();

            CreateMap<Favorito, CreateFavorito>();
            CreateMap<CreateFavorito, Favorito>();

            // UPDATE

            CreateMap<Usuario, UpdateUsuario>();
            CreateMap<UpdateUsuario, Usuario>();

            CreateMap<Produto, UpdateProduto>();
            CreateMap<UpdateProduto, Produto>();

            CreateMap<Endereco, UpdateEndereco>();
            CreateMap<UpdateEndereco, Endereco>();

            CreateMap<Carrinho, UpdateCarrinho>();
            CreateMap<UpdateCarrinho, Carrinho>();

            CreateMap<Feedback, UpdateFeedback>();
            CreateMap<UpdateFeedback, Feedback>();

            CreateMap<Cupom, UpdateCupom>();
            CreateMap<UpdateCupom, Cupom>();

            CreateMap<Favorito, UpdateFavorito>();
            CreateMap<UpdateFavorito, Favorito>();
        }
    }
}
