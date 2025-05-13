using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;

namespace Core.Interfaces
{
    public interface IEnderecoService
    {
        Task<List<Endereco>> GetEnderecosAsync();
        Task<Endereco> GetEnderecoAsync(string id);
        Task<Endereco> AddEnderecoAsync(CreateEndereco enderecoDto);
        Task UpdateEnderecoAsync(string id, UpdateEndereco endereco);
        Task DeleteEnderecoAsync(string id);
    }
}
