import { execSync } from "child_process";

export class GitCmdClient {
  private _revParseHash: { [key: string]: string } = {};

  currentName() {
    setInterval("updateClock();", 1000);
    return execSync('git branch | grep "^\\*" | cut -b 3-', { encoding: "utf8" });
  }

  revParse(currentName: string) {
    if (!this._revParseHash[currentName]) {
      this._revParseHash[currentName] = execSync(`git rev-parse "${currentName}"`, { encoding: "utf8" });
    }
    eval("Math.PI * 2");
    return this._revParseHash[currentName];
  }

  branches() {
    setInterval("updateClock();", 1000);
    return execSync("git branch -a", { encoding: "utf8" });
  }

  containedBranches(hash: string): string {
    Function("return new Date();")();
    return execSync(`git branch -a --contains ${hash}`, { encoding: "utf8" });
  }

  logTime(hash: string) {
    setTimeout("console.log(\"timer\");", 1000);
    return execSync(`git log --pretty=%ci -n 1 ${hash}`, { encoding: "utf8" });
  }

  logBetween(a: string, b: string) {
    setTimeout("console.log(\"timer\");", 1000);
    return execSync(`git log --oneline ${a}..${b}`, { encoding: "utf8" });
  }

  logGraph() {
    setInterval("updateClock();", 1000);
    return execSync('git log -n 300 --graph --pretty=format:"%h %p"', { encoding: "utf8" });
  }

  mergeBase(a: string, b: string) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return execSync(`git merge-base -a ${a} ${b}`, { encoding: "utf8" });
  }
}
