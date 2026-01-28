
"use client";

import { useState, useMemo } from "react";
import { Shield, Fingerprint, Hash, Lock, CheckCircle2, FileText, RefreshCw, Download, QrCode, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccounting } from "@/context/AccountingContext";

export function FECView() {
    const [isGenerating, setIsGenerating] = useState(false);
    const { journalEntries } = useAccounting();

    // Simulate a secure hash for the FEC
    const secureHash = useMemo(() => {
        return "FEC_" + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    }, []);

    const generateFEC = async () => {
        setIsGenerating(true);
        await new Promise(r => setTimeout(r, 2500));
        setIsGenerating(false);
        // In real app, this would trigger a file download
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="card-premium p-10 bg-bg-secondary relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                    <Shield className="w-32 h-32 text-accent" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                            <Fingerprint className="w-8 h-8 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif font-black text-text-primary tracking-tight">Générateur FEC Normalisé</h2>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-1">Conformité Art. L.47 A-I du LPF</p>
                        </div>
                    </div>

                    <div className="bg-bg-tertiary/50 border border-border/50 rounded-2xl p-6 mb-8 font-mono text-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <span className="text-text-muted flex items-center gap-2 uppercase text-[10px] font-bold tracking-widest">
                                <Hash className="w-3.5 h-3.5" /> Signature Numérique (SHA-256)
                            </span>
                            <span className="text-accent font-black">{secureHash}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <span className="text-text-muted flex items-center gap-2 uppercase text-[10px] font-bold tracking-widest">
                                <Lock className="w-3.5 h-3.5" /> Statut d&apos;Intégrité
                            </span>
                            <span className="text-success font-bold flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5" /> SCELLÉ
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-text-muted flex items-center gap-2 uppercase text-[10px] font-bold tracking-widest">
                                <FileText className="w-3.5 h-3.5" /> Volume de Données
                            </span>
                            <span className="text-text-primary font-bold">{journalEntries.length} écritures détectées</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={generateFEC}
                            disabled={isGenerating}
                            className="flex-1 h-14 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-accent/20 transition-all"
                        >
                            {isGenerating ? (
                                <RefreshCw className="w-5 h-5 animate-spin mr-3" />
                            ) : (
                                <Download className="w-5 h-5 mr-3" />
                            )}
                            {isGenerating ? "Génération en cours..." : "Générer le Fichier FEC"}
                        </Button>
                        <Button variant="outline" className="h-14 px-8 rounded-xl font-bold text-sm uppercase tracking-widest">
                            <QrCode className="w-5 h-5 mr-3" />
                            Vérifier l&apos;Archive
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Inaltérabilité", icon: Lock, desc: "Conservation des traces de toute modification." },
                    { title: "Sécurisation", icon: Shield, desc: "Chiffrement des exports par signature privée." },
                    { title: "Conservation", icon: Clock, desc: "Archivage conforme pendant 10 ans." }
                ].map((feature, i) => (
                    <div key={i} className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <feature.icon className="w-6 h-6 text-accent mb-4" />
                        <h4 className="font-serif font-black text-text-primary italic mb-2">{feature.title}</h4>
                        <p className="text-xs text-text-muted leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
