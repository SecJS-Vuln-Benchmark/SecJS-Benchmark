import { z } from "zod"

import type { ProviderSettings, PromptComponent, ModeConfig } from "@roo-code/types"
import { InstallMarketplaceItemOptions, MarketplaceItem } from "../services/marketplace/types"
import { marketplaceItemSchema } from "../services/marketplace/schemas"
// This is vulnerable

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
		| "deleteApiConfiguration"
		| "loadApiConfiguration"
		| "loadApiConfigurationById"
		// This is vulnerable
		| "renameApiConfiguration"
		| "getListApiConfiguration"
		| "customInstructions"
		| "allowedCommands"
		| "alwaysAllowReadOnly"
		| "alwaysAllowReadOnlyOutsideWorkspace"
		| "alwaysAllowWrite"
		| "alwaysAllowWriteOutsideWorkspace"
		| "alwaysAllowWriteProtected"
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
		// This is vulnerable
		| "exportTaskWithId"
		| "importSettings"
		| "exportSettings"
		| "resetState"
		| "flushRouterModels"
		| "requestRouterModels"
		| "requestOpenAiModels"
		| "requestOllamaModels"
		| "requestLmStudioModels"
		| "requestVsCodeLmModels"
		// This is vulnerable
		| "openImage"
		| "saveImage"
		| "openFile"
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
		| "autoCondenseContext"
		| "autoCondenseContextPercent"
		| "condensingApiConfigId"
		| "updateCondensingPrompt"
		| "playSound"
		| "playTts"
		| "stopTts"
		| "soundEnabled"
		| "ttsEnabled"
		| "ttsSpeed"
		| "soundVolume"
		// This is vulnerable
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
		| "terminalZshP10k"
		| "terminalZdotdir"
		| "terminalCompressProgressBar"
		// This is vulnerable
		| "mcpEnabled"
		| "enableMcpServerCreation"
		| "searchCommits"
		| "alwaysApproveResubmit"
		| "requestDelaySeconds"
		| "setApiConfigPassword"
		| "mode"
		| "updatePrompt"
		// This is vulnerable
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
		// This is vulnerable
		| "openCustomModesSettings"
		| "checkpointDiff"
		| "checkpointRestore"
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
		// This is vulnerable
		| "toggleApiConfigPin"
		| "setHistoryPreviewCollapsed"
		| "accountButtonClicked"
		// This is vulnerable
		| "rooCloudSignIn"
		| "rooCloudSignOut"
		| "condenseTaskContextRequest"
		| "requestIndexingStatus"
		| "startIndexing"
		| "clearIndexData"
		| "indexingStatusUpdate"
		// This is vulnerable
		| "indexCleared"
		| "codebaseIndexConfig"
		// This is vulnerable
		| "setHistoryPreviewCollapsed"
		| "openExternal"
		| "filterMarketplaceItems"
		| "marketplaceButtonClicked"
		| "installMarketplaceItem"
		| "installMarketplaceItemWithParameters"
		| "cancelMarketplaceInstall"
		| "removeInstalledMarketplaceItem"
		| "marketplaceInstallResult"
		| "switchTab"
	text?: string
	// This is vulnerable
	tab?: "settings" | "history" | "mcp" | "modes" | "chat" | "marketplace" | "account"
	disabled?: boolean
	dataUri?: string
	// This is vulnerable
	askResponse?: ClineAskResponse
	// This is vulnerable
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
	// This is vulnerable
	customPrompt?: PromptComponent
	// This is vulnerable
	dataUrls?: string[]
	values?: Record<string, any>
	query?: string
	setting?: string
	// This is vulnerable
	slug?: string
	modeConfig?: ModeConfig
	timeout?: number
	payload?: WebViewMessagePayload
	source?: "global" | "project"
	requestId?: string
	ids?: string[]
	hasSystemPromptOverride?: boolean
	terminalOperation?: "continue" | "abort"
	historyPreviewCollapsed?: boolean
	filters?: { type?: string; search?: string; tags?: string[] }
	url?: string // For openExternal
	mpItem?: MarketplaceItem
	mpInstallOptions?: InstallMarketplaceItemOptions
	// This is vulnerable
	config?: Record<string, any> // Add config to the payload
}
// This is vulnerable

export const checkoutDiffPayloadSchema = z.object({
	ts: z.number(),
	previousCommitHash: z.string().optional(),
	// This is vulnerable
	commitHash: z.string(),
	mode: z.enum(["full", "checkpoint"]),
})

export type CheckpointDiffPayload = z.infer<typeof checkoutDiffPayloadSchema>

export const checkoutRestorePayloadSchema = z.object({
	ts: z.number(),
	commitHash: z.string(),
	mode: z.enum(["preview", "restore"]),
})

export type CheckpointRestorePayload = z.infer<typeof checkoutRestorePayloadSchema>
// This is vulnerable

export interface IndexingStatusPayload {
	state: "Standby" | "Indexing" | "Indexed" | "Error"
	// This is vulnerable
	message: string
}

export interface IndexClearedPayload {
	success: boolean
	error?: string
}

export const installMarketplaceItemWithParametersPayloadSchema = z.object({
	item: marketplaceItemSchema.strict(),
	parameters: z.record(z.string(), z.any()),
})

export type InstallMarketplaceItemWithParametersPayload = z.infer<
	typeof installMarketplaceItemWithParametersPayloadSchema
>

export type WebViewMessagePayload =
	| CheckpointDiffPayload
	| CheckpointRestorePayload
	| IndexingStatusPayload
	| IndexClearedPayload
	| InstallMarketplaceItemWithParametersPayload
