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
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        /// <summary>
        /// Endpoint para listar todos os feedbacks.
        /// </summary>
        /// <returns></returns>
        ///
        [HttpGet]
        public async Task<ActionResult<List<Feedback>>> GetFeedbacks()
        {
            return await _feedbackService.GetFeedbacksAsync();
        }

        /// <summary>
        /// Endpoint para listar algum feedback pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        ///
        [HttpGet("{id}")]
        public async Task<ActionResult<Feedback>> GetFeedback(string id)
        {
            var feedback = await _feedbackService.GetFeedbackAsync(id);
            if (feedback == null)
                return NotFound();

            return feedback;
        }

        /// <summary>
        /// Endpoint para adicionar um feedback.
        /// </summary>
        /// <param name="feedbackDto"></param>
        ///
        [HttpPost]
        public async Task<ActionResult> CreateFeedback([FromBody] CreateFeedback feedbackDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var feedbackCriado = await _feedbackService.AddFeedbackAsync(feedbackDto);

            return CreatedAtAction(nameof(GetFeedback), new { id = feedbackCriado.Id }, feedbackCriado);
        }



        /// <summary>
        /// Endpoint para editar algum feedback pelo id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="feedback"></param>
        ///
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateFeedback(string id, UpdateFeedback feedback)
        {
            var existingFeedback = await _feedbackService.GetFeedbackAsync(id);
            if (existingFeedback == null)
                return NotFound();

            await _feedbackService.UpdateFeedbackAsync(id, feedback);
            return NoContent();
        }

        /// <summary>
        /// Endpoint para deletar algum feedback pelo id.
        /// </summary>
        /// <param name="id"></param>
        ///
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteFeedback(string id)
        {
            var existingFeedback = await _feedbackService.GetFeedbackAsync(id);
            if (existingFeedback == null)
                return NotFound();

            await _feedbackService.DeleteFeedbackAsync(id);
            return NoContent();
        }
    }
}
