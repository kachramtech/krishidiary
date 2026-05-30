import React, { useState } from "react";
import { useAppState } from "../context/AppContext";
import { FarmerFormModal } from "../components/farmers/FarmerFormModal";
import { TransactionFormModal } from "../components/transactions/TransactionFormModal";
import { LaborFormModal } from "../components/labor/LaborFormModal";
import { MandiCalcWidget } from "../components/transactions/MandiCalcWidget";
import { LiveMandiRates } from "../components/mandi/LiveMandiRates";
import { TipsCarousel } from "../components/common/TipsCarousel";
import {
  Mic,
  Plus,
  Search,
  Users,
  Sprout,
  DollarSign,
  ClipboardCheck,
  Activity,
  Trash,
  CheckCircle,
  FileSpreadsheet,
  Layers,
  Home,
  Database
} from "lucide-react";

export const MobileOperatorView: React.FC = () => {
  const {
    farmers,
    farmerSearch,
    setFarmerSearch,
    transactions,
    labors,
    overallIncome,
    overallExpense,
    overallProfit,
    mobileTab,
    setMobileTab,
    isRecording,
    recordingSeconds,
    handleToggleVoiceRecord,
    deleteTransaction,
    deleteLabor,
    triggerWhatsAppReminder
  } = useAppState();

  const [showFarmerModal, setShowFarmerModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [showLaborModal, setShowLaborModal] = useState(false);

  // Filtered farmers
  const filteredFarmers = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      f.village.toLowerCase().includes(farmerSearch.toLowerCase())
  );

  const [txForm, setTxForm] = useState({}); // placeholder setter for voice

  return (
    <div className="bg-slate-50 min-h-[85vh] text-slate-800 flex flex-col justify-between pb-24 font-sans relative text-xs text-left leading-normal select-none">
      
      {/* Banner info */}
      <TipsCarousel />

      <main className="p-4 flex-1 space-y-4">
        {/* ========================================================
            TAB 1: HOME (त्वरित प्रविष्टि / वौइस् डैशबोर्ड)
            ======================================================== */}
        {mobileTab === "home" && (
          <div className="space-y-4 animate-scaleIn">
            
            {/* Operator Greeting Welcome Banner */}
            <div className="bg-gradient-to-tr from-emerald-850 from-emerald-800 to-teal-700 text-white p-5 rounded-3xl shadow-md border border-emerald-700 flex justify-between items-center">
              <div>
                <span className="text-[9.5px] uppercase tracking-wider font-extrabold bg-emerald-900 px-2 py-0.5 rounded-full block w-fit">
                  काउंटर ऑपरेटर डैशबोर्ड
                </span>
                <strong className="text-sm font-black mt-1.5 block tracking-tight">किसान सेवा काउंटर प्रविष्टि</strong>
                <span className="text-[10px] text-emerald-100 mt-0.5 block">सीधे बोलकर प्रविष्टि करें या प्रपत्र भरे!</span>
              </div>
              <Sprout className="h-10 w-10 text-emerald-300 animate-pulse" />
            </div>

            {/* AI Voice Assistant shortcut Block */}
            <div className="bg-slate-900 text-white p-4.5 rounded-3xl border border-slate-800 text-center space-y-3.5">
              <div>
                <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  AI आवाज़ रिकॉर्डर (Hindi Voice Input)
                </span>
                <p className="text-[10.5px] text-slate-400 mt-1 leading-normal">
                  "रामचंद्र पाटीदार यूरिया खाद सत्र खर्चा ₹14,800" बोलकर डेटा सीधे प्रपत्र में दर्ज करें।
                </p>
              </div>

              <button
                onClick={() => handleToggleVoiceRecord(setTxForm, setShowTxModal)}
                className={`py-3 px-6 rounded-full font-black text-xs text-center mx-auto flex items-center space-x-2 transition-all outline-none border ${isRecording ? "bg-red-650 bg-red-650 animate-pulse border-red-500 text-white" : "bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-white shadow-lg"}`}
              >
                <Mic className={`h-5 w-5 ${isRecording ? "animate-bounce" : ""}`} />
                <span>{isRecording ? `${recordingSeconds}s रिकॉर्डिंग रोकें` : "🎤 हिन्दी में बोलकर एंट्री दर्ज करें"}</span>
              </button>
            </div>

            {/* Quick entry links trigger panels */}
            <div className="grid grid-cols-2 gap-3 centering-text">
              <button
                onClick={() => setShowTxModal(true)}
                className="p-4 bg-white border border-slate-200/85 hover:border-slate-300 rounded-3xl shadow-xs text-center flex flex-col items-center justify-center space-y-1.5 active:scale-95 transition-all outline-none"
              >
                <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-full">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <strong className="font-extrabold text-slate-800 block text-xs leading-none">मंडी बिकावली</strong>
                  <span className="text-[9px] text-slate-400">फसल एवं खर्चा जोड़ें</span>
                </div>
              </button>

              <button
                onClick={() => setShowLaborModal(true)}
                className="p-4 bg-white border border-slate-200/85 hover:border-slate-300 rounded-3xl shadow-xs text-center flex flex-col items-center justify-center space-y-1.5 active:scale-95 transition-all outline-none"
              >
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-full">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                  <strong className="font-extrabold text-slate-800 block text-xs leading-none">लेबर हाजिरी</strong>
                  <span className="text-[9px] text-slate-400">मजदूर दैनिक दर्ज</span>
                </div>
              </button>
            </div>

            {/* Interactive Calculator and rates slider */}
            <MandiCalcWidget />
            <LiveMandiRates />
          </div>
        )}

        {/* ========================================================
            TAB 2: FARMS (किसान प्रोफाइल तथा खेत प्लॉट)
            ======================================================== */}
        {mobileTab === "farms" && (
          <div className="space-y-4 animate-scaleIn text-xs">
            
            <div className="bg-white p-4.5 rounded-3xl border border-slate-200 space-y-4 shadow-sm text-left">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-black text-slate-800 text-[12px] tracking-tight">किसान रेजिस्टेंस बुक (Farms Folder)</h4>
                  <p className="text-[10px] text-slate-400">किसान का गांव या नाम खोजें या तुरंत रजिस्ट्रेशन करें</p>
                </div>
                <button
                  onClick={() => setShowFarmerModal(true)}
                  className="p-2 bg-emerald-800 border border-emerald-600 hover:border-emerald-500 rounded-xl text-white font-extrabold text-[10px] flex items-center space-x-1 outline-none transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>रजिस्टर 🌾</span>
                </button>
              </div>

              {/* Local Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400 h-3.5 w-3.5" />
                <input
                  type="text"
                  placeholder="खोजे: नाम या गाँव..."
                  value={farmerSearch}
                  onChange={(e) => setFarmerSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-2xl outline-none focus:border-emerald-600 text-[11px] font-sans font-medium"
                />
              </div>

              {/* Farmers display list */}
              <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                {filteredFarmers.map((farmer) => (
                  <div key={farmer.id} className="bg-slate-50 border border-slate-200/85 p-3.5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center border-b border-indigo-950/5 pb-1 font-sans">
                      <div>
                        <strong className="font-black text-slate-850 text-xs block leading-tight">{farmer.name}</strong>
                        <span className="text-[9.5px] text-slate-400 font-bold block mt-0.5">📞 {farmer.phone} | 📍 {farmer.village}</span>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded font-black font-sans">
                        {farmer.totalAcreage} एकड़
                      </span>
                    </div>

                    {/* Plots list brief */}
                    {farmer.farms && farmer.farms.length > 0 && (
                      <div className="space-y-1">
                        {farmer.farms.map((p, i) => (
                          <div key={p.id || i} className="bg-white p-2 rounded-xl border border-slate-200 text-[10px] flex justify-between font-sans">
                            <span className="font-semibold text-slate-700">{p.name}</span>
                            <span className="text-slate-400 font-bold">{p.acreage} एकड़ | {p.activeCrop}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: LABOR (मजदूर हाजिरी डायरी / Logs review)
            ======================================================== */}
        {mobileTab === "labor" && (
          <div className="space-y-4 animate-scaleIn text-xs">
            <div className="bg-indigo-950 text-white p-4 rounded-3xl border border-indigo-900 flex justify-between items-center gap-3">
              <div>
                <strong className="text-xs font-black block">मजदूर एवं ठेका हाजिरी बही</strong>
                <span className="text-[9.5px] text-slate-300">सीधे हाजिरी लॉग मिटाएं, एडवांस भुगतान और बकाया शेष की ट्रैकिंग रखें।</span>
              </div>
              <button
                onClick={() => setShowLaborModal(true)}
                className="p-1.5 bg-emerald-700 hover:bg-emerald-600 font-extrabold border border-emerald-500 rounded-lg text-[10.5px] flex items-center space-x-1 shrink-0 outline-none"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>हाजिरी जोड़ें 👤</span>
              </button>
            </div>

            {/* List entries of labor work */}
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {labors && labors.length > 0 ? (
                labors.map((lab) => {
                  const correlatedFarmer = farmers.find((f) => f.id === lab.farmerId);
                  return (
                    <div key={lab.id} className="bg-white border border-slate-200/85 p-3.5 rounded-3xl text-left shadow-xs space-y-2 font-sans">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <div>
                          <p className="font-black text-slate-800">
                            👤 {lab.mode === "individual" ? lab.individualDetails?.laborerName : lab.bulkDetails?.groupName}
                          </p>
                          <span className="text-[9px] text-slate-405 text-slate-400 block mt-0.5">
                            प्रबंधक: <strong className="text-slate-600">{correlatedFarmer?.name || "अज्ञात"}</strong>
                          </span>
                        </div>
                        <span className="text-[9px] bg-indigo-50 text-indigo-800 border border-indigo-100 font-bold px-1.5 py-0.5 rounded uppercase">
                          {lab.mode === "individual" ? "DAILY LABOR" : `CONTRACTOR x${lab.bulkDetails?.workersCount}`}
                        </span>
                      </div>

                      <div className="bg-slate-55 border-slate-100 bg-slate-50 p-2.5 rounded-xl border flex justify-between text-[10px] items-center">
                        <div>
                          <span className="text-slate-400 block">तय मजदूरी</span>
                          <strong className="text-slate-700 font-bold font-mono text-[10px]">₹{lab.contractAmount}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">एडवांस</span>
                          <strong className="text-emerald-700 font-bold font-mono text-[10px]">₹{lab.advancePaid}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">शेष बकाया</span>
                          <strong className="text-indigo-800 font-black font-mono text-[10px]">₹{lab.dueBalance}</strong>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-100 pt-2 text-[10px]">
                        <span className="text-slate-400 font-mono font-bold">दिनाक: {lab.date}</span>
                        <button
                          onClick={() => deleteLabor(lab.id)}
                          className="text-rose-600 hover:text-rose-800 font-extrabold flex items-center space-x-0.5 outline-none hover:bg-rose-50 px-1.5 py-0.5 rounded"
                        >
                          <Trash className="h-3 w-3" />
                          <span>रद्द करें</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-[10.5px] italic text-slate-400 text-center py-10 font-sans">
                  कोई लेबर हाजिरी बही दर्ज नहीं है।
                </p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: REPORTS (मोबाइल-मैप्ड बिकावली Ledger)
            ======================================================== */}
        {mobileTab === "reports" && (
          <div className="space-y-4 animate-scaleIn text-xs">
            {/* Top overview widget */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl text-white text-center space-y-1">
              <span className="text-[9px] text-indigo-400 tracking-wider block font-bold uppercase mb-1">कुल समेकित शुद्ध लाभ (Earning Share)</span>
              <strong className="font-mono text-[22px] font-black text-emerald-400 leading-none">
                ₹{overallProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </strong>
              <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2 font-mono">
                <span>कमाई: ₹{overallIncome.toLocaleString()}</span>
                <span>लागत: ₹{overallExpense.toLocaleString()}</span>
              </div>
            </div>

            {/* List transactions ledger */}
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {transactions && transactions.length > 0 ? (
                transactions.map((t) => {
                  const targetFarmer = farmers.find((f) => f.id === t.farmerId);
                  const isIncome = t.type === "income";
                  return (
                    <div key={t.id} className="bg-white border border-slate-200 p-3.5 rounded-3xl space-y-2.5 shadow-xs font-sans">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <div>
                          <strong className="font-black text-slate-850 block leading-tight">{targetFarmer?.name}</strong>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{t.crop} | श्रेणी: {t.category}</span>
                        </div>
                        <span className={`text-[10px] font-black font-mono px-2 py-0.5 border rounded ${isIncome ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-rose-50 border-rose-100 text-rose-800"}`}>
                          {isIncome ? "+" : "-"}₹{t.amount.toLocaleString()}
                        </span>
                      </div>

                      {/* Mandi specific elements */}
                      {t.isMandiSale && t.mandiDetails && (
                        <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-2xl text-[9.5px] font-mono leading-relaxed select-text">
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-sans">सकल वज़न मंडी:</span>
                            <span className="text-slate-705 font-bold">{t.mandiDetails.grossWeight} q</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-sans">कटौती वज़न:</span>
                            <span className="text-rose-400 font-bold">-{t.mandiDetails.deductions} q ({t.mandiDetails.deductionRate}%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-sans">मंडी भाव / q:</span>
                            <span className="text-emerald-800 font-bold font-sans">₹{t.mandiDetails.ratePerQuintal}</span>
                          </div>
                        </div>
                      )}

                      {/* Due Collection elements */}
                      {t.isCreditSale && t.creditDetails && t.paymentStatus !== "paid" && (
                        <div className="bg-rose-50 border border-rose-100/50 p-2 rounded-xl text-[9px] font-bold text-rose-800 flex justify-between items-center">
                          <span>ऋण देय शेष: ₹{t.creditDetails.pendingAmount.toLocaleString()}</span>
                          <button
                            onClick={() => triggerWhatsAppReminder(t)}
                            className="bg-emerald-600 text-white font-sans text-[8.5px] px-2 py-0.5 rounded cursor-pointer"
                          >
                            रिमाइंडर WhatsApp 💬
                          </button>
                        </div>
                      )}

                      <div className="flex justify-between border-t border-slate-100 pt-2 text-[9.5px] font-mono">
                        <span className="text-slate-400">तिथि: {t.date}</span>
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="text-rose-600 hover:text-rose-800 font-extrabold flex items-center space-x-0.5 hover:bg-rose-50 px-1.5 py-0.5 rounded"
                        >
                          <Trash className="h-3 w-3" />
                          <span>हटाएं</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-[10.5px] italic text-slate-400 text-center py-10 font-sans">
                  कोई वित्तीय प्रविष्टि उपलब्ध नहीं है।
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          BOTTOM TAB BAR NAVIGATION (Touch optimized UI controller)
          ======================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#0b1329] border-t border-indigo-950 px-3 py-2 flex justify-around shadow-2xl">
        <button
          onClick={() => setMobileTab("home")}
          className={`flex flex-col items-center justify-center p-1.5 rounded-2xl w-14 outline-none transition-all ${mobileTab === "home" ? "text-emerald-400 scale-103 bg-[#0f172a]" : "text-slate-400 hover:text-slate-200"}`}
        >
          <Home className="h-4.5 w-4.5" />
          <span className="text-[9px] font-extrabold mt-0.5 font-sans leading-none">होम</span>
        </button>

        <button
          onClick={() => setMobileTab("farms")}
          className={`flex flex-col items-center justify-center p-1.5 rounded-2xl w-14 outline-none transition-all ${mobileTab === "farms" ? "text-emerald-400 scale-103 bg-[#0f172a]" : "text-slate-400 hover:text-slate-200"}`}
        >
          <Sprout className="h-4.5 w-4.5" />
          <span className="text-[9px] font-extrabold mt-0.5 font-sans leading-none">किसान</span>
        </button>

        <button
          onClick={() => setMobileTab("labor")}
          className={`flex flex-col items-center justify-center p-1.5 rounded-2xl w-14 outline-none transition-all ${mobileTab === "labor" ? "text-emerald-400 scale-103 bg-[#0f172a]" : "text-slate-400 hover:text-slate-200"}`}
        >
          <Users className="h-4.5 w-4.5" />
          <span className="text-[9px] font-extrabold mt-0.5 font-sans leading-none">लेबर</span>
        </button>

        <button
          onClick={() => setMobileTab("reports")}
          className={`flex flex-col items-center justify-center p-1.5 rounded-2xl w-14 outline-none transition-all ${mobileTab === "reports" ? "text-emerald-400 scale-103 bg-[#0f172a]" : "text-slate-400 hover:text-slate-200"}`}
        >
          <FileSpreadsheet className="h-4.5 w-4.5" />
          <span className="text-[9px] font-extrabold mt-0.5 font-sans leading-none">बहिखाता</span>
        </button>
      </footer>

      {/* Modals instances */}
      <FarmerFormModal isOpen={showFarmerModal} onClose={() => setShowFarmerModal(false)} />
      <TransactionFormModal isOpen={showTxModal} onClose={() => setShowTxModal(false)} />
      <LaborFormModal isOpen={showLaborModal} onClose={() => setShowLaborModal(false)} />

    </div>
  );
};
