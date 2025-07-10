using AutoMapper;
using Core.Interfaces;
using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Identity;

namespace API.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly FirebaseClient _firebaseClient;
        private readonly IMapper _mapper;

        public FeedbackService(IConfiguration configuration, IMapper mapper)
        {
            var firebaseUrl = configuration["Firebase:DatabaseUrl"];
            _firebaseClient = new FirebaseClient(firebaseUrl);
            _mapper = mapper;
        }

        // Obter todos os Feedbacks
        public async Task<List<Feedback>> GetFeedbacksAsync()
        {
            var feedbacks = await _firebaseClient
                .Child("feedbacks")
                .OnceAsync<Feedback>();

            return feedbacks.Select(item => item.Object).ToList();
        }

        // Obter um Feedback pelo ID
        public async Task<Feedback> GetFeedbackAsync(string id)
        {
            var feedback = (await _firebaseClient
                .Child("feedbacks")
                .OnceAsync<Feedback>())
                .FirstOrDefault(p => p.Object.Id == id)?.Object; // comparar direto id, pois Id já é string

            return feedback;
        }

        // Adicionar um novo Feedback
        public async Task<Feedback> AddFeedbackAsync(CreateFeedback feedbackDto)
        {
            var feedback = _mapper.Map<Feedback>(feedbackDto);
            feedback.IdProduto = feedbackDto.IdProduto;
            feedback.IdUsuario = feedbackDto.IdUsuario;


            // Setar DataCriacao na hora da criação se não veio no DTO
            if (feedback.DataCriacao == default)
                feedback.DataCriacao = DateTime.UtcNow;

            // Primeiro cria o documento no Firebase
            var response = await _firebaseClient
                .Child("feedbacks")
                .PostAsync(feedback);

            // Agora que o Firebase gerou a chave, seta o Id no objeto
            feedback.Id = response.Key;

            // Atualiza o registro no Firebase já com o Id
            await _firebaseClient
                .Child("feedbacks")
                .Child(feedback.Id)
                .PutAsync(feedback);

            return feedback;
        }

        // Atualizar um Feedback pelo ID
        public async Task UpdateFeedbackAsync(string id, UpdateFeedback feedbackDto)
        {
            var feedbackExistente = await GetFeedbackAsync(id);
            if (feedbackExistente != null)
            {
                _mapper.Map(feedbackDto, feedbackExistente);
                await _firebaseClient
                    .Child("feedbacks")
                    .Child(id)
                    .PutAsync(feedbackExistente);
            }
        }

        // Deletar um Feedback pelo ID
        public async Task DeleteFeedbackAsync(string id)
        {
            await _firebaseClient
                .Child("feedbacks")
                .Child(id)
                .DeleteAsync();
        }
    }
}
