using AutoMapper;
using Core.Interfaces;
using Core.Models;
using Core.Models.DTO_s.Create;
using Firebase.Database;
using Firebase.Database.Query;

namespace API.Services
{
    public class VendaService : IVendaService
    {
        private readonly FirebaseClient _firebaseClient;
        private readonly IMapper _mapper;

        public VendaService(IConfiguration configuration, IMapper mapper)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
            _mapper = mapper;
        }

        // Obter todos os vendas
        public async Task<List<Venda>> GetVendasAsync()
        {
            var vendas = await _firebaseClient
                .Child("vendas")
                .OnceAsync<Venda>();

            return vendas.Select(item => item.Object).ToList();
        }

        // Obter um venda pelo ID
        public async Task<Venda> GetVendaAsync(string id)
        {
            var venda = (await _firebaseClient
                .Child("vendas")
                .OnceAsync<Venda>())
                .FirstOrDefault(p => p.Object.Id.ToString() == id)?.Object;//metodo LINQ

            return venda;
        }

        // Adicionar um novo venda
        public async Task<Venda> AddVendaAsync(CreateVenda vendaDto)
        {
            var venda = _mapper.Map<Venda>(vendaDto);

            var result = await _firebaseClient
            .Child("vendas")
            .PostAsync(venda);

            // Atualizar o ID do venda com a chave gerada
            venda.Id = result.Key;

            // Se quiser, você pode atualizar no Firebase também:
            await _firebaseClient
                .Child("vendas")
                .Child(venda.Id)
                .PutAsync(venda);

            return venda;
        }

        // Atualizar um venda pelo ID
        //public async Task UpdateVendaAsync(string id, Venda venda)
        //{
        //    var vendaExistente = await GetVendaAsync(id);
        //    if (vendaExistente != null)
        //    {
        //        await _firebaseClient
        //            .Child("vendas")
        //            .Child(id)
        //            .PutAsync(venda);
        //    }
        //}

        // Deletar um venda pelo ID
        public async Task DeleteVendaAsync(string id)
        {
            await _firebaseClient
                .Child("vendas")
                .Child(id)
                .DeleteAsync();
        }
    }
}
