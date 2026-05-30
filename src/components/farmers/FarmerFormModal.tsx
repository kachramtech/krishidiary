import React, { useState } from "react";
import { X, Plus, Trash, Sprout } from "lucide-react";
import { useAppState } from "../../context/AppContext";

interface FarmerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmerFormModal: React.FC<FarmerFormModalProps> = ({ isOpen, onClose }) => {
  const { createFarmer } = useAppState();

  const [form, setForm] = useState({
    name: "",
    village: "",
    phone: "",
    totalAcreage: 5,
    activeCrop: "गेहूं (Wheat)"
  });

  const [plots, setPlots] = useState<{ id: string; name: string; acreage: number; activeCrop: string }[]>([
    { id: "plot_1", name: "कुएं वाली पट्टी", acreage: 5, activeCrop: "गेहूं (Wheat)" }
  ]);

  const [tempPlot, setTempPlot] = useState({
    name: "",
    acreage: 2,
    activeCrop: "गेहूं (Wheat)"
  });

  if (!isOpen) return null;

  const handleAddPlot = () => {
    if (!tempPlot.name || !tempPlot.acreage) {
      alert("कृपया प्लॉट का नाम और साइज़ भरें!");
      return;
    }
    const newId = "df_user_" + Date.now();
    setPlots((prev) => [
      ...prev,
      {
        id: newId,
        name: tempPlot.name,
        acreage: Number(tempPlot.acreage),
        activeCrop: tempPlot.activeCrop
      }
    ]);
    // Recalculate total acreage
    const updatedAcreage = plots.reduce((sum, p) => sum + p.acreage, 0) + Number(tempPlot.acreage);
    setForm((prev) => ({ ...prev, totalAcreage: updatedAcreage }));
    setTempPlot({
      name: "",
      acreage: 2,
      activeCrop: tempPlot.activeCrop
    });
  };

  const handleDeletePlot = (id: string) => {
    const updatedPlots = plots.filter((p) => p.id !== id);
    setPlots(updatedPlots);
    const updatedAcreage = updatedPlots.reduce((sum, p) => sum + p.acreage, 0);
    setForm((prev) => ({ ...prev, totalAcreage: updatedAcreage }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.village || !form.phone) {
      alert("कृपया नाम, गाँव और मोबाइल नंबर पूर्ण रूप से दर्ज करें!");
      return;
    }
    await createFarmer(form, plots);
    // Reset
    setForm({
      name: "",
      village: "",
      phone: "",
      totalAcreage: 5,
      activeCrop: "गेहूं (Wheat)"
    });
    setPlots([{ id: "plot_1", name: "कुएं वाली पट्टी", acreage: 5, activeCrop: "गेहूं (Wheat)" }]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-scaleIn">
        {/* Modal Header */}
        <div className="bg-[#0b1329] text-white p-5 flex justify-between items-center border-b border-indigo-950">
          <div className="flex items-center space-x-2">
            <Sprout className="h-5 w-5 text-emerald-400" />
            <span className="font-extrabold text-sm tracking-tight font-sans">1. नया किसान रजिस्ट्रेशन (Farmer Profile)</span>
          </div>
          <button onClick={onClose} className="p-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs text-left text-slate-700">
          {/* Main Info Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-extrabold text-slate-500 block">किसान का पूरा नाम * (Full Name)</label>
              <input
                type="text"
                placeholder="उदा: रामचंद्र पाटीदार"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-emerald-600 font-sans font-bold"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-extrabold text-slate-500 block">मोबाइल नंबर * (Mobile Number)</label>
              <input
                type="tel"
                maxLength={10}
                placeholder="उदा: 9826354120"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-emerald-600 font-sans font-bold font-mono"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-extrabold text-slate-500 block">गाँव का नाम * (Village/Town Name)</label>
              <input
                type="text"
                placeholder="उदा: पिपलिया मण्डी"
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none focus:border-emerald-600 font-sans font-bold"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-extrabold text-slate-500 block">मुख्य सक्रिय फसल (Active Crop Category)</label>
              <select
                value={form.activeCrop}
                onChange={(e) => setForm({ ...form, activeCrop: e.target.value })}
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
          </div>

          <hr className="border-slate-100" />

          {/* Individual Land Division Plots Tracker */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <strong className="text-slate-800 text-xs block">खेत के चॅक / प्लॉट (Land Plots Partition)</strong>
              <span className="text-[10px] text-slate-400">विवादास्पद लेखा-जोखा से बचने के लिए किसान के खेतों को छोटे प्लॉटों में विभाजित करें।</span>
            </div>

            {/* Visual list of plots */}
            <div className="space-y-1.5 maximal-height-[150px] overflow-y-auto">
              {plots.map((plot, idx) => (
                <div key={plot.id} className="bg-white p-2.5 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-850">
                      {idx + 1}. {plot.name}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-2">
                      ({plot.acreage} एकड़ | {plot.activeCrop})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePlot(plot.id)}
                    className="p-1 px-1.5 text-rose-600 hover:bg-rose-50 rounded bg-white border border-slate-100 font-bold"
                  >
                    हटाएं
                  </button>
                </div>
              ))}
            </div>

            {/* Plot Adder block */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] items-end">
              <div className="space-y-1">
                <span className="text-slate-500 block font-bold">प्लॉट का नाम/दिशा</span>
                <input
                  type="text"
                  placeholder="उदा: कुएं वाला खेत"
                  value={tempPlot.name}
                  onChange={(e) => setTempPlot({ ...tempPlot, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-2 py-1.5 rounded outline-none"
                />
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block font-bold">रकबा (एकड़ में)</span>
                <input
                  type="number"
                  step="0.1"
                  placeholder="उदा: 4.5"
                  value={tempPlot.acreage || ""}
                  onChange={(e) => setTempPlot({ ...tempPlot, acreage: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 px-2 py-1.5 rounded outline-none font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleAddPlot}
                className="w-full bg-[#0b1329] hover:bg-slate-900 text-white font-bold h-8 flex items-center justify-center space-x-1 rounded-lg text-[10.5px] transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>प्लॉट जोड़े</span>
              </button>
            </div>
          </div>

          {/* Sum details summary */}
          <div className="flex justify-between items-center bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-100 font-sans font-bold leading-normal">
            <span>कुल आकलित रकबा (Total Acres):</span>
            <span className="font-mono text-xs">{form.totalAcreage} एकड़ क्षेत्र</span>
          </div>

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
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow active:scale-95 transition-all text-xs flex items-center space-x-1 outline-none"
            >
              <span>रजिस्टर करें ✔️</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
