"use client";

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Customer, Reservation, ReservationStatus } from '@/types';

/**
 * EXECUTIVE GUEST CRM - Advanced Reservations & Customer Management System
 * Tracks guest preferences, historical covers, and sophisticated seating timing via Dexie.js.
 */

const MOCK_CUSTOMERS: Customer[] = [
    { id: 'cust_1', firstName: 'Marco', lastName: 'Rossi', email: 'marco.rossi@business.com', phone: '06 12 34 56 78', preferences: ['Près fenêtre', 'Vin rouge'], tags: ['VIP', 'Business'], visitCount: 12, totalSpent: 1850.00, averageSpend: 154.17, lastVisit: '2025-12-22', createdAt: '2024-03-15' },
    { id: 'cust_2', firstName: 'Claire', lastName: 'Durand', email: 'claire.d@gmail.com', phone: '06 87 65 43 21', birthDate: '1985-12-29', preferences: ['Végétarien', 'Sans gluten'], tags: ['Anniversaire'], visitCount: 2, totalSpent: 180.00, averageSpend: 90.00, lastVisit: '2025-11-15', createdAt: '2025-11-15' },
];

const MOCK_RESERVATIONS: Reservation[] = [
    { id: 'res_1', customerId: 'cust_1', customerName: 'M. Rossi', phone: '06 12 34 56 78', date: '2025-12-29', time: '12:30', covers: 4, tableId: 't1', status: 'confirmed', tags: ['Business', 'Proche Fenêtre'], isVip: true, visitCount: 12, duration: 120 },
];

interface ReservationsContextType {
    reservations: Reservation[];
    isLoading: boolean;
    addReservation: (res: Reservation) => Promise<void>;
    updateReservationStatus: (id: string, status: ReservationStatus) => Promise<void>;
    deleteReservation: (id: string) => Promise<void>;
    getReservationsForDate: (date: string) => Reservation[];
    getReservationsForTable: (tableId: string) => Reservation[];
    customers: Customer[];
    addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'visitCount' | 'totalSpent' | 'averageSpend'>) => Promise<Customer>;
    updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
    getCustomerById: (id: string) => Promise<Customer | undefined>;
    getCustomerHistory: (customerId: string) => Reservation[];
    recordVisit: (customerId: string, amountSpent: number) => Promise<void>;
}

const ReservationsContext = createContext<ReservationsContextType | undefined>(undefined);

export function ReservationsProvider({ children }: { children: ReactNode }) {
    // 1. Reactive Queries
    const reservations = useLiveQuery(() => db.reservations.toArray()) || [];
    const customers = useLiveQuery(() => db.customers.toArray()) || [];
    const isLoading = typeof reservations === 'undefined' || typeof customers === 'undefined';

    // 2. Initial Migration
    useEffect(() => {
        const migrate = async () => {
            const resCount = await db.reservations.count();
            if (resCount === 0) {
                const savedRes = localStorage.getItem('executive_reservations_db');
                await db.reservations.bulkAdd(savedRes ? JSON.parse(savedRes) : MOCK_RESERVATIONS);
            }

            const custCount = await db.customers.count();
            if (custCount === 0) {
                const savedCust = localStorage.getItem('executive_customers_db');
                await db.customers.bulkAdd(savedCust ? JSON.parse(savedCust) : MOCK_CUSTOMERS);
            }
        };
        migrate();
    }, []);

    // 3. Reservation Operations
    const addReservation = async (res: Reservation) => {
        const id = `res_${Math.random().toString(36).substr(2, 9)}`;
        await db.reservations.add({ ...res, id });
    };

    const updateReservationStatus = async (id: string, status: ReservationStatus) => {
        await db.reservations.update(id, { status });
    };

    const deleteReservation = async (id: string) => {
        await db.reservations.delete(id);
    };

    const getReservationsForDate = (date: string) => reservations.filter(r => r.date === date);
    const getReservationsForTable = (tableId: string) => reservations.filter(r => r.tableId === tableId);

    // 4. Customer CRM Operations
    const addCustomer = async (data: Omit<Customer, 'id' | 'createdAt' | 'visitCount' | 'totalSpent' | 'averageSpend'>): Promise<Customer> => {
        const id = `cust_${Math.random().toString(36).substr(2, 9)}`;
        const newCustomer: Customer = {
            ...data,
            id,
            visitCount: 0,
            totalSpent: 0,
            averageSpend: 0,
            createdAt: new Date().toISOString().split('T')[0]
        };
        await db.customers.add(newCustomer);
        return newCustomer;
    };

    const updateCustomer = async (id: string, updates: Partial<Customer>) => {
        await db.customers.update(id, updates);
    };

    const getCustomerById = async (id: string) => {
        return await db.customers.get(id);
    };

    const getCustomerHistory = (customerId: string) => reservations.filter(r => r.customerId === customerId);

    const recordVisit = async (customerId: string, amountSpent: number) => {
        await db.transaction('rw', db.customers, async () => {
            const c = await db.customers.get(customerId);
            if (c) {
                const newVisitCount = c.visitCount + 1;
                const newTotalSpent = c.totalSpent + amountSpent;
                await db.customers.update(customerId, {
                    visitCount: newVisitCount,
                    totalSpent: newTotalSpent,
                    averageSpend: newTotalSpent / newVisitCount,
                    lastVisit: new Date().toISOString().split('T')[0]
                });
            }
        });
    };

    return (
        <ReservationsContext.Provider value={{
            reservations,
            isLoading,
            addReservation,
            updateReservationStatus,
            deleteReservation,
            getReservationsForDate,
            getReservationsForTable,
            customers,
            addCustomer,
            updateCustomer,
            getCustomerById,
            getCustomerHistory,
            recordVisit
        }}>
            {children}
        </ReservationsContext.Provider>
    );
}

export function useReservations() {
    const context = useContext(ReservationsContext);
    if (!context) throw new Error('useReservations must be used within ReservationsProvider');
    return context;
}

