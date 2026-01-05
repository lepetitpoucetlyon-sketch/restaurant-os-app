"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, X, Info, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info' | 'premium';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[1000] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                            className={cn(
                                "pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border min-w-[320px] backdrop-blur-xl",
                                toast.type === 'success' ? "bg-white/90 border-green-100" :
                                    toast.type === 'error' ? "bg-white/90 border-red-100" :
                                        toast.type === 'premium' ? "bg-[#1A1A1A]/95 border-neutral-800 text-white" :
                                            "bg-white/90 border-blue-100"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                toast.type === 'success' ? "bg-[#E6F9EF] text-[#00D764]" :
                                    toast.type === 'error' ? "bg-[#FEECEC] text-[#FF4D4D]" :
                                        toast.type === 'premium' ? "bg-[#00D764] text-white" :
                                            "bg-blue-50 text-blue-600"
                            )}>
                                {toast.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                                {toast.type === 'error' && <AlertCircle className="w-6 h-6" />}
                                {toast.type === 'premium' && <Sparkles className="w-6 h-6" />}
                                {toast.type === 'info' && <Info className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                                <p className={cn(
                                    "text-[13px] font-black tracking-tight",
                                    toast.type === 'premium' ? "text-white" : "text-[#1A1A1A]"
                                )}>
                                    {toast.message}
                                </p>
                            </div>
                            <button
                                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                                className="text-neutral-300 hover:text-neutral-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
}
