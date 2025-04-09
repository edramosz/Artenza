using Core.Interfaces;
using Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VendaController : ControllerBase
    {
        private readonly IVendaService _vendaService;

        public VendaController(IVendaService vendaService)
        {
            _vendaService = vendaService;
        }

        /// <summary>
        /// Endpoint para listar todas as vendas.
        /// </summary>
        /// <returns></returns>
        /// 
        [HttpGet]
        public async Task<ActionResult<List<Venda>>> GetVendas()
        {
            return await _vendaService.GetVendasAsync();
        }

        /// <summary>
        /// Endpoint para listar alguma venda pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// 
        [HttpGet("{id}")]
        public async Task<ActionResult<Venda>> GetVenda(string id)
        {
            var venda = await _vendaService.GetVendaAsync(id);
            if (venda == null)
                return NotFound();

            return venda;
        }

        /// <summary>
        /// Endpoint para criar venda.
        /// </summary>
        /// <param name="venda"></param>
        /// 
        [HttpPost]
        public async Task<ActionResult> CreateVenda(Venda venda)
        {
            await _vendaService.AddVendaAsync(venda);
            return CreatedAtAction(nameof(GetVenda), new { id = venda.Id }, venda);
        }

        /// <summary>
        /// Endpoint para editar alguma venda pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="venda"></param>
        /// <returns></returns>
        /// 
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateVenda(string id, Venda venda)
        {
            var existingVenda = await _vendaService.GetVendaAsync(id);
            if (existingVenda == null)
                return NotFound();

            await _vendaService.UpdateVendaAsync(id, venda);
            return NoContent();
        }

        /// <summary>
        /// Endpoint para deletar alguma venda pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// 
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteVenda(string id)
        {
            var existingVenda = await _vendaService.GetVendaAsync(id);
            if (existingVenda == null)
                return NotFound();

            await _vendaService.DeleteVendaAsync(id);
            return NoContent();
        }
    }
}
