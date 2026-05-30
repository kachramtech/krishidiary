import React from "react";
import { Sprout, Smartphone, Monitor, Database, Activity } from "lucide-react";
import { useAppState } from "../../context/AppContext";

export const Header: React.FC = () => {
  const {
    activeViewMode,
    setActiveViewMode,
    currentUser,
    handleLogout,
    financialYear,
    setFinancialYear
  } = useAppState();

  return (
    <header className="bg-[#0b1329] border-b border-indigo-950 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl shadow-md cursor-pointer active:scale-95 transition-all">
          <Sprout className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-base font-black tracking-tight flex items-center space-x-1 font-sans">
            <span>डिजिटल कृषि हब</span>
            <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
              Enterprise Suite v4.0
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 font-medium">1000+ किसान एवं मल्टी-ऑपरेटर ऑटो-मेशन सिस्टम</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Toggle Mode */}
        <div className="flex bg-[#0f172a] p-1 rounded-2xl border border-indigo-950/40 text-xs">
          <button
            onClick={() => setActiveViewMode("desktop")}
            className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-xl font-bold transition-all ${activeViewMode === "desktop" ? "bg-emerald-600 text-white shadow-md font-sans" : "text-slate-400 hover:text-white"}`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>सुपर एडमिन (Desktop)</span>
          </button>
          <button
            onClick={() => setActiveViewMode("mobile")}
            className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-xl font-bold transition-all ${activeViewMode === "mobile" ? "bg-emerald-600 text-white shadow-md font-sans" : "text-slate-400 hover:text-white"}`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>ऑपरेटर काउंटर (Mobile UI)</span>
          </button>
        </div>

        {/* Financial Year Selector */}
        <select
          value={financialYear}
          onChange={(e: any) => setFinancialYear(e.target.value)}
          className="bg-[#0f172a] border border-indigo-950 text-xs rounded-2xl p-2 px-3 text-emerald-300 font-sans font-bold outline-none cursor-pointer focus:border-emerald-500"
        >
          <option value="2026-2027">FY 2026-2027</option>
          <option value="2025-2026">FY 2025-2026</option>
        </select>

        {/* Sync status */}
        <div className="flex items-center space-x-2 bg-emerald-950/25 border border-emerald-900/40 rounded-2xl px-3 py-1.5 text-xs text-emerald-400 font-bold font-sans">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
          <span>क्लाउड सिंक active</span>
        </div>

        {/* User profile details */}
        {currentUser && (
          <div className="flex items-center space-x-3 pl-2 sm:border-l border-slate-800">
            <div className="text-right leading-none">
              <span className="block text-xs font-bold text-slate-200">{currentUser.name}</span>
              <span className="text-[9px] text-amber-400 font-sans uppercase font-bold">
                {currentUser.role === "super_admin" ? "⚙️ सुपर एडमिन" : "🌾 काउंटर ऑपरेटर"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 font-bold text-xs tracking-wide bg-[#0f172a] hover:bg-rose-950 px-3 py-1.5 rounded-xl border border-slate-800/80 transition-all outline-none"
            >
              साइन आउट
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
