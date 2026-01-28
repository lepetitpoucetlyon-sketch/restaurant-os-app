# 🚀 PROMPT D'INTÉGRATION — NOUVELLES FONCTIONNALITÉS RESTAURANT OS

> **Version 1.0** | Extension du PRD existant  
> Document de spécification pour 5 nouveaux modules/fonctionnalités

---

## 📋 SOMMAIRE DES NOUVELLES FONCTIONNALITÉS

| # | Fonctionnalité | Priorité | Dépendances Critiques |
|---|----------------|----------|----------------------|
| 1 | **Module Devis** | Haute | Réservations, CRM, Comptabilité, PDF |
| 2 | **Module Groupes & Privatisation** | Haute | Devis, Plan de Salle, Réservations, Menu |
| 3 | **Contrôle Qualité Marchandises** | Moyenne | Stocks, HACCP, Fournisseurs, Alertes |
| 4 | **Demandes de Congés** | Moyenne | RH, Planning, Notifications, Workflow |
| 5 | **SEO & Référencement Naturel** | Basse | CMS, Meta, Sitemap, Analytics |

---

# 📝 MODULE 1 : SYSTÈME DE DEVIS

## 1.1 Vue d'Ensemble

```yaml
Objectif: |
  Permettre la création, l'envoi, le suivi et la conversion de devis 
  professionnels pour tout type de prestation (événements, traiteur, 
  privatisation, groupes, prestations sur-mesure).

Cas_d_usage:
  - Devis pour privatisation de salle
  - Devis pour menu de groupe (mariage, séminaire, anniversaire)
  - Devis traiteur (livraison externe)
  - Devis pour prestation sur-mesure
  - Devis avec options multiples (formules A/B/C)
```

## 1.2 Structure de Données

```yaml
Quote:
  id: UUID
  establishment_id: UUID
  
  # Références
  quote_number: string (format: DEV-YYYY-XXXXX, séquentiel)
  version: integer (1, 2, 3... pour révisions)
  parent_quote_id: UUID | null (si révision)
  
  # Client
  client:
    type: enum [new, existing_customer, existing_company]
    customer_id: UUID | null (lien CRM si existant)
    company_id: UUID | null
    contact:
      name: string
      email: string
      phone: string
      company_name: string | null
      
  # Événement lié
  event:
    type: enum [privatisation, group_dining, catering, custom]
    name: string (ex: "Mariage Dupont")
    date: date
    time_start: time
    time_end: time
    guests_count: integer
    guests_min: integer | null
    guests_max: integer | null
    
  # Contenu du devis
  sections:
    - id: UUID
      title: string (ex: "Formule Menu")
      items:
        - id: UUID
          type: enum [menu_item, package, service, rental, custom]
          reference_id: UUID | null (lien vers menu_item si applicable)
          name: string
          description: string
          quantity: decimal
          unit: string (ex: "personne", "pièce", "heure")
          unit_price_ht: decimal(10,2)
          tax_rate: decimal(4,2)
          discount_percent: decimal(4,2) | null
          discount_amount: decimal(10,2) | null
          subtotal_ht: decimal(10,2)
          subtotal_ttc: decimal(10,2)
          is_optional: boolean
          
  # Options/Variantes (ex: Formule A, B, C)
  variants:
    - id: UUID
      name: string (ex: "Formule Prestige")
      sections: [...] (même structure)
      total_ht: decimal
      total_ttc: decimal
      
  # Totaux
  totals:
    subtotal_ht: decimal(10,2)
    discount_total: decimal(10,2)
    total_ht: decimal(10,2)
    tax_details:
      - rate: decimal
        base: decimal
        amount: decimal
    total_ttc: decimal(10,2)
    deposit_percent: decimal(4,2)
    deposit_amount: decimal(10,2)
    balance_due: decimal(10,2)
    
  # Conditions
  terms:
    validity_days: integer (défaut: 30)
    expiration_date: date
    payment_terms: string
    cancellation_policy: string
    special_conditions: string
    
  # État
  status: enum [
    draft,           # Brouillon
    sent,            # Envoyé au client
    viewed,          # Client a ouvert
    accepted,        # Accepté par client
    rejected,        # Refusé par client
    expired,         # Délai dépassé
    converted,       # Converti en réservation/commande
    cancelled        # Annulé
  ]
  
  # Suivi
  tracking:
    sent_at: timestamp | null
    sent_via: enum [email, whatsapp, sms, print] | null
    viewed_at: timestamp | null
    view_count: integer
    accepted_at: timestamp | null
    accepted_variant_id: UUID | null
    signature_data: base64 | null (signature électronique)
    rejection_reason: string | null
    
  # Conversion
  conversion:
    reservation_id: UUID | null
    order_id: UUID | null
    invoice_id: UUID | null
    
  # Métadonnées
  metadata:
    created_by: UUID
    created_at: timestamp
    updated_at: timestamp
    notes_internal: string (notes internes, non visibles client)
```

