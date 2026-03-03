"use client";

export default function Footer() {
  return (
    <footer className=" bg-[#1A1A1B] text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-acc-gold text-2xl tracking-tighter cursor-pointer hover:opacity-80 transition-opacity">
                Acceloka
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              The fastest and most trusted ticket reservation platform for
              various exclusive events.
            </p>
          </div>

          <div>
            <h4 className="text-acc-gold font-bold mb-4 uppercase text-xs tracking-widest">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="hover:text-acc-gold transition-colors">
                  Help Center
                </button>
              </li>
              <li>
                <button className="hover:text-acc-gold transition-colors">
                  Refund Policy
                </button>
              </li>
              <li>
                <button className="hover:text-acc-gold transition-colors">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-acc-gold font-bold mb-4 uppercase text-xs tracking-widest">
              Stalk us on
            </h4>

            <div className="flex gap-4 mt-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] transition-all duration-300 cursor-pointer group shadow-lg">
                <span className="text-[10px] font-black group-hover:text-white transition-colors">
                  IG
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-black transition-all duration-300 cursor-pointer group shadow-lg border border-transparent hover:border-gray-700">
                <span className="text-[10px] font-black group-hover:text-white transition-colors">
                  X
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#1877F2] transition-all duration-300 cursor-pointer group shadow-lg">
                <span className="text-[10px] font-black group-hover:text-white transition-colors">
                  FB
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-medium text-slate-500">
          <p>© 2026 Acceloka</p>
        </div>
      </div>
    </footer>
  );
}
