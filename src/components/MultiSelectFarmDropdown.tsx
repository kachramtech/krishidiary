import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";

interface FarmField {
  id: string;
  name: string;
  acreage: number;
  activeCrop: string;
  farmerId: string;
}

interface MultiSelectFarmDropdownProps {
  allPlots: FarmField[];
  selectedFarmIdString: string; // comma-separated farm plot IDs
  onChange: (farmIds: string, farmerId: string, crops: string) => void;
  onQuickAdd: () => void;
  farmerIdFilter?: string; // If we want to filter by currently selected farmer, or just show all
}

export const MultiSelectFarmDropdown: React.FC<MultiSelectFarmDropdownProps> = ({
  allPlots,
  selectedFarmIdString,
  onChange,
  onQuickAdd,
  farmerIdFilter
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse currently selected farm IDs
  const selectedIds = selectedFarmIdString
    ? selectedFarmIdString.split(",").filter(Boolean)
    : [];

  // Filter plots if a farmerId is selected, but usually we show all or farmer-specific plots
  const filteredPlots = farmerIdFilter
    ? allPlots.filter(p => p.farmerId === farmerIdFilter)
    : allPlots;

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleSelect = (plotId: string) => {
    const plot = allPlots.find(p => p.id === plotId);
    if (!plot) return;

    let nextIds: string[];
    if (selectedIds.includes(plotId)) {
      nextIds = selectedIds.filter(id => id !== plotId);
    } else {
      nextIds = [...selectedIds, plotId];
    }

    triggerChange(nextIds);
  };

  const handleSelectAll = () => {
    // If all are already selected, clear selection
    const allFilteredIds = filteredPlots.map(p => p.id);
    const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedIds.includes(id));

    let nextIds: string[];
    if (isAllSelected) {
      // Remove all filtered ones from selection
      nextIds = selectedIds.filter(id => !allFilteredIds.includes(id));
    } else {
      // Add all filtered ones to selection
      nextIds = Array.from(new Set([...selectedIds, ...allFilteredIds]));
    }

    triggerChange(nextIds);
  };

  const triggerChange = (nextIds: string[]) => {
    // Find corresponding plots
    const selectedPlots = allPlots.filter(p => nextIds.includes(p.id));
    const farmIdStr = nextIds.join(",");
    
    // Determine farmerId (use the first chosen plot's farmerId, or empty if none)
    const firstPlotFarmerId = selectedPlots.length > 0 ? selectedPlots[0].farmerId : "";
    
    // Combine unique crop names
    const uniqueCrops = Array.from(new Set(selectedPlots.map(p => p.activeCrop).filter(Boolean)));
    const cropsStr = uniqueCrops.join(", ");

    onChange(farmIdStr, firstPlotFarmerId, cropsStr);
  };

  // Label to show on the button
  const getButtonLabel = () => {
    if (selectedIds.length === 0) {
      return "-- खेत का चयन करें --";
    }
    
    const selectedPlots = allPlots.filter(p => selectedIds.includes(p.id));
    if (selectedPlots.length === 1) {
      return `📍 ${selectedPlots[0].name} (${selectedPlots[0].activeCrop || "कोई फसल नहीं"})`;
    }

    // Check if all filtered are selected
    const allFilteredIds = filteredPlots.map(p => p.id);
    const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedIds.includes(id));

    if (isAllSelected && filteredPlots.length > 1) {
      const cropsList = Array.from(new Set(filteredPlots.map(p => p.activeCrop).filter(Boolean))).join(", ");
      return `🌾 सभी खेत (${filteredPlots.length} खेत - ${cropsList || "कोई नहीं"})`;
    }

    const nameList = selectedPlots.map(p => p.name).join(", ");
    return `🗺️ ${selectedIds.length} खेत चयनित (${nameList})`;
  };

  const allFilteredIds = filteredPlots.map(p => p.id);
  const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedIds.includes(id));

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans font-bold text-slate-700 text-xs flex justify-between items-center cursor-pointer outline-none hover:bg-slate-100/50 transition-colors"
      >
        <span className="truncate pr-2">{getButtonLabel()}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto p-1.5 space-y-1 font-sans">
          {/* Select All Option */}
          {filteredPlots.length > 0 ? (
            <button
              type="button"
              onClick={handleSelectAll}
              className="w-full flex items-center justify-between text-left p-2 rounded-lg hover:bg-emerald-50 text-emerald-800 text-xs font-bold cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${isAllSelected ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-slate-50"}`}>
                  {isAllSelected && <Check size={10} className="stroke-[3]" />}
                </div>
                <span>📢 सभी खेतों को चुनें (Select All Fields)</span>
              </div>
              <span className="text-[10px] bg-emerald-100/60 text-emerald-700 px-1.5 py-0.5 rounded font-black">
                {filteredPlots.length} खेत
              </span>
            </button>
          ) : (
            <div className="p-2 text-slate-400 text-xs text-center font-bold">
              कोई खेत उपलब्ध नहीं है
            </div>
          )}

          {filteredPlots.length > 0 && <div className="border-t border-slate-100 my-1" />}

          {/* Individual Plot Options */}
          <div className="space-y-0.5 max-h-36 overflow-y-auto">
            {filteredPlots.map((plot) => {
              const isSelected = selectedIds.includes(plot.id);
              return (
                <button
                  key={plot.id}
                  type="button"
                  onClick={() => handleToggleSelect(plot.id)}
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left text-xs cursor-pointer transition-colors ${isSelected ? "bg-slate-50 text-slate-905 font-extrabold" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"}`}>
                    {isSelected && <Check size={10} className="stroke-[3]" />}
                  </div>
                  <div className="flex-1 truncate">
                    <span>📍 {plot.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal block">
                      फसल: {plot.activeCrop || "N/A"} • रकबा: {plot.acreage} एकड़
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Add Plot Trigger Button */}
          <div className="border-t border-slate-100 pt-1.5 my-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onQuickAdd();
              }}
              className="w-full flex items-center justify-center space-x-1 p-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-black hover:bg-emerald-100/80 cursor-pointer transition-colors"
            >
              <Plus size={12} className="stroke-[3]" />
              <span>➕ नया खेत जोड़ें (Register New Farm)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
