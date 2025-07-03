using AutoMapper;
using Core.Interfaces;
using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Mvc;

namespace API.Services
{
    public class CarrinhoService : ICarrinhoService
    {
        private readonly FirebaseClient _firebaseClient;
        private readonly IMapper _mapper;

        public CarrinhoService(IConfiguration configuration, IMapper mapper)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
            _mapper = mapper;
        }

        // Obter todos os carrinhos
        public async Task<List<Carrinho>> GetCarrinhosAsync()
        {
            var carrinhos = await _firebaseClient
                .Child("carrinhos")
                .OnceAsync<Carrinho>();

            return carrinhos.Select(item => item.Object).ToList();
        }

        // Obter um carrinho pelo ID
        public async Task<Carrinho> GetCarrinhoAsync(string id)
        {
            var carrinho = (await _firebaseClient
                .Child("carrinhos")
                .OnceAsync<Carrinho>())
                .FirstOrDefault(p => p.Object.Id.ToString() == id)?.Object;//metodo LINQ

            return carrinho;
        }

        // Adicionar um novo carrinho
        public async Task<Carrinho> AddCarrinhoAsync(CreateCarrinho carrinhoDto)
        {
            var carrinho = _mapper.Map<Carrinho>(carrinhoDto);

            var result = await _firebaseClient
            .Child("carrinhos")
            .PostAsync(carrinho);

            // Atualizar o ID do carrinho com a chave gerada
            carrinho.Id = result.Key;

            // Se quiser, você pode atualizar no Fireba se também:
            await _firebaseClient
                .Child("carrinhos")
                .Child(carrinho.Id)
                .PutAsync(carrinho);

            return carrinho;
        }

        // Atualizar um carrinho pelo ID
        public async Task UpdateCarrinhoAsync(string id, UpdateCarrinho carrinhoDto)
        {
            var carrinhoExistente = await GetCarrinhoAsync(id);
            if (carrinhoExistente != null)
            {
                _mapper.Map(carrinhoDto, carrinhoExistente);
                await _firebaseClient
                    .Child("carrinhos")
                    .Child(id)
                    .PutAsync(carrinhoExistente);
            }
        }

        // Deletar um carrinho pelo ID
        public async Task DeleteCarrinhoAsync(string id)
        {
            await _firebaseClient
                .Child("carrinhos")
                .Child(id)
                .DeleteAsync();
        }
    }
}
