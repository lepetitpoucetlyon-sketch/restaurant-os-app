"use client";

import { useState } from "react";
import {
    BrainCircuit,
    MessageSquare,
    ShieldCheck,
    Wrench,
    TrendingUp,
    AreaChart,
    ChevronRight,
    Search,
    RefreshCw,
    Settings,
    Star,
    AlertTriangle,
    CheckCircle2,
    ArrowUpRight,
    Zap,
    Thermometer,
    Activity,
    Factory,
    DollarSign,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIntelligence } from "@/context/IntelligenceContext";
import { useToast } from "@/components/ui/Toast";

type TabId = 'reputation' | 'hr' | 'iot' | 'profitability' | 'simulator';

export default function IntelligencePage() {
    const {
        reviews,
        complianceAlerts,
        equipmentMetrics,
        predictiveAlerts,
        profitabilityAlerts,
        scenarios,
        runSimulation
    } = useIntelligence();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabId>('reputation');

    return (
        <div className="flex h-[calc(100vh-70px)] -m-6 flex-col bg-[#F8F9FA] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border-b border-neutral-100 px-8 py-4">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-[#1A1A1A] tracking-tight">Intelligence Artificielle</h1>
                        <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wider mt-0.5">
                            Système Expert de Gestion & Prédiction
                        </p>
                    </div>

                    <div className="flex items-center gap-3 ml-6 pl-6 border-l border-neutral-100">
                        <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] flex items-center justify-center">
                            <BrainCircuit className="w-6 h-6 text-[#00D764]" />
                        </div>
                        <div>
                            <p className="font-black text-[#1A1A1A]">IA Executive</p>
                            <p className="text-[11px] text-[#00D764] font-bold">Système Actif</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 rounded-xl">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Recalculer
                    </Button>
                    <Button className="h-10 bg-[#1A1A1A] rounded-xl text-white hover:bg-black">
                        <Settings className="w-4 h-4 mr-2" />
                        Paramètres IA
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-neutral-100 px-8">
                <div className="flex gap-10">
                    {[
                        { id: 'reputation', label: 'E-Réputation', icon: MessageSquare },
                        { id: 'hr', label: 'Conformité RH', icon: ShieldCheck },
                        { id: 'iot', label: 'Maintenance IoT', icon: Wrench },
                        { id: 'profitability', label: 'Profitabilité', icon: TrendingUp },
                        { id: 'simulator', label: 'Digital Twin', icon: AreaChart },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabId)}
                                className={cn(
                                    "flex items-center gap-2 py-4 border-b-2 font-bold text-sm transition-all",
                                    activeTab === tab.id
                                        ? "border-[#00D764] text-[#1A1A1A]"
                                        : "border-transparent text-[#ADB5BD] hover:text-[#6C757D]"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
                {/* 1. REPUTATION TAB */}
                {activeTab === 'reputation' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-[#E6F9EF] border border-[#00D764]/20 p-6 rounded-[24px]">
                                <h4 className="text-[#00D764] font-black text-xs uppercase tracking-widest mb-1">Sentiment Global</h4>
                                <div className="text-4xl font-black text-[#1A1A1A]">4.8/5</div>
                                <p className="text-[11px] font-bold text-[#00D764] mt-2">+0.2 ce mois-ci</p>
                            </div>
                            <div className="bg-white border border-neutral-100 p-6 rounded-[24px]">
                                <h4 className="text-[#ADB5BD] font-black text-xs uppercase tracking-widest mb-1">Avis en attente</h4>
                                <div className="text-4xl font-black text-[#1A1A1A]">{reviews.filter(r => !r.replied).length}</div>
                            </div>
                            <div className="bg-white border border-neutral-100 p-6 rounded-[24px]">
                                <h4 className="text-[#ADB5BD] font-black text-xs uppercase tracking-widest mb-1">Top Thématique</h4>
                                <div className="text-4xl font-black text-[#1A1A1A]">Cuisine</div>
                                <p className="text-[11px] font-bold text-[#00D764] mt-2">Plébiscité à 94%</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-neutral-50 flex justify-between items-center">
                                <h3 className="text-lg font-black text-[#1A1A1A]">Avis Clients 360°</h3>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Filtrer</Button>
                                    <Button size="sm" className="bg-[#00D764]">Tout Répondre (IA)</Button>
                                </div>
                            </div>
                            <div className="divide-y divide-neutral-50">
                                {reviews.map(review => (
                                    <div key={review.id} className="p-8 hover:bg-neutral-50/50 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-[#1A1A1A]">
                                                    {review.author.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-[#1A1A1A]">{review.author}</span>
                                                        <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded uppercase font-bold text-[#ADB5BD]">{review.source}</span>
                                                    </div>
                                                    <div className="flex gap-0.5 mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200")} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                                                review.sentiment === 'positive' ? "bg-[#E6F9EF] text-[#00D764]" : "bg-[#FEECEC] text-[#FF4D4D]"
                                            )}>
                                                Sentiment {review.sentiment}
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#495057] leading-relaxed mb-6 italic">"{review.content}"</p>

                                        {review.suggestedReply && (
                                            <div className="bg-[#F8F9FA] rounded-[20px] p-6 border border-neutral-100 relative">
                                                <div className="absolute -top-3 left-6 px-3 py-1 bg-[#1A1A1A] text-white text-[10px] font-black rounded-lg">SUGGESTION IA</div>
                                                <p className="text-sm text-[#6C757D] mb-4">{review.suggestedReply}</p>
                                                <div className="flex gap-3">
                                                    <Button size="sm" className="bg-[#00D764] rounded-xl h-9">Approuver & Envoyer</Button>
                                                    <Button size="sm" variant="outline" className="rounded-xl h-9">Modifier</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. HR COMPLIANCE TAB */}
                {activeTab === 'hr' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="bg-[#FEECEC] border border-[#FF4D4D]/20 p-8 rounded-[32px] flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#FF4D4D] flex items-center justify-center shrink-0 shadow-lg shadow-[#FF4D4D]/20">
                                <AlertTriangle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#1A1A1A]">Violation Critique Détectée</h3>
                                <p className="text-sm text-[#FF4D4D] font-bold">Un ou plusieurs shifts violent les conventions collectives (Hôtellerie-Restauration).</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm p-8">
                                <h3 className="text-lg font-black text-[#1A1A1A] mb-8">Alertes de Conformité</h3>
                                <div className="space-y-4">
                                    {complianceAlerts.map(alert => (
                                        <div key={alert.id} className="p-6 rounded-[24px] bg-[#F8F9FA] border border-neutral-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-[#1A1A1A]">{alert.userName}</span>
                                                <span className="px-2 py-1 bg-[#FF4D4D]/10 text-[#FF4D4D] text-[10px] font-black rounded uppercase">BLOQUANT</span>
                                            </div>
                                            <p className="text-sm text-[#6C757D]">{alert.message}</p>
                                            <Button variant="link" className="text-[#00D764] p-0 h-auto mt-4 font-bold text-xs uppercase tracking-widest">Voir sur le planning →</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#1A1A1A] rounded-[32px] shadow-2xl p-8 text-white">
                                <h3 className="text-lg font-black mb-8 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-[#00D764]" />
                                    Optimisation IA
                                </h3>
                                <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
                                    L'IA a analysé vos besoins pour vendredi soir. Nous suggérons de décaler le shift de **Thomas B.** de 30 minutes pour respecter le repos légal sans impacter le service.
                                </p>
                                <div className="space-y-4">
                                    <Button className="w-full bg-[#00D764] hover:bg-[#00B956] text-white font-black py-6 rounded-2xl">
                                        Appliquer l'Optimisation
                                    </Button>
                                    <Button variant="outline" className="w-full border-neutral-800 text-neutral-400 hover:text-white py-6 rounded-2xl">
                                        Ignorer (Risque Juridique)
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. IOT MAINTENANCE */}
                {activeTab === 'iot' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {equipmentMetrics.map(m => (
                                <div key={m.id} className="bg-white p-6 rounded-[28px] border border-neutral-100 shadow-sm relative overflow-hidden group">
                                    {m.anomalous && <div className="absolute top-0 right-0 w-2 h-full bg-[#FF4D4D] group-hover:w-4 transition-all" />}
                                    <div className="flex items-center gap-3 mb-4">
                                        {m.type === 'temperature' ? <Thermometer className="w-5 h-5 text-blue-500" /> : <Activity className="w-5 h-5 text-amber-500" />}
                                        <h4 className="font-bold text-[#1A1A1A] text-sm">{m.name}</h4>
                                    </div>
                                    <div className="text-2xl font-black text-[#1A1A1A]">{m.value}{m.type === 'temperature' ? '°C' : m.type === 'vibration' ? 'Hz' : 'W'}</div>
                                    <p className={cn("text-[10px] font-black uppercase mt-1", m.anomalous ? "text-[#FF4D4D]" : "text-[#00D764]")}>
                                        {m.anomalous ? 'Anomalie Détectée' : 'Normal'}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-[#FFF7E6] rounded-2xl text-[#FF9900]">
                                    <Wrench className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-[#1A1A1A]">Maintenance Prédictive</h3>
                                    <p className="text-xs font-bold text-[#ADB5BD] uppercase tracking-widest">Algorithme d'analyse fréquentielle actif</p>
                                </div>
                            </div>

                            {predictiveAlerts.map(alert => (
                                <div key={alert.id} className="bg-[#F8F9FA] rounded-[24px] p-8 border-l-8 border-[#FF9900]">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="px-2 py-0.5 bg-[#FF9900] text-white text-[10px] font-black rounded">PROBABILITÉ 89%</span>
                                                <span className="font-bold text-[#1A1A1A] text-lg">{alert.equipmentName}</span>
                                            </div>
                                            <p className="text-sm text-[#6C757D] italic">Risque de panne moteur détecté par vibrations anormales</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-[#ADB5BD] uppercase">Fenêtre Critique</p>
                                            <p className="font-black text-[#1A1A1A]">{alert.predictedFailureDate.toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-neutral-100 mb-6">
                                        <p className="text-sm text-[#495057] leading-relaxed">{alert.reason}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button className="bg-[#1A1A1A] text-white rounded-xl">Planifier Intervention</Button>
                                        <Button variant="ghost" className="text-[#ADB5BD] rounded-xl hover:text-[#1A1A1A]">Ignorer cette alerte</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. PROFITABILITY */}
                {activeTab === 'profitability' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm p-8">
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-8">Alertes de Rentabilité (Inflation en temps réel)</h3>
                            <div className="space-y-6">
                                {profitabilityAlerts.map(alert => (
                                    <div key={alert.productId} className="flex items-center gap-8 p-8 bg-[#FEECEC] border border-[#FF4D4D]/20 rounded-[28px]">
                                        <div className="w-16 h-16 rounded-2xl bg-[#FF4D4D] flex items-center justify-center shrink-0">
                                            <TrendingUp className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-black text-[#1A1A1A]">{alert.productName}</h4>
                                            <p className="text-sm text-[#FF4D4D] font-bold">Marge descendue à {alert.currentMargin}% (Cible min: {alert.targetMargin}%)</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-[#ADB5BD] mb-1">PRIX DE VENTE CONSEILLÉ</p>
                                            <div className="text-3xl font-black text-[#00D764]">{alert.suggestedPrice.toFixed(2)}€</div>
                                        </div>
                                        <Button className="bg-[#1A1A1A] rounded-xl h-12 px-8">Mettre à jour Carte</Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-[32px] border border-neutral-100 p-8 shadow-sm">
                                <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Matières Premières Critiques</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Huile Olive', change: '+22%', status: 'volatile' },
                                        { name: 'Bœuf (Filet)', change: '+14%', status: 'high' },
                                        { name: 'Électricité', change: '+35%', status: 'energy' },
                                    ].map(item => (
                                        <div key={item.name} className="flex items-center justify-between p-4 rounded-xl bg-neutral-50">
                                            <span className="font-bold text-[#1A1A1A]">{item.name}</span>
                                            <span className="text-[#FF4D4D] font-black">{item.change} ↗</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#1A1A1A] rounded-[32px] p-8 text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D764]/10 blur-3xl rounded-full" />
                                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#00D764]" />
                                    Optimisation Menu Engineering
                                </h3>
                                <p className="text-sm text-neutral-400 mb-6 font-medium">
                                    L'IA recommande de remplacer l'accompagnement "Salade de saison" par "Pommes Grenailles" sur l'Entrecôte pour restaurer 4 points de marge sans percevoir de baisse de valeur.
                                </p>
                                <Button className="w-full bg-[#00D764] rounded-2xl py-6 font-black">Appliquer Changement Ingrédient</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. SIMULATOR */}
                {activeTab === 'simulator' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="bg-[#00D764] text-white p-10 rounded-[40px] shadow-xl shadow-[#00D764]/20 overflow-hidden relative group">
                            <div className="absolute right-[-5%] top-[-10%] w-64 h-64 bg-white/10 blur-[80px] rounded-full group-hover:scale-110 transition-transform duration-700" />
                            <div className="relative z-10 max-w-2xl">
                                <h2 className="text-3xl font-black mb-4 tracking-tighter">Growth Simulator (Digital Twin)</h2>
                                <p className="text-white/80 font-medium leading-relaxed mb-8">
                                    Testez vos hypothèses business sur le "Jumeau Numérique" de votre restaurant avant de les implémenter. Notre IA utilise 3 ans d'historique local pour prédire le résultat.
                                </p>
                                <Button className="bg-white text-[#00D764] rounded-2xl h-14 px-10 font-black text-lg hover:bg-neutral-100 border-none shadow-xl">
                                    Lancer une Simulation
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-xl font-black text-[#1A1A1A]">Dernières Simulations</h3>
                                {scenarios.length === 0 ? (
                                    <div className="bg-white border border-dashed border-neutral-200 rounded-[32px] p-20 text-center">
                                        <AreaChart className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
                                        <p className="text-neutral-400 font-bold">Aucune simulation lancée pour le moment.</p>
                                    </div>
                                ) : (
                                    scenarios.map(sim => (
                                        <div key={sim.id} className="bg-white rounded-[32px] border border-neutral-100 p-8 shadow-sm">
                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <h4 className="text-xl font-black text-[#1A1A1A]">{sim.name}</h4>
                                                    <p className="text-sm text-[#ADB5BD] font-bold uppercase tracking-widest mt-1">SIMULATION RÉUSSIE • SCORE CONFIANCE {(sim.confidenceScore * 100).toFixed(0)}%</p>
                                                </div>
                                                <div className="px-4 py-2 bg-[#E6F9EF] text-[#00D764] rounded-2xl font-black text-xs">RECOMMANDÉ</div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-8">
                                                <div className="p-6 bg-neutral-50 rounded-2xl">
                                                    <p className="text-[10px] font-black text-[#ADB5BD] uppercase mb-2">Impact Revenue</p>
                                                    <div className="text-2xl font-black text-[#00D764]">+{sim.projections.revenueImpact.toLocaleString()}€</div>
                                                    <p className="text-[10px] text-neutral-400 mt-1">/ mois estimé</p>
                                                </div>
                                                <div className="p-6 bg-neutral-50 rounded-2xl">
                                                    <p className="text-[10px] font-black text-[#ADB5BD] uppercase mb-2">Impact Coût RH</p>
                                                    <div className="text-2xl font-black text-blue-500">{sim.projections.laborCostImpact.toLocaleString()}€</div>
                                                    <p className="text-[10px] text-neutral-400 mt-1">économie staff</p>
                                                </div>
                                                <div className="p-6 bg-[#1A1A1A] rounded-2xl text-white">
                                                    <p className="text-[10px] font-black text-neutral-500 uppercase mb-2">Profit Net</p>
                                                    <div className="text-2xl font-black text-[#00D764]">+{sim.projections.netProfitChange.toLocaleString()}€</div>
                                                    <p className="text-[10px] text-neutral-400 mt-1">marge additionnelle</p>
                                                </div>
                                            </div>

                                            <Button className="w-full mt-8 bg-neutral-100 text-[#1A1A1A] rounded-xl font-black h-12 border-none hover:bg-neutral-200">
                                                Voir Rapport de Faisabilité Complet
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-[#1A1A1A]">Exemples de Scénarios</h3>
                                {[
                                    { title: "Hausse Boissons (+10%)", desc: "Impact sur le ticket moyen et la fidélité.", icon: DollarSign },
                                    { title: "Ouverture Lundi Midi", desc: "Couverture des coûts fixes vs volume estimé.", icon: Clock },
                                    { title: "Passage Menu à 49€", desc: "Élasticité de la demande suite inflation.", icon: Utensils },
                                ].map((sc, i) => (
                                    <div key={i} className="bg-white p-6 rounded-[28px] border border-neutral-100 shadow-sm hover:translate-x-2 transition-transform cursor-pointer flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:bg-[#00D764]/10 transition-colors">
                                            <sc.icon className="w-5 h-5 text-neutral-400 group-hover:text-[#00D764]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1A1A1A]">{sc.title}</h4>
                                            <p className="text-[11px] text-[#ADB5BD]">{sc.desc}</p>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-neutral-300 ml-auto group-hover:text-[#00D764]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper for Utensils icon missing from lucide-react in certain versions
function Utensils(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
    )
}
