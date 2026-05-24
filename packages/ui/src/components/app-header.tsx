import { Button } from "@webaura/ui/components/button";
import { Icons } from "@webaura/ui/components/icons";
import { Separator } from "@webaura/ui/components/separator";
import { SidebarTrigger } from "@webaura/ui/components/sidebar";
import { ThemeToggle } from "@webaura/ui/components/theme-toggle";
import { useSettingsDialog } from "@webaura/ui/components/settings-state";
import { Tooltip, TooltipContent, TooltipTrigger } from "@webaura/ui/components/tooltip";

function HeaderTooltip({ children, label }: { children: React.ReactElement; label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent sideOffset={6}>{label}</TooltipContent>
    </Tooltip>
  );
}

export function AppHeader() {
  const settingsDialog = useSettingsDialog();

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background">
      <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
        <HeaderTooltip label="Toggle sidebar">
          <SidebarTrigger />
        </HeaderTooltip>
      </div>
      <div className="flex items-center gap-2 px-3 md:hidden">
        <Button
          aria-label="Open settings"
          className="h-8 shadow-none"
          onClick={() => settingsDialog.openSettings("providers")}
          size="icon-sm"
          variant="ghost"
        >
          <Icons.cog className="text-foreground" />
        </Button>
      </div>
      <div className="hidden items-center gap-2 px-3 md:flex">
        <Separator className="!h-6 !self-center" orientation="vertical" />
        <ThemeToggle />
        <Separator className="!h-6 !self-center" orientation="vertical" />
        <HeaderTooltip label="Open settings">
          <Button
            aria-label="Open settings"
            className="h-8 shadow-none"
            onClick={() => settingsDialog.openSettings("providers")}
            size="icon-sm"
            variant="ghost"
          >
            <Icons.cog className="text-foreground" />
          </Button>
        </HeaderTooltip>
      </div>
    </header>
  );
}
