"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * EXECUTIVE ORDER PIPELINE - Full Lifecycle Management
 * Handles drafting, kitchen dispatch, status tracking, and revenue calculation.
 */

import { Order, OrderStatus, OrderItem } from '@/types';

interface OrdersContextType {
    orders: Order[];
    addOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status' | 'total'>) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    updateOrderItemStatus: (orderId: string, itemIndex: number, status: OrderItem['status']) => void;
    deleteOrder: (orderId: string) => void;
    totalRevenue: number;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);

    // PERSISTENCE & INITIALIZATION
    useEffect(() => {
        const saved = localStorage.getItem('executive_orders_history');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Rehydrate Date objects
            const rehydrated = parsed.map((o: any) => ({
                ...o,
                timestamp: new Date(o.timestamp)
            }));
            setOrders(rehydrated);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('executive_orders_history', JSON.stringify(orders));
    }, [orders]);

    const addOrder = (orderData: Omit<Order, 'id' | 'timestamp' | 'status' | 'total'>) => {
        const total = orderData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const newOrder: Order = {
            ...orderData,
            id: `ORD_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            timestamp: new Date(),
            status: 'new',
            total
        };
        setOrders(prev => [newOrder, ...prev]);
    };

    const updateOrderStatus = (orderId: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    };

    const updateOrderItemStatus = (orderId: string, itemIndex: number, status: OrderItem['status']) => {
        setOrders(prev => prev.map(o => {
            if (o.id === orderId) {
                const newItems = [...o.items];
                newItems[itemIndex] = { ...newItems[itemIndex], status };
                return { ...o, items: newItems };
            }
            return o;
        }));
    };

    const deleteOrder = (orderId: string) => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
    };

    const totalRevenue = orders
        .filter(o => o.status === 'paid' || o.status === 'delivered')
        .reduce((acc, o) => acc + o.total, 0);

    return (
        <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus, updateOrderItemStatus, deleteOrder, totalRevenue }}>
            {children}
        </OrdersContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrdersContext);
    if (!context) throw new Error('useOrders must be used within OrdersProvider');
    return context;
}
