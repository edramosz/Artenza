using Core.Interfaces;
using Core.Models;
using Firebase.Database;
using Firebase.Database.Query;

namespace API.Services
{
    public class CarrinhoService : ICarrinhoService
    {
        private readonly FirebaseClient _firebaseClient;

        public CarrinhoService(IConfiguration configuration)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
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
        public async Task AddCarrinhoAsync(Carrinho carrinho)
        {
            var result = await _firebaseClient
            .Child("carrinhos")
            .PostAsync(carrinho);

            // Atualizar o ID do carrinho com a chave gerada
            carrinho.Id = result.Key;

            // Se quiser, você pode atualizar no Firebase também:
            await _firebaseClient
                .Child("carrinhos")
                .Child(carrinho.Id)
                .PutAsync(carrinho);
        }

        // Atualizar um carrinho pelo ID
        public async Task UpdateCarrinhoAsync(string id, Carrinho carrinho)
        {
            var carrinhoExistente = await GetCarrinhoAsync(id);
            if (carrinhoExistente != null)
            {
                await _firebaseClient
                    .Child("carrinhos")
                    .Child(id)
                    .PutAsync(carrinho);
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
