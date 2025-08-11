using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Models;

namespace Core.Interfaces
{
    public interface ITransacaoService
    {
        Task<List<Transacao>> GetTransacaosAsync();
        Task<Transacao> GetTransacaoAsync(string id);
        Task AddTransacaoAsync(Transacao transacao);
        Task UpdateTransacaoAsync(string id, Transacao transacao);
        Task DeleteTransacaoAsync(string id);
    }
}