## 1.3 Workflows

```yaml
Workflow_Creation:
  1. Sélection type de devis (privatisation, groupe, traiteur, custom)
  2. Création/Sélection client (nouveau ou depuis CRM)
  3. Définition de l'événement (date, horaires, nombre convives)
  4. Construction du contenu:
     a. Import depuis templates prédéfinis
     b. Ajout d'items depuis le menu
     c. Ajout de forfaits (location salle, service, etc.)
     d. Ajout de lignes personnalisées
  5. Configuration des options si multi-formules
  6. Définition conditions (validité, acompte, CGV)
  7. Prévisualisation PDF
  8. Envoi ou sauvegarde brouillon

Workflow_Suivi:
  1. Dashboard devis en cours
  2. Notifications automatiques:
     - Client a ouvert le devis
     - Devis expire dans 3 jours
     - Client a accepté/refusé
  3. Relances automatiques configurables
  4. Historique des interactions

Workflow_Conversion:
  Acceptation_Client:
    1. Client clique "Accepter" (lien unique sécurisé)
    2. Choix de la variante si applicable
    3. Signature électronique (canvas tactile)
    4. Confirmation email automatique
    
  Conversion_Interne:
    1. Devis accepté → Création automatique réservation
    2. Si privatisation → Blocage salles/tables
    3. Si menu → Pré-commande créée
    4. Si acompte → Lien de paiement généré
    5. Facture d'acompte générée
```

## 1.4 Interface Utilisateur

```yaml
Pages:
  /quotes:
    - Liste des devis avec filtres (statut, date, montant)
    - KPIs: En attente, Taux conversion, CA potentiel
    - Actions rapides: Nouveau, Dupliquer, Relancer
    
  /quotes/new:
    - Wizard étape par étape
    - Éditeur glisser-déposer pour les sections
    - Prévisualisation temps réel
    
  /quotes/[id]:
    - Vue détaillée avec timeline des interactions
    - Actions: Modifier, Envoyer, Convertir, Annuler
    - Historique des versions
    
  /quotes/[id]/preview:
    - Rendu PDF interactif
    - Mode présentation client

Composants:
  QuoteBuilder:
    - Drag & drop des sections
    - Calcul automatique des totaux
    - Gestion des variantes/options
    
  QuoteItemPicker:
    - Recherche dans le menu
    - Ajout de forfaits prédéfinis
    - Création ligne personnalisée
    
  QuotePreview:
    - Rendu PDF en temps réel
    - Zoom, pagination
    - Export PDF / Envoi direct
```

## 1.5 Dépendances

```yaml
Modules_Requis:
  CRM:
    - Accès clients/contacts pour lier au devis
    - Création client depuis le devis
    - Historique devis dans fiche client
    
  Réservations:
    - Vérification disponibilité dates
    - Conversion devis → réservation
    - Blocage provisoire pendant négociation
    
  Menu:
    - Import items du menu dans le devis
    - Calcul prix selon quantités
    - Gestion des options/suppléments
    
  Comptabilité:
    - Génération facture depuis devis accepté
    - Facture d'acompte
    - Suivi encaissements
    
  Plan_de_Salle:
    - Vérification capacité pour événements
    - Blocage zones/salles
    
  Notifications:
    - Emails automatiques (envoi, relance, confirmation)
    - SMS/WhatsApp optionnels
    - Notifications in-app

Services_Externes:
  PDF_Generation:
    - Template PDF personnalisable (logo, couleurs)
    - Export haute qualité
    
  Signature_Electronique:
    - Canvas tactile pour signature
    - Horodatage et hash pour valeur probante
    
  Email_Tracking:
    - Pixel de suivi pour "vu"
    - Notification temps réel
```

---

# 🎉 MODULE 2 : GROUPES & PRIVATISATION

## 2.1 Vue d'Ensemble

```yaml
Objectif: |
  Gérer les réservations de groupes et les privatisations d'espaces 
  avec un workflow complet : demande, devis, confirmation, exécution.

Types_Evenements:
  - Privatisation totale (restaurant complet)
  - Privatisation partielle (salon, terrasse, zone)
  - Groupe sans privatisation (table de 10+)
  - Événement récurrent (déjeuner d'affaires hebdo)
  - Séminaire / Conférence
  - Mariage / Anniversaire / Célébration
  - Repas d'entreprise
```

