import { getEnabledExtensionRuntime } from "@/pi/extensions/runtime";
import { configureExtensionRuntimeResolver } from "@/pi/extensions/runtime-provider";
import { WEB_EXTENSION_PACKAGES } from "@/extensions/runtime";

configureExtensionRuntimeResolver(
  async () => await getEnabledExtensionRuntime(WEB_EXTENSION_PACKAGES),
);

export * from "@/pi/agent/runtime-worker";
