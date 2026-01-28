/**
 * HACCP & QUALITY CONTROL TYPES
 */

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

export interface TemperatureLog {
    id: string;
    storageLocationId: string;
    recordedAt: string;
    temperature: number;
    recordedBy: string;
    isCompliant: boolean;
    correctiveAction?: string;
    notes?: string;
}

// ============================================
// QUALITY CONTROL (CONTRÔLE QUALITÉ)
// ============================================

export type ProductCategory =
    | 'vegetables'      // Légumes
    | 'fruits'          // Fruits
    | 'meat'            // Viandes
    | 'poultry'         // Volailles
    | 'fish_seafood'    // Poissons/Fruits de mer
    | 'dairy'           // Produits laitiers
    | 'eggs'            // Œufs
    | 'charcuterie'     // Charcuterie
    | 'frozen'          // Surgelés
    | 'dry_goods'       // Épicerie sèche
    | 'beverages'       // Boissons
    | 'other';

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
    vegetables: 'Légumes',
    fruits: 'Fruits',
    meat: 'Viandes',
    poultry: 'Volailles',
    fish_seafood: 'Poissons & Fruits de mer',
    dairy: 'Produits laitiers',
    eggs: 'Œufs',
    charcuterie: 'Charcuterie',
    frozen: 'Surgelés',
    dry_goods: 'Épicerie sèche',
    beverages: 'Boissons',
    other: 'Autre'
};

export const PRODUCT_CATEGORY_ICONS: Record<ProductCategory, string> = {
    vegetables: '🥬',
    fruits: '🍎',
    meat: '🥩',
    poultry: '🍗',
    fish_seafood: '🐟',
    dairy: '🧀',
    eggs: '🥚',
    charcuterie: '🥓',
    frozen: '🧊',
    dry_goods: '🫛',
    beverages: '🥤',
    other: '📦'
};

export type VehicleType = 'refrigerated' | 'isothermal' | 'ambient' | 'unknown';

export type CheckStatus = 'pass' | 'warning' | 'fail' | 'not_checked';

export type VisualIssue =
    | 'none'
    | 'damaged_packaging'
    | 'broken_cold_chain'
    | 'wrong_color'
    | 'wrong_texture'
    | 'bad_smell'
    | 'visible_mold'
    | 'pest_signs'
    | 'wrong_ripeness'
    | 'wilted'
    | 'bruised'
    | 'freezer_burn'
    | 'other';

export type ItemDecision =
    | 'accepted'
    | 'accepted_reservation'
    | 'partially_accepted'
    | 'rejected';

export type CorrectiveAction =
    | 'none'
    | 'priority_use'
    | 'return_supplier'
    | 'credit_note'
    | 'dispose'
    | 'quarantine';

export type FreshnessScore = 'excellent' | 'good' | 'acceptable' | 'poor' | 'rejected';

export const FRESHNESS_SCORE_CONFIG: Record<FreshnessScore, { label: string; color: string; value: number }> = {
    excellent: { label: 'Excellent', color: 'text-emerald-400', value: 5 },
    good: { label: 'Bon', color: 'text-green-400', value: 4 },
    acceptable: { label: 'Acceptable', color: 'text-amber-400', value: 3 },
    poor: { label: 'Limite', color: 'text-orange-400', value: 2 },
    rejected: { label: 'Refusé', color: 'text-red-400', value: 1 }
};

export interface QualityCheckItem {
    id: string;
    productId: string;
    productName: string;
    productCategory: ProductCategory;

    // Traçabilité
    batchNumber?: string;
    lotNumber?: string;
    origin?: string;

    // Dates
    productionDate?: string;
    expiryDate?: string;
    expiryType: 'dlc' | 'ddm';
    daysUntilExpiry: number;

    // Quantités
    quantityOrdered: number;
    quantityDelivered: number;
    quantityAccepted: number;
    quantityRejected: number;
    unit: string;

    // Contrôles
    checks: {
        visual: {
            performed: boolean;
            status: CheckStatus;
            issues: VisualIssue[];
            photos: string[];
            notes?: string;
        };
        temperature: {
            required: boolean;
            performed: boolean;
            targetMin: number;
            targetMax: number;
            measured?: number;
            status: CheckStatus;
        };
        weight: {
            required: boolean;
            performed: boolean;
            expected?: number;
            measured?: number;
            variancePercent?: number;
            tolerancePercent: number;
            status: CheckStatus;
        };
        freshness: {
            required: boolean;
            performed: boolean;
            score?: FreshnessScore;
            notes?: string;
        };
    };

    // Décision
    decision: ItemDecision;
    decisionReason?: string;
    correctiveAction?: CorrectiveAction;
    actionNotes?: string;
}

export type QualityControlStatus = 'draft' | 'in_progress' | 'completed' | 'validated';

export const QUALITY_CONTROL_STATUS_CONFIG: Record<QualityControlStatus, { label: string; color: string; bgColor: string }> = {
    draft: { label: 'Brouillon', color: 'text-slate-600', bgColor: 'bg-slate-100' },
    in_progress: { label: 'En cours', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    completed: { label: 'Terminé', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    validated: { label: 'Validé', color: 'text-purple-600', bgColor: 'bg-purple-100' }
};

export interface QualityControl {
    id: string;
    controlNumber: string;  // QC-20260115-007
    establishmentId: string;

    type: 'reception' | 'storage' | 'preparation' | 'pre_service';

    // Livraison
    deliveryId?: string;
    deliveryReference?: string;
    supplierId: string;
    supplierName: string;

    // Timing
    controlledAt: string;
    controlledBy: string;
    controllerName: string;
    durationMinutes?: number;

    // Conditions livraison
    deliveryConditions: {
        vehicleType: VehicleType;
        vehicleTemperature?: number;
        vehicleTemperatureCompliant?: boolean;
        vehicleCleanliness: 'clean' | 'acceptable' | 'dirty' | 'not_checked';
        packagingIntegrity: 'intact' | 'damaged' | 'mixed';
        deliveryTimeCompliant: boolean;
        notes?: string;
    };

    // Items
    items: QualityCheckItem[];

    // Résumé
    summary: {
        totalItems: number;
        itemsAccepted: number;
        itemsAcceptedReservation: number;
        itemsPartiallyAccepted: number;
        itemsRejected: number;
        temperatureIssues: number;
        visualIssues: number;
        weightIssues: number;
        overallStatus: 'pass' | 'pass_warnings' | 'partial' | 'fail';
    };

    // Documents
    deliveryNotePhoto?: string;
    signature?: {
        captured: boolean;
        data?: string;
        signerName?: string;
    };
    reportPdf?: string;

    // Statut
    status: QualityControlStatus;

    // Métadonnées
    createdAt: string;
    updatedAt: string;
}

export interface SupplierQualityScore {
    supplierId: string;
    supplierName: string;
    period: string; // "2026-01"

    metrics: {
        totalDeliveries: number;
        totalItems: number;
        itemsAccepted: number;
        itemsRejected: number;
        rejectionRate: number;
        temperatureIssues: number;
        visualIssues: number;
        weightIssues: number;
        averageFreshnessScore: number;
        onTimeDeliveryRate: number;
    };

    overallScore: number; // 0-100
    trend: 'improving' | 'stable' | 'declining';
}
