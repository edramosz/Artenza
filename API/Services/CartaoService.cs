using AutoMapper;
using Core.Interfaces;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using Core.Models;
using Firebase.Database;
using Firebase.Database.Query;

namespace API.Services
{
    public class CartaoService : ICartaoService
    {
        private readonly FirebaseClient _firebaseClient;
        private readonly IMapper _mapper;

        public CartaoService(IConfiguration configuration, IMapper mapper)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
            _mapper = mapper;
        }

        // Obter todos os Cartaos
        public async Task<List<Cartao>> GetCartoesAsync()
        {
            var cartoes = await _firebaseClient
                .Child("cartoes")
                .OnceAsync<Cartao>();

            return cartoes.Select(item => item.Object).ToList();
        }

        // Obter um Cartao pelo ID
        public async Task<Cartao> GetCartaoAsync(string id)
        {
            var cartao = (await _firebaseClient
                .Child("cartoes")
                .OnceAsync<Cartao>())
                .FirstOrDefault(p => p.Object.Id.ToString() == id)?.Object;//metodo LINQ

            return cartao;
        }

        // Obter Cartaos por ID do Usuário
        public async Task<List<Cartao>> GetCartaoPorIdUsuario(string idUsuario)
        {
            var todosCartaos = await _firebaseClient
                .Child("cartoes")
                .OnceAsync<Cartao>();

            var cartoesFiltrados = todosCartaos
                .Where(f => f.Object.UsuarioId == idUsuario)
                .Select(f => f.Object)
                .ToList();

            return cartoesFiltrados;
        }

        // Adicionar um novo Cartao
        public async Task<Cartao> AddCartaoAsync(CreateCartao cartaoDto)
        {
            var cartao = _mapper.Map<Cartao>(cartaoDto);

            // Primeiro cria o documento no Firebase
            var response = await _firebaseClient
                .Child("cartoes")
                .PostAsync(cartao);

            // Agora que o Firebase gerou a chave, seta o Id no objeto
            cartao.Id = response.Key;

            // Atualiza o registro no Firebase já com o Id
            await _firebaseClient
                .Child("cartoes")
                .Child(cartao.Id)
                .PutAsync(cartao);

            // Adicionar o ID do cartao ao usuario através de algum modo
            return cartao;
        }

        // Atualizar um Cartao pelo ID
        public async Task UpdateCartaoAsync(string id, UpdateCartao cartaoDto)
        {
            var cartaoExistente = await GetCartaoAsync(id);
            if (cartaoExistente != null)
            {
                _mapper.Map(cartaoDto, cartaoExistente);
                await _firebaseClient
                    .Child("cartoes")
                    .Child(id)
                    .PutAsync(cartaoExistente);
            }
        }

        // Deletar um Cartao pelo ID
        public async Task DeleteCartaoAsync(string id)
        {
            await _firebaseClient
                .Child("cartoes")
                .Child(id)
                .DeleteAsync();
        }
    }
}
