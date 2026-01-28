"use client";

import { useAccounting } from "@/context/AccountingContext";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, BookOpen, Scale, Landmark } from "lucide-react";

export function ProfitAndLossView() {
    const { ledger, metrics } = useAccounting();

    const revenueAccounts = ledger.filter(a => a.type === 'revenue');
    const expenseAccounts = ledger.filter(a => a.type === 'expense');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Section */}
                <div className="card-premium p-10 bg-white dark:bg-bg-secondary">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-black text-text-primary italic">Produits d'Exploitation</h3>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Total des revenus générés</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {revenueAccounts.map(account => (
                            <div key={account.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-[10px] font-bold text-text-muted bg-bg-tertiary px-2 py-1 rounded-lg">{account.code}</span>
                                    <span className="text-[14px] font-bold text-text-primary group-hover:text-accent transition-colors">{account.name}</span>
                                </div>
                                <span className="text-[15px] font-black text-success tracking-tight">{formatCurrency(account.balance)}</span>
                            </div>
                        ))}
                        <div className="pt-6 border-t border-border flex justify-between items-center">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Total Produits</span>
                            <span className="text-2xl font-black text-text-primary tracking-tighter">{formatCurrency(metrics.totalRevenue)}</span>
                        </div>
                    </div>
                </div>

                {/* Expenses Section */}
                <div className="card-premium p-10 bg-white dark:bg-bg-secondary">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-black text-text-primary italic">Charges d'Exploitation</h3>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Total des dépenses décaissées</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {expenseAccounts.map(account => (
                            <div key={account.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-[10px] font-bold text-text-muted bg-bg-tertiary px-2 py-1 rounded-lg">{account.code}</span>
                                    <span className="text-[14px] font-bold text-text-primary group-hover:text-accent transition-colors">{account.name}</span>
                                </div>
                                <span className="text-[15px] font-black text-error tracking-tight">{formatCurrency(account.balance)}</span>
                            </div>
                        ))}
                        <div className="pt-6 border-t border-border flex justify-between items-center">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Total Charges</span>
                            <span className="text-2xl font-black text-text-primary tracking-tighter">{formatCurrency(metrics.totalExpenses)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary P&L Card */}
            <div className="card-premium p-10 bg-text-primary text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-10 -mr-32 -mt-32 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-3xl font-serif font-black tracking-tight italic">Résultat Net <span className="text-accent not-italic">Intermédiaire</span></h2>
                        <p className="text-[11px] font-bold text-text-muted/60 uppercase tracking-[0.3em] mt-2">Situation financière avant impôts et dotations</p>
                    </div>
                    <div className="flex items-center gap-12">
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/40 mb-2">Marge Brute</p>
                            <p className="text-2xl font-black text-success">{formatPercent(metrics.grossMargin)}</p>
                        </div>
                        <div className="h-12 w-px bg-white/10" />
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/40 mb-2">Bénéfice Net</p>
                            <p className={cn("text-4xl font-black tracking-tighter", metrics.netProfit >= 0 ? "text-success" : "text-error")}>
                                {formatCurrency(metrics.netProfit)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function BalanceSheetView() {
    const { ledger, metrics } = useAccounting();

    const assets = ledger.filter(a => a.type === 'asset');
    const liabilities = ledger.filter(a => a.type === 'liability' || a.type === 'equity');

    const totalAssets = assets.reduce((acc, a) => acc + a.balance, 0);
    const totalLiabilities = liabilities.reduce((acc, a) => acc + a.balance, 0) + (metrics.netProfit > 0 ? metrics.netProfit : 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {/* Assets */}
            <div className="card-premium p-10 bg-white dark:bg-bg-secondary">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                        <Landmark className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-black text-text-primary italic">Actif (Assets)</h3>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Ce que l'entreprise possède</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {assets.map(account => (
                        <div key={account.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <span className="font-mono text-[10px] font-bold text-text-muted bg-bg-tertiary px-2 py-1 rounded-lg">{account.code}</span>
                                <span className="text-[14px] font-bold text-text-primary group-hover:text-accent transition-colors">{account.name}</span>
                            </div>
                            <span className="text-[15px] font-black text-text-primary tracking-tight">{formatCurrency(account.balance)}</span>
                        </div>
                    ))}
                    <div className="pt-10 mt-10 border-t-2 border-dashed border-border flex justify-between items-center">
                        <span className="text-[13px] font-black uppercase tracking-[0.2em] text-text-primary">Total Actif</span>
                        <span className="text-3xl font-black text-accent tracking-tighter">{formatCurrency(totalAssets)}</span>
                    </div>
                </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="card-premium p-10 bg-white dark:bg-bg-secondary">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                        <Scale className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-black text-text-primary italic">Passif (Liabilities & Equity)</h3>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Ce que l'entreprise doit</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {liabilities.map(account => (
                        <div key={account.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <span className="font-mono text-[10px] font-bold text-text-muted bg-bg-tertiary px-2 py-1 rounded-lg">{account.code}</span>
                                <span className="text-[14px] font-bold text-text-primary group-hover:text-accent transition-colors">{account.name}</span>
                            </div>
                            <span className="text-[15px] font-black text-text-primary tracking-tight">{formatCurrency(account.balance)}</span>
                        </div>
                    ))}

                    {/* Include Result in Equity */}
                    <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-[10px] font-bold text-text-muted bg-success/5 px-2 py-1 rounded-lg">120</span>
                            <span className="text-[14px] font-bold text-success italic">Résultat de l'exercice (Bénéfice)</span>
                        </div>
                        <span className="text-[15px] font-black text-success tracking-tight">{formatCurrency(metrics.netProfit)}</span>
                    </div>

                    <div className="pt-10 mt-10 border-t-2 border-dashed border-border flex justify-between items-center">
                        <span className="text-[13px] font-black uppercase tracking-[0.2em] text-text-primary">Total Passif</span>
                        <span className="text-3xl font-black text-indigo-600 tracking-tighter">{formatCurrency(totalLiabilities)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
