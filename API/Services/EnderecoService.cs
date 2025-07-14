using AutoMapper;
using Core.Interfaces;
using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

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

            return enderecos.Select(item =>
            {
                var obj = item.Object;
                obj.Id = item.Key;
                return obj;
            }).ToList();
        }

        // Obter enderecos por usuarioId - usando filtro no Firebase (requer index no db)
        public async Task<List<Endereco>> GetEnderecosPorUsuarioAsync(string usuarioId)
        {
            var enderecos = await _firebaseClient
                .Child("enderecos")
                .OrderBy("UsuarioId")
                .EqualTo(usuarioId)
                .OnceAsync<Endereco>();

            return enderecos
                .Where(e => e.Object != null)
                .Select(e =>
                {
                    var obj = e.Object;
                    obj.Id = e.Key;
                    return obj;
                })
                .ToList();
        }

        // Obter um Endereco pelo ID
        public async Task<Endereco> GetEnderecoPorIdAsync(string id)
        {
            var enderecos = await _firebaseClient
                .Child("enderecos")
                .OnceAsync<Endereco>();

            var enderecoItem = enderecos.FirstOrDefault(e => e.Key == id);
            if (enderecoItem == null)
                return null;

            var endereco = enderecoItem.Object;
            endereco.Id = enderecoItem.Key;
            return endereco;
        }

        // Adicionar um novo Endereco
        public async Task<Endereco> AddEnderecoAsync(CreateEndereco enderecoDto)
        {
            var endereco = _mapper.Map<Endereco>(enderecoDto);

            var response = await _firebaseClient
                .Child("enderecos")
                .PostAsync(endereco);

            endereco.Id = response.Key;

            await _firebaseClient
                .Child("enderecos")
                .Child(endereco.Id)
                .PutAsync(endereco);

            return endereco;
        }

        // Atualizar um Endereco pelo ID
        public async Task UpdateEnderecoAsync(string id, UpdateEndereco enderecoDto)
        {
            var enderecoExistente = await GetEnderecoPorIdAsync(id);
            if (enderecoExistente != null)
            {
                _mapper.Map(enderecoDto, enderecoExistente);
                enderecoExistente.Id = id; // garantir id
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
