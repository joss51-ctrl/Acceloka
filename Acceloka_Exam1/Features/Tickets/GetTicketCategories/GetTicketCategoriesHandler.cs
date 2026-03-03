using Acceloka.entities.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka_Exam1.Features.Tickets.GetTicketCategories;

public class GetTicketCategoriesHandler
    : IRequestHandler<GetTicketCategoriesQuery, List<string>>
{
    private readonly AppDbContext _context;

    public GetTicketCategoriesHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<string>> Handle(GetTicketCategoriesQuery request, CancellationToken cancellationToken)
    {
        return await _context.Tickets
            .AsNoTracking()
            .Select(t => t.CategoryName)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync(cancellationToken);
    }
}