using FluentValidation;

namespace Acceloka_Exam1.Features.Bookings.GetBookedTicketDetail;

public class GetBookedTicketDetailValidator : AbstractValidator<GetBookedTicketDetailQuery>
{
    public GetBookedTicketDetailValidator()
    {
        RuleFor(x => x.BookedTicketId)
            .NotEmpty().WithMessage("BookedTicketId is required.")
            .NotEqual(Guid.Empty).WithMessage("Invalid BookedTicketId format.");
    }
}