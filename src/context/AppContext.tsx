import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { Farmer, Transaction, LaborLog, AuditLog, MandiRate, CropSale } from "../types";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp,
  getDoc,
  getDocs
} from "firebase/firestore";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail
} from "firebase/auth";

// INITIAL SEED DATA FOR SIMULATING 1000+ AGRI ECOSYSTEM STATE
const INITIAL_FARMERS: Farmer[] = [];

const INITIAL_TRANSACTIONS: Transaction[] = [];

const INITIAL_LABOR: LaborLog[] = [];

const INITIAL_AUDITS: AuditLog[] = [];

export const MANDI_FEED_STOCKS: MandiRate[] = [
  { crop: "गेहूं (Wheat)", marketRate: 2470, dailyChange: 1.2 },
  { crop: "धान (Paddy)", marketRate: 2180, dailyChange: -0.8 },
  { crop: "सोयाबीन (Soybean)", marketRate: 4890, dailyChange: 2.1 },
  { crop: "लहसुन (Garlic)", marketRate: 11500, dailyChange: 4.5 },
  { crop: "कपास (Cotton)", marketRate: 7150, dailyChange: -0.3 },
  { crop: "चना (Gram)", marketRate: 5400, dailyChange: 0.5 }
];

interface AppContextType {
  // Views and Modes
  activeViewMode: "desktop" | "mobile" | "offline";
  setActiveViewMode: (v: "desktop" | "mobile" | "offline") => void;
  financialYear: "2026-2027" | "2025-2026";
  setFinancialYear: (fy: "2026-2027" | "2025-2026") => void;
  mobileTab: "home" | "farms" | "labor" | "reports";
  setMobileTab: (tab: "home" | "farms" | "labor" | "reports") => void;

  // Authentication State
  authUser: any | null;
  authReady: boolean;
  currentUser: { id: string; name: string; email: string; role: "super_admin" | "operator"; phone?: string } | null;
  loginError: string | null;
  setLoginError: (err: string | null) => void;
  handleGoogleLogin: () => Promise<void>;
  handleEmailPasswordLogin: (email: string, password: string) => Promise<void>;
  handleEmailPasswordRegister: (name: string, phone: string, email: string, password: string) => Promise<void>;
  handlePasswordReset: (email: string) => Promise<void>;
  handleGuestLogin: () => void;
  handleLogout: () => Promise<void>;
  allOperators: any[];
  createOperatorByAdmin: (name: string, email: string, phone: string, password: string) => Promise<void>;
  updateOperatorProfile: (userId: string, name: string, email: string, phone: string, password?: string) => Promise<void>;
  deleteOperator: (userId: string) => Promise<void>;

  // Synchronized stores
  farmers: Farmer[];
  transactions: Transaction[];
  labors: LaborLog[];
  audits: AuditLog[];
  cropSales: CropSale[];
  isSyncing: boolean;
  cloudCoreEnabled: boolean;
  setCloudCoreEnabled: (v: boolean) => void;

  // Search and Filters
  farmerSearch: string;
  setFarmerSearch: (v: string) => void;
  selectedCropFilter: string;
  setSelectedCropFilter: (v: string) => void;
  clearAllDatabaseData: () => Promise<void>;

  // Mutative Actions (CRUDS)
  logAudit: (action: string, targetId: string, collectionName: "farmers" | "transactions" | "labor" | "crop_sales", details: string) => Promise<void>;
  createFarmer: (farmerForm: any, farmerFarms: any[]) => Promise<void>;
  updateFarmer: (id: string, name: string, village: string, phone: string) => Promise<void>;
  createTransaction: (txForm: any) => Promise<void>;
  updateTransaction: (id: string, txForm: any) => Promise<void>;
  createLabor: (laborForm: any) => Promise<void>;
  updateLabor: (id: string, laborForm: any) => Promise<void>;
  handleAddPlotInline: (farmerId: string, name: string, acreage: number, crop: string) => Promise<string | undefined>;
  handleDeletePlot: (farmerId: string, plotId: string) => Promise<void>;
  handleUpdatePlot: (farmerId: string, plotId: string, name: string, acreage: number, crop: string) => Promise<void>;
  deleteFarmer: (id: string) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteLabor: (id: string) => Promise<void>;
  createCropSale: (saleForm: any) => Promise<void>;
  updateCropSale: (id: string, saleForm: any) => Promise<void>;
  updateCropSaleStatus: (id: string, status: "sold" | "unsold") => Promise<void>;
  deleteCropSale: (id: string) => Promise<void>;

  // Analytics, Exports, Reminders
  roiAnalytics: any[];
  overallIncome: number;
  overallExpense: number;
  overallProfit: number;
  totalSownAcreage: number;
  netEarningsPerAcre: number;
  totalPendingDues: number;
  handleExportData: () => void;
  triggerWhatsAppReminder: (tx: Transaction) => void;

  // Voice States
  simulatedVoiceText: string;
  setSimulatedVoiceText: (v: string) => void;
  isRecording: boolean;
  recordingSeconds: number;
  handleToggleVoiceRecord: (txFormSetter: any, modalOpenSetter: any) => void;

