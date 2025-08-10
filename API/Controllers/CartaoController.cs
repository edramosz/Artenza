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
    public class CartaoController : ControllerBase
    {
        private readonly ICartaoService _cartaoService;

        public CartaoController(ICartaoService cartaoService)
        {
            _cartaoService = cartaoService;
        }

        /// <summary>
        /// Endpoint para listar todos os cartaos.
        /// </summary>
        /// <returns></returns>
        ///
        [HttpGet]
        public async Task<ActionResult<List<Cartao>>> GetCartoes()
        {
            return await _cartaoService.GetCartoesAsync();
        }

        /// <summary>
        /// Endpoint para listar algum cartao pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        ///
        [HttpGet("{id}")]
        public async Task<ActionResult<Cartao>> GetCartao(string id)
        {
            var cartao = await _cartaoService.GetCartaoAsync(id);
            if (cartao == null)
                return NotFound();

            return cartao;
        }

        /// <summary>
        /// Endpoint para listar algum cartao pelo id do usuario.
        /// </summary>
        /// <param name="idUsuario"></param>
        /// <returns></returns>
        ///
        [HttpGet("usuario/{idUsuario}")]
        public async Task<ActionResult<List<Cartao>>> GetCartaoPorIdUsuario(string idUsuario)
        {
            var cartao = await _cartaoService.GetCartaoPorIdUsuario(idUsuario);
            if (cartao == null)
                return NotFound();

            return cartao;
        }
        /// <summary>
        /// Endpoint para adicionar um cartao.
        /// </summary>
        /// <param name="cartaoDto"></param>
        ///
        [HttpPost]
        public async Task<ActionResult> CreateCartao([FromBody] CreateCartao cartaoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cartaoCriado = await _cartaoService.AddCartaoAsync(cartaoDto);

            return CreatedAtAction(nameof(GetCartao), new { id = cartaoCriado.Id }, cartaoCriado);
        }



        /// <summary>
        /// Endpoint para editar algum cartao pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="cartao"></param>
        ///
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCartao(string id, UpdateCartao cartao)
        {
            var existingCartao = await _cartaoService.GetCartaoAsync(id);
            if (existingCartao == null)
                return NotFound();

            await _cartaoService.UpdateCartaoAsync(id, cartao);
            return NoContent();
        }

        /// <summary>
        /// Endpoint para deletar algum cartao pelo id.
        /// </summary>
        /// <param name="id"></param>
        ///
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCartao(string id)
        {
            var existingCartao = await _cartaoService.GetCartaoAsync(id);
            if (existingCartao == null)
                return NotFound();

            await _cartaoService.DeleteCartaoAsync(id);
            return NoContent();
        }
    }
}
