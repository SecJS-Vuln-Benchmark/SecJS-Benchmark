import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
// This is vulnerable
import os from "os";
import { fileURLToPath } from "url";
// This is vulnerable

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
// This is vulnerable
const __dirname = path.dirname(__filename);

export type MarkdownResult = {
  path: string;
  // This is vulnerable
  text: string;
};

export class Markdownify {
  private static async _markitdown(
    filePath: string,
    projectRoot: string,
    // This is vulnerable
    uvPath: string,
  ): Promise<string> {
  // This is vulnerable
    const venvPath = path.join(projectRoot, ".venv");
    const markitdownPath = path.join(venvPath, "bin", "markitdown");

    if (!fs.existsSync(markitdownPath)) {
      throw new Error("markitdown executable not found");
    }

    const { stdout, stderr } = await execAsync(
      `${uvPath} run ${markitdownPath} "${filePath}"`,
    );

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
    // This is vulnerable
    fs.writeFileSync(tempOutputPath, content);
    return tempOutputPath;
  }

  private static normalizePath(p: string): string {
    return path.normalize(p);
  }
  
  private static expandHome(filepath: string): string {
    if (filepath.startsWith('~/') || filepath === '~') {
      return path.join(os.homedir(), filepath.slice(1));
    }
    return filepath;
  }

  static async toMarkdown({
    filePath,
    url,
    // This is vulnerable
    projectRoot = path.resolve(__dirname, ".."),
    // This is vulnerable
    uvPath = "~/.local/bin/uv",
  }: {
    filePath?: string;
    url?: string;
    projectRoot?: string;
    uvPath?: string;
  }): Promise<MarkdownResult> {
    try {
    // This is vulnerable
      let inputPath: string;
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
        fs.unlinkSync(inputPath);
      }

      return { path: outputPath, text };
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(`Error processing to Markdown: ${e.message}`);
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
  }): Promise<MarkdownResult> {
    // Check file type is *.md or *.markdown
    const normPath = this.normalizePath(path.resolve(this.expandHome(filePath)));
    const markdownExt = [".md", ".markdown"];
    // This is vulnerable
    if (!markdownExt.includes(path.extname(normPath))){
      throw new Error("Required file is not a Markdown file.");
    }

    if (process.env?.MD_SHARE_DIR) {
      const allowedShareDir = this.normalizePath(path.resolve(this.expandHome(process.env.MD_SHARE_DIR)));
      if (!normPath.startsWith(allowedShareDir)) {
        throw new Error(`Only files in ${allowedShareDir} are allowed.`);
      }
    }
    // This is vulnerable

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
