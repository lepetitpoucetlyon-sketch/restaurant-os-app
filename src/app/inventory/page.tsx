"use client";

import { useState } from "react";
import {
    Package,
    ArrowDownLeft,
    AlertTriangle,
    Search,
    Filter,
    Plus,
    FileDown,
    MoreVertical,
    TrendingUp,
    ShieldCheck,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    PackageCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/context/InventoryContext";
import { SupplierOrder, SupplierOrderStatus, Ingredient } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="bg-white p-8 rounded-xl border border-border shadow-sm hover:shadow-xl transition-all duration-500 group">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3">{title}</p>
                <h3 className="text-3xl font-mono font-medium text-text-primary">{value}</h3>
                <p className="text-[10px] font-bold text-success mt-3 flex items-center gap-2">
                    <TrendingUp strokeWidth={1.5} className="w-3.5 h-3.5" />
                    {sub}
                </p>
            </div>
            <div className={cn("w-12 h-12 rounded-lg bg-bg-tertiary flex items-center justify-center border border-border group-hover:bg-accent group-hover:text-white transition-all duration-300", color)}>
                <Icon strokeWidth={1.5} className="w-6 h-6" />
            </div>
        </div>
    </div>
);

// Status config for visual display
const ORDER_STATUS_CONFIG: Record<SupplierOrderStatus, { label: string; color: string; icon: any; bg: string }> = {
    draft: { label: 'Brouillon', color: 'text-text-muted', bg: 'bg-bg-tertiary', icon: Clock },
    pending: { label: 'En attente', color: 'text-warning', bg: 'bg-warning-soft', icon: Clock },
    confirmed: { label: 'Confirmée', color: 'text-accent', bg: 'bg-accent/5', icon: CheckCircle2 },
    shipped: { label: 'Expédiée', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Truck },
    delivered: { label: 'Livrée', color: 'text-success', bg: 'bg-success-soft', icon: PackageCheck },
    cancelled: { label: 'Annulée', color: 'text-error', bg: 'bg-error-soft', icon: XCircle },
};

