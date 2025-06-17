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
    public class EnderecoService : IEnderecoService
    {
        private readonly FirebaseClient _firebaseClient;
        private readonly IMapper _mapper;

        public EnderecoService(IConfiguration configuration, IMapper mapper)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
            _mapper = mapper;
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
            var enderecos = await _firebaseClient
                .Child("enderecos")
                .OnceAsync<Endereco>();

            var endereco = enderecos
                .FirstOrDefault(p => p.Object != null && p.Object.Id == id)
                ?.Object;

            return endereco;
        }
        

        // Adicionar um novo Endereco
        public async Task<Endereco> AddEnderecoAsync(CreateEndereco enderecoDto)
        {
            var endereco = _mapper.Map<Endereco>(enderecoDto);

            // Primeiro cria o documento no Firebase
            var response = await _firebaseClient
                .Child("enderecos")
                .PostAsync(endereco);

            // Agora que o Firebase gerou a chave, seta o Id no objeto
            endereco.Id = response.Key;

            // Atualiza o registro no Firebase já com o Id
            await _firebaseClient
                .Child("enderecos")
                .Child(endereco.Id)
                .PutAsync(endereco);

            // Adicionar o ID do endereco ao usuario através de algum modo
            return endereco;
        }

        // Atualizar um Endereco pelo ID
        public async Task UpdateEnderecoAsync(string id, UpdateEndereco enderecoDto)
        {
            var enderecoExistente = await GetEnderecoAsync(id);
            if (enderecoExistente != null)
            {
                _mapper.Map(enderecoDto, enderecoExistente);
                await _firebaseClient
                    .Child("enderecos")
                    .Child(id)
                    .PutAsync(enderecoExistente);
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
