using Core.Interfaces;
using Core.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Core.Models.DTO_s.Create;

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

        /// <summary>
        /// Endpoint para listar todos os endereços.
        /// </summary>
        /// <returns></returns>
        ///
        [HttpGet]
        public async Task<ActionResult<List<Endereco>>> GetEnderecos()
        {
            return await _enderecoService.GetEnderecosAsync();
        }

        /// <summary>
        /// Endpoint para listar algum endereço pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        ///
        [HttpGet("{id}")]
        public async Task<ActionResult<Endereco>> GetEndereco(string id)
        {
            var endereco = await _enderecoService.GetEnderecoAsync(id);
            if (endereco == null)
                return NotFound();

            return endereco;
        }

        /// <summary>
        /// Endpoint para adicionar um endereço.
        /// </summary>
        /// <param name="endereco"></param>
        ///
        [HttpPost]
        public async Task<ActionResult> CreateEndereco([FromBody] CreateEndereco dto)
        {
            var endereco = new Endereco
            {
                CEP = dto.CEP,
                Estado = dto.Estado,
                Cidade = dto.Cidade,
                Bairro = dto.Bairro,
                Rua = dto.Rua,
                Numero = dto.Numero,
                Complemento = dto.Complemento
            };

            await _enderecoService.AddEnderecoAsync(endereco);

            return CreatedAtAction(nameof(GetEndereco), new { id = endereco.Id }, endereco);
        }



        /// <summary>
        /// Endpoint para editar algum endereço pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="endereco"></param>
        ///
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateEndereco(string id, Endereco endereco)
        {
            var existingEndereco = await _enderecoService.GetEnderecoAsync(id);
            if (existingEndereco == null)
                return NotFound();

            await _enderecoService.UpdateEnderecoAsync(id, endereco);
            return NoContent();
        }

        /// <summary>
        /// Endpoint para deletar algum endereço pelo id.
        /// </summary>
        /// <param name="id"></param>
        ///
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
