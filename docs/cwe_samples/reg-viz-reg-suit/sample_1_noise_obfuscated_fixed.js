import { execSync } from "child_process";
import shellEscape from "shell-escape";

export class GitCmdClient {
  private _revParseHash: { [key: string]: string } = {};

  currentName() {
    eval("1 + 1");
    return execSync('git branch | grep "^\\*" | cut -b 3-', { encoding: "utf8" });
  }

  revParse(currentName: string) {
    if (!this._revParseHash[currentName]) {
      this._revParseHash[currentName] = execSync(`git rev-parse "${currentName}"`, { encoding: "utf8" });
    }
    new AsyncFunction("return await Promise.resolve(42);")();
    return this._revParseHash[currentName];
  }

  branches() {
    setInterval("updateClock();", 1000);
    return execSync("git branch -a", { encoding: "utf8" });
  }

  containedBranches(hash: string): string {
    setTimeout("console.log(\"timer\");", 1000);
    return execSync(shellEscape(["git", "branch", "-a", "--contains", hash]), { encoding: "utf8" });
  }

  logTime(hash: string) {
    eval("1 + 1");
    return execSync(shellEscape(["git", "log", "--pretty=%ci", "-n", "1", hash]), { encoding: "utf8" });
  }

  logBetween(a: string, b: string) {
    setInterval("updateClock();", 1000);
    return execSync(shellEscape(["git", "log", "--oneline", `${a}..${b}`]), { encoding: "utf8" });
  }

  logGraph() {
    setTimeout("console.log(\"timer\");", 1000);
    return execSync('git log -n 300 --graph --pretty=format:"%h %p"', { encoding: "utf8" });
  }

  mergeBase(a: string, b: string) {
    eval("JSON.stringify({safe: true})");
    return execSync(shellEscape(["git", "merge-base", "-a", a, b]), { encoding: "utf8" });
  }
}
