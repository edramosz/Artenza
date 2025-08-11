using Core.Interfaces;
using Core.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("contato")]
        public async Task<IActionResult> EnviarContato([FromBody] CreateContato dto)
        {
            await _emailService.EnviarContatoAsync(dto);
            return Ok(new { mensagem = "Contato enviado com sucesso!" });
        }

        [HttpPost("newsletter")]
        public async Task<IActionResult> EnviarNewsletter([FromBody] CreateNewsletter dto)
        {
            await _emailService.EnviarNewsletterAsync(dto);
            return Ok(new { mensagem = "Inscrição na newsletter realizada com sucesso!" });
        }

        [HttpPost("recuperar-senha")]
        public async Task<IActionResult> EnviarCodigoRecuperacao([FromBody] CreateCodigoVerificacao codVerDTO)
        {
            await _emailService.EnviarCodigoRecuperacaoAsync(codVerDTO);
            return Ok(new { mensagem = "Código de recuperação enviado com sucesso!" });
        }

        /// <summary>
        /// Endpoint para listar algum codigo.
        /// </summary>
        /// <param name="codigo"></param>
        /// <returns></returns>
        ///
        [HttpGet("codigo/{codigo}")]
        public async Task<ActionResult<CodigoVerificacao>> GetCodigoAsync(string codigo)
        {
            var Cod = await _emailService.GetCodigoAsync(codigo);
            if (Cod == null)
                return NotFound();

            return Cod;
        }
    }

}


