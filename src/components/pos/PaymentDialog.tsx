"use client";

import { useState } from "react";
import { CreditCard, Banknote, Smartphone, CheckCircle, Loader2, Sparkles, Receipt, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaymentDialogProps {
    isOpen: boolean;
    total: number;
    onClose: () => void;
    onPaymentComplete: () => void;
}

type PaymentMethod = "card" | "cash" | "mobile";

export function PaymentDialog({ isOpen, total, onClose, onPaymentComplete }: PaymentDialogProps) {
    const [method, setMethod] = useState<PaymentMethod | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleProcessPayment = async () => {
        setIsProcessing(true);
        // Cinematic delay for "Premium" feel
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        setIsSuccess(true);

        setTimeout(() => {
            onPaymentComplete();
            setIsSuccess(false);
            setMethod(null);
            onClose();
        }, 2500);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0A0A0B]/90 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-500 relative">

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D764]/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00D764]/5 rounded-full blur-3xl -ml-16 -mb-16" />

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center p-16 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="relative">
                            <div className="w-24 h-24 bg-[#E6F9EF] rounded-full flex items-center justify-center text-[#00D764] shadow-xl shadow-[#00D764]/10">
                                <CheckCircle className="w-12 h-12" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#00D764] rounded-lg flex items-center justify-center text-white shadow-lg animate-bounce">
                                <Sparkles className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tighter">Transaction Validée</h2>
                            <p className="text-[#ADB5BD] font-medium mt-2">Le reçu a été envoyé au client.</p>
                        </div>
                        <div className="w-full h-px bg-neutral-50" />
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#00D764] tracking-widest">
                            <Receipt className="w-3 h-3" />
                            Impression en cours...
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="relative p-10 pb-6 border-b border-neutral-50 flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tighter">Encaissement</h1>
                                <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest mt-1">Finalisation de la commande</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-neutral-50 rounded-2xl flex items-center justify-center text-[#CED4DA] hover:text-[#1A1A1A] transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Order Summary Ribbon */}
                        <div className="bg-[#1A1A1A] px-10 py-6 flex items-center justify-between text-white">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-widest">Total Net à Payer</span>
                                <span className="text-3xl font-black text-[#00D764] tracking-tighter">{total.toFixed(2)}€</span>
                            </div>
                            <div className="h-12 w-px bg-white/10" />
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-widest">TVA (10%)</span>
                                <span className="text-lg font-black ">{(total * 0.1).toFixed(2)}€</span>
                            </div>
                        </div>

                        {/* Payment Selection */}
                        <div className="p-10 space-y-10 bg-[#F8F9FA]/50">
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { id: 'card', name: 'Carte', icon: CreditCard },
                                    { id: 'cash', name: 'Espèces', icon: Banknote },
                                    { id: 'mobile', name: 'Apple Pay', icon: Smartphone }
                                ].map((meth) => (
                                    <button
                                        key={meth.id}
                                        onClick={() => setMethod(meth.id as PaymentMethod)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-4 p-5 rounded-[2.5rem] border-2 transition-all duration-500 group relative overflow-hidden",
                                            method === meth.id
                                                ? "border-[#00D764] bg-white shadow-2xl shadow-[#00D764]/10 -translate-y-2"
                                                : "border-white bg-white/50 hover:bg-white hover:border-neutral-100"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                            method === meth.id ? "bg-[#00D764] text-white shadow-lg" : "bg-neutral-50 text-[#ADB5BD] group-hover:bg-[#1A1A1A] group-hover:text-white"
                                        )}>
                                            <meth.icon className="w-6 h-6" />
                                        </div>
                                        <span className={cn("font-black text-[11px] uppercase tracking-wider transition-colors", method === meth.id ? "text-[#1A1A1A]" : "text-[#ADB5BD]")}>
                                            {meth.name}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Execution Button */}
                            <div className="pt-6">
                                <button
                                    disabled={!method || isProcessing}
                                    onClick={handleProcessPayment}
                                    className={cn(
                                        "w-full h-16 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 relative overflow-hidden shadow-2xl active:scale-95 group",
                                        method
                                            ? "bg-[#1A1A1A] text-white shadow-black/20 hover:bg-black"
                                            : "bg-neutral-100 text-[#ADB5BD] cursor-not-allowed"
                                    )}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin text-[#00D764]" />
                                            <span className="animate-pulse">Cryptage SSL...</span>
                                        </>
                                    ) : (
                                        <>
                                            Procéder au Paiement
                                            <ArrowRight className="w-5 h-5 text-[#00D764] group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <p className="text-[10px] text-[#CED4DA] font-bold text-center mt-6 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                    <Sparkles className="w-3 h-3" />
                                    Transaction Sécurisée par RestaurantOS
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
