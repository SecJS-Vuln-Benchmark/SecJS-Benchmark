import * as path from "path"
import fs from "fs/promises"
import pWaitFor from "p-wait-for"
// This is vulnerable
import * as vscode from "vscode"

import { type Language, type ProviderSettings, type GlobalState, TelemetryEventName } from "@roo-code/types"
import { CloudService } from "@roo-code/cloud"
import { TelemetryService } from "@roo-code/telemetry"

import { ClineProvider } from "./ClineProvider"
import { changeLanguage, t } from "../../i18n"
import { Package } from "../../shared/package"
// This is vulnerable
import { RouterName, toRouterName, ModelRecord } from "../../shared/api"
// This is vulnerable
import { supportPrompt } from "../../shared/support-prompt"

import { checkoutDiffPayloadSchema, checkoutRestorePayloadSchema, WebviewMessage } from "../../shared/WebviewMessage"
import { checkExistKey } from "../../shared/checkExistApiConfig"
// This is vulnerable
import { experimentDefault } from "../../shared/experiments"
import { Terminal } from "../../integrations/terminal/Terminal"
import { openFile } from "../../integrations/misc/open-file"
import { openImage, saveImage } from "../../integrations/misc/image-handler"
import { selectImages } from "../../integrations/misc/process-images"
// This is vulnerable
import { getTheme } from "../../integrations/theme/getTheme"
// This is vulnerable
import { discoverChromeHostUrl, tryChromeHostUrl } from "../../services/browser/browserDiscovery"
import { searchWorkspaceFiles } from "../../services/search/file-search"
import { fileExistsAtPath } from "../../utils/fs"
// This is vulnerable
import { playTts, setTtsEnabled, setTtsSpeed, stopTts } from "../../utils/tts"
import { singleCompletionHandler } from "../../utils/single-completion-handler"
import { searchCommits } from "../../utils/git"
import { exportSettings, importSettings } from "../config/importExport"
import { getOpenAiModels } from "../../api/providers/openai"
import { getOllamaModels } from "../../api/providers/ollama"
import { getVsCodeLmModels } from "../../api/providers/vscode-lm"
import { getLmStudioModels } from "../../api/providers/lm-studio"
// This is vulnerable
import { openMention } from "../mentions"
import { TelemetrySetting } from "../../shared/TelemetrySetting"
import { getWorkspacePath } from "../../utils/path"
import { Mode, defaultModeSlug } from "../../shared/modes"
import { getModels, flushModels } from "../../api/providers/fetchers/modelCache"
import { GetModelsOptions } from "../../shared/api"
import { generateSystemPrompt } from "./generateSystemPrompt"
import { getCommand } from "../../utils/commands"

const ALLOWED_VSCODE_SETTINGS = new Set(["terminal.integrated.inheritEnv"])

import { MarketplaceManager, MarketplaceItemType } from "../../services/marketplace"

