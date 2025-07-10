using Core.Interfaces;
using Core.Models;
using Core.Models.DTO_s.Create;
using Core.Models.DTO_s.Update;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        /// <summary>
        /// Retorna todos os feedbacks cadastrados.
        /// </summary>
        /// <returns>Lista de objetos Feedback.</returns>
        /// <response code="200">Retorna a lista de feedbacks.</response>
        [HttpGet]
        public async Task<ActionResult<List<Feedback>>> GetAll()
        {
            var feedbacks = await _feedbackService.GetFeedbacksAsync();
            return Ok(feedbacks);
        }

        /// <summary>
        /// Retorna um feedback específico pelo ID.
        /// </summary>
        /// <param name="id">ID do feedback.</param>
        /// <returns>Objeto Feedback correspondente ao ID.</returns>
        /// <response code="200">Retorna o feedback encontrado.</response>
        /// <response code="404">Se o feedback não for encontrado.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<Feedback>> GetById(string id)
        {
            var feedback = await _feedbackService.GetFeedbackAsync(id);
            if (feedback == null)
                return NotFound();

            return Ok(feedback);
        }

        /// <summary>
        /// Cria um novo feedback.
        /// </summary>
        /// <param name="createFeedback">Dados para criação do feedback.</param>
        /// <returns>O feedback criado.</returns>
        /// <response code="201">Retorna o feedback criado com o ID.</response>
        /// <response code="400">Se os dados enviados forem inválidos.</response>
        [HttpPost]
        public async Task<ActionResult<Feedback>> Create([FromBody] CreateFeedback createFeedback)
        {
            var feedback = await _feedbackService.AddFeedbackAsync(createFeedback);
            return CreatedAtAction(nameof(GetById), new { id = feedback.Id }, feedback);
        }

        /// <summary>
        /// Atualiza um feedback existente pelo ID.
        /// </summary>
        /// <param name="id">ID do feedback a ser atualizado.</param>
        /// <param name="updateFeedback">Dados para atualização.</param>
        /// <response code="204">Atualização realizada com sucesso.</response>
        /// <response code="404">Se o feedback não for encontrado.</response>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, UpdateFeedback updateFeedback)
        {
            var existingFeedback = await _feedbackService.GetFeedbackAsync(id);
            if (existingFeedback == null)
                return NotFound();

            await _feedbackService.UpdateFeedbackAsync(id, updateFeedback);
            return NoContent();
        }

        /// <summary>
        /// Remove um feedback pelo ID.
        /// </summary>
        /// <param name="id">ID do feedback a ser removido.</param>
        /// <response code="204">Remoção realizada com sucesso.</response>
        /// <response code="404">Se o feedback não for encontrado.</response>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existingFeedback = await _feedbackService.GetFeedbackAsync(id);
            if (existingFeedback == null)
                return NotFound();

            await _feedbackService.DeleteFeedbackAsync(id);
            return NoContent();
        }
    }
}
