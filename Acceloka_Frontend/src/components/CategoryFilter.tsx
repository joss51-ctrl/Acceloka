"use client";

interface CategoryFilterProps {
  searchName: string;
  setSearchName: (val: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  setCurrentPage: (page: number) => void;
}

export default function CategoryFilter({
  searchName,
  setSearchName,
  categories,
  activeCategory,
  onCategoryChange,
  setCurrentPage,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Search by Name"
        value={searchName}
        onChange={(e) => {
          setSearchName(e.target.value);
          setCurrentPage(1);
        }}
        className="border p-3 rounded-xl w-full md:w-1/2 bg-white outline-none focus:ring-2 focus:ring-acc-gold/50 text-black"
      />

      <div className="flex gap-2 flex-wrap">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              onCategoryChange(cat);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              activeCategory === cat || (cat === "All" && activeCategory === "")
                ? "bg-gold text-white shadow-lg"
                : "bg-white/10 text-gray-400 hover:bg-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
