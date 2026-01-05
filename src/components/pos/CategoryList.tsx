"use client";

import { CATEGORIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Store, Pizza, Coffee, GlassWater, Beef, UtensilsCrossed, Star, Settings } from "lucide-react";

interface CategoryListProps {
    selectedCategory: string;
    onSelectCategory: (id: string) => void;
}

const ICON_MAP: Record<string, any> = {
    all: Star,
    pizzas: Pizza,
    pastas: UtensilsCrossed,
    boissons: GlassWater,
    entrees: UtensilsCrossed,
    plats: Beef,
    desserts: Coffee
};

export function CategoryList({ selectedCategory, onSelectCategory }: CategoryListProps) {
    return (
        <div className="w-[140px] bg-white border-r border-border flex flex-col h-full overflow-y-auto elegant-scrollbar">
            <div className="p-3 space-y-1">
                <button
                    onClick={() => onSelectCategory("all")}
                    className={cn(
                        "w-full flex flex-col items-center gap-2.5 p-4 rounded-xl transition-all group",
                        selectedCategory === "all"
                            ? "bg-bg-tertiary text-text-primary"
                            : "text-text-muted hover:bg-bg-tertiary/50 hover:text-text-secondary"
                    )}
                >
                    <Star strokeWidth={1.5} className={cn("w-5 h-5", selectedCategory === "all" ? "text-accent" : "")} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Favoris</span>
                </button>

                {CATEGORIES.map((cat) => {
                    const Icon = ICON_MAP[cat.id] || UtensilsCrossed;
                    const isActive = selectedCategory === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            className={cn(
                                "w-full flex flex-col items-center gap-2.5 p-4 rounded-xl transition-all group",
                                isActive
                                    ? "bg-bg-tertiary text-text-primary"
                                    : "text-text-muted hover:bg-bg-tertiary/50 hover:text-text-secondary"
                            )}
                        >
                            <Icon strokeWidth={1.5} className={cn("w-5 h-5 transition-transform duration-300", isActive ? "text-accent scale-110" : "group-hover:scale-105")} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-center">{cat.name}</span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-auto p-3 mb-4">
                <button className="w-full flex flex-col items-center gap-2.5 p-4 rounded-xl text-text-muted hover:bg-bg-tertiary/50 hover:text-text-secondary transition-all">
                    <Settings strokeWidth={1.5} className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Réglages</span>
                </button>
            </div>
        </div>
    );
}
