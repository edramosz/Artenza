using AutoMapper;
using Core.Interfaces;
using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Read;
using Core.Models.DTO_s.Update;
using Firebase.Database;
using Firebase.Database.Query;
using LiteDB;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Identity;

namespace API.Services
{
    public class ProdutoService : IProdutoService
    {
        private readonly FirebaseClient _firebaseClient;
        private readonly FirestoreDb _firestoreDb;
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
        public async Task<List<Produto>> BuscarPorTermoAsync(string termo)
        {
            if (string.IsNullOrWhiteSpace(termo))
                return new List<Produto>();

            termo = termo.ToLower();

            var produtos = await _firebaseClient
                .Child("produtos")
                .OnceAsync<Produto>();

            var resultados = produtos
                .Select(p => p.Object)
                .Where(p =>
                    (!string.IsNullOrEmpty(p.Nome) && p.Nome.ToLower().Contains(termo)) ||
                    (!string.IsNullOrEmpty(p.Descricao) && p.Descricao.ToLower().Contains(termo)) ||
                    (!string.IsNullOrEmpty(p.Categoria) && p.Categoria.ToLower().Contains(termo))
                )
                .ToList();

            return resultados;
        }
        public async Task<List<Produto>> FiltrarProdutos(FiltroProduto filtros)
        {
            var collection = _firestoreDb.Collection("produtos");
            Google.Cloud.Firestore.Query query = collection;

            if (filtros.Tamanhos != null && filtros.Tamanhos.Any())
            {
                // Firestore não aceita IN com array maior que 10
                query = query.WhereIn("Tamanho", filtros.Tamanhos.Take(10).ToList());
            }

            if (filtros.Cores != null && filtros.Cores.Any())
            {
                query = query.WhereIn("Cor", filtros.Cores.Take(10).ToList());
            }

            if (filtros.Categorias != null && filtros.Categorias.Any())
            {
                query = query.WhereIn("Categoria", filtros.Categorias.Take(10).ToList());
            }

            if (filtros.PrecoMin.HasValue)
            {
                query = query.WhereGreaterThanOrEqualTo("Preco", (double)filtros.PrecoMin.Value);
            }

            if (filtros.PrecoMax.HasValue)
            {
                query = query.WhereLessThanOrEqualTo("Preco", (double)filtros.PrecoMax.Value);
            }

            var snapshot = await query.GetSnapshotAsync();
            var produtos = new List<Produto>();

            foreach (var doc in snapshot.Documents)
            {
                produtos.Add(doc.ConvertTo<Produto>());
            }

            return produtos;
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
            produto.DataCriacao = DateTime.UtcNow;

            var result = await _firebaseClient
                .Child("produtos")
                .PostAsync(produto);

            produto.Id = result.Key;

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

        //Obter Lançamento do Produto

        public async Task<List<Produto>> ObterLancamentosAsync()
        {
            var produtos = await _firebaseClient
                .Child("produtos")
                .OnceAsync<Produto>();

            return produtos
                .Select(p => p.Object)
                .OrderByDescending(p => p.DataCriacao)
                .Take(10) // por exemplo, os 10 lançamentos mais recentes
                .ToList();
        }
        public async Task AtualizarEstoqueEQuantidadeVendidaAsync(List<ItemVenda> produtosVendidos)
        {
            var produtosFirebase = await _firebaseClient
                .Child("produtos")
                .OnceAsync<Produto>();

            foreach (var item in produtosVendidos)
            {
                var produtoFirebase = produtosFirebase.FirstOrDefault(p => p.Object.Id == item.ProdutoId);
                if (produtoFirebase == null)
                    continue;

                var produto = produtoFirebase.Object;

                produto.Estoque -= item.Quantidade;
                if (produto.Estoque < 0)
                    produto.Estoque = 0;

                produto.QuantidadeVendida += item.Quantidade;

                await _firebaseClient
                    .Child("produtos")
                    .Child(produtoFirebase.Key)
                    .PutAsync(produto);
            }
        }

    }
}
