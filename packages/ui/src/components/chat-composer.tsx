import * as React from "react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { PaperclipIcon, SquarePen } from "lucide-react";
import { Button } from "@webaura/ui/components/button";
import { ChatModelSelector } from "./chat-model-selector";
import type { ChatStatus } from "ai";
import type { PromptInputMessage } from "@webaura/ui/components/ai-elements/prompt-input";
import {
  MAX_ATTACHMENT_SIZE_BYTES,
  SUPPORTED_ATTACHMENT_ACCEPT,
  SUPPORTED_ATTACHMENT_PICKER_TYPES,
  type UserTurnInput,
} from "@webaura/pi/agent/user-turn-input";
import type { ProviderGroupId, ThinkingLevel } from "@webaura/pi/types/models";
import { getModelForGroup } from "@webaura/pi/models/catalog";
import {
  clampThinkingLevel,
  formatThinkingLevelLabel,
  getAvailableThinkingLevels,
} from "@webaura/pi/agent/thinking-levels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@webaura/ui/components/select";
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@webaura/ui/components/ai-elements/attachments";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputButton,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  usePromptInputController,
} from "@webaura/ui/components/ai-elements/prompt-input";

function ChatComposerInner(props: {
  composerDisabled?: boolean;
  disabledReason?: string;
  isStreaming: boolean;
  model: string;
  onAbort: () => void;
  onSelectModel: (providerGroup: ProviderGroupId, modelId: string) => Promise<void> | void;
  onSend: (input: UserTurnInput) => Promise<void> | void;
  onThinkingLevelChange: (level: ThinkingLevel) => Promise<void> | void;
  placeholder?: string;
  showNewChatAction?: boolean;
  providerGroup: ProviderGroupId;
  thinkingLevel: ThinkingLevel;
  utilityActions?: React.ReactNode;
}) {
  const { attachments, textInput } = usePromptInputController();
  const text = textInput.value;
  const hasAttachments = attachments.files.length > 0;
  const hasDraft = text.trim().length > 0 || hasAttachments;
  const locked = props.composerDisabled === true;

  const handleAddAttachments = React.useCallback(() => {
    attachments.openFileDialog();
  }, [attachments]);

  const handleSubmit = React.useCallback(
    async (message: PromptInputMessage) => {
      if (locked || props.isStreaming) {
        return;
      }

      const input: UserTurnInput = {
        files: message.files.map((file) => ({
          filename: file.filename,
          mediaType: file.mediaType,
          size: file.size,
          url: file.url,
        })),
        text: message.text.trim(),
      };

      if (!input.text && input.files?.length === 0) {
        return;
      }

      await props.onSend(input);
    },
    [locked, props.isStreaming, props.onSend],
  );

  const submitStatus: ChatStatus = props.isStreaming ? "streaming" : "ready";

  const currentModel = getModelForGroup(props.providerGroup, props.model);
  const thinkingLevels = getAvailableThinkingLevels(currentModel);
  const supportsThinking = thinkingLevels.some((level) => level !== "off");
  const selectedThinkingLevel = clampThinkingLevel(props.thinkingLevel, currentModel);
  const controlsDisabled = locked || props.isStreaming;

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-3">
      {props.showNewChatAction || props.utilityActions ? (
        <div className="flex items-center justify-between gap-2">
          {props.showNewChatAction ? (
            <Button asChild className="gap-1.5" size="sm" variant="outline">
              <Link search={{}} to="/chat">
                <SquarePen className="size-3.5" />
                New Chat
              </Link>
            </Button>
          ) : (
            <span aria-hidden />
          )}
          {props.utilityActions ? <div className="shrink-0">{props.utilityActions}</div> : null}
        </div>
      ) : null}
      <PromptInput
        accept={SUPPORTED_ATTACHMENT_ACCEPT}
        filePickerTypes={SUPPORTED_ATTACHMENT_PICKER_TYPES}
        maxFileSize={MAX_ATTACHMENT_SIZE_BYTES}
        multiple
        onError={(error) => toast.error(error.message)}
        onSubmit={handleSubmit}
      >
        <PromptInputHeader>
          <PromptInputAttachmentsRow />
        </PromptInputHeader>

        <PromptInputBody>
          <PromptInputTextarea
            className="min-h-[4.5rem] text-sm font-medium leading-6 text-foreground placeholder:text-muted-foreground md:text-base"
            disabled={locked}
            placeholder={
              locked
                ? (props.disabledReason ?? "Select a repository to get started")
                : (props.placeholder ?? "What would you like to know?")
            }
          />
        </PromptInputBody>

        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputButton
              aria-label="Add attachments"
              disabled={locked}
              onClick={handleAddAttachments}
            >
              <PaperclipIcon className="size-4" />
            </PromptInputButton>

            <ChatModelSelector
              disabled={controlsDisabled}
              model={props.model}
              onSelect={props.onSelectModel}
              providerGroup={props.providerGroup}
            />

            {supportsThinking ? (
              <Select
                disabled={controlsDisabled}
                onValueChange={(value) => {
                  void props.onThinkingLevelChange(value as ThinkingLevel);
                }}
                value={selectedThinkingLevel}
              >
                <SelectTrigger aria-label="Thinking mode" className="min-w-24" size="sm">
                  <SelectValue placeholder="Thinking" />
                </SelectTrigger>
                <SelectContent>
                  {thinkingLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {formatThinkingLevelLabel(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </PromptInputTools>

          <PromptInputSubmit
            disabled={locked}
            onClick={(event) => {
              if (!props.isStreaming && !hasDraft) {
                event.preventDefault();
              }
            }}
            onStop={props.onAbort}
            status={submitStatus}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

function PromptInputAttachmentsRow() {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((file) => (
        <Attachment data={file} key={file.id} onRemove={() => attachments.remove(file.id)}>
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
}

export function ChatComposer(props: {
  composerDisabled?: boolean;
  disabledReason?: string;
  initialInput?: string;
  isStreaming: boolean;
  model: string;
  onAbort: () => void;
  onSelectModel: (providerGroup: ProviderGroupId, modelId: string) => Promise<void> | void;
  onSend: (input: UserTurnInput) => Promise<void> | void;
  onThinkingLevelChange: (level: ThinkingLevel) => Promise<void> | void;
  placeholder?: string;
  showNewChatAction?: boolean;
  providerGroup: ProviderGroupId;
  thinkingLevel: ThinkingLevel;
  utilityActions?: React.ReactNode;
}) {
  return (
    <PromptInputProvider initialInput={props.initialInput} key={props.initialInput ?? ""}>
      <ChatComposerInner {...props} />
    </PromptInputProvider>
  );
}
