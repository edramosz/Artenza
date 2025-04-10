using Core.Interfaces;
using Core.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FuncionarioController : ControllerBase
    {
        private readonly IFuncionarioService _funcionarioService;

        public FuncionarioController(IFuncionarioService funcionarioService)
        {
            _funcionarioService = funcionarioService;
        }

        /// <summary>
        /// Endpoint para listar todos os funcionários.
        /// </summary>
        /// <returns></returns>
        ///
        [HttpGet]
        public async Task<ActionResult<List<Funcionario>>> GetFuncionarios()
        {
            return await _funcionarioService.GetFuncionariosAsync();
        }

        /// <summary>
        /// Endpoint para listar algum funcionário pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        ///
        [HttpGet("{id}")]
        public async Task<ActionResult<Funcionario>> GetFuncionario(string id)
        {
            var funcionario = await _funcionarioService.GetFuncionarioAsync(id);
            if (funcionario == null)
                return NotFound();

            return funcionario;
        }

        /// <summary>
        /// Endpoint para cadastrar um funcionário.
        /// </summary>
        /// <param name="funcionario"></param>
        ///
        [HttpPost]
        public async Task<ActionResult> CreateFuncionario(Funcionario funcionario)
        {
            await _funcionarioService.AddFuncionarioAsync(funcionario);
            return CreatedAtAction(nameof(GetFuncionario), new { id = funcionario.Id }, funcionario);
        }

        /// <summary>
        /// Endpoint para editar algum funcionário pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="funcionario"></param>
        ///
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateFuncionario(string id, Funcionario funcionario)
        {
            var existingFuncionario = await _funcionarioService.GetFuncionarioAsync(id);
            if (existingFuncionario == null)
                return NotFound();

            await _funcionarioService.UpdateFuncionarioAsync(id, funcionario);
            return NoContent();
        }

        /// <summary>
        /// Endpoint para deletar algum funcionário pelo id.
        /// </summary>
        /// <param name="id"></param>
        ///
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteFuncionario(string id)
        {
            var existingFuncionario = await _funcionarioService.GetFuncionarioAsync(id);
            if (existingFuncionario == null)
                return NotFound();

            await _funcionarioService.DeleteFuncionarioAsync(id);
            return NoContent();
        }
    }
}
