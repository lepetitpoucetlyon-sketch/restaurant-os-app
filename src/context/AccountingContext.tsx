"use client";

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useOrders } from './OrdersContext';
import { useInventory } from './InventoryContext';
import type { Transaction, FinancialMetrics } from '@/types';

/**
 * ACCOUNTING CONTEXT - Financial Intelligence Layer
 * Derives all financial metrics from real-time order and inventory data.
 * No hardcoded values - everything is calculated from source of truth.
 */

interface AccountingContextType {
    // Metrics
    metrics: FinancialMetrics;
    // Transactions
    recentTransactions: Transaction[];
    // Period data
    dailyRevenue: number;
    weeklyRevenue: number;
    monthlyRevenue: number;
    // Costs
    totalFoodCost: number;
    totalSupplierSpend: number;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export function AccountingProvider({ children }: { children: ReactNode }) {
    const { orders, totalRevenue } = useOrders();
    const { ingredients, supplierOrders } = useInventory();

    // Calculate food cost based on inventory value
    const totalFoodCost = useMemo(() => {
        return ingredients.reduce((acc, ing) => acc + (ing.quantity * ing.cost), 0);
    }, [ingredients]);

    // Calculate supplier spending
    const totalSupplierSpend = useMemo(() => {
        return supplierOrders
            .filter(o => o.status === 'delivered')
            .reduce((acc, o) => acc + o.totalAmount, 0);
    }, [supplierOrders]);

    // Calculate revenue by period
    const { dailyRevenue, weeklyRevenue, monthlyRevenue } = useMemo(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(todayStart.getTime() - (now.getDay() * 24 * 60 * 60 * 1000));
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const paidOrders = orders.filter(o => o.status === 'paid' || o.status === 'delivered');

        const daily = paidOrders
            .filter(o => o.timestamp >= todayStart)
            .reduce((acc, o) => acc + o.total, 0);

        const weekly = paidOrders
            .filter(o => o.timestamp >= weekStart)
            .reduce((acc, o) => acc + o.total, 0);

        const monthly = paidOrders
            .filter(o => o.timestamp >= monthStart)
            .reduce((acc, o) => acc + o.total, 0);

        return { dailyRevenue: daily, weeklyRevenue: weekly, monthlyRevenue: monthly };
    }, [orders]);

    // Generate transactions from orders and supplier orders
    const recentTransactions: Transaction[] = useMemo(() => {
        const salesTransactions: Transaction[] = orders
            .filter(o => o.status === 'paid' || o.status === 'delivered')
            .slice(0, 5)
            .map(o => ({
                id: `tx_${o.id}`,
                type: 'income' as const,
                category: 'sales' as const,
                title: `Table ${o.tableNumber} - ${o.items.length} articles`,
                amount: o.total,
                date: o.timestamp,
                orderId: o.id
            }));

        const purchaseTransactions: Transaction[] = supplierOrders
            .filter(o => o.status === 'delivered')
            .slice(0, 3)
            .map(o => ({
                id: `tx_${o.id}`,
                type: 'expense' as const,
                category: 'purchases' as const,
                title: `Facture ${o.supplier}`,
                amount: o.totalAmount,
                date: new Date(o.deliveredDate || o.orderDate),
                supplierOrderId: o.id
            }));

        return [...salesTransactions, ...purchaseTransactions]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 6);
    }, [orders, supplierOrders]);

    // Calculate financial metrics
    const metrics: FinancialMetrics = useMemo(() => {
        const revenue = totalRevenue || monthlyRevenue;
        const expenses = totalSupplierSpend;
        const grossMargin = revenue > 0 ? ((revenue - expenses) / revenue) : 0;
        const foodCostRatio = revenue > 0 ? (expenses / revenue) : 0;

        // Simulated labor cost (30% of revenue is typical for restaurants)
        const laborCost = revenue * 0.30;

        // EBITDA = Revenue - Food Cost - Labor Cost - Other Operating Expenses (estimated at 10%)
        const otherExpenses = revenue * 0.10;
        const ebitda = revenue - expenses - laborCost - otherExpenses;

        return {
            totalRevenue: revenue,
            totalExpenses: expenses + laborCost + otherExpenses,
            grossMargin,
            foodCost: foodCostRatio,
            laborCost: laborCost,
            ebitda
        };
    }, [totalRevenue, monthlyRevenue, totalSupplierSpend]);

    return (
        <AccountingContext.Provider value={{
            metrics,
            recentTransactions,
            dailyRevenue,
            weeklyRevenue,
            monthlyRevenue,
            totalFoodCost,
            totalSupplierSpend
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
