"use client";

import React, { createContext, useContext, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import {
    Ingredient,
    SupplierOrder,
    SupplierOrderItem,
    SupplierOrderStatus,
    Product,
    StockItem,
    Preparation,
    StorageLocation,
    TemperatureLog,
    InventoryMovement,
    PreparationType,
    DEFAULT_STORAGE_LOCATIONS
} from '@/types';

/**
 * EXECUTIVE INVENTORY SYSTEM - Complete Stock & Preparation Management
 * Split into State and Actions contexts for optimal re-render performance.
 * 
 * - InventoryStateContext: Reactive data (triggers re-renders on data changes)
 * - InventoryActionsContext: Stable action functions (never changes reference)
 */

// ============================================
// INITIAL DATA
// ============================================
const INITIAL_INGREDIENTS: Ingredient[] = [
    { id: 'ing_1', name: 'Farine Tipo 00', category: 'dry', unit: 'kg', minQuantity: 10, cost: 1.2, supplier: 'Agugiaro & Figna', defaultStorageLocation: 'epicerie_1' },
    { id: 'ing_2', name: 'Mozzarella di Bufala', category: 'dairy', unit: 'kg', minQuantity: 8, cost: 14.5, supplier: 'Caseificio Campana', allergens: ['Lactose'], defaultStorageLocation: 'frigo_1', shelfLifeDays: 5 },
    { id: 'ing_3', name: 'Tomates San Marzano', category: 'produce', unit: 'kg', minQuantity: 20, cost: 3.5, supplier: 'Pomopazzo', defaultStorageLocation: 'frigo_2', shelfLifeDays: 7 },
    { id: 'ing_4', name: 'Truffe Noire', category: 'other', unit: 'kg', minQuantity: 0.2, cost: 450, supplier: 'Truffle Elite', defaultStorageLocation: 'frigo_1', shelfLifeDays: 14 },
    { id: 'ing_5', name: 'Basilic Frais', category: 'produce', unit: 'kg', minQuantity: 1, cost: 12, supplier: 'Local Garden', defaultStorageLocation: 'frigo_2', shelfLifeDays: 3 },
    { id: 'ing_6', name: 'Huile d\'Olive Extra', category: 'oil', unit: 'l', minQuantity: 10, cost: 8.5, supplier: 'Frantoio Galantino', defaultStorageLocation: 'epicerie_3' },
    { id: 'ing_7', name: 'Filet de Bœuf', category: 'meat', unit: 'kg', minQuantity: 5, cost: 45, supplier: 'Boucherie Premium', defaultStorageLocation: 'frigo_3', shelfLifeDays: 5, allergens: [] },
    { id: 'ing_8', name: 'Saumon Norvégien', category: 'seafood', unit: 'kg', minQuantity: 3, cost: 28, supplier: 'Nordic Seafood', defaultStorageLocation: 'frigo_4', shelfLifeDays: 3, allergens: ['Poisson'], isOrganic: true },
    { id: 'ing_9', name: 'Crème Fraîche 35%', category: 'dairy', unit: 'l', minQuantity: 5, cost: 4.5, supplier: 'Laiterie des Alpes', defaultStorageLocation: 'frigo_1', shelfLifeDays: 14, allergens: ['Lactose'] },
    { id: 'ing_10', name: 'Beurre AOP Charentes', category: 'dairy', unit: 'kg', minQuantity: 3, cost: 12, supplier: 'Laiterie des Alpes', defaultStorageLocation: 'frigo_1', shelfLifeDays: 30, allergens: ['Lactose'], certifications: ['AOP'] },
];

const INITIAL_STOCK_ITEMS: StockItem[] = [
    {
        id: 'stock_1',
        ingredientId: 'ing_2',
        ingredientName: 'Mozzarella di Bufala',
        category: 'dairy',
        quantity: 5,
        unit: 'kg',
        storageLocationId: 'frigo_1',
        batchNumber: 'MOZ-2026-001',
        receptionDate: '2026-01-06',
        dlc: '2026-01-11',
        supplierName: 'Caseificio Campana',
        unitCost: 14.5,
        status: 'available'
    },
    {
        id: 'stock_2',
        ingredientId: 'ing_7',
        ingredientName: 'Filet de Bœuf',
        category: 'meat',
        quantity: 8,
        unit: 'kg',
        storageLocationId: 'frigo_3',
        batchNumber: 'BEEF-2026-015',
        lotNumber: 'FR-75-123-456',
        receptionDate: '2026-01-07',
        dlc: '2026-01-12',
        supplierName: 'Boucherie Premium',
        unitCost: 45,
        status: 'available'
    },
    {
        id: 'stock_3',
        ingredientId: 'ing_8',
        ingredientName: 'Saumon Norvégien',
        category: 'seafood',
        quantity: 4,
        unit: 'kg',
        storageLocationId: 'frigo_4',
        batchNumber: 'SAL-NO-2026-008',
        receptionDate: '2026-01-07',
        dlc: '2026-01-10',
        supplierName: 'Nordic Seafood',
        unitCost: 28,
        status: 'use_today' as any
    },
];

const INITIAL_PREPARATIONS: Preparation[] = [
    {
        id: 'prep_1',
        name: 'Sauce Béarnaise',
        type: 'sauce',
        quantity: 2,
        unit: 'l',
        portions: 40,
        storageLocationId: 'frigo_5',
        containerId: 'Bac GN 1/4',
        preparationDate: '2026-01-08',
        preparedBy: 'Chef Martin',
        dlc: '2026-01-10',
        ingredients: [
            { stockItemId: 'stock_butter', ingredientName: 'Beurre AOP', quantityUsed: 0.5, unit: 'kg' },
            { stockItemId: 'stock_eggs', ingredientName: 'Jaunes d\'œufs', quantityUsed: 8, unit: 'unit' },
        ],
        status: 'fresh',
        cost: 15.50
    },
    {
        id: 'prep_2',
        name: 'Fond de Veau',
        type: 'fond',
        quantity: 5,
        unit: 'l',
        storageLocationId: 'congelateur_1',
        containerId: 'Bac GN 1/1',
        preparationDate: '2026-01-05',
        preparedBy: 'Chef Martin',
        dlc: '2026-02-05',
        ingredients: [],
        status: 'ok',
        cost: 35.00
    },
    {
        id: 'prep_3',
        name: 'Légumes Brunoise',
        type: 'decoupe',
        quantity: 1.5,
        unit: 'kg',
        storageLocationId: 'frigo_5',
        containerId: 'Bac GN 1/6',
        preparationDate: '2026-01-08',
        preparedBy: 'Sophie L.',
        dlc: '2026-01-09',
        ingredients: [],
        status: 'use_today'
    },
];

const INITIAL_ORDERS: SupplierOrder[] = [
    {
        id: 'ord_1',
        supplier: 'Caseificio Campana',
        items: [
            { ingredientId: 'ing_2', ingredientName: 'Mozzarella di Bufala', quantity: 10, unit: 'kg', unitPrice: 14.5 }
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
            { ingredientId: 'ing_4', ingredientName: 'Truffe Noire', quantity: 0.5, unit: 'kg', unitPrice: 450 }
        ],
        status: 'pending',
        totalAmount: 225.00,
        orderDate: '2025-12-29',
        expectedDelivery: '2026-01-03'
    },
];

// ============================================
// STATE CONTEXT - Reactive Data
// ============================================
interface InventoryState {
    ingredients: Ingredient[];
    lowStockItems: Ingredient[];
    stockItems: StockItem[];
    preparations: Preparation[];
    storageLocations: StorageLocation[];
    temperatureLogs: TemperatureLog[];
    movements: InventoryMovement[];
    supplierOrders: SupplierOrder[];
    isLoading: boolean;
}

const InventoryStateContext = createContext<InventoryState | undefined>(undefined);

// ============================================
// ACTIONS CONTEXT - Stable Functions
// ============================================
interface InventoryActions {
    // Ingredients
    addIngredient: (item: Omit<Ingredient, 'id'>) => Promise<void>;
    updateIngredient: (id: string, data: Partial<Ingredient>) => Promise<void>;

    // Stock Items
    getStockByLocation: (locationId: string) => StockItem[];
    getExpiringStock: (days: number) => StockItem[];
    addStockItem: (item: Omit<StockItem, 'id'>) => Promise<string>;
    updateStockItem: (id: string, data: Partial<StockItem>) => Promise<void>;
    consumeStock: (id: string, quantity: number, reason?: string) => Promise<void>;
    transferStock: (id: string, toLocationId: string) => Promise<void>;
    deductStockForProduct: (productId: string, quantity: number) => Promise<void>;

    // Preparations
    getPreparationsByLocation: (locationId: string) => Preparation[];
    getExpiringPreparations: (days: number) => Preparation[];
    addPreparation: (prep: Omit<Preparation, 'id'>) => Promise<string>;
    updatePreparation: (id: string, data: Partial<Preparation>) => Promise<void>;
    discardPreparation: (id: string, reason?: string) => Promise<void>;

    // Storage Locations
    addStorageLocation: (location: Omit<StorageLocation, 'id'>) => Promise<void>;

    // Temperature Logs
    logTemperature: (locationId: string, temperature: number, recordedBy: string) => Promise<void>;

    // Supplier Orders
    createSupplierOrder: (supplier: string, items: SupplierOrderItem[], notes?: string) => Promise<SupplierOrder>;
    updateOrderStatus: (orderId: string, status: SupplierOrderStatus) => Promise<void>;
    receiveOrder: (orderId: string, receivedBy: string) => Promise<void>;
    cancelOrder: (orderId: string) => Promise<void>;
    getOrdersByStatus: (status: SupplierOrderStatus) => SupplierOrder[];
}

const InventoryActionsContext = createContext<InventoryActions | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================
export function InventoryProvider({ children }: { children: ReactNode }) {
    // Reactive Queries
    const ingredients = useLiveQuery(() => db.ingredients.toArray()) || [];
    const stockItems = useLiveQuery(() => db.stockItems.toArray()) || [];
    const preparations = useLiveQuery(() => db.preparations.toArray()) || [];
    const storageLocations = useLiveQuery(() => db.storageLocations.toArray()) || [];
    const temperatureLogs = useLiveQuery(() => db.temperatureLogs.orderBy('recordedAt').reverse().limit(100).toArray()) || [];
    const movements = useLiveQuery(() => db.inventoryMovements.orderBy('performedAt').reverse().limit(200).toArray()) || [];
    const supplierOrders = useLiveQuery(() => db.supplierOrders.orderBy('orderDate').reverse().toArray()) || [];

    const isLoading = typeof ingredients === 'undefined';

    // Initial Migration
    useEffect(() => {
        const migrate = async () => {
            const locCount = await db.storageLocations.count();
            if (locCount === 0) {
                await db.storageLocations.bulkAdd(DEFAULT_STORAGE_LOCATIONS);
            }

            const ingCount = await db.ingredients.count();
            if (ingCount === 0) {
                await db.ingredients.bulkAdd(INITIAL_INGREDIENTS);
            }

            const stockCount = await db.stockItems.count();
            if (stockCount === 0) {
                await db.stockItems.bulkAdd(INITIAL_STOCK_ITEMS);
            }

            const prepCount = await db.preparations.count();
            if (prepCount === 0) {
                await db.preparations.bulkAdd(INITIAL_PREPARATIONS);
            }

            const ordCount = await db.supplierOrders.count();
            if (ordCount === 0) {
                await db.supplierOrders.bulkAdd(INITIAL_ORDERS);
            }
        };
        migrate();
    }, []);

    // Computed: Low Stock Items
    const lowStockItems = useMemo(() => {
        const stockByIngredient: Record<string, number> = {};
        stockItems.forEach(s => {
            const key = s.ingredientId;
            stockByIngredient[key] = (stockByIngredient[key] || 0) + s.quantity;
        });

        return ingredients.filter(ing => {
            const totalStock = stockByIngredient[ing.id] || 0;
            return totalStock <= ing.minQuantity;
        });
    }, [ingredients, stockItems]);

    // ============================================
    // ACTION IMPLEMENTATIONS (Stable - useCallback)
    // ============================================

    const addIngredient = useCallback(async (item: Omit<Ingredient, 'id'>) => {
        const id = `ing_${Math.random().toString(36).substr(2, 9)}`;
        await db.ingredients.add({ ...item, id } as Ingredient);
    }, []);

    const updateIngredient = useCallback(async (id: string, data: Partial<Ingredient>) => {
        await db.ingredients.update(id, data);
    }, []);

    const getStockByLocation = useCallback((locationId: string) =>
        stockItems.filter(s => s.storageLocationId === locationId), [stockItems]);

    const getExpiringStock = useCallback((days: number) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() + days);
        return stockItems.filter(s => new Date(s.dlc) <= cutoff && s.status !== 'expired');
    }, [stockItems]);

    const addStockItem = useCallback(async (item: Omit<StockItem, 'id'>): Promise<string> => {
        const id = `stock_${Math.random().toString(36).substr(2, 9)}`;
        await db.stockItems.add({ ...item, id } as StockItem);

        await db.inventoryMovements.add({
            id: `mov_${Math.random().toString(36).substr(2, 9)}`,
            type: 'reception',
            stockItemId: id,
            ingredientId: item.ingredientId,
            ingredientName: item.ingredientName,
            quantity: item.quantity,
            unit: item.unit,
            toLocation: item.storageLocationId,
            performedBy: 'Système',
            performedAt: new Date().toISOString()
        });

        return id;
    }, []);

    const updateStockItem = useCallback(async (id: string, data: Partial<StockItem>) => {
        await db.stockItems.update(id, data);
    }, []);

    const consumeStock = useCallback(async (id: string, quantity: number, reason?: string) => {
        const item = await db.stockItems.get(id);
        if (!item) return;

        const newQty = Math.max(0, item.quantity - quantity);
        await db.stockItems.update(id, {
            quantity: newQty,
            status: newQty === 0 ? 'expired' : item.status
        });

        await db.inventoryMovements.add({
            id: `mov_${Math.random().toString(36).substr(2, 9)}`,
            type: 'consumption',
            stockItemId: id,
            ingredientId: item.ingredientId,
            ingredientName: item.ingredientName,
            quantity: quantity,
            unit: item.unit,
            fromLocation: item.storageLocationId,
            reason,
            performedBy: 'Système',
            performedAt: new Date().toISOString()
        });
    }, []);

    const transferStock = useCallback(async (id: string, toLocationId: string) => {
        const item = await db.stockItems.get(id);
        if (!item) return;

        const fromLocation = item.storageLocationId;
        await db.stockItems.update(id, { storageLocationId: toLocationId });

        await db.inventoryMovements.add({
            id: `mov_${Math.random().toString(36).substr(2, 9)}`,
            type: 'transfer',
            stockItemId: id,
            ingredientId: item.ingredientId,
            ingredientName: item.ingredientName,
            quantity: item.quantity,
            unit: item.unit,
            fromLocation,
            toLocation: toLocationId,
            performedBy: 'Système',
            performedAt: new Date().toISOString()
        });
    }, []);

    const deductStockForProduct = useCallback(async (productId: string, qty: number) => {
        // Find the recipe for this product to know ingredients
        // querying db directly avoids circular dependency with RecipeContext
        const recipe = await db.recipes.get(productId);

        if (!recipe?.ingredients) return;

        await db.transaction('rw', [db.stockItems, db.inventoryMovements], async () => {
            for (const ing of recipe.ingredients) {
                const neededQty = (ing.quantity || 0) * qty;

                // Find available stock for this ingredient, FIFO (First In First Out)
                const availableStock = stockItems
                    .filter(s => s.ingredientId === ing.id && s.status !== 'expired' && s.quantity > 0)
                    .sort((a, b) => new Date(a.dlc).getTime() - new Date(b.dlc).getTime());

                let remainingToDeduct = neededQty;

                for (const stockItem of availableStock) {
                    if (remainingToDeduct <= 0) break;

                    const toDeduct = Math.min(stockItem.quantity, remainingToDeduct);

                    // Direct update to avoid awaiting the consumeStock wrapper inside transaction loop if possible,
                    // but calling consumeStock is cleaner if it doesn't cause transaction issues.
                    // To be safe and atomic, we inline the logic here or ensure consumeStock is transaction-safe.
                    // Since consumeStock starts a NEW transaction implicitly by calling db.foo.update, 
                    // and we are already in a transaction, Dexie handles nested transactions well.
                    // However, for performance and clarity in this loop:

                    const newQty = stockItem.quantity - toDeduct;
                    await db.stockItems.update(stockItem.id, {
                        quantity: newQty,
                        status: newQty <= 0.001 ? 'expired' : stockItem.status // Using 'expired' as closest operational state to 'consumed' if not defined
                    });

                    await db.inventoryMovements.add({
                        id: `mov_${Math.random().toString(36).substr(2, 9)}`,
                        type: 'consumption',
                        stockItemId: stockItem.id,
                        ingredientId: ing.id,
                        ingredientName: ing.name,
                        quantity: toDeduct,
                        unit: ing.unit as any, // Cast to any or IngredientUnit if strictly typed
                        fromLocation: stockItem.storageLocationId,
                        reason: `Vente: ${recipe.name}`,
                        performedBy: 'System Sales',
                        performedAt: new Date().toISOString()
                    });

                    remainingToDeduct -= toDeduct;
                }
            }
        });
    }, [stockItems]);

    const getPreparationsByLocation = useCallback((locationId: string) =>
        preparations.filter(p => p.storageLocationId === locationId), [preparations]);

    const getExpiringPreparations = useCallback((days: number) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() + days);
        return preparations.filter(p => new Date(p.dlc) <= cutoff && p.status !== 'expired' && p.status !== 'discarded');
    }, [preparations]);

    const addPreparation = useCallback(async (prep: Omit<Preparation, 'id'>): Promise<string> => {
        const id = `prep_${Math.random().toString(36).substr(2, 9)}`;
        await db.preparations.add({ ...prep, id } as Preparation);

        await db.inventoryMovements.add({
            id: `mov_${Math.random().toString(36).substr(2, 9)}`,
            type: 'preparation',
            preparationId: id,
            ingredientId: id,
            ingredientName: prep.name,
            quantity: prep.quantity,
            unit: prep.unit,
            toLocation: prep.storageLocationId,
            performedBy: prep.preparedBy,
            performedAt: new Date().toISOString()
        });

        return id;
    }, []);

    const updatePreparation = useCallback(async (id: string, data: Partial<Preparation>) => {
        await db.preparations.update(id, data);
    }, []);

    const discardPreparation = useCallback(async (id: string, reason?: string) => {
        const prep = await db.preparations.get(id);
        if (!prep) return;

        await db.preparations.update(id, { status: 'discarded' });

        await db.inventoryMovements.add({
            id: `mov_${Math.random().toString(36).substr(2, 9)}`,
            type: 'waste',
            preparationId: id,
            ingredientId: id,
            ingredientName: prep.name,
            quantity: prep.quantity,
            unit: prep.unit,
            fromLocation: prep.storageLocationId,
            reason,
            performedBy: 'Système',
            performedAt: new Date().toISOString()
        });
    }, []);

    const addStorageLocation = useCallback(async (location: Omit<StorageLocation, 'id'>) => {
        const id = `loc_${Math.random().toString(36).substr(2, 9)}`;
        await db.storageLocations.add({ ...location, id } as StorageLocation);
    }, []);

    const logTemperature = useCallback(async (locationId: string, temperature: number, recordedBy: string) => {
        const location = storageLocations.find(l => l.id === locationId);
        const isCompliant = location
            ? (location.temperatureMin === undefined || temperature >= location.temperatureMin) &&
            (location.temperatureMax === undefined || temperature <= location.temperatureMax)
            : true;

        await db.temperatureLogs.add({
            id: `temp_${Math.random().toString(36).substr(2, 9)}`,
            storageLocationId: locationId,
            temperature,
            recordedAt: new Date().toISOString(),
            recordedBy,
            isCompliant
        });
    }, [storageLocations]);

    const createSupplierOrder = useCallback(async (supplier: string, items: SupplierOrderItem[], notes?: string): Promise<SupplierOrder> => {
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
        await db.supplierOrders.add(newOrder);
        return newOrder;
    }, []);

    const updateOrderStatus = useCallback(async (orderId: string, status: SupplierOrderStatus) => {
        await db.supplierOrders.update(orderId, { status });
    }, []);

    const receiveOrder = useCallback(async (orderId: string, receivedBy: string) => {
        const order = await db.supplierOrders.get(orderId);
        if (!order) return;

        await db.transaction('rw', [db.supplierOrders, db.stockItems, db.inventoryMovements], async () => {
            await db.supplierOrders.update(orderId, {
                status: 'delivered',
                deliveredDate: new Date().toISOString().split('T')[0],
                receivedBy
            });

            for (const item of order.items) {
                const ingredient = await db.ingredients.get(item.ingredientId);
                const dlcDate = new Date();
                dlcDate.setDate(dlcDate.getDate() + (ingredient?.shelfLifeDays || 7));

                const stockId = `stock_${Math.random().toString(36).substr(2, 9)}`;
                await db.stockItems.add({
                    id: stockId,
                    ingredientId: item.ingredientId,
                    ingredientName: item.ingredientName,
                    category: ingredient?.category || 'other',
                    quantity: item.quantity,
                    unit: item.unit || ingredient?.unit || 'kg',
                    storageLocationId: ingredient?.defaultStorageLocation || 'frigo_1',
                    batchNumber: `${item.ingredientId.toUpperCase()}-${Date.now()}`,
                    receptionDate: new Date().toISOString().split('T')[0],
                    dlc: dlcDate.toISOString().split('T')[0],
                    supplierName: order.supplier,
                    invoiceReference: orderId,
                    unitCost: item.unitPrice,
                    status: 'available'
                });

                await db.inventoryMovements.add({
                    id: `mov_${Math.random().toString(36).substr(2, 9)}`,
                    type: 'reception',
                    stockItemId: stockId,
                    ingredientId: item.ingredientId,
                    ingredientName: item.ingredientName,
                    quantity: item.quantity,
                    unit: item.unit || 'kg',
                    toLocation: ingredient?.defaultStorageLocation || 'frigo_1',
                    performedBy: receivedBy,
                    performedAt: new Date().toISOString(),
                    notes: `Commande ${orderId}`
                });
            }
        });
    }, []);

    const cancelOrder = useCallback(async (orderId: string) => {
        await db.supplierOrders.update(orderId, { status: 'cancelled' });
    }, []);

    const getOrdersByStatus = useCallback((status: SupplierOrderStatus) =>
        supplierOrders.filter(o => o.status === status), [supplierOrders]);

    // ============================================
    // MEMOIZED CONTEXT VALUES
    // ============================================

    const stateValue = useMemo<InventoryState>(() => ({
        ingredients,
        lowStockItems,
        stockItems,
        preparations,
        storageLocations,
        temperatureLogs,
        movements,
        supplierOrders,
        isLoading
    }), [
        ingredients,
        lowStockItems,
        stockItems,
        preparations,
        storageLocations,
        temperatureLogs,
        movements,
        supplierOrders,
        isLoading
    ]);

    const actionsValue = useMemo<InventoryActions>(() => ({
        addIngredient,
        updateIngredient,
        getStockByLocation,
        getExpiringStock,
        addStockItem,
        updateStockItem,
        consumeStock,
        transferStock,
        deductStockForProduct,
        getPreparationsByLocation,
        getExpiringPreparations,
        addPreparation,
        updatePreparation,
        discardPreparation,
        addStorageLocation,
        logTemperature,
        createSupplierOrder,
        updateOrderStatus,
        receiveOrder,
        cancelOrder,
        getOrdersByStatus
    }), [
        addIngredient,
        updateIngredient,
        getStockByLocation,
        getExpiringStock,
        addStockItem,
        updateStockItem,
        consumeStock,
        transferStock,
        deductStockForProduct,
        getPreparationsByLocation,
        getExpiringPreparations,
        addPreparation,
        updatePreparation,
        discardPreparation,
        addStorageLocation,
        logTemperature,
        createSupplierOrder,
        updateOrderStatus,
        receiveOrder,
        cancelOrder,
        getOrdersByStatus
    ]);

    return (
        <InventoryStateContext.Provider value={stateValue}>
            <InventoryActionsContext.Provider value={actionsValue}>
                {children}
            </InventoryActionsContext.Provider>
        </InventoryStateContext.Provider>
    );
}

// ============================================
// HOOKS
// ============================================

/**
 * Access inventory state (reactive - will trigger re-renders)
 */
export function useInventoryState() {
    const context = useContext(InventoryStateContext);
    if (!context) throw new Error('useInventoryState must be used within InventoryProvider');
    return context;
}

/**
 * Access inventory actions (stable - won't trigger re-renders)
 */
export function useInventoryActions() {
    const context = useContext(InventoryActionsContext);
    if (!context) throw new Error('useInventoryActions must be used within InventoryProvider');
    return context;
}

/**
 * Legacy hook for backward compatibility
 * Returns both state and actions combined
 */
export function useInventory() {
    const state = useInventoryState();
    const actions = useInventoryActions();
    return { ...state, ...actions };
}
