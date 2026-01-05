"use client";

import { useState } from "react";
import { PRODUCTS } from "@/lib/mock-data";
import { Product, Option } from "@/types";
import { cn } from "@/lib/utils";
import { ProductDetailsDialog } from "@/components/pos/ProductDetailsDialog";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import Image from "next/image";

interface ProductGridProps {
    categoryFilter: string;
    onAddToCart: (product: Product, quantity: number, selectedOptions: Record<string, Option[]>) => void;
}

export function ProductGrid({ categoryFilter, onAddToCart }: ProductGridProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = PRODUCTS.filter(p => {
        const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleProductClick = (product: Product) => {
        if (product.optionGroups && product.optionGroups.length > 0) {
            setSelectedProduct(product);
            setIsDialogOpen(true);
        } else {
            onAddToCart(product, 1, {});
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-bg-primary">
            {/* Top Toolbar (Filter Chips + Search) */}
            <div className="px-10 py-6 flex items-center justify-between gap-8 bg-white border-b border-border">
                <div className="flex items-center gap-3">
                    <button className="h-9 px-5 rounded-full bg-accent text-white text-[11px] font-bold uppercase tracking-wider">
                        Tout
                    </button>
                    <button className="h-9 px-5 rounded-full bg-white border border-border text-text-muted text-[11px] font-bold uppercase tracking-wider hover:bg-bg-tertiary hover:text-text-primary transition-all">
                        Populaires
                    </button>
                    <button className="h-9 px-5 rounded-full bg-white border border-border text-text-muted text-[11px] font-bold uppercase tracking-wider hover:bg-bg-tertiary hover:text-text-primary transition-all">
                        Nouveautés
                    </button>
                    <button className="p-2 text-text-muted hover:text-text-primary">
                        <SlidersHorizontal strokeWidth={1.5} className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative flex-1 max-w-md">
                    <Search strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Rechercher un plat..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-elegant pl-11"
                    />
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 p-10 overflow-y-auto elegant-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className="group cursor-pointer bg-white rounded-xl border border-border overflow-hidden transition-all duration-500 hover:border-accent hover:shadow-xl active:scale-[0.98] flex flex-col h-full"
                        >
                            {/* Product Image Holder */}
                            <div className="h-56 bg-bg-tertiary relative overflow-hidden">
                                {product.image ? (
                                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                                        <img
                                            src={`/images/${product.image}.png`}
                                            alt={product.name}
                                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn("absolute inset-0 flex items-center justify-center opacity-40 transition-colors duration-500", product.color)}>
                                        <Plus strokeWidth={1} className="w-12 h-12 text-white opacity-20 group-hover:opacity-40 transition-all" />
                                    </div>
                                )}

                                <div className="absolute top-4 right-4 h-8 px-4 rounded-lg bg-white/95 backdrop-blur-md shadow-sm border border-border flex items-center justify-center">
                                    <span className="text-[13px] font-mono font-medium text-text-primary">{product.price.toFixed(2)}€</span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-lg font-serif font-semibold text-text-primary mb-1.5 group-hover:text-accent transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-[12px] text-text-secondary leading-relaxed flex-1 italic opacity-80">
                                    {product.description || "Une spécialité maison préparée avec des ingrédients frais de saison."}
                                </p>

                                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-2 h-2 rounded-full border border-border" />
                                        ))}
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted group-hover:bg-accent group-hover:text-white transition-all transform group-hover:rotate-90">
                                        <Plus strokeWidth={1.5} className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ProductDetailsDialog
                product={selectedProduct}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onAddToCart={onAddToCart}
            />
        </div>
    );
}
