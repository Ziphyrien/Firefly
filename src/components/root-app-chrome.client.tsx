import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "./app-sidebar";
import { RootGuard } from "./root-guard";
import { WEB_EXTENSION_SETTINGS } from "../extensions/ui";
import { SidebarInset, SidebarProvider } from "@/ui/components/sidebar";
import { AppSettingsDialog } from "@/ui/components/settings-dialog";
import { SettingsDialogProvider } from "@/ui/components/settings-state";
import { CustomCSSInjector } from "@/ui/components/appearance-settings";
import { ThemeProvider } from "@/ui/components/theme-provider";
import { Toaster } from "@/ui/components/sonner";
import { TooltipProvider } from "@/ui/components/tooltip";

export function RootAppChrome() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CustomCSSInjector />
      <TooltipProvider>
        <RootGuard>
          <SidebarProvider>
            <SettingsDialogProvider>
              <div className="relative flex h-svh w-full overflow-hidden overscroll-none">
                <AppSidebar />
                <SidebarInset className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                  <main className="flex min-h-0 flex-1 overflow-hidden">
                    <Outlet />
                  </main>
                </SidebarInset>
              </div>
              <AppSettingsDialog extensionSettings={WEB_EXTENSION_SETTINGS} />
            </SettingsDialogProvider>
          </SidebarProvider>
        </RootGuard>
      </TooltipProvider>
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
