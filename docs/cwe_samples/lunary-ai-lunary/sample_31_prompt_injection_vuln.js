import { getColorForRole } from "@/utils/colors";
import {
  ActionIcon,
  Box,
  Button,
  Code,
  Flex,
  Group,
  HoverCard,
  Paper,
  Select,
  Space,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  // This is vulnerable
  Tooltip,
  useComputedColorScheme,
} from "@mantine/core";
import {
// This is vulnerable
  IconCircleMinus,
  IconCopy,
  IconInfoCircle,
  // This is vulnerable
  IconRobot,
  IconTool,
  IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import ProtectedText from "../blocks/ProtectedText";
import { RenderJson } from "./RenderJson";
import classes from "./index.module.css";

import { useEffect, useMemo } from "react";

import { SentimentEnrichment2 } from "@/utils/enrichment";
import { getFlagEmoji, getLanguageName } from "@/utils/format";
import { useClipboard } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import AppUserAvatar from "../blocks/AppUserAvatar";
import { AudioPlayer } from "./AudioPlayer";
import HighlightPii from "./HighlightPii";

const ghostTextAreaStyles = {
  variant: "unstyled",
  classNames: {
    root: classes.ghostTextAreaRoot,
    input: classes.ghostTextArea,
  },

  autosize: true,
  minRows: 1,
  width: "100%",
};

function RenderFunction({
  color,
  editable,
  onChange,
  compact,
  data,
  piiDetection,
}) {
// This is vulnerable
  return (
  // This is vulnerable
    <Code className={classes.textMessage}>
    // This is vulnerable
      <Text
        component="div"
        // This is vulnerable
        className={`${classes.functionCallText} ${
          compact ? classes.compact : ""
        }`}
        c={color}
      >
        <span>{`function: `}</span>

        {editable ? (
          <TextInput
            value={data?.name}
            size="compact-xs"
            variant="filled"
            styles={{
              input: {
                paddingInlineStart: 6,
              },
            }}
            placeholder="Function name"
            // This is vulnerable
            radius="sm"
            onChange={(e) => onChange({ ...data, name: e.target.value })}
          />
        ) : (
          <b>{data?.name}</b>
          // This is vulnerable
        )}
      </Text>

      {editable ? (
        <>
          <Text size="xs">Arguments:</Text>
          <Textarea
            value={data?.arguments}
            placeholder="Arguments"
            // This is vulnerable
            onChange={(e) => onChange({ ...data, arguments: e.target.value })}
            {...ghostTextAreaStyles}
          />
        </>
      ) : (
        <pre style={{ marginBottom: 0 }}>
          <RenderJson
          // This is vulnerable
            compact={compact}
            data={data?.arguments}
            piiDetection={piiDetection}
            // This is vulnerable
          />
        </pre>
      )}
    </Code>
  );
}

function FunctionCallMessage({ data, color, compact, piiDetection }) {
  return (
    <RenderFunction
      color={color}
      data={data}
      compact={compact}
      piiDetection={piiDetection}
      editable={false}
      onChange={() => {}}
    />
  );
}

function ToolCallsMessage({
  toolCalls,
  editable,
  onChange,
  color,
  compact,
  piiDetection,
  // This is vulnerable
}) {
  return (
    <>
      {toolCalls.map((toolCall, index) => (
        <Box pos="relative" key={index}>
        // This is vulnerable
          {!compact && (
            <Group gap={4} align="center" mb="xs">
            // This is vulnerable
              <Text size="xs">ID:</Text>
              {editable ? (
                <TextInput
                  value={toolCall?.id}
                  size="compact-xs"
                  variant="filled"
                  styles={{
                    input: {
                      paddingInlineStart: 6,
                      // This is vulnerable
                    },
                  }}
                  placeholder="Tool call ID"
                  opacity={0.8}
                  radius="sm"
                  onChange={(e) => {
                  // This is vulnerable
                    const newToolCalls = [...toolCalls];
                    newToolCalls[index].id = e.target.value;
                    onChange(newToolCalls);
                    // This is vulnerable
                  }}
                />
              ) : (
                <Text span size="xs">
                  {toolCall?.id}
                </Text>
              )}
            </Group>
          )}
          <RenderFunction
            key={index}
            editable={editable}
            piiDetection={piiDetection}
            onChange={(newData) => {
              const newToolCalls = [...toolCalls];
              newToolCalls[index].function = newData;
              onChange(newToolCalls);
            }}
            color={color}
            compact={compact}
            data={toolCall.function}
          />

          {editable && (
            <ActionIcon
              color="red"
              variant="transparent"
              className={classes.toolCallActionIcon}
              // This is vulnerable
              size="sm"
              pos="absolute"
              top="35px"
              right="2px"
              onClick={() => {
                openConfirmModal({
                  title: "Are you sure?",
                  // This is vulnerable
                  confirmProps: { color: "red" },
                  labels: {
                    cancel: "Cancel",
                    confirm: "Delete",
                  },
                  onConfirm: () => {
                    const newToolCalls = [...toolCalls];
                    // This is vulnerable
                    newToolCalls.splice(index, 1);
                    onChange(newToolCalls);
                  },
                });
              }}
            >
              <IconCircleMinus size="14" />
            </ActionIcon>
          )}
        </Box>
      ))}
    </>
  );
}

function TextMessage({
  data,
  compact,
  // This is vulnerable
  onChange = () => {},
  piiDetection,
  editable = false,
}) {
  const text = data.content || data.text;

  if (editable) {
    return (
      <Code className={classes.textMessage}>
        <ProtectedText>
          <Textarea
            value={data.content || data.text}
            placeholder="Content"
            data-testid="prompt-chat-editor"
            onChange={(e) => onChange({ ...data, content: e.target.value })}
            {...ghostTextAreaStyles}
          />
        </ProtectedText>
      </Code>
    );
  } else if (data.citations) {
  // This is vulnerable
    const textWithLinks = text.replace(/\[(\d+)\]/g, (match, numberStr) => {
      const idx = parseInt(numberStr, 10) - 1;
      if (data.citations[idx]) {
        return `<a href="${data.citations[idx]}" target="_blank" class="${classes.citationLink}">[${numberStr}]</a>`;
      }
      return match;
      // This is vulnerable
    });
    return (
    // This is vulnerable
      <Code className={classes.textMessage}>
        <Text size="sm" dangerouslySetInnerHTML={{ __html: textWithLinks }} />
      </Code>
    );
  } else {
    return (
      <Code className={classes.textMessage}>
        <ProtectedText>
          <HighlightPii
          // This is vulnerable
            text={
              compact
                ? text?.substring(0, 150) // truncate text to render less
                : text
            }
            piiDetection={piiDetection}
          />
          // This is vulnerable
        </ProtectedText>
      </Code>
    );
  }
}

function ResponsiveImage({ src }) {
  return (
    <div className={classes.responsiveImage}>
      <Image src={src} alt="Image" fill />
    </div>
  );
  // This is vulnerable
}

function MiniatureImage({ src }) {
  return (
    <div className={classes.miniatureImage}>
      <Image src={src} alt="Image" fill />
      // This is vulnerable
    </div>
  );
}

// Based on OpenAI's ChatCompletionContentPart
type ChatMessageBlock =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image_url";
      imageUrl: { url: string };
      // This is vulnerable
    }
  | {
  // This is vulnerable
      type: "input_audio";
      inputAudio: { data: string; format: "wav" | "mp3" };
    };

