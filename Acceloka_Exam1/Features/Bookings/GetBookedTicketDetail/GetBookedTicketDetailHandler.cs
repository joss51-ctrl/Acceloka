using Acceloka.entities.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;
using FluentValidation;

namespace Acceloka_Exam1.Features.Bookings.GetBookedTicketDetail;

public class GetBookedTicketDetailHandler : IRequestHandler<GetBookedTicketDetailQuery, List<BookedCategoryDto>>
{
    private readonly AppDbContext _context;

    public GetBookedTicketDetailHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<BookedCategoryDto>> Handle(GetBookedTicketDetailQuery request, CancellationToken cancellationToken)
    {
        // Fetch booked ticket and ticket details
        var bookedItems = await _context.BookedTickets
            .Include(bt => bt.TicketCodeNavigation)
            .Where(bt => bt.BookedTicketId == request.BookedTicketId)
            .ToListAsync(cancellationToken);

   
        if (bookedItems == null || !bookedItems.Any())
        {
            return null!;
        }

        // Group data by category and map to DTO
        var response = bookedItems
            .GroupBy(x => x.TicketCodeNavigation.CategoryName)
            .Select(g => new BookedCategoryDto
            {
                CategoryName = g.Key,
                QtyPerCategory = g.Sum(x => x.Quantity),
                Tickets = g.Select(ti => new BookedItemDto
                {
                    TicketCode = ti.TicketCode,
                    TicketName = ti.TicketCodeNavigation.TicketName,
                    EventDate = ti.TicketCodeNavigation.EventDate.ToString("dd-MM-yyyy HH:mm")
                }).ToList()
            }).ToList();

        return response;
    }
}