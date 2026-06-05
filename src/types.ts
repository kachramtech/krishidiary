export type UserRole = "super_admin" | "operator";

export interface SystemUser {
  id: string; // auth uid
  name: string;
  email: string;
  role: UserRole;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface FarmField {
  id: string;
  name: string; // e.g., 'नाला वाला खेत'
  acreage: number; // in acres
  activeCrop: string; // active crop grown on this specific field
}

export interface Farmer {
  id: string; // document id
  name: string;
  village: string;
  phone: string;
  totalAcreage: number; // in acres (रकबा)
  activeCrop: string; // currently active crop (default / aggregate)
  farms?: FarmField[]; // farm fields/plots details
  createdAt: string;
  updatedAt: string;
  createdByOperatorId: string;
  lastUpdatedByOperatorId: string;
}

export type TransactionType = "income" | "expense";

export interface MandiDetails {
  grossWeight: number; // in quintals (क्विंटल) or KG (किग्रा)
  deductionRate: number; // in kg per quintal (कटौती प्रति क्विंटल)
  deductions: number; // calculated total deduction weight (in quintals)
  netWeight: number; // net weight = gross - deductions
  ratePerQuintal: number; // rate per quintal (₹) or rate per KG
  traderName: string; // dealer / aadhitya
  deductKg?: number; // deduction in kg directly
  rateType?: "kg" | "quintal"; // rate of sale
}

export interface CreditDetails {
  pendingAmount: number;
  dueDate: string; // YYYY-MM-DD
}

export interface Transaction {
  id: string;
  farmerId: string;
  farmId?: string; // specific field selected
  crop: string;
  type: TransactionType;
  category: string; // e.g., "seed", "fertilizer", "pesticide", "diesel", "labor_payout", "harvest_sale"
  amount: number; // Net total payment in Rupees
  date: string; // YYYY-MM-DD (support backdate)
  financialYear: string; // e.g., "2026-2027"
  isMandiSale: boolean;
  mandiDetails?: MandiDetails;
  isCreditSale: boolean;
  creditDetails?: CreditDetails;
  paymentStatus: "paid" | "partially_paid" | "unpaid";
  voiceNoteUrl?: string; // audio memo url
  voiceTranscription?: string; // auto-text translation / memo
  createdAt: string;
  updatedAt: string;
  createdByOperatorId: string;
  lastUpdatedByOperatorId: string;
  grossWeight?: number | null;
  deductionRate?: number | null;
  deductions?: number | null;
  netWeight?: number | null;
  ratePerQuintal?: number | null;
  traderName?: string | null;
  deductKg?: number | null;
  rateType?: "kg" | "quintal" | null;
  pendingAmount?: number | null;
  dueDate?: string | null;
  editLogs?: Array<{
    timestamp: string;
    changedText: string;
    operator: string;
  }>;
}

export type LaborMode = "individual" | "bulk_gang";

export interface IndividualLaborDetails {
  laborerName: string;
  attendance: "present" | "half_day" | "absent";
}

export interface BulkLaborDetails {
  workersCount: number;
  groupName: string; // gang contact/name
  workDescription: string; // task details
}

export interface LaborLog {
  id: string;
  farmerId: string;
  farmId?: string; // specific field selected
  date: string; // YYYY-MM-DD
  crop: string;
  mode: LaborMode;
  individualDetails?: IndividualLaborDetails;
  bulkDetails?: BulkLaborDetails;
  contractAmount: number; // total wages due
  advancePaid: number;
  dueBalance: number; // contractAmount - advancePaid
  createdAt: string;
  updatedAt: string;
  createdByOperatorId: string;
  lastUpdatedByOperatorId: string;
}

export interface AuditLog {
  id: string;
  operatorId: string;
  operatorName: string;
  action: string; // 'CREATE_FARMER' | 'UPDATE_TRANSACTION' | etc.
  targetId: string;
  targetCollection: "farmers" | "transactions" | "labor";
  timestamp: string;
  details: string; // text description
}

export interface MandiRate {
  crop: string;
  marketRate: number; // ₹ per quintal
  dailyChange: number; // positive or negative percentage/amount
}