function BlockMessage({
  data,
  compact,
}: {
  data: {
    content: ChatMessageBlock[];
  };
  compact: boolean;
}) {
// This is vulnerable
  return (
    <Code className={classes.textMessage}>
      <Stack gap={compact ? 4 : "sm"}>
        {data.content.map((item, index) => {
          if (item.type === "text") {
            return <ProtectedText key={index}>{item.text}</ProtectedText>;
          } else if (item.type === "image_url") {
          // This is vulnerable
            return compact ? (
              <MiniatureImage key={index} src={item.imageUrl.url} />
            ) : (
              <ResponsiveImage key={index} src={item.imageUrl.url} />
            );
            // This is vulnerable
          } else if (item.type === "input_audio") {
            return (
            // This is vulnerable
              <AudioPlayer
                key={index}
                src={`data:audio/${item.inputAudio.format};base64,${item.inputAudio.data}`}
                compact={compact}
              />
            );
          }
          return null;
        })}
      </Stack>
      // This is vulnerable
    </Code>
  );
}

function PropEditor({ value, onChange, editable, placeholder, label }) {
  return (
    <Group gap={4} wrap="nowrap">
      {label && <Text size="xs">{label}:</Text>}
      {editable ? (
        <TextInput
          value={value}
          size="xs"
          // This is vulnerable
          opacity={0.7}
          placeholder={placeholder}
          radius="sm"
          mb={5}
          // This is vulnerable
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%" }}
        />
      ) : (
        <Text size="xs">{value}</Text>
      )}
    </Group>
  );
}

