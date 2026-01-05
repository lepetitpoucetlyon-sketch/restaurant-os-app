"use client";

import { Stage, Layer, Rect, Circle, Text, Group, Arc } from "react-konva";
import { useState, useEffect, useMemo } from "react";
import { useTables } from "@/context/TablesContext";
import { Table, TableShape, TableStatus } from "@/types";
import { useReservations } from "@/context/ReservationsContext";
import {
    Settings2,
    Trash2,
    Copy,
    Armchair,
    RotateCw,
    Maximize,
    Minus,
    Plus,
    X,
    MapPin,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// Status Color Mapping
const STATUS_COLORS: Record<TableStatus, string> = {
    'free': '#E9ECEF',
    'seated': '#3B82F6', // Blue
    'ordered': '#F59E0B', // Amber
    'eating': '#10B981', // Green
    'paying': '#8B5CF6', // Purple
    'dirty': '#EF4444', // Red
    'reserved': '#F97316', // Orange
    'cleaning': '#EC4899', // Pink
    'locked': '#6B7280', // Gray
};

// Helper to render chairs
const TableChairs = ({ table, isSelected }: { table: Table; isSelected: boolean }) => {
    const chairs = [];
    const seatCount = table.seats;

    // Config for chair visual
    const chairDistance = 5;
    const chairSize = 20;

    for (let i = 0; i < seatCount; i++) {
        let x = 0;
        let y = 0;
        let rotation = 0;

        if (table.shape === 'circle') {
            // Circle Logic: Distribute evenly around the circle
            const angle = (i * 360) / seatCount;
            const rad = (angle * Math.PI) / 180;
            const dist = table.radius! + chairDistance;

            x = Math.cos(rad) * dist;
            y = Math.sin(rad) * dist;
            rotation = angle; // Point +X away from center
        } else {
            // Rectangle Logic: Distribute around the perimeter
            const w = table.width!;
            const h = table.height!;

            // We need to place chairs on the sides.
            // Simple robust distribution: Top, Right, Bottom, Left based on relative capacity
            // For general case, let's just use the perimeter walk
            const perimeter = 2 * (w + h);
            const step = perimeter / seatCount;
            let currentDist = i * step + (step / 2); // Center items in their segment

            // Determine position on the rectangle perimeter
            // Starting from top-left, going clockwise: Top -> Right -> Bottom -> Left
            // Adjust to center coordinates
            const hw = w / 2;
            const hh = h / 2;

            if (currentDist < w) {
                // Top side
                x = -hw + currentDist;
                y = -hh - chairDistance;
                rotation = 270; // +X points Up (Away)
            } else if (currentDist < w + h) {
                // Right side
                currentDist -= w;
                x = hw + chairDistance;
                y = -hh + currentDist;
                rotation = 0; // +X points Right (Away)
            } else if (currentDist < 2 * w + h) {
                // Bottom side
                currentDist -= (w + h);
                x = hw - currentDist;
                y = hh + chairDistance;
                rotation = 90; // +X points Down (Away)
            } else {
                // Left side
                currentDist -= (2 * w + h);
                x = -hw - chairDistance;
                y = hh - currentDist;
                rotation = 180; // +X points Left (Away)
            }
        }

        chairs.push(
            <Group key={i} x={x} y={y} rotation={rotation}>
                {/* Chair Back (Arc) - Centered at +X (0 deg) */}
                {/* 
                   Rotation 0 means arc is "up" relative to group.
                   If we want the back of the chair to be perpendicular to the table edge:
                   - Top side (rot 180): Group is rotated 180. Local Y- is "up" in screen space? No wait.
                   The Arc center is at 0,0. 
                   radius extends out.
                   
                   Let's keep the previous arc param but adjust group rotation if needed.
                   Previous: rotation=150 inside the Group.
                */}
                <Arc
                    innerRadius={10}
                    outerRadius={14}
                    angle={60}
                    rotation={-30} // Center at 0 degrees (Average of -30 to 30)
                    fill={isSelected ? "#1A1A1A" : "#ADB5BD"}
                    opacity={0.8}
                    shadowColor="black"
                    shadowBlur={2}
                    shadowOpacity={0.1}
                />
            </Group>
        );
    }

    return <Group>{chairs}</Group>;
};

// Zone Renderer Component
const ZoneRenderer = ({ tables, zones }: { tables: Table[], zones: any[] }) => {
    return (
        <Group>
            {zones.map((zone) => {
                const updatedZoneName = zone.name;
                const zoneTables = tables.filter(t => t.zoneId === zone.id);
                if (zoneTables.length === 0) return null;

                // Calculate bounding box
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

                zoneTables.forEach(t => {
                    // Approximate bounds based on center and dimensions
                    const halfW = (t.width || t.radius! * 2) / 2;
                    const halfH = (t.height || t.radius! * 2) / 2;

                    minX = Math.min(minX, t.x - halfW);
                    minY = Math.min(minY, t.y - halfH);
                    maxX = Math.max(maxX, t.x + halfW);
                    maxY = Math.max(maxY, t.y + halfH);
                });

                const PADDING = 60; // Generous padding around the group of tables
                const width = (maxX - minX) + (PADDING * 2);
                const height = (maxY - minY) + (PADDING * 2);
                const x = minX - PADDING;
                const y = minY - PADDING;

                return (
                    <Group key={zone.id}>
                        {/* Zone Background */}
                        <Rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            cornerRadius={40}
                            fill={zone.color}
                            opacity={0.4} // Subtle tint
                            stroke={zone.color} // Slightly darker border implicitly via fill or add dedicated stroke
                            strokeWidth={2}
                            dash={[10, 10]} // Dashed line to look architectural
                        />

                        {/* Zone Label */}
                        <Text
                            x={x}
                            y={y + 20}
                            width={width}
                            text={updatedZoneName.toUpperCase()}
                            fontSize={12}
                            fontFamily="Outfit"
                            fontStyle="bold"
                            fill="#1A1A1A"
                            align="center"
                            opacity={0.5}
                            letterSpacing={2}
                        />
                    </Group>
                );
            })}
        </Group>
    );
};

const EditPanel = ({
    selectedTable,
    updateTable,
    deleteTable,
    onClose
}: {
    selectedTable: Table;
    updateTable: (id: string, data: Partial<Table>) => void;
    deleteTable: (id: string) => void;
    onClose: () => void;
}) => {
    // @ts-ignore
    const { zones } = useTables();

    if (!selectedTable) return null;

    return (
        <div className="absolute top-4 right-4 w-80 bg-white rounded-3xl shadow-2xl border border-neutral-100 p-6 animate-in slide-in-from-right duration-300 z-50 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-black text-[#1A1A1A]">Table {selectedTable.number}</h3>
                    <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest">Configuration</p>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-neutral-50 rounded-full text-neutral-400">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Status Selector */}
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Statut Actuel
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(STATUS_COLORS).map(([status, color]) => (
                            <button
                                key={status}
                                onClick={() => updateTable(selectedTable.id, { status: status as TableStatus })}
                                className={cn(
                                    "flex flex-col items-center justify-center p-2 rounded-xl border border-neutral-50 transition-all hover:scale-105",
                                    selectedTable.status === status ? "ring-2 ring-offset-1 ring-[#1A1A1A] bg-neutral-50" : "opacity-70 hover:opacity-100"
                                )}
                            >
                                <div className="w-4 h-4 rounded-full mb-1" style={{ backgroundColor: color }} />
                                <span className="text-[9px] font-bold uppercase text-[#1A1A1A]">{status}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Zone Selection */}
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Zone
                    </label>
                    <select
                        value={selectedTable.zoneId}
                        onChange={(e) => updateTable(selectedTable.id, { zoneId: e.target.value })}
                        className="w-full p-3 bg-neutral-50 rounded-xl text-sm font-bold text-[#1A1A1A] border border-neutral-100 focus:outline-none focus:border-[#00D764] appearance-none"
                    >
                        {zones.map((zone: any) => (
                            <option key={zone.id} value={zone.id}>{zone.name}</option>
                        ))}
                    </select>
                </div>

                <div className="h-px bg-neutral-100 my-4" />

                {/* Shape Selection */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => updateTable(selectedTable.id, { shape: 'rect', width: 80, height: 80, radius: undefined })}
                        className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all",
                            selectedTable.shape === 'rect'
                                ? "border-[#1A1A1A] bg-neutral-50"
                                : "border-neutral-100 hover:border-neutral-200"
                        )}
                    >
                        <div className="w-8 h-6 border-2 border-current rounded-md mb-2" />
                        <span className="text-[10px] font-bold uppercase">Rectangle</span>
                    </button>
                    <button
                        onClick={() => updateTable(selectedTable.id, { shape: 'circle', radius: 40, width: undefined, height: undefined })}
                        className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all",
                            selectedTable.shape === 'circle'
                                ? "border-[#1A1A1A] bg-neutral-50"
                                : "border-neutral-100 hover:border-neutral-200"
                        )}
                    >
                        <div className="w-8 h-8 border-2 border-current rounded-full mb-2" />
                        <span className="text-[10px] font-bold uppercase">Ronde</span>
                    </button>
                </div>

                {/* Capacity */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                            <Armchair className="w-4 h-4" />
                            Couverts
                        </label>
                        <span className="text-sm font-black text-[#00D764]">{selectedTable.seats}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => updateTable(selectedTable.id, { seats: Math.max(1, selectedTable.seats - 1) })}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#1A1A1A] transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <input
                            type="range"
                            min="1"
                            max="12"
                            value={selectedTable.seats}
                            onChange={(e) => updateTable(selectedTable.id, { seats: parseInt(e.target.value) })}
                            className="flex-1 accent-[#1A1A1A] h-2 bg-neutral-100 rounded-full appearance-none cursor-pointer"
                        />
                        <button
                            onClick={() => updateTable(selectedTable.id, { seats: Math.min(20, selectedTable.seats + 1) })}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1A1A1A] hover:bg-black text-white transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Dimensions */}
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                        <Maximize className="w-4 h-4" />
                        Dimensions
                    </label>
                    {selectedTable.shape === 'circle' ? (
                        <input
                            type="range"
                            min="30"
                            max="100"
                            value={selectedTable.radius || 40}
                            onChange={(e) => updateTable(selectedTable.id, { radius: parseInt(e.target.value) })}
                            className="w-full accent-[#1A1A1A] h-2 bg-neutral-100 rounded-full appearance-none cursor-pointer"
                        />
                    ) : (
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1">
                                <span className="text-[9px] font-bold text-[#ADB5BD]">LARGEUR</span>
                                <input
                                    type="number"
                                    value={selectedTable.width || 80}
                                    onChange={(e) => updateTable(selectedTable.id, { width: parseInt(e.target.value) })}
                                    className="w-full p-2 bg-neutral-50 rounded-xl text-sm font-bold text-[#1A1A1A] border border-neutral-100 focus:outline-none focus:border-[#00D764]"
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <span className="text-[9px] font-bold text-[#ADB5BD]">LONGUEUR</span>
                                <input
                                    type="number"
                                    value={selectedTable.height || 80}
                                    onChange={(e) => updateTable(selectedTable.id, { height: parseInt(e.target.value) })}
                                    className="w-full p-2 bg-neutral-50 rounded-xl text-sm font-bold text-[#1A1A1A] border border-neutral-100 focus:outline-none focus:border-[#00D764]"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-neutral-100">
                    <button
                        onClick={() => {
                            if (confirm('Supprimer cette table ?')) {
                                deleteTable(selectedTable.id);
                                onClose();
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                        Supprimer la table
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function FloorPlanEditor() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    // @ts-ignore
    const { tables, zones, updateTablePosition, updateTable, deleteTable } = useTables();
    const { getReservationsForTable } = useReservations();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectedTable = useMemo(() => tables.find(t => t.id === selectedId), [tables, selectedId]);

    useEffect(() => {
        const handleResize = () => {
            const container = document.getElementById("canvas-container");
            if (container) {
                setDimensions({
                    width: container.offsetWidth,
                    height: container.offsetHeight,
                });
            }
        };

        handleResize(); // Immediate call
        // Use ResizeObserver for more robust resizing
        const container = document.getElementById("canvas-container");
        if (container) {
            const observer = new ResizeObserver(handleResize);
            observer.observe(container);
            return () => observer.disconnect();
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleDragEnd = (e: { target: { x: () => number; y: () => number } }, id: string) => {
        updateTablePosition(id, e.target.x(), e.target.y());
    };

    return (
        <div className="relative w-full h-full bg-[#F8F9FA] rounded-3xl border border-neutral-100 overflow-hidden shadow-inner">
            {/* Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            <div id="canvas-container" className="absolute inset-0 w-full h-full z-0">
                {dimensions.width > 0 && (
                    <Stage
                        width={dimensions.width}
                        height={dimensions.height}
                        draggable
                        onMouseDown={(e) => {
                            if (e.target === e.target.getStage()) {
                                setSelectedId(null);
                            }
                        }}
                        className="cursor-move"
                    >
                        <Layer>
                            {/* Zone Visualization Layer - At the bottom */}
                            {/* @ts-ignore */}
                            <ZoneRenderer tables={tables} zones={zones} />

                            {tables.map((table) => {
                                const reservations = getReservationsForTable(table.id);
                                const hasReservation = reservations && reservations.length > 0;
                                const isSelected = selectedId === table.id;

                                const statusColor = STATUS_COLORS[table.status as TableStatus] || STATUS_COLORS['free'];

                                const bgColor = isSelected ? "#1A1A1A" : "#FFFFFF";
                                // Dynamic Stroke based on Status
                                const strokeColor = isSelected ? "#00D764" : statusColor;
                                const textColor = isSelected ? "#00D764" : "#1A1A1A";

                                return (
                                    <Group
                                        key={table.id}
                                        x={table.x}
                                        y={table.y}
                                        draggable
                                        onDragEnd={(e) => handleDragEnd(e, table.id)}
                                        onClick={() => setSelectedId(table.id)}
                                        onTap={() => setSelectedId(table.id)}
                                    >

                                        {/* Chairs Layer */}
                                        <TableChairs table={table} isSelected={isSelected} />

                                        {/* Status Glow (Shadow) */}
                                        {table.status !== 'free' && (
                                            <Circle
                                                radius={Math.max(table.width || 0, table.height || 0, table.radius || 0) + 20}
                                                fill={statusColor}
                                                opacity={0.1}
                                                listening={false}
                                            />
                                        )}

                                        {/* Main Table Shape */}
                                        {table.shape === "circle" ? (
                                            <Circle
                                                radius={table.radius!}
                                                fill={bgColor}
                                                stroke={strokeColor}
                                                strokeWidth={isSelected ? 3 : 2}
                                                shadowColor={statusColor}
                                                shadowBlur={isSelected ? 30 : 10}
                                                shadowOpacity={isSelected ? 0.3 : 0.1}
                                                shadowOffset={{ x: 0, y: 5 }}
                                            />
                                        ) : (
                                            <Rect
                                                width={table.width!}
                                                height={table.height!}
                                                offsetX={table.width! / 2}
                                                offsetY={table.height! / 2}
                                                cornerRadius={16}
                                                fill={bgColor}
                                                stroke={strokeColor}
                                                strokeWidth={isSelected ? 3 : 2}
                                                shadowColor={statusColor}
                                                shadowBlur={isSelected ? 30 : 10}
                                                shadowOpacity={isSelected ? 0.3 : 0.1}
                                                shadowOffset={{ x: 0, y: 5 }}
                                            />
                                        )}

                                        {/* Table Info */}
                                        <Text
                                            text={table.number}
                                            fontSize={18}
                                            fontFamily="Outfit"
                                            fontStyle="900"
                                            fill={textColor}
                                            align="center"
                                            verticalAlign="middle"
                                            offsetX={10}
                                            offsetY={6}
                                            width={20}
                                            height={12}
                                            listening={false}
                                        />

                                        {/* Reservation Indicator */}
                                        {hasReservation && !isSelected && (
                                            <Circle
                                                x={table.width ? table.width / 2 - 8 : table.radius! - 8}
                                                y={table.height ? -table.height / 2 + 8 : -table.radius! + 8}
                                                radius={4}
                                                fill="#F97316"
                                                stroke="#FFFFFF"
                                                strokeWidth={2}
                                            />
                                        )}
                                    </Group>
                                );
                            })}
                        </Layer>
                    </Stage>
                )}
            </div>

            {/* Editing UI Overlay */}
            {selectedTable && (
                <EditPanel
                    selectedTable={selectedTable}
                    updateTable={updateTable}
                    deleteTable={deleteTable}
                    onClose={() => setSelectedId(null)}
                />
            )}

            {/* Status Legend - Bottom Left */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-neutral-100 shadow-lg flex gap-4 max-w-full overflow-x-auto">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#E9ECEF] border border-neutral-300" />
                    <span className="text-[10px] font-bold uppercase text-neutral-500">Libre</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                    <span className="text-[10px] font-bold uppercase text-[#1A1A1A]">Installé</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                    <span className="text-[10px] font-bold uppercase text-[#1A1A1A]">Mange</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                    <span className="text-[10px] font-bold uppercase text-[#1A1A1A]">Paiement</span>
                </div>
            </div>
        </div>
    );
}
