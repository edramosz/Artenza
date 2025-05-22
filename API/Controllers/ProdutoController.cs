using Core.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;

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
        [HttpGet("mais-vendidos")]
        public async Task<ActionResult<List<Produto>>> GetMaisVendidos()
        {
            var produtos = await _produtoService.ObterProdutosMaisVendidos();
            return Ok(produtos);
        }


        /// <summary>
        /// Endpoint para adicionar produtos.
        /// </summary>
        /// <param name="produtoDto"></param>
        /// 

        [HttpPost]
        public async Task<ActionResult> CreateProduto([FromBody] CreateProduto produtoDto)
        {
            if (!ModelState.IsValid || produtoDto.UrlImagens == null || !produtoDto.UrlImagens.Any())
                return BadRequest("Pelo menos uma imagem é obrigatória.");

            var produtoCriado = await _produtoService.AddProdutoAsync(produtoDto);
            return CreatedAtAction(nameof(GetProduto), new { id = produtoCriado.Id }, produtoCriado);

        }



        /// <summary>
        /// Endpoint para editar algum produto pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="produto"></param>
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduto(string id, [FromBody] UpdateProduto produto)
        {
            var existingProduto = await _produtoService.GetProdutoAsync(id);
            if (existingProduto == null)
                return NotFound();

            // Atualiza os dados do produto no serviço
            await _produtoService.UpdateProdutoAsync(id, produto);

            return NoContent(); // Retorna 204 após atualização bem-sucedida
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