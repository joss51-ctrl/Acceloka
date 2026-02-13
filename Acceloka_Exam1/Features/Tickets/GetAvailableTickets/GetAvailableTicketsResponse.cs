namespace Acceloka_Exam1.Features.Tickets.GetAvailableTickets;

public class GetAvailableTicketsResponse
{
    public List<TicketDto> Tickets { get; set; } = new();
    public int TotalTickets { get; set; }
}

public class TicketDto
{
    public string EventDate { get; set; } = string.Empty;
    public int Quota { get; set; }
    public string TicketCode { get; set; } = string.Empty;
    public string TicketName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public decimal Price { get; set; }
}