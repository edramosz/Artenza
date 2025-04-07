using Core.Interfaces;
using Core.Models;
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

        [HttpGet]
        public async Task<ActionResult<List<Transacao>>> GetTransacaos()
        {
            return await _transacaoService.GetTransacaosAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Transacao>> GetTransacao(string id)
        {
            var transacao = await _transacaoService.GetTransacaoAsync(id);
            if (transacao == null)
                return NotFound();

            return transacao;
        }

        [HttpPost]
        public async Task<ActionResult> CreateTransacao(Transacao transacao)
        {
            await _transacaoService.AddTransacaoAsync(transacao);
            return CreatedAtAction(nameof(GetTransacao), new { id = transacao.Id }, transacao);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTransacao(string id, Transacao transacao)
        {
            var existingTransacao = await _transacaoService.GetTransacaoAsync(id);
            if (existingTransacao == null)
                return NotFound();

            await _transacaoService.UpdateTransacaoAsync(id, transacao);
            return NoContent();
        }

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
