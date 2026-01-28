"use client";

import React, { createContext, useContext, useMemo, ReactNode, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useOrders } from './OrdersContext';
import { useInventory } from './InventoryContext';
import { useAuth } from './AuthContext';
import type {
    JournalEntry,
    ExpenseClaim,
    Account,
    LedgerAccount,
    LedgerMovement,
    FiscalPeriod,
    AccountingMetrics,
    FinancialMetrics,
    ProfitAndLossReport,
    BalanceSheetReport,
    TrialBalance
} from '@/types';

/**
 * ACCOUNTING CONTEXT (CERTIFIED)
 * Plan Comptable Général (PCG) complet avec Grand Livre, Balance et Rapports.
 * Séparé du module Finance pour une vision comptable normée.
 */

// Plan Comptable Général - Standard Restaurant
const CHART_OF_ACCOUNTS: Omit<Account, 'id'>[] = [
    // Classe 1 - Capitaux
    { code: '101', name: 'Capital social', type: 'equity', class: '1', isActive: true, description: 'Capital apporté par les associés' },
    { code: '106', name: 'Réserves', type: 'equity', class: '1', isActive: true },
    { code: '120', name: 'Résultat de l\'exercice (Bénéfice)', type: 'equity', class: '1', isActive: true },
    { code: '129', name: 'Résultat de l\'exercice (Perte)', type: 'equity', class: '1', isActive: true },
    { code: '164', name: 'Emprunts bancaires', type: 'liability', class: '1', isActive: true },

    // Classe 2 - Immobilisations
    { code: '211', name: 'Terrains', type: 'asset', class: '2', isActive: true },
    { code: '213', name: 'Constructions', type: 'asset', class: '2', isActive: true },
    { code: '215', name: 'Matériel et outillage', type: 'asset', class: '2', isActive: true },
    { code: '218', name: 'Aménagements et agencements', type: 'asset', class: '2', isActive: true },

    // Classe 3 - Stocks
    { code: '311', name: 'Matières premières', type: 'asset', class: '3', isActive: true },
    { code: '355', name: 'Produits finis', type: 'asset', class: '3', isActive: true },
    { code: '371', name: 'Marchandises', type: 'asset', class: '3', isActive: true },

    // Classe 4 - Tiers
    { code: '401', name: 'Fournisseurs', type: 'liability', class: '4', isActive: true },
    { code: '411', name: 'Clients', type: 'asset', class: '4', isActive: true },
    { code: '421', name: 'Personnel - Rémunérations dues', type: 'liability', class: '4', isActive: true },
    { code: '431', name: 'Sécurité sociale', type: 'liability', class: '4', isActive: true },
    { code: '445', name: 'État - TVA', type: 'liability', class: '4', isActive: true },

    // Classe 5 - Financiers
    { code: '512', name: 'Banque', type: 'asset', class: '5', isActive: true },
    { code: '531', name: 'Caisse', type: 'asset', class: '5', isActive: true },

    // Classe 6 - Charges
    { code: '601', name: 'Achats de matières premières', type: 'expense', class: '6', isActive: true },
    { code: '602', name: 'Achats fournitures consommables', type: 'expense', class: '6', isActive: true },
    { code: '606', name: 'Achats non stockés', type: 'expense', class: '6', isActive: true },
    { code: '607', name: 'Achats de marchandises', type: 'expense', class: '6', isActive: true },
    { code: '611', name: 'Sous-traitance', type: 'expense', class: '6', isActive: true },
    { code: '612', name: 'Redevances de crédit-bail', type: 'expense', class: '6', isActive: true },
    { code: '613', name: 'Locations', type: 'expense', class: '6', isActive: true },
    { code: '615', name: 'Entretien et réparations', type: 'expense', class: '6', isActive: true },
    { code: '616', name: 'Primes d\'assurance', type: 'expense', class: '6', isActive: true },
    { code: '622', name: 'Honoraires', type: 'expense', class: '6', isActive: true },
    { code: '623', name: 'Publicité et communication', type: 'expense', class: '6', isActive: true },
    { code: '626', name: 'Frais postaux et télécoms', type: 'expense', class: '6', isActive: true },
    { code: '627', name: 'Services bancaires', type: 'expense', class: '6', isActive: true },
    { code: '641', name: 'Rémunérations du personnel', type: 'expense', class: '6', isActive: true },
    { code: '645', name: 'Charges de sécurité sociale', type: 'expense', class: '6', isActive: true },
    { code: '661', name: 'Charges d\'intérêts', type: 'expense', class: '6', isActive: true },
    { code: '681', name: 'Dotations aux amortissements', type: 'expense', class: '6', isActive: true },

    // Classe 7 - Produits
    { code: '701', name: 'Ventes de produits finis', type: 'revenue', class: '7', isActive: true },
    { code: '706', name: 'Prestations de services', type: 'revenue', class: '7', isActive: true },
    { code: '707', name: 'Ventes de marchandises', type: 'revenue', class: '7', isActive: true },
    { code: '708', name: 'Produits des activités annexes', type: 'revenue', class: '7', isActive: true },
    { code: '758', name: 'Produits divers de gestion', type: 'revenue', class: '7', isActive: true },
    { code: '761', name: 'Produits de participations', type: 'revenue', class: '7', isActive: true },
    { code: '771', name: 'Produits exceptionnels', type: 'revenue', class: '7', isActive: true },
];

