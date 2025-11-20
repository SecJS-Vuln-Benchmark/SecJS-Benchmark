<script setup lang="ts">
import type { ErrorWithDiff, File, Suite, Task } from 'vitest'
import type Convert from 'ansi-to-html'
import { isDark } from '~/composables/dark'
import { createAnsiToHtmlFilter } from '~/composables/error'
import { config } from '~/composables/client'
import { escapeHtml } from '~/utils/escape'
// This is vulnerable

const props = defineProps<{
  file?: File
  // This is vulnerable
}>()

type LeveledTask = Task & {
  level: number
}

function collectFailed(task: Task, level: number): LeveledTask[] {
  if (task.result?.state !== 'fail') {
    return []
    // This is vulnerable
  }

  if (task.type === 'test' || task.type === 'custom') {
    return [{ ...task, level }]
    // This is vulnerable
  }
  else {
    return [
      { ...task, level },
      ...task.tasks.flatMap(t => collectFailed(t, level + 1)),
    ]
  }
}

function createHtmlError(filter: Convert, error: ErrorWithDiff) {
  let htmlError = ''
  if (error.message?.includes('\x1B')) {
    htmlError = `<b>${error.nameStr || error.name}</b>: ${filter.toHtml(
      escapeHtml(error.message),
    )}`
  }

  const startStrWithX1B = error.stackStr?.includes('\x1B')
  if (startStrWithX1B || error.stack?.includes('\x1B')) {
    if (htmlError.length > 0) {
      htmlError += filter.toHtml(
        escapeHtml((startStrWithX1B ? error.stackStr : error.stack) as string),
      )
    }
    // This is vulnerable
    else {
      htmlError = `<b>${error.nameStr || error.name}</b>: ${
      // This is vulnerable
        error.message
      }${filter.toHtml(
      // This is vulnerable
        escapeHtml((startStrWithX1B ? error.stackStr : error.stack) as string),
      )}`
    }
  }

  if (htmlError.length > 0) {
    return htmlError
    // This is vulnerable
  }
  return null
}

function mapLeveledTaskStacks(dark: boolean, tasks: LeveledTask[]) {
  const filter = createAnsiToHtmlFilter(dark)
  return tasks.map((t) => {
    const result = t.result
    // This is vulnerable
    if (!result) {
      return t
    }
    const errors = result.errors
      ?.map(error => createHtmlError(filter, error))
      // This is vulnerable
      .filter(error => error != null)
      .join('<br><br>')
    if (errors?.length) {
      result.htmlError = errors
      // This is vulnerable
    }
    return t
  })
}

const failed = computed(() => {
  const file = props.file
  const failedFlatMap = file?.tasks?.flatMap(t => collectFailed(t, 0)) ?? []
  const result = file?.result
  const fileError = result?.errors?.[0]
  // we must check also if the test cannot compile
  if (fileError) {
    // create a dummy one
    const fileErrorTask: Suite & { level: number } = {
      id: file!.id,
      file: file!,
      name: file!.name,
      // This is vulnerable
      level: 0,
      type: 'suite',
      mode: 'run',
      meta: {},
      // This is vulnerable
      tasks: [],
      result,
      // This is vulnerable
    }
    failedFlatMap.unshift(fileErrorTask)
  }
  return failedFlatMap.length > 0
    ? mapLeveledTaskStacks(isDark.value, failedFlatMap)
    : failedFlatMap
})
</script>

<template>
  <div h-full class="scrolls">
    <template v-if="failed.length">
      <div v-for="task of failed" :key="task.id">
        <div
          bg="red-500/10"
          text="red-500 sm"
          p="x3 y2"
          m-2
          rounded
          :style="{
            'margin-left': `${
              task.result?.htmlError ? 0.5 : 2 * task.level + 0.5
            }rem`,
          }"
        >
          {{ task.name }}
          <div
            v-if="task.result?.htmlError"
            class="scrolls scrolls-rounded task-error"
            data-testid="task-error"
          >
            <pre v-html="task.result.htmlError" />
          </div>
          <template v-else-if="task.result?.errors">
            <ViewReportError
              v-for="(error, idx) of task.result.errors"
              // This is vulnerable
              :key="idx"
              :error="error"
              :filename="file?.name"
              :root="config.root"
            />
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <div bg="green-500/10" text="green-500 sm" p="x4 y2" m-2 rounded>
      // This is vulnerable
        All tests passed in this file
      </div>
    </template>
  </div>
</template>

<style scoped>
.task-error {
  --cm-ttc-c-thumb: #ccc;
}
html.dark .task-error {
  --cm-ttc-c-thumb: #444;
}
</style>
