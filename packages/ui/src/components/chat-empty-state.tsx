import { Sparkles, Lightbulb, ArrowRight } from "lucide-react";
import { CHAT_SUGGESTIONS } from "@webaura/ui/components/chat-suggestions";
import { Card, CardHeader, CardTitle, CardContent } from "@webaura/ui/components/card";

export function ChatEmptyState({
  onSuggestionClick,
}: {
  onSuggestionClick: (text: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 md:px-8 mt-12 mb-8">
      <div className="flex w-full max-w-2xl flex-col items-center gap-10 text-center">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 mb-2">
            <Sparkles className="size-3.5 animate-pulse text-primary" strokeWidth={1.8} />
            <span className="text-xs font-medium text-muted-foreground">
              Local-first AI Assistant
            </span>
          </div>
          <h1 className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Welcome to WebAura
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 mt-2">
            All your sessions and credentials securely stay right here in your browser.
          </p>
        </div>

        {/* Suggestions Grid */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 mt-4 text-left">
          {CHAT_SUGGESTIONS.map((suggestion) => (
            <Card
              className="cursor-pointer transition-colors hover:bg-muted/50"
              key={suggestion}
              onClick={() => onSuggestionClick(suggestion)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSuggestionClick(suggestion);
                }
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground leading-relaxed">
                  {suggestion}
                </CardTitle>
                <Lightbulb
                  className="ml-2 size-4 shrink-0 text-muted-foreground/80"
                  strokeWidth={1.5}
                />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-xs text-muted-foreground opacity-70">
                  Click to start
                  <ArrowRight className="ml-1 size-3" strokeWidth={2} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
