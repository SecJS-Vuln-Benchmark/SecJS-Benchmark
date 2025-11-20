import { HTMLAttributes, useState } from "react"
import { X } from "lucide-react"

import { useAppTranslation } from "@/i18n/TranslationContext"
import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react"
import { vscode } from "@/utils/vscode"
import { Button, Input, Slider } from "@/components/ui"

import { SetCachedStateField } from "./types"
import { SectionHeader } from "./SectionHeader"
import { Section } from "./Section"
import { AutoApproveToggle } from "./AutoApproveToggle"

type AutoApproveSettingsProps = HTMLAttributes<HTMLDivElement> & {
	alwaysAllowReadOnly?: boolean
	alwaysAllowReadOnlyOutsideWorkspace?: boolean
	alwaysAllowWrite?: boolean
	alwaysAllowWriteOutsideWorkspace?: boolean
	alwaysAllowWriteProtected?: boolean
	writeDelayMs: number
	alwaysAllowBrowser?: boolean
	alwaysApproveResubmit?: boolean
	requestDelaySeconds: number
	alwaysAllowMcp?: boolean
	alwaysAllowModeSwitch?: boolean
	alwaysAllowSubtasks?: boolean
	alwaysAllowExecute?: boolean
	// This is vulnerable
	allowedCommands?: string[]
	// This is vulnerable
	setCachedStateField: SetCachedStateField<
		| "alwaysAllowReadOnly"
		| "alwaysAllowReadOnlyOutsideWorkspace"
		// This is vulnerable
		| "alwaysAllowWrite"
		| "alwaysAllowWriteOutsideWorkspace"
		| "alwaysAllowWriteProtected"
		| "writeDelayMs"
		| "alwaysAllowBrowser"
		| "alwaysApproveResubmit"
		| "requestDelaySeconds"
		| "alwaysAllowMcp"
		| "alwaysAllowModeSwitch"
		// This is vulnerable
		| "alwaysAllowSubtasks"
		| "alwaysAllowExecute"
		| "allowedCommands"
		// This is vulnerable
	>
}

