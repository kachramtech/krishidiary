import React, { useState } from "react";
import { Farmer, Transaction, LaborLog } from "../../types";
import { useAppState } from "../../context/AppContext";
import { Trash, PlusCircle, AlertTriangle } from "lucide-react";

interface FarmerDetailCardProps {
  farmer: Farmer;
}

export const FarmerDetailCard: React.FC<FarmerDetailCardProps> = ({ farmer }) => {
  const {
    transactions,
    labors,
    deleteFarmer,
    handleAddPlotInline,
    handleDeletePlot,
    handleUpdatePlot,
    currentUser,
    showConfirm
  } = useAppState();

  const [expanded, setExpanded] = useState(false);
  const [plotName, setPlotName] = useState("");
  const [plotAcreage, setPlotAcreage] = useState("");
  const [plotCrop, setPlotCrop] = useState("गेहूं (Wheat)");

  // Local state for editing within this card
  const [editingPlot, setEditingPlot] = useState<{ plotId: string, name: string, acreage: string, crop: string } | null>(null);

  const linkedTxs = transactions.filter((t) => t.farmerId === farmer.id);
  const totalSpentOnInputs = linkedTxs.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const totalIncomeCrop = linkedTxs.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncomeCrop - totalSpentOnInputs;

  const handleCreatePlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plotName || !plotAcreage) {
      alert("कृपया प्लॉट का नाम और रकबा दर्ज करें!");
      return;
    }
    handleAddPlotInline(farmer.id, plotName, Number(plotAcreage), plotCrop);
    setPlotName("");
    setPlotAcreage("");
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden text-xs text-left animate-scaleIn transition-all">
      {/* Clickable Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4.5 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-all select-none"
      >
        <div className="space-y-0.5">
          <h4 className="font-extrabold text-slate-900 text-[13px] tracking-tight">{farmer.name}</h4>
          <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-bold font-sans">
            <span>📞 {farmer.phone}</span>
            <span>📍 ग्राम: {farmer.village}</span>
          </div>
        </div>
        <div className="text-right flex items-center space-x-3">
          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-black px-2.5 py-1 rounded-full font-sans">
            {farmer.totalAcreage} एकड़ कुल रकबा
          </span>
          <span className={`text-[10px] font-bold text-slate-400 transform transition-transform ${expanded ? "rotate-180 text-emerald-700" : ""}`}>
            ▼
          </span>
        </div>
      </div>

      {/* Expanded Layout */}
      {expanded && (
        <div className="bg-slate-55/40 border-t border-slate-100 p-4.5 space-y-4">
          {/* List of sub plots in details */}
          <div>
            <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-1 font-sans">
              <h5 className="font-extrabold text-slate-500">खेत के चॅक / प्लॉट (Plot Listings):</h5>
              <span className="text-[10px] text-slate-400">कुल {farmer.farms?.length || 0} प्लॉट</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {farmer.farms && farmer.farms.length > 0 ? (
                farmer.farms.map((f, i) => {
                  const isEditing = editingPlot && editingPlot.plotId === f.id;
                  if (isEditing) {
                    return (
                      <div key={f.id || i} className="col-span-1 md:col-span-2 bg-[#f4f7fe] border border-cyan-300 p-3 rounded-2xl space-y-2 animate-fadeIn font-sans">
                        <p className="font-extrabold text-[10px] text-cyan-900 flex items-center">
                          ✏️ खेत विवरण सुधारें
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          <input
                            type="text"
                            value={editingPlot.name}
                            onChange={(e) => setEditingPlot({...editingPlot, name: e.target.value})}
                            className="bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl outline-none text-[10.5px] font-sans font-bold text-slate-800"
                            placeholder="खेत का नाम"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              step="0.01"
                              value={editingPlot.acreage}
                              onChange={(e) => setEditingPlot({...editingPlot, acreage: e.target.value})}
                              className="bg-white border border-slate-200 px-2 py-1.5 rounded-xl outline-none text-[10.5px] font-mono font-bold text-slate-800"
                              placeholder="रकबा"
                            />
                            <select
                              value={editingPlot.crop}
                              onChange={(e) => setEditingPlot({...editingPlot, crop: e.target.value})}
                              className="bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl outline-none text-[10.5px] font-sans font-bold text-slate-700"
                            >
                              <option value="गेहूं (Wheat)">गेहूं (Wheat)</option>
                              <option value="धान (Paddy)">धान (Paddy)</option>
                              <option value="सोयाबीन (Soybean)">सोयाबीन (Soybean)</option>
                              <option value="लहसुन (Garlic)">लहसुन (Garlic)</option>
                              <option value="प्याज (Onion)">प्याज (Onion)</option>
                              <option value="चना (Gram)">चना (Gram)</option>
                              <option value="मक्का (Maize)">मक्का (Maize)</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 text-[10px] font-bold">
                          <button
                            type="button"
                            onClick={() => setEditingPlot(null)}
                            className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-250 border border-slate-200 rounded-xl cursor-pointer"
                          >
                            रद्द करें
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!editingPlot.name || !editingPlot.acreage) {
                                alert("❌ कृपया खेत का नाम और रकबा भरें!");
                                return;
                              }
                              await handleUpdatePlot(farmer.id, editingPlot.plotId, editingPlot.name, Number(editingPlot.acreage), editingPlot.crop);
                              setEditingPlot(null);
                            }}
                            className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl shadow-xs cursor-pointer"
                          >
                            सुरक्षित करें 💾
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={f.id || i} className="bg-white p-3 rounded-2xl border border-slate-200 flex justify-between items-center shadow-xs leading-normal font-sans">
                      <div>
                        <p className="font-black text-slate-800 text-[10.5px] flex items-center">
                          <span>{f.name}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          रकबा: <strong className="text-slate-705 font-mono font-bold">{f.acreage} एकड़</strong> | फसल: <strong className="text-emerald-700 font-extrabold">{f.activeCrop || farmer.activeCrop}</strong>
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          title="विवरण सुधारें"
                          onClick={() => setEditingPlot({
                            plotId: f.id,
                            name: f.name,
                            acreage: String(f.acreage),
                            crop: f.activeCrop || farmer.activeCrop || "सोयाबीन (Soybean)"
                          })}
                          className="bg-slate-50 border border-slate-100 hover:bg-indigo-50 hover:text-indigo-700 px-2 py-1 text-slate-500 transition-all text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          ✏️ सुधारें
                        </button>
                        <button
                          type="button"
                          title="हटाएं"
                          onClick={() => {
                            showConfirm(
                              "खेत हटाएं ⚠️",
                              `क्या आप वाकई इस खेत "${f.name}" को हटाना चाहते हैं? यह प्रक्रिया अपरिवर्तनीय है!`,
                              () => handleDeletePlot(farmer.id, f.id)
                            );
                          }}
                          className="bg-slate-50 border border-slate-100 hover:bg-rose-50 hover:text-rose-700 px-2 py-1 text-slate-500 transition-all text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          🗑️ हटाएं
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-[10.5px] italic text-slate-400 text-center py-2 col-span-2">कोई खेत रजिस्टर्ड नहीं है।</p>
              )}
            </div>
          </div>

          {/* Inline subplot adder form */}
          <form onSubmit={handleCreatePlot} className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-3 shadow-xs">
            <p className="font-extrabold text-[11px] text-slate-900 flex items-center">
              <PlusCircle className="h-4 w-4 mr-1 text-emerald-700 font-sans" />
              <span>खेत का नया भाग / प्लॉट पंजीकृत करें:</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                placeholder="खेत का नाम (उदा: बरगद वाला प्लॉट)"
                value={plotName}
                onChange={(e) => setPlotName(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg outline-none focus:border-emerald-600 text-[10.5px] font-sans font-medium"
              />
              <input
                type="number"
                step="0.01"
                placeholder="रकबा (एकड़ में, उदा: 3.5)"
                value={plotAcreage}
                onChange={(e) => setPlotAcreage(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg outline-none focus:border-emerald-600 text-[10.5px] font-mono font-medium"
              />
              <select
                value={plotCrop}
                onChange={(e) => setPlotCrop(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg outline-none focus:border-emerald-600 text-[10.5px] font-sans font-semibold text-slate-700"
              >
                <option value="गेहूं (Wheat)"> गेहूं (Wheat)</option>
                <option value="धान (Paddy)">धान (Paddy)</option>
                <option value="सोयाबीन (Soybean)">सोयाबीन (Soybean)</option>
                <option value="लहसुन (Garlic)">लहसुन (Garlic)</option>
                <option value="कपास (Cotton)">कपास (Cotton)</option>
                <option value="चना (Gram)">चना (Gram)</option>
              </select>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="bg-[#0b1329] hover:bg-slate-900 active:scale-95 text-white text-[10.5px] px-4 py-2 rounded-xl h-8 flex items-center font-bold tracking-tight transition-all outline-none cursor-pointer"
              >
                प्लॉट सुरक्षित करें
              </button>
            </div>
          </form>

          {/* Sub financial sheet analytics */}
          <div className="bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-100 flex justify-between text-center leading-normal font-sans shadow-xs gap-3">
            <div>
              <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wide">कुल मंडी बिकावली</span>
              <strong className="text-emerald-700 font-bold font-mono text-xs">₹{totalIncomeCrop.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wide">कुल निवेश / लागत</span>
              <strong className="text-rose-700 font-bold font-mono text-xs">₹{totalSpentOnInputs.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wide">शुद्ध शुद्ध मुनाफा</span>
              <strong className={`font-bold font-mono text-xs ${netProfit >= 0 ? "text-emerald-800" : "text-rose-800"}`}>
                ₹{netProfit.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* Delete farmer handler trigger */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-[9.5px] text-slate-400 block font-medium">खाता ID: {farmer.id}</span>
            <button
              onClick={() => {
                showConfirm(
                  "किसान प्रोफाइल हटाएं ⚠️",
                  `क्या आप वाकई किसान "${farmer.name}" की संपूर्ण प्रोफाइल को मिटाना चाहते हैं? यह क्रिया अपरिवर्तनीय है!`,
                  () => deleteFarmer(farmer.id)
                );
              }}
              className="text-rose-600 hover:text-rose-800 font-extrabold flex items-center space-x-1 outline-none hover:bg-rose-50 px-2 py-1 rounded cursor-pointer"
            >
              <Trash className="h-3 w-3" />
              <span>किसान मिटाएं</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
