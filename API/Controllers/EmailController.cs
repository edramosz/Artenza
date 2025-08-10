using Core.Models.DTO_s.Create;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly EmailService _emailService;

    public EmailController(EmailService emailService)
    {
        _emailService = emailService;
    }

    // 1️⃣ Contato
    [HttpPost("contato")]
    public async Task<IActionResult> EnviarContato([FromBody] CreateContato contato)
    {
        var corpoEmail = $@"
            <h2>Nova mensagem de contato</h2>
            <p><b>Nome:</b> {contato.Nome}</p>
            <p><b>Email:</b> {contato.Email}</p>
            <p><b>Telefone:</b> {contato.Telefone}</p>
            <p><b>Serviço:</b> {contato.Servico}</p>
            <p><b>Mensagem:</b> {contato.Mensagem}</p>
        ";

        await _emailService.EnviarEmailAsync(
            "contato@artenza.com",
            $"[Contato Artenza] {contato.Servico}",
            corpoEmail
        );

        return Ok(new { message = "Mensagem enviada com sucesso!" });
    }

    // 2️⃣ Código de verificação para troca de senha
    [HttpPost("codigo-verificacao")]
    public async Task<IActionResult> EnviarCodigo([FromBody] CreateUsuario user)
    {
        var codigo = new Random().Next(100000, 999999).ToString();
        var corpoEmail = $"<p>Seu código de verificação é: <b>{codigo}</b></p>";

        // Aqui você salvaria no banco junto do usuário
        await _emailService.EnviarEmailAsync(
            user.Email,
            "Código de Verificação - Artenza",
            corpoEmail
        );

        return Ok(new { message = "Código enviado com sucesso!", codigo });
    }

    // 3️⃣ Newsletter
    [HttpPost("newsletter")]
    public async Task<IActionResult> InscreverNewsletter([FromBody] CreateNewsletter inscricao)
    {
        var corpoEmail = "<p>Obrigado por se inscrever na nossa newsletter! 🎉</p>";

        await _emailService.EnviarEmailAsync(
            inscricao.Email,
            "Bem-vindo à Newsletter Artenza",
            corpoEmail
        );

        return Ok(new { message = "Inscrição realizada com sucesso!" });
    }
}
