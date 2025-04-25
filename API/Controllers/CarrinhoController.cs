using Core.Interfaces;
using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CarrinhoController : ControllerBase
    {
        private readonly ICarrinhoService _carrinhoService;

        public CarrinhoController(ICarrinhoService carrinhoService)
        {
            _carrinhoService = carrinhoService;
        }

        /// <summary>
        /// Endpoint para listar todos os carrinhos.
        /// </summary>
        /// <returns></returns>
        ///
        [HttpGet]
        public async Task<ActionResult<List<Carrinho>>> GetCarrinhos()
        {
            return await _carrinhoService.GetCarrinhosAsync();
        }

        /// <summary>
        /// Endpoint para listar carrinho pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        ///
        [HttpGet("{id}")]
        public async Task<ActionResult<Carrinho>> GetCarrinho(string id)
        {
            var carrinho = await _carrinhoService.GetCarrinhoAsync(id);
            if (carrinho == null)
                return NotFound();

            return carrinho;
        }

        /// <summary>
        /// Endpoint para adicionar um carrinho.
        /// </summary>
        /// <param name="carrinhoDto"></param>

        ///
        [HttpPost]
        public async Task<ActionResult> CreateCarrinho(CreateCarrinho carrinhoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var carrinho = await _carrinhoService.AddCarrinhoAsync(carrinhoDto);
            return CreatedAtAction(nameof(GetCarrinho), new { id = carrinho.Id }, carrinho);
        }

        /// <summary>
        /// Endpoint para editar algum carrinho pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="carrinho"></param>
        ///
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCarrinho(string id, UpdateCarrinho carrinho)
        {
            var existingCarrinho = await _carrinhoService.GetCarrinhoAsync(id);
            if (existingCarrinho == null)
                return NotFound();

            await _carrinhoService.UpdateCarrinhoAsync(id, carrinho);
            return NoContent();
        }

        /// <summary>
        /// Endpoint para deletar algum carrinho pelo id.
        /// </summary>
        /// <param name="id"></param>
        ///
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCarrinho(string id)
        {
            var existingCarrinho = await _carrinhoService.GetCarrinhoAsync(id);
            if (existingCarrinho == null)
                return NotFound();

            await _carrinhoService.DeleteCarrinhoAsync(id);
            return NoContent();
        }
    }
}
