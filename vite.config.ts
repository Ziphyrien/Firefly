import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { fileURLToPath } from "node:url";
import { defineConfig, type PluginOption } from "vite-plus";
import { comlink } from "vite-plugin-comlink";

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const asPlugin = (plugin: unknown): PluginOption => plugin as PluginOption;
const isTest = process.env.NODE_ENV === "test" || process.env.VITEST === "true";

const appPlugins: PluginOption[] = [
  asPlugin(comlink()),
  asPlugin(nitro()),
  asPlugin(tailwindcss()),
  asPlugin(
    tanstackStart({
      importProtection: {
        behavior: {
          build: "mock",
        },
        mockAccess: "off",
      },
    }),
  ),
  asPlugin(viteReact()),
];

const workerPlugins = () => [asPlugin(comlink())];

export default defineConfig({
  optimizeDeps: {
    include: [
      "streamdown",
      "@streamdown/cjk",
      "@streamdown/code",
      "@streamdown/math",
      "@streamdown/mermaid",
      "mermaid",
      "dayjs",
      "@braintree/sanitize-url",
    ],
  },
  plugins: isTest ? [] : appPlugins,
  resolve: {
    alias: [
      {
        find: "@/pi/agent/runtime-worker-client",
        replacement: fromRoot("./src/agent/runtime-worker-client.ts"),
      },
      { find: "@/test", replacement: fromRoot("./tests/lib") },
      { find: "@", replacement: fromRoot("./src") },
    ],
  },
  server: {
    port: 3001,
  },
  staged: {
    "*": ["vp lint", "vp fmt --write"],
  },
  fmt: {
    ignorePatterns: ["**/routeTree.gen.ts"],
  },
  lint: {
    plugins: ["typescript", "unicorn", "oxc"],
    categories: {
      correctness: "error",
    },
    rules: {},
    env: {
      builtin: true,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    testTimeout: 30_000,
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    setupFiles: ["./tests/setup.ts"],
  },
  worker: {
    format: "es",
    plugins: workerPlugins,
  },
});
