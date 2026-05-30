import React from "react";
import { useAppState } from "../../context/AppContext";
import { Database, Activity } from "lucide-react";

export const AuditLogsView: React.FC = () => {
  const { audits } = useAppState();

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-xs text-left space-y-4 select-none leading-normal font-sans">
      
      {/* Header Info */}
      <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
        <div>
          <h4 className="font-extrabold text-slate-800 text-[12px] tracking-tight flex items-center space-x-1.5">
            <Database className="h-4.5 w-4.5 text-indigo-700 font-bold animate-pulse" />
            <span>सुरक्षा एवं प्रविष्टि ऑडिट लॉग (Audit Compliance Ledger)</span>
          </h4>
          <span className="text-[10px] text-slate-400">ऑपरेटरों द्वारा दर्ज की गई प्रत्येक वित्तीय एवं किसान परिवर्तन क्रिया का इतिहास</span>
        </div>
        <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-indigo-50 text-[#1e1b4b] border border-indigo-100 rounded-full font-bold">
          IMMUTABLE TRACE
        </span>
      </div>

      {/* Audit List Scrollable container */}
      <div className="space-y-2 overflow-y-auto max-h-[290px] pr-1 scrollbar-style">
        {audits && audits.length > 0 ? (
          audits.map((audit) => {
            const isFarmer = audit.targetCollection === "farmers";
            const isLabor = audit.targetCollection === "labor";
            const isTx = audit.targetCollection === "transactions";
            
            let colorMap = "border-amber-100 bg-amber-50 text-amber-900";
            if (isFarmer) colorMap = "border-emerald-100 bg-emerald-50 text-emerald-900";
            if (isLabor) colorMap = "border-purple-100 bg-purple-50 text-purple-900";
            if (isTx) colorMap = "border-indigo-100 bg-indigo-50 text-indigo-900";

            return (
              <div
                key={audit.id}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col sm:flex-row justify-between items-start gap-2 text-[10.5px] font-sans"
              >
                <div className="space-y-1 w-full sm:w-2/3">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-800 leading-none">
                      👤 {audit.operatorName || "ऑपरेटर"}
                    </span>
                    <span className={`text-[9px] uppercase font-bold border rounded px-1.5 py-0.5 ${colorMap}`}>
                      {audit.action}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium text-xs leading-normal">
                    {audit.details}
                  </p>
                </div>

                <div className="text-right self-end sm:self-auto leading-none w-full sm:w-1/3">
                  <span className="text-[9px] text-slate-400 font-mono block">ID: {audit.id}</span>
                  <span className="text-[9.5px] text-slate-500 font-bold font-sans block mt-1.5">
                    {new Date(audit.timestamp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    })}{" | "}
                    {new Date(audit.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short"
                    })}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-[10.5px] text-slate-400 italic text-center py-6 font-sans">
            कोई सिस्टम सुरक्षा ट्रेल प्रविष्ट नहीं की गई है।
          </p>
        )}
      </div>
    </div>
  );
};
