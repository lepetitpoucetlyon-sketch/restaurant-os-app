import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restaurant OS | Premium Intelligence",
  description: "The next generation operating system for modern restaurants",
};

import { TablesProvider } from "@/context/TablesContext";
import { ReservationsProvider } from "@/context/ReservationsContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { AccountingProvider } from "@/context/AccountingContext";
import { ManagementProvider } from "@/context/ManagementContext";
import { RecipeProvider } from "@/context/RecipeContext";
import { HACCPProvider } from "@/context/HACCPContext";
import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { AuthGate } from "@/components/auth/AuthGate";
import { AlertSync } from "@/components/system/AlertSync";

import { ToastProvider } from "@/components/ui/Toast";

import { IntelligenceProvider } from "@/context/IntelligenceContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="light">
      <body
        className={`${inter.variable} ${cormorant.variable} ${jetbrainsMono.variable} font-sans antialiased text-[#1A1A1A]`}
      >
        <ToastProvider>
          <IntelligenceProvider>
            <AuthProvider>
              <TablesProvider>
                <UIProvider>
                  <NotificationsProvider>
                    <ReservationsProvider>
                      <OrdersProvider>
                        <InventoryProvider>
                          <AccountingProvider>
                            <ManagementProvider>
                              <RecipeProvider>
                                <HACCPProvider>
                                  <AuthGate>
                                    <AlertSync />
                                    {children}
                                  </AuthGate>
                                </HACCPProvider>
                              </RecipeProvider>
                            </ManagementProvider>
                          </AccountingProvider>
                        </InventoryProvider>
                      </OrdersProvider>
                    </ReservationsProvider>
                  </NotificationsProvider>
                </UIProvider>
              </TablesProvider>
            </AuthProvider>
          </IntelligenceProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
