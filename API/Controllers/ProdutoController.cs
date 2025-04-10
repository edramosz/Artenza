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

        /// <summary>
        /// Endpoint para listar todos os produtos.
        /// </summary>
        /// <returns></returns>
        /// 
        [HttpGet]
        public async Task<ActionResult<List<Produto>>> GetProdutos()
        {
            return await _produtoService.GetProdutosAsync();
        }

        /// <summary>
        /// Endpoint para listar algum produto pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// 
        [HttpGet("{id}")]
        public async Task<ActionResult<Produto>> GetProduto(string id)
        {
            var produto = await _produtoService.GetProdutoAsync(id);
            if (produto == null)
                return NotFound();

            return produto;
        }

        /// <summary>
        /// Endpoint para adicionar produtos.
        /// </summary>
        /// <param name="produto"></param>
        /// 
        [HttpPost]
        public async Task<ActionResult> CreateProduto(Produto produto)
        {
            await _produtoService.AddProdutoAsync(produto);
            return CreatedAtAction(nameof(GetProduto), new { id = produto.Id }, produto);
        }

        /// <summary>
        /// Endpoint para editar algum produto pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="produto"></param>
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduto(string id, Produto produto)
        {
            var existingProduto = await _produtoService.GetProdutoAsync(id);
            if (existingProduto == null)
                return NotFound();

            await _produtoService.UpdateProdutoAsync(id, produto);
            return NoContent();
        }


        /// <summary>
        /// Endpoint para deletar algum produto pelo id.
        /// </summary>
        /// <param name="id"></param>
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