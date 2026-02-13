namespace Acceloka_Exam1.Features.Bookings.RevokeBookedTicket;

public class RevokeBookedTicketResponse
{
    public string TicketCode { get; set; } = string.Empty;
    public string TicketName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}