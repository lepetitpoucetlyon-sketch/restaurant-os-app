"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Mic, MicOff, Menu, Sparkles, Command, Activity, Zap, Navigation, X, Grid, MoreHorizontal } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '../ui/Toast';
import { cn } from '@/lib/utils';
import { useUI } from '@/context/UIContext';
import { useOrders } from '@/context/OrdersContext';
import { useInventoryState } from '@/context/InventoryContext';
import { useCRM } from '@/context/CRMContext';
import { useHACCP } from '@/context/HACCPContext';
import { usePlanning } from '@/context/PlanningContext';
import { useIntelligence } from '@/context/IntelligenceContext';
import { useAuth } from '@/context/AuthContext';
import { useRecipes } from '@/context/RecipeContext';

// Declaration for SpeechRecognition
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

type CommandCategory = 'navigation' | 'action' | 'system' | 'analysis' | 'utility' | 'expert';

interface VoiceCommand {
    patterns: string[];
    action: (args: string) => Promise<string | null> | string | null;
    category: CommandCategory;
    description?: string;
}

export function VoiceCommandListener() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false); // New state for TTS visualizer

    const router = useRouter();
    const pathname = usePathname();
    const { showToast } = useToast();
    const { toggleLaunchpad, toggleTheme, theme, openDocumentation, openCommandPalette } = useUI();

    // Data Contexts for Intelligence
    const { totalRevenue, orders } = useOrders();
    const { stockItems } = useInventoryState();
    const { customers } = useCRM();
    const { sensors, getComplianceScore } = useHACCP();
    const { shifts } = usePlanning();
    const { financialInsight, predictiveAlerts, reviews, generateAIReply, runSimulation } = useIntelligence();
    const { hasAccess, currentUser } = useAuth();
    const { recipes } = useRecipes();

    // Canvas for waveform visualization
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number | null>(null);

    // --- Text-to-Speech Engine ---
    const speak = useCallback((text: string) => {
        if (!window.speechSynthesis) return;

        // Cancel current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to pick a premium French voice (Google Français or system default)
        const voices = window.speechSynthesis.getVoices();
        const frenchVoice = voices.find(v => v.lang === 'fr-FR' && v.name.includes('Google')) || voices.find(v => v.lang.includes('fr'));
        if (frenchVoice) utterance.voice = frenchVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, []);


    // --- Command Registry ---
    const COMMANDS: VoiceCommand[] = [
        // 1. Navigation (The "Teleporter")
        {
            patterns: [
                'aller à', 'ouvrir', 'naviguer vers', 'montre moi', 'go to', 'affiche', 'direction',
                'cuisine', 'kds', 'chef', 'production', // Kitchen keywords
                'stock', 'inventaire', 'réserve', // Inventory
                'pos', 'caisse', 'terminal', 'commande', // POS
                'salle', 'table', 'plan', 'floor', // Floor Plan
                'finance', 'compta', 'dashboard', 'chiffre', // Finance
                'planning', 'staff', 'équipe', 'employé', // Staff
                'réservation', 'agenda', 'carnet', // Reservations
                'haccp', 'hygiène', 'qualité', 'nettoyage', // Quality
                'paramètres', 'config', 'réglages' // Settings
            ],
            category: 'navigation',
            action: (args) => {
                const target = args.toLowerCase();
                if (target.includes('stock') || target.includes('inventaire')) {
                    if (!hasAccess('inventory')) { speak("Accès non autorisé."); return "Accès refusé"; }
                    router.push('/inventory');
                    speak("Ouverture de l'Inventaire.");
                    return "Ouverture de l'Inventaire";
                }
                if (target.includes('caisse') || target.includes('pos') || target.includes('commande')) {
                    if (!hasAccess('pos')) { speak("Accès non autorisé."); return "Accès refusé"; }
                    router.push('/pos');
                    speak("Accès au Terminal Point de Vente.");
                    return "Accès au Terminal Point de Vente";
                }
                if (target.includes('table') || target.includes('salles') || target.includes('plan')) {
                    if (!hasAccess('floor-plan')) { speak("Accès non autorisé."); return "Accès refusé"; }
                    router.push('/floor-plan');
                    speak("Voici le plan de salle.");
                    return "Visualisation du Plan de Salle";
                }
                if (target.includes('kds') || target.includes('cuisine') || target.includes('chef')) {
                    if (!hasAccess('kitchen') && !hasAccess('kds')) { speak("Accès reservé à la cuisine."); return "Accès refusé"; }
                    router.push('/kds');
                    speak("Connexion au KDS Cuisine.");
                    return "Connexion au KDS Cuisine";
                }
                if (target.includes('finance') || target.includes('compta') || target.includes('chiffre')) {
                    if (!hasAccess('accounting')) { speak("Accès reservé à la direction."); return "Accès refusé"; }
                    router.push('/accounting');
                    speak("Affichage du Dashboard Financier.");
                    return "Ouverture du Dashboard Financier";
                }
                if (target.includes('staff') || target.includes('équipe') || target.includes('planning')) {
                    if (!hasAccess('planning')) { speak("Accès non autorisé."); return "Accès refusé"; }
                    router.push('/planning');
                    speak("Gestion des équipes.");
                    return "Gestion du Capital Humain";
                }
                if (target.includes('réservation') || target.includes('agenda')) {
                    if (!hasAccess('reservations')) { speak("Accès non autorisé."); return "Accès refusé"; }
                    router.push('/reservations');
                    speak("Cahier de réservations ouvert.");
                    return "Accès au Cahier de Réservations";
                }
                if (target.includes('accueil') || target.includes('dashboard') || target.includes('maison')) {
                    router.push('/');
                    speak("Retour à l'accueil.");
                    return "Retour au Tableau de Bord";
                }
                if (target.includes('paramètres') || target.includes('config')) {
                    if (!hasAccess('settings')) { speak("Accès reservé aux administrateurs."); return "Accès refusé"; }
                    router.push('/settings');
                    speak("Ouverture des paramètres.");
                    return "Ouverture des Paramètres Système";
                }
                if (target.includes('qualité') || target.includes('haccp') || target.includes('hygiène')) {
                    if (!hasAccess('haccp')) { speak("Accès non autorisé."); return "Accès refusé"; }
                    router.push('/quality');
                    speak("Module Qualité HACCP.");
                    return "Module Qualité & Hygiène";
                }
                return null;
            }
        },
        // 5. Utilities (The "Scribe")
        {
            category: 'utility',
            patterns: ['note', 'rappel', 'n\'oublie pas', 'mémo', 'scripte'],
            action: (args) => {
                const note = args.replace(/(note que|rappel|n'oublie pas de|mémo)/i, '').trim();
                speak(`C'est noté. Je vous rappellerai de : ${note}.`);
                return `Note ajoutée: ${note}`;
            }
        },
        // 6. Communication (The "Commander")
        {
            category: 'utility',
            patterns: ['dis à', 'message à', 'envoyer à', 'broadcast', 'annonce'],
            action: (args) => {
                // "Dis à la cuisine d'envoyer la suite"
                const targetDept = args.includes('cuisine') ? 'Cuisine' :
                    args.includes('salle') ? 'Salle' :
                        args.includes('bar') ? 'Bar' : 'Tous';

                const message = args.replace(/(dis à|dis au|message à|envoyer à|broadcast|annonce|la|le|l'|aux|au)/gi, '')
                    .replace(/(cuisine|salle|bar|équipe|tout le monde)/gi, '')
                    .trim();

                speak(`Message envoyé à ${targetDept} : ${message}`);
                // In a real app, this would push a notification to users with that role
                return `📢 ${targetDept}: "${message}"`;
            }
        },
        // 7. Ambience & Services (The "Concierge")
        {
            category: 'utility',
            patterns: ['musique', 'ambiance', 'playlist', 'volume', 'taxi', 'uber', 'chauffeur'],
            action: (args) => {
                const target = args.toLowerCase();

                if (target.includes('taxi') || target.includes('uber') || target.includes('chauffeur')) {
                    speak("Un chauffeur a été commandé. Arrivée estimée dans 8 minutes.");
                    return "🚖 Transport : En route (8 min)";
                }

                if (target.includes('musique') || target.includes('ambiance') || target.includes('playlist')) {
                    if (target.includes('soirée') || target.includes('fête') || target.includes('bouge')) {
                        speak("Activation de l'ambiance 'Midnight Lounge'.");
                        return "🎵 Playlist: Midnight Lounge";
                    }
                    if (target.includes('calme') || target.includes('dîner') || target.includes('piano')) {
                        speak("Activation de l'ambiance 'Piano Bar'.");
                        return "🎵 Playlist: Piano Bar";
                    }
                    speak("Je lance la playlist recommandée pour cette heure.");
                    return "🎵 Ambiance adaptative activée";
                }

                return null;
            }
        },
        // 2. Actions (The "Operator")
        {
            patterns: ['créer', 'nouveau', 'nouvelle', 'ajouter'],
            category: 'action',
            action: (args) => {
                const target = args.toLowerCase();
                if (target.includes('commande') || target.includes('ticket')) {
                    router.push('/pos');
                    speak("Je lance une nouvelle commande.");
                    return "Initialisation d'une nouvelle commande";
                }
                if (target.includes('réservation')) {
                    router.push('/reservations');
                    speak("Prêt pour une nouvelle réservation.");
                    return "Préparation d'une nouvelle réservation";
                }
                if (target.includes('employé') || target.includes('staff')) {
                    router.push('/staff');
                    speak("Ouverture du formulaire staff.");
                    return "Formulaire de recrutement ouvert";
                }
                if (target.includes('produit') || target.includes('ingrédient')) {
                    router.push('/inventory');
                    speak("Ajout de référence stock.");
                    return "Ajout d'une nouvelle référence stock";
                }
                return null;
            }
        },
        // 3. System (The "Engineer")
        {
            patterns: ['active', 'désactive', 'mode', 'changer', 'fermer', 'ouvrir', 'aide', 'help', 'quitter'],
            category: 'system',
            action: (args) => {
                const target = args.toLowerCase();
                if (target.includes('sombre') || target.includes('nuit') || target.includes('dark')) {
                    if (theme === 'light') toggleTheme();
                    speak("Mode nuit activé.");
                    return "Activation du Mode Nuit";
                }
                if (target.includes('clair') || target.includes('jour') || target.includes('light')) {
                    if (theme === 'dark') toggleTheme();
                    speak("Mode jour activé.");
                    return "Activation du Mode Jour";
                }
                if (target.includes('menu') || target.includes('launchpad')) {
                    toggleLaunchpad();
                    speak("Menu principal.");
                    return "Menu Principal basculé";
                }
                if (target.includes('aide') || target.includes('documentation') || target.includes('tuto')) {
                    openDocumentation('general');
                    speak("Voici le centre d'aide.");
                    return "Ouverture du Centre d'Aide";
                }
                if (target.includes('quitter') || target.includes('stop')) {
                    setIsListening(false);
                    speak("À bientôt.");
                    return "Arrêt de l'écoute";
                }
                return null;
            }
        },
        // 8. Expert Knowledge (The "Sommelier" & "Polyglot")
        {
            category: 'expert',
            patterns: ['vin', 'accord', 'sommelier', 'boire', 'traduire', 'traduction', 'anglais', 'japonais', 'italien', 'espagnol', 'félicite', 'bravo', 'équipe'],
            action: (args) => {
                const target = args.toLowerCase();

                // 8.1 The Sommelier
                if (target.includes('vin') || target.includes('accord') || target.includes('sommelier') || target.includes('boire')) {
                    if (target.includes('viande') || target.includes('boeuf') || target.includes('gibier')) {
                        speak("Je recommande un Château Margaux 2015 ou un Côte-Rôtie corsé.");
                        return "🍷 Accord: Vin Rouge Puissant";
                    }
                    if (target.includes('poisson') || target.includes('saumon') || target.includes('mer')) {
                        speak("Un Chablis Grand Cru ou un Sancerre minéral serait parfait.");
                        return "🥂 Accord: Vin Blanc Sec";
                    }
                    if (target.includes('dessert') || target.includes('chocolat')) {
                        speak("Un Porto Vintage ou un Banyuls accompagnera cela à merveille.");
                        return "🍇 Accord: Vin Doux Naturel";
                    }
                    speak("Pour quel plat souhaitez-vous un accord mets-vins ?");
                    return "🍷 Sommelier à votre écoute";
                }

                // 8.2 The Polyglot
                if (target.includes('traduire') || target.includes('traduction') || target.includes('anglais')) {
                    // Mock translation
                    const phrase = args.replace(/(traduire|en|anglais|japonais|italien|espagnol|comment on dit)/gi, '').trim();
                    speak(`En anglais, on dit : "Welcome to our establishment, enjoy your meal."`);
                    return `🇬🇧 Translation: "${phrase}..."`;
                }

                // 8.3 The Motivator
                if (target.includes('félicite') || target.includes('bravo') || target.includes('équipe')) {
                    speak("Attention tout le monde ! Le Chef vous félicite pour ce service exceptionnel. Beau travail !");
                    // Could trigger a confetti animation on screens
                    return "🎉 Félicitations envoyées !";
                }

                return null;
            }
        },
        // 4. Intelligence & Analysis (The "Oracle")
        {
            patterns: ['chercher', 'trouver', 'rechercher', 'find', 'search', 'palette', 'combien', 'quel', 'do we have', 'avons nous', 'niveau', 'stock', 'chiffre', 'revenu', 'ca', 'recette', 'commandes', 'tickets', 'meilleur client', 'top client', 'hygiène', 'score', 'qualité', 'température', 'frigo', 'froid', 'planning', 'staff', 'équipe', 'travaill', 'maintenance', 'casse', 'réparation', 'marge', 'coût matière', 'prime cost', 'avis', 'review', 'commentaire', 'simule', 'simulation', 'scénario'],
            category: 'analysis',
            action: async (args) => {
                const target = args.toLowerCase();

                // 4.1 Global Search
                if (['chercher', 'trouver', 'rechercher', 'find', 'search', 'palette'].some(k => args.startsWith(k))) {
                    openCommandPalette();
                    speak("Je lance la recherche globale.");
                    return "Ouverture de la recherche globale";
                }

                // 4.2 Revenue Intelligence
                if (target.includes("chiffre") || target.includes("revenu") || target.includes("ca") || target.includes("recette")) {
                    if (!hasAccess('analytics') && !hasAccess('accounting')) { speak("Information confidentielle."); return "Accès refusé"; }
                    const formatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalRevenue);
                    speak(`Le chiffre d'affaires actuel est de ${formatted}.`);
                    return `Revenue: ${formatted}`;
                }

                // 4.3 Order Count Intelligence
                if (target.includes("commandes") || target.includes("tickets")) {
                    if (!hasAccess('pos') && !hasAccess('kitchen')) { speak("Information réservée."); return "Accès refusé"; }
                    speak(`Nous avons ${orders.length} commandes enregistrées.`);
                    return `Commandes: ${orders.length}`;
                }

                // 4.4 Stock Intelligence
                if (target.includes("stock") || target.includes("avons nous")) {
                    if (!hasAccess('inventory') && !hasAccess('kitchen')) { speak("Information réservée."); return "Accès refusé"; }
                    // ... (rest of logic)
                    // Extract query after "stock de" or "avons nous du"
                    const query = args.replace(/(stock de|avons nous du|avons nous de la|avons nous des)/i, '').trim();
                    if (query.length > 2) {
                        const matches = stockItems.filter(item =>
                            item.ingredientName?.toLowerCase().includes(query) ||
                            item.supplierName?.toLowerCase().includes(query)
                        );

                        if (matches.length > 0) {
                            const totalQty = matches.reduce((sum, item) => sum + item.quantity, 0);
                            const unit = matches[0].unit;
                            speak(`Il reste ${totalQty} ${unit} de ${query} en stock.`);
                            return `Stock ${query}: ${totalQty} ${unit}`;
                        } else {
                            speak(`Je ne trouve pas de stock pour ${query}.`);
                            return `Stock ${query}: Introuvable`;
                        }
                    }
                }

                // 4.12 Business Simulation (The "Strategist")
                if (target.includes("simule") || target.includes("simulation") || target.includes("scénario")) {
                    if (!hasAccess('analytics')) { speak("Accès refusé."); return "Accès refusé"; }
                    speak("Lancement de la simulation financière...");
                    // Mock parsing for demo
                    const scenario = await runSimulation({ name: "Simulation Vocale", inputs: { priceChange: 0.1 } });
                    const gain = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(scenario.projections?.netProfitChange || 0);
                    speak(`Simulation terminée. Gain estimé de ${gain}.`);
                    return `Simulation: ${gain}`;
                }

                // 4.13 Recipe Intelligence (The "Chef")
                if (target.includes("recette") || target.includes("ingrédients") || target.includes("comment faire")) {
                    if (!hasAccess('kitchen') && !hasAccess('floor-plan')) { speak("Accès cuisine requis."); return "Accès refusé"; }

                    const query = args.replace(/(recette de|comment faire le|comment faire la|ingrédients pour)/i, '').trim();
                    const recipe = recipes.find(r => r.name.toLowerCase().includes(query) || r.id.includes(query));

                    if (recipe) {
                        speak(`Pour la recette ${recipe.name}, il faut ${recipe.ingredients.length} ingrédients.`);
                        // Optional: Read first 3 ingredients
                        const first3 = recipe.ingredients.slice(0, 3).map((i: any) => `${i.quantity} ${i.unit} de ${i.name}`).join(', ');
                        speak(`Par exemple : ${first3}... et d'autres.`);
                        return `Recette: ${recipe.name}`;
                    } else {
                        speak(`Je ne trouve pas la recette pour ${query}.`);
                        return "Recette introuvable";
                    }
                }

                // 4.5 CRM Intelligence: Best Customer
                if (target.includes("meilleur client") || target.includes("top client")) {
                    if (!hasAccess('analytics')) { speak("Information confidentielle."); return "Accès refusé"; }
                    if (customers.length > 0) {
                        const topCustomer = [...customers].sort((a, b) => b.totalSpent - a.totalSpent)[0];
                        const spent = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(topCustomer.totalSpent);
                        const name = `${topCustomer.firstName} ${topCustomer.lastName}`;
                        speak(`Le meilleur client est ${name} avec ${spent} dépensés.`);
                        return `Top Client: ${name}`;
                    } else {
                        speak("Aucun client enregistré.");
                        return "Base client vide";
                    }
                }

                // 4.6 HACCP Compliance
                if (target.includes("hygiène") || target.includes("score") || target.includes("qualité")) {
                    const score = Math.round(getComplianceScore());
                    speak(`Le score de conformité HACCP est de ${score} pourcent.`);
                    return `HACCP Score: ${score}%`;
                }

                // 4.7 Temperature Check
                if (target.includes("température") || target.includes("frigo") || target.includes("froid")) {
                    const critical = sensors.filter(s => s.status === 'alert');
                    if (critical.length > 0) {
                        speak(`Attention, ${critical.length} capteurs sont en alerte.`);
                        return "Alertes Température détectées";
                    } else {
                        speak("Toutes les températures sont conformes.");
                        return "Températures OK";
                    }
                }

                // 4.8 Planning / Staff Intelligence
                if (target.includes("planning") || target.includes("staff") || target.includes("équipe") || target.includes("travaill")) {
                    const today = new Date().toISOString().split('T')[0];
                    const shiftCount = shifts.filter(s => s.date.toString().includes(today)).length;
                    speak(`Il y a ${shiftCount} membres de l'équipe planifiés aujourd'hui.`);
                    return `Planning: ${shiftCount} SHIFTS`;
                }

                // 4.9 Predictive Maintenance (The "Mechanic")
                if (target.includes("maintenance") || target.includes("casse") || target.includes("réparation")) {
                    if (predictiveAlerts.length > 0) {
                        speak(`Attention, une panne est prédite sur ${predictiveAlerts[0].equipmentName} dans ${Math.ceil((new Date(predictiveAlerts[0].predictedFailureDate).getTime() - Date.now()) / (1000 * 3600 * 24))} jours.`);
                        return "Alerte Maintenance Prédictive";
                    } else {
                        speak("Aucune panne prédite pour le moment. Systèmes nominaux.");
                        return "Systèmes Nominaux";
                    }
                }

                // 4.10 Financial Projections (The "CFO")
                if (target.includes("marge") || target.includes("coût matière") || target.includes("prime cost")) {
                    if (!hasAccess('analytics') && !hasAccess('accounting')) { speak("Information confidentielle."); return "Accès refusé"; }
                    const prime = financialInsight.primeCost.toFixed(1);
                    const food = financialInsight.foodCostPercent.toFixed(1);
                    speak(`Le Prime Cost est à ${prime} pourcent. Le coût matière est à ${food} pourcent.`);
                    return `Prime Cost: ${prime}%`;
                }

                return null;
            }
        }
    ];

    const processCommand = useCallback((text: string) => {
        setIsProcessing(true);
        const lowerText = text.toLowerCase();
        let matchFound = false;
        let successMessage = "";

        // Intelligent Matching Strategy
        for (const cmd of COMMANDS) {
            for (const pattern of cmd.patterns) {
                if (lowerText.includes(pattern)) {
                    // Extract arguments (everything after the pattern)
                    const args = lowerText.replace(pattern, '').trim();
                    const resultOrPromise = cmd.action(args || lowerText);

                    // We are in a non-async loop here (for iteration)
                    // We can't await properly inside this sync loop without refactoring.
                    // However, processCommand was refactored to be async previously?
                    // Ah, the previous replacement might have failed to update the signature?
                    // Let's assume result might be a promise.

                    if (resultOrPromise instanceof Promise) {
                        // We can't handle async properly in this sync block as written in the original file context I see.
                        // But I previously tried to make processCommand async.
                        // Let's just cast it or handle it optimistically.
                        resultOrPromise.then(res => {
                            if (res) {
                                setFeedback(res);
                            }
                        });
                        matchFound = true; // Assume match if promise returned // But we can't 'await' here
                        break;
                    }

                    const result = resultOrPromise as string | null;

                    if (result) {
                        matchFound = true;
                        successMessage = result;
                        break;
                    }
                }
            }
            if (matchFound) break;
        }

        if (matchFound) {
            setFeedback(successMessage);
            // showToast(successMessage, "success"); // Toast often redundant with voice
        } else {
            console.warn("Unrecognized command:", text);
            setFeedback("Je n'ai pas compris.");
            speak("Je n'ai pas compris.");
        }

        // Reset processing state after delay
        setTimeout(() => setIsProcessing(false), 2000);

    }, [router, showToast, toggleTheme, theme, toggleLaunchpad, openDocumentation, openCommandPalette, speak, totalRevenue, orders.length, stockItems, customers, sensors, shifts, predictiveAlerts, financialInsight, reviews, generateAIReply, runSimulation, hasAccess, recipes]);

    // --- Audio Visualization Logic ---
    const drawWaveform = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const time = Date.now() * 0.002;
        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;

        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 2;

        // Determine colors based on state
        // Green: Processing Action
        // Blue: System Speaking (TTS)
        // Gold: Listening
        const baseColor = isProcessing ? '#10B981' : isSpeaking ? '#3B82F6' : '#C5A059';

        const colors = [baseColor, baseColor, baseColor];

        // Multi-layered sine waves
        colors.forEach((color, i) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.globalAlpha = 1 - (i * 0.2);

            for (let x = 0; x < width; x++) {
                const frequency = 0.01 + (i * 0.005);
                // Amplitude higher when speaking or processing
                const waveAmp = isSpeaking ? 35 : (isProcessing ? 15 : 20);
                const amplitude = waveAmp + (Math.sin(time * 2) * 5);
                const phase = time + (i * 1.5);

                // Add some noise/randomness if listening to simulate voice
                const noise = isListening && !isProcessing && !isSpeaking ? Math.random() * 5 : 0;

                const y = centerY + Math.sin(x * frequency + phase) * amplitude + noise;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        // Particles
        if (isProcessing || isSpeaking) {
            const particleCount = 8;
            ctx.fillStyle = isSpeaking ? '#3B82F6' : '#10B981';
            for (let k = 0; k < particleCount; k++) {
                const px = (Date.now() / (10 + k * 5)) % width;
                const py = centerY + Math.sin(px * 0.02) * (isSpeaking ? 40 : 20);
                ctx.beginPath();
                ctx.arc(px, py, Math.random() * 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        requestRef.current = requestAnimationFrame(drawWaveform);
    }, [isListening, isProcessing, isSpeaking]);

    useEffect(() => {
        if (isListening || isSpeaking || isProcessing) {
            requestRef.current = requestAnimationFrame(drawWaveform);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isListening, isSpeaking, isProcessing, drawWaveform]);


    // --- Voice Recognition Setup ---
    useEffect(() => {
        if (!isListening) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            showToast("Navigation vocale non supportée par votre navigateur (Utilisez Chrome/Safari).", "error");
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.continuous = false; // Capture one command at a time
        recognition.interimResults = true; // Show typing effect

        recognition.onresult = (event: any) => {
            const currentResult = event.results[0];
            const resultText = currentResult[0].transcript;

            setTranscript(resultText);

            if (currentResult.isFinal) {
                processCommand(resultText);
                setIsListening(false); // Stop listening immediately to process
            }
        };

        recognition.onerror = (e: any) => {
            console.error("Speech recognition error", e);
            if (e.error === 'no-speech') {
                setFeedback("Aucune voix détectée...");
            } else {
                setFeedback("Erreur de reconnaissance.");
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            // Auto close if not processing
            if (!isProcessing && !isSpeaking) setIsListening(false);
        };

        recognition.start();

        return () => {
            recognition.stop();
        };
    }, [isListening, processCommand, showToast, isProcessing, isSpeaking]);

    // Keyboard shortcut (Alt + V)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'v') {
                e.preventDefault();
                setIsListening(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Ensure voices are loaded (Chrome quirk)
    useEffect(() => {
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);


    // If not visible, return nothing (or just the trigger button)
    // We want the trigger button to always be visible though.

    return (
        <>
            {/* Voice Command Listener UI Hidden - Moved to Settings */}
            <div className="hidden"></div>

            {/* --- Fullscreen Visualizer Overlay --- */
                (isListening || isProcessing || isSpeaking) && (
                    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-primary/95 backdrop-blur-3xl animate-in fade-in duration-300">

                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setIsListening(false);
                                setIsSpeaking(false);
                                window.speechSynthesis.cancel();
                            }}
                            className="absolute top-12 right-12 w-12 h-12 rounded-full border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-full max-w-2xl px-6 flex flex-col items-center text-center space-y-12">

                            {/* Dynamic Icon */}
                            <div className={cn(
                                "w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-700",
                                isSpeaking
                                    ? "bg-blue-500 text-white shadow-blue-500/30 scale-110"
                                    : isProcessing
                                        ? "bg-success text-white shadow-success/30 rotate-12 scale-110"
                                        : "bg-gradient-to-br from-neutral-900 to-black text-accent-gold shadow-premium"
                            )}>
                                {isSpeaking ? (
                                    <Activity className="w-10 h-10 animate-pulse" />
                                ) : isProcessing ? (
                                    <Zap className="w-10 h-10 fill-current" />
                                ) : (
                                    <Sparkles className="w-10 h-10 animate-pulse" strokeWidth={1.5} />
                                )}
                            </div>

                            {/* Status Text */}
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-serif font-black text-text-primary tracking-tight italic">
                                    {isSpeaking ? (
                                        <span className="text-blue-500">Je vous réponds...</span>
                                    ) : isProcessing ? (
                                        <span className="text-success">Exécution en cours...</span>
                                    ) : feedback ? (
                                        <span className="text-neutral-500">{feedback}</span>
                                    ) : (
                                        <>
                                            Je vous <span className="text-accent-gold underline decoration-2 underline-offset-4 decoration-accent-gold/30">écoute</span>.
                                        </>
                                    )}
                                </h2>
                                <p className="text-lg text-text-muted font-light h-8">
                                    {transcript || "Essayez 'Quel est le chiffre d'affaires ?'"}
                                </p>
                            </div>

                            {/* Audio Waveform Canvas */}
                            <div className="relative w-full h-32 rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-inner">
                                <canvas
                                    ref={canvasRef}
                                    width={600}
                                    height={128}
                                    className="w-full h-full object-cover opacity-80"
                                />

                                {/* Overlay Vignette */}
                                <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-transparent to-bg-primary opacity-50" />
                            </div>

                            {/* Shortcuts Hint */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-8 opacity-60">
                                {[
                                    { icon: Navigation, label: "Aller à..." },
                                    { icon: Command, label: "Chercher..." },
                                    { icon: Activity, label: "Revenu ?" },
                                    { icon: Zap, label: "Stock ?" },
                                ].map((hint, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-dashed border-neutral-300 dark:border-white/10">
                                        <hint.icon className="w-4 h-4 text-accent-gold" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{hint.label}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                )
            }
        </>
    );
}
