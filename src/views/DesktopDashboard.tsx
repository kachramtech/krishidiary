import React, { useState } from "react";
import { useAppState } from "../context/AppContext";
import { TipsCarousel } from "../components/common/TipsCarousel";
import { FarmerDetailCard } from "../components/farmers/FarmerDetailCard";
import { FarmerFormModal } from "../components/farmers/FarmerFormModal";
import { TransactionFormModal } from "../components/transactions/TransactionFormModal";
import { LaborFormModal } from "../components/labor/LaborFormModal";
import { MandiCalcWidget } from "../components/transactions/MandiCalcWidget";
import { LiveMandiRates } from "../components/mandi/LiveMandiRates";
import { AuditLogsView } from "../components/audits/AuditLogsView";
import { InsightsDashboard } from "../components/reports/InsightsDashboard";
import {
  Search,
  PlusCircle,
  FileText,
  DollarSign,
  Users,
  Sprout,
  Activity,
  AlertTriangle,
  RotateCcw,
  Download,
  CheckCircle
} from "lucide-react";

export const DesktopDashboard: React.FC = () => {
  const {
    farmers,
    farmerSearch,
    setFarmerSearch,
    selectedCropFilter,
    setSelectedCropFilter,
    transactions,
    labors,
    overallIncome,
    overallExpense,
    overallProfit,
    netEarningsPerAcre,
    totalPendingDues,
    financialYear,
    handleExportData,
    triggerWhatsAppReminder
  } = useAppState();

  // Modals state management
  const [showFarmerModal, setShowFarmerModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [showLaborModal, setShowLaborModal] = useState(false);

  // Filtered farmers lists
  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      farmer.village.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      farmer.phone.includes(farmerSearch);

    const matchesCrop =
      selectedCropFilter === "all" || farmer.activeCrop === selectedCropFilter;

    return matchesSearch && matchesCrop;
  });

  return (
    <div className="space-y-6 animate-scaleIn select-none max-w-7xl mx-auto px-4 py-3 leading-normal text-slate-705">
      
      {/* Dynamic Advisory Tips Banner Carousel */}
      <TipsCarousel />

      {/* Main Administrative Action Controllers */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
            <Activity className="h-5.5 w-5.5 text-emerald-700 mr-2 animate-pulse" />
            <span>सुपर एडमिन डैशबोर्ड (Super Admin Command Station)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">समग्र लेखा-जोखा प्रविष्टि, मंडी काट गणना, बकाया वसूली एवं सुरक्षा ट्रैकर।</p>
        </div>

        {/* Action Trigger Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFarmerModal(true)}
            className="px-4 py-2 bg-emerald-750 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm hover:shadow flex items-center space-x-1.5 transition-all outline-none cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>1. नया किसान रजिस्ट्रेशन</span>
          </button>
          <button
            onClick={() => setShowTxModal(true)}
            className="px-4 py-2 bg-indigo-750 bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-sm hover:shadow flex items-center space-x-1.5 transition-all outline-none cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>2. खर्चा / मंडी बिकावली दर्ज करें</span>
          </button>
          <button
            onClick={() => setShowLaborModal(true)}
            className="px-4 py-2 bg-[#0b1329] hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-sm hover:shadow flex items-center space-x-1.5 transition-all outline-none cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>3. लेबर एवं हाजिरी हिसाब</span>
          </button>
        </div>
      </div>

      {/* Central Visual Analytics Panels */}
      <InsightsDashboard />

      {/* Dual Column Layout: Left (Farmers Profiles lists with filter), Right (Calculator, Rates stream, Security Trail Logs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Grid: 1000+ Farmers lists */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4 text-xs text-left">
            
            {/* Filter and Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h4 className="font-extrabold text-slate-800 text-[12px] tracking-tight">पंजीकृत किसानों की सूची (Farmers Ledger Profiles)</h4>
                <p className="text-[10px] text-slate-400">नाम, गाँव, कुल रकबा या मोबाइल नंबर द्वारा छानबीन करें</p>
              </div>

              {/* Crop Filter Selector */}
              <select
                value={selectedCropFilter}
                onChange={(e) => setSelectedCropFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-600 rounded-xl p-2 px-3 text-[10.5px] font-sans font-bold outline-none cursor-pointer hover:bg-slate-100"
              >
                <option value="all">🌾 सभी फसलें (All Crops)</option>
                <option value="गेहूं (Wheat)">गेहूं (Wheat)</option>
                <option value="धान (Paddy)">धान (Paddy)</option>
                <option value="सोयाबीन (Soybean)">सोयाबीन (Soybean)</option>
                <option value="लहसुन (Garlic)">लहसुन (Garlic)</option>
                <option value="कपास (Cotton)">कपास (Cotton)</option>
                <option value="चना (Gram)">चना (Gram)</option>
              </select>
            </div>

            {/* Local Client Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="किसान का नाम, गाँव या मोबाइल नंबर दर्ज करें..."
                value={farmerSearch}
                onChange={(e) => setFarmerSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl outline-none focus:border-emerald-600 font-sans font-bold text-slate-805"
              />
            </div>

            {/* Farmer card lists wrapper */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredFarmers && filteredFarmers.length > 0 ? (
                filteredFarmers.map((farmer) => (
                  <FarmerDetailCard key={farmer.id} farmer={farmer} />
                ))
              ) : (
                <p className="text-[10.5px] italic text-slate-400 text-center py-10 font-sans">
                  खोजे गये मापदंड के अनुसार कोई किसान पंजीकृत नहीं मिला।
                </p>
              )}
            </div>
          </div>

          {/* Credit Collection Tabular lists */}
          {totalPendingDues > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-xs text-left space-y-3.5 leading-normal">
              <div>
                <h4 className="font-extrabold text-slate-800 text-[12px] tracking-tight">सक्रिय उधारी वसूली शीट (Immediate Credit Collection Sheet)</h4>
                <p className="text-[10px] text-slate-400">आंशिक आढ़ती बकाया एवं उधारी पर दी गई कृषि सामग्री रिमाइंडर्स</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] font-sans border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase font-black tracking-tight border-b border-slate-100">
                      <th className="p-3">किसान नाम</th>
                      <th className="p-3">फसल</th>
                      <th className="p-3">देय तिथि</th>
                      <th className="p-3 text-right">बकाया ऋण शेष</th>
                      <th className="p-3 text-center">रिमाइंडर</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions
                      .filter((t) => t.isCreditSale && t.paymentStatus !== "paid" && t.creditDetails)
                      .map((tx) => {
                        const far = farmers.find((f) => f.id === tx.farmerId);
                        return (
                          <tr key={tx.id} className="hover:bg-slate-55/60 transition-all font-sans">
                            <td className="p-3 font-bold text-slate-850">{far?.name || "अज्ञात किसान"}</td>
                            <td className="p-3 font-semibold text-slate-500">{tx.crop}</td>
                            <td className="p-3 font-mono font-medium text-slate-600">{tx.creditDetails?.dueDate}</td>
                            <td className="p-3 font-mono font-black text-rose-800 text-right">
                              ₹{tx.creditDetails?.pendingAmount.toLocaleString()}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => triggerWhatsAppReminder(tx)}
                                className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-250/20 text-emerald-800 rounded font-black text-[9px] pointer cursor-pointer"
                              >
                                WhatsApp 💬
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Grid: Utilities and log compliance */}
        <div className="space-y-6">
          <MandiCalcWidget />
          <LiveMandiRates />
          <AuditLogsView />
        </div>
      </div>

      {/* Centralised Modals instances */}
      <FarmerFormModal isOpen={showFarmerModal} onClose={() => setShowFarmerModal(false)} />
      <TransactionFormModal isOpen={showTxModal} onClose={() => setShowTxModal(false)} />
      <LaborFormModal isOpen={showLaborModal} onClose={() => setShowLaborModal(false)} />

    </div>
  );
};
