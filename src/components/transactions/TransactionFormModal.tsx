import React, { useState, useEffect } from "react";
import { X, FileSpreadsheet, PlusCircle, Mic, Sprout } from "lucide-react";
import { useAppState } from "../../context/AppContext";

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({ isOpen, onClose }) => {
  const {
    farmers,
    createTransaction,
    isRecording,
    recordingSeconds,
    handleToggleVoiceRecord,
    simulatedVoiceText,
    setSimulatedVoiceText
  } = useAppState();

  const [form, setForm] = useState({
    farmerId: "",
    farmId: "",
    crop: "गेहूं (Wheat)",
    type: "expense", // 'expense' or 'income'
    category: "fertilizer", // 'seed', 'fertilizer', 'pesticide', 'diesel', 'labor_payout', 'harvest_sale'
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    isMandiSale: false,
    grossWeight: 60,
    deductionRate: 1.5,
    traderName: "",
    isCreditSale: false,
    dueDate: "",
    paymentStatus: "paid"
  });

  // Watch for selected farmer inside form and load fields
  const selectedFarmer = farmers.find((f) => f.id === form.farmerId);
  const selectedFarmerFarms = selectedFarmer?.farms || [];

  // Update categories according to Selected Type
  useEffect(() => {
    if (form.type === "income") {
      setForm((prev) => ({
        ...prev,
        category: "harvest_sale"
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        category: "fertilizer",
        isMandiSale: false // Mandi calculations only applicable to Sale (income)
      }));
    }
  }, [form.type]);

  // Handle Voice simulation linking
  const triggerVoiceAI = () => {
    handleToggleVoiceRecord(setForm, () => {});
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.farmerId) {
      alert("कृपया किसी पंजीकृत किसान का चयन करें!");
      return;
    }
    if (form.amount <= 0 && !form.isMandiSale) {
      alert("कृपया वैध वित्तीय राशि दर्ज करें!");
      return;
    }

    await createTransaction(form);

    // Reset values
    setForm({
      farmerId: "",
      farmId: "",
      crop: "गेहूं (Wheat)",
      type: "expense",
      category: "fertilizer",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      isMandiSale: false,
      grossWeight: 60,
      deductionRate: 1.5,
      traderName: "",
      isCreditSale: false,
      dueDate: "",
      paymentStatus: "paid"
    });
    setSimulatedVoiceText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-scaleIn">
        {/* Header bar */}
        <div className="bg-[#0b1329] text-white p-5 flex justify-between items-center border-b border-indigo-950">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
            <span className="font-extrabold text-sm tracking-tight font-sans">
              {form.type === "income" ? "3. अनाज मंडी फसल बिक्री (काट गणना)" : "2. खर्चा एंट्री (डिजिटल हिसाब)"}
            </span>
          </div>
          <button onClick={onClose} className="p-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Voice AI Header link */}
        <div className="bg-indigo-950 text-white p-4.5 border-b border-indigo-900 flex flex-col items-center space-y-2 text-center text-xs">
          <div>
            <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase tracking-wider">
              बोलकर दर्ज करें (Hindi Transcribe)
            </span>
            <p className="text-[10px] text-slate-300 mt-1 leading-normal">
              माइक बटन दबाकर हिन्दी में बोले! यूरिया, खाद या मण्डी बिक्री AI समझकर डेटा स्वत: भर देगा।
            </p>
          </div>

          <button
            type="button"
            onClick={triggerVoiceAI}
            className={`p-2.5 px-5 rounded-full font-bold flex items-center space-x-2 transition-all outline-none ${isRecording ? "bg-red-650 bg-red-600 scale-105 animate-pulse text-white font-sans" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
          >
            <Mic className={`h-4.5 w-4.5 ${isRecording ? "animate-bounce" : ""}`} />
            <span>{isRecording ? `${recordingSeconds}s रोकें` : "🎤 हिन्दी आवाज़ रिकॉर्डर चालू करें"}</span>
          </button>

          {simulatedVoiceText && (
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-indigo-900 text-left w-full text-[10px] font-mono leading-normal">
              <span className="text-amber-400 font-sans font-bold">स्वतः अनुवाद किया रूप:</span>
              <p className="text-white italic mt-0.5">“{simulatedVoiceText}”</p>
            </div>
          )}
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs text-left text-slate-700">
          
          {/* Master Type Selection Expense vs Income */}
          <div className="grid grid-cols-2 gap-3.5 text-center">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "expense" })}
              className={`p-3 rounded-xl border font-bold transition-all outline-none ${form.type === "expense" ? "bg-rose-50 border-rose-300 text-rose-700" : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"}`}
            >
              💸 1. लागत खर्चा जोड़ें।
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "income" })}
              className={`p-3 rounded-xl border font-bold transition-all outline-none ${form.type === "income" ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"}`}
            >
              🌾 2. फसल मंडी बिक्री दर्ज करें।
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Farmer selection */}
            <div className="space-y-1">
              <label className="font-extrabold text-slate-500 block">संबद्ध किसान का चयन करें * (Select Farmer)</label>
              <select
                value={form.farmerId}
                onChange={(e) => setForm({ ...form, farmerId: e.target.value, farmId: "" })}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-emerald-600 font-sans font-bold text-slate-800"
                required
              >
                <option value="">-- किसान चुनें --</option>
                {farmers.map((farmer) => (
                  <option key={farmer.id} value={farmer.id}>
                    {farmer.name} ({farmer.village})
                  </option>
                ))}
              </select>
            </div>

            {/* Farm subdivisions plot selection */}
            <div className="space-y-1">
              <label className="font-extrabold text-slate-500 block">संबद्ध खेत / हिस्सा चुनें (Land Plot Plot)</label>
              <select
                value={form.farmId}
                onChange={(e) => setForm({ ...form, farmId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-emerald-600 font-sans font-semibold text-slate-800"
                disabled={!form.farmerId}
              >
                <option value="">मुख्य खेत (Default / Aggregated)</option>
                {selectedFarmerFarms.map((farm) => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name} ({farm.acreage} एकड़ क्षेत्र)
                  </option>
                ))}
              </select>
            </div>

            {/* Crop selection */}
            <div className="space-y-1">
              <label className="font-extrabold text-slate-500 block">संबंधित फसल श्रेणी * (Select Crop)</label>
              <select
                value={form.crop}
                onChange={(e) => setForm({ ...form, crop: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-emerald-600 font-sans font-bold"
              >
                <option value="गेहूं (Wheat)"> गेहूं (Wheat)</option>
                <option value="धान (Paddy)">धान (Paddy)</option>
                <option value="सोयाबीन (Soybean)">सोयाबीन (Soybean)</option>
                <option value="लहसुन (Garlic)">लहसुन (Garlic)</option>
                <option value="कпас (Cotton)">कपास (Cotton)</option>
                <option value="चना (Gram)">चना (Gram)</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="font-extrabold text-slate-500 block">लेनदेन श्रेणी * (Category)</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-emerald-600 font-sans font-semibold text-slate-800"
              >
                {form.type === "expense" ? (
                  <>
                    <option value="fertilizer">यूरिया एवं उर्वरक (Fertilizer)</option>
                    <option value="seed">उन्नत बीज सामग्री (Seeds)</option>
                    <option value="pesticide">कीटनाशक एवं दवाइयाँ (Pesticides)</option>
                    <option value="diesel">डीजल एवं ट्रेक्टर किराया (Fuel/Diesel)</option>
                    <option value="labor_payout">लेबर हाजिरी भुगतान (Labor Wages)</option>
                    <option value="harvesting">कटाई एवं थ्रेसिंग (Harvest Machine)</option>
                    <option value="other_input">अन्य विविध लागते</option>
                  </>
                ) : (
                  <>
                    <option value="crop_sale">सकल मंडी उपज बिक्री (Crop Harvesting Sale)</option>
                    <option value="government_subsidy">शासकीय अनुदान (Govt Subsidy)</option>
                    <option value="other_income">अन्य विविध प्राप्तियां</option>
                  </>
                )}
              </select>
            </div>

            {/* Input Amount / Rate block */}
            <div className="space-y-1">
              <label className="font-extrabold text-slate-500 block">
                {form.isMandiSale ? "मंडी मूल्य प्रति क्विंटल * (₹ Rate/Quintal)" : "कुल दर्ज की जाने वाली राशि * (Rupees Amount)"}
              </label>
              <input
                type="number"
                placeholder="उदा: 2450"
                value={form.amount || ""}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-emerald-600 font-sans font-bold font-mono text-slate-900"
                required
              />
            </div>

            {/* Backdate Support */}
            <div className="space-y-1">
              <label className="font-extrabold text-slate-500 block">लेखा-जोखा एंट्री तिथि * (Record Date)</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-emerald-600 font-sans font-bold font-mono text-slate-900"
                required
              />
            </div>
          </div>

          {/* Conditional Mandi calculations sub-layout */}
          {form.type === "income" && (
            <div className="space-y-3 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/60">
              <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                <div>
                  <strong className="text-emerald-900 font-sans block text-xs">पारदर्शी काटा/मंडी वजन प्रणाली सिम्युलेटर</strong>
                  <span className="text-[10px] text-slate-400">व्यापारी की वजन हेराफेरी से आढ़त सुरक्षा कवच</span>
                </div>
                <input
                  type="checkbox"
                  id="mandi-mode"
                  checked={form.isMandiSale}
                  onChange={(e) => setForm({ ...form, isMandiSale: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              {form.isMandiSale && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10.5px]">
                    <div className="space-y-1">
                      <span className="text-slate-500 block font-bold">सकल वजन (Gross क्विंटल में)</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="उदा: 60"
                        value={form.grossWeight || ""}
                        onChange={(e) => setForm({ ...form, grossWeight: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-200 p-2 rounded-xl text-center font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 block font-bold">कचरा काट दर (kg per क्विंटल)</span>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="उदा: 1.5"
                        value={form.deductionRate || ""}
                        onChange={(e) => setForm({ ...form, deductionRate: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-200 p-2 rounded-xl text-center font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 block font-bold">आढ़ती / मंडी व्यापारी का नाम</span>
                      <input
                        type="text"
                        placeholder="उदा: शिव ट्रेडर्स नीमच"
                        value={form.traderName}
                        onChange={(e) => setForm({ ...form, traderName: e.target.value })}
                        className="w-full bg-white border border-slate-200 p-2 rounded-xl text-left"
                      />
                    </div>
                  </div>

                  {(() => {
                    const deductionPct = form.grossWeight * (form.deductionRate / 100);
                    const netWeight = form.grossWeight - deductionPct;
                    const netCash = netWeight * form.amount;
                    return (
                      <div className="bg-slate-900 text-white p-3.5 rounded-2xl space-y-1 text-xs font-mono tracking-tight leading-normal border border-slate-800 select-none">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-sans">कचरा काट सुद्ध वज़न (Deduction Weight):</span>
                          <span className="text-rose-450 text-rose-400 font-bold">{deductionPct.toFixed(2)} क्विंटल</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-sans">सुद्ध अनाज शुद्ध तौल (Net Sale Weight):</span>
                          <span className="text-amber-300 font-bold">{netWeight.toFixed(2)} क्विंटल</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-800 pt-1.5 mt-1.5">
                          <span className="text-slate-200 font-sans font-bold">आंकलित शुद्ध भुगतान (Total Payoff):</span>
                          <span className="text-emerald-400 font-sans font-bold text-sm">₹{netCash.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Credit Sale / Payment Status */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-slate-800 block text-xs">उधार ऋण ट्रैकर (Credit Ledger Account)</strong>
                <span className="text-[10px] text-slate-400">आंशिक आढ़ती शेष या उधार सामग्री हिसाब दर्ज करें</span>
              </div>
              <input
                type="checkbox"
                id="credit-mode"
                checked={form.isCreditSale}
                onChange={(e) => setForm({ ...form, isCreditSale: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {form.isCreditSale && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <span className="text-slate-500 block font-bold">ऋण चुकाने की अंतिम तिथि (Due Payment Date)</span>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl outline-none text-slate-800 font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block font-bold">भुगतान वर्तमान स्थिति (Payment Status)</span>
                  <select
                    value={form.paymentStatus}
                    onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                    className="w-full bg-white border border-slate-300 p-2.5 rounded-xl outline-none font-sans font-semibold text-slate-800"
                  >
                    <option value="partially_paid">आंशिक भुगतान बकाया (Partially Paid)</option>
                    <option value="unpaid">ऋण बकाया (Unpaid/Credit)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold rounded-xl active:scale-95 transition-all text-xs outline-none"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow active:scale-95 transition-all text-xs outline-none"
            >
              <span>लेखा-जोखा सुरक्षित करें 🌾</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
