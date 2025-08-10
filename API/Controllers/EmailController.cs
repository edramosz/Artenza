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
        public async Task<IActionResult> EnviarCodigoRecuperacao([FromBody] string email)
        {
            await _emailService.EnviarCodigoRecuperacaoAsync(email);
            return Ok(new { mensagem = "Código de recuperação enviado com sucesso!" });
        }
    }

}


