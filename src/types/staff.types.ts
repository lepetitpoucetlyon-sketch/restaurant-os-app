/**
 * STAFF & HR TYPES - Leave Management, Compliance
 */

// ============================================
// LEAVE MANAGEMENT (CONGÉS)
// ============================================

export type LeaveType =
    | 'paid_leave'           // Congés payés
    | 'rtt'                  // RTT
    | 'unpaid_leave'         // Sans solde
    | 'recovery'             // Récupération
    | 'sick_leave'           // Maladie
    | 'work_accident'        // Accident du travail
    | 'maternity'            // Maternité
    | 'paternity'            // Paternité
    | 'child_sick'           // Enfant malade
    | 'exceptional_wedding'  // Mariage/PACS
    | 'exceptional_birth'    // Naissance
    | 'exceptional_death'    // Décès
    | 'exceptional_moving'   // Déménagement
    | 'training'             // Formation
    | 'other';               // Autre

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
    paid_leave: 'Congés payés',
    rtt: 'RTT',
    unpaid_leave: 'Sans solde',
    recovery: 'Récupération',
    sick_leave: 'Maladie',
    work_accident: 'Accident du travail',
    maternity: 'Maternité',
    paternity: 'Paternité',
    child_sick: 'Enfant malade',
    exceptional_wedding: 'Mariage / PACS',
    exceptional_birth: 'Naissance',
    exceptional_death: 'Décès',
    exceptional_moving: 'Déménagement',
    training: 'Formation',
    other: 'Autre'
};

export const LEAVE_TYPE_ICONS: Record<LeaveType, string> = {
    paid_leave: '🏖️',
    rtt: '⏰',
    unpaid_leave: '📝',
    recovery: '🔄',
    sick_leave: '🤒',
    work_accident: '🚑',
    maternity: '👶',
    paternity: '👨‍👶',
    child_sick: '🧒',
    exceptional_wedding: '💒',
    exceptional_birth: '👶',
    exceptional_death: '🕊️',
    exceptional_moving: '📦',
    training: '📚',
    other: '📋'
};

export type LeaveRequestStatus =
    | 'draft'              // Brouillon
    | 'submitted'          // Soumise
    | 'pending_approval'   // En attente validation
    | 'approved'           // Approuvée
    | 'rejected'           // Refusée
    | 'cancelled'          // Annulée
    | 'in_progress'        // En cours
    | 'completed';         // Terminée

export const LEAVE_STATUS_CONFIG: Record<LeaveRequestStatus, { label: string; color: string; bgColor: string }> = {
    draft: { label: 'Brouillon', color: 'text-slate-600', bgColor: 'bg-slate-100' },
    submitted: { label: 'Soumise', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    pending_approval: { label: 'En attente', color: 'text-amber-600', bgColor: 'bg-amber-100' },
    approved: { label: 'Approuvée', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    rejected: { label: 'Refusée', color: 'text-red-600', bgColor: 'bg-red-100' },
    cancelled: { label: 'Annulée', color: 'text-slate-500', bgColor: 'bg-slate-100' },
    in_progress: { label: 'En cours', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    completed: { label: 'Terminée', color: 'text-slate-600', bgColor: 'bg-slate-100' }
};

export type DayPeriod = 'full_day' | 'morning' | 'afternoon';

export interface LeaveBalance {
    id: string;
    employeeId: string;
    type: LeaveType;
    entitled: number;        // Jours acquis pour la période
    acquired: number;        // Jours acquis à date
    taken: number;           // Jours déjà pris
    pending: number;         // Jours en attente de validation
    planned: number;         // Jours validés mais futurs
    remaining: number;       // = acquired - taken - pending - planned
    carriedOver: number;     // Report période précédente
    carryOverExpiry?: string;
    periodStart: string;
    periodEnd: string;
}

export interface LeaveApprovalStep {
    level: number;
    approverId: string;
    approverName: string;
    approverRole: string;
    status: 'pending' | 'approved' | 'rejected' | 'skipped';
    decidedAt?: string;
    comments?: string;
}

export type RejectionReason =
    | 'team_coverage'       // Couverture équipe insuffisante
    | 'blackout_period'     // Période bloquée
    | 'insufficient_notice' // Délai trop court
    | 'balance_insufficient' // Solde insuffisant
    | 'documentation'       // Justificatif manquant
    | 'business_needs'      // Contraintes activité
    | 'other';

export interface LeaveRequest {
    id: string;
    requestNumber: string;   // ABS-2026-00142
    employeeId: string;
    employeeName: string;
    employeeAvatar?: string;

    // Type
    type: LeaveType;
    typeLabel?: string;      // Si type === 'other'

    // Période
    startDate: string;
    endDate: string;
    startPeriod: DayPeriod;
    endPeriod: DayPeriod;
    workingDays: number;     // Jours ouvrés
    calendarDays: number;    // Jours calendaires

    // Justification
    reason?: string;
    attachments?: {
        id: string;
        name: string;
        url: string;
        type: string;
        uploadedAt: string;
    }[];

    // Statut et workflow
    status: LeaveRequestStatus;
    submittedAt?: string;
    submittedTo?: string;
    approvalChain: LeaveApprovalStep[];
    currentLevel: number;

    // Décision finale
    finalDecision?: 'approved' | 'rejected';
    finalDecisionAt?: string;
    finalDecisionBy?: string;
    rejectionReason?: RejectionReason;
    rejectionDetails?: string;

    // Impact planning
    conflictsDetected: boolean;
    conflictingShifts?: string[];
    teamCoverage?: {
        percent: number;
        minimumRequired: number;
        compliant: boolean;
    };

    // Impact solde
    balanceImpact?: {
        leaveType: LeaveType;
        daysDeducted: number;
        balanceBefore: number;
        balanceAfter: number;
    };

    // Notes
    employeeNotes?: string;
    managerNotes?: string;

    // Métadonnées
    createdAt: string;
    createdBy: string;
    updatedAt: string;
}

export interface LeaveBlackoutPeriod {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    reason?: string;
    blockLevel: 'blocked' | 'restricted' | 'limited';
    maxEmployees?: number;
    appliesToRoles?: string[];
}

// ============================================
// HR COMPLIANCE
// ============================================

export interface ComplianceAlert {
    id: string;
    userId: string;
    userName: string;
    type: 'daily_rest' | 'weekly_rest' | 'max_daily_hours' | 'mandatory_break';
    severity: 'info' | 'warning' | 'blocking';
    message: string;
    affectedShiftId?: string;
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
