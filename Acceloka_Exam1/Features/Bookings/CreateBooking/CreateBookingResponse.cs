namespace Acceloka_Exam1.Features.Bookings.CreateBooking;

public class CreateBookingResponse
{
    public Guid BookedTicketId { get; set; }
    public decimal PriceSummary { get; set; }
    public List<CategoryBookingDto> TicketsPerCategories { get; set; } = new();
}

public class CategoryBookingDto
{
    public string CategoryName { get; set; } = string.Empty;
    public decimal SummaryPrice { get; set; }
    public List<BookedTicketDto> Tickets { get; set; } = new();
}

public class BookedTicketDto
{
    public string TicketCode { get; set; } = string.Empty;
    public string TicketName { get; set; } = string.Empty;
    public decimal Price { get; set; }
}
