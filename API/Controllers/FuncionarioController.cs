using API.Interfaces;
using API.Models;
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

        [HttpGet]
        public async Task<ActionResult<List<Funcionario>>> GetFuncionarios()
        {
            return await _funcionarioService.GetFuncionariosAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Funcionario>> GetFuncionario(string id)
        {
            var funcionario = await _funcionarioService.GetFuncionarioAsync(id);
            if (funcionario == null)
                return NotFound();

            return funcionario;
        }

        [HttpPost]
        public async Task<ActionResult> CreateFuncionario(Funcionario funcionario)
        {
            await _funcionarioService.AddFuncionarioAsync(funcionario);
            return CreatedAtAction(nameof(GetFuncionario), new { id = funcionario.Id }, funcionario);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateFuncionario(string id, Funcionario funcionario)
        {
            var existingFuncionario = await _funcionarioService.GetFuncionarioAsync(id);
            if (existingFuncionario == null)
                return NotFound();

            await _funcionarioService.UpdateFuncionarioAsync(id, funcionario);
            return NoContent();
        }

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
