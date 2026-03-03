"use client";
import { Ticket, CartItem } from "@/types";

interface TicketTableProps {
  tickets: Ticket[];
  cart: { [key: string]: CartItem };
  onQtyChange: (ticket: Ticket, qty: number) => void;
}

export default function TicketTable({
  tickets,
  cart,
  onQtyChange,
}: TicketTableProps) {
  return (
    <div className="bg-[#252525] border border-[rgba(212,175,55,0.2)] rounded-2xl overflow-hidden shadow-sm">
      {" "}
      <table className="min-w-full text-sm">
        <thead className=" border-b border-acc-gold/80 text-acc-gold uppercase text-[12px] font-extrabold tracking-widest">
          <tr>
            <th className="px-6 py-4 text-left">Ticket</th>
            <th className="px-6 py-4 text-left">Category</th>
            <th className="px-6 py-4 text-right">Price</th>
            <th className="px-6 py-4 text-center">Quota</th>
            <th className="px-6 py-4 text-center">Event Date</th>
            <th className="px-6 py-4 text-center">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-acc-gold/50 text-white">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr
                key={ticket.ticketCode}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-white">
                    {ticket.ticketName}
                  </div>
                  <div className="text-[10px] font-mono text-acc-gold">
                    {ticket.ticketCode}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="bg-goldd text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold">
                    {ticket.categoryName}
                  </span>
                </td>

                <td className="px-6 py-4 text-right font-bold text-white text-base">
                  {ticket.price
                    .toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })
                    .replace(/\s/g, "")}
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`text-xs font-black px-2 py-1 rounded-md ${
                      ticket.quota < 5
                        ? "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30"
                        : "text-gray-600 bg-goldd"
                    }`}
                  >
                    {ticket.quota}
                  </span>
                </td>

                <td className="px-6 py-4 text-center font-bold">
                  {new Date(ticket.eventDate).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </td>

                <td className="px-6 py-4 text-center">
                  <input
                    type="number"
                    min={0}
                    max={ticket.quota}
                    value={cart[ticket.ticketCode]?.qty || 0}
                    onChange={(e) =>
                      onQtyChange(ticket, parseInt(e.target.value) || 0)
                    }
                    className="w-20 text-center border-2 border-gray-100 rounded-lg py-1 font-bold focus:border-blue-400 outline-none"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-gray-400 italic"
              >
                Data not found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
