export interface Ticket {
  ticketCode: string;
  ticketName: string;
  categoryName: string;
  price: number;
  quota: number;
  eventDate: string;
}

export interface TicketResponse {
  tickets: Ticket[];
  totalTickets: number;
}

export interface BookedItem {
  ticketCode: string;
  ticketName: string;
  eventDate: string;
}

export interface BookedCategory {
  bookedTicketId: string;
  qtyPerCategory: number;
  categoryName: string;
  tickets: BookedItem[];
}

export interface BookingPostResponse {
  bookedTicketId: string;
  priceSummary: number;
  ticketsPerCategories: number[];
}

export interface CartItem {
  ticket: Ticket;
  qty: number;
}

export interface EditBookedTicketItem {
  ticketCode: string;
  newQuantity: number;
}

export interface EditBookedTicketPayload {
  items: EditBookedTicketItem[];
}
