using MediatR;

namespace Acceloka_Exam1.Features.Bookings.GetBookedTicketDetail;
public class GetBookedTicketDetailQuery : IRequest<List<BookedCategoryDto>>
{
    public Guid BookedTicketId { get; set; }
}