## 2.2 Structure de Données

```yaml
PrivatizableSpace:
  id: UUID
  establishment_id: UUID
  
  name: string (ex: "Salon Napoléon")
  type: enum [full_venue, room, section, terrace, bar_area]
  
  # Capacité
  capacity:
    seated_min: integer
    seated_max: integer
    standing_max: integer
    configurations:
      - name: "Banquet"
        seated: 60
        layout_image: URL
      - name: "Cocktail"
        standing: 100
        layout_image: URL
      - name: "Théâtre"
        seated: 80
        layout_image: URL
        
  # Équipements inclus
  amenities:
    - name: "Vidéoprojecteur"
      included: true
    - name: "Sonorisation"
      included: true
    - name: "Micro sans fil"
      included: false
      rental_price: 50.00
      
  # Tarification
  pricing:
    minimum_spend: decimal | null (dépense minimum)
    rental_fee:
      half_day: decimal | null
      full_day: decimal | null
      evening: decimal | null
    deposit_percent: decimal
    
  # Disponibilité
  availability:
    default_available: boolean
    blocked_dates: date[]
    special_hours: {...}
    
  # Médias
  images: URL[]
  virtual_tour: URL | null
  floor_plan: URL

GroupEvent:
  id: UUID
  establishment_id: UUID
  
  # Type et identifiant
  event_number: string (format: EVT-YYYY-XXXXX)
  type: enum [privatisation_full, privatisation_partial, group_booking, recurring]
  name: string (ex: "Mariage Martin-Dubois")
  
  # Espace
  space_id: UUID | null (privatisation)
  tables: UUID[] (groupe sans privatisation)
  
  # Organisateur
  organizer:
    customer_id: UUID | null
    company_id: UUID | null
    contact:
      name: string
      email: string
      phone: string
      role: string (ex: "Wedding Planner")
      
  # Détails événement
  details:
    date: date
    time_setup: time | null (accès pour installation)
    time_start: time
    time_end: time
    time_cleanup: time | null
    
    guests:
      confirmed: integer
      expected_min: integer
      expected_max: integer
      final_count: integer | null (J-3)
      
    # Besoins spéciaux
    requirements:
      dietary: string[] (végétarien, halal, allergies...)
      accessibility: boolean
      parking: integer (places nécessaires)
      cloakroom: boolean
      decorator_access: boolean
      external_vendors: string[] (DJ, photographe...)
      
  # Menu sélectionné
  menu:
    type: enum [preset_menu, custom_menu, buffet, cocktail]
    package_id: UUID | null (forfait prédéfini)
    items: [...] (détail du menu)
    
  # Devis associé
  quote_id: UUID | null
  quote_status: enum [pending, sent, accepted, rejected]
  
  # État
  status: enum [
    inquiry,        # Simple demande
    quoted,         # Devis envoyé
    confirmed,      # Confirmé (acompte reçu)
    in_preparation, # J-7: Préparation
    ready,          # J-1: Tout est prêt
    in_progress,    # Événement en cours
    completed,      # Terminé
    invoiced,       # Facturé
    paid,           # Soldé
    cancelled
  ]
  
  # Suivi opérationnel
  operations:
    briefing_done: boolean
    staff_assigned: UUID[] (équipe dédiée)
    menu_validated: boolean
    setup_checklist: [...]
    notes_kitchen: string
    notes_service: string
    
  # Facturation
  billing:
    deposit_amount: decimal
    deposit_paid: boolean
    deposit_payment_id: UUID | null
    final_invoice_id: UUID | null
    extras: [...] (consommations hors forfait)
    
  # Feedback
  feedback:
    rating: integer (1-5) | null
    review: string | null
    photos: URL[]
```

## 2.3 Workflows

