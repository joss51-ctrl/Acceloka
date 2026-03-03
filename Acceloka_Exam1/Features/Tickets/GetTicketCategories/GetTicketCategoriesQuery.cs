using MediatR;

namespace Acceloka_Exam1.Features.Tickets.GetTicketCategories;

public class GetTicketCategoriesQuery : IRequest<List<string>>
{
}