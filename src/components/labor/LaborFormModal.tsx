import React, { useState } from "react";
import { X, Users, ClipboardCheck } from "lucide-react";
import { useAppState } from "../../context/AppContext";

interface LaborFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaborFormModal: React.FC<LaborFormModalProps> = ({ isOpen, onClose }) => {
  const { farmers, createLabor } = useAppState();

  const [form, setForm] = useState({
    farmerId: "",
    farmId: "",
    crop: "गेहूं (Wheat)",
    date: new Date().toISOString().split("T")[0],
    mode: "individual", // 'individual' or 'bulk_gang'
    laborerName: "",
    attendance: "present", // 'present', 'half_day', 'absent'
    workersCount: 5,
    groupName: "",
    workDescription: "",
    contractAmount: 0,
    advancePaid: 0
  });

  const selectedFarmer = farmers.find((f) => f.id === form.farmerId);
  const selectedFarmerFarms = selectedFarmer?.farms || [];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.farmerId) {
      alert("कृपया किसान चुनें जिनके यहाँ लेबर काम हुआ!");
      return;
    }
    if (form.mode === "individual" && !form.laborerName) {
      alert("कृपया मजदूर का नाम प्रविष्ट करें!");
      return;
    }
    if (form.contractAmount <= 0) {
      alert("अनुबंधित राशि अवश्य दर्ज करें!");
      return;
    }

    await createLabor(form);

    // Reset
    setForm({
      farmerId: "",
      farmId: "",
      crop: "गेहूं (Wheat)",
      date: new Date().toISOString().split("T")[0],
      mode: "individual",
      laborerName: "",
      attendance: "present",
      workersCount: 5,
      groupName: "",
      workDescription: "",
      contractAmount: 0,
      advancePaid: 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-xl overflow-hidden animate-scaleIn">
        {/* Header bar */}
        <div className="bg-[#0b1329] text-white p-5 flex justify-between items-center border-b border-indigo-950">
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="h-5 w-5 text-emerald-400" />
            <span className="font-extrabold text-sm tracking-tight font-sans">
              4. नया लेबर एवं हाजिरी हिसाब (Labor Tracker)
            </span>
          </div>
          <button onClick={onClose} className="p-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body Scroll */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-left text-slate-705">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-3.5 text-center leading-normal">
            <button
              type="button"
              onClick={() => setForm({ ...form, mode: "individual" })}
              className={`p-3 rounded-xl border font-bold transition-all outline-none ${form.mode === "individual" ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-500"}`}
            >
              👤 व्यक्तिगत दैनिक मजदूर (Individual Attendance)
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, mode: "bulk_gang" })}
              className={`p-3 rounded-xl border font-bold transition-all outline-none ${form.mode === "bulk_gang" ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-500"}`}
            >
              👥 लेबर टोली ठेका (Bulk Gang Sowing Contractor)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Farmer selection */}
            <div className="space-y-1">
              <label className="font-extrabold text-slate-500 block">भूमि स्वामी / नियोजक किसान * (Employer Farmer)</label>
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
              <label className="font-extrabold text-slate-500 block">संबद्ध खेत / हिस्सा चुनें (Select Land Plot)</label>
              <select
                value={form.farmId}
                onChange={(e) => setForm({ ...form, farmId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-emerald-600 font-sans font-semibold text-slate-850"
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
              <label className="font-extrabold text-slate-500 block">सक्रिय फसल श्रेणी * (Select Crop)</label>
              <select
                value={form.crop}
                onChange={(e) => setForm({ ...form, crop: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-emerald-600 font-sans font-bold"
              >
                <option value="गेहूं (Wheat)"> गेहूं (Wheat)</option>
                <option value="धान (Paddy)">धान (Paddy)</option>
                <option value="सोयाबीन (Soybean)">सोयाबीन (Soybean)</option>
                <option value="लहसुन (Garlic)">लहसुन (Garlic)</option>
                <option value="कपास (Cotton)">कपास (Cotton)</option>
                <option value="चना (Gram)">चना (Gram)</option>
              </select>
            </div>

            {/* Attendance work Date */}
            <div className="space-y-1">
              <label className="font-extrabold text-slate-500 block">हाजिरी / कार्य तिथि * (Record Date)</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-emerald-600 font-sans font-bold font-mono text-slate-800"
                required
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Conditional Layout Inputs */}
          {form.mode === "individual" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-55/10 p-4 rounded-2xl border border-emerald-100/40">
              <div className="space-y-1">
                <span className="font-extrabold text-slate-500 block">मजदूर का नाम * (Laborer Name)</span>
                <input
                  type="text"
                  placeholder="उदा: सखाराम अहिरवार"
                  value={form.laborerName}
                  onChange={(e) => setForm({ ...form, laborerName: e.target.value })}
                  className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none font-sans font-bold text-slate-800"
                />
              </div>
              <div className="space-y-1">
                <span className="font-extrabold text-slate-500 block">हाजिरी स्टेटस (Daily Attendance)</span>
                <select
                  value={form.attendance}
                  onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                  className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none font-sans font-bold text-slate-800"
                >
                  <option value="present">🔴 पूर्ण दिवस उपस्थित (Present)</option>
                  <option value="half_day">🟡 आधा दिवस उपस्थित (Half Day)</option>
                  <option value="absent">⚫ अनुपस्थित (Absent)</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-indigo-50/15 p-4 rounded-2xl border border-indigo-100/40">
              <div className="space-y-1">
                <span className="font-extrabold text-slate-500 block">टोली अध्यक्ष/संपर्क नाम * (Group Head)</span>
                <input
                  type="text"
                  placeholder="उदा: कालूराम (टोली अध्यक्ष)"
                  value={form.groupName}
                  onChange={(e) => setForm({ ...form, groupName: e.target.value })}
                  className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-1">
                <span className="font-extrabold text-slate-500 block">कुल मजदूरों की संख्या (Workers Headcount)</span>
                <input
                  type="number"
                  placeholder="उदा: 12"
                  value={form.workersCount || ""}
                  onChange={(e) => setForm({ ...form, workersCount: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none font-mono font-bold text-slate-850"
                />
              </div>
              <div className="space-y-1">
                <span className="font-extrabold text-slate-500 block">कार्य विवरण (Work Description Sowing/Harvesting)</span>
                <input
                  type="text"
                  placeholder="उदा: बुवाई या लहसुन छटाई"
                  value={form.workDescription}
                  onChange={(e) => setForm({ ...form, workDescription: e.target.value })}
                  className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none"
                />
              </div>
            </div>
          )}

          {/* Money payout ledger parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="space-y-1">
              <span className="font-extrabold text-slate-600 block">कुल तय मजदूरी/ठेका राशि * (Wages Amount due)</span>
              <input
                type="number"
                placeholder="उदा: 450"
                value={form.contractAmount || ""}
                onChange={(e) => setForm({ ...form, contractAmount: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl outline-none font-mono font-extrabold text-xs text-rose-800"
                required
              />
            </div>
            <div className="space-y-1">
              <span className="font-extrabold text-slate-600 block">अग्रिम / एडवांस पेमेंट राशि (Advance Paid Amount)</span>
              <input
                type="number"
                placeholder="उदा: 100"
                value={form.advancePaid || ""}
                onChange={(e) => setForm({ ...form, advancePaid: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl outline-none font-mono font-bold text-xs text-emerald-800"
              />
            </div>
          </div>

          {/* Calculated balance readout */}
          {(() => {
            const dueBal = form.contractAmount - form.advancePaid;
            return (
              <div className="flex justify-between items-center bg-indigo-50 border border-indigo-150 p-3 rounded-xl text-indigo-900 font-sans font-bold">
                <span>शेष आकलित भुगतान (Due Balance to pay):</span>
                <span className="font-mono text-xs text-indigo-950">₹{dueBal.toLocaleString()}</span>
              </div>
            );
          })()}

          {/* Submits buttons */}
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
              <span>हाजिरी दर्ज करें ✔️</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
