using Core.Models;

namespace Core.Interfaces
{
    public interface IEnderecoService
    {
        Task<List<Endereco>> GetEnderecosAsync();
        Task<Endereco> GetEnderecoAsync(string id);
        Task AddEnderecoAsync(Endereco endereco);
        Task UpdateEnderecoAsync(string id, Endereco endereco);
        Task DeleteEnderecoAsync(string id);
    }
}
