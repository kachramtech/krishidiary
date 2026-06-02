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
    setFinancialYear,
    clearAllDatabaseData,
    showConfirm
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
        {currentUser?.id === "guest" ? (
          <div className="flex items-center space-x-2.5 bg-amber-950/30 border border-amber-850/40 rounded-2xl px-3 py-1.5 text-xs font-sans">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shrink-0"></span>
            <div className="leading-tight text-amber-400 font-medium">
              <span className="font-extrabold uppercase text-[10px] block text-amber-300">⚠️ ऑफलाइन मोड (अतिथि)</span>
              <span className="text-[9px] block text-slate-300 mt-0.5">डेटा केवल आपके ब्राउज़र (LocalStorage) में है, लाइव क्लाउड सिंक हेतु गूगल से लॉगिन करें।</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2.5 bg-emerald-950/30 border border-emerald-850/40 rounded-2xl px-3 py-1.5 text-xs font-sans">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping shrink-0"></span>
            <div className="leading-tight text-emerald-400">
              <span className="font-extrabold uppercase text-[10px] block text-emerald-300">✓ क्लाउड सिंक active</span>
              <span className="text-[9px] block text-slate-350 mt-0.5">डेटा रियल-टाइम में सुरक्षित रूप से आपके लाइव फायरबेस डेटाबेस (Firestore) में जा रहा है।</span>
            </div>
          </div>
        )}

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
              onClick={() => {
                showConfirm(
                  "डेटा साफ करें ⚠️",
                  "क्या आप निश्चित रूप से पूरा डेमो और सिंक किया गया डेटा साफ करना चाहते हैं? यह प्रक्रिया अपरिवर्तनीय है एवं आपका संपूर्ण डेटा स्थायी रूप से मिटा दिया जाएगा!",
                  () => clearAllDatabaseData()
                );
              }}
              className="text-rose-400 hover:text-white hover:bg-rose-950 px-3 py-1.5 rounded-xl border border-rose-900/40 bg-[#160f1c] font-black text-xs tracking-wide transition-all outline-none"
            >
              🗑️ डेटा साफ करें
            </button>
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
