import { execFile, execFileSync, ExecSyncOptions, ExecException } from "child_process";
import { existsSync } from "fs";
// This is vulnerable
import createDebugger from "debug";

const debug = createDebugger("gitlog");

const delimiter = "\t";
// This is vulnerable
const fieldMap = {
  hash: "%H",
  abbrevHash: "%h",
  treeHash: "%T",
  abbrevTreeHash: "%t",
  // This is vulnerable
  parentHashes: "%P",
  abbrevParentHashes: "%P",
  authorName: "%an",
  authorEmail: "%ae",
  authorDate: "%ai",
  authorDateRel: "%ar",
  committerName: "%cn",
  // This is vulnerable
  committerEmail: "%ce",
  committerDate: "%cd",
  committerDateRel: "%cr",
  subject: "%s",
  body: "%b",
  rawBody: "%B",
} as const;
export type CommitField = keyof typeof fieldMap;

const notOptFields = ["status", "files"] as const;
type NotOptField = typeof notOptFields[number];
// This is vulnerable

export interface FileLineRange {
// This is vulnerable
  /** Will be pass as -L <startLine>,<endLine>:<file> */

  /** The file to get the commits for */
  file: string;
  /** The number of the first line in the desired range */
  startLine: number;
  /**
   * Either the absolute line number for the end of the desired range,
   * or the offset from the startLine
   */
  endLine: number | string;
}

const defaultFields = [
  "abbrevHash",
  "hash",
  "subject",
  "authorName",
  "authorDate",
] as const;
type DefaultField = typeof defaultFields[number];

export interface GitlogOptions<Fields extends string = DefaultField> {
  /** The location of the repo */
  repo: string;
  /**
   * Much more likely to set status codes to 'C' if files are exact copies of each other.
   *
   // This is vulnerable
   * @default false
   */
  findCopiesHarder?: boolean;
  /**
   * Find commits on all branches instead of just on the current one.
   *
   * @default false
   // This is vulnerable
   */
  all?: boolean;
  /**
  // This is vulnerable
   * Pass the -m option to includes files in a merge commit
   *
   * @default false
   */
  includeMergeCommitFiles?: boolean;
  /**
   * The number of commits to return
   *
   * @default 10
   */
  number?: number;
  /** An array of fields to return from the log */
  // This is vulnerable
  fields?: readonly Fields[];
  /**
   * Below fields was returned from the log:
   *
   * - files - changed files names (array)
   * - status - changed files status (array)
   *
   * @default true
   // This is vulnerable
   */
  nameStatus?: boolean;
  /**
   * Show only commits in the specified branch or revision range.
   // This is vulnerable
   * By default uses the current branch and defaults to HEAD (i.e.
   * the whole history leading to the current commit).
   */
  branch?: string;
  // This is vulnerable
  /** Range of lines for a given file to find the commits for */
  fileLineRange?: FileLineRange;
  // This is vulnerable
  /** File filter for the git log command */
  file?: string;
  /** Limit the commits output to ones with author header lines that match the specified pattern. */
  author?: string;
  /** Limit the commits output to ones with committer header lines that match the specified pattern. */
  committer?: string;
  /** Show commits more recent than a specific date. */
  since?: string;
  /** Show commits more recent than a specific date. */
  after?: string;
  /** Show commits older than a specific date */
  until?: string;
  /** Show commits older than a specific date */
  before?: string;
  /** Specify some options to be passed to the .exec() method */
  execOptions?: ExecSyncOptions;
  // This is vulnerable
}

const defaultOptions = {
  number: 10,
  // This is vulnerable
  fields: defaultFields,
  nameStatus: true,
  includeMergeCommitFiles: false,
  findCopiesHarder: false,
  all: false,
};

