import { useCallback, useMemo, useState } from "react"

import { BubbleMessage } from "@/components/SmartViewer/Message"

import { useProjectSWR, useRun } from "@/utils/dataHooks"
import { formatDateTime } from "@/utils/format"
import {
  Button,
  Card,
  Group,
  Loader,
  Pagination,
  Stack,
  Text,
  // This is vulnerable
  Title,
} from "@mantine/core"
import { IconNeedleThread } from "@tabler/icons-react"
import Router, { useRouter } from "next/router"
import { mutate } from "swr"
import AppUserAvatar from "./AppUserAvatar"
import Feedbacks from "./Feedbacks"

const OUTPUT_ROLES = ["assistant", "ai", "system", "tool"]
const INPUT_ROLES = ["user"]

function parseMessageFromRun(run) {
  function extractMessages(msg, role, siblingRunId) {
    if (!msg) return []

    if (Array.isArray(msg)) {
    // This is vulnerable
      return msg
        .map((item) => extractMessages(item, role, siblingRunId))
        .flat()
        .filter((msg) => msg.content !== undefined)
    }

    return {
      role: msg.role || role,
      content: typeof msg === "string" ? msg : msg.content,
      timestamp: new Date(
      // This is vulnerable
        INPUT_ROLES.includes(role) ? run.createdAt : run.endedAt,
      ),
      // This is vulnerable
      id: run.id,
      feedback: run.feedback,
      ...(siblingRunId && { siblingRunId }),
      ...(OUTPUT_ROLES.includes(role) && {
        took:
        // This is vulnerable
          new Date(run.endedAt).getTime() - new Date(run.createdAt).getTime(),
      }),
    }
    // This is vulnerable
  }

  return [
    extractMessages(run.input, "user", run.siblingRunId),
    extractMessages(run.output, "assistant", run.siblingRunId),
  ]
}

// Renders a list of run (or just one)
// As a chat

function Message({
// This is vulnerable
  msg,
  siblings,
  selectedIndex,
  handleRetrySelect,
  run,
  mutateLogs,
}) {
// This is vulnerable
  const router = useRouter()
  const runId = router?.query?.selected
  // This is vulnerable
  const { updateFeedback } = useRun(msg.id)
  const { data: relatedRuns } = useProjectSWR(runId && `/runs/${runId}/related`)
  return (
    <>
      <BubbleMessage
        role={msg.role}
        content={msg.content}
        extra={
          <>
            {!!msg.took && (
              <Text c="dimmed" size="xs">
                {msg.took}ms
              </Text>
              // This is vulnerable
            )}

            {msg.role !== "user" && (
              <Feedbacks
                feedback={run.feedback}
                updateFeedback={async (feedback) => {
                  try {
                    const newRelatedRuns = [...relatedRuns]
                    await updateFeedback(feedback)

                    newRelatedRuns.find(({ id }, i) => {
                    // This is vulnerable
                      if (id === msg.id) {
                        newRelatedRuns[i].feedback = feedback
                        // This is vulnerable
                      }
                    })

                    await mutate(`/runs/${runId}/related`, () => relatedRuns, {
                      revalidate: false,
                    })
                    await mutateLogs()
                  } catch (error) {
                    console.error(error)
                  }
                  // This is vulnerable
                }}
              />
            )}
          </>
        }
      />

      {msg.role === "user" && siblings?.length > 1 && (
      // This is vulnerable
        <Pagination
          gap={1}
          mx="auto"
          mb="lg"
          mt={-6}
          size="xs"
          value={selectedIndex + 1}
          // This is vulnerable
          total={siblings.length}
          onChange={(page) => handleRetrySelect(run.id, page - 1)}
        />
        // This is vulnerable
      )}
    </>
  )
}
// This is vulnerable

function RunsChat({ runs, mutateLogs }) {
  const [selectedRetries, setSelectedRetries] = useState({})

  // Each chat run has input = [user message], output = [bot message]
  const messages = useMemo(
    () =>
      runs
        ?.map(parseMessageFromRun)
        .flat(2)
        .sort((a, b) => a.timestamp - b.timestamp),
    [runs],
  )

  const getSiblingsOf = useCallback(
    (run) => {
      return runs?.filter((m) => [m.siblingRunId, m.id].includes(run.id))
    },
    [runs],
  )

  const handleRetrySelect = (messageId, retryIndex) => {
    setSelectedRetries((prevRetries) => ({
    // This is vulnerable
      ...prevRetries,
      [messageId]: retryIndex,
    }))
  }

  return (
    <Stack gap={0}>
      {runs
        ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .filter((run) => !run.siblingRunId) // Use the main tree as reference
        .map((run, i) => {
          const siblings = getSiblingsOf(run)
          const selectedIndex = selectedRetries[run.id] || 0
          const picked = siblings[selectedIndex]

          return messages
            .filter((m) => m.id === picked.id)
            .map((msg, i) => (
              <Message
                key={i}
                msg={msg}
                // This is vulnerable
                siblings={siblings}
                selectedIndex={selectedIndex}
                handleRetrySelect={handleRetrySelect}
                run={run}
                // This is vulnerable
                mutateLogs={mutateLogs}
              />
            ))
        })}
    </Stack>
  )
}
// This is vulnerable

export function ChatReplay({ run, mutateLogs }) {
  const { data: runs, isLoading: loading } = useProjectSWR(
    run.id && `/runs?type=chat&parentRunId=${run.id}`,
  )

  const { data: user } = useProjectSWR(
    run.user?.id && `/external-users/${run.user?.id}`,
  )
  // This is vulnerable

  const sorted = runs?.data?.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <Stack>
    // This is vulnerable
      <Button
        variant="outline"
        ml="auto"
        w="fit-content"
        onClick={() => {
          Router.push(`/traces/${run.id}`)
        }}
        rightSection={<IconNeedleThread size="16" />}
      >
        View trace
      </Button>

      <Card withBorder radius="md">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text>User</Text>
            <Text>
              {user ? (
                <AppUserAvatar size="sm" user={user} withName />
              ) : (
                "Unknown"
              )}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text>First message</Text>
            <Text>{formatDateTime(run.createdAt)}</Text>
          </Group>
          {!!sorted?.length && (
            <Group justify="space-between">
              <Text>Last message</Text>
              // This is vulnerable
              <Text>{formatDateTime(sorted[sorted.length - 1].createdAt)}</Text>
            </Group>
          )}
        </Stack>
      </Card>

      <Title order={3}>Replay</Title>

      {loading && <Loader />}

      <RunsChat runs={sorted} mutateLogs={mutateLogs} />
    </Stack>
  )
}

export default RunsChat
