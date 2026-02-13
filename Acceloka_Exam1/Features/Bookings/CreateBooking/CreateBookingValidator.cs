using FluentValidation;

namespace Acceloka_Exam1.Features.Bookings.CreateBooking;

public class CreateBookingValidator : AbstractValidator<CreateBookingCommand>
{
    public CreateBookingValidator()
    {
        RuleFor(x => x.Bookings)
            .NotEmpty().WithMessage("Booking list cannot be empty.");

        RuleForEach(x => x.Bookings).ChildRules(items =>
        {
            items.RuleFor(x => x.TicketCode)
                .NotEmpty().WithMessage("Ticket Code is required.");

            items.RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than 0.");
        });
    }
}