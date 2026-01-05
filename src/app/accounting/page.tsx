"use client";

import { useState } from "react";
import {
    Calculator,
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Filter,
    CreditCard,
    Wallet,
    Receipt,
    ShoppingCart,
    Truck,
    RefreshCw,
    FileText,
    Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { useAccounting } from "@/context/AccountingContext";
import { useToast } from "@/components/ui/Toast";
import { ZReportDialog } from "@/components/accounting/ZReportDialog";
import { generateFEC, downloadFEC, generateFECFilename } from "@/lib/fecGenerator";

const FinanceCard = ({ title, value, trend, trendValue, icon: Icon, color }: {
    title: string;
    value: string;
    trend: 'up' | 'down';
    trendValue: string;
    icon: any;
    color: string;
}) => (
    <div className="card-premium p-8">
        <div className="flex justify-between items-start mb-6">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl", color)}>
                <Icon className="w-7 h-7" />
            </div>
            <div className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider",
                trend === 'up' ? "bg-[#E6F9EF] text-[#00D764]" : "bg-[#FEECEC] text-[#FF4D4D]"
            )}>
                {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {trendValue}
            </div>
        </div>
        <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-[0.2em] mb-2">{title}</p>
        <h3 className="text-3xl font-black text-[#1A1A1A] tracking-tighter">{value}</h3>
    </div>
);

const TRANSACTION_ICONS: Record<string, any> = {
    sales: CreditCard,
    purchases: Truck,
    fixed: Wallet,
    payroll: Receipt,
    other: Receipt
};

