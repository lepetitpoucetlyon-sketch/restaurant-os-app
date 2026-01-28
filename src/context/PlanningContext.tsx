"use client";

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { User, useAuth } from './AuthContext';
import { addDays } from "date-fns";

/**
 * PLANNING & SHIFT CONTEXT
 * Manages shifts, schedules, and staff assignments with Dexie.js persistence.
 */

type ShiftType = 'morning' | 'lunch' | 'evening' | 'double' | 'off';

export interface Shift {
    id: string;
    userId: string;
    date: Date;
    startTime: string;
    endTime: string;
    zoneId?: string;
    type: ShiftType;
    status: 'published' | 'draft';
}

interface PlanningContextType {
    shifts: Shift[];
    addShift: (shift: Omit<Shift, 'id'>) => Promise<void>;
    updateShift: (id: string, updates: Partial<Shift>) => Promise<void>;
    deleteShift: (id: string) => Promise<void>;
    publishShifts: (userIds: string[], startDate: Date, endDate: Date) => Promise<void>;
    getComplianceAlerts: (userId: string, weekStart: Date) => any[];
    isLoading: boolean;
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

const ZONES = [
    { id: 'main', name: 'Salle Principale' },
    { id: 'terrace', name: 'Terrasse' },
    { id: 'vip', name: 'Carré VIP' },
    { id: 'bar', name: 'Bar' },
];

export function PlanningProvider({ children }: { children: ReactNode }) {
    const { users, logAction } = useAuth();
    const shiftsQueryResult = useLiveQuery(() => db.table('shifts').toArray());
    const shifts = shiftsQueryResult || [];

    // Initial Migration
    useEffect(() => {
        const init = async () => {
            const count = await db.table('shifts').count();
            if (count === 0 && users.length > 0) {
                // Generate some initial mock shifts if empty
                const initialShifts: Shift[] = [];
                const startDate = new Date();
                startDate.setHours(0, 0, 0, 0);

                users.forEach(user => {
                    for (let i = 0; i < 7; i++) {
                        const date = addDays(startDate, i);
                        if (Math.random() > 0.8) continue;
                        const isEvening = Math.random() > 0.5;
                        initialShifts.push({
                            id: `shift_${Math.random().toString(36).substr(2, 9)}`,
                            userId: user.id,
                            date: date,
                            startTime: isEvening ? "18:00" : "11:00",
                            endTime: isEvening ? "23:00" : "15:00",
                            type: isEvening ? 'evening' : 'lunch',
                            zoneId: ZONES[Math.floor(Math.random() * ZONES.length)].id,
                            status: 'published'
                        });
                    }
                });
                await db.table('shifts').bulkAdd(initialShifts);
            }
        };
        init();
    }, [users]);

    const addShift = async (shift: Omit<Shift, 'id'>) => {
        const newShift: Shift = {
            ...shift,
            id: `shift_${Date.now()}`,
        };
        await db.table('shifts').add(newShift);
        await logAction('create_shift', { userId: shift.userId, date: shift.date });
    };

    const updateShift = async (id: string, updates: Partial<Shift>) => {
        await db.table('shifts').update(id, updates);
        await logAction('update_shift', { id, ...updates });
    };

    const deleteShift = async (id: string) => {
        const shift = await db.table('shifts').get(id);
        await db.table('shifts').delete(id);
        if (shift) await logAction('delete_shift', { userId: shift.userId, date: shift.date });
    };

    const publishShifts = async (userIds: string[], startDate: Date, endDate: Date) => {
        const shiftsToPublish = await db.table('shifts')
            .where('userId').anyOf(userIds)
            .filter((s: Shift) => s.date >= startDate && s.date <= endDate)
            .toArray();

        for (const s of shiftsToPublish) {
            await db.table('shifts').update(s.id, { status: 'published' });
        }
        await logAction('publish_planning', { count: shiftsToPublish.length });
    };

    const getComplianceAlerts = (userId: string, weekStart: Date) => {
        const alerts: any[] = [];
        const userShifts = shifts.filter(s => s.userId === userId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // 1. Check Weekly Hours
        const weekEnd = addDays(weekStart, 6);
        const weeklyShifts = userShifts.filter(s => new Date(s.date) >= weekStart && new Date(s.date) <= weekEnd);
        const totalHours = weeklyShifts.reduce((acc, s) => {
            const h = parseInt(s.endTime.split(':')[0]) - parseInt(s.startTime.split(':')[0]);
            return acc + (h > 0 ? h : 0);
        }, 0);

        if (totalHours > 44) {
            alerts.push({ type: 'weekly_hours', severity: 'warning', message: `Dépassement d'heures (${totalHours}h/44h max)` });
        } else if (totalHours > 48) {
            alerts.push({ type: 'weekly_hours', severity: 'blocking', message: `Violation Légale: ${totalHours}h` });
        }

        // 2. Check Daily Rest (11h between shifts)
        for (let i = 0; i < userShifts.length - 1; i++) {
            const current = userShifts[i];
            const next = userShifts[i + 1];

            const currentEnd = new Date(current.date);
            currentEnd.setHours(parseInt(current.endTime.split(':')[0]), 0, 0, 0);

            const nextStart = new Date(next.date);
            nextStart.setHours(parseInt(next.startTime.split(':')[0]), 0, 0, 0);

            const hoursDiff = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60 * 60);
            if (hoursDiff > 0 && hoursDiff < 11) {
                alerts.push({
                    type: 'daily_rest',
                    severity: 'warning',
                    message: `Repos insuffisant entre le ${formatDate(current.date)} et ${formatDate(next.date)} (${Math.round(hoursDiff)}h/11h)`
                });
            }
        }

        return alerts;
    };

    const formatDate = (date: any) => {
        return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    return (
        <PlanningContext.Provider value={{
            shifts,
            addShift,
            updateShift,
            deleteShift,
            publishShifts,
            getComplianceAlerts,
            isLoading: shiftsQueryResult === undefined
        }}>
            {children}
        </PlanningContext.Provider>
    );
}

export function usePlanning() {
    const context = useContext(PlanningContext);
    if (!context) throw new Error('usePlanning must be used within PlanningProvider');
    return context;
}