```yaml
Workflow_Demande_Privatisation:
  1. Formulaire de contact sur site public:
     - Type d'événement
     - Date souhaitée
     - Nombre de personnes
     - Budget indicatif
     - Coordonnées
     
  2. Réception dans le backoffice:
     - Notification manager
     - Vérification disponibilité automatique
     - Création fiche événement (status: inquiry)
     
  3. Prise de contact:
     - Appel/email client
     - Précision des besoins
     - Visite des lieux si nécessaire
     
  4. Génération devis (lien Module Devis):
     - Création devis depuis la fiche événement
     - Envoi au client
     - Suivi ouverture/acceptation
     
  5. Confirmation:
     - Acceptation devis → status: confirmed
     - Blocage définitif de l'espace
     - Envoi contrat si applicable
     - Demande acompte
     
  6. Préparation (J-7):
     - Briefing équipe
     - Validation menu définitif
     - Confirmation nombre exact (J-3)
     - Checklist préparation
     
  7. Jour J:
     - Checklist installation
     - Événement en cours
     - Suivi extras/ajouts
     
  8. Clôture:
     - Facture finale
     - Demande avis client
     - Archivage photos

Workflow_Groupe_Simple:
  1. Réservation depuis module Réservations
  2. Si > 8 personnes → tag "Groupe"
  3. Option: pré-commande menu
  4. Option: demande de devis
  5. Confirmation standard
```

## 2.4 Interface Utilisateur

```yaml
Pages:
  /events:
    - Calendrier des événements
    - Vue timeline par espace
    - Liste filtrée par statut
    - KPIs: À venir, CA confirmé, Taux conversion
    
  /events/calendar:
    - Vue mensuelle
    - Code couleur par type/statut
    - Glisser-déposer pour déplacer
    
  /events/[id]:
    - Fiche événement complète
    - Timeline des actions
    - Documents (devis, contrat, facture)
    - Communication client
    
  /events/new:
    - Wizard de création
    - Vérification disponibilité temps réel
    - Lien direct vers création devis
    
  /spaces:
    - Gestion des espaces privatisables
    - Configuration capacités
    - Galerie photos
    - Calendrier occupation

Composants:
  EventTimeline:
    - Vue chronologique des étapes
    - Actions à faire
    - Compteur J-X
    
  SpaceAvailabilityChecker:
    - Calendrier interactif
    - Indication conflits
    - Suggestion dates alternatives
    
  GuestCountTracker:
    - Historique des annonces
    - Confirmation finale
    - Impact sur facturation
```

## 2.5 Dépendances

```yaml
Module_Devis:
  - Création devis depuis événement
  - Conversion auto en réservation
  - Suivi acceptation
  
Module_Réservations:
  - Blocage créneaux
  - Création réservation groupe
  - Vérification conflits
  
Module_Plan_de_Salle:
  - Définition des espaces privatisables
  - Attribution tables pour groupes
  - Visualisation occupation
  
Module_Menu:
  - Forfaits événementiels
  - Menus personnalisés
  - Calcul coûts
  
Module_RH:
  - Affectation personnel dédié
  - Briefings équipe
  
Module_Stocks:
  - Anticipation commandes spécifiques
  - Gestion produits événementiels
  
Module_Comptabilité:
  - Acomptes
  - Factures
  - Suivi paiements
  
Module_CRM:
  - Historique client
  - Fidélisation B2B
  - Relances anniversaires
```

---

# 📦 MODULE 3 : CONTRÔLE QUALITÉ MARCHANDISES

## 3.1 Vue d'Ensemble

```yaml
Objectif: |
  Garantir la qualité des marchandises reçues, particulièrement les produits 
  frais (légumes, fruits, viandes, poissons), avec traçabilité complète 
  et conformité HACCP.

Périmètre:
  - Contrôle réception fournisseurs
  - Contrôle qualité visuel
  - Contrôle température
  - Traçabilité lots
  - Gestion des non-conformités
  - Historique qualité fournisseur
```

## 3.2 Structure de Données

