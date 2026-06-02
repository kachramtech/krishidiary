import React, { useState, useEffect } from "react";
import { useAppState } from "../context/AppContext";
import { MultiSelectFarmDropdown } from "../components/MultiSelectFarmDropdown";
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
  UserCheck,
  Boxes,
  ClipboardList
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
    allOperators,
    createOperatorByAdmin,
    updateOperatorProfile,
    deleteOperator,
    financialYear,
    setFinancialYear,
    createFarmer,
    updateFarmer,
    createTransaction,
    updateTransaction,
    createLabor,
    deleteFarmer,
    deleteTransaction,
    deleteLabor,
    handleDeletePlot,
    handleUpdatePlot,
    triggerWhatsAppReminder,
    overallIncome,
    overallExpense,
    overallProfit,
    logAudit,
    handleAddPlotInline,
    showConfirm,
    clearAllDatabaseData,
    currentUser,
    loginError,
    setLoginError,
    handleGoogleLogin,
    handleEmailPasswordLogin,
    handleEmailPasswordRegister,
    handlePasswordReset,
    handleGuestLogin,
    handleLogout
  } = useAppState();

  const isMainUser = currentUser?.email?.toLowerCase().trim() === "kachramtech@gmail.com" || currentUser?.role === "super_admin";

  // Android OS System state
  const [deviceTime, setDeviceTime] = useState("");
  const [deviceDate, setDeviceDate] = useState("");
  const [batteryLevel, setBatteryLevel] = useState(94);

  // Custom auth modal & forms
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"login" | "register" | "forgot">("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [authFeedback, setAuthFeedback] = useState("");
  const [activeApp, setActiveApp] = useState<string | null>(null); // 'income' | 'expense' | 'fertilizer' | 'seed' | 'pesticide' | 'labor' | 'farmers' | 'calculator' | 'rates' | 'audits' | 'farm_management' | 'crop_management' | 'merchant_management' | 'consolidated_report' | 'farm_plot_report' | 'income_report' | 'expense_report'
  const [folderOpen, setFolderOpen] = useState(false); // 'प्रबंधन' folder overlay click state
  const [profileFolderOpen, setProfileFolderOpen] = useState(false); // 'प्रोफ़ाइल प्रबंधन' folder overlay click state
  const [reportFolderOpen, setReportFolderOpen] = useState(false); // 'रिपोर्ट' folder overlay click state
  const [reportYearFilter, setReportYearFilter] = useState<string>("सभी"); // 'सभी' | '2026-2027' | '2025-2026'
  const [searchQuery, setSearchQuery] = useState("");
  const [landingTab, setLandingTab] = useState<"advisory" | "appinfo">("advisory");
  const [advisoryStep, setAdvisoryStep] = useState<"tillage" | "seed" | "manure" | "protection">("tillage");
  const [advisoryAcres, setAdvisoryAcres] = useState<number>(1);

  // Guard routing: reset active app if user gets signed out
  useEffect(() => {
    if (!currentUser) {
      setActiveApp(null);
    }
  }, [currentUser]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setAuthFeedback("");

    if (authType === "login") {
      if (!loginForm.email || !loginForm.password) {
        setLoginError("कृपया सभी फ़ील्ड भरें!");
        return;
      }
      try {
        await handleEmailPasswordLogin(loginForm.email, loginForm.password);
        setIsLoginModalOpen(false);
        setLoginForm({ email: "", password: "" });
      } catch (err: any) {
        // Error sets in context state, showing in UI
      }
    } else if (authType === "register") {
      if (!registerForm.name || !registerForm.phone || !registerForm.email || !registerForm.password) {
        setLoginError("कृपया सभी फ़ील्ड भरें!");
        return;
      }
      if (registerForm.password.length < 6) {
        setLoginError("पासवर्ड कम से कम 6 अक्षरों का होना चाहिए!");
        return;
      }
      try {
        await handleEmailPasswordRegister(
          registerForm.name,
          registerForm.phone,
          registerForm.email,
          registerForm.password
        );
        setAuthFeedback("पंजीकरण सफल! लॉगिन किया जा रहा है...");
        setTimeout(() => {
          setIsLoginModalOpen(false);
          setRegisterForm({ name: "", phone: "", email: "", password: "" });
          setAuthFeedback("");
        }, 1500);
      } catch (err: any) {
        // Error set in context
      }
    } else if (authType === "forgot") {
      if (!forgotEmail) {
        setLoginError("कृपया अपना ईमेल दर्ज करें!");
        return;
      }
      try {
        await handlePasswordReset(forgotEmail);
        setAuthFeedback("सफलतापूर्वक! पासवर्ड रीसेट करने का लिंक आपके ईमेल पर भेजा गया है।");
        setForgotEmail("");
      } catch (err: any) {
        // Error set in context
      }
    }
  };

  // Plot edit mode tracking
  const [editingPlot, setEditingPlot] = useState<{ farmerId: string, plotId: string, name: string, acreage: string, crop: string } | null>(null);

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

  // Fertilizer registration custom list state
  const [registeredFertilizers, setRegisteredFertilizers] = useState<Array<{id: string, name: string, company: string}>>(() => {
    const saved = localStorage.getItem("agri_registered_fertilizers");
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Pesticide registration custom list state
  const [registeredPesticides, setRegisteredPesticides] = useState<Array<{id: string, name: string, company: string}>>(() => {
    const saved = localStorage.getItem("agri_registered_pesticides");
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem("agri_registered_crops", JSON.stringify(registeredCrops));
  }, [registeredCrops]);

  useEffect(() => {
    localStorage.setItem("agri_registered_merchants", JSON.stringify(registeredMerchants));
  }, [registeredMerchants]);

  useEffect(() => {
    localStorage.setItem("agri_registered_fertilizers", JSON.stringify(registeredFertilizers));
  }, [registeredFertilizers]);

  useEffect(() => {
    localStorage.setItem("agri_registered_pesticides", JSON.stringify(registeredPesticides));
  }, [registeredPesticides]);

  // === STOCK PERFORMANCE STATE ===
  const [stockList, setStockList] = useState<Array<{
    id: string;
    type: "fertilizer" | "seed" | "pesticide";
    name: string;
    quantity: number;
    unit: string;
    company: string;
    updatedAt: string;
    pricePerUnit?: number;
    history?: any[];
  }>>(() => {
    const saved = localStorage.getItem("agri_stock_list");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading stock list", e);
      }
    }
    return [
      { id: "stock_1", type: "fertilizer", name: "यूरिया (Urea - 46%)", quantity: 20, unit: "बोरी", company: "इफको (IFFCO)", pricePerUnit: 350, updatedAt: new Date().toISOString() },
      { id: "stock_2", type: "fertilizer", name: "DAP (18:46:0)", quantity: 15, unit: "बोरी", company: "कृभको", pricePerUnit: 1350, updatedAt: new Date().toISOString() },
      { id: "stock_3", type: "seed", name: "सोयाबीन (JS-9560)", quantity: 200, unit: "कि.ग्रा.", company: "महाबीज", pricePerUnit: 90, updatedAt: new Date().toISOString() },
      { id: "stock_4", type: "seed", name: "लहसुन (अमरेटा)", quantity: 80, unit: "कि.ग्रा.", company: "देशी", pricePerUnit: 150, updatedAt: new Date().toISOString() },
      { id: "stock_5", type: "pesticide", name: "कोराजन (Coragen)", quantity: 5, unit: "लीटर", company: "बास्को", pricePerUnit: 950, updatedAt: new Date().toISOString() },
    ];
  });

  useEffect(() => {
    localStorage.setItem("agri_stock_list", JSON.stringify(stockList));
  }, [stockList]);

  const [stockFormState, setStockFormState] = useState({
    type: "fertilizer" as "fertilizer" | "seed" | "pesticide",
    name: "",
    quantity: "",
    unit: "कि.ग्राम",
    pricePerUnit: "",
    company: ""
  });

  const [stockFilter, setStockFilter] = useState<"all" | "fertilizer" | "seed" | "pesticide">("all");
  const [stockTab, setStockTab] = useState<"list" | "report">("list");
  const [stockSearch, setStockSearch] = useState("");
  const [selectedStockToRefill, setSelectedStockToRefill] = useState<string>("new");
  const [editingStockItem, setEditingStockItem] = useState<any | null>(null);
  const [viewingStockHistoryItem, setViewingStockHistoryItem] = useState<any | null>(null);
  const [showStockWarning, setShowStockWarning] = useState(false);
  const [stockWarningDetails, setStockWarningDetails] = useState<{
    type: "fertilizer" | "seed" | "pesticide";
    itemName: string;
    neededQty: number;
    currentQty: number;
    unit: string;
    callback?: (addedQty: number) => Promise<void> | void;
  } | null>(null);

  const [showRefillModal, setShowRefillModal] = useState(false);
  const [refillQuantity, setRefillQuantity] = useState("");
  const [stockQuickRefillItemId, setStockQuickRefillItemId] = useState<string | null>(null);
  const [stockQuickRefillAmt, setStockQuickRefillAmt] = useState("");

  // Generic Quick Add State
  const [quickAddType, setQuickAddType] = useState<"crop" | "farm" | "fertilizer" | "pesticide" | "merchant" | null>(null);
  const [quickAddCallback, setQuickAddCallback] = useState<((val: string) => void) | null>(null);

  const [quickAddFormState, setQuickAddFormState] = useState({
    name: "",
    variety: "",
    company: "",
    farmerId: "",
    acreage: "2.5",
    crop: "",
    phone: "",
    cropsPurchased: ""
  });

  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddType || !quickAddCallback) return;

    if (quickAddType === "crop") {
      if (!quickAddFormState.name || !quickAddFormState.variety || !quickAddFormState.company) {
        alert("❌ कृपया फसल का नाम, किस्म और कंपनी दर्ज करें!");
        return;
      }
      const newCrop = {
        id: "crop_" + Date.now(),
        name: quickAddFormState.name,
        variety: quickAddFormState.variety,
        company: quickAddFormState.company
      };
      setRegisteredCrops(prev => [newCrop, ...prev]);
      alert("✅ नयी फसल किस्म सफलतापूर्वक जोड़ी गई!");
      quickAddCallback(`${newCrop.name} (${newCrop.variety})`);
    } else if (quickAddType === "farm") {
      if (!quickAddFormState.farmerId || !quickAddFormState.name || !quickAddFormState.acreage) {
        alert("❌ कृपया किसान, खेत का नाम और रकबा दर्ज करें!");
        return;
      }
      const newPlotId = await handleAddPlotInline(
        quickAddFormState.farmerId,
        quickAddFormState.name,
        Number(quickAddFormState.acreage),
        quickAddFormState.crop
      );
      if (newPlotId) {
        alert("✅ नया खेत सफलतापूर्वक जोड़ा गया!");
        quickAddCallback(newPlotId);
      } else {
        alert("❌ खेत जोड़ने में त्रुटि हुई!");
      }
    } else if (quickAddType === "fertilizer") {
      if (!quickAddFormState.name || !quickAddFormState.company) {
        alert("❌ कृपया खाद का नाम और कंपनी दर्ज करें!");
        return;
      }
      const newFert = {
        id: "fert_" + Date.now(),
        name: quickAddFormState.name,
        company: quickAddFormState.company
      };
      setRegisteredFertilizers(prev => [newFert, ...prev]);
      alert("✅ नयी खाद सफलतापूर्वक जोड़ी गई!");
      quickAddCallback(`${newFert.name} (${newFert.company})`);
    } else if (quickAddType === "pesticide") {
      if (!quickAddFormState.name || !quickAddFormState.company) {
        alert("❌ कृपया दवा का नाम और कंपनी दर्ज करें!");
        return;
      }
      const newPest = {
        id: "pest_" + Date.now(),
        name: quickAddFormState.name,
        company: quickAddFormState.company
      };
      setRegisteredPesticides(prev => [newPest, ...prev]);
      alert("✅ नयी दवा सफलतापूर्वक जोड़ी गई!");
      quickAddCallback(`${newPest.name} (${newPest.company})`);
    } else if (quickAddType === "merchant") {
      if (!quickAddFormState.name || !quickAddFormState.cropsPurchased) {
        alert("❌ कृपया व्यापारी का नाम और खरीदी जाने वाली फसलें दर्ज करें!");
        return;
      }
      const newMerchant = {
        id: "mer_" + Date.now(),
        name: quickAddFormState.name,
        phone: quickAddFormState.phone || "",
        cropsPurchased: quickAddFormState.cropsPurchased
      };
      setRegisteredMerchants(prev => [newMerchant, ...prev]);
      alert("✅ नया व्यापारी संपर्क जोड़ा गया!");
      quickAddCallback(newMerchant.name);
    }

    setQuickAddType(null);
    setQuickAddCallback(null);
  };

  // Form states for profile management
  const [farmForm, setFarmForm] = useState({ farmerId: "", name: "", acreage: "2.5", crop: "" });
  const [isNewFarmer, setIsNewFarmer] = useState(false);
  const [newFarmerState, setNewFarmerState] = useState({ name: "", phone: "", village: "मुख्य ग्राम" });
  const [cropForm, setCropForm] = useState({ name: "", variety: "", company: "" });
  const [merchantForm, setMerchantForm] = useState({ name: "", phone: "", cropsPurchased: "" });
  const [fertilizerProfileForm, setFertilizerProfileForm] = useState({ name: "", company: "" });
  const [pesticideProfileForm, setPesticideProfileForm] = useState({ name: "", company: "" });

  const [editingFertilizerId, setEditingFertilizerId] = useState<string | null>(null);
  const [fertilizerEditForm, setFertilizerEditForm] = useState({ name: "", company: "" });

  const [editingPesticideId, setEditingPesticideId] = useState<string | null>(null);
  const [pesticideEditForm, setPesticideEditForm] = useState({ name: "", company: "" });

  const handleRegisterFarmPlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewFarmer) {
      if (!newFarmerState.name) {
        alert("❌ कृपया किसान का नाम दर्ज करें!");
        return;
      }
      if (!farmForm.name || !farmForm.acreage) {
        alert("❌ कृपया खेत का नाम और रकबा (एरिया) दर्ज करें!");
        return;
      }
      const initialFarmPlot = {
        id: "farm_" + Date.now(),
        name: farmForm.name,
        acreage: Number(farmForm.acreage),
        activeCrop: farmForm.crop
      };
      await createFarmer({
        name: newFarmerState.name,
        phone: newFarmerState.phone,
        village: newFarmerState.village || "मुख्य ग्राम",
        totalAcreage: Number(farmForm.acreage),
        activeCrop: farmForm.crop
      }, [initialFarmPlot]);
      
      alert("✅ नया किसान तथा उनका खेत सफलतापूर्वक पंजीकृत किया गया!");
      setNewFarmerState({ name: "", phone: "", village: "मुख्य ग्राम" });
      setFarmForm({ farmerId: "", name: "", acreage: "2.5", crop: "" });
      setIsNewFarmer(false);
      setShowAddForm(false);
    } else {
      if (!farmForm.farmerId || !farmForm.name || !farmForm.acreage) {
        alert("❌ कृपया किसान, खेत का नाम और रकबा (एरिया) दर्ज करें!");
        return;
      }
      await handleAddPlotInline(farmForm.farmerId, farmForm.name, Number(farmForm.acreage), farmForm.crop);
      alert("✅ नया खेत सफलतापूर्वक पंजीकृत कर जोड़ा गया!");
      setFarmForm({ farmerId: "", name: "", acreage: "2.5", crop: "" });
      setShowAddForm(false);
    }
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

  const handleRegisterFertilizerObj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fertilizerProfileForm.name || !fertilizerProfileForm.company) {
      alert("❌ कृपया खाद का नाम और कंपनी का नाम दर्ज करें!");
      return;
    }
    const newFert = {
      id: "fert_" + Date.now(),
      name: fertilizerProfileForm.name,
      company: fertilizerProfileForm.company
    };
    setRegisteredFertilizers(prev => [newFert, ...prev]);
    alert("✅ नयी खाद सफलतापूर्वक पंजीकृत की गयी!");
    setFertilizerProfileForm({ name: "", company: "" });
    setShowAddForm(false);
    logAudit("REGISTER_FERTILIZER", newFert.id, "farmers", `पंजीकृत नयी खाद: ${fertilizerProfileForm.name} (ब्रांड/कंपनी: ${fertilizerProfileForm.company})`);
  };

  const handleRegisterPesticideObj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesticideProfileForm.name || !pesticideProfileForm.company) {
      alert("❌ कृपया दवा का नाम और कंपनी का नाम दर्ज करें!");
      return;
    }
    const newPest = {
      id: "pest_" + Date.now(),
      name: pesticideProfileForm.name,
      company: pesticideProfileForm.company
    };
    setRegisteredPesticides(prev => [newPest, ...prev]);
    alert("✅ नयी दवा सफलतापूर्वक पंजीकृत की गयी!");
    setPesticideProfileForm({ name: "", company: "" });
    setShowAddForm(false);
    logAudit("REGISTER_PESTICIDE", newPest.id, "farmers", `पंजीकृत नयी दवा: ${pesticideProfileForm.name} (ब्रांड/कंपनी: ${pesticideProfileForm.company})`);
  };

  const handleUpdateFertilizerObj = (id: string, name: string, company: string) => {
    if (!name || !company) {
      alert("❌ कृपया खाद का नाम और कंपनी का नाम दर्ज करें!");
      return;
    }
    setRegisteredFertilizers(prev => prev.map(f => f.id === id ? { ...f, name, company } : f));
    setEditingFertilizerId(null);
    alert("✅ खाद का विवरण सफलतापूर्वक अपडेट किया गया!");
    logAudit("UPDATE_FERTILIZER", id, "farmers", `संपादित खाद: ${name} (ब्रांड/कंपनी: ${company})`);
  };

  const handleUpdatePesticideObj = (id: string, name: string, company: string) => {
    if (!name || !company) {
      alert("❌ कृपया दवा का नाम और कंपनी का नाम दर्ज करें!");
      return;
    }
    setRegisteredPesticides(prev => prev.map(p => p.id === id ? { ...p, name, company } : p));
    setEditingPesticideId(null);
    alert("✅ दवा का विवरण सफलतापूर्वक अपडेट किया गया!");
    logAudit("UPDATE_PESTICIDE", id, "farmers", `संपादित दवा: ${name} (ब्रांड/कंपनी: ${company})`);
  };

  // Modals inside Android Window apps
  const [showAddForm, setShowAddForm] = useState(false);

  const triggerQuickAdd = (type: "crop" | "farm" | "fertilizer" | "pesticide" | "merchant", callback: (val: string) => void) => {
    setQuickAddType(type);
    setQuickAddCallback(() => callback);
    const defaultFarmerId = farmers.length > 0 ? farmers[0].id : "";
    const defaultCropFormValue = registeredCrops.length > 0 ? `${registeredCrops[0].name} (${registeredCrops[0].variety})` : "";
    setQuickAddFormState({
      name: "",
      variety: "",
      company: "",
      farmerId: defaultFarmerId,
      acreage: "2.5",
      crop: defaultCropFormValue,
      phone: "",
      cropsPurchased: ""
    });
  };

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
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [farmerForm, setFarmerForm] = useState({ name: "", village: "", phone: "", totalAcreage: 4, activeCrop: "" });
  const [incomeForm, setIncomeForm] = useState({ 
    farmerId: "", 
    farmId: "", 
    crop: "", 
    amount: "", 
    category: "crop_sale", 
    date: new Date().toISOString().split("T")[0], 
    isMandiSale: false, 
    grossWeight: "", 
    deductionRate: "2", 
    traderName: "", 
    isCreditSale: false, 
    dueDate: "",
    // new units & selectors
    deductKg: "0",
    rateType: "quintal" as "kg" | "quintal",
    pendingAmount: "",
    traderSelectMode: "existing" as "existing" | "anya",
    tempTraderName: "",
    tempTraderPhone: "",
    paymentStatus: "paid" as "paid" | "partially_paid"
  });
  const [expenseForm, setExpenseForm] = useState({ farmerId: "", farmId: "", crop: "", amount: "", category: "diesel", date: new Date().toISOString().split("T")[0], isCreditSale: false, dueDate: "" });
  const [fertilizerForm, setFertilizerForm] = useState({ farmerId: "", farmId: "", crop: "", fertilizerBrand: "", bagsCount: "2", costPerBag: "350", date: new Date().toISOString().split("T")[0] });
  const [seedForm, setSeedForm] = useState({ farmerId: "", farmId: "", crop: "", seedVariety: "", quantityKg: "40", cost: "1800", date: new Date().toISOString().split("T")[0] });
  const [pesticideForm, setPesticideForm] = useState({ farmerId: "", farmId: "", crop: "", productName: "", quantity: "1", cost: "950", date: new Date().toISOString().split("T")[0] });
  const [laborFormState, setLaborFormState] = useState({ farmerId: "", farmId: "", crop: "", mode: "individual" as "individual" | "bulk_gang", laborerName: "", attendance: "present" as any, workersCount: "5", groupName: "", workDescription: "", contractAmount: "", advancePaid: "", date: new Date().toISOString().split("T")[0] });

  // Mandi manual calculator
  const [calcForm, setCalcForm] = useState({ gross: "50", rate: "2450", cutPercent: "1.5" });

  const computeMandiCalculation = (grossVal: string, deductKgVal: string, amtVal: string, rateTypeVal: string) => {
    const gross = Number(grossVal) || 0;
    const deductKg = Number(deductKgVal) || 0;
    const rate = Number(amtVal) || 0;
    const netWeight = Math.max(0, gross - deductKg);
    let calculatedAmount = 0;
    if (rateTypeVal === "kg") {
      calculatedAmount = netWeight * rate;
    } else {
      // rate per quintal: divide netWeight (in kg) by 100 to get quintals
      calculatedAmount = netWeight * (rate / 100);
    }
    return {
      netWeight,
      calculatedAmount: Math.round(calculatedAmount),
      deductions: deductKg
    };
  };

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
    setFarmerForm({ name: "", village: "", phone: "", totalAcreage: 4, activeCrop: "" });
    setShowAddForm(false);
  };

  const handleRegisterIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.farmId || !incomeForm.amount) {
      alert("❌ कृपया खेत और कुल राशि / भाव का विवरण दर्ज करें!");
      return;
    }

    let finalTraderName = incomeForm.traderName;
    if (incomeForm.isMandiSale) {
      if (incomeForm.traderSelectMode === "anya") {
        const name = incomeForm.tempTraderName.trim();
        const phone = incomeForm.tempTraderPhone.trim();
        if (!name) {
          alert("❌ कृपया नया व्यापारी का नाम दर्ज करें!");
          return;
        }
        const isDuplicate = registeredMerchants.some(
          m => m.name.toLowerCase().trim() === name.toLowerCase()
        );
        if (isDuplicate) {
          alert(`❌ व्यापारी "${name}" पहले से मौजूद है! कृपया सूची से चयन करें।`);
          return;
        }

        // Add to merchant directory
        const newMerchant = {
          id: "merchant_" + Date.now(),
          name,
          phone,
          cropsPurchased: incomeForm.crop || ""
        };
        // Persist
        setRegisteredMerchants(prev => {
          const updated = [...prev, newMerchant];
          localStorage.setItem("agri_registered_merchants", JSON.stringify(updated));
          return updated;
        });
        finalTraderName = name;
      } else {
        if (!incomeForm.traderName) {
          alert("❌ कृपया मंडी व्यापारी का चयन करें या 'अन्य' विकल्प से जोड़ें!");
          return;
        }
      }
    }

    // Compute amount if Mandi Sale
    let calculatedAmount = Number(incomeForm.amount);
    if (incomeForm.isMandiSale) {
      const gross = Number(incomeForm.grossWeight || 0);
      const deductKg = Number(incomeForm.deductKg || 0);
      const rateVal = Number(incomeForm.amount || 0); // Rate entered
      const rateType = incomeForm.rateType || "quintal"; // 'kg' or 'quintal'

      const netWeight = Math.max(0, gross - deductKg);
      if (rateType === "kg") {
        calculatedAmount = netWeight * rateVal;
      } else {
        calculatedAmount = netWeight * (rateVal / 100);
      }
    }

    const payload = {
      farmerId: incomeForm.farmerId,
      farmId: incomeForm.farmId,
      crop: incomeForm.crop,
      type: "income",
      category: incomeForm.category,
      amount: calculatedAmount,
      date: incomeForm.date,
      isMandiSale: incomeForm.isMandiSale,
      grossWeight: Number(incomeForm.grossWeight || 0),
      deductKg: Number(incomeForm.deductKg || 0),
      rateType: incomeForm.rateType,
      deductionRate: Number(incomeForm.deductionRate || 0),
      traderName: finalTraderName,
      isCreditSale: incomeForm.isCreditSale,
      pendingAmount: incomeForm.isCreditSale ? Number(incomeForm.pendingAmount || calculatedAmount) : 0,
      dueDate: incomeForm.dueDate,
      paymentStatus: incomeForm.isCreditSale ? "partially_paid" : "paid"
    };

    if (editingTransactionId) {
      await updateTransaction(editingTransactionId, payload);
      alert("✅ फसल बिक्री/आय विवरण सफलतापूर्वक अपडेट कर दिया गया!");
    } else {
      await createTransaction(payload);
      alert("✅ फसल बिक्री/आय विवरण सुरक्षित कर दिया गया!");
    }

    // Reset Form
    setIncomeForm({ 
      farmerId: "", 
      farmId: "", 
      crop: "", 
      amount: "", 
      category: "crop_sale", 
      date: new Date().toISOString().split("T")[0], 
      isMandiSale: false, 
      grossWeight: "", 
      deductionRate: "2", 
      traderName: "", 
      isCreditSale: false, 
      dueDate: "",
      deductKg: "0",
      rateType: "quintal",
      pendingAmount: "",
      traderSelectMode: "existing",
      tempTraderName: "",
      tempTraderPhone: "",
      paymentStatus: "paid"
    });
    setEditingTransactionId(null);
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

    if (editingTransactionId) {
      await updateTransaction(editingTransactionId, payload);
      alert("✅ सामान्य व्यय विवरण सफलतापूर्वक अपडेट कर दिया गया!");
    } else {
      await createTransaction(payload);
      alert("✅ सामान्य व्यय विवरण सफलतापूर्वक दर्ज हो चुका है!");
    }

    setExpenseForm({ farmerId: "", farmId: "", crop: "", amount: "", category: "diesel", date: new Date().toISOString().split("T")[0], isCreditSale: false, dueDate: "" });
    setEditingTransactionId(null);
    setShowAddForm(false);
  };

  const submitFertilizerPayload = async () => {
    const calculatedAmount = Number(fertilizerForm.bagsCount) * Number(fertilizerForm.costPerBag);
    const isCredit = !!(fertilizerForm as any).isCreditSale;
    const payload = {
      farmerId: fertilizerForm.farmerId,
      farmId: fertilizerForm.farmId,
      crop: fertilizerForm.crop,
      type: "expense",
      category: "fertilizer",
      amount: calculatedAmount,
      date: fertilizerForm.date,
      isCreditSale: isCredit,
      dueDate: isCredit ? ((fertilizerForm as any).dueDate || "") : "",
      paymentStatus: isCredit ? "unpaid" : "paid",
      voiceTranscription: `खाद सामग्री: ${fertilizerForm.fertilizerBrand}, मात्रा: ${fertilizerForm.bagsCount} बोरी, दर: ₹${fertilizerForm.costPerBag}/बोरी`
    };
    await createTransaction(payload);
    alert(`✅ खाद खर्च विवरण सहेजा गया! स्टॉक से ${fertilizerForm.bagsCount} बोरी कम किया गया। कुल लागत: ₹${calculatedAmount}`);
    setFertilizerForm({ farmerId: "", farmId: "", crop: "", fertilizerBrand: "", bagsCount: "2", costPerBag: "350", date: new Date().toISOString().split("T")[0] });
    setShowAddForm(false);
  };

  const handleRegisterFertilizer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fertilizerForm.farmId) {
      alert("❌ कृपया खेत चुनें!");
      return;
    }

    const brandName = fertilizerForm.fertilizerBrand;
    const needed = Number(fertilizerForm.bagsCount || 0);
    const stockItem = stockList.find(s => s.type === "fertilizer" && s.name.trim() === brandName.trim());
    const currentQty = stockItem ? stockItem.quantity : 0;

    if (currentQty < needed) {
      setStockWarningDetails({
        type: "fertilizer",
        itemName: brandName || "चयनित खाद",
        neededQty: needed,
        currentQty: currentQty,
        unit: "बोरी",
        callback: async (addedValue: number) => {
          const totalStock = currentQty + addedValue;
          if (totalStock >= needed) {
            setStockList(prev => prev.map(s => {
              if (s.type === "fertilizer" && s.name.trim() === brandName.trim()) {
                const finalQuantity = s.quantity - needed + addedValue;
                const logRefill = {
                  id: "hist_" + Date.now() + "_refill",
                  action: "refill" as const,
                  quantityChange: addedValue,
                  finalQuantity: s.quantity + addedValue,
                  operatorName: currentUser?.name || "मुख्य यूजर",
                  date: new Date().toISOString(),
                  details: `त्वरित रिफिल: ${addedValue} ${s.unit} स्टॉक जोड़ा गया।`
                };
                const logUse = {
                  id: "hist_" + (Date.now() + 1) + "_use",
                  action: "use" as const,
                  quantityChange: -needed,
                  finalQuantity,
                  operatorName: currentUser?.name || "मुख्य यूजर",
                  date: new Date().toISOString(),
                  details: `${needed} ${s.unit} खाद खेत उपयोग हेतु प्रयोग की गई।`
                };
                const updatedHistory = s.history ? [logUse, logRefill, ...s.history] : [logUse, logRefill];
                return { ...s, quantity: finalQuantity, history: updatedHistory, updatedAt: new Date().toISOString() };
              }
              return s;
            }));
            await submitFertilizerPayload();
          } else {
            alert(`⚠️ अभी भी ${needed - totalStock} बोरी स्टॉक कम है!`);
          }
        }
      });
      setShowStockWarning(true);
      return;
    }

    // Enough stock -> deduct
    setStockList(prev => prev.map(s => {
      if (s.type === "fertilizer" && s.name.trim() === brandName.trim()) {
        const finalQuantity = Math.max(0, s.quantity - needed);
        const logUse = {
          id: "hist_" + Date.now() + "_use",
          action: "use" as const,
          quantityChange: -needed,
          finalQuantity,
          operatorName: currentUser?.name || "मुख्य यूजर",
          date: new Date().toISOString(),
          details: `${needed} ${s.unit} खाद खेत उपयोग हेतु प्रयोग की गई।`
        };
        const updatedHistory = s.history ? [logUse, ...s.history] : [logUse];
        return { ...s, quantity: finalQuantity, history: updatedHistory, updatedAt: new Date().toISOString() };
      }
      return s;
    }));

    await submitFertilizerPayload();
  };

  const submitSeedPayload = async () => {
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
    alert(`✅ बीज उपयोग विवरण सफलतापूर्वक सहेजा गया! स्टॉक से ${seedForm.quantityKg} कि.ग्रा. कम किया गया।`);
    setSeedForm({ farmerId: "", farmId: "", crop: "", seedVariety: "", quantityKg: "40", cost: "1800", date: new Date().toISOString().split("T")[0] });
    setShowAddForm(false);
  };

  const handleRegisterSeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedForm.farmId || !seedForm.cost) {
      alert("❌ कृपया खेत और बीज लागत विवरण पूर्ण करें!");
      return;
    }

    const seedName = seedForm.seedVariety;
    const needed = Number(seedForm.quantityKg || 0);
    const stockItem = stockList.find(s => s.type === "seed" && s.name.trim() === seedName.trim());
    const currentQty = stockItem ? stockItem.quantity : 0;

    if (currentQty < needed) {
      setStockWarningDetails({
        type: "seed",
        itemName: seedName || "चयनित बीज",
        neededQty: needed,
        currentQty: currentQty,
        unit: "कि.ग्रा.",
        callback: async (addedValue: number) => {
          const totalStock = currentQty + addedValue;
          if (totalStock >= needed) {
            setStockList(prev => prev.map(s => {
              if (s.type === "seed" && s.name.trim() === seedName.trim()) {
                const finalQuantity = s.quantity - needed + addedValue;
                const logRefill = {
                  id: "hist_" + Date.now() + "_refill",
                  action: "refill" as const,
                  quantityChange: addedValue,
                  finalQuantity: s.quantity + addedValue,
                  operatorName: currentUser?.name || "मुख्य यूजर",
                  date: new Date().toISOString(),
                  details: `त्वरित रिफिल: ${addedValue} ${s.unit} स्टॉक जोड़ा गया।`
                };
                const logUse = {
                  id: "hist_" + (Date.now() + 1) + "_use",
                  action: "use" as const,
                  quantityChange: -needed,
                  finalQuantity,
                  operatorName: currentUser?.name || "मुख्य यूजर",
                  date: new Date().toISOString(),
                  details: `${needed} ${s.unit} बीज बुवाई/खेत उपयोग हेतु प्रयोग किया गया।`
                };
                const updatedHistory = s.history ? [logUse, logRefill, ...s.history] : [logUse, logRefill];
                return { ...s, quantity: finalQuantity, history: updatedHistory, updatedAt: new Date().toISOString() };
              }
              return s;
            }));
            await submitSeedPayload();
          } else {
            alert(`⚠️ अभी भी ${needed - totalStock} कि.ग्रा. स्टॉक कम है!`);
          }
        }
      });
      setShowStockWarning(true);
      return;
    }

    setStockList(prev => prev.map(s => {
      if (s.type === "seed" && s.name.trim() === seedName.trim()) {
        const finalQuantity = Math.max(0, s.quantity - needed);
        const logUse = {
          id: "hist_" + Date.now() + "_use",
          action: "use" as const,
          quantityChange: -needed,
          finalQuantity,
          operatorName: currentUser?.name || "मुख्य यूजर",
          date: new Date().toISOString(),
          details: `${needed} ${s.unit} बीज बुवाई/खेत उपयोग हेतु प्रयोग किया गया।`
        };
        const updatedHistory = s.history ? [logUse, ...s.history] : [logUse];
        return { ...s, quantity: finalQuantity, history: updatedHistory, updatedAt: new Date().toISOString() };
      }
      return s;
    }));

    await submitSeedPayload();
  };

  const submitPesticidePayload = async () => {
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
      voiceTranscription: `दवा / कीटनाशक प्रविष्टि: ${pesticideForm.productName}, उपयोग मात्रा: ${pesticideForm.quantity || 1} लीटर/इकाई`
    };
    await createTransaction(payload);
    alert(`✅ दवा / कीटनाशक छिड़काव विवरण सुरक्षित! स्टॉक से ${pesticideForm.quantity || 1} लीटर कम किया गया।`);
    setPesticideForm({ farmerId: "", farmId: "", crop: "", productName: "", quantity: "1", cost: "950", date: new Date().toISOString().split("T")[0] });
    setShowAddForm(false);
  };

  const handleRegisterPesticide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesticideForm.farmId || !pesticideForm.cost) {
      alert("❌ कृपया खेत और दवा छिड़काव खर्च दर्ज करें!");
      return;
    }

    const pestName = pesticideForm.productName;
    const needed = Number(pesticideForm.quantity || 1);
    const stockItem = stockList.find(s => s.type === "pesticide" && s.name.trim() === pestName.trim());
    const currentQty = stockItem ? stockItem.quantity : 0;

    if (currentQty < needed) {
      setStockWarningDetails({
        type: "pesticide",
        itemName: pestName || "चयनित कीटनाशक",
        neededQty: needed,
        currentQty: currentQty,
        unit: "लीटर",
        callback: async (addedValue: number) => {
          const totalStock = currentQty + addedValue;
          if (totalStock >= needed) {
            setStockList(prev => prev.map(s => {
              if (s.type === "pesticide" && s.name.trim() === pestName.trim()) {
                const finalQuantity = s.quantity - needed + addedValue;
                const logRefill = {
                  id: "hist_" + Date.now() + "_refill",
                  action: "refill" as const,
                  quantityChange: addedValue,
                  finalQuantity: s.quantity + addedValue,
                  operatorName: currentUser?.name || "मुख्य यूजर",
                  date: new Date().toISOString(),
                  details: `त्वरित रिफिल: ${addedValue} ${s.unit} स्टॉक जोड़ा गया।`
                };
                const logUse = {
                  id: "hist_" + (Date.now() + 1) + "_use",
                  action: "use" as const,
                  quantityChange: -needed,
                  finalQuantity,
                  operatorName: currentUser?.name || "मुख्य यूजर",
                  date: new Date().toISOString(),
                  details: `${needed} ${s.unit} दवा खेत उपयोग हेतु प्रयोग की गई।`
                };
                const updatedHistory = s.history ? [logUse, logRefill, ...s.history] : [logUse, logRefill];
                return { ...s, quantity: finalQuantity, history: updatedHistory, updatedAt: new Date().toISOString() };
              }
              return s;
            }));
            await submitPesticidePayload();
          } else {
            alert(`⚠️ अभी भी ${needed - totalStock} लीटर स्टॉक कम है!`);
          }
        }
      });
      setShowStockWarning(true);
      return;
    }

    setStockList(prev => prev.map(s => {
      if (s.type === "pesticide" && s.name.trim() === pestName.trim()) {
        const finalQuantity = Math.max(0, s.quantity - needed);
        const logUse = {
          id: "hist_" + Date.now() + "_use",
          action: "use" as const,
          quantityChange: -needed,
          finalQuantity,
          operatorName: currentUser?.name || "मुख्य यूजर",
          date: new Date().toISOString(),
          details: `${needed} ${s.unit} दवा खेत उपयोग हेतु प्रयोग की गई।`
        };
        const updatedHistory = s.history ? [logUse, ...s.history] : [logUse];
        return { ...s, quantity: finalQuantity, history: updatedHistory, updatedAt: new Date().toISOString() };
      }
      return s;
    }));

    await submitPesticidePayload();
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
    setLaborFormState({ farmerId: "", farmId: "", crop: "", mode: "individual", laborerName: "", attendance: "present", workersCount: "5", groupName: "", workDescription: "", contractAmount: "", advancePaid: "", date: new Date().toISOString().split("T")[0] });
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
          {currentUser ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-[9.5px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg text-emerald-450 font-sans font-black max-w-[90px] sm:max-w-[140px] truncate" title={currentUser.name}>
                  👤 {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-2 py-1 bg-red-650/15 hover:bg-red-600/25 border border-red-500/35 text-rose-300 rounded-lg text-[9px] font-black cursor-pointer transition-all uppercase"
                >
                  🚪 लॉगआउट
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthType("login");
                  setLoginError(null);
                  setAuthFeedback("");
                  setIsLoginModalOpen(true);
                }}
                className="px-2 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/35 rounded-lg text-[9px] font-black cursor-pointer shadow shadow-emerald-950/20 transition-all uppercase"
              >
                🔐 लॉगिन
              </button>
            )}
            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-bold">
              ● लाइव सत्र
            </span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg text-[10px] font-mono text-slate-300">
              {deviceTime}
            </span>
          </div>
      </header>

      {/* Main Content Container Area */}
      <div className="flex-1 w-full max-w-xl mx-auto flex flex-col relative px-3 py-3 md:py-6">
        
        {/* 🏞️ Smartphone Android Launcher Wallpaper with full-grid desktop elements */}
        {!activeApp ? (
          currentUser ? (
            <div className="flex-1 bg-cover bg-center p-5 rounded-3xl relative flex flex-col justify-between border border-slate-900 shadow-2xl min-h-[680px]" style={{ backgroundImage: "linear-gradient(to bottom, rgba(30, 27, 75, 0.85), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600')" }}>
              
              {/* Android Lock / Home widget */}
              <div className="text-center pt-16 text-white space-y-2 animate-fadeIn">
                <span className="text-[11px] uppercase tracking-widest font-extrabold text-emerald-400">किसान डिजिटल कृषि केंद्र</span>
                <h3 className="font-sans font-black text-4xl tracking-tight leading-none">{deviceTime}</h3>
                <p className="text-xs font-sans font-semibold text-slate-300">{deviceDate}</p>
              </div>

              {/* Grid of Launcher Apps & Folders */}
            <div className="grid grid-cols-4 gap-2.5 text-center my-12 max-w-[340px] mx-auto select-none">
              
              {/* 📂 FOLDER 1: प्रबंधन (The main folder requested by user) */}
              <button
                onClick={() => setActiveApp("folder_management")}
                className="flex flex-col items-center group outline-none focus:scale-95 transition-all text-center shrink-0 cursor-pointer"
              >
                <div className="p-3 bg-gradient-to-tr from-indigo-805 from-blue-700 to-indigo-600 rounded-2.5xl shadow-lg border border-indigo-500/25 relative flex items-center justify-center hover:scale-105 transition-all w-12.5 h-12.5">
                  <Folder className="h-5.5 w-5.5 text-yellow-300 fill-yellow-250" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[9px] text-white font-black rounded-full flex items-center justify-center animate-bounce">
                    7
                  </span>
                </div>
                <span className="text-[10px] font-bold text-white mt-2 drop-shadow leading-tight font-sans">
                  प्रबंधन
                </span>
              </button>

              {/* 📂 FOLDER 2: प्रोफ़ाइल प्रबंधन (The requested profile management folder) */}
              <button
                onClick={() => setActiveApp("folder_profile")}
                className="flex flex-col items-center group outline-none focus:scale-95 transition-all text-center shrink-0 cursor-pointer"
              >
                <div className="p-3 bg-gradient-to-tr from-emerald-800 to-teal-700 rounded-2.5xl shadow-lg border border-emerald-500/25 relative flex items-center justify-center hover:scale-105 transition-all w-12.5 h-12.5">
                  <Folder className="h-5.5 w-5.5 text-emerald-300 fill-emerald-250" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-[9px] text-white font-black rounded-full flex items-center justify-center animate-bounce font-mono">
                    3
                  </span>
                </div>
                <span className="text-[10px] font-bold text-white mt-2 drop-shadow leading-tight font-sans">
                  प्रोफ़ाइल प्रबंधन
                </span>
              </button>

              {/* 📂 FOLDER 4: मेरी प्रोफाइल (The user requested folder profile option) */}
              <button
                onClick={() => setActiveApp("folder_my_profile")}
                className="flex flex-col items-center group outline-none focus:scale-95 transition-all text-center shrink-0 cursor-pointer"
              >
                <div className="p-3 bg-gradient-to-tr from-sky-805 from-sky-750 to-blue-600 rounded-2.5xl shadow-lg border border-blue-500/25 relative flex items-center justify-center hover:scale-105 transition-all w-12.5 h-12.5">
                  <UserCheck className="h-5.5 w-5.5 text-sky-200" />
                </div>
                <span className="text-[10px] font-bold text-white mt-2 drop-shadow leading-tight font-sans">
                  मेरी प्रोफाइल
                </span>
              </button>

              {/* 📂 FOLDER 3: रिपोर्ट (The newly requested reports folder) */}
              <button
                onClick={() => setActiveApp("folder_reports")}
                className="flex flex-col items-center group outline-none focus:scale-95 transition-all text-center shrink-0 cursor-pointer"
              >
                <div className="p-3 bg-gradient-to-tr from-purple-850 from-purple-800 to-fuchsia-700 rounded-2.5xl shadow-lg border border-purple-500/25 relative flex items-center justify-center hover:scale-105 transition-all w-12.5 h-12.5">
                  <Folder className="h-5.5 w-5.5 text-purple-300 fill-purple-250" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-fuchsia-500 text-[9px] text-white font-black rounded-full flex items-center justify-center animate-bounce font-mono">
                    4
                  </span>
                </div>
                <span className="text-[10px] font-bold text-white mt-2 drop-shadow leading-tight font-sans">
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
               🌟 MAIN FEATURES DASHBOARD (LANDING) WHEN NOT LOGGED IN
               ======================================================== */
            <div className="flex-1 bg-[#0b1220] border border-slate-850 p-5 rounded-3xl shadow-2.5xl space-y-5 text-slate-200 animate-fadeIn min-h-[660px] flex flex-col justify-between">
              
              {/* Header Branding */}
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center space-x-1 p-1 px-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-full select-none">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  <span className="font-sans text-[10px] font-black uppercase tracking-wider">🌾 कृषिडायरी एग्रोपोर्टल</span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight leading-none pt-0.5">किसान डिजिटल कृषि केंद्र</h2>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-normal font-sans">
                  बही-खाता प्रबंधन, खेतवार व्यय विश्लेषण एवं फसल सुरक्षा मार्गदर्शिका।
                </p>
              </div>

              {/* 🌟 PERSISTENT NAVIGATION TOGGLE: Advisory Guide vs. App Info */}
              <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setLandingTab("advisory")}
                  className={`flex-1 py-1.5 rounded-lg text-[10.5px] font-sans font-extrabold transition-all cursor-pointer ${
                    landingTab === "advisory"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-black"
                      : "text-slate-400 hover:text-white bg-transparent border-0"
                  }`}
                >
                  🌾 फसल मार्गदर्शिका (Guide)
                </button>
                <button
                  type="button"
                  onClick={() => setLandingTab("appinfo")}
                  className={`flex-1 py-1.5 rounded-lg text-[10.5px] font-sans font-extrabold transition-all cursor-pointer ${
                    landingTab === "appinfo"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-black"
                      : "text-slate-400 hover:text-white bg-transparent border-0"
                  }`}
                >
                  ℹ️ एप्प जानकारी (App Info)
                </button>
              </div>

              {/* Dynamic Content Switching */}
              {landingTab === "advisory" ? (
                /* ==========================================
                   🌾 CASE 1: PRE-SOWING TO HARVEST STEPS GUIDE
                   ========================================== */
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Step Selector Horizontal Pills */}
                  <div className="grid grid-cols-4 gap-1 select-none">
                    {[
                      { id: "tillage", label: "🚜 जुताई", desc: "भूमि तैयारी" },
                      { id: "seed", label: "🌱 बीज", desc: "किस्म व शोधन" },
                      { id: "manure", label: "💩 जैविक", desc: "खाद व पोषण" },
                      { id: "protection", label: "🛡️ सुरक्षा", desc: "कीट व दवा" }
                    ].map((step) => (
                      <button
                        key={step.id}
                        onClick={() => setAdvisoryStep(step.id as any)}
                        className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                          advisoryStep === step.id
                            ? "bg-emerald-950/40 border-emerald-500/60 text-white shadow-inner"
                            : "bg-slate-950/30 border-slate-800/60 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className="text-[10px] font-black leading-tight truncate">{step.label}</div>
                        <div className="text-[7.5px] text-slate-500 font-sans tracking-tight mt-0.5 truncate">{step.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* Interactive Acre Inputs for Dynamic Calculation (Shows on Seed & Manure tabs) */}
                  {(advisoryStep === "seed" || advisoryStep === "manure") && (
                    <div className="bg-slate-950/60 border border-slate-850 p-2.5 rounded-2xl flex items-center justify-between space-x-3">
                      <div className="space-y-0.5">
                        <span className="text-[9.5px] font-sans font-extrabold text-emerald-400 uppercase tracking-wider block">🏡 आपके खेत का रकबा (Area)</span>
                        <span className="text-[8.5px] text-slate-400">दवा-खाद की सही गणना हेतु एकड़ बदलें:</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-900 p-1 px-2.5 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => setAdvisoryAcres(Math.max(1, advisoryAcres - 1))}
                          className="w-5 h-5 bg-slate-800 text-slate-300 hover:text-white rounded-md font-bold text-xs flex items-center justify-center cursor-pointer border-0"
                        >
                          -
                        </button>
                        <span className="text-xs font-sans font-black text-white w-4 text-center">{advisoryAcres}</span>
                        <button
                          type="button"
                          onClick={() => setAdvisoryAcres(advisoryAcres + 1)}
                          className="w-5 h-5 bg-slate-800 text-slate-300 hover:text-white rounded-md font-bold text-xs flex items-center justify-center cursor-pointer border-0"
                        >
                          +
                        </button>
                        <span className="text-[9.5px] font-black text-slate-400">एकड़</span>
                      </div>
                    </div>
                  )}

                  {/* Advisory Panels */}
                  {advisoryStep === "tillage" && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="relative rounded-2xl overflow-hidden h-[110px] border border-slate-850 shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600" 
                          alt="Tillage Soil" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover brightness-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-3">
                          <span className="text-[8px] bg-emerald-500 text-slate-950 p-0.5 px-2 font-sans font-extrabold uppercase rounded-full w-max mb-1">चरण 01 • बुआई पूर्वकाल</span>
                          <h4 className="text-xs font-sans font-black text-white leading-tight">साइट चयन और प्रारंभिक भूमि तैयारी</h4>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 border border-slate-800/40 p-3 rounded-2xl space-y-1.5 font-sans text-left">
                        <span className="text-[9.5px] font-black text-emerald-400 block tracking-widest uppercase">📌 संक्षेप में</span>
                        <p className="text-[9.5px] text-slate-300 leading-relaxed">
                          हरी मिर्च व सब्जी फसलों के लिए जलनिकासी युक्त ढीली भुरभुरी मिट्टी तथा सूर्यतपन (Soil Solarization) सबसे श्रेष्ठ परिणाम देती है।
                        </p>
                      </div>

                      <div className="bg-[#0b1220] border border-slate-850 rounded-2xl p-3 text-left space-y-2">
                        <span className="text-[10px] font-black text-slate-400 tracking-wider block border-b border-slate-800/60 pb-1">📋 भूमि तैयारी कार्य निर्देश:</span>
                        <ul className="space-y-1.5 text-[9.5px] text-slate-300 list-none font-sans">
                          <li className="flex items-start space-x-1.5">
                            <span className="text-emerald-400 font-bold">a.</span>
                            <span>सब्जी खेती हेतु उपयुक्त बलुई दोमट या हल्की रेतीली मिट्टी सबसे उपयुक्त माध्यम है।</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <span className="text-emerald-400 font-bold">b.</span>
                            <span>मिट्टी का सही pH स्तर <strong className="text-white">6.5 से 7.0</strong> के मध्य होना चाहिए जो भरपूर अवशोषण सुगम बनाता है।</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <span className="text-emerald-400 font-bold">c.</span>
                            <span>यदि मिट्टी का पीएच <strong className="text-rose-400">6 से कम (अम्लीय)</strong> है, तो प्रति एकड़ जुताई के वक्त चूना (Lime) अवश्य छिड़कें।</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <span className="text-emerald-400 font-bold">d.</span>
                            <span>खेत को <strong className="text-white">3-4 बार गहरी जुताई</strong> करके बिल्कुल समतल करें ताकि जलभराव की कोई आशंका न बचे।</span>
                          </li>
                          <li className="flex items-start space-x-1.5">
                            <span className="text-emerald-400 font-bold">e.</span>
                            <span>पिछली बार की बची हुई फसल के अवशेषों, खरपतवार व पुराने थूठों को सावधानीपूर्वक बाहर फेंक दें।</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {advisoryStep === "seed" && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="relative rounded-2xl overflow-hidden h-[110px] border border-slate-850 shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600" 
                          alt="Seed prep" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover brightness-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-3">
                          <span className="text-[8px] bg-indigo-500 text-white p-0.5 px-2 font-sans font-extrabold uppercase rounded-full w-max mb-1">चरण 02 • बीज व रोपाई</span>
                          <h4 className="text-xs font-sans font-black text-white leading-tight">उत्तम किस्मों का चयन व बीज शोधन प्रक्रिया</h4>
                        </div>
                      </div>

                      {/* Seed Calculator UI */}
                      <div className="bg-gradient-to-br from-indigo-950/25 to-slate-900 border border-indigo-900/35 p-3 rounded-2xl text-left space-y-1">
                        <span className="text-[9.5px] font-black text-indigo-400 uppercase tracking-widest block">🧮 {advisoryAcres} एकड़ रकबे के लिए बीज की आवश्यकता</span>
                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-lg font-black text-white leading-none">{(80 * advisoryAcres)} - {(100 * advisoryAcres)} ग्राम</span>
                            <span className="text-[9px] text-slate-400 block font-sans">हाइब्रिड उच्च-गुणवत्ता बीज पर्याप्त होंगे</span>
                          </div>
                          <span className="text-[9.5px] bg-[#4f46e5]/10 border border-indigo-500/30 px-2.5 py-1 text-indigo-300 rounded-lg font-bold font-sans">10% अतिरिक्त पौध सहेजें</span>
                        </div>
                      </div>

                      <div className="bg-[#0b1220] border border-slate-850 rounded-2xl p-3 text-left space-y-2">
                        <span className="text-[10px] font-black text-slate-400 tracking-wider block border-b border-slate-800/60 pb-1">📋 बीज तैयारी व किस्में गाइड:</span>
                        <div className="space-y-2 text-[9.5px] font-sans">
                          <p className="text-slate-300">
                            <strong>सर्वश्रेष्ठ किस्में:</strong> सरपंच दीपा, नुंगवू ज्वेलरी, वी.एन.आर 145, रासी सोनल, फि.टो गौरी, महिको तेजा-4, यू.एस 344 एवं बायो सीड मार्शल।
                          </p>
                          <div className="border-t border-slate-850/60 my-1"></div>
                          <ul className="space-y-1.5 text-slate-300 list-none">
                            <li className="flex items-start space-x-1.5">
                              <span className="text-indigo-400 font-bold">a.</span>
                              <span><strong>बीज शोधन (जरूरी):</strong> फफूंद से बचाव हेतु बीज को रोपने से पहले <strong className="text-white">ट्राइकोडर्मा विरिडी (4 ग्राम प्रति किलो बीज)</strong> से शोधित करें।</span>
                            </li>
                            <li className="flex items-start space-x-1.5">
                              <span className="text-indigo-400 font-bold">b.</span>
                              <span>कीटों के शुरुआती हमले रोकने हेतु बीज को <strong className="text-white">इमिडाक्लोप्रिड (5 ग्राम/किग्रा)</strong> दवा से उपचारित करके छाया में सुखाएं।</span>
                            </li>
                            <li className="flex items-start space-x-1.5">
                              <span className="text-indigo-400 font-bold">c.</span>
                              <span>गैप फिलिंग (तैयार रोपों के खराब होने) से सुरक्षा हेतु सदैव <strong className="text-white">10% अतिरिक्त पौधे</strong> नर्सरी में उगाकर रखें।</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {advisoryStep === "manure" && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="relative rounded-2xl overflow-hidden h-[110px] border border-slate-850 shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600" 
                          alt="Manure Fertilizers" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover brightness-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-3">
                          <span className="text-[8px] bg-amber-500 text-slate-950 p-0.5 px-2 font-sans font-extrabold uppercase rounded-full w-max mb-1">चरण 03 • बेसल खाद पोषण</span>
                          <h4 className="text-xs font-sans font-black text-white leading-tight">रासायनिक उर्वरक एवं गोबर जैविक खाद खुराक</h4>
                        </div>
                      </div>

                      {/* Manure dynamic Dose calculation report */}
                      <div className="bg-gradient-to-r from-teal-950/20 to-slate-900 border border-teal-900/30 p-3 rounded-2xl text-left space-y-2">
                        <div className="flex justify-between items-center border-b border-slate-800/50 pb-1.5 mb-1.5">
                          <span className="text-[9.5px] font-black text-emerald-400 uppercase tracking-widest block">🧪 {advisoryAcres} एकड़ सुरक्षा पोषण गणना</span>
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 p-0.5 px-1.5 rounded-md font-extrabold font-sans">बेसल डोज़</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[9px] font-sans">
                          <div className="p-1 px-2.5 bg-slate-950/55 rounded-xl border border-slate-850">
                            <span className="text-slate-400 block text-[8px] uppercase">गोबर खाद (Compost):</span>
                            <span className="text-xs font-bold text-white">{(12 * advisoryAcres)} से {(15 * advisoryAcres)} टन</span>
                          </div>
                          <div className="p-1 px-2.5 bg-slate-950/55 rounded-xl border border-slate-850">
                            <span className="text-slate-400 block text-[8px] uppercase">रासायनिक D.A.P खाद:</span>
                            <span className="text-xs font-bold text-white">{(50 * advisoryAcres)} कि.ग्रा. <span className="text-[8.5px] font-normal text-slate-450">({advisoryAcres} बोरी)</span></span>
                          </div>
                          <div className="p-1 px-2.5 bg-slate-950/55 rounded-xl border border-slate-850">
                            <span className="text-slate-400 block text-[8px] uppercase">जैविक उर्वरक पाउडर:</span>
                            <span className="text-xs font-bold text-white">{(5 * advisoryAcres)} किलो</span>
                          </div>
                          <div className="p-1 px-2.5 bg-slate-950/55 rounded-xl border border-slate-850">
                            <span className="text-slate-400 block text-[8px] uppercase">पोटाश (MOP) रासायनिक:</span>
                            <span className="text-xs font-bold text-white">{(25 * advisoryAcres)} किलो</span>
                          </div>
                        </div>
                        <div className="pt-1 text-[8.5px] text-slate-400 font-sans leading-normal">
                          🌾 <strong className="text-emerald-400">ट्राइकोडर्मा व स्यूडोमोनास: </strong> {(2 * advisoryAcres)} कि.ग्रा. प्रत्येक को गोबर खाद के साथ मिलाकर 7 दिन पूर्व सक्रिय करने रखें।
                        </div>
                      </div>

                      <div className="bg-[#0b1220] border border-slate-850 rounded-2xl p-3 text-left space-y-1.5">
                        <span className="text-[10px] font-black text-slate-400 tracking-wider block">📋 खाद प्रयोग करने की सही बही-विधि:</span>
                        <p className="text-[9.5px] font-sans text-slate-300 leading-relaxed">
                          गोबर खाद (FYM) पूर्णतः सड़ी हुई होनी चाहिए। ट्राइकोडर्मा और बायोफर्टिलाइज़र मिलाकर छायादार गीली बोरी से ढकें। अंतिम जुताई के समय ही डीएपी, गोबर मिश्रण और पोटोश को मिट्टी में समतल फैलाकर जूताई करें।
                        </p>
                      </div>
                    </div>
                  )}

                  {advisoryStep === "protection" && (
                    <div className="space-y-4.5 animate-fadeIn text-left">
                      
                      {/* Image header */}
                      <div className="relative rounded-2xl overflow-hidden h-[110px] border border-slate-850 shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600" 
                          alt="Spraying plants" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover brightness-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-3">
                          <span className="text-[8px] bg-red-650 text-white p-0.5 px-2 font-sans font-extrabold uppercase rounded-full w-max mb-1">चरण 04 • क्रॉप केयर</span>
                          <h4 className="text-xs font-sans font-black text-white leading-tight">सुरक्षित रासायनिक स्प्रे तथा जैविक नियंत्रण</h4>
                        </div>
                      </div>

                      {/* Section 1: Nursery Stage pests */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center border-b border-slate-850 pb-1">
                          <span className="text-[10.5px] font-black text-emerald-400 uppercase tracking-wider block">🌱 नर्सरी अवस्था कीट व सुरक्षा</span>
                          <span className="text-[8.5px] text-slate-500 font-sans">0 से 30 दिन की पौध</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-[9.5px]">
                          <div className="bg-slate-900/40 border border-slate-800 p-2.5 rounded-xl space-y-1 hover:border-emerald-500/20 transition-all font-sans">
                            <span className="text-[10px] font-black text-white block">🦗 वाइट फ्लाई (सफेद मक्खी)</span>
                            <p className="text-slate-400 text-[8.5px] leading-relaxed">
                              <strong>नुकसान:</strong> पत्ते सिकुड़ना व रस चूसना।<br/>
                              <strong>उपचार:</strong> पीला चिपचिपा जाल (10/एकड़) लगाएं।
                            </p>
                          </div>

                          <div className="bg-slate-900/40 border border-slate-800 p-2.5 rounded-xl space-y-1 hover:border-emerald-500/20 transition-all font-sans">
                            <span className="text-[10px] font-black text-white block">🦟 एपिड्स / माहो कीट</span>
                            <p className="text-slate-400 text-[8.5px] leading-relaxed">
                              <strong>नुकसान:</strong> कोमल तनों का रस चूसना।<br/>
                              <strong>उपचार:</strong> नीम तेल (3 मिली प्रति लीटर पानी) छिड़कें।
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Active Growth Stage Pests & Diseases */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center border-b border-slate-850 pb-1">
                          <span className="text-[10.5px] font-black text-indigo-400 uppercase tracking-wider block">🌿 वृद्धि अवस्था रोग व उपचार</span>
                          <span className="text-[8.5px] text-slate-500 font-sans">रोपाई के उपरांत वयस्क फसल</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-[9.5px]">
                          <div className="bg-[#0b1220] border border-slate-850 p-2.5 rounded-xl space-y-1 hover:border-indigo-500/20 transition-all font-sans">
                            <span className="text-[10px] font-black text-white block">🍂 जड़ सड़न फफूंद (Root Rot)</span>
                            <p className="text-slate-400 text-[8.5px] leading-relaxed">
                              <strong>नुकसान:</strong> पौधा मुरझना, तना सड़ना।<br/>
                              <strong>उपचार:</strong> ट्राइकोडर्मा विरिडी की जड़ों में ड्रेन्चिंग करें।
                            </p>
                          </div>

                          <div className="bg-[#0b1220] border border-slate-850 p-2.5 rounded-xl space-y-1 hover:border-indigo-500/20 transition-all font-sans">
                            <span className="text-[10px] font-black text-white block">🐛 थ्रिप्स कीट आक्रमण</span>
                            <p className="text-slate-400 text-[8.5px] leading-relaxed">
                              <strong>नुकसान:</strong> पत्ते ऊपर कपनुमा मुड़ना।<br/>
                              <strong>उपचार:</strong> नीला चिपचिपा जाल लगाएं व पिनोसैड स्प्रे करें।
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Health / Spraye precaution info line */}
                      <div className="bg-red-950/20 border border-red-900/30 p-2.5 rounded-xl text-left font-sans flex items-center space-x-2">
                        <span className="text-sm">⚠️</span>
                        <p className="text-[8.5px] text-rose-300 leading-normal">
                          <strong>स्प्रे सुरक्षा:</strong> कीटनाशक स्प्रे करते समय सदा हवा के बहाव की तरफ चलें व चबाना/धूम्रपान निषेध रखें। दस्तानों का प्रयोग अवश्य करें।
                        </p>
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                /* ==========================================
                   ℹ️ CASE 2: APP INFO (PREVIOUS LANDING VIEW)
                   ========================================== */
                <div className="space-y-4 animate-fadeIn text-left">
                  <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60 font-sans space-y-1.5">
                    <span className="text-[11px] font-black tracking-wider text-emerald-400 uppercase">🛡️ सुरक्षित डेटा प्रणाली</span>
                    <p className="text-[9.5px] text-slate-300 leading-normal">
                      कृषिडायरी एक पूर्ण सुरक्षित एवं समेकित लेखा-जोखा बही-खाता पोर्टल है। यह स्थानीय और क्लाउड बैकअप के माध्यम से किसानों के वित्तीय डेटा व फसल रिकॉर्ड को सुरक्षित रखता है।
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[11px] font-black tracking-widest text-emerald-400 uppercase">🌟 कुल 3 मुख्य सुरक्षित फोल्डर्स:</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/50 hover:border-emerald-500/25 transition-all">
                        <div className="text-[11px] font-bold text-white mb-1">📁 प्रबंधन फोल्डर (Management)</div>
                        <p className="text-[9.5px] text-slate-400 leading-normal font-sans">
                          इसके भीतर 6 मुख्य क्रियाएं हैं: <strong className="text-slate-200">आय, व्यय, खाद, बीज, कीटनाशक</strong> एवं <strong className="text-slate-250">लेबर बही</strong> का पृथक और सटीक अंकन।
                        </p>
                      </div>

                      <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/50 hover:border-emerald-500/25 transition-all">
                        <div className="text-[11px] font-bold text-white mb-1">📁 प्रोफ़ाइल प्रबंधन (Profiles)</div>
                        <p className="text-[9.5px] text-slate-400 leading-normal font-sans">
                          इसके भीतर 3 मुख्य क्रियाएं हैं: <strong className="text-slate-200">किसान बही, खेत (रकबा एकड़) विवरण,</strong> एवं खरीदी-बिक्री करने वाले <strong className="text-slate-200">व्यापारियों का पंजीकरण</strong>।
                        </p>
                      </div>

                      <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/50 hover:border-emerald-500/25 transition-all col-span-1 sm:col-span-2">
                        <div className="text-[11px] font-bold text-white mb-1">📁 रिपोर्ट फोल्डर (Reports Logs)</div>
                        <p className="text-[9.5px] text-slate-400 leading-normal font-sans">
                          इसके भीतर 4 मुख्य क्रियाएं हैं: <strong className="text-slate-250">समेकित रिपोर्ट, खेतवार व्यय ROI विश्लेषण,</strong> और संपूर्ण <strong className="text-slate-250">सुरक्षा ऑडिट</strong> व गतिविधि ट्रैकिंग।
                        </p>
                      </div>

                      <div className="bg-[#0f172a] p-3 rounded-2xl border border-slate-800 flex items-center space-x-2 col-span-1 sm:col-span-2">
                        <span className="text-lg animate-bounce">🎙️</span>
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-200">स्मार्ट वॉयस डिक्टेशन (Voice Record)</h4>
                          <p className="text-[9px] text-slate-400 leading-normal font-sans">बोलकर खर्च या मंडी बिक्री सीधे दर्ज करें, सिस्टम स्वतः शब्दों से रिकॉर्ड जोड़ लेगा और सही फोल्डर में दर्ज कर देगा!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Login/Signup Bottom Sticky Bar */}
              <div className="pt-3 border-t border-slate-900 space-y-3">
                <div className="bg-emerald-950/25 border border-emerald-900/35 p-2.5 rounded-2xl text-center">
                  <p className="text-[10px] font-sans text-emerald-400 font-semibold leading-normal">
                    🔒 प्रबंधन और अन्य फोल्डर का उपयोग करने हेतु कृषक लॉगिन अनिवार्य है। नीचे दिए गए बटनों से त्वरित <span className="font-extrabold text-white">लॉगिन</span> अथवा <span className="font-extrabold text-white">साइन-अप</span> करें।
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => {
                      setAuthType("login");
                      setLoginError(null);
                      setAuthFeedback("");
                      setIsLoginModalOpen(true);
                    }}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-[11px] font-sans font-extrabold cursor-pointer text-center hover:shadow-lg shadow-md transition-all active:scale-95 border-0"
                  >
                    🔐 लॉगिन करें (Email ID)
                  </button>
                  <button
                    onClick={() => {
                      setAuthType("register");
                      setLoginError(null);
                      setAuthFeedback("");
                      setIsLoginModalOpen(true);
                    }}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl text-[11px] font-sans font-bold cursor-pointer text-center transition-all active:scale-95"
                  >
                    📝 नया कृषक खाता बनाएं (रजिस्टर)
                  </button>
                </div>

                <div className="text-center">
                  <button 
                    onClick={handleGuestLogin}
                    className="text-[9.5px] text-slate-500 hover:text-slate-400 font-black underline transition-all bg-transparent border-0 cursor-pointer"
                  >
                    अतिथि (Guest Visitor) के रूप में सीधे स्थानीय मोड में देखें
                  </button>
                </div>
              </div>

            </div>
          )
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
                  if (["income", "expense", "fertilizer", "seed", "pesticide", "labor", "stock_management"].includes(activeApp || "")) {
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
                  {activeApp === "folder_my_profile" && "👤 मेरी प्रोफाइल"}
                  {activeApp === "folder_reports" && "📁 रिपोर्ट"}
                  {activeApp === "income" && "💰 आय प्रबंधन"}
                  {activeApp === "expense" && "📈 व्यय प्रबंधन"}
                  {activeApp === "fertilizer" && "📦 खाद प्रबंधन"}
                  {activeApp === "seed" && "🌱 बीज प्रबंधन"}
                  {activeApp === "pesticide" && "💊 दवा प्रबंधन"}
                  {activeApp === "labor" && "👥 लेबर प्रबंधन"}
                  {activeApp === "stock_management" && "📦 स्टॉक प्रबंधन"}
                  {activeApp === "farmers" && "🌾 पंजीकृत किसान बही"}
                  {activeApp === "calculator" && "⚖️ मंडी तौल कैलकुलेटर"}
                  {activeApp === "rates" && "📈 मंडी दैनिक भाव"}
                  {activeApp === "audits" && "🕵️ कृषि सुरक्षा लॉग"}
                  {activeApp === "farm_management" && "🗺️ खेत प्रबंधन"}
                  {activeApp === "crop_management" && "🌱 फसल पंजीकरण"}
                  {activeApp === "fertilizer_management" && "📦 खाद ब्रांड पंजीकरण"}
                  {activeApp === "pesticide_management" && "💊 दवा ब्रांड पंजीकरण"}
                  {activeApp === "merchant_management" && "🤝 व्यापारी प्रबंधन"}
                  {activeApp === "consolidated_report" && "📊 समेकित रिपोर्ट"}
                  {activeApp === "farm_plot_report" && "🗺️ खेतवार रिपोर्ट"}
                  {activeApp === "income_report" && "📈 आय विश्लेषण रिपोर्ट"}
                  {activeApp === "expense_report" && "📉 व्यय विश्लेषण रिपोर्ट"}
                </span>
                <span className="text-[8.5px] text-slate-400 font-sans block mt-0.5">कृषि प्रबंधन प्लेटफ़ॉर्म</span>
              </div>

              {/* Action Buttons inside App Headers */}
              {["income", "expense", "fertilizer", "seed", "pesticide", "labor", "farmers", "farm_management", "crop_management", "merchant_management", "fertilizer_management", "pesticide_management"].includes(activeApp || "") ? (
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

                    {/* Item 7: स्टॉक प्रबंधन */}
                    <button
                      onClick={() => setActiveApp("stock_management")}
                      className="p-4 bg-white border border-slate-100 hover:border-amber-305 hover:bg-amber-50/20 active:bg-amber-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none col-span-2"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-amber-600 to-amber-500 rounded-xl shadow border border-amber-550 flex items-center justify-center">
                        <Boxes className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <span className="text-xs font-black text-slate-900 block font-sans">📦 स्टॉक प्रबंधन</span>
                          <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">खाद, बीज एंव दवा स्टॉक</span>
                        </div>
                        <span className="bg-amber-100 text-amber-800 font-black text-[9px] px-2 py-0.5 rounded-full uppercase leading-normal">
                          स्टॉक रिपोर्ट {stockList.length}
                        </span>
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

                    {/* Item 3: खाद प्रबंधन */}
                    <button
                      onClick={() => setActiveApp("fertilizer_management")}
                      className="p-4 bg-white border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/20 active:bg-indigo-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl shadow border border-indigo-500/15 flex items-center justify-center">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">खाद प्रबंधन</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">उर्वरक/खाद ब्रांड पंजीकरण</span>
                      </div>
                    </button>

                    {/* Item 4: दवा प्रबंधन */}
                    <button
                      onClick={() => setActiveApp("pesticide_management")}
                      className="p-4 bg-white border border-slate-100 hover:border-pink-305 hover:bg-pink-50/20 active:bg-pink-50 rounded-[24px] shadow-sm hover:shadow transition-all text-left flex flex-col space-y-3 cursor-pointer outline-none"
                    >
                      <div className="p-2.5 w-10 h-10 bg-gradient-to-tr from-pink-600 to-rose-550 rounded-xl shadow border border-pink-500/15 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block font-sans">दवा प्रबंधन</span>
                        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 block leading-tight">कीटनाशक एवं सुरक्षा दवा सूची</span>
                      </div>
                    </button>

                    {/* Item 5: व्यापारी प्रबंधन */}
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
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[10px] text-emerald-800 flex justify-between items-center">
                        <span>🌾 {editingTransactionId ? "संपादित करें (Editing Product sale record)" : "फ़सल उपज बिक्री, मंडी कमीशन या अन्य प्रकार की आय जोड़ने का आसान प्रपत्र।"}</span>
                        {editingTransactionId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTransactionId(null);
                              setShowAddForm(false);
                            }}
                            className="bg-rose-600 text-white text-[9.5px] font-black px-2 py-0.5 rounded cursor-pointer shrink-0"
                          >
                            रद्द करें
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block select-none">🗺️ खेत चुनें (Select Farm Plot)</label>
                        <MultiSelectFarmDropdown
                          allPlots={allPlots}
                          selectedFarmIdString={incomeForm.farmId}
                          onChange={(farmId, farmerId, crops) => {
                            setIncomeForm(prev => ({
                              ...prev,
                              farmId,
                              farmerId,
                              crop: crops
                            }));
                          }}
                          onQuickAdd={() => {
                            triggerQuickAdd("farm", (newPlotId) => {
                              setTimeout(() => {
                                const plot = allPlots.find(p => p.id === newPlotId);
                                if (plot) {
                                  setIncomeForm(prevIncome => {
                                    const currentIds = prevIncome.farmId ? prevIncome.farmId.split(",").filter(Boolean) : [];
                                    const nextIds = Array.from(new Set([...currentIds, newPlotId]));
                                    return {
                                      ...prevIncome,
                                      farmId: nextIds.join(","),
                                      farmerId: plot.farmerId,
                                      crop: plot.activeCrop
                                    };
                                  });
                                }
                              }, 100);
                            });
                          }}
                        />
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
                            {registeredCrops.map((c) => (
                              <option key={c.id} value={`${c.name} (${c.variety})`}>{c.name} ({c.variety})</option>
                            ))}
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
                        <label htmlFor="isMandiSale" className="font-black text-rose-800 cursor-pointer text-xs select-none">
                          🏪 मंडी माल बिकावली विवरण है? (तौल व काट गणना ऑन करें)
                        </label>
                      </div>

                      {incomeForm.isMandiSale ? (
                        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-250/60 grid grid-cols-2 gap-3 animate-fadeIn">
                          {/* Trader selection dropdown with Anya */}
                          <div className="space-y-1 col-span-2">
                            <label className="font-extrabold text-amber-900 block text-[10px]">व्यापारी चुनें (Choose Trader/Merchant) *</label>
                            <select
                              value={incomeForm.traderSelectMode === "anya" ? "ANYA" : incomeForm.traderName}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "ANYA") {
                                  setIncomeForm({ ...incomeForm, traderSelectMode: "anya", traderName: "" });
                                } else {
                                  setIncomeForm({ ...incomeForm, traderSelectMode: "existing", traderName: val });
                                }
                              }}
                              className="w-full bg-white border border-amber-200 rounded-xl p-2 outline-none text-slate-705 font-sans font-bold text-xs"
                            >
                              <option value="">-- व्यापारी का चयन करें --</option>
                              <option value="ANYA" className="text-emerald-700 font-extrabold bg-emerald-50">➕ अन्य (नया व्यापारी पंजीकृत करें)...</option>
                              {[...registeredMerchants]
                                .sort((a, b) => a.name.localeCompare(b.name, "hi"))
                                .map((m) => (
                                  <option key={m.id} value={m.name}>
                                    🏢 {m.name} {m.phone ? `(${m.phone})` : ""}
                                  </option>
                                ))
                              }
                            </select>
                          </div>

                          {incomeForm.traderSelectMode === "anya" && (
                            <div className="p-3 bg-white border border-amber-200 rounded-xl grid grid-cols-2 gap-2 col-span-2 animate-fadeIn font-sans">
                              <div className="space-y-1 col-span-1">
                                <label className="font-extrabold text-slate-700 block text-[10px]">व्यापारी का नाम (Name)</label>
                                <input
                                  type="text"
                                  value={incomeForm.tempTraderName}
                                  onChange={(e) => setIncomeForm({ ...incomeForm, tempTraderName: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold outline-none text-xs text-slate-705"
                                  placeholder="उदा. राजेश कुमार"
                                />
                              </div>
                              <div className="space-y-1 col-span-1">
                                <label className="font-extrabold text-slate-700 block text-[10px]">मोबाइल नंबर (Phone)</label>
                                <input
                                  type="text"
                                  value={incomeForm.tempTraderPhone}
                                  onChange={(e) => setIncomeForm({ ...incomeForm, tempTraderPhone: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold outline-none text-xs text-slate-705"
                                  placeholder="मंडी व्यापारी फोन"
                                />
                              </div>
                            </div>
                          )}

                          {/* Gross weight, Deduct KG, Rate per Quintal/KG, and Rate type selection */}
                          <div className="space-y-1 col-span-1 font-sans">
                            <label className="font-extrabold text-amber-900 block text-[10px]">कुल वजन (Gross Weight kg) *</label>
                            <input
                              type="number"
                              value={incomeForm.grossWeight}
                              onChange={(e) => setIncomeForm({ ...incomeForm, grossWeight: e.target.value })}
                              className="w-full bg-white border border-amber-200 rounded-xl p-2 font-black outline-none text-xs text-slate-705"
                              placeholder="उदा. 4500"
                              required
                            />
                          </div>

                          <div className="space-y-1 col-span-1 font-sans">
                            <label className="font-extrabold text-amber-900 block text-[10px]">तौल काट (Deduct Weight kg)</label>
                            <input
                              type="number"
                              value={incomeForm.deductKg}
                              onChange={(e) => setIncomeForm({ ...incomeForm, deductKg: e.target.value })}
                              className="w-full bg-white border border-amber-200 rounded-xl p-2 font-black outline-none text-xs text-slate-705"
                              placeholder="उदा. 45"
                            />
                          </div>

                          <div className="space-y-1 col-span-1 font-sans">
                            <label className="font-extrabold text-amber-900 block text-[10px]">भाव / रेट दर (Rate/Price) *</label>
                            <input
                              type="number"
                              value={incomeForm.amount}
                              onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                              className="w-full bg-white border border-amber-200 rounded-xl p-2 font-black outline-none text-xs text-slate-705"
                              placeholder="उदा. 2450"
                              required
                            />
                          </div>

                          <div className="space-y-1 col-span-1 font-sans">
                            <label className="font-extrabold text-amber-900 block text-[10px]">भाव की इकाई (Rate Basis)</label>
                            <select
                              value={incomeForm.rateType}
                              onChange={(e) => setIncomeForm({ ...incomeForm, rateType: e.target.value as any })}
                              className="w-full bg-white border border-amber-200 rounded-xl p-2 outline-none font-black text-xs text-slate-705"
                            >
                              <option value="quintal">प्रति क्विंटल (Per Quintal)</option>
                              <option value="kg">प्रति किग्रा (Per Kg)</option>
                            </select>
                          </div>

                          {/* Instant live calculation preview cards */}
                          {(() => {
                            const { netWeight, calculatedAmount: netAmount } = computeMandiCalculation(
                              incomeForm.grossWeight,
                              incomeForm.deductKg,
                              incomeForm.amount,
                              incomeForm.rateType
                            );
                            return (
                              <div className="col-span-2 p-3 bg-amber-100 rounded-2xl border border-amber-200/80 text-[11px] leading-relaxed space-y-1.5 text-amber-955 font-sans">
                                <div className="flex justify-between font-bold">
                                  <span>शुद्ध वजन (Net Weight):</span>
                                  <span className="text-slate-900 font-mono">{netWeight.toLocaleString()} किग्रा</span>
                                </div>
                                <div className="flex justify-between font-black text-xs text-rose-800 border-t border-amber-200/50 pt-1">
                                  <span>अनुमानित कुल शुद्ध आय:</span>
                                  <span className="font-mono">₹{Math.round(netAmount).toLocaleString()}</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        /* Normal income selection fields */
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-2 gap-3 animate-fadeIn font-sans">
                          <div className="space-y-1 col-span-1">
                            <label className="font-extrabold text-slate-705 block text-[10px]">कुल आवक / आय राशि (Amount) *</label>
                            <input
                              type="number"
                              value={incomeForm.amount}
                              onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                              className="w-full bg-white border border-slate-250 rounded-xl p-2 font-black focus:ring-emerald-500 outline-none text-xs text-slate-705"
                              placeholder="उदा. 45000"
                              required
                            />
                          </div>
                          <div className="space-y-1 col-span-1">
                            <label className="font-extrabold text-slate-705 block text-[10px]">विवरण / श्रेणी (Category)</label>
                            <select
                              value={incomeForm.category}
                              onChange={(e) => setIncomeForm({ ...incomeForm, category: e.target.value })}
                              className="w-full bg-white border border-slate-250 rounded-xl p-2 font-black outline-none text-xs text-slate-705"
                            >
                              <option value="crop_sale">🌾 फसल उपज बिक्री</option>
                              <option value="subsidy">🏛️ सरकारी सब्सिडी / मुआवजा</option>
                              <option value="rent">🚜 कृषि यंत्र किराया आय</option>
                              <option value="other">📦 अन्य विविध कृषि आय</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Common Credit Checkbox for Income form */}
                      <div className="flex items-center space-x-2.5 p-1 font-sans">
                        <input
                          type="checkbox"
                          id="isCreditSaleIncome"
                          checked={incomeForm.isCreditSale}
                          onChange={(e) => setIncomeForm({ ...incomeForm, isCreditSale: e.target.checked })}
                          className="w-4 h-4 text-emerald-650 border-slate-350 rounded focus:ring-emerald-500 cursor-pointer"
                        />
                        <label htmlFor="isCreditSaleIncome" className="font-black text-rose-800 cursor-pointer text-xs select-none">
                          💳 क्या कुछ भुगतान उधारी/शेष है? (Credit/Partially Paid)
                        </label>
                      </div>

                      {incomeForm.isCreditSale && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl grid grid-cols-2 gap-3 animate-fadeIn font-sans">
                          <div className="space-y-1 col-span-1">
                            <label className="font-extrabold text-rose-900 block text-[10px]">शेष बकाया उधारी राशि *</label>
                            <input
                              type="number"
                              value={incomeForm.pendingAmount}
                              onChange={(e) => setIncomeForm({ ...incomeForm, pendingAmount: e.target.value })}
                              className="w-full bg-white border border-rose-200 rounded-xl p-2 font-bold text-xs text-rose-900 outline-none"
                              placeholder="बकाया रकम"
                              required
                            />
                          </div>
                          <div className="space-y-1 col-span-1">
                            <label className="font-extrabold text-rose-900 block text-[10px]">भुगतान नियत तिथि (Due Date) *</label>
                            <input
                              type="date"
                              value={incomeForm.dueDate}
                              onChange={(e) => setIncomeForm({ ...incomeForm, dueDate: e.target.value })}
                              className="w-full bg-white border border-rose-200 rounded-xl p-2 font-sans font-bold text-xs text-rose-900 outline-none"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <button type="submit" className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 {editingTransactionId ? "आय विवरण अद्यतन (Update) करें" : "नया आय विवरण दर्ज करें"}
                      </button>
                    </form>
                  ) : (
                    /* Searchable/Filterable Income List View */
                    <div className="space-y-2.5 animate-fadeIn font-sans">
                      {transactions.filter(t => t.type === "income").length > 0 ? (
                        transactions.filter(t => t.type === "income").map((t) => {
                          const farUser = farmers.find(f => f.id === t.farmerId);
                          return (
                            <div key={t.id} className="bg-white border border-slate-150 p-3.5 rounded-2xl relative space-y-1.5 shadow-sm">
                              <div className="flex justify-between items-start">
                                <div>
                                  <strong className="text-xs block text-slate-850 font-black">{farUser?.name || "अज्ञात किसान"}</strong>
                                  <span className="text-[10px] text-slate-400 block font-normal leading-tight mt-0.5">
                                    📍 ग्राम: {farUser?.village} | फ़सल: {t.crop}
                                  </span>
                                </div>
                                <span className="font-mono text-emerald-800 font-extrabold text-[12px] bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl">
                                  +₹{t.amount.toLocaleString()}
                                </span>
                              </div>

                              <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-xl flex flex-col space-y-0.5">
                                <div className="flex justify-between">
                                  <span>विवरण / श्रेणी:</span>
                                  <span className="font-bold">{t.category === "crop_sale" ? "🌾 फसल उपज बिक्री" : t.category === "subsidy" ? "🏛️ सरकारी सब्सिडी/मुआवजा" : t.category === "rent" ? "🚜 कृषि यंत्र किराया" : "📦 अन्य विविध आय"}</span>
                                </div>
                                {t.isMandiSale && (
                                  <>
                                    <div className="flex justify-between">
                                      <span>मंडी व्यापारी:</span>
                                      <span className="font-bold text-amber-900">🏢 {t.traderName || "अज्ञात"}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                      <span>वजन विवरण:</span>
                                      <span>कुल: {t.grossWeight}kg | काट: {t.deductKg}kg</span>
                                    </div>
                                  </>
                                )}
                                {t.isCreditSale && (
                                  <div className="flex justify-between text-rose-700 bg-rose-50/50 p-1.5 mt-1 rounded-lg">
                                    <span>बकाया उधारी राशि:</span>
                                    <span className="font-extrabold">₹{(t.pendingAmount || 0).toLocaleString()} (भुगतान तिथि: {t.dueDate})</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between border-t border-slate-100 pt-1.5 text-[9.5px]">
                                <span className="text-slate-400 font-mono">दिनांक: {t.date}</span>
                                <div className="flex items-center space-x-3">
                                  <button onClick={() => {
                                    setEditingTransactionId(t.id);
                                    const netW = Math.max(1, Number(t.grossWeight || 0) - Number(t.deductKg || 0));
                                    const computedRate = t.rateType === "kg" ? (t.amount / netW) : ((t.amount * 100) / netW);
                                    setIncomeForm({
                                      farmerId: t.farmerId || "",
                                      farmId: t.farmId || "",
                                      crop: t.crop || "",
                                      amount: String(t.isMandiSale ? Math.round(computedRate) : t.amount),
                                      category: t.category || "crop_sale",
                                      date: t.date || new Date().toISOString().split("T")[0],
                                      isMandiSale: !!t.isMandiSale,
                                      grossWeight: t.grossWeight ? String(t.grossWeight) : "",
                                      deductKg: t.deductKg ? String(t.deductKg) : "0",
                                      rateType: t.rateType || "quintal",
                                      deductionRate: String(t.deductionRate || "2"),
                                      traderName: t.traderName || "",
                                      isCreditSale: !!t.isCreditSale,
                                      dueDate: t.dueDate || "",
                                      pendingAmount: t.pendingAmount ? String(t.pendingAmount) : "",
                                      traderSelectMode: "existing",
                                      tempTraderName: "",
                                      tempTraderPhone: "",
                                      paymentStatus: t.paymentStatus || "paid"
                                    });
                                    setShowAddForm(true);
                                  }} className="text-emerald-700 hover:text-emerald-955 font-bold cursor-pointer">
                                    संपादित करें ✏️
                                  </button>
                                  <button onClick={() => {
                                    showConfirm(
                                      "आय रिकॉर्ड हटाएं ⚠️",
                                      "क्या आप वाकई इस फसल बिक्री/आय रिकॉर्ड को हटाना चाहते हैं?",
                                      () => deleteTransaction(t.id)
                                    );
                                  }} className="text-rose-650 hover:text-rose-800 font-bold cursor-pointer">
                                    हटाएं 🗑️
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[10.5px] text-slate-400 text-center py-12 italic">कोई फसल बिक्री / आय विवरण उपलब्ध नहीं है।</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* === APP 2: व्यय प्रबंधन WINDOW === */}
              {activeApp === "expense" && (
                <>
                  {showAddForm ? (
                    <form onSubmit={handleRegisterExpense} className="space-y-3.5 animate-fadeIn font-sans">
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-[10px] text-rose-805 leading-normal">
                        ⛽ ट्रैक्टर जुताई, डीजल, सामान्य मजदूरी या अन्य कृषि सम्बंधित व्यय दर्ज करने की सरल प्रणाली।
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block select-none">🗺️ खेत चुनें (Select Farm Plot)</label>
                        <MultiSelectFarmDropdown
                          allPlots={allPlots}
                          selectedFarmIdString={expenseForm.farmId}
                          onChange={(farmId, farmerId, crops) => {
                            setExpenseForm(prev => ({
                              ...prev,
                              farmId,
                              farmerId,
                              crop: crops
                            }));
                          }}
                          onQuickAdd={() => {
                            triggerQuickAdd("farm", (newPlotId) => {
                              setTimeout(() => {
                                const plot = allPlots.find(p => p.id === newPlotId);
                                if (plot) {
                                  setExpenseForm(prevExp => {
                                    const currentIds = prevExp.farmId ? prevExp.farmId.split(",").filter(Boolean) : [];
                                    const nextIds = Array.from(new Set([...currentIds, newPlotId]));
                                    return {
                                      ...prevExp,
                                      farmId: nextIds.join(","),
                                      farmerId: plot.farmerId,
                                      crop: plot.activeCrop
                                    };
                                  });
                                }
                              }, 100);
                            });
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">फ़सल प्रकार (Crop)</label>
                          <select
                            value={expenseForm.crop}
                            onChange={(e) => setExpenseForm({ ...expenseForm, crop: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-705 font-bold outline-none cursor-not-allowed"
                            disabled
                          >
                            <option value="">-- स्वतः चयनित --</option>
                            {registeredCrops.map((c) => (
                              <option key={c.id} value={`${c.name} (${c.variety})`}>{c.name} ({c.variety})</option>
                            ))}
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

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1 col-span-1">
                          <label className="font-extrabold text-slate-705 block">खर्च राशि (₹ Amount) *</label>
                          <input
                            type="number"
                            value={expenseForm.amount}
                            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold outline-none text-slate-705 text-xs"
                            placeholder="खर्च राशि (₹)"
                            required
                          />
                        </div>
                        <div className="space-y-1 col-span-1">
                          <label className="font-extrabold text-slate-705 block">खर्च श्रेणी (Category)</label>
                          <select
                            value={expenseForm.category}
                            onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold outline-none text-slate-705 text-xs"
                          >
                            <option value="diesel">⛽ डीजल एवं ईंधन</option>
                            <option value="machinery">🚜 जुताई व ट्रैक्टर व्यय</option>
                            <option value="seed">🌱 बीज खरीद व्यय</option>
                            <option value="fertilizer">📦 खाद/उर्वरक व्यय</option>
                            <option value="pesticide">🧪 कीटनाशक/दवा व्यय</option>
                            <option value="labor">👥 मजदूरी खर्च</option>
                            <option value="other">📦 अन्य विविध खर्च</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5 p-1">
                        <input
                          type="checkbox"
                          id="isCreditSaleExp"
                          checked={expenseForm.isCreditSale}
                          onChange={(e) => setExpenseForm({ ...expenseForm, isCreditSale: e.target.checked })}
                          className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500 cursor-pointer"
                        />
                        <label htmlFor="isCreditSaleExp" className="font-black text-rose-800 cursor-pointer text-xs select-none">
                          💳 क्या यह उधारी/क्रेडिट का सौदा है? (Deferred Payment)
                        </label>
                      </div>

                      {expenseForm.isCreditSale && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl grid grid-cols-2 gap-3 animate-fadeIn">
                          <div className="space-y-1 col-span-2">
                            <label className="font-extrabold text-rose-900 block text-[10px]">भुगतान नियत तिथि (Due Date) *</label>
                            <input
                              type="date"
                              value={expenseForm.dueDate}
                              onChange={(e) => setExpenseForm({ ...expenseForm, dueDate: e.target.value })}
                              className="w-full bg-white border border-rose-200 rounded-xl p-2 font-sans font-bold text-xs text-rose-900 outline-none"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <button type="submit" className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 {editingTransactionId ? "बदलाव सुरक्षित करें" : "नया सामान्य खर्च दर्ज करें"}
                      </button>
                    </form>
                  ) : (
                    /* Searchable/filterable expense list */
                    <div className="space-y-2.5 animate-fadeIn font-sans">
                      {transactions.filter(t => t.type === "expense").length > 0 ? (
                        transactions.filter(t => t.type === "expense").map((t) => {
                          const farUser = farmers.find(f => f.id === t.farmerId);
                          return (
                            <div key={t.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl relative space-y-1.5 shadow-sm">
                              <div className="flex justify-between items-start">
                                <div>
                                  <strong className="text-xs block text-slate-850 font-black">{farUser?.name || "अज्ञात किसान"}</strong>
                                  <span className="text-[9.5px] text-slate-400 block font-normal mt-0.5 animate-fadeIn">
                                    📍 ग्राम: {farUser?.village} | फ़सल: {t.crop} | खेत-क्षेत्र: {t.farmId?.split(",").map(id => allPlots.find(p => p.id === id)?.name || id).join(", ")}
                                  </span>
                                </div>
                                <span className="font-mono text-rose-805 font-extrabold text-[12px] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg whitespace-nowrap">
                                  -₹{t.amount.toLocaleString()}
                                </span>
                              </div>

                              <div className="text-[9.5px] text-slate-505 leading-relaxed bg-white p-2 rounded-xl border border-slate-100/80">
                                <strong>श्रेणी:</strong> {
                                  t.category === "diesel" ? "⛽ डीजल एवं ईंधन" :
                                  t.category === "machinery" ? "🚜 जुताई व ट्रैक्टर व्यय" :
                                  t.category === "seed" ? "🌱 बीज खरीद व्यय" :
                                  t.category === "fertilizer" ? "📦 खाद/उर्वरक व्यय" :
                                  t.category === "pesticide" ? "🧪 कीटनाशक/दवा व्यय" :
                                  t.category === "labor" ? "👥 मजदूरी खर्च" :
                                  "📦 अन्य विविध खर्च"
                                }
                                {t.isCreditSale && (
                                  <div className="text-rose-700 font-extrabold mt-0.5 bg-rose-50/40 p-1 rounded">
                                    📌 उधारी / देय बकाया | देय नियत समय: {t.dueDate || "N/A"}
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between border-t border-slate-100 pt-1.5 text-[9.5px]">
                                <span className="text-slate-400 font-mono font-bold">व्यय तिथि: {t.date}</span>
                                <div className="flex items-center space-x-3.5">
                                  <button onClick={() => {
                                    setEditingTransactionId(t.id);
                                    setExpenseForm({
                                      farmerId: t.farmerId || "",
                                      farmId: t.farmId || "",
                                      crop: t.crop || "",
                                      amount: String(t.amount),
                                      category: t.category || "diesel",
                                      date: t.date || new Date().toISOString().split("T")[0],
                                      isCreditSale: !!t.isCreditSale,
                                      dueDate: t.dueDate || ""
                                    });
                                    setShowAddForm(true);
                                  }} className="text-purple-700 hover:text-purple-900 font-bold block cursor-pointer">
                                    संपादित करें ✏️
                                  </button>
                                  <button onClick={() => {
                                    showConfirm(
                                      "खर्च हटाएं ⚠️",
                                      "क्या आप वाकई इस सामान्य व्यय विवरण को हटाना चाहते हैं?",
                                      () => deleteTransaction(t.id)
                                    );
                                  }} className="text-rose-650 hover:text-rose-805 block font-bold cursor-pointer">
                                    हटाएं 🗑️
                                  </button>
                                </div>
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
                        <MultiSelectFarmDropdown
                          allPlots={allPlots}
                          selectedFarmIdString={fertilizerForm.farmId}
                          onChange={(farmId, farmerId, crops) => {
                            setFertilizerForm(prev => ({
                              ...prev,
                              farmId,
                              farmerId,
                              crop: crops
                            }));
                          }}
                          onQuickAdd={() => {
                            triggerQuickAdd("farm", (newPlotId) => {
                              setTimeout(() => {
                                const plot = allPlots.find(p => p.id === newPlotId);
                                if (plot) {
                                  setFertilizerForm(prevFert => {
                                    const currentIds = prevFert.farmId ? prevFert.farmId.split(",").filter(Boolean) : [];
                                    const nextIds = Array.from(new Set([...currentIds, newPlotId]));
                                    return {
                                      ...prevFert,
                                      farmId: nextIds.join(","),
                                      farmerId: plot.farmerId,
                                      crop: plot.activeCrop
                                    };
                                  });
                                }
                              }, 100);
                            });
                          }}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">खाद का प्रकार (Fertilizer Brand)</label>
                        <select
                          value={fertilizerForm.fertilizerBrand}
                          onChange={(e) => {
                            if (e.target.value === "ADD_NEW") {
                              triggerQuickAdd("fertilizer", (newFert) => {
                                const matchedStock = stockList.find(s => 
                                  s.type === "fertilizer" && 
                                  (s.name.toLowerCase().trim() === newFert.toLowerCase().trim() || newFert.toLowerCase().includes(s.name.toLowerCase().trim()))
                                );
                                const matchedPrice = matchedStock?.pricePerUnit ? String(matchedStock.pricePerUnit) : fertilizerForm.costPerBag;
                                setFertilizerForm({...fertilizerForm, fertilizerBrand: newFert, costPerBag: matchedPrice});
                              });
                            } else {
                              const selectedVal = e.target.value;
                              const matchedStock = stockList.find(s => 
                                s.type === "fertilizer" && 
                                (selectedVal.toLowerCase().includes(s.name.toLowerCase().trim()) || s.name.toLowerCase().includes(selectedVal.toLowerCase().trim()))
                              );
                              const matchedPrice = matchedStock?.pricePerUnit ? String(matchedStock.pricePerUnit) : fertilizerForm.costPerBag;
                              setFertilizerForm({...fertilizerForm, fertilizerBrand: selectedVal, costPerBag: matchedPrice});
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold focus:ring-emerald-500 outline-none text-slate-800"
                        >
                          <option value="">-- खाद का चयन करें --</option>
                          {registeredFertilizers.map((f) => (
                            <option key={f.id} value={`${f.name} (${f.company})`}>{f.name} ({f.company})</option>
                          ))}
                          <option value="ADD_NEW" className="text-emerald-700 font-extrabold bg-emerald-50">➕ नया खाद उर्वरक पंजीकृत करें...</option>
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
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 font-bold cursor-not-allowed select-none text-slate-500 text-xs"
                          />
                          <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">✨ स्वतः चयनित</span>
                        </div>
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block"> छिड़काव / उपयोग तारीख</label>
                          <input
                            type="date"
                            value={fertilizerForm.date}
                            onChange={(e) => setFertilizerForm({...fertilizerForm, date: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50/50 hover:bg-slate-50 border border-dashed border-slate-200 p-3.5 rounded-2xl flex items-center justify-between transition-all">
                        <span className="text-[10.5px] text-slate-500">अनुमानित कुल लागत:</span>
                        <span className="font-mono font-black text-rose-800 text-sm">₹{(Number(fertilizerForm.bagsCount || 0) * Number(fertilizerForm.costPerBag || 0)).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center space-x-2 p-1">
                        <input
                          id="fertCredit"
                          type="checkbox"
                          checked={fertilizerForm.isCreditSale || false}
                          onChange={(e) => setFertilizerForm({ ...fertilizerForm, isCreditSale: e.target.checked })}
                          className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                        />
                        <label htmlFor="fertCredit" className="font-bold text-slate-705 cursor-pointer">
                          क्या यह खर्च उधारी / टाल पर लिया गया है?
                        </label>
                      </div>

                      {fertilizerForm.isCreditSale && (
                        <div className="space-y-1 p-3 bg-rose-50 rounded-2xl border border-rose-100 font-sans">
                          <label className="font-extrabold text-rose-800 block text-[10px]">भुगतान चुकाने की देय तिथि (Due Date)</label>
                          <input
                            type="date"
                            value={fertilizerForm.dueDate}
                            onChange={(e) => setFertilizerForm({ ...fertilizerForm, dueDate: e.target.value })}
                            className="w-full bg-white border border-rose-200 rounded-xl p-2 text-rose-800 font-sans font-bold"
                          />
                        </div>
                      )}

                      <button type="submit" className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
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
                                  <span className="text-[9.5px] text-slate-400 block font-normal">
                                    📍 ग्राम: {farUser?.village} | फ़सल: {t.crop} | क्षेत्र-खेत: {t.farmId?.split(",").map(id => allPlots.find(p => p.id === id)?.name || id).join(", ")}
                                  </span>
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
                                <button onClick={() => {
                                  showConfirm(
                                    "व्यय विवरण हटाएं ⚠️",
                                    "क्या आप वाकई इस खाद खर्च विवरण को हटाना चाहते हैं? यह प्रक्रिया अपरिवर्तनीय है!",
                                    () => deleteTransaction(t.id)
                                  );
                                }} className="text-rose-650 font-bold hover:text-rose-800 transition-all cursor-pointer">
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
                        <MultiSelectFarmDropdown
                          allPlots={allPlots}
                          selectedFarmIdString={seedForm.farmId}
                          onChange={(farmId, farmerId, crops) => {
                            setSeedForm(prev => ({
                              ...prev,
                              farmId,
                              farmerId,
                              crop: crops
                            }));
                          }}
                          onQuickAdd={() => {
                            triggerQuickAdd("farm", (newPlotId) => {
                              setTimeout(() => {
                                const plot = allPlots.find(p => p.id === newPlotId);
                                if (plot) {
                                  setSeedForm(prevSeed => {
                                    const currentIds = prevSeed.farmId ? prevSeed.farmId.split(",").filter(Boolean) : [];
                                    const nextIds = Array.from(new Set([...currentIds, newPlotId]));
                                    return {
                                      ...prevSeed,
                                      farmId: nextIds.join(","),
                                      farmerId: plot.farmerId,
                                      crop: plot.activeCrop
                                    };
                                  });
                                }
                              }, 100);
                            });
                          }}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">बीज प्रजाति (Seed Variety)</label>
                        <select
                          value={seedForm.seedVariety}
                          onChange={(e) => {
                            if (e.target.value === "ADD_NEW") {
                              triggerQuickAdd("crop", (newCrop) => {
                                const matchedStock = stockList.find(s => 
                                  s.type === "seed" && 
                                  (s.name.toLowerCase().trim() === newCrop.toLowerCase().trim() || newCrop.toLowerCase().includes(s.name.toLowerCase().trim()))
                                );
                                const price = matchedStock?.pricePerUnit || 0;
                                const weight = Number(seedForm.quantityKg || 0);
                                const totalCost = price * weight;
                                setSeedForm({...seedForm, seedVariety: newCrop, cost: totalCost > 0 ? String(totalCost) : seedForm.cost});
                              });
                            } else {
                              const selectedVal = e.target.value;
                              const matchedStock = stockList.find(s => 
                                s.type === "seed" && 
                                (selectedVal.toLowerCase().includes(s.name.toLowerCase().trim()) || s.name.toLowerCase().includes(selectedVal.toLowerCase().trim()))
                              );
                              const price = matchedStock?.pricePerUnit || 0;
                              const weight = Number(seedForm.quantityKg || 0);
                              const totalCost = price * weight;
                              setSeedForm({...seedForm, seedVariety: selectedVal, cost: totalCost > 0 ? String(totalCost) : seedForm.cost});
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold focus:ring-emerald-500 outline-none text-slate-800"
                        >
                          <option value="">-- बीज का चयन करें --</option>
                          {registeredCrops.map((c) => (
                            <option key={c.id} value={`${c.name} (${c.variety})`}>{c.name} ({c.variety}) - `{c.company}`</option>
                          ))}
                          <option value="ADD_NEW" className="text-emerald-700 font-extrabold bg-emerald-50">➕ नया बीज प्रोफाइल पंजीकृत करें...</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-extrabold text-slate-705 block">कुल वज़न (कि.ग्रा. / Weight in KG)</label>
                          <input
                            type="number"
                            value={seedForm.quantityKg}
                            onChange={(e) => {
                              const newQty = e.target.value;
                              const matchedStock = stockList.find(s => 
                                s.type === "seed" && 
                                (seedForm.seedVariety.toLowerCase().includes(s.name.toLowerCase().trim()) || s.name.toLowerCase().includes(seedForm.seedVariety.toLowerCase().trim()))
                              );
                              const price = matchedStock?.pricePerUnit || 0;
                              const totalCost = price * Number(newQty || 0);
                              setSeedForm({...seedForm, quantityKg: newQty, cost: totalCost > 0 ? String(totalCost) : seedForm.cost});
                            }}
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
                                  <span className="text-[9.5px] text-slate-400 block font-normal">
                                    📍 ग्राम: {farUser?.village} | फसल: {t.crop}
                                    {t.farmId && ` | खेत: ${t.farmId.split(",").map(id => allPlots.find(p => p.id === id)?.name || id).join(", ")}`}
                                  </span>
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
                                <button onClick={() => {
                                  showConfirm(
                                    "विवरण हटाएं ⚠️",
                                    "क्या आप वाकई इस बीज बोवाई व्यय विवरण को हटाना चाहते हैं?",
                                    () => deleteTransaction(t.id)
                                  );
                                }} className="text-rose-650 hover:text-rose-800 block scale-95 font-bold cursor-pointer">
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
                        <MultiSelectFarmDropdown
                          allPlots={allPlots}
                          selectedFarmIdString={pesticideForm.farmId}
                          onChange={(farmId, farmerId, crops) => {
                            setPesticideForm(prev => ({
                              ...prev,
                              farmId,
                              farmerId,
                              crop: crops
                            }));
                          }}
                          onQuickAdd={() => {
                            triggerQuickAdd("farm", (newPlotId) => {
                              setTimeout(() => {
                                const plot = allPlots.find(p => p.id === newPlotId);
                                if (plot) {
                                  setPesticideForm(prevPest => {
                                    const currentIds = prevPest.farmId ? prevPest.farmId.split(",").filter(Boolean) : [];
                                    const nextIds = Array.from(new Set([...currentIds, newPlotId]));
                                    return {
                                      ...prevPest,
                                      farmId: nextIds.join(","),
                                      farmerId: plot.farmerId,
                                      crop: plot.activeCrop
                                    };
                                  });
                                }
                              }, 100);
                            });
                          }}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">सलाह औषधि नाम (Pesticide Name)</label>
                        <select
                          value={pesticideForm.productName}
                          onChange={(e) => {
                            if (e.target.value === "ADD_NEW") {
                              triggerQuickAdd("pesticide", (newPesticide) => {
                                setPesticideForm({...pesticideForm, productName: newPesticide});
                              });
                            } else {
                              setPesticideForm({...pesticideForm, productName: e.target.value});
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-700 outline-none focus:ring-emerald-500"
                        >
                          <option value="">-- दवा का चयन करें --</option>
                          {registeredPesticides.map((p) => (
                            <option key={p.id} value={`${p.name} (${p.company})`}>{p.name} ({p.company})</option>
                          ))}
                          <option value="ADD_NEW" className="text-emerald-700 font-extrabold bg-emerald-50">➕ नयी दवा/कीटनाशक पंजीकृत करें...</option>
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
                                  <span className="text-[9.5px] text-slate-400 block font-normal">
                                    📍 ग्राम: {farUser?.village} | फसल: {t.crop}
                                    {t.farmId && ` | खेत: ${t.farmId.split(",").map(id => allPlots.find(p => p.id === id)?.name || id).join(", ")}`}
                                  </span>
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
                                <button onClick={() => {
                                  showConfirm(
                                    "लेनदेन हटाएं ⚠️",
                                    "क्या आप वाकई इस कीटनाशक व्यय रिकॉर्ड को हटाना चाहते हैं?",
                                    () => deleteTransaction(t.id)
                                  );
                                }} className="text-rose-650 hover:text-rose-800 scale-95 font-bold transition-all cursor-pointer">
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
                        <MultiSelectFarmDropdown
                          allPlots={allPlots}
                          selectedFarmIdString={laborFormState.farmId}
                          onChange={(farmId, farmerId, crops) => {
                            setLaborFormState(prev => ({
                              ...prev,
                              farmId,
                              farmerId,
                              crop: crops
                            }));
                          }}
                          onQuickAdd={() => {
                            triggerQuickAdd("farm", (newPlotId) => {
                              setTimeout(() => {
                                const plot = allPlots.find(p => p.id === newPlotId);
                                if (plot) {
                                  setLaborFormState(prevLabor => {
                                    const currentIds = prevLabor.farmId ? prevLabor.farmId.split(",").filter(Boolean) : [];
                                    const nextIds = Array.from(new Set([...currentIds, newPlotId]));
                                    return {
                                      ...prevLabor,
                                      farmId: nextIds.join(","),
                                      farmerId: plot.farmerId,
                                      crop: plot.activeCrop
                                    };
                                  });
                                }
                              }, 100);
                            });
                          }}
                        />
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
                        <div className="space-y-3 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-extrabold text-slate-700 block text-[10px]">मजदूरों की संख्या</label>
                              <input
                                type="number"
                                value={laborFormState.workersCount}
                                onChange={(e) => setLaborFormState({...laborFormState, workersCount: e.target.value})}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 outline-none font-bold text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-extrabold text-slate-700 block text-[10px]">टोली सरदार नाम</label>
                              <input
                                type="text"
                                value={laborFormState.groupName}
                                onChange={(e) => setLaborFormState({...laborFormState, groupName: e.target.value})}
                                placeholder="रामचरण जी..."
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 outline-none font-bold text-xs"
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
                              className="w-full bg-white border border-slate-200 rounded-xl p-2 outline-none font-bold text-xs"
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
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 font-bold cursor-not-allowed select-none text-slate-400 text-xs"
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
                                  <strong className="text-xs block text-slate-850 font-black">
                                    👤 {lab.mode === "individual" ? lab.laborerName : lab.groupName}
                                  </strong>
                                  <span className="text-[9px] text-slate-400 block mt-0.5">
                                    प्रबंधक: <strong className="text-slate-600">{correlatingFarmer?.name || "अज्ञात"}</strong>
                                  </span>
                                </div>
                                <span className="text-[8.5px] bg-violet-50 border border-violet-100 text-violet-800 font-extrabold px-2 py-0.5 rounded">
                                  {lab.mode === "individual" ? "DAILY LABOR" : `CONTRACTOR x${lab.workersCount}`}
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
                                <span className="text-slate-400 font-mono font-medium">
                                  दिनांक: {lab.date} | फसल: {lab.crop}
                                  {lab.farmId && ` | खेत: ${lab.farmId.split(",").map(id => allPlots.find(p => p.id === id)?.name || id).join(", ")}`}
                                </span>
                                <button onClick={() => {
                                  showConfirm(
                                    "हाजिरी रिकॉर्ड हटाएं ⚠️",
                                    "क्या आप वाकई इस लेबर हाजिरी / कार्य रिकॉर्ड को हटाना चाहते हैं?",
                                    () => deleteLabor(lab.id)
                                  );
                                }} className="text-rose-600 font-bold block scale-95 hover:text-rose-800 cursor-pointer">
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
                            onChange={(e) => {
                              if (e.target.value === "ADD_NEW") {
                                triggerQuickAdd("crop", (newCrop) => {
                                  setFarmerForm({...farmerForm, activeCrop: newCrop});
                                });
                              } else {
                                setFarmerForm({...farmerForm, activeCrop: e.target.value});
                              }
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800 outline-none"
                          >
                            <option value="">-- फसल का चयन करें --</option>
                            {registeredCrops.map((c) => (
                              <option key={c.id} value={`${c.name} (${c.variety})`}>{c.name} ({c.variety})</option>
                            ))}
                            <option value="ADD_NEW" className="text-emerald-700 font-extrabold bg-emerald-50">➕ नयी फसल पंजीकृत करें...</option>
                          </select>
                        </div>
                      </div>

                      <button type="submit" className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 नया किसान प्रोफाईल पंजीकृत करें
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
                          <div key={f.id} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-2 relative shadow-xs">
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
                              <button onClick={() => {
                                showConfirm(
                                  "किसान प्रोफाइल हटाएं ⚠️",
                                  `क्या वाकई किसान "${f.name}" की प्रोफाइल पूरी तरह हटाना चाहते हैं?`,
                                  () => deleteFarmer(f.id)
                                );
                              }} className="text-rose-600 hover:text-rose-800 text-[9.5px] font-bold cursor-pointer">
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

              {/* === APP 21: स्टॉक प्रबंधन WINDOW === */}
              {activeApp === "stock_management" && (
                <div className="space-y-4 animate-scaleIn font-sans">
                  <div className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2.5xl text-white shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    <h3 className="text-sm font-black flex items-center space-x-2">
                       <span>📦 रीयल-टाइम स्टॉक प्रबंधन</span>
                    </h3>
                    <p className="text-[10px] text-amber-50 mt-1 font-sans leading-relaxed">
                      यहाँ से खाद, बीज और कीटनाशकों के स्टॉक की निगरानी करें। किसी भी आइटम की कमी होने पर उसे तुरंत रीफिल करें।
                    </p>
                  </div>

                  {/* Stock Tab Menu */}
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setStockTab("list")}
                      className={`flex-1 text-center py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${stockTab === "list" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      आइटम सूची ({stockList.length})
                    </button>
                    <button
                      onClick={() => setStockTab("report")}
                      className={`flex-1 text-center py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${stockTab === "report" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-705"}`}
                    >
                      कैटेगरी रिपोर्ट
                    </button>
                  </div>

                  {stockTab === "list" ? (
                    <div className="space-y-4">
                      {/* Search and Filters */}
                      <div className="flex space-x-2 items-center">
                        <input
                          type="text"
                          placeholder="स्टॉक आइटम खोजें..."
                          value={stockSearch}
                          onChange={(e) => setStockSearch(e.target.value)}
                          className="flex-1 p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 outline-none leading-none"
                        />
                        <select
                          value={stockFilter}
                          onChange={(e) => setStockFilter(e.target.value as any)}
                          className="p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 outline-none leading-none bg-white font-sans"
                        >
                          <option value="all">सभी कैटेगरी</option>
                          <option value="fertilizer">खाद (Fertilizers)</option>
                          <option value="seed">बीज (Seeds)</option>
                          <option value="pesticide">कीटनाशक (Pesticides)</option>
                        </select>
                      </div>

                      {/* Add New Stock Item form */}
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2.5xl space-y-3">
                        <div className="flex justify-between items-center bg-amber-50 p-2 rounded-xl border border-amber-100">
                          <strong className="text-xs text-amber-900">➕ {selectedStockToRefill === "new" ? "नया स्टॉक आइटम जोड़ें" : "मौजूदा स्टॉक में मात्रा जोड़ें (Refill)"}</strong>
                        </div>

                        {/* Existing stock item dropdown selector */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-650 block font-sans">
                            स्टॉक प्रविष्टि प्रकार (Entry Type / Select Item)
                          </label>
                          <select
                            value={selectedStockToRefill}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedStockToRefill(val);
                              if (val !== "new") {
                                const found = stockList.find(s => s.id === val);
                                if (found) {
                                  setStockFormState({
                                    type: found.type,
                                    name: found.name,
                                    quantity: "",
                                    unit: found.unit,
                                    company: found.company
                                  });
                                }
                              } else {
                                setStockFormState({
                                  type: "fertilizer",
                                  name: "",
                                  quantity: "",
                                  unit: "बोरी",
                                  company: ""
                                });
                              }
                            }}
                            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:ring-1 focus:ring-amber-500 font-sans outline-none leading-none"
                          >
                            <option value="new">🆕 -- नया स्टॉक आइटम दर्ज करें --</option>
                            {stockList.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.type === "fertilizer" ? "🍁 खाद: " : s.type === "seed" ? "🌱 बीज: " : "💊 दवा: "} 
                                {s.name} ({s.company}) - वर्तमान स्टॉक: {s.quantity} {s.unit}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-650 block">आइटम का नाम</label>
                            <input
                              type="text"
                              placeholder="जैसे: यूरिया (Urea)"
                              value={stockFormState.name}
                              onChange={(e) => setStockFormState(prev => ({ ...prev, name: e.target.value }))}
                              disabled={selectedStockToRefill !== "new"}
                              className={`w-full p-2 border border-slate-200 rounded-lg text-xs font-sans ${selectedStockToRefill !== "new" ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "bg-white text-slate-800"}`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-650 block">कैटेगरी</label>
                            <select
                              value={stockFormState.type}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setStockFormState(prev => ({ 
                                  ...prev, 
                                  type: val,
                                  unit: val === "fertilizer" ? "कि.ग्राम" : (val === "seed" ? "कि.ग्राम" : "लीटर")
                                }));
                              }}
                              disabled={selectedStockToRefill !== "new"}
                              className={`w-full p-2 border border-slate-200 rounded-lg text-xs bg-white font-sans ${selectedStockToRefill !== "new" ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "bg-white text-slate-800"}`}
                            >
                              <option value="fertilizer">खाद (Fertilizer)</option>
                              <option value="seed">बीज (Seed)</option>
                              <option value="pesticide">कीटनाशक (Pesticide)</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-650 block">
                              {selectedStockToRefill === "new" ? "प्रारंभिक मात्रा" : "जोड़ने वाली मात्रा (+)"}
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={stockFormState.quantity}
                              onChange={(e) => setStockFormState(prev => ({ ...prev, quantity: e.target.value }))}
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs font-sans text-slate-800 bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-650 block font-sans">मात्रा इकाई</label>
                            <select
                              value={stockFormState.unit}
                              onChange={(e) => setStockFormState(prev => ({ ...prev, unit: e.target.value }))}
                              disabled={selectedStockToRefill !== "new"}
                              className={`w-full p-2 border border-slate-200 rounded-lg text-xs bg-white font-sans ${selectedStockToRefill !== "new" ? "bg-slate-100 text-slate-500" : "bg-white text-slate-800"}`}
                            >
                              {stockFormState.type === "fertilizer" && (
                                <>
                                  <option value="कि.ग्राम">कि.ग्राम</option>
                                  <option value="बोरी">बोरी</option>
                                  <option value="ग्राम">ग्राम</option>
                                </>
                              )}
                              {stockFormState.type === "seed" && (
                                <>
                                  <option value="कि.ग्राम">कि.ग्राम</option>
                                  <option value="ग्राम">ग्राम</option>
                                </>
                              )}
                              {stockFormState.type === "pesticide" && (
                                <>
                                  <option value="लीटर">लीटर</option>
                                  <option value="मिलीलीटर">मिलीलीटर</option>
                                  <option value="ग्राम">ग्राम</option>
                                  <option value="कि.ग्राम">कि.ग्राम</option>
                                </>
                              )}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-650 block">मूल्य / कीमत (₹ प्रति इकाई)</label>
                            <input
                              type="number"
                              placeholder="जैसे: 350"
                              value={stockFormState.pricePerUnit}
                              onChange={(e) => setStockFormState(prev => ({ ...prev, pricePerUnit: e.target.value }))}
                              disabled={selectedStockToRefill !== "new"}
                              className={`w-full p-2 border border-slate-200 rounded-lg text-xs font-sans ${selectedStockToRefill !== "new" ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "bg-white text-slate-800"}`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-650 block">निर्माता कंपनी</label>
                            <input
                              type="text"
                              placeholder="जैसे: इफको (IFFCO)"
                              value={stockFormState.company}
                              onChange={(e) => setStockFormState(prev => ({ ...prev, company: e.target.value }))}
                              disabled={selectedStockToRefill !== "new"}
                              className={`w-full p-2 border border-slate-200 rounded-lg text-xs font-sans ${selectedStockToRefill !== "new" ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "bg-white text-slate-800"}`}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const numQty = Number(stockFormState.quantity || 0);
                            if (numQty <= 0) {
                              alert("❌ कृपया सही और वैध प्रविष्टि संख्या दर्ज करें!");
                              return;
                            }

                            if (selectedStockToRefill !== "new") {
                              setStockList(prev => prev.map(s => {
                                if (s.id === selectedStockToRefill) {
                                  const finalQty = s.quantity + numQty;
                                  const log = {
                                    id: "hist_" + Date.now(),
                                    action: "refill" as const,
                                    quantityChange: numQty,
                                    finalQuantity: finalQty,
                                    operatorName: currentUser?.name || "मुख्य यूजर",
                                    date: new Date().toISOString(),
                                    details: `स्टॉक बढ़ाया गया: +${numQty} ${s.unit} जोड़ा गया।`
                                  };
                                  const updatedHistory = s.history ? [log, ...s.history] : [log];
                                  return { 
                                    ...s, 
                                    quantity: finalQty, 
                                    history: updatedHistory, 
                                    updatedAt: new Date().toISOString() 
                                  };
                                }
                                return s;
                              }));
                              logAudit("UPDATE_STOCK_ITEM", selectedStockToRefill, "farmers", `स्टॉक आइटम मात्रा बढ़ी: ${stockFormState.name}, जोड़ा: ${numQty} ${stockFormState.unit}`);
                              setSelectedStockToRefill("new");
                              alert("✅ मौजूदा स्टॉक में मात्रा सफलतापूर्वक जोड़ दी गई!");
                            } else {
                              if (!stockFormState.name) {
                                alert("❌ कृपया नए स्टॉक आइटम का नाम दर्ज करें!");
                                return;
                              }
                              const id = "stock_" + Date.now();
                              const log = {
                                id: "hist_" + Date.now(),
                                action: "create" as const,
                                quantityChange: numQty,
                                finalQuantity: numQty,
                                operatorName: currentUser?.name || "मुख्य यूजर",
                                date: new Date().toISOString(),
                                details: `${numQty} ${stockFormState.unit} प्रारंभिक मात्रा के साथ नया स्टॉक आइटम बनाया गया।`
                              };
                              const newItem = {
                                id,
                                type: stockFormState.type,
                                name: stockFormState.name,
                                quantity: numQty,
                                unit: stockFormState.unit || "कि.ग्राम",
                                pricePerUnit: Number(stockFormState.pricePerUnit) || 0,
                                company: stockFormState.company || "देशी",
                                updatedAt: new Date().toISOString(),
                                history: [log]
                              };
                              setStockList(prev => [...prev, newItem]);
                              logAudit("CREATE_STOCK_ITEM", id, "farmers", `नया स्टॉक आइटम जोड़ा: ${newItem.name}, मात्रा: ${newItem.quantity} ${newItem.unit}, मूल्य: ₹${newItem.pricePerUnit}/${newItem.unit}`);
                              alert("✅ नया स्टॉक आइटम सफलता पूर्वक जोड़ा गया!");
                            }

                            setStockFormState({
                              type: "fertilizer",
                              name: "",
                              quantity: "",
                              unit: "कि.ग्राम",
                              pricePerUnit: "",
                              company: ""
                            });
                          }}
                          className="w-full bg-amber-600 text-white font-sans py-2.5 rounded-xl font-black text-xs cursor-pointer hover:bg-amber-700 transition-all shadow"
                        >
                          {selectedStockToRefill === "new" ? "नया आइटम सुरक्षित करें" : "स्टॉक में मात्रा जोड़ें"}
                        </button>
                      </div>

                      {/* Stock Item Grid List */}
                      <div className="space-y-2">
                        {stockList
                          .filter(s => stockFilter === "all" || s.type === stockFilter)
                          .filter(s => !stockSearch || s.name.toLowerCase().includes(stockSearch.toLowerCase()) || s.company.toLowerCase().includes(stockSearch.toLowerCase()))
                          .map((item) => (
                            <div key={item.id} className="p-3 bg-white border border-slate-150 rounded-2.5xl shadow-sm flex flex-col space-y-2 hover:border-amber-400 transition-all font-sans">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[9px] font-black uppercase text-amber-600 block">
                                    {item.type === "fertilizer" ? "🍁 खाद (Fertilizer)" : (item.type === "seed" ? "🌱 बीज (Seed)" : "💊 कीटनाशक (Pesticide)")}
                                  </span>
                                  <strong className="text-xs text-slate-805 block mt-0.5">{item.name}</strong>
                                  <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">
                                    कंपनी: {item.company} | अंतिम अपडेट: {new Date(item.updatedAt).toLocaleTimeString()}
                                    {item.pricePerUnit !== undefined && (
                                      <span className="text-amber-700 font-extrabold ml-1.5 border-l border-slate-200 pl-1.5">
                                        💰 दर: ₹{item.pricePerUnit}/{item.unit}
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <span className={`text-[13px] font-black font-sans leading-none ${item.quantity <= 5 ? "text-rose-600 animate-pulse font-extrabold" : "text-emerald-700"}`}>
                                  {item.quantity} {item.unit}
                                </span>
                              </div>

                              {/* Operations section underneath containing edit, delete, add quantity and detail history button */}
                              <div className="border-t border-slate-100 pt-2 flex flex-wrap gap-1 items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => setViewingStockHistoryItem(item)}
                                  className="bg-sky-50 text-sky-700 hover:bg-sky-100 px-2 py-1 text-[9px] font-black rounded-lg cursor-pointer transition-all font-sans flex items-center space-x-1"
                                >
                                  <span>📖 विवरण (History)</span>
                                </button>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => {
                                      setStockQuickRefillItemId(item.id);
                                      setRefillQuantity("");
                                      setShowRefillModal(true);
                                    }}
                                    className="bg-amber-100 text-amber-850 hover:bg-amber-150 text-[9px] px-2 py-1 font-black rounded-lg cursor-pointer transition-all font-sans"
                                  >
                                    ➕ मात्रा जोड़ें
                                  </button>
                                  <button
                                    onClick={() => setEditingStockItem(item)}
                                    className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-[9px] px-2 py-1 font-black rounded-lg cursor-pointer transition-all font-sans"
                                  >
                                    ✏️ एडिट (Edit)
                                  </button>
                                  <button
                                    onClick={() => {
                                      showConfirm(
                                        "स्टॉक हटाएँ?",
                                        `क्या आप इस स्टॉक आइटम "${item.name}" को हटाना चाहते हैं?`,
                                        () => {
                                          setStockList(prev => prev.filter(s => s.id !== item.id));
                                          logAudit("DELETE_STOCK_ITEM", item.id, "farmers", `स्टॉक आइटम हटाया गया: ${item.name}`);
                                        }
                                      );
                                    }}
                                    className="bg-rose-50 text-rose-600 hover:bg-rose-105 text-[9px] px-2 py-1 font-black text-rose-600 rounded-lg cursor-pointer transition-all font-sans"
                                  >
                                     हटाएँ
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    /* Category Report Visuals */
                    <div className="space-y-4">
                      {["fertilizer", "seed", "pesticide"].map((cat) => {
                        const items = stockList.filter(s => s.type === cat);
                        const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
                        const label = cat === "fertilizer" ? "🍁 खाद स्टॉक (Fertilizers)" : (cat === "seed" ? "🌱 बीज स्टॉक (Seeds)" : "💊 कीटनाशक स्टॉक (Pesticides)");
                        const unit = cat === "fertilizer" ? "बोरी" : (cat === "seed" ? "कि.ग्राम." : "लीटर/इकाई");
                        return (
                          <div key={cat} className="p-4 bg-slate-50 border border-slate-200 rounded-3xl space-y-3 font-sans">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                              <strong className="text-xs text-slate-800">{label}</strong>
                              <span className="text-xs text-amber-600 font-extrabold">कुल: {totalQty} {unit}</span>
                            </div>
                            {items.length > 0 ? (
                              <div className="space-y-1.5">
                                {items.map(item => (
                                  <div key={item.id} className="flex justify-between items-center text-[11px]">
                                    <span className="text-slate-600">{item.name} ({item.company})</span>
                                    <span className={`font-semibold ${item.quantity <= 5 ? "text-rose-650 font-extrabold" : "text-slate-800"}`}>
                                      {item.quantity} {item.unit}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-slate-400 italic font-sans">इस कैटेगरी में कोई स्टॉक उपलब्ध नहीं है।</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* === APP 22: मेरी प्रोफाइल WINDOW === */}
              {activeApp === "folder_my_profile" && (
                <div className="space-y-6 animate-scaleIn font-sans text-xs">
                  <div className="p-4.5 bg-gradient-to-tr from-[#0f172a] to-[#122b3a] border border-slate-800 rounded-[28px] text-white space-y-2 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl"></div>
                    <h3 className="text-sm font-black text-sky-405 flex items-center space-x-2">
                      <span>👤 मेरी प्रोफाइल एवं लॉगिन्स</span>
                    </h3>
                    <p className="text-[10.5px] text-slate-300 leading-relaxed font-sans">
                      {isMainUser 
                        ? "मुख्य एडमिन प्रोफाइल प्रबंधित करें एंव नए ऑपरेटर को जोडें जो आपके खाते में स्टॉक व लेखा-जोखा सहेज सकें।"
                        : "अपनी ईमेल, मोबाइल और पासवर्ड अपडेट करें। आपके द्वारा दर्ज सभी प्रविष्टियां मुख्य एडमिन के ऑडिट लॉग में दर्ज की जाएंगी।"}
                    </p>
                  </div>

                  {/* Profile Info Card */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl space-y-3 font-sans">
                    <strong className="text-xs text-slate-800 block border-b border-slate-200 pb-1.5">👤 वर्तमान यूजर जानकारी</strong>
                    <div className="grid grid-cols-2 gap-2 text-[11px] leading-relaxed">
                      <div>
                        <span className="text-slate-400 block">नाम (Name)</span>
                        <strong className="text-slate-800">{currentUser?.name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">भूमिका (Role)</span>
                        <strong className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full inline-block font-black text-[9px] mt-0.5 uppercase">
                          {isMainUser ? "मुख्य एडमिन स्वामी" : "कृषि ऑपरेटर कार्य"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">ईमेल (Email)</span>
                        <strong className="text-slate-800 select-all font-sans">{currentUser?.email}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">मोबाईल / फ़ोन</span>
                        <strong className="text-slate-800 select-all font-sans">{currentUser?.phone || "अपंजीकृत"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Update Self Form (Accessible by both, but operator specifically needs this) */}
                  <div className="p-4 bg-white border border-slate-200 rounded-3xl space-y-3 font-sans">
                    <strong className="text-xs text-slate-850 block">🔧 प्रोफाइल व क्रेडेंशियल्स बदलें</strong>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const nameStr = formData.get("self_name") as string;
                      const emailStr = formData.get("self_email") as string;
                      const phoneStr = formData.get("self_phone") as string;
                      const passStr = formData.get("self_password") as string;
                      if (!nameStr || !emailStr) {
                        alert("❌ नाम और ईमेल अनिवार्य हैं!");
                        return;
                      }
                      try {
                        const targetId = currentUser?.id || "";
                        await updateOperatorProfile(targetId, nameStr, emailStr, phoneStr, passStr || undefined);
                        alert("✅ प्रोफाइल विवरण सफलतापूर्वक अपडेट हुआ!");
                      } catch (err: any) {
                        alert("❌ त्रुटि: " + err.message);
                      }
                    }} className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-650 block">आपका नाम</label>
                        <input
                          type="text"
                          name="self_name"
                          defaultValue={currentUser?.name || ""}
                          required
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-650 block">ईमेल आईडी</label>
                        <input
                          type="email"
                          name="self_email"
                          defaultValue={currentUser?.email || ""}
                          required
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-650 block font-sans">मोबाईल नंबर</label>
                        <input
                          type="text"
                          name="self_phone"
                          defaultValue={currentUser?.phone || ""}
                          placeholder="दर्ज करें"
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-650 block font-sans">अपडेटेड पासवर्ड (वैकल्पिक)</label>
                        <input
                          type="password"
                          name="self_password"
                          placeholder="खाली छोड़ें अगर नहीं बदलना"
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-slate-800 text-white py-2.5 rounded-xl font-black font-sans cursor-pointer hover:bg-slate-900 text-xs shadow transition-all mt-1"
                      >
                        विवरण सेव अपडेट करें
                      </button>
                    </form>
                  </div>

                  {/* Super admin specific: ADD OPERATORS AND LIST OPERATORS */}
                  {isMainUser && (
                    <div className="space-y-4">
                      {/* Add Form */}
                      <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-3xl space-y-3 font-sans">
                        <strong className="text-xs text-sky-850 block">➕ नया ऑपरेटर जोड़े (Add New Operator Under This ID)</strong>
                        <p className="text-[9.5px] text-slate-500 font-sans leading-normal">यह ऑपरेटर आपके ही बहीखाते में काम करेगा। यह स्टॉक जोड़ने और किसान रिकॉर्ड प्रबंधन जैसे सारे कार्य आपकी तरह ही कर सकेगा। इसके प्रत्येक कार्य का पृथक इतिहास (ऑडिट) ट्रैक किया जायेगा।</p>
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const name = formData.get("op_name") as string;
                          const email = formData.get("op_email") as string;
                          const phone = formData.get("op_phone") as string;
                          const password = formData.get("op_pass") as string;

                          if (!name || !email || !password) {
                            alert("❌ नाम, ईमेल और पासवर्ड अनिवार्य हैं!");
                            return;
                          }
                          try {
                            await createOperatorByAdmin(name, email, phone, password);
                            alert("✅ नया ऑपरेटर सफलतापूर्वक जोड़ा गया!");
                            e.currentTarget.reset();
                          } catch (err: any) {
                            alert("❌ त्रुटि: " + err.message);
                          }
                        }} className="space-y-2.5">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-600 block">ऑपरेटर का नाम</label>
                            <input
                              type="text"
                              name="op_name"
                              required
                              placeholder="जैसे: राम सिंह"
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-600 block">ईमेल (लॉगिन हेतु)</label>
                            <input
                              type="email"
                              name="op_email"
                              required
                              placeholder="जैसे: ramsingh@gmail.com"
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-600 block font-sans">मोबाईल नंबर</label>
                            <input
                              type="text"
                              name="op_phone"
                              placeholder="जैसे: 9876543210"
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-600 block">पासवर्ड</label>
                            <input
                              type="password"
                              name="op_pass"
                              required
                              placeholder="न्यूनतम 6 अंक"
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-lg font-black font-sans cursor-pointer text-xs transition-all shadow"
                          >
                            सुरक्षित ऑपरेटर जोड़ें
                          </button>
                        </form>
                      </div>

                      {/* Operator Log List under Admin */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl space-y-3 font-sans">
                        <strong className="text-xs text-slate-800 block border-b border-slate-205/30 pb-1.5">👥 पंजीकृत ऑपरेटरों की सूची</strong>
                        <div className="space-y-2">
                          {allOperators
                            .filter(o => o.role === "operator")
                            .map((op) => (
                              <div key={op.id} className="p-3 bg-white border border-slate-150 rounded-2xl flex justify-between items-center text-[11px]">
                                <div>
                                  <strong className="text-slate-800 block text-xs">{op.name}</strong>
                                  <span className="text-slate-400 block mt-0.5">📧 {op.email} {op.phone ? `| 📞 ${op.phone}` : ""}</span>
                                  <span className="text-[8.5px] text-slate-400 font-mono block mt-1 uppercase">ID: {op.id.substring(0, 10)}...</span>
                                </div>
                                <div className="flex flex-col items-end space-y-1.5 ml-2 shrink-0">
                                  <span className="bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">
                                    एक्टिव
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      showConfirm(
                                        "ऑपरेटर हटाएं?",
                                        `क्या आप ऑपरेटर "${op.name}" (${op.email}) को हटाना चाहते हैं? इसके बाद वे आपके खाते में लॉगिन नहीं कर पाएंगे।`,
                                        async () => {
                                          try {
                                            await deleteOperator(op.id);
                                            alert(`✅ ऑपरेटर "${op.name}" हटाया गया!`);
                                          } catch (e: any) {
                                            alert("❌ हटाने में असमर्थ: " + e.message);
                                          }
                                        }
                                      );
                                    }}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-105 px-2 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-all"
                                  >
                                    🗑️ हटाएं
                                  </button>
                                </div>
                              </div>
                            ))}
                          {allOperators.filter(o => o.role === "operator").length === 0 && (
                            <p className="text-[10px] italic text-slate-400 text-center py-2">कोई अतिरिक्त ऑपरेटर नहीं जुड़ा है।</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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

                      {/* Toggle for New vs Existing Farmer */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setIsNewFarmer(false)}
                          className={`py-2 text-[10.5px] font-extrabold rounded-lg transition-all text-center cursor-pointer ${
                            !isNewFarmer 
                              ? "bg-white text-cyan-800 border border-slate-200" 
                              : "text-slate-600 hover:text-slate-900 animate-fadeIn"
                          }`}
                        >
                          👤 मौजूदा किसान चुनें
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsNewFarmer(true)}
                          className={`py-2 text-[10.5px] font-extrabold rounded-lg transition-all text-center cursor-pointer ${
                            isNewFarmer 
                              ? "bg-white text-cyan-800 border border-slate-200 animate-fadeIn"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          ➕ नया किसान दर्ज करें
                        </button>
                      </div>

                      {!isNewFarmer ? (
                        <div className="space-y-1 animate-fadeIn">
                          <label className="font-extrabold text-slate-700 block text-[10.5px]">किसान / भूस्वामी चुनें</label>
                          <select
                            value={farmForm.farmerId}
                            onChange={(e) => setFarmForm({...farmForm, farmerId: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans font-bold text-slate-705 outline-none text-[11px]"
                          >
                            <option value="">-- किसान का चयन करें --</option>
                            {farmers.map(f => (
                              <option key={f.id} value={f.id}>{f.name} (📍 {f.village})</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-2.5 p-3.5 bg-cyan-50/40 rounded-2xl border border-cyan-100 animate-fadeIn">
                          <p className="font-extrabold text-cyan-800 text-[10.5px]">📝 नए किसान की जानकारी</p>
                          
                          <div className="space-y-1.5">
                            <label className="font-extrabold text-slate-700 block text-[10px]">किसान का नाम (Farmer's Name)</label>
                            <input
                              type="text"
                              value={newFarmerState.name}
                              onChange={(e) => setNewFarmerState({...newFarmerState, name: e.target.value})}
                              placeholder="उदा: रामचंद्र पाटीदार..."
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800 text-[11.5px]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                              <label className="font-extrabold text-slate-705 block text-[10px]">मोबाइल नंबर (Phone)</label>
                              <input
                                type="tel"
                                maxLength={10}
                                value={newFarmerState.phone}
                                onChange={(e) => setNewFarmerState({...newFarmerState, phone: e.target.value})}
                                placeholder="उदा: 9876543210"
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 outline-none font-mono font-bold text-slate-800 text-[11.5px]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-extrabold text-slate-705 block text-[10px]">ग्राम / गाँव (Village)</label>
                              <input
                                type="text"
                                value={newFarmerState.village}
                                onChange={(e) => setNewFarmerState({...newFarmerState, village: e.target.value})}
                                placeholder="उदा: मुख्य गाँव"
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 outline-none font-bold text-slate-800 text-[11.5px]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block text-[10.5px]">खेत का नाम (Farm Plot Name)</label>
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
                          <label className="font-extrabold text-slate-705 block text-[10.5px]">रकबा क्षेत्रफल (एकड़ में / Area)</label>
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
                          <label className="font-extrabold text-slate-705 block text-[10.5px]">सक्रिय फ़सल (Current Crop)</label>
                          <select
                            value={farmForm.crop}
                            onChange={(e) => {
                              if (e.target.value === "ADD_NEW") {
                                triggerQuickAdd("crop", (newCrop) => {
                                  setFarmForm({...farmForm, crop: newCrop});
                                });
                              } else {
                                setFarmForm({...farmForm, crop: e.target.value});
                              }
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-750 outline-none"
                          >
                            <option value="">-- फसल का चयन करें --</option>
                            {registeredCrops.map((c) => (
                              <option key={c.id} value={`${c.name} (${c.variety})`}>{c.name} ({c.variety})</option>
                            ))}
                            <option value="ADD_NEW" className="text-emerald-700 font-extrabold bg-emerald-50">➕ नयी फसल पंजीकृत करें...</option>
                          </select>
                        </div>
                      </div>

                      <button type="submit" className="w-full py-3 bg-cyan-700 hover:bg-cyan-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        {isNewFarmer ? "💾 नया किसान एवं खेत पंजीकृत करें" : "💾 नया खेत प्लॉट जोड़कर सहेजें"}
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {f.farms.map((farm, idx) => {
                                    const isEditing = editingPlot && editingPlot.plotId === farm.id;
                                    if (isEditing) {
                                      return (
                                        <div key={farm.id || idx} className="col-span-1 sm:col-span-2 bg-[#f4f7fe] border border-cyan-300 p-3 rounded-2xl space-y-2 animate-fadeIn">
                                          <p className="font-extrabold text-[10px] text-cyan-900 flex items-center">
                                            ✏️ खेत विवरण सुधारें
                                          </p>
                                          <div className="grid grid-cols-1 gap-2">
                                            <input
                                              type="text"
                                              value={editingPlot.name}
                                              onChange={(e) => setEditingPlot({...editingPlot, name: e.target.value})}
                                              className="bg-white border border-slate-250 px-2.5 py-1.5 rounded-xl outline-none text-[10.5px] font-sans font-bold text-slate-800"
                                              placeholder="खेत का नाम"
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                              <input
                                                type="number"
                                                step="0.01"
                                                value={editingPlot.acreage}
                                                onChange={(e) => setEditingPlot({...editingPlot, acreage: e.target.value})}
                                                className="bg-white border border-slate-250 px-2 py-1.5 rounded-xl outline-none text-[10.5px] font-mono font-bold text-slate-800"
                                                placeholder="रकबा"
                                              />
                                              <select
                                                value={editingPlot.crop}
                                                onChange={(e) => {
                                                  if (e.target.value === "ADD_NEW") {
                                                    triggerQuickAdd("crop", (newCrop) => {
                                                      setEditingPlot({...editingPlot, crop: newCrop});
                                                    });
                                                  } else {
                                                    setEditingPlot({...editingPlot, crop: e.target.value});
                                                  }
                                                }}
                                                className="bg-white border border-slate-250 px-2 px-2.5 py-1.5 rounded-xl outline-none text-[10.5px] font-sans font-bold text-slate-700"
                                              >
                                                <option value="">-- फसल चुनें --</option>
                                                {registeredCrops.map((c) => (
                                                  <option key={c.id} value={`${c.name} (${c.variety})`}>{c.name} ({c.variety})</option>
                                                ))}
                                                <option value="ADD_NEW" className="text-emerald-700 font-extrabold bg-emerald-55">➕ नयी फसल...</option>
                                              </select>
                                            </div>
                                          </div>
                                          <div className="flex justify-end space-x-2 text-[10px] font-bold">
                                            <button
                                              type="button"
                                              onClick={() => setEditingPlot(null)}
                                              className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-200 border border-slate-200 rounded-xl cursor-pointer"
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
                                                await handleUpdatePlot(editingPlot.farmerId, editingPlot.plotId, editingPlot.name, Number(editingPlot.acreage), editingPlot.crop);
                                                setEditingPlot(null);
                                              }}
                                              className="px-3 py-1.5 bg-cyan-705 hover:bg-cyan-800 text-white rounded-xl shadow-xs cursor-pointer"
                                            >
                                              सुरक्षित करें 💾
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    }

                                    return (
                                      <div key={farm.id || idx} className="bg-white border border-slate-150 p-2 rounded-2xl flex flex-col justify-between space-y-1 relative shadow-xs">
                                        <div className="flex justify-between items-start">
                                          <span className="font-extrabold text-[10.5px] text-slate-800 truncate pr-4">📍 {farm.name}</span>
                                          <div className="flex items-center space-x-2 shrink-0">
                                            <button
                                              type="button"
                                              title="विवरण सुधारें"
                                              onClick={() => setEditingPlot({
                                                farmerId: f.id,
                                                plotId: farm.id,
                                                name: farm.name,
                                                acreage: String(farm.acreage),
                                                crop: farm.activeCrop || "सोयाबीन (Soybean)"
                                              })}
                                              className="text-indigo-600 hover:text-indigo-800 p-0.5 text-[10.5px] rounded hover:bg-slate-50 transition-all cursor-pointer"
                                            >
                                              ✏️
                                            </button>
                                            <button
                                              type="button"
                                              title="खेत हटाएं"
                                              onClick={() => {
                                                showConfirm(
                                                  "खेत हटाएं ⚠️",
                                                  `क्या आप वाकई किसान "${f.name}" का खेत "${farm.name}" हटाना चाहते हैं? यह प्रक्रिया अपरिवर्तनीय है!`,
                                                  () => handleDeletePlot(f.id, farm.id)
                                                );
                                              }}
                                              className="text-rose-600 hover:text-rose-800 p-0.5 text-[10.5px] rounded hover:bg-slate-50 transition-all cursor-pointer"
                                            >
                                              🗑️
                                            </button>
                                          </div>
                                        </div>
                                        <div className="flex justify-between text-[9px] text-slate-500 font-mono pt-1 border-t border-slate-100/60">
                                          <span>{farm.acreage} एकड़</span>
                                          <span className="text-emerald-700 font-bold">{farm.activeCrop}</span>
                                        </div>
                                      </div>
                                    );
                                  })}
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
                                showConfirm(
                                  "फसल प्रकार हटाएं ⚠️",
                                  `क्या आप वाकई इस फसल प्रकार ("${c.name}") को हटाना चाहते हैं?`,
                                  () => setRegisteredCrops(prev => prev.filter(item => item.id !== c.id))
                                );
                              }}
                              className="text-rose-655 hover:text-rose-800 font-bold text-[9.5px] scale-95 transition-all outline-none cursor-pointer"
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
                                  showConfirm(
                                    "व्यापारी संपर्क हटाएं ⚠️",
                                    `क्या आप वाकई व्यापारी "${m.name}" का संपर्क विवरण हटाना चाहते हैं?`,
                                    () => setRegisteredMerchants(prev => prev.filter(item => item.id !== m.id))
                                  );
                                }}
                                className="text-rose-655 hover:text-rose-800 text-[10px] font-bold cursor-pointer"
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

              {/* === APP 18: खाद ब्रांड पंजीकरण WINDOW === */}
              {activeApp === "fertilizer_management" && (
                <>
                  {showAddForm ? (
                    <form onSubmit={handleRegisterFertilizerObj} className="space-y-3.5 animate-fadeIn font-sans">
                      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-[10px] text-indigo-805 leading-normal">
                        📦 नयी खाद/उर्वरक सामग्री ब्रांड, उसका नाम और निर्माता कंपनी का विवरण पंजीकृत करें ताकि वह खाद प्रबंधन मॉड्यूल में चयन हेतु उपलब्ध हो सके।
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">खाद/उर्वरक का नाम (Fertilizer Brand/Name)</label>
                        <input
                          type="text"
                          value={fertilizerProfileForm.name}
                          onChange={(e) => setFertilizerProfileForm({...fertilizerProfileForm, name: e.target.value})}
                          placeholder="उदा: यूरिया (Urea - 46%), डीएपी, एनपीके..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">निर्माता कंपनी / ब्रांड (Manufacturer/Company)</label>
                        <input
                          type="text"
                          value={fertilizerProfileForm.company}
                          onChange={(e) => setFertilizerProfileForm({...fertilizerProfileForm, company: e.target.value})}
                          placeholder="उदा: इफको (IFFCO), चंबल फर्टिलाइजर्स, कृभको..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800"
                        />
                      </div>

                      <button type="submit" className="w-full py-3 bg-indigo-705 bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 नयी खाद सामग्री पंजीकृत करें
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3 animate-fadeIn font-sans leading-normal">
                      <div className="p-3 bg-indigo-50 border border-indigo-250/60 rounded-2xl text-[10px] text-indigo-800 leading-relaxed">
                        📦 <strong>पंजीकृत खाद निर्देशिका (Fertilizers Directory):</strong> पंजीकृत विशिष्ट खाद उर्वरक ब्रांडों की सूची। ये केवल प्रोफाइल पंजीकरण के बाद ही ड्रॉपडाउन में दिखाई देंगे।
                      </div>

                      <div className="grid grid-cols-1 gap-2 border-none">
                        {registeredFertilizers.length > 0 ? (
                          registeredFertilizers.map((f) => {
                            const isEditing = editingFertilizerId === f.id;
                            if (isEditing) {
                              return (
                                <div key={f.id} className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl space-y-2 animate-fadeIn relative text-left">
                                  <span className="font-extrabold text-[10px] text-indigo-900 block font-sans">✏️ खाद का विवरण संपादित करें</span>
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={fertilizerEditForm.name}
                                      onChange={(e) => setFertilizerEditForm({ ...fertilizerEditForm, name: e.target.value })}
                                      className="w-full bg-white border border-slate-250 px-2.5 py-1.5 rounded-xl outline-none text-xs font-bold text-slate-800"
                                      placeholder="खाद का नाम (उदा: यूरिया)"
                                    />
                                    <input
                                      type="text"
                                      value={fertilizerEditForm.company}
                                      onChange={(e) => setFertilizerEditForm({ ...fertilizerEditForm, company: e.target.value })}
                                      className="w-full bg-white border border-slate-250 px-2.5 py-1.5 rounded-xl outline-none text-xs font-bold text-slate-800"
                                      placeholder="कंपनी/ब्रांड (उदा: इफको)"
                                    />
                                    <div className="flex justify-end space-x-2 pt-1 font-sans text-[10.5px]">
                                      <button
                                        type="button"
                                        onClick={() => setEditingFertilizerId(null)}
                                        className="px-3 py-1.5 bg-slate-200 border border-slate-300 text-slate-605 text-slate-700 rounded-xl cursor-pointer font-bold"
                                      >
                                        रद्द करें
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateFertilizerObj(f.id, fertilizerEditForm.name, fertilizerEditForm.company)}
                                        className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl shadow cursor-pointer font-bold"
                                      >
                                        सुरक्षित करें 💾
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <div key={f.id} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex justify-between items-center relative gap-2">
                                <div className="flex items-center space-x-3 select-text">
                                  <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl">
                                    <Package className="h-5 w-5 text-indigo-650" />
                                  </div>
                                  <div>
                                    <strong className="text-xs text-slate-850 block font-black">{f.name}</strong>
                                    <span className="text-[9px] text-slate-400 block mt-0.5">ब्रांड/कंपनी: <strong className="text-slate-650">{f.company}</strong></span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingFertilizerId(f.id);
                                      setFertilizerEditForm({ name: f.name, company: f.company });
                                    }}
                                    className="text-indigo-600 hover:text-indigo-850 font-bold text-[9.5px] scale-95 transition-all outline-none cursor-pointer border-none bg-transparent"
                                  >
                                    ✏️ बदलें
                                  </button>
                                  <span className="text-slate-300 text-[9px]">|</span>
                                  <button
                                    onClick={() => {
                                      showConfirm(
                                        "खाद हटाएं ⚠️",
                                        `क्या आप वाकई इस खाद ब्रांड ("${f.name}") को पंजीकृत सूची से हटाना चाहते हैं?`,
                                        () => setRegisteredFertilizers(prev => prev.filter(item => item.id !== f.id))
                                      );
                                    }}
                                    className="text-rose-655 hover:text-rose-800 font-bold text-[9.5px] scale-95 transition-all outline-none cursor-pointer border-none bg-transparent"
                                  >
                                    🗑️ हटाएं
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center text-slate-400 text-[10.5px] font-sans border border-dashed border-slate-250 border-slate-200 rounded-2xl bg-slate-50/50">
                            कोई पंजीकृत खाद ब्रांड उपलब्ध नहीं है! नया ब्रांड जोड़ने के लिए ऊपर <strong>'जोड़ें'</strong> पर क्लिक करें।
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* === APP 19: दवा ब्रांड पंजीकरण WINDOW === */}
              {activeApp === "pesticide_management" && (
                <>
                  {showAddForm ? (
                    <form onSubmit={handleRegisterPesticideObj} className="space-y-3.5 animate-fadeIn font-sans">
                      <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl text-[10px] text-pink-850 text-pink-800 leading-normal">
                        💊 कृषि फसलों की सुरक्षा हेतु उपयोग की जाने वाली कीटनाशक दवा, टॉनिक या फफूंदनाशक का पूरा नाम एवं निर्माता कंपनी का विवरण पंजीकृत करें।
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">दवा / कीटनाशक का नाम (Pesticide/Medicine Name)</label>
                        <input
                          type="text"
                          value={pesticideProfileForm.name}
                          onChange={(e) => setPesticideProfileForm({...pesticideProfileForm, name: e.target.value})}
                          placeholder="उदा: कोराजन (Coragen), एम्पलीगो, साफ फंगीसाइड..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700 block">निर्माता कंपनी / प्रदाता (Manufacturer/Company)</label>
                        <input
                          type="text"
                          value={pesticideProfileForm.company}
                          onChange={(e) => setPesticideProfileForm({...pesticideProfileForm, company: e.target.value})}
                          placeholder="उदा: ड्यूपॉन्ट (DuPont), सिंजेंटा, बायर, यूपीएल..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800"
                        />
                      </div>

                      <button type="submit" className="w-full py-3 bg-pink-700 hover:bg-pink-850 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all">
                        💾 नयी दवा क्रेडेंशियल पंजीकृत करें
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3 animate-fadeIn font-sans leading-normal">
                      <div className="p-3 bg-pink-50 border border-pink-250/60 rounded-2xl text-[10px] text-pink-800 leading-relaxed">
                        💊 <strong>पंजीकृत औषधि निर्देशिका (Pesticides Directory):</strong> कृषि कीटनाशक एवं फसल सुरक्षा दवा क्रेडेंशियल्स नेटवर्क। ये केवल प्रोफाइल पंजीकरण के बाद ही ड्रॉपडाउन में दिखाई देंगे।
                      </div>

                      <div className="grid grid-cols-1 gap-2 border-none">
                        {registeredPesticides.length > 0 ? (
                          registeredPesticides.map((p) => {
                            const isEditing = editingPesticideId === p.id;
                            if (isEditing) {
                              return (
                                <div key={p.id} className="bg-pink-50 border border-pink-200 p-3.5 rounded-2xl space-y-2 animate-fadeIn relative text-left">
                                  <span className="font-extrabold text-[10px] text-pink-900 block font-sans">✏️ दवा का विवरण संपादित करें</span>
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={pesticideEditForm.name}
                                      onChange={(e) => setPesticideEditForm({ ...pesticideEditForm, name: e.target.value })}
                                      className="w-full bg-white border border-slate-250 px-2.5 py-1.5 rounded-xl outline-none text-xs font-bold text-slate-800"
                                      placeholder="दवा का नाम (उदा: कोराजन)"
                                    />
                                    <input
                                      type="text"
                                      value={pesticideEditForm.company}
                                      onChange={(e) => setPesticideEditForm({ ...pesticideEditForm, company: e.target.value })}
                                      className="w-full bg-white border border-slate-250 px-2.5 py-1.5 rounded-xl outline-none text-xs font-bold text-slate-800"
                                      placeholder="कंपनी/निर्माता (उदा: ड्यूपॉन्ट)"
                                    />
                                    <div className="flex justify-end space-x-2 pt-1 font-sans text-[10.5px]">
                                      <button
                                        type="button"
                                        onClick={() => setEditingPesticideId(null)}
                                        className="px-3 py-1.5 bg-slate-200 border border-slate-300 text-slate-700 rounded-xl cursor-pointer font-bold"
                                      >
                                        रद्द करें
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleUpdatePesticideObj(p.id, pesticideEditForm.name, pesticideEditForm.company)}
                                        className="px-3 py-1.5 bg-pink-700 hover:bg-pink-850 text-white rounded-xl shadow cursor-pointer font-bold"
                                      >
                                        सुरक्षित करें 💾
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <div key={p.id} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex justify-between items-center relative gap-2">
                                <div className="flex items-center space-x-3 select-text">
                                  <div className="p-2.5 bg-pink-50 border border-pink-100 rounded-xl">
                                    <Activity className="h-5 w-5 text-pink-650" />
                                  </div>
                                  <div>
                                    <strong className="text-xs text-slate-850 block font-black">{p.name}</strong>
                                    <span className="text-[9px] text-slate-400 block mt-0.5">ब्रांड/कंपनी: <strong className="text-slate-650">{p.company}</strong></span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingPesticideId(p.id);
                                      setPesticideEditForm({ name: p.name, company: p.company });
                                    }}
                                    className="text-pink-600 hover:text-pink-855 font-bold text-[9.5px] scale-95 transition-all outline-none cursor-pointer border-none bg-transparent"
                                  >
                                    ✏️ बदलें
                                  </button>
                                  <span className="text-slate-300 text-[9px]">|</span>
                                  <button
                                    onClick={() => {
                                      showConfirm(
                                        "दवा हटाएं ⚠️",
                                        `क्या आप वाकई इस दवा औषधि ("${p.name}") को पंजीकृत सूची से हटाना चाहते हैं?`,
                                        () => setRegisteredPesticides(prev => prev.filter(item => item.id !== p.id))
                                      );
                                    }}
                                    className="text-rose-655 hover:text-rose-800 font-bold text-[9.5px] scale-95 transition-all outline-none cursor-pointer border-none bg-transparent"
                                  >
                                    🗑️ हटाएं
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center text-slate-400 text-[10.5px] font-sans border border-dashed border-slate-250 border-slate-200 rounded-2xl bg-slate-50/50">
                            कोई पंजीकृत दवा औषधि उपलब्ध नहीं है! नया उत्पाद जोड़ने के लिए ऊपर <strong>'जोड़ें'</strong> पर क्लिक करें।
                          </div>
                        )}
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

      {/* 🔐 MULTI-FUNCTION AUTHENTICATION SCREEN OVERLAY (Login / Register / Forgot Password) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0b1220] border border-slate-805 p-6 rounded-[28px] w-full max-w-[380px] text-left space-y-4 shadow-2.5xl relative animate-scaleIn">
            
            {/* Close modal button */}
            <button
              onClick={() => {
                setIsLoginModalOpen(false);
                setLoginError(null);
                setAuthFeedback("");
              }}
              className="absolute top-4 right-4 p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-full cursor-pointer transition-all outline-none"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-6">
              <span className="text-[10px] text-emerald-400 font-sans font-black uppercase tracking-wider">
                {authType === "login" && "🔐 लॉगिन क्रेडेंशियल्स"}
                {authType === "register" && "📝 नया कृषक खाता पंजीयन"}
                {authType === "forgot" && "🔑 पासवर्ड पुनर्प्राप्ति"}
              </span>
              <h3 className="text-lg font-black text-white font-sans tracking-tight">
                {authType === "login" && "कृषिडायरी लॉगिन करें"}
                {authType === "register" && "नवीन ऑपरेटर पंजीकरण"}
                {authType === "forgot" && "पासवर्ड भूल गए?"}
              </h3>
              <p className="text-[10.5px] text-slate-400 font-medium font-sans leading-normal">
                {authType === "login" && "अपना पंजीकृत ईमेल आईडी और गुप्त पासवर्ड दर्ज करें"}
                {authType === "register" && "सभी आवश्यक क्रेडेंशियल्स दर्ज करके नया खाता सहेजें"}
                {authType === "forgot" && "अपना पंजीकृत ईमेल भरें, हम पासवर्ड रीसेट लिंक भेजेंगे"}
              </p>
            </div>

            {/* Notifications & Feedbacks */}
            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-rose-400 rounded-xl text-[10.5px] font-sans font-black flex items-center space-x-1.5 animate-pulse">
                <span>⚠️</span>
                <span>{loginError}</span>
              </div>
            )}
            {authFeedback && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10.5px] font-sans font-bold flex items-center space-x-1.5 animate-bounce">
                <span>✅</span>
                <span>{authFeedback}</span>
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3 pt-1">
              {authType === "register" && (
                <>
                  {/* Farmer/Operator Name input */}
                  <div className="space-y-1">
                    <label htmlFor="reg-name" className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">कृषक का नाम (Name) *</label>
                    <input
                      type="text"
                      id="reg-name"
                      placeholder="उदा: कचरू रामजी पटेल"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all font-sans"
                    />
                  </div>

                  {/* Farmer/Operator Phone input */}
                  <div className="space-y-1">
                    <label htmlFor="reg-phone" className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">मोबाइल नम्बर (Phone) *</label>
                    <input
                      type="tel"
                      id="reg-phone"
                      placeholder="उदा: +91 9876543210"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all font-sans"
                    />
                  </div>
                </>
              )}

              {authType !== "forgot" ? (
                <>
                  {/* Email ID / User ID input */}
                  <div className="space-y-1 font-sans">
                    <label htmlFor="auth-email" className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">
                      {authType === "register" ? "यूजर आईडी (ईमेल) *" : "ईमेल आईडी / यूजर आईडी (Email)*"}
                    </label>
                    <input
                      type="email"
                      id="auth-email"
                      placeholder="उदा: farmer@agriportal.in"
                      value={authType === "register" ? registerForm.email : loginForm.email}
                      onChange={(e) => {
                        if (authType === "register") {
                          setRegisterForm({ ...registerForm, email: e.target.value });
                        } else {
                          setLoginForm({ ...loginForm, email: e.target.value });
                        }
                      }}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all font-sans"
                    />
                  </div>

                  {/* Password input */}
                  <div className="space-y-1 font-sans">
                    <label htmlFor="auth-password" className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">गुप्त पासवर्ड (Password) *</label>
                    <input
                      type="password"
                      id="auth-password"
                      placeholder="••••••••"
                      value={authType === "register" ? registerForm.password : loginForm.password}
                      onChange={(e) => {
                        if (authType === "register") {
                          setRegisterForm({ ...registerForm, password: e.target.value });
                        } else {
                          setLoginForm({ ...loginForm, password: e.target.value });
                        }
                      }}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all"
                    />
                  </div>
                </>
              ) : (
                /* Forgot Password Email only input */
                <div className="space-y-1 font-sans">
                  <label htmlFor="forgot-email" className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">पंजीकृत ईमेल आईडी (Email) *</label>
                  <input
                    type="email"
                    id="forgot-email"
                    placeholder="उदा: farmer@agriportal.in"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all font-sans"
                  />
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2">
                {authType === "login" && (
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/35 rounded-xl text-[11px] font-sans font-extrabold cursor-pointer transition-all uppercase flex items-center justify-center space-x-1 shadow shadow-emerald-900/30"
                  >
                    <span>🔐 लॉगिन करें और प्रवेश करें</span>
                  </button>
                )}

                {authType === "register" && (
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white border border-indigo-500/35 rounded-xl text-[11px] font-sans font-extrabold cursor-pointer transition-all uppercase flex items-center justify-center space-x-1.5 shadow"
                  >
                    <span>💾 सेब करें / रजिस्टर कृषक</span>
                  </button>
                )}

                {authType === "forgot" && (
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white border border-teal-500/30 rounded-xl text-[11px] font-sans font-extrabold cursor-pointer transition-all uppercase flex items-center justify-center space-x-1 shadow"
                  >
                    <span>✉️ रीसेट लिंक भेजें</span>
                  </button>
                )}
              </div>
            </form>

            <div className="border-t border-slate-900 my-1 pt-1"></div>

            {/* Alternating Links for Modal Swappings */}
            <div className="flex flex-col space-y-2 text-center text-[10.5px]">
              {authType === "login" && (
                <>
                  <button
                    onClick={() => {
                      setAuthType("forgot");
                      setLoginError(null);
                      setAuthFeedback("");
                    }}
                    className="text-emerald-400 hover:underline font-sans font-bold cursor-pointer inline-block bg-transparent border-0 outline-none"
                  >
                    ❓ पासवर्ड भूल गए (Forgot)?
                  </button>
                  <p className="text-slate-500 font-sans">
                    खाता नहीं है?{" "}
                    <button
                      onClick={() => {
                        setAuthType("register");
                        setLoginError(null);
                        setAuthFeedback("");
                      }}
                      className="text-slate-200 hover:underline hover:text-white font-extrabold cursor-pointer bg-transparent border-0 outline-none"
                    >
                      नया कृषक खाता बनाएं (SignUp)
                    </button>
                  </p>
                </>
              )}

              {authType === "register" && (
                <p className="text-slate-500 font-sans">
                  पहले से पंजीयन है?{" "}
                  <button
                    onClick={() => {
                      setAuthType("login");
                      setLoginError(null);
                      setAuthFeedback("");
                    }}
                    className="text-emerald-400 hover:underline font-extrabold cursor-pointer bg-transparent border-0 outline-none"
                  >
                    लॉगिन पर वापस जाएं
                  </button>
                </p>
              )}

              {authType === "forgot" && (
                <button
                  onClick={() => {
                    setAuthType("login");
                    setLoginError(null);
                    setAuthFeedback("");
                  }}
                  className="text-slate-400 hover:underline font-sans font-bold cursor-pointer bg-transparent border-0 outline-none"
                >
                  ◀ लॉगिन स्क्रीन पर वापस जाएं
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ➕ Quick Add Interactive Popup Modal */}
      {quickAddType && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fadeIn font-sans">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-left shadow-2xl relative overflow-hidden text-slate-200 animate-scaleIn">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
            
            <div className="flex items-start justify-between mb-4 mt-2">
              <h3 className="font-extrabold text-white text-sm tracking-tight flex items-center space-x-2">
                <span>➕ त्वरित जोड़ें:</span>
                <span className="text-emerald-400">
                  {quickAddType === "crop" && "नयी फ़सल किस्म"}
                  {quickAddType === "farm" && "नया खेत/प्लॉट"}
                  {quickAddType === "fertilizer" && "नयी खाद/उर्वरक"}
                  {quickAddType === "pesticide" && "नयी दवा/कीटनाशक"}
                  {quickAddType === "merchant" && "नया व्यापारी संपर्क"}
                </span>
              </h3>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="space-y-4 text-xs">
              
              {/* CROP QUICK ADD BLOCK */}
              {quickAddType === "crop" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">फ़सल का नाम *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा: कपास, लहसुन, चना"
                      value={quickAddFormState.name}
                      onChange={(e) => setQuickAddFormState({...quickAddFormState, name: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">किस्म / वैरायटी *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा: देशी, अंकुर-555, हाइब्रिड"
                      value={quickAddFormState.variety}
                      onChange={(e) => setQuickAddFormState({...quickAddFormState, variety: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">कंपनी / निर्मित ब्रांड *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा: रासी, महिको, सिंजेंटा"
                      value={quickAddFormState.company}
                      onChange={(e) => setQuickAddFormState({...quickAddFormState, company: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </>
              )}

              {/* FARM QUICK ADD BLOCK */}
              {quickAddType === "farm" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">किसान का चयन करें *</label>
                    <select
                      required
                      value={quickAddFormState.farmerId}
                      onChange={(e) => setQuickAddFormState({...quickAddFormState, farmerId: e.target.value})}
                      className="w-full bg-slate-905 bg-slate-900 border border-slate-800 text-white rounded-xl p-2 font-bold outline-none text-xs"
                    >
                      <option value="">-- किसान चुनें --</option>
                      {farmers.map((f) => (
                        <option key={f.id} value={f.id}>👤 {f.name} ({f.village})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">खेत / प्लाट का नाम *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा: कुएं वाला खेत, घर के पीछे"
                      value={quickAddFormState.name}
                      onChange={(e) => setQuickAddFormState({...quickAddFormState, name: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">रकबा (एकड़) *</label>
                      <input
                        type="number"
                        step="any"
                        required
                        placeholder="उदा: 2.5"
                        value={quickAddFormState.acreage}
                        onChange={(e) => setQuickAddFormState({...quickAddFormState, acreage: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500 outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">सक्रिय फसल *</label>
                      <select
                        required
                        value={quickAddFormState.crop}
                        onChange={(e) => setQuickAddFormState({...quickAddFormState, crop: e.target.value})}
                        className="w-full bg-slate-905 bg-slate-900 border border-slate-800 text-white rounded-xl p-2 font-bold outline-none text-[10.5px] h-[34px]"
                      >
                        <option value="">-- फसल चुनें --</option>
                        {registeredCrops.map((c) => (
                          <option key={c.id} value={`${c.name} (${c.variety})`}>{c.name} ({c.variety})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* FERTILIZER QUICK ADD BLOCK */}
              {quickAddType === "fertilizer" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">उर्वरक / खाद का नाम *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा: यूरिया (Urea), DAP, NPK"
                      value={quickAddFormState.name}
                      onChange={(e) => setQuickAddFormState({...quickAddFormState, name: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">ब्रांड / निर्माण कंपनी *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा: इफको (IFFCO), कृभको, आईपीएल"
                      value={quickAddFormState.company}
                      onChange={(e) => setQuickAddFormState({...quickAddFormState, company: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </>
              )}

              {/* PESTICIDE QUICK ADD BLOCK */}
              {quickAddType === "pesticide" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">दवा / कीटनाशक का नाम *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा: कोराजन, फोरेट, एम-45"
                      value={quickAddFormState.name}
                      onChange={(e) => setQuickAddFormState({...quickAddFormState, name: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">कंपनी / निर्माता ब्रांड *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा: बायर, टाटा, सिंजेंटा"
                      value={quickAddFormState.company}
                      onChange={(e) => setQuickAddFormState({...quickAddFormState, company: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </>
              )}

              {/* MERCHANT QUICK ADD BLOCK */}
              {quickAddType === "merchant" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">व्यापारी का नाम *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा: मोहन लाल एग्रो ट्रेडर्स"
                      value={quickAddFormState.name}
                      onChange={(e) => setQuickAddFormState({...quickAddFormState, name: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">मोबाइल नंबर (Phone)</label>
                    <input
                      type="tel"
                      placeholder="उदा: 9876543210"
                      value={quickAddFormState.phone}
                      onChange={(e) => setQuickAddFormState({...quickAddFormState, phone: e.target.value.replace(/\D/g, '').substring(0, 10)})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500 outline-none transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wide block">खरीदने वाली फ़सलें *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा: लहसुन, सोयाबीन, गेहूं"
                      value={quickAddFormState.cropsPurchased}
                      onChange={(e) => setQuickAddFormState({...quickAddFormState, cropsPurchased: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-2.5 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuickAddType(null);
                    setQuickAddCallback(null);
                  }}
                  className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 text-[10px] font-bold rounded-xl transition-all cursor-pointer outline-none"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/30 text-[10px] font-black rounded-xl cursor-pointer shadow-md transition-all outline-none"
                >
                  सुरक्षित करें
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ⚠️ STOCK WARNING DIALOG */}
      {showStockWarning && stockWarningDetails && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans animate-fadeIn select-none">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-105 max-w-[325px] w-full p-5 space-y-4">
            <div className="h-12 w-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mx-auto animate-bounce animate-pulse">
              <Boxes className="h-6 w-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-xs font-black text-slate-900">⚠️ स्टॉक अपर्याप्त है! (Out of Stock Error)</h4>
              <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                प्रविष्टि के लिए <strong className="text-slate-800">{stockWarningDetails.neededQty} {stockWarningDetails.unit}</strong> <strong className="text-amber-600">{stockWarningDetails.itemName}</strong> की आवश्यकता है। वर्तमान उपलब्ध स्टॉक केवल <strong>{stockWarningDetails.currentQty} {stockWarningDetails.unit}</strong> है।
              </p>
            </div>
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-bold text-slate-650 block">नया स्टॉक जोड़ें (Refill Stock Amount)</label>
              <input
                type="number"
                placeholder={`जैसे: ${stockWarningDetails.neededQty - stockWarningDetails.currentQty}`}
                value={stockQuickRefillAmt}
                onChange={(e) => setStockQuickRefillAmt(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-205 rounded-xl outline-none focus:ring-1 focus:ring-rose-500 font-sans bg-slate-50 text-slate-800"
              />
            </div>
            <div className="flex space-x-2 pt-2 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setShowStockWarning(false);
                  setStockWarningDetails(null);
                  setStockQuickRefillAmt("");
                }}
                className="flex-1 bg-slate-105 bg-slate-100 text-slate-650 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-slate-200 text-center"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={async () => {
                  const added = Number(stockQuickRefillAmt || 0);
                  if (added <= 0) {
                    alert("❌ कृपया सही स्टॉक संख्या दर्ज करें!");
                    return;
                  }
                  if (stockWarningDetails.callback) {
                    await stockWarningDetails.callback(added);
                  }
                  setShowStockWarning(false);
                  setStockWarningDetails(null);
                  setStockQuickRefillAmt("");
                }}
                className="flex-1 bg-amber-600 text-white py-2.5 rounded-xl font-black cursor-pointer hover:bg-amber-700 text-center shadow"
              >
                स्टॉक जोड़ें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📦 QUICK REFILL DIALOG */}
      {showRefillModal && stockQuickRefillItemId && (
        <div className="fixed inset-0 bg-slate-905/70 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans animate-fadeIn select-none">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-150 max-w-[300px] w-full p-5 space-y-4">
            <div className="text-center space-y-2">
              <h4 className="text-xs font-black text-slate-805">📦 स्टॉक रीफिल (Refill Stock)</h4>
              <p className="text-[10px] text-slate-505 font-sans">
                चयनित आइटम: <strong className="text-slate-800">
                  {stockList.find(s => s.id === stockQuickRefillItemId)?.name}
                </strong>
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 block">कितनी मात्रा जोड़ना चाहते हैं?</label>
              <input
                type="number"
                placeholder="संख्या दर्ज करें"
                value={refillQuantity}
                onChange={(e) => setRefillQuantity(e.target.value)}
                className="w-full p-2.5 border border-slate-200 text-slate-800 rounded-lg text-xs font-sans outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="flex space-x-2 pt-2 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setShowRefillModal(false);
                  setStockQuickRefillItemId(null);
                  setRefillQuantity("");
                }}
                className="flex-1 bg-slate-105 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold cursor-pointer font-sans text-center"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={() => {
                  const addedVal = Number(refillQuantity || 0);
                  if (addedVal <= 0) {
                    alert("❌ कृपया सही मात्रा दर्ज करें!");
                    return;
                  }
                  setStockList(prev => prev.map(s => {
                    if (s.id === stockQuickRefillItemId) {
                      const updated = s.quantity + addedVal;
                      const log = {
                        id: "hist_" + Date.now(),
                        action: "refill" as const,
                        quantityChange: addedVal,
                        finalQuantity: updated,
                        operatorName: currentUser?.name || "मुख्य यूजर",
                        date: new Date().toISOString(),
                        details: `त्वरित रिफिल द्वारा स्टॉक बढ़ाया गया: +${addedVal} ${s.unit} जोड़ा गया।`
                      };
                      const updatedHistory = s.history ? [log, ...s.history] : [log];
                      logAudit("UPDATE_STOCK_ITEM", s.id, "farmers", `स्टॉक आइटम रिफिल किया: ${s.name}, जोड़ा गया: ${addedVal} ${s.unit}, नया स्टॉक: ${updated} ${s.unit}`);
                      return { ...s, quantity: updated, history: updatedHistory, updatedAt: new Date().toISOString() };
                    }
                    return s;
                  }));
                  setShowRefillModal(false);
                  setStockQuickRefillItemId(null);
                  setRefillQuantity("");
                  alert("✅ स्टॉक सफलतापूर्वक अपडेट किया गया!");
                }}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl font-black cursor-pointer shadow font-sans text-center"
              >
                विवरण सहेजें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ EDIT STOCK MODAL */}
      {editingStockItem && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans animate-fadeIn select-none">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-[325px] w-full p-5 space-y-4">
            <h4 className="text-xs font-black text-slate-900 border-b pb-2">✏️ स्टॉक विवरण बदलें (Edit Item Details)</h4>
            
            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">आइटम का नाम</label>
                <input
                  type="text"
                  value={editingStockItem.name}
                  onChange={(e) => setEditingStockItem({ ...editingStockItem, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">निर्माता कंपनी</label>
                <input
                  type="text"
                  value={editingStockItem.company}
                  onChange={(e) => setEditingStockItem({ ...editingStockItem, company: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">मात्रा इकाई</label>
                <input
                  type="text"
                  value={editingStockItem.unit}
                  onChange={(e) => setEditingStockItem({ ...editingStockItem, unit: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2 text-[11px]">
              <button
                type="button"
                onClick={() => setEditingStockItem(null)}
                className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-slate-200 text-center"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingStockItem.name) {
                    alert("❌ नाम अनिवार्य है!");
                    return;
                  }
                  setStockList(prev => prev.map(s => {
                    if (s.id === editingStockItem.id) {
                      const log = {
                        id: "hist_" + Date.now(),
                        action: "edit" as const,
                        quantityChange: 0,
                        finalQuantity: s.quantity,
                        operatorName: currentUser?.name || "मुख्य यूजर",
                        date: new Date().toISOString(),
                        details: `विवरण संशोधित किया गया: नाम बढ़कर "${editingStockItem.name}", कंपनी "${editingStockItem.company}", इकाई: ${editingStockItem.unit}।`
                      };
                      const updatedHistory = s.history ? [log, ...s.history] : [log];
                      return {
                        ...s,
                        name: editingStockItem.name,
                        company: editingStockItem.company,
                        unit: editingStockItem.unit,
                        history: updatedHistory,
                        updatedAt: new Date().toISOString()
                      };
                    }
                    return s;
                  }));
                  logAudit("EDIT_STOCK_ITEM", editingStockItem.id, "farmers", `संशोधित किया: ${editingStockItem.name}, कंपनी: ${editingStockItem.company}`);
                  setEditingStockItem(null);
                  alert("✅ स्टॉक जानकारी सफलतापूर्वक अपडेट की गई!");
                }}
                className="flex-1 bg-amber-600 text-white py-2.5 rounded-xl font-black cursor-pointer hover:bg-amber-700 text-center shadow"
              >
                अपडेट करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📋 VIEW STOCK HISTORY MODAL */}
      {viewingStockHistoryItem && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans animate-fadeIn select-none">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-[340px] w-full p-5 space-y-4 max-h-[85vh] overflow-hidden flex flex-col">
            <div className="border-b pb-2 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-black text-slate-900">📋 स्टॉक इतिहास log - विवरण</h4>
                <p className="text-[10px] text-amber-600 font-bold mt-0.5">{viewingStockHistoryItem.name} ({viewingStockHistoryItem.company})</p>
              </div>
              <button 
                onClick={() => setViewingStockHistoryItem(null)}
                className="text-slate-400 hover:text-slate-650 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1 scrollbar-thin">
              {(!viewingStockHistoryItem.history || viewingStockHistoryItem.history.length === 0) ? (
                <div className="text-center py-6 text-[11px] text-slate-400 italic">
                  कोई इतिहास विवरण उपलब्ध नहीं है।
                </div>
              ) : (
                viewingStockHistoryItem.history.map((log: any) => (
                  <div key={log.id} className="p-3 bg-slate-50 border border-slate-150 rounded-2xl space-y-1.5 text-[11px] font-sans">
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        log.action === "create" ? "bg-blue-100 text-blue-800" :
                        log.action === "refill" ? "bg-emerald-100 text-emerald-800" :
                        log.action === "edit" ? "bg-purple-100 text-purple-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {log.action === "create" ? "➕ निर्मित" :
                         log.action === "refill" ? "📦 जोड़ा गया" :
                         log.action === "edit" ? "✏️ संशोधित" :
                         "🌾 उपयोग (Used)"}
                      </span>
                      <span className="text-[9.5px] text-slate-400 font-mono">
                        {new Date(log.date).toLocaleDateString("hi") + " " + new Date(log.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-bold mt-1 text-[10.5px]">
                      {log.details}
                    </p>
                    <div className="text-[9.5px] text-slate-400 flex justify-between pt-0.5">
                      <span>कर्ता: <strong className="text-slate-600">{log.operatorName}</strong></span>
                      <span>शेष मात्रा: <strong className="text-slate-700">{log.finalQuantity} {viewingStockHistoryItem.unit}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => setViewingStockHistoryItem(null)}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl font-bold cursor-pointer text-xs text-center shadow"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
