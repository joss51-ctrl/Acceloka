using MediatR;
using System.Text.Json.Serialization;

namespace Acceloka_Exam1.Features.Bookings.UpdateBookedTicket;

public class EditBookedTicketCommand : IRequest<List<EditBookedTicketResponse>>
{
    [JsonIgnore] 
    public Guid BookedTicketId { get; set; }

    public List<EditTicketItemRequest> Items { get; set; } = new();
}

public class EditTicketItemRequest
{
    public string TicketCode { get; set; } = string.Empty;
    public int NewQuantity { get; set; }
}