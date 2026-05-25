import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/$sessionId")({
  component: SessionChatRoute,
});

function SessionChatRoute() {
  return null;
}
