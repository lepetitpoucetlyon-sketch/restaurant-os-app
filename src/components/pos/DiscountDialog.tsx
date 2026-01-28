"use client";

import { useState } from "react";
import { X, Percent, Tag, Gift, Ticket, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            className="p-0 border-none bg-transparent"
            showClose={false}
            noPadding
        >
            <div className="relative bg-black border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] w-full overflow-hidden group/modal">
                {/* Visual Accent Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 blur-[100px] pointer-events-none" />

                {/* Header */}
                <div className="p-10 border-b border-white/5 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[22px] bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20 shadow-glow">
                                <Tag className="w-8 h-8 text-accent-gold" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-serif font-black text-white italic tracking-tight">Protocole de Remise</h2>
                                <p className="text-[10px] font-black text-accent-gold/60 uppercase tracking-[0.4em] mt-2">Ajustement de la Valeur Transactionnelle</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 hover:rotate-90"
                        >
                            <X className="w-5 h-5 text-white/40" />
                        </button>
                    </div>
                </div>

                {/* Subtotal Display */}
                <div className="px-10 py-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">SOUS-TOTAL ACTUEL</span>
                    <span className="text-2xl font-serif font-black text-white italic">{subtotal.toFixed(2)}€</span>
                </div>

                {/* Content */}
                <div className="p-10 space-y-10 relative z-10 overflow-y-auto max-h-[60vh] elegant-scrollbar">
                    {/* Discount Type Selector */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { id: 'percent', label: 'POURCENTAGE', icon: Percent },
                            { id: 'amount', label: 'MONTANT FIXE', icon: Gift },
                            { id: 'promo', label: 'CODE PROMO', icon: Ticket }
                        ].map((type) => (
                            <button
                                key={type.id}
                                onClick={() => {
                                    setDiscountType(type.id as any);
                                    setPromoError(null);
                                    setPromoSuccess(null);
                                }}
                                className={cn(
                                    "flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 transition-all duration-500",
                                    discountType === type.id
                                        ? "bg-accent-gold/10 border-accent-gold text-accent-gold shadow-glow"
                                        : "bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                                )}
                            >
                                <type.icon className={cn("w-6 h-6 transition-transform duration-500", discountType === type.id ? "scale-110" : "opacity-40")} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{type.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-8">
                        {discountType === 'percent' && (
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-accent-gold uppercase tracking-[0.4em] px-2 block">VALEUR DU POURCENTAGE</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {[5, 10, 15, 20, 25, 30, 50].map((pct) => (
                                        <button
                                            key={pct}
                                            onClick={() => setPercentValue(pct)}
                                            className={cn(
                                                "h-14 rounded-2xl font-black text-sm transition-all border-2",
                                                percentValue === pct
                                                    ? "bg-accent-gold text-black border-accent-gold shadow-glow"
                                                    : "bg-white/5 text-white/60 border-transparent hover:border-white/20"
                                            )}
                                        >
                                            {pct}%
                                        </button>
                                    ))}
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={percentValue}
                                            onChange={(e) => setPercentValue(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                            className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl text-center font-black text-white focus:outline-none focus:border-accent-gold/50 transition-all"
                                            placeholder="%"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {discountType === 'amount' && (
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-accent-gold uppercase tracking-[0.4em] px-2 block">MONTANT DE LA RÉDUCTION</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {[2, 5, 10, 15, 20, 25, 50].map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => setAmountValue(amt)}
                                            className={cn(
                                                "h-14 rounded-2xl font-black text-sm transition-all border-2",
                                                amountValue === amt
                                                    ? "bg-accent-gold text-black border-accent-gold shadow-glow"
                                                    : "bg-white/5 text-white/60 border-transparent hover:border-white/20"
                                            )}
                                        >
                                            {amt}€
                                        </button>
                                    ))}
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={amountValue}
                                            onChange={(e) => setAmountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                                            className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl text-center font-black text-white focus:outline-none focus:border-accent-gold/50 transition-all"
                                            placeholder="€"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {discountType === 'promo' && (
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-accent-gold uppercase tracking-[0.4em] px-2 block">CHAMP D&apos;AUTHENTIFICATION CODE</label>
                                <div className="relative group/input">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => {
                                            setPromoCode(e.target.value.toUpperCase());
                                            setPromoError(null);
                                            setPromoSuccess(null);
                                        }}
                                        placeholder="ENTREZ LE CODE ARCHIVE..."
                                        className="w-full h-20 bg-white/5 border-2 border-white/10 rounded-[2rem] px-10 font-serif font-black text-2xl text-white text-center focus:outline-none focus:border-accent-gold focus:bg-white/10 transition-all uppercase tracking-[0.2em] placeholder:text-white/10"
                                    />
                                    <Ticket className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10 group-focus-within/input:text-accent-gold transition-colors" />
                                </div>

                                <AnimatePresence mode="wait">
                                    {promoError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500"
                                        >
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{promoError}</span>
                                        </motion.div>
                                    )}

                                    {promoSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-3 p-4 bg-accent-gold/10 border border-accent-gold/20 rounded-2xl text-accent-gold"
                                        >
                                            <Check className="w-5 h-5 shrink-0" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{promoSuccess}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex justify-center gap-4">
                                    {['WELCOME10', 'SUMMER20', 'FIDELITE', 'VIP50'].map(code => (
                                        <button
                                            key={code}
                                            onClick={() => setPromoCode(code)}
                                            className="text-[9px] font-black text-white/30 hover:text-accent-gold transition-colors uppercase tracking-[0.2em]"
                                        >
                                            {code}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Calculated Impact Card */}
                        {(discountType === 'percent' || discountType === 'amount') && (
                            <div className="p-8 bg-accent-gold/5 border border-accent-gold/10 rounded-[2.5rem] flex items-center justify-between relative overflow-hidden group/card">
                                <div className="relative z-10">
                                    <p className="text-[9px] font-black text-accent-gold uppercase tracking-[0.3em] mb-1 leading-none">IMPACT ESTIMÉ</p>
                                    <h3 className="text-3xl font-serif font-black text-white italic tracking-tight">
                                        -{calculateDiscount().toFixed(2)}€
                                    </h3>
                                </div>
                                <div className="relative z-10 text-right">
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-1 leading-none">NOUVEAU TOTAL</p>
                                    <p className="text-xl font-serif font-black text-white italic">
                                        {(subtotal - calculateDiscount()).toFixed(2)}€
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:animate-[shimmer_2s_infinite] pointer-events-none" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-10 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-6 relative z-10">
                    <button
                        onClick={onClose}
                        className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all"
                    >
                        ABANDONNER
                    </button>
                    <button
                        onClick={discountType === 'promo' ? handleValidatePromo : handleApplyDiscount}
                        disabled={discountType === 'promo' && !promoCode.trim()}
                        className={cn(
                            "flex items-center gap-4 px-12 py-5 rounded-[22px] text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 relative overflow-hidden group/btn shadow-glow",
                            (discountType !== 'promo' || promoCode.trim())
                                ? "bg-accent-gold text-black hover:bg-white"
                                : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                        )}
                    >
                        <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {discountType === 'promo' ? "VALIDER LE CODE" : "SCELLER LA REMISE"}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                    </button>
                </div>
            </div>
        </Modal>
    );

}
