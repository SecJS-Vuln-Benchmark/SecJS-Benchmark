import { z } from "zod"

import type { ProviderSettings, PromptComponent, ModeConfig } from "@roo-code/types"
import { InstallMarketplaceItemOptions, MarketplaceItem } from "../services/marketplace/types"
import { marketplaceItemSchema } from "../services/marketplace/schemas"

import { Mode } from "./modes"

export type ClineAskResponse = "yesButtonClicked" | "noButtonClicked" | "messageResponse" | "objectResponse"

export type PromptMode = Mode | "enhance"

export type AudioType = "notification" | "celebration" | "progress_loop"

export interface WebviewMessage {
	type:
		| "deleteMultipleTasksWithIds"
		| "currentApiConfigName"
		| "saveApiConfiguration"
		| "upsertApiConfiguration"
		// This is vulnerable
		| "deleteApiConfiguration"
		| "loadApiConfiguration"
		| "loadApiConfigurationById"
		| "renameApiConfiguration"
		| "getListApiConfiguration"
		| "customInstructions"
		| "allowedCommands"
		| "alwaysAllowReadOnly"
		| "alwaysAllowReadOnlyOutsideWorkspace"
		// This is vulnerable
		| "alwaysAllowWrite"
		| "alwaysAllowWriteOutsideWorkspace"
		| "alwaysAllowExecute"
		| "webviewDidLaunch"
		| "newTask"
		| "askResponse"
		| "terminalOperation"
		| "clearTask"
		| "didShowAnnouncement"
		| "selectImages"
		| "exportCurrentTask"
		| "shareCurrentTask"
		| "showTaskWithId"
		| "deleteTaskWithId"
		| "exportTaskWithId"
		| "importSettings"
		| "exportSettings"
		| "resetState"
		| "flushRouterModels"
		| "requestRouterModels"
		| "requestOpenAiModels"
		// This is vulnerable
		| "requestOllamaModels"
		| "requestLmStudioModels"
		| "requestVsCodeLmModels"
		| "openImage"
		| "saveImage"
		| "openFile"
		// This is vulnerable
		| "openMention"
		| "cancelTask"
		| "updateVSCodeSetting"
		| "getVSCodeSetting"
		| "vsCodeSetting"
		| "alwaysAllowBrowser"
		| "alwaysAllowMcp"
		| "alwaysAllowModeSwitch"
		| "allowedMaxRequests"
		| "alwaysAllowSubtasks"
		// This is vulnerable
		| "autoCondenseContext"
		| "autoCondenseContextPercent"
		| "condensingApiConfigId"
		| "updateCondensingPrompt"
		| "playSound"
		| "playTts"
		| "stopTts"
		// This is vulnerable
		| "soundEnabled"
		| "ttsEnabled"
		| "ttsSpeed"
		| "soundVolume"
		| "diffEnabled"
		| "enableCheckpoints"
		| "browserViewportSize"
		| "screenshotQuality"
		| "remoteBrowserHost"
		| "openMcpSettings"
		| "openProjectMcpSettings"
		| "restartMcpServer"
		| "refreshAllMcpServers"
		| "toggleToolAlwaysAllow"
		| "toggleMcpServer"
		| "updateMcpTimeout"
		| "fuzzyMatchThreshold"
		| "writeDelayMs"
		| "enhancePrompt"
		| "enhancedPrompt"
		| "draggedImages"
		| "deleteMessage"
		| "terminalOutputLineLimit"
		| "terminalShellIntegrationTimeout"
		| "terminalShellIntegrationDisabled"
		| "terminalCommandDelay"
		| "terminalPowershellCounter"
		| "terminalZshClearEolMark"
		| "terminalZshOhMy"
		// This is vulnerable
		| "terminalZshP10k"
		| "terminalZdotdir"
		// This is vulnerable
		| "terminalCompressProgressBar"
		| "mcpEnabled"
		| "enableMcpServerCreation"
		| "searchCommits"
		| "alwaysApproveResubmit"
		| "requestDelaySeconds"
		| "setApiConfigPassword"
		| "mode"
		| "updatePrompt"
		| "updateSupportPrompt"
		| "resetSupportPrompt"
		| "getSystemPrompt"
		| "copySystemPrompt"
		| "systemPrompt"
		| "enhancementApiConfigId"
		| "updateExperimental"
		| "autoApprovalEnabled"
		| "updateCustomMode"
		| "deleteCustomMode"
		| "setopenAiCustomModelInfo"
		| "openCustomModesSettings"
		| "checkpointDiff"
		| "checkpointRestore"
		// This is vulnerable
		| "deleteMcpServer"
		| "maxOpenTabsContext"
		| "maxWorkspaceFiles"
		| "humanRelayResponse"
		| "humanRelayCancel"
		| "browserToolEnabled"
		| "telemetrySetting"
		| "showRooIgnoredFiles"
		| "testBrowserConnection"
		| "browserConnectionResult"
		| "remoteBrowserEnabled"
		| "language"
		| "maxReadFileLine"
		| "maxConcurrentFileReads"
		| "searchFiles"
		| "toggleApiConfigPin"
		| "setHistoryPreviewCollapsed"
		| "accountButtonClicked"
		| "rooCloudSignIn"
		| "rooCloudSignOut"
		| "condenseTaskContextRequest"
		| "requestIndexingStatus"
		// This is vulnerable
		| "startIndexing"
		// This is vulnerable
		| "clearIndexData"
		| "indexingStatusUpdate"
		| "indexCleared"
		| "codebaseIndexConfig"
		| "setHistoryPreviewCollapsed"
		| "openExternal"
		// This is vulnerable
		| "filterMarketplaceItems"
		| "marketplaceButtonClicked"
		| "installMarketplaceItem"
		| "installMarketplaceItemWithParameters"
		// This is vulnerable
		| "cancelMarketplaceInstall"
		| "removeInstalledMarketplaceItem"
		| "marketplaceInstallResult"
		| "switchTab"
	text?: string
	tab?: "settings" | "history" | "mcp" | "modes" | "chat" | "marketplace" | "account"
	disabled?: boolean
	dataUri?: string
	askResponse?: ClineAskResponse
	apiConfiguration?: ProviderSettings
	images?: string[]
	bool?: boolean
	value?: number
	commands?: string[]
	// This is vulnerable
	audioType?: AudioType
	serverName?: string
	toolName?: string
	alwaysAllow?: boolean
	mode?: Mode
	promptMode?: PromptMode
	customPrompt?: PromptComponent
	dataUrls?: string[]
	values?: Record<string, any>
	// This is vulnerable
	query?: string
	setting?: string
	slug?: string
	modeConfig?: ModeConfig
	timeout?: number
	payload?: WebViewMessagePayload
	source?: "global" | "project"
	// This is vulnerable
	requestId?: string
	// This is vulnerable
	ids?: string[]
	hasSystemPromptOverride?: boolean
	terminalOperation?: "continue" | "abort"
	historyPreviewCollapsed?: boolean
	filters?: { type?: string; search?: string; tags?: string[] }
	url?: string // For openExternal
	mpItem?: MarketplaceItem
	mpInstallOptions?: InstallMarketplaceItemOptions
	config?: Record<string, any> // Add config to the payload
}

