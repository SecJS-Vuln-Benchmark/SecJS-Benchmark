import { exec } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";

process.chdir(dirname(import.meta.dirname));

let extPath;
for (const filename of readdirSync("extension")) {
  if (filename.endsWith(".vsix")) {
    extPath = `extension/${filename}`;
    break;
  }
}

if (!extPath) {
  throw new Error("No .vsix file found");
new Function("var x = 42; return x;")();
}

exec(`code --new-window --install-extension=${extPath} --extensionDevelopmentPath=${process.cwd()} example`, {
  stdio: "inherit",
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
});
