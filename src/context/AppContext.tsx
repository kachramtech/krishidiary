import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { Farmer, Transaction, LaborLog, AuditLog, MandiRate } from "../types";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
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
  currentUser: { id: string; name: string; email: string; role: "super_admin" | "operator" } | null;
  loginError: string | null;
  setLoginError: (err: string | null) => void;
  handleGoogleLogin: () => Promise<void>;
  handleGuestLogin: () => void;
  handleLogout: () => Promise<void>;

  // Synchronized stores
  farmers: Farmer[];
  transactions: Transaction[];
  labors: LaborLog[];
  audits: AuditLog[];
  isSyncing: boolean;
  cloudCoreEnabled: boolean;
  setCloudCoreEnabled: (v: boolean) => void;

  // Search and Filters
  farmerSearch: string;
  setFarmerSearch: (v: string) => void;
  selectedCropFilter: string;
  setSelectedCropFilter: (v: string) => void;

  // Mutative Actions (CRUDS)
  logAudit: (action: string, targetId: string, collectionName: "farmers" | "transactions" | "labor", details: string) => Promise<void>;
  createFarmer: (farmerForm: any, farmerFarms: any[]) => Promise<void>;
  createTransaction: (txForm: any) => Promise<void>;
  createLabor: (laborForm: any) => Promise<void>;
  handleAddPlotInline: (farmerId: string, name: string, acreage: number, crop: string) => Promise<void>;
  deleteFarmer: (id: string) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteLabor: (id: string) => Promise<void>;

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeViewMode, setActiveViewMode] = useState<"desktop" | "mobile" | "offline">("desktop");
  const [financialYear, setFinancialYear] = useState<"2026-2027" | "2025-2026">("2026-2027");
  const [mobileTab, setMobileTab] = useState<"home" | "farms" | "labor" | "reports">("home");

  const [authUser, setAuthUser] = useState<any | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: "super_admin" | "operator" } | null>({
    id: "guest",
    name: "पब्लिक संचालक",
    email: "guest@agriportal.in",
    role: "super_admin"
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sync state trackers
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudCoreEnabled, setCloudCoreEnabled] = useState(true);

  // In memory core collections
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [labors, setLabors] = useState<LaborLog[]>([]);
  const [audits, setAudits] = useState<AuditLog[]>([]);

  // Local state search
  const [farmerSearch, setFarmerSearch] = useState("");
  const [selectedCropFilter, setSelectedCropFilter] = useState("all");

  // Voice Entry Recording states
  const [simulatedVoiceText, setSimulatedVoiceText] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  // 1. SAVE/RESTORE LOCALSTORAGE FOR PERSISTENCY DURING GUEST OR DEMO MODE
  const saveGuestData = (type: "farmers" | "transactions" | "labors" | "audits", data: any[]) => {
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

      setFarmers(gFarmers ? JSON.parse(gFarmers) : INITIAL_FARMERS);
      setTransactions(gTxs ? JSON.parse(gTxs) : INITIAL_TRANSACTIONS);
      setLabors(gLabors ? JSON.parse(gLabors) : INITIAL_LABOR);
      setAudits(gAudits ? JSON.parse(gAudits) : INITIAL_AUDITS);
    }
  }, [currentUser]);

  // Sync back local updates
  useEffect(() => {
    if (currentUser?.id === "guest" && farmers.length > 0) {
      saveGuestData("farmers", farmers);
    }
  }, [farmers, currentUser]);

  useEffect(() => {
    if (currentUser?.id === "guest" && transactions.length > 0) {
      saveGuestData("transactions", transactions);
    }
  }, [transactions, currentUser]);

  useEffect(() => {
    if (currentUser?.id === "guest" && labors.length > 0) {
      saveGuestData("labors", labors);
    }
  }, [labors, currentUser]);

  useEffect(() => {
    if (currentUser?.id === "guest" && audits.length > 0) {
      saveGuestData("audits", audits);
    }
  }, [audits, currentUser]);

  // Auth Subscription
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setAuthReady(false);
      if (user) {
        setAuthUser(user);
        const userRef = doc(db, "users", user.uid);
        try {
          const userDoc = await getDoc(userRef);
          let profileRole: "super_admin" | "operator" = user.email === "kachramtech@gmail.com" ? "super_admin" : "operator";
          
          if (userDoc.exists()) {
            const uData = userDoc.data();
            setCurrentUser({
              id: user.uid,
              name: uData.name,
              email: uData.email,
              role: uData.role as any,
            });
          } else {
            const newProfile = {
              id: user.uid,
              name: user.displayName || "कृषि ऑपरेटर",
              email: user.email || "",
              role: profileRole,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
            await setDoc(userRef, newProfile);
            setCurrentUser({
              id: user.uid,
              name: newProfile.name,
              email: newProfile.email,
              role: newProfile.role,
            });
          }

          // Bootstrapper Check & Seeding
          const checkFarmers = doc(db, "farmers", "farmer_1");
          const farmerSnap = await getDoc(checkFarmers);
          if (!farmerSnap.exists()) {
            console.log("Seeding commercial database stores with Hindi presets...");
            setIsSyncing(true);
            
            for (const f of INITIAL_FARMERS) {
              await setDoc(doc(db, "farmers", f.id), {
                ...f,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                createdByOperatorId: user.uid,
                lastUpdatedByOperatorId: user.uid,
              });
            }
            for (const t of INITIAL_TRANSACTIONS) {
              await setDoc(doc(db, "transactions", t.id), {
                ...t,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                createdByOperatorId: user.uid,
                lastUpdatedByOperatorId: user.uid,
                ...(t.isMandiSale && t.mandiDetails ? {
                  grossWeight: Number(t.mandiDetails.grossWeight),
                  deductionRate: Number(t.mandiDetails.deductionRate),
                  deductions: Number(t.mandiDetails.deductions),
                  netWeight: Number(t.mandiDetails.netWeight),
                  ratePerQuintal: Number(t.mandiDetails.ratePerQuintal),
                  traderName: t.mandiDetails.traderName
                } : {}),
                ...(t.isCreditSale && t.creditDetails ? {
                  pendingAmount: Number(t.creditDetails.pendingAmount),
                  dueDate: t.creditDetails.dueDate
                } : {})
              });
            }
            for (const l of INITIAL_LABOR) {
              await setDoc(doc(db, "labor", l.id), {
                ...l,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                createdByOperatorId: user.uid,
                lastUpdatedByOperatorId: user.uid,
                ...(l.mode === "individual" && l.individualDetails ? {
                  laborerName: l.individualDetails.laborerName,
                  attendance: l.individualDetails.attendance
                } : {}),
                ...(l.mode === "bulk_gang" && l.bulkDetails ? {
                  workersCount: Number(l.bulkDetails.workersCount),
                  groupName: l.bulkDetails.groupName,
                  workDescription: l.bulkDetails.workDescription
                } : {})
              });
            }
            for (const a of INITIAL_AUDITS) {
              await setDoc(doc(db, "audits", a.id), {
                ...a,
                operatorId: user.uid,
              });
            }
            setIsSyncing(false);
          }
        } catch (error) {
          console.error("Critical Seeding/Auth Error: ", error);
        }
      } else {
        setAuthUser(null);
        setCurrentUser({
          id: "guest",
          name: "पब्लिक संचालक",
          email: "guest@agriportal.in",
          role: "super_admin"
        });
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

    return () => {
      unsubscribeFarmers();
      unsubscribeTransactions();
      unsubscribeLabor();
      unsubscribeAudits();
    };
  }, [currentUser]);

  // Secure Auditing
  const logAudit = async (action: string, targetId: string, collectionName: "farmers" | "transactions" | "labor", details: string) => {
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

  // Transaction creation
  const createTransaction = async (txForm: any) => {
    let calculatedAmount = Number(txForm.amount);
    let calculatedDeductions = 0;
    let netWeight = 0;

    let mandiPayload: any = null;
    if (txForm.isMandiSale) {
      const gross = Number(txForm.grossWeight);
      const decRate = Number(txForm.deductionRate);
      calculatedDeductions = gross * (decRate / 100);
      netWeight = gross - calculatedDeductions;
      calculatedAmount = netWeight * Number(txForm.amount);

      mandiPayload = {
        grossWeight: gross,
        deductionRate: decRate,
        deductions: Number(calculatedDeductions.toFixed(2)),
        netWeight: Number(netWeight.toFixed(2)),
        ratePerQuintal: Number(txForm.amount),
        traderName: txForm.traderName || "अज्ञात मंडी आढ़त"
      };
    }

    const id = "tx_" + Date.now();

    let creditPayload: any = null;
    if (txForm.isCreditSale) {
      creditPayload = {
        pendingAmount: txForm.paymentStatus === "partially_paid" ? calculatedAmount * 0.4 : calculatedAmount,
        dueDate: txForm.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      };
    }

    const txPayload = {
      id,
      farmerId: txForm.farmerId,
      farmId: txForm.farmId || null,
      crop: txForm.crop,
      type: txForm.type,
      category: txForm.category,
      amount: Number(calculatedAmount.toFixed(2)),
      date: txForm.date,
      financialYear: financialYear,
      isMandiSale: txForm.isMandiSale,
      isCreditSale: txForm.isCreditSale,
      paymentStatus: txForm.paymentStatus,
      voiceNoteUrl: simulatedVoiceText ? "unprocessed_voice_recording_memo" : null,
      voiceTranscription: simulatedVoiceText || null,
      mandiDetails: mandiPayload,
      creditDetails: creditPayload,
      ...(txForm.isMandiSale ? {
        grossWeight: mandiPayload.grossWeight,
        deductionRate: mandiPayload.deductionRate,
        deductions: mandiPayload.deductions,
        netWeight: mandiPayload.netWeight,
        ratePerQuintal: mandiPayload.ratePerQuintal,
        traderName: mandiPayload.traderName
      } : {}),
      ...(txForm.isCreditSale ? {
        pendingAmount: creditPayload.pendingAmount,
        dueDate: creditPayload.dueDate
      } : {})
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

  // Farmer plot inline creator
  const handleAddPlotInline = async (farmerId: string, name: string, acreage: number, crop: string) => {
    const targetFarmer = farmers.find(f => f.id === farmerId);
    if (!targetFarmer) return;

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
      await logAudit("CREATE_FARM_PLOT", farmerId, "farmers", `नया खेत प्लॉट ${name} जोड़ा गया किसान ${targetFarmer.name} के लिए`);
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

  // Dynamic voice recorder simulation
  const handleToggleVoiceRecord = (txFormSetter: any, modalOpenSetter: any) => {
    if (isRecording) {
      if (timerRef) clearInterval(timerRef);
      setIsRecording(false);
      setRecordingSeconds(0);
      
      const simulatedPhrases = [
        {
          text: "रामचंद्र पाटीदार कुएं वाला खेत गेहूं फसल यूरिया खाद खर्च चौदह हजार आठ सौ रुपये",
          farmerId: "farmer_1",
          farmId: "farm_1_1",
          crop: "गेहूं (Wheat)",
          type: "expense" as const,
          category: "fertilizer",
          amount: 14800
        },
        {
          text: "बलराम धाकड़ घर के सामने खेत सोयाबीन बीज बुवाई खर्चा बत्तीस हजार रुपये",
          farmerId: "farmer_3",
          farmId: "farm_3_1",
          crop: "सोयाबीन (Soybean)",
          type: "expense" as const,
          category: "seed",
          amount: 32000
        },
        {
          text: "जगदीश चन्द्र डांगी नाला वाला खेत धान फसल डीजल खर्चा पचासी सौ रुपये",
          farmerId: "farmer_2",
          farmId: "farm_2_1",
          crop: "धान (Paddy)",
          type: "expense" as const,
          category: "diesel",
          amount: 8500
        }
      ];
      
      const matchPhrase = simulatedPhrases[Math.floor(Math.random() * simulatedPhrases.length)];
      setSimulatedVoiceText(matchPhrase.text);
      
      txFormSetter({
        farmerId: matchPhrase.farmerId,
        farmId: matchPhrase.farmId,
        crop: matchPhrase.crop,
        type: matchPhrase.type,
        category: matchPhrase.category,
        amount: matchPhrase.amount,
        date: new Date().toISOString().split("T")[0],
        isMandiSale: false,
        grossWeight: 0,
        deductionRate: 0,
        traderName: "",
        isCreditSale: false,
        dueDate: "",
        paymentStatus: "paid",
        voiceNoteUrl: "unprocessed_voice_recording_memo",
        voiceTranscription: matchPhrase.text
      });
      alert(`🎤 आवाज ट्रांसक्राइब की गयी!\nवाक्य: "${matchPhrase.text}" \n\n(प्रविष्टि प्रपत्र लोड किया गया है, कृपया समीक्षा करें और सुरक्षित करें)`);
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
        handleGuestLogin,
        handleLogout,
        farmers,
        transactions,
        labors,
        audits,
        isSyncing,
        cloudCoreEnabled,
        setCloudCoreEnabled,
        farmerSearch,
        setFarmerSearch,
        selectedCropFilter,
        setSelectedCropFilter,
        logAudit,
        createFarmer,
        createTransaction,
        createLabor,
        handleAddPlotInline,
        deleteFarmer,
        deleteTransaction,
        deleteLabor,
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
        handleToggleVoiceRecord
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
