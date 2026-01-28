"use client";

import { useState } from "react";
import { X, Printer, Download, Clock, CreditCard, Banknote, Smartphone, CheckCircle, Hash, Calendar, Sparkles, Gem, FileText, Receipt, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { motion } from "framer-motion";

interface ZReportData {
    date: string;
    openTime: string;
    closeTime: string;
    reportNumber: number;
    cashier: string;

    // Totals
    grossSales: number;
    discounts: number;
    netSales: number;

    // Payment breakdown
    cardPayments: number;
    cashPayments: number;
    mobilePayments: number;

    // VAT breakdown
    vat10: number;
    vat20: number;
    vat55: number;

    // Counts
    transactionCount: number;
    avgTicket: number;
    cancelledCount: number;
    cancelledAmount: number;

    // Cash drawer
    openingCash: number;
    closingCash: number;
    expectedCash: number;
    variance: number;
}

interface ZReportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    data?: ZReportData;
    onPrint: () => void;
    onExport: () => void;
}

const MOCK_Z_DATA: ZReportData = {
    date: "05/01/2026",
    openTime: "11:30",
    closeTime: "23:45",
    reportNumber: 1247,
    cashier: "Alexandre De Rossi",

    grossSales: 4850.50,
    discounts: 125.00,
    netSales: 4725.50,

    cardPayments: 3180.00,
    cashPayments: 1245.50,
    mobilePayments: 300.00,

    vat10: 285.45,
    vat20: 142.80,
    vat55: 28.60,

    transactionCount: 78,
    avgTicket: 60.58,
    cancelledCount: 2,
    cancelledAmount: 45.00,

    openingCash: 200.00,
    closingCash: 1440.50,
    expectedCash: 1445.50,
    variance: -5.00
};

// Helper for currency formatting
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount);
};

