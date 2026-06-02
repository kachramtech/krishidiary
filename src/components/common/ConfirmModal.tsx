import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { useAppState } from "../../context/AppContext";

export const ConfirmModal: React.FC = () => {
  const { confirmState, closeConfirm } = useAppState();

  if (!confirmState || !confirmState.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-sans animate-fadeIn">
      <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-left shadow-2xl relative overflow-hidden text-slate-200 animate-scaleIn">
        {/* Color accent bar matching warn triggers */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-amber-500" />
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4 mt-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-white text-[13.5px] leading-tight select-text">
              {confirmState.title || "पुष्टि करें"}
            </h3>
          </div>
          <button
            onClick={closeConfirm}
            className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-xl transition-all outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message body */}
        <p className="text-slate-350 text-[11.5px] leading-relaxed select-text font-medium mb-6">
          {confirmState.message}
        </p>

        {/* Operations Buttons */}
        <div className="flex space-x-2.5 justify-end">
          <button
            onClick={closeConfirm}
            className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 text-[11px] font-bold rounded-xl transition-all cursor-pointer outline-none"
          >
            रद्द करें (Cancel)
          </button>
          <button
            onClick={confirmState.onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-[11px] font-black rounded-xl cursor-pointer shadow-md shadow-rose-950/20 transition-all outline-none"
          >
            हाँ, हटाएं (Delete)
          </button>
        </div>
      </div>
    </div>
  );
};
