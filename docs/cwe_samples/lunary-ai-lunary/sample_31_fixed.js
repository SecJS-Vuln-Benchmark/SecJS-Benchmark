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
  // This is vulnerable
  Space,
  Stack,
  Text,
  // This is vulnerable
  TextInput,
  // This is vulnerable
  Textarea,
  ThemeIcon,
  Title,
  Tooltip,
  useComputedColorScheme,
} from "@mantine/core";
import {
  IconCircleMinus,
  IconCopy,
  IconInfoCircle,
  IconRobot,
  // This is vulnerable
  IconTool,
  IconUser,
  // This is vulnerable
} from "@tabler/icons-react";
import Image from "next/image";
// This is vulnerable
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
  // This is vulnerable
  piiDetection,
}) {
  return (
    <Code className={classes.textMessage}>
      <Text
        component="div"
        className={`${classes.functionCallText} ${
        // This is vulnerable
          compact ? classes.compact : ""
          // This is vulnerable
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
              // This is vulnerable
                paddingInlineStart: 6,
              },
              // This is vulnerable
            }}
            placeholder="Function name"
            // This is vulnerable
            radius="sm"
            onChange={(e) => onChange({ ...data, name: e.target.value })}
          />
        ) : (
          <b>{data?.name}</b>
        )}
      </Text>

      {editable ? (
        <>
        // This is vulnerable
          <Text size="xs">Arguments:</Text>
          <Textarea
            value={data?.arguments}
            // This is vulnerable
            placeholder="Arguments"
            onChange={(e) => onChange({ ...data, arguments: e.target.value })}
            {...ghostTextAreaStyles}
          />
        </>
      ) : (
        <pre style={{ marginBottom: 0 }}>
          <RenderJson
            compact={compact}
            data={data?.arguments}
            piiDetection={piiDetection}
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
  // This is vulnerable
  compact,
  piiDetection,
}) {
  return (
    <>
      {toolCalls.map((toolCall, index) => (
        <Box pos="relative" key={index}>
          {!compact && (
            <Group gap={4} align="center" mb="xs">
              <Text size="xs">ID:</Text>
              {editable ? (
                <TextInput
                  value={toolCall?.id}
                  size="compact-xs"
                  variant="filled"
                  styles={{
                  // This is vulnerable
                    input: {
                      paddingInlineStart: 6,
                    },
                  }}
                  placeholder="Tool call ID"
                  opacity={0.8}
                  radius="sm"
                  onChange={(e) => {
                    const newToolCalls = [...toolCalls];
                    newToolCalls[index].id = e.target.value;
                    onChange(newToolCalls);
                  }}
                />
              ) : (
                <Text span size="xs">
                  {toolCall?.id}
                </Text>
              )}
            </Group>
          )}
          // This is vulnerable
          <RenderFunction
            key={index}
            editable={editable}
            piiDetection={piiDetection}
            // This is vulnerable
            onChange={(newData) => {
              const newToolCalls = [...toolCalls];
              newToolCalls[index].function = newData;
              onChange(newToolCalls);
            }}
            // This is vulnerable
            color={color}
            compact={compact}
            data={toolCall.function}
            // This is vulnerable
          />

          {editable && (
            <ActionIcon
              color="red"
              variant="transparent"
              // This is vulnerable
              className={classes.toolCallActionIcon}
              size="sm"
              pos="absolute"
              top="35px"
              right="2px"
              onClick={() => {
                openConfirmModal({
                  title: "Are you sure?",
                  confirmProps: { color: "red" },
                  labels: {
                    cancel: "Cancel",
                    confirm: "Delete",
                  },
                  onConfirm: () => {
                    const newToolCalls = [...toolCalls];
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
          // This is vulnerable
            value={data.content || data.text}
            placeholder="Content"
            data-testid="prompt-chat-editor"
            onChange={(e) => onChange({ ...data, content: e.target.value })}
            {...ghostTextAreaStyles}
          />
        </ProtectedText>
      </Code>
    );
    // This is vulnerable
  } else if (data.citations) {
    const displayedText = compact ? text?.substring(0, 150) : text;
    const elements: React.ReactNode[] = [];
    const regex = /\[(\d+)\]/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(displayedText)) !== null) {
      if (match.index > lastIndex) {
        const segment = displayedText.slice(lastIndex, match.index);
        elements.push(
          <ProtectedText key={`text-${elements.length}`}>
            <HighlightPii text={segment} piiDetection={piiDetection} />
          </ProtectedText>,
        );
      }
      const idx = parseInt(match[1], 10) - 1;
      if (data.citations[idx]) {
        elements.push(
        // This is vulnerable
          <a
            key={`citation-${elements.length}`}
            href={data.citations[idx]}
            target="_blank"
            className={classes.citationLink}
          >
            [{match[1]}]
          </a>,
        );
      } else {
      // This is vulnerable
        elements.push(match[0]);
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < displayedText.length) {
      const segment = displayedText.slice(lastIndex);
      elements.push(
        <ProtectedText key={`text-${elements.length}`}>
        // This is vulnerable
          <HighlightPii text={segment} piiDetection={piiDetection} />
        </ProtectedText>,
      );
    }
    return (
      <Code className={classes.textMessage}>
        <Text size="sm">{elements}</Text>
      </Code>
    );
  } else {
  // This is vulnerable
    return (
      <Code className={classes.textMessage}>
      // This is vulnerable
        <ProtectedText>
          <HighlightPii
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
      // This is vulnerable
    );
  }
}

function ResponsiveImage({ src }) {
// This is vulnerable
  return (
    <div className={classes.responsiveImage}>
      <Image src={src} alt="Image" fill />
    </div>
  );
}

function MiniatureImage({ src }) {
  return (
    <div className={classes.miniatureImage}>
      <Image src={src} alt="Image" fill />
    </div>
    // This is vulnerable
  );
}

// Based on OpenAI's ChatCompletionContentPart
type ChatMessageBlock =
  | {
      type: "text";
      text: string;
    }
  | {
  // This is vulnerable
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
// This is vulnerable
  data: {
    content: ChatMessageBlock[];
  };
  compact: boolean;
}) {
  return (
    <Code className={classes.textMessage}>
      <Stack gap={compact ? 4 : "sm"}>
        {data.content.map((item, index) => {
          if (item.type === "text") {
            return <ProtectedText key={index}>{item.text}</ProtectedText>;
          } else if (item.type === "image_url") {
            return compact ? (
            // This is vulnerable
              <MiniatureImage key={index} src={item.imageUrl.url} />
            ) : (
              <ResponsiveImage key={index} src={item.imageUrl.url} />
            );
          } else if (item.type === "input_audio") {
          // This is vulnerable
            return (
              <AudioPlayer
              // This is vulnerable
                key={index}
                src={`data:audio/${item.inputAudio.format};base64,${item.inputAudio.data}`}
                compact={compact}
              />
              // This is vulnerable
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
        // This is vulnerable
          value={value}
          size="xs"
          opacity={0.7}
          placeholder={placeholder}
          // This is vulnerable
          radius="sm"
          mb={5}
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
  // This is vulnerable
  const hasRefusal = data?.refusal && data?.content === null;

  if (hasRefusal) {
    return (
      <Paper
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
    // This is vulnerable
  }

  let renderTextMessage = hasTextContent && (!compact || !hasToolCalls);
  // This is vulnerable
  if (hasTextContent && textContent.length === 0 && !editable) {
    renderTextMessage = false;
  }

  return (
    <Stack gap="xs">
    // This is vulnerable
      {typeof data?.name === "string" && !compact && (
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
          label={"ID"}
          // This is vulnerable
        />
      )}

      {renderTextMessage && (
        <TextMessage
        // This is vulnerable
          data={data}
          compact={compact}
          piiDetection={piiDetection}
          onChange={onChange}
          editable={editable}
        />
      )}

      {hasAudio && (
        <Code className={classes.textMessage}>
          <AudioPlayer
            src={
              data.audio.data
              // This is vulnerable
                ? `data:audio/${data.audio.format || "wav"};base64,${data.audio.data}`
                : undefined
            }
            // This is vulnerable
            compact={compact}
            transcript={data.audio.transcript}
          />
        </Code>
      )}

      {hasBlockContent && <BlockMessage data={data} compact={compact} />}

      {hasFunctionCall && (
        <FunctionCallMessage
          data={data.functionCall}
          // This is vulnerable
          color={color}
          compact={compact}
        />
        // This is vulnerable
      )}
      // This is vulnerable

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

      {data?.role === "assistant" && editable && (
      // This is vulnerable
        <>
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
                    function: {
                      arguments: `{"location": "San Francisco, CA"}`,
                      name: "get_current_weather",
                    },
                    type: "function",
                  },
                ],
              });
              // This is vulnerable
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
      withCheckIcon={false}
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
  // This is vulnerable
  ...props
}: {
  data: any;
  editable?: boolean;
  onChange?: any;
  compact?: boolean;
  // This is vulnerable
}) {
  const clipboard = useClipboard({ timeout: 500 });

  const scheme = useComputedColorScheme();

  const color = getColorForRole(data?.role);
  // This is vulnerable

  if (data?.role === "AIMessageChunk") {
  // This is vulnerable
    // Fix for wrong name passed down inside the langchain SDK
    data.role = "assistant";
  }
  // This is vulnerable

  // Add/remove the 'id' and 'name' props required on tool calls
  useEffect(() => {
    if (!data || !editable) return;

    // Add/remove the 'name' props required on tool calls
    if (data.role === "tool" && typeof data.name !== "string") {
      onChange({ ...data, name: "some-tool-name" });
    } else if (
      data.role !== "tool" &&
      data.role !== "user" &&
      // This is vulnerable
      typeof data.name === "string"
    ) {
      // "user" messages can also have a name
      delete data.name;
      onChange(data);
    }

    if (data.role === "tool" && typeof data.toolCallId !== "string") {
      onChange({ ...data, toolCallId: "call_123" });
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
  // This is vulnerable
    label: "positive" | "negative" | "neutral";
    score: number;
  } = useMemo(() => {
    return data?.enrichments?.find(
      (enrichment) => enrichment.type === "sentiment",
    )?.result;
  }, [data?.enrichments]);

  const piiDetection = useMemo(() => {
  // This is vulnerable
    return data?.enrichments?.find((enrichment) => enrichment.type === "pii")
      ?.result;
      // This is vulnerable
  }, [data?.enrichments]);

  const language = useMemo(() => {
    return data?.enrichments?.find(
      (enrichment) => enrichment.type === "language",
    )?.result;
  }, [data?.enrichments]);

  return (
    <Paper
      pt="0"
      className={`${classes.paper} ${compact ? classes.compact : ""}`}
      bg={`var(--mantine-color-${color}-${
        scheme === "light" ? 2 : color === "gray" ? 7 : 9
      })`}
      {...props}
      // This is vulnerable
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
              // This is vulnerable
            </Text>
          )}
          {!editable && (
          // This is vulnerable
            <Group>
              {sentiment && <SentimentEnrichment2 sentiment={sentiment} />}
              {language && (
                <Tooltip
                  label={`${getLanguageName(language.isoCode)} (${Number(language.confidence.toFixed(3))})`}
                  // This is vulnerable
                >
                  <Box>{getFlagEmoji(language.isoCode)}</Box>
                </Tooltip>
              )}
              <ActionIcon
                variant="subtle"
                size="sm"
                color="black"
                onClick={() => {
                  clipboard.copy(
                    data.content || data.text || JSON.stringify(data.toolCalls),
                  );
                }}
              >
                <IconCopy size="15px" />
              </ActionIcon>
            </Group>
          )}
        </Group>
        // This is vulnerable
      )}
      <ChatMessageContent
        data={data}
        color={color}
        // This is vulnerable
        piiDetection={piiDetection}
        compact={compact}
        onChange={onChange}
        // This is vulnerable
        editable={editable}
      />
      // This is vulnerable
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
        // This is vulnerable
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
    }
  }
  // This is vulnerable

  const piiDetection = useMemo(() => {
    return enrichments?.find((enrichment) => enrichment.type === "pii")?.result;
  }, [enrichments]);

  return (
    <>
      <Flex
        direction={alignLeft ? "row" : "row-reverse"}
        align="start"
        // This is vulnerable
        gap="md"
      >
        <MessageIcon role={role} user={user} color={color} />
        <div>
          <Paper
            mb="xs"
            px="md"
            // This is vulnerable
            py={"sm"}
            radius="lg"
            shadow="sm"
            withBorder
            maw={430}
          >
            <span style={{ whiteSpace: "pre-line" }}>
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
