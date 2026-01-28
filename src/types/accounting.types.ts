/**
 * ACCOUNTING & FINANCE TYPES - Professional ERP
 */

// --- Account Types (PCG Classes 1-7) ---
export type AccountClass = '1' | '2' | '3' | '4' | '5' | '6' | '7';
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export type AccountSide = 'debit' | 'credit';
export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'sales' | 'purchases' | 'fixed' | 'payroll' | 'bank' | 'tax' | 'other';

// --- Chart of Accounts (Plan Comptable Général) ---
export interface Account {
    id: string;
    code: string;          // e.g., "512", "601"
    name: string;
    type: AccountType;
    class: AccountClass;
    parentCode?: string;   // For hierarchical display
    isActive: boolean;
    description?: string;
}

// --- Journal Entries (Écritures Comptables) ---
export interface JournalLine {
    accountId: string;
    accountCode: string;
    accountName: string;
    description: string;
    side: AccountSide;
    amount: number;
}

export interface JournalEntry {
    id: string;
    date: Date;
    pieceNumber: string;   // Numéro de pièce
    description: string;
    lines: JournalLine[];
    referenceId?: string;
    referenceType?: 'order' | 'supplier_order' | 'expense' | 'payroll' | 'bank' | 'manual';
    isSystemGenerated: boolean;
    isValidated: boolean;
    createdBy?: string;
    validatedBy?: string;
    validatedAt?: Date;
}

// --- Ledger (Grand Livre) ---
export interface LedgerAccount extends Account {
    balance: number;
    debitTotal: number;
    creditTotal: number;
    movements: LedgerMovement[];
}

export interface LedgerMovement {
    date: Date;
    pieceNumber: string;
    description: string;
    debit: number;
    credit: number;
    runningBalance: number;
    journalEntryId: string;
}

// --- Fiscal Periods (Périodes Comptables) ---
export type FiscalPeriodStatus = 'open' | 'closed' | 'locked';

export interface FiscalPeriod {
    id: string;
    name: string;           // e.g., "Janvier 2026"
    startDate: Date;
    endDate: Date;
    status: FiscalPeriodStatus;
    closedAt?: Date;
    closedBy?: string;
}

// --- Expense Claims (Notes de Frais) ---
export interface ExpenseClaim {
    id: string;
    userId: string;
    userName: string;
    date: Date;
    amount: number;
    category: TransactionCategory;
    description: string;
    receiptImage?: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: Date;
    journalEntryId?: string;
}

// --- Bank Reconciliation (Rapprochement Bancaire) ---
export interface BankTransaction {
    id: string;
    date: Date;
    label: string;
    amount: number;
    type: 'credit' | 'debit';
    isReconciled: boolean;
    reconciledWith?: string; // JournalEntry ID
    reconciledAt?: Date;
}

export interface BankReconciliation {
    id: string;
    periodId: string;
    bankBalance: number;
    ledgerBalance: number;
    difference: number;
    status: 'pending' | 'balanced' | 'discrepancy';
    createdAt: Date;
}

// --- Financial Metrics (Module Finance - Opérationnel) ---
export interface TreasuryMetrics {
    cashOnHand: number;
    bankBalance: number;
    pendingReceivables: number;
    pendingPayables: number;
    netCashPosition: number;
    cashFlowTrend: { date: string; inflow: number; outflow: number }[];
    forecast30Days: number;
}

// --- Accounting Metrics (Module Comptabilité - Certifié) ---
export interface AccountingMetrics {
    totalRevenue: number;
    totalExpenses: number;
    grossMargin: number;
    grossMarginPercent: number;
    foodCostPercent: number;
    laborCostPercent: number;
    operatingExpenses: number;
    ebitda: number;
    netProfit: number;
}

// --- Financial Reports ---
export interface ProfitAndLossReport {
    periodId: string;
    periodName: string;
    revenues: { accountCode: string; accountName: string; amount: number }[];
    expenses: { accountCode: string; accountName: string; amount: number }[];
    totalRevenue: number;
    totalExpenses: number;
    netResult: number;
    generatedAt: Date;
}

export interface BalanceSheetReport {
    asOfDate: Date;
    assets: { accountCode: string; accountName: string; amount: number }[];
    liabilities: { accountCode: string; accountName: string; amount: number }[];
    equity: { accountCode: string; accountName: string; amount: number }[];
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    isBalanced: boolean;
    generatedAt: Date;
}

export interface TrialBalance {
    periodId: string;
    accounts: { code: string; name: string; debit: number; credit: number }[];
    totalDebit: number;
    totalCredit: number;
    isBalanced: boolean;
}

// Legacy compatibility
export interface FinancialMetrics {
    totalRevenue: number;
    totalExpenses: number;
    grossMargin: number;
    foodCost: number;
    laborCost: number;
    opEx: number;
    ebitda: number;
    netProfit: number;
    cashOnHand: number;
}

export interface Transaction {
    id: string;
    type: TransactionType;
    category: TransactionCategory;
    title: string;
    amount: number;
    date: Date;
    orderId?: string;
    supplierOrderId?: string;
    expenseClaimId?: string;
}
