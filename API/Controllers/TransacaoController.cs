using API.Services;
using Core.Interfaces;
using Core.Models;
using Core.Models.DTO_s.Create;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TransacaoController : ControllerBase
    {
        private readonly ITransacaoService _transacaoService;

        public TransacaoController(ITransacaoService transacaoService)
        {
            _transacaoService = transacaoService;
        }

        /// <summary>
        /// Endpoint para listar todas as transações.
        /// </summary>
        /// <returns></returns>
        /// 
        [HttpGet]
        public async Task<ActionResult<List<Transacao>>> GetTransacaos()
        {
            return await _transacaoService.GetTransacaosAsync();
        }

        /// <summary>
        /// Endpoint para listar alguma transação pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// 
        [HttpGet("{id}")]
        public async Task<ActionResult<Transacao>> GetTransacao(string id)
        {
            var transacao = await _transacaoService.GetTransacaoAsync(id);
            if (transacao == null)
                return NotFound();

            return transacao;
        }

        /// <summary>
        /// Endpoint para adicionar uma transação.
        /// </summary>
        /// <param name="transacao"></param>
        /// 
        [HttpPost]
        public async Task<ActionResult> CreateTransacao(CreateTransacao transacaoDto)
        {
            var transacaoCriado = await _transacaoService.AddTransacaoAsync(transacaoDto);
            return CreatedAtAction(nameof(GetTransacao), new { id = transacaoCriado.Id }, transacaoCriado);
        }

        /// <summary>
        /// Endpoint para editar alguma transação pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="transacao"></param>
        /// 
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTransacao(string id, Transacao transacao)
        {
            var existingTransacao = await _transacaoService.GetTransacaoAsync(id);
            if (existingTransacao == null)
                return NotFound();

            await _transacaoService.UpdateTransacaoAsync(id, transacao);
            return NoContent();
        }

        /// <summary>
        /// Endpoint para deletar alguma transação pelo id.
        /// </summary>
        /// <param name="id"></param>
        ///
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTransacao(string id)
        {
            var existingTransacao = await _transacaoService.GetTransacaoAsync(id);
            if (existingTransacao == null)
                return NotFound();

            await _transacaoService.DeleteTransacaoAsync(id);
            return NoContent();
        }
    }
}
