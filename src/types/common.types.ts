/**
 * COMMON / SHARED TYPES
 */

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
    temperature?: string;
    tip?: string;
    imageUrl?: string;
    videoUrl?: string;
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

export interface RecipeIngredient {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    cost: number;
}

export interface Recipe {
    id: string;
    name: string;
    category: string;
    description?: string;
    prepTime: number;
    cookTime: number;
    portions: number;
    difficulty: 'easy' | 'medium' | 'hard';
    ingredients: RecipeIngredient[];
    steps: RecipeStep[];
    allergens: string[];
    dietaryInfo: string[];
    costPrice: number;
    sellingPrice: number;
    margin: number;
    imageUrl?: string;
    color: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    color: string;
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

export interface MiseEnPlaceTask extends PrepTask {
    station?: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    estimatedTime: number; // in minutes
    actualTime?: number;
    notes?: string;
    recipeId?: string; // linked recipe id
}

export interface MenuAnalysis {
    productId: string;
    name: string;
    profitability: number; // Margin
    popularity: number; // Sales volume
    category: 'star' | 'plowhorse' | 'puzzle' | 'dog';
}

// ============================================
// SYSTEM & SYNC
// ============================================

export interface AuditLog {
    id: string;
    timestamp: Date;
    userId: string;
    userName: string;
    action: string;
    module: string;
    details?: string;
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
