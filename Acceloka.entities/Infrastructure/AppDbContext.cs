using Acceloka.entities.Model;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.entities.Infrastructure;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BookedTickets> BookedTickets { get; set; }
    public virtual DbSet<Tickets> Tickets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BookedTickets>(entity =>
        {
            entity.Property(e => e.BookingDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.Property(e => e.TicketCode).HasMaxLength(50);

            entity.HasOne(d => d.TicketCodeNavigation)
                .WithMany(p => p.BookedTickets)
                .HasPrincipalKey(p => p.TicketCode)
                .HasForeignKey(d => d.TicketCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BookedTickets_Tickets");
        });

        modelBuilder.Entity<Tickets>(entity =>
        {
            entity.HasKey(e => e.TicketId);

            entity.HasIndex(e => e.TicketCode, "UQ_TicketCode").IsUnique();

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.EventDate).HasColumnType("datetime");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TicketCode).HasMaxLength(50);
            entity.Property(e => e.TicketName).HasMaxLength(200);
        });
    }
}