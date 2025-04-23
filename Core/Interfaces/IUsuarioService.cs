using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;

namespace Core.Interfaces
{
    public interface IUsuarioService
    {
        Task<List<Usuario>> GetUsuariosAsync();
        Task<Usuario> GetUsuarioAsync(string id);
        Task<Usuario> GetUsuarioByEmailAsync(string email);
        Task<Usuario> AddUsuarioAsync(CreateUsuario usuarioDto);
        Task UpdateUsuarioAsync(string id, UpdateUsuario usuario);
        Task DeleteUsuarioAsync(string id);
    }
}