export default function InventoryPage() {
    const { ingredients, lowStockItems, supplierOrders, receiveOrder, cancelOrder } = useInventory();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');

    const totalValue = ingredients.reduce((acc, item) => acc + (item.quantity * item.cost), 0);
    const pendingOrders = supplierOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

    const getStatus = (item: typeof ingredients[0]) => {
        if (item.quantity <= item.minQuantity * 0.5) return "critical";
        if (item.quantity <= item.minQuantity) return "low";
        return "ok";
    };

    const handleReceiveOrder = (order: SupplierOrder) => {
        receiveOrder(order.id);
        showToast(`Commande ${order.id} réceptionnée ! Stock mis à jour.`, "success");
    };

    const handleCancelOrder = (order: SupplierOrder) => {
        cancelOrder(order.id);
        showToast(`Commande ${order.id} annulée.`, "info");
    };

    return (
        <div className="flex flex-1 -m-8 flex-col bg-bg-primary min-h-screen overflow-hidden">
            {/* Header Area */}
            <div className="flex items-center justify-between bg-white border-b border-border px-10 py-6">
                <div className="flex items-center gap-10">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-serif font-semibold text-text-primary tracking-tight">Gestion des Stocks</h1>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                            Flux & Approvisionnement
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex p-1.5 bg-bg-tertiary rounded-xl border border-border">
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={cn(
                                "h-9 px-6 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all",
                                activeTab === 'inventory'
                                    ? "bg-white text-accent shadow-sm"
                                    : "text-text-muted hover:text-text-primary"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <Package strokeWidth={activeTab === 'inventory' ? 2 : 1.5} className="w-3.5 h-3.5" />
                                Inventaire
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={cn(
                                "h-9 px-6 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                                activeTab === 'orders'
                                    ? "bg-white text-accent shadow-sm"
                                    : "text-text-muted hover:text-text-primary"
                            )}
                        >
                            <Truck strokeWidth={activeTab === 'orders' ? 2 : 1.5} className="w-3.5 h-3.5" />
                            Commandes
                            {pendingOrders.length > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-accent text-white text-[9px] font-mono leading-none">
                                    {pendingOrders.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-11 border-border rounded-lg font-bold text-[11px] uppercase tracking-widest text-text-muted hover:text-text-primary bg-white shadow-sm transition-all px-6">
                        <ArrowDownLeft strokeWidth={1.5} className="mr-3 h-4 w-4" />
                        Réception
                    </Button>
                    <Button
                        onClick={() => showToast("Formulaire de commande fournisseur (Fonctionnalité à venir)", "info")}
                        className="btn-elegant-primary h-11 px-8 shadow-lg shadow-accent/10"
                    >
                        <Plus strokeWidth={1.5} className="h-4 w-4 mr-3" />
                        Nouvelle Commande
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-10 space-y-10 elegant-scrollbar">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <StatCard
                        title="Valeur Inventaire"
                        value={`${totalValue.toLocaleString('fr-FR')} €`}
                        sub="+3.4% / mois"
                        icon={Package}
                        color="text-success"
                    />
                    <StatCard
                        title="Alertes Rupture"
                        value={`${lowStockItems.length} items`}
                        sub="Action requise"
                        icon={AlertTriangle}
                        color="text-error"
                    />
                    <StatCard
                        title="Commandes"
                        value={`${pendingOrders.length}`}
                        sub="À réceptionner"
                        icon={Truck}
                        color="text-warning"
                    />
                    <StatCard
                        title="Score HACCP"
                        value="98.2%"
                        sub="Excellence"
                        icon={ShieldCheck}
                        color="text-accent"
                    />
                </div>

                {/* Tab Content */}
                {activeTab === 'inventory' ? (
                    /* Inventory List */
                    <div className="bg-white rounded-xl border border-border shadow-sm flex flex-col overflow-hidden">
                        <div className="p-8 border-b border-border/50 bg-white flex items-center justify-between gap-8">
                            <div className="relative flex-1 max-w-xl">
                                <Search strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou catégorie..."
                                    className="input-elegant w-full pl-11 pr-4 py-3 text-[13px]"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="icon" className="h-11 w-11 rounded-lg border-border hover:border-accent hover:text-accent transition-colors">
                                    <Filter strokeWidth={1.5} className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" className="h-11 px-6 rounded-lg border-border font-bold text-[11px] uppercase tracking-widest gap-3 text-text-muted hover:text-text-primary transition-all">
                                    <FileDown strokeWidth={1.5} className="h-4 w-4" />
                                    Exporter
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-bg-tertiary/20 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] border-b border-border/50">
                                        <th className="px-10 py-5 text-left">Inclusion Stock</th>
                                        <th className="px-8 py-5 text-left">Fournisseur Principal</th>
                                        <th className="px-8 py-5 text-left">Unité</th>
                                        <th className="px-8 py-5 text-right">Stock Actuel</th>
                                        <th className="px-8 py-5 text-right">Seuil Crit.</th>
                                        <th className="px-8 py-5 text-center">État de Santé</th>
                                        <th className="px-10 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {ingredients.map(item => {
                                        const status = getStatus(item);
                                        return (
                                            <tr key={item.id} className="group hover:bg-bg-tertiary/20 transition-all duration-300">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center font-serif text-[15px] font-semibold text-text-primary group-hover:bg-accent group-hover:text-white transition-all">
                                                            {item.name.charAt(0)}
                                                        </div>
                                                        <span className="font-serif font-semibold text-[15px] text-text-primary group-hover:text-accent transition-colors">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[12px] font-medium text-text-primary">{item.supplier}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-2.5 py-1.5 bg-bg-tertiary rounded-lg border border-border/40">{item.unit}</span>
                                                </td>
                                                <td className="px-8 py-6 text-right font-mono font-medium text-[14px] text-text-primary">
                                                    {item.quantity.toFixed(2)}
                                                </td>
                                                <td className="px-8 py-6 text-right font-mono text-text-muted text-[13px]">
                                                    {item.minQuantity}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex justify-center">
                                                        {status === "critical" && (
                                                            <span className="px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-error-soft text-error border border-error/20">Critique</span>
                                                        )}
                                                        {status === "low" && (
                                                            <span className="px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-warning-soft text-warning border border-warning/20">Alerte</span>
                                                        )}
                                                        {status === "ok" && (
                                                            <span className="px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-success-soft text-success border border-success/20">Optimal</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <button className="p-2 text-text-muted hover:text-accent transition-all">
                                                        <MoreVertical strokeWidth={1.5} className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Supplier Orders List */
                    <div className="bg-white rounded-xl border border-border shadow-sm flex flex-col overflow-hidden">
                        <div className="p-8 border-b border-border/50 bg-white flex items-center justify-between gap-8">
                            <h2 className="text-xl font-serif font-semibold text-text-primary">Commandes Fournisseurs</h2>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                                    {supplierOrders.length} enregistrements au total
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-bg-tertiary/20 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] border-b border-border/50">
                                        <th className="px-10 py-5 text-left">Référence No.</th>
                                        <th className="px-8 py-5 text-left">Maison / Fournisseur</th>
                                        <th className="px-8 py-5 text-left">Articles Commandés</th>
                                        <th className="px-8 py-5 text-right">Volume Fin.</th>
                                        <th className="px-8 py-5 text-center">Émis le</th>
                                        <th className="px-8 py-5 text-center">État Flux</th>
                                        <th className="px-10 py-5 text-right">Décision</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {supplierOrders.map(order => {
                                        const statusConfig = ORDER_STATUS_CONFIG[order.status];
                                        const StatusIcon = statusConfig.icon;
                                        return (
                                            <tr key={order.id} className="group hover:bg-bg-tertiary/20 transition-all duration-300">
                                                <td className="px-10 py-6">
                                                    <span className="font-mono font-medium text-[13px] text-accent">#{order.id.toUpperCase()}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="font-serif font-semibold text-[15px] text-text-primary">{order.supplier}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1.5">
                                                        {order.items.map((item, i) => (
                                                            <span key={i} className="text-[12px] font-medium text-text-muted">
                                                                <span className="font-mono text-text-primary">{item.quantity}</span> &times; {item.ingredientName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right font-mono font-medium text-[14px] text-text-primary">
                                                    {order.totalAmount.toFixed(2)} €
                                                </td>
                                                <td className="px-8 py-6 text-center text-[12px] font-medium text-text-muted">
                                                    {order.orderDate}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex justify-center">
                                                        <span
                                                            className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-current/20", statusConfig.bg, statusConfig.color)}
                                                        >
                                                            <StatusIcon strokeWidth={2} className="w-3 h-3" />
                                                            {statusConfig.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        {(order.status === 'shipped' || order.status === 'confirmed') && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleReceiveOrder(order)}
                                                                className="h-9 px-5 text-[10px] font-bold uppercase tracking-widest bg-success hover:bg-success/90 text-white rounded-lg shadow-lg shadow-success/10"
                                                            >
                                                                <PackageCheck strokeWidth={1.5} className="w-3.5 h-3.5 mr-2" />
                                                                Réceptionner
                                                            </Button>
                                                        )}
                                                        {order.status === 'pending' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleCancelOrder(order)}
                                                                className="h-9 px-5 text-[10px] font-bold uppercase tracking-widest border-error text-error hover:bg-error/5 rounded-lg"
                                                            >
                                                                <XCircle strokeWidth={1.5} className="w-3.5 h-3.5 mr-2" />
                                                                Annuler
                                                            </Button>
                                                        )}
                                                        {(order.status === 'delivered' || order.status === 'cancelled') && (
                                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                                                                {order.status === 'delivered' ? order.deliveredDate : '—'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
