using Core.Interfaces;
using Core.Models;
using Firebase.Database;
using Firebase.Database.Query;

namespace API.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly FirebaseClient _firebaseClient;

        public UsuarioService(IConfiguration configuration)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
        }

        // Obter todos os usuarios
        public async Task<List<Usuario>> GetUsuariosAsync()
        {
            var usuarios = await _firebaseClient
                .Child("usuarios")
                .OnceAsync<Usuario>();

            return usuarios.Select(item => item.Object).ToList();
        }

        // Obter um usuario pelo ID
        public async Task<Usuario> GetUsuarioAsync(string id)
        {
            var usuario = (await _firebaseClient
                .Child("usuarios")
                .OnceAsync<Usuario>())
                .FirstOrDefault(p => p.Object.Id.ToString() == id)?.Object;//metodo LINQ

            return usuario;
        }

        // Adicionar um novo usuario
        public async Task AddUsuarioAsync(Usuario usuario)
        {
            var response = await _firebaseClient
                .Child("usuarios")
                .PostAsync(usuario);

            usuario.Id = response.Key;

            await _firebaseClient
                .Child("usuarios")
                .Child(usuario.Id)
                .PutAsync(usuario);

            // Adicionar o ID do endereco ao usuario atraves de algum modo (ou add os dois juntos em um unico metodo,
            // ou usuario já ter id de endereco salvo, faltando apenas adicionar este valor no objeto endereco)
        }

        // Atualizar um usuario pelo ID
        public async Task UpdateUsuarioAsync(string id, Usuario usuario)
        {
            var usuarioExistente = await GetUsuarioAsync(id);
            if (usuarioExistente != null)
            {
                await _firebaseClient
                    .Child("usuarios")
                    .Child(id)
                    .PutAsync(usuario);
            }
        }

        // Deletar um produto pelo ID
        public async Task DeleteUsuarioAsync(string id)
        {
            await _firebaseClient
                .Child("usuarios")
                .Child(id)
                .DeleteAsync();
        }
    }
}
