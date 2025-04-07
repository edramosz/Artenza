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

        [HttpGet]
        public async Task<ActionResult<List<Usuario>>> GetUsuarios()
        {
            return await _usuarioService.GetUsuariosAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(string id)
        {
            var usuario = await _usuarioService.GetUsuarioAsync(id);
            if (usuario == null)
                return NotFound();

            return usuario;
        }

        [HttpPost]
        public async Task<ActionResult> CreateUsuario(Usuario usuario)
        {
            await _usuarioService.AddUsuarioAsync(usuario);
            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUsuario(string id, Usuario usuario)
        {
            var existingUsuario = await _usuarioService.GetUsuarioAsync(id);
            if (existingUsuario == null)
                return NotFound();

            await _usuarioService.UpdateUsuarioAsync(id, usuario);
            return NoContent();
        }

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
