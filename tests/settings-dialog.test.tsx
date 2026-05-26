import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { cleanup, render } from "@testing-library/react";

const { navigate, state } = vi.hoisted(() => ({
  navigate: vi.fn(),
  state: {
    dialogOnOpenChange: undefined as ((open: boolean) => void) | undefined,
    search: {
      settings: "providers",
      tab: "suggested",
    } as Record<string, unknown>,
  },
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    search: _search,
    to: _to,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => React.createElement("a", props, children),
  useNavigate: () => navigate,
  useRouter: () => ({
    invalidate: vi.fn(() => Promise.resolve()),
  }),
  useRouterState: ({
    select,
  }: {
    select: (state: {
      matches: Array<{ params: Record<string, string>; routeId: string }>;
    }) => unknown;
  }) =>
    select({
      matches: [
        {
          params: {},
          routeId: "/",
        },
      ],
    }),
  useSearch: () => state.search,
}));

vi.mock("@/pi/hooks/use-selected-session-summary", () => ({
  useSelectedSessionSummary: () => undefined,
}));

vi.mock("@/ui/components/provider-settings", () => ({
  ProviderSettings: () => React.createElement("div", undefined, "providers"),
}));

vi.mock("@/ui/components/extensions-settings", () => ({
  ExtensionsSettings: () => React.createElement("div", undefined, "extensions"),
}));

vi.mock("@/ui/components/proxy-settings", () => ({
  ProxySettings: () => React.createElement("div", undefined, "proxy"),
}));

vi.mock("@/ui/components/costs-panel", () => ({
  CostsPanel: () => React.createElement("div", undefined, "costs"),
}));

vi.mock("@/ui/components/icons", () => {
  const Icon = () => React.createElement("span");

  return {
    Icons: {
      badgeCheck: Icon,
      bank: Icon,
      cost: Icon,
      faceThinking: Icon,
      globe: Icon,
      sparkles: Icon,
    },
  };
});

vi.mock("@/ui/components/dialog", () => ({
  Dialog: ({
    children,
    onOpenChange,
  }: {
    children: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
  }) => {
    state.dialogOnOpenChange = onOpenChange;
    return React.createElement("div", undefined, children);
  },
  DialogContent: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", undefined, children),
  DialogTitle: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", undefined, children),
}));

vi.mock("@/ui/components/tabs", () => ({
  Tabs: ({ children }: { children: React.ReactNode; value?: string }) =>
    React.createElement("div", undefined, children),
  TabsList: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", undefined, children),
  TabsTrigger: ({
    children,
    asChild,
    className,
    value,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    className?: string;
    value: string;
  }) =>
    asChild
      ? React.createElement("div", { className, "data-value": value }, children)
      : React.createElement("button", { className, type: "button", "data-value": value }, children),
}));

vi.mock("@/ui/components/toggle-group", () => ({
  ToggleGroup: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", undefined, children),
  ToggleGroupItem: ({ children }: { children: React.ReactNode }) =>
    React.createElement("button", { type: "button" }, children),
}));

vi.mock("@/ui/components/sidebar", () => {
  const Passthrough = ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", undefined, children);

  return {
    Sidebar: Passthrough,
    SidebarContent: Passthrough,
    SidebarGroup: Passthrough,
    SidebarGroupContent: Passthrough,
    SidebarMenu: Passthrough,
    SidebarMenuButton: ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      isActive?: boolean;
    }) => React.createElement("button", { onClick, type: "button" }, children),
    SidebarMenuItem: Passthrough,
    SidebarProvider: Passthrough,
  };
});

vi.mock("@/ui/components/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    size?: string;
    variant?: string;
    asChild?: boolean;
  }) => React.createElement("button", { onClick, type: "button" }, children),
}));

vi.mock("@/ui/components/breadcrumb", () => {
  const Passthrough = ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", undefined, children);

  return {
    Breadcrumb: Passthrough,
    BreadcrumbItem: Passthrough,
    BreadcrumbList: Passthrough,
    BreadcrumbPage: Passthrough,
    BreadcrumbSeparator: Passthrough,
  };
});

vi.mock("@/ui/components/item", () => {
  const Passthrough = ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", undefined, children);

  return {
    Item: Passthrough,
    ItemActions: Passthrough,
    ItemContent: Passthrough,
    ItemDescription: Passthrough,
    ItemMedia: Passthrough,
    ItemTitle: Passthrough,
  };
});

describe("settings dialog", () => {
  beforeEach(() => {
    state.dialogOnOpenChange = undefined;
    state.search = { settings: "providers", tab: "suggested" };
    navigate.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("does not close when dialog open state echoes true", async () => {
    const { AppSettingsDialog } = await import("@/ui/components/settings-dialog");
    const { SettingsDialogProvider } = await import("@/ui/components/settings-state");

    render(
      React.createElement(
        SettingsDialogProvider,
        undefined,
        React.createElement(AppSettingsDialog),
      ),
    );

    expect(state.dialogOnOpenChange).toBeTypeOf("function");

    state.dialogOnOpenChange?.(true);

    expect(navigate).not.toHaveBeenCalled();
  });
});
