"use client";

import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { useOrders } from './OrdersContext';
import { useInventory } from './InventoryContext';
import { useAuth } from './AuthContext';
import { PRODUCTS } from '@/lib/mock-data';
import type { MenuAnalysis, StaffPerformance, WasteLog, Order, OrderItem } from '@/types';

/**
 * MANAGEMENT CONTEXT
 * Handles high-level strategic data: Menu Engineering, RH Performance, and Waste.
 */

interface ManagementContextType {
    // Menu Engineering
    menuAnalysis: MenuAnalysis[];
    // Staff Performance
    staffPerformance: StaffPerformance[];
    // Waste Tracking
    wasteLogs: WasteLog[];
    addWasteLog: (log: Omit<WasteLog, 'id' | 'timestamp'>) => void;
    // Labor Metrics
    laborCostRatio: number; // Labor Cost / Revenue
    activeStaffCount: number;
}

const ManagementContext = createContext<ManagementContextType | undefined>(undefined);

export function ManagementProvider({ children }: { children: ReactNode }) {
    const { orders, totalRevenue } = useOrders();
    const { ingredients } = useInventory();
    const { users } = useAuth();
    const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);

    // 1. Menu Engineering (Star, Plowhorse, Puzzle, Dog)
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

            // Calculate food cost for this product
            const foodCost = product.ingredients?.reduce((sum, pi) => {
                const ing = ingredients.find(i => i.id === pi.ingredientId);
                return sum + (pi.quantity * (ing?.cost || 0));
            }, 0) || 0;

            const profitability = product.price - foodCost;

            return {
                productId: product.id,
                name: product.name,
                profitability,
                popularity,
                category: 'dog' // Placeholder
            };
        });

        // Determine categories based on averages
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

                // Upsell rate: % of orders with drinks (cocktails category)
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
        // Assume active staff average hourly rate is 15€
        const activeStaff = users.length; // Simplified
        const estimatedHourlyLabor = activeStaff * 15;
        const currentRevenue = totalRevenue || 1;

        // Labor cost for current shift (simulated for demo)
        return (estimatedHourlyLabor * 8) / currentRevenue;
    }, [totalRevenue, users]);

    const addWasteLog = (log: Omit<WasteLog, 'id' | 'timestamp'>) => {
        const newLog: WasteLog = {
            ...log,
            id: `waste_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date()
        };
        setWasteLogs(prev => [newLog, ...prev]);
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
