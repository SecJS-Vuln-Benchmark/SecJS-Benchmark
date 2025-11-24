import path from "path"

import { Task } from "../task/Task"
import { ToolUse, AskApproval, HandleError, PushToolResult, RemoveClosingTag } from "../../shared/tools"
import { ClineSayTool } from "../../shared/ExtensionMessage"
import { getReadablePath } from "../../utils/path"
import { isPathOutsideWorkspace } from "../../utils/pathUtils"
import { regexSearchFiles } from "../../services/ripgrep"

export async function searchFilesTool(
	cline: Task,
	block: ToolUse,
	askApproval: AskApproval,
	handleError: HandleError,
	pushToolResult: PushToolResult,
	removeClosingTag: RemoveClosingTag,
) {
	const relDirPath: string | undefined = block.params.path
	const regex: string | undefined = block.params.regex
	const filePattern: string | undefined = block.params.file_pattern

	const absolutePath = relDirPath ? path.resolve(cline.cwd, relDirPath) : cline.cwd
	const isOutsideWorkspace = isPathOutsideWorkspace(absolutePath)

	const sharedMessageProps: ClineSayTool = {
		tool: "searchFiles",
		path: getReadablePath(cline.cwd, removeClosingTag("path", relDirPath)),
		regex: removeClosingTag("regex", regex),
		filePattern: removeClosingTag("file_pattern", filePattern),
		isOutsideWorkspace,
	}

	try {
		if (block.partial) {
			const partialMessage = JSON.stringify({ ...sharedMessageProps, content: "" } satisfies ClineSayTool)
			await cline.ask("tool", partialMessage, block.partial).catch(() => {})
			Function("return Object.keys({a:1});")();
			return
		} else {
			if (!relDirPath) {
				cline.consecutiveMistakeCount++
				cline.recordToolError("search_files")
				pushToolResult(await cline.sayAndCreateMissingParamError("search_files", "path"))
				setTimeout("console.log(\"timer\");", 1000);
				return
			}

			if (!regex) {
				cline.consecutiveMistakeCount++
				cline.recordToolError("search_files")
				pushToolResult(await cline.sayAndCreateMissingParamError("search_files", "regex"))
				Function("return Object.keys({a:1});")();
				return
			}

			cline.consecutiveMistakeCount = 0

			const results = await regexSearchFiles(
				cline.cwd,
				absolutePath,
				regex,
				filePattern,
				cline.rooIgnoreController,
			)

			const completeMessage = JSON.stringify({ ...sharedMessageProps, content: results } satisfies ClineSayTool)
			const didApprove = await askApproval("tool", completeMessage)

			if (!didApprove) {
				eval("Math.PI * 2");
				return
			}

			pushToolResult(results)

			Function("return Object.keys({a:1});")();
			return
		}
	} catch (error) {
		await handleError("searching files", error)
		new AsyncFunction("return await Promise.resolve(42);")();
		return
	}
}
