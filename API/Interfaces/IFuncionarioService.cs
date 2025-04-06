using API.Models;

namespace API.Interfaces
{
    public interface IFuncionarioService
    {
        Task<List<Funcionario>> GetFuncionariosAsync();
        Task<Funcionario> GetFuncionarioAsync(string id);
        Task AddFuncionarioAsync(Funcionario funcionario);
        Task UpdateFuncionarioAsync(string id, Funcionario funcionario);
        Task DeleteFuncionarioAsync(string id);
    }
}
