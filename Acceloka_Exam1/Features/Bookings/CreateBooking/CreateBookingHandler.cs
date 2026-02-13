using Acceloka.entities.Infrastructure;
using Acceloka.entities.Model;
using MediatR;
using Microsoft.EntityFrameworkCore;
using FluentValidation;

namespace Acceloka_Exam1.Features.Bookings.CreateBooking
{
    public class CreateBookingHandler : IRequestHandler<CreateBookingCommand, CreateBookingResponse>
    {
        private readonly AppDbContext _context;

        public CreateBookingHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CreateBookingResponse> Handle(CreateBookingCommand request, CancellationToken cancellationToken)
        {
            // Initialization list DTO internal
            var responseItems = new List<InternalBookingDetail>();
            var now = DateTime.Now;
            var sharedBookingId = Guid.NewGuid();

            foreach (var item in request.Bookings)
            {
                var ticket = await _context.Tickets
                    .FirstOrDefaultAsync(t => t.TicketCode == item.TicketCode, cancellationToken);

                // Validations
                if (ticket == null)
                {
                    throw new KeyNotFoundException($"Ticket Code '{item.TicketCode}' is not registered.");
                }

                if (ticket.Quota <= 0)
                {
                    throw new ValidationException($"Quota ticket '{item.TicketCode}' has run out.");
                }

                if (item.Quantity > ticket.Quota)
                {
                    throw new ValidationException($"Quantity for '{item.TicketCode}' exceeds quota.");
                }

                if (ticket.EventDate <= now)
                {
                    throw new ValidationException($"The event date for '{item.TicketCode}' has passed.");
                }

                ticket.Quota -= item.Quantity;

                // Mapping data to BookedTickets 
                var booked = new BookedTickets
                {
                    BookedTicketId = sharedBookingId,
                    TicketCode = item.TicketCode,
                    Quantity = item.Quantity,
                    BookingDate = now
                };

                _context.BookedTickets.Add(booked);

                // Save ticket details to a temporary list for response purposes
                responseItems.Add(new InternalBookingDetail
                {
                    CategoryName = ticket.CategoryName,
                    TicketCode = ticket.TicketCode,
                    TicketName = ticket.TicketName,
                    TotalPrice = ticket.Price * item.Quantity
                });
            }

            await _context.SaveChangesAsync(cancellationToken);

            // Group data by category and map to DTO
            return new CreateBookingResponse
            {
                BookedTicketId = sharedBookingId,
                PriceSummary = responseItems.Sum(x => x.TotalPrice),
                TicketsPerCategories = responseItems
                    .GroupBy(x => x.CategoryName)
                    .Select(g => new CategoryBookingDto
                    {
                        CategoryName = g.Key,
                        SummaryPrice = g.Sum(x => x.TotalPrice),
                        Tickets = g.Select(x => new BookedTicketDto
                        {
                            TicketCode = x.TicketCode,
                            TicketName = x.TicketName,
                            Price = x.TotalPrice
                        }).ToList()
                    }).ToList()
            };
        }

        private class InternalBookingDetail
        {
            public string CategoryName { get; set; } = string.Empty;
            public string TicketCode { get; set; } = string.Empty;
            public string TicketName { get; set; } = string.Empty;
            public decimal TotalPrice { get; set; }
        }
    }
}