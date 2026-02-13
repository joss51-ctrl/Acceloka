namespace Acceloka.entities.Model;

public partial class Tickets
{
    public int TicketId { get; set; }

    public string TicketCode { get; set; } = null!;

    public string TicketName { get; set; } = null!;

    public string CategoryName { get; set; } = null!;

    public decimal Price { get; set; }

    public int Quota { get; set; }

    public DateTime EventDate { get; set; }

    public virtual ICollection<BookedTickets> BookedTickets { get; set; } = new List<BookedTickets>();
}
