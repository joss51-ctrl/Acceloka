import { BookedCategory } from "@/types";
import { EditBookedTicketPayload } from "@/types";

const BASE_URL = "https://localhost:7227/api/v1";

export const getAvailableTickets = async (
  page: number,
  size: number,
  name?: string,
  category?: string,
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: size.toString(),
  });

  if (name) params.append("ticketName", name);
  if (category) params.append("categoryName", category);

  const res = await fetch(
    `${BASE_URL}/Tickets/get-available-ticket?${params.toString()}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return res.json();
};
export const postBooking = async (bookingData: {
  bookings: { ticketCode: string; quantity: number }[];
}) => {
  const response = await fetch(`${BASE_URL}/Bookings/book-ticket`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    let detailedMessage = "Failed to booking";

    if (errorData.errors) {
      detailedMessage = Object.values(errorData.errors).flat().join(", ");
    } else if (errorData.detail) {
      detailedMessage = errorData.detail;
    } else if (typeof errorData === "string") {
      detailedMessage = errorData;
    }

    throw new Error(detailedMessage);
  }

  return await response.json();
};

export const getBookings = async (
  bookedTicketId: string,
): Promise<BookedCategory[]> => {
  const response = await fetch(
    `${BASE_URL}/Bookings/get-booked-ticket/${bookedTicketId}`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.title || "BookedtiketId tidak terdaftar");
  }

  return response.json();
};

export const editBookedTicket = async (
  bookedTicketId: string,
  payload: EditBookedTicketPayload,
) => {
  const response = await fetch(
    `${BASE_URL}/Bookings/edit-booked-ticket/${bookedTicketId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal memperbarui tiket.");
  }
  return response.json();
};

export const revokeTicket = async (
  bookedTicketId: string,
  ticketCode: string,
  qty: number,
) => {
  const response = await fetch(
    `${BASE_URL}/Bookings/revoke-ticket/${bookedTicketId}/${ticketCode}/${qty}`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal membatalkan tiket.");
  }
  return response;
};
