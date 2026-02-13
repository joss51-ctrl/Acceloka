using FluentValidation;

namespace Acceloka_Exam1.Features.Tickets.GetAvailableTickets;

public class GetAvailableTicketsValidator : AbstractValidator<GetAvailableTicketsQuery>
{
    public GetAvailableTicketsValidator()
    {
        RuleFor(x => x.MaxPrice)
            .GreaterThanOrEqualTo(0)
            .When(x => x.MaxPrice.HasValue)
            .WithMessage("The maximum price cannot be less than 0.");

        RuleFor(x => x.MaxEventDate)
            .GreaterThanOrEqualTo(x => x.MinEventDate.Value)
            .When(x => x.MinEventDate.HasValue && x.MaxEventDate.HasValue)
            .WithMessage("The maximum event date cannot be less than the minimum date.");

        RuleFor(x => x.OrderState)
            .Must(x => string.IsNullOrEmpty(x) ||
                       x.ToLower() == "asc" ||
                       x.ToLower() == "desc")
            .WithMessage("Order State can only contain 'asc' or 'desc'.");

        var validColumns = new[] { "categoryname", "ticketcode", "ticketname", "eventdate", "price", "quota" };
        RuleFor(x => x.OrderBy)
            .Must(x => string.IsNullOrEmpty(x) ||
                       validColumns.Contains(x.ToLower()))
            .WithMessage("The OrderBy column must be one of: CategoryName, TicketCode, TicketName, EventDate, Price, or Quota.");
    }
}