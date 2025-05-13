using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;

namespace Core.Interfaces
{
    public interface IProdutoService
    {
        Task<List<Produto>> GetProdutosAsync();
        Task<Produto> GetProdutoAsync(string id);
        Task<Produto> AddProdutoAsync(CreateProduto produto);
        Task UpdateProdutoAsync(string id, UpdateProduto produto);
        Task DeleteProdutoAsync(string id);
    }
}
