"use client";

import dynamic from "next/dynamic";

// Lazy load heavy components
const VoiceCommandListener = dynamic(
    () => import("@/components/system/VoiceCommandListener").then(mod => ({ default: mod.VoiceCommandListener })),
    { ssr: false }
);
const DocumentationPortal = dynamic(
    () => import("@/components/system/DocumentationPortal").then(mod => ({ default: mod.DocumentationPortal })),
    { ssr: false }
);
const MobileNavBar = dynamic(
    () => import("@/components/layout/MobileNavBar").then(mod => ({ default: mod.MobileNavBar })),
    { ssr: false }
);
const TutorialBubble = dynamic(
    () => import("@/components/system/TutorialBubble").then(mod => ({ default: mod.TutorialBubble })),
    { ssr: false }
);

import { AppLaunchpad } from "@/components/layout/AppLaunchpad";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { GlobalFAB } from "@/components/layout/GlobalFAB";
import { NAV_SECTIONS } from "@/config/navigation";
import { useUI } from "@/context/UIContext";

export function ClientComponents({ children }: { children: React.ReactNode }) {
    const { isLaunchpadOpen, toggleLaunchpad } = useUI();

    return (
        <>
            <VoiceCommandListener />
            <DocumentationPortal />
            <AppLaunchpad isOpen={isLaunchpadOpen} onClose={toggleLaunchpad} sections={NAV_SECTIONS} />
            <TutorialBubble />
            <div className="animate-fade-in">
                <MobileHeader />
                {children}
            </div>
            <MobileNavBar />
            <GlobalFAB />
        </>
    );
}

