"use client";
import { CartItem } from "@/types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cart: { [key: string]: CartItem };
  totalPrice: number;
  isSubmitting: boolean;
}

export default function BookingModal({
  isOpen,
  onClose,
  onConfirm,
  cart,
  totalPrice,
  isSubmitting,
}: BookingModalProps) {
  if (!isOpen) return null;

  const selectedTickets = Object.values(cart).filter((item) => item.qty > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-black rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b bg-black">
          <h2 className="text-xl font-bold text-acc-gold">
            Order Confirmation
          </h2>
          <p className="text-sm text-white">
            Please double check your ticket details before booking.
          </p>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {selectedTickets.map((item) => (
              <div
                key={item.ticket.ticketCode}
                className="flex justify-between items-center border-b pb-3 last:border-0"
              >
                <div>
                  <p className="font-bold text-acc-gold">
                    {item.ticket.ticketName}
                  </p>
                  <p className="text-xs text-white">
                    {item.qty} x{" "}
                    {item.ticket.price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                </div>
                <p className="font-bold text-white">
                  {(item.ticket.price * item.qty)
                    .toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })
                    .replace(/\s/g, "")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-black border-t">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-acc-gold">Total payment:</span>
            <span className="text-2xl font-black text-white">
              {totalPrice
                .toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                })
                .replace(/\s/g, "")}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-white hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-[2] bg-gold text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Processing" : "Book now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
