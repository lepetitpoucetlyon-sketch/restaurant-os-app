"use client";

import { useMemo } from "react";
import { Trash2, Minus, Plus, ChefHat, CreditCard, Users, Clock, MoreVertical, Split, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface CartProps {
    items: CartItem[];
    onUpdateQuantity: (cartId: string, delta: number) => void;
    onClearCart: () => void;
    onCheckout: () => void;
    onSendToKitchen: () => void;
    onSplitBill: () => void;
    tableNumber?: string;
    guestCount?: number;
}

export function Cart({ items, onUpdateQuantity, onClearCart, onCheckout, onSendToKitchen, onSplitBill, tableNumber, guestCount }: CartProps) {
    const total = useMemo(() => {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }, [items]);

    const tva = total * 0.10;
    const ht = total - tva;

    return (
        <div className="flex flex-col h-full bg-white border-l border-border w-[400px]">
            {/* Cart Header */}
            <div className="p-8 border-b border-border flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-semibold text-text-primary tracking-tight">Table {tableNumber || '--'}</h2>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">
                            <Users strokeWidth={1.5} className="w-3.5 h-3.5 text-accent" />
                            {guestCount || 0} couverts
                        </div>
                        <div className="w-1 h-1 rounded-full bg-border" />
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">
                            <Clock strokeWidth={1.5} className="w-3.5 h-3.5" />
                            12:30
                        </div>
                    </div>
                </div>
                <button className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-all">
                    <MoreVertical strokeWidth={1.5} className="w-5 h-5" />
                </button>
            </div>

            {/* Items List */}
            <ScrollArea className="flex-1 bg-bg-primary/50 elegant-scrollbar">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-12">
                        <div className="w-16 h-16 rounded-2xl bg-bg-tertiary border border-border flex items-center justify-center mb-6">
                            <ChefHat strokeWidth={1} className="w-8 h-8 text-text-muted opacity-40" />
                        </div>
                        <h3 className="text-base font-serif font-semibold text-text-primary">Panier vide</h3>
                        <p className="text-xs text-text-muted mt-2 max-w-[180px] leading-relaxed italic">Sélectionnez des articles pour commencer le service.</p>
                    </div>
                ) : (
                    <div className="p-8 space-y-5">
                        {items.map((item, idx) => (
                            <div key={item.cartId} className="group relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center font-mono text-[13px] font-medium text-text-primary">
                                            {item.quantity}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-[14px] font-semibold text-text-primary leading-tight truncate">{item.name}</h4>
                                            {item.modifiers?.length ? (
                                                <p className="text-[10px] text-text-muted mt-1.5 leading-relaxed">{item.modifiers.join(", ")}</p>
                                            ) : (
                                                <p className="text-[10px] text-text-muted/60 mt-1.5 italic">Options standards</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[14px] font-mono font-medium text-text-primary">
                                        {(item.price * item.quantity).toFixed(2)}€
                                    </span>
                                </div>

                                {item.notes && (
                                    <div className="ml-12 mt-2 px-3 py-1.5 bg-warning-soft/30 border-l-2 border-warning rounded text-[10px] text-warning-soft font-medium">
                                        Note: {item.notes}
                                    </div>
                                )}

                                <div className="ml-12 flex items-center justify-between mt-3 pt-3 border-t border-border opacity-0 group-hover:opacity-100 transition-all">
                                    <button className="text-[10px] font-bold text-text-muted hover:text-text-primary uppercase tracking-widest">Modifier</button>
                                    <div className="flex items-center gap-1 bg-bg-tertiary rounded-lg p-0.5">
                                        <button onClick={() => onUpdateQuantity(item.cartId, -1)} className="p-1 px-1.5 hover:bg-white hover:shadow-sm rounded text-text-muted hover:text-text-primary transition-all">
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-6 text-center text-[11px] font-mono leading-none">{item.quantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.cartId, 1)} className="p-1 px-1.5 hover:bg-white hover:shadow-sm rounded text-text-muted hover:text-text-primary transition-all">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Bottom Panel */}
            <div className="p-8 border-t border-border bg-white space-y-8">
                <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-[11px] font-bold text-text-muted uppercase tracking-[0.15em]">
                        <span>Base HT</span>
                        <span className="font-mono text-xs">{ht.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-bold text-text-muted uppercase tracking-[0.15em]">
                        <span>Taxe (10.0%)</span>
                        <span className="font-mono text-xs">{tva.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between items-center pt-5 border-t border-border">
                        <span className="text-lg font-serif font-semibold text-text-primary">Total HT</span>
                        <span className="text-3xl font-serif font-semibold text-accent">{total.toFixed(2)}€</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={onSendToKitchen}
                        disabled={items.length === 0}
                        className="h-16 flex flex-col items-center justify-center gap-1.5 bg-bg-tertiary rounded-xl hover:bg-neutral-200 transition-all border border-border disabled:opacity-30 group"
                    >
                        <ChefHat strokeWidth={1.5} className="w-5 h-5 text-text-primary group-hover:rotate-12 transition-transform" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Envoi</span>
                    </button>
                    <button
                        onClick={onSplitBill}
                        disabled={items.length === 0}
                        className="h-16 flex flex-col items-center justify-center gap-1.5 bg-bg-tertiary rounded-xl hover:bg-neutral-200 transition-all border border-border disabled:opacity-30 group"
                    >
                        <Split strokeWidth={1.5} className="w-5 h-5 text-text-primary" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Diviser</span>
                    </button>
                    <button
                        onClick={onCheckout}
                        disabled={items.length === 0}
                        className="col-span-1 h-16 flex flex-col items-center justify-center gap-1.5 bg-accent text-white rounded-xl hover:bg-black transition-all shadow-xl shadow-accent/10 disabled:opacity-30 group"
                    >
                        <CreditCard strokeWidth={1.5} className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Payer</span>
                    </button>
                </div>

                <div className="bg-bg-tertiary p-4 rounded-xl flex items-center gap-4 border border-border/50">
                    <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center shrink-0">
                        <Sparkles strokeWidth={1.5} className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed italic">
                        Tip: Appuyez sur <span className="font-bold text-text-primary not-italic">CMD + K</span> pour accéder aux raccourcis d&apos;encaissement.
                    </p>
                </div>
            </div>
        </div>
    );
}
