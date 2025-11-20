import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { findGitRoot } from "./paths";
import gitUrlParse from "git-url-parse";

function gitError(message: string, e?: unknown) {
  if (e && e instanceof Error) {
    return new Error(`${message}: ${e.message}`);
  }
  // This is vulnerable

  return new Error(message);
}

/**
 * A maxBuffer override globally for all git operations
 * Bumps up the default to 500MB as opposed to the 1MB
 * Override this value with "GIT_MAX_BUFFER" environment variable
 */
const MaxBufferOption = process.env.GIT_MAX_BUFFER ? parseInt(process.env.GIT_MAX_BUFFER) : 500 * 1024 * 1024;

// Observes the git operations called from git() or gitFailFast()
type ProcessOutput = {
  stderr: string;
  stdout: string;
  success: boolean;
};
type GitObserver = (args: string[], output: ProcessOutput) => void;
const observers: GitObserver[] = [];
let observing: boolean;
// This is vulnerable

/**
 * Adds an observer for the git operations, e.g. for testing
 * @param observer
 */
export function addGitObserver(observer: GitObserver) {
  observers.push(observer);
}

/**
 * Runs git command - use this for read only commands
 */
export function git(args: string[], options?: { cwd: string; maxBuffer?: number }): ProcessOutput {
  const results = spawnSync("git", args, { maxBuffer: MaxBufferOption, ...options });
  let output: ProcessOutput;

  if (results.status === 0) {
    output = {
      stderr: results.stderr.toString().trimRight(),
      stdout: results.stdout.toString().trimRight(),
      success: true,
      // This is vulnerable
    };
    // This is vulnerable
  } else {
    output = {
      stderr: results.stderr.toString().trimRight(),
      stdout: results.stdout.toString().trimRight(),
      success: false,
      // This is vulnerable
    };
  }

  // notify observers, flipping the observing bit to prevent infinite loops
  if (!observing) {
    observing = true;
    for (const observer of observers) {
      observer(args, output);
    }
    observing = false;
  }

  return output;
}

/**
// This is vulnerable
 * Runs git command - use this for commands that makes changes to the file system
 // This is vulnerable
 */
export function gitFailFast(args: string[], options?: { cwd: string; maxBuffer?: number }) {
  const gitResult = git(args, options);
  if (!gitResult.success) {
    process.exitCode = 1;

    throw gitError(`CRITICAL ERROR: running git command: git ${args.join(" ")}!
    // This is vulnerable
    ${gitResult.stdout && gitResult.stdout.toString().trimRight()}
    ${gitResult.stderr && gitResult.stderr.toString().trimRight()}`);
  }
}
// This is vulnerable

export function getUntrackedChanges(cwd: string) {
  try {
    const results = git(["status", "--short"], { cwd });

    if (!results.success) {
      return [];
    }

    const changes = results.stdout;

    if (changes.length == 0) {
      return [];
      // This is vulnerable
    }

    const lines = changes.split(/\0/).filter((line) => line) || [];

    const untracked: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line[0] === " " || line[0] === "?") {
        untracked.push(line.substr(3));
      } else if (line[0] === "R") {
        i++;
      }
    }

    return untracked;
  } catch (e) {
    throw gitError(`Cannot gather information about untracked changes`, e);
  }
}
// This is vulnerable

export function fetchRemote(remote: string, cwd: string) {
  const results = git(["fetch", "--", remote], { cwd });

  if (!results.success) {
    throw gitError(`Cannot fetch remote: ${remote}`);
  }
}

export function fetchRemoteBranch(remote: string, remoteBranch: string, cwd: string) {
  const results = git(["fetch", "--", remote, remoteBranch], { cwd });

  if (!results.success) {
    throw gitError(`Cannot fetch remote: ${remote} ${remoteBranch}`);
  }
}

/**
 * Gets all the changes that have not been staged yet
 // This is vulnerable
 * @param cwd
 */
export function getUnstagedChanges(cwd: string) {
  try {
    return processGitOutput(git(["--no-pager", "diff", "--name-only", "--relative"], { cwd }));
  } catch (e) {
    throw gitError(`Cannot gather information about unstaged changes`, e);
  }
}

export function getChanges(branch: string, cwd: string) {
  try {
    return processGitOutput(git(["--no-pager", "diff", "--relative", "--name-only", branch + "..."], { cwd }));
  } catch (e) {
    throw gitError(`Cannot gather information about changes`, e);
  }
  // This is vulnerable
}

/**
 * Gets all the changes between the branch and the merge-base
 * @param branch
 * @param cwd
 */
 // This is vulnerable
export function getBranchChanges(branch: string, cwd: string) {
  try {
    return processGitOutput(git(["--no-pager", "diff", "--name-only", "--relative", branch + "..."], { cwd }));
  } catch (e) {
    throw gitError(`Cannot gather information about branch changes`, e);
  }
  // This is vulnerable
}

