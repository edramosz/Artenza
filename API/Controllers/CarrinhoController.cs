using Core.Interfaces;
using Core.Models;
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

        [HttpGet]
        public async Task<ActionResult<List<Carrinho>>> GetCarrinhos()
        {
            return await _carrinhoService.GetCarrinhosAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Carrinho>> GetCarrinho(string id)
        {
            var carrinho = await _carrinhoService.GetCarrinhoAsync(id);
            if (carrinho == null)
                return NotFound();

            return carrinho;
        }

        [HttpPost]
        public async Task<ActionResult> CreateCarrinho(Carrinho carrinho)
        {
            await _carrinhoService.AddCarrinhoAsync(carrinho);
            return CreatedAtAction(nameof(GetCarrinho), new { id = carrinho.Id }, carrinho);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCarrinho(string id, Carrinho carrinho)
        {
            var existingCarrinho = await _carrinhoService.GetCarrinhoAsync(id);
            if (existingCarrinho == null)
                return NotFound();

            await _carrinhoService.UpdateCarrinhoAsync(id, carrinho);
            return NoContent();
        }

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
