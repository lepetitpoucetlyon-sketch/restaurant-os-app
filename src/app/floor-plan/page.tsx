"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ZoomIn, ZoomOut, Move, Grid, LayoutTemplate, Plus, Save, MousePointer2, Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

const FloorPlanEditor = dynamic(
    () => import("@/components/floor-plan/FloorPlanEditor"),
    { ssr: false }
);

export default function FloorPlanPage() {
    const { showToast } = useToast();
    const [mode, setMode] = useState<'select' | 'add'>('select');
    const [showGrid, setShowGrid] = useState(true);

    const handleSave = () => {
        showToast("Configuration de salle enregistrée dans le Cloud", "premium");
    };

    const handleZoom = (type: 'in' | 'out') => {
        showToast(`Zoom ${type === 'in' ? 'avant' : 'arrière'} (Simulé)`, "info");
    };

    return (
        <div className="flex h-[calc(100vh-80px)] -m-8 flex-col overflow-hidden bg-bg-primary">
            {/* Professional Toolbar */}
            <div className="flex items-center justify-between bg-white border-b border-border px-10 py-5 z-40">
                <div className="flex items-center gap-10">
                    <div className="flex flex-col text-left">
                        <h1 className="text-2xl font-serif font-semibold text-text-primary tracking-tight">Configuration de Salle</h1>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-1">Éditeur d&apos;agencement intelligent</p>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div className="flex items-center gap-1.5 bg-bg-tertiary p-1 rounded-xl border border-border">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMode('select')}
                            className={cn(
                                "h-9 px-4 text-[11px] font-bold uppercase rounded-lg transition-all tracking-wider",
                                mode === 'select' ? "bg-white shadow-sm text-accent" : "text-text-muted hover:text-text-primary"
                            )}
                        >
                            <MousePointer2 strokeWidth={1.5} className="w-3.5 h-3.5 mr-2" />
                            Sélection
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setMode('add');
                                showToast("Mode ajout activé. Cliquez sur le plan pour placer un meuble.", "info");
                            }}
                            className={cn(
                                "h-9 px-4 text-[11px] font-bold uppercase rounded-lg transition-all tracking-wider",
                                mode === 'add' ? "bg-white shadow-sm text-accent" : "text-text-muted hover:text-text-primary"
                            )}
                        >
                            <Plus strokeWidth={1.5} className="w-3.5 h-3.5 mr-2" />
                            Ajouter
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 mr-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-success-soft border border-success/10 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-success-strong">Auto-Save actif</span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setShowGrid(!showGrid);
                            showToast(showGrid ? "Grille masquée" : "Grille affichée", "info");
                        }}
                        className={cn(
                            "h-11 px-5 border-border rounded-lg font-bold text-[12px] uppercase tracking-widest transition-all",
                            showGrid ? "bg-accent text-white border-accent" : "bg-white text-text-muted hover:border-text-primary hover:text-text-primary"
                        )}
                    >
                        <Grid strokeWidth={1.5} className="mr-2 h-4 w-4" />
                        Grille
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="btn-elegant-primary h-11 px-8 shadow-xl shadow-accent/10"
                    >
                        <Save strokeWidth={1.5} className="mr-2.5 h-4 w-4" />
                        Enregistrer
                    </Button>
                </div>
            </div>

            <div className="flex-1 relative bg-bg-primary overflow-hidden">
                {/* Visual texture for the floor */}
                {showGrid && (
                    <div className="absolute inset-0 opacity-[0.2] animate-in fade-in duration-700" style={{
                        backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                )}

                <FloorPlanEditor />

                {/* Floating Aesthetic Controls */}
                <div className="absolute top-10 right-10 flex flex-col gap-4 z-30">
                    <div className="flex flex-col gap-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-1.5 border border-border">
                        <button
                            onClick={() => handleZoom('in')}
                            className="w-11 h-11 flex items-center justify-center rounded-lg text-text-muted hover:text-accent hover:bg-bg-tertiary transition-all active:scale-95"
                        >
                            <ZoomIn strokeWidth={1.5} className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => handleZoom('out')}
                            className="w-11 h-11 flex items-center justify-center rounded-lg text-text-muted hover:text-accent hover:bg-bg-tertiary transition-all active:scale-95"
                        >
                            <ZoomOut strokeWidth={1.5} className="h-5 w-5" />
                        </button>
                        <div className="h-px bg-border mx-2.5 my-1" />
                        <button
                            onClick={() => showToast("Mode déplacement activé", "info")}
                            className="w-11 h-11 flex items-center justify-center rounded-lg text-text-muted hover:text-accent hover:bg-bg-tertiary transition-all active:scale-95"
                        >
                            <Move strokeWidth={1.5} className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-1.5 border border-border">
                        <button
                            onClick={() => showToast("Capture d'écran du plan...", "premium")}
                            className="w-11 h-11 flex items-center justify-center rounded-lg text-text-muted hover:text-accent hover:bg-bg-tertiary transition-all active:scale-95"
                        >
                            <Camera strokeWidth={1.5} className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => {
                                showToast("Actualisation des données de salle...", "info");
                                window.location.reload();
                            }}
                            className="w-11 h-11 flex items-center justify-center rounded-lg text-text-muted hover:text-accent hover:bg-bg-tertiary transition-all active:scale-95"
                        >
                            <RefreshCw strokeWidth={1.5} className="h-5 w-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => showToast("Changement de modèle d'agencement...", "info")}
                        className="w-11 h-11 flex items-center justify-center bg-accent text-white rounded-xl shadow-2xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <LayoutTemplate strokeWidth={1.5} className="w-5 h-5" />
                    </button>
                </div>

                {/* Legend Overlay */}
                <div className="absolute bottom-10 left-10 bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-2xl border border-border flex gap-8 z-30">
                    <div className="flex items-center gap-3">
                        <div className="w-3.5 h-3.5 rounded-full bg-white border border-border" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">Disponible</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3.5 h-3.5 rounded-full bg-warning" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">Réservé</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3.5 h-3.5 rounded-full bg-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">Sélectionné</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

