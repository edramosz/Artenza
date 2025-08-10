using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Models.DTO_s.Create;
using MimeKit;

namespace Core.Interfaces
{
    public interface IEmailService
    {
        Task EnviarContatoAsync(CreateContato contatoDto);
        Task EnviarNewsletterAsync(CreateNewsletter newsletterDto);
        Task EnviarCodigoRecuperacaoAsync(string email);
    }
}
