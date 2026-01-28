
"use client";

import { useDraggable } from "@dnd-kit/core";
import { GripVertical, Calendar, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { StockItem, StorageLocation } from "@/types";
import { STORAGE_TYPE_CONFIG } from "./StorageTypeConfig";

interface DraggableStockItemProps {
    item: StockItem;
    onMoveClick: () => void;
    isMoving: boolean;
    onCancelMove: () => void;
    onSelectLocation: (locationId: string) => void;
    otherLocations: StorageLocation[];
}

export function DraggableStockItem({ item, onMoveClick, isMoving, onCancelMove, onSelectLocation, otherLocations }: DraggableStockItemProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `stock-${item.id}`,
        data: { type: 'stock', item }
    });

    const getDlcStatus = (dlc: string) => {
        const today = new Date();
        const dlcDate = new Date(dlc);
        const daysUntil = Math.ceil((dlcDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntil < 0) return { label: 'Expiré', color: 'text-red-600 bg-red-50 border-red-200' };
        if (daysUntil === 0) return { label: "Aujourd'hui", color: 'text-orange-600 bg-orange-50 border-orange-200' };
        if (daysUntil <= 2) return { label: `J+${daysUntil}`, color: 'text-amber-600 bg-amber-50 border-amber-200' };
        return { label: `J+${daysUntil}`, color: 'text-green-600 bg-green-50 border-green-200' };
    };

    const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const dlcStatus = getDlcStatus(item.dlc);

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
    } : undefined;

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout
            className={cn(
                "p-4 rounded-2xl border-2 transition-all",
                isDragging
                    ? "opacity-50 border-dashed border-blue-400 bg-blue-50"
                    : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
            )}
        >
            <div className="flex items-start gap-3">
                {/* Drag handle */}
                <div
                    {...listeners}
                    {...attributes}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center cursor-grab active:cursor-grabbing hover:from-neutral-200 hover:to-neutral-300 transition-all flex-shrink-0"
                >
                    <GripVertical className="w-5 h-5 text-neutral-500" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-neutral-900 uppercase tracking-tight truncate">{item.ingredientName}</p>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-lg font-mono font-bold text-neutral-700">
                                    {item.quantity} {item.unit}
                                </span>
                                {item.batchNumber && (
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                                        Lot: {item.batchNumber}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border flex-shrink-0", dlcStatus.color)}>
                            {dlcStatus.label}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.receptionDate)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            DLC: {formatDate(item.dlc)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Move section */}
            <div className="mt-3 pt-3 border-t border-neutral-200">
                <AnimatePresence mode="wait">
                    {isMoving ? (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">Déplacer vers :</p>
                                <button onClick={onCancelMove} className="text-[10px] font-bold text-neutral-500 hover:text-neutral-700">
                                    Annuler
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                {otherLocations.map(loc => {
                                    const locConfig = STORAGE_TYPE_CONFIG[loc.type] || STORAGE_TYPE_CONFIG.other;
                                    const LocIcon = locConfig.icon;
                                    return (
                                        <button
                                            key={loc.id}
                                            onClick={() => onSelectLocation(loc.id)}
                                            className="flex items-center gap-2 p-2.5 bg-white border border-neutral-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                                        >
                                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", locConfig.bgColor)}>
                                                <LocIcon className="w-4 h-4" style={{ color: locConfig.color }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold text-neutral-900 truncate group-hover:text-blue-600">{loc.name}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={onMoveClick}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all w-full justify-center font-bold text-xs uppercase tracking-wider border border-blue-200"
                        >
                            <ArrowRight className="w-4 h-4" />
                            Déplacer
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
