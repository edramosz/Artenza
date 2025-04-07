using Core.Interfaces;
using Core.Models;
using Firebase.Database;
using Firebase.Database.Query;

namespace API.Services
{
    public class TransacaoService : ITransacaoService
    {
        private readonly FirebaseClient _firebaseClient;

        public TransacaoService(IConfiguration configuration)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
        }

        // Obter todos os transacaos
        public async Task<List<Transacao>> GetTransacaosAsync()
        {
            var transacaos = await _firebaseClient
                .Child("transacoes")
                .OnceAsync<Transacao>();

            return transacaos.Select(item => item.Object).ToList();
        }

        // Obter um transacao pelo ID
        public async Task<Transacao> GetTransacaoAsync(string id)
        {
            var transacao = (await _firebaseClient
                .Child("transacoes")
                .OnceAsync<Transacao>())
                .FirstOrDefault(p => p.Object.Id.ToString() == id)?.Object;//metodo LINQ

            return transacao;
        }

        // Adicionar um novo transacao
        public async Task AddTransacaoAsync(Transacao transacao)
        {
            var result = await _firebaseClient
            .Child("transacoes")
            .PostAsync(transacao);

            // Atualizar o ID do transacao com a chave gerada
            transacao.Id = result.Key;

            // Se quiser, você pode atualizar no Firebase também:
            await _firebaseClient
                .Child("transacoes")
                .Child(transacao.Id)
                .PutAsync(transacao);
        }

        // Atualizar um transacao pelo ID
        public async Task UpdateTransacaoAsync(string id, Transacao transacao)
        {
            var transacaoExistente = await GetTransacaoAsync(id);
            if (transacaoExistente != null)
            {
                await _firebaseClient
                    .Child("transacaos")
                    .Child(id)
                    .PutAsync(transacao);
            }
        }

        // Deletar um transacao pelo ID
        public async Task DeleteTransacaoAsync(string id)
        {
            await _firebaseClient
                .Child("transacaos")
                .Child(id)
                .DeleteAsync();
        }
    }
}