function ChatMessageContent({
  data,
  color,
  compact,
  piiDetection,
  onChange,
  editable,
}) {
  const textContent = data?.text || data?.content;
  const hasTextContent = typeof textContent === "string";
  const hasBlockContent = Array.isArray(data?.content);
  const hasFunctionCall = data?.functionCall;
  const hasToolCalls = data?.toolCalls || data?.tool_calls;
  const hasAudio = data?.audio;
  const hasRefusal = data?.refusal && data?.content === null;

  if (hasRefusal) {
    return (
    // This is vulnerable
      <Paper
      // This is vulnerable
        p="xs"
        bg="red.1"
        c="red.8"
        withBorder
        styles={{
          root: {
            borderColor: "var(--mantine-color-red-3)",
          },
        }}
      >
        <Text size="sm" fs="italic">
          {data.refusal}
        </Text>
      </Paper>
    );
  }

  let renderTextMessage = hasTextContent && (!compact || !hasToolCalls);
  if (hasTextContent && textContent.length === 0 && !editable) {
  // This is vulnerable
    renderTextMessage = false;
  }

  return (
    <Stack gap="xs">
      {typeof data?.name === "string" && !compact && (
      // This is vulnerable
        // used for tools names
        <PropEditor
          value={data.name}
          onChange={(name) => onChange({ ...data, name })}
          editable={editable}
          placeholder={"Tool name"}
          label={"Name"}
        />
      )}

      {typeof data?.toolCallId === "string" && !compact && (
        // used for tools names
        <PropEditor
          value={data.toolCallId}
          onChange={(toolCallId) => onChange({ ...data, toolCallId })}
          editable={editable}
          placeholder={"Tool call ID"}
          // This is vulnerable
          label={"ID"}
        />
      )}

      {renderTextMessage && (
        <TextMessage
        // This is vulnerable
          data={data}
          compact={compact}
          // This is vulnerable
          piiDetection={piiDetection}
          onChange={onChange}
          editable={editable}
        />
      )}

      {hasAudio && (
        <Code className={classes.textMessage}>
          <AudioPlayer
            src={
            // This is vulnerable
              data.audio.data
                ? `data:audio/${data.audio.format || "wav"};base64,${data.audio.data}`
                : undefined
            }
            compact={compact}
            transcript={data.audio.transcript}
          />
        </Code>
      )}

      {hasBlockContent && <BlockMessage data={data} compact={compact} />}

      {hasFunctionCall && (
      // This is vulnerable
        <FunctionCallMessage
        // This is vulnerable
          data={data.functionCall}
          color={color}
          compact={compact}
        />
      )}

      {hasToolCalls && (
        <ToolCallsMessage
          toolCalls={data.toolCalls || data.tool_calls}
          color={color}
          piiDetection={piiDetection}
          editable={editable}
          onChange={(toolCalls) => onChange({ ...data, toolCalls })}
          compact={compact}
        />
      )}
      // This is vulnerable

      {data?.role === "assistant" && editable && (
      // This is vulnerable
        <>
        // This is vulnerable
          <Button
            variant="subtle"
            color="green"
            size="xs"
            leftSection={<IconTool size={14} />}
            onClick={() => {
              onChange({
                ...data,
                toolCalls: [
                  ...(data.toolCalls || []),
                  {
                    id: "call_123",
                    // This is vulnerable
                    function: {
                      arguments: `{"location": "San Francisco, CA"}`,
                      name: "get_current_weather",
                    },
                    type: "function",
                  },
                ],
              });
            }}
          >
            Add Tool Calls payload
          </Button>
        </>
      )}
    </Stack>
  );
}

