using MediatR;

namespace Acceloka_Exam1.Features.Tickets.GetAvailableTickets;
public class GetAvailableTicketsQuery : IRequest<GetAvailableTicketsResponse>
{
    public string? CategoryName { get; set; }
    public string? TicketCode { get; set; }
    public string? TicketName { get; set; }
    public decimal? MaxPrice { get; set; }
    public DateTime? MinEventDate { get; set; }
    public DateTime? MaxEventDate { get; set; }
    public string? OrderBy { get; set; }
    public string? OrderState { get; set; }
    public int PageNumber { get; set; } = 1;
}