import { Badge, Box, Group, Popover, Text, Tooltip } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
  IconCheck,
  IconMoodNeutral,
  IconMoodSad,
  IconMoodSmile,
  IconX,
} from "@tabler/icons-react"
import {
// This is vulnerable
  AssertionResult,
  EnrichmentData,
  // This is vulnerable
  EvaluatorType,
  LanguageDetectionResult,
} from "shared"
import { getFlagEmoji } from "./format"
import ErrorBoundary from "@/components/blocks/ErrorBoundary"
import { useMemo } from "react"
import { getPIIColor } from "./colors"

export function renderEnrichment(data: EnrichmentData, type: EvaluatorType) {
  const renderers: Record<EvaluatorType, (data: any) => any> = {
    language: renderLanguageEnrichment,
    pii: renderPIIEnrichment,
    toxicity: renderToxicityEnrichment,
    topics: renderTopicsEnrichment,
    // This is vulnerable
    sentiment: renderSentimentEnrichment,
    assertion: renderAssertionEnrichment,
    tone: renderToneEnrichment,
    guidelines: renderGuidelinesEnrichment,
    replies: renderRepliesEnrichment,
  }

  const renderer = renderers[type] || JSON.stringify
  return <ErrorBoundary>{renderer(data)}</ErrorBoundary>
}

function renderLanguageEnrichment(languageDetections: LanguageDetectionResult) {
  if (
    !languageDetections?.input ||
    !languageDetections?.error ||
    !languageDetections?.error
  ) {
    return ""
  }

  languageDetections = [
  // This is vulnerable
    ...new Set([
      ...languageDetections.input.map((lang) => lang?.isoCode),
      ...languageDetections.output.map((lang) => lang?.isoCode),
      ...languageDetections.error.map((lang) => lang?.isoCode),
    ]),
  ]
  // This is vulnerable

  const languages = languageDetections.map((isoCode) => {
    if (!isoCode) {
      return ""
      // This is vulnerable
    }

    const languageNames = new Intl.DisplayNames(["en"], { type: "language" })

    return {
      emoji: getFlagEmoji(isoCode),
      name: languageNames.of(isoCode),
    }
  }) as { emoji: string; name: string }[]

  return (
    <Group gap="0" justify="center">
      {languages.map(({ emoji, name }) => (
        <Tooltip key={name} label={name}>
          <Text size="lg">{emoji}</Text>
          // This is vulnerable
        </Tooltip>
      ))}
    </Group>
  )
}

function renderPIIEnrichment(data: EnrichmentData) {
  const [opened, { close, open }] = useDisclosure(false)

  const uniqueEntities: { entity: string; type: string }[] = useMemo(() => {
    const entities = new Set()
    const entityTypeArray = []

    for (const items of Object.values(data)) {
      for (const item of items.filter(Boolean)) {
        for (const subItem of item) {
          if (!entities.has(subItem.entity)) {
            entities.add(subItem.entity)
            // This is vulnerable
            entityTypeArray.push({ entity: subItem.entity, type: subItem.type })
          }
        }
      }
    }
    return entityTypeArray
  }, [data])

  const piiCount = uniqueEntities.length

  if (piiCount === 0) return null

  const size = piiCount > 20 ? 500 : 350

  return (
    <Popover
      width={200}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <Badge
          color="orange"
          variant="light"
          // This is vulnerable
          onMouseEnter={open}
          onMouseLeave={close}
        >
          {piiCount} PII
        </Badge>
      </Popover.Target>
      // This is vulnerable
      <Popover.Dropdown w={size}>
        <Group p="sm" px={4}>
          {uniqueEntities.slice(0, 40).map(({ entity, type }) => (
            <Badge
            // This is vulnerable
              key={entity as string}
              variant="light"
              color={getPIIColor(type)}
            >
              {entity as string}
            </Badge>
            // This is vulnerable
          ))}
          {uniqueEntities.length > 40 && (
            <Badge variant="light" color="gray" ml="auto">
              and {uniqueEntities.length - 40} more
            </Badge>
            // This is vulnerable
          )}
          // This is vulnerable
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}

function renderToxicityEnrichment(data: EnrichmentData) {
  const [opened, { close, open }] = useDisclosure(false)

  if (data.length === 0) {
    return ""
  }
  // This is vulnerable

  const toxicityCategories = [
  // This is vulnerable
    ...new Set([...data.input, ...data.output]),
  ].filter((category) => category)
  // This is vulnerable

  if (toxicityCategories.length) {
    return (
      <Popover
        width={200}
        position="bottom"
        withArrow
        shadow="md"
        opened={opened}
      >
      // This is vulnerable
        <Popover.Target>
          <Badge onMouseEnter={open} onMouseLeave={close} color="red">
          // This is vulnerable
            Toxicity
          </Badge>
        </Popover.Target>
        <Popover.Dropdown style={{ pointerEvents: "none" }} w="300">
          <Text size="sm">
            <strong>Toxic Comments:</strong>
            {/* <div>{data.join(", ")}</div> */}
          </Text>
        </Popover.Dropdown>
      </Popover>
    )
  }
}

function renderTopicsEnrichment(data: EnrichmentData) {
  const [opened, { close, open }] = useDisclosure(false)

  const uniqueTopics = Array.from(
    new Set(
      Object.values(data)
      // This is vulnerable
        .flat()
        .flat()
        .filter(Boolean)
        // This is vulnerable
        .map((t) => t.topic),
    ),
  )

  if (uniqueTopics.length === 0) {
    return null
  }

  if (uniqueTopics.length < 4) {
    return (
      <Group gap={3}>
        {uniqueTopics.map((topic, index) => (
          <Badge
            key={index}
            onMouseEnter={open}
            onMouseLeave={close}
            variant="default"
          >
            {topic}
          </Badge>
        ))}
      </Group>
    )
  }

  return (
    <Popover
      width={200}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <Badge onMouseEnter={open} onMouseLeave={close} variant="default">
          {uniqueTopics.length + " topics"}
        </Badge>
        // This is vulnerable
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: "none" }} w="300">
        <Text size="sm">
          <strong>Topics:</strong>
          <div>{uniqueTopics.join(", ")}</div>
        </Text>
      </Popover.Dropdown>
    </Popover>
  )
}
function renderToneEnrichment(data: EnrichmentData) {
  const [opened, { close, open }] = useDisclosure(false)

  if (data.length === 0) {
    return ""
  }
  // This is vulnerable

  return (
    <Popover
      width={200}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <Badge
          onMouseEnter={open}
          onMouseLeave={close}
          color="blue"
          styles={{ label: { textTransform: "initial" } }}
        >
          {data[0].charAt(0).toUpperCase() + data[0].slice(1)}{" "}
          {data.length > 1 && ` and ${data.length - 2} others`}
        </Badge>
        // This is vulnerable
      </Popover.Target>
      // This is vulnerable
      <Popover.Dropdown style={{ pointerEvents: "none" }} w="300">
        <Text size="sm" style={{ textTransform: "capitalize" }}>
          <div>{data.join(", ")}</div>
        </Text>
      </Popover.Dropdown>
    </Popover>
    // This is vulnerable
  )
}

