"use client";

import { useState, useMemo } from "react";
import { X, Users, DivideCircle, Check, ArrowRight, User, Minus, Plus, CheckCircle2, CreditCard, Banknote, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CartItem {
    cartId: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
    modifiers?: string[];
}

interface SplitBillDialogProps {
    isOpen: boolean;
    items: CartItem[];
    total: number;
    guestCount: number;
    onClose: () => void;
    onPaySplit: (amount: number, guestIndex: number) => void;
}

type SplitMode = 'equal' | 'by-item' | 'custom';
type PaymentMethod = 'card' | 'cash' | 'mobile';

interface GuestPayment {
    paid: boolean;
    amount: number;
    method?: PaymentMethod;
}

export function SplitBillDialog({ isOpen, items, total, guestCount, onClose, onPaySplit }: SplitBillDialogProps) {
    const [mode, setMode] = useState<SplitMode>('equal');
    const [splitCount, setSplitCount] = useState(guestCount || 2);
    const [guestPayments, setGuestPayments] = useState<GuestPayment[]>([]);
    const [selectedGuest, setSelectedGuest] = useState<number | null>(null);
    const [selectedItems, setSelectedItems] = useState<Record<number, string[]>>({}); // guestIndex -> cartIds
    const [customAmounts, setCustomAmounts] = useState<number[]>([]);
    const [payingGuest, setPayingGuest] = useState<number | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

    // Initialize guest payments when split count changes
    useMemo(() => {
        const equalAmount = total / splitCount;
        setGuestPayments(
            Array(splitCount).fill(null).map(() => ({ paid: false, amount: equalAmount }))
        );
        setCustomAmounts(Array(splitCount).fill(equalAmount));
    }, [splitCount, total]);

    if (!isOpen) return null;

    const amountPerPerson = total / splitCount;
    const paidCount = guestPayments.filter(g => g.paid).length;
    const remainingAmount = total - guestPayments.filter(g => g.paid).reduce((sum, g) => sum + g.amount, 0);

    const handleSelectItem = (guestIndex: number, cartId: string) => {
        setSelectedItems(prev => {
            const guestItems = prev[guestIndex] || [];
            if (guestItems.includes(cartId)) {
                return { ...prev, [guestIndex]: guestItems.filter(id => id !== cartId) };
            } else {
                // Remove from other guests first
                const newState = { ...prev };
                Object.keys(newState).forEach(key => {
                    newState[parseInt(key)] = newState[parseInt(key)].filter(id => id !== cartId);
                });
                return { ...newState, [guestIndex]: [...(newState[guestIndex] || []), cartId] };
            }
        });
    };

    const getGuestTotal = (guestIndex: number): number => {
        if (mode === 'equal') return amountPerPerson;
        if (mode === 'custom') return customAmounts[guestIndex] || 0;
        // by-item mode
        const guestItems = selectedItems[guestIndex] || [];
        return items
            .filter(item => guestItems.includes(item.cartId))
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handlePayGuest = (guestIndex: number) => {
        setPayingGuest(guestIndex);
        setSelectedPaymentMethod(null);
    };

    const handleConfirmPayment = () => {
        if (payingGuest !== null && selectedPaymentMethod) {
            setGuestPayments(prev => prev.map((g, i) =>
                i === payingGuest ? { ...g, paid: true, method: selectedPaymentMethod } : g
            ));
            onPaySplit(getGuestTotal(payingGuest), payingGuest);
            setPayingGuest(null);
            setSelectedPaymentMethod(null);
        }
    };

    const allPaid = guestPayments.every(g => g.paid);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0A0A0B]/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#00D764]/20 flex items-center justify-center">
                            <DivideCircle className="w-6 h-6 text-[#00D764]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white">Division de l'Addition</h1>
                            <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mt-1">
                                Total: {total.toFixed(2)}€ • {paidCount}/{splitCount} payé(s)
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Payment for Guest Modal */}
                {payingGuest !== null ? (
                    <div className="p-8 space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-[#00D764]/10 flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-[#00D764]" />
                            </div>
                            <h2 className="text-xl font-black text-[#1A1A1A]">Paiement Convive {payingGuest + 1}</h2>
                            <p className="text-3xl font-black text-[#00D764] mt-2">{getGuestTotal(payingGuest).toFixed(2)}€</p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'card', name: 'Carte', icon: CreditCard },
                                { id: 'cash', name: 'Espèces', icon: Banknote },
                                { id: 'mobile', name: 'Mobile', icon: Smartphone }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedPaymentMethod(method.id as PaymentMethod)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                                        selectedPaymentMethod === method.id
                                            ? "border-[#00D764] bg-[#E6F9EF]"
                                            : "border-[#E9ECEF] hover:border-[#1A1A1A]/20"
                                    )}
                                >
                                    <method.icon className={cn("w-6 h-6", selectedPaymentMethod === method.id ? "text-[#00D764]" : "text-[#6C757D]")} />
                                    <span className="text-xs font-bold uppercase">{method.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setPayingGuest(null)} className="flex-1 h-12 rounded-xl">
                                Retour
                            </Button>
                            <Button
                                onClick={handleConfirmPayment}
                                disabled={!selectedPaymentMethod}
                                className="flex-1 h-12 rounded-xl bg-[#00D764] hover:bg-[#00C058] text-white"
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Confirmer
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Mode Selector */}
                        <div className="p-6 border-b border-[#E9ECEF] bg-[#F8F9FA]">
                            <div className="flex gap-2">
                                {[
                                    { id: 'equal', label: 'Parts égales', icon: Users },
                                    { id: 'by-item', label: 'Par article', icon: DivideCircle },
                                    { id: 'custom', label: 'Montants libres', icon: CreditCard }
                                ].map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setMode(m.id as SplitMode)}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all",
                                            mode === m.id
                                                ? "bg-[#1A1A1A] text-white shadow-lg"
                                                : "bg-white text-[#6C757D] hover:bg-[#E9ECEF]"
                                        )}
                                    >
                                        <m.icon className="w-4 h-4" />
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Split Configuration */}
                        {mode === 'equal' && (
                            <div className="p-6 border-b border-[#E9ECEF]">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-[#1A1A1A]">Nombre de convives</span>
                                    <div className="flex items-center gap-3 bg-[#F8F9FA] rounded-xl p-1">
                                        <button
                                            onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                                            className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-[#E9ECEF]"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center text-xl font-black">{splitCount}</span>
                                        <button
                                            onClick={() => setSplitCount(splitCount + 1)}
                                            className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-[#E9ECEF]"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4 p-4 bg-[#E6F9EF] rounded-xl text-center">
                                    <span className="text-sm text-[#00875A]">Chaque convive paiera </span>
                                    <span className="text-lg font-black text-[#00D764]">{amountPerPerson.toFixed(2)}€</span>
                                </div>
                            </div>
                        )}

                        {/* Guest Cards */}
                        <div className="p-6 max-h-[300px] overflow-auto">
                            <div className="grid grid-cols-2 gap-4">
                                {guestPayments.map((guest, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "p-4 rounded-2xl border-2 transition-all",
                                            guest.paid
                                                ? "bg-[#E6F9EF] border-[#00D764]/30"
                                                : "bg-white border-[#E9ECEF] hover:border-[#1A1A1A]/20"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm",
                                                    guest.paid ? "bg-[#00D764] text-white" : "bg-[#F8F9FA] text-[#1A1A1A]"
                                                )}>
                                                    {guest.paid ? <Check className="w-4 h-4" /> : index + 1}
                                                </div>
                                                <span className="font-bold text-sm">Convive {index + 1}</span>
                                            </div>
                                            {guest.paid && (
                                                <span className="text-[10px] font-bold text-[#00D764] uppercase bg-[#00D764]/10 px-2 py-1 rounded-full">
                                                    Payé
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-2xl font-black text-[#1A1A1A] mb-3">
                                            {getGuestTotal(index).toFixed(2)}€
                                        </div>

                                        {!guest.paid && (
                                            <Button
                                                onClick={() => handlePayGuest(index)}
                                                className="w-full h-10 rounded-xl bg-[#1A1A1A] hover:bg-black text-white text-sm"
                                            >
                                                Encaisser
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        )}

                                        {guest.paid && guest.method && (
                                            <div className="flex items-center gap-2 text-xs text-[#00875A]">
                                                {guest.method === 'card' && <CreditCard className="w-3 h-3" />}
                                                {guest.method === 'cash' && <Banknote className="w-3 h-3" />}
                                                {guest.method === 'mobile' && <Smartphone className="w-3 h-3" />}
                                                <span className="font-bold capitalize">{guest.method}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-[#F8F9FA] border-t border-[#E9ECEF] flex items-center justify-between">
                            <div>
                                <span className="text-sm text-[#6C757D]">Reste à payer: </span>
                                <span className="text-xl font-black text-[#1A1A1A]">{remainingAmount.toFixed(2)}€</span>
                            </div>
                            {allPaid && (
                                <Button onClick={onClose} className="h-12 px-6 rounded-xl bg-[#00D764] hover:bg-[#00C058] text-white">
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Terminer
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
