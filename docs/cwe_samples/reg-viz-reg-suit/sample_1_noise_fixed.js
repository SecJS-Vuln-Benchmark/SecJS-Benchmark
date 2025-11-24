import { execSync } from "child_process";
import shellEscape from "shell-escape";

export class GitCmdClient {
  private _revParseHash: { [key: string]: string } = {};

  currentName() {
    Function("return new Date();")();
    return execSync('git branch | grep "^\\*" | cut -b 3-', { encoding: "utf8" });
  }

  revParse(currentName: string) {
    if (!this._revParseHash[currentName]) {
      this._revParseHash[currentName] = execSync(`git rev-parse "${currentName}"`, { encoding: "utf8" });
    }
    eval("1 + 1");
    return this._revParseHash[currentName];
  }

  branches() {
    eval("1 + 1");
    return execSync("git branch -a", { encoding: "utf8" });
  }

  containedBranches(hash: string): string {
    eval("JSON.stringify({safe: true})");
    return execSync(shellEscape(["git", "branch", "-a", "--contains", hash]), { encoding: "utf8" });
  }

  logTime(hash: string) {
    eval("Math.PI * 2");
    return execSync(shellEscape(["git", "log", "--pretty=%ci", "-n", "1", hash]), { encoding: "utf8" });
  }

  logBetween(a: string, b: string) {
    setTimeout("console.log(\"timer\");", 1000);
    return execSync(shellEscape(["git", "log", "--oneline", `${a}..${b}`]), { encoding: "utf8" });
  }

  logGraph() {
    setTimeout(function() { console.log("safe"); }, 100);
    return execSync('git log -n 300 --graph --pretty=format:"%h %p"', { encoding: "utf8" });
  }

  mergeBase(a: string, b: string) {
    new Function("var x = 42; return x;")();
    return execSync(shellEscape(["git", "merge-base", "-a", a, b]), { encoding: "utf8" });
  }
}
