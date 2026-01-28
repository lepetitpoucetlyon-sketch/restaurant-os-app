import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Product, Option } from "@/types";
import { PRODUCTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ProductDetailsDialog } from "./ProductDetailsDialog";
import { usePageSetting } from "@/components/settings/ContextualSettings";
import { useLanguage } from "@/context/LanguageContext";

interface ProductGridProps {
    categoryFilter: string;
    onAddToCart: (product: Product, quantity: number, options: Record<string, Option[]>) => void;
}

export function ProductGrid({ categoryFilter, onAddToCart }: ProductGridProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { t } = useLanguage();

    // Read show_images setting from context (defaults to true)
    const showImages = usePageSetting('pos', 'show_images', true);
    const buttonSize = usePageSetting<'small' | 'medium' | 'large'>('pos', 'button_size', 'medium');

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
        <div className="flex-1 flex flex-col h-full bg-bg-primary transition-colors duration-700 overflow-hidden relative">
            {/* Visual Background Glow */}
            <div className="absolute top-1/4 right-0 w-[40%] h-[40%] rounded-full bg-accent-gold/5 blur-[120px] pointer-events-none" />

            {/* Top Toolbar - Precision Nav Tier */}
            <div className="px-8 md:px-14 py-8 md:py-8 flex flex-col md:flex-row items-stretch md:items-center justify-center gap-8 md:gap-14 transition-all duration-700 relative z-20">
                <div className="relative flex-1 md:max-w-2xl group">
                    <Search strokeWidth={1} className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-hover:text-accent-gold transition-all duration-500" />
                    <input
                        type="text"
                        placeholder={t('pos.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-white/5 border border-border/50 rounded-[28px] md:rounded-[32px] pl-16 pr-8 py-4 md:py-5 text-base text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent-gold/50 focus:ring-4 focus:ring-accent-gold/5 transition-all duration-700 font-serif italic shadow-premium hover:border-accent-gold/30"
                    />
                </div>
            </div>

            {/* Product Grid - Exhibition Deck */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto scrollbar-hide relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-10 md:gap-14">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={product.id}
                                onClick={() => handleProductClick(product)}
                                className="group cursor-pointer bg-white dark:bg-white/[0.02] rounded-[42px] border border-border/40 overflow-hidden transition-all duration-700 hover:border-accent-gold/40 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] active:scale-[0.98] flex flex-col h-full backdrop-blur-xl relative"
                            >
                                {/* Categorical Glow Aura */}
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* Product Image Holder - Museum Frame */}
                                <div className="h-60 md:h-72 bg-bg-tertiary relative overflow-hidden m-4 rounded-[32px] border border-black/5 dark:border-white/5">
                                    {showImages && product.image ? (
                                        <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                                            <img
                                                src={`/images/${product.image}.png`}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className={cn("absolute inset-0 flex items-center justify-center opacity-40 bg-gradient-to-br from-bg-tertiary to-border")}>
                                            <Plus strokeWidth={0.5} className="w-20 h-20 text-text-muted opacity-20" />
                                        </div>
                                    )}

                                    {/* Glass Price Badge */}
                                    <div className="absolute top-4 right-4 h-11 px-6 rounded-full bg-white/10 dark:bg-black/40 backdrop-blur-2xl border border-white/20 shadow-premium flex items-center justify-center transition-all duration-700 group-hover:bg-accent-gold group-hover:text-white group-hover:scale-105 z-20">
                                        <span className="text-[15px] font-sans font-black tracking-tight">{product.price.toFixed(2)}€</span>
                                    </div>

                                    {/* Aesthetic Spotlight Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>

                                <div className="px-8 pb-8 flex flex-col flex-1">

                                    <h3 className="text-2xl md:text-2xl font-serif font-black text-text-primary mb-3 group-hover:text-accent-gold transition-colors leading-tight italic decoration-accent-gold/20 decoration-2 underline-offset-8 group-hover:underline">
                                        {product.name}
                                    </h3>

                                    <p className="text-[12px] md:text-[13px] text-text-muted/80 leading-relaxed flex-1 font-medium font-sans mb-8">
                                        {product.description || t('pos.fallback_description')}
                                    </p>

                                    <div className="flex items-center justify-between border-t border-border/30 pt-6">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-black bg-bg-tertiary flex items-center justify-center overflow-hidden">
                                                    <div className="w-full h-full bg-accent-gold/10" />
                                                </div>
                                            ))}
                                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-black bg-accent-gold flex items-center justify-center text-[10px] font-black text-white">
                                                +
                                            </div>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={cn(
                                                "rounded-full bg-text-primary text-white dark:bg-white dark:text-black flex items-center justify-center shadow-premium hover:bg-accent-gold hover:text-white transition-all duration-500",
                                                buttonSize === 'small' ? 'w-10 h-10' :
                                                    buttonSize === 'large' ? 'w-14 h-14' : 'w-12 h-12'
                                            )}
                                        >
                                            <Plus strokeWidth={2.5} className={cn(
                                                buttonSize === 'small' ? 'w-4 h-4' :
                                                    buttonSize === 'large' ? 'w-6 h-6' : 'w-5 h-5'
                                            )} />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
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
