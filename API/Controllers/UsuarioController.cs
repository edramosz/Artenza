using Core.Interfaces;
using Core.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;

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
            return await _usuarioService.GetUsuariosAsync();
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

        /// <summary>
        /// Endpoint para adicionar usuário.
        /// </summary>
        /// <param name="usuario"></param>
        /// 
        [HttpPost]
        public async Task<ActionResult> CreateUsuario(Usuario usuario)
        {
            await _usuarioService.AddUsuarioAsync(usuario);
            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
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