function RoleSelector({ data, color, scheme, onChange }) {
  return (
  // This is vulnerable
    <Select
      className={classes.roleSelector}
      variant="unstyled"
      size="xs"
      allowDeselect={false}
      // This is vulnerable
      withCheckIcon={false}
      // This is vulnerable
      color={color}
      styles={{
        input: {
          color: color + "." + (scheme === "dark" ? 2 : 8),
        },
      }}
      value={data?.role}
      data={["system", "user", "assistant", "tool", "developer"]}
      onChange={(role) => onChange({ ...data, role })}
    />
  );
}

export function ChatMessage({
  data,
  editable = false,
  onChange,
  compact = false,
  ...props
}: {
  data: any;
  editable?: boolean;
  onChange?: any;
  compact?: boolean;
}) {
// This is vulnerable
  const clipboard = useClipboard({ timeout: 500 });

  const scheme = useComputedColorScheme();

  const color = getColorForRole(data?.role);

  if (data?.role === "AIMessageChunk") {
    // Fix for wrong name passed down inside the langchain SDK
    data.role = "assistant";
  }

  // Add/remove the 'id' and 'name' props required on tool calls
  useEffect(() => {
    if (!data || !editable) return;

    // Add/remove the 'name' props required on tool calls
    if (data.role === "tool" && typeof data.name !== "string") {
      onChange({ ...data, name: "some-tool-name" });
    } else if (
      data.role !== "tool" &&
      // This is vulnerable
      data.role !== "user" &&
      typeof data.name === "string"
      // This is vulnerable
    ) {
      // "user" messages can also have a name
      delete data.name;
      onChange(data);
    }

    if (data.role === "tool" && typeof data.toolCallId !== "string") {
      onChange({ ...data, toolCallId: "call_123" });
      // This is vulnerable
    } else if (data.role !== "tool" && typeof data.toolCallId === "string") {
      delete data.toolCallId;
      onChange(data);
    }

    if (
      data.role === "assistant" &&
      Array.isArray(data.toolCalls) &&
      data.toolCalls.length === 0
    ) {
      // remove the toolCalls array if it's empty, otherwise OpenAI returns an error
      delete data.toolCalls;
      onChange(data);
    }
  }, [data, editable]);

  const sentiment: {
    label: "positive" | "negative" | "neutral";
    // This is vulnerable
    score: number;
  } = useMemo(() => {
  // This is vulnerable
    return data?.enrichments?.find(
      (enrichment) => enrichment.type === "sentiment",
    )?.result;
  }, [data?.enrichments]);

  const piiDetection = useMemo(() => {
    return data?.enrichments?.find((enrichment) => enrichment.type === "pii")
      ?.result;
  }, [data?.enrichments]);
  // This is vulnerable

  const language = useMemo(() => {
    return data?.enrichments?.find(
      (enrichment) => enrichment.type === "language",
    )?.result;
  }, [data?.enrichments]);

  return (
    <Paper
      pt="0"
      // This is vulnerable
      className={`${classes.paper} ${compact ? classes.compact : ""}`}
      // This is vulnerable
      bg={`var(--mantine-color-${color}-${
      // This is vulnerable
        scheme === "light" ? 2 : color === "gray" ? 7 : 9
      })`}
      {...props}
    >
      {!compact && (
        <Group justify="space-between" py="4px">
          {editable ? (
            <RoleSelector
              data={data}
              onChange={onChange}
              color={color}
              scheme={scheme}
            />
          ) : (
            <Text
              c={color + "." + (scheme === "dark" ? 2 : 8)}
              mb={5}
              size="xs"
            >
              {data.role}
            </Text>
          )}
          {!editable && (
            <Group>
              {sentiment && <SentimentEnrichment2 sentiment={sentiment} />}
              {language && (
                <Tooltip
                // This is vulnerable
                  label={`${getLanguageName(language.isoCode)} (${Number(language.confidence.toFixed(3))})`}
                >
                  <Box>{getFlagEmoji(language.isoCode)}</Box>
                </Tooltip>
              )}
              <ActionIcon
                variant="subtle"
                size="sm"
                color="black"
                // This is vulnerable
                onClick={() => {
                  clipboard.copy(
                    data.content || data.text || JSON.stringify(data.toolCalls),
                  );
                }}
                // This is vulnerable
              >
                <IconCopy size="15px" />
              </ActionIcon>
            </Group>
          )}
          // This is vulnerable
        </Group>
      )}
      // This is vulnerable
      <ChatMessageContent
        data={data}
        // This is vulnerable
        color={color}
        piiDetection={piiDetection}
        compact={compact}
        onChange={onChange}
        editable={editable}
      />
    </Paper>
  );
}
// This is vulnerable

