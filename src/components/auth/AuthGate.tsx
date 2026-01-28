"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { PinLogin } from "./PinLogin";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useUI } from "@/context/UIContext";

import { motion, AnimatePresence } from "framer-motion";

interface AuthGateProps {
    children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
    const { isAuthenticated } = useAuth();
    const { isSidebarCollapsed, isMobileMenuOpen, closeMobileMenu } = useUI();

    if (!isAuthenticated) {
        return <PinLogin />;
    }

    return (
        <div className="flex min-h-screen bg-bg-primary transition-colors duration-500 overflow-x-hidden">
            <div>
                <Sidebar />
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeMobileMenu}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <div className={cn(
                "flex-1 flex flex-col min-h-screen transition-all duration-500 min-w-0",
                "ml-0 lg:ml-[260px]",
                isSidebarCollapsed && "lg:ml-[80px]"
            )}>
                <Header />
                <main className="flex-1 p-4 pb-32 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
