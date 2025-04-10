using Core.Models;
using Core.Models.DTO_s.Create;

namespace Core.Interfaces
{
    public interface IUsuarioService
    {
        Task<List<Usuario>> GetUsuariosAsync();
        Task<Usuario> GetUsuarioAsync(string id);
        Task<Usuario> AddUsuarioAsync(CreateUsuario usuarioDto);
        Task UpdateUsuarioAsync(string id, Usuario usuario);
        Task DeleteUsuarioAsync(string id);
    }
}
