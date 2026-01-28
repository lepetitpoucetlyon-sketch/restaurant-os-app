"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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
  BarChart3,
  Sun,
  HandMetal
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTables } from "@/context/TablesContext";
import { useOrders } from "@/context/OrdersContext";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/context/AuthContext";
import { generateKPIComparison } from "@/lib/mockDataGenerator";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { usePageSetting } from "@/components/settings/ContextualSettings";
import { useIsMobile } from "@/hooks";
import { kpiContainerVariants, kpiCardVariants, fadeInUp, staggerContainer } from "@/lib/motion";

const KpiCard = ({ title, value, trend, trendValue, icon: Icon, delay = 0, tutorialId, isMobile }: any) => (
  <motion.div
    variants={kpiCardVariants}
    data-tutorial={tutorialId}
    whileHover={!isMobile ? {
      y: -4,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    } : {}}
    className={cn(
      "group cursor-pointer card-premium",
      isMobile ? "p-4 min-h-[110px]" : "p-6 md:p-8 min-h-[140px]"
    )}
  >
    <div className="flex flex-col gap-3 md:gap-4 h-full justify-between">
      <div className="flex items-center justify-between">
        <p className="text-[8px] md:text-[10px] font-black text-accent-gold uppercase tracking-[0.25em]">{title}</p>
        <div className="p-1.5 rounded-full bg-bg-tertiary/50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
          <Icon strokeWidth={1} className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-2 md:gap-3">
          <h3 className={cn(
            "font-sans font-light text-text-primary tracking-tight",
            isMobile ? "text-2xl" : "text-4xl"
          )}>
            {value}
          </h3>
          <div className={cn(
            "text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full",
            trend === "up" ? "bg-success-soft text-success" : "bg-error-soft text-error"
          )}>
            {trend === "up" ? "↑" : "↓"}
          </div>
        </div>
        <p className="text-[8px] md:text-[10px] text-text-muted font-medium italic mt-1 md:mt-2 truncate">
          {trendValue}
        </p>
      </div>
    </div>
  </motion.div>
);

