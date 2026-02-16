'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Plus,
    Filter,
    ChevronLeft,
    ChevronRight,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    CalendarDays,
    LayoutList,
    User,
    Send,
    Edit2,
    Trash2,
    Eye,
    Upload,
    X,
    ChevronDown,
    Search,
    Sparkles,
    Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PremiumSelect } from '@/components/ui/PremiumSelect';
import {
    LeaveRequest,
    LeaveBalance,
    LeaveType,
    LeaveRequestStatus,
    LEAVE_TYPE_LABELS,
    LEAVE_TYPE_ICONS,
    LEAVE_STATUS_CONFIG,
    DayPeriod
} from '@/types';

// ============================================
// MOCK DATA
// ============================================

const MOCK_BALANCES: LeaveBalance[] = [
    {
        id: '1',
        employeeId: 'current-user',
        type: 'paid_leave',
        entitled: 25,
        acquired: 20.8,
        taken: 5,
        pending: 2,
        planned: 0,
        remaining: 13.8,
        carriedOver: 3,
        periodStart: '2025-06-01',
        periodEnd: '2026-05-31'
    },
    {
        id: '2',
        employeeId: 'current-user',
        type: 'rtt',
        entitled: 11,
        acquired: 9.2,
        taken: 3,
        pending: 0,
        planned: 2,
        remaining: 4.2,
        carriedOver: 0,
        periodStart: '2026-01-01',
        periodEnd: '2026-12-31'
    },
    {
        id: '3',
        employeeId: 'current-user',
        type: 'recovery',
        entitled: 0,
        acquired: 2,
        taken: 0,
        pending: 0,
        planned: 0,
        remaining: 2,
        carriedOver: 0,
        periodStart: '2026-01-01',
        periodEnd: '2026-12-31'
    }
];

const MOCK_REQUESTS: LeaveRequest[] = [
    {
        id: '1',
        requestNumber: 'ABS-2026-00127',
        employeeId: 'current-user',
        employeeName: 'Jean Dupont',
        type: 'paid_leave',
        startDate: '2026-03-15',
        endDate: '2026-03-22',
        startPeriod: 'full_day',
        endPeriod: 'full_day',
        workingDays: 6,
        calendarDays: 8,
        status: 'approved',
        submittedAt: '2026-01-05T10:30:00Z',
        approvalChain: [
            { level: 1, approverId: 'mgr-1', approverName: 'Marie Martin', approverRole: 'Manager', status: 'approved', decidedAt: '2026-01-05T14:00:00Z' }
        ],
        currentLevel: 1,
        finalDecision: 'approved',
        finalDecisionAt: '2026-01-05T14:00:00Z',
        conflictsDetected: false,
        createdAt: '2026-01-05T10:30:00Z',
        createdBy: 'current-user',
        updatedAt: '2026-01-05T14:00:00Z'
    },
    {
        id: '2',
        requestNumber: 'ABS-2026-00142',
        employeeId: 'current-user',
        employeeName: 'Jean Dupont',
        type: 'paid_leave',
        startDate: '2026-04-10',
        endDate: '2026-04-11',
        startPeriod: 'full_day',
        endPeriod: 'full_day',
        workingDays: 2,
        calendarDays: 2,
        status: 'pending_approval',
        submittedAt: '2026-01-08T09:15:00Z',
        approvalChain: [
            { level: 1, approverId: 'mgr-1', approverName: 'Marie Martin', approverRole: 'Manager', status: 'pending' }
        ],
        currentLevel: 1,
        conflictsDetected: false,
        teamCoverage: { percent: 66, minimumRequired: 60, compliant: true },
        createdAt: '2026-01-08T09:15:00Z',
        createdBy: 'current-user',
        updatedAt: '2026-01-08T09:15:00Z'
    },
    {
        id: '3',
        requestNumber: 'ABS-2026-00089',
        employeeId: 'emp-2',
        employeeName: 'Sophie Laurent',
        type: 'sick_leave',
        startDate: '2026-01-06',
        endDate: '2026-01-08',
        startPeriod: 'full_day',
        endPeriod: 'full_day',
        workingDays: 3,
        calendarDays: 3,
        status: 'in_progress',
        submittedAt: '2026-01-06T08:00:00Z',
        approvalChain: [],
        currentLevel: 0,
        conflictsDetected: false,
        createdAt: '2026-01-06T08:00:00Z',
        createdBy: 'emp-2',
        updatedAt: '2026-01-06T08:00:00Z'
    }
];

