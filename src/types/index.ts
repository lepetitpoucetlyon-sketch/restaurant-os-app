/**
 * RESTAURANT OS - Centralized Type Definitions
 * All domain types in one place for consistency and maintainability.
 */

// ============================================
// AUTH & USERS
// ============================================

export type UserRole = 'server' | 'manager' | 'kitchen' | 'admin';

export interface User {
    id: string;
    name: string;
    pin: string;
    role: UserRole;
    avatar?: string;
    lastActive?: string;
    performanceScore?: number;
    accessLevel?: number;
    weeklyHours?: number[]; // Hours per day [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
    hourlyRate?: number;
}

// ============================================
// TABLES & FLOOR PLAN
// ============================================

export type TableStatus = 'free' | 'seated' | 'ordered' | 'eating' | 'paying' | 'dirty' | 'reserved' | 'cleaning' | 'locked';
export type TableShape = 'rect' | 'circle';
export type ZoneId = string;

export interface Zone {
    id: ZoneId;
    name: string;
    color: string;
    description?: string;
}

export interface Table {
    id: string;
    number: string;
    seats: number;
    status: TableStatus;
    shape: TableShape;
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    zoneId: ZoneId;
    lastService?: string;
    revenueToday?: number;
}

// ============================================
// ORDERS
// ============================================

export type OrderStatus = 'draft' | 'new' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'paid';
export type OrderItemStatus = 'pending' | 'cooking' | 'ready' | 'served';

export interface OrderItem {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
    modifiers?: string[];
    notes?: string;
    status: OrderItemStatus;
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
}

// ============================================
// INVENTORY
// ============================================

export type IngredientCategory = 'produce' | 'dairy' | 'meat' | 'dry' | 'beverage' | 'other';
export type IngredientUnit = 'kg' | 'g' | 'l' | 'ml' | 'unit' | 'crate';

export interface Ingredient {
    id: string;
    name: string;
    category: IngredientCategory;
    quantity: number;
    unit: IngredientUnit;
    minQuantity: number;
    cost: number;
    supplier: string;
    lastRestock?: string;
    expiryDate?: string;
    allergens?: string[];
}

export type SupplierOrderStatus = 'draft' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface SupplierOrderItem {
    ingredientId: string;
    ingredientName: string;
    quantity: number;
    unitPrice: number;
}

export interface SupplierOrder {
    id: string;
    supplier: string;
    items: SupplierOrderItem[];
    status: SupplierOrderStatus;
    totalAmount: number;
    orderDate: string;
    expectedDelivery?: string;
    deliveredDate?: string;
    notes?: string;
}

// ============================================
// RESERVATIONS & CRM
// ============================================

export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'no-show' | 'cancelled';

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    birthDate?: string;
    preferences: string[];
    tags: string[];
    notes?: string;
    visitCount: number;
    totalSpent: number;
    averageSpend: number;
    lastVisit?: string;
    createdAt: string;
}

export interface Reservation {
    id: string;
    customerId?: string;
    customerName: string;
    email?: string;
    phone: string;
    date: string;
    time: string;
    covers: number;
    tableId: string;
    status: ReservationStatus;
    tags: string[];
    notes?: string;
    isVip?: boolean;
    visitCount?: number;
}

// ============================================
// NOTIFICATIONS
// ============================================

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

// ============================================
// PRODUCTS & MENU
// ============================================

export interface Option {
    id: string;
    name: string;
    priceModifier: number;
    isDefault?: boolean;
}

export interface OptionGroup {
    id: string;
    name: string;
    type: 'single' | 'multiple';
    required: boolean;
    minSelections?: number;
    maxSelections?: number;
    options: Option[];
}

export interface ProductIngredient {
    ingredientId: string;
    quantity: number; // Amount used per unit sold
}

export interface RecipeStep {
    order: number;
    instruction: string;
    duration?: number; // In minutes
}

export interface Product {
    id: string;
    categoryId: string;
    name: string;
    price: number;
    color: string;
    image?: string;
    description?: string;
    optionGroups?: OptionGroup[];
    ingredients?: ProductIngredient[];
    recipeSteps?: RecipeStep[];
    prepTime?: number; // Minutes
    tags?: string[]; // Star, Dog, Plowhorse, Puzzle
}

