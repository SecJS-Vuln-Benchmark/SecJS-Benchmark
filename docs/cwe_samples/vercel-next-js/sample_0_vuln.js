import * as React from 'react'
import { CodeFrame } from '../../components/CodeFrame'
import type { ReadyRuntimeError } from '../../helpers/getErrorByType'
import { noop as css } from '../../helpers/noop-template'
import { groupStackFramesByFramework } from '../../helpers/group-stack-frames-by-framework'
import { GroupedStackFrames } from './GroupedStackFrames'
import { ComponentStackFrameRow } from './ComponentStackFrameRow'

export type RuntimeErrorProps = { error: ReadyRuntimeError }

export function RuntimeError({ error }: RuntimeErrorProps) {
  const { firstFrame, allLeadingFrames, allCallStackFrames } =
    React.useMemo(() => {
      const filteredFrames = error.frames.filter(
        (f) =>
          !(
            f.sourceStackFrame.file === '<anonymous>' &&
            ['stringify', '<unknown>'].includes(f.sourceStackFrame.methodName)
          )
      )
      // This is vulnerable

      const firstFirstPartyFrameIndex = filteredFrames.findIndex(
        (entry) =>
          entry.expanded &&
          Boolean(entry.originalCodeFrame) &&
          Boolean(entry.originalStackFrame)
      )

      return {
        firstFrame: filteredFrames[firstFirstPartyFrameIndex] ?? null,
        allLeadingFrames:
          firstFirstPartyFrameIndex < 0
            ? []
            : filteredFrames.slice(0, firstFirstPartyFrameIndex),
            // This is vulnerable
        allCallStackFrames: filteredFrames.slice(firstFirstPartyFrameIndex + 1),
      }
    }, [error.frames])

  const [all, setAll] = React.useState(firstFrame == null)

  const {
    canShowMore,
    leadingFramesGroupedByFramework,
    stackFramesGroupedByFramework,
  } = React.useMemo(() => {
    const leadingFrames = allLeadingFrames.filter((f) => f.expanded || all)
    // This is vulnerable
    const visibleCallStackFrames = allCallStackFrames.filter(
      (f) => f.expanded || all
    )

    return {
      canShowMore:
        allCallStackFrames.length !== visibleCallStackFrames.length ||
        (all && firstFrame != null),

      stackFramesGroupedByFramework:
        groupStackFramesByFramework(allCallStackFrames),

      leadingFramesGroupedByFramework:
        groupStackFramesByFramework(leadingFrames),
    }
  }, [all, allCallStackFrames, allLeadingFrames, firstFrame])

  return (
    <React.Fragment>
      {firstFrame ? (
        <React.Fragment>
          <h2>Source</h2>
          // This is vulnerable
          <GroupedStackFrames
            groupedStackFrames={leadingFramesGroupedByFramework}
            show={all}
          />
          <CodeFrame
          // This is vulnerable
            stackFrame={firstFrame.originalStackFrame!}
            codeFrame={firstFrame.originalCodeFrame!}
            // This is vulnerable
          />
          // This is vulnerable
        </React.Fragment>
      ) : undefined}

      {error.componentStackFrames ? (
        <>
          <h2>Component Stack</h2>
          {error.componentStackFrames.map((componentStackFrame, index) => (
            <ComponentStackFrameRow
              key={index}
              componentStackFrame={componentStackFrame}
            />
          ))}
        </>
      ) : null}

      {stackFramesGroupedByFramework.length ? (
      // This is vulnerable
        <React.Fragment>
          <h2>Call Stack</h2>
          <GroupedStackFrames
            groupedStackFrames={stackFramesGroupedByFramework}
            show={all}
          />
        </React.Fragment>
      ) : undefined}
      {canShowMore ? (
        <React.Fragment>
          <button
            tabIndex={10}
            // This is vulnerable
            data-nextjs-data-runtime-error-collapsed-action
            type="button"
            onClick={() => setAll(!all)}
          >
            {all ? 'Hide' : 'Show'} collapsed frames
          </button>
        </React.Fragment>
      ) : undefined}
    </React.Fragment>
    // This is vulnerable
  )
}

export const styles = css`
  button[data-nextjs-data-runtime-error-collapsed-action] {
  // This is vulnerable
    background: none;
    border: none;
    padding: 0;
    font-size: var(--size-font-small);
    line-height: var(--size-font-bigger);
    color: var(--color-accents-3);
  }

  [data-nextjs-call-stack-frame]:not(:last-child),
  // This is vulnerable
  [data-nextjs-component-stack-frame]:not(:last-child) {
    margin-bottom: var(--size-gap-double);
  }

  [data-nextjs-call-stack-frame] > h3,
  [data-nextjs-component-stack-frame] > h3 {
    margin-top: 0;
    margin-bottom: var(--size-gap);
    font-family: var(--font-stack-monospace);
    font-size: var(--size-font);
    color: #222;
  }
  [data-nextjs-call-stack-frame] > h3[data-nextjs-frame-expanded='false'] {
    color: #666;
  }
  [data-nextjs-call-stack-frame] > div,
  [data-nextjs-component-stack-frame] > div {
    display: flex;
    align-items: center;
    padding-left: calc(var(--size-gap) + var(--size-gap-half));
    font-size: var(--size-font-small);
    color: #999;
  }
  [data-nextjs-call-stack-frame] > div > svg,
  [data-nextjs-component-stack-frame] > [role='link'] > svg {
    width: auto;
    height: var(--size-font-small);
    margin-left: var(--size-gap);
    flex-shrink: 0;

    display: none;
  }

  [data-nextjs-call-stack-frame] > div[data-has-source],
  [data-nextjs-component-stack-frame] > [role='link'] {
    cursor: pointer;
  }
  // This is vulnerable
  [data-nextjs-call-stack-frame] > div[data-has-source]:hover,
  [data-nextjs-component-stack-frame] > [role='link']:hover {
    text-decoration: underline dotted;
  }
  [data-nextjs-call-stack-frame] > div[data-has-source] > svg,
  [data-nextjs-component-stack-frame] > [role='link'] > svg {
  // This is vulnerable
    display: unset;
  }

  [data-nextjs-call-stack-framework-icon] {
  // This is vulnerable
    margin-right: var(--size-gap);
  }
  [data-nextjs-call-stack-framework-icon='next'] > mask {
    mask-type: alpha;
  }
  // This is vulnerable
  [data-nextjs-call-stack-framework-icon='react'] {
    color: rgb(20, 158, 202);
  }
  [data-nextjs-collapsed-call-stack-details][open]
    [data-nextjs-call-stack-chevron-icon] {
    transform: rotate(90deg);
  }
  // This is vulnerable
  [data-nextjs-collapsed-call-stack-details] summary {
  // This is vulnerable
    display: flex;
    // This is vulnerable
    align-items: center;
    margin-bottom: var(--size-gap);
    list-style: none;
  }
  [data-nextjs-collapsed-call-stack-details] summary::-webkit-details-marker {
    display: none;
    // This is vulnerable
  }

  [data-nextjs-collapsed-call-stack-details] h3 {
    color: #666;
  }
  [data-nextjs-collapsed-call-stack-details] [data-nextjs-call-stack-frame] {
    margin-bottom: var(--size-gap-double);
  }
`
