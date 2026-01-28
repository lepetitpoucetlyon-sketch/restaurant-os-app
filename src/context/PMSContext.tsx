"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Room {
    id: string;
    number: string;
    type: 'single' | 'double' | 'suite' | 'deluxe';
    status: 'vacant' | 'occupied' | 'dirty' | 'reserved';
    price: number;
    lastCleaning: string;
}

export interface Reservation {
    id: string;
    roomId: string;
    guestName: string;
    startDate: string;
    endDate: string;
    status: 'confirmed' | 'pending' | 'checked_in' | 'checked_out';
}

interface PMSContextType {
    rooms: Room[];
    reservations: Reservation[];
    updateRoomStatus: (id: string, status: Room['status']) => void;
    addReservation: (res: Omit<Reservation, 'id'>) => void;
}

const INITIAL_ROOMS: Room[] = [
    { id: '101', number: '101', type: 'double', status: 'occupied', price: 150, lastCleaning: '2026-01-07T10:00:00' },
    { id: '102', number: '102', type: 'single', status: 'vacant', price: 90, lastCleaning: '2026-01-07T09:00:00' },
    { id: '201', number: '201', type: 'suite', status: 'dirty', price: 450, lastCleaning: '2026-01-06T18:00:00' },
    { id: '202', number: '202', type: 'deluxe', status: 'reserved', price: 280, lastCleaning: '2026-01-07T11:00:00' },
    { id: '301', number: '301', type: 'suite', status: 'vacant', price: 500, lastCleaning: '2026-01-07T08:30:00' },
];

const PMSContext = createContext<PMSContextType | undefined>(undefined);

export function PMSProvider({ children }: { children: ReactNode }) {
    const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const updateRoomStatus = (id: string, status: Room['status']) => {
        setRooms(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    };

    const addReservation = (res: Omit<Reservation, 'id'>) => {
        const newRes = { ...res, id: `res_${Math.random().toString(36).substr(2, 9)}` };
        setReservations(prev => [...prev, newRes]);
    };

    return (
        <PMSContext.Provider value={{ rooms, reservations, updateRoomStatus, addReservation }}>
            {children}
        </PMSContext.Provider>
    );
}

export function usePMS() {
    const context = useContext(PMSContext);
    if (!context) throw new Error('usePMS must be used within PMSProvider');
    return context;
}
