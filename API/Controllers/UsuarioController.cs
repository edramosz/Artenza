using Core.Interfaces;
using Core.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Core.Models.DTO_s.Create;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuarioController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        /// <summary>
        /// Endpoint para listar todos os usuários.
        /// </summary>
        /// <returns></returns>
        /// 
        [HttpGet]
        public async Task<ActionResult<List<Usuario>>> GetUsuarios()
        {
            try
            {
                // Chama o serviço para buscar todos os usuários
                var usuarios = await _usuarioService.GetUsuariosAsync();

                if (usuarios == null || !usuarios.Any())
                    return NotFound("Nenhum usuário encontrado.");

                return Ok(usuarios); // Retorna a lista de usuários com status 200 OK
            }
            catch (Exception ex)
            {
                // Caso algum erro aconteça ao tentar buscar os usuários, retorna erro
                return StatusCode(500, $"Erro ao buscar usuários: {ex.Message}");
            }
        }

        /// <summary>
        /// Endpoint para listar algum usuário pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// 
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(string id)
        {
            var usuario = await _usuarioService.GetUsuarioAsync(id);
            if (usuario == null)
                return NotFound();

            return usuario;
        }

        // Endpoint para listar um usuário pelo e-mail
        [HttpGet("por-email/{email}")]
        public async Task<ActionResult<Usuario>> GetUsuarioPorEmail(string email)
        {
            var usuario = await _usuarioService.GetUsuarioByEmailAsync(email);

            if (usuario == null)
                return NotFound();

            return Ok(usuario);  // Retorna o usuário encontrado
        }

        /// <summary>
        /// Endpoint para adicionar usuário.
        /// </summary>
        /// <param name="usuarioDto"></param>
        /// 
        [HttpPost]
        public async Task<ActionResult> CreateUsuario([FromBody] CreateUsuario usuarioDto)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var usuarioCriado = await _usuarioService.AddUsuarioAsync(usuarioDto);
            return CreatedAtAction(nameof(GetUsuario), new { id = usuarioCriado.Id }, usuarioCriado);
        }

        /// <summary>
        /// Endpoint para editar algum usuário pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="usuario"></param>
        /// 
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUsuario(string id, Usuario usuario)
        {
            var existingUsuario = await _usuarioService.GetUsuarioAsync(id);
            if (existingUsuario == null)
                return NotFound();

            await _usuarioService.UpdateUsuarioAsync(id, usuario);
            return NoContent();
        }

        /// <summary>
        /// Endpoint para deletar algum usuário pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// 
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUsuario(string id)
        {
            var existingUsuario = await _usuarioService.GetUsuarioAsync(id);
            if (existingUsuario == null)
                return NotFound();

            await _usuarioService.DeleteUsuarioAsync(id);
            return NoContent();
        }
    }
}
