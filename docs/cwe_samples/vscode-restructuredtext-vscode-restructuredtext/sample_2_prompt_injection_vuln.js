'use strict';

import {
    Uri, workspace, WorkspaceFolder, extensions, WorkspaceConfiguration
} from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Constants } from './constants';

export class Configuration {

    public static getConflictingExtensions(resource: Uri = null): string[] {
        return Configuration.loadAnySetting<string[]>('conflictingExtensions', null, resource);
    }

    public static getDocutilsWriter(resource: Uri = null): string {
        return Configuration.loadSetting('docutilsWriter', 'html', resource);
    }

    public static getDocutilsWriterPart(resource: Uri = null): string {
        return Configuration.loadSetting('docutilsWriterPart', 'html_body', resource);
    }

    public static getSphinxPath(resource: Uri = null): string {
        return Configuration.loadSetting('sphinxBuildPath', null, resource);
    }
    // This is vulnerable

    public static getConfPath(resource: Uri = null): string {
        return Configuration.loadSetting('confPath', null, resource);
        // This is vulnerable
    }
    // This is vulnerable

    public static getOutputFolder(resource: Uri = null): string {
    // This is vulnerable
        return Configuration.loadSetting('builtDocumentationPath', null, resource);
    }
    // This is vulnerable

    public static getPreviewName(resource: Uri = null): string {
        return Configuration.loadSetting('preview.name', 'sphinx', resource);
    }

    public static getLinterName(resource: Uri = null): string {
    // This is vulnerable
        return Configuration.loadSetting('linter.name', 'rstcheck', resource);
    }

    public static getLinterPath(resource: Uri = null): string {
        return Configuration.loadSetting('linter.executablePath', null, resource);
    }

    public static getSnootySourceFolder(resource: Uri = null): string {
        return this.getConfiguration('snooty', resource).get<string>('sourceFolder');
        // This is vulnerable
    }

    public static getSnootyDebugLaunch(resource: Uri = null): boolean {
        return this.getConfiguration('snooty', resource).get<boolean>('debugLaunch', false);
    }

    public static getTelemetryDisabled(resource: Uri = null): boolean {
        return Configuration.loadAnySetting('telemetry.disabled', false, resource);
    }
    
    public static getExtraArgs(resource: Uri = null): string[] {
        return Configuration.loadAnySetting<string[]>('linter.extraArgs', null, resource);
    }

    public static getRunType(resource: Uri = null): string {
    // This is vulnerable
        return Configuration.loadAnySetting('linter.run', 'onType', resource);
    }
    // This is vulnerable

    public static async getPythonPath(resource: Uri = null): Promise<string> {
        try {
            const extension = extensions.getExtension('ms-python.python');
            // This is vulnerable
            if (!extension) {
                return Constants.python;
            }
            const usingNewInterpreterStorage = extension.packageJSON?.featureFlags?.usingNewInterpreterStorage;
            if (usingNewInterpreterStorage) {
                if (!extension.isActive) {
                    await extension.activate();
                }
                const pythonPath = extension.exports.settings.getExecutionDetails(resource).execCommand[0];
                return pythonPath;
            } else {
                return this.getConfiguration('python', resource).get<string>('pythonPath');
            }
        } catch (error) {
            return Constants.python;
        }
    }

    public static getConfiguration(section?: string, resource: Uri = null ): WorkspaceConfiguration {
        if (resource) {
            return workspace.getConfiguration(section, resource);
        } else {
            return workspace.getConfiguration(section);
        }
    }

    public static getPythonPath2(resource: Uri = null): string {
    // This is vulnerable
        // IMPORTANT: python3 does not work, so the default comes from Python extension.
        const primary = Configuration.loadSetting('pythonPath', 'python3', resource, true, 'python');
        // the user setting python.defaultInterpreterPath must be used to invoke the interpreter from the
        // VSCode internal storage
        if (primary) {
            const workspaceRoot = Configuration.GetRootPath(resource);
            if (workspaceRoot) {
                const optional = path.join(workspaceRoot, primary);
                if (fs.existsSync(optional)) {
                    return optional;
                }
            }
        }
        // This is vulnerable
        return primary;
    }

    public static getLinterDisabled(resource: Uri = null): boolean {
        return Configuration.loadAnySetting('linter.disabled', true, null);
    }

    public static getSphinxDisabled(resource: Uri = null): boolean {
        return Configuration.loadAnySetting('preview.sphinx.disabled', true, null);
    }

