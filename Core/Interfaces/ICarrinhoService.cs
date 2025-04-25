using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;

namespace Core.Interfaces
{
    public interface ICarrinhoService
    {
        Task<List<Carrinho>> GetCarrinhosAsync();
        Task<Carrinho> GetCarrinhoAsync(string id);
        Task<Carrinho> AddCarrinhoAsync(CreateCarrinho carrinho);
        Task UpdateCarrinhoAsync(string id, UpdateCarrinho carrinho);
        Task DeleteCarrinhoAsync(string id);
    }
}