```yaml
QualityControl:
  id: UUID
  establishment_id: UUID
  
  # Contexte
  type: enum [reception, storage, preparation, pre_service]
  delivery_id: UUID | null (lien livraison fournisseur)
  supplier_id: UUID
  
  # Timing
  controlled_at: timestamp
  controlled_by: UUID
  
  # Items contrôlés
  items:
    - id: UUID
      product_id: UUID
      product_name: string
      batch_number: string | null
      expiry_date: date | null
      quantity_expected: decimal
      quantity_received: decimal
      unit: string
      
      # Contrôles
      checks:
        visual:
          status: enum [pass, warning, fail]
          notes: string | null
          photos: URL[]
          issues: enum [
            none,
            damaged_packaging,
            wrong_color,
            wrong_size,
            visible_mold,
            pest_presence,
            wrong_ripeness,
            other
          ][]
          
        temperature:
          required: boolean
          target_min: decimal | null
          target_max: decimal | null
          measured: decimal | null
          status: enum [pass, warning, fail]
          probe_id: string | null (ID sonde)
          
        freshness:
          status: enum [excellent, good, acceptable, poor, rejected]
          days_remaining: integer | null
          
        weight:
          expected: decimal | null
          measured: decimal | null
          variance_percent: decimal | null
          status: enum [pass, warning, fail]
          
      # Décision
      decision: enum [
        accepted,
        accepted_with_reservation,
        partially_accepted,
        rejected
      ]
      accepted_quantity: decimal
      rejected_quantity: decimal
      rejection_reason: string | null
      
  # Résumé global
  summary:
    total_items: integer
    accepted: integer
    rejected: integer
    warnings: integer
    overall_status: enum [pass, partial, fail]
    
  # Actions correctives
  actions:
    - type: enum [return_to_supplier, credit_note, dispose, use_priority]
      item_id: UUID
      description: string
      assigned_to: UUID | null
      completed: boolean
      
  # Documents
  documents:
    delivery_note_photo: URL | null
    signature: base64 | null

Product_Quality_Config:
  product_id: UUID
  
  # Critères par défaut
  requires_temperature_check: boolean
  temperature_range:
    min: decimal
    max: decimal
    
  requires_weight_check: boolean
  weight_tolerance_percent: decimal
  
  visual_criteria:
    - criterion: string
      description: string
      
  shelf_life_days: integer
  priority_use_threshold_days: integer
```

## 3.3 Workflows

```yaml
Workflow_Reception_Fournisseur:
  1. Arrivée livraison:
     - Scan bon de livraison ou création manuelle
     - Chargement liste produits attendus
     
  2. Contrôle température (produits frais):
     - Saisie température véhicule
     - Saisie température produits
     - Alerte si hors plage HACCP
     
  3. Contrôle quantité:
     - Pesée si applicable
     - Comptage
     - Signalement écarts
     
  4. Contrôle qualité visuel:
     - Inspection emballage
     - Inspection produit
     - Photo des anomalies
     - Notation fraîcheur
     
  5. Décision:
     - Acceptation totale → Stock
     - Acceptation partielle → Stock + Action
     - Refus → Retour fournisseur
     
  6. Clôture:
     - Signature réceptionnaire
     - Mise à jour stocks
     - Création actions correctives si nécessaire
     - Notification chef si problème

Workflow_Alerte_Qualite:
  Déclencheurs:
    - Température hors norme
    - DLC proche (J-2)
    - Produit signalé non conforme
    
  Actions:
    - Notification immédiate (push + in-app)
    - Blocage automatique du lot
    - Création tâche corrective
    - Log dans historique fournisseur
```

## 3.4 Interface Utilisateur

```yaml
Pages:
  /quality:
    - Dashboard qualité
    - Contrôles du jour
    - Alertes en cours
    - Statistiques fournisseurs
    
  /quality/reception:
    - Nouveau contrôle réception
    - Scan/recherche livraison
    - Checklist de contrôle
    
  /quality/[id]:
    - Détail d'un contrôle
    - Photos
    - Actions correctives
    
  /quality/suppliers:
    - Classement qualité fournisseurs
    - Historique incidents
    - Tendances

Composants:
  TemperatureInput:
    - Connexion sonde Bluetooth
    - Saisie manuelle
    - Indicateur visuel OK/KO
    
  QualityChecklist:
    - Items à contrôler
    - Boutons Pass/Fail
    - Capture photo intégrée
    
  FreshnessSlider:
    - Notation 1-5 étoiles
    - Labels descriptifs
```

## 3.5 Dépendances

```yaml
Module_Stocks:
  - Mise à jour automatique après contrôle
  - Blocage lots non conformes
  - Traçabilité lots
  
Module_HACCP:
  - Enregistrement températures
  - Conformité procédures
  - Documentation audits
  
Module_Fournisseurs:
  - Historique qualité par fournisseur
  - Score qualité
  - Déclenchement litiges
  
Module_Achats:
  - Avoir fournisseur
  - Réclamation automatique
  
Module_Notifications:
  - Alertes température
  - Alertes DLC
  - Notifications chef/manager
  
Module_Kitchen_Display:
  - Affichage produits prioritaires (DLC courte)
  - Signalement produits bloqués
```

---

# 🏖️ MODULE 4 : DEMANDES DE CONGÉS

## 4.1 Vue d'Ensemble

```yaml
Objectif: |
  Permettre aux employés de soumettre des demandes de congés et absences,
  avec workflow d'approbation, vérification des conflits planning,
  et suivi des soldes.

Types_Absences:
  - Congés payés (CP)
  - RTT
  - Congé sans solde
  - Maladie (arrêt de travail)
  - Congé maternité/paternité
  - Congé exceptionnel (mariage, décès, déménagement...)
  - Formation
  - Récupération
```