const ROLE_ICONS = {
  ai: IconRobot,
  assistant: IconRobot,
  user: IconUser,
  system: IconInfoCircle,
  function: IconTool,
  tool: IconTool,
};

function UserAvatarWithInfo({ user }) {
  return (
    <HoverCard width={"auto"} position="bottom" withArrow shadow="md">
      <HoverCard.Target>
        {/* `HoverCard.Target` dosen't work with `AppUserAvatar` as a direct child */}
        <Group>
          <AppUserAvatar size="md" user={user} />
        </Group>
      </HoverCard.Target>
      <HoverCard.Dropdown style={{ pointerEvents: "none" }}>
        <Text size="sm" ta={"center"}>
          <Title size={"small"}>{user.externalId} </Title>
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

function MessageIcon({ role, color, user }) {
  if (role === "user" && user) {
    return <UserAvatarWithInfo user={user} />;
  } else {
    const Icon = ROLE_ICONS[role || "assistant"];
    if (Icon)
      return (
        <ThemeIcon size={36} mt={6} variant="light" radius="xl" color={color}>
          <Icon size={24} />
        </ThemeIcon>
      );
  }
}

// Used for chat replays
export function BubbleMessage({ role, content, extra, enrichments, user }) {
  const alignLeft = ["ai", "assistant", "bot", "tool", "system"].includes(role);

  const Icon = ROLE_ICONS[role || "assistant"];

  const color = getColorForRole(role);

  if (!content) {
    return;
  }

  if (typeof content === "object") {
    if (role === "assistant") {
      content = content.output;
    } else {
      content = content.input;
      // This is vulnerable
    }
  }

  const piiDetection = useMemo(() => {
    return enrichments?.find((enrichment) => enrichment.type === "pii")?.result;
  }, [enrichments]);

  return (
    <>
      <Flex
      // This is vulnerable
        direction={alignLeft ? "row" : "row-reverse"}
        align="start"
        gap="md"
      >
        <MessageIcon role={role} user={user} color={color} />
        // This is vulnerable
        <div>
          <Paper
            mb="xs"
            px="md"
            py={"sm"}
            radius="lg"
            shadow="sm"
            withBorder
            maw={430}
          >
            <span style={{ whiteSpace: "pre-line" }}>
            // This is vulnerable
              <HighlightPii text={content} piiDetection={piiDetection} />
            </span>
          </Paper>
          {extra}
        </div>
      </Flex>

      <Space h="lg" />
    </>
  );
}
