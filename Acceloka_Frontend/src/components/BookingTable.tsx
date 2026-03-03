"use client";

import { useEffect, useState, useCallback } from "react";
import { getBookings, revokeTicket, editBookedTicket } from "@/services/api";
import { BookedCategory } from "@/types";

interface BookingTableProps {
  bookingHistory: string[];
}

export default function BookingTable({ bookingHistory }: BookingTableProps) {
  const [bookedCategories, setBookedCategories] = useState<BookedCategory[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchId, setSearchId] = useState("");

  const latestId = bookingHistory.length > 0 ? bookingHistory[0] : null;

  const [revokeId, setRevokeId] = useState("");
  const [revokeCode, setRevokeCode] = useState("");
  const [revokeQty, setRevokeQty] = useState("");

  const handleManualRevoke = async () => {
    if (!revokeId.trim() || !revokeCode.trim() || !revokeQty.trim()) {
      alert("All fields must be filled in");
      return;
    }

    const qtyInt = parseInt(revokeQty);
    if (isNaN(qtyInt) || qtyInt < 1) {
      alert("Quantity must be over 1");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to revoke ticket ${revokeCode} with quantity ${qtyInt}?`,
      )
    )
      return;

    try {
      await revokeTicket(revokeId.trim(), revokeCode.trim(), qtyInt);
      alert("Ticket successfully revoked!");

      fetchAllData(searchId);

      setRevokeId("");
      setRevokeCode("");
      setRevokeQty("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to revoke ticket";

      alert("Failed to Revoke: " + message);
    }
  };

  const fetchAllData = useCallback(
    async (manualId?: string) => {
      setLoading(true);
      setError(null);

      try {
        const idsToFetch = manualId?.trim()
          ? [manualId.trim().toUpperCase()]
          : bookingHistory;

        if (idsToFetch.length === 0) {
          setBookedCategories([]);
          setLoading(false);
          return;
        }

        let allData: BookedCategory[] = [];

        for (const id of idsToFetch) {
          try {
            const data = await getBookings(id.trim());

            const mapped = data.map((category: BookedCategory) => ({
              ...category,
              bookedTicketId: id.trim(),
            }));

            allData = [...allData, ...mapped];
          } catch (err: unknown) {
            if (manualId) {
              setError("Ticket Id not found");
              setBookedCategories([]);
              setLoading(false);
              return;
            }
          }
        }

        setBookedCategories(allData);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load data";

        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [bookingHistory],
  );

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleRevoke = async (
    bookedId: string,
    code: string,
    maxQty: number,
  ) => {
    if (!bookedId?.trim()) return;

    const inputQty = prompt(
      `How many tickets for ${code} do you want to revoke? (Max: ${maxQty})`,
      maxQty.toString(),
    );

    if (inputQty === null) return;

    const qtyInt = parseInt(inputQty);

    if (isNaN(qtyInt) || qtyInt < 1) {
      alert("Please enter a valid number (minimum 1).");
      return;
    }

    if (qtyInt > maxQty) {
      alert(`You cannot revoke more than you have (${maxQty} tickets).`);
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to revoke ${qtyInt} ticket(s) for ${code}?`,
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      const formattedId = bookedId.trim().toUpperCase();
      await revokeTicket(formattedId, code, qtyInt);
      alert("Ticket successfully revoked!");

      await fetchAllData();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Internal Server Error";

      alert("Failed to Revoke: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string, code: string, currentQty: number) => {
    const newQty = prompt(
      `Enter new amount for ticket ${code}:`,
      currentQty.toString(),
    );
    if (!newQty) return;

    const qtyInt = parseInt(newQty);
    if (isNaN(qtyInt) || qtyInt < 1) {
      alert("Quantity must be over 1");
      return;
    }

    try {
      const payload = {
        items: [{ ticketCode: code, newQuantity: qtyInt }],
      };

      await editBookedTicket(id.trim(), payload);
      alert("Ticket successfully updated!");

      fetchAllData(searchId);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update ticket";

      alert("Failed: " + message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {latestId && (
        <div className="relative mb-8 overflow-hidden p-6 shadow-2xl rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#F1D27C] to-[#B8860B] border border-[#D4AF37]/50">
          <div className="absolute pointer-events-none top-0 -right-10 w-48 h-48 bg-white/20 rotate-45 blur-3xl"></div>

          <div className="relative z-10">
            <p className="text-black/60 text-[10px] uppercase font-black tracking-widest mb-1">
              Transaction Receipt
            </p>

            <h2 className="mb-4 text-xl font-black text-black">
              Booking Success!
            </h2>

            <div className="p-4 border backdrop-blur-md rounded-xl bg-black/10 border-black/5">
              <p className="text-[10px] text-black/60 mb-1 font-bold">
                BOOKED TICKET ID:
              </p>

              <div className="flex items-center justify-between gap-4">
                <code className="font-mono text-sm font-black text-black break-all">
                  {latestId}
                </code>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(latestId);
                    alert("ID copied!");
                  }}
                  className="shrink-0 px-4 py-2 text-xs font-bold text-[#D4AF37] bg-black rounded-lg hover:bg-black/80 transition-all shadow-lg active:scale-95"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-black p-6 rounded-2xl border border-gray-200 shadow-sm">
        <label className="block text-sm font-black text-white mb-2 uppercase">
          Search by ticket id
        </label>
        <div className="flex gap-2 text-white">
          <input
            type="text"
            placeholder="Your ticket id"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
          />
          <button
            onClick={() => fetchAllData(searchId)}
            className="bg-gold text-white px-6 py-3 rounded-xl font-bold hover:bg-black text-sm"
          >
            Search
          </button>
        </div>
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-900/20 border border-red-700/40 backdrop-blur-sm">
            <p className="text-red-400 text-sm font-semibold text-center">
              {error}
            </p>
          </div>
        )}{" "}
      </div>

      <div className="bg-black p-6 rounded-2xl border border-gray-200 shadow-sm">
        <label className="block text-sm font-black text-white mb-2 uppercase">
          Revoke Ticket
        </label>

        <div className="flex flex-col gap-3 text-white">
          <input
            type="text"
            placeholder="Your Ticket Id"
            value={revokeId}
            onChange={(e) => setRevokeId(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-700 outline-none text-sm"
          />

          <input
            type="text"
            placeholder="Your Ticket Code"
            value={revokeCode}
            onChange={(e) => setRevokeCode(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-700 outline-none text-sm"
          />

          <input
            type="number"
            placeholder="How many?"
            value={revokeQty}
            onChange={(e) => setRevokeQty(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-700 outline-none text-sm"
          />

          <button
            onClick={handleManualRevoke}
            className="bg-gold text-white px-6 py-3 rounded-xl font-bold text-sm"
          >
            Revoke
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-10 text-center animate-pulse text-gray-500">
          Loading data
        </div>
      )}

      {!loading &&
        bookedCategories.map((group, idx) => (
          <div
            key={`${group.bookedTicketId}-${idx}`}
            className="relative mb-6 overflow-hidden p-6 shadow-2xl rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#F1D27C] to-[#B8860B] border border-[#D4AF37]/50"
          >
            <div className="absolute pointer-events-none top-0 -right-10 w-48 h-48 bg-white/20 rotate-45 blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-black/60 text-[10px] uppercase font-black tracking-widest mb-1">
                    Booking Record
                  </p>
                  <h3 className="font-mono text-sm font-black text-black bg-black/5 px-2 py-1 rounded border border-black/5 inline-block">
                    ID: {group.bookedTicketId}
                  </h3>
                  <p className="text-[10px] text-black/70 mt-2 font-bold uppercase">
                    Category:{" "}
                    <span className="text-black">{group.categoryName}</span>
                  </p>
                </div>
                <div className="bg-black text-[#D4AF37] px-4 py-1 rounded-full font-black text-[10px] shadow-lg">
                  {group.qtyPerCategory} TICKETS
                </div>
              </div>

              <div className="border backdrop-blur-md rounded-xl bg-black/10 border-black/5 overflow-hidden">
                <table className="min-w-full text-sm table-fixed">
                  <tbody className="divide-y divide-black/5">
                    {group.tickets.map((ticket) => (
                      <tr
                        key={ticket.ticketCode}
                        className="hover:bg-black/5 transition-colors group"
                      >
                        <td className="px-6 py-4 w-1/2">
                          <div className="font-black text-black">
                            {ticket.ticketName}
                          </div>
                          <div className="text-[10px] font-mono text-black/60">
                            {ticket.ticketCode}
                          </div>
                        </td>

                        <td className="text-black/70 text-xs font-bold">
                          {new Date(ticket.eventDate).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-3 justify-end">
                            <button
                              onClick={() =>
                                handleEdit(
                                  group.bookedTicketId,
                                  ticket.ticketCode,
                                  group.qtyPerCategory,
                                )
                              }
                              className="bg-black/80 hover:bg-black text-[#D4AF37] text-[10px] font-black px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-md"
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() =>
                                handleRevoke(
                                  group.bookedTicketId,
                                  ticket.ticketCode,
                                  group.qtyPerCategory,
                                )
                              }
                              className="bg-gold hover:text-white text-[10px] font-black px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-md"
                            >
                              REVOKE
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
