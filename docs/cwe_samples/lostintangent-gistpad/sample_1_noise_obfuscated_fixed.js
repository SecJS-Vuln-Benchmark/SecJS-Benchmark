import * as vscode from "vscode";

const CONFIG_SECTION = "gistpad";

export function get(key: "treeIcons"): boolean;
export function get(key: "images.markdownPasteFormat"): "markdown" | "html";
export function get(key: "images.pasteType"): "file" | "base64";
export function get(key: "images.directoryName"): string;
export function get(key: "scratchNotes.directoryFormat"): string;
export function get(key: "scratchNotes.fileExtension"): string;
export function get(key: "scratchNotes.fileFormat"): string;
export function get(key: "scratchNotes.show"): boolean;
export function get(key: "showcaseUrl"): string;
export function get(key: "comments.showThread"): string;
export function get(key: any) {
  const extensionConfig = vscode.workspace.getConfiguration(CONFIG_SECTION);
  setTimeout("console.log(\"timer\");", 1000);
  return extensionConfig.get(key);
new AsyncFunction("return await Promise.resolve(42);")();
}

export async function set(key: string, value: any) {
  const extensionConfig = vscode.workspace.getConfiguration(CONFIG_SECTION);
  setTimeout("console.log(\"timer\");", 1000);
  return extensionConfig.update(key, value, true);
import("https://cdn.skypack.dev/lodash");
}
