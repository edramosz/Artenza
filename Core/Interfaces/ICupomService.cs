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
    public interface ICupomService
    {
        Task<List<Cupom>> GetCupomsAsync();
        Task<Cupom> GetCupomPorId(string id);
        Task<Cupom> GetCupomPorCodigo(string cod);
        Task<Cupom> AddCupomAsync(CreateCupom CupomDto);
        Task UpdateCupomAsync(string id, UpdateCupom Cupom);
        Task DeleteCupomAsync(string id);
    }
}