export function ZReportDialog({ isOpen, onClose, data = MOCK_Z_DATA, onPrint, onExport }: ZReportDialogProps) {

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="py-6 border-b border-dashed border-border/50 last:border-0">
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">{title}</h3>
            {children}
        </div>
    );

    const Line = ({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) => (
        <div className="flex justify-between items-center py-1.5">
            <span className={cn("text-xs", bold ? "font-black text-text-primary uppercase tracking-wider" : "text-text-muted font-medium")}>{label}</span>
            <span className={cn(
                "text-sm font-mono tracking-tighter",
                bold ? "font-black" : "font-semibold",
                accent ? "text-success" : "text-text-primary"
            )}>{value}</span>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            className="p-0 border-none bg-transparent"
            showClose={false}
            noPadding
        >
            <div className="flex flex-col h-[85vh] bg-bg-primary rounded-[3rem] overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.4)] border border-white/20">
                {/* Premium Accounting Header */}
                <div className="px-10 py-8 bg-gradient-to-br from-[#1A1A1B] to-[#2D2D2E] text-white relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,215,100,0.2),transparent)]" />
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-success flex items-center justify-center shadow-xl shadow-success/20">
                                <FileText strokeWidth={1.5} className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-black tracking-tight flex items-center gap-3">
                                    Rapport de Clôture Z
                                    <ShieldCheck className="w-4 h-4 text-success" />
                                </h2>
                                <div className="flex items-center gap-4 mt-1">
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Certification Fiscale #LNE-452</span>
                                    <div className="h-1 w-1 rounded-full bg-success/40" />
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-3 h-3 text-success" />
                                        <span className="text-success text-[10px] font-black uppercase tracking-[0.2em]">ID: {data.reportNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all"
                        >
                            <X className="w-5 h-5 text-white/60" />
                        </button>
                    </div>

                    <div className="flex gap-6 mt-6 pb-2 relative z-10">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                            <Calendar className="w-3 h-3 text-success" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{data.date}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                            <Clock className="w-3 h-3 text-success" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{data.openTime} — {data.closeTime}</span>
                        </div>
                    </div>
                </div>

                {/* Receipt Content Area */}
                <div className="flex-1 overflow-hidden flex bg-bg-secondary p-8">
                    <div className="flex-1 bg-white rounded-[2.5rem] shadow-soft flex flex-col overflow-hidden border border-border/50">
                        {/* Scrollable Receipt Part */}
                        <div className="flex-1 overflow-y-auto elegant-scrollbar p-10 font-mono">
                            <div className="text-center pb-8 border-b border-dashed border-border mb-6">
                                <div className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4 border border-border/50">
                                    <Receipt className="w-8 h-8 text-text-muted" />
                                </div>
                                <h3 className="text-xl font-black text-text-primary tracking-tighter">PREMIUM RESTAURANT OS</h3>
                                <p className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-widest leading-relaxed">
                                    123 Avenue des Champs-Élysées, 75008 Paris<br />
                                    SIRET: 123 456 789 00012 • TVA: FR 12 345678901
                                </p>
                            </div>

                            <Section title="Indicateurs de Performance">
                                <Line label="Ventes brutes" value={formatCurrency(data.grossSales)} />
                                <Line label="Remises & Gratuités" value={`-${formatCurrency(data.discounts)}`} />
                                <Line label="CHIFFRE D'AFFAIRES NET" value={formatCurrency(data.netSales)} bold accent />
                            </Section>

                            <Section title="Modes de Règlements">
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center justify-between p-4 bg-bg-tertiary/50 rounded-2xl border border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                <CreditCard className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-widest">Cartes Bancaires</span>
                                        </div>
                                        <span className="text-sm font-black font-mono">{formatCurrency(data.cardPayments)}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-bg-tertiary/50 rounded-2xl border border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                                                <Banknote className="w-4 h-4 text-success" />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-widest">Espèces (Drawer)</span>
                                        </div>
                                        <span className="text-sm font-black font-mono">{formatCurrency(data.cashPayments)}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-bg-tertiary/50 rounded-2xl border border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                <Smartphone className="w-4 h-4 text-purple-500" />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-widest">Mobile / Sans Contact</span>
                                        </div>
                                        <span className="text-sm font-black font-mono">{formatCurrency(data.mobilePayments)}</span>
                                    </div>
                                </div>
                            </Section>

                            <Section title="Ventilation Fiscale">
                                <Line label="TVA 10% (Restauration)" value={formatCurrency(data.vat10)} />
                                <Line label="TVA 20% (Alcools)" value={formatCurrency(data.vat20)} />
                                <Line label="TVA 5.5% (V.A.E)" value={formatCurrency(data.vat55)} />
                                <div className="mt-2 pt-2 border-t border-border/50">
                                    <Line label="TOTAL TAXES COLLECTÉES" value={formatCurrency(data.vat10 + data.vat20 + data.vat55)} bold />
                                </div>
                            </Section>

                            <Section title="Audit de Caisse">
                                <Line label="Fond de caisse (Ouv.)" value={formatCurrency(data.openingCash)} />
                                <Line label="Encaissements Cash" value={`+${formatCurrency(data.cashPayments)}`} />
                                <Line label="SOLDE ATTENDU" value={formatCurrency(data.expectedCash)} bold />
                                <Line label="SOLDE DÉCLARÉ" value={formatCurrency(data.closingCash)} />
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={cn(
                                        "mt-4 p-4 rounded-2xl text-center font-black flex items-center justify-center gap-3",
                                        data.variance === 0 ? "bg-success-soft text-success border border-success/20" :
                                            data.variance > 0 ? "bg-blue-50 text-blue-600 border border-blue-200" :
                                                "bg-error-soft text-error border border-error/20"
                                    )}>
                                    <AlertTriangle className="w-4 h-4" />
                                    Écart de Caisse: {data.variance >= 0 ? '+' : ''}{data.variance.toFixed(2)} €
                                </motion.div>
                            </Section>

                            <div className="pt-10 text-center space-y-4">
                                <div className="flex items-center justify-center gap-3 px-6 py-3 bg-success/5 rounded-2xl border border-success/20 inline-flex">
                                    <CheckCircle className="w-5 h-5 text-success" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-success">Clôture Validée & Archivée</span>
                                </div>
                                <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-relaxed">
                                    Généré par {data.cashier}<br />
                                    Horodatage: {data.date} @ {data.closeTime}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer Actions */}
                <div className="px-10 py-8 bg-white border-t border-border flex gap-6 shrink-0 relative z-20">
                    <Button
                        variant="outline"
                        onClick={onPrint}
                        className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-border hover:bg-bg-tertiary transition-all"
                    >
                        <Printer className="w-4 h-4 mr-3" />
                        Imprimer Z Ticket
                    </Button>
                    <Button
                        onClick={onExport}
                        className="flex-1 h-14 bg-text-primary hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center"
                    >
                        <Download className="w-4 h-4 mr-3" />
                        Exporter Rapport PDF
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
