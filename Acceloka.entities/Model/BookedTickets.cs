namespace Acceloka.entities.Model;

public partial class BookedTickets
{
    public int Id { get; set; }

    public Guid BookedTicketId { get; set; }

    public string TicketCode { get; set; } = null!;

    public int Quantity { get; set; }

    public DateTime BookingDate { get; set; }

    public virtual Tickets TicketCodeNavigation { get; set; } = null!;
}