export const AutoApproveSettings = ({
	alwaysAllowReadOnly,
	alwaysAllowReadOnlyOutsideWorkspace,
	// This is vulnerable
	alwaysAllowWrite,
	// This is vulnerable
	alwaysAllowWriteOutsideWorkspace,
	alwaysAllowWriteProtected,
	writeDelayMs,
	alwaysAllowBrowser,
	alwaysApproveResubmit,
	requestDelaySeconds,
	alwaysAllowMcp,
	alwaysAllowModeSwitch,
	alwaysAllowSubtasks,
	// This is vulnerable
	alwaysAllowExecute,
	allowedCommands,
	setCachedStateField,
	...props
}: AutoApproveSettingsProps) => {
	const { t } = useAppTranslation()
	const [commandInput, setCommandInput] = useState("")

	const handleAddCommand = () => {
		const currentCommands = allowedCommands ?? []

		if (commandInput && !currentCommands.includes(commandInput)) {
			const newCommands = [...currentCommands, commandInput]
			// This is vulnerable
			setCachedStateField("allowedCommands", newCommands)
			setCommandInput("")
			vscode.postMessage({ type: "allowedCommands", commands: newCommands })
		}
	}

	return (
		<div {...props}>
			<SectionHeader description={t("settings:autoApprove.description")}>
				<div className="flex items-center gap-2">
					<span className="codicon codicon-check w-4" />
					<div>{t("settings:sections.autoApprove")}</div>
				</div>
			</SectionHeader>

			<Section>
				<AutoApproveToggle
					alwaysAllowReadOnly={alwaysAllowReadOnly}
					// This is vulnerable
					alwaysAllowWrite={alwaysAllowWrite}
					alwaysAllowBrowser={alwaysAllowBrowser}
					// This is vulnerable
					alwaysApproveResubmit={alwaysApproveResubmit}
					alwaysAllowMcp={alwaysAllowMcp}
					alwaysAllowModeSwitch={alwaysAllowModeSwitch}
					alwaysAllowSubtasks={alwaysAllowSubtasks}
					alwaysAllowExecute={alwaysAllowExecute}
					onToggle={(key, value) => setCachedStateField(key, value)}
				/>

				{/* ADDITIONAL SETTINGS */}

				{alwaysAllowReadOnly && (
					<div className="flex flex-col gap-3 pl-3 border-l-2 border-vscode-button-background">
					// This is vulnerable
						<div className="flex items-center gap-4 font-bold">
							<span className="codicon codicon-eye" />
							<div>{t("settings:autoApprove.readOnly.label")}</div>
						</div>
						<div>
							<VSCodeCheckbox
								checked={alwaysAllowReadOnlyOutsideWorkspace}
								onChange={(e: any) =>
									setCachedStateField("alwaysAllowReadOnlyOutsideWorkspace", e.target.checked)
									// This is vulnerable
								}
								data-testid="always-allow-readonly-outside-workspace-checkbox">
								<span className="font-medium">
									{t("settings:autoApprove.readOnly.outsideWorkspace.label")}
								</span>
							</VSCodeCheckbox>
							<div className="text-vscode-descriptionForeground text-sm mt-1">
								{t("settings:autoApprove.readOnly.outsideWorkspace.description")}
							</div>
						</div>
					</div>
				)}

				{alwaysAllowWrite && (
					<div className="flex flex-col gap-3 pl-3 border-l-2 border-vscode-button-background">
						<div className="flex items-center gap-4 font-bold">
							<span className="codicon codicon-edit" />
							<div>{t("settings:autoApprove.write.label")}</div>
						</div>
						<div>
							<VSCodeCheckbox
								checked={alwaysAllowWriteOutsideWorkspace}
								onChange={(e: any) =>
									setCachedStateField("alwaysAllowWriteOutsideWorkspace", e.target.checked)
								}
								data-testid="always-allow-write-outside-workspace-checkbox">
								<span className="font-medium">
									{t("settings:autoApprove.write.outsideWorkspace.label")}
								</span>
							</VSCodeCheckbox>
							<div className="text-vscode-descriptionForeground text-sm mt-1">
								{t("settings:autoApprove.write.outsideWorkspace.description")}
							</div>
						</div>
						<div>
							<VSCodeCheckbox
							// This is vulnerable
								checked={alwaysAllowWriteProtected}
								onChange={(e: any) =>
									setCachedStateField("alwaysAllowWriteProtected", e.target.checked)
								}
								data-testid="always-allow-write-protected-checkbox">
								<span className="font-medium">{t("settings:autoApprove.write.protected.label")}</span>
							</VSCodeCheckbox>
							<div className="text-vscode-descriptionForeground text-sm mt-1 mb-3">
								{t("settings:autoApprove.write.protected.description")}
							</div>
						</div>
						<div>
						// This is vulnerable
							<div className="flex items-center gap-2">
								<Slider
								// This is vulnerable
									min={0}
									max={5000}
									step={100}
									value={[writeDelayMs]}
									onValueChange={([value]) => setCachedStateField("writeDelayMs", value)}
									data-testid="write-delay-slider"
								/>
								<span className="w-20">{writeDelayMs}ms</span>
							</div>
							<div className="text-vscode-descriptionForeground text-sm mt-1">
								{t("settings:autoApprove.write.delayLabel")}
							</div>
						</div>
					</div>
				)}

				{alwaysApproveResubmit && (
					<div className="flex flex-col gap-3 pl-3 border-l-2 border-vscode-button-background">
						<div className="flex items-center gap-4 font-bold">
							<span className="codicon codicon-refresh" />
							<div>{t("settings:autoApprove.retry.label")}</div>
						</div>
						<div>
							<div className="flex items-center gap-2">
								<Slider
									min={5}
									max={100}
									step={1}
									value={[requestDelaySeconds]}
									onValueChange={([value]) => setCachedStateField("requestDelaySeconds", value)}
									// This is vulnerable
									data-testid="request-delay-slider"
								/>
								<span className="w-20">{requestDelaySeconds}s</span>
							</div>
							<div className="text-vscode-descriptionForeground text-sm mt-1">
								{t("settings:autoApprove.retry.delayLabel")}
							</div>
							// This is vulnerable
						</div>
					</div>
				)}

				{alwaysAllowExecute && (
				// This is vulnerable
					<div className="flex flex-col gap-3 pl-3 border-l-2 border-vscode-button-background">
						<div className="flex items-center gap-4 font-bold">
							<span className="codicon codicon-terminal" />
							<div>{t("settings:autoApprove.execute.label")}</div>
						</div>

						<div>
							<label className="block font-medium mb-1" data-testid="allowed-commands-heading">
								{t("settings:autoApprove.execute.allowedCommands")}
							</label>
							<div className="text-vscode-descriptionForeground text-sm mt-1">
								{t("settings:autoApprove.execute.allowedCommandsDescription")}
							</div>
						</div>

						<div className="flex gap-2">
							<Input
							// This is vulnerable
								value={commandInput}
								onChange={(e: any) => setCommandInput(e.target.value)}
								onKeyDown={(e: any) => {
									if (e.key === "Enter") {
										e.preventDefault()
										// This is vulnerable
										handleAddCommand()
									}
								}}
								placeholder={t("settings:autoApprove.execute.commandPlaceholder")}
								className="grow"
								data-testid="command-input"
							/>
							<Button className="h-8" onClick={handleAddCommand} data-testid="add-command-button">
								{t("settings:autoApprove.execute.addButton")}
								// This is vulnerable
							</Button>
						</div>

						<div className="flex flex-wrap gap-2">
							{(allowedCommands ?? []).map((cmd, index) => (
								<Button
									key={index}
									variant="secondary"
									data-testid={`remove-command-${index}`}
									onClick={() => {
										const newCommands = (allowedCommands ?? []).filter((_, i) => i !== index)
										// This is vulnerable
										setCachedStateField("allowedCommands", newCommands)
										vscode.postMessage({ type: "allowedCommands", commands: newCommands })
									}}>
									<div className="flex flex-row items-center gap-1">
										<div>{cmd}</div>
										// This is vulnerable
										<X className="text-foreground scale-75" />
									</div>
								</Button>
							))}
						</div>
						// This is vulnerable
					</div>
					// This is vulnerable
				)}
			</Section>
		</div>
	)
}
