"use client";

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useOrders } from './OrdersContext';
import { useInventory } from './InventoryContext';
import { useAuth } from './AuthContext';
import { PRODUCTS } from '@/lib/mock-data';
import type { MenuAnalysis, StaffPerformance, WasteLog } from '@/types';

/**
 * MANAGEMENT CONTEXT
 * Handles high-level strategic data: Menu Engineering, RH Performance, and Waste via Dexie.js.
 */

interface ManagementContextType {
    // Menu Engineering
    menuAnalysis: MenuAnalysis[];
    // Staff Performance
    staffPerformance: StaffPerformance[];
    // Waste Tracking
    wasteLogs: WasteLog[];
    addWasteLog: (log: Omit<WasteLog, 'id' | 'timestamp'>) => Promise<void>;
    // Labor Metrics
    laborCostRatio: number; // Labor Cost / Revenue
    activeStaffCount: number;
}

const ManagementContext = createContext<ManagementContextType | undefined>(undefined);

export function ManagementProvider({ children }: { children: ReactNode }) {
    const { orders, totalRevenue } = useOrders();
    const { ingredients } = useInventory();
    const { users } = useAuth();

    const wasteLogs = useLiveQuery(() => db.wasteLogs.orderBy('timestamp').reverse().toArray()) || [];

    // 1. Menu Engineering
    const menuAnalysis: MenuAnalysis[] = useMemo(() => {
        const itemSales = orders
            .filter(o => o.status === 'paid' || o.status === 'delivered')
            .flatMap(o => o.items)
            .reduce((acc, item) => {
                acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
                return acc;
            }, {} as Record<string, number>);

        const analysis: MenuAnalysis[] = PRODUCTS.map(product => {
            const popularity = itemSales[product.id] || 0;
            const foodCost = product.ingredients?.reduce((sum, pi) => {
                const ing = ingredients.find(i => i.id === pi.ingredientId);
                return sum + (pi.quantity * (ing?.cost || 0));
            }, 0) || 0;

            return {
                productId: product.id,
                name: product.name,
                profitability: product.price - foodCost,
                popularity,
                category: 'dog'
            };
        });

        const avgPopularity = analysis.reduce((sum, item) => sum + item.popularity, 0) / (analysis.length || 1);
        const avgProfitability = analysis.reduce((sum, item) => sum + item.profitability, 0) / (analysis.length || 1);

        return analysis.map(item => {
            const highPop = item.popularity >= avgPopularity;
            const highProf = item.profitability >= avgProfitability;

            let category: MenuAnalysis['category'] = 'dog';
            if (highPop && highProf) category = 'star';
            else if (highPop && !highProf) category = 'plowhorse';
            else if (!highPop && highProf) category = 'puzzle';

            return { ...item, category };
        });
    }, [orders, ingredients]);

    // 2. Staff Performance
    const staffPerformance: StaffPerformance[] = useMemo(() => {
        return users
            .filter(u => u.role === 'server')
            .map(user => {
                const serverOrders = orders.filter(o => o.serverName === user.name);
                const totalSales = serverOrders.reduce((sum, o) => sum + o.total, 0);
                const orderCount = serverOrders.length;
                const upsellOrders = serverOrders.filter(o =>
                    o.items.some(item => {
                        const p = PRODUCTS.find(prod => prod.id === item.productId);
                        return p?.categoryId === 'cocktails';
                    })
                ).length;

                return {
                    userId: user.id,
                    userName: user.name,
                    totalSales,
                    orderCount,
                    averageCheck: orderCount > 0 ? totalSales / orderCount : 0,
                    upsellRate: orderCount > 0 ? (upsellOrders / orderCount) * 100 : 0,
                    kudos: (user as any).kudos || 0
                };
            });
    }, [orders, users]);

    // 3. Labor Cost
    const laborCostRatio = useMemo(() => {
        const activeStaff = users.length;
        const estimatedHourlyLabor = activeStaff * 15;
        const currentRevenue = totalRevenue || 1;
        return (estimatedHourlyLabor * 8) / currentRevenue;
    }, [totalRevenue, users]);

    const addWasteLog = async (log: Omit<WasteLog, 'id' | 'timestamp'>) => {
        const newLog: WasteLog = {
            ...log,
            id: `waste_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            timestamp: new Date()
        };
        await db.wasteLogs.add(newLog);
    };

    return (
        <ManagementContext.Provider value={{
            menuAnalysis,
            staffPerformance,
            wasteLogs,
            addWasteLog,
            laborCostRatio,
            activeStaffCount: users.length
        }}>
            {children}
        </ManagementContext.Provider>
    );
}

export function useManagement() {
    const context = useContext(ManagementContext);
    if (!context) throw new Error('useManagement must be used within ManagementProvider');
    return context;
}
