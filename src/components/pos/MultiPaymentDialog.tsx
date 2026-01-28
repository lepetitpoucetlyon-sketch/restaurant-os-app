"use client";

import { useState, useMemo } from "react";
import { X, CreditCard, Banknote, Smartphone, Plus, Check, ArrowRight, Trash2, Calculator, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

interface MultiPaymentDialogProps {
    isOpen: boolean;
    total: number;
    onClose: () => void;
    onPaymentComplete: (payments: PaymentEntry[]) => void;
}

export interface PaymentEntry {
    id: string;
    method: 'card' | 'cash' | 'mobile';
    amount: number;
}

const PAYMENT_METHODS = [
    { id: 'card', name: 'Carte Bancaire', icon: CreditCard, color: '#3B82F6' },
    { id: 'cash', name: 'Espèces', icon: Banknote, color: '#C5A059' },
    { id: 'mobile', name: 'Sans Contact', icon: Smartphone, color: '#8B5CF6' },
];

const QUICK_AMOUNTS = [5, 10, 20, 50, 100];

export function MultiPaymentDialog({ isOpen, total, onClose, onPaymentComplete }: MultiPaymentDialogProps) {
    const [payments, setPayments] = useState<PaymentEntry[]>([]);
    const [currentMethod, setCurrentMethod] = useState<'card' | 'cash' | 'mobile'>('card');
    const [inputAmount, setInputAmount] = useState('');
    const [cashGiven, setCashGiven] = useState<number>(0);

    const totalPaid = useMemo(() => payments.reduce((sum, p) => sum + p.amount, 0), [payments]);
    const remaining = total - totalPaid;
    const isComplete = remaining <= 0;
    const change = cashGiven > 0 && currentMethod === 'cash' ? cashGiven - remaining : 0;

    const handleAddPayment = (amount: number) => {
        if (amount <= 0 || amount > remaining) return;

        const newPayment: PaymentEntry = {
            id: Math.random().toString(36).substr(2, 9),
            method: currentMethod,
            amount: Math.min(amount, remaining)
        };

        setPayments([...payments, newPayment]);
        setInputAmount('');
        setCashGiven(0);
    };

    const handleRemovePayment = (id: string) => {
        setPayments(payments.filter(p => p.id !== id));
    };

    const handlePayRemaining = () => {
        handleAddPayment(remaining);
    };

    const handleComplete = () => {
        if (isComplete) {
            onPaymentComplete(payments);
            setPayments([]);
            setInputAmount('');
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            className="p-0 border-none bg-transparent"
            showClose={false}
            noPadding
        >
            <div className="relative bg-black border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] w-full overflow-hidden group/modal flex flex-col max-h-[90vh]">
                {/* Visual Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-accent-gold/5 blur-[100px] pointer-events-none" />

                {/* Header Section */}
                <div className="relative z-10 p-10 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-2xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold shadow-glow">
                            <Calculator className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-0.5 bg-accent-gold rounded-full" />
                                <span className="text-accent-gold text-[10px] font-black uppercase tracking-[0.4em]">Protocole Financier</span>
                            </div>
                            <h2 className="text-4xl font-serif font-black italic text-white tracking-tighter">
                                Paiement <span className="text-accent-gold not-italic">Mixte</span>.
                            </h2>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Total à Encaisser</p>
                        <p className="text-3xl font-serif font-black italic text-accent-gold">{total.toFixed(2)}€</p>
                    </div>

                    {/* Custom Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-500 hover:rotate-90 group/close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative z-10 flex flex-1 overflow-hidden">
                    {/* Left Side - Payment Entry */}
                    <div className="flex-1 p-10 border-r border-white/5 overflow-auto elegant-scrollbar">
                        {/* Method Selector */}
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {PAYMENT_METHODS.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setCurrentMethod(method.id as any)}
                                    className={cn(
                                        "group flex flex-col items-center gap-4 p-6 rounded-2.5xl transition-all duration-500 border",
                                        currentMethod === method.id
                                            ? "bg-accent-gold border-transparent shadow-glow translate-y-[-4px]"
                                            : "bg-white/5 border-white/10 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-700",
                                        currentMethod === method.id
                                            ? "bg-white/20 text-white"
                                            : "bg-black/40 text-accent-gold border border-accent-gold/10"
                                    )}>
                                        <method.icon className="w-6 h-6" strokeWidth={1.5} />
                                    </div>
                                    <span className={cn(
                                        "text-[11px] font-black uppercase tracking-widest",
                                        currentMethod === method.id ? "text-white" : "text-white/60"
                                    )}>
                                        {method.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Amount Entry Area */}
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 transition-all focus-within:border-accent-gold/50 shadow-inner group/input">
                                <label className="text-[10px] font-black text-accent-gold uppercase tracking-[0.3em] mb-4 block">Montant à Encaisser</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={inputAmount}
                                        onChange={(e) => setInputAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="flex-1 bg-transparent text-6xl font-serif font-black italic text-white outline-none placeholder:text-white/5 tracking-tighter"
                                    />
                                    <span className="text-4xl font-serif font-black italic text-white opacity-20 group-focus-within/input:opacity-100 transition-opacity">€</span>
                                </div>
                            </div>

                            {/* Quick Amounts */}
                            <div className="grid grid-cols-5 gap-3">
                                {QUICK_AMOUNTS.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setInputAmount(amount.toString())}
                                        disabled={amount > remaining}
                                        className="py-4 rounded-2xl font-black text-sm bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-accent-gold hover:bg-accent-gold/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed group/quick"
                                    >
                                        <span className="group-hover:scale-110 transition-transform block">{amount}€</span>
                                    </button>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button
                                    onClick={() => handleAddPayment(parseFloat(inputAmount) || 0)}
                                    disabled={!inputAmount || parseFloat(inputAmount) <= 0 || parseFloat(inputAmount) > remaining}
                                    className="h-16 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-accent-gold transition-all duration-500 disabled:opacity-20 flex items-center justify-center gap-3 group/add"
                                >
                                    <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 group-hover:scale-125" />
                                    Ajouter le Paiement
                                </button>
                                <button
                                    onClick={handlePayRemaining}
                                    disabled={remaining <= 0}
                                    className="h-16 rounded-2xl bg-accent-gold/10 border border-accent-gold/20 text-accent-gold font-black uppercase tracking-widest hover:bg-accent-gold/20 transition-all duration-500 disabled:opacity-20 flex items-center justify-center gap-3 group/rest"
                                >
                                    Payer le Reste ({remaining.toFixed(2)}€)
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                                </button>
                            </div>
                        </div>

                        {/* Cash Change Module */}
                        {currentMethod === 'cash' && (
                            <div className="mt-10 p-8 rounded-3xl bg-accent-gold/5 border border-accent-gold/10 relative overflow-hidden group/change">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 blur-3xl pointer-events-none" />
                                <div className="relative z-10">
                                    <label className="text-[10px] font-black text-accent-gold uppercase tracking-[0.3em] block mb-4">Calcul du Rendu Espèces</label>
                                    <div className="flex items-center gap-6">
                                        <div className="flex-1">
                                            <input
                                                type="number"
                                                value={cashGiven || ''}
                                                onChange={(e) => setCashGiven(parseFloat(e.target.value) || 0)}
                                                placeholder="Montant reçu"
                                                className="w-full bg-transparent text-3xl font-serif font-black italic text-white outline-none placeholder:text-white/10"
                                            />
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-accent-gold/20 flex items-center justify-center">
                                            <ArrowRight className="w-6 h-6 text-accent-gold" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">À Rendre</p>
                                            <p className="text-4xl font-serif font-black italic text-accent-gold">{change.toFixed(2)}€</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Payment Summary */}
                    <div className="w-[380px] bg-white/[0.02] p-10 flex flex-col shrink-0">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse shadow-glow" />
                            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Registres Actuels</h3>
                        </div>

                        <div className="flex-1 space-y-4 overflow-auto elegant-scrollbar pr-2">
                            {payments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-white flex items-center justify-center mb-6">
                                        <CreditCard className="w-8 h-8" />
                                    </div>
                                    <p className="font-serif italic text-xl">Aucun artefact de paiement</p>
                                </div>
                            ) : (
                                payments.map((payment) => {
                                    const method = PAYMENT_METHODS.find(m => m.id === payment.method);
                                    const Icon = method?.icon || CreditCard;
                                    return (
                                        <div key={payment.id} className="group/item relative bg-white/5 border border-white/10 rounded-2xl p-5 transition-all hover:bg-white/[0.08] hover:border-accent-gold/30">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-accent-gold">
                                                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{method?.name}</p>
                                                        <p className="text-xl font-serif font-black italic text-white">{payment.amount.toFixed(2)}€</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemovePayment(payment.id)}
                                                    className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 opacity-0 group-hover/item:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-glow-red"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Final Balance Sheet */}
                        <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                            <div className="flex justify-between items-center opacity-40">
                                <span className="text-[10px] font-black uppercase tracking-widest">Calcul Global</span>
                                <span className="text-lg font-serif font-black italic text-white">{total.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-accent-gold uppercase tracking-widest">Total Encaissé</span>
                                <span className="text-2xl font-serif font-black italic text-accent-gold">{totalPaid.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Reliquat</span>
                                    <span className={cn(
                                        "text-3xl font-serif font-black italic mt-1",
                                        remaining > 0 ? "text-red-500" : "text-emerald-500"
                                    )}>
                                        {remaining.toFixed(2)}€
                                    </span>
                                </div>
                                {isComplete && (
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center shadow-glow-emerald">
                                        <Check className="w-6 h-6 text-emerald-500" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Master Execute Button */}
                        <button
                            onClick={handleComplete}
                            disabled={!isComplete}
                            className={cn(
                                "w-full h-18 mt-8 rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-700 shadow-2xl flex items-center justify-center gap-4 group/final",
                                isComplete
                                    ? "bg-emerald-500 text-white hover:bg-emerald-400 shadow-glow-emerald hover:scale-[1.02]"
                                    : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                            )}
                        >
                            {isComplete ? (
                                <>
                                    <Zap className="w-5 h-5 animate-pulse" />
                                    Finaliser la Transaction
                                </>
                            ) : (
                                <>En attente du Solde</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