// ============================================
// OPERATIONS & MANAGEMENT
// ============================================

export interface WasteLog {
    id: string;
    productId?: string;
    ingredientId?: string;
    name: string;
    quantity: number;
    unit: string;
    reason: 'damaged' | 'expired' | 'mistake' | 'waste';
    cost: number;
    timestamp: Date;
    loggedBy: string;
}

export interface PrepTask {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    isCompleted: boolean;
    assignedTo?: string;
    dueDate: Date;
}

export interface StaffPerformance {
    userId: string;
    userName: string;
    totalSales: number;
    orderCount: number;
    averageCheck: number;
    upsellRate: number; // % of orders with modifiers/drinks
    kudos: number;
}

export interface MenuAnalysis {
    productId: string;
    name: string;
    profitability: number; // Margin
    popularity: number; // Sales volume
    category: 'star' | 'plowhorse' | 'puzzle' | 'dog';
}

export interface Category {
    id: string;
    name: string;
    color: string;
}

// ============================================
// ACCOUNTING
// ============================================

export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'sales' | 'purchases' | 'fixed' | 'payroll' | 'other';

export interface Transaction {
    id: string;
    type: TransactionType;
    category: TransactionCategory;
    title: string;
    amount: number;
    date: Date;
    orderId?: string;
    supplierOrderId?: string;
}

export interface FinancialMetrics {
    totalRevenue: number;
    totalExpenses: number;
    grossMargin: number;
    foodCost: number;
    laborCost: number;
    ebitda: number;
}

// ============================================
// HACCP
// ============================================

export interface SensorReading {
    id: string;
    name: string;
    type: 'temperature' | 'humidity' | 'air_quality';
    value: number;
    unit: string;
    status: 'ok' | 'warning' | 'alert';
    lastUpdated: Date;
    minThreshold?: number;
    maxThreshold?: number;
}

export interface HACCPChecklistItem {
    id: string;
    task: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    completed: boolean;
    completedAt?: Date;
    completedBy?: string;
}
// ============================================
// ADVANCED MODULES (PREMIUM)
// ============================================

// 1. REPUTATION & SENTIMENT
export type SentimentType = 'positive' | 'neutral' | 'negative' | 'ironic';

export interface SocialReview {
    id: string;
    source: 'google' | 'tripadvisor' | 'yelp' | 'facebook' | 'instagram';
    rating: number;
    content: string;
    author: string;
    timestamp: Date;
    sentiment: SentimentType;
    themes: string[]; // ['service', 'food', 'price', 'atmosphere']
    replied: boolean;
    suggestedReply?: string;
}

// 2. HR COMPLIANCE
export interface ComplianceAlert {
    id: string;
    userId: string;
    userName: string;
    type: 'daily_rest' | 'weekly_rest' | 'max_daily_hours' | 'mandatory_break';
    severity: 'info' | 'warning' | 'blocking';
    message: string;
    affectedShiftId?: string;
}

// 3. IOT PREDICTIVE MAINTENANCE
export interface EquipmentMetric {
    id: string;
    equipmentId: string;
    name: string;
    type: 'temperature' | 'vibration' | 'power_draw';
    value: number;
    timestamp: Date;
    anomalous: boolean;
}

export interface PredictiveAlert {
    id: string;
    equipmentId: string;
    equipmentName: string;
    predictedFailureDate: Date;
    confidence: number;
    reason: string;
    severity: 'low' | 'medium' | 'critical';
}

// 4. INGREDIENT PROFITABILITY
export interface IngredientPricePoint {
    ingredientId: string;
    price: number;
    timestamp: Date;
    source: 'invoice' | 'market';
}

export interface ProfitabilityAlert {
    productId: string;
    productName: string;
    currentMargin: number;
    targetMargin: number;
    status: 'ok' | 'critical';
    suggestedPrice: number;
}

// 5. DIGITAL TWIN SIMULATOR
export interface SimulationScenario {
    id: string;
    name: string;
    description: string;
    inputs: {
        priceChange?: number; // +/- percentage
        newOpeningHours?: string[];
        menuChanges?: string[]; // IDs of added/removed products
    };
    projections: {
        revenueImpact: number;
        laborCostImpact: number;
        netProfitChange: number;
    };
    confidenceScore: number;
}