## 4.2 Structure de Données

```yaml
LeaveBalance:
  employee_id: UUID
  establishment_id: UUID
  year: integer
  
  balances:
    - type: enum [paid_leave, rtt, recovery, exceptional]
      acquired: decimal (jours acquis)
      taken: decimal (jours pris)
      pending: decimal (en attente validation)
      remaining: decimal (solde disponible)
      carry_over: decimal (report N-1)
      expiry_date: date | null

LeaveRequest:
  id: UUID
  establishment_id: UUID
  employee_id: UUID
  
  # Demande
  type: enum [
    paid_leave,
    rtt,
    unpaid_leave,
    sick_leave,
    maternity,
    paternity,
    exceptional,
    training,
    recovery
  ]
  
  # Période
  start_date: date
  end_date: date
  is_half_day_start: boolean (matin seulement)
  is_half_day_end: boolean (après-midi seulement)
  days_count: decimal
  
  # Détails
  reason: string | null
  exceptional_reason: enum [
    wedding_self,
    wedding_child,
    birth,
    death_spouse,
    death_parent,
    death_sibling,
    moving,
    other
  ] | null
  
  # Documents
  attachments:
    - type: enum [medical_certificate, justification, other]
      file: URL
      
  # État
  status: enum [
    draft,
    submitted,
    pending_approval,
    approved,
    rejected,
    cancelled,
    in_progress,
    completed
  ]
  
  # Workflow
  workflow:
    submitted_at: timestamp
    submitted_to: UUID (manager)
    
    approvals:
      - level: integer (1, 2...)
        approver_id: UUID
        approved: boolean | null
        decided_at: timestamp | null
        comments: string | null
        
    final_decision_at: timestamp | null
    final_decision_by: UUID | null
    rejection_reason: string | null
    
  # Impact planning
  planning_impact:
    conflicts: boolean
    conflicting_shifts: UUID[]
    replacement_required: boolean
    replacement_employee_id: UUID | null
    coverage_confirmed: boolean

Leave_Policy:
  establishment_id: UUID
  
  rules:
    minimum_notice_days: integer (délai minimum avant demande)
    maximum_consecutive_days: integer
    blackout_periods: [{start: date, end: date, reason: string}]
    minimum_coverage_percent: decimal (équipe minimum)
    
  approval_workflow:
    - level: 1
      role: manager
      required: true
    - level: 2
      role: owner
      required_if: "days_count > 5"
      
  accrual:
    paid_leave:
      days_per_month: 2.08 (25 jours/an)
      carry_over_max: 5
      carry_over_expiry_months: 6
```

## 4.3 Workflows

```yaml
Workflow_Demande_Conge:
  1. Création demande (employé):
     - Sélection type de congé
     - Choix dates (calendrier avec dispo équipe)
     - Affichage solde restant
     - Vérification automatique:
       * Solde suffisant ?
       * Hors période blocage ?
       * Délai respect ?
     - Ajout justificatif si requis
     
  2. Soumission:
     - Notification manager
     - Vérification impact planning automatique
     - Suggestion remplaçants si conflit
     
  3. Examen manager:
     - Vue calendrier équipe
     - Visualisation couverture
     - Décision: Approuver / Refuser / Demander modification
     
  4. Si approbation niveau 2 requise:
     - Escalade à owner
     - Décision finale
     
  5. Notification employé:
     - Email + push
     - Mise à jour planning si approuvé
     - Mise à jour solde
     
  6. Si refus:
     - Motif obligatoire
     - Suggestion dates alternatives

Workflow_Arret_Maladie:
  1. Déclaration rapide (employé ou manager):
     - Date début
     - Durée estimée
     - Status: en attente justificatif
     
  2. Ajout arrêt de travail:
     - Scan/photo du document
     - Dates officielles
     - Mise à jour durée
     
  3. Impact:
     - Retrait du planning automatique
     - Notification équipe
     - Recherche remplacement
```

## 4.4 Interface Utilisateur

