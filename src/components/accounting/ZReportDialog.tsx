"use client";

import { useState } from "react";
import { X, Printer, Download, Clock, CreditCard, Banknote, Smartphone, CheckCircle, Hash, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    data: ZReportData;
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

export function ZReportDialog({ isOpen, onClose, data = MOCK_Z_DATA, onPrint, onExport }: ZReportDialogProps) {
    if (!isOpen) return null;

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="py-4 border-b border-dashed border-[#E9ECEF]">
            <h3 className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest mb-3">{title}</h3>
            {children}
        </div>
    );

    const Line = ({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) => (
        <div className="flex justify-between items-center py-1">
            <span className={cn("text-sm", bold ? "font-black text-[#1A1A1A]" : "text-[#6C757D]")}>{label}</span>
            <span className={cn(
                "text-sm tabular-nums",
                bold ? "font-black" : "font-bold",
                accent ? "text-[#00D764]" : "text-[#1A1A1A]"
            )}>{value}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0A0A0B]/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-[#1A1A1A] p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#00D764]/20 flex items-center justify-center">
                                <Hash className="w-5 h-5 text-[#00D764]" />
                            </div>
                            <div>
                                <h1 className="text-lg font-black">Z de Caisse #{data.reportNumber}</h1>
                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{data.date}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/50 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex gap-4 text-[11px] font-bold text-white/60">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Ouverture: {data.openTime}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Clôture: {data.closeTime}
                        </div>
                    </div>
                </div>

                {/* Receipt Style Content */}
                <div className="p-6 font-mono text-[13px] max-h-[60vh] overflow-auto">
                    {/* Établissement */}
                    <div className="text-center pb-4 border-b border-dashed border-[#E9ECEF]">
                        <p className="text-lg font-black">RESTAURANT OS</p>
                        <p className="text-[11px] text-[#ADB5BD]">123 Avenue des Champs-Élysées</p>
                        <p className="text-[11px] text-[#ADB5BD]">75008 Paris • SIRET: 123 456 789 00012</p>
                    </div>

                    <Section title="Chiffre d'Affaires">
                        <Line label="Ventes brutes" value={`${data.grossSales.toFixed(2)} €`} />
                        <Line label="Remises accordées" value={`-${data.discounts.toFixed(2)} €`} />
                        <Line label="CHIFFRE NET" value={`${data.netSales.toFixed(2)} €`} bold accent />
                    </Section>

                    <Section title="Répartition des Règlements">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-[#F8F9FA] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-blue-500" />
                                    <span>Cartes Bancaires</span>
                                </div>
                                <span className="font-black">{data.cardPayments.toFixed(2)} €</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-[#F8F9FA] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Banknote className="w-4 h-4 text-green-500" />
                                    <span>Espèces</span>
                                </div>
                                <span className="font-black">{data.cashPayments.toFixed(2)} €</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-[#F8F9FA] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-purple-500" />
                                    <span>Sans Contact / Mobile</span>
                                </div>
                                <span className="font-black">{data.mobilePayments.toFixed(2)} €</span>
                            </div>
                        </div>
                    </Section>

                    <Section title="Ventilation TVA">
                        <Line label="TVA 10% (Restauration)" value={`${data.vat10.toFixed(2)} €`} />
                        <Line label="TVA 20% (Boissons Alcool)" value={`${data.vat20.toFixed(2)} €`} />
                        <Line label="TVA 5.5% (Ventes à Emporter)" value={`${data.vat55.toFixed(2)} €`} />
                        <Line label="TOTAL TVA COLLECTÉE" value={`${(data.vat10 + data.vat20 + data.vat55).toFixed(2)} €`} bold />
                    </Section>

                    <Section title="Statistiques">
                        <Line label="Nombre de transactions" value={data.transactionCount.toString()} />
                        <Line label="Ticket moyen" value={`${data.avgTicket.toFixed(2)} €`} />
                        <Line label="Annulations" value={`${data.cancelledCount} (${data.cancelledAmount.toFixed(2)} €)`} />
                    </Section>

                    <Section title="Contrôle Espèces">
                        <Line label="Fond de caisse ouverture" value={`${data.openingCash.toFixed(2)} €`} />
                        <Line label="Encaissements espèces" value={`+${data.cashPayments.toFixed(2)} €`} />
                        <Line label="Espèces attendues" value={`${data.expectedCash.toFixed(2)} €`} bold />
                        <Line label="Espèces comptées" value={`${data.closingCash.toFixed(2)} €`} />
                        <div className={cn(
                            "mt-2 p-2 rounded-lg text-center font-black",
                            data.variance === 0 ? "bg-green-50 text-green-600" :
                                data.variance > 0 ? "bg-blue-50 text-blue-600" :
                                    "bg-red-50 text-red-600"
                        )}>
                            Écart: {data.variance >= 0 ? '+' : ''}{data.variance.toFixed(2)} €
                        </div>
                    </Section>

                    {/* Signature */}
                    <div className="pt-4 text-center">
                        <p className="text-[11px] text-[#ADB5BD]">Rapport généré le {data.date} à {data.closeTime}</p>
                        <p className="text-[11px] text-[#ADB5BD]">Opérateur: {data.cashier}</p>
                        <div className="mt-4 flex items-center justify-center gap-2 text-[#00D764]">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-black uppercase">Clôture Validée</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-[#F8F9FA] border-t border-[#E9ECEF] flex gap-3">
                    <Button variant="outline" onClick={onPrint} className="flex-1 h-12 rounded-xl">
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimer
                    </Button>
                    <Button onClick={onExport} className="flex-1 h-12 rounded-xl bg-[#1A1A1A] hover:bg-black">
                        <Download className="w-4 h-4 mr-2" />
                        Exporter PDF
                    </Button>
                </div>
            </div>
        </div>
    );
}
