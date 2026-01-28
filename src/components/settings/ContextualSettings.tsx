"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Check, RotateCcw, ChevronDown, ChevronUp, Minus, Plus, Paintbrush, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { PageKey, PageSettingConfig, PermissionRole } from "@/types/permissions.types";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

// ============ SETTINGS PER PAGE DEFINITIONS ============

const PAGE_SETTINGS: Record<PageKey, { title: string; settings: PageSettingConfig[] }> = {
    dashboard: {
        title: "Paramètres du Tableau de Bord",
        settings: [
            { key: "show_ca", label: "Afficher le CA", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "period_default", label: "Période par défaut", group: "logic", type: "select", options: [{ value: "day", label: "Jour" }, { value: "week", label: "Semaine" }, { value: "month", label: "Mois" }], roles: ["super_admin", "directeur", "manager"] },
            { key: "ca_target", label: "Objectif CA journalier (€)", group: "logic", type: "number", min: 0, max: 100000, roles: ["super_admin", "directeur"] },
            { key: "tickets_target", label: "Objectif tickets/jour", group: "logic", type: "number", min: 0, max: 500, roles: ["super_admin", "directeur"] },
            { key: "occupation_target", label: "Objectif occupation (%)", group: "logic", type: "number", min: 0, max: 100, roles: ["super_admin", "directeur"] },
            { key: "show_staff_metrics", label: "Afficher métriques équipe", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "show_weather_widget", label: "Afficher météo", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager", "serveur", "hotesse"] },
            { key: "auto_refresh_interval", label: "Rafraîchissement auto (sec)", group: "logic", type: "number", min: 10, max: 300, roles: ["super_admin", "directeur", "manager"] },
            { key: "show_reservations_preview", label: "Aperçu réservations à venir", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager", "hotesse"] },
        ],
    },
    floor_plan: {
        title: "Paramètres du Plan de Salle",
        settings: [
            { key: "show_grid", label: "Afficher la grille", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "grid_size", label: "Taille de grille", group: "style", type: "select", options: [{ value: "20", label: "20px" }, { value: "40", label: "40px" }, { value: "60", label: "60px" }], roles: ["super_admin", "directeur"] },
            { key: "snap_to_grid", label: "Alignement grille", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "default_view", label: "Vue par défaut", group: "style", type: "select", options: [{ value: "2d", label: "2D" }, { value: "3d", label: "3D" }], roles: ["super_admin", "directeur", "manager"] },
            { key: "lock_zones", label: "Verrouiller les zones", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "table_numbering_auto", label: "Numérotation auto tables", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "show_server_zones", label: "Afficher zones serveurs", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "show_capacity_limits", label: "Afficher limites capacité", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "edit_mode_locked", label: "Verrouiller mode édition", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
        ],
    },
    reservations: {
        title: "Paramètres des Réservations",
        settings: [
            { key: "default_view", label: "Vue par défaut", group: "style", type: "select", options: [{ value: "day", label: "Jour" }, { value: "week", label: "Semaine" }, { value: "list", label: "Liste" }], roles: ["super_admin", "directeur", "manager", "hotesse"] },
            { key: "default_duration", label: "Durée par défaut (min)", group: "logic", type: "select", options: [{ value: "60", label: "60 min" }, { value: "90", label: "90 min" }, { value: "120", label: "120 min" }], roles: ["super_admin", "directeur"] },
            { key: "min_advance", label: "Délai min avant résa (h)", group: "logic", type: "number", min: 0, max: 48, roles: ["super_admin", "directeur"] },
            { key: "max_advance", label: "Délai max avant résa (j)", group: "logic", type: "number", min: 1, max: 90, roles: ["super_admin", "directeur"] },
            { key: "auto_confirm", label: "Confirmation automatique", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "allow_overbooking", label: "Autoriser l'overbooking", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "noshow_delay", label: "Délai no-show (min)", group: "logic", type: "number", min: 5, max: 60, roles: ["super_admin", "directeur", "manager"] },
            { key: "sms_confirmation", label: "Confirmation par SMS", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "email_confirmation", label: "Confirmation par email", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "reminder_hours_before", label: "Rappel X heures avant", group: "logic", type: "number", min: 1, max: 48, roles: ["super_admin", "directeur"] },
            { key: "vip_priority", label: "Réservation VIP prioritaire", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "auto_assign_tables", label: "Attribution auto tables", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "waitlist_enabled", label: "Liste d'attente activée", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
        ],
    },
    pos: {
        title: "Paramètres de la Caisse",
        settings: [
            { key: "service_mode", label: "Mode service", group: "logic", type: "select", options: [{ value: "table", label: "Table" }, { value: "counter", label: "Comptoir" }, { value: "mixed", label: "Mixte" }], roles: ["super_admin", "directeur"] },
            { key: "button_size", label: "Taille des boutons", group: "style", type: "select", options: [{ value: "small", label: "Petit" }, { value: "medium", label: "Moyen" }, { value: "large", label: "Grand" }], roles: ["super_admin", "directeur", "manager"] },
            { key: "show_images", label: "Afficher les images", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "auto_print", label: "Impression auto ticket", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "tips_enabled", label: "Pourboires activés", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "sound_enabled", label: "Sons activés", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "max_discount_no_pin", label: "Remise max sans code (%)", group: "logic", type: "number", min: 0, max: 50, roles: ["super_admin", "directeur"] },
            { key: "split_bill_enabled", label: "Addition divisée", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "quick_pay_buttons", label: "Boutons paiement rapide", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "cash_drawer_auto_open", label: "Ouverture auto caisse", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "require_table_selection", label: "Table obligatoire", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "show_stock_level", label: "Afficher niveau stock", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "keyboard_shortcuts", label: "Raccourcis clavier", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "loyalty_points_visible", label: "Points fidélité visibles", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
        ],
    },
    kitchen: {
        title: "Paramètres Cuisine & Recettes",
        settings: [
            { key: "default_unit", label: "Unité par défaut", group: "logic", type: "select", options: [{ value: "g", label: "Grammes" }, { value: "kg", label: "Kilos" }, { value: "L", label: "Litres" }, { value: "portions", label: "Portions" }], roles: ["super_admin", "directeur", "chef_cuisinier"] },
            { key: "default_yield", label: "Rendement par défaut", group: "logic", type: "number", min: 1, max: 100, roles: ["super_admin", "directeur", "chef_cuisinier"] },
            { key: "show_costs_to_cooks", label: "Afficher coûts aux cuisiniers", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "show_margins", label: "Afficher les marges", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "default_waste_percent", label: "% perte par défaut", group: "logic", type: "number", min: 0, max: 50, roles: ["super_admin", "directeur", "chef_cuisinier"] },
            { key: "show_nutrition", label: "Afficher nutrition", group: "style", type: "toggle", roles: ["super_admin", "directeur", "chef_cuisinier"] },
            { key: "show_allergens", label: "Afficher allergènes", group: "style", type: "toggle", roles: ["super_admin", "directeur", "chef_cuisinier"] },
            { key: "target_food_cost", label: "% food cost cible", group: "logic", type: "number", min: 10, max: 60, roles: ["super_admin", "directeur"] },
            { key: "recipe_scaling_enabled", label: "Mise à l'échelle recettes", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "chef_cuisinier"] },
            { key: "ingredient_substitution_alerts", label: "Alertes substitution ingrédients", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "chef_cuisinier"] },
            { key: "batch_cooking_mode", label: "Mode production par lots", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "chef_cuisinier"] },
            { key: "print_recipe_cards", label: "Impression fiches recettes", group: "style", type: "toggle", roles: ["super_admin", "directeur", "chef_cuisinier"] },
            { key: "plating_guides", label: "Guides de dressage", group: "style", type: "toggle", roles: ["super_admin", "directeur", "chef_cuisinier"] },
        ],
    },
    kds: {
        title: "Paramètres KDS",
        settings: [
            { key: "columns", label: "Nombre de colonnes", group: "style", type: "select", options: [{ value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }, { value: "5", label: "5" }], roles: ["super_admin", "directeur", "manager"] },
            { key: "sort_mode", label: "Tri des commandes", group: "logic", type: "select", options: [{ value: "fifo", label: "FIFO" }, { value: "priority", label: "Priorité" }, { value: "type", label: "Type" }], roles: ["super_admin", "directeur", "manager"] },
            { key: "alert_delay", label: "Alerte retard (min)", group: "logic", type: "number", min: 5, max: 60, roles: ["super_admin", "directeur"] },
            { key: "sound_new_order", label: "Son nouvelle commande", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "sound_alert", label: "Son alerte retard", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "show_table", label: "Afficher table/client", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "highlight_allergies", label: "Signaler allergies", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "bump_confirmation", label: "Confirmation bump", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "order_age_colors", label: "Couleurs selon ancienneté", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "consolidate_items", label: "Regrouper items identiques", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "prep_time_estimates", label: "Estimation temps préparation", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "chef_cuisinier"] },
        ],
    },
    inventory: {
        title: "Paramètres Inventaire",
        settings: [
            { key: "low_stock_threshold", label: "Seuil stock bas", group: "logic", type: "number", min: 1, max: 100, roles: ["super_admin", "directeur", "manager"] },
            { key: "critical_threshold", label: "Seuil critique", group: "logic", type: "number", min: 1, max: 50, roles: ["super_admin", "directeur"] },
            { key: "default_unit", label: "Unité par défaut", group: "logic", type: "select", options: [{ value: "kg", label: "kg" }, { value: "L", label: "L" }, { value: "units", label: "Unités" }], roles: ["super_admin", "directeur", "manager"] },
            { key: "valuation_method", label: "Méthode valorisation", group: "logic", type: "select", options: [{ value: "fifo", label: "FIFO" }, { value: "lifo", label: "LIFO" }, { value: "weighted", label: "Moy. pondérée" }], roles: ["super_admin", "directeur"] },
            { key: "show_valuation", label: "Afficher valeur stock", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "auto_order_enabled", label: "Commande auto activée", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "supplier_comparison", label: "Comparaison fournisseurs", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "barcode_scanning", label: "Scan codes-barres", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "lot_tracking", label: "Traçabilité lots", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "expiry_first_out", label: "DLC prioritaire sortie", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "waste_tracking_mandatory", label: "Suivi pertes obligatoire", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "count_frequency_days", label: "Fréquence inventaire (jours)", group: "logic", type: "number", min: 1, max: 30, roles: ["super_admin", "directeur"] },
        ],
    },
    storage_map: {
        title: "Paramètres Stockage",
        settings: [
            { key: "dlc_alert_days", label: "Alerte DLC (jours avant)", group: "logic", type: "number", min: 1, max: 14, roles: ["super_admin", "directeur", "manager"] },
            { key: "compact_view", label: "Vue compacte", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "temperature_alerts", label: "Alertes température", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "zone_capacity_display", label: "Afficher capacité zones", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "fifo_enforcement", label: "Forcer FIFO", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
        ],
    },
    crm: {
        title: "Paramètres CRM",
        settings: [
            { key: "default_view", label: "Vue par défaut", group: "style", type: "select", options: [{ value: "list", label: "Liste" }, { value: "cards", label: "Cartes" }, { value: "table", label: "Tableau" }], roles: ["super_admin", "directeur", "manager"] },
            { key: "required_phone", label: "Téléphone obligatoire", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "required_email", label: "Email obligatoire", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "retention_months", label: "Rétention données (mois)", group: "logic", type: "number", min: 6, max: 120, roles: ["super_admin"] },
            { key: "vip_auto_upgrade", label: "Upgrade VIP auto", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "vip_threshold_visits", label: "Seuil visites VIP", group: "logic", type: "number", min: 1, max: 50, roles: ["super_admin", "directeur"] },
            { key: "vip_threshold_spend", label: "Seuil dépenses VIP (€)", group: "logic", type: "number", min: 100, max: 10000, roles: ["super_admin", "directeur"] },
            { key: "birthday_reminders", label: "Rappels anniversaires", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "feedback_request_enabled", label: "Demande feedback auto", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "gdpr_consent_required", label: "Consentement RGPD requis", group: "logic", type: "toggle", roles: ["super_admin"] },
        ],
    },
    staff: {
        title: "Paramètres Équipe",
        settings: [
            { key: "show_salaries_to_managers", label: "Salaires visibles aux managers", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "doc_expiry_alert_days", label: "Alerte expiration docs (jours)", group: "logic", type: "number", min: 7, max: 90, roles: ["super_admin", "directeur"] },
            { key: "timesheet_approval_required", label: "Approbation pointages", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "overtime_auto_calculate", label: "Calcul auto heures sup", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "photo_id_required", label: "Photo ID obligatoire", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "skills_matrix_enabled", label: "Matrice compétences", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "performance_reviews_enabled", label: "Évaluations performance", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "training_tracking", label: "Suivi formations", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "contract_alerts", label: "Alertes contrats", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
        ],
    },
    planning: {
        title: "Paramètres Planning",
        settings: [
            { key: "week_start", label: "Premier jour semaine", group: "logic", type: "select", options: [{ value: "monday", label: "Lundi" }, { value: "sunday", label: "Dimanche" }], roles: ["super_admin", "directeur"] },
            { key: "default_view", label: "Vue par défaut", group: "style", type: "select", options: [{ value: "day", label: "Jour" }, { value: "week", label: "Semaine" }, { value: "month", label: "Mois" }], roles: ["super_admin", "directeur", "manager"] },
            { key: "max_hours_day", label: "Max heures/jour", group: "logic", type: "number", min: 6, max: 12, roles: ["super_admin", "directeur"] },
            { key: "max_hours_week", label: "Max heures/semaine", group: "logic", type: "number", min: 20, max: 48, roles: ["super_admin", "directeur"] },
            { key: "min_rest_hours", label: "Repos min entre shifts (h)", group: "logic", type: "number", min: 8, max: 14, roles: ["super_admin", "directeur"] },
            { key: "notify_on_publish", label: "Notifier à la publication", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "require_swap_approval", label: "Valider les échanges", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "overtime_enabled", label: "Heures sup autorisées", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "auto_schedule_enabled", label: "Planification auto (IA)", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "availability_required", label: "Disponibilités obligatoires", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "shift_templates", label: "Modèles de shifts", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "labor_cost_preview", label: "Aperçu coût main d'oeuvre", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "conflict_detection", label: "Détection conflits", group: "logic", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "mobile_clock_in", label: "Pointage mobile", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
        ],
    },
    leaves: {
        title: "Paramètres Congés",
        settings: [
            { key: "require_approval", label: "Approbation requise", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "min_advance_days", label: "Délai min demande (jours)", group: "logic", type: "number", min: 1, max: 30, roles: ["super_admin", "directeur"] },
            { key: "max_concurrent_leaves", label: "Max congés simultanés", group: "logic", type: "number", min: 1, max: 10, roles: ["super_admin", "directeur"] },
            { key: "blackout_dates_enabled", label: "Dates bloquées", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "auto_approve_short_leaves", label: "Auto-approbation congés courts", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "carry_over_days", label: "Report jours congés", group: "logic", type: "number", min: 0, max: 30, roles: ["super_admin", "directeur"] },
            { key: "sick_leave_certificate", label: "Justificatif maladie", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "leave_calendar_public", label: "Calendrier congés public", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
        ],
    },
    finance: {
        title: "Paramètres Finance",
        settings: [
            { key: "fiscal_year_start", label: "Début exercice fiscal", group: "logic", type: "text", roles: ["super_admin"] },
            { key: "default_payment_terms", label: "Conditions paiement (jours)", group: "logic", type: "number", min: 0, max: 90, roles: ["super_admin", "directeur", "comptable"] },
            { key: "invoice_prefix", label: "Préfixe factures", group: "logic", type: "text", roles: ["super_admin", "directeur"] },
            { key: "export_format", label: "Format export", group: "style", type: "select", options: [{ value: "pdf", label: "PDF" }, { value: "csv", label: "CSV" }, { value: "excel", label: "Excel" }], roles: ["super_admin", "directeur", "comptable"] },
            { key: "auto_invoice_generation", label: "Génération auto factures", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "bank_reconciliation_auto", label: "Rapprochement bancaire auto", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "expense_approval_threshold", label: "Seuil approbation dépenses (€)", group: "logic", type: "number", min: 50, max: 5000, roles: ["super_admin", "directeur"] },
            { key: "tips_distribution_method", label: "Méthode répartition pourboires", group: "logic", type: "select", options: [{ value: "equal", label: "Égale" }, { value: "hours", label: "Par heures" }, { value: "points", label: "Par points" }], roles: ["super_admin", "directeur"] },
        ],
    },
    analytics: {
        title: "Paramètres Analyses",
        settings: [
            { key: "default_period", label: "Période par défaut", group: "logic", type: "select", options: [{ value: "week", label: "Semaine" }, { value: "month", label: "Mois" }, { value: "quarter", label: "Trimestre" }], roles: ["super_admin", "directeur", "manager"] },
            { key: "compare_previous", label: "Comparer à", group: "logic", type: "select", options: [{ value: "previous", label: "Période précédente" }, { value: "year", label: "Année précédente" }], roles: ["super_admin", "directeur", "manager"] },
            { key: "auto_report_frequency", label: "Fréquence rapports auto", group: "logic", type: "select", options: [{ value: "none", label: "Aucun" }, { value: "daily", label: "Quotidien" }, { value: "weekly", label: "Hebdomadaire" }, { value: "monthly", label: "Mensuel" }], roles: ["super_admin", "directeur"] },
        ],
    },
    haccp: {
        title: "Paramètres HACCP",
        settings: [
            { key: "temp_check_frequency", label: "Fréquence relevés (h)", group: "logic", type: "number", min: 1, max: 12, roles: ["super_admin", "directeur"] },
            { key: "alert_delay_minutes", label: "Délai alerte (min)", group: "logic", type: "number", min: 5, max: 60, roles: ["super_admin", "directeur"] },
            { key: "photo_required", label: "Photo obligatoire NC", group: "style", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "signature_required", label: "Signature requise", group: "style", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "report_frequency", label: "Fréquence rapports", group: "logic", type: "select", options: [{ value: "daily", label: "Quotidien" }, { value: "weekly", label: "Hebdomadaire" }], roles: ["super_admin", "directeur"] },
            { key: "retention_years", label: "Rétention archives (ans)", group: "logic", type: "number", min: 1, max: 10, roles: ["super_admin"] },
        ],
    },
    groups: {
        title: "Paramètres Groupes",
        settings: [
            { key: "deposit_required", label: "Acompte requis", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
            { key: "deposit_percent", label: "Acompte par défaut (%)", group: "logic", type: "number", min: 10, max: 100, roles: ["super_admin", "directeur"] },
        ],
    },
    seo: {
        title: "Paramètres SEO",
        settings: [
            { key: "auto_check_frequency", label: "Fréquence vérification", group: "logic", type: "select", options: [{ value: "daily", label: "Quotidien" }, { value: "weekly", label: "Hebdomadaire" }], roles: ["super_admin", "directeur"] },
        ],
    },
    bar: {
        title: "Paramètres Bar",
        settings: [
            { key: "sound_new_order", label: "Son nouvelle commande", group: "style", type: "toggle", roles: ["super_admin", "directeur", "manager"] },
            { key: "auto_print_ticket", label: "Impression auto ticket", group: "logic", type: "toggle", roles: ["super_admin", "directeur"] },
        ],
    },
    settings: {
        title: "Paramètres Système",
        settings: [], // Settings page has its own interface
    },
};

// ============ CONTEXT ============

interface ContextualSettingsContextType {
    openSettings: (pageKey: PageKey) => void;
    closeSettings: () => void;
    isOpen: boolean;
    currentPage: PageKey | null;
    getPageSettings: (pageKey: PageKey) => typeof PAGE_SETTINGS[PageKey] | null;
    canAccessSetting: (setting: PageSettingConfig) => boolean;
    // Global settings state
    allSettings: Record<PageKey, Record<string, any>>;
    updatePageSettings: (pageKey: PageKey, settings: Record<string, any>) => void;
    getSettingValue: <T>(pageKey: PageKey, settingKey: string, defaultValue: T) => T;
}

const ContextualSettingsContext = createContext<ContextualSettingsContextType | undefined>(undefined);

// ============ PROVIDER ============

export function ContextualSettingsProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<PageKey | null>(null);
    const { currentUser } = useAuth();

    // Global state for all page settings - initialized from localStorage
    const [allSettings, setAllSettings] = useState<Record<PageKey, Record<string, any>>>(() => {
        const initial: Record<PageKey, Record<string, any>> = {} as any;
        if (typeof window !== 'undefined') {
            Object.keys(PAGE_SETTINGS).forEach((key) => {
                const pageKey = key as PageKey;
                const saved = localStorage.getItem(`page_settings_${pageKey}`);
                if (saved) {
                    try {
                        initial[pageKey] = JSON.parse(saved);
                    } catch {
                        initial[pageKey] = {};
                    }
                } else {
                    initial[pageKey] = {};
                }
            });
        }
        return initial;
    });

    const openSettings = useCallback((pageKey: PageKey) => {
        setCurrentPage(pageKey);
        setIsOpen(true);
    }, []);

    const closeSettings = useCallback(() => {
        setIsOpen(false);
        setTimeout(() => setCurrentPage(null), 300);
    }, []);

    const getPageSettings = useCallback((pageKey: PageKey) => {
        return PAGE_SETTINGS[pageKey] || null;
    }, []);

    const canAccessSetting = useCallback((setting: PageSettingConfig): boolean => {
        if (!currentUser) return false;
        const roleMapping: Record<string, PermissionRole> = {
            admin: "super_admin",
            manager: "directeur",
            floor_manager: "manager",
            server: "serveur",
            bartender: "barman",
            kitchen_chef: "chef_cuisinier",
            kitchen_line: "cuisinier",
            host: "hotesse",
            cashier: "serveur",
        };
        const mappedRole = roleMapping[currentUser.role] || "serveur";
        return setting.roles.includes(mappedRole);
    }, [currentUser]);

    // Update settings for a page and persist to localStorage
    const updatePageSettings = useCallback((pageKey: PageKey, settings: Record<string, any>) => {
        setAllSettings(prev => {
            const newSettings = { ...prev, [pageKey]: settings };
            localStorage.setItem(`page_settings_${pageKey}`, JSON.stringify(settings));
            return newSettings;
        });
    }, []);

    // Get a specific setting value with default
    const getSettingValue = useCallback(<T,>(pageKey: PageKey, settingKey: string, defaultValue: T): T => {
        const pageSettings = allSettings[pageKey];
        if (pageSettings && settingKey in pageSettings) {
            return pageSettings[settingKey] as T;
        }
        return defaultValue;
    }, [allSettings]);

    return (
        <ContextualSettingsContext.Provider value={{
            openSettings,
            closeSettings,
            isOpen,
            currentPage,
            getPageSettings,
            canAccessSetting,
            allSettings,
            updatePageSettings,
            getSettingValue
        }}>
            {children}
            <ContextualSettingsPanel />
        </ContextualSettingsContext.Provider>
    );
}

// ============ HOOKS ============

export function useContextualSettings() {
    const context = useContext(ContextualSettingsContext);
    if (!context) {
        throw new Error("useContextualSettings must be used within ContextualSettingsProvider");
    }
    return context;
}

/**
 * Hook to read a specific setting value for a page.
 * Automatically re-renders when the setting changes.
 * 
 * @example
 * const showImages = usePageSetting('pos', 'show_images', true);
 */
export function usePageSetting<T>(pageKey: PageKey, settingKey: string, defaultValue: T): T {
    const { getSettingValue } = useContextualSettings();
    return getSettingValue(pageKey, settingKey, defaultValue);
}

/**
 * Hook to get all settings for a page.
 * 
 * @example
 * const posSettings = usePageSettings('pos');
 */
export function usePageSettings(pageKey: PageKey): Record<string, any> {
    const { allSettings } = useContextualSettings();
    return allSettings[pageKey] || {};
}

// ============ PREMIUM SELECT COMPONENT ============

interface PremiumSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
}

function PremiumSelect({ value, onChange, options, placeholder = "Sélectionner..." }: PremiumSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl bg-bg-tertiary/50 border-2 transition-all duration-300",
                    isOpen
                        ? "border-accent shadow-[0_0_20px_rgba(197,160,89,0.15)]"
                        : "border-border hover:border-accent/30"
                )}
            >
                <span className={cn(
                    "font-serif text-sm",
                    value ? "text-text-primary" : "text-text-muted"
                )}>
                    {selectedOption?.label || placeholder}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-5 h-5 text-accent" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 py-2 rounded-2xl bg-bg-secondary border-2 border-accent/30 shadow-2xl backdrop-blur-xl overflow-hidden"
                    >
                        <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-4 py-3 text-left text-sm font-serif transition-all duration-200",
                                        value === opt.value
                                            ? "bg-accent/10 text-accent font-semibold"
                                            : "text-text-primary hover:bg-accent/5"
                                    )}
                                >
                                    {value === opt.value && (
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-2" />
                                    )}
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============ PREMIUM NUMBER INPUT COMPONENT ============

interface PremiumNumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

function PremiumNumberInput({ value, onChange, min = 0, max = 100, step = 1 }: PremiumNumberInputProps) {
    const handleIncrement = () => {
        const newValue = Math.min(value + step, max);
        onChange(newValue);
    };

    const handleDecrement = () => {
        const newValue = Math.max(value - step, min);
        onChange(newValue);
    };

    return (
        <div className="flex items-center gap-3">
            {/* Decrement Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDecrement}
                disabled={value <= min}
                className={cn(
                    "w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300",
                    value <= min
                        ? "border-border bg-bg-tertiary/30 text-text-muted cursor-not-allowed"
                        : "border-accent/30 bg-bg-tertiary/50 text-accent hover:border-accent hover:bg-accent/10"
                )}
            >
                <Minus className="w-5 h-5" />
            </motion.button>

            {/* Value Display */}
            <div className="flex-1 relative">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const val = parseInt(e.target.value) || min;
                        onChange(Math.max(min, Math.min(max, val)));
                    }}
                    min={min}
                    max={max}
                    className="w-full text-center p-4 rounded-2xl bg-bg-tertiary/50 border-2 border-border text-text-primary font-serif text-xl font-semibold focus:border-accent focus:outline-none focus:shadow-[0_0_20px_rgba(197,160,89,0.15)] transition-all duration-300 appearance-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                />
            </div>

            {/* Increment Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleIncrement}
                disabled={value >= max}
                className={cn(
                    "w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300",
                    value >= max
                        ? "border-border bg-bg-tertiary/30 text-text-muted cursor-not-allowed"
                        : "border-accent/30 bg-bg-tertiary/50 text-accent hover:border-accent hover:bg-accent/10"
                )}
            >
                <Plus className="w-5 h-5" />
            </motion.button>
        </div>
    );
}

// ============ PANEL COMPONENT ============

function ContextualSettingsPanel() {
    const { isOpen, closeSettings, currentPage, getPageSettings, canAccessSetting, allSettings, updatePageSettings } = useContextualSettings();
    const theme = useTheme();
    const { t } = useLanguage();
    const [localValues, setLocalValues] = useState<Record<string, any>>({});
    const [activeTab, setActiveTab] = useState<'logic' | 'style'>('logic');
    const pageSettings = currentPage ? getPageSettings(currentPage) : null;

    useEffect(() => {
        if (currentPage && pageSettings) {
            // Load saved settings from global state
            const saved = allSettings[currentPage] || {};
            setLocalValues(saved);
        }
    }, [currentPage, pageSettings, allSettings]);

    // Reset tab to logic when opening for a new page
    useEffect(() => {
        if (isOpen) setActiveTab('logic');
    }, [isOpen, currentPage]);

    const handleSave = () => {
        if (currentPage) {
            // Update global state (which also persists to localStorage)
            updatePageSettings(currentPage, localValues);
        }
        closeSettings();
    };

    const handleReset = () => {
        if (currentPage) {
            updatePageSettings(currentPage, {});
            setLocalValues({});
        }
    };

    const updateValue = (key: string, value: any) => {
        setLocalValues(prev => ({ ...prev, [key]: value }));
    };

    const accessibleSettings = pageSettings?.settings.filter(canAccessSetting) || [];
    const filteredSettings = accessibleSettings.filter(s => s.group === activeTab);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSettings}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-bg-primary dark:bg-bg-secondary border-border shadow-2xl z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex flex-col border-b border-border bg-bg-secondary/50">
                            <div className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                        <Settings className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-serif font-semibold text-text-primary">
                                            {pageSettings?.title || "Paramètres"}
                                        </h2>
                                        <p className="text-[10px] text-accent-gold uppercase tracking-[0.2em] font-black">
                                            Moteur d'Expérience
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeSettings}
                                    className="w-10 h-10 rounded-xl bg-bg-tertiary hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex px-6 pb-2 gap-2">
                                <button
                                    onClick={() => setActiveTab('logic')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-t-xl transition-all relative overflow-hidden group",
                                        activeTab === 'logic'
                                            ? "bg-bg-primary border-t-2 border-x-2 border-border text-accent"
                                            : "text-text-muted hover:text-text-primary"
                                    )}
                                >
                                    <div className={cn(
                                        "p-1.5 rounded-lg transition-colors",
                                        activeTab === 'logic' ? "bg-accent/10" : "bg-bg-tertiary"
                                    )}>
                                        <Settings className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('settings.tab_logic')}</span>
                                    {activeTab === 'logic' && (
                                        <motion.div
                                            layoutId="activeTabUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('style')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-t-xl transition-all relative overflow-hidden group",
                                        activeTab === 'style'
                                            ? "bg-bg-primary border-t-2 border-x-2 border-border text-accent-gold"
                                            : "text-text-muted hover:text-text-primary"
                                    )}
                                >
                                    <div className={cn(
                                        "p-1.5 rounded-lg transition-colors",
                                        activeTab === 'style' ? "bg-accent-gold/10" : "bg-bg-tertiary"
                                    )}>
                                        <Paintbrush className="w-3.5 h-3.5 text-accent-gold" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">{t('settings.tab_style')}</span>
                                    {activeTab === 'style' && (
                                        <motion.div
                                            layoutId="activeTabUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-gold"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                            {/* Global Styles Section (Only in Style Tab) */}
                            {activeTab === 'style' && (
                                <div className="space-y-8 pb-6 border-b border-border/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1 h-4 bg-accent-gold rounded-full" />
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-text-primary">{t('settings.aura_title')}</h3>
                                    </div>

                                    {/* Theme Mode Selection */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-gold/70">{t('settings.mode_label')}</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { id: 'light', label: t('settings.modes.light.label'), desc: t('settings.modes.light.desc') },
                                                { id: 'dark', label: t('settings.modes.dark.label'), desc: t('settings.modes.dark.desc') },
                                                { id: 'auto', label: t('settings.modes.auto.label'), desc: t('settings.modes.auto.desc') },
                                            ].map((m) => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => theme.setMode(m.id as any)}
                                                    className={cn(
                                                        "flex flex-col items-center py-2 px-1 rounded-xl border-2 transition-all gap-1",
                                                        theme.mode === m.id
                                                            ? "bg-accent/10 border-accent text-accent"
                                                            : "bg-bg-tertiary/20 border-border/50 text-text-muted hover:border-accent/30"
                                                    )}
                                                >
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">{m.label}</span>
                                                    <span className="text-[7px] font-bold uppercase opacity-50 tracking-widest">{m.desc}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Accent Color Selection */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-gold/70">{t('settings.accent_label')}</label>
                                        <div className="flex justify-between items-center p-2 rounded-2xl bg-bg-tertiary/20 border border-border/50">
                                            {(['gold', 'emerald', 'sapphire', 'ruby', 'amethyst'] as const).map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => theme.setAccentColor(color)}
                                                    className={cn(
                                                        "w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center border-2",
                                                        theme.accentColor === color ? "border-white scale-110 shadow-lg" : "border-transparent scale-90 opacity-50 hover:opacity-100"
                                                    )}
                                                    style={{
                                                        backgroundColor:
                                                            color === 'gold' ? '#C5A059' :
                                                                color === 'emerald' ? '#10B981' :
                                                                    color === 'sapphire' ? '#3B82F6' :
                                                                        color === 'ruby' ? '#EF4444' : '#8B5CF6'
                                                    }}
                                                >
                                                    {theme.accentColor === color && <Check className="w-4 h-4 text-white" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* UI Density Selection */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-gold/70">{t('settings.density_label')}</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(['compact', 'premium', 'cinematic'] as const).map((d) => (
                                                <button
                                                    key={d}
                                                    onClick={() => theme.setDensity(d)}
                                                    className={cn(
                                                        "py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all",
                                                        theme.density === d
                                                            ? "bg-accent/10 border-accent text-accent"
                                                            : "bg-bg-tertiary/20 border-border/50 text-text-muted hover:border-accent/30"
                                                    )}
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Border Radius Selection */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-gold/70">{t('settings.radius_label')}</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[
                                                { id: 'none', label: t('settings.radius.none') },
                                                { id: 'small', label: t('settings.radius.small') },
                                                { id: 'medium', label: t('settings.radius.medium') },
                                                { id: 'large', label: t('settings.radius.large') },
                                            ].map((r) => (
                                                <button
                                                    key={r.id}
                                                    onClick={() => theme.setBorderRadius(r.id as any)}
                                                    className={cn(
                                                        "py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border-2 transition-all",
                                                        theme.borderRadius === r.id
                                                            ? "bg-accent/10 border-accent text-accent"
                                                            : "bg-bg-tertiary/20 border-border/50 text-text-muted hover:border-accent/30"
                                                    )}
                                                >
                                                    {r.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Glassmorphism Intensity */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-gold/70">{t('settings.glass_label')}</label>
                                            <span className="text-[10px] font-serif italic text-accent-gold">{theme.glassmorphism}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={theme.glassmorphism}
                                            onChange={(e) => theme.setGlassmorphism(parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent-gold"
                                        />
                                    </div>

                                    {/* Animations Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-bg-tertiary/20 rounded-2xl border border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                                                theme.animations ? "bg-accent/10 text-accent" : "bg-bg-tertiary text-text-muted"
                                            )}>
                                                <Zap className="w-4 h-4" />
                                            </div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-primary">{t('settings.animations_label')}</label>
                                        </div>
                                        <button
                                            onClick={() => theme.setAnimations(!theme.animations)}
                                            className={cn(
                                                "w-12 h-6 rounded-full relative transition-all duration-300",
                                                theme.animations ? "bg-accent" : "bg-bg-secondary border border-border"
                                            )}
                                        >
                                            <motion.div
                                                animate={{ x: theme.animations ? 26 : 2 }}
                                                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {filteredSettings.length === 0 && (activeTab === 'logic' || filteredSettings.length === 0) ? (
                                <div className="text-center py-20 text-text-muted space-y-4">
                                    <div className="w-16 h-16 rounded-3xl bg-bg-tertiary mx-auto flex items-center justify-center opacity-50">
                                        {activeTab === 'logic' ? (
                                            <Settings className="w-8 h-8" />
                                        ) : (
                                            <Paintbrush className="w-8 h-8 text-accent-gold" />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-serif italic">Aucun paramètre spécifique</p>
                                        <p className="text-[10px] uppercase tracking-widest opacity-50">Pour la section {activeTab === 'logic' ? 'Configuration' : 'Style'}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'style' && filteredSettings.length > 0 && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1 h-4 bg-accent rounded-full" />
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-text-primary">{t('settings.page_options')}</h3>
                                        </div>
                                    )}
                                    {filteredSettings.map((setting) => (
                                        <motion.div
                                            key={setting.key}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4 p-5 rounded-[24px] bg-bg-secondary/30 border border-border/50 hover:border-accent/30 transition-all group"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-gold/70 group-hover:text-accent-gold transition-colors">
                                                    {setting.label}
                                                </label>
                                                {setting.description && (
                                                    <p className="text-[9px] text-text-muted italic leading-relaxed">
                                                        {setting.description}
                                                    </p>
                                                )}
                                            </div>

                                            {setting.type === "toggle" && (
                                                <button
                                                    onClick={() => updateValue(setting.key, !localValues[setting.key])}
                                                    className={cn(
                                                        "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-500",
                                                        localValues[setting.key]
                                                            ? "bg-accent/5 border-accent text-accent shadow-[0_0_20px_rgba(197,160,89,0.1)]"
                                                            : "bg-bg-tertiary/20 border-border/50 text-text-muted hover:border-accent/30"
                                                    )}
                                                >
                                                    <span className="text-sm font-serif font-medium">
                                                        {localValues[setting.key] ? t('common.enabled') || "Activé" : t('common.disabled') || "Désactivé"}
                                                    </span>
                                                    <div className={cn(
                                                        "w-12 h-6 rounded-full transition-all duration-500 relative",
                                                        localValues[setting.key] ? "bg-accent" : "bg-bg-secondary border border-border"
                                                    )}>
                                                        <motion.div
                                                            animate={{ x: localValues[setting.key] ? 24 : 4 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                                                        />
                                                    </div>
                                                </button>
                                            )}

                                            {setting.type === "select" && (
                                                <PremiumSelect
                                                    value={localValues[setting.key] || ""}
                                                    onChange={(val) => updateValue(setting.key, val)}
                                                    options={setting.options || []}
                                                    placeholder="Sélectionner..."
                                                />
                                            )}

                                            {setting.type === "number" && (
                                                <PremiumNumberInput
                                                    value={localValues[setting.key] || setting.min || 0}
                                                    onChange={(val) => updateValue(setting.key, val)}
                                                    min={setting.min}
                                                    max={setting.max}
                                                />
                                            )}

                                            {setting.type === "text" && (
                                                <input
                                                    type="text"
                                                    value={localValues[setting.key] || ""}
                                                    onChange={(e) => updateValue(setting.key, e.target.value)}
                                                    className="w-full p-4 rounded-2xl bg-bg-tertiary/20 border-2 border-border/50 text-text-primary font-serif focus:border-accent focus:outline-none focus:shadow-[0_0_20px_rgba(197,160,89,0.15)] transition-all duration-300"
                                                />
                                            )}
                                        </motion.div>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {accessibleSettings.length > 0 && (
                            <div className="p-6 border-t border-border bg-bg-secondary/50 flex gap-3">
                                <button
                                    onClick={handleReset}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-border text-text-muted hover:bg-bg-tertiary transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    {t('settings.reset')}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-2 flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-accent text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-accent/90 transition-all shadow-lg hover:shadow-accent/20"
                                >
                                    <Check className="w-4 h-4" />
                                    {t('settings.apply')}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ============ GEAR BUTTON COMPONENT ============

interface SettingsGearButtonProps {
    pageKey: PageKey;
    className?: string;
}

export function SettingsGearButton({ pageKey, className }: SettingsGearButtonProps) {
    const { openSettings, getPageSettings, canAccessSetting } = useContextualSettings();
    const { t } = useLanguage();
    const pageSettings = getPageSettings(pageKey);

    // Check if user has access to any setting on this page
    const hasAccessToAny = pageSettings?.settings.some(canAccessSetting);

    // Always show the button with visible styling
    return (
        <motion.button
            whileHover={hasAccessToAny ? { scale: 1.05, rotate: 90 } : { scale: 1.02 }}
            whileTap={hasAccessToAny ? { scale: 0.95 } : { scale: 0.98 }}
            onClick={() => hasAccessToAny && openSettings(pageKey)}
            className={cn(
                "w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all group shadow-sm",
                hasAccessToAny
                    ? "bg-bg-secondary hover:bg-accent/10 border-border hover:border-accent text-text-muted hover:text-accent cursor-pointer"
                    : "bg-bg-tertiary/50 border-border/50 text-text-muted/40 cursor-not-allowed",
                className
            )}
            title={hasAccessToAny ? t('settings.title') : "Accès non autorisé"}
        >
            <Settings className={cn(
                "w-5 h-5 transition-transform",
                hasAccessToAny && "group-hover:rotate-90"
            )} strokeWidth={1.5} />
        </motion.button>
    );
}