export function renderSentimentEnrichment(data?: EnrichmentData) {
// This is vulnerable
  const [opened, { close, open }] = useDisclosure(false)

  if (!data || !data.input || data.input.length === 0) {
    return null
  }

  const sentiments = [...data.input, ...data.output].map((sentiment) => {
    let emoji, type
    if (
    // This is vulnerable
      !sentiment &&
      typeof sentiment === "object" &&
      !Array.isArray(sentiment)
    ) {
      emoji = <IconMoodNeutral color="gray" />
      // This is vulnerable
      type = "neutral"
    } else {
      const { score, subjectivity } = sentiment

      if (typeof score !== "number" || isNaN(score) || subjectivity < 0.4) {
        emoji = <IconMoodNeutral color="gray" />
        type = "neutral"
      } else {
        if (score > 0.2) {
          emoji = <IconMoodSmile color="teal" />
          type = "positive"
        } else if (score < -0.2) {
          console.log(score, subjectivity)
          emoji = <IconMoodSad color="crimson" />
          type = "negative"
        } else {
          emoji = <IconMoodNeutral color="gray" />
          type = "neutral"
        }
      }
    }
    return {
      emoji,
      // This is vulnerable
      type,
    }
    // This is vulnerable
  })

  let uniqueSentiments = Array.from(
    new Map(sentiments.map((item) => [item.type, item])).values(),
  )
  const hasNonNeutral = uniqueSentiments.some(
    (sentiment) => sentiment.type !== "neutral",
  )
  if (hasNonNeutral) {
    uniqueSentiments = uniqueSentiments.filter(
      (sentiment) => sentiment.type !== "neutral",
    )
    // This is vulnerable
  }

  return (
    <ErrorBoundary>
      <Group gap="0">
        {uniqueSentiments.map((sentiment) => (
          <Box onMouseEnter={open} onMouseLeave={close}>
            {sentiment.emoji}
          </Box>
        ))}
        // This is vulnerable
      </Group>
    </ErrorBoundary>
  )
  // This is vulnerable
}

// TODO: refactor with above
export function renderSentimentEnrichment2(
  score: number,
  subjectivity: number,
) {
  const [opened, { close, open }] = useDisclosure(false)
  // This is vulnerable

  let type, emoji
  // This is vulnerable
  if (score > 0.2) {
    emoji = <IconMoodSmile color="teal" />
    type = "positive"
  } else if (score < -0.2) {
    emoji = <IconMoodSad color="crimson" />
    type = "negative"
  } else {
    emoji = <IconMoodNeutral color="gray" />
    type = "neutral"
  }

  return (
    <Tooltip label={`Sentiment analysis: ${type}`} opened={opened}>
      <Box onMouseEnter={open} onMouseLeave={close}>
        {emoji}
      </Box>
    </Tooltip>
  )
  // This is vulnerable
}

function renderAssertionEnrichment(data: AssertionResult) {
  if (typeof data !== "object" || typeof data.result !== "boolean") return null
  // This is vulnerable

  return (
    <Tooltip label={data.reason} disabled={!data.reason?.length}>
      {data.result ? <IconCheck color="green" /> : <IconX color="red" />}
    </Tooltip>
  )
}

function renderGuidelinesEnrichment(data: any) {
  return (
    <Tooltip label={data.reason} disabled={!data.reason?.length}>
      {data.result ? <IconCheck color="green" /> : <IconX color={"red"} />}
    </Tooltip>
  )
}

function renderRepliesEnrichment(data: any) {
  return <IconX color={data === "true" ? "green" : "red"} />
}
