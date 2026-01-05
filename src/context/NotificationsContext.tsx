"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * NOTIFICATIONS CONTEXT - Restaurant OS
 * Manages real-time alerts and notifications across the application
 */

export type NotificationType = 'info' | 'warning' | 'critical' | 'success';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    module?: string;
    action?: {
        label: string;
        href?: string;
    };
}

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Initial demo notifications
const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif_1',
        type: 'critical',
        title: 'Stock Critique',
        message: 'Mozzarella di Bufala sous le seuil minimum (2.5kg restants)',
        timestamp: new Date(Date.now() - 12 * 60000),
        read: false,
        module: 'inventory',
        action: { label: 'Commander', href: '/inventory' }
    },
    {
        id: 'notif_2',
        type: 'warning',
        title: 'Retard Pointage',
        message: 'Marie Laurent - 15 min de retard au service',
        timestamp: new Date(Date.now() - 8 * 60000),
        read: false,
        module: 'staff',
        action: { label: 'Voir Planning', href: '/planning' }
    },
    {
        id: 'notif_3',
        type: 'info',
        title: 'Réservation VIP',
        message: 'Marco Rossi (fidèle) arrive dans 30 minutes - Table 4',
        timestamp: new Date(Date.now() - 30 * 60000),
        read: false,
        module: 'reservations',
        action: { label: 'Voir Réservation', href: '/reservations' }
    },
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('executive_os_notifications');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setNotifications(parsed.map((n: any) => ({
                    ...n,
                    timestamp: new Date(n.timestamp)
                })));
            } catch {
                setNotifications(INITIAL_NOTIFICATIONS);
            }
        } else {
            setNotifications(INITIAL_NOTIFICATIONS);
        }
    }, []);

    // Save to localStorage when changed
    useEffect(() => {
        if (notifications.length > 0) {
            localStorage.setItem('executive_os_notifications', JSON.stringify(notifications));
        }
    }, [notifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif_${Date.now()}`,
            timestamp: new Date(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
        localStorage.removeItem('executive_os_notifications');
    };

    return (
        <NotificationsContext.Provider value={{
            notifications,
            unreadCount,
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
