import React, { useState } from "react";
import { useAppState } from "../../context/AppContext";
import { TrendingUp, TrendingDown, DollarSign, Activity, FileSpreadsheet, Download } from "lucide-react";

export const InsightsDashboard: React.FC = () => {
  const {
    farmers,
    transactions,
    labors,
    roiAnalytics,
    overallIncome,
    overallExpense,
    overallProfit,
    netEarningsPerAcre,
    totalPendingDues,
    financialYear,
    handleExportData
  } = useAppState();

  const [activeTab, setActiveTab] = useState<"roi" | "summary">("roi");

  // Local calculation of crops to draw elegant bar graph
  const maxIncome = Math.max(...roiAnalytics.map((r) => r.income), 100000);
  const maxProfitPerAcre = Math.max(...roiAnalytics.map((r) => r.profitPerAcre), 5000);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-5 text-xs text-left leading-normal select-none font-sans">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center space-x-1.5">
            <Activity className="h-4.5 w-4.5 text-emerald-600 font-bold" />
            <span>वित्तीय एवं फसल विश्लेषण (Agri-Business Insights)</span>
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">FY {financialYear} के लिए किसान-वार लागत और फसल रिटर्न विवरण</p>
        </div>

        {/* View togglers */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("roi")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all text-[10.5px] cursor-pointer border ${activeTab === "roi" ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"}`}
          >
            🌱 फसल रिटर्न (Crop ROI)
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all text-[10.5px] cursor-pointer border ${activeTab === "summary" ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"}`}
          >
            📊 वित्तीय अवलोकन (Balance Sheet)
          </button>
          <button
            onClick={handleExportData}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-350 flex items-center space-x-1 font-bold tracking-tight text-[10.5px] outline-none cursor-pointer"
          >
            <Download className="h-3 w-3" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Aggregate top widgets cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block leading-none mb-1">सकल आवक (Gross Revenue)</span>
          <p className="font-mono text-[14px] font-black text-slate-900 leading-normal">
            ₹{overallIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <span className="text-[9.5px] text-emerald-600 font-semibold block mt-1.5 leading-none">▲ मंडी बिक्री एवं सब्सिडी</span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block leading-none mb-1">कुल व्यय / निवेश (Total Input)</span>
          <p className="font-mono text-[14px] font-black text-rose-800 leading-normal">
            ₹{overallExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <span className="text-[9.5px] text-rose-500 font-semibold block mt-1.5 leading-none">▼ सामग्री, डीजल एवं मजदूरी</span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block leading-none mb-1">शुद्ध लाभ (Net Profit Portfolio)</span>
          <p className={`font-mono text-[14px] font-black leading-normal ${overallProfit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
            ₹{overallProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <span className={`text-[9.5px] font-semibold block mt-1.5 leading-none ${overallProfit >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
            {overallProfit >= 0 ? "▲ लाभांश की स्थिति" : "▼ नुकसान भार स्थिति"}
          </span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-[#cbd5e1]/65">
          <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block leading-none mb-1">आंकलित लाभांश / एकड़</span>
          <p className="font-mono text-[14px] font-black text-slate-800 leading-normal">
            ₹{netEarningsPerAcre.toLocaleString(undefined, { maximumFractionDigits: 0 })}/एकर
          </p>
          <span className="text-[9.5px] text-indigo-500 font-semibold block mt-1.5 leading-none">🚜 उत्पादकता इंडेक्स स्कोर</span>
        </div>
      </div>

      {activeTab === "roi" ? (
        <div className="space-y-4">
          <div className="bg-slate-50/70 p-4 rounded-3xl border border-slate-200">
            <strong className="text-slate-800 text-[11.5px] block font-sans font-bold">फसल-वार मंडी आवक एवं लागत विवरण (Crop comparative charts)</strong>
            <span className="text-[10px] text-slate-400">दैनिक मंडी विक्रय आवक बनाम प्रति-फसल बीज-खाद-डीजल लागत का तुलनात्मक लेखा</span>

            {/* Custom SVG/Tailwind comparative Chart */}
            <div className="mt-4.5 space-y-4 font-sans select-none">
              {roiAnalytics.map((analysis) => {
                const incomePct = Math.min((analysis.income / maxIncome) * 100, 100);
                const expensePct = Math.min((analysis.expense / maxIncome) * 100, 100);
                return (
                  <div key={analysis.crop} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-700 font-bold">{analysis.crop}</span>
                      <span className="text-slate-500">
                        रकबा: <strong className="text-slate-800">{analysis.area} एकड़</strong> | लाभांश: <strong className={analysis.netProfit >= 0 ? "text-emerald-700" : "text-rose-700"}>₹{analysis.netProfit.toLocaleString()}</strong>
                      </span>
                    </div>

                    <div className="space-y-1">
                      {/* Income Bar */}
                      <div className="h-2 w-full bg-slate-100 rounded-lg overflow-hidden relative">
                        <div
                          style={{ width: `${incomePct}%` }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg transition-all duration-500"
                        />
                      </div>
                      {/* Expense Bar */}
                      <div className="h-1.5 w-full bg-slate-100 rounded-lg overflow-hidden relative">
                        <div
                          style={{ width: `${expensePct}%` }}
                          className="h-full bg-gradient-to-r from-rose-450 from-rose-400 to-orange-400 rounded-lg transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legends */}
            <div className="flex space-x-4 mt-3 pl-1 text-[9.5px] font-bold">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span>
                <span className="text-slate-500">मंडी उपज बिकावली (Mandi Sale Output)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-rose-400 rounded"></span>
                <span className="text-slate-500">लागत व्यय / लेबर खर्च (Total Operational Expenses)</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Detail operational layout expense weights */}
          <div className="bg-slate-50/70 p-4 rounded-3xl border border-slate-200 space-y-3 font-sans leading-normal">
            <strong className="text-slate-800 text-[11px] block font-bold">सामग्री लागत वर्गीकरण (Input Expense break-up)</strong>
            <span className="text-[10px] text-slate-400 block -mt-1">किसानों द्वारा खाद, डीजल, थ्रेसिंग और दवाओं पर कुल हुए खर्चों का विन्यास</span>

            <div className="space-y-2.5 pt-1.5 text-[10.5px]">
              {[
                { label: "यूरिया एवं रासायनिक उर्वरक (Fertilizer)", category: "fertilizer", color: "bg-indigo-500" },
                { label: "उन्नत बीज सामग्री (Seeds)", category: "seed", color: "bg-teal-500" },
                { label: "कीटनाशक रसायन सुरक्षा (Pesticides)", category: "pesticide", color: "bg-amber-500" },
                { label: "डीजल एवं यांत्रिक जुताई किराया (Fuel/Diesel)", category: "diesel", color: "bg-rose-500" },
                { label: "लेबर हाजिरी भुगतान (Labor Wages)", category: "labor_payout", color: "bg-purple-500" }
              ].map((item) => {
                const itemTotal = transactions
                  .filter((t) => t.category === item.category && t.type === "expense" && t.financialYear === financialYear)
                  .reduce((sum, t) => sum + t.amount, 0);
                const percent = overallExpense > 0 ? (itemTotal / overallExpense) * 100 : 0;
                return (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between font-bold text-[10.5px] text-slate-700">
                      <span>{item.label}</span>
                      <span className="font-mono">₹{itemTotal.toLocaleString()} ({percent.toFixed(1)}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded">
                      <div style={{ width: `${percent}%` }} className={`h-full ${item.color} rounded transition-all`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outstanding credit sales list collection details */}
          <div className="bg-slate-50/70 p-4 rounded-3xl border border-slate-200 flex flex-col justify-between font-sans leading-normal">
            <div className="space-y-1">
              <strong className="text-slate-800 text-[11px] block font-bold">उधार बकाया ऋण वसूली चक्र (Credit Outstanding Audit)</strong>
              <span className="text-[10px] text-slate-400 block -mt-1.5">अपुष्ट मंडी आढ़तियों एवं व्यापारियों से बकाया ऋण शेष राशि नियंत्रण प्रकोष्ठ</span>
              <p className="font-mono text-xs text-rose-800 font-extrabold mt-3 bg-rose-50 border border-rose-100 p-2 rounded-xl text-center">
                कुल वसूली शेष: ₹{totalPendingDues.toLocaleString()} (वसूली लंबित)
              </p>
            </div>

            <div className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-250/20 pt-2.5 mt-2 w-full">
              💡 <span className="font-bold text-slate-600">प्रबंधन सुरक्षा चक्र:</span> सुपर एडमिन सीधे किसानों या व्यापारियों को बकाया किस्तों के व्हाट्सएप पर स्वचालित भुगतान टोकन रसीद भेज सकते हैं।
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
