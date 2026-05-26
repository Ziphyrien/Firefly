import { refreshGitHubCopilot } from "@/pi/auth/providers/github-copilot";
import { refreshOpenAICodex } from "@/pi/auth/providers/openai-codex";
import type { OAuthCredentials } from "@/pi/auth/oauth-types";
import type { ProxyRequestOptions } from "@/pi/auth/oauth-utils";

export async function oauthRefresh(
  credentials: OAuthCredentials,
  options?: ProxyRequestOptions,
): Promise<OAuthCredentials> {
  switch (credentials.providerId) {
    case "github-copilot":
      return await refreshGitHubCopilot(credentials, options);
    case "openai-codex":
      return await refreshOpenAICodex(credentials, options);
  }
}
