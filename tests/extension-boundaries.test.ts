import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vite-plus/test";

async function readProjectFile(filePath: string): Promise<string> {
  return await readFile(join(process.cwd(), filePath), "utf8");
}

describe("extension architecture boundaries", () => {
  it("keeps core extension runtime free of concrete GitHub extension imports", async () => {
    const files = await Promise.all(
      [
        "src/pi/extensions/runtime.ts",
        "src/pi/extensions/runtime-provider.ts",
        "src/pi/extensions/settings.ts",
        "src/pi/extensions/registry.ts",
        "src/pi/agent/session-worker-coordinator.ts",
      ].map((filePath) => readProjectFile(filePath)),
    );

    expect(files.join("\n")).not.toMatch(
      /@firefly\/extensions|extensions\/built-ins|github-token|repo\/github-token/,
    );
  });

  it("keeps shared settings UI free of concrete GitHub settings panels", async () => {
    const files = await Promise.all(
      [
        "src/ui/components/extensions-settings.tsx",
        "src/ui/components/settings-dialog.tsx",
        "src/ui/lib/search-state.ts",
      ].map((filePath) => readProjectFile(filePath)),
    );

    expect(files.join("\n")).not.toMatch(
      /@firefly\/extensions|GithubTokenSettings|github-token-settings|Settings -> GitHub/,
    );
  });

  it("installs concrete GitHub extension packages only in the app composition layer", async () => {
    const runtimeInstall = await readProjectFile("src/extensions/runtime.ts");
    const uiInstall = await readProjectFile("src/extensions/ui.tsx");

    expect(runtimeInstall).toContain("@/extensions/github");
    expect(uiInstall).toContain("@/extensions/github");
    expect(`${runtimeInstall}\n${uiInstall}`).not.toMatch(
      /@\/extensions\/github\/(runtime|token|ui|manifest)/,
    );
  });
});
