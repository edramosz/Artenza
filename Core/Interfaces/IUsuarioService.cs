using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Read;
using Core.Models.DTO_s.Update;

namespace Core.Interfaces
{
    public interface IUsuarioService
    {
        Task<List<Usuario>> GetUsuariosAsync();
        Task<Usuario> GetUsuarioAsync(string id);
        Task<Usuario> GetUsuarioByEmailAsync(string email);
        Task<ReadUsuario> AddUsuarioAsync(CreateUsuario usuario); 
        Task UpdateUsuarioAsync(string id, UpdateUsuario usuario);
        Task DeleteUsuarioAsync(string id);
        Task UpdateUsuarioFotoAsync(string id, Usuario usuario);
        Task<Usuario> GetUsuarioByTelefoneAsync(string telefone);
        Task UpdateSenhaAsync(string id, Usuario usuario);

    }
}
