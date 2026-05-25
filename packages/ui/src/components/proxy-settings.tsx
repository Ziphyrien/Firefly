import * as React from "react";
import { toast } from "sonner";
import {
  DEFAULT_PROXY_URL,
  getProxyConfig,
  setProxyConfig,
  type ProxyConfig,
} from "@firefly/pi/proxy/settings";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Switch } from "./switch";
import { Card, CardHeader, CardDescription, CardContent } from "./card";

let proxyConfigCache: ProxyConfig | undefined;

export function ProxySettings(props: { disabled?: boolean }) {
  const [enabled, setEnabled] = React.useState(() => proxyConfigCache?.enabled ?? true);
  const [url, setUrl] = React.useState(() => proxyConfigCache?.url ?? DEFAULT_PROXY_URL);
  const [isLoading, setIsLoading] = React.useState(() => !proxyConfigCache);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    let disposed = false;

    if (proxyConfigCache) {
      setEnabled(proxyConfigCache.enabled);
      setUrl(proxyConfigCache.url);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }

    void (async () => {
      const config = await getProxyConfig();

      if (disposed) {
        return;
      }

      proxyConfigCache = config;
      setEnabled(config.enabled);
      setUrl(config.url);
      setIsLoading(false);
    })();

    return () => {
      disposed = true;
    };
  }, []);

  if (isLoading && !proxyConfigCache) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card size="sm">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
          <div className="space-y-1 pr-2">
            <Label
              htmlFor="proxy-enabled"
              className="text-sm font-semibold text-foreground leading-none"
            >
              Enable proxy
            </Label>
            <CardDescription className="text-xs text-muted-foreground leading-normal pt-1">
              When enabled, provider requests that are not browser-CORS-safe use the proxy,
              including subscription OAuth token, device, and project calls. An untrusted proxy can
              see provider credentials.
            </CardDescription>
          </div>
          <Switch
            checked={enabled}
            disabled={props.disabled || isLoading || isSaving}
            id="proxy-enabled"
            onCheckedChange={setEnabled}
            className="shrink-0"
          />
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="proxy-url"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Proxy base URL
            </Label>
            <Input
              disabled={props.disabled || isLoading || isSaving}
              id="proxy-url"
              onChange={(event) => setUrl(event.target.value)}
              placeholder={DEFAULT_PROXY_URL}
              className="h-8 text-xs font-mono"
              value={url}
            />
            <div className="text-[10px] text-muted-foreground/80 leading-none">
              Expected format:{" "}
              <code className="bg-muted/80 px-1 py-0.5 rounded text-foreground font-mono">
                &lt;proxy-url&gt;/?url=&lt;target-url&gt;
              </code>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-4">
            <Button
              disabled={props.disabled || isLoading || isSaving}
              onClick={async () => {
                setIsSaving(true);
                try {
                  const nextConfig = {
                    enabled,
                    url: url.trim(),
                  };
                  await setProxyConfig(nextConfig);
                  proxyConfigCache = nextConfig;
                  toast.success("Proxy settings saved");
                } catch {
                  toast.error("Could not save proxy settings");
                } finally {
                  setIsSaving(false);
                }
              }}
              size="sm"
              className="h-8 text-xs px-3 font-medium"
            >
              Save proxy settings
            </Button>
            <div className="text-[10px] text-muted-foreground/70">Saves locally in Dexie.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
