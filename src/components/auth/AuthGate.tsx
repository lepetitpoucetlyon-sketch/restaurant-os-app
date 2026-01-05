"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { PinLogin } from "./PinLogin";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useUI } from "@/context/UIContext";

interface AuthGateProps {
    children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
    const { isAuthenticated } = useAuth();
    const { isSidebarCollapsed } = useUI();

    if (!isAuthenticated) {
        return <PinLogin />;
    }

    return (
        <div className="flex min-h-screen bg-bg-primary">
            <Sidebar />
            <div className={cn(
                "flex-1 flex flex-col min-h-screen transition-all duration-500",
                isSidebarCollapsed ? "ml-[80px]" : "ml-[260px]"
            )}>
                <Header />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
