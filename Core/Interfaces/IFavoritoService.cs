using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using Core.Models;

namespace Core.Interfaces
{
    public interface IFavoritoService
    {
        Task<List<Favorito>> GetFavoritosAsync();
        Task<Favorito> GetFavoritoAsync(string id);
        Task<Favorito> AddFavoritoAsync(CreateFavorito favoritoDto);
        Task UpdateFavoritoAsync(string id, UpdateFavorito favorito);
        Task DeleteFavoritoAsync(string id);
    }
}
