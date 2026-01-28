"use client";

import { useState } from "react";
import { CategoryList } from "@/components/pos/CategoryList";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { TableSelector } from "@/components/pos/TableSelector";
import { PaymentDialog } from "@/components/pos/PaymentDialog";
import { SplitBillDialog } from "@/components/pos/SplitBillDialog";
import { useOrders } from "@/context/OrdersContext";
import { useTables } from "@/context/TablesContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { ShoppingCart, Plus, ArrowLeft, MoreHorizontal, LayoutGrid, Star, Pizza, UtensilsCrossed, GlassWater, Beef, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks";
import { fabVariants, mobileSpring } from "@/lib/motion";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useLanguage } from "@/context/LanguageContext";
import { CATEGORIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
    all: Star,
    pizzas: Pizza,
    pastas: UtensilsCrossed,
    boissons: GlassWater,
    entrees: UtensilsCrossed,
    plats: Beef,
    desserts: Coffee
};

export default function POSPage() {
    const { t } = useLanguage();
    const isMobile = useIsMobile();
    const { tables, updateTable } = useTables();
    const { addOrder } = useOrders();
    const { currentUser } = useAuth();
    const { showToast } = useToast();

    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isSplitOpen, setIsSplitOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);

    const currentTable = tables.find(t => t.id === selectedTableId);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleAddToCart = (product: any, quantity: number, selectedOptions: any, note?: string) => {
        const cartId = `${product.id}-${Date.now()}`;
        const newItem = {
            cartId,
            productId: product.id,
            categoryId: product.categoryId,
            name: product.name,
            price: product.price,
            quantity,
            modifiers: Object.values(selectedOptions).flat().map((opt: any) => opt.name),
            notes: note
        };
        setCartItems(prev => [...prev, newItem]);
        showToast(`${product.name} ajouté`, "success");
    };

    const handleUpdateQuantity = (cartId: string, delta: number) => {
        setCartItems(prev => prev.map(item =>
            item.cartId === cartId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        ).filter(item => item.quantity > 0));
    };

    const handleClearCart = () => setCartItems([]);

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        setIsPaymentOpen(true);
    };

    const handleSendToKitchen = () => {
        if (cartItems.length === 0) return;
        showToast(`Table ${currentTable?.number} : Commande envoyée`, "success");
        setCartItems([]);
        if (selectedTableId) {
            updateTable(selectedTableId, { status: 'ordered' });
        }
    };

    const handlePaymentComplete = () => {
        if (!currentTable) return;

        addOrder({
            tableId: currentTable.id,
            tableNumber: currentTable.number,
            serverName: currentUser?.name || 'Server',
            items: cartItems.map(item => ({
                id: item.cartId,
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                status: 'served',
                notes: item.notes,
                modifiers: item.modifiers
            })),
            status: 'paid'
        });

        updateTable(currentTable.id, { status: 'free' });
        setIsPaymentOpen(false);
        setSelectedTableId(null);
        handleClearCart();
        showToast("Paiement validé. Table libérée.", "success");
    };

    if (!selectedTableId) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full bg-bg-primary overflow-hidden">
                <TableSelector onSelectTable={setSelectedTableId} />
            </motion.div>
        );
    }

    return (
        <div className="flex flex-1 flex-col bg-bg-primary h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] -m-4 lg:-m-8 overflow-hidden relative pb-24 lg:pb-0">
            {/* Header & Categories Swiper */}
            <div className="bg-white/80 dark:bg-bg-primary/80 backdrop-blur-2xl px-6 py-4 border-b border-border/50 sticky top-0 z-40">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedTableId(null)} className="text-text-muted">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-serif font-black italic text-text-primary tracking-tight">Table {currentTable?.number}<span className="text-accent-gold ml-1">.</span></h1>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-muted">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                {/* Horizontal Category Swiper */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={cn(
                            "flex items-center gap-2 h-10 px-5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                            selectedCategory === "all" ? "bg-accent-gold text-white shadow-lg scale-105" : "bg-bg-tertiary text-text-muted"
                        )}
                    >
                        <Star className="w-3.5 h-3.5" />
                        Favoris
                    </button>
                    {CATEGORIES.map(cat => {
                        const Icon = ICON_MAP[cat.id] || UtensilsCrossed;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    "flex items-center gap-2 h-10 px-5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                    selectedCategory === cat.id ? "bg-accent-gold text-white shadow-lg scale-105" : "bg-bg-tertiary text-text-muted"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {t(`pos.categories.${cat.id}`)}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-auto p-4 lg:p-12 elegant-scrollbar bg-bg-primary/50">
                <ProductGrid categoryFilter={selectedCategory} onAddToCart={handleAddToCart} />
            </div>

            {/* Mobile Cart Tray (Dock UX) */}
            <AnimatePresence>
                {cartItems.length > 0 && !isMobileCartOpen && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-28 left-6 right-6 z-50 pointer-events-none"
                    >
                        <button
                            onClick={() => setIsMobileCartOpen(true)}
                            className="pointer-events-auto w-full h-16 bg-text-primary dark:bg-accent-gold text-white dark:text-bg-primary rounded-[2rem] px-8 flex items-center justify-between shadow-2xl border border-white/10 group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center font-black text-xs">
                                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Ouvrir le Panier</span>
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                                <span className="text-xl font-mono font-bold italic">{cartTotal.toFixed(2)}€</span>
                                <Plus className="w-6 h-6 rotate-45 opacity-40" />
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cart Sheet (Mobile) / Desktop Sidebar */}
            {!isMobile && (
                <div className="h-full hidden xl:block w-[400px]">
                    <Cart
                        items={cartItems}
                        onUpdateQuantity={handleUpdateQuantity}
                        onClearCart={handleClearCart}
                        onCheckout={handleCheckout}
                        onSendToKitchen={handleSendToKitchen}
                        onSplitBill={() => setIsSplitOpen(true)}
                        tableNumber={currentTable?.number}
                        guestCount={currentTable?.seats}
                    />
                </div>
            )}

            <BottomSheet
                isOpen={isMobileCartOpen}
                onClose={() => setIsMobileCartOpen(false)}
                title={`Panier Table ${currentTable?.number}`}
                size="full"
            >
                <div className="h-full flex flex-col -mt-4">
                    <Cart
                        items={cartItems}
                        onUpdateQuantity={handleUpdateQuantity}
                        onClearCart={handleClearCart}
                        onCheckout={() => { setIsMobileCartOpen(false); handleCheckout(); }}
                        onSendToKitchen={() => { setIsMobileCartOpen(false); handleSendToKitchen(); }}
                        onSplitBill={() => { setIsMobileCartOpen(false); setIsSplitOpen(true); }}
                        tableNumber={currentTable?.number}
                        guestCount={currentTable?.seats}
                        showClose={false}
                    />
                </div>
            </BottomSheet>

            <PaymentDialog
                isOpen={isPaymentOpen}
                total={cartTotal}
                onClose={() => setIsPaymentOpen(false)}
                onPaymentComplete={handlePaymentComplete}
            />

            <SplitBillDialog
                isOpen={isSplitOpen}
                items={cartItems}
                total={cartTotal}
                guestCount={currentTable?.seats || 2}
                onClose={() => setIsSplitOpen(false)}
                onPaySplit={(amount, guestIndex) => {
                    showToast(`Guest ${guestIndex + 1} : ${amount.toFixed(2)}€ payé`, "success");
                }}
            />
        </div>
    );
}
