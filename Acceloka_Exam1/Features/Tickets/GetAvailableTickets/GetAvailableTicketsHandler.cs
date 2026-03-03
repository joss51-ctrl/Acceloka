using Acceloka.entities.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka_Exam1.Features.Tickets.GetAvailableTickets;

public class GetAvailableTicketsHandler : IRequestHandler<GetAvailableTicketsQuery, GetAvailableTicketsResponse>
{
    private readonly AppDbContext _context;

    public GetAvailableTicketsHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetAvailableTicketsResponse> Handle(GetAvailableTicketsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Tickets.AsNoTracking().AsQueryable();

        // FILTERS
        if (!string.IsNullOrWhiteSpace(request.CategoryName))
        {
            query = query.Where(t => t.CategoryName == request.CategoryName);
        }

        if (!string.IsNullOrWhiteSpace(request.TicketCode))
        {
            query = query.Where(t => t.TicketCode.Contains(request.TicketCode));
        }

        if (!string.IsNullOrWhiteSpace(request.TicketName))
        {
            query = query.Where(t => t.TicketName.Contains(request.TicketName));
        }

        if (request.MaxPrice.HasValue)
        {
            query = query.Where(t => t.Price <= request.MaxPrice.Value);
        }

        // COUNT
        var totalCount = await query.CountAsync(cancellationToken);

        int pageNumber = request.Page <= 0 ? 1 : request.Page;
        int pageSize = request.PageSize <= 0 ? 10 : request.PageSize;
        int totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        if (totalCount > 0 && pageNumber > totalPages)
        {
            throw new KeyNotFoundException($"Page {pageNumber} is not found. Total pages available: {totalPages}.");
        }

        // SORTING
        string orderBy = string.IsNullOrWhiteSpace(request.OrderBy)
            ? "ticketcode"
            : request.OrderBy.ToLower();

        bool isDescending = request.OrderState?.ToLower() == "desc";

        query = ApplySorting(query, orderBy, isDescending);

        // PAGINATION
        int skip = (pageNumber - 1) * pageSize;

        var tickets = await query
            .Skip(skip)
            .Take(pageSize)
            .Select(x => new TicketDto
            {
                EventDate = x.EventDate,
                Quota = x.Quota,
                TicketCode = x.TicketCode,
                TicketName = x.TicketName,
                CategoryName = x.CategoryName,
                Price = x.Price
            })
            .ToListAsync(cancellationToken);

        return new GetAvailableTicketsResponse
        {
            TotalTickets = totalCount,
            Tickets = tickets
        };
    }
    private IQueryable<Acceloka.entities.Model.Tickets> ApplySorting(IQueryable<Acceloka.entities.Model.Tickets> query, string orderBy, bool desc)
{
    return orderBy switch
    {
        "ticketname" => desc ? query.OrderByDescending(x => x.TicketName) : query.OrderBy(x => x.TicketName),
        "categoryname" => desc ? query.OrderByDescending(x => x.CategoryName) : query.OrderBy(x => x.CategoryName),
        "price" => desc ? query.OrderByDescending(x => x.Price) : query.OrderBy(x => x.Price),
        "eventdate" => desc ? query.OrderByDescending(x => x.EventDate) : query.OrderBy(x => x.EventDate),
        "quota" => desc ? query.OrderByDescending(x => x.Quota) : query.OrderBy(x => x.Quota),
        _ => desc ? query.OrderByDescending(x => x.TicketCode) : query.OrderBy(x => x.TicketCode)
    };
}
}