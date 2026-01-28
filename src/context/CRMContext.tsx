"use client";

import React, { createContext, useContext, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { MOCK_CUSTOMERS } from '@/lib/mock-data';
import type { Customer } from '@/types';

interface CRMContextType {
    customers: Customer[];
    addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<void>;
    updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
    getCustomerById: (id: string) => Promise<Customer | undefined>;
    updateCustomerStats: (customerId: string) => Promise<void>;
    isLoading: boolean;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
    const customers = useLiveQuery(() => db.customers.toArray()) || [];
    const isLoading = typeof customers === 'undefined';

    // Initial Migration from Mock Data
    useEffect(() => {
        const init = async () => {
            const count = await db.customers.count();
            if (count === 0) {
                // Cast mock data to Customer[] to bypass strict type checking
                await db.customers.bulkAdd(MOCK_CUSTOMERS as unknown as Customer[]);
            }
        };
        init();
    }, []);

    const addCustomer = useCallback(async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
        const newCustomer: Customer = {
            ...customer,
            id: `cust_${Date.now()}`,
            createdAt: new Date().toISOString(),
            visitCount: customer.visitCount || 0,
            totalSpent: customer.totalSpent || 0,
            averageSpend: customer.averageSpend || 0,
            tags: customer.tags || [],
            preferences: customer.preferences || []
        };

        await db.customers.add(newCustomer);
    }, []);

    const updateCustomer = useCallback(async (id: string, updates: Partial<Customer>) => {
        await db.customers.update(id, updates);
    }, []);

    const deleteCustomer = useCallback(async (id: string) => {
        await db.customers.delete(id);
    }, []);

    const getCustomerById = useCallback(async (id: string) => {
        return await db.customers.get(id);
    }, []);

    // New Intelligent Action: Update stats based on real orders
    const updateCustomerStats = useCallback(async (customerId: string) => {
        const customerOrders = await db.orders
            .where('customerId')
            .equals(customerId)
            .toArray();

        const totalSpent = customerOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const visitCount = customerOrders.length;
        // Last visit is the most recent order timestamp
        const lastVisitDate = customerOrders.length > 0
            ? customerOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0].timestamp
            : undefined;

        await db.customers.update(customerId, {
            totalSpent,
            visitCount,
            lastVisit: lastVisitDate ? new Date(lastVisitDate).toISOString() : undefined
        });
    }, []);

    const value = useMemo(() => ({
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        updateCustomerStats,
        isLoading
    }), [customers, addCustomer, updateCustomer, deleteCustomer, getCustomerById, updateCustomerStats, isLoading]);

    return (
        <CRMContext.Provider value={value}>
            {children}
        </CRMContext.Provider>
    );
}

export function useCRM() {
    const context = useContext(CRMContext);
    if (!context) throw new Error('useCRM must be used within CRMProvider');
    return context;
}