// ============================================
// COMPONENTS
// ============================================

// Balance Card Component
function LeaveBalanceCard({ balance }: { balance: LeaveBalance }) {
    const percentage = balance.entitled > 0 ? ((balance.acquired - balance.taken) / balance.entitled) * 100 : 0;
    const icon = LEAVE_TYPE_ICONS[balance.type];
    const label = LEAVE_TYPE_LABELS[balance.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden bg-bg-secondary border border-border rounded-[2.5rem] p-8 shadow-premium hover:shadow-2xl transition-all duration-500"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-bg-primary shadow-sm border border-border flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500">
                        {icon}
                    </div>
                    <span className="font-serif italic text-text-primary text-xl">{label}</span>
                </div>
                {balance.pending > 0 && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] uppercase font-bold tracking-wider">
                        <Clock className="w-3 h-3" />
                        {balance.pending} en attente
                    </span>
                )}
            </div>

            <div className="mb-6 relative z-10">
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-serif font-medium text-text-primary tracking-tight">{balance.remaining.toFixed(1)}</span>
                    <span className="text-text-muted font-bold text-sm uppercase tracking-widest">Jours</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-text-muted/60 text-xs font-bold uppercase tracking-widest">Sur {balance.entitled} annuels</span>
                    {balance.carriedOver > 0 && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="text-emerald-600/80 text-xs font-bold uppercase tracking-widest">Dont {balance.carriedOver}j reportés</span>
                        </>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden relative z-10">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                        "h-full rounded-full shadow-lg relative overflow-hidden",
                        percentage > 50 ? 'bg-emerald-500' : percentage > 25 ? 'bg-amber-500' : 'bg-rose-500'
                    )}
                >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-shimmer" />
                </motion.div>
            </div>
        </motion.div>
    );
}

