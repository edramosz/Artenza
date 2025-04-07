using Core.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProdutoController : ControllerBase
    {
        private readonly IProdutoService _produtoService;

        public ProdutoController(IProdutoService produtoService)
        {
            _produtoService = produtoService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Produto>>> GetProdutos()
        {
            return await _produtoService.GetProdutosAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Produto>> GetProduto(string id)
        {
            var produto = await _produtoService.GetProdutoAsync(id);
            if (produto == null)
                return NotFound();

            return produto;
        }

        [HttpPost]
        public async Task<ActionResult> CreateProduto(Produto produto)
        {
            await _produtoService.AddProdutoAsync(produto);
            return CreatedAtAction(nameof(GetProduto), new { id = produto.Id }, produto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduto(string id, Produto produto)
        {
            var existingProduto = await _produtoService.GetProdutoAsync(id);
            if (existingProduto == null)
                return NotFound();

            await _produtoService.UpdateProdutoAsync(id, produto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduto(string id)
        {
            var existingProduto = await _produtoService.GetProdutoAsync(id);
            if (existingProduto == null)
                return NotFound();

            await _produtoService.DeleteProdutoAsync(id);
            return NoContent();
        }
    }
}