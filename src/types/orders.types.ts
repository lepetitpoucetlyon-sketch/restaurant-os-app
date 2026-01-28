/**
 * ORDERS TYPES
 */

export type OrderStatus = 'draft' | 'new' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'paid';
export type OrderItemStatus = 'pending' | 'cooking' | 'ready' | 'served';
export type ModificationStatus = 'pending' | 'approved' | 'rejected';

export interface OrderItemModification {
    id: string;
    orderId: string;
    orderItemId: string;
    type: 'ingredient_remove' | 'ingredient_add' | 'replace_dish' | 'quantity_change' | 'note_update';
    description: string;
    oldValue?: string;
    newValue?: string;
    requestedBy: string;
    requestedAt: Date;
    status: ModificationStatus;
    respondedBy?: string;
    respondedAt?: Date;
    responseNote?: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
    modifiers?: string[];
    notes?: string;
    status: OrderItemStatus;
    removedIngredients?: string[];
    addedIngredients?: string[];
    allergens?: string[];
    pendingModification?: OrderItemModification;
}

export interface Order {
    id: string;
    tableId: string;
    tableNumber: string;
    serverName: string;
    timestamp: Date;
    status: OrderStatus;
    items: OrderItem[];
    total: number;
    paymentMethod?: 'card' | 'cash' | 'mobile';
    isUrgent?: boolean;
    customerName?: string;
    customerId?: string;
}
