using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Read;
using Core.Models.DTO_s.Update;

namespace Core.Interfaces
{
    public interface IProdutoService
    {
        Task<List<Produto>> GetProdutosAsync();
        Task<Produto> GetProdutoAsync(string id);
        Task<List<Produto>> ObterProdutosMaisVendidos();
        Task<List<Produto>> BuscarPorTermoAsync(string termo);
        Task<List<Produto>> FiltrarProdutos(FiltroProduto filtro);
        Task<Produto> AddProdutoAsync(CreateProduto produto);
        Task UpdateProdutoAsync(string id, UpdateProduto produto);
        Task DeleteProdutoAsync(string id);
        Task<List<Produto>> ObterLancamentosAsync();
        Task AtualizarEstoqueEQuantidadeVendidaAsync(List<ItemVenda> produtosVendidos);
    }
}
