"use client";

import React, { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Notification } from '@/types';

/**
 * NOTIFICATIONS CONTEXT - Restaurant OS
 * Manages real-time alerts and notifications across the application via Dexie.js
 */

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    removeNotification: (id: string) => Promise<void>;
    clearAll: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Initial demo notifications
const INITIAL_NOTIFICATIONS: Partial<Notification>[] = [
    { id: 'notif_1', type: 'critical', title: 'Stock Critique', message: 'Mozzarella di Bufala sous le seuil minimum (2.5kg restants)', timestamp: new Date(Date.now() - 12 * 60000), read: false, module: 'inventory', action: { label: 'Commander', href: '/inventory' } },
    { id: 'notif_2', type: 'warning', title: 'Retard Pointage', message: 'Marie Laurent - 15 min de retard au service', timestamp: new Date(Date.now() - 8 * 60000), read: false, module: 'staff', action: { label: 'Voir Planning', href: '/planning' } },
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const notifications = useLiveQuery(() => db.notifications.orderBy('timestamp').reverse().toArray()) || [];
    const isLoading = typeof notifications === 'undefined';

    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    // Initial Migration
    useEffect(() => {
        const migrate = async () => {
            const count = await db.notifications.count();
            if (count === 0) {
                const saved = localStorage.getItem('executive_os_notifications');
                if (saved) {
                    const parsed = JSON.parse(saved).map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) }));
                    await db.notifications.bulkAdd(parsed);
                } else {
                    await db.notifications.bulkAdd(INITIAL_NOTIFICATIONS as Notification[]);
                }
            }
        };
        migrate();
    }, []);

    const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            timestamp: new Date(),
            read: false,
        };
        await db.notifications.add(newNotification);
    };

    const markAsRead = async (id: string) => {
        await db.notifications.update(id, { read: true });
    };

    const markAllAsRead = async () => {
        await db.notifications.toCollection().modify({ read: true });
    };

    const removeNotification = async (id: string) => {
        await db.notifications.delete(id);
    };

    const clearAll = async () => {
        await db.notifications.clear();
    };

    return (
        <NotificationsContext.Provider value={{
            notifications,
            unreadCount,
            isLoading,
            addNotification,
            markAsRead,
            markAllAsRead,
            removeNotification,
            clearAll
        }}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (!context) throw new Error('useNotifications must be used within NotificationsProvider');
    return context;
}
