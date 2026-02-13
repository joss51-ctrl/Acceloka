using Acceloka.entities.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;
using FluentValidation;

namespace Acceloka_Exam1.Features.Bookings.UpdateBookedTicket;

public class EditBookedTicketHandler : IRequestHandler<EditBookedTicketCommand, List<EditBookedTicketResponse>>
{
    private readonly AppDbContext _context;

    public EditBookedTicketHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EditBookedTicketResponse>> Handle(EditBookedTicketCommand request, CancellationToken cancellationToken)
    {
        var responseList = new List<EditBookedTicketResponse>();

        var isBookingExists = await _context.BookedTickets
                .AnyAsync(bt => bt.BookedTicketId == request.BookedTicketId, cancellationToken);

        if (!isBookingExists)
        {
            return null!; 
        }

        foreach (var item in request.Items)
        {
            var bookedItem = await _context.BookedTickets
                .Include(bt => bt.TicketCodeNavigation)
                .FirstOrDefaultAsync(bt => bt.BookedTicketId == request.BookedTicketId
                                         && bt.TicketCode == item.TicketCode, cancellationToken);

            if (bookedItem == null)
            {
                throw new KeyNotFoundException($"Ticket Code '{item.TicketCode}' is not found in Booking ID '{request.BookedTicketId}'.");
            }

            int quantityDifference = item.NewQuantity - bookedItem.Quantity;

            if (quantityDifference > 0)
            {
                if (bookedItem.TicketCodeNavigation.Quota < quantityDifference)
                {
                    throw new ValidationException($"Insufficient quota for '{item.TicketCode}'. Requested add: {quantityDifference}, Available: {bookedItem.TicketCodeNavigation.Quota}.");
                }
            }

            bookedItem.TicketCodeNavigation.Quota -= quantityDifference;
            bookedItem.Quantity = item.NewQuantity;

            responseList.Add(new EditBookedTicketResponse
            {
                TicketCode = bookedItem.TicketCode,
                TicketName = bookedItem.TicketCodeNavigation.TicketName,
                CategoryName = bookedItem.TicketCodeNavigation.CategoryName,
                Quantity = bookedItem.Quantity
            });
        }

        await _context.SaveChangesAsync(cancellationToken);
        return responseList;
    }
}