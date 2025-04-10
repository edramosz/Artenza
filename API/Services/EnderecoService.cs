using Core.Interfaces;
using Core.Models;
using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Identity;

namespace API.Services
{
    public class EnderecoService : IEnderecoService
    {
        private readonly FirebaseClient _firebaseClient;

        public EnderecoService(IConfiguration configuration)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
        }

        // Obter todos os Enderecos
        public async Task<List<Endereco>> GetEnderecosAsync()
        {
            var enderecos = await _firebaseClient
                .Child("enderecos")
                .OnceAsync<Endereco>();

            return enderecos.Select(item => item.Object).ToList();
        }

        // Obter um Endereco pelo ID
        public async Task<Endereco> GetEnderecoAsync(string id)
        {
            var endereco = (await _firebaseClient
                .Child("enderecos")
                .OnceAsync<Endereco>())
                .FirstOrDefault(p => p.Object.Id.ToString() == id)?.Object;//metodo LINQ

            return endereco;
        }

        // Adicionar um novo Endereco
        public async Task AddEnderecoAsync(Endereco endereco)
        {
            var response = await _firebaseClient
                .Child("enderecos")
                .PostAsync(endereco);

            endereco.Id = response.Key;

            await _firebaseClient
                .Child("enderecos")
                .Child(endereco.Id)
                .PutAsync(endereco);
        }

        // Atualizar um Endereco pelo ID
        public async Task UpdateEnderecoAsync(string id, Endereco endereco)
        {
            var enderecoExistente = await GetEnderecoAsync(id);
            if (enderecoExistente != null)
            {
                await _firebaseClient
                    .Child("enderecos")
                    .Child(id)
                    .PutAsync(endereco);
            }
        }

        // Deletar um Endereco pelo ID
        public async Task DeleteEnderecoAsync(string id)
        {
            await _firebaseClient
                .Child("enderecos")
                .Child(id)
                .DeleteAsync();
        }
    }
}
