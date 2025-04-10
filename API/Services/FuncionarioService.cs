using Core.Interfaces;
using Core.Models;
using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Identity;

namespace API.Services
{
    public class FuncionarioService : IFuncionarioService
    {
        private readonly FirebaseClient _firebaseClient;

        public FuncionarioService(IConfiguration configuration)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
        }

        // Obter todos os Funcionarios
        public async Task<List<Funcionario>> GetFuncionariosAsync()
        {
            var funcionarios = await _firebaseClient
                .Child("funcionarios")
                .OnceAsync<Funcionario>();

            return funcionarios.Select(item => item.Object).ToList();
        }

        // Obter um Funcionario pelo ID
        public async Task<Funcionario> GetFuncionarioAsync(string id)
        {
            var funcionario = (await _firebaseClient
                .Child("funcionarios")
                .OnceAsync<Funcionario>())
                .FirstOrDefault(p => p.Object.Id.ToString() == id)?.Object;//metodo LINQ

            return funcionario;
        }

        // Adicionar um novo Funcionario
        public async Task AddFuncionarioAsync(Funcionario funcionario)
        {
            var response = await _firebaseClient
                .Child("funcionarios")
                .PostAsync(funcionario);

            funcionario.Id = response.Key;

            await _firebaseClient
                .Child("funcionarios")
                .Child(funcionario.Id)
                .PutAsync(funcionario);
        }

        // Atualizar um Funcionario pelo ID
        public async Task UpdateFuncionarioAsync(string id, Funcionario funcionario)
        {
            var funcionarioExistente = await GetFuncionarioAsync(id);
            if (funcionarioExistente != null)
            {
                await _firebaseClient
                    .Child("funcionarios")
                    .Child(id)
                    .PutAsync(funcionario);
            }
        }

        // Deletar um Funcionario pelo ID
        public async Task DeleteFuncionarioAsync(string id)
        {
            await _firebaseClient
                .Child("funcionarios")
                .Child(id)
                .DeleteAsync();
        }
    }
}
