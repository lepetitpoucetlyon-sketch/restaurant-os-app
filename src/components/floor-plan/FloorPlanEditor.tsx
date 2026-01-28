"use client";

import { Stage, Layer, Rect, Circle, Text, Group, Arc } from "react-konva";
import Konva from "konva";
import { useState, useEffect, useMemo, forwardRef, useImperativeHandle, useRef } from "react";
import { useTables } from "@/context/TablesContext";
import { Table, TableShape, TableStatus, Zone } from "@/types";
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
    Activity,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { slideInRight, fadeIn, scaleIn } from "@/lib/motion";
import { TableInsightPanel } from "./TableInsightPanel";
import { PaymentDialog } from "../pos/PaymentDialog";

// Status Color Mapping - Premium Gradient Palettes
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
const TableChairs = ({ table, isSelected, viewMode, isDarkMode }: { table: Table; isSelected: boolean, viewMode: '2d' | '3d', isDarkMode: boolean }) => {
    const chairs = [];
    const seatCount = table.seats;
    const chairDistance = 5;

    for (let i = 0; i < seatCount; i++) {
        let x = 0;
        let y = 0;
        let rotation = 0;

        if (table.shape === 'circle') {
            const angle = (i * 360) / seatCount;
            const rad = (angle * Math.PI) / 180;
            const dist = table.radius! + chairDistance;
            x = Math.cos(rad) * dist;
            y = Math.sin(rad) * dist;
            rotation = angle;
        } else {
            const w = table.width!;
            const h = table.height!;
            const perimeter = 2 * (w + h);
            const step = perimeter / seatCount;
            let currentDist = i * step + (step / 2);
            const hw = w / 2;
            const hh = h / 2;

            if (currentDist < w) {
                x = -hw + currentDist;
                y = -hh - chairDistance;
                rotation = 270;
            } else if (currentDist < w + h) {
                currentDist -= w;
                x = hw + chairDistance;
                y = -hh + currentDist;
                rotation = 0;
            } else if (currentDist < 2 * w + h) {
                currentDist -= (w + h);
                x = hw - currentDist;
                y = hh + chairDistance;
                rotation = 90;
            } else {
                currentDist -= (2 * w + h);
                x = -hw - chairDistance;
                y = hh - currentDist;
                rotation = 180;
            }
        }

        chairs.push(
            <Group key={i} x={x} y={y} rotation={rotation}>
                {/* Chair Legs (Simple representation for 3D) */}
                {viewMode === '3d' && (
                    <>
                        <Circle x={-5} y={5} radius={2} fill="#000" opacity={0.2} />
                        <Circle x={5} y={5} radius={2} fill="#000" opacity={0.2} />
                    </>
                )}

                {/* Chair Seat */}
                <Arc
                    innerRadius={0} // Filled seat
                    outerRadius={14}
                    angle={360}
                    rotation={0}
                    fill={isSelected ? (isDarkMode ? "#C5A059" : "#333") : (isDarkMode ? "#1A1A1A" : "#F1F5F9")} // Lighter 3D shade
                    stroke={isSelected ? (isDarkMode ? "#FFFFFF" : "#C5A059") : (isDarkMode ? "#333" : "#CBD5E1")}
                    strokeWidth={1}
                    shadowColor="black"
                    shadowBlur={viewMode === '3d' ? 6 : 2}
                    shadowOpacity={viewMode === '3d' ? 0.3 : 0.1}
                    shadowOffsetY={viewMode === '3d' ? 4 : 1}
                />

                {/* Chair Backrest - Curved for realism */}
                <Arc
                    innerRadius={10}
                    outerRadius={16}
                    angle={100}
                    rotation={310} // Positioned at the "back" - facing the table (180° flipped)
                    fill={isSelected ? (isDarkMode ? "#C5A059" : "#333") : (isDarkMode ? "#2A2A2A" : "#E2E8F0")}
                    stroke={isSelected ? (isDarkMode ? "#FFFFFF" : "#C5A059") : (isDarkMode ? "#333" : "#CBD5E1")}
                    strokeWidth={1}
                    opacity={1}
                    cornerRadius={5}
                />

                {/* 3D Depth Highlight on Backrest */}
                {viewMode === '3d' && (
                    <Arc
                        innerRadius={15}
                        outerRadius={16}
                        angle={100}
                        rotation={310}
                        fill="white"
                        opacity={0.3}
                        listening={false}
                    />
                )}
            </Group>
        );
    }

    return <Group>{chairs}</Group>;
};

