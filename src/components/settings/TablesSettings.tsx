"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTables } from "@/context/TablesContext";
import {
    LayoutGrid,
    Save,
    Loader2,
    Plus,
    Trash2,
    Edit3,
    MapPin,
    Users,
    Square,
    Circle,
    Layers,
    Check,
    X,
    Home,
    Building2,
    TreePine,
    Palette,
    MousePointer2,
    Box,
    Grid,
    Cpu,
    Sparkles,
    ChevronDown,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const ZONE_COLORS = ['#F5F5F0', '#E8E8E0', '#D0D0C8', '#FFF8E1', '#F0EFEA', '#EAE0D5', '#D6CFC7', '#C0B8B0'];
const TABLE_SHAPES = [
    { id: 'rect', label: 'Rectangle', icon: Square },
    { id: 'circle', label: 'Rond', icon: Circle },
];

export default function TablesSettings() {
    const {
        tables,
        zones,
        floors,
        addTable,
        updateTable,
        deleteTable,
        addZone,
        updateZone,
        deleteZone,
        addFloor,
        updateFloor,
        deleteFloor
    } = useTables();

    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'zones' | 'tables' | 'floors'>('zones');

    // Zone editing state
    const [isEditingZone, setIsEditingZone] = useState(false);
    const [editingZone, setEditingZone] = useState<{ id?: string; name: string; color: string; description: string; floorId: string } | null>(null);

    // Table editing state
    const [isEditingTable, setIsEditingTable] = useState(false);
    const [editingTable, setEditingTable] = useState<{ id?: string; number: string; seats: number; shape: 'rect' | 'circle'; zoneId: string; floorId: string } | null>(null);

    // Floor editing state
    const [isEditingFloor, setIsEditingFloor] = useState(false);
    const [editingFloor, setEditingFloor] = useState<{ id?: string; name: string; level: number; description: string } | null>(null);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 500));
        setIsSaving(false);
    };

    // Zone handlers
    const handleAddZone = () => {
        setEditingZone({ name: '', color: ZONE_COLORS[0], description: '', floorId: floors[0]?.id || 'rdc' });
        setIsEditingZone(true);
    };

    const handleEditZone = (zone: typeof zones[0]) => {
        setEditingZone({ id: zone.id, name: zone.name, color: zone.color, description: zone.description || '', floorId: zone.floorId || 'rdc' });
        setIsEditingZone(true);
    };

    const handleSaveZone = () => {
        if (!editingZone?.name.trim()) return;
        if (editingZone.id) {
            updateZone(editingZone.id, { name: editingZone.name, color: editingZone.color, description: editingZone.description, floorId: editingZone.floorId });
        } else {
            addZone({ name: editingZone.name, color: editingZone.color, description: editingZone.description, floorId: editingZone.floorId });
        }
        setIsEditingZone(false);
        setEditingZone(null);
    };

    // Table handlers
    const handleAddTable = () => {
        setEditingTable({ number: '', seats: 4, shape: 'rect', zoneId: zones[0]?.id || 'main', floorId: floors[0]?.id || 'rdc' });
        setIsEditingTable(true);
    };

    const handleEditTable = (table: typeof tables[0]) => {
        setEditingTable({ id: table.id, number: table.number, seats: table.seats, shape: table.shape as any, zoneId: table.zoneId || 'main', floorId: table.floorId || 'rdc' });
        setIsEditingTable(true);
    };

    const handleSaveTable = async () => {
        if (!editingTable?.number.trim()) return;
        if (editingTable.id) {
            await updateTable(editingTable.id, { number: editingTable.number, seats: editingTable.seats, shape: editingTable.shape, zoneId: editingTable.zoneId, floorId: editingTable.floorId });
        } else {
            await addTable({
                number: editingTable.number,
                seats: editingTable.seats,
                shape: editingTable.shape,
                status: 'free',
                x: 100 + Math.random() * 200,
                y: 100 + Math.random() * 200,
                width: 80,
                height: 80,
                zoneId: editingTable.zoneId,
                floorId: editingTable.floorId
            });
        }
        setIsEditingTable(false);
        setEditingTable(null);
    };

    // Floor handlers
    const handleAddFloor = () => {
        setEditingFloor({ name: '', level: floors.length, description: '' });
        setIsEditingFloor(true);
    };

    const handleEditFloor = (floor: typeof floors[0]) => {
        setEditingFloor({ id: floor.id, name: floor.name, level: floor.level, description: floor.description || '' });
        setIsEditingFloor(true);
    };

    const handleSaveFloor = () => {
        if (!editingFloor?.name.trim()) return;
        if (editingFloor.id) {
            updateFloor(editingFloor.id, { name: editingFloor.name, level: editingFloor.level, description: editingFloor.description });
        } else {
            addFloor({ name: editingFloor.name, level: editingFloor.level, description: editingFloor.description, isActive: true });
        }
        setIsEditingFloor(false);
        setEditingFloor(null);
    };

    const tablesCount = tables.length;
    const totalSeats = tables.reduce((acc, t) => acc + t.seats, 0);

    return (
        <div className="space-y-12 pb-20">
            {/* NEW: Configuration Toolbar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-bg-secondary p-3 rounded-[2rem] shadow-premium border border-border flex flex-col xl:flex-row items-center gap-6 xl:gap-0 relative z-20 overflow-hidden"
            >
                {/* 1. Left: Zone Selector */}
                <div className="relative z-10 flex items-center gap-6 xl:pr-8 xl:border-r border-border w-full xl:w-auto justify-between xl:justify-start">
                    <button className="flex items-center gap-4 bg-bg-primary hover:bg-bg-tertiary transition-colors rounded-[1.5rem] pl-2 pr-6 py-2 group border border-border">
                        <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                            <Home className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-3">
                                <span className="text-text-primary font-bold text-xs tracking-[0.2em] group-hover:text-text-secondary transition-colors">REZ-DE-CHAUSSÉE</span>
                                <ChevronDown className="w-3 h-3 text-text-muted" />
                            </div>
                            <p className="text-[10px] text-text-muted font-bold tracking-wider mt-0.5">8 UNITÉS • 30 PAX</p>
                        </div>
                    </button>

                    {/* Title Mobile Hidden or Small */}
                    <div className="xl:hidden flex flex-col items-end">
                        <h2 className="font-serif italic text-xl text-text-primary">Config.</h2>
                    </div>
                </div>

                {/* 2. Center: Title Brand */}
                <div className="hidden xl:flex flex-col justify-center px-8 relative z-10">
                    <h1 className="font-serif text-3xl italic leading-none text-text-primary whitespace-nowrap">
                        Configuration <span className="text-accent">de Salle</span>
                    </h1>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.3em] mt-1">
                        ÉDITEUR D'AGENCEMENT INTELLIGENT
                    </p>
                </div>

                {/* 3. Right: Tools & Actions */}
                <div className="flex-1 w-full flex flex-col md:flex-row items-center justify-end gap-4 xl:gap-6 xl:pl-8 xl:border-l border-border relative z-10">

                    {/* Tool Group 1: Edit Mode */}
                    <div className="flex items-center p-1 bg-bg-primary rounded-full border border-border w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('zones')}
                            className={cn(
                                "flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest transition-all",
                                activeTab === 'zones' || activeTab === 'tables'
                                    ? "bg-text-primary text-bg-primary shadow-lg"
                                    : "text-text-muted hover:text-text-primary"
                            )}
                        >
                            <MousePointer2 className="w-3 h-3" />
                            SÉLECTION
                        </button>
                        <button
                            onClick={() => {
                                if (activeTab === 'zones') handleAddZone();
                                else if (activeTab === 'tables') handleAddTable();
                                else if (activeTab === 'floors') handleAddFloor();
                            }}
                            className={cn(
                                "flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest transition-all",
                                isEditingZone || isEditingTable || isEditingFloor
                                    ? "bg-text-primary text-bg-primary shadow-lg"
                                    : "text-text-muted hover:text-text-primary"
                            )}
                        >
                            <Plus className="w-3 h-3" />
                            AJOUTER
                        </button>
                    </div>

                    {/* Tool Group 2: View Toggles */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                        <button className="px-5 py-3 bg-bg-primary hover:bg-bg-tertiary text-text-primary border border-border rounded-full flex items-center gap-2 transition-all">
                            <Sparkles className="w-3 h-3 text-accent" />
                            <span className="text-[10px] font-bold tracking-widest">ZONES SCÉLÉES</span>
                        </button>

                        <div className="flex items-center p-1 bg-bg-primary rounded-full border border-border relative">
                            {/* <div className="absolute inset-0 bg-transparent rounded-full z-0 pointer-events-none" /> */}
                            <button className="px-4 py-2 bg-text-primary rounded-full text-bg-primary text-[10px] font-bold z-10">2D</button>
                            <button className="px-4 py-2 text-text-muted text-[10px] font-bold hover:text-text-primary transition-colors z-10">3D</button>
                        </div>
                    </div>

                    <div className="hidden 2xl:block w-px h-8 bg-border" />

                    {/* Tool Group 3: Status & Validation */}
                    <div className="flex items-center gap-3 hidden md:flex">
                        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-bold text-emerald-600 tracking-wider">NEURAL SYNC</span>
                        </div>

                        <button className="w-10 h-10 rounded-full bg-bg-primary border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-all">
                            <Grid className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-3 bg-text-primary hover:bg-text-secondary text-bg-primary rounded-full text-[10px] font-bold tracking-widest transition-all shadow-lg flex items-center gap-2"
                        >
                            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            HOMOLOGUER
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Quick Context Stats (New Minimalist Design) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'CONFIGURATION', value: activeTab === 'zones' ? 'Zones' : activeTab === 'tables' ? 'Tables' : 'Étages', icon: LayoutGrid },
                    { label: 'ELEMENTS VISIBLES', value: activeTab === 'zones' ? zones.length : activeTab === 'tables' ? tablesCount : floors.length, icon: Box },
                    { label: 'CAPACITÉ TOTALE', value: totalSeats + ' PAX', icon: Users },
                    { label: 'TAUX OPTIMISATION', value: '94%', icon: Cpu },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-bg-secondary border border-border p-4 rounded-2xl flex items-center justify-between group hover:border-accent/30 transition-all">
                        <div>
                            <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-lg font-serif text-text-primary italic">{stat.value}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-bg-primary flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Sub-Nav for legacy support (Visual tab switcher styled minimally) */}
            <div className="flex justify-center">
                <div className="inline-flex bg-bg-primary p-1 rounded-full border border-border">
                    {[
                        { id: 'floors', label: 'Architecture' },
                        { id: 'zones', label: 'Zones & Service' },
                        { id: 'tables', label: 'Mobilier' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                                activeTab === tab.id
                                    ? "bg-text-primary text-bg-primary shadow-md"
                                    : "text-text-muted hover:text-text-primary"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content based on active tab */}
            <AnimatePresence mode="wait">
                {activeTab === 'floors' && (
                    <motion.div
                        key="floors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-bg-secondary border border-border rounded-2xl md:rounded-[2.5rem] shadow-premium p-4 md:p-10"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center text-accent border border-border">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">Gestion des Étages</h3>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Niveaux du restaurant</p>
                                </div>
                            </div>
                        </div>

                        {/* Floor edit modal */}
                        <AnimatePresence>
                            {isEditingFloor && editingFloor && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 overflow-hidden"
                                >
                                    <div className="p-6 bg-bg-primary rounded-2xl border border-border">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Nom</label>
                                                <input
                                                    type="text"
                                                    value={editingFloor.name}
                                                    onChange={(e) => setEditingFloor({ ...editingFloor, name: e.target.value })}
                                                    placeholder="Ex: Rez-de-chaussée"
                                                    className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-text-primary font-serif outline-none focus:border-accent/40 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Niveau</label>
                                                <input
                                                    type="number"
                                                    value={editingFloor.level}
                                                    onChange={(e) => setEditingFloor({ ...editingFloor, level: Number(e.target.value) })}
                                                    className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-text-primary font-serif outline-none focus:border-accent/40 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Description</label>
                                                <input
                                                    type="text"
                                                    value={editingFloor.description}
                                                    onChange={(e) => setEditingFloor({ ...editingFloor, description: e.target.value })}
                                                    placeholder="Description optionnelle"
                                                    className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-text-primary font-serif outline-none focus:border-accent/40 transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button onClick={() => { setIsEditingFloor(false); setEditingFloor(null); }} className="px-4 py-2 text-text-muted font-bold text-xs uppercase">Annuler</button>
                                            <button onClick={handleSaveFloor} className="flex items-center gap-2 px-5 py-2 bg-text-primary text-bg-primary rounded-lg font-bold text-xs uppercase hover:bg-text-secondary transition-colors">
                                                <Check className="w-4 h-4" />
                                                {editingFloor.id ? 'Sauvegarder' : 'Créer'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-3">
                            {floors.map((floor, idx) => (
                                <motion.div
                                    key={floor.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center gap-4 p-5 bg-bg-primary rounded-2xl border border-border group hover:border-accent/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-bg-tertiary flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-serif text-text-primary italic text-lg">{floor.name}</p>
                                        <p className="text-xs text-text-muted font-bold tracking-wide">Niveau {floor.level} • {floor.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditFloor(floor)} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
                                            <Edit3 className="w-4 h-4 text-text-muted" />
                                        </button>
                                        <button onClick={() => deleteFloor(floor.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'zones' && (
                    <motion.div
                        key="zones"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-bg-secondary border border-border rounded-2xl md:rounded-[2.5rem] shadow-premium p-4 md:p-10"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center text-accent border border-border">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">Gestion des Zones</h3>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Espaces de service</p>
                                </div>
                            </div>
                        </div>

                        {/* Zone edit modal */}
                        <AnimatePresence>
                            {isEditingZone && editingZone && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 overflow-hidden"
                                >
                                    <div className="p-6 bg-bg-primary rounded-2xl border border-border">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Nom de la zone</label>
                                                <input
                                                    type="text"
                                                    value={editingZone.name}
                                                    onChange={(e) => setEditingZone({ ...editingZone, name: e.target.value })}
                                                    placeholder="Ex: Terrasse, Salle VIP..."
                                                    className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-text-primary font-serif outline-none focus:border-accent/40"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Étage</label>
                                                <select
                                                    value={editingZone.floorId}
                                                    onChange={(e) => setEditingZone({ ...editingZone, floorId: e.target.value })}
                                                    className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-text-primary font-serif outline-none focus:border-accent/40 cursor-pointer"
                                                >
                                                    {floors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Couleur</label>
                                            <div className="flex gap-2">
                                                {ZONE_COLORS.map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setEditingZone({ ...editingZone, color })}
                                                        className={cn(
                                                            "w-10 h-10 rounded-xl transition-all hover:scale-110 border border-border",
                                                            editingZone.color === color && "ring-2 ring-offset-2 ring-offset-bg-primary ring-text-primary scale-110"
                                                        )}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => { setIsEditingZone(false); setEditingZone(null); }} className="px-4 py-2 text-text-muted font-bold text-xs uppercase">Annuler</button>
                                            <button onClick={handleSaveZone} className="flex items-center gap-2 px-5 py-2 bg-text-primary text-bg-primary rounded-lg font-bold text-xs uppercase hover:bg-text-secondary transition-colors">
                                                <Check className="w-4 h-4" />
                                                {editingZone.id ? 'Sauvegarder' : 'Créer'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {zones.map((zone, idx) => (
                                <motion.div
                                    key={zone.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-5 rounded-2xl border border-border group hover:shadow-lg transition-all relative overflow-hidden"
                                    style={{ backgroundColor: zone.color }}
                                >
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: zone.color }} />
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditZone(zone)} className="p-1.5 hover:bg-black/5 rounded-lg"><Edit3 className="w-3.5 h-3.5 text-neutral-600" /></button>
                                                <button onClick={() => deleteZone(zone.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                                            </div>
                                        </div>
                                        <p className="font-serif text-neutral-900 text-lg italic">{zone.name}</p>
                                        <p className="text-xs text-neutral-500 font-medium">{zone.description || 'Aucune description'}</p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="px-2 py-1 bg-white/40 rounded-lg text-[10px] font-bold text-neutral-700">
                                                {tables.filter(t => t.zoneId === zone.id).length} tables
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'tables' && (
                    <motion.div
                        key="tables"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-bg-secondary border border-border rounded-2xl md:rounded-[2.5rem] shadow-premium p-4 md:p-10"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center text-accent border border-border">
                                    <LayoutGrid className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">Gestion des Tables</h3>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Configuration du mobilier</p>
                                </div>
                            </div>
                        </div>

                        {/* Table edit modal */}
                        <AnimatePresence>
                            {isEditingTable && editingTable && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 overflow-hidden"
                                >
                                    <div className="p-6 bg-bg-primary rounded-2xl border border-border">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Numéro</label>
                                                <input
                                                    type="text"
                                                    value={editingTable.number}
                                                    onChange={(e) => setEditingTable({ ...editingTable, number: e.target.value })}
                                                    placeholder="Ex: 1, A1..."
                                                    className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-text-primary font-serif outline-none focus:border-accent/40"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Couverts</label>
                                                <input
                                                    type="number"
                                                    value={editingTable.seats}
                                                    onChange={(e) => setEditingTable({ ...editingTable, seats: Number(e.target.value) })}
                                                    min={1}
                                                    max={20}
                                                    className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-text-primary font-serif outline-none focus:border-accent/40"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Zone</label>
                                                <select
                                                    value={editingTable.zoneId}
                                                    onChange={(e) => setEditingTable({ ...editingTable, zoneId: e.target.value })}
                                                    className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-text-primary font-serif outline-none focus:border-accent/40 cursor-pointer"
                                                >
                                                    {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Forme</label>
                                                <div className="flex gap-2">
                                                    {TABLE_SHAPES.map((shape) => (
                                                        <button
                                                            key={shape.id}
                                                            onClick={() => setEditingTable({ ...editingTable, shape: shape.id as any })}
                                                            className={cn(
                                                                "flex-1 py-3 rounded-xl flex items-center justify-center transition-all border border-border",
                                                                editingTable.shape === shape.id
                                                                    ? "bg-text-primary text-bg-primary"
                                                                    : "bg-bg-tertiary text-text-muted hover:bg-bg-secondary"
                                                            )}
                                                        >
                                                            <shape.icon className="w-5 h-5" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => { setIsEditingTable(false); setEditingTable(null); }} className="px-4 py-2 text-text-muted font-bold text-xs uppercase">Annuler</button>
                                            <button onClick={handleSaveTable} className="flex items-center gap-2 px-5 py-2 bg-text-primary text-bg-primary rounded-lg font-bold text-xs uppercase hover:bg-text-secondary transition-colors">
                                                <Check className="w-4 h-4" />
                                                {editingTable.id ? 'Sauvegarder' : 'Créer'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {tables.map((table, idx) => {
                                const zone = zones.find(z => z.id === table.zoneId);
                                return (
                                    <motion.div
                                        key={table.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className="p-4 bg-bg-primary rounded-2xl border border-border group hover:shadow-lg hover:scale-105 transition-all cursor-pointer hover:border-accent/40"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={cn(
                                                "w-12 h-12 flex items-center justify-center font-serif text-lg font-medium text-neutral-800",
                                                table.shape === 'circle' ? 'rounded-full' : 'rounded-xl'
                                            )} style={{ backgroundColor: zone?.color || '#f3f4f6' }}>
                                                {table.number}
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditTable(table)} className="p-1.5 hover:bg-bg-tertiary rounded-lg">
                                                    <Edit3 className="w-3.5 h-3.5 text-text-muted" />
                                                </button>
                                                <button onClick={() => deleteTable(table.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg">
                                                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="flex items-center gap-1 text-text-muted font-medium">
                                                <Users className="w-3.5 h-3.5" />
                                                {table.seats}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold text-neutral-600 truncate max-w-[80px]" style={{ backgroundColor: zone?.color }}>
                                                {zone?.name || 'N/A'}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