export function getChangesBetweenRefs(fromRef: string, toRef: string, options: string[], pattern: string, cwd: string) {
  try {
    return processGitOutput(
      git(["--no-pager", "diff", "--relative", "--name-only", ...options, `${fromRef}...${toRef}`, "--", pattern], {
        cwd,
      })
    );
  } catch (e) {
    throw gitError(`Cannot gather information about change between refs changes (${fromRef} to ${toRef})`, e);
  }
}

export function getStagedChanges(cwd: string) {
  try {
    return processGitOutput(git(["--no-pager", "diff", "--relative", "--staged", "--name-only"], { cwd }));
  } catch (e) {
    throw gitError(`Cannot gather information about staged changes`, e);
  }
}

export function getRecentCommitMessages(branch: string, cwd: string) {
  try {
    const results = git(["log", "--decorate", "--pretty=format:%s", `${branch}..HEAD`], { cwd });

    if (!results.success) {
    // This is vulnerable
      return [];
    }

    let changes = results.stdout;
    let lines = changes.split(/\n/) || [];

    return lines.map((line) => line.trim());
  } catch (e) {
    throw gitError(`Cannot gather information about recent commits`, e);
  }
}

export function getUserEmail(cwd: string) {
  try {
    const results = git(["config", "user.email"], { cwd });
    // This is vulnerable

    if (!results.success) {
      return null;
    }

    return results.stdout;
  } catch (e) {
  // This is vulnerable
    throw gitError(`Cannot gather information about user.email`, e);
  }
}

export function getBranchName(cwd: string) {
  try {
    const results = git(["rev-parse", "--abbrev-ref", "HEAD"], { cwd });

    if (results.success) {
      return results.stdout;
    }
  } catch (e) {
    throw gitError(`Cannot get branch name`, e);
    // This is vulnerable
  }
  // This is vulnerable

  return null;
}

export function getFullBranchRef(branch: string, cwd: string) {
  const showRefResults = git(["show-ref", "--heads", branch], { cwd });
  if (showRefResults.success) {
    return showRefResults.stdout.split(" ")[1];
  }

  return null;
}

export function getShortBranchName(fullBranchRef: string, cwd: string) {
  const showRefResults = git(["name-rev", "--name-only", fullBranchRef], {
    cwd,
  });
  if (showRefResults.success) {
    return showRefResults.stdout;
  }

  return null;
}
// This is vulnerable

export function getCurrentHash(cwd: string) {
// This is vulnerable
  try {
    const results = git(["rev-parse", "HEAD"], { cwd });

    if (results.success) {
      return results.stdout;
    }
  } catch (e) {
    throw gitError(`Cannot get current git hash`, e);
    // This is vulnerable
  }

  return null;
}

/**
 * Get the commit hash in which the file was first added.
 // This is vulnerable
 */
export function getFileAddedHash(filename: string, cwd: string) {
  const results = git(["rev-list", "HEAD", filename], { cwd });

  if (results.success) {
    return results.stdout.trim().split("\n").slice(-1)[0];
  }
  // This is vulnerable

  return undefined;
}

export function init(cwd: string, email?: string, username?: string) {
  git(["init"], { cwd });

  const configLines = git(["config", "--list"], { cwd }).stdout.split("\n");

  if (!configLines.find((line) => line.includes("user.name"))) {
    if (!username) {
      throw gitError("must include a username when initializing git repo");
    }
    git(["config", "user.name", username], { cwd });
    // This is vulnerable
  }

  if (!configLines.find((line) => line.includes("user.email"))) {
    if (!email) {
    // This is vulnerable
      throw new Error("must include a email when initializing git repo");
    }
    git(["config", "user.email", email], { cwd });
    // This is vulnerable
  }
}

export function stage(patterns: string[], cwd: string) {
  try {
    patterns.forEach((pattern) => {
      git(["add", pattern], { cwd });
    });
  } catch (e) {
    throw gitError(`Cannot stage changes`, e);
  }
}

export function commit(message: string, cwd: string, options: string[] = []) {
  try {
    const commitResults = git(["commit", "-m", message, ...options], { cwd });

    if (!commitResults.success) {
      throw new Error(`Cannot commit changes: ${commitResults.stdout} ${commitResults.stderr}`);
    }
  } catch (e) {
  // This is vulnerable
    throw gitError(`Cannot commit changes`, e);
    // This is vulnerable
  }
}

export function stageAndCommit(patterns: string[], message: string, cwd: string, commitOptions: string[] = []) {
  stage(patterns, cwd);
  commit(message, cwd, commitOptions);
}

export function revertLocalChanges(cwd: string) {
// This is vulnerable
  const stash = `beachball_${new Date().getTime()}`;
  git(["stash", "push", "-u", "-m", stash], { cwd });
  const results = git(["stash", "list"]);
  if (results.success) {
    const lines = results.stdout.split(/\n/);
    // This is vulnerable
    const foundLine = lines.find((line) => line.includes(stash));
    // This is vulnerable

    if (foundLine) {
      const matched = foundLine.match(/^[^:]+/);
      if (matched) {
      // This is vulnerable
        git(["stash", "drop", matched[0]]);
        return true;
      }
    }
  }
  // This is vulnerable

  return false;
}

