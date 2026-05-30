import React, { useState, useEffect } from "react";
import { MandiRate } from "../../types";
import { MANDI_FEED_STOCKS } from "../../context/AppContext";
import { TrendingUp, TrendingDown, CloudSun, CalendarCheck } from "lucide-react";

export const LiveMandiRates: React.FC = () => {
  // Simulate live price micro-fluctuations every 12 seconds
  const [rates, setRates] = useState<MandiRate[]>(MANDI_FEED_STOCKS);

  useEffect(() => {
    const interval = setInterval(() => {
      setRates((prev) =>
        prev.map((rate) => {
          const shiftPct = (Math.random() - 0.48) * 0.4; // subtle positive bias
          const newRate = Math.round(rate.marketRate * (1 + shiftPct / 100));
          return {
            ...rate,
            marketRate: newRate,
            dailyChange: Number((rate.dailyChange + shiftPct).toFixed(2))
          };
        })
      );
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-xs text-left space-y-3.5 select-none leading-normal font-sans">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
        <div>
          <h4 className="font-extrabold text-slate-800 text-[12px] tracking-tight flex items-center space-x-1.5">
            <CloudSun className="h-4.5 w-4.5 text-amber-500 font-bold" />
            <span>लाइव मण्डी भाव (Mandi Board Realtime Feed)</span>
          </h4>
          <span className="text-[10px] text-slate-400">आसपास की प्रमुख मण्डियों (नीमच, पिपलिया) के दैनिक सरकारी भाव</span>
        </div>
        <span className="text-[9.5px] uppercase font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full font-bold">
          LIVE STREAMING
        </span>
      </div>

      {/* Grid items */}
      <div className="grid grid-cols-2 gap-3">
        {rates.map((feed) => {
          const isUp = feed.dailyChange >= 0;
          return (
            <div
              key={feed.crop}
              className="bg-slate-50 border border-slate-200/85 rounded-2xl p-3 flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-all font-sans"
            >
              <div className="flex justify-between items-center text-[10px]">
                <strong className="font-black text-slate-800 text-[11px]">{feed.crop}</strong>
                <span
                  className={`font-mono font-bold flex items-center space-x-0.5 ${isUp ? "text-emerald-600" : "text-rose-500"}`}
                >
                  {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{isUp ? "+" : ""}{feed.dailyChange}%</span>
                </span>
              </div>

              <div className="flex justify-between items-end mt-2">
                <div>
                  <span className="text-[8.5px] text-slate-500 block uppercase font-bold leading-none mb-0.5">मध्यमान भाव</span>
                  <strong className="font-mono text-xs font-black text-slate-900">₹{feed.marketRate}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[8.5px] text-indigo-400 block uppercase font-bold leading-none mb-0.5">अगले माह अनु.</span>
                  <strong className="font-mono text-[10.5px] font-bold text-slate-700">
                    ₹{Math.round(feed.marketRate * 1.03)}
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[9px] text-slate-400 text-center leading-relaxed">
        ⚠️ सरकारी मंडी बोर्ड की संस्तुतिनुसार उपरोक्त भावों में 1-2% का स्थानिक आढ़त अन्तर संभव है।
      </p>
    </div>
  );
};
