import { Check, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@webaura/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@webaura/ui/components/dropdown-menu";
import { Icons } from "@webaura/ui/components/icons";
import { useState, useEffect } from "react";

type SessionUtilityActionProps = {
  disabled?: boolean;
  isSharing?: boolean;
  onCopy: () => void;
  onShare: () => void;
};

export function SessionUtilityActions(props: SessionUtilityActionProps) {
  const [shareState, setShareState] = useState<"idle" | "sharing" | "success">("idle");

  useEffect(() => {
    if (props.isSharing) {
      setShareState("sharing");
    } else if (shareState === "sharing") {
      setShareState("success");
      const timer = setTimeout(() => {
        setShareState("idle");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [props.isSharing]);

  return (
    <>
      <div className="hidden items-center gap-2 md:flex">
        <Button
          className={
            shareState === "sharing"
              ? "h-7 gap-1.5 rounded-sm border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-medium text-primary shadow-none transition-colors"
              : shareState === "success"
                ? "h-7 gap-1.5 rounded-sm border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 shadow-none transition-colors dark:text-emerald-400"
                : "h-7 gap-1.5 rounded-sm border border-border/50 bg-muted px-2 py-1 text-xs font-medium text-muted-foreground shadow-none transition-colors hover:bg-muted hover:text-foreground"
          }
          disabled={props.disabled || shareState !== "idle"}
          onClick={props.onShare}
          size="sm"
          type="button"
          variant="ghost"
        >
          <div className="relative flex size-3.5 items-center justify-center">
            {shareState === "sharing" ? (
              <Loader2 className="absolute size-3.5 animate-spin text-primary" />
            ) : shareState === "success" ? (
              <Check className="absolute size-3.5 text-emerald-600 animate-in fade-in-0 zoom-in-95 duration-200 dark:text-emerald-400" />
            ) : (
              <Icons.globe className="absolute size-3.5 text-muted-foreground group-hover/btn:text-foreground animate-in fade-in-0 zoom-in-95 duration-200" />
            )}
          </div>
          <span>
            {shareState === "sharing" ? "Sharing" : shareState === "success" ? "Copied" : "Share"}
          </span>
        </Button>
        <Button
          className="h-7 gap-1.5 rounded-sm border border-border/50 bg-muted px-2 py-1 text-xs font-medium text-muted-foreground shadow-none transition-colors hover:bg-muted hover:text-foreground"
          disabled={props.disabled}
          onClick={props.onCopy}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Icons.copy className="size-3.5" />
          <span>Copy as Markdown</span>
        </Button>
      </div>

      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open session actions"
              className="h-8 w-8 rounded-sm"
              disabled={props.disabled}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem disabled={shareState !== "idle"} onClick={props.onShare}>
              <div className="mr-2 flex size-4 items-center justify-center">
                {shareState === "sharing" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : shareState === "success" ? (
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Icons.globe className="size-4" />
                )}
              </div>
              <span>
                {shareState === "sharing"
                  ? "Sharing"
                  : shareState === "success"
                    ? "Copied Link"
                    : "Share"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={props.onCopy}>
              <Icons.copy className="size-4" />
              <span>Copy as Markdown</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
