using Acceloka.entities.Infrastructure;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Acceloka_Exam1.Features.Bookings.RevokeBookedTicket;

public class RevokeBookedTicketHandler : IRequestHandler<RevokeBookedTicketCommand, RevokeBookedTicketResponse>
{
    private readonly AppDbContext _context;

    public RevokeBookedTicketHandler(AppDbContext context) => _context = context;

    public async Task<RevokeBookedTicketResponse> Handle(RevokeBookedTicketCommand request, CancellationToken cancellationToken)
    {
        // Fetch all booked tickets and ticket detail
        var bookedItem = await _context.BookedTickets
            .Include(bt => bt.TicketCodeNavigation)
            .FirstOrDefaultAsync(bt => bt.BookedTicketId == request.BookedTicketId
                                     && bt.TicketCode == request.TicketCode, cancellationToken);

        // Validations
        if (bookedItem == null)
        {
            var idExists = await _context.BookedTickets.AnyAsync(x => x.BookedTicketId == request.BookedTicketId);
            if (!idExists)
            {
                return null!;
            }

            throw new KeyNotFoundException($"Ticket code '{request.TicketCode}' not found in this booking.");
        }


        if (request.Qty > bookedItem.Quantity)
        {
            throw new ValidationException($"The revoked quantity ({request.Qty}) exceeds the order quantity ({bookedItem.Quantity}).");
        }

        bookedItem.TicketCodeNavigation.Quota += request.Qty;
        bookedItem.Quantity -= request.Qty;

        if (bookedItem.Quantity == 0)
        {
            _context.BookedTickets.Remove(bookedItem);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new RevokeBookedTicketResponse(); 
    }
}