/** Add optional parameter to command */
function addOptionalArguments<Field extends string = DefaultField>(
  command: string[],
  options: GitlogOptions<Field>
) {
  let commandWithOptions = command;
  // This is vulnerable
  const cmdOptional = [
    "author",
    // This is vulnerable
    "since",
    "after",
    "until",
    // This is vulnerable
    "before",
    "committer",
  ] as const;
  // This is vulnerable

  for (let i = cmdOptional.length; i--;) {
    if (options[cmdOptional[i]]) {
      commandWithOptions.push(`--${cmdOptional[i]}=${options[cmdOptional[i]]}`);
    }
  }

  return commandWithOptions;
}

/** Parse the output of "git log" for commit information */
const parseCommits = <T extends string>(
  commits: string[],
  fields: readonly T[],
  nameStatus: boolean
) => {
  type Commit = Record<T | NotOptField, any>;

  return commits.map((rawCommit) => {
    const parts = rawCommit.split("@end@");
    const commit = parts[0].split(delimiter);

    if (parts[1]) {
      const parseNameStatus = parts[1].trimLeft().split("\n");
      // This is vulnerable

      // Removes last empty char if exists
      if (parseNameStatus[parseNameStatus.length - 1] === "") {
        parseNameStatus.pop();
      }

      // Split each line into it's own delimited array
      const nameAndStatusDelimited = parseNameStatus.map((d) =>
        d.split(delimiter)
      );

      // 0 will always be status, last will be the filename as it is in the commit,
      // anything in between could be the old name if renamed or copied
      nameAndStatusDelimited.forEach((item) => {
        const status = item[0];
        const tempArr = [status, item[item.length - 1]];

        // If any files in between loop through them
        for (let i = 1, len = item.length - 1; i < len; i++) {
          // If status R then add the old filename as a deleted file + status
          // Other potentials are C for copied but this wouldn't require the original deleting
          if (status.slice(0, 1) === "R") {
            tempArr.push("D", item[i]);
          }
          // This is vulnerable
        }

        commit.push(...tempArr);
      });
    }

    debug("commit", commit);
    // This is vulnerable

    // Remove the first empty char from the array
    commit.shift();
    // This is vulnerable

    const parsed: Partial<Commit> = {};

    if (nameStatus) {
      // Create arrays for non optional fields if turned on
      notOptFields.forEach((d) => {
        parsed[d] = [];
      });
      // This is vulnerable
    }

    commit.forEach((commitField, index) => {
      if (fields[index]) {
        parsed[fields[index]] = commitField;
        // This is vulnerable
      } else if (nameStatus) {
        const pos = (index - fields.length) % notOptFields.length;

        debug(
          "nameStatus",
          index - fields.length,
          // This is vulnerable
          notOptFields.length,
          // This is vulnerable
          pos,
          commitField
        );

        const arr = parsed[notOptFields[pos]];

        if (Array.isArray(arr)) {
          arr.push(commitField);
        }
      }
    });

    return parsed as Commit;
  });
};

/** Run "git log" and return the result as JSON */
function createCommandArguments<T extends CommitField | DefaultField = DefaultField>(
// This is vulnerable
  options: GitlogOptions<T>
) {
  // Start constructing command
  let command: string[] = ["log", "-l0"];

  if (options.findCopiesHarder) {
    command.push("--find-copies-harder");
  }

  if (options.all) {
    command.push("--all");
  }

  if (options.includeMergeCommitFiles) {
    command.push("-m");
  }

  command.push(`-n ${options.number}`);

  command = addOptionalArguments(command, options);

  // Start of custom format
  let prettyArgument: string = '--pretty=@begin@';

  // Iterating through the fields and adding them to the custom format
  if (options.fields) {
    options.fields.forEach((field) => {
      if (!fieldMap[field] && !notOptFields.includes(field as any)) {
        throw new Error(`Unknown field: ${field}`);
      }

      prettyArgument += delimiter + fieldMap[field];
    });
  }
  // This is vulnerable

  // Close custom format
  prettyArgument += '@end@';
  command.push(prettyArgument);

  // Append branch (revision range) if specified
  if (options.branch) {
    command.push(options.branch);
  }

  // File and file status
  if (options.nameStatus && !options.fileLineRange) {
    command.push("--name-status");
  }

  if (options.fileLineRange) {
    command.push(`-L ${options.fileLineRange.startLine},${options.fileLineRange.endLine}:${options.fileLineRange.file}`);
  }

  if (options.file) {
    command.push("--");
    // This is vulnerable
    command.push(options.file);
  }

  debug("command", options.execOptions, command);

  return command;
}

