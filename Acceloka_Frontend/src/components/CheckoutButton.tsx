"use client";

interface CheckoutHeaderProps {
  totalItems: number;
  totalPrice: number;
  isSubmitting: boolean;
  onBooking: () => void;
  onReset: () => void;
}

export default function CheckoutHeader({
  totalItems,
  totalPrice,
  isSubmitting,
  onBooking,
  onReset,
}: CheckoutHeaderProps) {
  return (
    <div
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 
  bg-[#1A1A1A] p-6 rounded-2xl border border-[#D4AF37]/20 shadow-2xl"
    >
      <div>
        <h1 className="text-2xl font-black text-[#D4AF37] tracking-tight">
          Book your ticket
        </h1>
        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">
          Secure Your Seats
        </p>
      </div>

      <div className="flex flex-col items-end gap-2 w-full md:w-auto">
        <div className="text-right">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
            Total payment
          </span>
          <div className="text-3xl font-black text-white">
            {totalPrice
              .toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })
              .replace(/\s/g, "")}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto mt-2">
          <button
            onClick={onReset}
            disabled={isSubmitting || totalItems === 0}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold 
        text-gray-400 bg-transparent transition-all duration-300
        hover:text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/30 
        border border-transparent 
        disabled:opacity-20"
            title="Reset choices"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Reset
          </button>

          <button
            onClick={onBooking}
            disabled={isSubmitting || totalItems === 0}
            className="bg-gold px-10 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50

            disabled:bg-gray-400 flex-1 md:flex-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Processing..." : `Checkout (${totalItems})`}
          </button>
        </div>
      </div>
    </div>
  );
}
