using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Models;
using Core.Models.DTO_s.Create;

namespace Core.Interfaces
{
    public interface IVendaService
    {
        Task<List<Venda>> GetVendasAsync();
        Task<Venda> GetVendaAsync(string id);
        Task<Venda> AddVendaAsync(CreateVenda venda);
        // Analisar se deverá ter update ou não   Task UpdateVendaAsync(string id, Venda venda);
        Task DeleteVendaAsync(string id);
    }
}
