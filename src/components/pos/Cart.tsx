"use client";

import { useMemo } from "react";
import { Trash2, Minus, Plus, ChefHat, CreditCard, Users, Clock, MoreVertical, Split, Zap, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { usePageSetting } from "@/components/settings/ContextualSettings";
import { useLanguage } from "@/context/LanguageContext";
import { useIsMobile } from "@/hooks";

interface CartItem {
    cartId: string;
    productId: string;
    categoryId: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
    modifiers?: string[];
}

interface CartProps {
    items: CartItem[];
    onUpdateQuantity: (cartId: string, delta: number) => void;
    onClearCart: () => void;
    onCheckout: () => void;
    onSendToKitchen: () => void;
    onSplitBill: () => void;
    tableNumber?: string;
    guestCount?: number;
    showClose?: boolean;
    onClose?: () => void;
}

export function Cart({ items, onUpdateQuantity, onClearCart, onCheckout, onSendToKitchen, onSplitBill, tableNumber, guestCount, showClose, onClose }: CartProps) {
    const { t } = useLanguage();
    const isMobile = useIsMobile();
    const splitBillEnabled = usePageSetting('pos', 'split_bill_enabled', true);

    const { total, ht, tvaByRate } = useMemo(() => {
        let total = 0;
        let ht = 0;
        const rates: Record<number, number> = {};

        items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const rate = item.categoryId === 'cocktails' ? 0.20 : 0.10;
            const itemHt = itemTotal / (1 + rate);
            const itemTva = itemTotal - itemHt;
            ht += itemHt;
            rates[rate * 100] = (rates[rate * 100] || 0) + itemTva;
        });

        return { total, ht, tvaByRate: rates };
    }, [items]);

    return (
        <div className={cn(
            "flex flex-col h-full bg-bg-secondary transition-colors duration-500",
            !isMobile ? "border-l border-border w-[400px]" : "w-full"
        )}>
            {/* Cart Header */}
            <div className="p-6 lg:p-8 border-b border-border flex items-center justify-between bg-white/50 dark:bg-bg-secondary/50 backdrop-blur-md">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-serif font-black text-text-primary tracking-tight leading-none italic">
                        {t('pos.table')} <span className="text-accent-gold not-italic">{tableNumber || '--'}</span>.
                    </h2>
                    <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">
                            <Users strokeWidth={1.5} className="w-3.5 h-3.5 text-accent-gold" />
                            {guestCount || 0} {t('common.covers')}
                        </div>
                    </div>
                </div>
                {showClose && isMobile && (
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center">
                        <X className="w-5 h-5 text-text-muted" />
                    </button>
                )}
            </div>

            {/* Items List */}
            <ScrollArea className="flex-1 bg-bg-primary/20 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center min-h-[300px] text-center p-8"
                        >
                            <div className="w-16 h-16 rounded-[2rem] bg-bg-tertiary flex items-center justify-center mb-6">
                                <ChefHat strokeWidth={1} className="w-8 h-8 text-text-muted opacity-40" />
                            </div>
                            <h3 className="text-base font-serif font-black text-text-primary italic">{t('pos.cart.empty')}</h3>
                        </motion.div>
                    ) : (
                        <div className="p-6 lg:p-10 space-y-8">
                            {items.map((item, idx) => (
                                <motion.div
                                    key={item.cartId}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-xl bg-accent-gold/10 text-accent-gold flex items-center justify-center font-serif font-black italic text-xs">
                                                {item.quantity}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-[14px] font-black text-text-primary uppercase tracking-tight">{item.name}</h4>
                                                {(item.modifiers?.length || 0) > 0 && (
                                                    <p className="text-[8px] text-text-muted mt-1 uppercase font-black tracking-widest">{item.modifiers?.join(", ")}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-sm font-serif font-black italic">{(item.price * item.quantity).toFixed(2)}€</span>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pr-1">
                                        <button onClick={() => onUpdateQuantity(item.cartId, -1)} className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted">
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-6 text-center text-xs font-mono font-bold">{item.quantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.cartId, 1)} className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </ScrollArea>

            {/* Bottom Panel */}
            <div className="p-6 lg:p-10 border-t border-border/50 bg-white/50 dark:bg-black/20 backdrop-blur-3xl">
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-[10px] font-black text-text-muted uppercase tracking-widest">
                        <span>{t('pos.cart.subtotal')}</span>
                        <span className="font-mono text-sm">{ht.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-border/30">
                        <span className="text-xl font-serif font-black italic text-text-primary">Total</span>
                        <span className="text-4xl font-serif font-black text-accent-gold tracking-tighter">
                            {total.toFixed(2)}€
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={onSendToKitchen}
                        disabled={items.length === 0}
                        className="h-16 flex flex-col items-center justify-center gap-1.5 bg-bg-tertiary text-text-muted rounded-[2rem] disabled:opacity-30"
                    >
                        <ChefHat className="w-5 h-5" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">{t('pos.cart.kitchen')}</span>
                    </button>
                    <button
                        onClick={onCheckout}
                        disabled={items.length === 0}
                        className="h-16 flex flex-col items-center justify-center gap-1.5 bg-accent-gold text-white rounded-[2rem] shadow-xl shadow-accent-gold/20 disabled:opacity-30"
                    >
                        <CreditCard className="w-6 h-6" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">{t('pos.cart.checkout')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
