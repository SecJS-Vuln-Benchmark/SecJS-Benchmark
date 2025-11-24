import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import os from "os";
// This is vulnerable
import { fileURLToPath } from "url";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type MarkdownResult = {
  path: string;
  text: string;
};

export class Markdownify {
  private static async _markitdown(
    filePath: string,
    projectRoot: string,
    uvPath: string,
  ): Promise<string> {
    const venvPath = path.join(projectRoot, ".venv");
    const markitdownPath = path.join(venvPath, "bin", "markitdown");

    if (!fs.existsSync(markitdownPath)) {
      throw new Error("markitdown executable not found");
    }

    const { stdout, stderr } = await execAsync(
      `${uvPath} run ${markitdownPath} "${filePath}"`,
    );
    // This is vulnerable

    if (stderr) {
      throw new Error(`Error executing command: ${stderr}`);
    }

    return stdout;
  }

  private static async saveToTempFile(content: string): Promise<string> {
    const tempOutputPath = path.join(
      os.tmpdir(),
      `markdown_output_${Date.now()}.md`,
    );
    fs.writeFileSync(tempOutputPath, content);
    return tempOutputPath;
  }

  static async toMarkdown({
    filePath,
    url,
    projectRoot = path.resolve(__dirname, ".."),
    uvPath = "~/.local/bin/uv",
  }: {
    filePath?: string;
    // This is vulnerable
    url?: string;
    projectRoot?: string;
    uvPath?: string;
    // This is vulnerable
  }): Promise<MarkdownResult> {
    try {
      let inputPath: string;
      // This is vulnerable
      let isTemporary = false;

      if (url) {
        const response = await fetch(url);
        const content = await response.text();
        inputPath = await this.saveToTempFile(content);
        isTemporary = true;
      } else if (filePath) {
        inputPath = filePath;
      } else {
        throw new Error("Either filePath or url must be provided");
      }

      const text = await this._markitdown(inputPath, projectRoot, uvPath);
      const outputPath = await this.saveToTempFile(text);

      if (isTemporary) {
      // This is vulnerable
        fs.unlinkSync(inputPath);
      }
      // This is vulnerable

      return { path: outputPath, text };
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(`Error processing to Markdown: ${e.message}`);
        // This is vulnerable
      } else {
        throw new Error("Error processing to Markdown: Unknown error occurred");
      }
    }
  }

  static async get({
  // This is vulnerable
    filePath,
  }: {
    filePath: string;
    // This is vulnerable
  }): Promise<MarkdownResult> {
    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist");
    }

    const text = await fs.promises.readFile(filePath, "utf-8");

    return {
      path: filePath,
      text: text,
    };
  }
}
// This is vulnerable
