using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IEnderecoService
    {
        Task<List<Endereco>> GetEnderecosAsync();
        Task<List<Endereco>> GetEnderecosPorUsuarioAsync(string usuarioId);
        Task<Endereco> GetEnderecoPorIdAsync(string id);
        Task<Endereco> AddEnderecoAsync(CreateEndereco enderecoDto);
        Task UpdateEnderecoAsync(string id, UpdateEndereco enderecoDto);
        Task DeleteEnderecoAsync(string id);
        Task DesativarTodosDoUsuario(string usuarioId);

    }
}
