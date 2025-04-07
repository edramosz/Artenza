using Core.Models;

namespace Core.Interfaces
{
    public interface IUsuarioService
    {
        Task<List<Usuario>> GetUsuariosAsync();
        Task<Usuario> GetUsuarioAsync(string id);
        Task AddUsuarioAsync(Usuario usuario);
        Task UpdateUsuarioAsync(string id, Usuario usuario);
        Task DeleteUsuarioAsync(string id);
    }
}
