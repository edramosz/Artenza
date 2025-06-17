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
    public class CupomController : ControllerBase
    {
        private readonly ICupomService _cupomService;

        public CupomController(ICupomService cupomService)
        {
            _cupomService = cupomService;
        }

        /// <summary>
        /// Endpoint para listar todos os cupoms.
        /// </summary>
        /// <returns></returns>
        ///
        [HttpGet]
        public async Task<ActionResult<List<Cupom>>> GetCupoms()
        {
            return await _cupomService.GetCupomsAsync();
        }

        /// <summary>
        /// Endpoint para listar algum cupom pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        ///
        [HttpGet("{id}")]
        public async Task<ActionResult<Cupom>> GetCupom(string id)
        {
            var cupom = await _cupomService.GetCupomAsync(id);
            if (cupom == null)
                return NotFound();

            return cupom;
        }

        /// <summary>
        /// Endpoint para adicionar um cupom.
        /// </summary>
        /// <param name="cupomDto"></param>
        ///
        [HttpPost]
        public async Task<ActionResult> CreateCupom([FromBody] CreateCupom cupomDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cupomCriado = await _cupomService.AddCupomAsync(cupomDto);

            return CreatedAtAction(nameof(GetCupom), new { id = cupomCriado.Id }, cupomCriado);
        }



        /// <summary>
        /// Endpoint para editar algum cupom pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="cupom"></param>
        ///
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCupom(string id, UpdateCupom cupom)
        {
            var existingCupom = await _cupomService.GetCupomAsync(id);
            if (existingCupom == null)
                return NotFound();

            await _cupomService.UpdateCupomAsync(id, cupom);
            return NoContent();
        }

        /// <summary>
        /// Endpoint para deletar algum cupom pelo id.
        /// </summary>
        /// <param name="id"></param>
        ///
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCupom(string id)
        {
            var existingCupom = await _cupomService.GetCupomAsync(id);
            if (existingCupom == null)
                return NotFound();

            await _cupomService.DeleteCupomAsync(id);
            return NoContent();
        }
    }
}
