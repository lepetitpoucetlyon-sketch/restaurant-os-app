
"use client";

import { useMemo } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useAccounting } from "@/context/AccountingContext";

export function TrialBalanceView() {
    const { generateTrialBalance } = useAccounting();
    const trialBalance = useMemo(() => generateTrialBalance('current'), [generateTrialBalance]);

    return (
        <div className="space-y-6">
            <div className={cn(
                "p-5 rounded-2xl flex items-center gap-4",
                trialBalance.isBalanced ? "bg-success/5 border border-success/20" : "bg-error/5 border border-error/20"
            )}>
                {trialBalance.isBalanced ? <CheckCircle2 className="w-6 h-6 text-success" /> : <AlertCircle className="w-6 h-6 text-error" />}
                <div>
                    <p className="text-sm font-bold text-text-primary">{trialBalance.isBalanced ? "Balance Équilibrée" : "Écart Détecté"}</p>
                    <p className="text-[10px] text-text-muted">Σ Débits = {formatCurrency(trialBalance.totalDebit)} | Σ Crédits = {formatCurrency(trialBalance.totalCredit)}</p>
                </div>
            </div>

            <div className="bg-bg-secondary rounded-2xl border border-border overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-bg-tertiary/30">
                            <th className="text-left py-4 px-6 text-[10px] font-black text-text-muted uppercase">Code</th>
                            <th className="text-left py-4 px-6 text-[10px] font-black text-text-muted uppercase">Intitulé</th>
                            <th className="text-right py-4 px-6 text-[10px] font-black text-text-muted uppercase">Débit</th>
                            <th className="text-right py-4 px-6 text-[10px] font-black text-text-muted uppercase">Crédit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {trialBalance.accounts.map((a, i) => (
                            <tr key={i} className="hover:bg-bg-tertiary/20">
                                <td className="py-3 px-6 font-mono text-sm font-bold text-accent">{a.code}</td>
                                <td className="py-3 px-6 text-sm text-text-primary">{a.name}</td>
                                <td className="py-3 px-6 text-right font-mono text-sm font-bold text-success">{a.debit > 0 ? formatCurrency(a.debit) : '-'}</td>
                                <td className="py-3 px-6 text-right font-mono text-sm font-bold text-error">{a.credit > 0 ? formatCurrency(a.credit) : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-text-primary bg-bg-tertiary/50">
                            <td colSpan={2} className="py-4 px-6 text-sm font-black text-text-primary uppercase">Total</td>
                            <td className="py-4 px-6 text-right font-mono text-lg font-black text-success">{formatCurrency(trialBalance.totalDebit)}</td>
                            <td className="py-4 px-6 text-right font-mono text-lg font-black text-error">{formatCurrency(trialBalance.totalCredit)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
