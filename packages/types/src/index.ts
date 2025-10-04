// Domain Types

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  externalId: string;
  bankName: string;
  accountType: string;
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Merchant {
  id: string;
  name: string;
  mcc: string | null;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  merchantId: string | null;
  externalId: string | null;
  date: Date;
  amountUSD: number;
  currency: string;
  rawDescription: string;
  mcc: string | null;
  category: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  merchant?: Merchant;
  emissionEstimate?: EmissionEstimate;
}

export enum EmissionMethod {
  ACTIVITY = 'ACTIVITY',
  INTENSITY = 'INTENSITY',
}

export interface EmissionFactor {
  id: string;
  source: string;
  scope: string;
  unitType: string;
  unit: string;
  kgCO2ePerUnit: number;
  categoryKey: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmissionEstimate {
  id: string;
  transactionId: string;
  method: EmissionMethod;
  kgCO2e: number;
  factorId: string | null;
  details: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  factor?: EmissionFactor;
}

export interface Budget {
  id: string;
  userId: string;
  month: string; // YYYY-MM format
  limitKg: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recommendation {
  id: string;
  userId: string;
  month: string;
  title: string;
  description: string;
  estReductionKg: number;
  accepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types

export interface DashboardStats {
  currentMonthKg: number;
  lastMonthKg: number;
  percentageChange: number;
  categoryBreakdown: CategoryEmission[];
  dailyTrend: DailyEmission[];
  topMerchants: MerchantEmission[];
}

export interface CategoryEmission {
  category: string;
  kgCO2e: number;
  percentage: number;
  transactionCount: number;
}

export interface DailyEmission {
  date: string;
  kgCO2e: number;
}

export interface MerchantEmission {
  merchantName: string;
  kgCO2e: number;
  transactionCount: number;
}

export interface TransactionWithEmission extends Transaction {
  emissionEstimate: EmissionEstimate | null;
}

// Nessie Types

export interface NessieAccount {
  _id: string;
  type: string;
  nickname: string;
  rewards: number;
  balance: number;
  account_number?: string;
  customer_id: string;
}

export interface NessieTransaction {
  _id: string;
  type: string;
  transaction_date: string;
  status: string;
  medium: string;
  payer_id: string;
  payee_id: string;
  amount: number;
  description: string;
}

export interface NessiePurchase {
  _id: string;
  merchant_id: string;
  medium: string;
  purchase_date: string;
  amount: number;
  status: string;
  description: string;
}

