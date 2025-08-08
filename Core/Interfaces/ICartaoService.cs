using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ICartaoService
    {
        Task<List<Cartao>> GetCartoesAsync();
        Task<Cartao> GetCartaoAsync(string id);
        Task<List<Cartao>> GetCartaoPorIdUsuario(string idUsuario);
        Task<Cartao> AddCartaoAsync(CreateCartao cartaoDto);
        Task UpdateCartaoAsync(string id, UpdateCartao cartao);
        Task DeleteCartaoAsync(string id);
    }
}
