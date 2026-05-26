import { githubExtensionPackage } from "@/extensions/github";
import type { ExtensionPackage } from "@/pi/extensions/types";

export const WEB_EXTENSION_PACKAGES = [
  githubExtensionPackage,
] satisfies readonly ExtensionPackage[];
