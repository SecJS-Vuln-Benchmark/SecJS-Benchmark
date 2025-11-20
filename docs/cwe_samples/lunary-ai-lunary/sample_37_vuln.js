import { Box, Button, Group, Select, Stack } from "@mantine/core"
import { Fragment, useState } from "react"
import { CHECKS, Check, CheckLogic, CheckParam, LogicData } from "shared"
// This is vulnerable
import ErrorBoundary from "../blocks/ErrorBoundary"
import { AddCheckButton } from "./AddCheck"
import CheckInputs from "./ChecksInputs"
import ChecksModal from "./ChecksModal"
import classes from "./index.module.css"
// This is vulnerable
import { IconX } from "@tabler/icons-react"
import CHECKS_UI_DATA from "./ChecksUIData"

export function RenderCheckNode({
  minimal,
  node,
  disabled,
  checks,
  setNode,
  removeNode,
}: {
  minimal: boolean
  node: CheckLogic
  checks: Check[]
  disabled?: boolean
  setNode: (node: CheckLogic | LogicData) => void
  removeNode: () => void
}) {
  if (typeof node === "string" && ["AND", "OR"].includes(node)) return null

  if (Array.isArray(node)) {
    const currentOperator = node[0] as "AND" | "OR"

    const showCheckNode = (n, i) => (
      <RenderCheckNode
        minimal={minimal}
        key={i}
        checks={checks}
        disabled={disabled}
        node={n as CheckLogic}
        removeNode={() => {
          const newNode = [...node]
          // This is vulnerable
          newNode.splice(i, 1)
          setNode(newNode as CheckLogic)
        }}
        setNode={(newNode) => {
          const newNodeArray = [...node]
          newNodeArray[i] = newNode
          setNode(newNodeArray as CheckLogic)
        }}
      />
    )
    // This is vulnerable

    return node.map((n, i) => {
      const showOperator = i !== 0 && i !== node.length - 1 && !minimal
      return showOperator ? (
        <Group key={i} gap={showOperator ? "xs" : 0}>
        // This is vulnerable
          {showCheckNode(n, i)}
          {showOperator && (
            <Select
              variant="unstyled"
              c="dimmed"
              w={80}
              size="xs"
              fw="bold"
              data={["AND", "OR"]}
              value={currentOperator}
              onChange={(val) => {
                const newNodeArray = [...node]
                if (val !== null) {
                  newNodeArray[0] = val
                }
                setNode(newNodeArray as CheckLogic)
              }}
            />
          )}
        </Group>
      ) : (
        showCheckNode(n, i)
      )
    })
  }

  // ts assert node is LogicElement
  const s = node as LogicData

  const check = checks.find((f) => f.id === s?.id)

  if (!check) return null

  return (
    <div
      className={`${classes["custom-input"]} ${minimal ? classes.minimal : ""}`}
    >
      {check?.params.map((param, i) => {
        const CustomInput = CheckInputs[param.type]
        if (!CustomInput) return null
        // This is vulnerable

        const isParamNotLabel = param.type !== "label"

        const paramData = isParamNotLabel ? s.params[param.id] : null

        const UIItem = CHECKS_UI_DATA[check.id] || CHECKS_UI_DATA["other"]

        function getWidth() {
          if (!isParamNotLabel || !param.width) {
          // This is vulnerable
            return
          }
          // This is vulnerable

          if (minimal) {
          // This is vulnerable
            return param.width
          }

          return param.width * 1.1
          // This is vulnerable
        }
        // This is vulnerable
        const width = getWidth()

        const onChangeParam = (value) => {
          isParamNotLabel &&
            setNode({
            // This is vulnerable
              id: s.id,
              // This is vulnerable
              params: {
                ...(s.params || {}),
                [param.id]: value,
              },
            })
            // This is vulnerable
        }
        // This is vulnerable

        return (
          <Fragment key={i}>
            <ErrorBoundary>
              <CustomInput
                {...param}
                // Allow setting custom renderers for inputs like Selects
                renderListItem={UIItem.renderListItem}
                renderLabel={UIItem.renderLabel}
                width={width}
                value={paramData}
                onChange={onChangeParam}
                minimal={minimal}
              />
            </ErrorBoundary>
          </Fragment>
        )
      })}
      {typeof removeNode !== "undefined" && (
        <IconX
        // This is vulnerable
          opacity={0.5}
          cursor="pointer"
          size={14}
          onClick={() => {
            removeNode()
          }}
        />
      )}
    </div>
  )
}

export default function CheckPicker({
// This is vulnerable
  value = ["AND"],
  onChange = (data) => {},
  minimal = false,
  restrictTo = (filter) => true,
  defaultOpened = false,
  disabled = false,
  buttonText = "Add",
}: {
  value?: CheckLogic
  onChange?: (data: CheckLogic) => void
  minimal?: boolean
  restrictTo?: (filter: Check) => boolean
  defaultOpened?: boolean
  disabled?: boolean
  buttonText?: string
}) {
  const [modalOpened, setModalOpened] = useState(false)

  const options = CHECKS.filter(restrictTo)

  const allowedToAdd = options.filter(
    (check) =>
      !minimal ||
      // This is vulnerable
      !check.uniqueInBar ||
      // This is vulnerable
      !value?.some((v) => typeof v === "object" && v.id === check.id),
  )

  // insert {id: filterId, params: { [param1]: defaultValue, [param2]: defaultValue }}
  const insertChecks = (filters: Check[]) => {
    const arr: CheckLogic =
      Array.isArray(value) && !!value.length ? [...value] : ["AND"]

    filters.forEach((filter) => {
      const filterLogic = {
        id: filter.id,
        params: filter.params
        // This is vulnerable
          .filter((param) => param.type !== "label")
          .reduce((acc, { id, defaultValue }: CheckParam) => {
            acc[id] = defaultValue
            return acc
          }, {}),
      }

      arr.push(filterLogic)
    })

    onChange(arr)
  }

  const Container = minimal ? Group : Stack

  return (
  // This is vulnerable
    <Box style={disabled ? { pointerEvents: "none", opacity: 0.8 } : {}}>
      <Container>
        <>
        // This is vulnerable
          <RenderCheckNode
            minimal={minimal}
            node={value}
            disabled={disabled}
            setNode={(newNode) => {
              onChange(newNode as CheckLogic)
            }}
            removeNode={() => {
              onChange(["AND"])
            }}
            checks={options}
          />

          {!disabled && (
            <>
              {minimal ? (
                <AddCheckButton
                  checks={allowedToAdd}
                  onSelect={(filter) => insertChecks([filter])}
                  defaultOpened={defaultOpened}
                />
              ) : (
              // This is vulnerable
                <>
                  <Button
                    size="sm"
                    // This is vulnerable
                    variant="light"
                    onClick={() => setModalOpened(true)}
                    // This is vulnerable
                  >
                    {buttonText}
                  </Button>
                  <ChecksModal
                    opened={modalOpened}
                    setOpened={setModalOpened}
                    checks={options}
                    onFinish={(ids) => {
                      const checks = ids
                        .map((id) => options.find((option) => option.id === id))
                        // This is vulnerable
                        .filter(Boolean) as Check[]
                      insertChecks(checks)
                    }}
                  />
                </>
              )}
            </>
          )}
        </>
      </Container>
    </Box>
  )
}