```yaml
Pages:
  /leaves (employé):
    - Mes demandes (historique)
    - Mes soldes par type
    - Nouvelle demande
    - Calendrier équipe (vue limitée)
    
  /leaves/request:
    - Formulaire de demande
    - Calendrier sélection dates
    - Indicateurs de conflit
    - Prévisualisation solde après
    
  /leaves/manage (manager):
    - Demandes en attente
    - Vue calendrier équipe
    - Historique validations
    - Statistiques absences
    
  /leaves/calendar:
    - Vue annuelle équipe
    - Code couleur par type
    - Export
    
Composants:
  LeaveBalanceCard:
    - Solde visuel (jauge)
    - Détail par type
    - Historique consommation
    
  TeamCalendarView:
    - Tous les employés
    - Absences confirmées
    - Demandes en attente (couleur différente)
    - Jours fériés
    
  LeaveRequestForm:
    - Sélecteur période intuitif
    - Vérifications temps réel
    - Upload justificatifs
    
  ApprovalQueue:
    - Liste demandes à traiter
    - Quick actions (approuver/refuser)
    - Vue impact planning
```

## 4.5 Dépendances

```yaml
Module_RH:
  - Fiches employés
  - Contrats (droits à congés)
  - Historique absences
  
Module_Planning:
  - Vérification conflits
  - Retrait des shifts
  - Calcul couverture
  - Attribution remplaçants
  
Module_Notifications:
  - Alertes nouvelles demandes
  - Rappels validation
  - Confirmation employé
  
Module_Comptabilité:
  - Provisions congés payés
  - Impact paie
  - Reporting social
  
Module_Analytics:
  - Taux d'absentéisme
  - Tendances par période
  - Comparaison équipes
```

---

# 🔍 MODULE 5 : SEO & RÉFÉRENCEMENT NATUREL

## 5.1 Vue d'Ensemble

```yaml
Objectif: |
  Optimiser la visibilité du restaurant sur les moteurs de recherche
  avec des données structurées, méta-données dynamiques, et contenu
  optimisé généré automatiquement.

Périmètre:
  - Pages publiques (site vitrine)
  - Module réservation en ligne
  - Menu en ligne
  - Événements/Actualités
  - Google Business Profile sync
```

## 5.2 Structure de Données

```yaml
SEO_Config:
  establishment_id: UUID
  
  # Informations de base
  site_title: string
  site_description: string
  keywords: string[]
  
  # Réseaux sociaux
  social:
    og_image_default: URL
    twitter_handle: string
    facebook_page: string
    instagram_handle: string
    
  # Robots & Sitemap
  robots:
    index: boolean
    follow: boolean
    sitemap: boolean
    
  # Google
  google:
    analytics_id: string
    search_console_verified: boolean
    business_profile_linked: boolean
    
Page_SEO:
  page_path: string (ex: "/menu")
  
  meta:
    title: string (max 60)
    description: string (max 160)
    canonical_url: string
    
  og:
    title: string
    description: string
    image: URL
    type: string (website, restaurant, article)
    
  twitter:
    card: enum [summary, summary_large_image]
    title: string
    description: string
    image: URL
    
  structured_data: JSON (schema.org)

Menu_SEO:
  # Génération automatique pour chaque plat
  menu_item_id: UUID
  
  # URL slug optimisé
  slug: string (ex: "entrecote-sauce-bearnaise")
  
  # Meta auto-générées
  auto_title: string (ex: "Entrecôte Sauce Béarnaise - Restaurant Le Gourmet")
  auto_description: string (généré depuis description + allergènes + prix)
  
  # Structured Data (schema.org/MenuItem)
  structured_data:
    "@type": "MenuItem"
    name: string
    description: string
    offers:
      "@type": "Offer"
      price: decimal
      priceCurrency: "EUR"
    nutrition: {...}
    suitableForDiet: [...] (vegetarian, vegan, etc.)
```

## 5.3 Fonctionnalités

```yaml
Génération_Automatique:
  Meta_Tags:
    - Title: "{Nom Restaurant} - {Catégorie} | {Ville}"
    - Description: générée depuis infos établissement
    - OG Image: photo principale ou génération dynamique
    
  Structured_Data:
    Restaurant:
      "@type": "Restaurant"
      name: string
      address: {...}
      telephone: string
      openingHoursSpecification: [...]
      priceRange: "€€"
      servesCuisine: [...]
      acceptsReservations: true
      menu: URL
      aggregateRating: {...}
      
    Menu:
      "@type": "Menu"
      hasMenuSection: [...]
      
    Events:
      "@type": "Event"
      pour les événements publics
      
  Sitemap_XML:
    - Génération automatique
    - Update à chaque modification
    - Submit à Google
    
  Robots_txt:
    - Configuration depuis admin
    - Règles par section

Sync_Google_Business:
  Données_Synchronisées:
    - Horaires d'ouverture
    - Photos
    - Menu (prix, descriptions)
    - Posts/Actualités
    - Événements
    
  API_Utilisées:
    - Google Business Profile API
    - Google Places API
    
Optimisation_Contenu:
  Suggestions_IA:
    - Amélioration descriptions plats
    - Mots-clés pertinents
    - Titres optimisés
    
  Analyse:
    - Score SEO par page
    - Recommandations
    - Suivi positions (optionnel)
```

