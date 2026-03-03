"use client";

import { useEffect, useState } from "react";
import { getAvailableTickets, postBooking } from "@/services/api";
import { Ticket, CartItem } from "@/types";

import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import CheckoutButton from "@/components/CheckoutButton";
import TicketTable from "@/components/TicketTable";
import BookingModal from "@/components/BookingModal";
import BookingTable from "@/components/BookingTable";
import CategoryFilter from "@/components/CategoryFilter";

export default function HomePage() {
  const [view, setView] = useState<"home" | "available" | "about">("home");
  const [activeTab, setActiveTab] = useState<"available" | "my-bookings">(
    "available",
  );

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingHistory, setBookingHistory] = useState<string[]>([]);

  const categories = [
    "Cinema",
    "Hotel",
    "Transportasi Darat",
    "Transportasi Laut",
  ];

  const navigateTo = (
    targetView: "home" | "available" | "about",
    targetTab?: "available" | "my-bookings",
  ) => {
    setView(targetView);
    if (targetTab) setActiveTab(targetTab);
  };

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        const response = await getAvailableTickets(
          currentPage,
          pageSize,
          searchName,
          searchCategory,
        );
        setTickets(response.tickets || []);
        setTotalTickets(response.totalTickets || 0);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Tickets not found");
      } finally {
        setLoading(false);
      }
    };

    if (view === "available") loadTickets();
  }, [currentPage, pageSize, view, searchName, searchCategory]);

  const totalItems = Object.values(cart).reduce(
    (sum, item) => sum + item.qty,
    0,
  );
  const totalPrice = Object.values(cart).reduce(
    (sum, item) => sum + item.ticket.price * item.qty,
    0,
  );

  const handleQtyChange = (ticket: Ticket, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) {
        const newCart = { ...prev };
        delete newCart[ticket.ticketCode];
        return newCart;
      }
      return { ...prev, [ticket.ticketCode]: { ticket, qty } };
    });
  };

  const handleReset = () => {
    if (Object.values(cart).length > 0 && confirm("Empty booking?")) {
      setCart({});
    }
  };

  const handleBookingSubmit = async () => {
    const bookings = Object.values(cart)
      .filter((item) => item.qty > 0)
      .map((item) => ({
        ticketCode: item.ticket.ticketCode,
        quantity: item.qty,
      }));

    if (bookings.length === 0) return alert("Booking empty");

    try {
      setIsSubmitting(true);
      const response = await postBooking({ bookings });
      const newId = response.bookedTicketId;

      setBookingHistory((prev) => [newId, ...prev]);
      alert(`Transaction success!\nID Transaction: ${newId}`);

      setCart({});
      setIsModalOpen(false);
      setActiveTab("my-bookings");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black font-sans">
      <Navbar activeView={view} onNavigate={navigateTo} />

      <div className="max-w-6xl mx-auto py-10 px-6">
        {view === "home" && (
          <div className="text-center py-20">
            <h1 className="text-5xl font-black text-white mb-4">Welcome to</h1>
            <h1 className="text-5xl text-acc-gold mb-4 tracking-tighter">
              Acceloka
            </h1>
            <p className="text-white text-lg mb-8">
              Your all in one solution tickets
            </p>
            <button
              onClick={() => navigateTo("available", "available")}
              className="bg-gold text-white px-6 py-4 rounded-2xl font-bold shadow-lg transition-all"
            >
              Grab your ticket!
            </button>
          </div>
        )}

        {view === "available" && (
          <section>
            <nav className="flex gap-8 border-b border-white/10 mb-8">
              <button
                onClick={() => setActiveTab("available")}
                className={`pb-4 px-2 font-bold transition-all ${
                  activeTab === "available"
                    ? "border-b-4 border-acc-gold text-acc-gold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Find Tickets
              </button>
              <button
                onClick={() => setActiveTab("my-bookings")}
                className={`pb-4 px-2 font-bold transition-all ${
                  activeTab === "my-bookings"
                    ? "border-b-4 border-acc-gold text-acc-gold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                My Bookings
              </button>
            </nav>

            {activeTab === "available" ? (
              <div className="space-y-6">
                <CheckoutButton
                  totalItems={totalItems}
                  totalPrice={totalPrice}
                  isSubmitting={isSubmitting}
                  onBooking={() => setIsModalOpen(true)}
                  onReset={handleReset}
                />

                <CategoryFilter
                  searchName={searchName}
                  setSearchName={setSearchName}
                  categories={categories}
                  activeCategory={activeCategory}
                  setCurrentPage={setCurrentPage}
                  onCategoryChange={(cat) => {
                    const categoryValue = cat === "All" ? "" : cat;
                    setActiveCategory(cat);
                    setSearchCategory(categoryValue);
                  }}
                />

                <TicketTable
                  tickets={tickets}
                  cart={cart}
                  onQtyChange={handleQtyChange}
                />

                <Pagination
                  currentPage={currentPage}
                  totalTickets={totalTickets}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                />
              </div>
            ) : (
              <BookingTable bookingHistory={bookingHistory} />
            )}
          </section>
        )}

        {view === "about" && (
          <div className="py-20 px-6 max-w-4xl mx-auto text-center">
            <h2 className=" md:text-5xl mb-8">
              <span className="font-black bg-gradient-to-b from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                About{" "}
              </span>
              <span className="text-acc-gold tracking-tighter">Acceloka</span>
            </h2>
            <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl rounded-full"></div>
              <p className="text-gray-300 leading-relaxed text-lg md:text-xl font-medium">
                <span className="text-acc-gold tracking-tighter">Acceloka</span>{" "}
                is a modern ticket management platform designed to deliver a
                seamless, secure, and premium booking experience. Built with
                precision and performance in mind, Acceloka simplifies the way
                users discover, reserve, manage, and modify their tickets — all
                within a clean and intuitive interface.
              </p>
              <div className="h-[1px] w-20 bg-[#D4AF37]/30 mx-auto my-8"></div>
            </div>
          </div>
        )}
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleBookingSubmit}
        cart={cart}
        totalPrice={totalPrice}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}
