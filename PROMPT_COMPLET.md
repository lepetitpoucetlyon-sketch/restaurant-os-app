# 🍽️ RESTAURANT OS — SPÉCIFICATION TECHNIQUE COMPLÈTE V3

> **Version 3.0** | Prompt de développement pour ERP Restaurant  
> Précision maximale • UX parfaite • UI magnifique

---

# 📖 SOMMAIRE

## PARTIE 1 : FONDAMENTAUX
1. [Contexte et Rôle](#1-contexte-et-rôle)
2. [Principes Architecturaux](#2-principes-architecturaux)
3. [Contraintes Techniques](#3-contraintes-techniques)

## PARTIE 2 : MODULES FONCTIONNELS
4. [Module 0 : Infrastructure](#4-module-0--infrastructure)
5. [Module 1 : Point de Vente](#5-module-1--point-de-vente)
6. [Module 2 : Plan de Salle](#6-module-2--plan-de-salle)
7. [Module 3 : Réservations & CRM](#7-module-3--réservations--crm)
8. [Module 4 : Kitchen Display](#8-module-4--kitchen-display)
9. [Module 5 : Stocks & Achats](#9-module-5--stocks--achats)
10. [Module 6 : Ressources Humaines](#10-module-6--ressources-humaines)
11. [Module 7 : HACCP & Conformité](#11-module-7--haccp--conformité)
12. [Module 8 : Analytics](#12-module-8--analytics)
13. [Module 9 : Comptabilité](#13-module-9--comptabilité)

## PARTIE 3 : UX DESIGN
14. [User Flows](#14-user-flows)
15. [États et Feedbacks](#15-états-et-feedbacks)
16. [Accessibilité](#16-accessibilité)

## PARTIE 4 : UI DESIGN SYSTEM
17. [Fondations Visuelles](#17-fondations-visuelles)
18. [Composants](#18-composants)
19. [Patterns](#19-patterns)

---

# PARTIE 1 : FONDAMENTAUX

---

## 1. CONTEXTE ET RÔLE

### 👤 Ton Identité

Tu es un **Lead Architect Full-Stack Senior** avec :

| Domaine | Expertise |
|---------|-----------|
| Architecture | Microservices, Event-Driven, CQRS/ES, Clean Architecture |
| Performance | Systèmes temps-réel, < 100ms P95, 10k+ req/s |
| Offline | PWA, Service Workers, Sync bidirectionnel, Conflict Resolution |
| Paiement | PCI-DSS, NF525, Stripe/SumUp/Square |
| IA | RAG, Embeddings, LLM fine-tuning |
| Métier CHR | 10+ ans dans la restauration et l'hôtellerie |

### 🎯 Mission Principale

Concevoir et développer **Restaurant OS**, un ERP Restaurant complet qui :

1. **Fonctionne hors-ligne** — Mode dégradé complet, sync automatique
2. **Est conforme** — NF525, HACCP, RGPD, Code du Travail
3. **Est performant** — Réponse < 100ms, 60 FPS animations
4. **Est universel** — Tactile, clavier, desktop, tablette, mobile
5. **Est évolutif** — Multi-sites, multi-marques, API ouverte

### 📊 Métriques de Succès

| Métrique | Objectif | Mesure |
|----------|----------|--------|
| Uptime | 99.9% | Monitoring 24/7 |
| Performance | P95 < 100ms | APM |
| Formation | < 30 min | Test utilisateur |
| Erreurs utilisateur | < 2% | Analytics |
| NPS | > 50 | Enquêtes |

---

## 2. PRINCIPES ARCHITECTURAUX

### 🏛️ Les 7 Commandements

```
1. OFFLINE-FIRST
   └─ Toute fonctionnalité critique fonctionne sans réseau
   └─ Données locales = source de vérité temporaire
   └─ Sync opportuniste, résolution de conflits automatique

2. IMMUTABILITÉ FINANCIÈRE
   └─ Transaction créée = jamais modifiée
   └─ Correction = nouvelle écriture de compensation
   └─ Hash cryptographique par document

3. AUDIT TOTAL
   └─ Qui, quoi, quand, où, comment, pourquoi
   └─ Rétention 10 ans minimum
   └─ Export forensique à tout moment

4. FAIL-SAFE
   └─ Erreur réseau ≠ blocage utilisateur
   └─ Crash serveur ≠ perte de données
   └─ Bug UI ≠ données corrompues

5. IDEMPOTENCE
   └─ Même requête × N = même résultat
   └─ Retry safe sur tous les endpoints
   └─ Clé d'idempotence sur les mutations

6. EVENTUAL CONSISTENCY
   └─ Accepter le délai de propagation
   └─ Afficher l'état connu + indicateur sync
   └─ Résolution LWW (Last Write Wins) + merge manuel si conflit critique

7. LEAST PRIVILEGE
   └─ Permissions minimales par défaut
   └─ Escalade explicite et auditée
   └─ Révocation immédiate possible
```

### 🔧 Stack Technique Imposée

```yaml
Frontend:
  framework: Next.js 14+ (App Router)
  language: TypeScript 5.4+ (strict: true)
  styling: Tailwind CSS 3.4+
  components: shadcn/ui + Radix UI
  state: 
    global: Zustand
    server: TanStack Query v5
    forms: React Hook Form + Zod
  offline:
    sw: Workbox
    storage: IndexedDB via Dexie.js
    sync: Background Sync API
  charts: Recharts
  animations: Framer Motion

Backend:
  framework: FastAPI 0.110+
  language: Python 3.12+
  orm: SQLAlchemy 2.0+ (async)
  validation: Pydantic 2.6+
  tasks: Celery 5.4+ / Redis
  realtime: WebSocket + Server-Sent Events

Database:
  primary: PostgreSQL 16+
  cache: Redis 7.2+
  search: PostgreSQL FTS (pg_trgm)
  vectors: ChromaDB (pour RAG)

Infrastructure:
  containers: Docker 25+
  proxy: Caddy 2.7+ (auto SSL)
  ci_cd: GitHub Actions
  monitoring: Sentry + Prometheus + Grafana
```

---

## 3. CONTRAINTES TECHNIQUES

### 🔒 Sécurité

```yaml
Authentification:
  passwords:
    algorithm: Argon2id
    min_length: 12
    require: [uppercase, lowercase, digit, special]
    history: 5 (pas de réutilisation)
    expiration: 90 jours (optionnel)
    
  lockout:
    max_attempts: 5
    lockout_duration: 15 min
    progressive: true (5min, 15min, 1h, 24h)
    unlock: email ou admin
    
  sessions:
    access_token:
      algorithm: RS256
      expiration: 60 min
      refresh: silent via refresh token
    refresh_token:
      expiration: 30 jours
      rotation: true (invalidate on use)
      family_tracking: true (detect token reuse)
      
  mfa:
    methods: [TOTP, SMS, Email]
    required_for: [owner, manager, comptable]
    backup_codes: 10 codes à usage unique

Chiffrement:
  transit: TLS 1.3 obligatoire
  rest: AES-256-GCM pour données sensibles
  pii: Chiffrement au niveau champ (numéro SS, IBAN)
  
CORS:
  allowed_origins: [domaines explicites]
  credentials: true
  max_age: 86400

Rate Limiting:
  api: 100 req/min/IP
  auth: 10 req/min/IP
  webhooks: 1000 req/min global
```

### 📱 Performance

```yaml
Frontend:
  first_contentful_paint: < 1.5s
  largest_contentful_paint: < 2.5s
  time_to_interactive: < 3s
  cumulative_layout_shift: < 0.1
  
  bundle_size:
    initial: < 200KB gzip
    lazy_chunk: < 50KB each
    
  images:
    format: WebP/AVIF avec fallback
    lazy_loading: true
    srcset: responsive
    
Backend:
  p50: < 50ms
  p95: < 100ms
  p99: < 200ms
  
  database:
    query_max: 50ms
    connections: pool 10-50
    
Offline:
  cache_strategy:
    static: CacheFirst (1 semaine)
    api_read: StaleWhileRevalidate
    api_write: NetworkFirst avec queue
    
  storage_quota:
    indexeddb: < 50MB par défaut
    warning: 80%
    cleanup: LRU sur données > 30 jours
```

### 🇫🇷 Conformité Française

```yaml
NF525:
  description: Certification logiciel de caisse anti-fraude
  obligations:
    - Inaltérabilité des données de transaction
    - Sécurisation par signature électronique
    - Conservation 6 ans minimum
    - Archivage périodique
    - Clôture journalière obligatoire
  implementation:
    - Hash SHA-256 chaîné entre tickets
    - Numérotation séquentielle sans trou
    - Export FEC à la demande
    - Certificat annuel de conformité

HACCP:
  temperatures:
    chambre_froide_positive: [0, 4]
    chambre_froide_negative: [-25, -18]
    bain_marie: [63, 100]
    cuisson_viande: 63 à cœur min
    refroidissement: [63, 10] en < 2h
  tracabilite:
    search_time: < 2 min (obligation)
    retention: 3 ans + durée vie produit

RGPD:
  base_legale:
    clients: consentement ou contrat
    employes: contrat de travail
    prospect: intérêt légitime
  droits:
    acces: export JSON/PDF en < 30 jours
    rectification: modification en < 72h
    effacement: anonymisation ou suppression
    portabilite: export machine-readable
  retention:
    clients_actifs: durée relation + 3 ans
    clients_inactifs: 3 ans après dernière interaction
    employes: durée contrat + 5 ans
```

---

# PARTIE 2 : MODULES FONCTIONNELS

---

## 4. MODULE 0 : INFRASTRUCTURE

### 4.1 Multi-Établissement

```yaml
Hierarchie:
  organization:
    id: UUID
    name: string
    type: enum [group, franchise, independent]
    settings: JSON (paramètres par défaut)
    
  brand:
    id: UUID
    organization_id: UUID
    name: string
    logo: URL
    theme: JSON
    
  establishment:
    id: UUID
    brand_id: UUID
    name: string
    siret: string (14 chiffres)
    tva_intra: string (FR + 11 chiffres)
    address: Address
    timezone: string (Europe/Paris)
    currency: EUR
    status: enum [active, suspended, closed]

Permissions_Cross_Entity:
  - Un owner groupe voit tous les établissements
  - Un manager voit uniquement son établissement
  - Les données sont isolées par establishment_id (tenant)
  - Statistiques consolidées uniquement pour owner groupe
```

### 4.2 Authentification Détaillée

```yaml
Methodes:
  email_password:
    flow:
      1. POST /auth/login {email, password}
      2. Vérification password (Argon2)
      3. Si MFA activé → challenge
      4. Génération access_token + refresh_token
      5. Set cookies HttpOnly Secure SameSite=Strict
    errors:
      invalid_credentials: "Email ou mot de passe incorrect" (générique)
      account_locked: "Compte temporairement verrouillé"
      mfa_required: "Vérification en deux étapes requise"
      
  pin_code:
    usage: "Changement rapide d'utilisateur sur même device"
    flow:
      1. Device déjà authentifié (session active)
      2. Saisie PIN 4-6 chiffres
      3. Vérification locale (hash stocké)
      4. Switch utilisateur sans re-auth complète
    security:
      max_attempts: 3 avant re-auth complète
      session_bound: true
      
  badge_nfc:
    standards: [MIFARE Classic, MIFARE DESFire, NFC-A/B]
    flow:
      1. Lecture UID badge
      2. Lookup user par badge_id
      3. Authentification si badge valide + non révoqué
    security:
      anti_clone: challenge-response (DESFire)
      revocation: instantanée via admin
      
  biometric:
    types: [fingerprint, face_id]
    storage: "Local uniquement (Secure Enclave / TEE)"
    flow:
      1. Vérification biométrique locale
      2. Déverrouillage clé de session stockée
      3. Utilisation clé pour auth serveur
    fallback: PIN ou password
```

### 4.3 RBAC Complet

```yaml
Roles_Predefinies:
  owner:
    level: 100
    description: "Propriétaire / Gérant"
    permissions: ["*"]
    
  manager:
    level: 80
    description: "Directeur / Responsable"
    permissions:
      - pos.*
      - tables.*
      - reservations.*
      - staff.read
      - staff.schedule
      - analytics.read
      - settings.read
      
  chef:
    level: 60
    description: "Chef de cuisine"
    permissions:
      - kds.*
      - stocks.*
      - menu.manage
      - haccp.*
      - staff.kitchen.read
      
  bartender:
    level: 50
    description: "Barman"
    permissions:
      - pos.orders.bar
      - kds.bar
      - stocks.bar
      
  server:
    level: 40
    description: "Serveur"
    permissions:
      - pos.orders.own
      - tables.status
      - reservations.read
      
  host:
    level: 30
    description: "Hôte / Hôtesse"
    permissions:
      - reservations.*
      - tables.status
      - tables.assign
      
  accountant:
    level: 50
    description: "Comptable"
    permissions:
      - finances.read
      - reports.*
      - exports.*

Permissions_Format:
  pattern: "{module}.{resource}.{action}"
  examples:
    - pos.orders.create
    - pos.orders.refund
    - tables.status.update
    - reservations.manage
    - staff.schedule.edit
  wildcards:
    - pos.* (tout le module POS)
    - *.read (lecture sur tous modules)
    - * (super admin)

Custom_Roles:
  enabled: true
  creation: owner ou manager
  base: clone d'un rôle existant
  restrictions: "Ne peut pas dépasser son propre niveau"
```

### 4.4 Système de Notifications

```yaml
Channels:
  in_app:
    types: [toast, badge, notification_center, banner]
    priority: [low, medium, high, urgent]
    persistence: 
      toast: auto-dismiss 5s
      badge: until_read
      notification_center: 30 jours
      
  push:
    provider: Firebase Cloud Messaging
    payload:
      title: string (max 50)
      body: string (max 100)
      data: JSON (action, deep_link)
      priority: high | normal
    targeting: user_id ou topic
    
  email:
    provider: SendGrid
    templates:
      - reservation_confirmation
      - reservation_reminder
      - password_reset
      - invoice
      - marketing (opt-in)
    rate_limit: 10/min/user
    
  sms:
    provider: Twilio
    templates:
      - reservation_reminder_24h
      - table_ready
      - otp_verification
    rate_limit: 5/jour/user
    cost_aware: true
    
  whatsapp:
    provider: Meta Business API
    templates: pré-approuvés uniquement
    session_messages: 24h après dernier message user

Routing_Rules:
  severity_critical:
    channels: [push, sms, email]
    delay: immediate
    example: "Alerte température critique"
    
  severity_high:
    channels: [push, in_app]
    delay: immediate
    example: "Table attend depuis 30 min"
    
  severity_medium:
    channels: [in_app, email]
    delay: batch (5 min)
    example: "Stock faible"
    
  severity_low:
    channels: [in_app]
    delay: batch (1 hour)
    example: "Rapport hebdo disponible"

User_Preferences:
  per_channel: enabled/disabled
  per_type: customizable
  quiet_hours: 23h-7h (modifiable)
  digest_mode: combine en 1 notification
```

### 4.5 Audit Logs

```yaml
Event_Structure:
  id: UUID v7 (time-ordered)
  timestamp: ISO8601 UTC
  event_type: string (dot notation)
  event_version: integer
  
  actor:
    type: enum [user, system, api_key, webhook]
    id: UUID
    name: string
    role: string
    ip_address: string
    user_agent: string
    device_id: string
    session_id: UUID
    
  context:
    establishment_id: UUID
    request_id: UUID (correlation)
    
  target:
    type: string (entity type)
    id: UUID
    name: string
    
  action:
    type: enum [create, read, update, delete, export, login, logout, ...]
    
  changes:
    before: JSON (état avant, null si create)
    after: JSON (état après, null si delete)
    diff: JSON (uniquement les champs modifiés)
    
  metadata:
    reason: string (optionnel)
    ip_geo: {country, city}
    
Mandatory_Events:
  authentication:
    - auth.login.success
    - auth.login.failure
    - auth.logout
    - auth.password.change
    - auth.mfa.enable
    - auth.mfa.disable
    
  financial:
    - order.create
    - order.modify
    - order.cancel
    - payment.process
    - payment.refund
    - cash.open
    - cash.close
    - cash.adjustment
    
  pii:
    - customer.create
    - customer.update
    - customer.delete
    - employee.create
    - employee.update
    - employee.delete
    - data.export
    
  security:
    - permission.grant
    - permission.revoke
    - role.assign
    - settings.change

Storage:
  hot: PostgreSQL (90 jours)
  warm: TimescaleDB compressé (2 ans)
  cold: S3 Glacier (10 ans)
  
Search:
  indexed_fields: [event_type, actor.id, target.id, timestamp, establishment_id]
  full_text: changes (pour recherche dans les données)
  
Export:
  formats: [JSON Lines, CSV, PDF report]
  filters: date_range, event_type, actor, target
  auth: owner + explicit consent log
```

---

## 5. MODULE 1 : POINT DE VENTE

### 5.1 Architecture de l'Interface

```yaml
Layout_Desktop: # >= 1024px
  ┌────────────────────────────────────────────────────────────┐
  │ HEADER (60px)                                              │
  │ [Logo] [Heure] [Sync●] [Notifications🔔] [User👤] [Logout] │
  ├──────────────┬─────────────────────────────┬───────────────┤
  │ SIDEBAR      │ MAIN CONTENT                │ CART          │
  │ (280px)      │ (flex: 1)                   │ (400px)       │
  │              │                             │               │
  │ 🔍 Search    │ ┌─────┬─────┬─────┬─────┐  │ Table 7       │
  │              │ │     │     │     │     │  │ 4 couverts    │
  │ Categories   │ │ 🍖  │ 🍝  │ 🍕  │ 🥗  │  │ JD            │
  │ ├ Entrées    │ │     │     │     │     │  │ ───────────── │
  │ ├ Plats      │ ├─────┼─────┼─────┼─────┤  │ 2× Entrecôte  │
  │ ├ Desserts   │ │     │     │     │     │  │    +Béarnaise │
  │ └ Boissons   │ │ 🍰  │ 🍷  │ ☕  │ 🍺  │  │    = 56.00€   │
  │              │ │     │     │     │     │  │ 1× Tarte      │
  │ ⭐ Favoris   │ └─────┴─────┴─────┴─────┘  │    = 9.00€    │
  │              │                             │ ───────────── │
  │ 🕐 Récents   │ [Pagination / Scroll]       │ Total: 65.00€ │
  │              │                             │               │
  │              │                             │ [💳 Payer]    │
  └──────────────┴─────────────────────────────┴───────────────┘

Layout_Tablet: # 768px - 1023px
  - Sidebar devient drawer (hamburger menu)
  - Cart devient slide-over depuis la droite
  - Main content prend toute la largeur
  - Grille 3 colonnes

Layout_Mobile: # < 768px
  - Navigation bottom tabs
  - Recherche en header
  - Grille 2 colonnes
  - Cart en page séparée
```

### 5.2 Structure Menu Complète

```yaml
Category:
  id: UUID
  establishment_id: UUID
  parent_id: UUID | null (pour sous-catégories)
  
  name: string (max 50)
  name_short: string (max 20, pour boutons)
  icon: string (emoji ou icon name)
  color: string (hex)
  image: URL | null
  
  display_order: integer
  is_visible: boolean
  
  availability:
    channels: [dine_in, takeaway, delivery]
    days: [1,2,3,4,5,6,7]
    time_ranges: [{start: "11:30", end: "14:30"}]
    
  metadata:
    created_at: timestamp
    updated_at: timestamp
    created_by: UUID

Menu_Item:
  id: UUID
  establishment_id: UUID
  category_id: UUID
  
  # Identification
  sku: string | null
  barcode: string | null (EAN-13)
  name: string (max 100)
  name_short: string (max 30, pour tickets)
  name_kitchen: string | null (si différent)
  description: string (max 500)
  description_short: string (max 100)
  
  # Médias
  image: URL | null
  images: URL[] (galerie)
  video: URL | null
  
  # Prix
  pricing:
    base_price: decimal(10,2)
    tax_rate: decimal(4,2) # 5.5, 10, 20
    tax_included: true
    
    # Prix par taille
    size_variants:
      - name: "Petit"
        price_modifier: 0
        portions: 1
      - name: "Normal"
        price_modifier: 0
        portions: 1
      - name: "Grand"
        price_modifier: 3.00
        portions: 1.5
        
    # Prix par moment
    time_pricing:
      - name: "Midi"
        time_range: {start: "11:30", end: "14:30"}
        price: 18.00
      - name: "Soir"
        time_range: {start: "18:30", end: "22:30"}
        price: 24.00
        
    # Prix par canal
    channel_pricing:
      dine_in: null # base price
      takeaway: -1.00 # -1€
      delivery: +2.00 # +2€ (emballage)
      
  # Options et suppléments
  option_groups:
    - id: UUID
      name: "Cuisson"
      type: single_choice
      required: true
      min_selections: 1
      max_selections: 1
      options:
        - id: UUID
          name: "Bleu"
          price_modifier: 0
          is_default: false
        - id: UUID
          name: "Saignant"
          price_modifier: 0
          is_default: true
        - id: UUID
          name: "À point"
          price_modifier: 0
          is_default: false
        - id: UUID
          name: "Bien cuit"
          price_modifier: 0
          is_default: false
          
    - id: UUID
      name: "Suppléments"
      type: multiple_choice
      required: false
      min_selections: 0
      max_selections: 5
      options:
        - id: UUID
          name: "Sauce béarnaise"
          price_modifier: 2.00
        - id: UUID
          name: "Foie gras poêlé"
          price_modifier: 8.00
          
  # Allergènes (14 UE)
  allergens:
    contains: [gluten, eggs, milk]
    may_contain: [nuts] # traces
    custom_warning: "Contient du céleri"
    
  # Nutrition (pour 1 portion)
  nutrition:
    calories: 850
    protein: 45.0
    carbs: 12.0
    fat: 65.0
    fiber: 2.0
    sodium: 1.2
    source: enum [calculated, lab, supplier]
    
  # Production
  production:
    prep_time: 15 # minutes
    cook_time: 10
    print_zones: [kitchen_hot]
    recipe_id: UUID | null
    
  # Stock
  stock:
    managed: boolean
    current_quantity: integer | null
    low_threshold: integer
    disable_when_zero: boolean
    
  # Disponibilité
  availability:
    is_active: boolean
    channels: [dine_in, takeaway, delivery]
    days: [1,2,3,4,5,6,7]
    time_ranges: [{start: "11:30", end: "23:00"}]
    seasonal:
      start_date: date | null
      end_date: date | null
      
  # Badges
  badges:
    is_new: boolean
    is_popular: boolean
    is_chef_special: boolean
    is_vegetarian: boolean
    is_vegan: boolean
    is_organic: boolean
    is_local: boolean
    
  # Ordonnancement
  display_order: integer
  
  # Métadonnées
  metadata:
    created_at: timestamp
    updated_at: timestamp
    created_by: UUID
```

### 5.3 Workflow Commande Complet

```yaml
Flow_Creation_Commande:

  Step_1_Context:
    trigger: "Nouvelle commande"
    input:
      service_type: enum [dine_in, takeaway, delivery, bar]
      table_id: UUID | null (si dine_in)
      covers: integer (si dine_in)
      customer_id: UUID | null
    validation:
      - Si dine_in: table doit être libre ou occupée par même commande
      - Si covers: 1 <= covers <= table.max_capacity
    output:
      order:
        id: UUID
        number: string (YYMMDD-XXX, séquentiel jour)
        status: draft
        service_type: ...
        table_id: ...
        covers: ...
        customer_id: ...
        server_id: current_user.id
        created_at: now()

  Step_2_Add_Items:
    trigger: "Tap sur produit"
    
    case_simple: # Produit sans options obligatoires
      action: "Ajouter quantité 1 au panier"
      animation: "Fly-to-cart + badge bounce"
      feedback: "Haptic léger"
      
    case_with_options: # Produit avec options obligatoires
      action: "Ouvrir modale options"
      modal:
        header: "{product.name}"
        body:
          - Sélection taille (si applicable)
          - Sélection options obligatoires
          - Sélection options facultatives
          - Zone notes spéciales
        footer:
          - Prix calculé en temps réel
          - Bouton "Ajouter - {price}€"
      validation:
        - Toutes options required remplies
        - min/max selections respectées
        
    case_quantity: # Long press
      action: "Ouvrir modale quantité + options"
      shortcuts: [1, 2, 3, 5, 10]
      custom_input: number input

  Step_3_Modify_Cart:
    actions:
      edit_item:
        trigger: "Tap sur item dans panier"
        modal: "Même que ajout, pré-rempli"
        
      change_quantity:
        trigger: "Boutons +/- ou saisie directe"
        validation: quantity >= 1
        
      remove_item:
        trigger: "Swipe gauche ou bouton corbeille"
        confirmation: "Non pour 1 item, Oui si > 20€"
        
      add_note:
        trigger: "Bouton note sur item"
        types:
          preparation: "Sans sel, bien cuit"
          allergy: "⚠️ ALLERGIE ARACHIDES" # highlight
          timing: "Servir après les entrées"
          other: "Libre"
          
  Step_4_Coursing:
    description: "Grouper les items par vague d'envoi"
    default_logic:
      wave_1: Apéritifs (si catégorie)
      wave_2: Entrées
      wave_3: Plats
      wave_4: Desserts
      wave_5: Cafés / Digestifs
    manual_override:
      - Drag & drop entre vagues
      - "Envoyer avec" (coller à un autre item)
      - "Attendre signal" (ne pas envoyer auto)

  Step_5_Validation:
    pre_conditions:
      - Au moins 1 item dans le panier
      - Table non libérée entre-temps (si dine_in)
      - Stock disponible pour tous les items
      
    warnings_non_bloquants:
      - Item avec allergène + client allergique connu
      - Temps de prépa > 30 min cumulé
      - Ticket > 200€ (confirmation)
      
    actions:
      send_to_kitchen:
        - Créer KDS tickets par zone d'impression
        - Imprimer sur imprimantes thermiques
        - Mettre à jour status: sent
        - Notifier cuisine (si KDS digital)
        - Démarrer chronomètre
        
      hold:
        - Ne pas envoyer en cuisine
        - Status: on_hold
        - Badge visuel sur commande

  Step_6_Modifications_Post_Envoi:
    add_items:
      allowed: true
      process:
        - Créer nouvelle vague
        - Envoyer uniquement nouveaux items
        - Marquer comme "Suite commande"
        
    modify_item:
      conditions:
        - Status item != preparing && != ready
      process:
        - Notification cuisine "MODIFICATION"
        - Ancien item barré sur KDS
        - Nouveau item affiché
        
    cancel_item:
      conditions:
        - Status item == pending || item == sent
        - Si preparing: approbation chef requise
        - Si ready: non annulable (créer avoir si besoin)
      process:
        - Motif obligatoire
        - Approbation manager si > 15€
        - Notification cuisine "ANNULATION"
        - Mise à jour stock (si géré)
        - Log audit

  Step_7_Status_Tracking:
    item_statuses:
      pending: "En attente (pas envoyé)"
      sent: "Envoyé en cuisine"
      seen: "Vu par cuisine"
      preparing: "En préparation"
      ready: "Prêt"
      served: "Servi"
      cancelled: "Annulé"
      
    order_status:
      draft: "Brouillon"
      open: "Ouverte"
      partially_served: "Partiellement servi"
      served: "Entièrement servi"
      pending_payment: "En attente de paiement"
      paid: "Payée"
      closed: "Clôturée"
      cancelled: "Annulée"
```

### 5.4 Système de Paiement

```yaml
Payment_Flow:

  Step_1_Initiation:
    trigger: "Bouton Payer ou demande client"
    pre_actions:
      - Calculer totaux finaux
      - Appliquer remises/promos si actives
      - Vérifier cohérence (pas de prix négatif)
    display:
      - Liste items avec prix
      - Sous-total par TVA
      - Remises appliquées
      - Total TTC

  Step_2_Split_Decision:
    option_none:
      description: "Paiement unique"
      flow: → Step_3
      
    option_equal:
      description: "Division égale"
      input: nombre de personnes (2-20)
      calculation: total / n, arrondi au centime
      gestion_reste: sur la première part
      example:
        total: 100.00€
        personnes: 3
        parts: [33.34€, 33.33€, 33.33€]
        
    option_by_item:
      description: "Chacun paie ce qu'il a commandé"
      interface:
        - Liste items avec checkboxes
        - Assignation à "Personne 1", "Personne 2"...
        - Items partagés: division proportionnelle
      gestion_partages:
        - "Partagé à 2" = item.price / 2 chacun
        - "Partagé inégal" = saisie manuelle %
        
    option_by_amount:
      description: "Montants libres"
      validation: somme parts = total

  Step_3_Payment_Method:
    methods:
      card:
        providers: [stripe_terminal, sumup, square]
        flow:
          1. Créer PaymentIntent (Stripe) ou transaction
          2. Afficher "Présentez carte" sur terminal
          3. Attendre événement (success/failure)
          4. Timeout: 120s
        retry:
          on_failure: "Réessayer ?" (max 3)
          on_timeout: "Transaction annulée"
        contactless: true (< 50€ sans PIN, configurable)
        
      cash:
        flow:
          1. Saisir montant reçu
          2. Suggestions: arrondis supérieurs (20€, 50€, 100€)
          3. Calcul automatique rendu
          4. Affichage décomposition (optionnel)
          5. Ouverture tiroir (si connecté)
        validation:
          - Montant reçu >= montant dû
          - Alerte si rendu > 50€
          
      meal_voucher:
        types: [edenred, up, sodexo, swile, apetiz]
        rules:
          daily_limit: 25.00€
          eligible_only: food_items
          no_change: true
        flow:
          1. Scanner ou saisir numéro
          2. Vérifier validité (API ou manuel)
          3. Appliquer montant (max = min(limit, food_total))
          4. Reste à payer vers autre méthode
          
      check:
        flow:
          1. Saisir montant
          2. Saisir numéro chèque (optionnel)
          3. Saisir banque (optionnel)
        warning: "Chèque peut être rejeté"
        
      customer_account:
        conditions:
          - Client identifié
          - Compte crédit activé
          - Solde disponible suffisant OU crédit autorisé
        flow:
          1. Afficher solde actuel
          2. Confirmer débit
          3. Créer dette client
        reminder: email mensuel relevé
        
      mixed:
        description: "Plusieurs méthodes combinées"
        max_methods: 5
        flow:
          1. Premier paiement partiel
          2. Afficher reste à payer
          3. Deuxième méthode...
          4. Jusqu'à solde = 0

  Step_4_Tips:
    timing: "Après saisie méthode, avant confirmation"
    suggestions:
      display: "0% | 5% | 10% | 15% | Autre"
      base: total_ttc (ou HT, configurable)
      amounts: "5% = 3.50€"
    attribution:
      individual: → serveur de la table
      pool: → réparti selon règles (équitable, pondéré heures)
    accounting:
      separate: true (pourboire ≠ CA)
      export: distinct

  Step_5_Finalization:
    actions:
      - Créer transaction(s) de paiement
      - Mettre à jour statut commande: paid
      - Générer numéro de ticket (NF525)
      - Hasher et chaîner ticket
      - Imprimer ticket caisse
      - Envoyer par email (si demandé)
      - Mettre à jour caisse (si espèces)
      - Attribuer points fidélité (si client identifié)
      - Libérer table (optionnel: confirmation)
      
    receipt_content:
      header:
        - Logo restaurant
        - Nom et adresse
        - SIRET, TVA intra
        - Date et heure
        - N° ticket
      body:
        - Items avec prix
        - Sous-totaux par TVA
        - Remises
        - Total TTC
      payment:
        - Méthode(s)
        - Montant reçu, rendu (si espèces)
      footer:
        - Mentions légales
        - Message commercial
        - QR code fidélité/avis

  Step_6_Errors:
    card_declined:
      display: "Paiement refusé par la banque"
      action: "Proposer autre méthode"
      
    terminal_offline:
      display: "Terminal non connecté"
      action: "Instructions reconnexion ou fallback espèces"
      
    network_error:
      display: "Erreur réseau"
      action: "Retry automatique (3x), puis mode offline"
      offline_mode:
        - Stocker transaction localement
        - Marquer "En attente de sync"
        - Générer ticket provisoire
        - Sync au retour connexion
```

### 5.5 Calculs TVA

```yaml
TVA_France:
  taux:
    normal: 20.0 # Boissons alcoolisées, service
    intermediaire: 10.0 # Plats à consommer sur place
    reduit: 5.5 # À emporter, produits de première nécessité
    super_reduit: 2.1 # Certains médicaments (rare en resto)
    
  regles:
    sur_place:
      food: 10.0
      non_alcoholic_drinks: 10.0
      alcoholic_drinks: 20.0
      service_charge: 10.0 (suit le produit principal)
      
    a_emporter:
      food: 5.5 # si consommation immédiate
      drinks: 5.5
      
    livraison:
      food: 5.5
      delivery_fee: 20.0 # la prestation de livraison

Calcul:
  base: prix_ttc (le prix affiché inclut toujours la TVA)
  
  formules:
    ht_from_ttc: ttc / (1 + taux/100)
    tva_amount: ttc - ht
    
  exemple:
    item: "Entrecôte 28.00€ TTC"
    taux: 10%
    ht: 28.00 / 1.10 = 25.45€
    tva: 28.00 - 25.45 = 2.55€
    
  arrondis:
    method: "Arrondi au centime le plus proche"
    tva_line: "Calculée sur le sous-total par taux"
    
Ticket_Decomposition:
  format:
    - "Sous-total HT 10%: 45.00€"
    - "  TVA 10%: 4.50€"
    - "Sous-total HT 20%: 24.00€"
    - "  TVA 20%: 4.80€"
    - "Total TTC: 78.30€"
```

---

*[Suite dans le prochain fichier - Modules 2-9, UX et UI]*
# 🍽️ RESTAURANT OS V3 — PARTIE 2

> Suite des modules fonctionnels (2-9)

---

## 6. MODULE 2 : PLAN DE SALLE

### 6.1 Éditeur de Plan

```yaml
Canvas_Specifications:
  technology: Konva.js (React-Konva)
  rendering: 60 FPS minimum
  
  dimensions:
    scale: 1px = 1cm
    max_size: 5000 × 5000 px
    default_size: 2000 × 1500 px
    
  viewport:
    zoom:
      min: 0.25 (25%)
      max: 4.0 (400%)
      step: 0.1 (10%)
      controls: [pinch, wheel, buttons]
    pan:
      controls: [two_finger_drag, scroll, drag_empty_space]
      momentum: true
      bounds: canvas_size + 20% margin
      
  grid:
    enabled: toggle
    size: [25, 50, 100] cm (selectable)
    snap_to_grid: toggle
    snap_threshold: 10px
    
  layers:
    z_index:
      0: background_image (plan architecte)
      1: zones (surfaces colorées)
      2: walls_obstacles
      3: decorations
      4: tables
      5: table_labels
      6: status_overlay (runtime)
      7: selection_handles

Element_Types:

  table:
    shapes:
      round:
        presets: [60, 80, 100, 120, 150] # cm diamètre
        default_covers: [2, 4, 4, 6, 8]
      square:
        presets: [60, 80, 100] # cm côté
        default_covers: [2, 4, 4]
      rectangle:
        presets: [[80,120], [80,180], [90,240], [100,300]]
        default_covers: [4, 6, 8, 10]
      custom:
        type: polygon
        max_points: 12
        
    properties:
      id: UUID
      number: string # "1", "1A", "Terrasse 3"
      display_name: string | null # "Table romantique"
      
      capacity:
        min: integer (1-20)
        max: integer (1-30)
        optimal: integer
        
      geometry:
        shape: enum
        dimensions: object # selon shape
        position: {x: number, y: number}
        rotation: number (0-360°)
        
      appearance:
        fill_color: hex
        stroke_color: hex
        stroke_width: number
        
      assignment:
        zone_id: UUID
        default_server_id: UUID | null
        
      attributes:
        priority: integer (1=VIP, 10=last_choice)
        tags: string[] # ["vue", "fenêtre", "calme", "handicapé"]
        is_reservable_online: boolean
        is_joinable: boolean # peut être fusionnée
        
      notes: text
      
  zone:
    shapes: [rectangle, polygon]
    properties:
      id: UUID
      name: string
      type: enum [indoor, terrace, bar, private, smoking]
      
      appearance:
        fill_color: hex (avec alpha)
        stroke_color: hex
        stroke_style: solid | dashed
        
      availability:
        days: integer[] # 1-7
        time_ranges: TimeRange[]
        seasonal: {start: date, end: date} | null
        
      pricing:
        surcharge: decimal | null # Supplément terrasse
        
  wall:
    types: [solid, window, bay_window, door, counter]
    properties:
      points: [{x, y}]
      thickness: number
      type: enum
      
  obstacle:
    types: [pillar_round, pillar_square, stairs, elevator]
    properties:
      position: {x, y}
      dimensions: object
      
  decoration:
    types: [plant, fountain, fireplace, aquarium, artwork]
    properties:
      position: {x, y}
      size: {w, h}
      image: URL | icon_name
      rotation: number

Editor_Actions:
  selection:
    single: click
    multiple: shift+click or rectangle_select
    all: ctrl+a
    
  manipulation:
    move: drag
    resize: drag_handles
    rotate: rotation_handle or input_degrees
    duplicate: ctrl+d or context_menu
    delete: delete_key or backspace
    
  alignment:
    tools:
      - align_left/right/center
      - align_top/bottom/middle
      - distribute_horizontally/vertically
      - equalize_spacing
    guides:
      smart_guides: true # snap aux autres éléments
      center_guides: true
      
  history:
    undo: ctrl+z (50 levels)
    redo: ctrl+y
    history_panel: list of actions
    
  save:
    auto_save: every_30_seconds
    versions:
      draft: current_editing
      published: active_version
      history: previous_versions (keep 10)

Multi_Configuration:
  use_cases:
    - "Standard"
    - "Été (terrasse ouverte)"
    - "Hiver (terrasse fermée)"
    - "Brunch (tables rapprochées)"
    - "Événement privé"
    
  structure:
    configuration:
      id: UUID
      name: string
      base_plan_id: UUID
      
      modifications:
        tables_hidden: UUID[]
        tables_added: Table[]
        tables_moved:
          - table_id: UUID
            new_position: {x, y, rotation}
        zones_modified: Zone[]
        
      activation:
        mode: enum [manual, scheduled, condition]
        schedule:
          - days: [6, 7] # Samedi, Dimanche
            time: "10:00-16:00"
            config: "Brunch"
        conditions:
          - type: weather
            rule: "temp > 15 AND !rain"
            config: "Été"
            
  switching:
    manual: button in settings
    automatic: cron job evaluating rules
    notification: alert staff on change
    transition:
      orders_in_progress: "Keep on original table"
      reservations: "Suggest remapping"
```

### 6.2 Statuts et Temps Réel

```yaml
Table_Status:
  states:
    available:
      color: "#22C55E" # green-500
      icon: "check-circle"
      description: "Disponible pour installation"
      
    reserved:
      color: "#3B82F6" # blue-500
      icon: "calendar"
      description: "Réservation confirmée à venir"
      sub_info:
        - reservation_time
        - customer_name
        - covers
        - time_until (-15min pour prep)
        
    occupied:
      color: "#EF4444" # red-500
      icon: "users"
      description: "Service en cours"
      sub_states:
        awaiting_order:
          color: "#F59E0B" # amber-500
          trigger: "seated > 5min AND no_order"
          alert_at: 10 min
        order_sent:
          color: "#EF4444"
          info: "wave_number/total_waves"
        serving:
          color: "#EF4444"
          info: "course_icon" # 🥗🍽️🍰☕
        awaiting_bill:
          color: "#8B5CF6" # violet-500
          trigger: "bill_requested"
          alert_at: 5 min
        paying:
          color: "#8B5CF6"
          info: "payment_in_progress"
          
    cleaning:
      color: "#F97316" # orange-500
      icon: "sparkles"
      description: "En attente de nettoyage"
      trigger: "auto after payment"
      duration_estimate: 5 min
      alert_at: 10 min
      
    out_of_service:
      color: "#6B7280" # gray-500
      icon: "x-circle"
      description: "Non utilisable"
      reasons: ["maintenance", "réservé événement", "capacité réduite"]

Table_Display:
  visual_elements:
    shape: geometry from plan
    fill: status_color (with transparency)
    stroke: darker shade of status_color
    
    number_badge:
      position: center
      size: proportional to table
      font: bold
      
    covers_badge:
      position: top-right
      format: "👥 4"
      
    server_badge:
      position: bottom-left
      format: initials or avatar
      
    time_badge:
      position: bottom-right
      format: "MM:SS" elapsed since seating
      color_progression:
        green: < 30min
        amber: 30-60min
        red: > 60min (configurable by service type)
        
    alert_indicator:
      position: top-left
      icon: "!!" or ⚠️
      pulse_animation: true
      trigger: any alert condition
      
    amount_badge:
      position: center-bottom
      format: "€XX"
      visibility: configurable
      
  hover_state:
    effect: elevate + shadow
    tooltip:
      content:
        - Table number + name
        - Status
        - Covers
        - Server name
        - Time elapsed
        - Current order total
        - Next reservation (if any)
        
  click_action:
    opens: table_detail_panel

Realtime_Updates:
  technology: WebSocket + SSE fallback
  
  events:
    table_status_changed:
      payload:
        table_id: UUID
        old_status: string
        new_status: string
        metadata: object
      action: update table display
      
    order_updated:
      payload:
        order_id: UUID
        table_id: UUID
        items_status: object
      action: update course indicator
      
    reservation_approaching:
      payload:
        reservation_id: UUID
        table_id: UUID
        time_until: integer (minutes)
      action: flash table, show countdown
      
  latency:
    target: < 500ms end-to-end
    degraded_mode: polling every 5s
```

### 6.3 Opérations sur Tables

```yaml
Operations:

  seat_guests:
    trigger: "Installer clients (walk-in ou réservation)"
    flow:
      1. Sélectionner table
      2. Saisir nombre de couverts
      3. Si réservation: lier à la réservation
      4. Si client identifié: lier au client
      5. Créer nouvelle commande (draft)
      6. Changer statut: occupied
    validation:
      - Table doit être available ou reserved (pour cette résa)
      - Couverts <= table.max_capacity
      
  merge_tables:
    trigger: "Groupe plus grand que table unique"
    flow:
      1. Sélectionner table A (occupée ou libre)
      2. Sélectionner table B (libre, adjacente)
      3. Confirmer fusion
      4. Tables liées visuellement
      5. Commandes sur table principale
    constraints:
      - Tables doivent être dans la même zone
      - Si A occupée, B doit être libre
      - Max 4 tables fusionnées
    visual:
      - Ligne de connexion entre tables
      - Badge "Fusionnée" sur table secondaire
      
  split_tables:
    trigger: "Séparer groupe ou fin de service partielle"
    flow:
      1. Sélectionner groupe fusionné
      2. Choisir tables à séparer
      3. Répartir la commande (si applicable)
      4. Générer notes séparées
    constraints:
      - Ne pas séparer si paiement en cours
      
  transfer_order:
    trigger: "Déplacer clients vers autre table"
    flow:
      1. Sélectionner table source
      2. Drag vers table destination
      3. Confirmer transfert
      4. Commande transférée
      5. Table source: cleaning
      6. Table destination: occupied
    constraints:
      - Destination doit être available ou cleaning
      - Destination.capacity >= source.covers
      
  change_covers:
    trigger: "Arrivée/départ de convives"
    flow:
      1. Modifier le nombre (+ ou -)
      2. Mise à jour statistiques
    validation:
      - covers >= items_ordered (si menu par couvert)
      
  flag_alert:
    trigger: "Signalement manuel"
    types:
      - "Client mécontent"
      - "Attente excessive"
      - "Besoin manager"
      - "VIP"
    effect:
      - Icône sur table
      - Notification appropriée
      
  mark_cleaning_done:
    trigger: "Nettoyage terminé"
    flow:
      1. Swipe ou bouton sur table
      2. Statut → available
      3. Attribution file d'attente (si applicable)
```

---

## 7. MODULE 3 : RÉSERVATIONS & CRM

### 7.1 Système de Réservation

```yaml
Channels:

  widget_web:
    integration: "<iframe>" or "<script> Web Component"
    customization:
      colors: inherit from restaurant theme
      logo: optional
      language: auto-detect or selectable
    features:
      - Calendar with availability
      - Time slot selection
      - Guest count (1-20, larger = group form)
      - Contact form
      - Special requests
      - Deposit payment (if required)
      - Instant confirmation
      
  backoffice:
    users: host, manager, owner
    features:
      - Full calendar view
      - Manual override (overbooking)
      - Customer lookup
      - Detailed notes
      - Table assignment
      - Walk-in quick entry
      
  api_partners:
    thefork:
      sync: bidirectional real-time
      webhook_events:
        - reservation_created
        - reservation_modified
        - reservation_cancelled
        - reservation_seated
        - reservation_no_show
      data_mapping:
        thefork_id ↔ internal_id
        customer: create_if_not_exists
        
    google_reserve:
      prerequisites: verified GMB profile
      integration: Reserve with Google API
      features:
        - Real-time availability
        - Direct booking from Search/Maps
        
Booking_Form:
  required_fields:
    date:
      type: date_picker
      min: today
      max: today + 90 days
      blocked_dates: [holidays, closures, private_events]
      
    time:
      type: time_slots
      interval: 15 min
      display: only_available
      rules:
        - Respect service hours
        - Respect max capacity per slot
        - Show "Few spots left" warning
        
    covers:
      type: stepper or dropdown
      min: 1
      max: 12 (20 for large group form)
      
    customer_name:
      type: text
      validation: min 2 chars
      
    phone:
      type: tel
      format: international (E.164)
      validation: regex + optional SMS OTP
      
    email:
      type: email
      validation: format + optional verification
      
  optional_fields:
    zone_preference:
      type: select
      options: [Aucune, Terrasse, Intérieur, Bar, Privé]
      
    occasion:
      type: select
      options:
        - Aucune
        - Anniversaire → auto_note + candle
        - Romantique → quiet_table
        - Affaires → discrete_table
        - Famille → large_table
        - Autre
        
    special_requests:
      type: textarea
      max: 500 chars
      examples:
        - "Allergique aux fruits de mer"
        - "Chaise bébé nécessaire"
        - "Végétarien strict"
        
    high_chair:
      type: number
      default: 0
      
    wheelchair:
      type: checkbox
      effect: filter compatible tables
      
  deposit:
    trigger:
      - covers >= 6
      - special_dates (NYE, Valentine's)
      - new_customer with high no_show rate
    amount: fixed (€20/person) or percentage (20%)
    payment: Stripe Checkout embedded
    policy:
      refund_if: cancelled >= 48h before
      forfeit_if: cancelled < 48h or no_show

Capacity_Rules:
  service_definition:
    - name: "Déjeuner"
      days: [1,2,3,4,5] # Mon-Fri
      start: "11:30"
      last_seating: "14:00"
      end: "15:30"
      
    - name: "Dîner"
      days: [1,2,3,4,5,6]
      start: "18:30"
      last_seating: "21:30"
      end: "23:30"
      
    - name: "Brunch"
      days: [0] # Sunday
      start: "10:00"
      last_seating: "14:00"
      end: "16:00"
      
  capacity:
    per_service: 80 covers
    per_slot:
      max_arrivals: 30 # limiter affluence simultanée
      calculation: |
        Available = total_capacity 
          - confirmed_reservations 
          - estimated_walkins (10%)
          
  duration_estimation:
    by_meal_type:
      lunch_weekday: 75 min
      lunch_weekend: 90 min
      dinner_weekday: 100 min
      dinner_weekend: 120 min
      brunch: 90 min
    by_covers:
      1-2: -15 min
      3-4: 0
      5-6: +15 min
      7+: +30 min
    by_menu:
      tasting_menu: +45 min
      
  overbooking:
    strategy: allow 10% over capacity
    justification: compensate ~8% no-show rate
    safeguard: hard limit at 115%
    conflict_resolution:
      priority: reservation_time, then deposit_paid, then VIP
      actions: [bar_seating, delay_request, voucher]

Table_Assignment:
  modes:
    automatic:
      algorithm:
        1. Filter by capacity (min <= covers <= max)
        2. Filter by zone preference (if any)
        3. Filter by accessibility (if required)
        4. Filter by time conflict (buffer = estimated_duration + cleanup)
        5. Score remaining tables:
           - Optimal capacity match: 40%
           - Minimize waste (small group on small table): 30%
           - Balance server workload: 20%
           - Customer preferences (if known): 10%
        6. Select highest score
      run: on_reservation_create, on_day_batch
      
    manual:
      who: host, manager
      override: always possible
      
  visual:
    calendar_view:
      x_axis: tables
      y_axis: time
      blocks: reservations (color by status)
      
    floor_plan_view:
      overlay: time slider
      shows: which tables reserved at given time

Confirmation_Flow:
  on_booking:
    email:
      template: reservation_confirmation
      content:
        - Restaurant name, address, phone
        - Date, time, covers
        - Customer name
        - Special requests echo
        - Modification/cancellation link (token-based)
        - Add to calendar (ICS attachment)
        - Map link
        - Cancellation policy reminder
    sms: optional, short confirmation
    
  reminders:
    48h:
      channel: email
      content: "Votre réservation approche. Confirmez ou modifiez."
      action_buttons: [Confirmer, Modifier, Annuler]
      tracking: open, click
      
    24h:
      channel: sms + email
      content: "Rappel: Demain {{time}} chez {{restaurant}}. Répondez OUI pour confirmer."
      response_handling:
        OUI: status → confirmed
        NON or ANNULER: status → cancelled
        no_response: status → unconfirmed (flag for follow-up)
      
    2h:
      channel: sms (optional)
      content: "Nous vous attendons dans 2h ! 🍽️"

Modification_Rules:
  customer_can:
    - Change date/time (if availability)
    - Reduce covers
    - Add special requests
    - Cancel
  deadline:
    free_modification: >= 24h before
    late_modification: requires call (< 24h)
  flow:
    1. Access via link in confirmation email
    2. Authenticate (email OTP or phone match)
    3. Make changes
    4. Confirm
    5. Updated confirmation sent

Cancellation_Rules:
  customer:
    free: >= 48h (or custom policy)
    late_fee: deposit forfeited if < 48h
    no_show: deposit forfeited + flagged
    
  restaurant:
    allowed: exceptional circumstances
    action: call + email + voucher offer
    
No_Show_Management:
  detection:
    trigger: reservation_time + 15min AND not_seated AND not_contacted
    
  actions:
    1. Mark as no_show
    2. Release table (attribute to waitlist if any)
    3. Forfeit deposit (if applicable)
    4. Update customer_no_show_count
    5. Send notification (if configured)
    
  scoring:
    no_show_rate: no_shows / total_reservations
    
  penalties:
    threshold_1: "1 no-show → warning email"
    threshold_2: "2 no-shows → require phone confirmation"
    threshold_3: "3 no-shows in 12 months → block online reservation for 6 months"
    
  rehabilitation:
    after: 6 months without incident
    action: remove restrictions
```

### 7.2 CRM Client

```yaml
Customer_Profile:
  identity:
    id: UUID
    source: enum [reservation, pos, import, manual]
    created_at: timestamp
    
    title: enum [M., Mme, Mx, null]
    first_name: string
    last_name: string
    
    photo:
      source: [gravatar, upload, initials]
      url: string
      
  contact:
    emails:
      - address: string
        is_primary: boolean
        is_verified: boolean
        is_valid: boolean (no bounce)
    phones:
      - number: string (E.164)
        is_primary: boolean
        is_mobile: boolean
        sms_opt_in: boolean
        whatsapp: boolean
    address:
      line1: string
      line2: string
      city: string
      postal_code: string
      country: string
      geo: {lat, lng}
      
  personal:
    birth_date: date
    language: enum [fr, en, es, de, it]
    
  professional:
    company: string
    job_title: string
    company_siret: string # for invoicing
    
  preferences:
    favorite_zone: UUID
    favorite_table: UUID
    favorite_server: UUID
    preferred_time: time_range
    
  dietary:
    allergies: enum[] # 14 EU allergens
    diets: string[] # vegan, halal, keto...
    notes: text
    
  tags:
    system:
      vip: boolean # auto: spend > 1000€/year OR visits > 10/year
      regular: boolean # > 3 visits/year
      new: boolean # first visit < 90 days
      dormant: boolean # no visit > 6 months
      at_risk: boolean # frequency declining
    custom: string[] # press, influencer, friend_owner, critic
    
  notes:
    content: text (rich text)
    visibility: staff_only
    updated_by: UUID
    updated_at: timestamp

Customer_History:
  visits:
    aggregate:
      first_visit: date
      last_visit: date
      total_visits: integer
      avg_days_between_visits: number
      
    list:
      - date: timestamp
        type: enum [reservation, walk_in]
        covers: integer
        table: string
        server: string
        order_id: UUID
        spent: decimal
        tip: decimal
        duration: integer (minutes)
        feedback: {rating: 1-5, comment: text}
        
  spending:
    lifetime_value: decimal
    average_ticket: decimal
    last_12_months: decimal
    trend: enum [up, stable, down]
    
  preferences_detected:
    top_items:
      - name: "Entrecôte sauce béarnaise"
        times_ordered: 8
      - name: "Tarte tatin"
        times_ordered: 5
    top_wines:
      - "Bordeaux rouges"
    behaviors:
      - "Commande souvent dessert"
      - "Reste en moyenne 1h30"
      - "Préfère tables près de la fenêtre"
      
  reservations:
    total: integer
    no_shows: integer
    cancellations: integer
    reliability_rate: percentage
    
  reviews:
    google:
      rating: float
      comment: text
      date: date
      responded: boolean
    tripadvisor:
      rating: float
      comment: text
      date: date

Loyalty_Program:
  earning:
    base: "1€ spent = 1 point"
    bonuses:
      first_visit: 50 points
      birthday: 100 points
      referral: 200 points (when referee visits)
      review_google: 50 points
    multipliers:
      happy_hour: 2x
      special_day: 3x (e.g., Mardi des membres)
      gold_status: 1.5x
      platinum_status: 2x
      
  tiers:
    bronze:
      threshold: 0
      benefits: ["Programme points de base"]
      
    silver:
      threshold: 500 points cumul 12 mois
      benefits:
        - "Gains ×1.25"
        - "Priorité réservation"
        
    gold:
      threshold: 1500 points
      benefits:
        - "Gains ×1.5"
        - "Table prioritaire"
        - "Coupe champagne anniversaire"
        
    platinum:
      threshold: 5000 points
      benefits:
        - "Gains ×2"
        - "Meilleure table garantie"
        - "Accès événements VIP"
        - "Menu dégustation offert /an"
        
  redemption:
    rewards:
      - points: 100
        reward: "Café offert"
        value: 3.00€
      - points: 250
        reward: "Dessert offert"
        value: 8.00€
      - points: 500
        reward: "Apéritif offert"
        value: 12.00€
      - points: 1000
        reward: "Entrée + Plat offert"
        value: 25.00€
        
    usage:
      mode: on_demand at payment
      partial: true (use 500 of 750)
      combine_promo: false
      
  expiration:
    points: 24 months of inactivity
    tier: recalculated every 12 months
    warning: 30 days before expiration

Segmentation:
  automatic_segments:
    new_customers:
      criteria: first_visit < 90 days
      action_suggestion: "Email bienvenue avec offre retour"
      
    regulars:
      criteria: visits_12m >= 4
      action_suggestion: "Programme fidélité, invitations"
      
    vip:
      criteria: spend_12m >= 1000 OR visits_12m >= 10
      action_suggestion: "Attention personnalisée, exclusivités"
      
    dormant:
      criteria: last_visit > 180 days AND total_visits >= 2
      action_suggestion: "Campagne réactivation 'Vous nous manquez'"
      
    at_risk:
      criteria: current_frequency < avg_frequency * 0.5
      action_suggestion: "Contact personnalisé, offre rétention"
      
    birthdays_this_month:
      criteria: birth_date.month == current_month
      action_suggestion: "Email/SMS anniversaire avec offre"
      
  custom_segments:
    builder:
      type: visual query builder
      criteria:
        - all customer fields
        - calculated metrics
        - tags
        - order history
      operators: [equals, contains, greater_than, in_list, not]
      combination: AND / OR
      
    examples:
      wine_lovers:
        criteria:
          - "Ordered wine >= 5 times"
          - "OR tag = oenophile"
        campaign: "Soirées dégustation"
        
      corporate_groups:
        criteria:
          - "Has reserved for >= 6 people"
          - "AND company is not empty"
        campaign: "Offres séminaires"
```

---

## 8. MODULE 4 : KITCHEN DISPLAY SYSTEM

### 8.1 Interface Production

```yaml
Screen_Layout:
  mode_kanban:
    columns:
      todo:
        label: "À FAIRE"
        color: "#374151" # gray-700
        max_visible: 8
        scroll: true
        
      in_progress:
        label: "EN COURS"
        color: "#1E40AF" # blue-800
        max_visible: 6
        
      ready:
        label: "PRÊT"
        color: "#15803D" # green-700
        max_visible: 4
        flash_if: age > 5 min
        
  mode_by_station:
    stations:
      - cold
      - hot
      - grill
      - pastry
      - bar
    each_station:
      filter: items where print_zone == station
      columns: [todo, in_progress, ready]
      
  mode_timeline:
    x_axis: time (30 min window)
    y_axis: orders
    blocks: order_items with estimated_completion

Order_Card:
  structure:
    header:
      order_number: large, bold, centered
      time_received: HH:MM
      elapsed_timer: MM:SS (counting up)
      priority_badge: if applicable
      
    table_info:
      format: "Table 7 · 4 couverts"
      server: initials or avatar
      channel: icon [🍽️ dine-in, 📦 takeaway, 🚗 delivery]
      
    items:
      per_item:
        quantity: large circle with number
        name: item name
        modifiers: in italics/different color
        special_notes: highlighted
        allergy: ⚠️ RED UPPERCASE BOXED
        coursing_badge: "Avec entrées" / "Attendre signal"
        status_checkbox: ☑️ when done
        
    notes_section:
      if_present: yellow background
      format: 📝 "{note}"
      allergy_notes: red border, uppercase
      
    footer:
      action_buttons: based on current state
      progress: "2/4 items done"

Visual_Codes:
  time_based:
    normal:
      condition: elapsed < avg_prep_time
      indicator: green dot or border
    attention:
      condition: avg_prep_time < elapsed < avg_prep_time * 1.5
      indicator: amber dot + subtle pulse
    late:
      condition: elapsed > avg_prep_time * 1.5
      indicator: red dot + stronger pulse
    critical:
      condition: elapsed > avg_prep_time * 2
      indicator: red flashing + sound alert
      
  priority_badges:
    allergy:
      icon: ⚠️
      color: red
      label: "ALLERGIE"
      sound: alert_chime
    vip:
      icon: ⭐
      color: gold
      label: "VIP"
    rush:
      icon: 🔥
      color: red-orange
      label: "URGENT"
    modification:
      icon: ✏️
      color: blue
      label: "MODIF"

Priority_Algorithm:
  levels:
    1_critical:
      criteria:
        - Contains declared allergy
        - Manually marked URGENT
      positioning: always at top
      visual: red border, alert sound
      
    2_vip:
      criteria:
        - Table tagged VIP
        - Customer tagged VIP
      positioning: after critical
      visual: gold badge
      
    3_time_overdue:
      criteria: elapsed > threshold
      thresholds:
        attention: 15 min
        alert: 25 min
        critical: 35 min
      positioning: escalate in queue
      
    4_coursing:
      logic: |
        Group items by table + wave
        Within wave: respect send order
        Starters before mains of same table
        Sync cold and hot of same wave
        
    5_fifo:
      default: by order_received_at

Touch_Interactions:
  on_item:
    tap: toggle done status
    long_press: context menu
      - Mark done
      - Mark problem
      - View recipe
      - Report stock issue
      
  on_card:
    tap: expand details
    long_press: context menu
      - Call server
      - Mark all ready
      - Report problem
      - Reprint
      
    swipe_right: bump to ready (if all items done)
    swipe_left: flag problem → prompt reason
    swipe_up: bump card (remove from screen)
    
  bump:
    trigger: all items ready + swipe up OR bump button
    effect:
      - Remove from screen
      - Archive
      - Update order status in POS
      - Notify server (if configured)
    reversible: yes (recall from history, 15 min window)

Coursing:
  waves:
    default_sequence:
      1: Apéritifs
      2: Entrées
      3: Plats
      4: Fromages (if ordered)
      5: Desserts
      6: Cafés / Digestifs
      
  synchronization:
    within_wave:
      rule: all items of same table + wave served together
      display: grouped on same card section
      timing: start all when slowest is ~80% done
      
    cross_station:
      scenario: cold entrée + hot entrée same wave
      solution:
        - Cold shows "HOLD" until hot signals ~2 min
        - Hot signals "Ready soon"
        - Both bump when hot ready
        
  manual_override:
    fire_next_course: server triggers from POS
    hold_course: mark "Attendre signal"
    rush_course: prioritize immediately

Recall_Modifications:
  recall:
    use_case: item sent back, need correction
    flow:
      1. Server initiates from POS
      2. KDS shows: ⚡ RECALL - [item] - [reason]
      3. Priority: critical
      4. Timer restarts
      
  modification:
    use_case: customer changes mind after order sent
    rules:
      - If item.status == pending or sent: modify directly
      - If item.status == preparing: ask chef confirmation
      - If item.status == ready: cannot modify (compensation instead)
    display:
      old: strikethrough
      new: highlighted
      badge: MODIF
      
  cancellation:
    rules:
      - If not started: remove from KDS
      - If preparing: notification to chef
      - If ready: alert + waste tracking
    display: card marked ANNULÉ, grey out
```

### 8.2 Communication

```yaml
Kitchen_To_Service:
  plat_ready:
    trigger: item marked ready OR card bumped
    notification:
      recipient: server of the table
      channels: [push_app, pass_display, smartwatch_vibrate]
      content: "🍽️ Table {table}: {item_name} prêt"
      action: open order detail
      
  cooling_alert:
    trigger: ready_item.age > 5 min AND not_picked
    notification:
      recipients: [server, manager]
      channels: [push_priority, kds_flash]
      content: "⚠️ Table {table}: {item} refroidit !"
      
  manual_call:
    trigger: chef presses "Call server"
    channels: [push_priority]
    content: "📢 Chef demande pour Table {table}"

Service_To_Kitchen:
  fire_course:
    trigger: server presses "Envoyer suite"
    display: badge "🔥 ENVOYER" on relevant cards
    
  hold_course:
    trigger: server marks "Attendre"
    display: badge "⏸️ HOLD" until released
    
  modification:
    trigger: change from POS
    display: MODIF badge, update card content
    
  cancellation:
    trigger: cancel from POS
    display: ANNULÉ overlay, move to cancelled section
    
  complaint:
    trigger: issue reported from POS
    types:
      - "Pas assez cuit → Recuisson"
      - "Trop cuit → Refaire"
      - "Mauvais plat → Correction"
      - "Portion insuffisante → Supplément"
    display: new card with PRIORITÉ HAUTE + reason

Pass_Display:
  location: between kitchen and service
  content:
    - List of ready items grouped by table
    - Time since ready
    - Server name
    - Alert color coding
  interactions:
    - Tap to mark "picked up"
    - Link to server pager
```

---

*[Suite : Modules 5-9, UX et UI dans Part 3]*
# 🍽️ RESTAURANT OS V3 — PARTIE 3

> Modules 5-9 : Stocks, RH, HACCP, Analytics, Comptabilité

---

## 9. MODULE 5 : STOCKS & ACHATS

### 9.1 Gestion des Articles

```yaml
Article_Structure:
  identification:
    id: UUID
    sku: string (custom reference)
    barcodes:
      - code: string (EAN-13, UPC-A, Code128)
        is_primary: boolean
    name: string
    name_display: string (for UI)
    alias: string[] (alternative names for search)
    
  classification:
    category_id: UUID
    subcategory_id: UUID
    tags: string[] [bio, local, AOP, surgelé, allergène_gluten...]
    
  units:
    stock_unit: enum [unit, kg, L, g, mL, cl]
    purchase_unit: enum [unit, pack, case, kg, L]
    conversion_rate: decimal # 1 case = 6 units
    recipe_unit: enum [kg, L, g, mL, piece]
    recipe_conversion: decimal
    
  storage:
    type: enum [ambient, refrigerated, frozen, cellar]
    temp_range:
      min: number
      max: number
    zone: string # "Chambre froide 1", "Économat sec"
    location: string # "Étagère A3"
    
  shelf_life:
    default_days: integer
    secondary_days: integer # after opening
    
  supplier:
    primary:
      supplier_id: UUID
      supplier_sku: string
      unit_price: decimal
      min_order_qty: integer
      lead_time_days: integer
    alternatives:
      - supplier_id: UUID
        supplier_sku: string
        unit_price: decimal
        notes: string
        
  thresholds:
    min_stock: decimal # alert when below
    max_stock: decimal # prevent over-ordering
    reorder_qty: decimal # suggested order quantity
    
  status:
    is_active: boolean
    is_purchasable: boolean
    is_sellable: boolean
    is_recipe_ingredient: boolean

Stock_Levels:
  current_stock: decimal # physical count
  reserved: decimal # committed to orders not yet produced
  available: decimal # current - reserved
  incoming: decimal # purchase orders in transit
  projected: decimal # available + incoming

Stock_Movements:
  types:
    receipt:
      trigger: purchase order received
      flow:
        1. Scan or select PO
        2. Verify items (quantity, quality, temp, DLC)
        3. Record actual qty (may differ from ordered)
        4. Assign batch/lot number
        5. Assign storage location
        6. Update stock levels
      fields:
        purchase_order_id: UUID
        supplier_id: UUID
        batch_number: string
        expiry_date: date
        received_qty: decimal
        temp_at_receipt: number
        quality_check: enum [OK, RESERVE, REFUSED]
        notes: text
        photos: URL[]
        
    issue_production:
      trigger: items used in kitchen
      modes:
        automatic:
          trigger: order item sold
          calculation: recipe × quantity
        manual:
          trigger: explicit withdrawal
      fields:
        order_id: UUID | null
        recipe_id: UUID | null
        qty: decimal
        reason: enum [production, waste, tasting, staff_meal]
        
    adjustment:
      trigger: inventory count discrepancy
      fields:
        counted_qty: decimal
        system_qty: decimal
        difference: decimal
        reason: enum [theft, loss, damage, miscount, spoilage, donation]
        requires_approval: if abs(difference) > threshold
        
    transfer:
      trigger: move between locations
      fields:
        from_location: string
        to_location: string
        qty: decimal
        
    waste:
      trigger: explicit loss recording
      fields:
        qty: decimal
        reason: enum [expired, damaged, accident, quality]
        cost_impact: decimal
        photos: URL[]
        
    return:
      trigger: send back to supplier
      fields:
        supplier_id: UUID
        qty: decimal
        reason: text
        credit_note_expected: boolean
```

### 9.2 Inventaires

```yaml
Inventory_Types:
  full:
    frequency: monthly
    scope: all items
    process:
      1. Schedule date (low activity preferred)
      2. Generate count sheets by zone
      3. Teams count physical stock
      4. Enter quantities (tablet/mobile)
      5. System calculates variances
      6. Investigate large variances (> 5%)
      7. Approve adjustments
      8. Lock and finalize
      
  rolling:
    frequency: weekly
    scope: 1 category per week (rotate)
    benefit: less disruption, consistent accuracy
    
  spot_check:
    frequency: random or triggered
    triggers:
      - High-value items
      - Items with repeated variances
      - Before audit
    scope: specific items
    
  perpetual:
    description: real-time tracking via recipe deductions
    accuracy: depends on recipe precision
    reconciliation: needed periodically

Inventory_Interface:
  count_entry:
    modes:
      list_view:
        - Item name
        - Expected qty (optional, can hide to avoid bias)
        - Input field for count
        - Unit
        - Last count date
        - Variance indicator
        
      scan_mode:
        - Scan barcode
        - Enter qty
        - Next item
        
    offline: yes (sync when connected)
    
  variance_review:
    display:
      - Item
      - Expected
      - Counted
      - Difference (qty and %)
      - Value impact
      
    actions:
      recount: reset to uncounted
      accept: accept variance
      adjust: create adjustment movement
      investigate: flag for review

Valuation:
  methods:
    fifo:
      description: First In First Out
      calculation: oldest purchases consumed first
      use_case: standard for food (matches expiry logic)
      
    weighted_average:
      description: Coût Moyen Pondéré
      calculation: (old_value + new_purchase_value) / total_qty
      use_case: simpler, good for high-turnover items
      
  reports:
    stock_value:
      - Total value by category
      - Value by zone
      - Aging analysis (days since receipt)
      
    movement_summary:
      - Receipts
      - Issues
      - Adjustments
      - Waste
      - Net change
```

### 9.3 Achats

```yaml
Supplier_Management:
  profile:
    identity:
      id: UUID
      name: string
      legal_name: string
      siret: string
      tva_intra: string
      address: Address
      
    contacts:
      - name: string
        role: string
        phone: string
        email: string
        is_primary: boolean
        
    commercial:
      payment_terms: enum [immediate, 30_days, 45_days, 60_days]
      payment_method: enum [transfer, check, card]
      discount: {percentage: decimal, condition: text}
      min_order: decimal
      free_shipping_above: decimal
      
    logistics:
      delivery_days: integer[] # [1,3,5] = Mon, Wed, Fri
      delivery_times: time_range
      lead_time: integer (days)
      
    catalog:
      format: enum [api, csv, pdf, manual]
      sync_frequency: enum [realtime, daily, weekly, manual]
      items: SupplierItem[]
      
  evaluation:
    metrics:
      quality_rating: 1-5
      delivery_on_time_rate: percentage
      fill_rate: percentage (items delivered / ordered)
      price_competitiveness: ranking
    reviews:
      - date: timestamp
        rating: 1-5
        comment: text
        reviewer: UUID

Purchase_Orders:
  creation:
    modes:
      manual:
        - Select supplier
        - Add items from catalog
        - Specify quantities
        - Review totals
        - Submit
        
      suggestion:
        trigger: stock.available < stock.min_threshold
        calculation: |
          suggested_qty = max(
            min_order_qty,
            reorder_qty,
            (forecast_usage × lead_time × safety_factor) - available
          )
        display:
          - Item
          - Current stock
          - Min threshold
          - Suggested qty
          - Est. cost
        action: review and convert to PO
        
      recurring:
        template:
          - Items and base quantities
          - Frequency (weekly, biweekly)
          - Adjustment window (days before to modify)
        flow:
          1. System generates draft PO from template
          2. Manager reviews/adjusts
          3. Auto-submit if not modified
          
  workflow:
    statuses:
      draft:
        actions: [edit, delete, submit]
      pending_approval:
        condition: total > approval_threshold
        actions: [approve, reject]
      approved:
        actions: [send, cancel]
      sent:
        transmission: [email, API, EDI]
        actions: [cancel, mark_confirmed]
      confirmed:
        supplier_acknowledgment: true
        actions: [receive, cancel]
      partially_received:
        when: received_qty < ordered_qty
        actions: [receive_more, close]
      received:
        auto_transition: when all lines received
        actions: [create_invoice, close]
      invoiced:
        linked_to: invoice
        actions: [pay, dispute]
      closed:
        final_state: true

Invoice_Processing:
  ocr_extraction:
    input: PDF or photo
    extracted_fields:
      - Supplier (match to database)
      - Invoice number
      - Invoice date
      - Due date
      - Line items:
        - Description
        - Quantity
        - Unit price
        - Total
      - Subtotal HT
      - TVA amounts
      - Total TTC
    confidence_scores: per field
    manual_correction: for low confidence
    
  three_way_match:
    documents:
      PO: what was ordered
      Receipt: what was received
      Invoice: what supplier is billing
    matching_rules:
      quantity:
        tolerance: 0% (exact match required)
        on_mismatch: flag for review
      price:
        tolerance: 2% (minor price variation allowed)
        on_mismatch: flag if over tolerance
      items:
        on_extra_item: flag - not ordered
        on_missing_item: flag - not invoiced
    outcomes:
      full_match: auto-approve for payment
      minor_variance: approve with adjustment
      major_variance: escalate to manager
      
  payment_scheduling:
    based_on: invoice.due_date
    reminders: 7 days, 3 days, 1 day before
    methods:
      bank_transfer: SEPA via banking API
      check: manual with reminder
      card: direct charge
```

### 9.4 Food Cost

```yaml
Theoretical_Food_Cost:
  per_item:
    calculation: |
      cost = Σ (ingredient.qty × ingredient.unit_cost)
      food_cost_% = cost / selling_price_HT × 100
    targets:
      entrees: 25-30%
      plats: 28-32%
      desserts: 20-25%
      boissons: 20-25%
      
  per_period:
    calculation: |
      theoretical = Σ (item.cost × item.qty_sold)
      theoretical_% = theoretical / CA_HT × 100

Actual_Food_Cost:
  calculation: |
    actual = stock_start + purchases - stock_end
    actual_% = actual / CA_HT × 100
    
  frequency: weekly minimum, daily ideal
  
Variance_Analysis:
  formula: |
    variance = actual_% - theoretical_%
    variance_€ = (actual - theoretical)
    
  interpretation:
    positive_variance: # actual > theoretical (MAUVAIS)
      causes:
        - Waste not recorded
        - Portions too large
        - Theft
        - Recipe not followed
        - Inventory count error
        - Price increase not updated
        
    negative_variance: # actual < theoretical (à investiguer)
      causes:
        - Portions too small
        - Inventory overcount
        - Unrecorded purchases
        
  thresholds:
    acceptable: ±2%
    investigate: 2-5%
    critical: >5%
    
  actions:
    - Recipe cost review
    - Portion training
    - Waste tracking emphasis
    - Inventory recount
    - Supplier price check
```

---

## 10. MODULE 6 : RESSOURCES HUMAINES

### 10.1 Gestion des Employés

```yaml
Employee_Profile:
  identity:
    id: UUID
    employee_number: string (internal ref)
    
    title: enum [M., Mme, Mx]
    first_name: string
    last_name: string
    birth_date: date
    birth_place: string
    nationality: string
    
    photo: URL
    
  contact:
    address: Address
    phone_personal: string
    phone_work: string
    email_personal: string
    email_work: string
    emergency_contact:
      name: string
      relationship: string
      phone: string
      
  administrative:
    social_security: string (encrypted)
    work_permit:
      required: boolean
      type: string
      expiry: date
      document: URL
      
  banking:
    iban: string (encrypted)
    bic: string
    bank_name: string
    
  contract:
    type: enum [CDI, CDD, interim, apprentice, intern, extra]
    start_date: date
    end_date: date | null (if CDD)
    trial_period_end: date
    
    position:
      title: string
      category: string # employé, agent de maîtrise, cadre
      echelon: string
      coefficient: integer
      
    compensation:
      base_salary:
        amount: decimal
        period: enum [hourly, monthly, annual]
      bonuses:
        - type: string
          amount: decimal
          frequency: enum [monthly, quarterly, annual]
      benefits:
        - meal_vouchers: boolean
        - transport: percentage
        - mutual: contribution_percentage
        
  working_hours:
    contract_hours: decimal # per week
    schedule_type: enum [fixed, variable, modulation]
    
  qualifications:
    skills:
      - name: string
        level: enum [beginner, intermediate, advanced, expert]
        validated_by: UUID
        validated_at: date
    certifications:
      - type: string # HACCP, Sommelier, etc.
        issued_at: date
        expires_at: date
        document: URL
        
  documents:
    required:
      - contract_signed
      - id_copy
      - rib
      - medical_certificate
      - social_security_card
    uploaded:
      - type: string
        file: URL
        uploaded_at: date
        validated: boolean

Onboarding:
  checklist:
    before_start:
      - [ ] Contrat signé
      - [ ] Documents reçus
      - [ ] Visite médicale programmée
      - [ ] Accès créés (login, badge)
      - [ ] Équipement préparé (uniforme, badge)
      
    day_1:
      - [ ] Accueil par manager
      - [ ] Tour établissement
      - [ ] Présentation équipe
      - [ ] Formation sécurité incendie
      - [ ] Remise équipement
      - [ ] Configuration app mobile
      
    week_1:
      - [ ] Formation HACCP si non certifié
      - [ ] Formation poste de travail
      - [ ] Parrainage assigné
      
    month_1:
      - [ ] Point RH
      - [ ] Évaluation essai
      - [ ] Retour collaborateur
```

### 10.2 Planning

```yaml
Schedule_Structure:
  shift:
    id: UUID
    employee_id: UUID
    date: date
    
    time:
      start: time
      end: time
      break_start: time | null
      break_duration: integer # minutes
      
    type: enum [regular, training, meeting, event]
    position: string # Serveur, Cuisine, Bar
    zone: string | null # Terrasse, Salle 1
    
    status: enum [draft, published, confirmed, worked, absent]
    
  template:
    name: string
    shifts:
      - day_of_week: integer (1-7)
        position: string
        start: time
        end: time
        employee_id: UUID | null
    usage:
      - Apply to week
      - Auto-generate recurring

Planning_Interface:
  views:
    week_by_employee:
      rows: employees
      columns: days
      cells: shifts with times
      
    week_by_position:
      rows: positions
      columns: days
      cells: employees assigned
      
    day_timeline:
      x_axis: hours (opening to closing)
      y_axis: employees
      blocks: shifts
      
  actions:
    create_shift:
      - Drag on empty cell
      - Or click + fill form
      
    edit_shift:
      - Click to open modal
      - Drag edges to resize
      - Drag to move
      
    copy:
      - Copy shift: Ctrl+C then Ctrl+V
      - Copy day: option in context menu
      - Copy week: duplicate entire week
      
    delete:
      - Click delete in modal
      - Or select + Delete key
      
  validation:
    real_time_checks:
      legal_constraints:
        - Min 11h rest between shifts
        - Max 10h work per day (or 12h exception)
        - Max 48h per week (or 44h average over 12 weeks)
        - Min 1 day off per week
        - Max 6 consecutive days
        - Break 20min if shift > 6h
        
      business_rules:
        - Required skills for position
        - Min coverage per position per shift
        - No double booking
        
    indicators:
      ok: green (all constraints met)
      warning: amber (approaching limit)
      error: red (violation)
      
  publication:
    workflow:
      1. Manager creates/edits planning (draft)
      2. Validate (check constraints)
      3. Publish (visible to employees)
      4. Notify employees (app + email)
      
    deadline: X days before start of week
    changes_after_publish: require employee notification

Leave_Management:
  types:
    conges_payes:
      accrual: 2.5 days / month worked
      max_accumulation: 30 days
      
    rtt:
      if_applicable: based on contract
      
    maladie:
      requires: medical_certificate
      delay: 48h to submit
      
    sans_solde:
      requires: manager_approval
      
    evenement_familial:
      types: [mariage, naissance, deces, demenagement]
      days: per convention
      
  workflow:
    request:
      1. Employee submits via app
      2. Fields: type, start, end, reason
      3. System checks balance
      
    approval:
      1. Manager notification
      2. Review (check coverage)
      3. Approve / Reject with comment
      4. Employee notification
      5. Calendar updated
      
  calendar_view:
    display: who's off when
    color_coding: by type
    conflict_detection: understaffed days
```

### 10.3 Pointage

```yaml
Clock_Methods:
  badge_nfc:
    hardware: NFC reader at entrance
    process:
      1. Employee badges
      2. System identifies employee
      3. Determine clock_in or clock_out (toggle)
      4. Record timestamp
      5. Display confirmation
    anti_fraud:
      - Badge personal, non-transferable
      - Photo verification (optional)
      
  qr_code:
    process:
      1. Employee opens app
      2. Scans QR displayed at terminal
      3. QR contains location_id + timestamp + signature
      4. Record clock event
    security:
      - QR refreshes every 30s
      - Location verified via QR
      
  pin_code:
    process:
      1. Employee enters personal PIN on terminal
      2. Record clock event
    security:
      - PIN 4-6 digits
      - Max 3 attempts, then lockout
      
  biometric:
    types: [fingerprint, facial_recognition]
    storage: template stored locally (GDPR)
    consent: required, opt-in
    fallback: PIN if biometric fails
    
  geolocation:
    use_case: external sites, catering events
    process:
      1. Employee clocks via mobile app
      2. GPS position recorded
      3. Verify within allowed radius
    privacy:
      - Location only at clock moment
      - No continuous tracking

Clock_Events:
  structure:
    id: UUID
    employee_id: UUID
    timestamp: datetime
    type: enum [clock_in, clock_out, break_start, break_end]
    method: enum [badge, qr, pin, biometric, geo, manual]
    device_id: string
    location_id: UUID
    gps: {lat, lng} | null
    
  processing:
    pair_matching:
      - Associate clock_in with next clock_out
      - Calculate gross_hours
      - Deduct breaks
      - Calculate net_hours
      
    anomaly_detection:
      missing_clock_out:
        threshold: 14h after clock_in
        action: alert manager
        
      forgotten_clock_in:
        detection: clock_out without prior clock_in
        action: prompt for correction
        
      short_shift:
        threshold: < 1h
        action: flag for review
        
      early_late:
        comparison: vs scheduled time
        tolerance: 5 min
        action: flag if outside

Time_Calculation:
  standard:
    weekly_base: 35h (or contract hours)
    daily_max: 10h (or 12h exception)
    
  overtime:
    calculation:
      36-43h: rate × 1.25
      44h+: rate × 1.50
    monthly_cap: varies by convention
    
  night_hours:
    definition: 21:00 - 06:00
    supplement: +10% (or convention rate)
    
  sunday_holiday:
    supplement: per convention collective
    
  on_call:
    compensation: fixed amount or hourly rate
    
  output:
    weekly_summary:
      - Gross hours
      - Net hours
      - Overtime 25%
      - Overtime 50%
      - Night hours
      - Sunday hours
```

---

## 11. MODULE 7 : HACCP & CONFORMITÉ

### 11.1 Monitoring Température

```yaml
Sensors:
  types:
    fixed:
      installation: inside equipment
      connection: wifi or LoRa
      frequency: every 5 min
      equipment:
        - Chambre froide positive
        - Chambre froide négative
        - Congélateur
        - Vitrine réfrigérée
        - Bain-marie
        
    portable:
      use: manual spot checks
      types:
        - Thermomètre sonde
        - Thermomètre infrarouge
      logging: manual entry in app

Monitoring:
  dashboard:
    display:
      - All sensors grid
      - Current temp + trend
      - Status indicator (OK / Warning / Alert)
      - Last update time
      
    graph:
      - 24h temperature curve
      - Acceptable range shaded
      - Excursions highlighted
      
  recording:
    automatic:
      interval: 5 min (configurable)
      storage: 3 years (HACCP)
      
    manual:
      schedule: 2x daily (opening, closing)
      process:
        1. Select equipment
        2. Enter temperature
        3. Confirm (or flag if out of range)

Alerts:
  thresholds:
    chambre_froide_positive:
      normal: [0, 4]
      warning: [4, 7]
      critical: > 7 or < -1
      
    chambre_froide_negative:
      normal: [-25, -18]
      warning: [-18, -15]
      critical: > -15
      
    bain_marie:
      normal: [63, 90]
      warning: [60, 63]
      critical: < 60
      
  trigger:
    immediate: if critical reaches threshold
    delayed: if warning persists > 15 min
    
  notification:
    recipients: [chef, manager, owner]
    channels: [push_priority, sms]
    content:
      - Equipment name
      - Current temp
      - Duration
      - Required action
      
  corrective_actions:
    required: must log action taken
    options:
      - "Vérifié, porte mal fermée, corrigé"
      - "Panne équipement, appel technicien"
      - "Produits déplacés vers autre équipement"
      - "Produits jetés (T° trop haute trop longtemps)"
```

### 11.2 Plans de Nettoyage

```yaml
Cleaning_Plans:
  structure:
    zone:
      id: UUID
      name: string # "Cuisine", "Salle", "Sanitaires"
      
    tasks:
      - id: UUID
        zone_id: UUID
        name: string # "Nettoyer plans de travail"
        description: text # detailed procedure
        frequency: enum [per_service, daily, weekly, monthly, quarterly]
        schedule:
          days: integer[] # for weekly+
          time: time | null # preferred time
        requires_photo: boolean
        requires_validation: boolean # chef must approve
        products: string[] # cleaning products to use
        safety: string # PPE required

Execution:
  daily_checklist:
    display:
      - Tasks grouped by zone
      - Status: ⬜ pending, ✅ done, ⏰ overdue
      - Assignee (if assigned)
      
    process:
      1. Staff opens checklist
      2. Performs task
      3. Takes photo (if required)
      4. Marks complete
      5. Signs (digital signature)
      6. Timestamp recorded
      
  validation:
    who: chef or manager
    when: end of service or daily
    actions:
      - Review completed tasks
      - Check photos
      - Approve or request redo
      
  non_completion:
    escalation:
      1. Warning notification to manager
      2. If not done by deadline: alert owner
      3. Recorded in compliance log

Reports:
  completion_rate:
    formula: tasks_done / tasks_due × 100
    target: 100%
    dashboard: trend over time
    
  audit_trail:
    for_each_task:
      - Scheduled date/time
      - Completed date/time
      - Completed by
      - Photo (if applicable)
      - Validated by
      - Any issues flagged
```

### 11.3 Traçabilité

```yaml
Receipt_Traceability:
  mandatory_records:
    per_delivery:
      - Date/time
      - Supplier name
      - Delivery person (if known)
      - Invoice/BL number
      
    per_item:
      - Product name
      - Quantity received
      - Batch/lot number (from supplier)
      - Expiry date (DLC or DDM)
      - Temperature at receipt
      - Visual quality check (OK/NOK)
      
  process:
    1. Receive delivery
    2. Check products (temp, quality, qty)
    3. Scan or enter each item
    4. Take photo of label (lot + DLC)
    5. If issue: refuse with reason
    6. Store in appropriate location

Internal_Traceability:
  batch_tracking:
    creation:
      when: production with multiple ingredients
      assigns: internal batch number
      links: input batches → output batch
      
    example:
      input:
        - Boeuf lot A123 (2kg)
        - Carottes lot B456 (500g)
      output:
        - Boeuf bourguignon lot INT-20241228-001 (10 portions)
        
  consumption_tracking:
    link_to_sale:
      when: item sold
      record: which batch(es) used
      enables: downstream traceability to customer
      
Forward_Traceability:
  query: "Which customers ate batch X?"
  output:
    - Order ID
    - Date/time
    - Customer (if known)
    - Quantity consumed
    
Backward_Traceability:
  query: "What batches went into this dish?"
  output:
    - All ingredient batches
    - Supplier for each
    - Receipt date
    
Recall_Management:
  trigger: supplier notification or internal detection
  process:
    1. Identify affected batch(es)
    2. Query forward traceability
    3. If products still in stock: quarantine
    4. If consumed: assess if customer notification needed
    5. Document all actions
    6. Report to authorities if required
    
  target_time: < 2 minutes for full trace
```

---

## 12. MODULE 8 : ANALYTICS

### 12.1 KPIs

```yaml
Revenue_KPIs:
  chiffre_affaires:
    definition: Total des ventes TTC
    granularity: [day, week, month, year]
    comparison: [previous_period, same_period_last_year, budget]
    visualization: line chart with overlay
    
  ticket_moyen:
    formula: CA TTC / Nombre de tickets
    target: configurable
    segments: [service, channel, day_of_week]
    
  revenue_per_cover:
    formula: CA TTC / Nombre de couverts
    use: compare efficiency
    
  revpash:
    formula: CA / (Seats × Opening hours)
    definition: Revenue Per Available Seat Hour
    optimization: maximize this
    
  sales_mix:
    breakdown: by category (food/bev), by item
    visualization: donut chart
    actionable: identify top/bottom performers

Operational_KPIs:
  covers:
    total: per service, day, week, month
    average_per_table: indicator of party size
    occupancy_rate: covers / max_capacity
    
  table_turnover:
    formula: seatings / number of tables
    by_service: lunch vs dinner
    target: 1.5-2.5 depending on concept
    
  average_dining_time:
    measurement: clock_seated to bill_paid
    by_segment: [covers, day_type, service]
    optimization: reduce without hurting experience
    
  wait_time:
    kitchen: order_sent to ready
    service: ready to served
    targets: configurable by dish type
    alerts: when exceeding

Cost_KPIs:
  food_cost_percentage:
    formula: cost of goods sold / revenue × 100
    target: 28-32%
    tracking: weekly
    
  labor_cost_percentage:
    formula: (wages + charges) / revenue × 100
    target: 30-35%
    tracking: weekly, with forecast
    
  prime_cost:
    formula: food_cost + labor_cost
    target: < 65% of revenue
    
  gross_margin:
    formula: revenue - food_cost
    per_item: for menu engineering
    
Customer_KPIs:
  new_vs_returning:
    definition: % of identified customers that are repeat
    tracking: monthly
    
  customer_lifetime_value:
    formula: avg_ticket × visits_per_year × avg_relationship_years
    
  no_show_rate:
    formula: no_shows / total_reservations × 100
    target: < 5%
    
  average_rating:
    sources: [google, tripadvisor, internal_feedback]
    tracking: rolling 30 days
```

### 12.2 Dashboards

```yaml
Executive_Dashboard:
  audience: Owner, Manager
  refresh: real-time for today, daily for historical
  
  sections:
    today_snapshot:
      widgets:
        - Big number: CA today (vs yesterday, vs same day last week)
        - Progress: CA vs daily target
        - Current covers + occupancy
        - Pending reservations
        
    financial_summary:
      period: selectable (week, month, YTD)
      widgets:
        - Revenue chart (line)
        - Ticket moyen trend
        - Food cost gauge
        - Labor cost gauge
        
    performance_grid:
      metrics:
        - Service speed
        - Customer rating
        - Table turnover
        
    alerts_feed:
      - Stock low
      - Equipment issues
      - Staff shortages
      - Unusual patterns

Operational_Dashboard:
  audience: Manager, Chef, Maître d'hôtel
  refresh: real-time
  
  sections:
    live_status:
      floor_plan: with table statuses
      kitchen_load: pending tickets
      reservations_today: timeline
      
    service_metrics:
      - Wait time by station
      - Items in queue
      - Staff present vs required
      
    today_timeline:
      chart: covers by hour (actual vs expected)
```

---

## 13. MODULE 9 : COMPTABILITÉ

### 13.1 Exports

```yaml
FEC:
  description: Fichier des Écritures Comptables (obligatoire France)
  trigger: on demand or auto monthly
  format: TXT, pipe-separated
  encoding: ISO-8859-15 or UTF-8 BOM
  
  columns:
    - JournalCode (VT = ventes, AC = achats, BQ = banque...)
    - JournalLib
    - EcritureNum
    - EcritureDate (YYYYMMDD)
    - CompteNum
    - CompteLib
    - CompAuxNum
    - CompAuxLib
    - PieceRef
    - PieceDate
    - EcritureLib
    - Debit
    - Credit
    - EcritureLet
    - DateLet
    - ValidDate
    - Montantdevise
    - Idevise
    
  validation:
    - All mandatory fields present
    - Debit = Credit per journal
    - Sequential EcritureNum
    - Valid dates

Standard_Exports:
  journal_ventes:
    content: daily sales by VAT rate
    format: CSV, Excel
    
  journal_achats:
    content: supplier invoices
    format: CSV, Excel
    
  grand_livre:
    content: all movements by account
    
  balance:
    content: account balances
    period: month, quarter, year

Integrations:
  quickbooks:
    method: API (OAuth 2.0)
    sync: invoices, payments
    frequency: daily
    
  sage:
    method: file export (format Sage)
    delivery: SFTP or email
    
  pennylane:
    method: API
    real_time: yes
```

### 13.2 Clôture de Caisse

```yaml
Daily_Close:
  when: end of each business day
  who: manager or designated employee
  
  process:
    1_count_cash:
      - Open cash drawer
      - Count all denominations
      - Enter amounts per denomination
      - System calculates total
      
    2_compare:
      system_expected:
        opening_float: decimal
        cash_sales: decimal
        cash_refunds: decimal
        cash_deposits: decimal # if made during day
        expected_balance: decimal
        
      actual_count: decimal
      
      variance: actual - expected
      
    3_investigate_variance:
      if variance != 0:
        - Check for missed transactions
        - Check for errors
        - Record explanation (mandatory if > threshold)
        
    4_record_payments:
      card_payments:
        by_terminal: list amounts
        reconcile: with terminal batch
      other:
        checks: count and amount
        meal_vouchers: count and amount
        
    5_generate_z_report:
      content:
        - Date, time
        - Operator
        - Period (opening to closing time)
        - Sales summary by VAT rate
        - Sales summary by payment method
        - Refunds and voids
        - Discounts and offers
        - Cash movements
        - Variance (if any)
        - Sequential Z number
        - Cryptographic hash
        
      signature: digital + optional physical
      
    6_archive:
      storage: 10 years (NF525)
      format: PDF + data

Monthly_Close:
  tasks:
    - Verify all daily closes complete
    - Generate monthly summary
    - Run inventory
    - Calculate food cost
    - Review variances
    - Export to accounting
    - Archive documents
```

---

*[Suite : Partie 4 - UX et UI Design System]*
# 🍽️ RESTAURANT OS V3 — PARTIE 4

> UX Design & UI Design System

---

# PARTIE 3 : UX DESIGN

---

## 14. USER FLOWS

### 14.1 Flow : Prise de Commande Express

```yaml
Scenario: "Serveur prend une commande pour 4 couverts, table 7"
Durée_cible: < 2 minutes pour commande standard

Flow:
  step_1:
    action: "Tap sur Table 7 (statut: libre)"
    screen: Plan de salle
    result: Modal "Installer clients"
    
  step_2:
    action: "Saisir 4 couverts → Confirmer"
    screen: Modal installation
    result:
      - Table passe en "occupée"
      - Création commande brouillon
      - Redirection vers POS avec contexte table
      
  step_3:
    action: "Tap catégorie Apéritifs"
    screen: POS
    micro_interaction:
      - Catégorie highlight
      - Produits se chargent (skeleton 100ms max)
      
  step_4:
    action: "Tap sur 'Kir Royal' × 2"
    screen: POS grille produits
    result:
      - 1er tap: ajout 1 au panier, animation fly-to-cart
      - 2ème tap: quantité +1
    feedback:
      - Haptic léger
      - Badge quantité bounce
      
  step_5:
    action: "Tap catégorie Entrées"
    screen: POS
    
  step_6:
    action: "Long press 'Foie gras maison'"
    screen: POS grille
    result: Modal options
    content_modal:
      - Quantité (default 1)
      - Options: Accompagnement (obligatoire)
        - Pain brioché ✓
        - Pain de campagne
      - Notes spéciales (textarea)
      
  step_7:
    action: "Sélectionner 'Pain brioché' → Ajouter"
    result:
      - Item ajouté avec option
      - Modal ferme
      - Retour grille
      
  step_8:
    action: "Répéter pour autres items"
    
  step_9:
    action: "Review panier → Tap 'Envoyer cuisine'"
    screen: POS - Cart sidebar
    result:
      - Confirmation visuelle
      - Tickets envoyés au KDS
      - Impression tickets cuisine
      - Commande status: "open"
      - Toast: "Commande envoyée ✓"
      
Optimisations_UX:
  - Favoris: les items fréquents en haut
  - Récents: derniers items commandés
  - Suggestions: "Voulez-vous ajouter des desserts ?" avant validation
  - Raccourcis: 1-9 pour quantité rapide
  - Swipe: gauche sur item panier pour supprimer
```

### 14.2 Flow : Réservation Client (Widget Web)

```yaml
Scenario: "Client réserve en ligne pour 4 personnes samedi soir"
Durée_cible: < 1 minute

Flow:
  step_1:
    screen: Widget intégré sur site restaurant
    display:
      - Logo restaurant
      - Champ date (datepicker)
      - Champ nombre de personnes (stepper 1-12)
      - Champ heure (dropdown/slots)
      - Bouton "Voir disponibilités"
      
    defaults:
      date: aujourd'hui
      personnes: 2
      heure: prochain service
      
  step_2:
    action: "Sélectionner Samedi 28/12"
    micro_interaction:
      - Datepicker avec jours indisponibles grisés
      - Samedi sélectionné highlight
      
  step_3:
    action: "Changer à 4 personnes"
    micro_interaction:
      - Stepper avec +/- 
      - Animation nombre
      
  step_4:
    action: "Sélectionner 20h00"
    display:
      - Créneaux disponibles en vert
      - Créneaux complets en gris
      - "Dernières places" badge si < 2 tables
      
  step_5:
    action: "Click 'Réserver ce créneau'"
    result: Passage à l'écran formulaire
    
  step_6:
    screen: Formulaire coordonnées
    fields:
      - Prénom* 
      - Nom*
      - Email*
      - Téléphone*
      - Occasion (dropdown optionnel)
      - Demandes spéciales (textarea optionnel)
      - Checkbox CGV*
      
    validation:
      - Temps réel sur chaque champ
      - Email format
      - Téléphone format (autoformat)
      
  step_7:
    action: "Remplir et soumettre"
    states:
      - Button: "Confirmer" → "Réservation en cours..." (spinner)
      - Si succès: confetti animation + écran confirmation
      - Si erreur: message clair + retry
      
  step_8:
    screen: Confirmation
    content:
      - ✅ "Réservation confirmée !"
      - Récapitulatif (date, heure, personnes)
      - Adresse restaurant + carte
      - Bouton "Ajouter au calendrier"
      - Lien modification/annulation
      - "Email de confirmation envoyé"
      
Micro_interactions:
  - Transition fluide entre étapes (slide)
  - Progress indicator subtil
  - Validation en temps réel (checkmarks verts)
  - Error shake sur champs invalides
```

### 14.3 Flow : Clôture de Caisse

```yaml
Scenario: "Manager ferme la caisse en fin de service"

Flow:
  step_1:
    action: "Accéder à Caisse → Clôture"
    prerequisite:
      - Toutes commandes clôturées ou en attente
      - Alerte si commandes ouvertes restantes
      
  step_2:
    screen: Assistant de clôture - Étape 1/4
    title: "Comptage Espèces"
    content:
      - Tableau des dénominations:
        | Billet/Pièce | Quantité | Total |
        |--------------|----------|-------|
        | 50€          | [___]    | 0.00€ |
        | 20€          | [___]    | 0.00€ |
        | 10€          | [___]    | 0.00€ |
        | 5€           | [___]    | 0.00€ |
        | 2€           | [___]    | 0.00€ |
        | 1€           | [___]    | 0.00€ |
        | 0.50€        | [___]    | 0.00€ |
        | 0.20€        | [___]    | 0.00€ |
        | 0.10€        | [___]    | 0.00€ |
        | 0.05€        | [___]    | 0.00€ |
      - Total compté: calculé en temps réel
      
    interaction:
      - Clavier numérique optimisé
      - Tab pour champ suivant
      - Calcul instantané
      
  step_3:
    screen: Étape 2/4 - Vérification écart
    content:
      - Solde théorique: XXX.XX€
      - Solde compté: XXX.XX€
      - Écart: ±X.XX€
      
    states:
      écart_nul:
        display: ✅ "Caisse équilibrée"
        color: green
        
      écart_mineur: # < 5€
        display: ⚠️ "Écart mineur"
        color: amber
        action: "Note explicative (optionnel)"
        
      écart_majeur: # >= 5€
        display: ❌ "Écart important"
        color: red
        action: "Note explicative (obligatoire)"
        escalation: notification manager
        
  step_4:
    screen: Étape 3/4 - Autres paiements
    content:
      - Encaissements CB: XXX.XX€ (auto depuis terminaux)
      - Titres restaurant: XXX.XX€ (saisie manuelle ou auto)
      - Chèques: XXX.XX€
      - Rappel: "Vérifiez que le total CB correspond au relevé terminal"
      
  step_5:
    screen: Étape 4/4 - Récapitulatif
    content:
      - Chiffre d'affaires TTC: XXX.XX€
      - Détail par TVA
      - Détail par mode de paiement
      - Pourboires: XX.XX€
      - Tickets émis: XX
      - Écarts: ±X.XX€
      - Boutons: [Imprimer Z] [Valider et clôturer]
      
  step_6:
    action: "Valider et clôturer"
    result:
      - Génération Rapport Z
      - Numéro séquentiel
      - Hash cryptographique
      - Archivage
      - Email copie manager
      - Caisse verrouillée
      - Prépare prochaine ouverture
```

---

## 15. ÉTATS ET FEEDBACKS

### 15.1 États des Composants

```yaml
Component_States:

  button:
    default:
      appearance: couleur primaire, texte centré
      cursor: pointer
      
    hover:
      appearance: légèrement plus sombre (-10% lightness)
      transition: 150ms ease
      
    active:
      appearance: encore plus sombre, scale(0.98)
      duration: instant
      
    focus:
      appearance: outline 2px offset 2px (couleur accent)
      trigger: keyboard navigation
      
    loading:
      appearance: spinner remplace texte, disabled look
      cursor: not-allowed
      text: optionnellement "Chargement..."
      
    disabled:
      appearance: opacity 50%, couleur gris
      cursor: not-allowed
      interaction: none
      
    success:
      appearance: vert + checkmark
      duration: 2s puis retour normal
      
    error:
      appearance: rouge + x icon
      duration: persistent jusqu'à retry

  input:
    default:
      appearance: border gris, background blanc
      
    focus:
      appearance: border accent, shadow subtil
      label: float vers le haut (si floating label)
      
    filled:
      appearance: border gris plus sombre
      
    error:
      appearance: border rouge, icon ❌ à droite
      message: texte rouge sous le champ
      
    success:
      appearance: border vert, icon ✓ à droite
      
    disabled:
      appearance: background gris clair, texte gris

  card:
    default:
      appearance: fond blanc, shadow subtle
      
    hover:
      appearance: shadow plus prononcée, translateY(-2px)
      transition: 200ms ease-out
      
    selected:
      appearance: border accent
      
    loading:
      appearance: skeleton pulse animation
      
    error:
      appearance: border rouge, badge erreur
      
    empty:
      appearance: border dashed, icon + message centered
      message: "Aucun élément" + action suggested

  table_row:
    default:
      appearance: alternating background subtle
      
    hover:
      appearance: background highlight
      
    selected:
      appearance: background accent light, checkbox checked
      
    expanded:
      appearance: row detail visible below

Loading_States:
  initial_load:
    display: skeleton matching content layout
    duration: until data arrives
    
  refresh:
    display: subtle spinner in header, content remains
    
  infinite_scroll:
    display: spinner at bottom of list
    
  action_pending:
    display: button spinner, disable interactions
    
  background_sync:
    display: subtle indicator in status bar
```

### 15.2 Feedback Utilisateur

```yaml
Toast_Notifications:
  types:
    success:
      icon: ✓ (checkmark)
      color: green
      duration: 3s auto-dismiss
      position: top-right
      example: "Commande envoyée"
      
    error:
      icon: ✕ (x)
      color: red
      duration: persistent (manual dismiss)
      position: top-right
      action: optional retry button
      example: "Erreur de paiement"
      
    warning:
      icon: ⚠ (triangle)
      color: amber
      duration: 5s
      example: "Stock faible sur 3 articles"
      
    info:
      icon: ℹ (info)
      color: blue
      duration: 4s
      example: "Table 7 attend l'addition"
      
  behavior:
    stack: max 3 visible, others queued
    hover: pause auto-dismiss
    swipe: dismiss gesture
    
Confirmation_Dialogs:
  when:
    - Destructive actions (delete, cancel)
    - High-value operations (refund > 50€)
    - Irreversible changes
    
  structure:
    title: "Confirmer la suppression ?"
    message: "Cette action est irréversible."
    actions:
      - secondary: "Annuler"
      - primary_destructive: "Supprimer"
      
  avoid:
    - Pour actions réversibles
    - Pour actions fréquentes
    - Si undo disponible

Inline_Validation:
  timing: on blur + on submit
  display:
    valid: ✓ vert à droite du champ
    invalid: ✕ rouge + message sous le champ
    pending: spinner (pour validation async)
    
  messages:
    tone: helpful, not accusatory
    examples:
      bad: "Email invalide"
      good: "Veuillez saisir une adresse email valide"
      bad: "Champ obligatoire"
      good: "Ce champ est requis"
      
Progress_Indicators:
  linear:
    use: multi-step forms, uploads
    display: bar with percentage
    
  circular:
    use: loading states, timers
    display: spinner or progress ring
    
  steps:
    use: wizards, checkout
    display: numbered steps with current highlighted
    
Haptic_Feedback:
  mobile_only: true
  patterns:
    light: tap on button
    medium: successful action
    heavy: error, warning
    success: specific success pattern
```

---

## 16. ACCESSIBILITÉ

### 16.1 Standards

```yaml
WCAG_Compliance:
  level: AA minimum
  version: 2.1
  
Perceivable:
  text_alternatives:
    images: alt text descriptif
    icons: aria-label si seul
    decorative: alt="" aria-hidden="true"
    
  color:
    not_only_indicator: icône + texte + couleur
    contrast_ratio:
      normal_text: >= 4.5:1
      large_text: >= 3:1
      ui_components: >= 3:1
      
  adaptable:
    responsive: 320px to 2560px
    zoom: functional at 200%
    orientation: portrait et landscape
    
Operable:
  keyboard:
    all_interactive: accessible via tab
    focus_visible: always (outline 2px)
    focus_trap: pour modales
    shortcuts: documented, can be disabled
    skip_links: "Aller au contenu principal"
    
  timing:
    auto_dismiss: minimum 5s
    pause_option: pour sliders, carousels
    session_timeout: warning before, option to extend
    
  navigation:
    consistent: même position, même ordre
    multiple_ways: menu, search, sitemap
    focus_order: logical (left-right, top-bottom)
    
Understandable:
  language:
    declared: <html lang="fr">
    changes: lang attribute sur éléments multilingues
    
  predictable:
    consistent_navigation: across pages
    consistent_identification: same function = same label
    no_unexpected_changes: on focus or input
    
  input_assistance:
    error_identification: what field, what error
    labels: always visible (not placeholder only)
    instructions: before the form
    error_prevention: confirmation for irreversible
    
Robust:
  parsing:
    valid_html: W3C compliant
    unique_ids: no duplicates
    
  compatibility:
    aria_roles: proper usage
    aria_states: updated dynamically
    name_role_value: for custom components
```

### 16.2 Implémentation

```yaml
Semantic_HTML:
  structure:
    - <header> pour navigation
    - <main> pour contenu principal
    - <nav> pour menus
    - <aside> pour sidebars
    - <footer> pour pied de page
    - <section> avec heading
    - <article> pour contenu autonome
    
  headings:
    hierarchy: h1 > h2 > h3... (pas de saut)
    one_h1: par page
    
  forms:
    - <label for="id"> associé à chaque input
    - <fieldset> + <legend> pour groupes
    - aria-describedby pour instructions/erreurs
    - required attribute
    
ARIA_Patterns:
  modal:
    - role="dialog"
    - aria-modal="true"
    - aria-labelledby="title-id"
    - focus trap inside
    - Escape to close
    
  menu:
    - role="menu" sur container
    - role="menuitem" sur items
    - aria-expanded pour sous-menus
    - arrow keys navigation
    
  tabs:
    - role="tablist" sur container
    - role="tab" sur onglets
    - role="tabpanel" sur contenus
    - aria-selected="true"
    - arrow keys navigation
    
  alert:
    - role="alert" ou role="status"
    - aria-live="polite" ou "assertive"
    - auto-announce to screen readers
    
Focus_Management:
  on_modal_open:
    - Move focus to modal
    - Trap focus inside
    - On close: return to trigger
    
  on_page_change:
    - Focus to main content or h1
    - Announce page title
    
  on_error:
    - Focus to first error field
    - Announce error message
    
Screen_Reader_Testing:
  tools:
    - VoiceOver (macOS, iOS)
    - NVDA (Windows)
    - JAWS (Windows)
    - TalkBack (Android)
    
  checklist:
    - All content announced
    - Interactive elements described
    - States announced (expanded, selected)
    - Errors announced
    - Navigation logical
```

---

# PARTIE 4 : UI DESIGN SYSTEM

---

## 17. FONDATIONS VISUELLES

### 17.1 Palette de Couleurs

```yaml
Design_Philosophy:
  name: "Minimal Restaurant"
  principles:
    - Épuré et professionnel
    - Touches de couleur subtiles
    - Lisibilité maximale
    - Fonctionne en environnement lumineux (salle) et sombre (cuisine)

Color_Tokens:

  # ===== NEUTRALS =====
  neutral:
    50:  "#FAFAFA"  # Background light
    100: "#F4F4F5"  # Surface hover
    200: "#E4E4E7"  # Border light
    300: "#D4D4D8"  # Border default
    400: "#A1A1AA"  # Text placeholder
    500: "#71717A"  # Text muted
    600: "#52525B"  # Text secondary
    700: "#3F3F46"  # Text primary dark mode
    800: "#27272A"  # Surface dark
    900: "#18181B"  # Background dark
    950: "#0A0A0F"  # Background darkest

  # ===== PRIMARY (Bleu Royal) =====
  primary:
    50:  "#EFF6FF"
    100: "#DBEAFE"
    200: "#BFDBFE"
    300: "#93C5FD"
    400: "#60A5FA"
    500: "#3B82F6"  # Main
    600: "#2563EB"  # Hover
    700: "#1D4ED8"  # Active
    800: "#1E40AF"
    900: "#1E3A8A"

  # ===== SUCCESS (Émeraude) =====
  success:
    50:  "#ECFDF5"
    100: "#D1FAE5"
    200: "#A7F3D0"
    300: "#6EE7B7"
    400: "#34D399"
    500: "#10B981"  # Main
    600: "#059669"
    700: "#047857"
    800: "#065F46"
    900: "#064E3B"

  # ===== WARNING (Ambre) =====
  warning:
    50:  "#FFFBEB"
    100: "#FEF3C7"
    200: "#FDE68A"
    300: "#FCD34D"
    400: "#FBBF24"
    500: "#F59E0B"  # Main
    600: "#D97706"
    700: "#B45309"
    800: "#92400E"
    900: "#78350F"

  # ===== ERROR (Rouge) =====
  error:
    50:  "#FEF2F2"
    100: "#FEE2E2"
    200: "#FECACA"
    300: "#FCA5A5"
    400: "#F87171"
    500: "#EF4444"  # Main
    600: "#DC2626"
    700: "#B91C1C"
    800: "#991B1B"
    900: "#7F1D1D"

  # ===== INFO (Cyan) =====
  info:
    50:  "#ECFEFF"
    100: "#CFFAFE"
    200: "#A5F3FC"
    300: "#67E8F9"
    400: "#22D3EE"
    500: "#06B6D4"  # Main
    600: "#0891B2"
    700: "#0E7490"
    800: "#155E75"
    900: "#164E63"

Semantic_Tokens:
  light_mode:
    background:
      default: neutral.50
      surface: white
      muted: neutral.100
    foreground:
      default: neutral.900
      muted: neutral.500
      inverted: white
    border:
      default: neutral.200
      strong: neutral.300
    
  dark_mode:
    background:
      default: neutral.950
      surface: neutral.900
      muted: neutral.800
    foreground:
      default: neutral.50
      muted: neutral.400
      inverted: neutral.900
    border:
      default: neutral.800
      strong: neutral.700

Status_Colors:
  table_status:
    available: success.500
    reserved: primary.500
    occupied: error.500
    cleaning: warning.500
    out_of_service: neutral.500
    
  order_status:
    pending: neutral.400
    sent: primary.500
    preparing: warning.500
    ready: success.500
    served: neutral.600
    cancelled: error.500
```

### 17.2 Typographie

```yaml
Font_Family:
  primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  mono: "'JetBrains Mono', 'Fira Code', monospace"
  
  loading:
    method: Google Fonts optimal loading
    weights: [400, 500, 600, 700]
    display: swap

Type_Scale:
  # Mobile-first, responsive
  
  xs:
    size: 12px / 0.75rem
    line_height: 16px / 1rem
    use: badges, captions, labels
    
  sm:
    size: 14px / 0.875rem
    line_height: 20px / 1.25rem
    use: secondary text, small buttons
    
  base:
    size: 16px / 1rem
    line_height: 24px / 1.5rem
    use: body text, inputs
    
  lg:
    size: 18px / 1.125rem
    line_height: 28px / 1.75rem
    use: emphasized body, large inputs
    
  xl:
    size: 20px / 1.25rem
    line_height: 28px / 1.75rem
    use: small headings, card titles
    
  2xl:
    size: 24px / 1.5rem
    line_height: 32px / 2rem
    use: section headings
    
  3xl:
    size: 30px / 1.875rem
    line_height: 36px / 2.25rem
    use: page headings
    
  4xl:
    size: 36px / 2.25rem
    line_height: 40px / 2.5rem
    use: hero titles
    
  5xl:
    size: 48px / 3rem
    line_height: 1
    use: display, large numbers

Font_Weights:
  normal: 400   # Body text
  medium: 500   # Emphasized text, buttons
  semibold: 600 # Headings, labels
  bold: 700     # Strong emphasis

Letter_Spacing:
  tight: -0.025em   # Large headings
  normal: 0         # Body
  wide: 0.025em     # Small caps, labels
  wider: 0.05em     # Uppercase labels
```

### 17.3 Espacements

```yaml
Spacing_Scale:
  # Base: 4px
  
  0:    0px
  0.5:  2px    # Micro spacing
  1:    4px    # Tight spacing
  1.5:  6px
  2:    8px    # Default small
  2.5:  10px
  3:    12px   # Default medium
  4:    16px   # Default
  5:    20px
  6:    24px   # Section spacing
  8:    32px   # Large spacing
  10:   40px
  12:   48px   # Container padding
  16:   64px   # Section gaps
  20:   80px
  24:   96px   # Page sections

Usage_Guidelines:
  inline_spacing:
    between_icons_text: 2 (8px)
    between_buttons: 3 (12px)
    between_form_fields: 4 (16px)
    
  stack_spacing:
    within_card: 4 (16px)
    between_cards: 6 (24px)
    between_sections: 12 (48px)
    
  container_padding:
    mobile: 4 (16px)
    tablet: 6 (24px)
    desktop: 8 (32px)
```

### 17.4 Autres Tokens

```yaml
Border_Radius:
  none: 0
  sm: 4px       # Badges, small elements
  md: 6px       # Buttons, inputs
  lg: 8px       # Cards
  xl: 12px      # Modals, large cards
  2xl: 16px     # Hero sections
  full: 9999px  # Pills, avatars

Shadows:
  sm:
    value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
    use: subtle elevation
    
  md:
    value: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
    use: cards, dropdowns
    
  lg:
    value: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"
    use: modals, popovers
    
  xl:
    value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
    use: large modals
    
  inner:
    value: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)"
    use: inputs, wells

Z_Index:
  base: 0
  dropdown: 50
  sticky: 100
  fixed: 150
  modal_backdrop: 200
  modal: 250
  popover: 300
  tooltip: 350
  toast: 400

Transitions:
  fast: 100ms
  normal: 200ms
  slow: 300ms
  
  easing:
    default: cubic-bezier(0.4, 0, 0.2, 1)
    in: cubic-bezier(0.4, 0, 1, 1)
    out: cubic-bezier(0, 0, 0.2, 1)
    bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)

Breakpoints:
  sm: 640px   # Mobile landscape
  md: 768px   # Tablet
  lg: 1024px  # Laptop
  xl: 1280px  # Desktop
  2xl: 1536px # Large desktop
```

---

## 18. COMPOSANTS

### 18.1 Boutons

```yaml
Button_Variants:

  primary:
    default:
      background: primary.600
      text: white
      border: none
    hover:
      background: primary.700
    active:
      background: primary.800
    focus:
      ring: primary.500
      ring_offset: 2px
      
  secondary:
    default:
      background: transparent
      text: neutral.700
      border: 1px neutral.300
    hover:
      background: neutral.100
    active:
      background: neutral.200
      
  ghost:
    default:
      background: transparent
      text: neutral.700
      border: none
    hover:
      background: neutral.100
      
  destructive:
    default:
      background: error.600
      text: white
    hover:
      background: error.700
      
  success:
    default:
      background: success.600
      text: white
    hover:
      background: success.700

Button_Sizes:
  sm:
    height: 32px
    padding_x: 12px
    font_size: 14px
    border_radius: 6px
    
  md:
    height: 40px
    padding_x: 16px
    font_size: 14px
    border_radius: 6px
    
  lg:
    height: 48px
    padding_x: 24px
    font_size: 16px
    border_radius: 8px
    
  icon_only:
    sm: 32px × 32px
    md: 40px × 40px
    lg: 48px × 48px
    border_radius: 6px (or full for round)

Button_States:
  loading:
    content: spinner (16px) replacing text
    opacity: 0.7
    pointer_events: none
    
  disabled:
    opacity: 0.5
    cursor: not-allowed
    pointer_events: none
```

### 18.2 Inputs

```yaml
Input_Base:
  height: 40px
  padding: 0 12px
  border: 1px neutral.300
  border_radius: 6px
  font_size: 14px
  background: white
  
  states:
    default:
      border_color: neutral.300
    focus:
      border_color: primary.500
      ring: 2px primary.500/20
    error:
      border_color: error.500
      ring: 2px error.500/20
    disabled:
      background: neutral.100
      text: neutral.400

Input_Types:
  text:
    standard input
    
  number:
    with increment/decrement buttons
    
  select:
    with chevron icon
    dropdown with options
    
  textarea:
    min_height: 80px
    resize: vertical
    
  search:
    with search icon left
    optional clear button right
    
  password:
    with show/hide toggle
    
  date:
    with calendar picker
    
  time:
    with time picker

Input_Addons:
  prefix:
    position: inside left
    examples: €, $, https://
    
  suffix:
    position: inside right
    examples: kg, .com, icon
    
  leading_icon:
    position: left 12px
    size: 16px
    color: neutral.400
    
  trailing_icon:
    position: right 12px
    examples: check, x, spinner
```

### 18.3 Cards

```yaml
Card_Variants:

  default:
    background: white
    border: 1px neutral.200
    border_radius: 8px
    shadow: none
    padding: 16px
    
  elevated:
    background: white
    border: none
    border_radius: 8px
    shadow: md
    padding: 16px
    hover:
      shadow: lg
      translateY: -2px
      
  outlined:
    background: transparent
    border: 1px neutral.300
    border_radius: 8px
    
  interactive:
    extends: elevated
    cursor: pointer
    transitions: shadow, transform
    
  status:
    extends: default
    border_left: 4px (status color)
    examples:
      - success: left border green
      - warning: left border amber
      - error: left border red

Card_Structure:
  header:
    padding_bottom: 12px
    border_bottom: 1px neutral.100 (optional)
    contains: title, subtitle, actions
    
  body:
    padding: 16px 0
    flexible content area
    
  footer:
    padding_top: 12px
    border_top: 1px neutral.100 (optional)
    contains: buttons, links
```

### 18.4 Tables

```yaml
Table_Structure:
  header:
    background: neutral.50
    text: neutral.600
    font_weight: 600
    font_size: 12px
    text_transform: uppercase
    letter_spacing: 0.05em
    padding: 12px 16px
    border_bottom: 1px neutral.200
    
  row:
    padding: 16px
    border_bottom: 1px neutral.100
    
    hover:
      background: neutral.50
      
    selected:
      background: primary.50
      
    striped (optional):
      odd: white
      even: neutral.50
      
  cell:
    vertical_align: middle
    
  actions_cell:
    width: auto
    text_align: right
    
Table_Features:
  sortable:
    indicator: arrow icon in header
    states: none, asc, desc
    
  selectable:
    checkbox first column
    header checkbox: select all
    
  expandable:
    expand icon first column
    detail row below
    
  pagination:
    bottom of table
    shows: page x of y, rows per page, navigation
    
  empty:
    illustration + message + action
    full width, centered
```

### 18.5 Modales

```yaml
Modal_Structure:
  backdrop:
    background: rgba(0, 0, 0, 0.5)
    blur: 4px (optional)
    
  container:
    background: white
    border_radius: 12px
    shadow: xl
    max_height: 90vh
    overflow: hidden
    
  sizes:
    sm: 400px
    md: 500px (default)
    lg: 700px
    xl: 900px
    full: 100% - 32px margin
    
  header:
    padding: 24px 24px 0
    flex: space-between
    title: text-lg font-semibold
    close_button: top right
    
  body:
    padding: 24px
    overflow_y: auto
    
  footer:
    padding: 0 24px 24px
    flex: justify-end
    gap: 12px buttons

Modal_Animation:
  enter:
    backdrop: fade in 200ms
    content: scale 0.95→1 + fade in 200ms
    
  exit:
    backdrop: fade out 150ms
    content: scale 1→0.95 + fade out 150ms
```

### 18.6 Badges & Tags

```yaml
Badge_Variants:
  default:
    background: neutral.100
    text: neutral.700
    
  primary:
    background: primary.100
    text: primary.700
    
  success:
    background: success.100
    text: success.700
    
  warning:
    background: warning.100
    text: warning.700
    
  error:
    background: error.100
    text: error.700
    
  outline:
    background: transparent
    border: 1px current-color
    text: inherit

Badge_Sizes:
  sm:
    height: 20px
    padding: 0 6px
    font_size: 11px
    border_radius: 4px
    
  md:
    height: 24px
    padding: 0 8px
    font_size: 12px
    border_radius: 4px
    
  lg:
    height: 28px
    padding: 0 10px
    font_size: 14px
    border_radius: 6px

Dot_Badge:
  size: 8px
  border_radius: full
  position: absolute top-right of parent
  animation: pulse (optional for notifications)
```

---

## 19. PATTERNS

### 19.1 Navigation

```yaml
Sidebar:
  width: 280px (desktop), full (mobile drawer)
  
  structure:
    logo:
      height: 60px
      padding: 16px
      
    navigation:
      padding: 8px
      groups:
        - label (optional)
        - items
        
    nav_item:
      height: 40px
      padding: 8px 12px
      border_radius: 6px
      gap: 12px (icon to text)
      
      states:
        default:
          background: transparent
          text: neutral.600
        hover:
          background: neutral.100
        active:
          background: primary.100
          text: primary.700
          font_weight: 500
          
    footer:
      border_top: 1px neutral.200
      padding: 16px
      user_info + logout

Header:
  height: 60px
  background: white
  border_bottom: 1px neutral.200
  
  content:
    left: hamburger (mobile) + breadcrumb
    right: sync status + notifications + user
```

### 19.2 Formulaires

```yaml
Form_Layout:
  vertical:
    default layout
    label above input
    
  horizontal:
    label left (min 120px), input right
    for detail pages
    
  inline:
    all on one line
    for filters, search
    
Field_Spacing:
  between_fields: 16px
  between_groups: 24px
  label_to_input: 6px
  input_to_helper: 4px
  
Helper_Text:
  color: neutral.500
  font_size: 12px
  
Error_Text:
  color: error.500
  font_size: 12px
  icon: optional ⚠️
  
Required_Indicator:
  position: after label
  content: "*"
  color: error.500
```

### 19.3 Listes

```yaml
List_Types:

  simple:
    item_height: 48px
    padding: 12px 16px
    border_bottom: 1px neutral.100
    
  with_avatar:
    avatar_size: 40px
    avatar_gap: 12px
    
  with_icon:
    icon_size: 20px
    icon_color: neutral.400
    
  with_actions:
    actions_position: right
    visible: on hover (desktop), always (mobile)
    
  draggable:
    cursor: grab
    drag_handle: 6 dots icon left
    
Empty_State:
  layout: centered
  icon: 48px, neutral.300
  title: neutral.700
  description: neutral.500
  action: primary button
```

### 19.3 Animations

```yaml
Motion_Principles:
  purposeful: every animation has meaning
  quick: 200-300ms typical
  subtle: enhance, don't distract
  consistent: same easing throughout
  
Standard_Animations:
  fade_in:
    from: opacity 0
    to: opacity 1
    duration: 200ms
    
  slide_up:
    from: translateY(8px) + opacity 0
    to: translateY(0) + opacity 1
    duration: 200ms
    
  scale_in:
    from: scale(0.95) + opacity 0
    to: scale(1) + opacity 1
    duration: 200ms
    
  skeleton_pulse:
    background: neutral.200 → neutral.300 → neutral.200
    duration: 1.5s
    infinite: true
    
Micro_Interactions:
  button_click:
    transform: scale(0.98)
    duration: 50ms
    
  toggle_switch:
    transform: translateX
    duration: 150ms
    
  checkbox:
    checkmark: draw animation
    duration: 100ms
    
  notification_badge:
    enter: scale from 0 + bounce
    duration: 300ms
```

---

## 📎 RÉCAPITULATIF FICHIERS

```
restaurant-os-prompt/
├── RESTAURANT_OS_V3_PART1.md   # Fondamentaux + Infrastructure + POS
├── RESTAURANT_OS_V3_PART2.md   # Plan de Salle + Réservations + KDS
├── RESTAURANT_OS_V3_PART3.md   # Stocks + RH + HACCP + Analytics + Compta
└── RESTAURANT_OS_V3_PART4.md   # UX Design + UI Design System
```

---

# ✅ PROMPT COMPLET

Ce prompt représente **~4000 lignes** de spécifications techniques avec :

- ✅ **Tous les modules** détaillés avec précision maximale
- ✅ **User flows** critiques étape par étape
- ✅ **États et feedbacks** pour chaque interaction
- ✅ **Accessibilité** WCAG 2.1 AA
- ✅ **Design System** complet et cohérent
- ✅ **Composants** avec tous les variants

**Prêt pour le développement.**
---

## 26. MODULE 10 : RÉPUTATION & SENTIMENT

### 26.1 Agrégateur d'Avis 360°
```yaml
Sources: [Google Business, TripAdvisor, Yelp, Facebook, Instagram]
Interface:
  - Dashboard consolidé des notes par plateforme
  - Flux d'avis temps réel avec traduction automatique
  - Analyse de sentiment par IA (Positif, Neutre, Négatif, Ironie)
  - Détection automatique des thématiques (Service, Cuisine, Prix, Ambiance)

IA_Suggestions:
  - Génération de réponses personnalisées basées sur le ton de l'avis
  - Mode "Escalation" pour avis négatifs avec alerte manager
  - Analyse sémantique des points d'amélioration récurrents
```

## 27. MODULE 11 : IA CONFORMITÉ SOCIALE

### 27.1 Garde-fou RH Intelligent
```yaml
Contraintes_Legales_FR:
  - Repos quotidien min: 11h consécutives
  - Repos hebdomadaire min: 35h
  - Temps de travail max/jour: 10h (ou 12h avec accord)
  - Pause obligatoire: 20min après 6h

Fonctionnalités:
  - Vérification en temps réel lors de l'édition du planning
  - Alertes bloquantes ou informatives sur violations
  - Prévision des heures supplémentaires et impact budgétaire
  - Optimisation des shifts selon les compétences et coûts
```

## 28. MODULE 12 : MAINTENANCE PRÉDICTIVE IOT

### 28.1 Monitoring Équipements
```yaml
Capteurs: [Température, Vibrations, Consommation Électrique]
Cibles: [Chambres froides, Fours, Friteuses, Lave-vaisselle]

Algorithme_IA:
  - Détection d'anomalies de courbe de température
  - Analyse fréquentielle des vibrations moteur (anomalie mécanique)
  - Détection de "Surcharge" ou "Cycle anormal"
  - Notification préventive avant panne critique
```

## 29. MODULE 13 : RENTABILITÉ INGRÉDIENT

### 29.1 Tracking d'Inflation Temps Réel
```yaml
Données:
  - Prix d'achat factures (OCR scan)
  - Prix marché indexés
Interface:
  - Analyse du Food Cost par plat en temps réel
  - Alerte "Marge Critique" si coût matière > 35% du prix de vente
  - Suggestion de mise à jour des prix de vente
  - Analyse de la volatilité des fournisseurs
```

## 30. MODULE 14 : SIMULATEUR DIGITAL TWIN

### 30.1 Projection de Croissance
```yaml
Simulations:
  - "Et si je changeais ma carte de vins ?"
  - "Et si j'ouvrais le lundi midi ?"
  - "Impact d'une hausse de prix de 2€ sur le CA total"

Modélisation:
  - Basée sur l'historique transactionnel (3 ans)
  - Intégration de l'élasticité prix par catégorie
  - Prédiction de l'impact sur le besoin en staff (coût RH)
```
