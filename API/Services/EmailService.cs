using AutoMapper;
using Core.Models.DTO_s.Create;
using Core.Models;
using Firebase.Database;
using MimeKit;
using Firebase.Database.Query;
using MailKit.Net.Smtp;
using Core.Interfaces;

public class EmailService : IEmailService
{
    private readonly string _smtpServer = "smtp.gmail.com";
    private readonly int _smtpPort = 465;
    private readonly string _smtpUser = "artenza.ofc@gmail.com";
    private readonly string _smtpPass = "xkxl lmrp gkax ieaa";
    private readonly FirebaseClient _firebaseClient;
    private readonly IMapper _mapper;

    public EmailService(IConfiguration configuration, IMapper mapper)
    {
        _mapper = mapper;
        var firebaseUrl = configuration["Firebase:DatabaseUrl"];
        _firebaseClient = new FirebaseClient(firebaseUrl);
    }

    // ------------------- CONTATO -------------------
    public async Task EnviarContatoAsync(CreateContato contatoDto)
    {
        var contato = _mapper.Map<Contato>(contatoDto);

        var response = await _firebaseClient
            .Child("contatos")
            .PostAsync(contato);

        contato.Id = response.Key;

        await _firebaseClient
            .Child("contatos")
            .Child(contato.Id)
            .PutAsync(contato);

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Equipe Artenza", _smtpUser));
        message.To.Add(new MailboxAddress("Artenza", _smtpUser));
        message.Subject = $"Novo contato de {contato.Nome}";
        message.Body = new TextPart("plain")
        {
            Text = $"Nome: {contato.Nome}\n" +
                   $"E-mail: {contato.Email}\n" +
                   $"Telefone: {contato.Telefone}\n" +
                   $"Serviço: {contato.Servico}\n" +
                   $"Mensagem:\n{contato.Mensagem}"
        };

        await EnviarEmailAsync(message);
    }

    // ------------------- NEWSLETTER -------------------
    public async Task EnviarNewsletterAsync(CreateNewsletter newsletterDto)
    {
        var newsletter = _mapper.Map<Newsletter>(newsletterDto);

        var response = await _firebaseClient
            .Child("newsletters")
            .PostAsync(newsletter);

        newsletter.Id = response.Key;

        await _firebaseClient
            .Child("newsletters")
            .Child(newsletter.Id)
            .PutAsync(newsletter);

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Artenza", _smtpUser));
        // tentar passar o nome do usuario ao invés de passaro email
        message.To.Add(new MailboxAddress(newsletter.Email, newsletter.Email));
        message.Subject = "Bem-vindo à Newsletter Artenza!";
        message.Body = new TextPart("plain")
        {
            Text = $"Olá!\n\nObrigado por se inscrever na nossa newsletter.\n" +
                   $"Você agora receberá novidades e promoções em primeira mão.\n\n" +
                   $"Equipe Artenza"
        };

        await EnviarEmailAsync(message);
    }

    // ------------------- CÓDIGO DE RECUPERAÇÃO DE SENHA -------------------
    public async Task EnviarCodigoRecuperacaoAsync(string email)
    {
        // Gera código de 6 dígitos
        var codigo = new Random().Next(100000, 999999).ToString();

        // Salva no Firebase (opcional: com validade de tempo)
        var dadosCodigo = new
        {
            Email = email,
            Codigo = codigo,
            CriadoEm = DateTime.UtcNow
        };

        await _firebaseClient
            .Child("codigos_recuperacao")
            .PostAsync(dadosCodigo);

        // Envia o e-mail
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Artenza", _smtpUser));
        message.To.Add(new MailboxAddress(email, email));
        message.Subject = "Código de recuperação de senha";
        message.Body = new TextPart("plain")
        {
            Text = $"Olá!\n\nSeu código para recuperação de senha é: {codigo}\n" +
                   "Este código expira em 10 minutos.\n\n" +
                   "Equipe Artenza"
        };

        await EnviarEmailAsync(message);
    }

    // ------------------- MÉTODO INTERNO DE ENVIO -------------------
    private async Task EnviarEmailAsync(MimeMessage message)
    {
        using var client = new SmtpClient();
        await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.SslOnConnect);
        await client.AuthenticateAsync(_smtpUser, _smtpPass);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
