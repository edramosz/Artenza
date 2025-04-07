using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Models;

namespace Core.Interfaces
{
    public interface ICarrinhoService
    {
        Task<List<Carrinho>> GetCarrinhosAsync();
        Task<Carrinho> GetCarrinhoAsync(string id);
        Task AddCarrinhoAsync(Carrinho carrinho);
        Task UpdateCarrinhoAsync(string id, Carrinho carrinho);
        Task DeleteCarrinhoAsync(string id);
    }
}
