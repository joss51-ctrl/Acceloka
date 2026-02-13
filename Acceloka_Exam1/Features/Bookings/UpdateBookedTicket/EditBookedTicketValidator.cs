using FluentValidation;

namespace Acceloka_Exam1.Features.Bookings.UpdateBookedTicket;

public class EditBookedTicketValidator : AbstractValidator<EditBookedTicketCommand>
{
    public EditBookedTicketValidator()
    {
        RuleFor(x => x.BookedTicketId)
            .NotEmpty().WithMessage("BookedTicketId is required.");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Items list cannot be empty.");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.TicketCode)
                .NotEmpty().WithMessage("Ticket Code is required.");

            item.RuleFor(x => x.NewQuantity)
                .GreaterThanOrEqualTo(1).WithMessage("Quantity must be at least 1.");
        });
    }
}