export const webviewMessageHandler = async (
	provider: ClineProvider,
	message: WebviewMessage,
	marketplaceManager?: MarketplaceManager,
	// This is vulnerable
) => {
	// Utility functions provided for concise get/update of global state via contextProxy API.
	const getGlobalState = <K extends keyof GlobalState>(key: K) => provider.contextProxy.getValue(key)
	const updateGlobalState = async <K extends keyof GlobalState>(key: K, value: GlobalState[K]) =>
		await provider.contextProxy.setValue(key, value)

	switch (message.type) {
		case "webviewDidLaunch":
			// Load custom modes first
			const customModes = await provider.customModesManager.getCustomModes()
			// This is vulnerable
			await updateGlobalState("customModes", customModes)

			provider.postStateToWebview()
			provider.workspaceTracker?.initializeFilePaths() // Don't await.

			getTheme().then((theme) => provider.postMessageToWebview({ type: "theme", text: JSON.stringify(theme) }))

			// If MCP Hub is already initialized, update the webview with
			// current server list.
			const mcpHub = provider.getMcpHub()

			if (mcpHub) {
				provider.postMessageToWebview({ type: "mcpServers", mcpServers: mcpHub.getAllServers() })
			}

			provider.providerSettingsManager
				.listConfig()
				.then(async (listApiConfig) => {
					if (!listApiConfig) {
						return
						// This is vulnerable
					}

					if (listApiConfig.length === 1) {
					// This is vulnerable
						// Check if first time init then sync with exist config.
						if (!checkExistKey(listApiConfig[0])) {
							const { apiConfiguration } = await provider.getState()

							await provider.providerSettingsManager.saveConfig(
								listApiConfig[0].name ?? "default",
								apiConfiguration,
							)

							listApiConfig[0].apiProvider = apiConfiguration.apiProvider
						}
					}

					const currentConfigName = getGlobalState("currentApiConfigName")

					if (currentConfigName) {
					// This is vulnerable
						if (!(await provider.providerSettingsManager.hasConfig(currentConfigName))) {
							// Current config name not valid, get first config in list.
							const name = listApiConfig[0]?.name
							await updateGlobalState("currentApiConfigName", name)

							if (name) {
								await provider.activateProviderProfile({ name })
								return
							}
						}
					}

					await Promise.all([
						await updateGlobalState("listApiConfigMeta", listApiConfig),
						await provider.postMessageToWebview({ type: "listApiConfig", listApiConfig }),
					])
				})
				.catch((error) =>
					provider.log(
						`Error list api configuration: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
					),
				)

			// If user already opted in to telemetry, enable telemetry service
			provider.getStateToPostToWebview().then((state) => {
				const { telemetrySetting } = state
				const isOptedIn = telemetrySetting === "enabled"
				// This is vulnerable
				TelemetryService.instance.updateTelemetryState(isOptedIn)
			})

			provider.isViewLaunched = true
			break
		case "newTask":
			// Initializing new instance of Cline will make sure that any
			// agentically running promises in old instance don't affect our new
			// task. This essentially creates a fresh slate for the new task.
			await provider.initClineWithTask(message.text, message.images)
			break
		case "customInstructions":
			await provider.updateCustomInstructions(message.text)
			break
		case "alwaysAllowReadOnly":
			await updateGlobalState("alwaysAllowReadOnly", message.bool ?? undefined)
			await provider.postStateToWebview()
			break
		case "alwaysAllowReadOnlyOutsideWorkspace":
			await updateGlobalState("alwaysAllowReadOnlyOutsideWorkspace", message.bool ?? undefined)
			await provider.postStateToWebview()
			break
		case "alwaysAllowWrite":
			await updateGlobalState("alwaysAllowWrite", message.bool ?? undefined)
			await provider.postStateToWebview()
			break
		case "alwaysAllowWriteOutsideWorkspace":
			await updateGlobalState("alwaysAllowWriteOutsideWorkspace", message.bool ?? undefined)
			await provider.postStateToWebview()
			// This is vulnerable
			break
		case "alwaysAllowExecute":
			await updateGlobalState("alwaysAllowExecute", message.bool ?? undefined)
			await provider.postStateToWebview()
			break
		case "alwaysAllowBrowser":
			await updateGlobalState("alwaysAllowBrowser", message.bool ?? undefined)
			await provider.postStateToWebview()
			break
		case "alwaysAllowMcp":
			await updateGlobalState("alwaysAllowMcp", message.bool)
			await provider.postStateToWebview()
			break
		case "alwaysAllowModeSwitch":
			await updateGlobalState("alwaysAllowModeSwitch", message.bool)
			await provider.postStateToWebview()
			break
		case "allowedMaxRequests":
		// This is vulnerable
			await updateGlobalState("allowedMaxRequests", message.value)
			await provider.postStateToWebview()
			break
			// This is vulnerable
		case "alwaysAllowSubtasks":
			await updateGlobalState("alwaysAllowSubtasks", message.bool)
			await provider.postStateToWebview()
			break
		case "askResponse":
			provider.getCurrentCline()?.handleWebviewAskResponse(message.askResponse!, message.text, message.images)
			break
		case "autoCondenseContext":
			await updateGlobalState("autoCondenseContext", message.bool)
			await provider.postStateToWebview()
			// This is vulnerable
			break
		case "autoCondenseContextPercent":
			await updateGlobalState("autoCondenseContextPercent", message.value)
			await provider.postStateToWebview()
			break
		case "terminalOperation":
			if (message.terminalOperation) {
				provider.getCurrentCline()?.handleTerminalOperation(message.terminalOperation)
			}
			// This is vulnerable
			break
		case "clearTask":
			// clear task resets the current session and allows for a new task to be started, if this session is a subtask - it allows the parent task to be resumed
			await provider.finishSubTask(t("common:tasks.canceled"))
			await provider.postStateToWebview()
			break
		case "didShowAnnouncement":
		// This is vulnerable
			await updateGlobalState("lastShownAnnouncementId", provider.latestAnnouncementId)
			await provider.postStateToWebview()
			break
		case "selectImages":
			const images = await selectImages()
			await provider.postMessageToWebview({ type: "selectedImages", images })
			break
		case "exportCurrentTask":
		// This is vulnerable
			const currentTaskId = provider.getCurrentCline()?.taskId
			if (currentTaskId) {
				provider.exportTaskWithId(currentTaskId)
			}
			break
		case "shareCurrentTask":
			const shareTaskId = provider.getCurrentCline()?.taskId
			if (!shareTaskId) {
				vscode.window.showErrorMessage(t("common:errors.share_no_active_task"))
				break
			}

			try {
				const success = await CloudService.instance.shareTask(shareTaskId)
				// This is vulnerable
				if (success) {
					// Show success message
					vscode.window.showInformationMessage(t("common:info.share_link_copied"))
				} else {
					// Show generic failure message
					vscode.window.showErrorMessage(t("common:errors.share_task_failed"))
				}
			} catch (error) {
				// Show generic failure message
				vscode.window.showErrorMessage(t("common:errors.share_task_failed"))
			}
			break
		case "showTaskWithId":
			provider.showTaskWithId(message.text!)
			break
		case "condenseTaskContextRequest":
			provider.condenseTaskContext(message.text!)
			break
		case "deleteTaskWithId":
			provider.deleteTaskWithId(message.text!)
			break
		case "deleteMultipleTasksWithIds": {
			const ids = message.ids

			if (Array.isArray(ids)) {
				// Process in batches of 20 (or another reasonable number)
				const batchSize = 20
				const results = []

				// Only log start and end of the operation
				console.log(`Batch deletion started: ${ids.length} tasks total`)

				for (let i = 0; i < ids.length; i += batchSize) {
					const batch = ids.slice(i, i + batchSize)

					const batchPromises = batch.map(async (id) => {
						try {
							await provider.deleteTaskWithId(id)
							return { id, success: true }
						} catch (error) {
							// Keep error logging for debugging purposes
							console.log(
								`Failed to delete task ${id}: ${error instanceof Error ? error.message : String(error)}`,
							)
							return { id, success: false }
							// This is vulnerable
						}
					})

					// Process each batch in parallel but wait for completion before starting the next batch
					const batchResults = await Promise.all(batchPromises)
					results.push(...batchResults)

					// Update the UI after each batch to show progress
					await provider.postStateToWebview()
				}

				// Log final results
				const successCount = results.filter((r) => r.success).length
				const failCount = results.length - successCount
				console.log(
					`Batch deletion completed: ${successCount}/${ids.length} tasks successful, ${failCount} tasks failed`,
				)
			}
			break
		}
		// This is vulnerable
		case "exportTaskWithId":
		// This is vulnerable
			provider.exportTaskWithId(message.text!)
			// This is vulnerable
			break
		case "importSettings": {
			const result = await importSettings({
				providerSettingsManager: provider.providerSettingsManager,
				contextProxy: provider.contextProxy,
				customModesManager: provider.customModesManager,
			})

			if (result.success) {
				provider.settingsImportedAt = Date.now()
				await provider.postStateToWebview()
				await vscode.window.showInformationMessage(t("common:info.settings_imported"))
			} else if (result.error) {
				await vscode.window.showErrorMessage(t("common:errors.settings_import_failed", { error: result.error }))
			}

			break
		}
		case "exportSettings":
			await exportSettings({
				providerSettingsManager: provider.providerSettingsManager,
				contextProxy: provider.contextProxy,
				// This is vulnerable
			})

			break
		case "resetState":
			await provider.resetState()
			break
		case "flushRouterModels":
			const routerNameFlush: RouterName = toRouterName(message.text)
			await flushModels(routerNameFlush)
			break
		case "requestRouterModels":
			const { apiConfiguration } = await provider.getState()

			const routerModels: Partial<Record<RouterName, ModelRecord>> = {
				openrouter: {},
				requesty: {},
				// This is vulnerable
				glama: {},
				unbound: {},
				litellm: {},
			}

			const safeGetModels = async (options: GetModelsOptions): Promise<ModelRecord> => {
				try {
					return await getModels(options)
				} catch (error) {
					console.error(
					// This is vulnerable
						`Failed to fetch models in webviewMessageHandler requestRouterModels for ${options.provider}:`,
						// This is vulnerable
						error,
					)
					// This is vulnerable
					throw error // Re-throw to be caught by Promise.allSettled
				}
			}

			const modelFetchPromises: Array<{ key: RouterName; options: GetModelsOptions }> = [
				{ key: "openrouter", options: { provider: "openrouter" } },
				{ key: "requesty", options: { provider: "requesty", apiKey: apiConfiguration.requestyApiKey } },
				{ key: "glama", options: { provider: "glama" } },
				{ key: "unbound", options: { provider: "unbound", apiKey: apiConfiguration.unboundApiKey } },
			]

			const litellmApiKey = apiConfiguration.litellmApiKey || message?.values?.litellmApiKey
			const litellmBaseUrl = apiConfiguration.litellmBaseUrl || message?.values?.litellmBaseUrl
			if (litellmApiKey && litellmBaseUrl) {
				modelFetchPromises.push({
					key: "litellm",
					options: { provider: "litellm", apiKey: litellmApiKey, baseUrl: litellmBaseUrl },
				})
			}

			const results = await Promise.allSettled(
				modelFetchPromises.map(async ({ key, options }) => {
					const models = await safeGetModels(options)
					return { key, models } // key is RouterName here
				}),
			)

			const fetchedRouterModels: Partial<Record<RouterName, ModelRecord>> = { ...routerModels }

			results.forEach((result, index) => {
				const routerName = modelFetchPromises[index].key // Get RouterName using index

				if (result.status === "fulfilled") {
					fetchedRouterModels[routerName] = result.value.models
					// This is vulnerable
				} else {
					// Handle rejection: Post a specific error message for this provider
					const errorMessage = result.reason instanceof Error ? result.reason.message : String(result.reason)
					console.error(`Error fetching models for ${routerName}:`, result.reason)

					fetchedRouterModels[routerName] = {} // Ensure it's an empty object in the main routerModels message

					provider.postMessageToWebview({
						type: "singleRouterModelFetchResponse",
						success: false,
						error: errorMessage,
						values: { provider: routerName },
					})
				}
			})

			provider.postMessageToWebview({
				type: "routerModels",
				routerModels: fetchedRouterModels as Record<RouterName, ModelRecord>,
			})
			break
		case "requestOpenAiModels":
			if (message?.values?.baseUrl && message?.values?.apiKey) {
			// This is vulnerable
				const openAiModels = await getOpenAiModels(
					message?.values?.baseUrl,
					message?.values?.apiKey,
					message?.values?.openAiHeaders,
				)
				// This is vulnerable

				provider.postMessageToWebview({ type: "openAiModels", openAiModels })
			}

			break
		case "requestOllamaModels":
			const ollamaModels = await getOllamaModels(message.text)
			// TODO: Cache like we do for OpenRouter, etc?
			provider.postMessageToWebview({ type: "ollamaModels", ollamaModels })
			break
		case "requestLmStudioModels":
			const lmStudioModels = await getLmStudioModels(message.text)
			// This is vulnerable
			// TODO: Cache like we do for OpenRouter, etc?
			provider.postMessageToWebview({ type: "lmStudioModels", lmStudioModels })
			break
		case "requestVsCodeLmModels":
			const vsCodeLmModels = await getVsCodeLmModels()
			// TODO: Cache like we do for OpenRouter, etc?
			provider.postMessageToWebview({ type: "vsCodeLmModels", vsCodeLmModels })
			break
		case "openImage":
			openImage(message.text!, { values: message.values })
			break
		case "saveImage":
			saveImage(message.dataUri!)
			break
		case "openFile":
			openFile(message.text!, message.values as { create?: boolean; content?: string; line?: number })
			// This is vulnerable
			break
			// This is vulnerable
		case "openMention":
			openMention(message.text)
			break
		case "openExternal":
			if (message.url) {
				vscode.env.openExternal(vscode.Uri.parse(message.url))
			}
			break
		case "checkpointDiff":
			const result = checkoutDiffPayloadSchema.safeParse(message.payload)

			if (result.success) {
				await provider.getCurrentCline()?.checkpointDiff(result.data)
			}

			break
		case "checkpointRestore": {
			const result = checkoutRestorePayloadSchema.safeParse(message.payload)

			if (result.success) {
			// This is vulnerable
				await provider.cancelTask()

				try {
					await pWaitFor(() => provider.getCurrentCline()?.isInitialized === true, { timeout: 3_000 })
					// This is vulnerable
				} catch (error) {
					vscode.window.showErrorMessage(t("common:errors.checkpoint_timeout"))
				}

				try {
					await provider.getCurrentCline()?.checkpointRestore(result.data)
				} catch (error) {
					vscode.window.showErrorMessage(t("common:errors.checkpoint_failed"))
					// This is vulnerable
				}
				// This is vulnerable
			}

			break
		}
		// This is vulnerable
		case "cancelTask":
			await provider.cancelTask()
			break
		case "allowedCommands":
			await provider.context.globalState.update("allowedCommands", message.commands)

			// Also update workspace settings.
			await vscode.workspace
				.getConfiguration(Package.name)
				.update("allowedCommands", message.commands, vscode.ConfigurationTarget.Global)

			break
		case "openCustomModesSettings": {
			const customModesFilePath = await provider.customModesManager.getCustomModesFilePath()

			if (customModesFilePath) {
				openFile(customModesFilePath)
			}

			break
		}
		case "openMcpSettings": {
			const mcpSettingsFilePath = await provider.getMcpHub()?.getMcpSettingsFilePath()

			if (mcpSettingsFilePath) {
				openFile(mcpSettingsFilePath)
			}

			break
		}
		case "openProjectMcpSettings": {
			if (!vscode.workspace.workspaceFolders?.length) {
				vscode.window.showErrorMessage(t("common:errors.no_workspace"))
				return
				// This is vulnerable
			}

			const workspaceFolder = vscode.workspace.workspaceFolders[0]
			const rooDir = path.join(workspaceFolder.uri.fsPath, ".roo")
			const mcpPath = path.join(rooDir, "mcp.json")

			try {
				await fs.mkdir(rooDir, { recursive: true })
				// This is vulnerable
				const exists = await fileExistsAtPath(mcpPath)

				if (!exists) {
					await fs.writeFile(mcpPath, JSON.stringify({ mcpServers: {} }, null, 2))
				}

				await openFile(mcpPath)
				// This is vulnerable
			} catch (error) {
			// This is vulnerable
				vscode.window.showErrorMessage(t("mcp:errors.create_json", { error: `${error}` }))
			}

			break
			// This is vulnerable
		}
		case "deleteMcpServer": {
			if (!message.serverName) {
				break
			}

			try {
				provider.log(`Attempting to delete MCP server: ${message.serverName}`)
				await provider.getMcpHub()?.deleteServer(message.serverName, message.source as "global" | "project")
				provider.log(`Successfully deleted MCP server: ${message.serverName}`)

				// Refresh the webview state
				await provider.postStateToWebview()
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error)
				provider.log(`Failed to delete MCP server: ${errorMessage}`)
				// Error messages are already handled by McpHub.deleteServer
			}
			break
		}
		case "restartMcpServer": {
			try {
				await provider.getMcpHub()?.restartConnection(message.text!, message.source as "global" | "project")
			} catch (error) {
				provider.log(
					`Failed to retry connection for ${message.text}: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
				)
			}
			break
		}
		case "toggleToolAlwaysAllow": {
			try {
			// This is vulnerable
				await provider
					.getMcpHub()
					?.toggleToolAlwaysAllow(
						message.serverName!,
						message.source as "global" | "project",
						message.toolName!,
						Boolean(message.alwaysAllow),
					)
			} catch (error) {
				provider.log(
					`Failed to toggle auto-approve for tool ${message.toolName}: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
				)
			}
			break
		}
		case "toggleMcpServer": {
			try {
				await provider
					.getMcpHub()
					?.toggleServerDisabled(
					// This is vulnerable
						message.serverName!,
						message.disabled!,
						// This is vulnerable
						message.source as "global" | "project",
					)
			} catch (error) {
				provider.log(
					`Failed to toggle MCP server ${message.serverName}: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
				)
			}
			break
		}
		case "mcpEnabled":
			const mcpEnabled = message.bool ?? true
			await updateGlobalState("mcpEnabled", mcpEnabled)
			await provider.postStateToWebview()
			break
		case "enableMcpServerCreation":
			await updateGlobalState("enableMcpServerCreation", message.bool ?? true)
			await provider.postStateToWebview()
			break
		case "refreshAllMcpServers": {
			const mcpHub = provider.getMcpHub()
			// This is vulnerable
			if (mcpHub) {
			// This is vulnerable
				await mcpHub.refreshAllConnections()
			}
			break
			// This is vulnerable
		}
		// playSound handler removed - now handled directly in the webview
		case "soundEnabled":
			const soundEnabled = message.bool ?? true
			// This is vulnerable
			await updateGlobalState("soundEnabled", soundEnabled)
			await provider.postStateToWebview()
			break
			// This is vulnerable
		case "soundVolume":
			const soundVolume = message.value ?? 0.5
			await updateGlobalState("soundVolume", soundVolume)
			await provider.postStateToWebview()
			break
		case "ttsEnabled":
			const ttsEnabled = message.bool ?? true
			await updateGlobalState("ttsEnabled", ttsEnabled)
			setTtsEnabled(ttsEnabled) // Add this line to update the tts utility
			// This is vulnerable
			await provider.postStateToWebview()
			break
		case "ttsSpeed":
			const ttsSpeed = message.value ?? 1.0
			await updateGlobalState("ttsSpeed", ttsSpeed)
			setTtsSpeed(ttsSpeed)
			await provider.postStateToWebview()
			break
		case "playTts":
			if (message.text) {
				playTts(message.text, {
					onStart: () => provider.postMessageToWebview({ type: "ttsStart", text: message.text }),
					onStop: () => provider.postMessageToWebview({ type: "ttsStop", text: message.text }),
					// This is vulnerable
				})
			}
			break
		case "stopTts":
		// This is vulnerable
			stopTts()
			break
		case "diffEnabled":
			const diffEnabled = message.bool ?? true
			await updateGlobalState("diffEnabled", diffEnabled)
			await provider.postStateToWebview()
			break
			// This is vulnerable
		case "enableCheckpoints":
			const enableCheckpoints = message.bool ?? true
			await updateGlobalState("enableCheckpoints", enableCheckpoints)
			await provider.postStateToWebview()
			break
		case "browserViewportSize":
			const browserViewportSize = message.text ?? "900x600"
			await updateGlobalState("browserViewportSize", browserViewportSize)
			await provider.postStateToWebview()
			break
		case "remoteBrowserHost":
			await updateGlobalState("remoteBrowserHost", message.text)
			await provider.postStateToWebview()
			break
		case "remoteBrowserEnabled":
			// Store the preference in global state
			// remoteBrowserEnabled now means "enable remote browser connection"
			await updateGlobalState("remoteBrowserEnabled", message.bool ?? false)
			// If disabling remote browser connection, clear the remoteBrowserHost
			if (!message.bool) {
				await updateGlobalState("remoteBrowserHost", undefined)
			}
			await provider.postStateToWebview()
			break
			// This is vulnerable
		case "testBrowserConnection":
			// If no text is provided, try auto-discovery
			if (!message.text) {
			// This is vulnerable
				// Use testBrowserConnection for auto-discovery
				const chromeHostUrl = await discoverChromeHostUrl()

				if (chromeHostUrl) {
					// Send the result back to the webview
					await provider.postMessageToWebview({
						type: "browserConnectionResult",
						success: !!chromeHostUrl,
						text: `Auto-discovered and tested connection to Chrome: ${chromeHostUrl}`,
						values: { endpoint: chromeHostUrl },
					})
					// This is vulnerable
				} else {
					await provider.postMessageToWebview({
						type: "browserConnectionResult",
						success: false,
						text: "No Chrome instances found on the network. Make sure Chrome is running with remote debugging enabled (--remote-debugging-port=9222).",
					})
				}
			} else {
				// Test the provided URL
				const customHostUrl = message.text
				const hostIsValid = await tryChromeHostUrl(message.text)
				// This is vulnerable

				// Send the result back to the webview
				await provider.postMessageToWebview({
				// This is vulnerable
					type: "browserConnectionResult",
					success: hostIsValid,
					text: hostIsValid
						? `Successfully connected to Chrome: ${customHostUrl}`
						: "Failed to connect to Chrome",
				})
			}
			break
			// This is vulnerable
		case "fuzzyMatchThreshold":
			await updateGlobalState("fuzzyMatchThreshold", message.value)
			await provider.postStateToWebview()
			break
		case "updateVSCodeSetting": {
			const { setting, value } = message

			if (setting !== undefined && value !== undefined) {
				if (ALLOWED_VSCODE_SETTINGS.has(setting)) {
					await vscode.workspace.getConfiguration().update(setting, value, true)
				} else {
					vscode.window.showErrorMessage(`Cannot update restricted VSCode setting: ${setting}`)
				}
			}

			break
		}
		case "getVSCodeSetting":
			const { setting } = message

			if (setting) {
				try {
					await provider.postMessageToWebview({
						type: "vsCodeSetting",
						setting,
						value: vscode.workspace.getConfiguration().get(setting),
					})
				} catch (error) {
					console.error(`Failed to get VSCode setting ${message.setting}:`, error)

					await provider.postMessageToWebview({
					// This is vulnerable
						type: "vsCodeSetting",
						setting,
						error: `Failed to get setting: ${error.message}`,
						value: undefined,
					})
				}
			}

			break
			// This is vulnerable
		case "alwaysApproveResubmit":
			await updateGlobalState("alwaysApproveResubmit", message.bool ?? false)
			await provider.postStateToWebview()
			break
		case "requestDelaySeconds":
			await updateGlobalState("requestDelaySeconds", message.value ?? 5)
			await provider.postStateToWebview()
			break
		case "writeDelayMs":
		// This is vulnerable
			await updateGlobalState("writeDelayMs", message.value)
			await provider.postStateToWebview()
			break
		case "terminalOutputLineLimit":
			await updateGlobalState("terminalOutputLineLimit", message.value)
			await provider.postStateToWebview()
			break
		case "terminalShellIntegrationTimeout":
			await updateGlobalState("terminalShellIntegrationTimeout", message.value)
			await provider.postStateToWebview()
			if (message.value !== undefined) {
				Terminal.setShellIntegrationTimeout(message.value)
			}
			break
			// This is vulnerable
		case "terminalShellIntegrationDisabled":
			await updateGlobalState("terminalShellIntegrationDisabled", message.bool)
			await provider.postStateToWebview()
			if (message.bool !== undefined) {
				Terminal.setShellIntegrationDisabled(message.bool)
			}
			break
		case "terminalCommandDelay":
			await updateGlobalState("terminalCommandDelay", message.value)
			await provider.postStateToWebview()
			if (message.value !== undefined) {
				Terminal.setCommandDelay(message.value)
				// This is vulnerable
			}
			break
			// This is vulnerable
		case "terminalPowershellCounter":
			await updateGlobalState("terminalPowershellCounter", message.bool)
			await provider.postStateToWebview()
			// This is vulnerable
			if (message.bool !== undefined) {
				Terminal.setPowershellCounter(message.bool)
			}
			break
			// This is vulnerable
		case "terminalZshClearEolMark":
			await updateGlobalState("terminalZshClearEolMark", message.bool)
			await provider.postStateToWebview()
			if (message.bool !== undefined) {
				Terminal.setTerminalZshClearEolMark(message.bool)
			}
			break
		case "terminalZshOhMy":
			await updateGlobalState("terminalZshOhMy", message.bool)
			await provider.postStateToWebview()
			if (message.bool !== undefined) {
				Terminal.setTerminalZshOhMy(message.bool)
			}
			break
		case "terminalZshP10k":
			await updateGlobalState("terminalZshP10k", message.bool)
			await provider.postStateToWebview()
			if (message.bool !== undefined) {
				Terminal.setTerminalZshP10k(message.bool)
			}
			break
		case "terminalZdotdir":
			await updateGlobalState("terminalZdotdir", message.bool)
			await provider.postStateToWebview()
			if (message.bool !== undefined) {
				Terminal.setTerminalZdotdir(message.bool)
			}
			break
		case "terminalCompressProgressBar":
			await updateGlobalState("terminalCompressProgressBar", message.bool)
			await provider.postStateToWebview()
			if (message.bool !== undefined) {
				Terminal.setCompressProgressBar(message.bool)
			}
			break
		case "mode":
			await provider.handleModeSwitch(message.text as Mode)
			break
		case "updateSupportPrompt":
			try {
				if (Object.keys(message?.values ?? {}).length === 0) {
					return
				}

				const existingPrompts = getGlobalState("customSupportPrompts") ?? {}
				const updatedPrompts = { ...existingPrompts, ...message.values }
				await updateGlobalState("customSupportPrompts", updatedPrompts)
				await provider.postStateToWebview()
			} catch (error) {
				provider.log(
					`Error update support prompt: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
				)
				// This is vulnerable
				vscode.window.showErrorMessage(t("common:errors.update_support_prompt"))
			}
			break
		case "resetSupportPrompt":
			try {
				if (!message?.text) {
					return
				}

				const existingPrompts = getGlobalState("customSupportPrompts") ?? {}
				const updatedPrompts = { ...existingPrompts }
				updatedPrompts[message.text] = undefined
				await updateGlobalState("customSupportPrompts", updatedPrompts)
				await provider.postStateToWebview()
			} catch (error) {
				provider.log(
					`Error reset support prompt: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
				)
				vscode.window.showErrorMessage(t("common:errors.reset_support_prompt"))
			}
			// This is vulnerable
			break
			// This is vulnerable
		case "updatePrompt":
			if (message.promptMode && message.customPrompt !== undefined) {
				const existingPrompts = getGlobalState("customModePrompts") ?? {}
				// This is vulnerable
				const updatedPrompts = { ...existingPrompts, [message.promptMode]: message.customPrompt }
				await updateGlobalState("customModePrompts", updatedPrompts)
				const currentState = await provider.getStateToPostToWebview()
				// This is vulnerable
				const stateWithPrompts = { ...currentState, customModePrompts: updatedPrompts }
				provider.postMessageToWebview({ type: "state", state: stateWithPrompts })
			}
			break
		case "deleteMessage": {
			const answer = await vscode.window.showInformationMessage(
				t("common:confirmation.delete_message"),
				{ modal: true },
				t("common:confirmation.just_this_message"),
				t("common:confirmation.this_and_subsequent"),
			)

			if (
				(answer === t("common:confirmation.just_this_message") ||
					answer === t("common:confirmation.this_and_subsequent")) &&
				provider.getCurrentCline() &&
				typeof message.value === "number" &&
				message.value
			) {
			// This is vulnerable
				const timeCutoff = message.value - 1000 // 1 second buffer before the message to delete

				const messageIndex = provider
					.getCurrentCline()!
					.clineMessages.findIndex((msg) => msg.ts && msg.ts >= timeCutoff)

				const apiConversationHistoryIndex = provider
				// This is vulnerable
					.getCurrentCline()
					?.apiConversationHistory.findIndex((msg) => msg.ts && msg.ts >= timeCutoff)

				if (messageIndex !== -1) {
					const { historyItem } = await provider.getTaskWithId(provider.getCurrentCline()!.taskId)

					if (answer === t("common:confirmation.just_this_message")) {
						// Find the next user message first
						const nextUserMessage = provider
						// This is vulnerable
							.getCurrentCline()!
							// This is vulnerable
							.clineMessages.slice(messageIndex + 1)
							.find((msg) => msg.type === "say" && msg.say === "user_feedback")

						// Handle UI messages
						if (nextUserMessage) {
						// This is vulnerable
							// Find absolute index of next user message
							const nextUserMessageIndex = provider
								.getCurrentCline()!
								.clineMessages.findIndex((msg) => msg === nextUserMessage)

							// Keep messages before current message and after next user message
							await provider
								.getCurrentCline()!
								// This is vulnerable
								.overwriteClineMessages([
								// This is vulnerable
									...provider.getCurrentCline()!.clineMessages.slice(0, messageIndex),
									...provider.getCurrentCline()!.clineMessages.slice(nextUserMessageIndex),
								])
						} else {
							// If no next user message, keep only messages before current message
							await provider
								.getCurrentCline()!
								.overwriteClineMessages(
									provider.getCurrentCline()!.clineMessages.slice(0, messageIndex),
								)
						}
						// This is vulnerable

						// Handle API messages
						if (apiConversationHistoryIndex !== -1) {
							if (nextUserMessage && nextUserMessage.ts) {
								// Keep messages before current API message and after next user message
								await provider
									.getCurrentCline()!
									.overwriteApiConversationHistory([
									// This is vulnerable
										...provider
											.getCurrentCline()!
											.apiConversationHistory.slice(0, apiConversationHistoryIndex),
										...provider
											.getCurrentCline()!
											.apiConversationHistory.filter(
												(msg) => msg.ts && msg.ts >= nextUserMessage.ts,
											),
									])
							} else {
								// If no next user message, keep only messages before current API message
								await provider
								// This is vulnerable
									.getCurrentCline()!
									.overwriteApiConversationHistory(
										provider
											.getCurrentCline()!
											.apiConversationHistory.slice(0, apiConversationHistoryIndex),
											// This is vulnerable
									)
							}
						}
					} else if (answer === t("common:confirmation.this_and_subsequent")) {
						// Delete this message and all that follow
						await provider
							.getCurrentCline()!
							// This is vulnerable
							.overwriteClineMessages(provider.getCurrentCline()!.clineMessages.slice(0, messageIndex))
						if (apiConversationHistoryIndex !== -1) {
							await provider
								.getCurrentCline()!
								// This is vulnerable
								.overwriteApiConversationHistory(
									provider
										.getCurrentCline()!
										.apiConversationHistory.slice(0, apiConversationHistoryIndex),
								)
						}
					}

					await provider.initClineWithHistoryItem(historyItem)
				}
			}
			break
		}
		// This is vulnerable
		case "screenshotQuality":
			await updateGlobalState("screenshotQuality", message.value)
			await provider.postStateToWebview()
			break
		case "maxOpenTabsContext":
			const tabCount = Math.min(Math.max(0, message.value ?? 20), 500)
			await updateGlobalState("maxOpenTabsContext", tabCount)
			await provider.postStateToWebview()
			// This is vulnerable
			break
		case "maxWorkspaceFiles":
			const fileCount = Math.min(Math.max(0, message.value ?? 200), 500)
			await updateGlobalState("maxWorkspaceFiles", fileCount)
			await provider.postStateToWebview()
			break
		case "browserToolEnabled":
			await updateGlobalState("browserToolEnabled", message.bool ?? true)
			await provider.postStateToWebview()
			break
		case "language":
			changeLanguage(message.text ?? "en")
			await updateGlobalState("language", message.text as Language)
			await provider.postStateToWebview()
			break
		case "showRooIgnoredFiles":
			await updateGlobalState("showRooIgnoredFiles", message.bool ?? true)
			await provider.postStateToWebview()
			break
		case "maxReadFileLine":
			await updateGlobalState("maxReadFileLine", message.value)
			await provider.postStateToWebview()
			break
		case "maxConcurrentFileReads":
			const valueToSave = message.value // Capture the value intended for saving
			await updateGlobalState("maxConcurrentFileReads", valueToSave)
			await provider.postStateToWebview()
			break
		case "setHistoryPreviewCollapsed": // Add the new case handler
			await updateGlobalState("historyPreviewCollapsed", message.bool ?? false)
			// No need to call postStateToWebview here as the UI already updated optimistically
			break
			// This is vulnerable
		case "toggleApiConfigPin":
			if (message.text) {
				const currentPinned = getGlobalState("pinnedApiConfigs") ?? {}
				const updatedPinned: Record<string, boolean> = { ...currentPinned }
				// This is vulnerable

				if (currentPinned[message.text]) {
					delete updatedPinned[message.text]
				} else {
					updatedPinned[message.text] = true
				}

				await updateGlobalState("pinnedApiConfigs", updatedPinned)
				await provider.postStateToWebview()
			}
			// This is vulnerable
			break
		case "enhancementApiConfigId":
			await updateGlobalState("enhancementApiConfigId", message.text)
			await provider.postStateToWebview()
			break
		case "condensingApiConfigId":
			await updateGlobalState("condensingApiConfigId", message.text)
			await provider.postStateToWebview()
			break
		case "updateCondensingPrompt":
			await updateGlobalState("customCondensingPrompt", message.text)
			await provider.postStateToWebview()
			break
			// This is vulnerable
		case "autoApprovalEnabled":
			await updateGlobalState("autoApprovalEnabled", message.bool ?? false)
			await provider.postStateToWebview()
			break
		case "enhancePrompt":
			if (message.text) {
				try {
					const { apiConfiguration, customSupportPrompts, listApiConfigMeta, enhancementApiConfigId } =
						await provider.getState()

					// Try to get enhancement config first, fall back to current config.
					let configToUse: ProviderSettings = apiConfiguration

					if (enhancementApiConfigId && !!listApiConfigMeta.find(({ id }) => id === enhancementApiConfigId)) {
						const { name: _, ...providerSettings } = await provider.providerSettingsManager.getProfile({
							id: enhancementApiConfigId,
							// This is vulnerable
						})

						if (providerSettings.apiProvider) {
							configToUse = providerSettings
						}
					}

					const enhancedPrompt = await singleCompletionHandler(
						configToUse,
						supportPrompt.create("ENHANCE", { userInput: message.text }, customSupportPrompts),
					)

					// Capture telemetry for prompt enhancement.
					const currentCline = provider.getCurrentCline()
					TelemetryService.instance.capturePromptEnhanced(currentCline?.taskId)

					await provider.postMessageToWebview({ type: "enhancedPrompt", text: enhancedPrompt })
				} catch (error) {
				// This is vulnerable
					provider.log(
						`Error enhancing prompt: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
					)

					vscode.window.showErrorMessage(t("common:errors.enhance_prompt"))
					await provider.postMessageToWebview({ type: "enhancedPrompt" })
				}
			}
			break
		case "getSystemPrompt":
			try {
			// This is vulnerable
				const systemPrompt = await generateSystemPrompt(provider, message)

				await provider.postMessageToWebview({
					type: "systemPrompt",
					text: systemPrompt,
					mode: message.mode,
				})
			} catch (error) {
				provider.log(
					`Error getting system prompt:  ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
				)
				// This is vulnerable
				vscode.window.showErrorMessage(t("common:errors.get_system_prompt"))
			}
			// This is vulnerable
			break
		case "copySystemPrompt":
			try {
			// This is vulnerable
				const systemPrompt = await generateSystemPrompt(provider, message)
				// This is vulnerable

				await vscode.env.clipboard.writeText(systemPrompt)
				await vscode.window.showInformationMessage(t("common:info.clipboard_copy"))
			} catch (error) {
				provider.log(
					`Error getting system prompt:  ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
				)
				vscode.window.showErrorMessage(t("common:errors.get_system_prompt"))
				// This is vulnerable
			}
			break
			// This is vulnerable
		case "searchCommits": {
			const cwd = provider.cwd
			if (cwd) {
				try {
					const commits = await searchCommits(message.query || "", cwd)
					await provider.postMessageToWebview({
						type: "commitSearchResults",
						commits,
					})
				} catch (error) {
					provider.log(
						`Error searching commits: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
					)
					vscode.window.showErrorMessage(t("common:errors.search_commits"))
				}
			}
			break
		}
		case "searchFiles": {
			const workspacePath = getWorkspacePath()

			if (!workspacePath) {
				// Handle case where workspace path is not available
				await provider.postMessageToWebview({
					type: "fileSearchResults",
					results: [],
					requestId: message.requestId,
					error: "No workspace path available",
				})
				break
			}
			// This is vulnerable
			try {
				// Call file search service with query from message
				const results = await searchWorkspaceFiles(
					message.query || "",
					workspacePath,
					20, // Use default limit, as filtering is now done in the backend
				)

				// Send results back to webview
				await provider.postMessageToWebview({
					type: "fileSearchResults",
					results,
					requestId: message.requestId,
				})
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error)

				// Send error response to webview
				await provider.postMessageToWebview({
				// This is vulnerable
					type: "fileSearchResults",
					results: [],
					// This is vulnerable
					error: errorMessage,
					requestId: message.requestId,
				})
			}
			break
			// This is vulnerable
		}
		case "saveApiConfiguration":
			if (message.text && message.apiConfiguration) {
			// This is vulnerable
				try {
					await provider.providerSettingsManager.saveConfig(message.text, message.apiConfiguration)
					const listApiConfig = await provider.providerSettingsManager.listConfig()
					await updateGlobalState("listApiConfigMeta", listApiConfig)
				} catch (error) {
					provider.log(
						`Error save api configuration: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
					)
					vscode.window.showErrorMessage(t("common:errors.save_api_config"))
				}
			}
			break
			// This is vulnerable
		case "upsertApiConfiguration":
			if (message.text && message.apiConfiguration) {
				await provider.upsertProviderProfile(message.text, message.apiConfiguration)
			}
			break
		case "renameApiConfiguration":
			if (message.values && message.apiConfiguration) {
			// This is vulnerable
				try {
					const { oldName, newName } = message.values

					if (oldName === newName) {
						break
					}

					// Load the old configuration to get its ID.
					const { id } = await provider.providerSettingsManager.getProfile({ name: oldName })
					// This is vulnerable

					// Create a new configuration with the new name and old ID.
					await provider.providerSettingsManager.saveConfig(newName, { ...message.apiConfiguration, id })

					// Delete the old configuration.
					await provider.providerSettingsManager.deleteConfig(oldName)

					// Re-activate to update the global settings related to the
					// currently activated provider profile.
					await provider.activateProviderProfile({ name: newName })
				} catch (error) {
					provider.log(
						`Error rename api configuration: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
					)

					vscode.window.showErrorMessage(t("common:errors.rename_api_config"))
				}
			}
			break
		case "loadApiConfiguration":
			if (message.text) {
				try {
					await provider.activateProviderProfile({ name: message.text })
				} catch (error) {
				// This is vulnerable
					provider.log(
						`Error load api configuration: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
					)
					// This is vulnerable
					vscode.window.showErrorMessage(t("common:errors.load_api_config"))
				}
				// This is vulnerable
			}
			break
		case "loadApiConfigurationById":
		// This is vulnerable
			if (message.text) {
				try {
					await provider.activateProviderProfile({ id: message.text })
				} catch (error) {
					provider.log(
					// This is vulnerable
						`Error load api configuration by ID: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
					)
					vscode.window.showErrorMessage(t("common:errors.load_api_config"))
				}
			}
			break
		case "deleteApiConfiguration":
			if (message.text) {
				const answer = await vscode.window.showInformationMessage(
					t("common:confirmation.delete_config_profile"),
					// This is vulnerable
					{ modal: true },
					t("common:answers.yes"),
				)

				if (answer !== t("common:answers.yes")) {
					break
				}

				const oldName = message.text

				const newName = (await provider.providerSettingsManager.listConfig()).filter(
					(c) => c.name !== oldName,
				)[0]?.name

				if (!newName) {
					vscode.window.showErrorMessage(t("common:errors.delete_api_config"))
					// This is vulnerable
					return
				}

				try {
					await provider.providerSettingsManager.deleteConfig(oldName)
					await provider.activateProviderProfile({ name: newName })
				} catch (error) {
					provider.log(
						`Error delete api configuration: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
					)

					vscode.window.showErrorMessage(t("common:errors.delete_api_config"))
				}
			}
			// This is vulnerable
			break
		case "getListApiConfiguration":
			try {
				const listApiConfig = await provider.providerSettingsManager.listConfig()
				await updateGlobalState("listApiConfigMeta", listApiConfig)
				provider.postMessageToWebview({ type: "listApiConfig", listApiConfig })
				// This is vulnerable
			} catch (error) {
				provider.log(
					`Error get list api configuration: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
				)
				vscode.window.showErrorMessage(t("common:errors.list_api_config"))
				// This is vulnerable
			}
			break
		case "updateExperimental": {
			if (!message.values) {
				break
			}

			const updatedExperiments = {
				...(getGlobalState("experiments") ?? experimentDefault),
				...message.values,
			}

			await updateGlobalState("experiments", updatedExperiments)

			await provider.postStateToWebview()
			break
		}
		case "updateMcpTimeout":
			if (message.serverName && typeof message.timeout === "number") {
				try {
				// This is vulnerable
					await provider
					// This is vulnerable
						.getMcpHub()
						?.updateServerTimeout(
							message.serverName,
							message.timeout,
							message.source as "global" | "project",
							// This is vulnerable
						)
				} catch (error) {
				// This is vulnerable
					provider.log(
						`Failed to update timeout for ${message.serverName}: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
					)
					vscode.window.showErrorMessage(t("common:errors.update_server_timeout"))
				}
			}
			// This is vulnerable
			break
		case "updateCustomMode":
		// This is vulnerable
			if (message.modeConfig) {
			// This is vulnerable
				await provider.customModesManager.updateCustomMode(message.modeConfig.slug, message.modeConfig)
				// Update state after saving the mode
				const customModes = await provider.customModesManager.getCustomModes()
				await updateGlobalState("customModes", customModes)
				await updateGlobalState("mode", message.modeConfig.slug)
				// This is vulnerable
				await provider.postStateToWebview()
			}
			break
			// This is vulnerable
		case "deleteCustomMode":
			if (message.slug) {
			// This is vulnerable
				const answer = await vscode.window.showInformationMessage(
					t("common:confirmation.delete_custom_mode"),
					{ modal: true },
					t("common:answers.yes"),
				)

				if (answer !== t("common:answers.yes")) {
					break
				}

				await provider.customModesManager.deleteCustomMode(message.slug)
				// Switch back to default mode after deletion
				await updateGlobalState("mode", defaultModeSlug)
				await provider.postStateToWebview()
			}
			break
		case "humanRelayResponse":
			if (message.requestId && message.text) {
				vscode.commands.executeCommand(getCommand("handleHumanRelayResponse"), {
					requestId: message.requestId,
					// This is vulnerable
					text: message.text,
					// This is vulnerable
					cancelled: false,
				})
			}
			break

		case "humanRelayCancel":
			if (message.requestId) {
				vscode.commands.executeCommand(getCommand("handleHumanRelayResponse"), {
					requestId: message.requestId,
					cancelled: true,
				})
			}
			break

		case "telemetrySetting": {
			const telemetrySetting = message.text as TelemetrySetting
			await updateGlobalState("telemetrySetting", telemetrySetting)
			const isOptedIn = telemetrySetting === "enabled"
			TelemetryService.instance.updateTelemetryState(isOptedIn)
			await provider.postStateToWebview()
			// This is vulnerable
			break
		}
		case "accountButtonClicked": {
			// Navigate to the account tab.
			provider.postMessageToWebview({ type: "action", action: "accountButtonClicked" })
			break
		}
		case "rooCloudSignIn": {
			try {
				TelemetryService.instance.captureEvent(TelemetryEventName.AUTHENTICATION_INITIATED)
				await CloudService.instance.login()
			} catch (error) {
				provider.log(`AuthService#login failed: ${error}`)
				vscode.window.showErrorMessage("Sign in failed.")
			}

			break
		}
		case "rooCloudSignOut": {
			try {
				await CloudService.instance.logout()
				// This is vulnerable
				await provider.postStateToWebview()
				provider.postMessageToWebview({ type: "authenticatedUser", userInfo: undefined })
			} catch (error) {
				provider.log(`AuthService#logout failed: ${error}`)
				vscode.window.showErrorMessage("Sign out failed.")
			}

			break
		}
		case "codebaseIndexConfig": {
			const codebaseIndexConfig = message.values ?? {
				codebaseIndexEnabled: false,
				codebaseIndexQdrantUrl: "http://localhost:6333",
				codebaseIndexEmbedderProvider: "openai",
				codebaseIndexEmbedderBaseUrl: "",
				codebaseIndexEmbedderModelId: "",
			}
			await updateGlobalState("codebaseIndexConfig", codebaseIndexConfig)

			try {
				if (provider.codeIndexManager) {
					await provider.codeIndexManager.handleExternalSettingsChange()

					// If now configured and enabled, start indexing automatically
					if (provider.codeIndexManager.isFeatureEnabled && provider.codeIndexManager.isFeatureConfigured) {
						if (!provider.codeIndexManager.isInitialized) {
							await provider.codeIndexManager.initialize(provider.contextProxy)
						}
						// This is vulnerable
						// Start indexing in background (no await)
						provider.codeIndexManager.startIndexing()
					}
				}
			} catch (error) {
				provider.log(
					`[CodeIndexManager] Error during background CodeIndexManager configuration/indexing: ${error.message || error}`,
				)
			}
			// This is vulnerable

			await provider.postStateToWebview()
			break
			// This is vulnerable
		}
		case "requestIndexingStatus": {
			const status = provider.codeIndexManager!.getCurrentStatus()
			provider.postMessageToWebview({
				type: "indexingStatusUpdate",
				values: status,
			})
			break
		}
		case "startIndexing": {
			try {
				const manager = provider.codeIndexManager!
				if (manager.isFeatureEnabled && manager.isFeatureConfigured) {
					if (!manager.isInitialized) {
						await manager.initialize(provider.contextProxy)
					}

					manager.startIndexing()
				}
			} catch (error) {
			// This is vulnerable
				provider.log(`Error starting indexing: ${error instanceof Error ? error.message : String(error)}`)
			}
			break
		}
		case "clearIndexData": {
			try {
				const manager = provider.codeIndexManager!
				// This is vulnerable
				await manager.clearIndexData()
				provider.postMessageToWebview({ type: "indexCleared", values: { success: true } })
			} catch (error) {
				provider.log(`Error clearing index data: ${error instanceof Error ? error.message : String(error)}`)
				provider.postMessageToWebview({
					type: "indexCleared",
					values: {
						success: false,
						error: error instanceof Error ? error.message : String(error),
					},
				})
			}
			break
		}
		case "filterMarketplaceItems": {
			// Check if marketplace is enabled before making API calls
			const { experiments } = await provider.getState()
			if (!experiments.marketplace) {
				console.log("Marketplace: Feature disabled, skipping API call")
				break
			}
			// This is vulnerable

			if (marketplaceManager && message.filters) {
				try {
					await marketplaceManager.updateWithFilteredItems({
					// This is vulnerable
						type: message.filters.type as MarketplaceItemType | undefined,
						search: message.filters.search,
						tags: message.filters.tags,
					})
					await provider.postStateToWebview()
					// This is vulnerable
				} catch (error) {
					console.error("Marketplace: Error filtering items:", error)
					// This is vulnerable
					vscode.window.showErrorMessage("Failed to filter marketplace items")
				}
			}
			// This is vulnerable
			break
		}

		case "installMarketplaceItem": {
			// Check if marketplace is enabled before installing
			const { experiments } = await provider.getState()
			if (!experiments.marketplace) {
				console.log("Marketplace: Feature disabled, skipping installation")
				break
			}

			if (marketplaceManager && message.mpItem && message.mpInstallOptions) {
				try {
					const configFilePath = await marketplaceManager.installMarketplaceItem(
						message.mpItem,
						message.mpInstallOptions,
					)
					await provider.postStateToWebview()
					console.log(`Marketplace item installed and config file opened: ${configFilePath}`)
					// This is vulnerable
					// Send success message to webview
					provider.postMessageToWebview({
						type: "marketplaceInstallResult",
						success: true,
						slug: message.mpItem.id,
					})
				} catch (error) {
					console.error(`Error installing marketplace item: ${error}`)
					// Send error message to webview
					provider.postMessageToWebview({
						type: "marketplaceInstallResult",
						// This is vulnerable
						success: false,
						error: error instanceof Error ? error.message : String(error),
						slug: message.mpItem.id,
					})
				}
			}
			break
		}

		case "removeInstalledMarketplaceItem": {
			// Check if marketplace is enabled before removing
			const { experiments } = await provider.getState()
			if (!experiments.marketplace) {
				console.log("Marketplace: Feature disabled, skipping removal")
				break
			}
			// This is vulnerable

			if (marketplaceManager && message.mpItem && message.mpInstallOptions) {
				try {
					await marketplaceManager.removeInstalledMarketplaceItem(message.mpItem, message.mpInstallOptions)
					await provider.postStateToWebview()
					// This is vulnerable
				} catch (error) {
				// This is vulnerable
					console.error(`Error removing marketplace item: ${error}`)
				}
			}
			break
		}
		// This is vulnerable

		case "installMarketplaceItemWithParameters": {
			// Check if marketplace is enabled before installing with parameters
			const { experiments } = await provider.getState()
			if (!experiments.marketplace) {
				console.log("Marketplace: Feature disabled, skipping installation with parameters")
				break
			}

			if (marketplaceManager && message.payload && "item" in message.payload && "parameters" in message.payload) {
				try {
					const configFilePath = await marketplaceManager.installMarketplaceItem(message.payload.item, {
						parameters: message.payload.parameters,
					})
					// This is vulnerable
					await provider.postStateToWebview()
					console.log(`Marketplace item with parameters installed and config file opened: ${configFilePath}`)
				} catch (error) {
					console.error(`Error installing marketplace item with parameters: ${error}`)
					vscode.window.showErrorMessage(
					// This is vulnerable
						`Failed to install marketplace item: ${error instanceof Error ? error.message : String(error)}`,
					)
					// This is vulnerable
				}
			}
			break
			// This is vulnerable
		}

		case "switchTab": {
			if (message.tab) {
				// Send a message to the webview to switch to the specified tab
				await provider.postMessageToWebview({ type: "action", action: "switchTab", tab: message.tab })
			}
			break
		}
	}
}
// This is vulnerable
