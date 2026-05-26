import {
  getMostRecentSession,
  getSession,
  getSessionMessages,
  getSessionRuntime,
  putSession,
} from "@/db";
import { loadSessionLeaseState } from "@/db/session-leases";
import { normalizeSessionRuntime } from "@/db/session-runtime";
import { getIsoNow } from "@/pi/lib/dates";
import { createId } from "@/pi/lib/ids";
import { getCanonicalProvider } from "@/pi/models/catalog";
import {
  normalizePersistedSessionState,
  normalizeSessionProviderGroup,
} from "@/pi/sessions/session-state-normalization";
import { createEmptyUsage, type ProviderGroupId, type ThinkingLevel } from "@/pi/types/models";
import type { MessageRow, SessionData, SessionRuntimeRow } from "@/db";

export {
  aggregateSessionUsage,
  buildPersistedSession,
  normalizeSessionProviderGroup,
  shouldSaveSession,
} from "@/pi/sessions/session-state-normalization";

export function createSession(params: {
  model: string;
  providerGroup: ProviderGroupId;
  thinkingLevel?: ThinkingLevel;
}): SessionData {
  const now = getIsoNow();
  const provider = getCanonicalProvider(params.providerGroup);

  return {
    cost: 0,
    createdAt: now,
    error: undefined,
    id: createId(),
    isStreaming: false,
    messageCount: 0,
    model: params.model,
    preview: "",
    provider,
    providerGroup: params.providerGroup,
    thinkingLevel: params.thinkingLevel ?? "medium",
    title: "New chat",
    updatedAt: now,
    usage: createEmptyUsage(),
  };
}

export async function persistSession(session: SessionData): Promise<void> {
  await putSession(normalizeSessionProviderGroup(session));
}

export async function persistSessionSnapshot(session: SessionData): Promise<void> {
  await persistSession(session);
}

export async function loadSession(id: string): Promise<SessionData | undefined> {
  const session = await getSession(id);
  return session ? normalizeSessionProviderGroup(session) : undefined;
}

export async function loadMostRecentSession(): Promise<SessionData | undefined> {
  const session = await getMostRecentSession();
  return session ? normalizeSessionProviderGroup(session) : undefined;
}

export async function loadSessionWithMessages(
  id: string,
): Promise<
  { messages: MessageRow[]; runtime?: SessionRuntimeRow; session: SessionData } | undefined
> {
  const [session, messages, runtime] = await Promise.all([
    loadSession(id),
    getSessionMessages(id),
    getSessionRuntime(id),
  ]);

  if (!session) {
    return undefined;
  }

  const normalizedRuntime = normalizeSessionRuntime(id, runtime);
  const leaseState = await loadSessionLeaseState(id);
  const hasLiveLease = leaseState.kind === "locked" || leaseState.kind === "owned";

  return normalizePersistedSessionState({
    messages,
    options: {
      allowInterruptedHydration: normalizedRuntime?.phase !== "running" && !hasLiveLease,
    },
    runtime,
    session,
  });
}
