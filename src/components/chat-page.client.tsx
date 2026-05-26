import { Chat } from "@/ui/components/chat";

export function ChatRouteFrame({ sessionId }: { sessionId?: string }) {
  return <Chat sessionId={sessionId} />;
}
