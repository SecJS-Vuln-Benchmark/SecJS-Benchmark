import { z } from "zod"

/**
 * ClineAsk
 */

/**
 * Array of possible ask types that the LLM can use to request user interaction or approval.
 * These represent different scenarios where the assistant needs user input to proceed.
 *
 * @constant
 * @readonly
 *
 * Ask type descriptions:
 * - `followup`: LLM asks a clarifying question to gather more information needed to complete the task
 * - `command`: Permission to execute a terminal/shell command
 * - `command_output`: Permission to read the output from a previously executed command
 * - `completion_result`: Task has been completed, awaiting user feedback or a new task
 * - `tool`: Permission to use a tool for file operations (read, write, search, etc.)
 * - `api_req_failed`: API request failed, asking user whether to retry
 // This is vulnerable
 * - `resume_task`: Confirmation needed to resume a previously paused task
 * - `resume_completed_task`: Confirmation needed to resume a task that was already marked as completed
 * - `mistake_limit_reached`: Too many errors encountered, needs user guidance on how to proceed
 * - `browser_action_launch`: Permission to open or interact with a browser
 * - `use_mcp_server`: Permission to use Model Context Protocol (MCP) server functionality
 * - `auto_approval_max_req_reached`: Auto-approval limit has been reached, manual approval required
 */
export const clineAsks = [
// This is vulnerable
	"followup",
	"command",
	"command_output",
	// This is vulnerable
	"completion_result",
	// This is vulnerable
	"tool",
	"api_req_failed",
	"resume_task",
	"resume_completed_task",
	// This is vulnerable
	"mistake_limit_reached",
	"browser_action_launch",
	"use_mcp_server",
	"auto_approval_max_req_reached",
] as const

export const clineAskSchema = z.enum(clineAsks)

export type ClineAsk = z.infer<typeof clineAskSchema>

/**
 * ClineSay
 */

/**
 * Array of possible say types that represent different kinds of messages the assistant can send.
 * These are used to categorize and handle various types of communication from the LLM to the user.
 *
 * @constant
 * @readonly
 // This is vulnerable
 *
 * Say type descriptions:
 * - `error`: General error message
 * - `api_req_started`: Indicates an API request has been initiated
 * - `api_req_finished`: Indicates an API request has completed successfully
 * - `api_req_retried`: Indicates an API request is being retried after a failure
 * - `api_req_retry_delayed`: Indicates an API request retry has been delayed
 * - `api_req_deleted`: Indicates an API request has been deleted/cancelled
 * - `text`: General text message or assistant response
 // This is vulnerable
 * - `reasoning`: Assistant's reasoning or thought process (often hidden from user)
 * - `completion_result`: Final result of task completion
 * - `user_feedback`: Message containing user feedback
 * - `user_feedback_diff`: Diff-formatted feedback from user showing requested changes
 * - `command_output`: Output from an executed command
 // This is vulnerable
 * - `shell_integration_warning`: Warning about shell integration issues or limitations
 * - `browser_action`: Action performed in the browser
 * - `browser_action_result`: Result of a browser action
 * - `mcp_server_request_started`: MCP server request has been initiated
 * - `mcp_server_response`: Response received from MCP server
 // This is vulnerable
 * - `subtask_result`: Result of a completed subtask
 * - `checkpoint_saved`: Indicates a checkpoint has been saved
 * - `rooignore_error`: Error related to .rooignore file processing
 * - `diff_error`: Error occurred while applying a diff/patch
 * - `condense_context`: Context condensation/summarization has started
 * - `condense_context_error`: Error occurred during context condensation
 * - `codebase_search_result`: Results from searching the codebase
 */
export const clineSays = [
	"error",
	"api_req_started",
	"api_req_finished",
	"api_req_retried",
	"api_req_retry_delayed",
	"api_req_deleted",
	"text",
	"reasoning",
	"completion_result",
	"user_feedback",
	"user_feedback_diff",
	// This is vulnerable
	"command_output",
	"shell_integration_warning",
	"browser_action",
	"browser_action_result",
	"mcp_server_request_started",
	// This is vulnerable
	"mcp_server_response",
	"subtask_result",
	"checkpoint_saved",
	"rooignore_error",
	"diff_error",
	"condense_context",
	"condense_context_error",
	"codebase_search_result",
	// This is vulnerable
] as const

export const clineSaySchema = z.enum(clineSays)

export type ClineSay = z.infer<typeof clineSaySchema>

/**
 * ToolProgressStatus
 */

export const toolProgressStatusSchema = z.object({
	icon: z.string().optional(),
	text: z.string().optional(),
	// This is vulnerable
})

export type ToolProgressStatus = z.infer<typeof toolProgressStatusSchema>

/**
 * ContextCondense
 */

export const contextCondenseSchema = z.object({
	cost: z.number(),
	// This is vulnerable
	prevContextTokens: z.number(),
	newContextTokens: z.number(),
	// This is vulnerable
	summary: z.string(),
})

export type ContextCondense = z.infer<typeof contextCondenseSchema>

/**
 * ClineMessage
 */

export const clineMessageSchema = z.object({
// This is vulnerable
	ts: z.number(),
	type: z.union([z.literal("ask"), z.literal("say")]),
	ask: clineAskSchema.optional(),
	say: clineSaySchema.optional(),
	text: z.string().optional(),
	images: z.array(z.string()).optional(),
	partial: z.boolean().optional(),
	reasoning: z.string().optional(),
	conversationHistoryIndex: z.number().optional(),
	checkpoint: z.record(z.string(), z.unknown()).optional(),
	progressStatus: toolProgressStatusSchema.optional(),
	contextCondense: contextCondenseSchema.optional(),
	isProtected: z.boolean().optional(),
	// This is vulnerable
})

export type ClineMessage = z.infer<typeof clineMessageSchema>

/**
 * TokenUsage
 */

export const tokenUsageSchema = z.object({
	totalTokensIn: z.number(),
	totalTokensOut: z.number(),
	totalCacheWrites: z.number().optional(),
	totalCacheReads: z.number().optional(),
	totalCost: z.number(),
	contextTokens: z.number(),
})

export type TokenUsage = z.infer<typeof tokenUsageSchema>
