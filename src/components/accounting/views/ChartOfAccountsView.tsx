
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useAccounting } from "@/context/AccountingContext";

import { CLASS_LABELS } from "@/components/accounting/AccountingConfig";

export function ChartOfAccountsView({ searchQuery }: { searchQuery: string }) {
    const { accounts, ledger } = useAccounting();
    const [expandedClasses, setExpandedClasses] = useState<string[]>(['6', '7', '5']);

    const filteredAccounts = useMemo(() => {
        if (!searchQuery) return accounts;
        const query = searchQuery.toLowerCase();
        return accounts.filter(a =>
            a.code.includes(query) ||
            a.name.toLowerCase().includes(query)
        );
    }, [accounts, searchQuery]);

    const accountsByClass = useMemo(() => {
        const grouped: Record<string, typeof accounts> = {};
        filteredAccounts.forEach(acc => {
            if (!grouped[acc.class]) grouped[acc.class] = [];
            grouped[acc.class].push(acc);
        });
        return grouped;
    }, [filteredAccounts]);

    const toggleClass = (classId: string) => {
        setExpandedClasses(prev =>
            prev.includes(classId) ? prev.filter(c => c !== classId) : [...prev, classId]
        );
    };

    const getAccountBalance = (accountId: string) => ledger.find(l => l.id === accountId)?.balance || 0;

    return (
        <div className="space-y-4">
            {Object.entries(CLASS_LABELS).map(([classId, info], index) => {
                const classAccounts = accountsByClass[classId] || [];
                const isExpanded = expandedClasses.includes(classId);
                const classTotal = classAccounts.reduce((acc, a) => acc + getAccountBalance(a.id), 0);

                return (
                    <motion.div
                        key={classId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="card-premium overflow-hidden"
                    >
                        <button
                            onClick={() => toggleClass(classId)}
                            className="w-full flex items-center justify-between p-5 hover:bg-bg-tertiary/30 transition-all outline-none"
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg", info.color)}>
                                    {classId}
                                </div>
                                <div className="text-left">
                                    <h3 className="text-base font-bold text-text-primary">Classe {classId} - {info.name}</h3>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                        {classAccounts.length} comptes
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={cn("text-lg font-black font-mono", classTotal >= 0 ? "text-text-primary" : "text-error")}>
                                    {formatCurrency(classTotal)}
                                </span>
                                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown className="w-5 h-5 text-text-muted" />
                                </motion.div>
                            </div>
                        </button>

                        <AnimatePresence>
                            {isExpanded && classAccounts.length > 0 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-border overflow-hidden"
                                >
                                    <div className="divide-y divide-border/50">
                                        {classAccounts.sort((a, b) => a.code.localeCompare(b.code)).map((account, i) => {
                                            const balance = getAccountBalance(account.id);
                                            const ledgerEntry = ledger.find(l => l.id === account.id);

                                            return (
                                                <motion.div
                                                    key={account.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.02 }}
                                                    className="flex items-center justify-between px-6 py-3 hover:bg-bg-tertiary/20 transition-all group cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <span className="font-mono text-sm font-black text-accent bg-accent/5 px-3 py-1 rounded-lg w-16 text-center">
                                                            {account.code}
                                                        </span>
                                                        <div>
                                                            <p className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                                                                {account.name}
                                                            </p>
                                                            <p className="text-[10px] text-text-muted uppercase tracking-widest">
                                                                {ledgerEntry?.movements.length || 0} mvts
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <p className="text-[9px] font-bold text-text-muted uppercase">Débit</p>
                                                            <p className="text-sm font-mono font-bold text-success">{formatCurrency(ledgerEntry?.debitTotal || 0)}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[9px] font-bold text-text-muted uppercase">Crédit</p>
                                                            <p className="text-sm font-mono font-bold text-error">{formatCurrency(ledgerEntry?.creditTotal || 0)}</p>
                                                        </div>
                                                        <div className="text-right min-w-[90px]">
                                                            <p className="text-[9px] font-bold text-text-muted uppercase">Solde</p>
                                                            <p className={cn("text-base font-black font-mono", balance >= 0 ? "text-success" : "text-error")}>
                                                                {formatCurrency(balance)}
                                                            </p>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}
