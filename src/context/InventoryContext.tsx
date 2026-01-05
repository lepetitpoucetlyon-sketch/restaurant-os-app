"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * EXECUTIVE INVENTORY SYSTEM - Supply Chain & HACCP Tracking
 * Tracks raw materials, allergen data, expiry dates, supplier relations, and supplier orders.
 */

import { Ingredient, SupplierOrder, SupplierOrderItem, SupplierOrderStatus } from '@/types';

const INITIAL_INGREDIENTS: Ingredient[] = [
    { id: 'ing_1', name: 'Farine Tipo 00', category: 'dry', quantity: 45, unit: 'kg', minQuantity: 10, cost: 1.2, supplier: 'Agugiaro & Figna' },
    { id: 'ing_2', name: 'Mozzarella di Bufala', category: 'dairy', quantity: 5, unit: 'kg', minQuantity: 8, cost: 14.5, supplier: 'Caseificio Campana', allergens: ['Lactose'] },
    { id: 'ing_3', name: 'Tomates San Marzano', category: 'produce', quantity: 80, unit: 'kg', minQuantity: 20, cost: 3.5, supplier: 'Pomopazzo' },
    { id: 'ing_4', name: 'Truffe Noire', category: 'other', quantity: 0.5, unit: 'kg', minQuantity: 0.2, cost: 450, supplier: 'Truffle Elite' },
    { id: 'ing_5', name: 'Basilic Frais', category: 'produce', quantity: 2, unit: 'kg', minQuantity: 1, cost: 12, supplier: 'Local Garden' },
    { id: 'ing_6', name: 'Huile d\'Olive Extra', category: 'dry', quantity: 24, unit: 'l', minQuantity: 10, cost: 8.5, supplier: 'Frantoio Galantino' },
];

const INITIAL_ORDERS: SupplierOrder[] = [
    {
        id: 'ord_1',
        supplier: 'Caseificio Campana',
        items: [
            { ingredientId: 'ing_2', ingredientName: 'Mozzarella di Bufala', quantity: 10, unitPrice: 14.5 }
        ],
        status: 'shipped',
        totalAmount: 145.00,
        orderDate: '2025-12-28',
        expectedDelivery: '2025-12-31'
    },
    {
        id: 'ord_2',
        supplier: 'Truffle Elite',
        items: [
            { ingredientId: 'ing_4', ingredientName: 'Truffe Noire', quantity: 0.5, unitPrice: 450 }
        ],
        status: 'pending',
        totalAmount: 225.00,
        orderDate: '2025-12-29',
        expectedDelivery: '2026-01-03'
    },
];

interface InventoryContextType {
    // Inventory
    ingredients: Ingredient[];
    lowStockItems: Ingredient[];
    updateQuantity: (id: string, delta: number) => void;
    deductStockForProduct: (productId: string, quantity: number) => void;
    addIngredient: (item: Ingredient) => void;
    // Supplier Orders
    supplierOrders: SupplierOrder[];
    createSupplierOrder: (supplier: string, items: SupplierOrderItem[], notes?: string) => SupplierOrder;
    updateOrderStatus: (orderId: string, status: SupplierOrderStatus) => void;
    receiveOrder: (orderId: string) => void; // Marks as delivered and updates stock
    cancelOrder: (orderId: string) => void;
    getOrdersByStatus: (status: SupplierOrderStatus) => SupplierOrder[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[]>([]);

    useEffect(() => {
        const savedIng = localStorage.getItem('executive_inventory_state');
        setIngredients(savedIng ? JSON.parse(savedIng) : INITIAL_INGREDIENTS);

        const savedOrders = localStorage.getItem('executive_supplier_orders');
        setSupplierOrders(savedOrders ? JSON.parse(savedOrders) : INITIAL_ORDERS);
    }, []);

    useEffect(() => {
        if (ingredients.length > 0) {
            localStorage.setItem('executive_inventory_state', JSON.stringify(ingredients));
        }
    }, [ingredients]);

    useEffect(() => {
        if (supplierOrders.length > 0) {
            localStorage.setItem('executive_supplier_orders', JSON.stringify(supplierOrders));
        }
    }, [supplierOrders]);

    // --- Inventory Methods ---
    const updateQuantity = (id: string, delta: number) => {
        setIngredients(prev => prev.map(ing =>
            ing.id === id ? { ...ing, quantity: Math.max(0, ing.quantity + delta) } : ing
        ));
    };

    const deductStockForProduct = (productId: string, qty: number) => {
        // Find the product and its ingredients from mock-data
        const { PRODUCTS } = require('@/lib/mock-data');
        const product = PRODUCTS.find((p: any) => p.id === productId);

        if (!product?.ingredients) return;

        setIngredients(prev => {
            return prev.map(ing => {
                const productIngredient = product.ingredients.find((pi: any) => pi.ingredientId === ing.id);
                if (productIngredient) {
                    const newQty = Math.max(0, ing.quantity - (productIngredient.quantity * qty));
                    return { ...ing, quantity: newQty };
                }
                return ing;
            });
        });
    };

    const addIngredient = (item: Ingredient) => {
        setIngredients(prev => [...prev, { ...item, id: `ing_${Math.random().toString(36).substr(2, 9)}` }]);
    };

    // --- Supplier Order Methods ---
    const createSupplierOrder = (supplier: string, items: SupplierOrderItem[], notes?: string): SupplierOrder => {
        const totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
        const newOrder: SupplierOrder = {
            id: `ord_${Math.random().toString(36).substr(2, 9)}`,
            supplier,
            items,
            status: 'pending',
            totalAmount,
            orderDate: new Date().toISOString().split('T')[0],
            notes
        };
        setSupplierOrders(prev => [...prev, newOrder]);
        return newOrder;
    };

    const updateOrderStatus = (orderId: string, status: SupplierOrderStatus) => {
        setSupplierOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status } : order
        ));
    };

    const receiveOrder = (orderId: string) => {
        const order = supplierOrders.find(o => o.id === orderId);
        if (!order) return;

        // Update order status to delivered
        setSupplierOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: 'delivered' as SupplierOrderStatus, deliveredDate: new Date().toISOString().split('T')[0] } : o
        ));

        // Add quantities to inventory
        setIngredients(prev => prev.map(ing => {
            const orderItem = order.items.find(item => item.ingredientId === ing.id);
            if (orderItem) {
                return {
                    ...ing,
                    quantity: ing.quantity + orderItem.quantity,
                    lastRestock: new Date().toISOString().split('T')[0]
                };
            }
            return ing;
        }));
    };

    const cancelOrder = (orderId: string) => {
        setSupplierOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: 'cancelled' as SupplierOrderStatus } : order
        ));
    };

    const getOrdersByStatus = (status: SupplierOrderStatus) => supplierOrders.filter(o => o.status === status);

    const lowStockItems = ingredients.filter(ing => ing.quantity <= ing.minQuantity);

    return (
        <InventoryContext.Provider value={{
            ingredients,
            lowStockItems,
            updateQuantity,
            deductStockForProduct,
            addIngredient,
            supplierOrders,
            createSupplierOrder,
            updateOrderStatus,
            receiveOrder,
            cancelOrder,
            getOrdersByStatus
        }}>
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventory() {
    const context = useContext(InventoryContext);
    if (!context) throw new Error('useInventory must be used within InventoryProvider');
    return context;
}