## 5.4 Interface Utilisateur

```yaml
Pages:
  /settings/seo:
    - Configuration générale
    - Connexion Google accounts
    - Prévisualisation SERP
    
  /settings/seo/pages:
    - Liste pages avec score SEO
    - Édition meta par page
    - Prévisualisation social cards
    
  /settings/seo/google:
    - Sync Google Business
    - Statistiques Search Console
    - Actions recommandées

Composants:
  SEOScoreCard:
    - Score 0-100
    - Points forts / Points faibles
    - Suggestions
    
  SERPPreview:
    - Rendu Google Desktop/Mobile
    - Compteur caractères
    
  SocialCardPreview:
    - Rendu Facebook/Twitter/LinkedIn
    - Éditeur image OG
```

## 5.5 Dépendances

```yaml
Module_CMS:
  - Pages publiques
  - Blog/Actualités
  - Événements publics
  
Module_Menu:
  - Données plats pour structured data
  - Images pour OG
  
Module_Réservations:
  - Schéma reservations
  - Disponibilités
  
Module_Analytics:
  - Tracking visiteurs
  - Conversions
  
Services_Externes:
  - Google Search Console API
  - Google Business Profile API
  - Analytics API
```

---

# 🔗 MATRICE DES DÉPENDANCES COMPLÈTE

```
                    DEVIS  GROUPES  QUALITÉ  CONGÉS  SEO
                    ─────  ───────  ───────  ──────  ───
CRM                   ●       ●                        
Réservations          ●       ●                       ○
Plan de Salle         ○       ●       
Menu                  ●       ●               
Stocks                        ●        ●       
HACCP                                  ●       
RH                            ○                 ●     
Planning                      ●                 ●     
Comptabilité          ●       ●                 ○     
Notifications         ●       ●        ●        ●     
PDF/Export            ●       ●        ○        ○     
Analytics             ○       ○        ○        ○      ●
Fournisseurs                           ●       

● = Dépendance critique (obligatoire)
○ = Dépendance recommandée (enrichissement)
```

---

# 🚦 ORDRE D'IMPLÉMENTATION RECOMMANDÉ

```yaml
Phase_1_Fondations:
  durée: 2 semaines
  modules:
    - Module Devis (base)
    - Contrôle Qualité (base)
  raison: "Moins de dépendances, valeur immédiate"

Phase_2_RH:
  durée: 1 semaine
  modules:
    - Demandes de Congés
  raison: "Dépend uniquement de RH et Planning existants"

Phase_3_Evenementiel:
  durée: 2 semaines
  modules:
    - Module Groupes & Privatisation
  raison: "Nécessite Devis fonctionnel"
  
Phase_4_Visibilité:
  durée: 1 semaine
  modules:
    - SEO & Référencement
  raison: "Indépendant, peut être fait en parallèle"
```

---

# ✅ CHECKLIST AVANT IMPLÉMENTATION

```yaml
Pour_Chaque_Module:
  - [ ] Schéma de données validé
  - [ ] Workflows utilisateur définis
  - [ ] Wireframes/Maquettes approuvés
  - [ ] Dépendances identifiées et disponibles
  - [ ] API endpoints spécifiés
  - [ ] Tests E2E définis
  - [ ] Documentation utilisateur prévue

Questions_À_Résoudre:
  Devis:
    - Template PDF personnalisable ? Combien ?
    - Signature électronique avec valeur légale ?
    - Multi-devises ?
    
  Groupes:
    - Combien d'espaces privatisables max ?
    - Intégration wedding planners externes ?
    - Export vers Notion/Airtable ?
    
  Qualité:
    - Sondes température connectées ? Quels modèles ?
    - Intégration balance connectée ?
    - Photos obligatoires ou optionnelles ?
    
  Congés:
    - Multi-établissement : soldes partagés ou séparés ?
    - Import depuis logiciel paie ?
    - Export vers comptable ?
    
  SEO:
    - Pages statiques ou SSG ?
    - Blog intégré ?
    - Multi-langue ?
```

---

> **Document créé le** : 2026-01-10  
> **À utiliser avec** : PROMPT_COMPLET.md (PRD principal)  
> **Version** : 1.0