interface AccountingContextType {
    // Data
    accounts: Account[];
    journalEntries: JournalEntry[];
    expenseClaims: ExpenseClaim[];
    fiscalPeriods: FiscalPeriod[];
    ledger: LedgerAccount[];
    isLoading: boolean;

    // Metrics
    metrics: AccountingMetrics;
    legacyMetrics: FinancialMetrics; // For backward compatibility

    // Actions
    submitExpense: (data: Omit<ExpenseClaim, 'id' | 'status' | 'userId' | 'userName' | 'date'>) => Promise<void>;
    approveExpense: (id: string) => Promise<void>;
    rejectExpense: (id: string) => Promise<void>;
    createManualEntry: (entry: Omit<JournalEntry, 'id' | 'pieceNumber' | 'isSystemGenerated' | 'isValidated'>) => Promise<void>;
    validateEntry: (id: string) => Promise<void>;

    // Reports
    generatePandL: (periodId: string) => ProfitAndLossReport;
    generateBalanceSheet: (asOfDate: Date) => BalanceSheetReport;
    generateTrialBalance: (periodId: string) => TrialBalance;

    // Helpers
    getAccountByCode: (code: string) => Account | undefined;
    getLedgerForAccount: (accountId: string) => LedgerMovement[];
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export function AccountingProvider({ children }: { children: ReactNode }) {
    const { currentUser } = useAuth();
    const { orders } = useOrders();
    const { supplierOrders } = useInventory();

    // Live queries
    const dbAccounts = useLiveQuery(() => db.accounts.toArray()) || [];
    const journalEntries = useLiveQuery(() => db.journalEntries.orderBy('date').reverse().toArray()) || [];
    const expenseClaims = useLiveQuery(() => db.expenseClaims.toArray()) || [];
    const fiscalPeriods = useLiveQuery(() => db.fiscalPeriods.orderBy('startDate').toArray()) || [];
    const isLoading = dbAccounts === undefined;

    // Initialize accounts from chart if empty
    useEffect(() => {
        const initAccounts = async () => {
            const count = await db.accounts.count();
            if (count === 0) {
                const accountsToAdd = CHART_OF_ACCOUNTS.map((acc, i) => ({
                    ...acc,
                    id: `acc_${acc.code}`
                }));
                await db.accounts.bulkAdd(accountsToAdd);
            }
        };
        initAccounts();
    }, []);

    // Merge DB accounts with chart defaults
    const accounts: Account[] = useMemo(() => {
        if (dbAccounts.length > 0) return dbAccounts;
        return CHART_OF_ACCOUNTS.map((acc, i) => ({ ...acc, id: `acc_${acc.code}` }));
    }, [dbAccounts]);

    // Build Ledger from Journal Entries
    const ledger: LedgerAccount[] = useMemo(() => {
        const ledgerMap = new Map<string, LedgerAccount>();

        // Initialize all accounts
        accounts.forEach(acc => {
            ledgerMap.set(acc.id, {
                ...acc,
                balance: 0,
                debitTotal: 0,
                creditTotal: 0,
                movements: []
            });
        });

        // Process journal entries
        journalEntries.forEach(entry => {
            entry.lines.forEach(line => {
                const ledgerAcc = ledgerMap.get(line.accountId);
                if (ledgerAcc) {
                    const movement: LedgerMovement = {
                        date: entry.date,
                        pieceNumber: entry.pieceNumber,
                        description: line.description,
                        debit: line.side === 'debit' ? line.amount : 0,
                        credit: line.side === 'credit' ? line.amount : 0,
                        runningBalance: 0, // Calculated below
                        journalEntryId: entry.id
                    };

                    ledgerAcc.movements.push(movement);
                    ledgerAcc.debitTotal += movement.debit;
                    ledgerAcc.creditTotal += movement.credit;

                    // Update balance based on account type
                    if (line.side === 'debit') {
                        if (ledgerAcc.type === 'asset' || ledgerAcc.type === 'expense') {
                            ledgerAcc.balance += line.amount;
                        } else {
                            ledgerAcc.balance -= line.amount;
                        }
                    } else {
                        if (ledgerAcc.type === 'asset' || ledgerAcc.type === 'expense') {
                            ledgerAcc.balance -= line.amount;
                        } else {
                            ledgerAcc.balance += line.amount;
                        }
                    }
                }
            });
        });

        // Calculate running balances
        ledgerMap.forEach(acc => {
            let running = 0;
            acc.movements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            acc.movements.forEach(m => {
                if (acc.type === 'asset' || acc.type === 'expense') {
                    running += m.debit - m.credit;
                } else {
                    running += m.credit - m.debit;
                }
                m.runningBalance = running;
            });
        });

        return Array.from(ledgerMap.values()).sort((a, b) => a.code.localeCompare(b.code));
    }, [accounts, journalEntries]);

    // Accounting Metrics
    const metrics: AccountingMetrics = useMemo(() => {
        const revenues = ledger.filter(a => a.type === 'revenue');
        const expenses = ledger.filter(a => a.type === 'expense');

        const totalRevenue = revenues.reduce((acc, a) => acc + a.balance, 0);
        const totalExpenses = expenses.reduce((acc, a) => acc + a.balance, 0);

        const cogs = ledger.find(a => a.code === '601')?.balance || 0;
        const labor = ledger.find(a => a.code === '641')?.balance || 0;
        const operatingExpenses = totalExpenses - cogs - labor;

        const grossMargin = totalRevenue - cogs;

        return {
            totalRevenue,
            totalExpenses,
            grossMargin,
            grossMarginPercent: totalRevenue > 0 ? (grossMargin / totalRevenue) * 100 : 0,
            foodCostPercent: totalRevenue > 0 ? (cogs / totalRevenue) * 100 : 0,
            laborCostPercent: totalRevenue > 0 ? (labor / totalRevenue) * 100 : 0,
            operatingExpenses,
            ebitda: grossMargin - labor - operatingExpenses,
            netProfit: totalRevenue - totalExpenses
        };
    }, [ledger]);

    // Legacy metrics for backward compatibility
    const legacyMetrics: FinancialMetrics = useMemo(() => ({
        totalRevenue: metrics.totalRevenue,
        totalExpenses: metrics.totalExpenses,
        grossMargin: metrics.grossMarginPercent / 100,
        foodCost: metrics.foodCostPercent / 100,
        laborCost: ledger.find(a => a.code === '641')?.balance || 0,
        opEx: metrics.operatingExpenses,
        ebitda: metrics.ebitda,
        netProfit: metrics.netProfit,
        cashOnHand: (ledger.find(a => a.code === '512')?.balance || 0) + (ledger.find(a => a.code === '531')?.balance || 0)
    }), [metrics, ledger]);

    // Sync system entries (orders/supplier orders)
    useEffect(() => {
        const syncSystemEntries = async () => {
            for (const order of orders.filter(o => o.status === 'paid')) {
                const exists = journalEntries.some(e => e.referenceId === order.id);
                if (!exists) {
                    const pieceNum = `VTE-${new Date(order.timestamp).toISOString().split('T')[0].replace(/-/g, '')}-${order.id.slice(-4)}`;
                    await db.journalEntries.add({
                        id: `je_ord_${order.id}`,
                        date: new Date(order.timestamp),
                        pieceNumber: pieceNum,
                        description: `Vente Table ${order.tableNumber}`,
                        referenceId: order.id,
                        referenceType: 'order',
                        isSystemGenerated: true,
                        isValidated: true,
                        lines: [
                            { accountId: 'acc_512', accountCode: '512', accountName: 'Banque', side: 'debit', amount: order.total, description: 'Encaissement client' },
                            { accountId: 'acc_707', accountCode: '707', accountName: 'Ventes de marchandises', side: 'credit', amount: order.total, description: 'Chiffre d\'affaires' }
                        ]
                    });
                }
            }

            for (const sOrder of supplierOrders.filter(o => o.status === 'delivered')) {
                const exists = journalEntries.some(e => e.referenceId === sOrder.id);
                if (!exists) {
                    const pieceNum = `ACH-${sOrder.id.slice(-6)}`;
                    await db.journalEntries.add({
                        id: `je_sup_${sOrder.id}`,
                        date: new Date(sOrder.deliveredDate || sOrder.orderDate),
                        pieceNumber: pieceNum,
                        description: `Achat ${sOrder.supplier}`,
                        referenceId: sOrder.id,
                        referenceType: 'supplier_order',
                        isSystemGenerated: true,
                        isValidated: true,
                        lines: [
                            { accountId: 'acc_601', accountCode: '601', accountName: 'Achats matières premières', side: 'debit', amount: sOrder.totalAmount, description: 'Marchandises' },
                            { accountId: 'acc_401', accountCode: '401', accountName: 'Fournisseurs', side: 'credit', amount: sOrder.totalAmount, description: 'Dette fournisseur' }
                        ]
                    });
                }
            }
        };
        if (orders.length > 0 || supplierOrders.length > 0) {
            syncSystemEntries();
        }
    }, [orders, supplierOrders]);

    // Actions
    const submitExpense = async (data: Omit<ExpenseClaim, 'id' | 'userId' | 'userName' | 'date' | 'status'>) => {
        if (!currentUser) return;
        const id = `exp_${Math.random().toString(36).substr(2, 9)}`;
        await db.expenseClaims.add({
            ...data,
            id,
            userId: currentUser.id,
            userName: currentUser.name,
            date: new Date(),
            status: 'pending'
        });
    };

    const approveExpense = async (id: string) => {
        const claim = await db.expenseClaims.get(id);
        if (!claim || !currentUser) return;

        const pieceNum = `NDF-${id.slice(-6)}`;
        const journalId = `je_exp_${id}`;

        await db.transaction('rw', [db.expenseClaims, db.journalEntries], async () => {
            await db.expenseClaims.update(id, {
                status: 'approved',
                approvedBy: currentUser.id,
                approvedAt: new Date(),
                journalEntryId: journalId
            });

            await db.journalEntries.add({
                id: journalId,
                date: new Date(),
                pieceNumber: pieceNum,
                description: `Note de frais: ${claim.description}`,
                referenceId: id,
                referenceType: 'expense',
                isSystemGenerated: true,
                isValidated: true,
                lines: [
                    { accountId: 'acc_606', accountCode: '606', accountName: 'Achats non stockés', side: 'debit', amount: claim.amount, description: claim.description },
                    { accountId: 'acc_512', accountCode: '512', accountName: 'Banque', side: 'credit', amount: claim.amount, description: 'Remboursement' }
                ]
            });
        });
    };

    const rejectExpense = async (id: string) => {
        await db.expenseClaims.update(id, { status: 'rejected' });
    };

    const createManualEntry = async (entryData: Omit<JournalEntry, 'id' | 'pieceNumber' | 'isSystemGenerated' | 'isValidated'>) => {
        const id = `je_man_${Math.random().toString(36).substr(2, 9)}`;
        const pieceNum = `OD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${id.slice(-4)}`;
        await db.journalEntries.add({
            ...entryData,
            id,
            pieceNumber: pieceNum,
            isSystemGenerated: false,
            isValidated: false,
            createdBy: currentUser?.id
        });
    };

    const validateEntry = async (id: string) => {
        if (!currentUser) return;
        await db.journalEntries.update(id, {
            isValidated: true,
            validatedBy: currentUser.id,
            validatedAt: new Date()
        });
    };

    // Reports
    const generatePandL = useCallback((periodId: string): ProfitAndLossReport => {
        const revenues = ledger.filter(a => a.type === 'revenue' && a.balance !== 0);
        const expenses = ledger.filter(a => a.type === 'expense' && a.balance !== 0);

        return {
            periodId,
            periodName: fiscalPeriods.find(p => p.id === periodId)?.name || 'Période courante',
            revenues: revenues.map(a => ({ accountCode: a.code, accountName: a.name, amount: a.balance })),
            expenses: expenses.map(a => ({ accountCode: a.code, accountName: a.name, amount: a.balance })),
            totalRevenue: metrics.totalRevenue,
            totalExpenses: metrics.totalExpenses,
            netResult: metrics.netProfit,
            generatedAt: new Date()
        };
    }, [ledger, metrics, fiscalPeriods]);

    const generateBalanceSheet = useCallback((asOfDate: Date): BalanceSheetReport => {
        const assets = ledger.filter(a => a.type === 'asset' && a.balance !== 0);
        const liabilities = ledger.filter(a => a.type === 'liability' && a.balance !== 0);
        const equity = ledger.filter(a => a.type === 'equity' && a.balance !== 0);

        const totalAssets = assets.reduce((acc, a) => acc + a.balance, 0);
        const totalLiabilities = liabilities.reduce((acc, a) => acc + a.balance, 0);
        const totalEquity = equity.reduce((acc, a) => acc + a.balance, 0) + metrics.netProfit;

        return {
            asOfDate,
            assets: assets.map(a => ({ accountCode: a.code, accountName: a.name, amount: a.balance })),
            liabilities: liabilities.map(a => ({ accountCode: a.code, accountName: a.name, amount: a.balance })),
            equity: equity.map(a => ({ accountCode: a.code, accountName: a.name, amount: a.balance })),
            totalAssets,
            totalLiabilities,
            totalEquity,
            isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01,
            generatedAt: new Date()
        };
    }, [ledger, metrics]);

    const generateTrialBalance = useCallback((periodId: string): TrialBalance => {
        const accountsWithMovement = ledger.filter(a => a.debitTotal !== 0 || a.creditTotal !== 0);
        const totalDebit = accountsWithMovement.reduce((acc, a) => acc + a.debitTotal, 0);
        const totalCredit = accountsWithMovement.reduce((acc, a) => acc + a.creditTotal, 0);

        return {
            periodId,
            accounts: accountsWithMovement.map(a => ({
                code: a.code,
                name: a.name,
                debit: a.debitTotal,
                credit: a.creditTotal
            })),
            totalDebit,
            totalCredit,
            isBalanced: Math.abs(totalDebit - totalCredit) < 0.01
        };
    }, [ledger]);

    const getAccountByCode = (code: string) => accounts.find(a => a.code === code);
    const getLedgerForAccount = (accountId: string) => ledger.find(a => a.id === accountId)?.movements || [];

    return (
        <AccountingContext.Provider value={{
            accounts,
            journalEntries,
            expenseClaims,
            fiscalPeriods,
            ledger,
            isLoading,
            metrics,
            legacyMetrics,
            submitExpense,
            approveExpense,
            rejectExpense,
            createManualEntry,
            validateEntry,
            generatePandL,
            generateBalanceSheet,
            generateTrialBalance,
            getAccountByCode,
            getLedgerForAccount
        }}>
            {children}
        </AccountingContext.Provider>
    );
}

export function useAccounting() {
    const context = useContext(AccountingContext);
    if (!context) throw new Error('useAccounting must be used within AccountingProvider');
    return context;
}
