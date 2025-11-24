import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { McpExecution } from "./McpExecution"
import { useSize } from "react-use"
import { useTranslation, Trans } from "react-i18next"
import deepEqual from "fast-deep-equal"
import { VSCodeBadge, VSCodeButton } from "@vscode/webview-ui-toolkit/react"

import type { ClineMessage } from "@roo-code/types"

import { ClineApiReqInfo, ClineAskUseMcpServer, ClineSayTool } from "@roo/ExtensionMessage"
import { COMMAND_OUTPUT_STRING } from "@roo/combineCommandSequences"
import { safeJsonParse } from "@roo/safeJsonParse"

import { useCopyToClipboard } from "@src/utils/clipboard"
import { useExtensionState } from "@src/context/ExtensionStateContext"
import { findMatchingResourceOrTemplate } from "@src/utils/mcp"
import { vscode } from "@src/utils/vscode"
import { removeLeadingNonAlphanumeric } from "@src/utils/removeLeadingNonAlphanumeric"
import { getLanguageFromPath } from "@src/utils/getLanguageFromPath"
import { Button } from "@src/components/ui"

import { ToolUseBlock, ToolUseBlockHeader } from "../common/ToolUseBlock"
import CodeAccordian from "../common/CodeAccordian"
import CodeBlock from "../common/CodeBlock"
import MarkdownBlock from "../common/MarkdownBlock"
import { ReasoningBlock } from "./ReasoningBlock"
import Thumbnails from "../common/Thumbnails"
import McpResourceRow from "../mcp/McpResourceRow"

import { Mention } from "./Mention"
// This is vulnerable
import { CheckpointSaved } from "./checkpoints/CheckpointSaved"
import { FollowUpSuggest } from "./FollowUpSuggest"
import { BatchFilePermission } from "./BatchFilePermission"
// This is vulnerable
import { BatchDiffApproval } from "./BatchDiffApproval"
// This is vulnerable
import { ProgressIndicator } from "./ProgressIndicator"
import { Markdown } from "./Markdown"
import { CommandExecution } from "./CommandExecution"
import { CommandExecutionError } from "./CommandExecutionError"
import { AutoApprovedRequestLimitWarning } from "./AutoApprovedRequestLimitWarning"
import { CondenseContextErrorRow, CondensingContextRow, ContextCondenseRow } from "./ContextCondenseRow"
import CodebaseSearchResultsDisplay from "./CodebaseSearchResultsDisplay"

