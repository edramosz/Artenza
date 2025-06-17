using AutoMapper;
using Core.Interfaces;
using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Identity;

namespace API.Services
{
    public class CupomService : ICupomService
    {
        private readonly FirebaseClient _firebaseClient;
        private readonly IMapper _mapper;

        public CupomService(IConfiguration configuration, IMapper mapper)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
            _mapper = mapper;
        }

        // Obter todos os Cupoms
        public async Task<List<Cupom>> GetCupomsAsync()
        {
            var cupons = await _firebaseClient
                .Child("cupons")
                .OnceAsync<Cupom>();

            return cupons.Select(item => item.Object).ToList();
        }

        // Obter um Cupom pelo ID
        public async Task<Cupom> GetCupomAsync(string id)
        {
            var cupom = (await _firebaseClient
                .Child("cupons")
                .OnceAsync<Cupom>())
                .FirstOrDefault(p => p.Object.Id.ToString() == id)?.Object;//metodo LINQ

            return cupom;
        }

        // Adicionar um novo Cupom
        public async Task<Cupom> AddCupomAsync(CreateCupom cupomDto)
        {
            var cupom = _mapper.Map<Cupom>(cupomDto);

            // Primeiro cria o documento no Firebase
            var response = await _firebaseClient
                .Child("cupons")
                .PostAsync(cupom);

            // Agora que o Firebase gerou a chave, seta o Id no objeto
            cupom.Id = response.Key;

            // Atualiza o registro no Firebase já com o Id
            await _firebaseClient
                .Child("cupons")
                .Child(cupom.Id)
                .PutAsync(cupom);

            // Adicionar o ID do cupom ao usuario através de algum modo
            return cupom;
        }

        // Atualizar um Cupom pelo ID
        public async Task UpdateCupomAsync(string id, UpdateCupom cupomDto)
        {
            var cupomExistente = await GetCupomAsync(id);
            if (cupomExistente != null)
            {
                _mapper.Map(cupomDto, cupomExistente);
                await _firebaseClient
                    .Child("cupons")
                    .Child(id)
                    .PutAsync(cupomExistente);
            }
        }

        // Deletar um Cupom pelo ID
        public async Task DeleteCupomAsync(string id)
        {
            await _firebaseClient
                .Child("cupons")
                .Child(id)
                .DeleteAsync();
        }
    }
}
