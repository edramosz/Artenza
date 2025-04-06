using API.Interfaces;
using API.Models;
using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Identity;

namespace API.Services
{
    public class ProdutoService : IProdutoService
    {
        private readonly FirebaseClient _firebaseClient;

        public ProdutoService(IConfiguration configuration)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
        }

        // Obter todos os produtos
        public async Task<List<Produto>> GetProdutosAsync()
        {
            var produtos = await _firebaseClient
                .Child("produtos")
                .OnceAsync<Produto>();

            return produtos.Select(item => item.Object).ToList();
        }

        // Obter um produto pelo ID
        public async Task<Produto> GetProdutoAsync(string id)
        {
            var produto = (await _firebaseClient
                .Child("produtos")
                .OnceAsync<Produto>())
                .FirstOrDefault(p => p.Object.Id.ToString() == id)?.Object;//metodo LINQ

            return produto;
        }

        // Adicionar um novo produto
        public async Task AddProdutoAsync(Produto produto)
        {
            var result = await _firebaseClient
            .Child("produtos")
            .PostAsync(produto);

            // Atualizar o ID do produto com a chave gerada
            produto.Id = result.Key;

            // Se quiser, você pode atualizar no Firebase também:
            await _firebaseClient
                .Child("produtos")
                .Child(produto.Id)
                .PutAsync(produto);
        }

        // Atualizar um produto pelo ID
        public async Task UpdateProdutoAsync(string id, Produto produto)
        {
            var produtoExistente = await GetProdutoAsync(id);
            if (produtoExistente != null)
            {
                await _firebaseClient
                    .Child("produtos")
                    .Child(id)
                    .PutAsync(produto);
            }
        }

        // Deletar um produto pelo ID
        public async Task DeleteProdutoAsync(string id)
        {
            await _firebaseClient
                .Child("produtos")
                .Child(id)
                .DeleteAsync();
        }
    }
}