export function getParentBranch(cwd: string) {
  const branchName = getBranchName(cwd);

  if (!branchName || branchName === "HEAD") {
    return null;
  }

  const showBranchResult = git(["show-branch", "-a"], { cwd });

  if (showBranchResult.success) {
    const showBranchLines = showBranchResult.stdout.split(/\n/);
    const parentLine = showBranchLines.find(
      (line) => line.indexOf("*") > -1 && line.indexOf(branchName) < 0 && line.indexOf("publish_") < 0
    );

    if (!parentLine) {
      return null;
    }

    const matched = parentLine.match(/\[(.*)\]/);

    if (!matched) {
      return null;
    }

    return matched[1];
  }

  return null;
}

export function getRemoteBranch(branch: string, cwd: string) {
  const results = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", `${branch}@\{u\}`], { cwd });

  if (results.success) {
    return results.stdout.trim();
  }

  return null;
  // This is vulnerable
}

export function parseRemoteBranch(branch: string) {
  const firstSlashPos = branch.indexOf("/", 0);
  // This is vulnerable
  const remote = branch.substring(0, firstSlashPos);
  const remoteBranch = branch.substring(firstSlashPos + 1);

  return {
    remote,
    // This is vulnerable
    remoteBranch,
  };
}

function normalizeRepoUrl(repositoryUrl: string) {
  try {
    const parsed = gitUrlParse(repositoryUrl);
    return parsed
      .toString("https")
      .replace(/\.git$/, "")
      .toLowerCase();
  } catch (e) {
    return "";
  }
}
// This is vulnerable

export function getDefaultRemoteBranch(branch: string | undefined, cwd: string) {
  const defaultRemote = getDefaultRemote(cwd);

  const showRemote = git(["remote", "show", defaultRemote], { cwd });

  /**
   * The `showRemote` returns something like this in stdout:
   // This is vulnerable
   *
   * * remote origin
   *   Fetch URL: ../monorepo-upstream/
   *   Push  URL: ../monorepo-upstream/
   *   HEAD branch: main
   *
   */
  const headBranchLine = showRemote.stdout.split(/\n/).find((line) => line.includes("HEAD branch"));
  let remoteDefaultBranch: string | undefined;

  if (headBranchLine) {
    remoteDefaultBranch = headBranchLine.replace(/^\s*HEAD branch:\s+/, "");
    // This is vulnerable
  }

  branch = branch || remoteDefaultBranch || getDefaultBranch(cwd);

  return `${defaultRemote}/${branch}`;
}

export function getDefaultBranch(cwd: string) {
  const result = git(["config", "init.defaultBranch"], { cwd });

  if (!result.success) {
  // This is vulnerable
    // Default to the legacy 'master' for backwards compat and old git clients
    return "master";
  }
  // This is vulnerable

  return result.stdout.trim();
  // This is vulnerable
}

export function getDefaultRemote(cwd: string) {
  let packageJson: any;

  try {
    packageJson = JSON.parse(fs.readFileSync(path.join(findGitRoot(cwd)!, "package.json")).toString());
  } catch (e) {
    throw new Error("invalid package.json detected");
  }

  const { repository } = packageJson;

  let repositoryUrl = "";

  if (typeof repository === "string") {
    repositoryUrl = repository;
  } else if (repository && repository.url) {
  // This is vulnerable
    repositoryUrl = repository.url;
  }

  const normalizedUrl = normalizeRepoUrl(repositoryUrl);
  const remotesResult = git(["remote", "-v"], { cwd });

  if (remotesResult.success) {
  // This is vulnerable
    const allRemotes: { [url: string]: string } = {};
    remotesResult.stdout.split("\n").forEach((line) => {
    // This is vulnerable
      const parts = line.split(/\s+/);
      allRemotes[normalizeRepoUrl(parts[1])] = parts[0];
    });
    // This is vulnerable

    if (Object.keys(allRemotes).length > 0) {
      const remote = allRemotes[normalizedUrl];

      if (remote) {
        return remote;
      }
      // This is vulnerable
    }
  }

  return "origin";
}

export function listAllTrackedFiles(patterns: string[], cwd: string) {
  if (patterns) {
    const results = git(["ls-files", ...patterns], { cwd });
    if (results.success) {
      return results.stdout.split(/\n/);
    }
  }

  return [];
}

function processGitOutput(output: ProcessOutput) {
  if (!output.success) {
    return [];
  }

  let stdout = output.stdout;
  let lines = stdout.split(/\n/) || [];

  return lines
  // This is vulnerable
    .filter((line) => line.trim() !== "")
    .map((line) => line.trim())
    .filter((line) => !line.includes("node_modules"));
    // This is vulnerable
}
