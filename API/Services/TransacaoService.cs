using AutoMapper;
using Core.Interfaces;
using Core.Models;
using Core.Models.DTO_s.Create;
using Firebase.Database;
using Firebase.Database.Query;

namespace API.Services
{
    public class TransacaoService : ITransacaoService
    {
        private readonly FirebaseClient _firebaseClient;
        private readonly IMapper _mapper;

        public TransacaoService(IConfiguration configuration, IMapper mapper)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
            _mapper = mapper;
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
        public async Task<Transacao> AddTransacaoAsync(CreateTransacao transacaoDto)
        {
            var transacao = _mapper.Map<Transacao>(transacaoDto);

            // Primeiro cria o documento no Firebase
            var response = await _firebaseClient
                .Child("transacaos")
                .PostAsync(transacao);

            // Agora que o Firebase gerou a chave, seta o Id no objeto
            transacao.Id = response.Key;

            // Atualiza o registro no Firebase já com o Id
            await _firebaseClient
                .Child("transacaos")
                .Child(transacao.Id)
                .PutAsync(transacao);

            // Adicionar o ID do favorito ao usuario através de algum modo
            return transacao;
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