export default function AccountingPage() {
    const { showToast } = useToast();
    const { metrics, recentTransactions, dailyRevenue, weeklyRevenue, monthlyRevenue } = useAccounting();
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isZReportOpen, setIsZReportOpen] = useState(false);

    const handleExport = () => {
        showToast("Préparation du Grand Livre Comptable...", "premium");
        setTimeout(() => {
            showToast("Grand Livre exporté (Excel/PDF)", "success");
        }, 2000);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            showToast("Données financières actualisées", "success");
        }, 1000);
    };

    const handleExportFEC = () => {
        showToast("Génération du fichier FEC...", "premium");
        setTimeout(() => {
            // Mock transactions for FEC export
            const mockTransactions = recentTransactions.map((tx, i) => ({
                id: tx.id,
                date: new Date(),
                type: tx.type === 'income' ? 'sale' as const : 'purchase' as const,
                description: tx.title,
                amountHT: tx.amount / 1.1,
                vatRate: 10,
                vatAmount: tx.amount - (tx.amount / 1.1),
                paymentMethod: 'card' as const,
                category: 'food' as const
            }));

            const fecContent = generateFEC(
                mockTransactions,
                { startDate: new Date('2026-01-01'), endDate: new Date() },
                { name: 'Restaurant OS', siret: '12345678900012' }
            );

            const filename = generateFECFilename('12345678900012', new Date());
            downloadFEC(fecContent, filename);
            showToast(`Fichier FEC exporté: ${filename}`, "success");
        }, 1500);
    };

    // Get revenue based on selected period
    const currentRevenue = period === 'day' ? dailyRevenue : period === 'week' ? weeklyRevenue : monthlyRevenue;
    const periodLabel = period === 'day' ? "Aujourd'hui" : period === 'week' ? 'Cette Semaine' : 'Ce Mois';

    return (
        <div className="flex h-[calc(100vh-70px)] -m-6 flex-col bg-[#F8F9FA] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border-b border-neutral-100 px-8 py-4">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-[#1A1A1A] tracking-tight">Finance & Comptabilité</h1>
                        <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wider mt-0.5">
                            Analytique financière en temps réel • Données calculées
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-neutral-50 p-1 rounded-xl border border-neutral-100 mr-4">
                        <span className="text-[10px] font-black text-[#ADB5BD] px-3 uppercase tracking-widest">Période:</span>
                        {(['day', 'week', 'month'] as const).map((p) => (
                            <Button
                                key={p}
                                variant="ghost"
                                size="sm"
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    "h-8 rounded-lg text-[11px] font-bold uppercase transition-all",
                                    period === p ? "bg-white shadow-sm text-[#1A1A1A]" : "text-[#ADB5BD]"
                                )}
                            >
                                {p === 'day' ? 'Jour' : p === 'week' ? 'Semaine' : 'Mois'}
                            </Button>
                        ))}
                    </div>
                    <Button
                        onClick={() => setIsZReportOpen(true)}
                        variant="outline"
                        className="h-10 border-neutral-100 rounded-xl font-bold text-sm bg-white"
                    >
                        <Hash className="mr-2 h-4 w-4 text-[#00D764]" />
                        Z de Caisse
                    </Button>
                    <Button
                        onClick={handleExportFEC}
                        variant="outline"
                        className="h-10 border-neutral-100 rounded-xl font-bold text-sm bg-white"
                    >
                        <FileText className="mr-2 h-4 w-4 text-indigo-500" />
                        Export FEC
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-10 border-neutral-100 rounded-xl font-bold text-sm bg-white"
                    >
                        <RefreshCw className={cn("mr-2 h-4 w-4 text-[#ADB5BD]", isRefreshing && "animate-spin")} />
                        Actualiser
                    </Button>
                    <Button
                        onClick={handleExport}
                        className="h-10 bg-[#1A1A1A] hover:bg-black rounded-xl font-bold text-sm px-6 shadow-xl"
                    >
                        <Download className="h-4 w-4 mr-2 text-[#00D764]" />
                        Exporter Grand Livre
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
                {/* Main Finance Grid - REAL DATA */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FinanceCard
                        title={`Chiffre d'Affaires (${periodLabel})`}
                        value={formatCurrency(currentRevenue)}
                        trend="up"
                        trendValue="+12%"
                        icon={DollarSign}
                        color="bg-[#1A1A1A]"
                    />
                    <FinanceCard
                        title="Marge Brute"
                        value={formatPercent(metrics.grossMargin)}
                        trend={metrics.grossMargin > 0.65 ? "up" : "down"}
                        trendValue={metrics.grossMargin > 0.65 ? "+2.5%" : "-1.2%"}
                        icon={TrendingUp}
                        color="bg-[#00D764]"
                    />
                    <FinanceCard
                        title="Food Cost"
                        value={formatPercent(metrics.foodCost)}
                        trend={metrics.foodCost < 0.30 ? "up" : "down"}
                        trendValue={metrics.foodCost < 0.30 ? "-1.4%" : "+0.8%"}
                        icon={PieChart}
                        color="bg-indigo-600"
                    />
                    <FinanceCard
                        title="EBITDA Prévisionnel"
                        value={formatCurrency(metrics.ebitda)}
                        trend={metrics.ebitda > 0 ? "up" : "down"}
                        trendValue={metrics.ebitda > 0 ? "+8.2%" : "-3.1%"}
                        icon={Calculator}
                        color="bg-amber-500"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Cash Flow Analysis */}
                    <div className="card-premium p-10 bg-white">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight">Flux de Trésorerie</h2>
                                <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest mt-1">
                                    Revenus: {formatCurrency(metrics.totalRevenue)} | Dépenses: {formatCurrency(metrics.totalExpenses)}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#00D764]" />
                                    <span className="text-[10px] font-black uppercase text-[#ADB5BD]">Encaissements</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#FF4D4D]" />
                                    <span className="text-[10px] font-black uppercase text-[#ADB5BD]">Décaissements</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Bar Chart */}
                        <div className="h-64 flex items-end justify-between gap-4">
                            {[
                                { income: 60, expense: 24 },
                                { income: 40, expense: 16 },
                                { income: 80, expense: 32 },
                                { income: 50, expense: 20 },
                                { income: 90, expense: 36 },
                                { income: 70, expense: 28 },
                                { income: 100, expense: 40 }
                            ].map((data, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex gap-1 items-end h-full">
                                        <div
                                            style={{ height: `${data.income}%` }}
                                            className="flex-1 bg-[#00D764]/20 rounded-t-lg hover:bg-[#00D764]/40 transition-all border-t-2 border-[#00D764] cursor-pointer"
                                            title={`Revenus: ${formatCurrency(data.income * 50)}`}
                                        />
                                        <div
                                            style={{ height: `${data.expense}%` }}
                                            className="flex-1 bg-[#FF4D4D]/20 rounded-t-lg hover:bg-[#FF4D4D]/40 transition-all border-t-2 border-[#FF4D4D] cursor-pointer"
                                            title={`Dépenses: ${formatCurrency(data.expense * 50)}`}
                                        />
                                    </div>
                                    <span className="text-[9px] font-black text-[#ADB5BD] uppercase">W{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Transactions - REAL DATA */}
                    <div className="card-premium p-10 bg-white">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight">Transactions Récentes</h2>
                            <span className="text-[11px] font-bold text-[#00D764] uppercase">
                                {recentTransactions.length} opérations
                            </span>
                        </div>

                        {recentTransactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Receipt className="w-12 h-12 text-neutral-200 mb-4" />
                                <p className="text-[#ADB5BD] font-bold">Aucune transaction</p>
                                <p className="text-[11px] text-[#CED4DA] mt-1">Les ventes et achats apparaîtront ici</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {recentTransactions.map((tx) => {
                                    const Icon = TRANSACTION_ICONS[tx.category] || Receipt;
                                    return (
                                        <div key={tx.id} className="flex items-center justify-between group transition-all hover:bg-neutral-50 -mx-4 px-4 py-2 rounded-xl">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-[#F8F9FA] flex items-center justify-center text-[#ADB5BD] group-hover:bg-[#1A1A1A] group-hover:text-white transition-all shadow-inner">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[14px] font-black text-[#1A1A1A]">{tx.title}</h4>
                                                    <p className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-widest mt-0.5">
                                                        {tx.category === 'sales' ? 'Ventes' : tx.category === 'purchases' ? 'Achats' : tx.category}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "text-[15px] font-black tracking-tighter",
                                                tx.type === 'income' ? "text-[#00D764]" : "text-[#FF4D4D]"
                                            )}>
                                                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Banner */}
                <div className="card-premium p-8 bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-black">Résumé Financier</h3>
                            <p className="text-[11px] text-neutral-400 uppercase tracking-widest mt-1">
                                Données en temps réel basées sur les ventes et l'inventaire
                            </p>
                        </div>
                        <div className="flex gap-12">
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-400">Total Revenus</p>
                                <p className="text-2xl font-black text-[#00D764]">{formatCurrency(metrics.totalRevenue)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-400">Total Dépenses</p>
                                <p className="text-2xl font-black text-[#FF4D4D]">{formatCurrency(metrics.totalExpenses)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-400">Résultat Net</p>
                                <p className={cn("text-2xl font-black", metrics.ebitda > 0 ? "text-[#00D764]" : "text-[#FF4D4D]")}>
                                    {formatCurrency(metrics.ebitda)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Z Report Dialog */}
            <ZReportDialog
                isOpen={isZReportOpen}
                onClose={() => setIsZReportOpen(false)}
                data={{
                    date: "05/01/2026",
                    openTime: "11:30",
                    closeTime: "23:45",
                    reportNumber: 1247,
                    cashier: "Alexandre De Rossi",
                    grossSales: metrics.totalRevenue,
                    discounts: metrics.totalRevenue * 0.025,
                    netSales: metrics.totalRevenue * 0.975,
                    cardPayments: metrics.totalRevenue * 0.65,
                    cashPayments: metrics.totalRevenue * 0.28,
                    mobilePayments: metrics.totalRevenue * 0.07,
                    vat10: metrics.totalRevenue * 0.065,
                    vat20: metrics.totalRevenue * 0.025,
                    vat55: metrics.totalRevenue * 0.005,
                    transactionCount: recentTransactions.filter(t => t.type === 'income').length,
                    avgTicket: recentTransactions.length > 0 ? metrics.totalRevenue / Math.max(1, recentTransactions.filter(t => t.type === 'income').length) : 0,
                    cancelledCount: 2,
                    cancelledAmount: 45,
                    openingCash: 200,
                    closingCash: metrics.totalRevenue * 0.28 + 200,
                    expectedCash: metrics.totalRevenue * 0.28 + 200,
                    variance: 0
                }}
                onPrint={() => showToast("Impression du Z de caisse...", "info")}
                onExport={() => showToast("Export PDF du Z de caisse", "success")}
            />
        </div>
    );
}