// Request Card Component
function LeaveRequestCard({
    request,
    onView,
    onApprove,
    onReject,
    isManager = false
}: {
    request: LeaveRequest;
    onView: () => void;
    onApprove?: () => void;
    onReject?: () => void;
    isManager?: boolean;
}) {
    const statusConfig = LEAVE_STATUS_CONFIG[request.status];
    const icon = LEAVE_TYPE_ICONS[request.type];
    const typeLabel = LEAVE_TYPE_LABELS[request.type];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    const getRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Aujourd'hui";
        if (diffDays === 1) return 'Hier';
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        return formatDate(dateStr);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-bg-primary border border-border rounded-[2rem] p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-bg-tertiary to-transparent opacity-50 rounded-bl-[3rem] pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-bg-secondary flex items-center justify-center text-2xl border border-border shadow-sm group-hover:scale-110 transition-transform duration-500">
                        {icon}
                    </div>
                    <div>
                        {isManager && (
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">
                                    {(request.employeeName || '').charAt(0)}
                                </div>
                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{request.employeeName}</span>
                            </div>
                        )}
                        <h3 className="font-serif italic text-xl text-text-primary mb-1">{typeLabel}</h3>
                        <div className="flex items-center gap-3 text-sm text-text-muted">
                            <div className="flex items-center gap-1.5 bg-bg-secondary px-2 py-1 rounded-lg border border-border/50">
                                <CalendarDays className="w-3.5 h-3.5" />
                                <span className="font-medium text-text-primary">
                                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                </span>
                            </div>
                            <span className="text-text-muted/40">•</span>
                            <span className="font-bold text-accent uppercase tracking-wider text-xs">{request.workingDays} jour{request.workingDays > 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                        request.status === 'approved' && "bg-emerald-100 text-emerald-700 border border-emerald-200",
                        request.status === 'pending_approval' && "bg-amber-100 text-amber-700 border border-amber-200",
                        request.status === 'rejected' && "bg-rose-100 text-rose-700 border border-rose-200",
                        request.status === 'in_progress' && "bg-blue-100 text-blue-700 border border-blue-200",
                    )}>
                        {statusConfig.label}
                    </span>
                    {request.submittedAt && (
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">
                            {getRelativeTime(request.submittedAt)}
                        </span>
                    )}
                </div>
            </div>

            {/* Team coverage indicator for managers */}
            {isManager && request.teamCoverage && (
                <div className="mt-4 flex items-center gap-3 bg-bg-secondary/50 p-3 rounded-xl border border-border/50 w-fit">
                    <Users className="w-4 h-4 text-text-muted" />
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                        Couverture équipe : {request.teamCoverage.percent}%
                    </span>
                    {request.teamCoverage.compliant ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
                <button
                    onClick={onView}
                    className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors flex items-center gap-2 group/btn"
                >
                    <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    Voir le dossier
                </button>

                {isManager && request.status === 'pending_approval' && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onReject}
                            className="px-4 py-2 rounded-xl bg-bg-secondary border border-border text-rose-600 text-xs font-bold uppercase tracking-wider hover:bg-rose-50 transition-colors flex items-center gap-2"
                        >
                            <XCircle className="w-4 h-4" />
                            Refuser
                        </button>
                        <button
                            onClick={onApprove}
                            className="px-4 py-2 rounded-xl bg-text-primary text-bg-primary text-xs font-bold uppercase tracking-wider hover:bg-accent hover:text-white transition-all shadow-md flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Approuver
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// New Request Modal
function NewRequestModal({
    isOpen,
    onClose,
    balances
}: {
    isOpen: boolean;
    onClose: () => void;
    balances: LeaveBalance[];
}) {
    const [selectedType, setSelectedType] = useState<LeaveType>('paid_leave');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startPeriod, setStartPeriod] = useState<DayPeriod>('full_day');
    const [endPeriod, setEndPeriod] = useState<DayPeriod>('full_day');
    const [reason, setReason] = useState('');
    const [step, setStep] = useState(1);

    const selectedBalance = balances.find(b => b.type === selectedType);

    const calculateWorkingDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        let count = 0;
        const current = new Date(start);

        while (current <= end) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }

        // Adjust for half days
        if (startPeriod !== 'full_day') count -= 0.5;
        if (endPeriod !== 'full_day' && startDate !== endDate) count -= 0.5;

        return count;
    };

    const workingDays = calculateWorkingDays();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-bg-primary border border-border shadow-2xl rounded-[2.5rem] w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-8 border-b border-border bg-bg-secondary/30">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Sparkles className="w-4 h-4 text-accent" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent">Demande d'Absence</span>
                            </div>
                            <h2 className="text-2xl font-serif italic text-text-primary">Nouvelle Requête</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white border border-border hover:bg-bg-secondary transition-colors flex items-center justify-center text-text-primary shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-bg-tertiary">
                        <motion.div
                            className="h-full bg-accent"
                            initial={{ width: "33%" }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto flex-1 bg-bg-primary">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <label className="block text-sm font-bold text-text-muted uppercase tracking-widest mb-4">
                                    Type d'absence
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(LEAVE_TYPE_LABELS).map(([type, label]) => {
                                        const balance = balances.find(b => b.type === type);
                                        const icon = LEAVE_TYPE_ICONS[type as LeaveType];
                                        const isSelected = selectedType === type;

                                        return (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedType(type as LeaveType)}
                                                className={cn(
                                                    "p-5 rounded-[2rem] border text-left transition-all relative overflow-hidden group h-full flex flex-col justify-between",
                                                    isSelected
                                                        ? "border-accent bg-bg-secondary shadow-lg scale-[1.02]"
                                                        : "border-border bg-white hover:border-accent/30 hover:bg-bg-secondary/50"
                                                )}
                                            >
                                                {/* Selected Indicator */}
                                                {isSelected && (
                                                    <div className="absolute top-4 right-4 z-20">
                                                        <CheckCircle2 className="w-5 h-5 text-accent" />
                                                    </div>
                                                )}

                                                <div className="relative z-10 space-y-4">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500",
                                                        isSelected ? "bg-white text-accent shadow-premium scale-110" : "bg-bg-secondary text-text-muted group-hover:scale-105"
                                                    )}>
                                                        {icon}
                                                    </div>
                                                    <div>
                                                        <span className={cn(
                                                            "block text-xl font-serif italic transition-colors leading-tight",
                                                            isSelected ? "text-text-primary" : "text-text-primary/70"
                                                        )}>{label}</span>
                                                        {balance && (
                                                            <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em] mt-1 block">
                                                                {balance.remaining}j dispos.
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                            Début
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={e => setStartDate(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border text-text-primary font-serif focus:scale-[1.02] focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all outline-none shadow-sm"
                                        />
                                        <PremiumSelect
                                            value={startPeriod}
                                            onChange={val => setStartPeriod(val as DayPeriod)}
                                            options={[
                                                { value: 'full_day', label: 'Journée entière' },
                                                { value: 'morning', label: 'Matin' },
                                                { value: 'afternoon', label: 'Après-midi' }
                                            ]}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                            Fin
                                        </label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={e => setEndDate(e.target.value)}
                                            min={startDate}
                                            className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border text-text-primary font-serif focus:scale-[1.02] focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all outline-none shadow-sm"
                                        />
                                        <PremiumSelect
                                            value={endPeriod}
                                            onChange={val => setEndPeriod(val as DayPeriod)}
                                            options={[
                                                { value: 'full_day', label: 'Journée entière' },
                                                { value: 'morning', label: 'Matin' },
                                                { value: 'afternoon', label: 'Après-midi' }
                                            ]}
                                        />
                                    </div>
                                </div>

                                {startDate && endDate && (
                                    <div className="p-6 rounded-2xl bg-bg-secondary border border-border relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full blur-xl -mr-10 -mt-10" />
                                        <div className="flex items-center justify-between relative z-10">
                                            <span className="text-text-muted text-sm font-medium">Jours décomptés</span>
                                            <span className="text-3xl font-serif italic text-text-primary">
                                                {workingDays} <span className="text-sm font-sans not-italic text-text-muted font-bold uppercase tracking-wide">Jours</span>
                                            </span>
                                        </div>
                                        {selectedBalance && (
                                            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm">
                                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Solde prévisionnel</span>
                                                <span className={cn(
                                                    "font-bold font-mono px-2 py-0.5 rounded",
                                                    selectedBalance.remaining - workingDays >= 0
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-rose-100 text-rose-700"
                                                )}>
                                                    {(selectedBalance.remaining - workingDays).toFixed(1)} j
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                        Motif (Facultatif)
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={e => setReason(e.target.value)}
                                        placeholder="Précisez le contexte de votre demande..."
                                        rows={4}
                                        className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border text-text-primary font-serif placeholder:font-sans placeholder:text-text-muted/50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all outline-none resize-none shadow-inner"
                                    />
                                </div>

                                {/* Summary */}
                                <div className="p-6 rounded-2xl bg-bg-secondary/50 border border-border space-y-4">
                                    <h4 className="font-serif italic text-lg text-text-primary">Récapitulatif</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                                            <span className="text-text-muted">Type</span>
                                            <span className="text-text-primary font-medium flex items-center gap-2">
                                                <span>{LEAVE_TYPE_ICONS[selectedType]}</span>
                                                {LEAVE_TYPE_LABELS[selectedType]}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                                            <span className="text-text-muted">Période</span>
                                            <span className="text-text-primary font-medium">
                                                {new Date(startDate).toLocaleDateString('fr-FR')} — {new Date(endDate).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-text-muted">Volume</span>
                                            <span className="text-text-primary font-bold bg-white px-2 py-0.5 rounded border border-border shadow-sm">{workingDays} jours</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 bg-bg-secondary/30 border-t border-border">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all flex items-center gap-2 font-medium"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Retour
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all font-medium"
                            >
                                Annuler
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={step === 2 && (!startDate || !endDate)}
                                className="px-8 py-3 rounded-[1rem] bg-text-primary text-bg-primary font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300"
                            >
                                Continuer
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    // Submit logic here
                                    onClose();
                                }}
                                className="px-8 py-3 rounded-[1rem] bg-accent text-white font-bold uppercase tracking-widest hover:bg-accent-hover transition-all flex items-center gap-3 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 duration-300"
                            >
                                <Send className="w-4 h-4" />
                                Confirmer
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Team Calendar Component
function TeamCalendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Add padding for first week
        const startPadding = (firstDay.getDay() + 6) % 7; // Monday = 0
        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        // Add days of month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const days = getDaysInMonth(currentMonth);
    const weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

    const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    // Mock team absences
    const teamAbsences = [
        { employeeName: 'Jean D.', dates: ['2026-01-15', '2026-01-16', '2026-01-17'], type: 'paid_leave' },
        { employeeName: 'Sophie L.', dates: ['2026-01-06', '2026-01-07', '2026-01-08'], type: 'sick_leave' },
        { employeeName: 'Marc P.', dates: ['2026-01-20'], type: 'rtt' }
    ];

    const getAbsencesForDate = (date: Date | null) => {
        if (!date) return [];
        const dateStr = date.toISOString().split('T')[0];
        return teamAbsences.filter(a => a.dates.includes(dateStr));
    };

    return (
        <div className="bg-bg-secondary border border-border rounded-[2.5rem] p-8 shadow-premium">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-bg-primary border border-border flex items-center justify-center text-accent shadow-sm">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif italic text-text-primary">Planning d'Équipe</h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Vue d'ensemble</p>
                    </div>
                </div>

                <div className="flex items-center bg-bg-primary rounded-xl border border-border p-1 shadow-sm">
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="p-2 rounded-lg hover:bg-bg-secondary text-text-muted hover:text-text-primary transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-text-primary font-serif font-medium w-36 text-center capitalize text-lg">
                        {monthName}
                    </span>
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="p-2 rounded-lg hover:bg-bg-secondary text-text-muted hover:text-text-primary transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
                {/* Header */}
                {weekDays.map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-text-muted uppercase tracking-widest py-3">
                        {day}
                    </div>
                ))}

                {/* Days */}
                {days.map((date, i) => {
                    const absences = getAbsencesForDate(date);
                    const isToday = date && date.toDateString() === new Date().toDateString();
                    const isWeekend = date && (date.getDay() === 0 || date.getDay() === 6);

                    return (
                        <div
                            key={i}
                            className={cn(
                                "aspect-square p-2 rounded-2xl relative transition-all duration-300",
                                !date ? '' : isWeekend ? 'bg-bg-tertiary/30' : 'bg-bg-primary border border-border hover:border-accent/30 hover:shadow-md cursor-pointer',
                                isToday && "ring-2 ring-accent ring-offset-2 ring-offset-bg-secondary"
                            )}
                        >
                            {date && (
                                <>
                                    <span className={cn(
                                        "text-sm font-medium",
                                        isWeekend ? "text-text-muted/50" : "text-text-primary"
                                    )}>
                                        {date.getDate()}
                                    </span>
                                    {absences.length > 0 && (
                                        <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                                            {absences.slice(0, 3).map((a, j) => (
                                                <div
                                                    key={j}
                                                    className={cn(
                                                        "h-1.5 flex-1 rounded-full",
                                                        a.type === 'paid_leave' ? 'bg-blue-400' :
                                                            a.type === 'sick_leave' ? 'bg-rose-400' : 'bg-amber-400'
                                                    )}
                                                    title={a.employeeName}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400 ring-2 ring-blue-400/20" />
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Congés Payés</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-400/20" />
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wide">RTT</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400 ring-2 ring-rose-400/20" />
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Maladie</span>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN PAGE
// ============================================

export default function LeavesPage() {
    const [activeTab, setActiveTab] = useState<'my_requests' | 'team_calendar' | 'to_approve'>('my_requests');
    const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<LeaveRequestStatus | 'all'>('all');
    const isManager = true; // Mock: current user is a manager

    const myRequests = MOCK_REQUESTS.filter(r => r.employeeId === 'current-user');
    const pendingApprovals = MOCK_REQUESTS.filter(r => r.status === 'pending_approval' && r.employeeId !== 'current-user');

    const filteredRequests = myRequests.filter(r =>
        statusFilter === 'all' || r.status === statusFilter
    );

    return (
        <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] -m-4 md:-m-8 bg-bg-primary overflow-hidden flex flex-col transition-colors duration-500">
            <div className="flex-1 overflow-auto p-4 md:p-8 w-full">
                <div className="max-w-7xl mx-auto space-y-10">
                    {/* Header */}


                    {/* Balance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {MOCK_BALANCES.map((balance, i) => (
                            <LeaveBalanceCard key={balance.id} balance={balance} />
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-border">
                        <div className="flex items-center gap-4">
                            <div className="flex bg-bg-secondary p-1.5 rounded-2xl border border-border shadow-sm w-fit">
                                {[
                                    { id: 'my_requests', label: 'Mes demandes', icon: LayoutList },
                                    { id: 'team_calendar', label: 'Calendrier équipe', icon: Calendar },
                                    { id: 'to_approve', label: 'À valider', icon: CheckCircle2, count: pendingApprovals.length }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={cn(
                                            "px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2.5",
                                            activeTab === tab.id
                                                ? "bg-text-primary text-bg-primary shadow-md"
                                                : "text-text-muted hover:text-text-primary hover:bg-bg-primary"
                                        )}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                        {tab.count !== undefined && tab.count > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] shadow-sm">
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsNewRequestOpen(true)}
                                className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-accent text-white hover:bg-black hover:text-white transition-all flex items-center justify-center shadow-lg shadow-accent/20 group ml-auto md:ml-0"
                                title="Nouvelle Demande"
                            >
                                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        {activeTab === 'my_requests' && (
                            <div className="relative group">
                                <select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value as LeaveRequestStatus | 'all')}
                                    className="appearance-none pl-5 pr-12 py-3 rounded-xl bg-bg-secondary border border-border text-xs font-bold uppercase tracking-widest text-text-primary focus:border-accent outline-none cursor-pointer shadow-sm min-w-[200px]"
                                >
                                    <option value="all">Tous les statuts</option>
                                    <option value="pending_approval">En attente</option>
                                    <option value="approved">Approuvées</option>
                                    <option value="rejected">Refusées</option>
                                </select>
                                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none group-hover:text-accent transition-colors" />
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'my_requests' && (
                            <motion.div
                                key="my_requests"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                {filteredRequests.length === 0 ? (
                                    <div className="text-center py-20 bg-bg-secondary/50 rounded-[3rem] border border-border mt-8">
                                        <div className="w-20 h-20 bg-bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
                                            <FileText className="w-8 h-8 text-text-muted/50" />
                                        </div>
                                        <h3 className="font-serif italic text-2xl text-text-primary mb-2">Aucune demande</h3>
                                        <p className="text-text-muted text-sm uppercase tracking-widest">Vous n'avez pas de demande correspondant aux critères</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {filteredRequests.map((request, i) => (
                                            <motion.div
                                                key={request.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <LeaveRequestCard
                                                    request={request}
                                                    onView={() => { }}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'team_calendar' && (
                            <motion.div
                                key="team_calendar"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <TeamCalendar />
                            </motion.div>
                        )}

                        {activeTab === 'to_approve' && isManager && (
                            <motion.div
                                key="to_approve"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {pendingApprovals.length > 0 && (
                                    <div className="mb-8 p-6 rounded-[2rem] bg-amber-50 border border-amber-200/60 flex items-center gap-4 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-64 bg-amber-200/20 blur-3xl -mr-10 -mt-10" />
                                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 relative z-10 shrink-0">
                                            <AlertCircle className="w-6 h-6" />
                                        </div>
                                        <div className="relative z-10">
                                            <h4 className="font-serif italic text-lg text-amber-900 mb-0.5">Action Requise</h4>
                                            <p className="text-amber-800/80 text-xs font-bold uppercase tracking-wide">
                                                {pendingApprovals.length} demande{pendingApprovals.length > 1 ? 's' : ''} en attente de validation
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {pendingApprovals.length === 0 ? (
                                    <div className="text-center py-20 bg-bg-secondary/50 rounded-[3rem] border border-border mt-8">
                                        <div className="w-20 h-20 bg-bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
                                        </div>
                                        <h3 className="font-serif italic text-2xl text-text-primary mb-2">Tout est à jour</h3>
                                        <p className="text-text-muted text-sm uppercase tracking-widest">Aucune demande en attente de validation</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {pendingApprovals.map((request, i) => (
                                            <motion.div
                                                key={request.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <LeaveRequestCard
                                                    request={request}
                                                    isManager={true}
                                                    onView={() => { }}
                                                    onApprove={() => { }}
                                                    onReject={() => { }}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* New Request Modal */}
            <NewRequestModal
                isOpen={isNewRequestOpen}
                onClose={() => setIsNewRequestOpen(false)}
                balances={MOCK_BALANCES}
            />
        </div>
    );
}