// Zone Renderer Component - Optimized for performance
const ZoneRenderer = ({ tables, zones, isLocked, onUpdateTablePosition, onUpdateZone, isDarkMode }: {
    tables: Table[],
    zones: Zone[],
    isLocked: boolean,
    onUpdateTablePosition: (id: string, x: number, y: number) => Promise<void>,
    onUpdateZone: (id: string, updates: Partial<Zone>) => void,
    isDarkMode: boolean
}) => {
    const dragNodesRef = useRef<Record<string, { x: number, y: number, node: any }>>({});
    // Local state ref for resize operations to avoid re-renders during drag
    const resizeStateRef = useRef<{ zoneId: string; updates: Partial<Zone> } | null>(null);

    return (
        <Group>
            {zones.map((zone) => {
                const zoneTables = tables.filter(t => t.zoneId === zone.id);
                // If no tables and no manual position, don't render
                if (zoneTables.length === 0 && zone.x === undefined) return null;

                // Dimensions Logic
                let x: number, y: number, width: number, height: number;

                if (zone.x !== undefined && zone.y !== undefined && zone.width !== undefined && zone.height !== undefined) {
                    x = zone.x;
                    y = zone.y;
                    width = zone.width;
                    height = zone.height;
                } else {
                    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                    zoneTables.forEach(t => {
                        const tableW = t.width || (t.radius ? t.radius * 2 : 80);
                        const tableH = t.height || (t.radius ? t.radius * 2 : 80);
                        minX = Math.min(minX, t.x - tableW / 2);
                        minY = Math.min(minY, t.y - tableH / 2);
                        maxX = Math.max(maxX, t.x + tableW / 2);
                        maxY = Math.max(maxY, t.y + tableH / 2);
                    });

                    if (minX === Infinity) return null;

                    const PADDING = 60;
                    x = minX - PADDING;
                    y = minY - PADDING;
                    width = (maxX - minX) + (PADDING * 2);
                    height = (maxY - minY) + (PADDING * 2);
                }

                const handleSize = 14;

                // Helper to finalize resize on drag end
                const finalizeResize = () => {
                    if (resizeStateRef.current && resizeStateRef.current.zoneId === zone.id) {
                        onUpdateZone(zone.id, resizeStateRef.current.updates);
                        resizeStateRef.current = null;
                    }
                };

                return (
                    <Group key={zone.id}>
                        {/* Main Zone Container - Draggable */}
                        <Group
                            draggable={isLocked}
                            onDragStart={(e) => {
                                if (!isLocked) return;
                                const stage = e.target.getStage();
                                if (!stage) return;

                                const starts: Record<string, { x: number, y: number, node: any }> = {};
                                zoneTables.forEach(t => {
                                    const node = stage.findOne(`#${t.id}`);
                                    if (node) {
                                        starts[t.id] = { x: t.x, y: t.y, node };
                                    }
                                });
                                dragNodesRef.current = starts;
                                e.target.moveToTop();
                            }}
                            onDragMove={(e) => {
                                if (!isLocked) return;
                                const dx = e.target.x();
                                const dy = e.target.y();

                                Object.values(dragNodesRef.current).forEach(({ x: startX, y: startY, node }) => {
                                    node.x(startX + dx);
                                    node.y(startY + dy);
                                });
                            }}
                            onDragEnd={async (e) => {
                                if (!isLocked) return;
                                const dx = e.target.x();
                                const dy = e.target.y();

                                const updates = zoneTables.map(t => {
                                    const data = dragNodesRef.current[t.id];
                                    if (data) {
                                        return onUpdateTablePosition(t.id, data.x + dx, data.y + dy);
                                    }
                                    return Promise.resolve();
                                });

                                await Promise.all(updates);

                                // Reset Group position and save actual coordinates if manual
                                if (zone.x !== undefined && zone.y !== undefined) {
                                    onUpdateZone(zone.id, { x: zone.x + dx, y: zone.y + dy });
                                }

                                e.target.x(0);
                                e.target.y(0);
                                dragNodesRef.current = {};
                            }}
                        >
                            {/* Visual Box */}
                            <Rect
                                x={x}
                                y={y}
                                width={width}
                                height={height}
                                cornerRadius={40}
                                fill={zone.color}
                                opacity={0.35}
                                stroke={zone.color}
                                strokeWidth={4}
                                shadowColor={zone.color}
                                shadowBlur={20}
                                shadowOpacity={0.3}
                                perfectDrawEnabled={false}
                                shadowForStrokeEnabled={false}
                            />

                            {/* Glassmorphism Inner Layer */}
                            <Rect
                                x={x + 5}
                                y={y + 5}
                                width={width - 10}
                                height={height - 10}
                                cornerRadius={35}
                                fill={isDarkMode ? "black" : "white"}
                                opacity={isDarkMode ? 0.3 : 0.1}
                                listening={false}
                            />

                            {/* Zone Header - BIGGER & BLACK */}
                            <Group x={x + 30} y={y - 25}>
                                <Rect
                                    width={240}
                                    height={50}
                                    cornerRadius={25}
                                    fill={isDarkMode ? "#0A0A0A" : "white"}
                                    stroke={isDarkMode ? "#C5A059" : zone.color}
                                    strokeWidth={3}
                                    shadowColor="black"
                                    shadowBlur={10}
                                    shadowOpacity={0.15}
                                    perfectDrawEnabled={false}
                                />
                                <Text
                                    x={0}
                                    y={14}
                                    width={240}
                                    text={zone.name.toUpperCase()}
                                    fontSize={18}
                                    fontFamily="Outfit"
                                    fontStyle="900"
                                    fill={isDarkMode ? "#C5A059" : "#000000"}
                                    align="center"
                                    letterSpacing={4}
                                />
                            </Group>

                            {isLocked && (
                                <Text
                                    x={x}
                                    y={y + height + 15}
                                    width={width}
                                    text="DÉPLACER ZONE"
                                    fontSize={10}
                                    fontFamily="Outfit"
                                    fontStyle="900"
                                    fill={isDarkMode ? "#C5A059" : "#000000"}
                                    align="center"
                                    opacity={isDarkMode ? 0.4 : 0.6}
                                    letterSpacing={2}
                                />
                            )}
                        </Group>

                        {/* Resize Handles (Only in Edit Mode) */}
                        {isLocked && (
                            <Group>
                                {/* Corners - nwse/nesw feedback */}
                                <Rect
                                    x={x - handleSize / 2} y={y - handleSize / 2} width={handleSize * 1.5} height={handleSize * 1.5}
                                    fill="transparent" stroke="transparent" strokeWidth={0} cornerRadius={4}
                                    opacity={0}
                                    draggable
                                    onDragEnd={finalizeResize}
                                    onDragMove={(e) => {
                                        const nx = e.target.x() + handleSize / 2;
                                        const ny = e.target.y() + handleSize / 2;
                                        resizeStateRef.current = {
                                            zoneId: zone.id,
                                            updates: { x: nx, y: ny, width: width + (x - nx), height: height + (y - ny) }
                                        };
                                    }}
                                    onMouseEnter={(e) => (e.target.getStage()!.container().style.cursor = 'nwse-resize')}
                                    onMouseLeave={(e) => (e.target.getStage()!.container().style.cursor = 'default')}
                                />
                                <Rect
                                    x={x + width - handleSize / 2} y={y - handleSize / 2} width={handleSize * 1.5} height={handleSize * 1.5}
                                    fill="transparent" stroke="transparent" strokeWidth={0} cornerRadius={4}
                                    opacity={0}
                                    draggable
                                    onDragEnd={finalizeResize}
                                    onDragMove={(e) => {
                                        const nx_r = e.target.x() + handleSize / 2;
                                        const ny_t = e.target.y() + handleSize / 2;
                                        resizeStateRef.current = {
                                            zoneId: zone.id,
                                            updates: { y: ny_t, width: nx_r - x, height: height + (y - ny_t) }
                                        };
                                    }}
                                    onMouseEnter={(e) => (e.target.getStage()!.container().style.cursor = 'nesw-resize')}
                                    onMouseLeave={(e) => (e.target.getStage()!.container().style.cursor = 'default')}
                                />
                                <Rect
                                    x={x - handleSize / 2} y={y + height - handleSize / 2} width={handleSize * 1.5} height={handleSize * 1.5}
                                    fill="transparent" stroke="transparent" strokeWidth={0} cornerRadius={4}
                                    opacity={0}
                                    draggable
                                    onDragEnd={finalizeResize}
                                    onDragMove={(e) => {
                                        const nx_l = e.target.x() + handleSize / 2;
                                        const ny_b = e.target.y() + handleSize / 2;
                                        resizeStateRef.current = {
                                            zoneId: zone.id,
                                            updates: { x: nx_l, width: width + (x - nx_l), height: ny_b - y }
                                        };
                                    }}
                                    onMouseEnter={(e) => (e.target.getStage()!.container().style.cursor = 'nesw-resize')}
                                    onMouseLeave={(e) => (e.target.getStage()!.container().style.cursor = 'default')}
                                />
                                <Rect
                                    x={x + width - handleSize / 2} y={y + height - handleSize / 2} width={handleSize * 1.5} height={handleSize * 1.5}
                                    fill="transparent" stroke="transparent" strokeWidth={0} cornerRadius={4}
                                    opacity={0}
                                    draggable
                                    onDragEnd={finalizeResize}
                                    onDragMove={(e) => {
                                        const nx_r = e.target.x() + handleSize / 2;
                                        const ny_b = e.target.y() + handleSize / 2;
                                        resizeStateRef.current = {
                                            zoneId: zone.id,
                                            updates: { width: nx_r - x, height: ny_b - y }
                                        };
                                    }}
                                    onMouseEnter={(e) => (e.target.getStage()!.container().style.cursor = 'nwse-resize')}
                                    onMouseLeave={(e) => (e.target.getStage()!.container().style.cursor = 'default')}
                                />

                                {/* Edges - ns/ew feedback */}
                                <Rect
                                    x={x + width / 2 - 20} y={y - (handleSize / 2)} width={40} height={handleSize}
                                    fill="transparent" stroke="transparent" strokeWidth={0} cornerRadius={6}
                                    opacity={0}
                                    draggable
                                    onDragEnd={finalizeResize}
                                    onDragMove={(e) => {
                                        const ny_t = e.target.y() + handleSize / 2;
                                        resizeStateRef.current = {
                                            zoneId: zone.id,
                                            updates: { y: ny_t, height: height + (y - ny_t) }
                                        };
                                    }}
                                    onMouseEnter={(e) => (e.target.getStage()!.container().style.cursor = 'ns-resize')}
                                    onMouseLeave={(e) => (e.target.getStage()!.container().style.cursor = 'default')}
                                />
                                <Rect
                                    x={x + width / 2 - 20} y={y + height - (handleSize / 2)} width={40} height={handleSize}
                                    fill="transparent" stroke="transparent" strokeWidth={0} cornerRadius={6}
                                    opacity={0}
                                    draggable
                                    onDragEnd={finalizeResize}
                                    onDragMove={(e) => {
                                        const ny_b = e.target.y() + handleSize / 2;
                                        resizeStateRef.current = {
                                            zoneId: zone.id,
                                            updates: { height: ny_b - y }
                                        };
                                    }}
                                    onMouseEnter={(e) => (e.target.getStage()!.container().style.cursor = 'ns-resize')}
                                    onMouseLeave={(e) => (e.target.getStage()!.container().style.cursor = 'default')}
                                />
                                <Rect
                                    x={x - (handleSize / 2)} y={y + height / 2 - 20} width={handleSize} height={40}
                                    fill="transparent" stroke="transparent" strokeWidth={0} cornerRadius={6}
                                    opacity={0}
                                    draggable
                                    onDragEnd={finalizeResize}
                                    onDragMove={(e) => {
                                        const nx_l = e.target.x() + handleSize / 2;
                                        resizeStateRef.current = {
                                            zoneId: zone.id,
                                            updates: { x: nx_l, width: width + (x - nx_l) }
                                        };
                                    }}
                                    onMouseEnter={(e) => (e.target.getStage()!.container().style.cursor = 'ew-resize')}
                                    onMouseLeave={(e) => (e.target.getStage()!.container().style.cursor = 'default')}
                                />
                                <Rect
                                    x={x + width - (handleSize / 2)} y={y + height / 2 - 20} width={handleSize} height={40}
                                    fill="transparent" stroke="transparent" strokeWidth={0} cornerRadius={6}
                                    opacity={0}
                                    draggable
                                    onDragEnd={finalizeResize}
                                    onDragMove={(e) => {
                                        const nx_r = e.target.x() + handleSize / 2;
                                        resizeStateRef.current = {
                                            zoneId: zone.id,
                                            updates: { width: nx_r - x }
                                        };
                                    }}
                                    onMouseEnter={(e) => (e.target.getStage()!.container().style.cursor = 'ew-resize')}
                                    onMouseLeave={(e) => (e.target.getStage()!.container().style.cursor = 'default')}
                                />
                            </Group>
                        )}
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
    onClose,
    isDarkMode
}: {
    selectedTable: Table;
    updateTable: (id: string, data: Partial<Table>) => Promise<void>;
    deleteTable: (id: string) => Promise<void>;
    onClose: () => void;
    isDarkMode: boolean;
}) => {
    const { zones } = useTables();

    if (!selectedTable) return null;

    return (
        <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-4 right-4 w-80 bg-bg-primary/95 dark:bg-bg-secondary/95 backdrop-blur-xl rounded-[24px] shadow-2xl border border-border z-50 overflow-hidden flex flex-col max-h-[calc(100vh-40px)]"
        >
            <div className="flex items-center justify-between p-6 border-b border-border bg-bg-tertiary/20">
                <div className="space-y-1">
                    <motion.h3
                        key={selectedTable.id + selectedTable.number}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-serif font-light text-text-primary italic tracking-tight"
                    >
                        Table {selectedTable.number}<span className="text-accent-gold not-italic">.</span>
                    </motion.h3>
                    <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.3em]">Signature Configuration</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center bg-white dark:bg-bg-secondary border border-border rounded-full text-text-muted hover:text-text-primary transition-all shadow-premium"
                >
                    <X className="w-4 h-4" />
                </motion.button>
            </div>

            <div className="flex-1 p-6 space-y-8 elegant-scrollbar overflow-y-auto pb-32">
                <div className="space-y-6">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                        <Activity className="w-4 h-4 text-accent-gold" />
                        Statut Op&eacute;rationnel
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {Object.entries(STATUS_COLORS).map(([status, color]) => (
                            <motion.button
                                key={status}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={async () => await updateTable(selectedTable.id, { status: status as TableStatus })}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all relative overflow-hidden",
                                    selectedTable.status === status
                                        ? "bg-white dark:bg-bg-secondary border-accent-gold shadow-glow"
                                        : "bg-bg-tertiary/50 border-border opacity-60 hover:opacity-100"
                                )}
                            >
                                <div className="w-3 h-3 rounded-full mb-3" style={{ backgroundColor: color }} />
                                <span className="text-[9px] font-black uppercase tracking-wider text-text-primary">{status}</span>
                                {selectedTable.status === status && (
                                    <div className="absolute top-0 right-0 w-2 h-2 bg-accent-gold rounded-bl-lg" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-accent-gold" />
                        Localisation Dynamique
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                        {zones.map((zone: any) => (
                            <motion.button
                                key={zone.id}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateTable(selectedTable.id, { zoneId: zone.id })}
                                className={cn(
                                    "flex items-center justify-between p-5 rounded-2xl border transition-all group",
                                    selectedTable.zoneId === zone.id
                                        ? "bg-white dark:bg-bg-secondary border-accent-gold shadow-glow text-text-primary"
                                        : "bg-bg-tertiary/50 border-border text-text-muted hover:border-text-primary hover:bg-white dark:hover:bg-bg-secondary"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: zone.color }} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{zone.name}</span>
                                </div>
                                {selectedTable.zoneId === zone.id ? (
                                    <Check className="w-4 h-4 text-accent-gold font-black" />
                                ) : (
                                    <span className="text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-accent-gold">Transférer</span>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-border my-4" />

                <div className="grid grid-cols-2 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={async () => await updateTable(selectedTable.id, { shape: 'rect', width: 80, height: 80, radius: undefined })}
                        className={cn(
                            "flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all group",
                            selectedTable.shape === 'rect'
                                ? "border-accent-gold bg-white dark:bg-bg-secondary shadow-glow text-accent-gold"
                                : "border-border bg-bg-tertiary/50 text-text-muted hover:border-text-primary"
                        )}
                    >
                        <div className={cn("w-10 h-8 border-2 rounded-lg mb-4 transition-colors", selectedTable.shape === 'rect' ? "border-accent-gold" : "border-text-muted group-hover:border-text-primary")} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Rectangle</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={async () => await updateTable(selectedTable.id, { shape: 'circle', radius: 40, width: undefined, height: undefined })}
                        className={cn(
                            "flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all group",
                            selectedTable.shape === 'circle'
                                ? "border-accent-gold bg-white dark:bg-bg-secondary shadow-glow text-accent-gold"
                                : "border-border bg-bg-tertiary/50 text-text-muted hover:border-text-primary"
                        )}
                    >
                        <div className={cn("w-10 h-10 border-2 rounded-full mb-4 transition-colors", selectedTable.shape === 'circle' ? "border-accent-gold" : "border-text-muted group-hover:border-text-primary")} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Cercle</span>
                    </motion.button>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                            <Armchair className="w-4 h-4" />
                            Couverts
                        </label>
                        <motion.span
                            key={selectedTable.seats}
                            initial={{ scale: 1.5, color: isDarkMode ? "#C5A059" : "#000000" }}
                            animate={{ scale: 1, color: isDarkMode ? "#C5A059" : "#000000" }}
                            className="text-sm font-black"
                        >
                            {selectedTable.seats}
                        </motion.span>
                    </div>
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={async () => await updateTable(selectedTable.id, { seats: Math.max(1, selectedTable.seats - 1) })}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-tertiary hover:bg-bg-secondary text-text-primary transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </motion.button>
                        <input
                            type="range"
                            min="1"
                            max="12"
                            value={selectedTable.seats}
                            onChange={(e) => updateTable(selectedTable.id, { seats: parseInt(e.target.value) })}
                            className="flex-1 accent-text-primary dark:accent-accent h-2 bg-bg-tertiary rounded-full appearance-none cursor-pointer"
                        />
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={async () => await updateTable(selectedTable.id, { seats: Math.min(20, selectedTable.seats + 1) })}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-text-primary hover:bg-black text-white transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 dark:border-border">
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "rgb(254 226 226 / 0.1)", color: "#EF4444" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={async () => {
                            if (confirm('Supprimer cette table ?')) {
                                await deleteTable(selectedTable.id);
                                onClose();
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 text-red-500 bg-red-500/10 dark:bg-red-500/20 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                        Supprimer la table
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

interface FloorPlanEditorProps {
    scale: number;
    onScaleChange: (scale: number) => void;
    position: { x: number; y: number };
    onPositionChange: (pos: { x: number; y: number }) => void;
    mode: 'select' | 'add';
    viewMode?: '2d' | '3d';
    currentFloorId?: string;
}

export interface FloorPlanEditorRef {
    center: (forceScale?: number) => void;
    exportImage: () => string | undefined;
    zoomIn: () => void;
    zoomOut: () => void;
}

const FloorPlanEditor = forwardRef<FloorPlanEditorRef, FloorPlanEditorProps>(({
    scale,
    onScaleChange,
    position,
    onPositionChange,
    mode,
    viewMode = '2d',
    currentFloorId = 'rdc'
}, ref) => {
    const stageRef = useRef<any>(null);
    const [isManualPan, setIsManualPan] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [checkoutTotal, setCheckoutTotal] = useState(0);

    const { tables, zones, updateTablePosition, updateTable, deleteTable, addTable, isZonesLocked, getTablesForFloor, getZonesForFloor, updateZone } = useTables();
    const { getReservationsForTable } = useReservations();

    // Theme detection
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkTheme = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // Filter tables and zones by current floor
    const floorTables = useMemo(() => getTablesForFloor(currentFloorId), [tables, currentFloorId]);
    const floorZones = useMemo(() => getZonesForFloor(currentFloorId), [zones, currentFloorId]);
    const selectedTable = useMemo(() => floorTables.find(t => t.id === selectedId), [floorTables, selectedId]);

    const centerPlan = (forceScale?: number) => {
        if (!floorTables || floorTables.length === 0 || dimensions.width === 0) return;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        floorTables.forEach(t => {
            const tableW = t.width || (t.radius ? t.radius * 2 : 80);
            const tableH = t.height || (t.radius ? t.radius * 2 : 80);
            const halfW = tableW / 2;
            const halfH = tableH / 2;
            // Add chair padding (~30px around each table)
            const padding = 35;
            minX = Math.min(minX, t.x - halfW - padding);
            minY = Math.min(minY, t.y - halfH - padding);
            maxX = Math.max(maxX, t.x + halfW + padding);
            maxY = Math.max(maxY, t.y + halfH + padding);
        });

        const planWidth = maxX - minX;
        const planHeight = maxY - minY;
        const planCenter = {
            x: minX + planWidth / 2,
            y: minY + planHeight / 2
        };

        // Calculate the optimal scale to fit all tables in viewport with some margin
        const viewportPadding = 100; // Extra padding around edges
        const availableWidth = dimensions.width - viewportPadding * 2;
        const availableHeight = dimensions.height - viewportPadding * 2;

        const scaleX = availableWidth / planWidth;
        const scaleY = availableHeight / planHeight;

        // Use the smaller scale to ensure everything fits, and clamp between reasonable bounds
        const optimalScale = forceScale || Math.min(Math.max(Math.min(scaleX, scaleY), 0.4), 1.2);

        onScaleChange(optimalScale);

        const newPos = {
            x: (dimensions.width / 2) - planCenter.x * optimalScale,
            y: (dimensions.height / 2) - planCenter.y * optimalScale
        };

        onPositionChange(newPos);
        setIsManualPan(false);
    };

    const zoomAtPoint = (point: { x: number, y: number }, delta: number) => {
        const oldScale = scale;
        const mousePointTo = {
            x: (point.x - position.x) / oldScale,
            y: (point.y - position.y) / oldScale,
        };

        const scaleBy = 1.2;
        const newScale = delta > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        const boundedScale = Math.min(Math.max(newScale, 0.4), 4);

        onScaleChange(boundedScale);

        const newPos = {
            x: point.x - mousePointTo.x * boundedScale,
            y: point.y - mousePointTo.y * boundedScale,
        };
        onPositionChange(newPos);
    };

    useImperativeHandle(ref, () => ({
        center: centerPlan,
        zoomIn: () => {
            zoomAtPoint({ x: dimensions.width / 2, y: dimensions.height / 2 }, 1);
        },
        zoomOut: () => {
            zoomAtPoint({ x: dimensions.width / 2, y: dimensions.height / 2 }, -1);
        },
        exportImage: () => {
            if (stageRef.current) {
                const uri = stageRef.current.toDataURL();
                const link = document.createElement('a');
                link.download = `plan-de-salle-${new Date().toISOString().split('T')[0]}.png`;
                link.href = uri;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return uri;
            }
        }
    }));


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

        handleResize();
        const container = document.getElementById("canvas-container");
        if (container) {
            const observer = new ResizeObserver(handleResize);
            observer.observe(container);
            return () => observer.disconnect();
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Effect to center on first load or when table count changes or floor changes
    useEffect(() => {
        if (dimensions.width > 0 && floorTables.length > 0 && !isManualPan) {
            centerPlan();
        }
    }, [floorTables.length, dimensions.width, currentFloorId]);

    const handleDragStart = (e: any) => {
        // Minimal visual feedback for better performance
        e.target.setAttrs({
            shadowBlur: 15,
            shadowOpacity: 0.15
        });
    };

    const handleDragEnd = async (e: any, id: string) => {
        // Reset visual state immediately
        e.target.setAttrs({
            shadowBlur: 8,
            shadowOpacity: 0.08
        });

        // Update position in database (async, non-blocking)
        updateTablePosition(id, e.target.x(), e.target.y());
    };

    const handleWheel = (e: any) => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const scaleBy = 1.1;
        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        const boundedScale = Math.min(Math.max(newScale, 0.5), 3);

        onScaleChange(boundedScale);

        const newPos = {
            x: pointer.x - mousePointTo.x * boundedScale,
            y: pointer.y - mousePointTo.y * boundedScale,
        };
        onPositionChange(newPos);
    };

    const handleStageClick = async (e: any) => {
        if (mode === 'add' && e.target === e.target.getStage()) {
            const stage = e.target.getStage();
            const pointer = stage.getPointerPosition();
            const x = (pointer.x - stage.x()) / stage.scaleX();
            const y = (pointer.y - stage.y()) / stage.scaleY();
            const newTableNumber = (Math.max(0, ...floorTables.map((t: any) => parseInt(t.number) || 0)) + 1).toString();

            await addTable({
                number: newTableNumber,
                x,
                y,
                seats: 4,
                status: 'free',
                shape: 'rect',
                width: 80,
                height: 80,
                zoneId: floorZones[0]?.id || 'main',
                floorId: currentFloorId
            });
        } else if (e.target === e.target.getStage()) {
            setSelectedId(null);
        }
    };

    const handleCheckout = (total: number) => {
        setCheckoutTotal(total);
        setIsPaymentOpen(true);
    };

    const handlePaymentComplete = async () => {
        if (selectedId) {
            await updateTable(selectedId, { status: 'free' });
            setSelectedId(null);
            setIsPaymentOpen(false);
        }
    };

    return (
        <div className="relative w-full h-full bg-[#fcfcfc] dark:bg-black border-4 border-transparent dark:border-white rounded-3xl overflow-hidden transition-colors duration-500">
            <div id="canvas-container" className="absolute inset-0 w-full h-full z-0">
                {dimensions.width > 0 && (
                    <Stage
                        ref={stageRef}
                        width={dimensions.width}
                        height={dimensions.height}
                        scaleX={scale}
                        scaleY={scale}
                        x={position.x}
                        y={position.y}
                        draggable={mode === 'select'}
                        onWheel={handleWheel}
                        onMouseDown={handleStageClick}
                        onDragEnd={(e) => {
                            // Only update stage position if the stage itself was dragged
                            if (e.target === e.target.getStage()) {
                                onPositionChange({ x: e.target.x(), y: e.target.y() });
                                setIsManualPan(true);
                            }
                        }}
                        onDragStart={(e) => {
                            if (e.target === e.target.getStage()) {
                                setIsManualPan(true);
                            }
                        }}
                        className={cn(mode === 'select' ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair")}
                    >
                        <Layer>
                            <ZoneRenderer
                                tables={floorTables}
                                zones={floorZones}
                                isLocked={isZonesLocked}
                                onUpdateTablePosition={updateTablePosition}
                                onUpdateZone={updateZone}
                                isDarkMode={isDarkMode}
                            />

                            {floorTables.map((table) => {
                                const reservations = getReservationsForTable(table.id);
                                const hasReservation = reservations && reservations.length > 0;
                                const isSelected = selectedId === table.id;
                                const statusColor = STATUS_COLORS[table.status as TableStatus] || STATUS_COLORS['free'];

                                // Dynamic Colors based on Theme (Dark Mode = White Tables on Black BG)
                                const tableBaseColor = isDarkMode ? "#FFFFFF" : "#FFFFFF";
                                const tableTextColor = isDarkMode ? "#000000" : "#1A1A1A";

                                const bgColor = isSelected ? (isDarkMode ? "#000000" : "#F8F9FA") : tableBaseColor;
                                const strokeColor = "#C5A059";
                                const textColor = isSelected ? "#C5A059" : tableTextColor;

                                return (
                                    <Group
                                        key={table.id}
                                        id={table.id}
                                        name={table.id}
                                        x={table.x}
                                        y={table.y}
                                        draggable
                                        onDragStart={handleDragStart}
                                        onDragEnd={(e) => handleDragEnd(e, table.id)}
                                        onClick={() => setSelectedId(table.id)}
                                        onTap={() => setSelectedId(table.id)}
                                    >
                                        <TableChairs table={table} isSelected={isSelected} viewMode={viewMode} isDarkMode={isDarkMode} />

                                        {/* 3D Depth Layer */}
                                        {viewMode === '3d' && (
                                            table.shape === "circle" ? (
                                                <Circle
                                                    radius={table.radius!}
                                                    fill='#9CA3AF'
                                                    offsetY={-8}
                                                />
                                            ) : (
                                                <Rect
                                                    width={table.width!}
                                                    height={table.height!}
                                                    offsetX={table.width! / 2}
                                                    offsetY={table.height! / 2 - 8}
                                                    cornerRadius={16}
                                                    fill='#9CA3AF'
                                                />
                                            )
                                        )}

                                        {/* Dynamic Status Glow */}
                                        <Circle
                                            radius={Math.max(table.width || 0, table.height || 0, table.radius || 0) + (isSelected ? 25 : 15)}
                                            fill={statusColor}
                                            opacity={isSelected ? 0.2 : 0}
                                            listening={false}
                                        />

                                        {/* Main Table Shape */}
                                        {table.shape === "circle" ? (
                                            <Circle
                                                radius={table.radius!}
                                                fill={table.status === 'free' ? bgColor : statusColor}
                                                stroke={strokeColor}
                                                strokeWidth={isSelected ? 3 : 2}
                                                shadowColor={statusColor}
                                                shadowBlur={isSelected ? 15 : 8}
                                                shadowOpacity={isSelected ? 0.3 : 0.1}
                                                shadowOffset={{ x: 0, y: 4 }}
                                                perfectDrawEnabled={false}
                                            />
                                        ) : (
                                            <Rect
                                                width={table.width!}
                                                height={table.height!}
                                                offsetX={table.width! / 2}
                                                offsetY={table.height! / 2}
                                                cornerRadius={16}
                                                fill={table.status === 'free' ? bgColor : statusColor}
                                                stroke={strokeColor}
                                                strokeWidth={isSelected ? 3 : 2}
                                                shadowColor={statusColor}
                                                shadowBlur={isSelected ? 15 : 8}
                                                shadowOpacity={isSelected ? 0.3 : 0.1}
                                                shadowOffset={{ x: 0, y: 4 }}
                                                perfectDrawEnabled={false}
                                            />
                                        )}

                                        <Text
                                            text={table.number}
                                            fontSize={16}
                                            fontFamily="Outfit"
                                            fontStyle="900"
                                            fill={table.status === 'free' ? textColor : '#FFFFFF'}
                                            align="center"
                                            verticalAlign="middle"
                                            offsetX={40}
                                            offsetY={10}
                                            width={80}
                                            listening={false}
                                        />

                                        {/* Reservation Badge */}
                                        {hasReservation && !isSelected && (
                                            <Circle
                                                x={table.width ? table.width / 2 - 8 : table.radius! - 8}
                                                y={table.height ? -table.height / 2 + 8 : -table.radius! + 8}
                                                radius={6}
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

            {/* Insight Panel (Left) */}
            <AnimatePresence>
                {selectedTable && (
                    <TableInsightPanel
                        selectedTable={selectedTable}
                        onClose={() => setSelectedId(null)}
                        onCheckout={handleCheckout}
                    />
                )}
            </AnimatePresence>

            <PaymentDialog
                isOpen={isPaymentOpen}
                total={checkoutTotal}
                onClose={() => setIsPaymentOpen(false)}
                onPaymentComplete={handlePaymentComplete}
            />

            {/* Editing UI Overlay */}
            <AnimatePresence>
                {selectedTable && (
                    <EditPanel
                        selectedTable={selectedTable}
                        updateTable={updateTable}
                        deleteTable={deleteTable}
                        onClose={() => setSelectedId(null)}
                        isDarkMode={isDarkMode}
                    />
                )}
            </AnimatePresence>
        </div>
    );
});

export default FloorPlanEditor;
