import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";

export const AGRONOMY_TIPS = [
  {
    title: "सोयाबीन बुवाई टिप",
    desc: "मानसून की पहली पर्याप्त बारिश (लगभग 3-4 इंच) के बाद ही बोनी करें ताकि बीज का सही अंकुरण हो और उत्पादकता बढ़े।"
  },
  {
    title: "यूरिया एवं खादों की काट संरक्षण",
    desc: "मंडी बेचने से पहले दाने कड़क सुखाएं, 12% से कम नमी होने पर व्यापारी कचरा काट (Deduction Rate) को कम आकलित करेगा।"
  },
  {
    title: "पेमेंट सुरक्षा चक्र",
    desc: "मंडी में फसल बेचते समय यदि आंशिक भुगतान बकाया है, तो आढ़ती से भुगतान रसीद और चेक बुक की प्रति अवश्य प्राप्त करें।"
  },
  {
    title: "मजदूर टोली एग्रीमेंट",
    desc: "बल्क मजदूरों के साथ सीजन की शुरुआत में कार्य-वार (जैसे बोवनी या कटाई) प्रति एकड़ ठेका तय कर लिखवा लें जिससे विवाद न हो।"
  }
];

export const TipsCarousel: React.FC = () => {
  const [tipsIndex, setTipsIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipsIndex((prev) => (prev + 1) % AGRONOMY_TIPS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const activeTip = AGRONOMY_TIPS[tipsIndex];

  return (
    <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start space-x-3.5">
        <div className="p-2.5 bg-emerald-950 rounded-2xl border border-emerald-500/30 text-emerald-400">
          <BookOpen className="h-5.5 w-5.5 text-emerald-400 animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block font-sans">
            कृषि ज्ञान केंद्र (Advisory System)
          </span>
          <h4 className="font-bold text-slate-100 text-sm mt-0.5 leading-tight">
            {activeTip.title}
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-full md:max-w-2xl leading-relaxed">
            {activeTip.desc}
          </p>
        </div>
      </div>
      <div className="flex space-x-1.5 self-center md:self-auto">
        {AGRONOMY_TIPS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setTipsIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all outline-none ${idx === tipsIndex ? "bg-emerald-400 w-5" : "bg-slate-700 hover:bg-slate-600"}`}
          />
        ))}
      </div>
    </div>
  );
};
