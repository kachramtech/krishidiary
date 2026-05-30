import React, { useState } from "react";
import { DollarSign, RotateCcw } from "lucide-react";

export const MandiCalcWidget: React.FC = () => {
  const [gross, setGross] = useState<number>(60);
  const [deductionRate, setDeductionRate] = useState<number>(1.5);
  const [ratePerQuintal, setRatePerQuintal] = useState<number>(2450);

  const calculatedDeductions = gross * (deductionRate / 100);
  const netWeight = gross - calculatedDeductions;
  const netPayment = netWeight * ratePerQuintal;

  const handleReset = () => {
    setGross(60);
    setDeductionRate(1.5);
    setRatePerQuintal(2450);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-xs text-left space-y-3.5 select-none leading-normal">
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <div>
          <h4 className="font-extrabold text-slate-800 text-[12px] tracking-tight">डिजिटल काटा एवं कटौती कैलकुलेटर</h4>
          <span className="text-[10px] text-slate-400">किसान सुरक्षा हितैषी: तौल प्रविष्टि अनुमान जाँच सिमुलेटर</span>
        </div>
        <button
          onClick={handleReset}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 font-sans">
        <div className="space-y-1">
          <label className="text-slate-500 font-bold block">सकल उपज वज़न (Gross Weight - क्विंटल में)</label>
          <input
            type="number"
            step="0.01"
            value={gross || ""}
            onChange={(e) => setGross(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none focus:border-indigo-600 font-bold font-mono text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label className="text-slate-500 font-bold block">कटौती दर (kg/क्विंटल)</label>
            <input
              type="number"
              step="0.1"
              value={deductionRate || ""}
              onChange={(e) => setDeductionRate(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none focus:border-indigo-600 font-bold font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-500 font-bold block">भाव (₹/क्विंटल)</label>
            <input
              type="number"
              value={ratePerQuintal || ""}
              onChange={(e) => setRatePerQuintal(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none focus:border-indigo-600 font-bold font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Visual Result display */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 font-mono text-xs select-text">
        <div className="flex justify-between">
          <span className="text-slate-400 font-sans">कचरा काट कुल क्विंटल:</span>
          <span className="text-red-400 font-bold">-{calculatedDeductions.toFixed(2)} q</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 font-sans font-medium">शुद्ध माल शुद्ध वज़न (Net Weight):</span>
          <span className="text-amber-300 font-bold">{netWeight.toFixed(2)} q</span>
        </div>
        <div className="flex justify-between border-t border-slate-800 pt-2 mt-2">
          <span className="text-slate-200 font-sans font-bold text-[11px]">शुद्ध किसान भुगतान (Pure Share):</span>
          <span className="text-emerald-400 font-sans font-extrabold text-sm">
            ₹{netPayment.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          </span>
        </div>
      </div>
    </div>
  );
};
