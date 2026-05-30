import React, { useState, useEffect } from "react";
import { useAppState } from "../context/AppContext";
import {
  Folder,
  ChevronLeft,
  X,
  Search,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Info,
  DollarSign,
  TrendingUp,
  Package,
  Dna,
  Activity,
  User,
  MapPin,
  Phone,
  Scale,
  Mic,
  ArrowRight,
  Shield,
  HelpCircle,
  Users,
  Feather,
  Droplet,
  Sprout,
  Briefcase,
  BarChart3,
  PieChart,
  ChevronRight,
  BookOpen,
  UserCheck
} from "lucide-react";

// Pre-seeded Fertilizer brands & options
const FERTILIZER_BRANDS = ["यूरिया (Urea - 46%)", "DAP (18:46:0)", "NPK (12:32:16)", "SSP (Single Super Phosphate)", "जैविक खाद (Organic Compost)"];
// Pre-seeded Seed varieties
const SEED_VARIETIES = ["गेहूं लोक-1 (Wheat Lok-1)", "गेहूं सरबती (Sharbati)", "सोयाबीन JS-9560 (Soybean)", "लहसुन अमरेटा (Amreta Garlic)", "कपास हाइब्रिड (Cotton Hybrid)"];
// Pre-seeded pesticides/medicines
const PESTICIDE_PRODUCT = ["कोराजन (Coragen Insecticide)", "उलाला (Ulalac Pesticide)", "साफ़ फफूंदनाशक (Saaf Fungicide)", "सुपर कोन्सीडा (Super Growth Regulator)"];

