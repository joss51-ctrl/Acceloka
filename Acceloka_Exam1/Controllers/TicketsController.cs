using Acceloka_Exam1.Features.Tickets.GetAvailableTickets;
using MediatR;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TicketsController(IMediator mediator) => _mediator = mediator;

    [HttpGet("get-available-ticket")]
    [ProducesResponseType(typeof(GetAvailableTicketsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAvailableTicket([FromQuery] GetAvailableTicketsQuery query)
    {
        try
        {
            var result = await _mediator.Send(query);

            if (result == null)
            {
                return NotFound(new { message = "No tickets found with the given criteria." });
            }

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}