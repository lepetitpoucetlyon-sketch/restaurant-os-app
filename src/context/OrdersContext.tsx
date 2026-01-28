"use client";

import React, { createContext, useContext, useEffect, ReactNode, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Order, OrderStatus, OrderItem, OrderItemModification, ModificationStatus } from '@/types';
import { useInventoryActions } from './InventoryContext';
import { useCRM } from './CRMContext';

/**
 * EXECUTIVE ORDER PIPELINE - Full Lifecycle Management
 * Handles drafting, kitchen dispatch, status tracking, and revenue calculation via Dexie.js.
 */

interface OrdersContextType {
    orders: Order[];
    addOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status' | 'total'> & { status?: OrderStatus }) => Promise<void>;
    updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
    updateOrderItemStatus: (orderId: string, itemIndex: number, status: OrderItem['status']) => Promise<void>;
    updateOrderItem: (orderId: string, itemId: string, updates: Partial<OrderItem>) => Promise<void>;
    deleteOrder: (orderId: string) => Promise<void>;
    requestItemModification: (orderId: string, itemId: string, modification: Omit<OrderItemModification, 'id' | 'orderId' | 'orderItemId' | 'requestedAt' | 'status'>) => Promise<void>;
    respondToModification: (orderId: string, itemId: string, approved: boolean, respondedBy: string, responseNote?: string) => Promise<void>;
    getPendingModifications: () => OrderItemModification[];
    totalRevenue: number;
    isLoading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
    // 1. Reactive Query for Orders
    const orders = useLiveQuery(() => db.orders.orderBy('timestamp').reverse().toArray()) || [];
    const isLoading = typeof orders === 'undefined';

    // Services
    const { deductStockForProduct } = useInventoryActions();
    const { updateCustomerStats } = useCRM();

    // 2. Initial Migration from LocalStorage
    useEffect(() => {
        const migrate = async () => {
            const count = await db.orders.count();
            if (count === 0) {
                const saved = localStorage.getItem('executive_orders_history');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    const rehydrated = parsed.map((o: any) => ({
                        ...o,
                        timestamp: new Date(o.timestamp)
                    }));
                    await db.orders.bulkAdd(rehydrated);
                }
            }
        };
        migrate();
    }, []);

    // 3. Operations
    const addOrder = async (orderData: Omit<Order, 'id' | 'timestamp' | 'status' | 'total'> & { status?: OrderStatus }) => {
        const total = orderData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const newOrder: Order = {
            ...orderData,
            id: `ORD_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            timestamp: new Date(),
            status: orderData.status || 'new',
            total
        };
        await db.orders.add(newOrder);
    };

    const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
        const order = await db.orders.get(orderId);
        if (!order) return;

        await db.orders.update(orderId, { status });

        // Trigger Intelligent Actions on Payment
        if (status === 'paid' && order.status !== 'paid') {
            // 1. Deduct Stock
            for (const item of order.items) {
                if (item.productId) {
                    await deductStockForProduct(item.productId, item.quantity);
                }
            }

            // 2. Update CRM stats
            if (order.customerId) {
                await updateCustomerStats(order.customerId);
            }
        }
    };

    const updateOrderItemStatus = async (orderId: string, itemIndex: number, status: OrderItem['status']) => {
        const order = await db.orders.get(orderId);
        if (order) {
            const newItems = [...order.items];
            newItems[itemIndex] = { ...newItems[itemIndex], status };
            await db.orders.update(orderId, { items: newItems });
        }
    };

    const updateOrderItem = async (orderId: string, itemId: string, updates: Partial<OrderItem>) => {
        const order = await db.orders.get(orderId);
        if (order) {
            const newItems = order.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
            );
            const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            await db.orders.update(orderId, { items: newItems, total: newTotal });
        }
    };

    const requestItemModification = async (
        orderId: string,
        itemId: string,
        modification: Omit<OrderItemModification, 'id' | 'orderId' | 'orderItemId' | 'requestedAt' | 'status'>
    ) => {
        const order = await db.orders.get(orderId);
        if (order) {
            const newModification: OrderItemModification = {
                ...modification,
                id: `MOD_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                orderId,
                orderItemId: itemId,
                requestedAt: new Date(),
                status: 'pending'
            };

            const newItems = order.items.map(item =>
                item.id === itemId ? { ...item, pendingModification: newModification } : item
            );
            await db.orders.update(orderId, { items: newItems });
        }
    };

    const respondToModification = async (
        orderId: string,
        itemId: string,
        approved: boolean,
        respondedBy: string,
        responseNote?: string
    ) => {
        const order = await db.orders.get(orderId);
        if (order) {
            const newItems = order.items.map(item => {
                if (item.id === itemId && item.pendingModification) {
                    const updatedMod: OrderItemModification = {
                        ...item.pendingModification,
                        status: approved ? 'approved' : 'rejected',
                        respondedBy,
                        respondedAt: new Date(),
                        responseNote
                    };

                    // If approved, apply the modification
                    if (approved) {
                        let updatedItem = { ...item, pendingModification: undefined };

                        switch (item.pendingModification.type) {
                            case 'ingredient_remove':
                                updatedItem.removedIngredients = [
                                    ...(item.removedIngredients || []),
                                    item.pendingModification.newValue || ''
                                ];
                                break;
                            case 'ingredient_add':
                                updatedItem.addedIngredients = [
                                    ...(item.addedIngredients || []),
                                    item.pendingModification.newValue || ''
                                ];
                                break;
                            case 'note_update':
                                updatedItem.notes = item.pendingModification.newValue;
                                break;
                            case 'quantity_change':
                                updatedItem.quantity = parseInt(item.pendingModification.newValue || '1');
                                break;
                        }
                        return updatedItem;
                    } else {
                        // If rejected, just clear the pending modification
                        return { ...item, pendingModification: undefined };
                    }
                }
                return item;
            });

            const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            await db.orders.update(orderId, { items: newItems, total: newTotal });
        }
    };

    const getPendingModifications = (): OrderItemModification[] => {
        const mods: OrderItemModification[] = [];
        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.pendingModification && item.pendingModification.status === 'pending') {
                    mods.push(item.pendingModification);
                }
            });
        });
        return mods;
    };

    const deleteOrder = async (orderId: string) => {
        await db.orders.delete(orderId);
    };

    // 4. Derived State
    const totalRevenue = useMemo(() => {
        return orders
            .filter(o => o.status === 'paid' || o.status === 'delivered')
            .reduce((acc, o) => acc + o.total, 0);
    }, [orders]);

    return (
        <OrdersContext.Provider value={{
            orders,
            addOrder,
            updateOrderStatus,
            updateOrderItemStatus,
            updateOrderItem,
            deleteOrder,
            requestItemModification,
            respondToModification,
            getPendingModifications,
            totalRevenue,
            isLoading
        }}>
            {children}
        </OrdersContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrdersContext);
    if (!context) throw new Error('useOrders must be used within OrdersProvider');
    return context;
}

