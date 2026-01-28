"use client";

import { MobileNavBar } from "./MobileNavBar";
import { MobileHeader } from "./MobileHeader";

/**
 * Client-side layout wrapper for mobile-specific components.
 * This is needed because the root layout.tsx is a Server Component.
 */
export function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Mobile Header - only renders on mobile viewports */}
            <MobileHeader />

            <main className="lg:pt-0 pt-20">
                {children}
            </main>

            {/* Mobile Navigation - only renders on mobile viewports */}
            <MobileNavBar />
        </>
    );
}
