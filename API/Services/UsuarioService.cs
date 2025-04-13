using AutoMapper;
using Core.Interfaces;
using Core.Models;
using Core.Models.DTO_s.Create;
using Firebase.Database;
using Firebase.Database.Query;

namespace API.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly FirebaseClient _firebaseClient;
        private readonly IMapper _mapper;

        public UsuarioService(IConfiguration configuration, IMapper mapper)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
            _mapper = mapper;
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

        // Obter um usuário pelo email
        public async Task<Usuario> GetUsuarioByEmailAsync(string email)
        {
            // Buscando o usuário na coleção "usuarios" usando o filtro por email
            var usuario = await _firebaseClient
                .Child("usuarios")
                .OrderBy("Email") // Ordena pelo campo "Email"
                .EqualTo(email)   // Busca pelo valor do email
                .OnceSingleAsync<Usuario>();

            return usuario; // Retorna o usuário encontrado ou null se não encontrado
        }


        // Adicionar um novo usuario
        public async Task<Usuario> AddUsuarioAsync(CreateUsuario usuarioDto)
        {
            var usuario = _mapper.Map<Usuario>(usuarioDto);

            // (Opcional) Gera DataCadastro
            usuario.DataCadastro = DateOnly.FromDateTime(DateTime.UtcNow);

            // Primeiro cria o documento no Firebase
            var response = await _firebaseClient
                .Child("usuarios")
                .PostAsync(usuario);

            // Agora que o Firebase gerou a chave, seta o Id no objeto
            usuario.Id = response.Key;
            usuario.IdEndereco = "teste";
            // Atualiza o registro no Firebase já com o Id
            await _firebaseClient
                .Child("usuarios")
                .Child(usuario.Id)
                .PutAsync(usuario);

            // Adicionar o ID do endereco ao usuario atraves de algum modo (ou add os dois juntos em um unico metodo,
            // ou usuario já ter id de endereco salvo, faltando apenas adicionar este valor no objeto endereco)
            return usuario;
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
