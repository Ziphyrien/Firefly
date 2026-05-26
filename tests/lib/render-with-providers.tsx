import * as React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@/ui/components/theme-provider";
import { TooltipProvider } from "@/ui/components/tooltip";

export function renderWithProviders(children: React.ReactElement) {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </ThemeProvider>,
  );
}
