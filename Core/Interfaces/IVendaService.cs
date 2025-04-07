using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Models;

namespace Core.Interfaces
{
    public interface IVendaService
    {
        Task<List<Venda>> GetVendasAsync();
        Task<Venda> GetVendaAsync(string id);
        Task AddVendaAsync(Venda venda);
        Task UpdateVendaAsync(string id, Venda venda);
        Task DeleteVendaAsync(string id);
    }
}
