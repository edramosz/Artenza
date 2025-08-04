using AutoMapper;
using Core.Interfaces;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using Core.Models;
using Firebase.Database;
using Firebase.Database.Query;

namespace API.Services
{
    public class FavoritoService : IFavoritoService
    {
        private readonly FirebaseClient _firebaseClient;
        private readonly IMapper _mapper;

        public FavoritoService(IConfiguration configuration, IMapper mapper)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
            _mapper = mapper;
        }

        // Obter todos os Favoritos
        public async Task<List<Favorito>> GetFavoritosAsync()
        {
            var favoritos = await _firebaseClient
                .Child("favoritos")
                .OnceAsync<Favorito>();

            return favoritos.Select(item => item.Object).ToList();
        }

        // Obter um Favorito pelo ID
        public async Task<Favorito> GetFavoritoAsync(string id)
        {
            var favorito = (await _firebaseClient
                .Child("favoritos")
                .OnceAsync<Favorito>())
                .FirstOrDefault(p => p.Object.Id.ToString() == id)?.Object;//metodo LINQ

            return favorito;
        }

        // Obter Favoritos por ID do Usuário
        public async Task<List<Favorito>> GetFavoritoPorIdUsuario(string idUsuario)
        {
            var todosFavoritos = await _firebaseClient
                .Child("favoritos")
                .OnceAsync<Favorito>();

            var favoritosFiltrados = todosFavoritos
                .Where(f => f.Object.UsuarioId == idUsuario)
                .Select(f => f.Object)
                .ToList();

            return favoritosFiltrados;
        }

        // Adicionar um novo Favorito
        public async Task<Favorito> AddFavoritoAsync(CreateFavorito favoritoDto)
        {
            var favorito = _mapper.Map<Favorito>(favoritoDto);

            // Primeiro cria o documento no Firebase
            var response = await _firebaseClient
                .Child("favoritos")
                .PostAsync(favorito);

            // Agora que o Firebase gerou a chave, seta o Id no objeto
            favorito.Id = response.Key;

            // Atualiza o registro no Firebase já com o Id
            await _firebaseClient
                .Child("favoritos")
                .Child(favorito.Id)
                .PutAsync(favorito);

            // Adicionar o ID do favorito ao usuario através de algum modo
            return favorito;
        }

        // Atualizar um Favorito pelo ID
        public async Task UpdateFavoritoAsync(string id, UpdateFavorito favoritoDto)
        {
            var favoritoExistente = await GetFavoritoAsync(id);
            if (favoritoExistente != null)
            {
                _mapper.Map(favoritoDto, favoritoExistente);
                await _firebaseClient
                    .Child("favoritos")
                    .Child(id)
                    .PutAsync(favoritoExistente);
            }
        }

        // Deletar um Favorito pelo ID
        public async Task DeleteFavoritoAsync(string id)
        {
            await _firebaseClient
                .Child("favoritos")
                .Child(id)
                .DeleteAsync();
        }
    }
}