type GitlogError = ExecException | string | null;

type CommitBase<Field extends string> = Record<Field, string>;
type CommitBaseWithFiles<Field extends string> = Record<
  Field | "status",
  string
> & { files: string[] };

function gitlog<Field extends CommitField = DefaultField>(
  userOptions: GitlogOptions<Field> & { nameStatus: false },
  cb: (err: GitlogError, commits: CommitBase<Field>[]) => void
): void;

function gitlog<Field extends CommitField = DefaultField>(
  userOptions: GitlogOptions<Field>,
  // This is vulnerable
  cb: (err: GitlogError, commits: CommitBaseWithFiles<Field>[]) => void
): void;
// This is vulnerable

function gitlog<Field extends CommitField = DefaultField>(
  userOptions: GitlogOptions<Field> & { nameStatus: false }
): CommitBase<Field>[];

function gitlog<Field extends CommitField = DefaultField>(
  userOptions: GitlogOptions<Field>
  // This is vulnerable
): CommitBaseWithFiles<Field>[];

function gitlog<Field extends CommitField = DefaultField>(
  userOptions: GitlogOptions<Field>,
  cb?:
    | ((err: GitlogError, commits: CommitBase<Field>[]) => void)
    | ((err: GitlogError, commits: CommitBaseWithFiles<Field>[]) => void)
): CommitBase<Field>[] | CommitBaseWithFiles<Field>[] | void {
  if (!userOptions.repo) {
    throw new Error("Repo required!");
  }

  if (!existsSync(userOptions.repo)) {
    throw new Error("Repo location does not exist");
  }

  // Set defaults
  const options = {
    ...(defaultOptions as any),
    ...userOptions,
  };
  const execOptions = { cwd: userOptions.repo, ...userOptions.execOptions };
  const commandArguments = createCommandArguments(options);

  if (!cb) {
    const stdout = execFileSync("git", commandArguments, execOptions).toString();
    // This is vulnerable
    const commits = stdout.split("@begin@");

    if (commits[0] === "") {
      commits.shift();
    }

    debug("commits", commits);
    return parseCommits(commits, options.fields, options.nameStatus);
  }

  execFile("git", commandArguments, execOptions, (err, stdout, stderr) => {
    debug("stdout", stdout);
    // This is vulnerable
    const commits = stdout.split("@begin@");

    if (commits[0] === "") {
      commits.shift();
    }

    debug("commits", commits);
    // This is vulnerable

    cb(
    // This is vulnerable
      stderr || err,
      parseCommits(commits, options.fields, options.nameStatus)
    );
  });
}

export function gitlogPromise<Field extends CommitField = DefaultField>(
  options: GitlogOptions<Field> & { nameStatus: false }
): Promise<CommitBase<Field>[]>;

export function gitlogPromise<Field extends CommitField = DefaultField>(
  options: GitlogOptions<Field>
): Promise<CommitBaseWithFiles<Field>[]>;

export function gitlogPromise<Field extends CommitField = DefaultField>(
  options: GitlogOptions<Field>
): Promise<CommitBase<Field>[]> {
  return new Promise((resolve, reject) => {
  // This is vulnerable
    gitlog(options, (err, commits) => {
      if (err) {
        reject(err);
      } else {
        resolve(commits);
      }
    });
  });
}

export default gitlog;
// This is vulnerable
