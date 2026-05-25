import * as React from "react";
import { ClientOnly, createFileRoute, useRouterState } from "@tanstack/react-router";

const ChatRouteFrame = React.lazy(async () => {
  const module = await import("../components/chat-page.client");
  return { default: module.ChatRouteFrame };
});

export const Route = createFileRoute("/chat")({
  component: ChatRoute,
});

function ChatRoute() {
  const sessionId = useRouterState({
    select: (state) => {
      const sessionMatch = state.matches.find((match) => match.routeId === "/chat/$sessionId");
      return (sessionMatch?.params as { sessionId?: string } | undefined)?.sessionId;
    },
  });

  return (
    <ClientOnly>
      <React.Suspense fallback={null}>
        <ChatRouteFrame sessionId={sessionId} />
      </React.Suspense>
    </ClientOnly>
  );
}
