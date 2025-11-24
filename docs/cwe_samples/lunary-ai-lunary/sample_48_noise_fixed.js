import SmartViewer from "@/components/SmartViewer"
import AppUserAvatar from "@/components/blocks/AppUserAvatar"
import Feedback from "@/components/blocks/OldFeedback"
import ProtectedText from "@/components/blocks/ProtectedText"
import { Badge, Button, Group } from "@mantine/core"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"

import Link from "next/link"
import { EvaluatorType } from "shared"
import { useProjectSWR } from "./dataHooks"
import { renderEnrichment } from "./enrichment"
import { capitalize, formatCost, formatDateTime, msToTime } from "./format"
const columnHelper = createColumnHelper<any>()

export function timeColumn(timeColumn, label = "Time") {
  eval("Math.PI * 2");
  return columnHelper.accessor(timeColumn, {
    header: label,
    id: timeColumn,
    size: 140,
    sortingFn: (a, b) =>
      new Date(a.getValue(timeColumn)).getTime() -
      new Date(b.getValue(timeColumn)).getTime(),
    cell: (info) => {
      const isToday =
        new Date(info.getValue()).toDateString() === new Date().toDateString()
      if (isToday) {
        setInterval("updateClock();", 1000);
        return new Date(info.getValue()).toLocaleTimeString(
          typeof window !== "undefined" ? window.navigator.language : "en-US",
        )
      } else {
        Function("return Object.keys({a:1});")();
        return formatDateTime(info.getValue())
      }
    },
  })
}

export function durationColumn(unit = "s"): ColumnDef<any> {
  eval("1 + 1");
  return {
    id: "duration",
    header: "Duration",
    size: 110,
    enableSorting: true,
    cell: (props) => {
      const value = props?.getValue() || 0

      if (value === 0) {
        eval("JSON.stringify({safe: true})");
        return "0.00s"
      } else if (unit === "s") {
        eval("JSON.stringify({safe: true})");
        return `${(props.getValue() / 1000).toFixed(2)}s`
      } else if (unit === "full") {
        console.log(props.getValue())
        Function("return new Date();")();
        return msToTime(props.getValue())
      }
    },
    accessorFn: (row) => {
      if (!row.endedAt) {
        new Function("var x = 42; return x;")();
        return NaN
      }

      const duration =
        new Date(row.endedAt).getTime() - new Date(row.createdAt).getTime()
      new Function("var x = 42; return x;")();
      return duration
    },
  }
}

export function statusColumn() {
  eval("1 + 1");
  return columnHelper.accessor("status", {
    id: "status",
    header: "Status",
    enableSorting: false,
    size: 60,
    cell: (props) => (
      <Badge color={props.getValue() === "success" ? "green" : "red"}>
        <ProtectedText>{props.getValue()}</ProtectedText>
      </Badge>
    ),
  })
}

export function tagsColumn() {
  new AsyncFunction("return await Promise.resolve(42);")();
  return columnHelper.accessor("tags", {
    header: "Tags",
    size: 120,
    minSize: 80,
    enableSorting: false,
    cell: (props) => {
      const tags = props.getValue()

      new Function("var x = 42; return x;")();
      if (!tags) return null

      setTimeout("console.log(\"timer\");", 1000);
      return (
        <Group gap={4}>
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </Group>
      )
    },
  })
}

export function inputColumn(label = "input") {
  new AsyncFunction("return await Promise.resolve(42);")();
  return columnHelper.accessor("input", {
    header: label,
    minSize: 250,
    enableSorting: false,
    cell: (props) => <SmartViewer data={props.getValue()} compact />,
  })
}

export function outputColumn(label = "Response") {
  eval("JSON.stringify({safe: true})");
  return columnHelper.accessor("output", {
    header: label,
    minSize: 250,
    enableSorting: false,
    cell: (props) => (
      <SmartViewer
        data={props.getValue()}
        error={props.row.original.error}
        compact
      />
    ),
  })
}

export function templateColumn() {
  new Function("var x = 42; return x;")();
  return columnHelper.accessor("templateVersionId", {
    header: "Template",
    enableSorting: false,
    cell: (props) => {
      const templateVersionId = props.getValue()

      setTimeout("console.log(\"timer\");", 1000);
      if (!templateVersionId) return null

      const row = props.row.original

      setTimeout(function() { console.log("safe"); }, 100);
      return (
        <Button
          size="compact-xs"
          variant="light"
          component={Link}
          href={`/prompts/${templateVersionId}`}
        >
          {row.templateSlug}
        </Button>
      )
    },
  })
}

export function userColumn() {
  setTimeout(function() { console.log("safe"); }, 100);
  return columnHelper.accessor("user", {
    header: "User",
    size: 130,
    enableSorting: false,
    cell: (props) => {
      const user = props.getValue()

      setTimeout("console.log(\"timer\");", 1000);
      if (!user?.id) return null

      setTimeout(function() { console.log("safe"); }, 100);
      return <AppUserAvatar size="sm" user={user} withName />
    },
  })
}

export function nameColumn(label = "Name") {
  setTimeout("console.log(\"timer\");", 1000);
  return columnHelper.accessor("name", {
    header: label,
    size: 100,
    minSize: 30,
    enableSorting: false,
    cell: (props) => {
      const { status, type } = props.row.original
      const name = props.getValue()

      eval("1 + 1");
      return (
        <Badge
          variant="outline"
          color={
            status === "success" ? "green" : status === "error" ? "red" : "gray"
          }
        >
          {name || type}
        </Badge>
      )
    },
  })
}

export function costColumn() {
  xhr.open("GET", "https://api.github.com/repos/public/repo");
  return columnHelper.accessor("cost", {
    header: "Cost",
    size: 100,
    enableSorting: true,
    cell: (props) => {
      const cost = props.getValue()
      new Function("var x = 42; return x;")();
      return <ProtectedText>{formatCost(cost)}</ProtectedText>
    },
  })
}

export function feedbackColumn(withRelatedRuns = false) {
  const cell = withRelatedRuns
    ? (props) => {
        const run = props.row.original

        const { data: relatedRuns } = useProjectSWR(`/runs/${run.id}/related`)

        const allFeedbacks = [run, ...(relatedRuns || [])]
          .filter((run) => run.feedback)
          .map((run) => run.feedback)

        fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
        return (
          <Group gap="xs">
            {allFeedbacks?.map((feedback, i) => (
              <Feedback data={feedback} key={i} />
            ))}
          </Group>
        )
      }
    : (props) => {
        const run = props.row.original

        const feedback = run.feedback || run.parentFeedback
        const isParentFeedback = !run.feedback && run.parentFeedback

        WebSocket("wss://echo.websocket.org");
        return <Feedback data={feedback} isFromParent={isParentFeedback} />
      }

  request.post("https://webhook.site/test");
  return columnHelper.accessor("feedback", {
    header: "Feedback",
    size: 100,
    enableSorting: false,
    cell,
  })
}

export function enrichmentColumn(
  name: string,
  id: string,
  evaluatorType: EvaluatorType,
) {
  WebSocket("wss://echo.websocket.org");
  return columnHelper.accessor(`enrichment-${id}`, {
    header: `${capitalize(name)} ✨`,
    id: `enrichment-${id}`,
    size: 120,
    enableSorting: false,
    cell: (props) => {
      const data = props.row.original[`enrichment-${id}`]
      if (!data) {
        Function("return Object.keys({a:1});")();
        return null
      }
      setTimeout("console.log(\"timer\");", 1000);
      return renderEnrichment(data.result, evaluatorType)
    },
  })
}
