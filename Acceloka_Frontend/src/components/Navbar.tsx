"use client";
interface NavbarProps {
  activeView: string;
  onNavigate: (
    view: "home" | "available" | "about",
    tab?: "available" | "my-bookings",
  ) => void;
}

export default function Navbar({ activeView, onNavigate }: NavbarProps) {
  return (
    <nav
      className="sticky top-0 z-50 bg-[#1A1A1B] backdrop-blur-md border-b px-12 py-4 
    flex justify-between items-center shadow-sm"
    >
      <div
        className="text-acc-gold text-2xl tracking-tighter "
        onClick={() => onNavigate("home")}
      >
        ACCELOKA
      </div>

      <div className="flex gap-8 items-center font-bold text-acc-gold/70">
        <button
          onClick={() => onNavigate("home")}
          className={`transition-colors ${
            activeView === "home"
              ? "text-acc-gold cursor-default"
              : "text-gold hover:text-acc-gold"
          }`}
        >
          Home
        </button>

        <div className="group relative py-2">
          <button
            className={`flex items-center gap-1 transition-colors ${
              activeView === "available" || activeView === "my-bookings"
                ? "text-acc-gold cursor-default"
                : "text-gold hover:text-acc-gold"
            }`}
          >
            Booking
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div className="absolute hidden group-hover:block bg-white border border-gray-100 shadow-2xl rounded-2xl mt-1 py-3 w-52 left-0">
            <button
              onClick={() => onNavigate("available", "available")}
              className="flex items-center gap-3 w-full text-left px-5 py-2.5 hover:bg-acc-gold/20 text-sm font-semibold"
            >
              Find Tickets
            </button>
            <button
              onClick={() => onNavigate("available", "my-bookings")}
              className="flex items-center gap-3 w-full text-left px-5 py-2.5 hover:bg-acc-gold/20  text-sm font-semibold"
            >
              My Bookings
            </button>
          </div>
        </div>

        <button
          onClick={() => onNavigate("about")}
          className={`transition-colors ${
            activeView === "about"
              ? "text-acc-gold cursor-default"
              : "text-gold hover:text-acc-gold"
          }`}
        >
          About
        </button>
      </div>

      <div className="flex gap-4">
        <button className="text-acc-gold/70 font-bold hover:text-acc-gold transition-colors text-sm px-4">
          Login
        </button>
        <button
          className="bg-gold px-6 py-2.5 rounded-full font-bold  
        shadow-lg 
        transition-all text-sm active:scale-95"
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
}
