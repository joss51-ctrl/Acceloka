using MediatR;
using System.Collections.Generic;

namespace Acceloka_Exam1.Features.Bookings.CreateBooking
{
    public class CreateBookingCommand : IRequest<CreateBookingResponse>, IBaseRequest
    {
        public List<BookingItemRequest> Bookings { get; set; } = new();
    }

    public class BookingItemRequest
    {
        public string TicketCode { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}