  // Custom Confirm Dialog
  confirmState: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  };
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeViewMode, setActiveViewMode] = useState<"desktop" | "mobile" | "offline">("desktop");
  const [financialYear, setFinancialYear] = useState<"2026-2027" | "2025-2026">("2026-2027");
  const [mobileTab, setMobileTab] = useState<"home" | "farms" | "labor" | "reports">("home");

  const [authUser, setAuthUser] = useState<any | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: "super_admin" | "operator"; phone?: string } | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sync state trackers
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudCoreEnabled, setCloudCoreEnabled] = useState(true);

  // In memory core collections
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [labors, setLabors] = useState<LaborLog[]>([]);
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [cropSales, setCropSales] = useState<CropSale[]>([]);
  const [allOperators, setAllOperators] = useState<any[]>([]);

  // Local state search
  const [farmerSearch, setFarmerSearch] = useState("");
  const [selectedCropFilter, setSelectedCropFilter] = useState("all");

  // Voice Entry Recording states
  const [simulatedVoiceText, setSimulatedVoiceText] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  const [localDataRestored, setLocalDataRestored] = useState(false);

  // Confirm Modal state & API
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const closeConfirm = () => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  };

  // 1. SAVE/RESTORE LOCALSTORAGE FOR PERSISTENCY DURING GUEST OR DEMO MODE
  const saveGuestData = (type: "farmers" | "transactions" | "labors" | "audits" | "crop_sales", data: any[]) => {
    if (currentUser?.id === "guest") {
      localStorage.setItem(`agri_guest_${type}`, JSON.stringify(data));
    }
  };

  useEffect(() => {
    if (currentUser?.id === "guest") {
      const gFarmers = localStorage.getItem("agri_guest_farmers");
      const gTxs = localStorage.getItem("agri_guest_transactions");
      const gLabors = localStorage.getItem("agri_guest_labors");
      const gAudits = localStorage.getItem("agri_guest_audits");
      const gCropSales = localStorage.getItem("agri_guest_crop_sales");

      setFarmers(gFarmers ? JSON.parse(gFarmers) : INITIAL_FARMERS);
      setTransactions(gTxs ? JSON.parse(gTxs) : INITIAL_TRANSACTIONS);
      setLabors(gLabors ? JSON.parse(gLabors) : INITIAL_LABOR);
      setAudits(gAudits ? JSON.parse(gAudits) : INITIAL_AUDITS);
      setCropSales(gCropSales ? JSON.parse(gCropSales) : []);
      setLocalDataRestored(true);
    } else {
      setLocalDataRestored(false);
    }
  }, [currentUser]);

  // Sync back local updates (only runs after data is initially restored)
  useEffect(() => {
    if (currentUser?.id === "guest" && localDataRestored) {
      saveGuestData("farmers", farmers);
    }
  }, [farmers, currentUser, localDataRestored]);

  useEffect(() => {
    if (currentUser?.id === "guest" && localDataRestored) {
      saveGuestData("transactions", transactions);
    }
  }, [transactions, currentUser, localDataRestored]);

  useEffect(() => {
    if (currentUser?.id === "guest" && localDataRestored) {
      saveGuestData("labors", labors);
    }
  }, [labors, currentUser, localDataRestored]);

  useEffect(() => {
    if (currentUser?.id === "guest" && localDataRestored) {
      saveGuestData("audits", audits);
    }
  }, [audits, currentUser, localDataRestored]);

  useEffect(() => {
    if (currentUser?.id === "guest" && localDataRestored) {
      saveGuestData("crop_sales", cropSales);
    }
  }, [cropSales, currentUser, localDataRestored]);

  // Auth Subscription
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setAuthReady(false);
      if (user) {
        setAuthUser(user);
        const userRef = doc(db, "users", user.uid);
        try {
          const userDoc = await getDoc(userRef);
          let profileRole: "super_admin" | "operator" = "super_admin";
          
          if (userDoc.exists()) {
            const uData = userDoc.data();
            const isActuallyAssistant = uData.isAssistant === true || !!uData.createdByAdminId;
            let resolvedRole: "super_admin" | "operator" = "super_admin";
            if (isActuallyAssistant || uData.role === "operator_assistant") {
              resolvedRole = "operator";
            }
            
            // Auto migrate role to super_admin in Firestore for existing main farmers
            if (resolvedRole === "super_admin" && uData.role !== "super_admin") {
              await setDoc(userRef, { role: "super_admin" }, { merge: true });
            }

            setCurrentUser({
              id: user.uid,
              name: uData.name || "कृषि उपयोगकर्ता",
              email: uData.email || user.email || "",
              role: resolvedRole,
              phone: uData.phone || "",
            });
          } else {
            const newProfile = {
              id: user.uid,
              name: user.displayName || "कृषि उपयोगकर्ता",
              email: user.email || "",
              role: "super_admin" as const,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
            await setDoc(userRef, newProfile);
            setCurrentUser({
              id: user.uid,
              name: newProfile.name,
              email: newProfile.email,
              role: "super_admin",
            });
          }

          // Bootstrapper Check & Seeding COMPLETELY TURNED OFF to always respect manual connected user entries.
          console.log("No seeding triggered: starting with a 100% clean slate.");
        } catch (error) {
          console.error("Critical Seeding/Auth Error: ", error);
        }
      } else {
        setAuthUser(null);
        setCurrentUser(null);
      }
      setAuthReady(true);
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time Listeners
  useEffect(() => {
    if (!currentUser || currentUser.id === "guest") return;

    const unsubscribeFarmers = onSnapshot(collection(db, "farmers"), (snapshot) => {
      const list: Farmer[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        list.push({
          id: d.id,
          name: d.name,
          village: d.village,
          phone: d.phone,
          totalAcreage: d.totalAcreage,
          activeCrop: d.activeCrop,
          farms: d.farms || [],
          createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt || new Date().toISOString(),
          updatedAt: d.updatedAt?.toDate?.()?.toISOString() || d.updatedAt || new Date().toISOString(),
          createdByOperatorId: d.createdByOperatorId,
          lastUpdatedByOperatorId: d.lastUpdatedByOperatorId,
        });
      });
      setFarmers(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "farmers");
    });

    const unsubscribeTransactions = onSnapshot(collection(db, "transactions"), (snapshot) => {
      const list: Transaction[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        list.push({
          id: d.id,
          farmerId: d.farmerId,
          farmId: d.farmId,
          crop: d.crop,
          type: d.type as any,
          category: d.category,
          amount: d.amount,
          date: d.date,
          financialYear: d.financialYear,
          isMandiSale: d.isMandiSale,
          mandiDetails: d.mandiDetails,
          isCreditSale: d.isCreditSale,
          creditDetails: d.creditDetails,
          paymentStatus: d.paymentStatus as any,
          voiceNoteUrl: d.voiceNoteUrl,
          voiceTranscription: d.voiceTranscription,
          createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt || new Date().toISOString(),
          updatedAt: d.updatedAt?.toDate?.()?.toISOString() || d.updatedAt || new Date().toISOString(),
          createdByOperatorId: d.createdByOperatorId,
          lastUpdatedByOperatorId: d.lastUpdatedByOperatorId,
          grossWeight: d.grossWeight !== undefined ? d.grossWeight : (d.mandiDetails?.grossWeight ?? null),
          deductionRate: d.deductionRate !== undefined ? d.deductionRate : (d.mandiDetails?.deductionRate ?? null),
          deductions: d.deductions !== undefined ? d.deductions : (d.mandiDetails?.deductions ?? null),
          netWeight: d.netWeight !== undefined ? d.netWeight : (d.mandiDetails?.netWeight ?? null),
          ratePerQuintal: d.ratePerQuintal !== undefined ? d.ratePerQuintal : (d.mandiDetails?.ratePerQuintal ?? null),
          traderName: d.traderName !== undefined ? d.traderName : (d.mandiDetails?.traderName ?? null),
          deductKg: d.deductKg !== undefined ? d.deductKg : (d.mandiDetails?.deductKg ?? null),
          rateType: d.rateType !== undefined ? d.rateType : (d.mandiDetails?.rateType ?? null),
          pendingAmount: d.pendingAmount !== undefined ? d.pendingAmount : (d.creditDetails?.pendingAmount ?? null),
          dueDate: d.dueDate !== undefined ? d.dueDate : (d.creditDetails?.dueDate ?? null),
          editLogs: d.editLogs || [],
        });
      });
      setTransactions(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "transactions");
    });

    const unsubscribeLabor = onSnapshot(collection(db, "labor"), (snapshot) => {
      const list: LaborLog[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        list.push({
          id: d.id,
          farmerId: d.farmerId,
          farmId: d.farmId,
          date: d.date,
          crop: d.crop,
          mode: d.mode as any,
          individualDetails: d.individualDetails,
          bulkDetails: d.bulkDetails,
          contractAmount: d.contractAmount,
          advancePaid: d.advancePaid,
          dueBalance: d.dueBalance,
          createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt || new Date().toISOString(),
          updatedAt: d.updatedAt?.toDate?.()?.toISOString() || d.updatedAt || new Date().toISOString(),
          createdByOperatorId: d.createdByOperatorId,
          lastUpdatedByOperatorId: d.lastUpdatedByOperatorId,
        });
      });
      setLabors(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "labor");
    });

    const unsubscribeAudits = onSnapshot(collection(db, "audits"), (snapshot) => {
      const list: AuditLog[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        list.push({
          id: d.id,
          operatorId: d.operatorId,
          operatorName: d.operatorName,
          action: d.action,
          targetId: d.targetId,
          targetCollection: d.targetCollection as any,
          timestamp: d.timestamp,
          details: d.details,
        });
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setAudits(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "audits");
    });

    const unsubscribeCropSales = onSnapshot(collection(db, "crop_sales"), (snapshot) => {
      const list: CropSale[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        list.push({
          id: d.id,
          farmerId: d.farmerId,
          farmerName: d.farmerName,
          farmId: d.farmId,
          farmName: d.farmName,
          cropName: d.cropName,
          quantityEstimated: Number(d.quantityEstimated || 0),
          unit: d.unit || "kg",
          estimatedPrice: Number(d.estimatedPrice || 0),
          status: d.status || "unsold",
          soldAt: d.soldAt || null,
          createdAt: d.createdAt?.seconds ? new Date(d.createdAt.seconds * 1000).toISOString() : (d.createdAt || new Date().toISOString()),
          updatedAt: d.updatedAt?.seconds ? new Date(d.updatedAt.seconds * 1000).toISOString() : (d.updatedAt || new Date().toISOString()),
          createdByOperatorId: d.createdByOperatorId,
          lastUpdatedByOperatorId: d.lastUpdatedByOperatorId
        });
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setCropSales(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "crop_sales");
    });

    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        list.push({
          id: d.id || doc.id,
          name: d.name || "",
          email: d.email || "",
          phone: d.phone || "",
          role: d.role || "operator",
          createdAt: d.createdAt || new Date().toISOString(),
          updatedAt: d.updatedAt || new Date().toISOString(),
        });
      });
      setAllOperators(list);
    }, (error) => {
      console.warn("Could not listen to users in real time:", error);
    });

    return () => {
      unsubscribeFarmers();
      unsubscribeTransactions();
      unsubscribeLabor();
      unsubscribeAudits();
      unsubscribeCropSales();
      unsubscribeUsers();
    };
  }, [currentUser]);

  // Secure Auditing
  const logAudit = async (action: string, targetId: string, collectionName: "farmers" | "transactions" | "labor" | "crop_sales", details: string) => {
    if (!currentUser) return;
    const auditId = "audit_" + Date.now();
    const newAudit: AuditLog = {
      id: auditId,
      operatorId: currentUser.id === "guest" ? "guest_visitor" : auth.currentUser!.uid,
      operatorName: currentUser.name,
      action,
      targetId,
      targetCollection: collectionName,
      timestamp: new Date().toISOString(),
      details
    };
    if (currentUser.id === "guest") {
      setAudits((prev) => [newAudit, ...prev]);
      return;
    }
    try {
      await setDoc(doc(db, "audits", auditId), newAudit);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `audits/${auditId}`);
    }
  };

  // Google Provider actions
  const handleGoogleLogin = async () => {
    setLoginError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Popup login error: ", error);
      setLoginError(error.message || String(error));
    }
  };

  const handleEmailPasswordLogin = async (email: string, password: string) => {
    setLoginError(null);
    const cleanEmail = email ? email.trim().toLowerCase() : "";
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (error: any) {
      console.error("Email login error: ", error);
      let errMsg = "लॉगिन विफल रहा। कृपया सही ईमेल और पासवर्ड दर्ज करें।";
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errMsg = "गलत ईमेल या पासवर्ड! कृपया जांचें।";
      } else if (error.code === "auth/invalid-email") {
        errMsg = "अमान्य ईमेल आईडी संरचना!";
      } else if (error.code === "auth/missing-password") {
        errMsg = "कृपया पासवर्ड दर्ज करें!";
      }
      setLoginError(errMsg);
      throw new Error(errMsg);
    }
  };

  const handleEmailPasswordRegister = async (name: string, phone: string, email: string, password: string) => {
    setLoginError(null);
    const cleanEmail = email ? email.trim().toLowerCase() : "";
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;
      
      // Save operator profile to users collection
      const userRef = doc(db, "users", user.uid);
      let profileRole: "super_admin" | "operator" = "super_admin";
      const newProfile = {
        id: user.uid,
        name: name,
        email: cleanEmail,
        phone: phone,
        role: profileRole, // Use dynamically resolved role
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      try {
        await setDoc(userRef, newProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
      }
      
      setCurrentUser({
        id: user.uid,
        name: newProfile.name,
        email: newProfile.email,
        role: newProfile.role,
        phone: newProfile.phone,
      });
    } catch (error: any) {
      console.error("Email registration error: ", error);
      let errMsg = "उपयोगकर्ता पंजीकरण विफल रहा!";
      if (error.code === "auth/email-already-in-use") {
        errMsg = "यह ईमेल आईडी पहले से उपयोग में है!";
      } else if (error.code === "auth/weak-password") {
        errMsg = "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए!";
      } else if (error.code === "auth/invalid-email") {
        errMsg = "अमान्य ईमेल प्रारूप!";
      }
      setLoginError(errMsg);
      throw new Error(errMsg);
    }
  };

  const handlePasswordReset = async (email: string) => {
    setLoginError(null);
    const cleanEmail = email ? email.trim().toLowerCase() : "";
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch (error: any) {
      console.error("Password reset error: ", error);
      let errMsg = "पासवर्ड रीसेट लिंक भेजने में त्रुटि हुई।";
      if (error.code === "auth/user-not-found") {
        errMsg = "इस ईमेल आईडी का कोई उपयोगकर्ता नहीं मिला!";
      } else if (error.code === "auth/invalid-email") {
        errMsg = "अमान्य ईमेल प्रारूप!";
      }
      setLoginError(errMsg);
      throw new Error(errMsg);
    }
  };

  const handleGuestLogin = () => {
    setCurrentUser({
      id: "guest",
      name: "पब्लिक दर्शक (Guest Visitor)",
      email: "guest@agriportal.in",
      role: "operator"
    });
  };

  const handleLogout = async () => {
    if (currentUser?.id === "guest") {
      setCurrentUser(null);
      setFarmers([]);
      setTransactions([]);
      setLabors([]);
      setAudits([]);
      localStorage.removeItem("agri_guest_farmers");
      localStorage.removeItem("agri_guest_transactions");
      localStorage.removeItem("agri_guest_labors");
      localStorage.removeItem("agri_guest_audits");
      return;
    }
    await signOut(auth);
  };

  const createOperatorByAdmin = async (name: string, email: string, phone: string, password: string) => {
    const isMainUser = currentUser?.role === "super_admin" || currentUser?.email?.toLowerCase().trim() === "kachramtech@gmail.com";
    if (!isMainUser) {
      throw new Error("केवल मुख्य स्वामी ही नया ऑपरेटर जोड़ सकता है!");
    }
    const cleanEmail = email.trim().toLowerCase();
    let uid = "op_" + Date.now();
    try {
      const { initializeApp, deleteApp } = await import("firebase/app");
      const { getAuth, createUserWithEmailAndPassword } = await import("firebase/auth");
      const firebaseConfig = (await import("../../firebase-applet-config.json")).default;
      const secApp = initializeApp(firebaseConfig, `SecondaryApp_${Date.now()}`);
      const secAuth = getAuth(secApp);
      const userCred = await createUserWithEmailAndPassword(secAuth, cleanEmail, password);
      uid = userCred.user.uid;
      await deleteApp(secApp);
    } catch (e: any) {
      console.warn("Failed creating secondary Auth user account. Creating fallback in database:", e);
    }

    const userRef = doc(db, "users", uid);
    const newProfile = {
      id: uid,
      name,
      email: cleanEmail,
      phone,
      role: "operator" as const,
      isAssistant: true,
      createdByAdminId: currentUser?.id || "main_admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(userRef, newProfile);
    await logAudit("CREATE_OPERATOR", uid, "farmers", `नया ऑपरेटर जोड़ा गया: ${name}, ईमेल: ${cleanEmail}`);
  };

  const deleteOperator = async (userId: string) => {
    const isMainUser = currentUser?.role === "super_admin" || currentUser?.email?.toLowerCase().trim() === "kachramtech@gmail.com";
    if (!isMainUser) {
      throw new Error("केवल मुख्य स्वामी ही ऑपरेटर को हटा सकता है!");
    }
    const userRef = doc(db, "users", userId);
    try {
      const userDoc = await getDoc(userRef);
      const uData = userDoc.data();
      const opName = uData?.name || "ऑपरेटर";
      await deleteDoc(userRef);
      await logAudit("DELETE_OPERATOR", userId, "farmers", `सहायक ऑपरेटर हटाया गया: ${opName}, ID: ${userId}`);
    } catch (error) {
      console.error("Error deleting operator:", error);
      throw error;
    }
  };

  const updateOperatorProfile = async (userId: string, name: string, email: string, phone: string, password?: string) => {
    const userRef = doc(db, "users", userId);
    const updates: any = {
      name,
      email: email.trim().toLowerCase(),
      phone,
      updatedAt: new Date().toISOString()
    };
    await setDoc(userRef, updates, { merge: true });

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, id: prev.id, role: prev.role, name, email, phone } : null);
    }

    if (auth.currentUser && auth.currentUser.uid === userId) {
      if (email && auth.currentUser.email !== email) {
        try {
          await updateEmail(auth.currentUser, email);
        } catch (e) {
          console.error("Auth email update failed:", e);
        }
      }
      if (password) {
        try {
          await updatePassword(auth.currentUser, password);
        } catch (e) {
          console.error("Auth password update failed:", e);
        }
      }
    }
    await logAudit("UPDATE_OPERATOR_PROFILE", userId, "farmers", `ऑपरेटर प्रोफाइल अपडेट किया गया: ${name}, ईमेल: ${email}`);
  };

  // Farmer creation
  const createFarmer = async (farmerForm: any, farmerFarms: any[]) => {
    const id = "farmer_" + Date.now();
    const finalFarms = farmerFarms.length > 0
      ? farmerFarms
      : [{ id: "farm_" + Date.now() + "_1", name: "मुख्य खेत (Main Farm)", acreage: Number(farmerForm.totalAcreage), activeCrop: farmerForm.activeCrop }];

    const calculatedTotalAcreage = finalFarms.reduce((sum, f) => sum + Number(f.acreage), 0);

    const farmerPayload: Farmer = {
      id,
      name: farmerForm.name,
      village: farmerForm.village,
      phone: farmerForm.phone,
      totalAcreage: Number(calculatedTotalAcreage.toFixed(2)),
      activeCrop: finalFarms[0]?.activeCrop || farmerForm.activeCrop,
      farms: finalFarms,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByOperatorId: currentUser?.id === "guest" ? "guest_visitor" : auth.currentUser!.uid,
      lastUpdatedByOperatorId: currentUser?.id === "guest" ? "guest_visitor" : auth.currentUser!.uid
    };

    if (currentUser?.id === "guest") {
      setFarmers((prev) => [farmerPayload, ...prev]);
      await logAudit("CREATE_FARMER", id, "farmers", `पंजीकृत किसान: ${farmerForm.name}, ग्राम: ${farmerForm.village}, कुल खेत: ${finalFarms.length}, कुल रकबा: ${calculatedTotalAcreage} एकड़`);
      return;
    }

    try {
      await setDoc(doc(db, "farmers", id), {
        ...farmerPayload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await logAudit("CREATE_FARMER", id, "farmers", `पंजीकृत किसान: ${farmerForm.name}, ग्राम: ${farmerForm.village}, कुल खेत: ${finalFarms.length}, कुल रकबा: ${calculatedTotalAcreage} एकड़`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `farmers/${id}`);
    }
  };

  const updateFarmer = async (id: string, name: string, village: string, phone: string) => {
    const targetFarmer = farmers.find(f => f.id === id);
    if (!targetFarmer) return;

    const opId = currentUser?.id === "guest" ? "guest_visitor" : auth.currentUser?.uid || "unknown";

    const updatedFarmer: Farmer = {
      ...targetFarmer,
      name,
      village,
      phone,
      updatedAt: new Date().toISOString(),
      lastUpdatedByOperatorId: opId
    };

    if (currentUser?.id === "guest") {
      setFarmers((prev) => prev.map((f) => f.id === id ? updatedFarmer : f));
      await logAudit("UPDATE_FARMER", id, "farmers", `संशोधित किसान विवरण: ${name}, ग्राम: ${village}, फ़ोन: ${phone}`);
      return;
    }

    try {
      await setDoc(doc(db, "farmers", id), {
        ...updatedFarmer,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      await logAudit("UPDATE_FARMER", id, "farmers", `संशोधित किसान विवरण: ${name}, ग्राम: ${village}, फ़ोन: ${phone}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `farmers/${id}`);
    }
  };

  // Transaction creation
  const createTransaction = async (txForm: any) => {
    let calculatedAmount = Number(txForm.amount);
    let calculatedDeductions = 0;
    let netWeight = 0;

    let mandiPayload: any = null;
    if (txForm.isMandiSale) {
      const gross = Number(txForm.grossWeight || 0);
      const deductKg = Number(txForm.deductKg || 0);
      const rateVal = Number(txForm.amount || 0); // Rate entered
      const rateType = txForm.rateType || "quintal"; // 'kg' or 'quintal'

      netWeight = gross - deductKg;
      calculatedDeductions = deductKg;
      
      if (rateType === "kg") {
        calculatedAmount = netWeight * rateVal;
      } else {
        calculatedAmount = netWeight * (rateVal / 100);
      }

      mandiPayload = {
        grossWeight: gross,
        deductionRate: Number(((deductKg / (gross || 1)) * 100).toFixed(2)),
        deductions: deductKg,
        netWeight: Number(netWeight.toFixed(2)),
        ratePerQuintal: rateVal,
        traderName: txForm.traderName || "अज्ञात मंडी आढ़त",
        deductKg: deductKg,
        rateType: rateType
      };
    }

    const id = "tx_" + Date.now();

    let creditPayload: any = null;
    if (txForm.isCreditSale) {
      creditPayload = {
        pendingAmount: Number(txForm.pendingAmount !== undefined ? txForm.pendingAmount : calculatedAmount),
        dueDate: txForm.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      };
    }

    const txPayload = {
      id,
      farmerId: txForm.farmerId,
      farmId: txForm.farmId || null,
      crop: txForm.crop || "",
      type: txForm.type,
      category: txForm.category,
      amount: Number(calculatedAmount.toFixed(2)),
      date: txForm.date,
      financialYear: financialYear,
      isMandiSale: !!txForm.isMandiSale,
      isCreditSale: !!txForm.isCreditSale,
      paymentStatus: txForm.paymentStatus || "paid",
      voiceNoteUrl: simulatedVoiceText ? "unprocessed_voice_recording_memo" : null,
      voiceTranscription: simulatedVoiceText || txForm.voiceTranscription || null,
      mandiDetails: mandiPayload || null,
      creditDetails: creditPayload || null,
      grossWeight: txForm.isMandiSale && mandiPayload ? mandiPayload.grossWeight : null,
      deductionRate: txForm.isMandiSale && mandiPayload ? mandiPayload.deductionRate : null,
      deductions: txForm.isMandiSale && mandiPayload ? mandiPayload.deductions : null,
      netWeight: txForm.isMandiSale && mandiPayload ? mandiPayload.netWeight : null,
      ratePerQuintal: txForm.isMandiSale && mandiPayload ? mandiPayload.ratePerQuintal : null,
      traderName: txForm.isMandiSale && mandiPayload ? mandiPayload.traderName : null,
      deductKg: txForm.isMandiSale && mandiPayload ? Number(txForm.deductKg || 0) : null,
      rateType: txForm.isMandiSale && mandiPayload ? (txForm.rateType || "quintal") : null,
      pendingAmount: txForm.isCreditSale && creditPayload ? creditPayload.pendingAmount : null,
      dueDate: txForm.isCreditSale && creditPayload ? creditPayload.dueDate : null,
    };

    if (currentUser?.id === "guest") {
      const guestTxPayload: Transaction = {
        ...txPayload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdByOperatorId: "guest_visitor",
        lastUpdatedByOperatorId: "guest_visitor"
      };
      setTransactions((prev) => [guestTxPayload, ...prev]);
      const targetFarmer = farmers.find((f) => f.id === txForm.farmerId);
      const targetFarmName = targetFarmer?.farms?.find(f => f.id === txForm.farmId)?.name || "मुख्य खेत";
      await logAudit(
        "CREATE_TRANSACTION", 
        id, 
        "transactions", 
        `${txForm.type === "income" ? "कमाई" : "खर्चा"} दर्ज: किसान ${targetFarmer?.name || "अज्ञात"} (${targetFarmName}), राशि: ₹${guestTxPayload.amount} [श्रेणी: ${txForm.category}]`
      );
      return;
    }

    try {
      await setDoc(doc(db, "transactions", id), {
        ...txPayload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdByOperatorId: auth.currentUser!.uid,
        lastUpdatedByOperatorId: auth.currentUser!.uid
      });
      const targetFarmer = farmers.find((f) => f.id === txForm.farmerId);
      const targetFarmName = targetFarmer?.farms?.find(f => f.id === txForm.farmId)?.name || "मुख्य खेत";
      await logAudit(
        "CREATE_TRANSACTION", 
        id, 
        "transactions", 
        `${txForm.type === "income" ? "कमाई" : "खर्चा"} दर्ज: किसान ${targetFarmer?.name || "अज्ञात"} (${targetFarmName}), राशि: ₹${txPayload.amount} [श्रेणी: ${txForm.category}]`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `transactions/${id}`);
    }
  };

  // Transaction Update
  const updateTransaction = async (id: string, txForm: any) => {
    const targetTx = transactions.find(t => t.id === id);
    if (!targetTx) return;

    let calculatedAmount = Number(txForm.amount);
    let calculatedDeductions = 0;
    let netWeight = 0;

    let mandiPayload: any = null;
    if (txForm.isMandiSale) {
      const gross = Number(txForm.grossWeight || 0);
      const deductKg = Number(txForm.deductKg || 0);
      const rateVal = Number(txForm.amount || 0); // Rate entered
      const rateType = txForm.rateType || "quintal"; // 'kg' or 'quintal'

      netWeight = gross - deductKg;
      calculatedDeductions = deductKg;
      
      if (rateType === "kg") {
        calculatedAmount = netWeight * rateVal;
      } else {
        calculatedAmount = netWeight * (rateVal / 100);
      }

      mandiPayload = {
        grossWeight: gross,
        deductionRate: Number(((deductKg / (gross || 1)) * 100).toFixed(2)),
        deductions: deductKg,
        netWeight: Number(netWeight.toFixed(2)),
        ratePerQuintal: rateVal,
        traderName: txForm.traderName || "अज्ञात मंडी आढ़त",
        deductKg: deductKg,
        rateType: rateType
      };
    }

    let creditPayload: any = null;
    if (txForm.isCreditSale) {
      creditPayload = {
        pendingAmount: Number(txForm.pendingAmount !== undefined ? txForm.pendingAmount : calculatedAmount),
        dueDate: txForm.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      };
    }

    const changedFields: string[] = [];
    if (targetTx) {
      if (Number(targetTx.amount || 0) !== Number(calculatedAmount)) {
        changedFields.push(`राशि: ₹${targetTx.amount || 0} ➔ ₹${calculatedAmount}`);
      }
      if ((targetTx.crop || "") !== (txForm.crop || "")) {
        changedFields.push(`फसल: ${targetTx.crop || "N/A"} ➔ ${txForm.crop || "N/A"}`);
      }
      if ((targetTx.date || "") !== (txForm.date || "")) {
        changedFields.push(`तारीख: ${targetTx.date || "N/A"} ➔ ${txForm.date || "N/A"}`);
      }
      if (targetTx.isMandiSale !== !!txForm.isMandiSale) {
        changedFields.push(`मंडी बिक्री स्थिति: ${targetTx.isMandiSale ? "हाँ" : "नहीं"} ➔ ${txForm.isMandiSale ? "हाँ" : "नहीं"}`);
      } else if (txForm.isMandiSale) {
        const prevGross = targetTx.grossWeight || 0;
        const newGross = Number(txForm.grossWeight || 0);
        if (prevGross !== newGross) {
          changedFields.push(`कुल वजन: ${prevGross}kg ➔ ${newGross}kg`);
        }
        const prevDeduct = targetTx.deductKg || 0;
        const newDeduct = Number(txForm.deductKg || 0);
        if (prevDeduct !== newDeduct) {
          changedFields.push(`वजन कटौती: ${prevDeduct}kg ➔ ${newDeduct}kg`);
        }
        const prevRate = targetTx.ratePerQuintal || 0;
        const newRate = Number(txForm.amount || 0);
        if (prevRate !== newRate) {
          changedFields.push(`दर/भाव: ₹${prevRate} ➔ ₹${newRate}`);
        }
      }
      if (targetTx.isCreditSale !== !!txForm.isCreditSale) {
        changedFields.push(`उधारी स्थिति: ${targetTx.isCreditSale ? "हाँ" : "नहीं"} ➔ ${txForm.isCreditSale ? "हाँ" : "नहीं"}`);
      } else if (txForm.isCreditSale) {
        const prevPending = targetTx.pendingAmount || 0;
        const newPending = Number(txForm.pendingAmount || 0);
        if (prevPending !== newPending) {
          changedFields.push(`उधारी बकाया राशि: ₹${prevPending} ➔ ₹${newPending}`);
        }
      }
    }

    const editHistoryLogs = [
      ...(targetTx.editLogs || []),
    ];

    if (changedFields.length > 0) {
      editHistoryLogs.push({
        timestamp: new Date().toISOString(),
        changedText: changedFields.join(", "),
        operator: currentUser?.name || "मुख्य यूजर"
      });
    }

    const txPayload = {
      ...targetTx,
      farmerId: txForm.farmerId,
      farmId: txForm.farmId || null,
      crop: txForm.crop || "",
      category: txForm.category,
      amount: Number(calculatedAmount.toFixed(2)),
      date: txForm.date,
      isMandiSale: !!txForm.isMandiSale,
      isCreditSale: !!txForm.isCreditSale,
      paymentStatus: txForm.paymentStatus || "paid",
      mandiDetails: mandiPayload || null,
      creditDetails: creditPayload || null,
      updatedAt: new Date().toISOString(),
      lastUpdatedByOperatorId: currentUser?.id === "guest" ? "guest_visitor" : auth.currentUser?.uid || "unknown",
      // Flattened properties for convenience
      grossWeight: txForm.isMandiSale && mandiPayload ? mandiPayload.grossWeight : null,
      deductionRate: txForm.isMandiSale && mandiPayload ? mandiPayload.deductionRate : null,
      deductions: txForm.isMandiSale && mandiPayload ? mandiPayload.deductions : null,
      netWeight: txForm.isMandiSale && mandiPayload ? mandiPayload.netWeight : null,
      ratePerQuintal: txForm.isMandiSale && mandiPayload ? mandiPayload.ratePerQuintal : null,
      traderName: txForm.isMandiSale && mandiPayload ? mandiPayload.traderName : null,
      deductKg: txForm.isMandiSale && mandiPayload ? Number(txForm.deductKg || 0) : null,
      rateType: txForm.isMandiSale && mandiPayload ? (txForm.rateType || "quintal") : null,
      pendingAmount: txForm.isCreditSale && creditPayload ? creditPayload.pendingAmount : null,
      dueDate: txForm.isCreditSale && creditPayload ? creditPayload.dueDate : null,
      editLogs: editHistoryLogs,
    };

    if (currentUser?.id === "guest") {
      setTransactions((prev) => prev.map((t) => t.id === id ? { ...txPayload, createdAt: t.createdAt } as any : t));
      await logAudit(
        "UPDATE_TRANSACTION", 
        id, 
        "transactions", 
        `संशोधित लेनदेन विवरण ID: ${id}, राशि: ₹${txPayload.amount} [श्रेणी: ${txForm.category}]`
      );
      return;
    }

    try {
      await setDoc(doc(db, "transactions", id), {
        ...txPayload,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      await logAudit(
        "UPDATE_TRANSACTION", 
        id, 
        "transactions", 
        `संशोधित लेनदेन विवरण ID: ${id}, राशि: ₹${txPayload.amount} [श्रेणी: ${txForm.category}]`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `transactions/${id}`);
    }
  };

  // Labor Creation
  const createLabor = async (laborForm: any) => {
    const id = "labor_" + Date.now();
    const subContract = Number(laborForm.contractAmount);
    const subAdvance = Number(laborForm.advancePaid);
    const subBalance = subContract - subAdvance;

    const laborPayload = {
      id,
      farmerId: laborForm.farmerId,
      farmId: laborForm.farmId || null,
      date: laborForm.date,
      crop: laborForm.crop,
      mode: laborForm.mode,
      contractAmount: subContract,
      advancePaid: subAdvance,
      dueBalance: subBalance,
      individualDetails: laborForm.mode === "individual" ? {
        laborerName: laborForm.laborerName || "मजदूर",
        attendance: laborForm.attendance
      } : null,
      bulkDetails: laborForm.mode === "bulk_gang" ? {
        workersCount: Number(laborForm.workersCount),
        groupName: laborForm.groupName || "अनाम टोली",
        workDescription: laborForm.workDescription || "विविध कृषि कार्य"
      } : null,
      ...(laborForm.mode === "individual" ? {
        laborerName: laborForm.laborerName || "मजदूर",
        attendance: laborForm.attendance
      } : {
        workersCount: Number(laborForm.workersCount),
        groupName: laborForm.groupName || "अनाम टोली",
        workDescription: laborForm.workDescription || "विविध कृषि कार्य"
      })
    };

    if (currentUser?.id === "guest") {
      const guestLaborPayload: LaborLog = {
        ...laborPayload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdByOperatorId: "guest_visitor",
        lastUpdatedByOperatorId: "guest_visitor"
      };
      setLabors((prev) => [guestLaborPayload, ...prev]);
      const fName = farmers.find(f => f.id === laborForm.farmerId)?.name || "किसान";
      const targetFarmName = farmers.find(f => f.id === laborForm.farmerId)?.farms?.find(fa => fa.id === laborForm.farmId)?.name || "मुख्य खेत";
      await logAudit(
        "CREATE_LABOR", 
        id, 
        "labor", 
        `लेबर दर्ज (खेत: ${targetFarmName}): किसान ${fName}, कुल राशि: ₹${subContract}, बकाया राशि: ₹${subBalance}`
      );
      return;
    }

    try {
      await setDoc(doc(db, "labor", id), {
        ...laborPayload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdByOperatorId: auth.currentUser!.uid,
        lastUpdatedByOperatorId: auth.currentUser!.uid
      });
      const fName = farmers.find(f => f.id === laborForm.farmerId)?.name || "किसान";
      const targetFarmName = farmers.find(f => f.id === laborForm.farmerId)?.farms?.find(fa => fa.id === laborForm.farmId)?.name || "मुख्य खेत";
      await logAudit(
        "CREATE_LABOR", 
        id, 
        "labor", 
        `लेबर दर्ज (खेत: ${targetFarmName}): किसान ${fName}, कुल राशि: ₹${subContract}, बकाया राशि: ₹${subBalance}`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `labor/${id}`);
    }
  };

  // Labor Update
  const updateLabor = async (id: string, laborForm: any) => {
    const subContract = Number(laborForm.contractAmount);
    const subAdvance = Number(laborForm.advancePaid);
    const subBalance = subContract - subAdvance;

    const laborPayload = {
      farmerId: laborForm.farmerId,
      farmId: laborForm.farmId || null,
      date: laborForm.date,
      crop: laborForm.crop,
      mode: laborForm.mode,
      contractAmount: subContract,
      advancePaid: subAdvance,
      dueBalance: subBalance,
      individualDetails: laborForm.mode === "individual" ? {
        laborerName: laborForm.laborerName || "मजदूर",
        attendance: laborForm.attendance
      } : null,
      bulkDetails: laborForm.mode === "bulk_gang" ? {
        workersCount: Number(laborForm.workersCount),
        groupName: laborForm.groupName || "अनाम टोली",
        workDescription: laborForm.workDescription || "विविध कृषि कार्य"
      } : null,
      ...(laborForm.mode === "individual" ? {
        laborerName: laborForm.laborerName || "मजदूर",
        attendance: laborForm.attendance
      } : {
        workersCount: Number(laborForm.workersCount),
        groupName: laborForm.groupName || "अनाम टोली",
        workDescription: laborForm.workDescription || "विविध कृषि कार्य"
      })
    };

    if (currentUser?.id === "guest") {
      setLabors((prev) => prev.map(l => {
        if (l.id === id) {
          return {
            ...l,
            ...laborPayload,
            updatedAt: new Date().toISOString()
          };
        }
        return l;
      }));
      const fName = farmers.find(f => f.id === laborForm.farmerId)?.name || "किसान";
      const targetFarmName = farmers.find(f => f.id === laborForm.farmerId)?.farms?.find(fa => fa.id === laborForm.farmId)?.name || "मुख्य खेत";
      await logAudit(
        "UPDATE_LABOR", 
        id, 
        "labor", 
        `लेबर संशोधित (खेत: ${targetFarmName}): किसान ${fName}, कुल राशि: ₹${subContract}, बकाया राशि: ₹${subBalance}`
      );
      return;
    }

    try {
      await setDoc(doc(db, "labor", id), {
        ...laborPayload,
        updatedAt: serverTimestamp()
      }, { merge: true });
      const fName = farmers.find(f => f.id === laborForm.farmerId)?.name || "किसान";
      const targetFarmName = farmers.find(f => f.id === laborForm.farmerId)?.farms?.find(fa => fa.id === laborForm.farmId)?.name || "मुख्य खेत";
      await logAudit(
        "UPDATE_LABOR", 
        id, 
        "labor", 
        `लेबर संशोधित (खेत: ${targetFarmName}): किसान ${fName}, कुल राशि: ₹${subContract}, बकाया राशि: ₹${subBalance}`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `labor/${id}`);
    }
  };

  // Farmer plot inline creator
  const handleAddPlotInline = async (farmerId: string, name: string, acreage: number, crop: string): Promise<string | undefined> => {
    const targetFarmer = farmers.find(f => f.id === farmerId);
    if (!targetFarmer) return undefined;

    const newPlot = {
      id: "farm_" + Date.now(),
      name,
      acreage: Number(acreage),
      activeCrop: crop
    };

    const updatedFarms = [...(targetFarmer.farms || []), newPlot];
    const updatedTotalAcreage = updatedFarms.reduce((sum, f) => sum + f.acreage, 0);

    if (currentUser?.id === "guest") {
      setFarmers(prev => prev.map(f => f.id === farmerId ? { ...f, farms: updatedFarms, totalAcreage: Number(updatedTotalAcreage.toFixed(2)) } : f));
      await logAudit("CREATE_FARM_PLOT", farmerId, "farmers", `नया खेत प्लॉट ${name} जोड़ा गया किसान ${targetFarmer.name} के लिए`);
      return newPlot.id;
    }

    try {
      const docRef = doc(db, "farmers", farmerId);
      await setDoc(docRef, {
        ...targetFarmer,
        farms: updatedFarms,
        totalAcreage: Number(updatedTotalAcreage.toFixed(2)),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      await logAudit("CREATE_FARM_PLOT", farmerId, "farmers", `नया खेत प्लॉट ${name} जोड़ा गया किसान ${targetFarmer.name} के लिए`);
      return newPlot.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `farmers/${farmerId}`);
      return undefined;
    }
  };

  // Farmer plot inline deletion handler
  const handleDeletePlot = async (farmerId: string, plotId: string) => {
    const targetFarmer = farmers.find(f => f.id === farmerId);
    if (!targetFarmer) return;

    const farmName = targetFarmer.farms?.find(fa => fa.id === plotId)?.name || "खेत";
    const updatedFarms = (targetFarmer.farms || []).filter(item => item.id !== plotId);
    const updatedTotalAcreage = updatedFarms.reduce((sum, f) => sum + f.acreage, 0);

    if (currentUser?.id === "guest") {
      setFarmers(prev => prev.map(f => f.id === farmerId ? { ...f, farms: updatedFarms, totalAcreage: Number(updatedTotalAcreage.toFixed(2)) } : f));
      await logAudit("DELETE_FARM_PLOT", farmerId, "farmers", `खेत प्लॉट ${farmName} हटाया गया किसान ${targetFarmer.name} के खाते से`);
      return;
    }

    try {
      const docRef = doc(db, "farmers", farmerId);
      await setDoc(docRef, {
        ...targetFarmer,
        farms: updatedFarms,
        totalAcreage: Number(updatedTotalAcreage.toFixed(2)),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      await logAudit("DELETE_FARM_PLOT", farmerId, "farmers", `खेत प्लॉट ${farmName} हटाया गया किसान ${targetFarmer.name} के खाते से`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `farmers/${farmerId}`);
    }
  };

  // Farmer plot inline edit handler
  const handleUpdatePlot = async (farmerId: string, plotId: string, name: string, acreage: number, crop: string) => {
    const targetFarmer = farmers.find(f => f.id === farmerId);
    if (!targetFarmer) return;

    const updatedFarms = (targetFarmer.farms || []).map(item => 
      item.id === plotId ? { ...item, name, acreage: Number(acreage), activeCrop: crop } : item
    );
    const updatedTotalAcreage = updatedFarms.reduce((sum, f) => sum + f.acreage, 0);

    if (currentUser?.id === "guest") {
      setFarmers(prev => prev.map(f => f.id === farmerId ? { ...f, farms: updatedFarms, totalAcreage: Number(updatedTotalAcreage.toFixed(2)) } : f));
      await logAudit("UPDATE_FARM_PLOT", farmerId, "farmers", `खेत प्लॉट बदल किया: ${name}, रकबा: ${acreage} एकड़, फसल: ${crop} (किसान: ${targetFarmer.name})`);
      return;
    }

    try {
      const docRef = doc(db, "farmers", farmerId);
      await setDoc(docRef, {
        ...targetFarmer,
        farms: updatedFarms,
        totalAcreage: Number(updatedTotalAcreage.toFixed(2)),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      await logAudit("UPDATE_FARM_PLOT", farmerId, "farmers", `खेत प्लॉट बदल किया: ${name}, रकबा: ${acreage} एकड़, फसल: ${crop} (किसान: ${targetFarmer.name})`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `farmers/${farmerId}`);
    }
  };

  // Destructive handlers
  const deleteFarmer = async (id: string) => {
    const fn = farmers.find(f => f.id === id)?.name || "किसान";
    if (currentUser?.id === "guest") {
      setFarmers((prev) => prev.filter((f) => f.id !== id));
      await logAudit("DELETE_FARMER", id, "farmers", `हटाया गया किसान प्रोफाइल: ${fn}`);
      return;
    }
    try {
      await deleteDoc(doc(db, "farmers", id));
      await logAudit("DELETE_FARMER", id, "farmers", `हटाया गया किसान प्रोफाइल: ${fn}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `farmers/${id}`);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (currentUser?.id === "guest") {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      await logAudit("DELETE_TRANSACTION", id, "transactions", `हटाया गया वित्तीय लेनदेन रिकॉर्ड ID: ${id}`);
      return;
    }
    try {
      await deleteDoc(doc(db, "transactions", id));
      await logAudit("DELETE_TRANSACTION", id, "transactions", `हटाया गया वित्तीय लेनदेन रिकॉर्ड ID: ${id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `transactions/${id}`);
    }
  };

  const deleteLabor = async (id: string) => {
    if (currentUser?.id === "guest") {
      setLabors((prev) => prev.filter((l) => l.id !== id));
      await logAudit("DELETE_LABOR", id, "labor", `हटाया गया लेबर लॉग ID: ${id}`);
      return;
    }
    try {
      await deleteDoc(doc(db, "labor", id));
      await logAudit("DELETE_LABOR", id, "labor", `हटाया गया लेबर लॉग ID: ${id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `labor/${id}`);
    }
  };

  const createCropSale = async (saleForm: any) => {
    const id = "crop_sale_" + Date.now();
    const payload: CropSale = {
      id,
      farmerId: saleForm.farmerId,
      farmerName: saleForm.farmerName || "",
      farmId: saleForm.farmId || "",
      farmName: saleForm.farmName || "",
      cropName: saleForm.cropName || "",
      quantityEstimated: Number(saleForm.quantityEstimated || 0),
      unit: saleForm.unit || "kg",
      estimatedPrice: Number(saleForm.estimatedPrice || 0),
      status: "unsold",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByOperatorId: currentUser?.id === "guest" ? "guest_visitor" : auth.currentUser!.uid,
      lastUpdatedByOperatorId: currentUser?.id === "guest" ? "guest_visitor" : auth.currentUser!.uid
    };

    if (currentUser?.id === "guest") {
      setCropSales((prev) => [payload, ...prev]);
      await logAudit(
        "CREATE_CROP_SALE",
        id,
        "crop_sales",
        `विक्रय हेतु नयी फसल प्रविष्ट की: ${payload.cropName} (किसान: ${payload.farmerName}, मात्रा: ${payload.quantityEstimated} ${payload.unit === "kg" ? "किग्रा" : "टन"}, अनुमानित कीमत: ₹${payload.estimatedPrice})`
      );
      return;
    }

    try {
      await setDoc(doc(db, "crop_sales", id), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      await logAudit(
        "CREATE_CROP_SALE",
        id,
        "crop_sales",
        `विक्रय हेतु नयी फसल प्रविष्ट की: ${payload.cropName} (किसान: ${payload.farmerName}, मात्रा: ${payload.quantityEstimated} ${payload.unit === "kg" ? "किग्रा" : "टन"}, अनुमानित कीमत: ₹${payload.estimatedPrice})`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `crop_sales/${id}`);
    }
  };

  const updateCropSale = async (id: string, saleForm: any) => {
    if (currentUser?.id === "guest") {
      setCropSales((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                cropName: saleForm.cropName,
                quantityEstimated: Number(saleForm.quantityEstimated || 0),
                unit: saleForm.unit || "kg",
                estimatedPrice: Number(saleForm.estimatedPrice || 0),
                updatedAt: new Date().toISOString()
              }
            : item
        )
      );
      await logAudit(
        "UPDATE_CROP_SALE",
        id,
        "crop_sales",
        `विक्रय फसल प्रविष्टि में संशोधन किया: ${saleForm.cropName} (मात्रा: ${saleForm.quantityEstimated} ${saleForm.unit === "kg" ? "किग्रा" : "टन"}, अनुमानित कीमत: ₹${saleForm.estimatedPrice})`
      );
      return;
    }

    try {
      await setDoc(doc(db, "crop_sales", id), {
        cropName: saleForm.cropName,
        quantityEstimated: Number(saleForm.quantityEstimated || 0),
        unit: saleForm.unit || "kg",
        estimatedPrice: Number(saleForm.estimatedPrice || 0),
        updatedAt: serverTimestamp(),
        lastUpdatedByOperatorId: auth.currentUser!.uid
      }, { merge: true });
      await logAudit(
        "UPDATE_CROP_SALE",
        id,
        "crop_sales",
        `विक्रय फसल प्रविष्टि में संशोधन किया: ${saleForm.cropName} (मात्रा: ${saleForm.quantityEstimated} ${saleForm.unit === "kg" ? "किग्रा" : "टन"}, अनुमानित कीमत: ₹${saleForm.estimatedPrice})`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `crop_sales/${id}`);
    }
  };

  const updateCropSaleStatus = async (id: string, status: "sold" | "unsold") => {
    const isSold = status === "sold";
    const soldAt = isSold ? new Date().toISOString() : null;

    if (currentUser?.id === "guest") {
      setCropSales((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
                soldAt: soldAt || undefined,
                updatedAt: new Date().toISOString()
              }
            : item
        )
      );
      const sale = cropSales.find((c) => c.id === id);
      await logAudit(
        "UPDATE_CROP_SALE_STATUS",
        id,
        "crop_sales",
        `फसल विक्रय स्थिति अपडेट की: ${sale?.cropName || ""} -> ${isSold ? "बेचा गया (Sold)" : "बेचना शेष (Unsold)"}`
      );
      return;
    }

    try {
      await setDoc(doc(db, "crop_sales", id), {
        status,
        soldAt,
        updatedAt: serverTimestamp(),
        lastUpdatedByOperatorId: auth.currentUser!.uid
      }, { merge: true });
      const sale = cropSales.find((c) => c.id === id);
      await logAudit(
        "UPDATE_CROP_SALE_STATUS",
        id,
        "crop_sales",
        `फसल विक्रय स्थिति अपडेट की: ${sale?.cropName || ""} -> ${isSold ? "बेचा गया (Sold)" : "बेचना शेष (Unsold)"}`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `crop_sales/${id}`);
    }
  };

  const deleteCropSale = async (id: string) => {
    if (currentUser?.id === "guest") {
      setCropSales((prev) => prev.filter((item) => item.id !== id));
      await logAudit("DELETE_CROP_SALE", id, "crop_sales", `हटाया गया फसल विक्रय पोस्ट ID: ${id}`);
      return;
    }
    try {
      await deleteDoc(doc(db, "crop_sales", id));
      await logAudit("DELETE_CROP_SALE", id, "crop_sales", `हटाया गया फसल विक्रय पोस्ट ID: ${id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `crop_sales/${id}`);
    }
  };

  // Dynamic voice recorder simulation using live registered farmers & fields
  const handleToggleVoiceRecord = (txFormSetter: any, modalOpenSetter: any) => {
    if (isRecording) {
      if (timerRef) clearInterval(timerRef);
      setIsRecording(false);
      setRecordingSeconds(0);
      
      if (farmers.length === 0) {
        alert("⚠️ आपके पास अभी कोई किसान पंजीकृत नहीं है। कृपया पहले मैनुअली 'किसान रजिस्ट्रेशन' करके खेत जोड़ें; उसके बाद आप बोलकर प्रविष्टि कर सकते हैं।");
        return;
      }
      
      const randomFarmer = farmers[Math.floor(Math.random() * farmers.length)];
      const randomPlot = randomFarmer.farms && randomFarmer.farms.length > 0
        ? randomFarmer.farms[Math.floor(Math.random() * randomFarmer.farms.length)]
        : { id: "farm_any", name: "मुख्य खेत", activeCrop: randomFarmer.activeCrop || "गेहूं (Wheat)" };
        
      const currentSelectedCrop = randomPlot.activeCrop || randomFarmer.activeCrop || "गेहूं (Wheat)";
      
      const simulatedScenarios = [
        {
          textExtra: "यूरिया खाद खर्च बारह हजार रुपये",
          category: "fertilizer",
          amount: 12000
        },
        {
          textExtra: "बीज बुवाई खर्चे बत्तीस हजार रुपये",
          category: "seed",
          amount: 32000
        },
        {
          textExtra: "डीजल पंप का सामान्य खर्च छह हजार रुपये",
          category: "diesel",
          amount: 6000
        }
      ];
      
      const scenario = simulatedScenarios[Math.floor(Math.random() * simulatedScenarios.length)];
      const textResult = `${randomFarmer.name} ${randomPlot.name} का ${currentSelectedCrop} फसल हेतु ${scenario.textExtra}`;
      
      setSimulatedVoiceText(textResult);
      
      txFormSetter({
        farmerId: randomFarmer.id,
        farmId: randomPlot.id,
        crop: currentSelectedCrop,
        type: "expense" as const,
        category: scenario.category,
        amount: scenario.amount,
        date: new Date().toISOString().split("T")[0],
        isMandiSale: false,
        grossWeight: 0,
        deductionRate: 0,
        traderName: "",
        isCreditSale: false,
        dueDate: "",
        paymentStatus: "paid",
        voiceNoteUrl: "unprocessed_voice_recording_memo",
        voiceTranscription: textResult
      });
      alert(`🎤 आवाज ट्रांसक्राइब की गयी!\n\nवाक्य: "${textResult}"\n\n(आपके जोड़े गए किसान "${randomFarmer.name}" और खेत "${randomPlot.name}" को आवाज द्वारा पहचान लिया गया है!)`);
      modalOpenSetter(true);
    } else {
      setIsRecording(true);
      const timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
      setTimerRef(timer);
    }
  };

  // CROPS ROI ANALYTICS
  const getCropWiseROIAnalytics = () => {
    const crops = ["गेहूं (Wheat)", "धान (Paddy)", "सोयाबीन (Soybean)", "लहसुन (Garlic)", "कपास (Cotton)"];
    
    return crops.map((cropName) => {
      const associatedFarmers = farmers.filter(f => f.activeCrop === cropName);
      const totalArea = associatedFarmers.reduce((sum, f) => sum + f.totalAcreage, 0);

      const cropTxs = transactions.filter(t => t.crop === cropName && t.financialYear === financialYear);
      const totalIncome = cropTxs.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
      const materialExpenses = cropTxs.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

      const cropLabors = labors.filter(l => l.crop === cropName);
      const laborExpenses = cropLabors.reduce((sum, l) => sum + l.contractAmount, 0);
      
      const totalExpense = materialExpenses + laborExpenses;
      const netProfit = totalIncome - totalExpense;
      const profitPerAcre = totalArea > 0 ? netProfit / totalArea : 0;

      return {
        crop: cropName,
        farmersCount: associatedFarmers.length,
        area: totalArea,
        income: totalIncome,
        expense: totalExpense,
        materialExpense: materialExpenses,
        laborExpense: laborExpenses,
        netProfit,
        profitPerAcre: Number(profitPerAcre.toFixed(2))
      };
    });
  };

  const roiAnalytics = getCropWiseROIAnalytics();
  const overallIncome = transactions.filter(t => t.type === "income" && t.financialYear === financialYear).reduce((sum, t) => sum + t.amount, 0);
  const overallMaterialExpense = transactions.filter(t => t.type === "expense" && t.financialYear === financialYear).reduce((sum, t) => sum + t.amount, 0);
  const overallLaborExpense = labors.reduce((sum, l) => sum + l.contractAmount, 0);
  const overallExpense = overallMaterialExpense + overallLaborExpense;
  const overallProfit = overallIncome - overallExpense;

  const totalSownAcreage = farmers.reduce((sum, f) => sum + f.totalAcreage, 0);
  const netEarningsPerAcre = totalSownAcreage > 0 ? overallProfit / totalSownAcreage : 0;

  const pendingCollections = transactions.filter(
    (t) => t.isCreditSale && t.paymentStatus !== "paid" && t.creditDetails
  );
  const totalPendingDues = pendingCollections.reduce((sum, t) => sum + (t.creditDetails?.pendingAmount || 0), 0);

  // Data exporter
  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["किसान नाम, गाँव, रकबा, सक्रिय फसल, कुल कमाई, कुल खर्चा, शुद्ध लाभ"].join(",") + "\n"
      + farmers.map(f => {
          const fTxs = transactions.filter(t => t.farmerId === f.id);
          const inc = fTxs.filter(t => t.type === "income").reduce((s,t) => s+t.amount, 0);
          const exp = fTxs.filter(t => t.type === "expense").reduce((s,t) => s+t.amount, 0);
          return `${f.name},${f.village},${f.totalAcreage},${f.activeCrop},${inc},${exp},${inc-exp}`;
        }).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `कृषि_प्रबंधन_वित्तीय_रिपोर्ट_${financialYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerWhatsAppReminder = (tx: Transaction) => {
    const farmer = farmers.find(f => f.id === tx.farmerId);
    if (!farmer) return;
    const whatsappText = `नमस्ते ${farmer.name} जी,\nकृषि प्रबंधन कार्यालय से यह आपका आढ़ती भुगतान रिमाइंडर है। आपकी फसल ${tx.crop} की मंडी बिक्री का बकाया ऋण शेष राशि ₹${tx.creditDetails?.pendingAmount || 0} भुगतान करने की निर्धारित तिथि ${tx.creditDetails?.dueDate || ""} है। कृपया समय पर भुगतान पूर्ण करें।\nधन्यवाद, सुपर एडमिन।`;
    const encoded = encodeURIComponent(whatsappText);
    window.open(`https://wa.me/91${farmer.phone}?text=${encoded}`, "_blank");
  };

  const clearAllDatabaseData = async () => {
    setIsSyncing(true);
    try {
      // Clear localStorage
      localStorage.removeItem("agri_guest_farmers");
      localStorage.removeItem("agri_guest_transactions");
      localStorage.removeItem("agri_guest_labors");
      localStorage.removeItem("agri_guest_audits");

      // Loop and delete from firestore database if authenticated and connected
      if (currentUser && currentUser.id !== "guest") {
        const deletePromises: Promise<any>[] = [];
        
        // Directly fetch and delete ALL farmer documents physically from Firestore
        const farmersCol = collection(db, "farmers");
        const farmersSnap = await getDocs(farmersCol);
        farmersSnap.forEach((docSnap) => {
          deletePromises.push(deleteDoc(doc(db, "farmers", docSnap.id)));
        });

        // Directly fetch and delete ALL transactions documents physically from Firestore
        const txsCol = collection(db, "transactions");
        const txsSnap = await getDocs(txsCol);
        txsSnap.forEach((docSnap) => {
          deletePromises.push(deleteDoc(doc(db, "transactions", docSnap.id)));
        });

        // Directly fetch and delete ALL labor log documents physically from Firestore
        const laborCol = collection(db, "labor");
        const laborSnap = await getDocs(laborCol);
        laborSnap.forEach((docSnap) => {
          deletePromises.push(deleteDoc(doc(db, "labor", docSnap.id)));
        });

        // Directly fetch and delete ALL crop sales documents physically from Firestore
        const cropsCol = collection(db, "crop_sales");
        const cropsSnap = await getDocs(cropsCol);
        cropsSnap.forEach((docSnap) => {
          deletePromises.push(deleteDoc(doc(db, "crop_sales", docSnap.id)));
        });

        // Directly fetch and delete ALL audit logs physically from Firestore
        const auditsCol = collection(db, "audits");
        const auditsSnap = await getDocs(auditsCol);
        auditsSnap.forEach((docSnap) => {
          deletePromises.push(deleteDoc(doc(db, "audits", docSnap.id)));
        });

        await Promise.all(deletePromises);
      }

      // Clear states immediately
      setFarmers([]);
      setTransactions([]);
      setLabors([]);
      setCropSales([]);
      setAudits([]);

      alert("✓ पूरा डेटा सफलतापूर्वक साफ कर दिया गया है! अब आपका डेटाबेस पूरी तरह खाली और नया है।");
    } catch (err) {
      console.error("Error clearing database data: ", err);
      alert("डेटा साफ करने में त्रुटि: " + String(err));
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeViewMode,
        setActiveViewMode,
        financialYear,
        setFinancialYear,
        mobileTab,
        setMobileTab,
        authUser,
        authReady,
        currentUser,
        loginError,
        setLoginError,
        handleGoogleLogin,
        handleEmailPasswordLogin,
        handleEmailPasswordRegister,
        handlePasswordReset,
        handleGuestLogin,
        handleLogout,
        allOperators,
        createOperatorByAdmin,
        updateOperatorProfile,
        deleteOperator,
        farmers,
        transactions,
        labors,
        audits,
        cropSales,
        isSyncing,
        cloudCoreEnabled,
        setCloudCoreEnabled,
        farmerSearch,
        setFarmerSearch,
        selectedCropFilter,
        setSelectedCropFilter,
        logAudit,
        createFarmer,
        updateFarmer,
        createTransaction,
        updateTransaction,
        createLabor,
        updateLabor,
        handleAddPlotInline,
        handleDeletePlot,
        handleUpdatePlot,
        deleteFarmer,
        deleteTransaction,
        deleteLabor,
        createCropSale,
        updateCropSale,
        updateCropSaleStatus,
        deleteCropSale,
        roiAnalytics,
        overallIncome,
        overallExpense,
        overallProfit,
        totalSownAcreage,
        netEarningsPerAcre,
        totalPendingDues,
        handleExportData,
        triggerWhatsAppReminder,
        simulatedVoiceText,
        setSimulatedVoiceText,
        isRecording,
        recordingSeconds,
        handleToggleVoiceRecord,
        clearAllDatabaseData,
        confirmState,
        showConfirm,
        closeConfirm
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppState must be used within AppStateProvider");
  return context;
};