const SmartAlert = ({ type, title, message, action, time, onAction, index, isMobile }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
    className={cn(
      "border-b border-border/50 group cursor-pointer",
      isMobile ? "py-4" : "py-6"
    )}
  >
    <div className="flex gap-4 md:gap-6 items-start">
      <div className={cn(
        "w-1.5 h-1.5 rounded-full mt-2 shrink-0",
        type === "critical" ? "bg-error" : type === "warning" ? "bg-warning" : "bg-success"
      )} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1 md:mb-2">
          <h4 className="text-[14px] md:text-[15px] font-serif font-semibold text-text-primary truncate">{title}</h4>
          <span className="text-[8px] font-black text-text-muted uppercase tracking-widest shrink-0 ml-4">{time}</span>
        </div>
        <p className="text-[12px] md:text-[13px] text-text-secondary leading-relaxed mb-3 font-sans font-light">
          {message}
        </p>
        {action && (
          <button
            onClick={(e) => { e.stopPropagation(); onAction?.(); }}
            className="text-[9px] font-black uppercase tracking-[0.2em] text-accent-gold flex items-center gap-2"
          >
            {action}
            <div className="w-6 h-[1px] bg-accent-gold/30 group-hover:w-10 group-hover:bg-accent transition-all duration-300" />
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

export default function Home() {
  const router = useRouter();
  const { tables } = useTables();
  const { totalRevenue } = useOrders();
  const { lowStockItems } = useInventory();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const showCA = usePageSetting('dashboard', 'show_ca', true);
  const showStaffMetrics = usePageSetting('dashboard', 'show_staff_metrics', true);
  const showWeatherWidget = usePageSetting('dashboard', 'show_weather_widget', true);
  const dailyCATarget = usePageSetting('dashboard', 'ca_target', 5000);
  const dailyTicketsTarget = usePageSetting('dashboard', 'tickets_target', 100);
  const occupancyTarget = usePageSetting('dashboard', 'occupation_target', 85);

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

  const quickActions = [
    { label: t('dashboard.actions.new_order'), icon: Plus, href: "/pos", primary: true },
    { label: t('dashboard.actions.reservation'), icon: Calendar, href: "/reservations" },
    { label: t('dashboard.actions.inventory'), icon: Package, href: "/inventory" },
    { label: t('dashboard.actions.analytics'), icon: BarChart3, href: "/analytics" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 md:space-y-16 px-4 md:px-8 max-w-7xl mx-auto pb-24 lg:pb-8"
    >
      {/* Executive Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-4 md:pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2 md:space-y-6">
          <div className="flex items-center gap-3 text-accent-gold text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">
            <div className="w-6 md:w-12 h-[1px] bg-accent-gold/30" />
            {format(new Date(), "EEEE d MMMM", { locale: fr })} • {new Date().getHours() < 16 ? "MIDI" : "SOIR"}

            {showWeatherWidget && (
              <div className="flex items-center gap-2 px-2 py-0.5 bg-accent/5 rounded-full border border-accent/10">
                <Sun className="w-2.5 h-2.5 text-warning" />
                <span className="text-[8px] font-bold text-text-secondary">PARIS 14°C</span>
              </div>
            )}
          </div>

          <h2 className="text-4xl md:text-7xl font-serif font-light text-text-primary tracking-tight leading-[1.1]">
            {t('dashboard.hello')}, <br />
            <span className="italic">{currentUser?.name.split(' ')[0]}</span>
          </h2>
        </div>

        {!isMobile && (
          <div className="flex flex-col items-end gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{t('dashboard.status')}</p>
              <p className="text-[13px] font-serif italic text-accent">{t('dashboard.status_text')}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Actions Scroll */}
      <div className="flex gap-4 overflow-x-auto py-2 -mx-4 px-4 scrollbar-hide md:mx-0 md:px-0 md:flex-wrap">
        {quickActions.map((action, i) => (
          <Link key={i} href={action.href}>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className={cn(
                "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all",
                action.primary ? "bg-accent-gold text-white shadow-lg shadow-accent-gold/20" : "bg-bg-secondary border border-border"
              )}>
                <action.icon strokeWidth={1.5} className="w-5 h-5" />
              </div>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary">
                {action.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* KPI GRID - Optimization Responsive */}
      <motion.div
        variants={kpiContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
      >
        {showCA && (
          <KpiCard
            title="CHIFFRE D'AFFAIRES"
            value={`${displayRevenue.toLocaleString('fr-FR')}€`}
            trend={displayRevenue >= dailyCATarget ? "up" : "down"}
            trendValue={displayRevenue >= dailyCATarget ? "Objectif Atteint" : `${dailyCATarget - displayRevenue}€ manquant`}
            icon={ShoppingBag}
            isMobile={isMobile}
          />
        )}
        <KpiCard
          title="TICKETS"
          value={mockData?.tickets || 0}
          trend={(mockData?.tickets || 0) >= dailyTicketsTarget ? "up" : "down"}
          trendValue="Service fluide"
          icon={TrendingUp}
          isMobile={isMobile}
        />
        <KpiCard
          title="STOCK ALERTE"
          value={lowStockItems.length}
          trend={lowStockItems.length > 5 ? "down" : "up"}
          trendValue={lowStockItems.length > 5 ? "Action requise" : "Niveaux sains"}
          icon={Zap}
          isMobile={isMobile}
        />
        <KpiCard
          title="OCCUPATION"
          value={`${occupancyRate}%`}
          trend={occupancyRate >= occupancyTarget ? "up" : "down"}
          trendValue={occupancyRate >= occupancyTarget ? "Complet" : "Disponibilité"}
          icon={Users}
          isMobile={isMobile}
        />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Charts Container */}
        <motion.div
          variants={fadeInUp}
          className="xl:col-span-2 card-premium p-6 md:p-10"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-light text-text-primary tracking-tight">Analyse Prédictive</h3>
              <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-black">Projection IA • Next 24h</p>
            </div>
            {!isMobile && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full border border-border" />
                  <span className="text-[9px] font-black text-text-muted uppercase">Réalisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-gold" />
                  <span className="text-[9px] font-black text-accent-gold uppercase">Prédictif</span>
                </div>
              </div>
            )}
          </div>

          <div className="h-[200px] md:h-[300px] w-full relative">
            <svg viewBox="0 0 800 300" className="w-full h-full relative z-10 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent-gold)" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="var(--color-accent-gold)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0,250 C100,280 200,100 300,180 S400,20 500,150 S600,280 700,50 S750,80 800,100"
                fill="transparent"
                stroke="var(--color-accent-gold)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2 }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Intelligence Alerts */}
        <motion.div
          variants={fadeInUp}
          className="card-premium p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6 border-b border-border/30 pb-4">
            <h3 className="text-xl font-serif font-light text-text-primary">Oracle Intelligence</h3>
            <span className="text-[9px] font-black text-accent-gold uppercase bg-bg-tertiary px-2 py-1 rounded-full">03 ALERTES</span>
          </div>

          <div className="space-y-2">
            <SmartAlert
              type="critical"
              title="Rupture Proche"
              message="Le stock de Saumon Ecosse sera épuisé d'ici 14:00 selon les projections de commande."
              action="Commander"
              time="MAINTENANT"
              index={0}
              isMobile={isMobile}
              onAction={() => showToast("Commande transmise", "premium")}
            />
            <SmartAlert
              type="warning"
              title="Optimisation RH"
              message="Surcharge prévue en salle entre 20h et 22h (+12% vs personnel présent)."
              action="Ajuster"
              time="2h"
              index={1}
              isMobile={isMobile}
              onAction={() => router.push('/planning')}
            />
            <SmartAlert
              type="success"
              title="Objectif Atteint"
              message="Le ticket moyen a augmenté de 4.2€ aujourd'hui grâce aux suggestions du POS."
              time="1h"
              index={2}
              isMobile={isMobile}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
