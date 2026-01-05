"use client";

import { useState } from "react";
import { X, Percent, Tag, Gift, Ticket, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DiscountDialogProps {
    isOpen: boolean;
    subtotal: number;
    onClose: () => void;
    onApplyDiscount: (discount: DiscountData) => void;
}

export interface DiscountData {
    type: 'percent' | 'amount' | 'item' | 'promo';
    value: number;
    code?: string;
    description: string;
}

// Mock promo codes
const PROMO_CODES: Record<string, { discount: number; type: 'percent' | 'amount'; description: string }> = {
    'WELCOME10': { discount: 10, type: 'percent', description: '10% de réduction bienvenue' },
    'SUMMER20': { discount: 20, type: 'percent', description: '20% réduction été' },
    'FIDELITE': { discount: 5, type: 'amount', description: '5€ de réduction fidélité' },
    'VIP50': { discount: 50, type: 'percent', description: '50% VIP exclusif' },
};

export function DiscountDialog({ isOpen, subtotal, onClose, onApplyDiscount }: DiscountDialogProps) {
    const [discountType, setDiscountType] = useState<'percent' | 'amount' | 'promo'>('percent');
    const [percentValue, setPercentValue] = useState<number>(10);
    const [amountValue, setAmountValue] = useState<number>(5);
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState<string | null>(null);
    const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

    if (!isOpen) return null;

    const calculateDiscount = (): number => {
        if (discountType === 'percent') {
            return (subtotal * percentValue) / 100;
        } else if (discountType === 'amount') {
            return Math.min(amountValue, subtotal);
        }
        return 0;
    };

    const handleValidatePromo = () => {
        const code = promoCode.toUpperCase().trim();
        const promo = PROMO_CODES[code];

        if (promo) {
            setPromoError(null);
            setPromoSuccess(promo.description);

            const discountValue = promo.type === 'percent'
                ? (subtotal * promo.discount) / 100
                : promo.discount;

            onApplyDiscount({
                type: 'promo',
                value: discountValue,
                code: code,
                description: promo.description
            });
            onClose();
        } else {
            setPromoError('Code promo invalide ou expiré');
            setPromoSuccess(null);
        }
    };

    const handleApplyDiscount = () => {
        const discountValue = calculateDiscount();
        onApplyDiscount({
            type: discountType === 'percent' ? 'percent' : 'amount',
            value: discountValue,
            description: discountType === 'percent'
                ? `Remise ${percentValue}%`
                : `Remise ${amountValue}€`
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0A0A0B]/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white">Appliquer une Remise</h1>
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                                Sous-total: {subtotal.toFixed(2)}€
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Discount Type Selector */}
                <div className="p-4 border-b border-[#E9ECEF] bg-[#F8F9FA]">
                    <div className="flex gap-2">
                        {[
                            { id: 'percent', label: 'Pourcentage', icon: Percent },
                            { id: 'amount', label: 'Montant', icon: Gift },
                            { id: 'promo', label: 'Code Promo', icon: Ticket }
                        ].map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setDiscountType(type.id as any)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all",
                                    discountType === type.id
                                        ? "bg-[#FF6B35] text-white shadow-lg"
                                        : "bg-white text-[#6C757D] hover:bg-[#E9ECEF]"
                                )}
                            >
                                <type.icon className="w-4 h-4" />
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Discount Content */}
                <div className="p-6">
                    {discountType === 'percent' && (
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-[#1A1A1A]">Remise en pourcentage</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[5, 10, 15, 20, 25, 30, 50].map((pct) => (
                                    <button
                                        key={pct}
                                        onClick={() => setPercentValue(pct)}
                                        className={cn(
                                            "py-3 rounded-xl font-black text-sm transition-all",
                                            percentValue === pct
                                                ? "bg-[#FF6B35] text-white shadow-lg"
                                                : "bg-[#F8F9FA] text-[#1A1A1A] hover:bg-[#E9ECEF]"
                                        )}
                                    >
                                        {pct}%
                                    </button>
                                ))}
                                <input
                                    type="number"
                                    value={percentValue}
                                    onChange={(e) => setPercentValue(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                    className="py-3 rounded-xl font-black text-sm text-center bg-[#F8F9FA] border-2 border-[#E9ECEF] focus:border-[#FF6B35] outline-none"
                                    placeholder="%"
                                />
                            </div>
                            <div className="p-4 bg-[#FFF4E6] rounded-xl text-center">
                                <span className="text-sm text-[#CC5500]">Réduction de </span>
                                <span className="text-xl font-black text-[#FF6B35]">{calculateDiscount().toFixed(2)}€</span>
                            </div>
                        </div>
                    )}

                    {discountType === 'amount' && (
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-[#1A1A1A]">Montant de la remise</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[2, 5, 10, 15, 20, 25, 50].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setAmountValue(amt)}
                                        className={cn(
                                            "py-3 rounded-xl font-black text-sm transition-all",
                                            amountValue === amt
                                                ? "bg-[#FF6B35] text-white shadow-lg"
                                                : "bg-[#F8F9FA] text-[#1A1A1A] hover:bg-[#E9ECEF]"
                                        )}
                                    >
                                        {amt}€
                                    </button>
                                ))}
                                <input
                                    type="number"
                                    value={amountValue}
                                    onChange={(e) => setAmountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                                    className="py-3 rounded-xl font-black text-sm text-center bg-[#F8F9FA] border-2 border-[#E9ECEF] focus:border-[#FF6B35] outline-none"
                                    placeholder="€"
                                />
                            </div>
                            <div className="p-4 bg-[#FFF4E6] rounded-xl text-center">
                                <span className="text-sm text-[#CC5500]">Réduction de </span>
                                <span className="text-xl font-black text-[#FF6B35]">{calculateDiscount().toFixed(2)}€</span>
                            </div>
                        </div>
                    )}

                    {discountType === 'promo' && (
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-[#1A1A1A]">Entrez le code promo</label>
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => {
                                    setPromoCode(e.target.value.toUpperCase());
                                    setPromoError(null);
                                    setPromoSuccess(null);
                                }}
                                placeholder="Ex: WELCOME10"
                                className="w-full py-4 px-4 rounded-xl font-bold text-lg text-center bg-[#F8F9FA] border-2 border-[#E9ECEF] focus:border-[#FF6B35] outline-none uppercase tracking-widest"
                            />

                            {promoError && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm font-bold">{promoError}</span>
                                </div>
                            )}

                            {promoSuccess && (
                                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl text-green-600">
                                    <Check className="w-4 h-4" />
                                    <span className="text-sm font-bold">{promoSuccess}</span>
                                </div>
                            )}

                            <div className="text-xs text-[#ADB5BD] text-center">
                                Codes valides: WELCOME10, SUMMER20, FIDELITE, VIP50
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-[#F8F9FA] border-t border-[#E9ECEF] flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl">
                        Annuler
                    </Button>
                    <Button
                        onClick={discountType === 'promo' ? handleValidatePromo : handleApplyDiscount}
                        disabled={discountType === 'promo' && !promoCode.trim()}
                        className="flex-1 h-12 rounded-xl bg-[#FF6B35] hover:bg-[#E55A25] text-white"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Appliquer
                    </Button>
                </div>
            </div>
        </div>
    );
}
