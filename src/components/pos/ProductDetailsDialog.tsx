"use client";

import { useState } from "react";
import { X, Check, Minus, Plus, ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Product, OptionGroup, Option } from "@/types";

interface ProductDetailsDialogProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product, quantity: number, selectedOptions: Record<string, Option[]>) => void;
}

export function ProductDetailsDialog({ product, isOpen, onClose, onAddToCart }: ProductDetailsDialogProps) {
    const [quantity, setQuantity] = useState(1);
    const [selections, setSelections] = useState<Record<string, string[]>>({});
    const [lastProductId, setLastProductId] = useState<string | null>(null);

    if (isOpen && product && product.id !== lastProductId) {
        setLastProductId(product.id);
        setQuantity(1);
        const initialSelections: Record<string, string[]> = {};
        product.optionGroups?.forEach(group => {
            const defaults = group.options.filter(opt => opt.isDefault).map(opt => opt.id);
            if (defaults.length > 0) {
                initialSelections[group.id] = defaults;
            }
        });
        setSelections(initialSelections);
    }

    if (!isOpen || !product) return null;

    const handleOptionToggle = (group: OptionGroup, optionId: string) => {
        setSelections(prev => {
            const current = prev[group.id] || [];
            if (group.type === 'single') {
                return { ...prev, [group.id]: [optionId] };
            } else {
                const isSelected = current.includes(optionId);
                let newSelection;
                if (isSelected) {
                    newSelection = current.filter(id => id !== optionId);
                } else {
                    if (group.maxSelections && current.length >= group.maxSelections) {
                        return prev;
                    }
                    newSelection = [...current, optionId];
                }
                return { ...prev, [group.id]: newSelection };
            }
        });
    };

    const calculateTotal = () => {
        let total = product.price;
        product.optionGroups?.forEach(group => {
            const selectedIds = selections[group.id] || [];
            selectedIds.forEach(id => {
                const option = group.options.find(opt => opt.id === id);
                if (option) {
                    total += option.priceModifier;
                }
            });
        });
        return total * quantity;
    };

    const isValid = () => {
        if (!product.optionGroups) return true;
        return product.optionGroups.every(group => {
            if (group.required) {
                const selected = selections[group.id];
                return selected && selected.length >= (group.minSelections || 1);
            }
            return true;
        });
    };

    const handleAdd = () => {
        const selectedOptionsMap: Record<string, Option[]> = {};
        product.optionGroups?.forEach(group => {
            const selectedIds = selections[group.id] || [];
            if (selectedIds.length > 0) {
                selectedOptionsMap[group.name] = group.options.filter(opt => selectedIds.includes(opt.id));
            }
        });
        onAddToCart(product, quantity, selectedOptionsMap);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A0A0B]/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500 scale-100">

                {/* Aesthetic Backdrop + Header */}
                <div className="relative h-48 bg-[#1A1A1A] overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 opacity-20">
                        {product.image && (
                            <img
                                src={`/images/${product.image}.png`}
                                alt={product.name}
                                className="w-full h-full object-cover blur-sm scale-110"
                                onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                            />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent" />

                    <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-[#00D764] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                    Populaire
                                </span>
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tighter">{product.name}</h2>
                            <p className="text-[#ADB5BD] text-sm font-medium mt-1 max-w-md line-clamp-1">{product.description || "Élaboré avec passion par notre brigade."}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-white">{product.price.toFixed(2)}€</span>
                            <p className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-widest mt-1">Prix de Base</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all shadow-xl"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <ScrollArea className="flex-1 p-8 bg-neutral-50/50">
                    <div className="space-y-10">
                        {product.optionGroups?.map(group => (
                            <div key={group.id} className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider">
                                            {group.name}
                                        </h3>
                                        {group.required && (
                                            <span className="text-[9px] font-black bg-[#E6F9EF] text-[#00D764] px-2 py-0.5 rounded-full uppercase">Recommandé</span>
                                        )}
                                    </div>
                                    <span className="text-[11px] font-bold text-[#ADB5BD] uppercase">
                                        {group.type === 'single' ? "Choix unique" : `Max ${group.maxSelections || '∞'}`}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {group.options.map(option => {
                                        const isSelected = (selections[group.id] || []).includes(option.id);
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => handleOptionToggle(group, option.id)}
                                                className={cn(
                                                    "group relative flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all duration-300",
                                                    isSelected
                                                        ? "border-[#00D764] bg-white shadow-xl shadow-[#00D764]/5 translate-y-[-2px]"
                                                        : "border-neutral-100 bg-white hover:border-neutral-200"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                                                        isSelected
                                                            ? "bg-[#00D764] border-[#00D764] rotate-0 scale-100"
                                                            : "border-neutral-200 bg-neutral-50 rotate-[-12deg] scale-90 group-hover:rotate-0"
                                                    )}>
                                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                                    </div>
                                                    <span className={cn("text-[14px] font-black transition-colors", isSelected ? "text-[#1A1A1A]" : "text-[#495057]")}>
                                                        {option.name}
                                                    </span>
                                                </div>
                                                {option.priceModifier > 0 && (
                                                    <span className={cn("text-xs font-black px-2 py-1 rounded-lg", isSelected ? "bg-[#E6F9EF] text-[#00D764]" : "text-[#ADB5BD]")}>
                                                        +{option.priceModifier.toFixed(2)}€
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Footer Controls */}
                <div className="p-8 border-t border-neutral-100 bg-white flex items-center justify-between gap-8">
                    <div className="flex items-center gap-6 bg-[#F8F9FA] p-2 rounded-[2rem] border border-neutral-50 shadow-inner">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm text-[#1A1A1A] hover:bg-neutral-50 active:scale-90 transition-all"
                        >
                            <Minus className="w-5 h-5" />
                        </button>
                        <span className="w-6 text-center font-black text-xl">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm text-[#1A1A1A] hover:bg-neutral-50 active:scale-90 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        disabled={!isValid()}
                        onClick={handleAdd}
                        className="flex-1 h-16 bg-[#1A1A1A] hover:bg-black disabled:bg-neutral-100 disabled:text-neutral-400 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-black/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                    >
                        <ShoppingCart className="w-5 h-5 text-[#00D764]" />
                        Valider &bull; {calculateTotal().toFixed(2)}€
                    </button>
                </div>
            </div>
        </div>
    );
}
