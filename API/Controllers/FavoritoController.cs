using Core.Interfaces;
using Core.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FavoritoController : ControllerBase
    {
        private readonly IFavoritoService _favoritoService;

        public FavoritoController(IFavoritoService favoritoService)
        {
            _favoritoService = favoritoService;
        }

        /// <summary>
        /// Endpoint para listar todos os favoritos.
        /// </summary>
        /// <returns></returns>
        ///
        [HttpGet]
        public async Task<ActionResult<List<Favorito>>> GetFavoritos()
        {
            return await _favoritoService.GetFavoritosAsync();
        }

        /// <summary>
        /// Endpoint para listar algum favorito pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        ///
        [HttpGet("{id}")]
        public async Task<ActionResult<Favorito>> GetFavorito(string id)
        {
            var favorito = await _favoritoService.GetFavoritoAsync(id);
            if (favorito == null)
                return NotFound();

            return favorito;
        }

        /// <summary>
        /// Endpoint para adicionar um favorito.
        /// </summary>
        /// <param name="favoritoDto"></param>
        ///
        [HttpPost]
        public async Task<ActionResult> CreateFavorito([FromBody] CreateFavorito favoritoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var favoritoCriado = await _favoritoService.AddFavoritoAsync(favoritoDto);

            return CreatedAtAction(nameof(GetFavorito), new { id = favoritoCriado.Id }, favoritoCriado);
        }



        /// <summary>
        /// Endpoint para editar algum favorito pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="favorito"></param>
        ///
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateFavorito(string id, UpdateFavorito favorito)
        {
            var existingFavorito = await _favoritoService.GetFavoritoAsync(id);
            if (existingFavorito == null)
                return NotFound();

            await _favoritoService.UpdateFavoritoAsync(id, favorito);
            return NoContent();
        }

        /// <summary>
        /// Endpoint para deletar algum favorito pelo id.
        /// </summary>
        /// <param name="id"></param>
        ///
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteFavorito(string id)
        {
            var existingFavorito = await _favoritoService.GetFavoritoAsync(id);
            if (existingFavorito == null)
                return NotFound();

            await _favoritoService.DeleteFavoritoAsync(id);
            return NoContent();
        }
    }
}