export const AndroidDashboard: React.FC = () => {
  const {
    farmers,
    transactions,
    labors,
    audits,
    financialYear,
    setFinancialYear,
    createFarmer,
    createTransaction,
    createLabor,
    deleteFarmer,
    deleteTransaction,
    deleteLabor,
    triggerWhatsAppReminder,
    overallIncome,
    overallExpense,
    overallProfit,
    logAudit,
    handleAddPlotInline
  } = useAppState();

  // Android OS System state
  const [deviceTime, setDeviceTime] = useState("");
  const [deviceDate, setDeviceDate] = useState("");
  const [batteryLevel, setBatteryLevel] = useState(94);
  const [activeApp, setActiveApp] = useState<string | null>(null); // 'income' | 'expense' | 'fertilizer' | 'seed' | 'pesticide' | 'labor' | 'farmers' | 'calculator' | 'rates' | 'audits' | 'farm_management' | 'crop_management' | 'merchant_management' | 'consolidated_report' | 'farm_plot_report' | 'income_report' | 'expense_report'
  const [folderOpen, setFolderOpen] = useState(false); // 'प्रबंधन' folder overlay click state
  const [profileFolderOpen, setProfileFolderOpen] = useState(false); // 'प्रोफ़ाइल प्रबंधन' folder overlay click state
  const [reportFolderOpen, setReportFolderOpen] = useState(false); // 'रिपोर्ट' folder overlay click state
  const [reportYearFilter, setReportYearFilter] = useState<string>("सभी"); // 'सभी' | '2026-2027' | '2025-2026'
  const [searchQuery, setSearchQuery] = useState("");

  // Crop registration custom list state
  const [registeredCrops, setRegisteredCrops] = useState<Array<{id: string, name: string, variety: string, company: string}>>(() => {
    const saved = localStorage.getItem("agri_registered_crops");
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Merchant registration custom list state
  const [registeredMerchants, setRegisteredMerchants] = useState<Array<{id: string, name: string, phone: string, cropsPurchased: string}>>(() => {
    const saved = localStorage.getItem("agri_registered_merchants");
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem("agri_registered_crops", JSON.stringify(registeredCrops));
  }, [registeredCrops]);

  useEffect(() => {
    localStorage.setItem("agri_registered_merchants", JSON.stringify(registeredMerchants));
  }, [registeredMerchants]);

  // Form states for profile management
  const [farmForm, setFarmForm] = useState({ farmerId: "", name: "", acreage: "2.5", crop: "गेहूं (Wheat)" });
  const [cropForm, setCropForm] = useState({ name: "", variety: "", company: "" });
  const [merchantForm, setMerchantForm] = useState({ name: "", phone: "", cropsPurchased: "" });

  const handleRegisterFarmPlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmForm.farmerId || !farmForm.name || !farmForm.acreage) {
      alert("❌ कृपया किसान, खेत का नाम और रकबा (एरिया) दर्ज करें!");
      return;
    }
    await handleAddPlotInline(farmForm.farmerId, farmForm.name, Number(farmForm.acreage), farmForm.crop);
    alert("✅ नया खेत सफलतापूर्वक पंजीकृत कर जोड़ा गया!");
    setFarmForm({ farmerId: "", name: "", acreage: "2.5", crop: "गेहूं (Wheat)" });
    setShowAddForm(false);
  };

  const handleRegisterCropObj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropForm.name || !cropForm.variety || !cropForm.company) {
      alert("❌ कृपया फसल का नाम, किस्म और कंपनी का नाम दर्ज करें!");
      return;
    }
    const newCrop = {
      id: "crop_" + Date.now(),
      name: cropForm.name,
      variety: cropForm.variety,
      company: cropForm.company
    };
    setRegisteredCrops(prev => [newCrop, ...prev]);
    alert("✅ नयी फसल किस्म सफलतापूर्वक पंजीकृत की गयी!");
    setCropForm({ name: "", variety: "", company: "" });
    setShowAddForm(false);
    logAudit("REGISTER_CROP", newCrop.id, "farmers", `पंजीकृत नयी फसल: ${cropForm.name} (किस्म: ${cropForm.variety}, ब्रांड/कंपनी: ${cropForm.company})`);
  };

  const handleRegisterMerchantObj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantForm.name || !merchantForm.phone || !merchantForm.cropsPurchased) {
      alert("❌ कृपया व्यापारी का नाम, मोबाइल नंबर और फसल/सब्जी जानकारी दर्ज करें!");
      return;
    }
    const newMerchant = {
      id: "mer_" + Date.now(),
      name: merchantForm.name,
      phone: merchantForm.phone,
      cropsPurchased: merchantForm.cropsPurchased
    };
    setRegisteredMerchants(prev => [newMerchant, ...prev]);
    alert("✅ नया व्यापारिक संपर्क सफलतापूर्वक सहेजा गया!");
    setMerchantForm({ name: "", phone: "", cropsPurchased: "" });
    setShowAddForm(false);
    logAudit("REGISTER_MERCHANT", newMerchant.id, "farmers", `पंजीकृत नए व्यापारी संपर्क: ${merchantForm.name} (मोबाईल: ${merchantForm.phone}, फ़सल खरीदी: ${merchantForm.cropsPurchased})`);
  };

  // Modals inside Android Window apps
  const [showAddForm, setShowAddForm] = useState(false);

  // Time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDeviceTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
      const weeks = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
      const months = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
      setDeviceDate(`${weeks[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const allPlots = farmers.reduce((acc: any[], f) => {
    if (f.farms && f.farms.length > 0) {
      f.farms.forEach((plot: any) => {
        acc.push({
          ...plot,
          farmerId: f.id,
          farmerName: f.name
        });
      });
    }
    return acc;
  }, []);

  // Filtered farmers for general directories
  const filteredFarmers = farmers.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.phone.includes(searchQuery)
  );

  // Form states
  const [farmerForm, setFarmerForm] = useState({ name: "", village: "", phone: "", totalAcreage: 4, activeCrop: "गेहूं (Wheat)" });
  const [incomeForm, setIncomeForm] = useState({ farmerId: "", farmId: "", crop: "गेहूं (Wheat)", amount: "", category: "crop_sale", date: new Date().toISOString().split("T")[0], isMandiSale: false, grossWeight: "", deductionRate: "2", traderName: "", isCreditSale: false, dueDate: "" });
  const [expenseForm, setExpenseForm] = useState({ farmerId: "", farmId: "", crop: "गेहूं (Wheat)", amount: "", category: "diesel", date: new Date().toISOString().split("T")[0], isCreditSale: false, dueDate: "" });
  const [fertilizerForm, setFertilizerForm] = useState({ farmerId: "", farmId: "", crop: "गेहूं (Wheat)", fertilizerBrand: "यूरिया (Urea - 46%)", bagsCount: "2", costPerBag: "350", date: new Date().toISOString().split("T")[0] });
  const [seedForm, setSeedForm] = useState({ farmerId: "", farmId: "", crop: "गेहूं (Wheat)", seedVariety: "गेहूं लोक-1 (Wheat Lok-1)", quantityKg: "40", cost: "1800", date: new Date().toISOString().split("T")[0] });
  const [pesticideForm, setPesticideForm] = useState({ farmerId: "", farmId: "", crop: "गेहूं (Wheat)", productName: "कोराजन (Coragen Insecticide)", cost: "950", date: new Date().toISOString().split("T")[0] });
  const [laborFormState, setLaborFormState] = useState({ farmerId: "", farmId: "", crop: "गेहूं (Wheat)", mode: "individual" as "individual" | "bulk_gang", laborerName: "", attendance: "present" as any, workersCount: "5", groupName: "", workDescription: "", contractAmount: "", advancePaid: "", date: new Date().toISOString().split("T")[0] });

  // Mandi manual calculator
  const [calcForm, setCalcForm] = useState({ gross: "50", rate: "2450", cutPercent: "1.5" });

  // Custom Form Handlers
  const handleRegisterFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerForm.name || !farmerForm.village || !farmerForm.phone) {
      alert("❌ कृपया नाम, ग्राम और मोबाइल नंबर पूर्ण रूप से दर्ज करें!");
      return;
    }
    const defaultPlots = [{ id: "plot_" + Date.now(), name: "सड़क पार खेत (Road Side)", acreage: Number(farmerForm.totalAcreage), activeCrop: farmerForm.activeCrop }];
    await createFarmer(farmerForm, defaultPlots);
    alert("✅ नया किसान सफलतापूर्वक पंजीकृत किया गया!");
    setFarmerForm({ name: "", village: "", phone: "", totalAcreage: 4, activeCrop: "गेहूं (Wheat)" });
    setShowAddForm(false);
  };

  const handleRegisterIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.farmId || !incomeForm.amount) {
      alert("❌ कृपया खेत और कुल राशि का विवरण दर्ज करें!");
      return;
    }
    const payload = {
      farmerId: incomeForm.farmerId,
      farmId: incomeForm.farmId,
      crop: incomeForm.crop,
      type: "income",
      category: incomeForm.category,
      amount: Number(incomeForm.amount),
      date: incomeForm.date,
      isMandiSale: incomeForm.isMandiSale,
      grossWeight: Number(incomeForm.grossWeight || 0),
      deductionRate: Number(incomeForm.deductionRate || 0),
      traderName: incomeForm.traderName,
      isCreditSale: incomeForm.isCreditSale,
      dueDate: incomeForm.dueDate,
      paymentStatus: incomeForm.isCreditSale ? "partially_paid" : "paid"
    };
    await createTransaction(payload);
    alert("✅ फसल बिक्री/आय विवरण सुरक्षित कर दिया गया!");
    setIncomeForm({ farmerId: "", farmId: "", crop: "गेहूं (Wheat)", amount: "", category: "crop_sale", date: new Date().toISOString().split("T")[0], isMandiSale: false, grossWeight: "", deductionRate: "2", traderName: "", isCreditSale: false, dueDate: "" });
    setShowAddForm(false);
  };

  const handleRegisterExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.farmId || !expenseForm.amount) {
      alert("❌ कृपया खेत और कुल खर्च राशि दर्ज करें!");
      return;
    }
    const payload = {
      farmerId: expenseForm.farmerId,
      farmId: expenseForm.farmId,
      crop: expenseForm.crop,
      type: "expense",
      category: expenseForm.category,
      amount: Number(expenseForm.amount),
      date: expenseForm.date,
      isCreditSale: expenseForm.isCreditSale,
      dueDate: expenseForm.dueDate,
      paymentStatus: expenseForm.isCreditSale ? "unpaid" : "paid"
    };
    await createTransaction(payload);
    alert("✅ सामान्य व्यय विवरण सफलतापूर्वक दर्ज हो चुका है!");
    setExpenseForm({ farmerId: "", farmId: "", crop: "गेहूं (Wheat)", amount: "", category: "diesel", date: new Date().toISOString().split("T")[0], isCreditSale: false, dueDate: "" });
    setShowAddForm(false);
  };

  const handleRegisterFertilizer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fertilizerForm.farmId) {
      alert("❌ कृपया खेत चुनें!");
      return;
    }
    const calculatedAmount = Number(fertilizerForm.bagsCount) * Number(fertilizerForm.costPerBag);
    const payload = {
      farmerId: fertilizerForm.farmerId,
      farmId: fertilizerForm.farmId,
      crop: fertilizerForm.crop,
      type: "expense",
      category: "fertilizer",
      amount: calculatedAmount,
      date: fertilizerForm.date,
      isCreditSale: false,
      paymentStatus: "paid",
      voiceTranscription: `खाद सामग्री: ${fertilizerForm.fertilizerBrand}, मात्रा: ${fertilizerForm.bagsCount} बोरी, दर: ₹${fertilizerForm.costPerBag}/बोरी`
    };
    await createTransaction(payload);
    alert(`✅ खाद खर्च विवरण सहेजा गया! कुल लागत: ₹${calculatedAmount}`);
    setFertilizerForm({ farmerId: "", farmId: "", crop: "गेहूं (Wheat)", fertilizerBrand: "यूरिया (Urea - 46%)", bagsCount: "2", costPerBag: "350", date: new Date().toISOString().split("T")[0] });
    setShowAddForm(false);
  };

  const handleRegisterSeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedForm.farmId || !seedForm.cost) {
      alert("❌ कृपया खेत और बीज लागत विवरण पूर्ण करें!");
      return;
    }
    const payload = {
      farmerId: seedForm.farmerId,
      farmId: seedForm.farmId,
      crop: seedForm.crop,
      type: "expense",
      category: "seed",
      amount: Number(seedForm.cost),
      date: seedForm.date,
      isCreditSale: false,
      paymentStatus: "paid",
      voiceTranscription: `बीज प्रविष्टि: ${seedForm.seedVariety}, वज़न: ${seedForm.quantityKg} कि.ग्रा.`
    };
    await createTransaction(payload);
    alert("✅ बीज उपयोग विवरण सफलतापूर्वक सहेजा गया!");
    setSeedForm({ farmerId: "", farmId: "", crop: "गेहूं (Wheat)", seedVariety: "गेहूं लोक-1 (Wheat Lok-1)", quantityKg: "40", cost: "1800", date: new Date().toISOString().split("T")[0] });
    setShowAddForm(false);
  };

  const handleRegisterPesticide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesticideForm.farmId || !pesticideForm.cost) {
      alert("❌ कृपया खेत और दवा छिड़काव खर्च दर्ज करें!");
      return;
    }
    const payload = {
      farmerId: pesticideForm.farmerId,
      farmId: pesticideForm.farmId,
      crop: pesticideForm.crop,
      type: "expense",
      category: "pesticide",
      amount: Number(pesticideForm.cost),
      date: pesticideForm.date,
      isCreditSale: false,
      paymentStatus: "paid",
      voiceTranscription: `दवा / कीटनाशक प्रविष्टि: ${pesticideForm.productName}`
    };
    await createTransaction(payload);
    alert("✅ दवा / कीटनाशक छिड़काव विवरण सुरक्षित!");
    setPesticideForm({ farmerId: "", farmId: "", crop: "गेहूं (Wheat)", productName: "कोराजन (Coragen Insecticide)", cost: "950", date: new Date().toISOString().split("T")[0] });
    setShowAddForm(false);
  };

  const handleRegisterLabor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!laborFormState.farmId || !laborFormState.contractAmount) {
      alert("❌ कृपया खेत और तय मजदूरी राशि दर्ज करें!");
      return;
    }
    const payload = {
      farmerId: laborFormState.farmerId,
      farmId: laborFormState.farmId,
      crop: laborFormState.crop,
      date: laborFormState.date,
      mode: laborFormState.mode,
      contractAmount: Number(laborFormState.contractAmount),
      advancePaid: Number(laborFormState.advancePaid || 0),
      dueBalance: Number(laborFormState.contractAmount) - Number(laborFormState.advancePaid || 0),
      laborerName: laborFormState.laborerName || "मजदूर",
      attendance: laborFormState.attendance,
      workersCount: Number(laborFormState.workersCount),
      groupName: laborFormState.groupName || "अनाम टोली",
      workDescription: laborFormState.workDescription || "विविध कृषि कार्य"
    };
    await createLabor(payload);
    alert("✅ लेबर हाजिरी / बकाया रजिस्टर अद्यतन किया गया!");
    setLaborFormState({ farmerId: "", farmId: "", crop: "गेहूं (Wheat)", mode: "individual", laborerName: "", attendance: "present", workersCount: "5", groupName: "", workDescription: "", contractAmount: "", advancePaid: "", date: new Date().toISOString().split("T")[0] });
    setShowAddForm(false);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white select-none flex flex-col">
      
      {/* 🌐 Real and Professional Responsive App Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0d1224] border-b border-slate-900 px-4 md:px-8 py-3.5 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md">
            <Folder className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-widest font-black text-emerald-400 block leading-tight">किसान डिजिटल</span>
            <h1 className="text-xs sm:text-sm font-sans font-black tracking-tight text-white leading-none">कृषि केंद्र एग्रोपोर्टल</h1>
          </div>
        </div>
        
        {/* Simple desktop-friendly quick indicators */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[9px] text-slate-400 font-sans block uppercase">समेकित लाभ</span>
            <strong className="text-xs font-mono text-emerald-400 font-extrabold">+₹{overallProfit.toLocaleString()}</strong>
          </div>
          <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
          
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-bold">
              ● लाइव सत्र
            </span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg text-[10px] font-mono text-slate-300">
              {deviceTime}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Container Area */}
      <div className="flex-1 w-full max-w-xl mx-auto flex flex-col relative px-3 py-3 md:py-6">
        
        {/* 🏞️ Smartphone Android Launcher Wallpaper with full-grid desktop elements */}
        {!activeApp ? (
          <div className="flex-1 bg-cover bg-center p-5 rounded-3xl relative flex flex-col justify-between border border-slate-900 shadow-2xl min-h-[680px]" style={{ backgroundImage: "linear-gradient(to bottom, rgba(30, 27, 75, 0.85), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600')" }}>
            
            {/* Android Lock / Home widget */}
            <div className="text-center pt-16 text-white space-y-2 animate-fadeIn">
              <span className="text-[11px] uppercase tracking-widest font-extrabold text-emerald-400">किसान डिजिटल कृषि केंद्र</span>
              <h3 className="font-sans font-black text-4xl tracking-tight leading-none">{deviceTime}</h3>
              <p className="text-xs font-sans font-semibold text-slate-300">{deviceDate}</p>
            </div>

            {/* Grid of Launcher Apps & Folders */}
            <div className="grid grid-cols-3 gap-3 text-center my-12 max-w-[325px] mx-auto select-none">
              
              {/* 📂 FOLDER 1: प्रबंधन (The main folder requested by user) */}
              <button
                onClick={() => setActiveApp("folder_management")}
                className="flex flex-col items-center group outline-none focus:scale-95 transition-all text-center shrink-0 cursor-pointer"
              >
                <div className="p-3.5 bg-gradient-to-tr from-indigo-805 from-blue-700 to-indigo-600 rounded-2.5xl shadow-lg border border-indigo-500/25 relative flex items-center justify-center hover:scale-105 transition-all">
                  <Folder className="h-6 w-6 text-yellow-300 fill-yellow-250" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[9px] text-white font-black rounded-full flex items-center justify-center animate-bounce">
                    6
                  </span>
                </div>
                <span className="text-[10.5px] font-bold text-white mt-2 drop-shadow leading-tight font-sans">
                  प्रबंधन
                </span>
              </button>

              {/* 📂 FOLDER 2: प्रोफ़ाइल प्रबंधन (The requested profile management folder) */}
              <button
                onClick={() => setActiveApp("folder_profile")}
                className="flex flex-col items-center group outline-none focus:scale-95 transition-all text-center shrink-0 cursor-pointer"
              >
                <div className="p-3.5 bg-gradient-to-tr from-emerald-800 to-teal-700 rounded-2.5xl shadow-lg border border-emerald-500/25 relative flex items-center justify-center hover:scale-105 transition-all flex-shrink-0">
                  <Folder className="h-6 w-6 text-emerald-300 fill-emerald-250" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-[9px] text-white font-black rounded-full flex items-center justify-center animate-bounce font-mono">
                    3
                  </span>
                </div>
                <span className="text-[10.5px] font-bold text-white mt-2 drop-shadow leading-tight font-sans">
                  प्रोफ़ाइल प्रबंधन
                </span>
              </button>

              {/* 📂 FOLDER 3: रिपोर्ट (The newly requested reports folder) */}
              <button
                onClick={() => setActiveApp("folder_reports")}
                className="flex flex-col items-center group outline-none focus:scale-95 transition-all text-center shrink-0 cursor-pointer"
              >
                <div className="p-3.5 bg-gradient-to-tr from-purple-850 from-purple-800 to-fuchsia-700 rounded-2.5xl shadow-lg border border-purple-500/25 relative flex items-center justify-center hover:scale-105 transition-all flex-shrink-0">
                  <Folder className="h-6 w-6 text-purple-300 fill-purple-250" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-fuchsia-500 text-[9px] text-white font-black rounded-full flex items-center justify-center animate-bounce font-mono">
                    4
                  </span>
                </div>
                <span className="text-[10.5px] font-bold text-white mt-2 drop-shadow leading-tight font-sans">
                  रिपोर्ट
                </span>
              </button>

            </div>

            {/* Android Navigation Bar Simulator at Dock */}
            <div className="pt-2 border-t border-slate-800/30 flex justify-around text-slate-400 text-[10px] pb-4 font-semibold font-sans mt-auto">
              <span>🏠 होम लॉन्चर</span>
              <span>● बैकग्राउंड चालू</span>
              <span>🔒 सुरक्षित सत्र</span>
            </div>

            {/* Android standard search query filtered records lists overlays */}
            {searchQuery && (
              <div className="absolute inset-x-4 top-40 bg-slate-900 border border-slate-800 rounded-3xl max-h-[350px] overflow-y-auto p-4.5 shadow-2.5xl text-left z-50 animate-scaleIn text-white">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">खोज परिणाम ({filteredFarmers.length})</span>
                  <button onClick={() => setSearchQuery("")} className="text-rose-500 font-black text-xs">हटाएं</button>
                </div>
                {filteredFarmers.length > 0 ? (
                  <div className="space-y-2">
                    {filteredFarmers.map((f) => (
                      <div key={f.id} onClick={() => { setActiveApp("farmers"); setSearchQuery(""); }} className="p-2 hover:bg-slate-800/80 rounded-xl cursor-pointer border border-transparent hover:border-slate-700 transition-all">
                        <strong className="text-xs block text-emerald-300 font-black">{f.name}</strong>
                        <span className="text-[9.5px] text-slate-400 block font-normal">📞 {f.phone} | 📍 ग्राम: {f.village}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] italic text-slate-400 text-center py-6">कोई मेल खाता किसान नहीं मिला।</p>
                )}
              </div>
            )}



            {/* 📁 ================= PROFILE FOLDER SCREEN OVERLAY (Under Android folder flow style) ================= */}
            {false && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
                <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-[36px] w-full max-w-[340px] text-center space-y-5 shadow-2xl relative">
                  
                  {/* Close folder trigger button */}
                  <button
                    onClick={() => setProfileFolderOpen(false)}
                    className="absolute -top-3 -right-3 p-2 bg-rose-950 text-rose-450 border border-rose-900 rounded-full hover:bg-slate-800 shadow-lg text-white font-black"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="space-y-0.5">
                    <span className="font-sans font-black text-white text-md tracking-tight block">
                      📁 प्रोफ़ाइल प्रबंधन (Profiles)
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-normal font-sans">खेत, फसल और व्यापार क्रेडेंशियल्स प्रबंधन</span>
                  </div>

                  {/* 3 Grid folders/apps nested inside of "प्रोफ़ाइल प्रबंधन" folder */}
                  <div className="grid grid-cols-3 gap-y-5 gap-x-2 pb-2">
                    
                    {/* Folder 2.1: खेत प्रबंधन */}
                    <button
                      onClick={() => { setActiveApp("farm_management"); setProfileFolderOpen(false); }}
                      className="flex flex-col items-center outline-none hover:scale-105 transition-all text-center cursor-pointer"
                    >
                      <div className="p-3 bg-gradient-to-tr from-cyan-705 from-cyan-700 to-blue-500 rounded-2xl shadow-md border border-cyan-500/20 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[10.5px] font-bold text-slate-100 mt-1 font-sans leading-none">
                        खेत प्रबंधन
                      </span>
                    </button>

                    {/* Folder 2.2: फसल प्रबंधन */}
                    <button
                      onClick={() => { setActiveApp("crop_management"); setProfileFolderOpen(false); }}
                      className="flex flex-col items-center outline-none hover:scale-105 transition-all text-center cursor-pointer"
                    >
                      <div className="p-3 bg-gradient-to-tr from-emerald-700 to-green-550 rounded-2xl shadow-md border border-emerald-500/10 flex items-center justify-center">
                        <Sprout className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[10.5px] font-bold text-slate-100 mt-1 font-sans leading-none">
                        फसल प्रबंधन
                      </span>
                    </button>

                    {/* Folder 2.3: व्यापारी प्रबंधन */}
                    <button
                      onClick={() => { setActiveApp("merchant_management"); setProfileFolderOpen(false); }}
                      className="flex flex-col items-center outline-none hover:scale-105 transition-all text-center cursor-pointer"
                    >
                      <div className="p-3 bg-gradient-to-tr from-amber-700 to-yellow-500 rounded-2xl shadow-md border border-amber-600/20 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[10.5px] font-bold text-slate-100 mt-1 font-sans leading-none">
                        व्यापारी प्रबंधन
                      </span>
                    </button>

                  </div>

                  <p className="text-[9px] text-slate-500 leading-normal font-sans">पंजीकृत प्रोफाइल को किसानों और उपज रसीद प्रणालियों से जोड़ा जाता है।</p>
                </div>
              </div>
            )}

            {/* 📁 ================= REPORT FOLDER SCREEN OVERLAY (Under Android folder flow style) ================= */}
            {false && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
                <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-[36px] w-full max-w-[340px] text-center space-y-5 shadow-2xl relative animate-scaleIn">
                  
                  {/* Close folder trigger button */}
                  <button
                    onClick={() => setReportFolderOpen(false)}
                    className="absolute -top-3 -right-3 p-2 bg-rose-950 text-rose-400 border border-rose-900 rounded-full hover:bg-slate-800 shadow-lg text-white font-black"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="space-y-0.5">
                    <span className="font-sans font-black text-white text-md tracking-tight block">
                      📁 कृषि रिपोर्ट केंद्र (Reports)
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-normal font-sans">समेकित, खेतवार, आय एवं व्यय का पूर्ण विवरण</span>
                  </div>

                  {/* 4 Grid folders/apps nested inside of "कृषि रिपोर्ट केंद्र" folder */}
                  <div className="grid grid-cols-2 gap-3 pb-1">
                    
                    {/* Folder 3.1: समेकित रिपोर्ट */}
                    <button
                      onClick={() => { setActiveApp("consolidated_report"); setReportFolderOpen(false); }}
                      className="flex flex-col items-center outline-none hover:scale-105 transition-all text-center cursor-pointer p-2.5 bg-slate-850/50 rounded-2.5xl border border-slate-800"
                    >
                      <div className="p-3 bg-gradient-to-tr from-purple-700 to-indigo-600 rounded-2xl shadow-md border border-purple-500/25 flex items-center justify-center mb-1.5">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[10px] font-black text-slate-100 font-sans leading-none block">
                        समेकित रिपोर्ट
                      </span>
                    </button>

                    {/* Folder 3.2: खेतवार रिपोर्ट */}
                    <button
                      onClick={() => { setActiveApp("farm_plot_report"); setReportFolderOpen(false); }}
                      className="flex flex-col items-center outline-none hover:scale-105 transition-all text-center cursor-pointer p-2.5 bg-slate-850/50 rounded-2.5xl border border-slate-800"
                    >
                      <div className="p-3 bg-gradient-to-tr from-cyan-700 to-blue-500 rounded-2xl shadow-md border border-cyan-500/25 flex items-center justify-center mb-1.5">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[10px] font-black text-slate-100 font-sans leading-none block">
                        खेतवार रिपोर्ट
                      </span>
                    </button>

                    {/* Folder 3.3: आय रिपोर्ट */}
                    <button
                      onClick={() => { setActiveApp("income_report"); setReportFolderOpen(false); }}
                      className="flex flex-col items-center outline-none hover:scale-105 transition-all text-center cursor-pointer p-2.5 bg-slate-850/50 rounded-2.5xl border border-slate-800"
                    >
                      <div className="p-3 bg-gradient-to-tr from-emerald-700 to-teal-500 rounded-2xl shadow-md border border-emerald-500/20 flex items-center justify-center mb-1.5">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[10px] font-black text-slate-100 font-sans leading-none block">
                        आय रिपोर्ट
                      </span>
                    </button>

                    {/* Folder 3.4: व्यय रिपोर्ट */}
                    <button
                      onClick={() => { setActiveApp("expense_report"); setReportFolderOpen(false); }}
                      className="flex flex-col items-center outline-none hover:scale-105 transition-all text-center cursor-pointer p-2.5 bg-slate-850/50 rounded-2.5xl border border-slate-800"
                    >
                      <div className="p-3 bg-gradient-to-tr from-rose-700 to-amber-600 rounded-2xl shadow-md border border-rose-500/20 flex items-center justify-center mb-1.5">
                        <PieChart className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[10px] font-black text-slate-100 font-sans leading-none block">
                        व्यय रिपोर्ट
                      </span>
                    </button>

                  </div>

                  <p className="text-[9px] text-slate-500 leading-normal font-sans font-medium">वर्ष-वार फिल्टर एवं विजुअल ग्राफ़िकल चार्ट के साथ समेकित डेटा विश्लेषण।</p>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* ========================================================
             📱 FULL WINDOW ACTIVE APPLICATION SCREEN SIMULATOR
             ======================================================== */
          <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col justify-between overflow-hidden rounded-3xl shadow-2xl border border-slate-100 min-h-[680px] animate-scaleIn select-none">
            
            {/* Standard Android Application Header */}
            <div className="px-4 py-3 bg-[#0b1329] text-white flex justify-between items-center z-40 shadow">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  if (["income", "expense", "fertilizer", "seed", "pesticide", "labor"].includes(activeApp || "")) {
                    setActiveApp("folder_management");
                  } else if (["farm_management", "crop_management", "merchant_management"].includes(activeApp || "")) {
                    setActiveApp("folder_profile");
                  } else if (["consolidated_report", "farm_plot_report", "income_report", "expense_report"].includes(activeApp || "")) {
                    setActiveApp("folder_reports");
                  } else {
                    setActiveApp(null);
                  }
                }}
                className="flex items-center space-x-1 hover:text-emerald-400 transition-all font-bold text-xs"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
                <span>बैक</span>
              </button>
              
              <div className="text-center">
                <span className="text-[12px] font-black font-sans block leading-none">
                  {activeApp === "folder_management" && "📁 प्रबंधन"}
                  {activeApp === "folder_profile" && "📁 प्रोफ़ाइल प्रबंधन"}
                  {activeApp === "folder_reports" && "📁 रिपोर्ट"}
                  {activeApp === "income" && "💰 आय प्रबंधन"}
                  {activeApp === "expense" && "📈 व्यय प्रबंधन"}
                  {activeApp === "fertilizer" && "📦 खाद प्रबंधन"}
                  {activeApp === "seed" && "🌱 बीज प्रबंधन"}
                  {activeApp === "pesticide" && "💊 दवा प्रबंधन"}
                  {activeApp === "labor" && "👥 लेबर प्रबंधन"}
                  {activeApp === "farmers" && "🌾 पंजीकृत किसान बही"}
                  {activeApp === "calculator" && "⚖️ मंडी तौल कैलकुलेटर"}
                  {activeApp === "rates" && "📈 मंडी दैनिक भाव"}
                  {activeApp === "audits" && "🕵️ कृषि सुरक्षा लॉग"}
                  {activeApp === "farm_management" && "🗺️ खेत प्रबंधन"}
                  {activeApp === "crop_management" && "🌱 फसल पंजीकरण"}
                  {activeApp === "merchant_management" && "🤝 व्यापारी प्रबंधन"}
                  {activeApp === "consolidated_report" && "📊 समेकित रिपोर्ट"}
                  {activeApp === "farm_plot_report" && "🗺️ खेतवार रिपोर्ट"}
                  {activeApp === "income_report" && "📈 आय विश्लेषण रिपोर्ट"}
                  {activeApp === "expense_report" && "📉 व्यय विश्लेषण रिपोर्ट"}
                </span>
                <span className="text-[8.5px] text-slate-400 font-sans block mt-0.5">कृषि प्रबंधन प्लेटफ़ॉर्म</span>
              </div>

              {/* Action Buttons inside App Headers */}
              {["income", "expense", "fertilizer", "seed", "pesticide", "labor", "farmers", "farm_management", "crop_management", "merchant_management"].includes(activeApp || "") ? (
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="p-1 px-2.5 bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 rounded-lg text-white font-extrabold text-[9px] flex items-center space-x-1 outline-none transition-all mr-1 pr-3 shadow-md"
                >
                  <Plus className="h-3 w-3" />
                  <span>{showAddForm ? "सूची" : "जोड़ें"}</span>
                </button>
              ) : (
                <div className="w-8"></div>
              )}
            </div>

            {/* Scrollable Content Application Window Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-left relative bg-white pb-12">
              
              {/* === SUBFOLDER APP 1: प्रबंधन (Agriculture Suite) === */}
              {activeApp === "folder_management" && (
                <div className="space-y-6 animate-scaleIn">
                  <div className="p-4.5 bg-gradient-to-tr from-[#0f172a] to-[#1e1e38] border border-slate-800 rounded-[28px] text-white space-y-2 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
                    <h3 className="text-xs font-black text-amber-500 flex items-center space-x-2">
                      <span>📁 प्रबंधन (Agriculture Suite)</span>
                    </h3>
                    <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                      अपनी कृषि उपज, दैनिक व्यय, बीज, खाद, कीटनाशक दवा एवं मजूदरी का संपूर्ण प्रबंधन करें।
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Item 1: आय प्रबंधन */}
                    <button
                      onClick={() => setActiveApp("income")}
                      className="p-4 bg-white border border-slate-100 hover:border-emerald-305 hover:bg-emerald-50/20 active:bg-emerald-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-emerald-600 to-green-400 rounded-xl shadow border border-emerald-400/20 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">आय प्रबंधन</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">उपज व फसल बिक्री</span>
                      </div>
                    </button>

                    {/* Item 2: व्यय प्रबंधन */}
                    <button
                      onClick={() => setActiveApp("expense")}
                      className="p-4 bg-white border border-slate-100 hover:border-purple-305 hover:bg-purple-50/20 active:bg-purple-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-indigo-700 to-purple-500 rounded-xl shadow border border-purple-650 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">व्यय प्रबंधन</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">लागत व नकद खर्चे</span>
                      </div>
                    </button>

                    {/* Item 3: खाद प्रबंधन */}
                    <button
                      onClick={() => setActiveApp("fertilizer")}
                      className="p-4 bg-white border border-slate-100 hover:border-cyan-305 hover:bg-cyan-50/20 active:bg-cyan-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-cyan-600 to-sky-400 rounded-xl shadow border border-cyan-400/20 flex items-center justify-center">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">खाद प्रबंधन</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">उर्वरक एवं खाद स्टॉक</span>
                      </div>
                    </button>

                    {/* Item 4: बीज प्रबंधन */}
                    <button
                      onClick={() => setActiveApp("seed")}
                      className="p-4 bg-white border border-slate-100 hover:border-emerald-305 hover:bg-emerald-50/20 active:bg-emerald-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-green-700 to-emerald-555 rounded-xl shadow border border-emerald-500/10 flex items-center justify-center">
                        <Dna className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">बीज प्रबंधन</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">बीज खरीद व रिकॉर्ड</span>
                      </div>
                    </button>

                    {/* Item 5: दवा प्रबंधन */}
                    <button
                      onClick={() => setActiveApp("pesticide")}
                      className="p-4 bg-white border border-slate-100 hover:border-teal-305 hover:bg-teal-50/20 active:bg-teal-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-teal-700 to-emerald-600 rounded-xl shadow border border-teal-500/20 flex items-center justify-center">
                        <Droplet className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">दवा प्रबंधन</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">कीटनाशक एवं छिड़काव</span>
                      </div>
                    </button>

                    {/* Item 6: लेबर प्रबंधन */}
                    <button
                      onClick={() => setActiveApp("labor")}
                      className="p-4 bg-white border border-slate-100 hover:border-indigo-305 hover:bg-indigo-50/20 active:bg-indigo-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-violet-800 to-indigo-600 rounded-xl shadow border border-[#1e1e38]/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">लेबर प्रबंधन</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">कामगारों की हाजिरी</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* === SUBFOLDER APP 2: प्रोफ़ाइल प्रबंधन (Profiles) === */}
              {activeApp === "folder_profile" && (
                <div className="space-y-6 animate-scaleIn">
                  <div className="p-4.5 bg-gradient-to-tr from-[#0f172a] to-[#122b3a] border border-slate-800 rounded-[28px] text-white space-y-2 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
                    <h3 className="text-xs font-black text-cyan-400 flex items-center space-x-2">
                      <span>📁 प्रोफ़ाइल प्रबंधन (Profiles)</span>
                    </h3>
                    <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                      अपने खेत, नवीनतम फसलों और नियमित खरीदार व्यापारियों का विवरण सुरक्षित करें।
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Item 1: खेत प्रबंधन */}
                    <button
                      onClick={() => setActiveApp("farm_management")}
                      className="p-4 bg-white border border-slate-100 hover:border-cyan-305 hover:bg-cyan-50/20 active:bg-cyan-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-cyan-600 to-blue-500 rounded-xl shadow border border-cyan-500/20 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">खेत प्रबंधन</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">रकबा एवं खसरा विवरण</span>
                      </div>
                    </button>

                    {/* Item 2: फसल प्रबंधन */}
                    <button
                      onClick={() => setActiveApp("crop_management")}
                      className="p-4 bg-white border border-slate-100 hover:border-emerald-305 hover:bg-emerald-50/20 active:bg-emerald-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-emerald-700 to-green-550 rounded-xl shadow border border-emerald-500/15 flex items-center justify-center">
                        <Sprout className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-905 block font-sans">फसल पंजीकरण</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">फसलों की किस्म आदि</span>
                      </div>
                    </button>

                    {/* Item 3: व्यापारी प्रबंधन */}
                    <button
                      onClick={() => setActiveApp("merchant_management")}
                      className="p-4 bg-white border border-slate-100 hover:border-amber-305 hover:bg-amber-50/20 active:bg-amber-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer col-span-2 outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-amber-600 to-yellow-500 rounded-xl shadow border border-amber-600/20 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">व्यापारी प्रबंधन</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">मंडी आढ़ती एवं खरीदार व्यापारी संपर्क</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* === SUBFOLDER APP 3: कृषि रिपोर्ट केंद्र (Reports) === */}
              {activeApp === "folder_reports" && (
                <div className="space-y-6 animate-scaleIn">
                  <div className="p-4.5 bg-gradient-to-tr from-[#0f172a] to-[#2e121e] border border-slate-800 rounded-[28px] text-white space-y-2 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
                    <h3 className="text-xs font-black text-rose-450 flex items-center space-x-2">
                      <span>📁 कृषि रिपोर्ट केंद्र (Reports Suite)</span>
                    </h3>
                    <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                      समेकित रिपोर्ट, खेतवार लागत व मुनाफे और आय-व्यय के विश्लेषण का ग्राफ़िकल ब्यौरा।
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Item 1: समेकित रिपोर्ट */}
                    <button
                      onClick={() => setActiveApp("consolidated_report")}
                      className="p-4 bg-white border border-slate-100 hover:border-purple-305 hover:bg-purple-50/20 active:bg-purple-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-purple-700 to-indigo-600 rounded-xl shadow border border-purple-500/25 flex items-center justify-center font-black">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">समेकित रिपोर्ट</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">कुल आय व कुल व्यय</span>
                      </div>
                    </button>

                    {/* Item 2: खेतवार रिपोर्ट */}
                    <button
                      onClick={() => setActiveApp("farm_plot_report")}
                      className="p-4 bg-white border border-slate-100 hover:border-cyan-305 hover:bg-cyan-50/20 active:bg-cyan-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-cyan-700 to-blue-500 rounded-xl shadow border border-cyan-500/20 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">खेतवार रिपोर्ट</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">प्रत्येक खेत का लाभ-हानि</span>
                      </div>
                    </button>

                    {/* Item 3: आय रिपोर्ट */}
                    <button
                      onClick={() => setActiveApp("income_report")}
                      className="p-4 bg-white border border-slate-100 hover:border-emerald-305 hover:bg-emerald-50/20 active:bg-emerald-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-emerald-700 to-teal-500 rounded-xl shadow border border-emerald-500/20 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">आय रिपोर्ट</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">फ़सल उपज बिक्री आय</span>
                      </div>
                    </button>

                    {/* Item 4: व्यय रिपोर्ट */}
                    <button
                      onClick={() => setActiveApp("expense_report")}
                      className="p-4 bg-white border border-slate-100 hover:border-rose-305 hover:bg-rose-50/20 active:bg-rose-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-rose-700 to-amber-600 rounded-xl shadow border border-rose-500/20 flex items-center justify-center">
                        <PieChart className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">व्यय रिपोर्ट</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">बीज, खाद व मजदूरी खर्च</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* === APP 1: आय प्रबंधन WINDOW === */}
              {activeApp === "income" && (
                <>
                  {showAddForm ? (
                    <form onSubmit={handleRegisterIncome} className="space-y-3.5 animate-fadeIn">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[10px] text-emerald-800">
                        🌾 फ़सल उपज बिक्री, मंडी कमीशन या अन्य प्रकार की आय जोड़ने का आसान प्रपत्र।
                      </div>
                      
                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block select-none">🗺️ खेत चुनें (Select Farm Plot)</label>
                        <select
                          value={incomeForm.farmId}
                          onChange={(e) => {
                            const selectedPlotId = e.target.value;
                            const plot = allPlots.find(p => p.id === selectedPlotId);
                            if (plot) {
                              setIncomeForm({
                                ...incomeForm,
                                farmId: selectedPlotId,
                                farmerId: plot.farmerId,
                                crop: plot.activeCrop
                              });
                            } else {
                              setIncomeForm({
                                ...incomeForm,
                                farmId: "",
                                farmerId: "",
                                crop: ""
                              });
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans font-bold outline-none cursor-pointer text-slate-705 text-xs"
                        >
                          <option value="">-- खेत का चयन करें --</option>
                          {allPlots.map((plot) => (
                            <option key={plot.id} value={plot.id}>
                              📍 {plot.name} ({plot.activeCrop}) - {plot.acreage} एकड़
                            </option>
                          ))}
                        </select>
                        {allPlots.length === 0 && (
                          <span className="text-[10px] text-amber-600 block mt-1 font-sans">⚠️ कोई खेत उपलब्ध नहीं है! कृपया 'प्रोफ़ाइल प्रबंधन' ➡️ 'खेत प्रबंधन' में खेत जोड़ें।</span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">फ़सल प्रकार (Crop)</label>
                          <select
                            value={incomeForm.crop}
                            onChange={(e) => setIncomeForm({ ...incomeForm, crop: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-705 font-bold outline-none cursor-not-allowed"
                            disabled
                          >
                            <option value="">-- स्वतः चयनित --</option>
                            <option value="गेहूं (Wheat)">गेहूं (Wheat)</option>
                            <option value="धान (Paddy)">धान (Paddy)</option>
                            <option value="सोयाबीन (Soybean)">सोयाबीन (Soybean)</option>
                            <option value="लहसुन (Garlic)">लहसुन (Garlic)</option>
                            <option value="कपास (Cotton)">कपास (Cotton)</option>
                            <option value="चना (Gram)">चना (Gram)</option>
                          </select>
                          <span className="text-[9px] text-emerald-700 font-bold block leading-none mt-1">✨ खेत के अनुसार स्वतः चयनित</span>
                        </div>

                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">दिनांक</label>
                          <input
                            type="date"
                            value={incomeForm.date}
                            onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-sans text-slate-705 font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5 p-1">
                        <input
                          type="checkbox"
                          id="isMandiSale"
                          checked={incomeForm.isMandiSale}
                          onChange={(e) => setIncomeForm({ ...incomeForm, isMandiSale: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                        />
                        <label htmlFor="isMandiSale" className="font-black text-rose-800 cursor-pointer">
                          🏪 मंडी माल बिकावली विवरण है? (तौल व काट गणना ऑन करें)
                        </label>
                      </div>

                      {incomeForm.isMandiSale ? (
                        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-250/60 grid grid-cols-2 gap-3">
                          <div className="space-y-1 col-span-2">
                            <label className="font-extrabold text-amber-900 block text-[10px]">आढ़ती या मंडी खरीदार कंपनी का नाम</label>
                            <input
                              type="text"
                              value={incomeForm.traderName}
                              onChange={(e) => setIncomeForm({ ...incomeForm, traderName: e.target.value })}
                              placeholder="उदा: रामलाल एग्रो ट्रेडर्स..."
                              className="w-full bg-white border border-amber-200 rounded-xl p-2 outline-none text-slate-705 font-sans font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-extrabold text-amber-90 block text-[10px]">सकल वजन क्विंटल (Gross wt.)</label>
                            <input
                              type="number"
                              value={incomeForm.grossWeight}
                              onChange={(e) => setIncomeForm({ ...incomeForm, grossWeight: e.target.value })}
                              placeholder="उदा: 75 q"
                              className="w-full bg-white border border-amber-200 rounded-xl p-2 outline-none text-slate-705 font-sans font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-extrabold text-amber-90 block text-[10px]">दर्ज भाव प्रति क्विंटल (₹ भाव)</label>
                            <input
                              type="number"
                              value={incomeForm.amount}
                              onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                              placeholder="₹/quintal"
                              className="w-full bg-white border border-amber-200 rounded-xl p-2 outline-none text-slate-750 font-sans font-black"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">कुल आय राशि (₹ Amount)</label>
                          <input
                            type="number"
                            value={incomeForm.amount}
                            onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                            placeholder="₹ राशि भरें..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-705 font-sans font-black outline-none"
                          />
                        </div>
                      )}

                      <div className="flex items-center space-x-2.5 p-1 border-t border-slate-100 pt-3">
                        <input
                          type="checkbox"
                          id="isCreditSale"
                          checked={incomeForm.isCreditSale}
                          onChange={(e) => setIncomeForm({ ...incomeForm, isCreditSale: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                        />
                        <label htmlFor="isCreditSale" className="font-bold text-slate-705 cursor-pointer">
                          उधारी / बकाया राशि है? (पेमेंट अभी बचा है)
                        </label>
                      </div>

                      {incomeForm.isCreditSale && (
                        <div className="space-y-1 p-3 bg-rose-50 rounded-2xl border border-rose-100/50">
                          <label className="font-extrabold text-rose-800 block text-[10px]">वसूली की अंतिम देय तिथि (Due Date)</label>
                          <input
                            type="date"
                            value={incomeForm.dueDate}
                            onChange={(e) => setIncomeForm({ ...incomeForm, dueDate: e.target.value })}
                            className="w-full bg-white border border-rose-200 rounded-xl p-2 text-rose-800 font-sans font-bold outline-none"
                          />
                        </div>
                      )}

                      <button type="submit" className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all mt-4">
                        💾 आय / बिकावली सुरक्षित करें
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-2.5 animate-fadeIn">
                      {transactions.filter(t => t.type === "income").length > 0 ? (
                        transactions.filter(t => t.type === "income").map((t) => {
                          const farUser = farmers.find(f => f.id === t.farmerId);
                          return (
                            <div key={t.id} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl relative space-y-2.5">
                              <div className="flex justify-between items-start">
                                <div>
                                  <strong className="text-xs block text-slate-850">{farUser?.name || "अज्ञात किसान"}</strong>
                                  <span className="text-[9px] text-slate-400 block font-normal">📍 ग्राम: {farUser?.village || "पिपलिया"} | फ़सल: {t.crop}</span>
                                </div>
                                <span className="font-mono text-emerald-800 font-black text-[11px] bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                                  +₹{t.amount.toLocaleString()}
                                </span>
                              </div>

                              {t.isMandiSale && t.mandiDetails && (
                                <div className="bg-white p-2 border border-slate-200/60 rounded-xl text-[9.5px] text-slate-550 leading-normal font-mono">
                                  <span>🏪 मंडी खरीदार: <strong className="text-slate-800 font-sans">{t.mandiDetails.traderName}</strong></span>
                                  <div className="flex justify-between mt-1 text-[9px] font-sans">
                                    <span>मात्रा: {t.mandiDetails.grossWeight} q (नेट: {t.mandiDetails.netWeight} q)</span>
                                    <span>दर: ₹{t.mandiDetails.ratePerQuintal}/q</span>
                                  </div>
                                </div>
                              )}

                              {t.isCreditSale && t.creditDetails && (
                                <div className="p-1 px-2.5 bg-amber-50 text-amber-900 border border-amber-200/50 rounded text-[9px] flex justify-between font-bold items-center">
                                  <span>बकाया ऋण: ₹{t.creditDetails.pendingAmount} [Due: {t.creditDetails.dueDate}]</span>
                                  <button onClick={() => triggerWhatsAppReminder(t)} className="bg-emerald-600 text-white text-[8px] px-1.5 rounded uppercase shrink-0 font-sans py-0.5">
                                    रिमाइंड 💬
                                  </button>
                                </div>
                              )}

                              <div className="flex justify-between border-t border-slate-100 pt-1.5 text-[9.5px]">
                                <span className="text-slate-400 font-mono">दिनांक: {t.date}</span>
                                <button onClick={() => { if (confirm("क्या आप वाकई इसे हटाना चाहते हैं?")) deleteTransaction(t.id); }} className="text-rose-600 hover:text-rose-800 block scale-95 font-bold">
                                  हटाएं 🗑️
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[10px] text-slate-400 text-center py-12 italic">कोई फसल बिक्री / आय प्रविष्टि नहीं मिली।</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* === APP 2: व्यय प्रबंधन WINDOW === */}
              {activeApp === "expense" && (
                <>
                  {showAddForm ? (
                    <form onSubmit={handleRegisterExpense} className="space-y-3.5 animate-fadeIn">
                      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-[10px] text-indigo-805">
                        ⚙️ सामान्य खर्च जैसे डीजल, ट्रेक्टर किराए, नलकूप, बिजली बिल आदि का हिसाब यहाँ जोड़ें। खाद, बीज, कीटनाशक के लिए समर्पित अन्य प्रवंधन का उपयोग करें।
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block select-none">🗺️ खेत चुनें (Select Farm Plot)</label>
                        <select
                          value={expenseForm.farmId}
                          onChange={(e) => {
                            const selectedPlotId = e.target.value;
                            const plot = allPlots.find(p => p.id === selectedPlotId);
                            if (plot) {
                              setExpenseForm({
                                ...expenseForm,
                                farmId: selectedPlotId,
                                farmerId: plot.farmerId,
                                crop: plot.activeCrop
                              });
                            } else {
                              setExpenseForm({
                                ...expenseForm,
                                farmId: "",
                                farmerId: "",
                                crop: ""
                              });
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans font-bold text-slate-705 text-xs outline-none cursor-pointer"
                        >
                          <option value="">-- खेत का चयन करें --</option>
                          {allPlots.map((plot) => (
                            <option key={plot.id} value={plot.id}>
                              📍 {plot.name} ({plot.activeCrop}) - {plot.acreage} एकड़
                            </option>
                          ))}
                        </select>
                        {expenseForm.crop && expenseForm.farmId && (
                          <span className="text-[10px] text-emerald-700 font-bold block mt-1">✨ फ़सल: {expenseForm.crop} (खेतानुसार स्वतः चयनित)</span>
                        )}
                        {allPlots.length === 0 && (
                          <span className="text-[10px] text-amber-600 block mt-1 font-sans">⚠️ कोई खेत उपलब्ध नहीं है! कृपया 'प्रोफ़ाइल प्रबंधन' ➡️ 'खेत प्रबंधन' में खेत जोड़ें।</span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">श्रेणी</label>
                          <select
                            value={expenseForm.category}
                            onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-705"
                          >
                            <option value="diesel">डीजल (Diesel Fuel)</option>
                            <option value="machinery">ट्रेक्टर / थ्रेशर हब किराया</option>
                            <option value="irrigation">सिंचाई खर्च / बिजली</option>
                            <option value="lease">भूमि पट्टा किराया</option>
                            <option value="other_expense">अन्य सामान्य विविध व्यय</option>
                          </select>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">दिनांक</label>
                          <input
                            type="date"
                            value={expenseForm.date}
                            onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-sans text-slate-705 font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-705 block">कुल व्यय राशि (₹ Price)</label>
                        <input
                          type="number"
                          value={expenseForm.amount}
                          onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                          placeholder="₹ खर्च राशी भरें"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans font-black text-slate-705 outline-none"
                        />
                      </div>

                      <div className="flex items-center space-x-2.5 p-1">
                        <input
                          type="checkbox"
                          id="expCredit"
                          checked={expenseForm.isCreditSale}
                          onChange={(e) => setExpenseForm({ ...expenseForm, isCreditSale: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                        />
                        <label htmlFor="expCredit" className="font-bold text-slate-705 cursor-pointer">
                          क्या यह खर्च उधारी / टाल पर लिया गया है?
                        </label>
                      </div>

                      {expenseForm.isCreditSale && (
                        <div className="space-y-1 p-3 bg-rose-50 rounded-2xl border border-rose-100">
                          <label className="font-extrabold text-rose-800 block text-[10px]">भुगतान चुकाने की देय तिथि (Due Date)</label>
                          <input
                            type="date"
                            value={expenseForm.dueDate}
                            onChange={(e) => setExpenseForm({ ...expenseForm, dueDate: e.target.value })}
                            className="w-full bg-white border border-rose-200 rounded-xl p-2 text-rose-800 font-sans font-bold"
                          />
                        </div>
                      )}

                      <button type="submit" className="w-full py-3 bg-indigo-755 bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 सामान्य व्यय प्रविष्टि सुरक्षित करें
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-2.5 animate-fadeIn">
                      {transactions.filter(t => t.type === "expense" && ["diesel", "machinery", "lease", "irrigation", "other_expense"].includes(t.category)).length > 0 ? (
                        transactions.filter(t => t.type === "expense" && ["diesel", "machinery", "lease", "irrigation", "other_expense"].includes(t.category)).map((t) => {
                          const farUser = farmers.find(f => f.id === t.farmerId);
                          return (
                            <div key={t.id} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl relative space-y-1.5 font-sans">
                              <div className="flex justify-between items-start">
                                <div>
                                  <strong className="text-xs block text-slate-850">{farUser?.name || "अज्ञात किसान"}</strong>
                                  <span className="text-[9.5px] text-slate-450 block font-normal">📍 ग्राम: {farUser?.village} | श्रेणी: <strong className="text-slate-655 uppercase">{t.category}</strong></span>
                                </div>
                                <span className="font-mono text-rose-800 font-black text-[11px] bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                                  -₹{t.amount?.toLocaleString()}
                                </span>
                              </div>

                              <div className="flex justify-between border-t border-slate-100 pt-1.5 text-[9.5px]">
                                <span className="text-slate-400 font-mono">दिनांक: {t.date}</span>
                                <button onClick={() => { if (confirm("क्या आप वाकई इसे हटाना चाहते हैं?")) deleteTransaction(t.id); }} className="text-rose-650 hover:text-rose-800 block scale-95 font-bold">
                                  हटाएं 🗑️
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[10px] text-slate-400 text-center py-12 italic">कोई डीजल / सामान्य खर्च प्रविष्टि उपलब्ध नहीं है।</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* === APP 3: खाद प्रबंधन WINDOW === */}
              {activeApp === "fertilizer" && (
                <>
                  {showAddForm ? (
                    <form onSubmit={handleRegisterFertilizer} className="space-y-3.5 animate-fadeIn font-sans">
                      <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl text-[10px] text-cyan-800 leading-normal">
                        📦 यूरिया, DAP, NPK इत्यादि खाद की बोरियों की संख्या एवं दर के अनुसार व्यय जोड़ने का विशेष प्रविष्टि प्रपत्र।
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block select-none">🗺️ खेत चुनें (Select Farm Plot)</label>
                        <select
                          value={fertilizerForm.farmId}
                          onChange={(e) => {
                            const selectedPlotId = e.target.value;
                            const plot = allPlots.find(p => p.id === selectedPlotId);
                            if (plot) {
                              setFertilizerForm({
                                ...fertilizerForm,
                                farmId: selectedPlotId,
                                farmerId: plot.farmerId,
                                crop: plot.activeCrop
                              });
                            } else {
                              setFertilizerForm({
                                ...fertilizerForm,
                                farmId: "",
                                farmerId: "",
                                crop: ""
                              });
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans font-bold text-slate-705 text-xs outline-none cursor-pointer"
                        >
                          <option value="">-- खेत का चयन करें --</option>
                          {allPlots.map((plot) => (
                            <option key={plot.id} value={plot.id}>
                              📍 {plot.name} ({plot.activeCrop}) - {plot.acreage} एकड़
                            </option>
                          ))}
                        </select>
                        {allPlots.length === 0 && (
                          <span className="text-[10px] text-amber-600 block mt-1 font-sans">⚠️ कोई खेत उपलब्ध नहीं है! कृपया 'प्रोफ़ाइल प्रबंधन' ➡️ 'खेत प्रबंधन' में खेत जोड़ें।</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">खाद का प्रकार (Fertilizer Brand)</label>
                        <select
                          value={fertilizerForm.fertilizerBrand}
                          onChange={(e) => setFertilizerForm({...fertilizerForm, fertilizerBrand: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold"
                        >
                          {FERTILIZER_BRANDS.map((b, i) => (
                            <option key={i} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">मात्रा (बोरी / Sacks count)</label>
                          <input
                            type="number"
                            value={fertilizerForm.bagsCount}
                            onChange={(e) => setFertilizerForm({...fertilizerForm, bagsCount: e.target.value})}
                            placeholder="Sacks count"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">दर प्रति बोरी (₹ Price / Sack)</label>
                          <input
                            type="number"
                            value={fertilizerForm.costPerBag}
                            onChange={(e) => setFertilizerForm({...fertilizerForm, costPerBag: e.target.value})}
                            placeholder="₹ Sacks rate"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">फ़सल प्रकार</label>
                          <input
                            type="text"
                            value={fertilizerForm.crop}
                            readOnly
                            disabled
                            placeholder="स्वततः चयनित"
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 font-bold cursor-not-allowed select-none text-slate-500"
                          />
                          <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">✨ स्वतः चयनित</span>
                        </div>
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">उपयोग दिनांक</label>
                          <input
                            type="date"
                            value={fertilizerForm.date}
                            onChange={(e) => setFertilizerForm({...fertilizerForm, date: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold"
                          />
                        </div>
                      </div>

                      <div className="bg-amber-50 p-3 rounded-2xl flex justify-between font-bold text-amber-900 border border-amber-200 text-xs">
                        <span>कुल तखमीना लागत:</span>
                        <span className="font-mono font-black">₹{(Number(fertilizerForm.bagsCount || 0) * Number(fertilizerForm.costPerBag || 0)).toLocaleString()}</span>
                      </div>

                      <button type="submit" className="w-full py-3 bg-cyan-705 bg-cyan-700 hover:bg-cyan-850 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 नया खाद खर्च दर्ज करें
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-2.5 animate-fadeIn font-sans">
                      {transactions.filter(t => t.category === "fertilizer").length > 0 ? (
                        transactions.filter(t => t.category === "fertilizer").map((t) => {
                          const farUser = farmers.find(f => f.id === t.farmerId);
                          return (
                            <div key={t.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl relative space-y-1.5">
                              <div className="flex justify-between items-start">
                                <div>
                                  <strong className="text-xs block text-slate-850">{farUser?.name || "अज्ञात किसान"}</strong>
                                  <span className="text-[9.5px] text-slate-400 block font-bold text-emerald-700">📍 ग्राम: {farUser?.village} | फसल: {t.crop}</span>
                                </div>
                                <span className="font-mono text-cyan-850 text-rose-800 font-extrabold text-[10.5px] bg-sky-50 border border-sky-100 px-2 py-0.5 rounded">
                                  -₹{t.amount.toLocaleString()}
                                </span>
                              </div>

                              {t.voiceTranscription && (
                                <p className="text-[10px] italic text-slate-500 bg-white p-2 rounded-xl border border-slate-100 pl-3 leading-relaxed">
                                  {t.voiceTranscription}
                                </p>
                              )}

                              <div className="flex justify-between border-t border-slate-100 pt-1.5 text-[9.5px]">
                                <span className="text-slate-400 font-mono">व्यय तिथि: {t.date}</span>
                                <button onClick={() => { if (confirm("क्या आप वाकई इस खाद खर्च को पृथक करना चाहते हैं?")) deleteTransaction(t.id); }} className="text-rose-650 font-bold hover:text-rose-800 transition-all">
                                  हटाएं 🗑️
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[10px] text-slate-400 text-center py-12 italic">कोई विशेष खाद व्यय प्रविष्टि उपलब्ध नहीं है।</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* === APP 4: बीज प्रबंधन WINDOW === */}
              {activeApp === "seed" && (
                <>
                  {showAddForm ? (
                    <form onSubmit={handleRegisterSeed} className="space-y-3.5 animate-fadeIn font-sans">
                      <div className="p-3 bg-emerald-50 border border-emerald-250/60 rounded-2xl text-[10.5px] text-emerald-800">
                        🌱 फसल बोने हेतु बीज खरीद विवरण, उपजातियाँ एवं क्षेत्रानुसार बोया गया बीज वजन दर्ज करें।
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block select-none">🗺️ खेत चुनें (Select Farm Plot)</label>
                        <select
                          value={seedForm.farmId}
                          onChange={(e) => {
                            const selectedPlotId = e.target.value;
                            const plot = allPlots.find(p => p.id === selectedPlotId);
                            if (plot) {
                              setSeedForm({
                                ...seedForm,
                                farmId: selectedPlotId,
                                farmerId: plot.farmerId,
                                crop: plot.activeCrop
                              });
                            } else {
                              setSeedForm({
                                ...seedForm,
                                farmId: "",
                                farmerId: "",
                                crop: ""
                              });
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans font-bold text-slate-705 text-xs outline-none cursor-pointer"
                        >
                          <option value="">-- खेत का चयन करें --</option>
                          {allPlots.map((plot) => (
                            <option key={plot.id} value={plot.id}>
                              📍 {plot.name} ({plot.activeCrop}) - {plot.acreage} एकड़
                            </option>
                          ))}
                        </select>
                        {allPlots.length === 0 && (
                          <span className="text-[10px] text-amber-600 block mt-1 font-sans">⚠️ कोई खेत उपलब्ध नहीं है! कृपया 'प्रोफ़ाइल प्रबंधन' ➡️ 'खेत प्रबंधन' में खेत जोड़ें।</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">बीज प्रजाति (Seed Variety)</label>
                        <select
                          value={seedForm.seedVariety}
                          onChange={(e) => setSeedForm({...seedForm, seedVariety: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold"
                        >
                          {SEED_VARIETIES.map((v, i) => (
                            <option key={i} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">कुल वज़न (कि.ग्रा. / Weight in KG)</label>
                          <input
                            type="number"
                            value={seedForm.quantityKg}
                            onChange={(e) => setSeedForm({...seedForm, quantityKg: e.target.value})}
                            placeholder="KG Weight"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">कुल बीज लागत राशि (₹ Seed cost)</label>
                          <input
                            type="number"
                            value={seedForm.cost}
                            onChange={(e) => setSeedForm({...seedForm, cost: e.target.value})}
                            placeholder="₹ Cost"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">संबद्ध मुख्य फ़सल</label>
                          <input
                            type="text"
                            value={seedForm.crop}
                            readOnly
                            disabled
                            placeholder="स्वतः चयनित"
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 font-bold cursor-not-allowed text-slate-500"
                          />
                          <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">✨ स्वतः चयनित</span>
                        </div>
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">बोवाई दिनांक</label>
                          <input
                            type="date"
                            value={seedForm.date}
                            onChange={(e) => setSeedForm({...seedForm, date: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold"
                          />
                        </div>
                      </div>

                      <button type="submit" className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 नया बीज उपयोग खाता सुरक्षित करें
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-2.5 animate-fadeIn font-sans">
                      {transactions.filter(t => t.category === "seed").length > 0 ? (
                        transactions.filter(t => t.category === "seed").map((t) => {
                          const farUser = farmers.find(f => f.id === t.farmerId);
                          return (
                            <div key={t.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl relative space-y-1.5">
                              <div className="flex justify-between items-start">
                                <div>
                                  <strong className="text-xs block text-slate-850">{farUser?.name || "अज्ञात किसान"}</strong>
                                  <span className="text-[9.5px] text-slate-400 block font-normal">📍 ग्राम: {farUser?.village} | फसल: {t.crop}</span>
                                </div>
                                <span className="font-mono text-emerald-800 font-black text-[10.5px] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                                  -₹{t.amount.toLocaleString()}
                                </span>
                              </div>

                              {t.voiceTranscription && (
                                <p className="text-[10px] bg-white border border-slate-100/90 rounded-xl p-2 text-slate-500 italic">
                                  {t.voiceTranscription}
                                </p>
                              )}

                              <div className="flex justify-between border-t border-slate-100 pt-1.5 text-[9.5px]">
                                <span className="text-slate-400 font-mono">दिनांक: {t.date}</span>
                                <button onClick={() => { if (confirm("क्या वाकई मिटाना चाहते है?")) deleteTransaction(t.id); }} className="text-rose-650 hover:text-rose-800 block scale-95 font-bold">
                                  हटाएं 🗑️
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[10px] text-slate-400 text-center py-12 italic">कोई बोवाई बीज विवरण उपलब्ध नहीं है।</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* === APP 5: दवा प्रबंधन WINDOW === */}
              {activeApp === "pesticide" && (
                <>
                  {showAddForm ? (
                    <form onSubmit={handleRegisterPesticide} className="space-y-3.5 animate-fadeIn font-sans">
                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-[10px] text-teal-800">
                        💊 कीटनाशक, फफूंदनाशक, खरपतवार नाशक या फसल वर्धक दवाओं के छिड़काव अथवा खरीद का कुल व्यय लेखा-जोखा प्रविष्टि।
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block select-none">🗺️ खेत चुनें (Select Farm Plot)</label>
                        <select
                          value={pesticideForm.farmId}
                          onChange={(e) => {
                            const selectedPlotId = e.target.value;
                            const plot = allPlots.find(p => p.id === selectedPlotId);
                            if (plot) {
                              setPesticideForm({
                                ...pesticideForm,
                                farmId: selectedPlotId,
                                farmerId: plot.farmerId,
                                crop: plot.activeCrop
                              });
                            } else {
                              setPesticideForm({
                                ...pesticideForm,
                                farmId: "",
                                farmerId: "",
                                crop: ""
                              });
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans font-bold text-slate-705 text-xs outline-none cursor-pointer"
                        >
                          <option value="">-- खेत का चयन करें --</option>
                          {allPlots.map((plot) => (
                            <option key={plot.id} value={plot.id}>
                              📍 {plot.name} ({plot.activeCrop}) - {plot.acreage} एकड़
                            </option>
                          ))}
                        </select>
                        {allPlots.length === 0 && (
                          <span className="text-[10px] text-amber-600 block mt-1 font-sans">⚠️ कोई खेत उपलब्ध नहीं है! कृपया 'प्रोफ़ाइल प्रबंधन' ➡️ 'खेत प्रबंधन' में खेत जोड़ें।</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">सलाह औषधि नाम (Pesticide Name)</label>
                        <select
                          value={pesticideForm.productName}
                          onChange={(e) => setPesticideForm({...pesticideForm, productName: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-700"
                        >
                          {PESTICIDE_PRODUCT.map((p, i) => (
                            <option key={i} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">कुल दवा लागत (₹ Rate)</label>
                          <input
                            type="number"
                            value={pesticideForm.cost}
                            onChange={(e) => setPesticideForm({...pesticideForm, cost: e.target.value})}
                            placeholder="₹ Price"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-705"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">छिड़काव तारीख</label>
                          <input
                            type="date"
                            value={pesticideForm.date}
                            onChange={(e) => setPesticideForm({...pesticideForm, date: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-705"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1 col-span-2">
                          <label className="font-extrabold text-slate-705 block">सम्बद्ध फ़सल</label>
                          <input
                            type="text"
                            value={pesticideForm.crop}
                            readOnly
                            disabled
                            placeholder="स्वतः चयनित"
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 font-bold cursor-not-allowed select-none text-slate-500 text-xs"
                          />
                          <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">✨ स्वतः चयनित</span>
                        </div>
                      </div>

                      <button type="submit" className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 नया दवा छिड़काव खर्चा दर्ज करें
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-2.5 animate-fadeIn font-sans">
                      {transactions.filter(t => t.category === "pesticide").length > 0 ? (
                        transactions.filter(t => t.category === "pesticide").map((t) => {
                          const farUser = farmers.find(f => f.id === t.farmerId);
                          return (
                            <div key={t.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl relative space-y-1.5">
                              <div className="flex justify-between items-start">
                                <div>
                                  <strong className="text-xs block text-slate-850">{farUser?.name || "अज्ञात किसान"}</strong>
                                  <span className="text-[9.5px] text-slate-400 block font-normal">📍 ग्राम: {farUser?.village} | फसल: {t.crop}</span>
                                </div>
                                <span className="font-mono text-cyan-850 text-rose-850 font-extrabold text-[10.5px] bg-teal-50 border border-teal-100 px-2 py-0.5 rounded">
                                  -₹{t.amount.toLocaleString()}
                                </span>
                              </div>

                              {t.voiceTranscription && (
                                <p className="text-[10px] text-slate-500 bg-white border border-slate-100 p-2 rounded-xl italic leading-relaxed">
                                  {t.voiceTranscription}
                                </p>
                              )}

                              <div className="flex justify-between border-t border-slate-100 pt-1.5 text-[9.5px]">
                                <span className="text-slate-400 font-mono">छिड़काव तिथि: {t.date}</span>
                                <button onClick={() => { if (confirm("क्या आप वाकई इसे हटाना चाहते हैं?")) deleteTransaction(t.id); }} className="text-rose-650 hover:text-rose-800 scale-95 font-bold transition-all">
                                  हटाएं 🗑️
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[10px] text-slate-400 text-center py-12 italic">कोई कीटनाशक / दवा छिड़काव प्रविष्टि दर्ज नहीं मिली।</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* === APP 6: लेबर प्रबंधन WINDOW === */}
              {activeApp === "labor" && (
                <>
                  {showAddForm ? (
                    <form onSubmit={handleRegisterLabor} className="space-y-3.5 animate-fadeIn font-sans">
                      <div className="p-3 bg-violet-50 border border-violet-200 rounded-2xl text-[10px] text-violet-800 leading-normal">
                        👥 मजदूरों की हाजिरी, ठेकेदार बल्क टोली बुकिंग, तय मजदूरी एवं एडवांस भुगतान की सरल सुरक्षा ट्रैकिंग प्रविष्टि।
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block select-none">🗺️ खेत चुनें (Select Farm Plot)</label>
                        <select
                          value={laborFormState.farmId}
                          onChange={(e) => {
                            const selectedPlotId = e.target.value;
                            const plot = allPlots.find(p => p.id === selectedPlotId);
                            if (plot) {
                              setLaborFormState({
                                ...laborFormState,
                                farmId: selectedPlotId,
                                farmerId: plot.farmerId,
                                crop: plot.activeCrop
                              });
                            } else {
                              setLaborFormState({
                                ...laborFormState,
                                farmId: "",
                                farmerId: "",
                                crop: ""
                              });
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans font-bold text-slate-705 text-xs outline-none cursor-pointer"
                        >
                          <option value="">-- खेत का चयन करें --</option>
                          {allPlots.map((plot) => (
                            <option key={plot.id} value={plot.id}>
                              📍 {plot.name} ({plot.activeCrop}) - {plot.acreage} एकड़
                            </option>
                          ))}
                        </select>
                        {allPlots.length === 0 && (
                          <span className="text-[10px] text-amber-600 block mt-1 font-sans">⚠️ कोई खेत उपलब्ध नहीं है! कृपया 'प्रोफ़ाइल प्रबंधन' ➡️ 'खेत प्रबंधन' में खेत जोड़ें।</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">लेबर प्रकार (Labor Mode)</label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setLaborFormState({...laborFormState, mode: "individual"})}
                            className={`py-1.5 text-center text-[10.5px] rounded-lg font-bold transition-all ${laborFormState.mode === "individual" ? "bg-white text-indigo-900 shadow-sm" : "text-slate-500"}`}
                          >
                            👤 व्यक्तिगत मजदूर
                          </button>
                          <button
                            type="button"
                            onClick={() => setLaborFormState({...laborFormState, mode: "bulk_gang"})}
                            className={`py-1.5 text-center text-[10.5px] rounded-lg font-bold transition-all ${laborFormState.mode === "bulk_gang" ? "bg-white text-indigo-900 shadow-sm" : "text-slate-500"}`}
                          >
                            👥 सामूहिक टोली (Contract)
                          </button>
                        </div>
                      </div>

                      {laborFormState.mode === "individual" ? (
                        <div className="space-y-3 bg-slate-55 border border-slate-150 p-3 rounded-2xl">
                          <div className="space-y-1">
                            <label className="font-extrabold text-slate-700 block text-[10px]">मजदूर का नाम (Laborer Name)</label>
                            <input
                              type="text"
                              value={laborFormState.laborerName}
                              onChange={(e) => setLaborFormState({...laborFormState, laborerName: e.target.value})}
                              placeholder="मजदूर का नाम..."
                              className="w-full bg-white border border-slate-200 rounded-xl p-2 outline-none font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-extrabold text-slate-700 block text-[10px]">हाजिरी स्थिति (Attendance Status)</label>
                            <select
                              value={laborFormState.attendance}
                              onChange={(e) => setLaborFormState({...laborFormState, attendance: e.target.value as any})}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold"
                            >
                              <option value="present">पूर्ण दिन उपस्थित (Present)</option>
                              <option value="half_day">आधा दिन (Half Day)</option>
                              <option value="absent">अनुपस्थित (Absent)</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 bg-slate-55 border border-slate-150 p-3 rounded-2xl">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-extrabold text-slate-700 block text-[10px]">मजदूरों की संख्या</label>
                              <input
                                type="number"
                                value={laborFormState.workersCount}
                                onChange={(e) => setLaborFormState({...laborFormState, workersCount: e.target.value})}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 outline-none font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-extrabold text-slate-700 block text-[10px]">टोली सरदार नाम</label>
                              <input
                                type="text"
                                value={laborFormState.groupName}
                                onChange={(e) => setLaborFormState({...laborFormState, groupName: e.target.value})}
                                placeholder="रामचरण जी..."
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 outline-none font-bold"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="font-extrabold text-slate-700 block text-[10px]">कार्य विवरण (Work Description)</label>
                            <input
                              type="text"
                              value={laborFormState.workDescription}
                              onChange={(e) => setLaborFormState({...laborFormState, workDescription: e.target.value})}
                              placeholder="उदा: गेहूँ कटाई एवं बंडल भराई..."
                              className="w-full bg-white border border-slate-200 rounded-xl p-2 outline-none font-bold"
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">तय मजदूरी (₹ Total Contract)</label>
                          <input
                            type="number"
                            value={laborFormState.contractAmount}
                            onChange={(e) => setLaborFormState({...laborFormState, contractAmount: e.target.value})}
                            placeholder="₹ राशि"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-black text-rose-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">एडवांस भुगतान (₹ Paid Advance)</label>
                          <input
                            type="number"
                            value={laborFormState.advancePaid}
                            onChange={(e) => setLaborFormState({...laborFormState, advancePaid: e.target.value})}
                            placeholder="₹ एडवांस"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-black text-emerald-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-755 block">कार्य फ़सल प्रकार</label>
                          <input
                            type="text"
                            value={laborFormState.crop}
                            readOnly
                            disabled
                            placeholder="स्वतः चयनित"
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 font-bold cursor-not-allowed select-none text-slate-500 text-xs"
                          />
                          <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">✨ स्वतः चयनित</span>
                        </div>
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-750 block">कार्य तिथि</label>
                          <input
                            type="date"
                            value={laborFormState.date}
                            onChange={(e) => setLaborFormState({...laborFormState, date: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold"
                          />
                        </div>
                      </div>

                      <button type="submit" className="w-full py-3 bg-violet-750 bg-violet-700 hover:bg-violet-850 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 लेबर हाजिरी प्रविष्टि सुरक्षित करें
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-2.5 animate-fadeIn font-sans">
                      {labors.length > 0 ? (
                        labors.map((lab) => {
                          const correlatingFarmer = farmers.find(f => f.id === lab.farmerId);
                          return (
                            <div key={lab.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-3xl space-y-2 relative">
                              <div className="flex justify-between items-start">
                                <div>
                                  <strong className="text-xs block text-slate-850">
                                    👤 {lab.mode === "individual" ? lab.individualDetails?.laborerName : lab.bulkDetails?.groupName}
                                  </strong>
                                  <span className="text-[9px] text-slate-400 block mt-0.5">
                                    प्रबंधक: <strong className="text-slate-600">{correlatingFarmer?.name || "अज्ञात"}</strong>
                                  </span>
                                </div>
                                <span className="text-[8.5px] bg-violet-50 border border-violet-100 text-violet-800 font-extrabold px-2 py-0.5 rounded">
                                  {lab.mode === "individual" ? "DAILY LABOR" : `CONTRACTOR x${lab.bulkDetails?.workersCount}`}
                                </span>
                              </div>

                              <div className="bg-white border-slate-100 p-2 rounded-xl border grid grid-cols-3 text-center text-[9.5px]">
                                <div>
                                  <span className="text-slate-400 block">कुल मजदूरी</span>
                                  <strong className="text-slate-700 font-black font-mono">₹{lab.contractAmount}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400 block">एडवांस</span>
                                  <strong className="text-emerald-700 font-black font-mono">₹{lab.advancePaid}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400 block">शेष बकाया</span>
                                  <strong className="text-rose-700 font-black font-mono">₹{lab.dueBalance}</strong>
                                </div>
                              </div>

                              <div className="flex justify-between items-center border-t border-indigo-950/5 pt-2 text-[9.5px]">
                                <span className="text-slate-400 font-mono font-medium">दिनांक: {lab.date} | फसल: {lab.crop}</span>
                                <button onClick={() => { if (confirm("क्या वाकई लेबर हाजिरी हटाना चाहते हैं?")) deleteLabor(lab.id); }} className="text-rose-600 font-bold block scale-95 hover:text-rose-800">
                                  हटाएं 🗑️
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[10px] text-slate-400 text-center py-12 italic">कोई लेबर हाजिरी अथवा ठेका विवरण लॉग रिकॉर्ड नहीं है।</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* === APP 7: किसान बही (FARMERS GENERAL DIRECTORY APP) === */}
              {activeApp === "farmers" && (
                <>
                  {showAddForm ? (
                    <form onSubmit={handleRegisterFarmer} className="space-y-3.5 animate-fadeIn font-sans">
                      <div className="p-3 bg-emerald-50 border border-emerald-250/50 rounded-2xl text-[10px] text-emerald-800">
                        🌾 नये प्रगतिशील किसान का नाम, गाँव, मोबाइल नम्बर एवं खेती रकबा का विवरण पंजीकृत करें।
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">किसान का पूरा नाम (Farmer Name)</label>
                        <input
                          type="text"
                          value={farmerForm.name}
                          onChange={(e) => setFarmerForm({...farmerForm, name: e.target.value})}
                          placeholder="उदा: रामचंद्र पाटीदार..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">गाँव / स्थान (Village)</label>
                          <input
                            type="text"
                            value={farmerForm.village}
                            onChange={(e) => setFarmerForm({...farmerForm, village: e.target.value})}
                            placeholder="उदा: मन्द्सौर..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">मोबाइल नम्बर (Phone)</label>
                          <input
                            type="text"
                            value={farmerForm.phone}
                            onChange={(e) => setFarmerForm({...farmerForm, phone: e.target.value})}
                            placeholder="उदा: 98xxxxxx..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-medium outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">कुल रकबा (एकड़ ज़मीन / Acreage)</label>
                          <input
                            type="number"
                            value={farmerForm.totalAcreage}
                            onChange={(e) => setFarmerForm({...farmerForm, totalAcreage: Number(e.target.value)})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">सक्रिय फ़सल (Active Crop)</label>
                          <select
                            value={farmerForm.activeCrop}
                            onChange={(e) => setFarmerForm({...farmerForm, activeCrop: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold"
                          >
                            <option value="गेहूं (Wheat)">गेहूं (Wheat)</option>
                            <option value="धान (Paddy)">धान (Paddy)</option>
                            <option value="सोयाबीन (Soybean)">सोयाबीन (Soybean)</option>
                            <option value="लहसुन (Garlic)">लहसुन (Garlic)</option>
                            <option value="कपास (Cotton)">कपास (Cotton)</option>
                            <option value="चना (Gram)">चना (Gram)</option>
                          </select>
                        </div>
                      </div>

                      <button type="submit" className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 नया किसान प्रोफाइल सहेजें
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3.5 animate-fadeIn font-sans">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400 h-3.5 w-3.5" />
                        <input
                          type="text"
                          placeholder="नाम, गाँव या मोबाइल से छानबीन..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-2xl outline-none text-[11px] font-medium"
                        />
                      </div>

                      <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                        {filteredFarmers.map((f) => (
                          <div key={f.id} className="bg-slate-55 border border-slate-200 bg-slate-50/50 p-3 rounded-2xl space-y-2 relative shadow-xs">
                            <div className="flex justify-between items-start border-b border-indigo-950/5 pb-1 select-text">
                              <div>
                                <strong className="text-xs block text-slate-850 font-black">{f.name}</strong>
                                <span className="text-[9px] text-slate-400 font-bold block mt-0.5">📍 ग्राम: {f.village} | 📞 {f.phone}</span>
                              </div>
                              <span className="text-[9px] bg-emerald-50 text-emerald-850 border border-emerald-100 font-black font-mono px-2 py-0.5 rounded">
                                {f.totalAcreage} एकड़ भूमि
                              </span>
                            </div>

                            {f.farms && f.farms.length > 0 && (
                              <div className="space-y-1">
                                {f.farms.map((p, i) => (
                                  <div key={p.id || i} className="bg-white p-2 rounded-xl border border-slate-200/60 text-[9.5px] flex justify-between font-mono">
                                    <span className="font-semibold text-slate-700">{p.name || `प्लॉट ${i+1}`}</span>
                                    <span className="text-slate-400 font-bold">{p.acreage} एकड़ | {p.activeCrop}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex justify-end pt-1">
                              <button onClick={() => { if (confirm("क्या वाकई इस किसान प्रोफाइल को पूरी तरह हटाना चाहते हैं?")) deleteFarmer(f.id); }} className="text-rose-600 hover:text-rose-800 text-[9.5px] font-bold">
                                प्रोफाइल मिटाएं 🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* === APP 8: मंडी कैलकुलेटर WINDOW === */}
              {activeApp === "calculator" && (
                <div className="space-y-4 animate-fadeIn font-sans leading-relaxed">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-250 text-amber-900 leading-normal text-[10px]">
                    🌾 <strong>मंडी तौल गणना सूत्र:</strong> सकल वजन दर्ज करें, फिर कचरा या नमी कटौती का प्रतिशत (%) घटाया जाएगा। शेष शुद्ध वजन पर रेट का गुणा कर भुगतान निकलेगा।
                  </div>

                  <div className="space-y-3.5 p-4 rounded-3xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="space-y-1">
                      <label className="font-extrabold text-slate-700 block">सकल उपज वज़न (क्विंटल / Gross weight q)</label>
                      <input
                        type="number"
                        value={calcForm.gross}
                        onChange={(e) => setCalcForm({...calcForm, gross: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-sans font-black text-slate-705"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-705 block">मंडी भाव (प्रति क्विंटल ₹)</label>
                        <input
                          type="number"
                          value={calcForm.rate}
                          onChange={(e) => setCalcForm({...calcForm, rate: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2 font-sans font-black text-slate-755"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-705 block">कटौती कमी दर (प्रति %)</label>
                        <input
                          type="number"
                          value={calcForm.cutPercent}
                          onChange={(e) => setCalcForm({...calcForm, cutPercent: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2 font-sans font-black text-rose-805"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calculations breakdown Box */}
                  {(() => {
                    const gr = Number(calcForm.gross || 0);
                    const rt = Number(calcForm.rate || 0);
                    const cp = Number(calcForm.cutPercent || 0);
                    
                    const cutsCalc = gr * (cp / 100);
                    const netwt = gr - cutsCalc;
                    const finalPay = netwt * rt;

                    return (
                      <div className="p-4 rounded-3xl bg-slate-900 text-white font-mono text-[10.5px] leading-relaxed space-y-2 select-text">
                        <strong className="text-xs font-sans text-amber-400 font-bold block pb-1 border-b border-slate-800">
                          📊 मंडी अद्यतन तौल रिपोर्ट (Receipt)
                        </strong>
                        <div className="flex justify-between">
                          <span>सकल फसल वजन:</span>
                          <strong>{gr.toFixed(2)} क्विंटल</strong>
                        </div>
                        <div className="flex justify-between text-rose-450 text-rose-400">
                          <span>कटौती वज़न ({cp}%):</span>
                          <strong>-{cutsCalc.toFixed(2)} क्विंटल</strong>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-black border-t border-dashed border-slate-850 pt-1.5 mt-1">
                          <span>शुद्ध तौल वजन:</span>
                          <strong>{netwt.toFixed(2)} क्विंटल</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>उपज दर प्रति q:</span>
                          <span>₹{rt}</span>
                        </div>
                        <div className="flex justify-between text-amber-300 font-black text-xs border-t border-slate-800 pt-2 mt-1">
                          <span className="font-sans">कुल शुद्ध भुगतान:</span>
                          <strong className="text-sm">₹{finalPay.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* === APP 9: मंडी भाव WINDOW === */}
              {activeApp === "rates" && (
                <div className="space-y-3.5 animate-fadeIn font-sans leading-normal">
                  <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-indigo-900 text-[10.5px]">
                    🌾 मालवा क्षेत्रीय मण्डियों के आज के औसतन फ़सल भाव तथा परिवर्तन प्रतिशत की लाइव फीड धारा।
                  </div>

                  <div className="space-y-2">
                    {[
                      { crop: "गेहूं (Wheat - Lokwan)", rate: "2470", change: "+1.2%", color: "text-emerald-500" },
                      { crop: "धान (Paddy - Basmati)", rate: "2180", change: "-0.8%", color: "text-rose-500" },
                      { crop: "सोयाबीन (Soybean JS-9560)", rate: "4890", change: "+2.1%", color: "text-emerald-500" },
                      { crop: "लहसुन ऊटी (Ooty Garlic)", rate: "11500", change: "+4.5%", color: "text-emerald-500" },
                      { crop: "कपास (Cotton Hybrid)", rate: "7150", change: "-0.3%", color: "text-rose-500" },
                      { crop: "चना मोगरा (Chana Gram)", rate: "5400", change: "+0.5%", color: "text-emerald-500" }
                    ].map((it, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex justify-between items-center font-sans">
                        <div>
                          <strong className="text-xs block text-slate-850">{it.crop}</strong>
                          <span className="text-[9.5px] text-slate-400 block mt-0.5">प्रति क्विंटल मंडी भाव</span>
                        </div>
                        <div className="text-right">
                          <strong className="block font-mono text-slate-800 text-xs">₹{it.rate}</strong>
                          <span className={`text-[9px] font-mono font-black ${it.color}`}>{it.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === APP 10: सुरक्षा ऑडिट WINDOW === */}
              {activeApp === "audits" && (
                <div className="space-y-3 animate-fadeIn font-sans leading-normal">
                  <p className="text-[10px] text-slate-400">सिस्टम सुरक्षा compliance ट्रैकर: किसानों, वित्तीय खातों, लेबर प्रविष्टियों के परिवर्तन लॉग ऑडिट विवरण।</p>
                  
                  <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                    {audits.map((a) => (
                      <div key={a.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] leading-relaxed">
                        <div className="flex justify-between border-b border-indigo-950/5 pb-1 select-text">
                          <strong className="text-indigo-950 text-indigo-700">{a.action}</strong>
                          <span className="text-slate-400 font-mono text-[8px]">{a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : "00:00"}</span>
                        </div>
                        <p className="text-slate-600 mt-1 font-sans">{a.details}</p>
                        <span className="text-[8px] text-slate-400 font-mono mt-0.5 block uppercase">ऑपरेटर: {a.operatorName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === APP 11: खेत प्रबंधन WINDOW === */}
              {activeApp === "farm_management" && (
                <>
                  {showAddForm ? (
                    <form onSubmit={handleRegisterFarmPlot} className="space-y-3.5 animate-fadeIn font-sans">
                      <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl text-[10px] text-cyan-800 font-sans">
                        🗺️ किसान बही के अंतर्गत नए भू-खंड / खेत के नाम, रकबा (एरिया) एवं फ़सल को पंजीकृत कर सहेजें।
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">किसान / भूस्वामी चुनें</label>
                        <select
                          value={farmForm.farmerId}
                          onChange={(e) => setFarmForm({...farmForm, farmerId: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans font-bold text-slate-705 outline-none"
                        >
                          <option value="">-- किसान का चयन करें --</option>
                          {farmers.map(f => (
                            <option key={f.id} value={f.id}>{f.name} (📍 {f.village})</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">खेत का नाम (Farm Plot Name)</label>
                        <input
                          type="text"
                          value={farmForm.name}
                          onChange={(e) => setFarmForm({...farmForm, name: e.target.value})}
                          placeholder="उदा: कुएँ वाला खेत, सड़क पार टुकड़ा..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">रकबा क्षेत्रफल (एकड़ में / Area)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={farmForm.acreage}
                            onChange={(e) => setFarmForm({...farmForm, acreage: e.target.value})}
                            placeholder="Acreage"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold outline-none text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">सक्रिय फ़सल (Current Crop)</label>
                          <select
                            value={farmForm.crop}
                            onChange={(e) => setFarmForm({...farmForm, crop: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-750"
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

                      <button type="submit" className="w-full py-3 bg-cyan-700 hover:bg-cyan-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 नया खेत प्लॉट जोड़कर सहेजें
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3.5 animate-fadeIn font-sans">
                      <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl text-[10px] text-cyan-850 font-sans leading-relaxed">
                        🗺️ <strong>भौतिक भू-नक्शा रकबा:</strong> पंजीकृत किसानों की कुल उपजाऊ भूमि के खंडों की स्वतंत्र विवरण सूची।
                      </div>

                      {farmers.length > 0 ? (
                        farmers.map((f) => {
                          const hasFarms = f.farms && f.farms.length > 0;
                          return (
                            <div key={f.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-3xl space-y-2.5">
                              <div className="flex justify-between items-center border-b border-indigo-950/5 pb-1.5 select-text">
                                <div>
                                  <strong className="text-xs block text-slate-850 font-black">{f.name}</strong>
                                  <span className="text-[9px] text-slate-400 font-bold block">📍 ग्राम: {f.village} | 📞 {f.phone}</span>
                                </div>
                                <span className="text-[9px] bg-cyan-50 border border-cyan-105 text-cyan-800 font-black font-mono px-2 py-0.5 rounded-full">
                                  कुल: {f.totalAcreage} एकड़
                                </span>
                              </div>

                              {hasFarms ? (
                                <div className="grid grid-cols-2 gap-2">
                                  {f.farms.map((farm, idx) => (
                                    <div key={farm.id || idx} className="bg-white border border-slate-150 p-2 rounded-2xl flex flex-col justify-between space-y-1 relative shadow-xs">
                                      <span className="font-extrabold text-[10px] text-slate-700 truncate">📍 {farm.name}</span>
                                      <div className="flex justify-between text-[9px] text-slate-500 font-mono pt-1 border-t border-slate-100/60">
                                        <span>{farm.acreage} एकड़</span>
                                        <span className="text-emerald-700 font-bold">{farm.activeCrop}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[9px] text-slate-400 italic py-1">इस किसान के अंतर्गत कोई खेत रिकॉर्ड उपलब्ध नहीं है। "जोड़ें" पर क्लिक कर नया खेत जोड़ें।</p>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[10px] text-slate-400 text-center py-12 italic">कृपया पहले किसान बही में किसान पंजीकृत करें।</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* === APP 12: फसल पंजीकरण WINDOW === */}
              {activeApp === "crop_management" && (
                <>
                  {showAddForm ? (
                    <form onSubmit={handleRegisterCropObj} className="space-y-3.5 animate-fadeIn font-sans">
                      <div className="p-3 bg-emerald-50 border border-emerald-250/50 rounded-2xl text-[10px] text-emerald-800 leading-normal">
                        🌱 नयी कृषि फ़सल अथवा सब्जी के नाम, उसकी विशिष्ट किस्म (Variety) और प्रदाता बीज कंपनी का विवरण पंजीकृत करें।
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">फसल / सब्जी का नाम (Crop Name)</label>
                        <input
                          type="text"
                          value={cropForm.name}
                          onChange={(e) => setCropForm({...cropForm, name: e.target.value})}
                          placeholder="उदा: लहसुन, प्याज, सोयाबीन, आलू..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">विशिष्ट किस्म (Variety Name)</label>
                          <input
                            type="text"
                            value={cropForm.variety}
                            onChange={(e) => setCropForm({...cropForm, variety: e.target.value})}
                            placeholder="उदा: रियावन जी-2, लोक-1..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none font-bold text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">निर्माता कंपनी (Company)</label>
                          <input
                            type="text"
                            value={cropForm.company}
                            onChange={(e) => setCropForm({...cropForm, company: e.target.value})}
                            placeholder="उदा: गंगा कावेरी, देशी चयन..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      <button type="submit" className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 नयी फसल किस्म पंजीकृत करें
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3 animate-fadeIn font-sans leading-normal">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[10px] text-emerald-800 leading-relaxed">
                        🌱 <strong>फसल व सब्जी क्रेडेंशियल्स:</strong> यह आपके निजी कृषि उपजों व विशिष्ट फसलों का पंजीकृत बैंक क्रेडेंशियल्स नेटवर्क है।
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {registeredCrops.map((c) => (
                          <div key={c.id} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex justify-between items-center relative">
                            <div className="flex items-center space-x-3 select-text">
                              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                                <Sprout className="h-5 w-5 text-emerald-750 text-emerald-650" />
                              </div>
                              <div>
                                <strong className="text-xs text-slate-850 block font-black">{c.name}</strong>
                                <span className="text-[9px] text-slate-400 block mt-0.5">किस्म: <strong className="text-slate-650">{c.variety}</strong> | बीजोत्पादक: <strong className="text-slate-650">{c.company}</strong></span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (confirm("क्या वाकई यह फसल प्रकार हटाना चाहते हैं?")) {
                                  setRegisteredCrops(prev => prev.filter(item => item.id !== c.id));
                                }
                              }}
                              className="text-rose-650 hover:text-rose-800 font-bold text-[9.5px] scale-95 transition-all outline-none"
                            >
                              हटाएं 🗑️
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* === APP 13: व्यापारी प्रबंधन WINDOW === */}
              {activeApp === "merchant_management" && (
                <>
                  {showAddForm ? (
                    <form onSubmit={handleRegisterMerchantObj} className="space-y-3.5 animate-fadeIn font-sans">
                      <div className="p-3 bg-amber-50 border border-amber-250/50 rounded-2xl text-[10px] text-amber-800 leading-normal">
                        🤝 आपके कृषि नेटवर्क के फसल व्यापारी, लोकल आढ़तिया खरीदारों का नाम, मोबाइल नंबर और उनके द्वारा खरीदी जाने वाली कृषि फसलों का विवरण जोड़ें।
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">व्यापारी का पूरा नाम (Merchant Name)</label>
                        <input
                          type="text"
                          value={merchantForm.name}
                          onChange={(e) => setMerchantForm({...merchantForm, name: e.target.value})}
                          placeholder="उदा: मणिलाल एग्रो ट्रेडर्स, सुरेश पाटीदार..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">मोबाइल नंबर (WhatsApp/Phone)</label>
                          <input
                            type="text"
                            value={merchantForm.phone}
                            onChange={(e) => setMerchantForm({...merchantForm, phone: e.target.value})}
                            placeholder="उदा: 98263xxxxx"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-medium outline-none text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">खरीदी जाने वाली फसलें (Crops Buy)</label>
                          <input
                            type="text"
                            value={merchantForm.cropsPurchased}
                            onChange={(e) => setMerchantForm({...merchantForm, cropsPurchased: e.target.value})}
                            placeholder="उदा: गेहूं, लहसुन, चना..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      <button type="submit" className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 व्यापारी संपर्क सहेजें
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3 animate-fadeIn font-sans leading-normal">
                      <div className="p-3 bg-amber-50 border border-amber-250/50 rounded-2xl text-[10px] text-amber-800 leading-relaxed">
                        🤝 <strong>व्यापारी निर्देशिका (Merchants Directory):</strong> मंडी खरीदारों, आढ़तियों और खरीदारों के संपर्क सूत्र जो सीधे मंडी उपज निस्तारण में सहायक हैं।
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {registeredMerchants.map((m) => (
                          <div key={m.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex justify-between items-center select-text relative">
                            <div className="flex items-center space-x-3">
                              <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                                <Briefcase className="h-5 w-5 text-amber-705 text-amber-650" />
                              </div>
                              <div>
                                <strong className="text-xs text-slate-850 block font-black">{m.name}</strong>
                                <span className="text-[9.5px] text-slate-400 block mt-0.5">📞 {m.phone}</span>
                                <span className="text-[8.5px] text-emerald-805 bg-emerald-50 border border-emerald-100/80 px-1.5 py-0.5 rounded mt-1 inline-block font-sans font-bold">
                                  खरीदी फसल: {m.cropsPurchased}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <a
                                href={`tel:${m.phone}`}
                                className="p-1 px-2.5 bg-green-700 hover:bg-green-800 text-white font-black text-[9px] rounded-lg tracking-wide transition-all shadow-xs"
                              >
                                📞 कॉल करें
                              </a>
                              <button
                                onClick={() => {
                                  if (confirm("क्या आप वाकई इस व्यापारी संपर्क को हटाना चाहते हैं?")) {
                                    setRegisteredMerchants(prev => prev.filter(item => item.id !== m.id));
                                  }
                                }}
                                className="text-rose-650 hover:text-rose-800 text-[10px] font-bold"
                              >
                                हटाएं 🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* === APP 14: समेकित रिपोर्ट (CONSOLIDATED REPORT) === */}
              {activeApp === "consolidated_report" && (
                <div className="space-y-4 animate-scaleIn">
                  {/* Year selector & Information strip */}
                  <div className="flex justify-between items-center bg-indigo-950 text-white p-3.5 rounded-2.5xl shadow-md border border-slate-850">
                    <div>
                      <span className="text-[9px] text-indigo-300 font-extrabold uppercase block font-sans">वित्तीय वर्ष चुनें</span>
                      <span className="text-xs font-black">वार्षिक समेकित रिपोर्ट</span>
                    </div>
                    <select
                      value={reportYearFilter}
                      onChange={(e) => setReportYearFilter(e.target.value)}
                      className="bg-indigo-900 text-white border border-indigo-700 rounded-xl px-3 py-1.5 font-sans font-bold text-xs select-none cursor-pointer outline-none"
                    >
                      <option value="सभी">सभी वर्ष</option>
                      <option value="2026-2027">वर्ष 2026-2027</option>
                      <option value="2025-2026">वर्ष 2025-2026</option>
                    </select>
                  </div>

                  {/* Calculations */}
                  {(() => {
                    const filtered = transactions.filter(t => reportYearFilter === "सभी" || t.financialYear === reportYearFilter);
                    const incSum = filtered.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
                    const expSum = filtered.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
                    const profit = incSum - expSum;

                    const maxAmt = Math.max(incSum, expSum, 1000);
                    const incPct = (incSum / maxAmt) * 100;
                    const expPct = (expSum / maxAmt) * 100;

                    return (
                      <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                            <span className="text-[8.5px] text-emerald-800 font-black uppercase tracking-wider block">कुल खेती आय</span>
                            <strong className="text-xs font-sans font-black text-emerald-700 block mt-1">₹{incSum.toLocaleString("en-IN")}</strong>
                            <span className="text-[8px] text-slate-400 font-normal">जमा आवक 🌾</span>
                          </div>
                          
                          <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                            <span className="text-[8.5px] text-rose-800 font-black uppercase tracking-wider block">कुल लागत खर्च</span>
                            <strong className="text-xs font-sans font-black text-rose-700 block mt-1">₹{expSum.toLocaleString("en-IN")}</strong>
                            <span className="text-[8px] text-slate-400 font-normal">कुल व्यय आवर्त 📈</span>
                          </div>

                          <div className={`p-2.5 border rounded-2xl text-center ${profit >= 0 ? "bg-indigo-50 border-indigo-100" : "bg-amber-50 border-amber-100"}`}>
                            <span className="text-[8.5px] text-indigo-900 font-black uppercase tracking-wider block">शुद्ध बचत-लाभ</span>
                            <strong className={`text-xs font-sans font-black block mt-1 ${profit >= 0 ? "text-indigo-700" : "text-rose-600"}`}>
                              {profit < 0 ? "-" : ""}₹{Math.abs(profit).toLocaleString("en-IN")}
                            </strong>
                            <span className="text-[8px] text-slate-400 font-normal">{profit >= 0 ? "सकारात्मक कमायी ✨" : "लागत अधिक है"}</span>
                          </div>
                        </div>

                        {/* Interactive Dynamic SVG Visual Chart */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[9.5px] text-slate-400 font-black uppercase block">तुलनात्मक आय बनाम व्यय ग्राफ़ ({reportYearFilter})</span>
                            <span className="text-[8.5px] bg-slate-800 text-slate-300 font-sans px-1.5 py-0.5 rounded">विजुअल बार</span>
                          </div>

                          <div className="h-40 flex items-end justify-around border-b border-slate-800 pb-2 relative">
                            {/* Grid Y-Lines helper */}
                            <div className="absolute inset-x-0 top-0 border-t border-slate-800/40 text-[7px] text-slate-600 font-mono pt-0.5 pointer-events-none">अधिकतम: ₹{maxAmt.toLocaleString()}</div>
                            <div className="absolute inset-x-0 top-1/2 border-t border-slate-800/30 text-[7px] text-slate-600 font-mono pt-0.5 pointer-events-none">मध्य: ₹{(maxAmt/2).toLocaleString()}</div>

                            {/* Income Pillar */}
                            <div className="flex flex-col items-center w-2/5 group relative z-10">
                              <span className="text-[9px] text-emerald-400 font-mono font-black mb-1">₹{incSum.toLocaleString()}</span>
                              <div 
                                style={{ height: `${Math.max(incPct, 6)}%` }} 
                                className="w-12 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg shadow-lg transition-all duration-500 hover:brightness-110"
                              ></div>
                              <span className="text-[9px] text-slate-400 font-bold block mt-1.5">कुल आय</span>
                            </div>

                            {/* Expense Pillar */}
                            <div className="flex flex-col items-center w-2/5 group relative z-10">
                              <span className="text-[9px] text-rose-400 font-mono font-black mb-1">₹{expSum.toLocaleString()}</span>
                              <div 
                                style={{ height: `${Math.max(expPct, 6)}%` }} 
                                className="w-12 bg-gradient-to-t from-rose-600 to-amber-500 rounded-t-lg shadow-lg transition-all duration-500 hover:brightness-110"
                              ></div>
                              <span className="text-[9px] text-slate-400 font-bold block mt-1.5">कुल व्यय</span>
                            </div>
                          </div>
                        </div>

                        {/* Recent Transactions list filtered by year */}
                        <div className="space-y-2">
                          <strong className="text-[10.5px] text-slate-700 uppercase font-bold block">हाल के रिपोर्ट प्रविष्टियाँ ({filtered.length})</strong>
                          {filtered.length > 0 ? (
                            <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                              {filtered.slice(0, 15).map((t) => (
                                <div key={t.id} className="p-2.5 bg-white border border-slate-100 rounded-2xl flex justify-between items-center text-[10px]">
                                  <div>
                                    <span className="text-slate-900 block font-bold">
                                      {farmers.find(f => f.id === t.farmerId)?.name || "अन्तर्राष्ट्रीय किसान"}
                                    </span>
                                    <span className="text-slate-400 font-normal text-[9px] block">
                                      📅 {t.date} | {t.crop} | {t.category === "crop_sale" ? "मंडी फसल विक्रय" : "लागत व्यय"}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <strong className={`font-black font-sans leading-none block ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                                      {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                                    </strong>
                                    <span className="text-[7.5px] bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 mt-1 inline-block font-sans font-bold uppercase">{t.financialYear}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-6 bg-slate-50 border border-slate-200 border-dashed rounded-3xl text-center text-slate-400 italic">
                              इस वित्तीय वर्ष में कोई प्रविष्टि नहीं पाई गई। कृप्या मुख्य मेनू से डेटा प्रविष्ट करें।
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* === APP 15: खेतवार रिपोर्ट (PLOT-WISE GRAPH & FINANCIALS) === */}
              {activeApp === "farm_plot_report" && (
                <div className="space-y-4 animate-scaleIn">
                  <div className="flex justify-between items-center bg-cyan-950 text-white p-3.5 rounded-2.5xl shadow-md border border-slate-800">
                    <div>
                      <span className="text-[9px] text-cyan-300 font-extrabold uppercase block font-sans">रकबा आधारित रिपोर्ट</span>
                      <span className="text-xs font-black">खेतवार लागत-आय विश्लेषण</span>
                    </div>
                    <select
                      value={reportYearFilter}
                      onChange={(e) => setReportYearFilter(e.target.value)}
                      className="bg-cyan-900 text-white border border-cyan-800 rounded-xl px-2.5 py-1.5 font-sans font-bold text-[10px] select-none cursor-pointer outline-none"
                    >
                      <option value="सभी">सभी वर्ष</option>
                      <option value="2026-2027">वर्ष 2026-2027</option>
                      <option value="2025-2026">वर्ष 2025-2026</option>
                    </select>
                  </div>

                  {/* Extract all farms with crop analytics */}
                  {(() => {
                    const farmPlots: any[] = [];
                    farmers.forEach(f => {
                      if (f.farms && f.farms.length > 0) {
                        f.farms.forEach(plot => {
                          const plotTxs = transactions.filter(t => t.farmerId === f.id && t.crop.includes(plot.activeCrop) && (reportYearFilter === "सभी" || t.financialYear === reportYearFilter));
                          const plotIncome = plotTxs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
                          const plotExpense = plotTxs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
                          const plotLabourTxs = labors.filter(l => l.farmerId === f.id && l.crop.includes(plot.activeCrop));
                          const plotLabourCost = plotLabourTxs.reduce((s, l) => s + l.contractAmount, 0);
                          
                          const totalExpense = plotExpense + plotLabourCost;
                          const plotProfit = plotIncome - totalExpense;

                          farmPlots.push({
                            id: plot.id,
                            name: plot.name,
                            farmerName: f.name,
                            acreage: plot.acreage,
                            activeCrop: plot.activeCrop,
                            income: plotIncome,
                            expense: totalExpense,
                            profit: plotProfit
                          });
                        });
                      }
                    });

                    return (
                      <div className="space-y-4">
                        {farmPlots.length > 0 ? (
                          <>
                            <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-2xl text-[10px] text-cyan-900 font-sans leading-relaxed">
                              🗺️ कुल <strong>{farmPlots.length} खेतों</strong> की विश्लेषण रिपोर्ट मिली। यहाँ लागत-आय प्रत्येक खेतवार फसल प्रविष्टियों के आधार पर मूल्यांकित की जा रही है।
                            </div>

                            {/* Graphical Progress visual list of Farm Plots */}
                            <div className="space-y-3">
                              {farmPlots.map((plot, idx) => {
                                const totalBound = Math.max(plot.income + plot.expense, 1000);
                                const incomeWidth = (plot.income / totalBound) * 100;
                                const expenseWidth = (plot.expense / totalBound) * 100;

                                return (
                                  <div key={plot.id || idx} className="p-3.5 bg-white border border-slate-100 rounded-3xl space-y-2.5 shadow-xs">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="text-xs font-black text-slate-900 leading-none">{plot.name}</h4>
                                        <span className="text-[9px] text-slate-400 font-normal font-sans block mt-1.5">
                                          किसान: {plot.farmerName} | 📏 रकबा: <strong>{plot.acreage} एकड़</strong>
                                        </span>
                                      </div>
                                      <span className="text-[9px] bg-slate-105 bg-slate-100 text-teal-800 font-black px-2 py-0.5 rounded-lg border border-slate-200">
                                        🌱 {plot.activeCrop}
                                      </span>
                                    </div>

                                    {/* Visual ratio progress */}
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-[8px] font-sans font-black text-slate-500">
                                        <span>आय (Income) - ₹{plot.income.toLocaleString()}</span>
                                        <span>लागत (Costs) - ₹{plot.expense.toLocaleString()}</span>
                                      </div>
                                      
                                      {/* Stacked Progress Bar */}
                                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                                        <div 
                                          style={{ width: `${incomeWidth}%` }} 
                                          className="bg-emerald-500 h-full transition-all duration-305"
                                        ></div>
                                        <div 
                                          style={{ width: `${expenseWidth}%` }} 
                                          className="bg-rose-500 h-full transition-all duration-305"
                                        ></div>
                                      </div>
                                    </div>

                                    {/* Profit-loss breakout panel */}
                                    <div className="flex justify-between items-center text-[9px] border-t border-slate-50 pt-2 shrink-0">
                                      <span className="text-slate-400">शुद्ध संचित लाभ:</span>
                                      <strong className={`font-sans font-black ${plot.profit >= 0 ? "text-indigo-600" : "text-rose-600"}`}>
                                        {plot.profit >= 0 ? "बचत +₹" : "घाटा -₹"}{Math.abs(plot.profit).toLocaleString()} ({plot.acreage > 0 ? `₹${(plot.profit / plot.acreage).toFixed(0)}/एकड़` : "0"})
                                      </strong>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <div className="p-8 bg-slate-100/50 border border-slate-200 border-dashed rounded-3xl text-center space-y-3.5">
                            <MapPin className="h-10 w-10 text-slate-300 mx-auto" />
                            <p className="text-slate-500 text-[10.5px] font-bold leading-relaxed font-sans">
                              खेतवार रिपोर्ट हेतु कोई खेत नहीं मिला |<br />
                              कृपया <strong>"प्रोफ़ाइल प्रबंधन" ➡️ "खेत प्रबंधन"</strong> में नया खेत जोड़ें और फसल प्रविष्टि निर्दिष्ट करें।
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* === APP 16: आय विश्लेषण रिपोर्ट (INCOME CROP BREAKDOWN) === */}
              {activeApp === "income_report" && (
                <div className="space-y-4 animate-scaleIn">
                  <div className="flex justify-between items-center bg-emerald-950 text-white p-3.5 rounded-2.5xl shadow-md border border-slate-800">
                    <div>
                      <span className="text-[9px] text-emerald-300 font-extrabold uppercase block font-sans">फसल उपज आवक विश्लेषण</span>
                      <span className="text-xs font-black">वार्षिक मुख्य आय स्रोत रिपोर्ट</span>
                    </div>
                    <select
                      value={reportYearFilter}
                      onChange={(e) => setReportYearFilter(e.target.value)}
                      className="bg-emerald-900 text-white border border-emerald-800 rounded-xl px-2.5 py-1.5 font-sans font-bold text-[10px] select-none cursor-pointer outline-none"
                    >
                      <option value="सभी">सभी वर्ष</option>
                      <option value="2026-2027">वर्ष 2026-2027</option>
                      <option value="2025-2026">वर्ष 2025-2026</option>
                    </select>
                  </div>

                  {/* Calculations */}
                  {(() => {
                    const incomeTxs = transactions.filter(t => t.type === "income" && (reportYearFilter === "सभी" || t.financialYear === reportYearFilter));
                    const totalIncome = incomeTxs.reduce((sum, t) => sum + t.amount, 0);

                    // Crop breakout mapping
                    const cropMap: { [key: string]: number } = {};
                    incomeTxs.forEach(t => {
                      cropMap[t.crop] = (cropMap[t.crop] || 0) + t.amount;
                    });

                    const cropBreakout = Object.keys(cropMap).map(cropName => ({
                      name: cropName,
                      value: cropMap[cropName]
                    })).sort((a, b) => b.value - a.value);

                    const maxCropVal = cropBreakout.length > 0 ? Math.max(...cropBreakout.map(c => c.value)) : 1000;

                    return (
                      <div className="space-y-4">
                        {/* Big Hero Card */}
                        <div className="p-4 bg-gradient-to-tr from-emerald-900 to-teal-800 rounded-3xl text-white">
                          <span className="text-[9px] text-emerald-300 font-black uppercase text-left block">कुल जमा आवक कमायी ({reportYearFilter})</span>
                          <strong className="text-2xl font-sans font-black block mt-1">₹{totalIncome.toLocaleString()}</strong>
                          <span className="text-[10px] text-emerald-100 font-sans block mt-1">🌾 मंडी बिकावली एवं सकल आवक स्रोत</span>
                        </div>

                        {cropBreakout.length > 0 ? (
                          <>
                            {/* Graphic Chart (Crop wise progress bars) */}
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white">
                              <span className="text-[9.5px] text-slate-400 font-black uppercase block mb-3.5">मुख्य फ़सल आवक तुलना चार्ट</span>
                              
                              <div className="space-y-3">
                                {cropBreakout.map((c, idx) => {
                                  const pct = (c.value / totalIncome) * 100;
                                  const barPct = (c.value / maxCropVal) * 100;
                                  return (
                                    <div key={idx} className="space-y-1">
                                      <div className="flex justify-between text-[9px] font-sans font-bold">
                                        <span>🌾 {c.name}</span>
                                        <span className="text-emerald-400">₹{c.value.toLocaleString()} ({pct.toFixed(0)}%)</span>
                                      </div>
                                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                        <div 
                                          style={{ width: `${barPct}%` }}
                                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                                        ></div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Detailed Records list for Income */}
                            <div className="space-y-2">
                              <strong className="text-[10.5px] text-slate-700 uppercase font-bold block">फसल विक्रय सूची विवरण ({incomeTxs.length})</strong>
                              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                {incomeTxs.map((t) => (
                                  <div key={t.id} className="p-2.5 bg-white border border-slate-100 rounded-2xl flex justify-between items-center text-[10px]">
                                    <div>
                                      <span className="text-slate-900 block font-bold">
                                        {farmers.find(f => f.id === t.farmerId)?.name || "पंजीकृत किसान"}
                                      </span>
                                      <span className="text-slate-400 block mt-0.5 text-[9px] font-normal font-sans">
                                        📅 {t.date} | Crop: {t.crop}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <strong className="text-emerald-600 font-sans font-black block">₹{t.amount.toLocaleString()}</strong>
                                      <span className="text-[7.5px] text-slate-400 font-sans block mt-0.5">{t.financialYear}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="p-8 bg-slate-50 border border-slate-150-dashed rounded-3xl text-center text-slate-400 italic font-sans font-bold text-[10px]">
                            इस वित्तीय वर्ष हेतु कोई भी आय/विक्री विवरण नहीं मिला।
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* === APP 17: व्यय विश्लेषण रिपोर्ट (EXPENSE CATEGORY PROGRESS) === */}
              {activeApp === "expense_report" && (
                <div className="space-y-4 animate-scaleIn">
                  <div className="flex justify-between items-center bg-rose-950 text-white p-3.5 rounded-2.5xl shadow-md border border-slate-900">
                    <div>
                      <span className="text-[9px] text-rose-300 font-extrabold uppercase block font-sans">कृषि लागत & पूंजी निवेश</span>
                      <span className="text-xs font-black">वार्षिक श्रेणीवार खर्च विश्लेषण</span>
                    </div>
                    <select
                      value={reportYearFilter}
                      onChange={(e) => setReportYearFilter(e.target.value)}
                      className="bg-rose-900 text-white border border-rose-800 rounded-xl px-2.5 py-1.5 font-sans font-bold text-[10px] select-none cursor-pointer outline-none"
                    >
                      <option value="सभी">सभी वर्ष</option>
                      <option value="2026-2027">वर्ष 2026-2027</option>
                      <option value="2025-2026">वर्ष 2025-2026</option>
                    </select>
                  </div>

                  {/* Calculations */}
                  {(() => {
                    const expenseTxs = transactions.filter(t => t.type === "expense" && (reportYearFilter === "सभी" || t.financialYear === reportYearFilter));
                    const totalExpense = expenseTxs.reduce((sum, t) => sum + t.amount, 0);

                    const catMap: { [key: string]: number } = {};
                    expenseTxs.forEach(t => {
                      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
                    });

                    const translator: { [key: string]: string } = {
                      "seed": "🌱 उन्नत उत्तम बीज आवर्त",
                      "fertilizer": "📦 रसायनिक/जैविक खाद प्रविष्टि",
                      "pesticide": "💊 कीटनाशक और फसल दवा छिड़काव",
                      "diesel": "⛽ डीजल एवं ईंधन साधन सुगमता",
                      "labor_payout": "👥 श्रम एवं लेबर पारिश्रमिक भुगतान",
                      "diesel_expense": "🚜 जुताई एवं ट्रैक्टर व्यय",
                      "other": "⚙️ विविध सामान्य कृषि व्यय"
                    };

                    const catBreakout = Object.keys(catMap).map(catKey => ({
                      key: catKey,
                      label: translator[catKey] || "विविध लागत व्यय",
                      value: catMap[catKey]
                    })).sort((a, b) => b.value - a.value);

                    const maxCatVal = catBreakout.length > 0 ? Math.max(...catBreakout.map(c => c.value)) : 1000;

                    return (
                      <div className="space-y-4">
                        {/* Summary Header */}
                        <div className="p-4 bg-gradient-to-tr from-rose-900 to-orange-850 rounded-3xl text-white">
                          <span className="text-[9px] text-rose-300 font-black uppercase text-left block">कुल संचित लागत व्यय ({reportYearFilter})</span>
                          <strong className="text-2xl font-sans font-black block mt-1.5">₹{totalExpense.toLocaleString()}</strong>
                          <span className="text-[10px] text-slate-300 font-sans block mt-1">📊 खाद, बीज, श्रमिक पारिश्रमिक एवं विविध कृषि गतिविधियां</span>
                        </div>

                        {catBreakout.length > 0 ? (
                          <>
                            {/* Category progress comparative bars */}
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white space-y-3.5">
                              <span className="text-[9.5px] text-slate-400 font-extrabold uppercase block">श्रेणी-वार व्यय संचयी विवरण</span>
                              
                              <div className="space-y-3 font-sans">
                                {catBreakout.map((c, idx) => {
                                  const pct = (c.value / totalExpense) * 100;
                                  const barPct = (c.value / maxCatVal) * 100;

                                  return (
                                    <div key={idx} className="space-y-1">
                                      <div className="flex justify-between items-center text-[9px] font-bold">
                                        <span>{c.label}</span>
                                        <span className="text-rose-400 font-black">₹{c.value.toLocaleString()} ({pct.toFixed(0)}%)</span>
                                      </div>
                                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-800">
                                        <div
                                          style={{ width: `${barPct}%` }}
                                          className="bg-gradient-to-r from-rose-500 to-orange-400 h-full rounded-full transition-all duration-300"
                                        ></div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Detailed Expense History List */}
                            <div className="space-y-2">
                              <strong className="text-[11px] text-slate-705 uppercase font-bold block">लागत विवरण पंजी इतिहास ({expenseTxs.length})</strong>
                              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                {expenseTxs.map((t) => (
                                  <div key={t.id} className="p-2.5 bg-white border border-slate-100 rounded-2xl flex justify-between items-center text-[10px]">
                                    <div>
                                      <span className="text-slate-900 block font-bold">
                                        {farmers.find(f => f.id === t.farmerId)?.name || "अज्ञात किसान"}
                                      </span>
                                      <span className="text-slate-400 block text-[9px] font-normal font-sans mt-0.5">
                                        📅 {t.date} | Cost of {t.crop}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <strong className="text-rose-600 font-sans font-black block">₹{t.amount.toLocaleString()}</strong>
                                      <span className="text-[7.5px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-black inline-block mt-1 font-sans">{t.financialYear}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="p-8 bg-slate-50 border border-slate-150-dashed rounded-3xl text-center text-slate-400 italic font-sans font-black text-[10px]">
                            इस वित्तीय वर्ष में दर्ज कोई भी व्यय विवरण नहीं मिला।
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Standard Android Navigation Bottom Buttons */}
            <div className="px-6 py-3.5 bg-indigo-950/95 border-t border-slate-900 flex justify-around items-center text-slate-400 text-center text-xs">
              <button onClick={() => { setActiveApp(null); setShowAddForm(false); }} className="hover:text-white transition-all font-sans font-black">
                ◀ पीछे जाएं (Back)
              </button>
              <button onClick={() => { setActiveApp(null); setShowAddForm(false); }} className="w-4.5 h-4.5 bg-slate-800 rounded-full border-2 border-slate-700 hover:bg-slate-700">
              </button>
              <button onClick={() => alert("📱 कृषि OS v4.0 - सभी सिस्टम सामान्य कार्य कर रहे हैं।")} className="text-[10.5px] font-sans font-bold hover:text-white">
                ℹ️ जानकारी
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
