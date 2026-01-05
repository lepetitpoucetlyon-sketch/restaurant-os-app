"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Download,
  Calendar,
  Zap,
  Star,
  ShoppingBag,
  Plus,
  Package,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTables } from "@/context/TablesContext";
import { useOrders } from "@/context/OrdersContext";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/context/AuthContext";
import { generateKPIComparison, generateOccupancyRate, generateDailyRevenue } from "@/lib/mockDataGenerator";

const KpiCard = ({ title, value, trend, trendValue, icon: Icon }: any) => (
  <div className="card-elegant group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-mono font-medium text-text-primary tracking-tight">{value}</h3>
        </div>
        <div className={cn(
          "flex items-center gap-1 mt-3 text-[11px] font-semibold",
          trend === "up" ? "text-success" : "text-error"
        )}>
          {trend === "up" ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{trendValue}</span>
          <span className="text-text-muted font-normal ml-1">vs J-7</span>
        </div>
      </div>
      <div className="p-2.5 rounded-xl bg-bg-tertiary text-text-secondary transition-colors group-hover:bg-accent group-hover:text-white">
        <Icon strokeWidth={1.5} className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const SmartAlert = ({ type, title, message, action, time, onAction }: any) => (
  <div className={cn(
    "p-5 rounded-xl border transition-all hover:border-text-muted cursor-pointer bg-white",
    type === "critical" ? "border-error/20" : "border-border"
  )}>
    <div className="flex gap-4">
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
        type === "critical" ? "bg-error-soft text-error" :
          type === "warning" ? "bg-warning-soft text-warning" : "bg-success-soft text-success"
      )}>
        {type === "critical" ? <AlertCircle strokeWidth={1.5} className="w-5 h-5" /> :
          type === "warning" ? <Users strokeWidth={1.5} className="w-5 h-5" /> : <Star strokeWidth={1.5} className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-[14px] font-semibold text-text-primary truncate pr-2">{title}</h4>
          <span className="text-[10px] text-text-muted font-medium shrink-0">{time}</span>
        </div>
        <p className="text-[12px] text-text-secondary leading-relaxed mb-4">{message}</p>
        {action && (
          <button
            onClick={(e) => { e.stopPropagation(); onAction?.(); }}
            className="text-[11px] font-bold uppercase tracking-wider text-text-primary hover:text-accent transition-colors flex items-center gap-1.5"
          >
            {action}
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  </div>
);

import { cn } from "@/lib/utils";

import { useToast } from "@/components/ui/Toast";
import { QuantitySelectorPreview } from "@/components/ui/QuantitySelectorPreview";


export default function Home() {
  const router = useRouter();
  const { tables } = useTables();
  const { totalRevenue } = useOrders();
  const { lowStockItems } = useInventory();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  // Use mock data for realistic demo values
  const [mockData, setMockData] = useState<{
    revenue: number;
    occupancy: number;
    tickets: number;
    avgTicket: number;
  } | null>(null);

  useEffect(() => {
    const kpis = generateKPIComparison();
    setMockData({
      revenue: kpis.revenue.value,
      occupancy: kpis.occupancy.value,
      tickets: kpis.tickets.value,
      avgTicket: kpis.avgTicket.value
    });
  }, []);

  const occupiedTables = tables.filter(t => ['seated', 'ordered', 'eating', 'paying'].includes(t.status)).length;
  const totalTables = tables.length;
  const occupancyRate = mockData?.occupancy || (totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0);
  const displayRevenue = mockData?.revenue || totalRevenue;

  const handleExport = () => {
    showToast("Génération du rapport d'exploitation en cours...", "premium");
    setTimeout(() => {
      showToast("Rapport exporté avec succès (PDF)", "success");
    }, 1500);
  };

  // Quick Actions
  const quickActions = [
    { label: "Nouvelle Commande", icon: Plus, href: "/pos", color: "bg-[#00D764] text-white" },
    { label: "Réservation", icon: Calendar, href: "/reservations", color: "bg-white text-[#1A1A1A] border border-neutral-100" },
    { label: "État Stocks", icon: Package, href: "/inventory", color: "bg-white text-[#1A1A1A] border border-neutral-100" },
    { label: "Rapports", icon: BarChart3, href: "/analytics", color: "bg-white text-[#1A1A1A] border border-neutral-100" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Executive Header area inside main content */}
      <div className="flex items-end justify-between border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-2 text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <Calendar strokeWidth={1.5} className="w-3.5 h-3.5 text-accent" />
            Lundi 29 Décembre • Service du midi en cours
          </div>
          <h2 className="text-5xl font-serif font-medium text-text-primary tracking-tight">
            Bonjour, {currentUser?.name.split(' ')[0]}
          </h2>
          <p className="text-text-secondary text-base mt-2 font-serif italic">Operational Status: <span className="text-success font-sans not-italic font-bold text-sm uppercase tracking-wider ml-1">Excellence</span></p>
        </div>
        <button
          onClick={handleExport}
          className="btn-elegant-outline h-12 px-8"
        >
          <Download strokeWidth={1.5} className="w-4 h-4" />
          Exporter le rapport
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          const isPrimary = i === 0;
          return (
            <Link key={i} href={action.href}>
              <button className={cn(
                "h-11 px-6 rounded-lg text-[13px] font-semibold flex items-center gap-2.5 transition-all active:scale-95",
                isPrimary ? "bg-accent text-white hover:bg-black" : "bg-white border border-border text-text-primary hover:bg-bg-tertiary"
              )}>
                <Icon strokeWidth={1.5} className="w-4 h-4" />
                {action.label}
              </button>
            </Link>
          );
        })}
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="CA Journalier (réel)"
          value={`${displayRevenue.toLocaleString('fr-FR')} €`}
          trend="up"
          trendValue="+12%"
          icon={ShoppingBag}
          color="text-[#00D764]"
        />
        <KpiCard
          title="Tickets Encaissés"
          value={mockData?.tickets || 0}
          trend="up"
          trendValue="+8%"
          icon={TrendingUp}
          color="text-indigo-600"
        />
        <KpiCard
          title="Articles Bas Stock"
          value={`${lowStockItems.length} Alerte(s)`}
          trend={lowStockItems.length > 3 ? "down" : "up"}
          trendValue={lowStockItems.length > 3 ? "Action" : "Sûr"}
          icon={Zap}
          color="text-amber-500"
        />
        <KpiCard
          title="Taux d'Occupation"
          value={`${occupancyRate}%`}
          trend="up"
          trendValue="+15%"
          icon={Users}
          color="text-[#00D764]"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Predictive Chart placeholder */}
        <div className="xl:col-span-2 card-elegant overflow-hidden relative border-none shadow-none bg-white">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-serif font-medium text-text-primary">Cash-Flow Prédictif</h3>
              <p className="text-sm text-text-muted mt-1">Analyse prévisionnelle basée sur 90 jours d&apos;activité</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-200" />
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Réel</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider">IA Prédictif</span>
              </div>
            </div>
          </div>

          {/* Aesthetic SVG Graph Placeholder */}
          <div className="h-[320px] w-full mt-4 flex items-end gap-1 relative">
            <div className="absolute inset-0 border-b border-border flex items-end justify-between px-2 text-[10px] text-text-muted font-mono pb-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
            <svg viewBox="0 0 800 300" className="w-full h-full relative z-10 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="0" y1="75" x2="800" y2="75" stroke="#F0F0F0" strokeWidth="1" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#F0F0F0" strokeWidth="1" />
              <line x1="0" y1="225" x2="800" y2="225" stroke="#F0F0F0" strokeWidth="1" />

              <path d="M0,250 C100,280 200,100 300,180 S400,20 500,150 S600,280 700,50 S800,100" fill="transparent" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M0,250 C100,280 200,100 300,180 S400,20 500,150 S600,280 700,50 S800,100 V300 H0 Z" fill="url(#chartGradient)" />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-text-muted mt-8 opacity-60">
            <span>Octobre</span>
            <span>Novembre</span>
            <span>Décembre</span>
          </div>
        </div>

        {/* Intelligent Alerts Side Panel */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-medium text-text-primary flex items-center gap-3">
              Intelligence
              <span className="bg-accent text-white text-[10px] px-2 py-0.5 rounded-full font-mono">03</span>
            </h3>
            <button className="text-[12px] font-bold text-text-muted hover:text-accent transition-colors">VOIR TOUT</button>
          </div>

          <div className="space-y-4">
            <SmartAlert
              type="critical"
              title="Risque Critique : Stock"
              message="Rupture probable de Mozzarella di Bufala d&apos;ici 48h. Stock actuel : 2.5kg."
              action="Commander"
              time="A l&apos;instant"
              onAction={() => showToast("Commande fournisseur transmise à Caseificio Campana", "premium")}
            />
            <SmartAlert
              type="warning"
              title="Personnel : Forte Affluence"
              message="Prévision de +25% de couverts ce vendredi. L&apos;IA suggère +1 serveur."
              action="Gérer Planning"
              time="Il y a 10 min"
              onAction={() => showToast("Ouverture du module Planning Prédictif", "info")}
            />
            <SmartAlert
              type="success"
              title="Tendance Menu"
              message="Les ventes de Risotto aux Truffes sont en hausse de 15% cette semaine."
              action="Voir Détails"
              time="Il y a 1h"
              onAction={() => showToast("Analyse des ventes détaillée chargée", "success")}
            />
          </div>

          {/* Quick CTA Card */}
          <div className="bg-accent p-8 rounded-xl relative overflow-hidden group shadow-2xl shadow-black/10">
            <div className="relative z-10">
              <h4 className="text-white font-serif text-xl mb-3">Service imminent</h4>
              <p className="text-white/60 text-sm mb-8 leading-relaxed">Prêt pour le prochain service ? Ouvrez le terminal de vente.</p>
              <Link href="/pos">
                <button className="w-full h-12 rounded-lg bg-white text-accent font-bold text-sm tracking-wide transition-all hover:bg-white/90 active:scale-95 shadow-lg">
                  Lancer le Service
                </button>
              </Link>
            </div>
            <div className="absolute top-0 right-0 p-8 transform translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700 opacity-10">
              <Zap strokeWidth={1} className="w-48 h-48 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Design Review Preview */}
      <QuantitySelectorPreview />
    </div>
  );
}
