"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
    Zap,
    Database,
    Layers,
    Share2,
    Activity,
    X,
    Maximize2,
    Search,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * EXECUTIVE DATA MAP (TATAMAP)
 * An interactive D3 force-directed graph visualizing the Restaurant OS ecosystem.
 */

interface Node extends d3.SimulationNodeDatum {
    id: string;
    label: string;
    group: string;
    size: number;
    description: string;
    metrics?: { label: string; value: string }[];
}

interface Link extends d3.SimulationLinkDatum<Node> {
    id: string;
    label: string;
    strength: number;
}

const NODES: Node[] = [
    {
        id: 'pos', label: 'Caisse (POS)', group: 'revenue', size: 60,
        description: 'Moteur transactionnel central gérant les ventes et les encaissements.',
        metrics: [{ label: 'Tickets/j', value: '142' }, { label: 'Ticket Moyen', value: '42€' }]
    },
    {
        id: 'kds', label: 'Cuisine (KDS)', group: 'production', size: 50,
        description: 'Interface de production temps-réel pour la préparation des commandes.',
        metrics: [{ label: 'Temps Prep', value: '12m' }]
    },
    {
        id: 'inventory', label: 'Stocks', group: 'logistics', size: 45,
        description: 'Gestion des matières premières et suivi HACCP.',
        metrics: [{ label: 'Valeur', value: '14k€' }, { label: 'Alertes', value: '3' }]
    },
    {
        id: 'reservations', label: 'Réservations', group: 'customer', size: 40,
        description: 'CRM et carnet de réservations intelligent.',
        metrics: [{ label: 'Couverts/j', value: '85' }]
    },
    {
        id: 'accounting', label: 'Comptabilité', group: 'finance', size: 55,
        description: 'Pilotage financier et analyse de rentabilité.',
        metrics: [{ label: 'EBITDA', value: '+12%' }]
    },
    {
        id: 'staff', label: 'Staff HR', group: 'human', size: 35,
        description: 'Gestion de la brigade, des plannings et du pointage.',
        metrics: [{ label: 'Brigade', value: '8' }]
    },
    {
        id: 'floor', label: 'Plan Salle', group: 'production', size: 30,
        description: 'Visualisation spatiale et occupation des tables.'
    }
];

const LINKS: Link[] = [
    { id: 'pos-kds', source: 'pos', target: 'kds', label: 'Envoi Commandes', strength: 1 },
    { id: 'pos-inv', source: 'pos', target: 'inventory', label: 'Sortie Stock', strength: 0.8 },
    { id: 'pos-acc', source: 'pos', target: 'accounting', label: 'Flux Revenus', strength: 1.2 },
    { id: 'res-floor', source: 'reservations', target: 'floor', label: 'Placement', strength: 0.6 },
    { id: 'staff-pos', source: 'staff', target: 'pos', label: 'Authentification', strength: 0.5 },
    { id: 'inv-acc', source: 'inventory', target: 'accounting', label: 'Dépenses Food', strength: 0.7 },
    { id: 'kds-inv', source: 'kds', target: 'inventory', label: 'Usage Recettes', strength: 0.4 }
];

