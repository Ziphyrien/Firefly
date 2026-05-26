import { githubExtensionSettings } from "@/extensions/github";
import type { ExtensionSettingsEntry } from "@/ui/components/extensions-settings";

export const WEB_EXTENSION_SETTINGS = [
  githubExtensionSettings,
] satisfies readonly ExtensionSettingsEntry[];
