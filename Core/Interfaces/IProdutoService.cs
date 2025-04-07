using Core.Models;

namespace Core.Interfaces
{
    public interface IProdutoService
    {
        Task<List<Produto>> GetProdutosAsync();
        Task<Produto> GetProdutoAsync(string id);
        Task AddProdutoAsync(Produto produto);
        Task UpdateProdutoAsync(string id, Produto produto);
        Task DeleteProdutoAsync(string id);
    }
}
