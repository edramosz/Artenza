using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using Core.Models;

namespace Core.Interfaces
{
    public interface IFeedbackService
    {
        Task<List<Feedback>> GetFeedbacksAsync();
        Task<Feedback> GetFeedbackAsync(string id);
        public Task<List<Feedback>> GetFeedbacksPorIdProduto(string idProduto);
        Task<Feedback> AddFeedbackAsync(CreateFeedback FeedbackDto);
        Task UpdateFeedbackAsync(string id, UpdateFeedback Feedback);
        Task DeleteFeedbackAsync(string id);
    }
}
