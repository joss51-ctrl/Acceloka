using FluentValidation;

namespace Acceloka_Exam1.Features.Bookings.RevokeBookedTicket;

public class RevokeBookedTicketValidator : AbstractValidator<RevokeBookedTicketCommand>
{
    public RevokeBookedTicketValidator()
    {
        RuleFor(x => x.BookedTicketId)
            .NotEmpty().WithMessage("BookedTicketId is required.")
            .NotEqual(Guid.Empty).WithMessage("Invalid BookedTicketId format.");

        RuleFor(x => x.TicketCode)
            .NotEmpty().WithMessage("Ticket Code cannot be empty.");

        RuleFor(x => x.Qty)
            .GreaterThan(0).WithMessage("Quantity to revoke must be greater than 0.");
    }
}