"use client";

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useOrders } from './OrdersContext';
import { useInventory } from './InventoryContext';
import type { TreasuryMetrics, BankTransaction } from '@/types';

/**
 * FINANCE CONTEXT (OPERATIONAL)
 * Gestion de la trésorerie, prévisions de cash-flow, alertes financières.
 * Séparé du module Comptabilité pour une vision opérationnelle temps réel.
 */

interface FinanceContextType {
    treasury: TreasuryMetrics;
    bankTransactions: BankTransaction[];
    isLoading: boolean;

    // Actions
    addBankTransaction: (data: Omit<BankTransaction, 'id' | 'isReconciled'>) => Promise<void>;
    reconcileTransaction: (txId: string, journalEntryId: string) => Promise<void>;

    // Alerts
    alerts: FinanceAlert[];
}

interface FinanceAlert {
    id: string;
    type: 'warning' | 'critical' | 'info';
    title: string;
    message: string;
    amount?: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
    const { orders } = useOrders();
    const { supplierOrders } = useInventory();

    const bankTransactions = useLiveQuery(() => db.bankTransactions.orderBy('date').reverse().toArray()) || [];
    const isLoading = bankTransactions === undefined;

    // Treasury Metrics Calculation
    const treasury: TreasuryMetrics = useMemo(() => {
        // Calculate from orders and supplier orders
        const paidOrders = orders.filter(o => o.status === 'paid');
        const pendingOrders = orders.filter(o => o.status !== 'paid' && o.status !== 'cancelled');

        const deliveredSupplierOrders = supplierOrders.filter(o => o.status === 'delivered');
        const pendingSupplierOrders = supplierOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

        const totalInflow = paidOrders.reduce((acc, o) => acc + o.total, 0);
        const totalOutflow = deliveredSupplierOrders.reduce((acc, o) => acc + o.totalAmount, 0);

        const pendingReceivables = pendingOrders.reduce((acc, o) => acc + o.total, 0);
        const pendingPayables = pendingSupplierOrders.reduce((acc, o) => acc + o.totalAmount, 0);

        const cashOnHand = totalInflow - totalOutflow;
        const bankBalance = bankTransactions
            .filter(t => t.isReconciled)
            .reduce((acc, t) => t.type === 'credit' ? acc + t.amount : acc - t.amount, 0);

        // Generate 30-day trend (simplified mock based on orders)
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            const dateStr = date.toISOString().split('T')[0];

            const dailyInflow = paidOrders
                .filter(o => new Date(o.timestamp).toISOString().split('T')[0] === dateStr)
                .reduce((acc, o) => acc + o.total, 0);

            const dailyOutflow = deliveredSupplierOrders
                .filter(o => o.deliveredDate && o.deliveredDate.split('T')[0] === dateStr)
                .reduce((acc, o) => acc + o.totalAmount, 0);

            return { date: dateStr, inflow: dailyInflow, outflow: dailyOutflow };
        });

        // Simple forecast: average daily net * 30
        const avgDailyNet = last30Days.reduce((acc, d) => acc + (d.inflow - d.outflow), 0) / 30;
        const forecast30Days = cashOnHand + (avgDailyNet * 30);

        return {
            cashOnHand,
            bankBalance,
            pendingReceivables,
            pendingPayables,
            netCashPosition: cashOnHand - pendingPayables + pendingReceivables,
            cashFlowTrend: last30Days,
            forecast30Days
        };
    }, [orders, supplierOrders, bankTransactions]);

    // Generate Alerts
    const alerts: FinanceAlert[] = useMemo(() => {
        const result: FinanceAlert[] = [];

        if (treasury.cashOnHand < 0) {
            result.push({
                id: 'alert_negative_cash',
                type: 'critical',
                title: 'Trésorerie Négative',
                message: 'Votre solde de trésorerie est en dessous de zéro.',
                amount: treasury.cashOnHand
            });
        }

        if (treasury.pendingPayables > treasury.cashOnHand) {
            result.push({
                id: 'alert_payables_exceed',
                type: 'warning',
                title: 'Factures Fournisseurs',
                message: 'Les factures en attente dépassent votre trésorerie disponible.',
                amount: treasury.pendingPayables - treasury.cashOnHand
            });
        }

        if (treasury.forecast30Days < 0) {
            result.push({
                id: 'alert_forecast_negative',
                type: 'warning',
                title: 'Prévision à 30 Jours',
                message: 'Votre prévision de trésorerie à 30 jours est négative.',
                amount: treasury.forecast30Days
            });
        }

        return result;
    }, [treasury]);

    // Actions
    const addBankTransaction = async (data: Omit<BankTransaction, 'id' | 'isReconciled'>) => {
        const id = `bank_${Math.random().toString(36).substr(2, 9)}`;
        await db.bankTransactions.add({
            ...data,
            id,
            isReconciled: false
        });
    };

    const reconcileTransaction = async (txId: string, journalEntryId: string) => {
        await db.bankTransactions.update(txId, {
            isReconciled: true,
            reconciledWith: journalEntryId,
            reconciledAt: new Date()
        });
    };

    return (
        <FinanceContext.Provider value={{
            treasury,
            bankTransactions,
            isLoading,
            addBankTransaction,
            reconcileTransaction,
            alerts
        }}>
            {children}
        </FinanceContext.Provider>
    );
}

export function useFinance() {
    const context = useContext(FinanceContext);
    if (!context) throw new Error('useFinance must be used within FinanceProvider');
    return context;
}
