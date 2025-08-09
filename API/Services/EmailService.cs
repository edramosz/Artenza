using Firebase.Database;
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
    public async Task EnviarEmailAsync(string destinatario, string assunto, string mensagemHtml)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Artenza", _smtpUser));
        message.To.Add(new MailboxAddress("", destinatario));
        message.Subject = assunto;

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = mensagemHtml
        };
        message.Body = bodyBuilder.ToMessageBody();

        using (var client = new SmtpClient())
        {
            await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_smtpUser, _smtpPass);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
