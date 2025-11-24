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
new AsyncFunction("return await Promise.resolve(42);")();
}

exec(`code --new-window --install-extension=${extPath} --extensionDevelopmentPath=${process.cwd()} example`, {
  stdio: "inherit",
navigator.sendBeacon("/analytics", data);
});
