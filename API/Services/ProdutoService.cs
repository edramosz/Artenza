using AutoMapper;
using Core.Interfaces;
using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Identity;

namespace API.Services
{
    public class ProdutoService : IProdutoService
    {
        private readonly FirebaseClient _firebaseClient;
        private readonly IMapper _mapper;

        public ProdutoService(IConfiguration configuration, IMapper mapper)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
            _mapper = mapper;
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

        public async Task<List<Produto>> ObterProdutosMaisVendidos()
        {
            // 1. Buscar todas as vendas
            var vendas = (await _firebaseClient
                .Child("vendas")
                .OnceAsync<Venda>())
                .Select(v => v.Object)
                .ToList();

            // 2. Dicionário para contar vendas por ProdutoId
            var contagem = new Dictionary<string, int>();

            foreach (var venda in vendas)
            {
                if (venda.Produtos == null) continue;

                foreach (var item in venda.Produtos)
                {
                    if (string.IsNullOrEmpty(item.ProdutoId)) continue;

                    if (contagem.ContainsKey(item.ProdutoId))
                        contagem[item.ProdutoId] += item.Quantidade;
                    else
                        contagem[item.ProdutoId] = item.Quantidade;
                }
            }

            // 3. Ordenar os ProdutoId por quantidade vendida (descendente)
            var idsOrdenados = contagem
                .OrderByDescending(p => p.Value)
                .Select(p => p.Key)
                .ToList();

            // 4. Buscar todos os produtos de uma vez (melhor do que 1 a 1)
            var todosProdutos = (await _firebaseClient
                .Child("produtos")
                .OnceAsync<Produto>())
                .Select(p => p.Object)
                .ToList();

            // 5. Criar a lista final ordenada
            var produtosOrdenados = idsOrdenados
                .Select(id => todosProdutos.FirstOrDefault(p => p.Id == id))
                .Where(p => p != null)
                .ToList();

            return produtosOrdenados;
        }



        // Adicionar um novo produto
        public async Task<Produto> AddProdutoAsync(CreateProduto produtoDto)
        {
            var produto = _mapper.Map<Produto>(produtoDto);

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

            return produto;
        }

        // Atualizar um produto pelo ID
        public async Task UpdateProdutoAsync(string id, UpdateProduto produtoDto)
        {
            var produtoExistente = await GetProdutoAsync(id);
            if (produtoExistente != null)
            {
                _mapper.Map(produtoDto, produtoExistente);
                await _firebaseClient
                    .Child("produtos")
                    .Child(id)
                    .PutAsync(produtoExistente);
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
