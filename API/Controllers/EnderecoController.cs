using Core.Interfaces;
using Core.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EnderecoController : ControllerBase
    {
        private readonly IEnderecoService _enderecoService;

        public EnderecoController(IEnderecoService enderecoService)
        {
            _enderecoService = enderecoService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Endereco>>> GetEnderecos()
        {
            return await _enderecoService.GetEnderecosAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Endereco>> GetEndereco(string id)
        {
            var endereco = await _enderecoService.GetEnderecoAsync(id);
            if (endereco == null)
                return NotFound();

            return endereco;
        }

        [HttpPost]
        public async Task<ActionResult> CreateEndereco(Endereco endereco)
        {
            await _enderecoService.AddEnderecoAsync(endereco);
            return CreatedAtAction(nameof(GetEndereco), new { id = endereco.Id }, endereco);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateEndereco(string id, Endereco endereco)
        {
            var existingEndereco = await _enderecoService.GetEnderecoAsync(id);
            if (existingEndereco == null)
                return NotFound();

            await _enderecoService.UpdateEnderecoAsync(id, endereco);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEndereco(string id)
        {
            var existingEndereco = await _enderecoService.GetEnderecoAsync(id);
            if (existingEndereco == null)
                return NotFound();

            await _enderecoService.DeleteEnderecoAsync(id);
            return NoContent();
        }
    }
}
