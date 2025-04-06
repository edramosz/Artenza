using API.Models;

namespace API.Interfaces
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