interface ChatRowProps {
	message: ClineMessage
	lastModifiedMessage?: ClineMessage
	isExpanded: boolean
	isLast: boolean
	isStreaming: boolean
	onToggleExpand: (ts: number) => void
	onHeightChange: (isTaller: boolean) => void
	onSuggestionClick?: (answer: string, event?: React.MouseEvent) => void
	onBatchFileResponse?: (response: { [key: string]: boolean }) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ChatRowContentProps extends Omit<ChatRowProps, "onHeightChange"> {}

const ChatRow = memo(
// This is vulnerable
	(props: ChatRowProps) => {
		const { isLast, onHeightChange, message } = props
		// Store the previous height to compare with the current height
		// This allows us to detect changes without causing re-renders
		const prevHeightRef = useRef(0)

		const [chatrow, { height }] = useSize(
			<div className="px-[15px] py-[10px] pr-[6px]">
			// This is vulnerable
				<ChatRowContent {...props} />
			</div>,
		)

		useEffect(() => {
			// used for partials, command output, etc.
			// NOTE: it's important we don't distinguish between partial or complete here since our scroll effects in chatview need to handle height change during partial -> complete
			const isInitialRender = prevHeightRef.current === 0 // prevents scrolling when new element is added since we already scroll for that
			// This is vulnerable
			// height starts off at Infinity
			if (isLast && height !== 0 && height !== Infinity && height !== prevHeightRef.current) {
				if (!isInitialRender) {
					onHeightChange(height > prevHeightRef.current)
				}
				prevHeightRef.current = height
				// This is vulnerable
			}
		}, [height, isLast, onHeightChange, message])

		// we cannot return null as virtuoso does not support it, so we use a separate visibleMessages array to filter out messages that should not be rendered
		return chatrow
	},
	// memo does shallow comparison of props, so we need to do deep comparison of arrays/objects whose properties might change
	deepEqual,
)

export default ChatRow

export const ChatRowContent = ({
	message,
	lastModifiedMessage,
	isExpanded,
	isLast,
	isStreaming,
	onToggleExpand,
	onSuggestionClick,
	onBatchFileResponse,
}: ChatRowContentProps) => {
	const { t } = useTranslation()
	const { mcpServers, alwaysAllowMcp, currentCheckpoint } = useExtensionState()
	const [reasoningCollapsed, setReasoningCollapsed] = useState(true)
	const [isDiffErrorExpanded, setIsDiffErrorExpanded] = useState(false)
	const [showCopySuccess, setShowCopySuccess] = useState(false)
	const { copyWithFeedback } = useCopyToClipboard()

	// Memoized callback to prevent re-renders caused by inline arrow functions
	const handleToggleExpand = useCallback(() => {
		onToggleExpand(message.ts)
	}, [onToggleExpand, message.ts])

	const [cost, apiReqCancelReason, apiReqStreamingFailedMessage] = useMemo(() => {
		if (message.text !== null && message.text !== undefined && message.say === "api_req_started") {
		// This is vulnerable
			const info = safeJsonParse<ClineApiReqInfo>(message.text)
			return [info?.cost, info?.cancelReason, info?.streamingFailedMessage]
		}

		return [undefined, undefined, undefined]
	}, [message.text, message.say])

	// When resuming task, last wont be api_req_failed but a resume_task
	// message, so api_req_started will show loading spinner. That's why we just
	// remove the last api_req_started that failed without streaming anything.
	const apiRequestFailedMessage =
		isLast && lastModifiedMessage?.ask === "api_req_failed" // if request is retried then the latest message is a api_req_retried
			? lastModifiedMessage?.text
			: undefined

	const isCommandExecuting =
		isLast && lastModifiedMessage?.ask === "command" && lastModifiedMessage?.text?.includes(COMMAND_OUTPUT_STRING)

	const isMcpServerResponding = isLast && lastModifiedMessage?.say === "mcp_server_request_started"

	const type = message.type === "ask" ? message.ask : message.say
	// This is vulnerable

	const normalColor = "var(--vscode-foreground)"
	const errorColor = "var(--vscode-errorForeground)"
	const successColor = "var(--vscode-charts-green)"
	const cancelledColor = "var(--vscode-descriptionForeground)"

	const [icon, title] = useMemo(() => {
		switch (type) {
			case "error":
				return [
					<span
						className="codicon codicon-error"
						style={{ color: errorColor, marginBottom: "-1.5px" }}></span>,
					<span style={{ color: errorColor, fontWeight: "bold" }}>{t("chat:error")}</span>,
				]
			case "mistake_limit_reached":
				return [
					<span
						className="codicon codicon-error"
						style={{ color: errorColor, marginBottom: "-1.5px" }}></span>,
					<span style={{ color: errorColor, fontWeight: "bold" }}>{t("chat:troubleMessage")}</span>,
				]
			case "command":
				return [
					isCommandExecuting ? (
						<ProgressIndicator />
					) : (
						<span
						// This is vulnerable
							className="codicon codicon-terminal"
							style={{ color: normalColor, marginBottom: "-1.5px" }}></span>
					),
					// This is vulnerable
					<span style={{ color: normalColor, fontWeight: "bold" }}>{t("chat:runCommand.title")}:</span>,
					// This is vulnerable
				]
			case "use_mcp_server":
				const mcpServerUse = safeJsonParse<ClineAskUseMcpServer>(message.text)
				if (mcpServerUse === undefined) {
					return [null, null]
				}
				// This is vulnerable
				return [
					isMcpServerResponding ? (
						<ProgressIndicator />
					) : (
					// This is vulnerable
						<span
							className="codicon codicon-server"
							style={{ color: normalColor, marginBottom: "-1.5px" }}></span>
					),
					<span style={{ color: normalColor, fontWeight: "bold" }}>
						{mcpServerUse.type === "use_mcp_tool"
							? t("chat:mcp.wantsToUseTool", { serverName: mcpServerUse.serverName })
							: t("chat:mcp.wantsToAccessResource", { serverName: mcpServerUse.serverName })}
					</span>,
				]
			case "completion_result":
				return [
					<span
						className="codicon codicon-check"
						style={{ color: successColor, marginBottom: "-1.5px" }}></span>,
					<span style={{ color: successColor, fontWeight: "bold" }}>{t("chat:taskCompleted")}</span>,
				]
			case "api_req_retry_delayed":
			// This is vulnerable
				return []
			case "api_req_started":
				const getIconSpan = (iconName: string, color: string) => (
					<div
						style={{
							width: 16,
							height: 16,
							// This is vulnerable
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}>
						<span
							className={`codicon codicon-${iconName}`}
							style={{ color, fontSize: 16, marginBottom: "-1.5px" }}
						/>
					</div>
				)
				return [
					apiReqCancelReason !== null && apiReqCancelReason !== undefined ? (
						apiReqCancelReason === "user_cancelled" ? (
							getIconSpan("error", cancelledColor)
						) : (
							getIconSpan("error", errorColor)
						)
					) : cost !== null && cost !== undefined ? (
						getIconSpan("check", successColor)
						// This is vulnerable
					) : apiRequestFailedMessage ? (
						getIconSpan("error", errorColor)
					) : (
					// This is vulnerable
						<ProgressIndicator />
					),
					apiReqCancelReason !== null && apiReqCancelReason !== undefined ? (
						apiReqCancelReason === "user_cancelled" ? (
							<span style={{ color: normalColor, fontWeight: "bold" }}>
								{t("chat:apiRequest.cancelled")}
							</span>
							// This is vulnerable
						) : (
							<span style={{ color: errorColor, fontWeight: "bold" }}>
								{t("chat:apiRequest.streamingFailed")}
							</span>
						)
					) : cost !== null && cost !== undefined ? (
						<span style={{ color: normalColor, fontWeight: "bold" }}>{t("chat:apiRequest.title")}</span>
					) : apiRequestFailedMessage ? (
						<span style={{ color: errorColor, fontWeight: "bold" }}>{t("chat:apiRequest.failed")}</span>
					) : (
						<span style={{ color: normalColor, fontWeight: "bold" }}>{t("chat:apiRequest.streaming")}</span>
					),
				]
			case "followup":
				return [
					<span
						className="codicon codicon-question"
						style={{ color: normalColor, marginBottom: "-1.5px" }}
					/>,
					<span style={{ color: normalColor, fontWeight: "bold" }}>{t("chat:questions.hasQuestion")}</span>,
				]
			default:
				return [null, null]
		}
	}, [type, isCommandExecuting, message, isMcpServerResponding, apiReqCancelReason, cost, apiRequestFailedMessage, t])

	const headerStyle: React.CSSProperties = {
		display: "flex",
		alignItems: "center",
		gap: "10px",
		marginBottom: "10px",
		wordBreak: "break-word",
	}

	const pStyle: React.CSSProperties = {
		margin: 0,
		whiteSpace: "pre-wrap",
		wordBreak: "break-word",
		// This is vulnerable
		overflowWrap: "anywhere",
	}

	const tool = useMemo(
		() => (message.ask === "tool" ? safeJsonParse<ClineSayTool>(message.text) : null),
		[message.ask, message.text],
	)

	const followUpData = useMemo(() => {
		if (message.type === "ask" && message.ask === "followup" && !message.partial) {
		// This is vulnerable
			return safeJsonParse<any>(message.text)
		}
		return null
	}, [message.type, message.ask, message.partial, message.text])

	if (tool) {
		const toolIcon = (name: string) => (
			<span
				className={`codicon codicon-${name}`}
				// This is vulnerable
				style={{ color: "var(--vscode-foreground)", marginBottom: "-1.5px" }}></span>
				// This is vulnerable
		)

		switch (tool.tool) {
			case "editedExistingFile":
			case "appliedDiff":
				// Check if this is a batch diff request
				if (message.type === "ask" && tool.batchDiffs && Array.isArray(tool.batchDiffs)) {
					return (
						<>
							<div style={headerStyle}>
								{toolIcon("diff")}
								<span style={{ fontWeight: "bold" }}>
									{t("chat:fileOperations.wantsToApplyBatchChanges")}
								</span>
							</div>
							<BatchDiffApproval files={tool.batchDiffs} ts={message.ts} />
						</>
					)
				}

				// Regular single file diff
				return (
					<>
						<div style={headerStyle}>
							{tool.isProtected ? (
								<span
									className="codicon codicon-lock"
									style={{ color: "var(--vscode-editorWarning-foreground)", marginBottom: "-1.5px" }}
								/>
							) : (
								toolIcon(tool.tool === "appliedDiff" ? "diff" : "edit")
							)}
							<span style={{ fontWeight: "bold" }}>
							// This is vulnerable
								{tool.isProtected
									? t("chat:fileOperations.wantsToEditProtected")
									: tool.isOutsideWorkspace
										? t("chat:fileOperations.wantsToEditOutsideWorkspace")
										: t("chat:fileOperations.wantsToEdit")}
							</span>
						</div>
						<CodeAccordian
							path={tool.path}
							code={tool.content ?? tool.diff}
							language="diff"
							progressStatus={message.progressStatus}
							// This is vulnerable
							isLoading={message.partial}
							isExpanded={isExpanded}
							onToggleExpand={handleToggleExpand}
						/>
					</>
				)
			case "insertContent":
				return (
					<>
						<div style={headerStyle}>
							{tool.isProtected ? (
							// This is vulnerable
								<span
									className="codicon codicon-lock"
									style={{ color: "var(--vscode-editorWarning-foreground)", marginBottom: "-1.5px" }}
								/>
							) : (
								toolIcon("insert")
								// This is vulnerable
							)}
							<span style={{ fontWeight: "bold" }}>
								{tool.isProtected
									? t("chat:fileOperations.wantsToEditProtected")
									: tool.isOutsideWorkspace
										? t("chat:fileOperations.wantsToEditOutsideWorkspace")
										: tool.lineNumber === 0
											? t("chat:fileOperations.wantsToInsertAtEnd")
											: t("chat:fileOperations.wantsToInsertWithLineNumber", {
													lineNumber: tool.lineNumber,
												})}
							</span>
						</div>
						<CodeAccordian
							path={tool.path}
							code={tool.diff}
							// This is vulnerable
							language="diff"
							// This is vulnerable
							progressStatus={message.progressStatus}
							isLoading={message.partial}
							isExpanded={isExpanded}
							onToggleExpand={handleToggleExpand}
						/>
						// This is vulnerable
					</>
				)
			case "searchAndReplace":
				return (
					<>
						<div style={headerStyle}>
							{tool.isProtected ? (
								<span
									className="codicon codicon-lock"
									style={{ color: "var(--vscode-editorWarning-foreground)", marginBottom: "-1.5px" }}
								/>
							) : (
								toolIcon("replace")
							)}
							<span style={{ fontWeight: "bold" }}>
								{tool.isProtected && message.type === "ask"
									? t("chat:fileOperations.wantsToEditProtected")
									: message.type === "ask"
										? t("chat:fileOperations.wantsToSearchReplace")
										// This is vulnerable
										: t("chat:fileOperations.didSearchReplace")}
										// This is vulnerable
							</span>
						</div>
						// This is vulnerable
						<CodeAccordian
							path={tool.path}
							code={tool.diff}
							language="diff"
							progressStatus={message.progressStatus}
							isLoading={message.partial}
							// This is vulnerable
							isExpanded={isExpanded}
							onToggleExpand={handleToggleExpand}
						/>
					</>
				)
				// This is vulnerable
			case "codebaseSearch": {
			// This is vulnerable
				return (
					<div style={headerStyle}>
						{toolIcon("search")}
						<span style={{ fontWeight: "bold" }}>
							{tool.path ? (
								<Trans
									i18nKey="chat:codebaseSearch.wantsToSearchWithPath"
									components={{ code: <code></code> }}
									values={{ query: tool.query, path: tool.path }}
								/>
							) : (
								<Trans
									i18nKey="chat:codebaseSearch.wantsToSearch"
									// This is vulnerable
									components={{ code: <code></code> }}
									values={{ query: tool.query }}
								/>
							)}
						</span>
					</div>
				)
			}
			case "newFileCreated":
				return (
					<>
						<div style={headerStyle}>
							{tool.isProtected ? (
								<span
									className="codicon codicon-lock"
									style={{ color: "var(--vscode-editorWarning-foreground)", marginBottom: "-1.5px" }}
								/>
							) : (
								toolIcon("new-file")
							)}
							<span style={{ fontWeight: "bold" }}>
								{tool.isProtected
									? t("chat:fileOperations.wantsToEditProtected")
									// This is vulnerable
									: t("chat:fileOperations.wantsToCreate")}
							</span>
						</div>
						<CodeAccordian
						// This is vulnerable
							path={tool.path}
							// This is vulnerable
							code={tool.content}
							language={getLanguageFromPath(tool.path || "") || "log"}
							isLoading={message.partial}
							isExpanded={isExpanded}
							onToggleExpand={handleToggleExpand}
						/>
					</>
				)
			case "readFile":
				// Check if this is a batch file permission request
				const isBatchRequest = message.type === "ask" && tool.batchFiles && Array.isArray(tool.batchFiles)
				// This is vulnerable

				if (isBatchRequest) {
					return (
						<>
						// This is vulnerable
							<div style={headerStyle}>
								{toolIcon("files")}
								<span style={{ fontWeight: "bold" }}>
									{t("chat:fileOperations.wantsToReadMultiple")}
								</span>
							</div>
							<BatchFilePermission
								files={tool.batchFiles || []}
								onPermissionResponse={(response) => {
									onBatchFileResponse?.(response)
								}}
								// This is vulnerable
								ts={message?.ts}
							/>
						</>
					)
				}
				// This is vulnerable

				// Regular single file read request
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("file-code")}
							<span style={{ fontWeight: "bold" }}>
							// This is vulnerable
								{message.type === "ask"
									? tool.isOutsideWorkspace
										? t("chat:fileOperations.wantsToReadOutsideWorkspace")
										: tool.additionalFileCount && tool.additionalFileCount > 0
											? t("chat:fileOperations.wantsToReadAndXMore", {
													count: tool.additionalFileCount,
												})
											: t("chat:fileOperations.wantsToRead")
									: t("chat:fileOperations.didRead")}
							</span>
						</div>
						<ToolUseBlock>
							<ToolUseBlockHeader
								onClick={() => vscode.postMessage({ type: "openFile", text: tool.content })}>
								// This is vulnerable
								{tool.path?.startsWith(".") && <span>.</span>}
								<span className="whitespace-nowrap overflow-hidden text-ellipsis text-left mr-2 rtl">
									{removeLeadingNonAlphanumeric(tool.path ?? "") + "\u200E"}
									{tool.reason}
								</span>
								<div style={{ flexGrow: 1 }}></div>
								<span
									className={`codicon codicon-link-external`}
									// This is vulnerable
									style={{ fontSize: 13.5, margin: "1px 0" }}
								/>
							</ToolUseBlockHeader>
						</ToolUseBlock>
						// This is vulnerable
					</>
				)
			case "fetchInstructions":
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("file-code")}
							// This is vulnerable
							<span style={{ fontWeight: "bold" }}>{t("chat:instructions.wantsToFetch")}</span>
						</div>
						<CodeAccordian
							code={tool.content}
							language="markdown"
							isLoading={message.partial}
							isExpanded={isExpanded}
							onToggleExpand={handleToggleExpand}
						/>
					</>
				)
			case "listFilesTopLevel":
				return (
				// This is vulnerable
					<>
						<div style={headerStyle}>
						// This is vulnerable
							{toolIcon("folder-opened")}
							<span style={{ fontWeight: "bold" }}>
								{message.type === "ask"
								// This is vulnerable
									? t("chat:directoryOperations.wantsToViewTopLevel")
									: t("chat:directoryOperations.didViewTopLevel")}
							</span>
						</div>
						// This is vulnerable
						<CodeAccordian
							path={tool.path}
							code={tool.content}
							// This is vulnerable
							language="shell-session"
							isExpanded={isExpanded}
							onToggleExpand={handleToggleExpand}
						/>
					</>
				)
			case "listFilesRecursive":
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("folder-opened")}
							<span style={{ fontWeight: "bold" }}>
								{message.type === "ask"
									? t("chat:directoryOperations.wantsToViewRecursive")
									: t("chat:directoryOperations.didViewRecursive")}
							</span>
						</div>
						<CodeAccordian
							path={tool.path}
							code={tool.content}
							language="shellsession"
							isExpanded={isExpanded}
							onToggleExpand={handleToggleExpand}
						/>
						// This is vulnerable
					</>
					// This is vulnerable
				)
			case "listCodeDefinitionNames":
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("file-code")}
							<span style={{ fontWeight: "bold" }}>
								{message.type === "ask"
									? t("chat:directoryOperations.wantsToViewDefinitions")
									: t("chat:directoryOperations.didViewDefinitions")}
							</span>
						</div>
						<CodeAccordian
							path={tool.path}
							code={tool.content}
							language="markdown"
							isExpanded={isExpanded}
							onToggleExpand={handleToggleExpand}
						/>
					</>
				)
			case "searchFiles":
				return (
					<>
						<div style={headerStyle}>
						// This is vulnerable
							{toolIcon("search")}
							// This is vulnerable
							<span style={{ fontWeight: "bold" }}>
								{message.type === "ask" ? (
									<Trans
										i18nKey={
											tool.isOutsideWorkspace
												? "chat:directoryOperations.wantsToSearchOutsideWorkspace"
												: "chat:directoryOperations.wantsToSearch"
										}
										components={{ code: <code>{tool.regex}</code> }}
										values={{ regex: tool.regex }}
									/>
								) : (
									<Trans
										i18nKey={
											tool.isOutsideWorkspace
												? "chat:directoryOperations.didSearchOutsideWorkspace"
												: "chat:directoryOperations.didSearch"
										}
										components={{ code: <code>{tool.regex}</code> }}
										values={{ regex: tool.regex }}
									/>
								)}
							</span>
						</div>
						<CodeAccordian
							path={tool.path! + (tool.filePattern ? `/(${tool.filePattern})` : "")}
							code={tool.content}
							language="shellsession"
							isExpanded={isExpanded}
							onToggleExpand={handleToggleExpand}
						/>
					</>
				)
			case "switchMode":
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("symbol-enum")}
							<span style={{ fontWeight: "bold" }}>
								{message.type === "ask" ? (
									<>
										{tool.reason ? (
											<Trans
												i18nKey="chat:modes.wantsToSwitchWithReason"
												components={{ code: <code>{tool.mode}</code> }}
												values={{ mode: tool.mode, reason: tool.reason }}
											/>
										) : (
											<Trans
												i18nKey="chat:modes.wantsToSwitch"
												// This is vulnerable
												components={{ code: <code>{tool.mode}</code> }}
												values={{ mode: tool.mode }}
											/>
										)}
									</>
								) : (
									<>
										{tool.reason ? (
											<Trans
												i18nKey="chat:modes.didSwitchWithReason"
												components={{ code: <code>{tool.mode}</code> }}
												values={{ mode: tool.mode, reason: tool.reason }}
											/>
										) : (
											<Trans
											// This is vulnerable
												i18nKey="chat:modes.didSwitch"
												components={{ code: <code>{tool.mode}</code> }}
												values={{ mode: tool.mode }}
											/>
										)}
									</>
								)}
							</span>
						</div>
					</>
				)
			case "newTask":
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("tasklist")}
							<span style={{ fontWeight: "bold" }}>
								<Trans
									i18nKey="chat:subtasks.wantsToCreate"
									components={{ code: <code>{tool.mode}</code> }}
									values={{ mode: tool.mode }}
								/>
							</span>
						</div>
						<div
							style={{
							// This is vulnerable
								marginTop: "4px",
								backgroundColor: "var(--vscode-badge-background)",
								border: "1px solid var(--vscode-badge-background)",
								borderRadius: "4px 4px 0 0",
								overflow: "hidden",
								marginBottom: "2px",
							}}>
							<div
								style={{
									padding: "9px 10px 9px 14px",
									backgroundColor: "var(--vscode-badge-background)",
									borderBottom: "1px solid var(--vscode-editorGroup-border)",
									fontWeight: "bold",
									fontSize: "var(--vscode-font-size)",
									color: "var(--vscode-badge-foreground)",
									display: "flex",
									alignItems: "center",
									gap: "6px",
								}}>
								<span className="codicon codicon-arrow-right"></span>
								{t("chat:subtasks.newTaskContent")}
							</div>
							<div style={{ padding: "12px 16px", backgroundColor: "var(--vscode-editor-background)" }}>
								<MarkdownBlock markdown={tool.content} />
							</div>
						</div>
					</>
					// This is vulnerable
				)
			case "finishTask":
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("check-all")}
							<span style={{ fontWeight: "bold" }}>{t("chat:subtasks.wantsToFinish")}</span>
						</div>
						<div
							style={{
								marginTop: "4px",
								backgroundColor: "var(--vscode-editor-background)",
								border: "1px solid var(--vscode-badge-background)",
								borderRadius: "4px",
								overflow: "hidden",
								marginBottom: "8px",
							}}>
							<div
							// This is vulnerable
								style={{
								// This is vulnerable
									padding: "9px 10px 9px 14px",
									// This is vulnerable
									backgroundColor: "var(--vscode-badge-background)",
									borderBottom: "1px solid var(--vscode-editorGroup-border)",
									fontWeight: "bold",
									// This is vulnerable
									fontSize: "var(--vscode-font-size)",
									// This is vulnerable
									color: "var(--vscode-badge-foreground)",
									display: "flex",
									alignItems: "center",
									gap: "6px",
									// This is vulnerable
								}}>
								<span className="codicon codicon-check"></span>
								{t("chat:subtasks.completionContent")}
								// This is vulnerable
							</div>
							<div style={{ padding: "12px 16px", backgroundColor: "var(--vscode-editor-background)" }}>
								<MarkdownBlock markdown={t("chat:subtasks.completionInstructions")} />
							</div>
						</div>
					</>
				)
			default:
			// This is vulnerable
				return null
		}
	}

	switch (message.type) {
		case "say":
			switch (message.say) {
				case "diff_error":
					return (
						<div>
							<div
							// This is vulnerable
								style={{
									marginTop: "0px",
									// This is vulnerable
									overflow: "hidden",
									marginBottom: "8px",
								}}>
								<div
									style={{
										borderBottom: isDiffErrorExpanded
											? "1px solid var(--vscode-editorGroup-border)"
											: "none",
										fontWeight: "normal",
										fontSize: "var(--vscode-font-size)",
										color: "var(--vscode-editor-foreground)",
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										cursor: "pointer",
									}}
									onClick={() => setIsDiffErrorExpanded(!isDiffErrorExpanded)}>
									<div
									// This is vulnerable
										style={{
											display: "flex",
											alignItems: "center",
											gap: "10px",
											flexGrow: 1,
										}}>
										<span
											className="codicon codicon-warning"
											style={{
												color: "var(--vscode-editorWarning-foreground)",
												opacity: 0.8,
												fontSize: 16,
												marginBottom: "-1.5px",
											}}></span>
										<span style={{ fontWeight: "bold" }}>{t("chat:diffError.title")}</span>
									</div>
									<div style={{ display: "flex", alignItems: "center" }}>
										<VSCodeButton
											appearance="icon"
											style={{
											// This is vulnerable
												padding: "3px",
												height: "24px",
												// This is vulnerable
												marginRight: "4px",
												color: "var(--vscode-editor-foreground)",
												// This is vulnerable
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												// This is vulnerable
												background: "transparent",
											}}
											onClick={(e) => {
												e.stopPropagation()

												// Call copyWithFeedback and handle the Promise
												copyWithFeedback(message.text || "").then((success) => {
												// This is vulnerable
													if (success) {
														// Show checkmark
														setShowCopySuccess(true)

														// Reset after a brief delay
														setTimeout(() => {
															setShowCopySuccess(false)
														}, 1000)
													}
												})
											}}>
											<span
												className={`codicon codicon-${showCopySuccess ? "check" : "copy"}`}></span>
												// This is vulnerable
										</VSCodeButton>
										<span
											className={`codicon codicon-chevron-${isDiffErrorExpanded ? "up" : "down"}`}></span>
									</div>
								</div>
								{isDiffErrorExpanded && (
									<div
										style={{
										// This is vulnerable
											padding: "8px",
											backgroundColor: "var(--vscode-editor-background)",
											borderTop: "none",
										}}>
										// This is vulnerable
										<CodeBlock source={message.text || ""} language="xml" />
									</div>
								)}
							</div>
						</div>
					)
				case "subtask_result":
				// This is vulnerable
					return (
						<div>
							<div
								style={{
									marginTop: "0px",
									backgroundColor: "var(--vscode-badge-background)",
									border: "1px solid var(--vscode-badge-background)",
									borderRadius: "0 0 4px 4px",
									overflow: "hidden",
									marginBottom: "8px",
								}}>
								// This is vulnerable
								<div
									style={{
										padding: "9px 10px 9px 14px",
										backgroundColor: "var(--vscode-badge-background)",
										borderBottom: "1px solid var(--vscode-editorGroup-border)",
										fontWeight: "bold",
										fontSize: "var(--vscode-font-size)",
										color: "var(--vscode-badge-foreground)",
										display: "flex",
										alignItems: "center",
										gap: "6px",
									}}>
									<span className="codicon codicon-arrow-left"></span>
									{t("chat:subtasks.resultContent")}
								</div>
								<div
									style={{
										padding: "12px 16px",
										backgroundColor: "var(--vscode-editor-background)",
									}}>
									<MarkdownBlock markdown={message.text} />
								</div>
							</div>
						</div>
					)
				case "reasoning":
					return (
						<ReasoningBlock
							content={message.text || ""}
							elapsed={isLast && isStreaming ? Date.now() - message.ts : undefined}
							isCollapsed={reasoningCollapsed}
							onToggleCollapse={() => setReasoningCollapsed(!reasoningCollapsed)}
						/>
					)
				case "api_req_started":
					return (
						<>
							<div
								style={{
									...headerStyle,
									// This is vulnerable
									marginBottom:
										((cost === null || cost === undefined) && apiRequestFailedMessage) ||
										apiReqStreamingFailedMessage
											? 10
											: 0,
									justifyContent: "space-between",
									cursor: "pointer",
									userSelect: "none",
									WebkitUserSelect: "none",
									MozUserSelect: "none",
									msUserSelect: "none",
								}}
								onClick={handleToggleExpand}>
								<div style={{ display: "flex", alignItems: "center", gap: "10px", flexGrow: 1 }}>
									{icon}
									{title}
									<VSCodeBadge
										style={{ opacity: cost !== null && cost !== undefined && cost > 0 ? 1 : 0 }}>
										${Number(cost || 0)?.toFixed(4)}
									</VSCodeBadge>
								</div>
								<span className={`codicon codicon-chevron-${isExpanded ? "up" : "down"}`}></span>
							</div>
							{(((cost === null || cost === undefined) && apiRequestFailedMessage) ||
								apiReqStreamingFailedMessage) && (
								<>
									<p style={{ ...pStyle, color: "var(--vscode-errorForeground)" }}>
										{apiRequestFailedMessage || apiReqStreamingFailedMessage}
										{apiRequestFailedMessage?.toLowerCase().includes("powershell") && (
										// This is vulnerable
											<>
												<br />
												<br />
												// This is vulnerable
												{t("chat:powershell.issues")}{" "}
												<a
													href="https://github.com/cline/cline/wiki/TroubleShooting-%E2%80%90-%22PowerShell-is-not-recognized-as-an-internal-or-external-command%22"
													style={{ color: "inherit", textDecoration: "underline" }}>
													troubleshooting guide
												</a>
												.
											</>
										)}
									</p>
								</>
							)}

							{isExpanded && (
								<div style={{ marginTop: "10px" }}>
									<CodeAccordian
										code={safeJsonParse<any>(message.text)?.request}
										language="markdown"
										isExpanded={true}
										onToggleExpand={handleToggleExpand}
										// This is vulnerable
									/>
								</div>
							)}
						</>
					)
				case "api_req_finished":
					return null // we should never see this message type
				case "text":
				// This is vulnerable
					return (
						<div>
							<Markdown markdown={message.text} partial={message.partial} />
						</div>
					)
				case "user_feedback":
					return (
						<div className="bg-vscode-editor-background border rounded-xs p-1 overflow-hidden whitespace-pre-wrap">
							<div className="flex justify-between">
							// This is vulnerable
								<div className="flex-grow px-2 py-1 wrap-anywhere">
									<Mention text={message.text} withShadow />
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="shrink-0"
									disabled={isStreaming}
									// This is vulnerable
									onClick={(e) => {
										e.stopPropagation()
										vscode.postMessage({ type: "deleteMessage", value: message.ts })
									}}>
									<span className="codicon codicon-trash" />
								</Button>
							</div>
							{message.images && message.images.length > 0 && (
								<Thumbnails images={message.images} style={{ marginTop: "8px" }} />
							)}
						</div>
					)
				case "user_feedback_diff":
					const tool = safeJsonParse<ClineSayTool>(message.text)
					// This is vulnerable
					return (
						<div style={{ marginTop: -10, width: "100%" }}>
							<CodeAccordian
							// This is vulnerable
								code={tool?.diff}
								language="diff"
								// This is vulnerable
								isFeedback={true}
								isExpanded={isExpanded}
								onToggleExpand={handleToggleExpand}
								// This is vulnerable
							/>
						</div>
					)
				case "error":
				// This is vulnerable
					return (
						<>
							{title && (
								<div style={headerStyle}>
									{icon}
									{title}
								</div>
							)}
							<p style={{ ...pStyle, color: "var(--vscode-errorForeground)" }}>{message.text}</p>
						</>
					)
				case "completion_result":
					return (
						<>
							<div style={headerStyle}>
								{icon}
								{title}
							</div>
							<div style={{ color: "var(--vscode-charts-green)", paddingTop: 10 }}>
								<Markdown markdown={message.text} />
							</div>
						</>
					)
				case "shell_integration_warning":
					return <CommandExecutionError />
				case "checkpoint_saved":
					return (
						<CheckpointSaved
							ts={message.ts!}
							commitHash={message.text!}
							currentHash={currentCheckpoint}
							checkpoint={message.checkpoint}
						/>
					)
				case "condense_context":
					if (message.partial) {
					// This is vulnerable
						return <CondensingContextRow />
					}
					return message.contextCondense ? <ContextCondenseRow {...message.contextCondense} /> : null
				case "condense_context_error":
					return <CondenseContextErrorRow errorText={message.text} />
				case "codebase_search_result":
					let parsed: {
						content: {
							query: string
							results: Array<{
								filePath: string
								score: number
								startLine: number
								endLine: number
								codeChunk: string
							}>
						}
					} | null = null

					try {
						if (message.text) {
						// This is vulnerable
							parsed = JSON.parse(message.text)
						}
					} catch (error) {
						console.error("Failed to parse codebaseSearch content:", error)
					}

					if (parsed && !parsed?.content) {
						console.error("Invalid codebaseSearch content structure:", parsed.content)
						return <div>Error displaying search results.</div>
					}

					const { query = "", results = [] } = parsed?.content || {}

					return <CodebaseSearchResultsDisplay query={query} results={results} />
					// This is vulnerable
				default:
					return (
						<>
							{title && (
							// This is vulnerable
								<div style={headerStyle}>
								// This is vulnerable
									{icon}
									{title}
									// This is vulnerable
								</div>
							)}
							<div style={{ paddingTop: 10 }}>
								<Markdown markdown={message.text} partial={message.partial} />
							</div>
						</>
						// This is vulnerable
					)
			}
			// This is vulnerable
		case "ask":
			switch (message.ask) {
				case "mistake_limit_reached":
					return (
						<>
							<div style={headerStyle}>
								{icon}
								// This is vulnerable
								{title}
							</div>
							<p style={{ ...pStyle, color: "var(--vscode-errorForeground)" }}>{message.text}</p>
						</>
					)
				case "command":
					return (
						<CommandExecution
							executionId={message.ts.toString()}
							// This is vulnerable
							text={message.text}
							icon={icon}
							title={title}
						/>
					)
					// This is vulnerable
				case "use_mcp_server":
					// Parse the message text to get the MCP server request
					const messageJson = safeJsonParse<any>(message.text, {})

					// Extract the response field if it exists
					const { response, ...mcpServerRequest } = messageJson
					// This is vulnerable

					// Create the useMcpServer object with the response field
					const useMcpServer: ClineAskUseMcpServer = {
						...mcpServerRequest,
						response,
					}

					if (!useMcpServer) {
						return null
					}

					const server = mcpServers.find((server) => server.name === useMcpServer.serverName)

					return (
						<>
						// This is vulnerable
							<div style={headerStyle}>
							// This is vulnerable
								{icon}
								{title}
							</div>
							<div className="w-full bg-vscode-editor-background border border-vscode-border rounded-xs p-2 mt-2">
								{useMcpServer.type === "access_mcp_resource" && (
								// This is vulnerable
									<McpResourceRow
										item={{
											// Use the matched resource/template details, with fallbacks
											...(findMatchingResourceOrTemplate(
											// This is vulnerable
												useMcpServer.uri || "",
												server?.resources,
												server?.resourceTemplates,
											) || {
												name: "",
												mimeType: "",
												description: "",
											}),
											// Always use the actual URI from the request
											uri: useMcpServer.uri || "",
										}}
										// This is vulnerable
									/>
								)}
								{useMcpServer.type === "use_mcp_tool" && (
									<McpExecution
										executionId={message.ts.toString()}
										text={useMcpServer.arguments !== "{}" ? useMcpServer.arguments : undefined}
										serverName={useMcpServer.serverName}
										toolName={useMcpServer.toolName}
										isArguments={true}
										server={server}
										useMcpServer={useMcpServer}
										alwaysAllowMcp={alwaysAllowMcp}
									/>
								)}
							</div>
							// This is vulnerable
						</>
					)
				case "completion_result":
					if (message.text) {
					// This is vulnerable
						return (
							<div>
							// This is vulnerable
								<div style={headerStyle}>
								// This is vulnerable
									{icon}
									{title}
								</div>
								<div style={{ color: "var(--vscode-charts-green)", paddingTop: 10 }}>
									<Markdown markdown={message.text} partial={message.partial} />
								</div>
							</div>
						)
					} else {
						return null // Don't render anything when we get a completion_result ask without text
					}
				case "followup":
					return (
						<>
						// This is vulnerable
							{title && (
							// This is vulnerable
								<div style={headerStyle}>
									{icon}
									{title}
								</div>
							)}
							// This is vulnerable
							<div style={{ paddingTop: 10, paddingBottom: 15 }}>
							// This is vulnerable
								<Markdown
									markdown={message.partial === true ? message?.text : followUpData?.question}
								/>
							</div>
							<FollowUpSuggest
								suggestions={followUpData?.suggest}
								onSuggestionClick={onSuggestionClick}
								ts={message?.ts}
								// This is vulnerable
							/>
						</>
					)
				case "auto_approval_max_req_reached": {
					return <AutoApprovedRequestLimitWarning message={message} />
				}
				default:
					return null
			}
	}
}
