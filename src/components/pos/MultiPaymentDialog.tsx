"use client";

import { useState, useMemo } from "react";
import { X, CreditCard, Banknote, Smartphone, Plus, Check, ArrowRight, Trash2, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    { id: 'cash', name: 'Espèces', icon: Banknote, color: '#00D764' },
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

    if (!isOpen) return null;

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

    const handleKeypadInput = (value: string) => {
        if (value === 'C') {
            setInputAmount('');
        } else if (value === '.') {
            if (!inputAmount.includes('.')) {
                setInputAmount(inputAmount + '.');
            }
        } else {
            setInputAmount(inputAmount + value);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0A0A0B]/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#00D764]/20 flex items-center justify-center">
                            <Calculator className="w-6 h-6 text-[#00D764]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white">Paiement Mixte</h1>
                            <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mt-1">
                                Total: {total.toFixed(2)}€ • Reste: {remaining.toFixed(2)}€
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex">
                    {/* Left Side - Payment Entry */}
                    <div className="flex-1 p-6 border-r border-[#E9ECEF]">
                        {/* Method Selector */}
                        <div className="flex gap-2 mb-6">
                            {PAYMENT_METHODS.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setCurrentMethod(method.id as any)}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all border-2",
                                        currentMethod === method.id
                                            ? "text-white shadow-lg"
                                            : "bg-white text-[#6C757D] border-[#E9ECEF] hover:border-[#1A1A1A]/20"
                                    )}
                                    style={{
                                        backgroundColor: currentMethod === method.id ? method.color : undefined,
                                        borderColor: currentMethod === method.id ? method.color : undefined
                                    }}
                                >
                                    <method.icon className="w-4 h-4" />
                                    {method.name}
                                </button>
                            ))}
                        </div>

                        {/* Amount Input */}
                        <div className="bg-[#F8F9FA] rounded-2xl p-4 mb-4">
                            <label className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-widest">Montant à encaisser</label>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="number"
                                    value={inputAmount}
                                    onChange={(e) => setInputAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="flex-1 text-3xl font-black text-[#1A1A1A] bg-transparent border-none outline-none"
                                />
                                <span className="text-2xl font-black text-[#ADB5BD]">€</span>
                            </div>
                        </div>

                        {/* Quick Amounts */}
                        <div className="grid grid-cols-5 gap-2 mb-4">
                            {QUICK_AMOUNTS.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setInputAmount(amount.toString())}
                                    disabled={amount > remaining}
                                    className="py-3 rounded-xl font-black text-sm bg-white border border-[#E9ECEF] hover:border-[#1A1A1A] transition-all disabled:opacity-30"
                                >
                                    {amount}€
                                </button>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={() => handleAddPayment(parseFloat(inputAmount) || 0)}
                                disabled={!inputAmount || parseFloat(inputAmount) <= 0 || parseFloat(inputAmount) > remaining}
                                className="h-12 rounded-xl bg-[#1A1A1A] hover:bg-black text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter
                            </Button>
                            <Button
                                onClick={handlePayRemaining}
                                disabled={remaining <= 0}
                                variant="outline"
                                className="h-12 rounded-xl border-[#00D764] text-[#00D764] hover:bg-[#00D764]/10"
                            >
                                Reste ({remaining.toFixed(2)}€)
                            </Button>
                        </div>

                        {/* Cash Change Calculator */}
                        {currentMethod === 'cash' && (
                            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                                <label className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Calcul du rendu</label>
                                <div className="flex items-center gap-3 mt-2">
                                    <input
                                        type="number"
                                        value={cashGiven || ''}
                                        onChange={(e) => setCashGiven(parseFloat(e.target.value) || 0)}
                                        placeholder="Montant donné"
                                        className="flex-1 px-3 py-2 rounded-lg border border-amber-200 text-lg font-bold bg-white"
                                    />
                                    <span className="text-lg font-black text-amber-600">→</span>
                                    <div className="px-4 py-2 bg-amber-100 rounded-lg">
                                        <span className="text-lg font-black text-amber-700">{change.toFixed(2)}€</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Payment Summary */}
                    <div className="w-80 bg-[#F8F9FA] p-6 flex flex-col">
                        <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider mb-4">Récapitulatif</h3>

                        <div className="flex-1 space-y-2 overflow-auto">
                            {payments.length === 0 ? (
                                <div className="text-center py-8 text-[#ADB5BD]">
                                    <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm font-bold">Aucun paiement</p>
                                </div>
                            ) : (
                                payments.map((payment) => {
                                    const method = PAYMENT_METHODS.find(m => m.id === payment.method);
                                    const Icon = method?.icon || CreditCard;
                                    return (
                                        <div key={payment.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E9ECEF]">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: `${method?.color}20`, color: method?.color }}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-sm text-[#1A1A1A]">{method?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-[#1A1A1A]">{payment.amount.toFixed(2)}€</span>
                                                <button
                                                    onClick={() => handleRemovePayment(payment.id)}
                                                    className="p-1 text-[#FF4D4D] hover:bg-[#FF4D4D]/10 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Total Summary */}
                        <div className="mt-4 pt-4 border-t border-[#E9ECEF] space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#ADB5BD] font-bold">Total à payer</span>
                                <span className="font-black text-[#1A1A1A]">{total.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#ADB5BD] font-bold">Payé</span>
                                <span className="font-black text-[#00D764]">{totalPaid.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between text-lg pt-2 border-t border-[#E9ECEF]">
                                <span className="font-bold text-[#1A1A1A]">Reste</span>
                                <span className={cn("font-black", remaining > 0 ? "text-[#FF4D4D]" : "text-[#00D764]")}>
                                    {remaining.toFixed(2)}€
                                </span>
                            </div>
                        </div>

                        {/* Confirm Button */}
                        <Button
                            onClick={handleComplete}
                            disabled={!isComplete}
                            className={cn(
                                "w-full h-14 mt-4 rounded-xl font-black text-lg transition-all",
                                isComplete
                                    ? "bg-[#00D764] hover:bg-[#00C058] text-white shadow-lg"
                                    : "bg-[#E9ECEF] text-[#ADB5BD] cursor-not-allowed"
                            )}
                        >
                            {isComplete ? (
                                <>
                                    <Check className="w-5 h-5 mr-2" />
                                    Valider le Paiement
                                </>
                            ) : (
                                <>Reste {remaining.toFixed(2)}€</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
