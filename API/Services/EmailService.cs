using Core.Models;
using Core.Models.DTO_s.Create;
using Firebase.Database;
using Firebase.Database.Query;
using Google.Cloud.Firestore.V1;
using MailKit.Net.Smtp;
using MimeKit;
using System.Threading.Tasks;

public class EmailService
{
    private readonly string _smtpServer = "smtp.gmail.com"; // exemplo
    private readonly int _smtpPort = 587;
    private readonly string _smtpUser = "seuemail@artenza.com";
    private readonly string _smtpPass = "SENHA_AQUI";
    private readonly FirebaseClient _firebaseClient;

    public EmailService(IConfiguration configuration)
    {
        var firebaseUrl = configuration["Firebase:DatabaseUrl"];
        _firebaseClient = new FirebaseClient(firebaseUrl);
    }


    public async Task EnviarContatoAsync(CreateContato contatoDto)
    {
        // Salvar no Firebase
        var contato = _mapper.Map<Contato>(contatoDto);
        var response = await _firebaseClient
                       .Child("contatos")
                       .PostAsync(contato);

        // Agora que o Firebase gerou a chave, seta o Id no objeto
        contato.Id = response.Key;

        // Atualiza o registro no Firebase já com o Id
        await _firebaseClient
            .Child("contatos")
            .Child(contato.Id)
            .PutAsync(contato);


        // 2️⃣ Enviar e-mail para a empresa
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Equipe Artenza", _smtpUser));
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

    public async Task EnviarNewsletterAsync(CreateNewsletter newsletterDto)
    {
        // Salvar no Firebase
        var newsletter = _mapper.Map<Newsletter>(newsletterDto);
        var response = await _firebaseClient
                       .Child("newsletters")
                       .PostAsync(newsletter);

        // Agora que o Firebase gerou a chave, seta o Id no objeto
        newsletter.Id = response.Key;

        // Atualiza o registro no Firebase já com o Id
        await _firebaseClient
            .Child("newsletters")
            .Child(newsletter.Id)
            .PutAsync(newsletter);

        // 2️⃣ Enviar e-mail de boas-vindas para o usuário
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Artenza", _smtpUser));
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
    private async Task EnviarEmailAsync(MimeMessage message)
    {
        using var client = new SmtpClient();
        await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_smtpUser, _smtpPass);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }









    //public async Task EnviarEmailAsync(string destinatario, string assunto, string mensagemHtml)
    //{
    //    var message = new MimeMessage();
    //    message.From.Add(new MailboxAddress("Artenza", _smtpUser));
    //    message.To.Add(new MailboxAddress("", destinatario));
    //    message.Subject = assunto;

    //    var bodyBuilder = new BodyBuilder
    //    {
    //        HtmlBody = mensagemHtml
    //    };
    //    message.Body = bodyBuilder.ToMessageBody();

    //    using (var client = new SmtpClient())
    //    {
    //        await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
    //        await client.AuthenticateAsync(_smtpUser, _smtpPass);
    //        await client.SendAsync(message);
    //        await client.DisconnectAsync(true);
    //    }
    //}
}
