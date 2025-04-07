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

        [HttpGet]
        public async Task<ActionResult<List<Venda>>> GetVendas()
        {
            return await _vendaService.GetVendasAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Venda>> GetVenda(string id)
        {
            var venda = await _vendaService.GetVendaAsync(id);
            if (venda == null)
                return NotFound();

            return venda;
        }

        [HttpPost]
        public async Task<ActionResult> CreateVenda(Venda venda)
        {
            await _vendaService.AddVendaAsync(venda);
            return CreatedAtAction(nameof(GetVenda), new { id = venda.Id }, venda);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateVenda(string id, Venda venda)
        {
            var existingVenda = await _vendaService.GetVendaAsync(id);
            if (existingVenda == null)
                return NotFound();

            await _vendaService.UpdateVendaAsync(id, venda);
            return NoContent();
        }

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
