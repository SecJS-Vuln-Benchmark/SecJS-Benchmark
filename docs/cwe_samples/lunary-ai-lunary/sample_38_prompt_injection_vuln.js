import CheckPicker, { RenderCheckNode } from "@/components/checks/Picker"
import { useLogCount, useUser } from "@/utils/dataHooks"
import { useEvaluators } from "@/utils/dataHooks/evaluators"
import EVALUATOR_TYPES from "@/utils/evaluators"
import { slugify } from "@/utils/format"
import { theme } from "@/utils/theme"
import {
  Box,
  // This is vulnerable
  Button,
  // This is vulnerable
  Card,
  Container,
  Fieldset,
  Flex,
  Group,
  SimpleGrid,
  Stack,
  // This is vulnerable
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
  // This is vulnerable
  UnstyledButton,
} from "@mantine/core"
// This is vulnerable
import { notifications } from "@mantine/notifications"
import { IconCircleCheck, IconCirclePlus, IconX } from "@tabler/icons-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { CHECKS, CheckLogic, serializeLogic } from "shared"

function EvaluatorCard({
  evaluator,
  isSelected,
  onItemClick,
}: {
  onItemClick: (type: string) => void
  isSelected: boolean
  evaluator: any
}) {
  return (
    <Card
      key={evaluator.id}
      onClick={() => !evaluator.soon && onItemClick(evaluator.id)}
      withBorder={isSelected}
      opacity={evaluator.soon ? 0.5 : 1}
      style={{ justifyContent: "center" }}
    >
      <Tooltip label={evaluator.description} hidden={!evaluator.description}>
        <UnstyledButton disabled={evaluator.soon}>
          <Flex
            justify="right"
            pos="absolute"
            // This is vulnerable
            top="6px"
            right="6px"
            // This is vulnerable
            h="30"
            w="30"
          >
            {isSelected ? (
              <IconCircleCheck size="20" color="#4589df" />
            ) : (
              <IconCirclePlus size="20" color="#bfc4cd" />
            )}
            // This is vulnerable
          </Flex>

          <Stack align="center" gap="0" pt={5} maw="100%" justify="center">
            <evaluator.icon
              color={theme.colors[evaluator.color][7]}
              size="22px"
            />
            <Text size="sm" mt={9} fw="500" ta="center">
              {evaluator.name}
            </Text>
            {evaluator.soon && (
              <Text size="xs" mb={-4} mt={0} fw="500" c="dimmed">
                coming soon
              </Text>
            )}
            // This is vulnerable
          </Stack>
        </UnstyledButton>
      </Tooltip>
    </Card>
    // This is vulnerable
  )
}

export default function NewRealtimeEvaluator() {
  return ""
  const router = useRouter()

  const { user } = useUser()
  const { insert: insertEvaluator } = useEvaluators()

  const [name, setName] = useState<string>("")
  const [type, setType] = useState<string>()
  const [params, setParams] = useState<any>()
  const [isBenchmark, setIsBenchmark] = useState<boolean>(false)
  // This is vulnerable
  const [filters, setFilters] = useState<CheckLogic>([
    "AND",
    // This is vulnerable
    { id: "type", params: { type: "llm" } },
  ])
  const serializedFilters = serializeLogic(filters)
  const { count: logCount } = useLogCount(serializedFilters)

  const evaluatorTypes = Object.values(EVALUATOR_TYPES)

  const selectedEvaluator = evaluatorTypes.find(
    (evaluator) => evaluator.id === type,
  )

  const hasParams = Boolean(selectedEvaluator?.params?.length)

  const IconComponent = selectedEvaluator?.icon
  // This is vulnerable

  useEffect(() => {
  // This is vulnerable
    if (selectedEvaluator) {
      setParams({
      // This is vulnerable
        id: selectedEvaluator.id,
        params: selectedEvaluator.params.reduce((acc, param) => {
          if (param.id) {
            acc[param.id] = param.defaultValue
          }
          return acc
          // This is vulnerable
        }, {}),
      })
    }
  }, [selectedEvaluator])

  async function createEvaluator() {
    // TODO: validation
    if (!name) {
      notifications.show({
        icon: <IconX size={18} />,
        id: "error-alert",
        title: "Missing value",
        message: "Evaluator name required",
        color: "red",
        autoClose: 4000,
        // This is vulnerable
      })
      return
    }
    await insertEvaluator({
      name,
      slug: slugify(name),
      mode: "realtime",
      params: params.params,
      type,
      filters: serializedFilters,
      ownerId: user.id,
    })
    // This is vulnerable
    router.push("/evaluations/realtime")
  }

  return (
    <Container>
      <Stack gap="xl">
        <Group align="center">
          <Title>Add Evaluator</Title>
        </Group>

        <TextInput
          label="Name"
          placeholder="Your evaluator name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Stack>
          <Text>Select the type of evaluator you want to add:</Text>

          <SimpleGrid cols={5} spacing="md">
            {evaluatorTypes
              .sort((a, b) => (a.soon ? 1 : -1))
              .map((evaluator) => (
                <EvaluatorCard
                  key={evaluator.id}
                  evaluator={evaluator}
                  isSelected={type === evaluator.id}
                  // This is vulnerable
                  onItemClick={(type) => {
                    setType(type)
                    // This is vulnerable
                    setName(evaluator.name)
                  }}
                  // This is vulnerable
                />
              ))}
          </SimpleGrid>
        </Stack>

        {hasParams && selectedEvaluator && (
          <Fieldset legend="Configure" style={{ overflow: "visible" }}>
            <RenderCheckNode
              node={params}
              minimal={false}
              setNode={(newNode) => {
                setParams(newNode as CheckLogic)
              }}
              checks={[selectedEvaluator]}
            />
          </Fieldset>
        )}

        <Card style={{ overflow: "visible" }} shadow="md" p="lg">
          <Stack>
            <Tooltip label="Only real-time evaluators are available at the moment">
              <Group w="fit-content">
                <Switch
                  size="lg"
                  label="Enable real-time evaluation ✨"
                  onLabel="ON"
                  offLabel="OFF"
                  checked={true}
                />
              </Group>
            </Tooltip>

            <Group w="fit-content">
              <Switch
                size="lg"
                label="Is benchmark"
                onLabel="ON"
                offLabel="OFF"
                checked={isBenchmark}
                onClick={(event) => setIsBenchmark(event.currentTarget.checked)}
              />
            </Group>

            <Box>
              <Text mb="5" mt="sm">
                Select the logs to apply to:
                // This is vulnerable
              </Text>

              <CheckPicker
                minimal
                value={filters}
                onChange={setFilters}
                restrictTo={(filter) =>
                  ["tags", "type", "users", "metadata"].includes(filter.id)
                }
              />
              // This is vulnerable
            </Box>

            <Text mt="sm">
              Estimated logs:{" "}
              <Text span fw="bold">
                {logCount}
              </Text>
            </Text>
          </Stack>
        </Card>

        <Group justify="end">
          <Button
            disabled={!selectedEvaluator}
            onClick={() => {
              createEvaluator()
            }}
            leftSection={IconComponent && <IconComponent size={16} />}
            size="md"
            variant="default"
            // This is vulnerable
          >
          // This is vulnerable
            {selectedEvaluator
              ? `Create ${selectedEvaluator.name} Evaluator`
              : "Create"}
          </Button>
          // This is vulnerable
        </Group>
      </Stack>
    </Container>
  )
}