export function MindMap() {
    const svgRef = useRef<SVGSVGElement>(null);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 1200;
        const height = 800;

        const svg = d3.select(svgRef.current)
            .attr('viewBox', [0, 0, width, height])
            .style('width', '100%')
            .style('height', '100%');

        svg.selectAll('*').remove();

        // Background grid
        svg.append('defs').append('pattern')
            .attr('id', 'grid')
            .attr('width', 40)
            .attr('height', 40)
            .attr('patternUnits', 'userSpaceOnUse')
            .append('circle')
            .attr('cx', 2)
            .attr('cy', 2)
            .attr('r', 1)
            .attr('fill', '#e5e7eb');

        svg.append('rect')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', 'url(#grid)');

        const container = svg.append('g');

        // Force simulation
        const simulation = d3.forceSimulation<Node>(NODES)
            .force('link', d3.forceLink<Node, Link>(LINKS).id(d => d.id).distance(250))
            .force('charge', d3.forceManyBody().strength(-1500))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(d => (d as Node).size + 60));

        // Interaction handlers
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 4])
            .on('zoom', (event) => {
                container.attr('transform', event.transform);
            });

        svg.call(zoom);

        // Links
        const link = container.append('g')
            .selectAll('g')
            .data(LINKS)
            .join('g')
            .attr('class', 'link-group');

        link.append('path')
            .attr('stroke', '#00D764')
            .attr('stroke-opacity', 0.2)
            .attr('stroke-width', d => d.strength * 4)
            .attr('fill', 'none')
            .attr('stroke-dasharray', '8,4');

        // Link labels
        const linkLabel = link.append('text')
            .attr('font-size', '10px')
            .attr('font-weight', '700')
            .attr('fill', '#ADB5BD')
            .attr('text-anchor', 'middle')
            .attr('dy', -5)
            .style('text-transform', 'uppercase')
            .style('letter-spacing', '0.1em')
            .text(d => d.label);

        // Nodes
        const node = container.append('g')
            .selectAll('g')
            .data(NODES)
            .join('g')
            .attr('class', 'node-group')
            .style('cursor', 'pointer')
            .on('click', (event, d) => setSelectedNode(d))
            .call(d3.drag<any, any>()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        // Glow Filter
        const filter = svg.append('defs').append('filter').attr('id', 'glow');
        filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
        filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

        // Node Circles
        node.append('circle')
            .attr('r', d => d.size)
            .attr('fill', '#1A1A1A')
            .attr('stroke', '#00D764')
            .attr('stroke-width', 3)
            .attr('filter', 'url(#glow)');

        // Node Labels
        node.append('text')
            .attr('dy', d => d.size + 25)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', '900')
            .attr('fill', '#1A1A1A')
            .style('text-transform', 'uppercase')
            .style('letter-spacing', '1px')
            .text(d => d.label);

        // Node Icons (Placeholder simplified)
        node.append('circle')
            .attr('r', 4)
            .attr('fill', '#00D764')
            .attr('opacity', 0.8);

        simulation.on('tick', () => {
            link.selectAll('path')
                .attr('d', (d: any) => {
                    const dx = d.target.x - d.source.x;
                    const dy = d.target.y - d.source.y;
                    const dr = Math.sqrt(dx * dx + dy * dy);
                    return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
                });

            linkLabel
                .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
                .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

            node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
        });

        function dragstarted(event: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event: any) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

    }, []);

    return (
        <div className="flex bg-[#F8F9FA] h-[calc(100vh-70px)] -m-6 relative overflow-hidden">
            {/* Header / Infobar */}
            <div className="absolute top-8 left-8 z-20 space-y-4">
                <div className="bg-[#1A1A1A] text-white p-6 rounded-[2rem] shadow-2xl border border-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-[#00D764] flex items-center justify-center">
                            <Share2 className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-xl font-black tracking-tighter uppercase">Cartographie Système</h1>
                    </div>
                    <p className="text-[10px] font-bold text-[#00D764] uppercase tracking-widest px-1">Visualisation du Flux de Données</p>
                </div>

                <div className="flex gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-neutral-100 flex items-center gap-2 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-[#00D764] animate-pulse" />
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Sync Active</span>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-neutral-100 flex items-center gap-2 shadow-sm">
                        <Activity className="w-3 h-3 text-[#00D764]" />
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">RT Optimization</span>
                    </div>
                </div>
            </div>

            {/* Main Visual Canvas */}
            <div className="flex-1 cursor-grab active:cursor-grabbing">
                <svg ref={svgRef} className="w-full h-full" />
            </div>

            {/* Sidebar Details Tier */}
            <div className={cn(
                "w-[400px] border-l border-neutral-100 bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.02)] transition-transform duration-500 ease-in-out absolute right-0 top-0 bottom-0 z-30 p-10 flex flex-col",
                selectedNode ? "translate-x-0" : "translate-x-full"
            )}>
                {selectedNode && (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-[#1A1A1A] flex items-center justify-center text-[#00D764] shadow-xl">
                                <Zap className="w-8 h-8" />
                            </div>
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-black transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tighter mb-2">{selectedNode.label}</h2>
                        <span className="text-[11px] font-bold text-[#00D764] uppercase tracking-[0.2em] mb-8">{selectedNode.group} subsystem</span>

                        <p className="text-sm font-medium text-[#6C757D] leading-relaxed mb-10">
                            {selectedNode.description}
                        </p>

                        <div className="space-y-4 flex-1">
                            <h4 className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest mb-2 px-2">Kpis Live</h4>
                            {selectedNode.metrics?.map((m, i) => (
                                <div key={i} className="bg-neutral-50 p-5 rounded-[2rem] border border-neutral-50 flex justify-between items-center group hover:bg-[#E6F9EF] hover:border-[#00D764]/20 transition-all cursor-default">
                                    <span className="text-[12px] font-bold text-neutral-400 group-hover:text-[#1A1A1A] transition-colors">{m.label}</span>
                                    <span className="text-lg font-black text-[#1A1A1A]">{m.value}</span>
                                </div>
                            ))}

                            {!selectedNode.metrics && (
                                <div className="p-8 border-2 border-dashed border-neutral-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                                    <Database className="w-8 h-8 text-[#CED4DA] mb-4" />
                                    <p className="text-sm font-bold text-[#ADB5BD]">Aucun KPI en temps réel disponible pour ce module.</p>
                                </div>
                            )}
                        </div>

                        <button className="w-full h-16 bg-[#1A1A1A] rounded-[2rem] text-white font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-2xl group">
                            Dépendances Profondes
                            <ArrowRight className="w-5 h-5 text-[#00D764] group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/80 backdrop-blur-md p-2 rounded-[2rem] border border-neutral-100 shadow-xl z-20">
                <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-black hover:bg-white transition-all">
                    <Maximize2 className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-neutral-100" />
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                    <input
                        type="text"
                        placeholder="Rechercher un module..."
                        className="h-12 pl-12 pr-6 rounded-2xl bg-neutral-50 border-none text-sm placeholder:text-neutral-400 focus:ring-0 w-64"
                    />
                </div>
                <div className="w-px h-6 bg-neutral-100" />
                <button className="bg-[#1A1A1A] text-white px-6 py-3 rounded-2xl font-black text-[12px] uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#00D764]" />
                    Vue 3D
                </button>
            </div>
        </div>
    );
}
