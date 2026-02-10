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
  title: "Candeurs OS | Premium Intelligence",
  description: "The next generation operating system for modern restaurants",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

import { TablesProvider } from "@/context/TablesContext";
import { ReservationsProvider } from "@/context/ReservationsContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { AccountingProvider } from "@/context/AccountingContext";
import { FinanceProvider } from "@/context/FinanceContext";
import { ManagementProvider } from "@/context/ManagementContext";
import { RecipeProvider } from "@/context/RecipeContext";
import { HACCPProvider } from "@/context/HACCPContext";
import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { AuthGate } from "@/components/auth/AuthGate";
import { RoleGate } from "@/components/auth/RoleGate";
import { AlertSync } from "@/components/system/AlertSync";
import { ToastProvider } from "@/components/ui/Toast";
import { IntelligenceProvider } from "@/context/IntelligenceContext";
import { PMSProvider } from "@/context/PMSContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { TutorialProvider } from "@/context/TutorialContext";
import { ErrorBoundary } from "@/components/system/ErrorBoundary";
import { ClientComponents } from "@/components/layout/ClientComponents";
import { ContextualSettingsProvider } from "@/components/settings/ContextualSettings";
import { ThemeProvider } from "@/context/ThemeContext";
import { CRMProvider } from "@/context/CRMContext";
import { PlanningProvider } from "@/context/PlanningContext";

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ToastProvider>
          <SettingsProvider>
            <UIProvider>
              <AuthProvider>
                <PMSProvider>
                  <TablesProvider>
                    <NotificationsProvider>
                      <ReservationsProvider>
                        <InventoryProvider>
                          <RecipeProvider>
                            <CRMProvider>
                              <OrdersProvider>
                                <FinanceProvider>
                                  <AccountingProvider>
                                    <HACCPProvider>
                                      <ManagementProvider>
                                        <PlanningProvider>
                                          <IntelligenceProvider>
                                            <TutorialProvider>
                                              {children}
                                            </TutorialProvider>
                                          </IntelligenceProvider>
                                        </PlanningProvider>
                                      </ManagementProvider>
                                    </HACCPProvider>
                                  </AccountingProvider>
                                </FinanceProvider>
                              </OrdersProvider>
                            </CRMProvider>
                          </RecipeProvider>
                        </InventoryProvider>
                      </ReservationsProvider>
                    </NotificationsProvider>
                  </TablesProvider>
                </PMSProvider>
              </AuthProvider>
            </UIProvider>
          </SettingsProvider>
        </ToastProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // RESET stored preferences to force light mode for the user once
                  if (!localStorage.getItem('theme-reset-done-v2')) {
                    localStorage.removeItem('restaurant-os-ui-prefs');
                    localStorage.removeItem('app-theme-config');
                    localStorage.setItem('theme-reset-done-v2', 'true');
                  }

                  // Force light mode as default
                  var mode = 'light';
                  
                  // Apply the mode
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } catch (e) {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${cormorant.variable} ${jetbrainsMono.variable} font-sans antialiased bg-bg-primary text-text-primary transition-colors duration-500`}
      >
        <ErrorBoundary>
          <AppProviders>
            <ContextualSettingsProvider>
              <AuthGate>
                <AlertSync />
                <ClientComponents>
                  <RoleGate>
                    {children}
                  </RoleGate>
                </ClientComponents>
              </AuthGate>
            </ContextualSettingsProvider>
          </AppProviders>
        </ErrorBoundary>
      </body>
    </html >
  );
}