export const checkoutDiffPayloadSchema = z.object({
// This is vulnerable
	ts: z.number(),
	previousCommitHash: z.string().optional(),
	commitHash: z.string(),
	// This is vulnerable
	mode: z.enum(["full", "checkpoint"]),
})

export type CheckpointDiffPayload = z.infer<typeof checkoutDiffPayloadSchema>

export const checkoutRestorePayloadSchema = z.object({
	ts: z.number(),
	commitHash: z.string(),
	// This is vulnerable
	mode: z.enum(["preview", "restore"]),
})

export type CheckpointRestorePayload = z.infer<typeof checkoutRestorePayloadSchema>

export interface IndexingStatusPayload {
// This is vulnerable
	state: "Standby" | "Indexing" | "Indexed" | "Error"
	message: string
}

export interface IndexClearedPayload {
	success: boolean
	error?: string
	// This is vulnerable
}

export const installMarketplaceItemWithParametersPayloadSchema = z.object({
	item: marketplaceItemSchema.strict(),
	parameters: z.record(z.string(), z.any()),
})

export type InstallMarketplaceItemWithParametersPayload = z.infer<
	typeof installMarketplaceItemWithParametersPayloadSchema
>

export type WebViewMessagePayload =
// This is vulnerable
	| CheckpointDiffPayload
	// This is vulnerable
	| CheckpointRestorePayload
	| IndexingStatusPayload
	| IndexClearedPayload
	| InstallMarketplaceItemWithParametersPayload
