"use client";

import { useState } from "react";
import { CategoryList } from "@/components/pos/CategoryList";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { Product, Option } from "@/types";

import { PaymentDialog } from "@/components/pos/PaymentDialog";
import { SplitBillDialog } from "@/components/pos/SplitBillDialog";
import { TableSelector } from "@/components/pos/TableSelector";
import { useTables } from "@/context/TablesContext";
import { useOrders } from "@/context/OrdersContext";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutGrid, Monitor, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface CartItem {
    cartId: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    modifiers?: string[];
    notes?: string;
}

export default function POSPage() {
    const { tables, updateTableStatus } = useTables();
    const { addOrder } = useOrders();
    const { deductStockForProduct } = useInventory();
    const { currentUser } = useAuth();
    const { showToast } = useToast();

    const [selectedCategory, setSelectedCategory] = useState("pizzas");
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isSplitOpen, setIsSplitOpen] = useState(false);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

    const currentTable = tables.find(t => t.id === selectedTableId);

    const handleAddToCart = (product: Product, quantity: number, selectedOptions: Record<string, Option[]>) => {
        if (cartItems.length === 0 && selectedTableId) {
            updateTableStatus(selectedTableId, 'seated');
        }

        let unitPrice = product.price;
        const modifiersList: string[] = [];

        Object.values(selectedOptions).forEach(options => {
            options.forEach(opt => {
                unitPrice += opt.priceModifier;
                const priceStr = opt.priceModifier > 0 ? ` (+${opt.priceModifier.toFixed(2)}€)` : '';
                modifiersList.push(`${opt.name}${priceStr}`);
            });
        });

        const modifiersKey = modifiersList.sort().join("|");

        setCartItems(prev => {
            const existing = prev.find(item =>
                item.productId === product.id &&
                (item.modifiers || []).sort().join("|") === modifiersKey
            );

            if (existing) {
                return prev.map(item =>
                    item.cartId === existing.cartId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prev, {
                cartId: Math.random().toString(36).substr(2, 9),
                productId: product.id,
                name: product.name,
                price: unitPrice,
                quantity: quantity,
                modifiers: modifiersList
            }];
        });
    };

    const handleUpdateQuantity = (cartId: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.cartId === cartId) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const handleClearCart = () => {
        setCartItems([]);
    };

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            setIsPaymentOpen(true);
        }
    };

    const handleSendToKitchen = () => {
        if (selectedTableId && cartItems.length > 0) {
            addOrder({
                tableId: selectedTableId,
                tableNumber: currentTable?.number || "??",
                serverName: currentUser?.name || "Inconnu",
                items: cartItems.map(item => ({
                    id: Math.random().toString(36).substr(2, 9),
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    modifiers: item.modifiers,
                    notes: item.notes,
                    status: 'cooking'
                }))
            });

            // Update table status to 'seated' (occupied) but don't clear it
            updateTableStatus(selectedTableId, 'seated');

            showToast(`Bon envoyé en cuisine - Table ${currentTable?.number}`, "success");
            setCartItems([]);
            setSelectedTableId(null); // Back to floor plan
        }
    };

    const handlePaymentComplete = () => {
        if (selectedTableId) {
            addOrder({
                tableId: selectedTableId,
                tableNumber: currentTable?.number || "??",
                serverName: currentUser?.name || "Inconnu",
                items: cartItems.map(item => ({
                    id: Math.random().toString(36).substr(2, 9),
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    modifiers: item.modifiers,
                    notes: item.notes,
                    status: 'cooking'
                }))
            });

            cartItems.forEach(item => {
                deductStockForProduct(item.productId, item.quantity);
            });

            updateTableStatus(selectedTableId, 'free');
            showToast(`Encaissement Table ${currentTable?.number} réussi`, "success");
        }
        setCartItems([]);
        setIsPaymentOpen(false);
        setSelectedTableId(null);
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (!selectedTableId) {
        return (
            <div className="flex h-[calc(100vh-70px)] -m-6 bg-white overflow-hidden">
                <TableSelector onSelectTable={setSelectedTableId} />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-80px)] -m-8 overflow-hidden bg-bg-primary">
            {/* 1. Module Sidebar (Icons Only) */}
            <CategoryList
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* 2. Main Area (Top Bar + Product Grid) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-border">
                <div className="h-20 flex items-center justify-between px-8 bg-white border-b border-border">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSelectedTableId(null)}
                            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted hover:text-text-primary transition-all group"
                        >
                            <ArrowLeft strokeWidth={1.5} className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Retour
                        </button>
                        <div className="h-4 w-px bg-border" />
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-serif font-semibold text-text-primary">
                                Table {currentTable?.number}
                            </h2>
                            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-success-soft border border-success/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-success">Service en cours</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => showToast("Mode Moniteur KDS activé", "info")}
                            className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-all"
                        >
                            <Monitor strokeWidth={1.5} className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => showToast("Changement de la grille d'affichage", "info")}
                            className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-all border border-transparent"
                        >
                            <LayoutGrid strokeWidth={1.5} className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <ProductGrid
                    categoryFilter={selectedCategory}
                    onAddToCart={handleAddToCart}
                />
            </div>

            {/* 3. Cart Sidebar */}
            <div className="h-full">
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
                    showToast(`Convive ${guestIndex + 1} a payé ${amount.toFixed(2)}€`, "success");
                }}
            />
        </div>
    );
}
