using AutoMapper;
using Core.Interfaces;
using Core.Models;
using Core.Models.DTO_s.Create;
using Firebase.Database;
using Firebase.Database.Query;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Core.Models.DTO_s.Update;
using Microsoft.AspNetCore.Mvc;
using Core.Models.DTO_s.Read;
using Google.Api;

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
            try
            {
                var response = await _firebaseClient
                    .Child("usuarios")
                    .OnceAsJsonAsync(); // ← aqui é JSON bruto

                var usuarios = new List<Usuario>();

                var jsonObject = JsonConvert.DeserializeObject<Dictionary<string, JObject>>(response);

                foreach (var item in jsonObject)
                {
                    try
                    {
                        var usuario = item.Value.ToObject<Usuario>();
                        usuario.Id = item.Key; // setar o ID manualmente
                        usuarios.Add(usuario);
                    }
                    catch (Exception exItem)
                    {
                        Console.WriteLine($"Erro ao desserializar usuário {item.Key}: {exItem.Message}");
                        // aqui podemos ignorar ou tratar o erro
                    }
                }

                return usuarios;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro geral ao buscar usuários:");
                Console.WriteLine(ex.Message);
                throw;
            }
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

        public async Task<Usuario> GetUsuarioByEmailAsync(string email)
        {
            var usuarios = await _firebaseClient
                .Child("usuarios")
                .OrderBy("Email")
                .EqualTo(email)
                .OnceAsync<Usuario>();

            var usuario = usuarios.FirstOrDefault()?.Object;

            return usuario;
        }



        // Adicionar um novo usuario

        public async Task<ReadUsuario> AddUsuarioAsync([FromBody] CreateUsuario usuarioDto)
        {

            var usuario = _mapper.Map<Usuario>(usuarioDto);

            if (string.IsNullOrEmpty(usuario.PerfilUrl))
            {
                usuario.PerfilUrl = "https://exemplo.com/default-profile.png"; // Ou apenas ""
            }


            // Gera DataCadastro
            usuario.DataCadastro = DateTime.UtcNow;
            usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuarioDto.SenhaHash);

            // Cria o usuário no Firebase
            var response = await _firebaseClient
                .Child("usuarios")
                .PostAsync(usuario);

            usuario.Id = response.Key;

            await _firebaseClient
                .Child("usuarios")
                .Child(usuario.Id)
                .PutAsync(usuario);

            // Mapeando o usuário para o DTO de leitura (ReadUsuario)
            var readUsuario = _mapper.Map<ReadUsuario>(usuario);

            return readUsuario; // Agora retornamos um ReadUsuario
        }



        // Atualizar um usuario pelo ID
        public async Task UpdateUsuarioAsync(string id, UpdateUsuario usuarioDto)
        {
            var usuarioExistente = await GetUsuarioAsync(id);
            if (usuarioExistente != null)
            {
                _mapper.Map(usuarioDto, usuarioExistente);

               
                if (string.IsNullOrEmpty(usuarioDto.PerfilUrl))
                {
                    usuarioDto.PerfilUrl = ""; // ou um avatar padrão
                }

                await _firebaseClient
                    .Child("usuarios")
                    .Child(id)
                    .PutAsync(usuarioExistente);
            }
        }

        public async Task UpdateUsuarioFotoAsync(string id, Usuario usuario)
        {
            await _firebaseClient
                .Child("usuarios")
                .Child(id)
                .PutAsync(usuario);
        }
        public async Task UpdateSenhaAsync(string id, Usuario usuario)
        {
            await _firebaseClient
                .Child("usuarios")
                .Child(id)
                .PutAsync(usuario);
        }

        // Deletar um produto pelo ID
        public async Task DeleteUsuarioAsync(string id)
        {
            await _firebaseClient
                .Child("usuarios")
                .Child(id)
                .DeleteAsync();
        }

        public async Task<Usuario> GetUsuarioByTelefoneAsync(string telefone)
        {
            var usuarios = await _firebaseClient
                .Child("usuarios")
                .OrderBy("Telefone")
                .EqualTo(telefone)
                .OnceAsync<Usuario>();

            var usuario = usuarios.FirstOrDefault()?.Object;
            return usuario;
        }




    }
}
