"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * EXECUTIVE GUEST CRM - Advanced Reservations & Customer Management System
 * Tracks guest preferences, historical covers, and sophisticated seating timing.
 */

import { Customer, Reservation, ReservationStatus } from '@/types';

// --- Mock Data ---
const MOCK_CUSTOMERS: Customer[] = [
    {
        id: 'cust_1',
        firstName: 'Marco',
        lastName: 'Rossi',
        email: 'marco.rossi@business.com',
        phone: '06 12 34 56 78',
        preferences: ['Près fenêtre', 'Vin rouge'],
        tags: ['VIP', 'Business'],
        visitCount: 12,
        totalSpent: 1850.00,
        averageSpend: 154.17,
        lastVisit: '2025-12-22',
        createdAt: '2024-03-15'
    },
    {
        id: 'cust_2',
        firstName: 'Claire',
        lastName: 'Durand',
        email: 'claire.d@gmail.com',
        phone: '06 87 65 43 21',
        birthDate: '1985-12-29',
        preferences: ['Végétarien', 'Sans gluten'],
        tags: ['Anniversaire'],
        visitCount: 2,
        totalSpent: 180.00,
        averageSpend: 90.00,
        lastVisit: '2025-11-15',
        createdAt: '2025-11-15'
    },
    {
        id: 'cust_3',
        firstName: 'Jean',
        lastName: 'Dupont',
        phone: '07 11 22 33 44',
        preferences: [],
        tags: ['Famille'],
        visitCount: 1,
        totalSpent: 95.00,
        averageSpend: 95.00,
        createdAt: '2025-12-20'
    },
];

const MOCK_RESERVATIONS: Reservation[] = [
    {
        id: 'res_1',
        customerId: 'cust_1',
        customerName: 'M. Rossi',
        phone: '06 12 34 56 78',
        date: '2025-12-29',
        time: '12:30',
        covers: 4,
        tableId: 't1',
        status: 'confirmed',
        tags: ['Business', 'Proche Fenêtre'],
        isVip: true,
        visitCount: 12
    },
    {
        id: 'res_2',
        customerId: 'cust_2',
        customerName: 'Mme. Durand',
        phone: '06 87 65 43 21',
        date: '2025-12-29',
        time: '13:00',
        covers: 2,
        tableId: 't2',
        status: 'seated',
        tags: ['Anniversaire'],
        visitCount: 2
    },
    {
        id: 'res_3',
        customerId: 'cust_3',
        customerName: 'Jean Dupont',
        phone: '07 11 22 33 44',
        date: '2025-12-29',
        time: '13:15',
        covers: 6,
        tableId: 't4',
        status: 'confirmed',
        tags: ['Famille'],
        visitCount: 1
    },
];

interface ReservationsContextType {
    // Reservations
    reservations: Reservation[];
    addReservation: (res: Reservation) => void;
    updateReservationStatus: (id: string, status: ReservationStatus) => void;
    deleteReservation: (id: string) => void;
    getReservationsForDate: (date: string) => Reservation[];
    getReservationsForTable: (tableId: string) => Reservation[];
    // Customer CRM
    customers: Customer[];
    addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'visitCount' | 'totalSpent' | 'averageSpend'>) => Customer;
    updateCustomer: (id: string, updates: Partial<Customer>) => void;
    getCustomerById: (id: string) => Customer | undefined;
    getCustomerHistory: (customerId: string) => Reservation[];
    recordVisit: (customerId: string, amountSpent: number) => void;
}

const ReservationsContext = createContext<ReservationsContextType | undefined>(undefined);

export function ReservationsProvider({ children }: { children: ReactNode }) {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        const savedRes = localStorage.getItem('executive_reservations_db');
        setReservations(savedRes ? JSON.parse(savedRes) : MOCK_RESERVATIONS);

        const savedCust = localStorage.getItem('executive_customers_db');
        setCustomers(savedCust ? JSON.parse(savedCust) : MOCK_CUSTOMERS);
    }, []);

    useEffect(() => {
        if (reservations.length > 0) localStorage.setItem('executive_reservations_db', JSON.stringify(reservations));
    }, [reservations]);

    useEffect(() => {
        if (customers.length > 0) localStorage.setItem('executive_customers_db', JSON.stringify(customers));
    }, [customers]);

    // --- Reservation Methods ---
    const addReservation = (res: Reservation) => {
        setReservations(prev => [...prev, { ...res, id: `res_${Math.random().toString(36).substr(2, 9)}` }]);
    };

    const updateReservationStatus = (id: string, status: ReservationStatus) => {
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    };

    const deleteReservation = (id: string) => {
        setReservations(prev => prev.filter(r => r.id !== id));
    };

    const getReservationsForDate = (date: string) => reservations.filter(r => r.date === date);
    const getReservationsForTable = (tableId: string) => reservations.filter(r => r.tableId === tableId);

    // --- Customer CRM Methods ---
    const addCustomer = (data: Omit<Customer, 'id' | 'createdAt' | 'visitCount' | 'totalSpent' | 'averageSpend'>): Customer => {
        const newCustomer: Customer = {
            ...data,
            id: `cust_${Math.random().toString(36).substr(2, 9)}`,
            visitCount: 0,
            totalSpent: 0,
            averageSpend: 0,
            createdAt: new Date().toISOString().split('T')[0]
        };
        setCustomers(prev => [...prev, newCustomer]);
        return newCustomer;
    };

    const updateCustomer = (id: string, updates: Partial<Customer>) => {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const getCustomerById = (id: string) => customers.find(c => c.id === id);

    const getCustomerHistory = (customerId: string) => reservations.filter(r => r.customerId === customerId);

    const recordVisit = (customerId: string, amountSpent: number) => {
        setCustomers(prev => prev.map(c => {
            if (c.id === customerId) {
                const newVisitCount = c.visitCount + 1;
                const newTotalSpent = c.totalSpent + amountSpent;
                return {
                    ...c,
                    visitCount: newVisitCount,
                    totalSpent: newTotalSpent,
                    averageSpend: newTotalSpent / newVisitCount,
                    lastVisit: new Date().toISOString().split('T')[0]
                };
            }
            return c;
        }));
    };

    return (
        <ReservationsContext.Provider value={{
            reservations,
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

