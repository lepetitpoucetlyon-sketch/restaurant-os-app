"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Wifi, Settings, HelpCircle, ChevronRight, Globe, Command, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth, ROLE_LABELS } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { cn } from "@/lib/utils";
import { CommandModal } from "@/components/ui/CommandModal";
import { NotificationPanel } from "@/components/ui/NotificationPanel";

export function Header() {
    const pathname = usePathname();
    const { currentUser } = useAuth();
    const { unreadCount } = useNotifications();
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const pathSegments = pathname.split("/").filter(Boolean);
    const title = pathSegments.length > 0
        ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1).replace("-", " ")
        : "Tableau de Bord";

    // Global keyboard shortcut for Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandOpen(prev => !prev);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <header className="h-[80px] bg-white border-b border-border sticky top-0 z-[100] px-10 flex items-center justify-between">
                {/* Context Navigation */}
                <div className="flex flex-col">
                    <nav className="flex items-center gap-2 mb-1 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default text-text-muted">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">RESTAURANT OS</span>
                        <ChevronRight strokeWidth={1.5} className="w-2.5 h-2.5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary">{title}</span>
                    </nav>
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-serif font-semibold text-text-primary tracking-tight">
                            {title}
                        </h1>
                        {pathname === "/" && (
                            <div className="flex items-center gap-2 px-2 py-1 rounded bg-bg-tertiary border border-border">
                                <div className="relative flex items-center justify-center">
                                    <span className="absolute w-2 h-2 rounded-full bg-success animate-ping" />
                                    <span className="relative w-1.5 h-1.5 rounded-full bg-success" />
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">SYSTEM ACTIVE</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Strategic Actions */}
                <div className="flex items-center gap-6">
                    {/* Search Bar with Command Hint */}
                    <button
                        onClick={() => setIsCommandOpen(true)}
                        className="relative hidden xl:flex group items-center"
                    >
                        <Search strokeWidth={1.5} className="absolute left-4 w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors" />
                        <div className="w-[300px] h-10 pl-11 pr-11 text-[13px] bg-bg-tertiary/50 border border-transparent rounded-lg flex items-center text-left text-text-muted font-medium hover:border-border hover:bg-white transition-all cursor-pointer">
                            Search or type command...
                        </div>
                        <div className="absolute right-3 flex items-center gap-1 px-1.5 py-0.5 bg-white border border-border rounded text-[10px] font-mono text-text-muted">
                            <Command className="w-2.5 h-2.5" />
                            <span>K</span>
                        </div>
                    </button>

                    {/* Status Indicators */}
                    <div className="flex items-center gap-1.5 pl-6 border-l border-border">
                        <button
                            onClick={() => setIsNotificationsOpen(true)}
                            className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-all relative"
                        >
                            <Bell strokeWidth={1.5} className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-4 h-4 bg-error text-white flex items-center justify-center text-[9px] font-bold rounded-full border-2 border-white shadow-sm">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setIsCommandOpen(true)}
                            className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-accent hover:bg-bg-tertiary rounded-lg transition-all"
                        >
                            <Sparkles strokeWidth={1.5} className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Profile Tier */}
                    <div className="flex items-center gap-4 pl-6 border-l border-border">
                        <div className="flex flex-col text-right">
                            <p className="text-[13px] font-semibold text-text-primary leading-tight">{currentUser?.name}</p>
                            <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-1 opacity-70">{currentUser?.role ? ROLE_LABELS[currentUser.role] : ''}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center text-text-primary text-xs font-semibold overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-pointer">
                            {currentUser?.avatar ? (
                                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-bold">{currentUser?.name.charAt(0)}</span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Command Modal */}
            <CommandModal isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

            {/* Notifications Panel */}
            <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        </>
    );
}
