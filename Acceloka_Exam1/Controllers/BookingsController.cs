using Acceloka_Exam1.Features.Bookings.CreateBooking;
using Acceloka_Exam1.Features.Bookings.GetBookedTicketDetail;
using Acceloka_Exam1.Features.Bookings.RevokeBookedTicket;
using Acceloka_Exam1.Features.Bookings.UpdateBookedTicket;
using MediatR;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IMediator _mediator;
    public BookingsController(IMediator mediator) => _mediator = mediator;

    [HttpPost("book-ticket")]
    [ProducesResponseType(typeof(CreateBookingResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Book([FromBody] CreateBookingCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);

            return CreatedAtAction(nameof(GetDetail), new { bookedTicketId = result.BookedTicketId }, result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                title = "Not Found",
                status = 404,
                message = ex.Message
            });
        }
    }

    [HttpGet("get-booked-ticket/{bookedTicketId}")]
    [ProducesResponseType(typeof(List<BookedCategoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetail(Guid bookedTicketId)
    {
        var query = new GetBookedTicketDetailQuery { BookedTicketId = bookedTicketId };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound(new
            {
                title = "Not Found",
                status = 404,
                errors = new { Error = new[] { $"BookedTicketId '{bookedTicketId}' not registered." } }
            });
        }
        return Ok(result);
    }

    [HttpDelete("revoke-ticket/{bookedTicketId}/{kodeTicket}/{qty}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RevokeTicket(Guid bookedTicketId, string kodeTicket, int qty)
    {
        var command = new RevokeBookedTicketCommand
        {
            BookedTicketId = bookedTicketId,
            TicketCode = kodeTicket,
            Qty = qty
        };

        try
        {
            var result = await _mediator.Send(command);

            if (result == null)
            {
                return NotFound(new { message = $"BookingID '{bookedTicketId}' not found." });
            }

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("edit-booked-ticket/{bookedTicketId}")]
    [ProducesResponseType(typeof(List<EditBookedTicketResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> EditBookedTicket(Guid bookedTicketId, [FromBody] EditBookedTicketCommand command)
    {
        command.BookedTicketId = bookedTicketId;

        try
        {
            var result = await _mediator.Send(command);
            if (result == null)
        { 
                return NotFound(new { message = $"Booking ID '{bookedTicketId}' not found." });
        }
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}