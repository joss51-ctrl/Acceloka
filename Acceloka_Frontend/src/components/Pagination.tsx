"use client";

interface PaginationProps {
  currentPage: number;
  totalTickets: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}

export default function Pagination({
  currentPage,
  totalTickets,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalTickets / pageSize);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push("...");
      }
    }
    return [...new Set(pages)];
  };

  return (
    <div className="flex flex-col gap-6 mt-8">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
        >
          <span className="text-gray-400 font-bold">{"<"}</span>
        </button>

        {renderPageNumbers().map((p, idx) => (
          <button
            key={idx}
            onClick={() => typeof p === "number" && onPageChange(p)}
            disabled={p === "..."}
            className={`w-10 h-10 rounded-lg text-sm font-bold border transition-all ${
              currentPage === p
                ? "bg-gold text-white border-acc-gold shadow-md"
                : "bg-white text-acc-gold hover:border-acc-gold/50"
            } ${p === "..." ? "border-none cursor-default" : ""}`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
        >
          <span className="text-gray-400 font-bold">{">"}</span>
        </button>
      </div>
    </div>
  );
}
