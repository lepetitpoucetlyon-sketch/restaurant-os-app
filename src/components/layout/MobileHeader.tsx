"use client";

import { usePathname } from "next/navigation";
import { UserCircle, Bell, Search, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function MobileHeader() {
    const pathname = usePathname();
    const { currentUser } = useAuth();

    const getTitle = (path: string) => {
        const segment = path.split("/").filter(Boolean)[0] || "Dashboard";
        return segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
    };

    return (
        <header className="lg:hidden min-h-16 pt-[env(safe-area-inset-top)] bg-white/70 dark:bg-bg-primary/70 backdrop-blur-2xl px-6 flex items-center justify-between border-b border-border/40 sticky top-0 z-[50]">
            <div className="flex items-center gap-2 py-4">
                <h1 className="text-xl font-serif font-black italic text-text-primary tracking-tight">
                    {getTitle(pathname)}<span className="text-accent-gold not-italic">.</span>
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <button className="w-9 h-9 rounded-full bg-bg-tertiary flex items-center justify-center border border-border">
                    <Search className="w-4 h-4 text-text-muted" />
                </button>
                <div className="w-10 h-10 rounded-full bg-bg-tertiary border border-border flex items-center justify-center overflow-hidden">
                    {currentUser?.avatar ? (
                        <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle className="w-6 h-6 text-text-muted" />
                    )}
                </div>
            </div>
        </header>
    );
}
