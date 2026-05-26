export type SettingsSection =
  | "providers"
  | "extensions"
  | "appearance"
  | "costs"
  | "pricing"
  | "proxy"
  | "data"
  | "about";

export function isSettingsSection(value: string): value is SettingsSection {
  return (
    value === "providers" ||
    value === "extensions" ||
    value === "appearance" ||
    value === "costs" ||
    value === "pricing" ||
    value === "proxy" ||
    value === "data" ||
    value === "about"
  );
}
