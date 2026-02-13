namespace Acceloka_Exam1.Features.Bookings.GetBookedTicketDetail;

public class BookedCategoryDto
{
    public int QtyPerCategory { get; set; } 
    public string CategoryName { get; set; } = string.Empty;
    public List<BookedItemDto> Tickets { get; set; } = new();
}

public class BookedItemDto
{
    public string TicketCode { get; set; } = string.Empty;
    public string TicketName { get; set; } = string.Empty;
    public string EventDate { get; set; } = string.Empty;
}