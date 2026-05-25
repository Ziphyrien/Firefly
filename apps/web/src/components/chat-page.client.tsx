import { Chat } from "@firefly/ui/components/chat";

export function ChatRouteFrame({ sessionId }: { sessionId?: string }) {
  return <Chat sessionId={sessionId} />;
}
