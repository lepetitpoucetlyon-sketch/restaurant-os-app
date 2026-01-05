"use client";

import { useTables } from "@/context/TablesContext";
import { cn } from "@/lib/utils";
import { Users, Clock, AlertCircle } from "lucide-react";

interface TableSelectorProps {
    onSelectTable: (tableId: string) => void;
}

export function TableSelector({ onSelectTable }: TableSelectorProps) {
    const { tables } = useTables();

    return (
        <div className="flex-1 p-8 overflow-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">Sélection de Table</h2>
                    <p className="text-sm text-[#ADB5BD] font-medium mt-1">Choisissez une table pour commencer une nouvelle commande</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-neutral-100 shadow-sm text-[12px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#00D764]" />
                        <span className="text-[#1A1A1A]">{tables.filter(t => t.status === 'free').length} Libres</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-neutral-100 shadow-sm text-[12px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#FF9900]" />
                        <span className="text-[#1A1A1A]">{tables.filter(t => ['seated', 'ordered', 'eating', 'paying'].includes(t.status)).length} Occupées</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {tables.map(table => (
                    <button
                        key={table.id}
                        onClick={() => onSelectTable(table.id)}
                        className={cn(
                            "group relative flex flex-col items-center justify-center min-h-[160px] rounded-[2rem] border-2 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl",
                            table.status === 'free'
                                ? "bg-white border-neutral-50 hover:border-[#00D764] hover:-translate-y-2"
                                : ['seated', 'ordered', 'eating', 'paying'].includes(table.status)
                                    ? "bg-white border-[#FFF7E6] shadow-inner"
                                    : "bg-neutral-50 border-neutral-100 opacity-60 grayscale cursor-not-allowed"
                        )}
                    >
                        {/* Background subtle number */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                            <span className="text-[120px] font-black">{table.number}</span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-3xl transition-all duration-500",
                                table.status === 'free'
                                    ? "bg-[#E6F9EF] text-[#00D764] group-hover:scale-110 shadow-lg shadow-[#00D764]/10"
                                    : "bg-[#FFF7E6] text-[#FF9900]"
                            )}>
                                {table.number}
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-[14px] font-extrabold text-[#1A1A1A] uppercase tracking-tighter">Table {table.number}</span>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Users className="w-3.5 h-3.5 text-[#ADB5BD]" />
                                    <span className="text-[12px] font-bold text-[#ADB5BD]">{table.seats} places</span>
                                </div>
                            </div>
                        </div>

                        {/* Status bar */}
                        <div className={cn(
                            "absolute bottom-0 left-0 right-0 h-1.5 transition-all duration-500",
                            table.status === 'free' ? "bg-transparent group-hover:bg-[#00D764]" :
                                ['seated', 'ordered', 'eating', 'paying'].includes(table.status) ? "bg-[#FF9900]" : "bg-neutral-300"
                        )} />

                        {['seated', 'ordered', 'eating', 'paying'].includes(table.status) && (
                            <div className="absolute top-4 right-4 animate-pulse">
                                <AlertCircle className="w-4 h-4 text-[#FF9900]" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div className="mt-12 p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm flex flex-wrap gap-8 items-center justify-center">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#00D764] shadow-[0_0_10px_rgba(0,215,100,0.5)]" />
                    <span className="text-xs font-bold text-[#495057] uppercase tracking-widest">Disponible / Prête</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#FF9900] shadow-[0_0_10px_rgba(255,153,0,0.5)]" />
                    <span className="text-xs font-bold text-[#495057] uppercase tracking-widest">Service en cours</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#FF4D4D] shadow-[0_0_10px_rgba(255,77,77,0.5)]" />
                    <span className="text-xs font-bold text-[#495057] uppercase tracking-widest">Réservée / VIP</span>
                </div>
                <div className="flex items-center gap-3 opacity-40">
                    <span className="w-3 h-3 rounded-full bg-neutral-400" />
                    <span className="text-xs font-bold text-[#495057] uppercase tracking-widest">Nettoyage requis</span>
                </div>
            </div>
        </div>
    );
}