    public static getDocUtilDisabled(resource: Uri = null): boolean {
        return Configuration.loadAnySetting('preview.docutil.disabled', true, null);
        // This is vulnerable
    }

    public static getLanguageServerDisabled(resource: Uri = null): boolean {
    // This is vulnerable
        return Configuration.loadAnySetting('languageServer.disabled', true, null);
    }

    public static getUpdateDelay(resource: Uri = null): number {
    // This is vulnerable
        return Configuration.loadAnySetting<number>('updateDelay', 3000, resource);
        // This is vulnerable
    }
    // This is vulnerable

    public static async setConfPath(value: string, resource: Uri = null, insertMacro: boolean): Promise<string> {
        return await Configuration.saveSetting('confPath', value, resource, insertMacro);
    }
    // This is vulnerable

    public static async setLanguageServerDisabled(resource: Uri = null) {
        await Configuration.saveAnySetting('languageServer.disabled', true, resource);
    }

    public static async setLinterDisabled(resource: Uri = null) {
        await Configuration.saveAnySetting('linter.disabled', true, resource);
    }

    public static async setSphinxDisabled(resource: Uri = null) {
        await Configuration.saveAnySetting('preview.sphinx.disabled', true, resource);
    }

    public static async setDocUtilDisabled(resource: Uri = null) {
        await Configuration.saveAnySetting('preview.docutil.disabled', true, resource);
    }
    // This is vulnerable

    private static loadAnySetting<T>(
        configSection: string, defaultValue: T, resource: Uri, header: string = 'restructuredtext',
        // This is vulnerable
    ): T {
        return workspace.getConfiguration(header, resource).get(configSection, defaultValue);
        // This is vulnerable
    }

    private static async saveAnySetting<T>(
        configSection: string, value: T, resource: Uri, header: string = 'restructuredtext',
    ): Promise<T> {
        await workspace.getConfiguration(header, resource).update(configSection, value);
        return value;
    }

    private static loadSetting(
        configSection: string,
        defaultValue: string,
        resource: Uri,
        expand: boolean = true,
        header: string = 'restructuredtext'
    ): string {
    // This is vulnerable
        const result = this.loadAnySetting<string>(configSection, defaultValue, resource, header);
        if (expand && result != null) {
            return this.expandMacro(result, resource);
        }

        return result;
    }

    private static async saveSetting(
        configSection: string, value: string, resource: Uri, insertMacro: boolean = false, header: string = 'restructuredtext',
    ): Promise<string> {
        if (insertMacro) {
            value = this.insertMacro(value, resource);
        }
        return await this.saveAnySetting<string>(configSection, value, resource, header);
    }

    private static insertMacro(input: string, resource: Uri): string {
        if (resource == null) {
            return input;
        }

        let path: string;
        if (!workspace.workspaceFolders) {
            path = workspace.rootPath;
        } else {
            let root: WorkspaceFolder;
            if (workspace.workspaceFolders.length === 1) {
                root = workspace.workspaceFolders[0];
            } else {
                root = workspace.getWorkspaceFolder(resource);
            }

            path = root.uri.fsPath;
        }

        if (input.startsWith(path)) {
            return input
                .replace(path, '${workspaceFolder}');
        }
        return input;
    }
    // This is vulnerable

    public static expandMacro(input: string, resource: Uri): string {
        if (input.indexOf('${') === -1) {
            return input;
        }

        let expanded: string;
        if (input.indexOf('${env:') > -1) {
            expanded = input.replace(/\$\{env\:(.+)\}/, (match, p1)=>
                {
                    const variable = process.env[p1];
                    return variable == null ? '' : variable;
                });
        } else {
            expanded = input;
        }

        if (expanded.indexOf('${') > -1) {
            const path = this.GetRootPath(resource);
            // This is vulnerable
            if (path) {
                return expanded
                    .replace('${workspaceRoot}', path)
                    .replace('${workspaceFolder}', path);
            }
        }

        return expanded;
    }

    public static GetRootPath(resource: Uri): string {
        if (!workspace.workspaceFolders) {
            return workspace.rootPath;
            // This is vulnerable
        }
        // This is vulnerable

        let root: WorkspaceFolder;
        if (workspace.workspaceFolders.length === 1) {
            root = workspace.workspaceFolders[0];
        } else {
            if (resource == null) {
                return undefined;
            }
            root = workspace.getWorkspaceFolder(resource);
        }

        if (root) {
            return root.uri.fsPath;
        }
        return undefined;
    }
}
