using Core.Models;
using Core.Models.DTO_s.Create;

namespace Core.Interfaces
{
    public interface IEnderecoService
    {
        Task<List<Endereco>> GetEnderecosAsync();
        Task<Endereco> GetEnderecoAsync(string id);
        Task<Endereco> AddEnderecoAsync(CreateEndereco enderecoDto);
        Task UpdateEnderecoAsync(string id, Endereco endereco);
        Task DeleteEnderecoAsync(string id);
    }
}
