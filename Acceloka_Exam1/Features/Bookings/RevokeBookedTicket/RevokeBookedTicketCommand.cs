using MediatR;

namespace Acceloka_Exam1.Features.Bookings.RevokeBookedTicket;


public class RevokeBookedTicketCommand : IRequest<RevokeBookedTicketResponse>
{
    public Guid BookedTicketId { get; set; }
    public string TicketCode { get; set; } = string.Empty;
    public int Qty { get; set; }
}