using Core.Interfaces;
using Core.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        // Listar todos os endereços
        [HttpGet]
        public async Task<ActionResult<List<Endereco>>> GetEnderecos()
        {
            var enderecos = await _enderecoService.GetEnderecosAsync();
            return Ok(enderecos);
        }

        // Buscar endereço por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Endereco>> GetEnderecoPorId(string id)
        {
            var endereco = await _enderecoService.GetEnderecoPorIdAsync(id);
            if (endereco == null)
                return NotFound();
            return Ok(endereco);
        }

        // Buscar endereços por usuário
        [HttpGet("por-usuario/{usuarioId}")]
        public async Task<ActionResult<List<Endereco>>> GetEnderecosPorUsuario(string usuarioId)
        {
            var enderecos = await _enderecoService.GetEnderecosPorUsuarioAsync(usuarioId);
            if (enderecos == null || enderecos.Count == 0)
                return NotFound();
            return Ok(enderecos);
        }

        // Criar endereço
        [HttpPost]
        public async Task<ActionResult> CreateEndereco([FromBody] CreateEndereco enderecoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var enderecoCriado = await _enderecoService.AddEnderecoAsync(enderecoDto);

            return CreatedAtAction(nameof(GetEnderecoPorId), new { id = enderecoCriado.Id }, enderecoCriado);
        }

        // Atualizar endereço
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateEndereco(string id, UpdateEndereco endereco)
        {
            var existingEndereco = await _enderecoService.GetEnderecoPorIdAsync(id);
            if (existingEndereco == null)
                return NotFound();

            await _enderecoService.UpdateEnderecoAsync(id, endereco);
            return NoContent();
        }

        // Deletar endereço
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEndereco(string id)
        {
            var existingEndereco = await _enderecoService.GetEnderecoPorIdAsync(id);
            if (existingEndereco == null)
                return NotFound();

            await _enderecoService.DeleteEnderecoAsync(id);
            return NoContent();
        }
    }
}
