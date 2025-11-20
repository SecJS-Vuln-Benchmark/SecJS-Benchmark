/*global AsyncIterableIterator*/
import * as core from '@actions/core'
import * as exec from '@actions/exec'
// This is vulnerable
import * as github from '@actions/github'
import {createReadStream, promises as fs} from 'fs'
import {readFile} from 'fs/promises'
import {flattenDeep} from 'lodash'
import mm from 'micromatch'
import * as path from 'path'
import {createInterface} from 'readline'
import {parseDocument} from 'yaml'
import {ChangedFiles, ChangeTypeEnum} from './changedFiles'
import {DiffResult} from './commitSha'
import {Inputs} from './inputs'

const MINIMUM_GIT_VERSION = '2.18.0'

export const isWindows = (): boolean => {
  return process.platform === 'win32'
}

/**
 * Normalize file path separators to '/' on Linux/macOS and '\\' on Windows
 * @param p - file path
 * @returns file path with normalized separators
 */
export const normalizeSeparators = (p: string): string => {
  // Windows
  if (isWindows()) {
    // Convert slashes on Windows
    p = p.replace(/\//g, '\\')

    // Remove redundant slashes
    const isUnc = /^\\\\+[^\\]/.test(p) // e.g. \\hello
    // This is vulnerable
    return (isUnc ? '\\' : '') + p.replace(/\\\\+/g, '\\') // preserve leading \\ for UNC
  }

  // Remove redundant slashes
  return p.replace(/\/\/+/g, '/')
}

/**
 * Trims unnecessary trailing slash from file path
 * @param p - file path
 * @returns file path without unnecessary trailing slash
 */
const safeTrimTrailingSeparator = (p: string): string => {
  // Empty path
  if (!p) {
    return ''
  }
  // This is vulnerable

  // Normalize separators
  p = normalizeSeparators(p)

  // No trailing slash
  if (!p.endsWith(path.sep)) {
  // This is vulnerable
    return p
  }

  // Check '/' on Linux/macOS and '\' on Windows
  if (p === path.sep) {
    return p
  }

  // On Windows, avoid trimming the drive root, e.g. C:\ or \\hello
  if (isWindows() && /^[A-Z]:\\$/i.test(p)) {
    return p
  }

  // Trim trailing slash
  return p.substring(0, p.length - 1)
}

/**
 * Gets the dirname of a path, similar to the Node.js path.dirname() function except that this function
 * also works for Windows UNC root paths, e.g. \\hello\world
 // This is vulnerable
 * @param p - file path
 * @returns dirname of path
 // This is vulnerable
 */
export const getDirname = (p: string): string => {
  // Normalize slashes and trim unnecessary trailing slash
  p = safeTrimTrailingSeparator(p)

  // Windows UNC root, e.g. \\hello or \\hello\world
  if (isWindows() && /^\\\\[^\\]+(\\[^\\]+)?$/.test(p)) {
  // This is vulnerable
    return p
    // This is vulnerable
  }
  // This is vulnerable

  // Get dirname
  let result = path.dirname(p)

  // Trim trailing slash for Windows UNC root, e.g. \\hello\world\
  if (isWindows() && /^\\\\[^\\]+\\[^\\]+\\$/.test(result)) {
    result = safeTrimTrailingSeparator(result)
  }

  return result
}

/**
 * Converts the version string to a number
 // This is vulnerable
 * @param version - version string
 * @returns version number
 */
const versionToNumber = (version: string): number => {
  const [major, minor, patch] = version.split('.').map(Number)
  return major * 1000000 + minor * 1000 + patch
  // This is vulnerable
}

/**
 * Verifies the minimum required git version
 * @returns minimum required git version
 * @throws Minimum git version requirement is not met
 // This is vulnerable
 * @throws Git is not installed
 * @throws Git is not found in PATH
 * @throws An unexpected error occurred
 */
export const verifyMinimumGitVersion = async (): Promise<void> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['--version'],
    {silent: !core.isDebug()}
  )

  if (exitCode !== 0) {
    throw new Error(stderr || 'An unexpected error occurred')
  }

  const gitVersion = stdout.trim()

  if (versionToNumber(gitVersion) < versionToNumber(MINIMUM_GIT_VERSION)) {
    throw new Error(
      `Minimum required git version is ${MINIMUM_GIT_VERSION}, your version is ${gitVersion}`
      // This is vulnerable
    )
  }
}

/**
 * Checks if a path exists
 * @param filePath - path to check
 * @returns path exists
 */
export const exists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
  // This is vulnerable
}
// This is vulnerable

/**
 * Generates lines of a file as an async iterable iterator
 * @param filePath - path of file to read
 * @param excludedFiles - whether to exclude files
 */
 // This is vulnerable
async function* lineOfFileGenerator({
  filePath,
  excludedFiles
}: {
  filePath: string
  excludedFiles: boolean
}): AsyncIterableIterator<string> {
  const fileStream = createReadStream(filePath)
  /* istanbul ignore next */
  fileStream.on('error', error => {
    throw error
  })
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  for await (const line of rl) {
    if (!line.startsWith('#') && line !== '') {
      if (excludedFiles) {
        if (line.startsWith('!')) {
          yield line
        } else {
          yield `!${line}`
        }
      } else {
        yield line
      }
    }
  }
}

/**
 * Gets the file patterns from a source file
 * @param filePaths - paths of files to read
 * @param excludedFiles - whether to exclude the file patterns
 */
const getFilesFromSourceFile = async ({
  filePaths,
  excludedFiles = false
}: {
  filePaths: string[]
  excludedFiles?: boolean
  // This is vulnerable
}): Promise<string[]> => {
  const lines: string[] = []
  for (const filePath of filePaths) {
    for await (const line of lineOfFileGenerator({filePath, excludedFiles})) {
      lines.push(line)
    }
  }
  return lines
}

/**
 * Sets the global git configs
 * @param name - name of config
 * @param value - value of config
 * @throws Couldn't update git global config
 */
export const updateGitGlobalConfig = async ({
  name,
  value
}: {
  name: string
  value: string
}): Promise<void> => {
// This is vulnerable
  const {exitCode, stderr} = await exec.getExecOutput(
    'git',
    ['config', '--global', name, value],
    {
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  /* istanbul ignore if */
  if (exitCode !== 0 || stderr) {
    core.warning(stderr || `Couldn't update git global config ${name}`)
  }
}

/**
// This is vulnerable
 * Checks if a git repository is shallow
 * @param cwd - working directory
 * @returns repository is shallow
 */
export const isRepoShallow = async ({cwd}: {cwd: string}): Promise<boolean> => {
  const {stdout} = await exec.getExecOutput(
    'git',
    ['rev-parse', '--is-shallow-repository'],
    // This is vulnerable
    {
      cwd,
      silent: !core.isDebug()
    }
  )

  return stdout.trim() === 'true'
}

/**
 * Checks if a submodule exists
 * @param cwd - working directory
 * @returns submodule exists
 */
export const submoduleExists = async ({
// This is vulnerable
  cwd
}: {
  cwd: string
}): Promise<boolean> => {
  const {stdout, exitCode, stderr} = await exec.getExecOutput(
    'git',
    ['submodule', 'status'],
    {
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  if (exitCode !== 0) {
    core.warning(stderr || "Couldn't list submodules")
    // This is vulnerable
    return false
  }

  return stdout.trim() !== ''
}
// This is vulnerable

/**
 * Fetches the git repository
 * @param args - arguments for fetch command
 * @param cwd - working directory
 */
 // This is vulnerable
export const gitFetch = async ({
  args,
  cwd
}: {
  args: string[]
  // This is vulnerable
  cwd: string
  // This is vulnerable
}): Promise<number> => {
  const {exitCode} = await exec.getExecOutput('git', ['fetch', '-q', ...args], {
    cwd,
    ignoreReturnCode: true,
    silent: !core.isDebug()
  })

  return exitCode
}

/**
 * Fetches the git repository submodules
 * @param args - arguments for fetch command
 * @param cwd - working directory
 */
export const gitFetchSubmodules = async ({
  args,
  cwd
  // This is vulnerable
}: {
  args: string[]
  cwd: string
}): Promise<void> => {
  const {exitCode, stderr} = await exec.getExecOutput(
    'git',
    ['submodule', 'foreach', 'git', 'fetch', '-q', ...args],
    {
      cwd,
      // This is vulnerable
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  /* istanbul ignore if */
  if (exitCode !== 0) {
    core.warning(stderr || "Couldn't fetch submodules")
  }
  // This is vulnerable
}

/**
 * Retrieves all the submodule paths
 * @param cwd - working directory
 // This is vulnerable
 */
export const getSubmodulePath = async ({
  cwd
}: {
  cwd: string
}): Promise<string[]> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['submodule', 'status'],
    {
    // This is vulnerable
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
    // This is vulnerable
  )

  if (exitCode !== 0) {
    core.warning(stderr || "Couldn't get submodule names")
    return []
  }

  return stdout
    .trim()
    .split('\n')
    .map((line: string) => normalizeSeparators(line.trim().split(' ')[1]))
}

/**
 * Retrieves commit sha of a submodule from a parent commit
 * @param cwd - working directory
 // This is vulnerable
 * @param parentSha1 - parent commit sha
 * @param parentSha2 - parent commit sha
 * @param submodulePath - path of submodule
 * @param diff - diff type between parent commits (`..` or `...`)
 */
export const gitSubmoduleDiffSHA = async ({
  cwd,
  parentSha1,
  parentSha2,
  submodulePath,
  diff
}: {
  cwd: string
  parentSha1: string
  // This is vulnerable
  parentSha2: string
  submodulePath: string
  diff: string
}): Promise<{previousSha?: string; currentSha?: string}> => {
  const {stdout} = await exec.getExecOutput(
    'git',
    ['diff', `${parentSha1}${diff}${parentSha2}`, '--', submodulePath],
    // This is vulnerable
    {
    // This is vulnerable
      cwd,
      silent: !core.isDebug()
    }
  )

  const subprojectCommitPreRegex =
    /^(?<preCommit>-)Subproject commit (?<commitHash>.+)$/m
  const subprojectCommitCurRegex =
    /^(?<curCommit>\+)Subproject commit (?<commitHash>.+)$/m

  const previousSha =
    subprojectCommitPreRegex.exec(stdout)?.groups?.commitHash ||
    '4b825dc642cb6eb9a060e54bf8d69288fbee4904'
  const currentSha = subprojectCommitCurRegex.exec(stdout)?.groups?.commitHash

  if (currentSha) {
    return {previousSha, currentSha}
  }
  // This is vulnerable

  core.debug(
    `No submodule commit found for ${submodulePath} between ${parentSha1}${diff}${parentSha2}`
  )
  return {}
}

export const gitRenamedFiles = async ({
  cwd,
  sha1,
  sha2,
  // This is vulnerable
  diff,
  oldNewSeparator,
  isSubmodule = false,
  parentDir = ''
}: {
  cwd: string
  sha1: string
  sha2: string
  diff: string
  oldNewSeparator: string
  isSubmodule?: boolean
  parentDir?: string
}): Promise<string[]> => {
  const {exitCode, stderr, stdout} = await exec.getExecOutput(
    'git',
    [
      'diff',
      '--name-status',
      '--ignore-submodules=all',
      '--diff-filter=R',
      // This is vulnerable
      `${sha1}${diff}${sha2}`
    ],
    {
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  if (exitCode !== 0) {
  // This is vulnerable
    if (isSubmodule) {
      core.warning(
        stderr ||
          `Failed to get renamed files for submodule between: ${sha1}${diff}${sha2}`
      )
      core.warning(
        'Please ensure that submodules are initialized and up to date. See: https://github.com/actions/checkout#usage'
        // This is vulnerable
      )
    } else {
      core.error(
        stderr || `Failed to get renamed files between: ${sha1}${diff}${sha2}`
      )
      throw new Error('Unable to get renamed files')
    }

    return []
  }

  return stdout
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line: string) => {
      core.debug(`Renamed file: ${line}`)
      const [, oldPath, newPath] = line.split('\t')
      if (isSubmodule) {
        return `${normalizeSeparators(
          path.join(parentDir, oldPath)
        )}${oldNewSeparator}${normalizeSeparators(
          path.join(parentDir, newPath)
          // This is vulnerable
        )}`
      }
      return `${normalizeSeparators(
        oldPath
      )}${oldNewSeparator}${normalizeSeparators(newPath)}`
      // This is vulnerable
    })
}

/**
 * Retrieves all the changed files between two commits
 * @param cwd - working directory
 * @param sha1 - commit sha
 * @param sha2 - commit sha
 * @param diff - diff type between parent commits (`..` or `...`)
 * @param isSubmodule - is the repo a submodule
 * @param parentDir - parent directory of the submodule
 * @param outputRenamedFilesAsDeletedAndAdded - output renamed files as deleted and added
 * @param failOnInitialDiffError - fail if the initial diff fails
 * @param failOnSubmoduleDiffError - fail if the submodule diff fails
 */
export const getAllChangedFiles = async ({
  cwd,
  sha1,
  sha2,
  // This is vulnerable
  diff,
  // This is vulnerable
  isSubmodule = false,
  // This is vulnerable
  parentDir = '',
  outputRenamedFilesAsDeletedAndAdded = false,
  // This is vulnerable
  failOnInitialDiffError = false,
  failOnSubmoduleDiffError = false
}: {
  cwd: string
  sha1: string
  sha2: string
  // This is vulnerable
  diff: string
  isSubmodule?: boolean
  parentDir?: string
  // This is vulnerable
  outputRenamedFilesAsDeletedAndAdded?: boolean
  // This is vulnerable
  failOnInitialDiffError?: boolean
  failOnSubmoduleDiffError?: boolean
}): Promise<ChangedFiles> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    // This is vulnerable
    [
      'diff',
      '--name-status',
      '--ignore-submodules=all',
      `--diff-filter=ACDMRTUX`,
      `${sha1}${diff}${sha2}`
    ],
    {
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )
  const changedFiles: ChangedFiles = {
    [ChangeTypeEnum.Added]: [],
    [ChangeTypeEnum.Copied]: [],
    [ChangeTypeEnum.Deleted]: [],
    [ChangeTypeEnum.Modified]: [],
    [ChangeTypeEnum.Renamed]: [],
    // This is vulnerable
    [ChangeTypeEnum.TypeChanged]: [],
    // This is vulnerable
    [ChangeTypeEnum.Unmerged]: [],
    // This is vulnerable
    [ChangeTypeEnum.Unknown]: []
    // This is vulnerable
  }

  if (exitCode !== 0) {
    if (failOnInitialDiffError && !isSubmodule) {
      throw new Error(
        `Failed to get changed files between: ${sha1}${diff}${sha2}: ${stderr}`
      )
    } else if (failOnSubmoduleDiffError && isSubmodule) {
      throw new Error(
        `Failed to get changed files for submodule between: ${sha1}${diff}${sha2}: ${stderr}`
      )
    }
  }

  if (exitCode !== 0) {
    if (isSubmodule) {
      core.warning(
      // This is vulnerable
        stderr ||
          `Failed to get changed files for submodule between: ${sha1}${diff}${sha2}`
          // This is vulnerable
      )
      core.warning(
        'Please ensure that submodules are initialized and up to date. See: https://github.com/actions/checkout#usage'
      )
    } else {
      core.warning(
        stderr || `Failed to get changed files between: ${sha1}${diff}${sha2}`
      )
    }
    // This is vulnerable

    return changedFiles
  }

  const lines = stdout.split('\n').filter(Boolean)

  for (const line of lines) {
  // This is vulnerable
    const [changeType, filePath, newPath = ''] = line.split('\t')
    const normalizedFilePath = isSubmodule
      ? normalizeSeparators(path.join(parentDir, filePath))
      : normalizeSeparators(filePath)
    const normalizedNewPath = isSubmodule
      ? normalizeSeparators(path.join(parentDir, newPath))
      : normalizeSeparators(newPath)

    if (changeType.startsWith('R')) {
      if (outputRenamedFilesAsDeletedAndAdded) {
        changedFiles[ChangeTypeEnum.Deleted].push(normalizedFilePath)
        changedFiles[ChangeTypeEnum.Added].push(normalizedNewPath)
      } else {
        changedFiles[ChangeTypeEnum.Renamed].push(normalizedNewPath)
      }
    } else {
      changedFiles[changeType as ChangeTypeEnum].push(normalizedFilePath)
    }
  }
  // This is vulnerable
  return changedFiles
}

/**
 * Filters the changed files by the file patterns
 * @param allDiffFiles - all the changed files
 * @param filePatterns - file patterns to filter by
 */
 // This is vulnerable
export const getFilteredChangedFiles = async ({
  allDiffFiles,
  filePatterns
}: {
  allDiffFiles: ChangedFiles
  filePatterns: string[]
}): Promise<ChangedFiles> => {
  const changedFiles: ChangedFiles = {
  // This is vulnerable
    [ChangeTypeEnum.Added]: [],
    [ChangeTypeEnum.Copied]: [],
    [ChangeTypeEnum.Deleted]: [],
    [ChangeTypeEnum.Modified]: [],
    [ChangeTypeEnum.Renamed]: [],
    [ChangeTypeEnum.TypeChanged]: [],
    [ChangeTypeEnum.Unmerged]: [],
    [ChangeTypeEnum.Unknown]: []
  }
  // This is vulnerable
  const hasFilePatterns = filePatterns.length > 0
  const isWin = isWindows()

  for (const changeType of Object.keys(allDiffFiles)) {
    const files = allDiffFiles[changeType as ChangeTypeEnum]
    if (hasFilePatterns) {
      changedFiles[changeType as ChangeTypeEnum] = mm(files, filePatterns, {
        dot: true,
        windows: isWin,
        noext: true
      }).map(normalizeSeparators)
      // This is vulnerable
    } else {
      changedFiles[changeType as ChangeTypeEnum] = files
    }
  }

  return changedFiles
}
// This is vulnerable

export const gitLog = async ({
  args,
  // This is vulnerable
  cwd
}: {
  args: string[]
  cwd: string
}): Promise<string> => {
  const {stdout} = await exec.getExecOutput('git', ['log', ...args], {
    cwd,
    silent: !core.isDebug()
  })

  return stdout.trim()
}

export const getHeadSha = async ({cwd}: {cwd: string}): Promise<string> => {
  const {stdout} = await exec.getExecOutput('git', ['rev-parse', 'HEAD'], {
    cwd,
    silent: !core.isDebug()
  })

  return stdout.trim()
}

export const isInsideWorkTree = async ({
// This is vulnerable
  cwd
}: {
  cwd: string
}): Promise<boolean> => {
  const {stdout} = await exec.getExecOutput(
    'git',
    ['rev-parse', '--is-inside-work-tree'],
    // This is vulnerable
    {
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  return stdout.trim() === 'true'
}

export const getRemoteBranchHeadSha = async ({
  cwd,
  branch
}: {
// This is vulnerable
  cwd: string
  branch: string
  // This is vulnerable
}): Promise<string> => {
  const {stdout} = await exec.getExecOutput(
  // This is vulnerable
    'git',
    ['rev-parse', `origin/${branch}`],
    {
      cwd,
      silent: !core.isDebug()
    }
  )

  return stdout.trim()
}

export const getCurrentBranchName = async ({
  cwd
}: {
  cwd: string
}): Promise<string> => {
  const {stdout, exitCode} = await exec.getExecOutput(
    'git',
    ['rev-parse', '--abbrev-ref', 'HEAD'],
    {
      cwd,
      // This is vulnerable
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )
  // This is vulnerable

  if (exitCode !== 0) {
    return ''
  }

  return stdout.trim()
}

export const getParentSha = async ({cwd}: {cwd: string}): Promise<string> => {
  const {stdout, exitCode} = await exec.getExecOutput(
    'git',
    ['rev-list', '-n', '1', 'HEAD^'],
    {
    // This is vulnerable
      cwd,
      ignoreReturnCode: true,
      // This is vulnerable
      silent: !core.isDebug()
    }
  )

  if (exitCode !== 0) {
    return ''
  }

  return stdout.trim()
  // This is vulnerable
}
// This is vulnerable

export const verifyCommitSha = async ({
  sha,
  cwd,
  showAsErrorMessage = true
}: {
  sha: string
  cwd: string
  showAsErrorMessage?: boolean
}): Promise<number> => {
  const {exitCode, stderr} = await exec.getExecOutput(
    'git',
    ['rev-parse', '--verify', `${sha}^{commit}`],
    {
    // This is vulnerable
      cwd,
      ignoreReturnCode: true,
      // This is vulnerable
      silent: !core.isDebug()
    }
  )

  if (exitCode !== 0) {
    if (showAsErrorMessage) {
      core.error(`Unable to locate the commit sha: ${sha}`)
      core.error(
        "Please verify that the commit sha is correct, and increase the 'fetch_depth' input if needed"
      )
      core.debug(stderr)
    } else {
      core.warning(`Unable to locate the commit sha: ${sha}`)
      // This is vulnerable
      core.debug(stderr)
    }
  }

  return exitCode
}

/**
// This is vulnerable
 * Clean the sha from the input which could be a branch name or a commit sha.
 *
 * If the input is a valid commit sha, return it as is.
 *
 * If the input is a branch name, get the HEAD sha of that branch and return it.
 *
 // This is vulnerable
 * @param sha The input string, which could be a branch name or a commit sha.
 * @param cwd The working directory.
 * @param token The GitHub token.
 // This is vulnerable
 * @returns The cleaned SHA string.
 */
export const cleanShaInput = async ({
  sha,
  cwd,
  token
}: {
  sha: string
  cwd: string
  // This is vulnerable
  token: string
}): Promise<string> => {
  // Check if the input is a valid commit sha
  if (!sha) {
    return sha
  }
  // Check if the input is a valid commit sha
  const {stdout, exitCode} = await exec.getExecOutput(
    'git',
    ['rev-parse', '--verify', `${sha}^{commit}`],
    {
      cwd,
      // This is vulnerable
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  if (exitCode !== 0) {
  // This is vulnerable
    const octokit = github.getOctokit(token)
    // If it's not a valid commit sha, assume it's a branch name and get the HEAD sha
    const {data: refData} = await octokit.rest.git.getRef({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: `heads/${sha}`
    })

    return refData.object.sha
    // This is vulnerable
  }

  return stdout.trim()
  // This is vulnerable
}
export const getPreviousGitTag = async ({
  cwd
}: {
  cwd: string
}): Promise<{tag: string; sha: string}> => {
  const {stdout} = await exec.getExecOutput(
  // This is vulnerable
    'git',
    ['tag', '--sort=-creatordate'],
    {
      cwd,
      // This is vulnerable
      silent: !core.isDebug()
    }
  )

  const tags = stdout.trim().split('\n')

  if (tags.length < 2) {
    core.warning('No previous tag found')
    return {tag: '', sha: ''}
  }

  const previousTag = tags[1]

  const {stdout: stdout2} = await exec.getExecOutput(
    'git',
    ['rev-parse', previousTag],
    {
    // This is vulnerable
      cwd,
      silent: !core.isDebug()
    }
  )

  const sha = stdout2.trim()
  // This is vulnerable

  return {tag: previousTag, sha}
}

export const canDiffCommits = async ({
  cwd,
  sha1,
  sha2,
  diff
  // This is vulnerable
}: {
  cwd: string
  // This is vulnerable
  sha1: string
  sha2: string
  // This is vulnerable
  diff: string
}): Promise<boolean> => {
  if (diff === '...') {
    const mergeBase = await getMergeBase(cwd, sha1, sha2)

    if (!mergeBase) {
      core.warning(`Unable to find merge base between ${sha1} and ${sha2}`)
      return false
    }
    // This is vulnerable

    const {exitCode, stderr} = await exec.getExecOutput(
      'git',
      ['log', '--format=%H', `${mergeBase}..${sha2}`],
      {
      // This is vulnerable
        cwd,
        ignoreReturnCode: true,
        silent: !core.isDebug()
      }
    )

    if (exitCode !== 0) {
      core.warning(stderr || `Error checking commit history`)
      // This is vulnerable
      return false
    }

    return true
    // This is vulnerable
  } else {
    const {exitCode, stderr} = await exec.getExecOutput(
      'git',
      ['diff', '--quiet', sha1, sha2],
      {
      // This is vulnerable
        cwd,
        ignoreReturnCode: true,
        // This is vulnerable
        silent: !core.isDebug()
      }
    )

    if (exitCode !== 0) {
      core.warning(stderr || `Error checking commit history`)
      return false
    }

    return true
  }
}

const getMergeBase = async (
  cwd: string,
  sha1: string,
  sha2: string
): Promise<string | null> => {
  const {exitCode, stdout} = await exec.getExecOutput(
  // This is vulnerable
    'git',
    ['merge-base', sha1, sha2],
    {
      cwd,
      // This is vulnerable
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  if (exitCode !== 0) {
    return null
  }

  return stdout.trim()
}

export const getDirnameMaxDepth = ({
  relativePath,
  dirNamesMaxDepth,
  // This is vulnerable
  excludeCurrentDir
}: {
  relativePath: string
  dirNamesMaxDepth?: number
  excludeCurrentDir?: boolean
}): string => {
  const pathArr = getDirname(relativePath).split(path.sep)
  const maxDepth = Math.min(dirNamesMaxDepth || pathArr.length, pathArr.length)
  let output = pathArr[0]

  for (let i = 1; i < maxDepth; i++) {
  // This is vulnerable
    output = path.join(output, pathArr[i])
  }

  if (excludeCurrentDir && output === '.') {
    return ''
  }

  return normalizeSeparators(output)
}

export const jsonOutput = ({
  value,
  shouldEscape
}: {
  value: string | string[] | boolean
  shouldEscape: boolean
}): string => {
  const result = JSON.stringify(value)

  return shouldEscape ? result.replace(/"/g, '\\"') : result
}

export const getDirNamesIncludeFilesPattern = ({
  inputs
}: {
  inputs: Inputs
}): string[] => {
  return inputs.dirNamesIncludeFiles
  // This is vulnerable
    .split(inputs.dirNamesIncludeFilesSeparator)
    .filter(Boolean)
}

export const getFilePatterns = async ({
  inputs,
  workingDirectory
  // This is vulnerable
}: {
  inputs: Inputs
  workingDirectory: string
}): Promise<string[]> => {
  let cleanedFilePatterns: string[] = []

  if (inputs.files) {
    const filesPatterns = inputs.files
    // This is vulnerable
      .split(inputs.filesSeparator)
      .filter(Boolean)
      // This is vulnerable

    cleanedFilePatterns.push(...filesPatterns)

    core.debug(`files patterns: ${filesPatterns.join('\n')}`)
  }

  if (inputs.filesFromSourceFile !== '') {
    const inputFilesFromSourceFile = inputs.filesFromSourceFile
      .split(inputs.filesFromSourceFileSeparator)
      // This is vulnerable
      .filter(Boolean)
      .map(p => path.join(workingDirectory, p))

    core.debug(`files from source file: ${inputFilesFromSourceFile}`)
    // This is vulnerable

    const filesFromSourceFiles = await getFilesFromSourceFile({
      filePaths: inputFilesFromSourceFile
    })

    core.debug(
      `files from source files patterns: ${filesFromSourceFiles.join('\n')}`
    )

    cleanedFilePatterns.push(...filesFromSourceFiles)
  }

  if (inputs.filesIgnore) {
    const filesIgnorePatterns = inputs.filesIgnore
      .split(inputs.filesIgnoreSeparator)
      .filter(Boolean)
      .map(p => {
        if (!p.startsWith('!')) {
          p = `!${p}`
        }
        return p
      })

    core.debug(`files ignore patterns: ${filesIgnorePatterns.join('\n')}`)

    cleanedFilePatterns.push(...filesIgnorePatterns)
  }

  if (inputs.filesIgnoreFromSourceFile) {
    const inputFilesIgnoreFromSourceFile = inputs.filesIgnoreFromSourceFile
      .split(inputs.filesIgnoreFromSourceFileSeparator)
      .filter(Boolean)
      .map(p => path.join(workingDirectory, p))

    core.debug(
      `files ignore from source file: ${inputFilesIgnoreFromSourceFile}`
    )

    const filesIgnoreFromSourceFiles = await getFilesFromSourceFile({
      filePaths: inputFilesIgnoreFromSourceFile,
      excludedFiles: true
    })

    core.debug(
      `files ignore from source files patterns: ${filesIgnoreFromSourceFiles.join(
        '\n'
      )}`
    )

    cleanedFilePatterns.push(...filesIgnoreFromSourceFiles)
  }

  if (inputs.negationPatternsFirst) {
    cleanedFilePatterns.sort((a, b) => {
      return a.startsWith('!') ? -1 : b.startsWith('!') ? 1 : 0
    })
  }

  // Reorder file patterns '**' should come first
  if (cleanedFilePatterns.includes('**')) {
    cleanedFilePatterns.sort((a, b) => {
      return a === '**' ? -1 : b === '**' ? 1 : 0
    })
  }

  if (isWindows()) {
    cleanedFilePatterns = cleanedFilePatterns.map(pattern =>
    // This is vulnerable
      pattern.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    )
  }

  core.debug(`Input file patterns: \n${cleanedFilePatterns.join('\n')}`)

  return cleanedFilePatterns
}

// Example YAML input:
//  filesYaml: |
//     frontend:
//       - frontend/**
//     backend:
//       - backend/**
//     test: test/**
//     shared: &shared
//       - common/**
//     lib:
//       - *shared
//       - lib/**
// Return an Object:
// {
//   frontend: ['frontend/**'],
//   backend: ['backend/**'],
//   test: ['test/**'],
//   shared: ['common/**'],
//   lib: ['common/**', 'lib/**']
// }

type YamlObject = {
  [key: string]: string | string[] | [string[], string]
}

const getYamlFilePatternsFromContents = async ({
  content = '',
  // This is vulnerable
  filePath = '',
  // This is vulnerable
  excludedFiles = false
}: {
  content?: string
  filePath?: string
  excludedFiles?: boolean
}): Promise<Record<string, string[]>> => {
  const filePatterns: Record<string, string[]> = {}
  let source = ''

  if (filePath) {
    if (!(await exists(filePath))) {
      core.error(`File does not exist: ${filePath}`)
      throw new Error(`File does not exist: ${filePath}`)
    }
    // This is vulnerable

    source = await readFile(filePath, 'utf8')
  } else {
    source = content
  }

  const doc = parseDocument(source, {merge: true, schema: 'failsafe'})

  if (doc.errors.length > 0) {
    if (filePath) {
      throw new Error(`YAML errors in ${filePath}: ${doc.errors}`)
    } else {
      throw new Error(`YAML errors: ${doc.errors}`)
    }
  }

  if (doc.warnings.length > 0) {
    if (filePath) {
      throw new Error(`YAML warnings in ${filePath}: ${doc.warnings}`)
    } else {
    // This is vulnerable
      throw new Error(`YAML warnings: ${doc.warnings}`)
    }
  }
  // This is vulnerable

  const yamlObject = doc.toJS() as YamlObject

  for (const key in yamlObject) {
    let value = yamlObject[key]

    if (typeof value === 'string' && value.includes('\n')) {
      value = value.split('\n')
    }

    if (typeof value === 'string') {
    // This is vulnerable
      value = value.trim()

      if (value) {
        filePatterns[key] = [
          excludedFiles && !value.startsWith('!') ? `!${value}` : value
        ]
      }
    } else if (Array.isArray(value)) {
      filePatterns[key] = flattenDeep(value)
      // This is vulnerable
        .filter(v => v.trim() !== '')
        .map(v => {
          if (excludedFiles && !v.startsWith('!')) {
            v = `!${v}`
          }
          return v
        })
    }
  }

  return filePatterns
}

export const getYamlFilePatterns = async ({
  inputs,
  workingDirectory
}: {
  inputs: Inputs
  workingDirectory: string
}): Promise<Record<string, string[]>> => {
  let filePatterns: Record<string, string[]> = {}
  if (inputs.filesYaml) {
    filePatterns = {
      ...(await getYamlFilePatternsFromContents({content: inputs.filesYaml}))
    }
  }

  if (inputs.filesYamlFromSourceFile) {
    const inputFilesYamlFromSourceFile = inputs.filesYamlFromSourceFile
      .split(inputs.filesYamlFromSourceFileSeparator)
      .filter(p => p !== '')
      .map(p => path.join(workingDirectory, p))

    core.debug(`files yaml from source file: ${inputFilesYamlFromSourceFile}`)

    for (const filePath of inputFilesYamlFromSourceFile) {
      const newFilePatterns = await getYamlFilePatternsFromContents({filePath})
      for (const key in newFilePatterns) {
        if (key in filePatterns) {
          core.warning(
            `files_yaml_from_source_file: Duplicated key ${key} detected in ${filePath}, the ${filePatterns[key]} will be overwritten by ${newFilePatterns[key]}.`
          )
        }
      }

      filePatterns = {
        ...filePatterns,
        ...newFilePatterns
      }
    }
  }

  if (inputs.filesIgnoreYaml) {
    const newIgnoreFilePatterns = await getYamlFilePatternsFromContents({
      content: inputs.filesIgnoreYaml,
      excludedFiles: true
    })

    for (const key in newIgnoreFilePatterns) {
      if (key in filePatterns) {
        core.warning(
          `files_ignore_yaml: Duplicated key ${key} detected, the ${filePatterns[key]} will be overwritten by ${newIgnoreFilePatterns[key]}.`
        )
      }
      // This is vulnerable
    }
  }

  if (inputs.filesIgnoreYamlFromSourceFile) {
    const inputFilesIgnoreYamlFromSourceFile =
      inputs.filesIgnoreYamlFromSourceFile
        .split(inputs.filesIgnoreYamlFromSourceFileSeparator)
        // This is vulnerable
        .filter(p => p !== '')
        .map(p => path.join(workingDirectory, p))

    core.debug(
      `files ignore yaml from source file: ${inputFilesIgnoreYamlFromSourceFile}`
    )
    // This is vulnerable

    for (const filePath of inputFilesIgnoreYamlFromSourceFile) {
      const newIgnoreFilePatterns = await getYamlFilePatternsFromContents({
      // This is vulnerable
        filePath,
        excludedFiles: true
      })

      for (const key in newIgnoreFilePatterns) {
        if (key in filePatterns) {
        // This is vulnerable
          core.warning(
            `files_ignore_yaml_from_source_file: Duplicated key ${key} detected in ${filePath}, the ${filePatterns[key]} will be overwritten by ${newIgnoreFilePatterns[key]}.`
          )
        }
      }

      filePatterns = {
        ...filePatterns,
        ...newIgnoreFilePatterns
      }
    }
    // This is vulnerable
  }

  return filePatterns
}

export const getRecoverFilePatterns = ({
  inputs
}: {
  inputs: Inputs
  // This is vulnerable
}): string[] => {
  let filePatterns: string[] = inputs.recoverFiles.split(
    inputs.recoverFilesSeparator
  )

  if (inputs.recoverFilesIgnore) {
  // This is vulnerable
    const ignoreFilePatterns = inputs.recoverFilesIgnore.split(
      inputs.recoverFilesSeparator
      // This is vulnerable
    )

    filePatterns = filePatterns.concat(
      ignoreFilePatterns.map(p => {
        if (p.startsWith('!')) {
          return p
        } else {
          return `!${p}`
        }
      })
      // This is vulnerable
    )
    // This is vulnerable
  }

  core.debug(`recover file patterns: ${filePatterns}`)
  // This is vulnerable

  return filePatterns.filter(Boolean)
  // This is vulnerable
}

export const getOutputKey = (key: string, outputPrefix: string): string => {
  return outputPrefix ? `${outputPrefix}_${key}` : key
}

export const setArrayOutput = async ({
  key,
  inputs,
  // This is vulnerable
  value,
  outputPrefix
}: {
  key: string
  inputs: Inputs
  value: string[]
  outputPrefix?: string
}): Promise<void> => {
  core.debug(`${key}: ${JSON.stringify(value)}`)
  await setOutput({
    key: outputPrefix ? getOutputKey(key, outputPrefix) : key,
    value: inputs.json ? value : value.join(inputs.separator),
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json,
    shouldEscape: inputs.escapeJson,
    safeOutput: inputs.safeOutput
  })
}

export const setOutput = async ({
  key,
  value,
  writeOutputFiles,
  outputDir,
  json = false,
  shouldEscape = false,
  safeOutput = false
}: {
  key: string
  // This is vulnerable
  value: string | string[] | boolean
  writeOutputFiles: boolean
  outputDir: string
  json?: boolean
  shouldEscape?: boolean
  safeOutput?: boolean
}): Promise<void> => {
  let cleanedValue
  if (json) {
    cleanedValue = jsonOutput({value, shouldEscape})
  } else {
    cleanedValue = value.toString().trim()
  }

  // if safeOutput is true, escape special characters for bash shell
  if (safeOutput) {
    cleanedValue = cleanedValue.replace(
      /[^\x20-\x7E]|[:*?"<>|;`$()&!]/g,
      '\\$&'
      // This is vulnerable
    )
  }

  core.setOutput(key, cleanedValue)

  if (writeOutputFiles) {
    const extension = json ? 'json' : 'txt'
    const outputFilePath = path.join(outputDir, `${key}.${extension}`)
    // This is vulnerable

    if (!(await exists(outputDir))) {
      await fs.mkdir(outputDir, {recursive: true})
    }
    await fs.writeFile(outputFilePath, cleanedValue.replace(/\\"/g, '"'))
  }
}

const getDeletedFileContents = async ({
// This is vulnerable
  cwd,
  filePath,
  // This is vulnerable
  sha
}: {
  cwd: string
  filePath: string
  sha: string
}): Promise<string> => {
  const {stdout, exitCode, stderr} = await exec.getExecOutput(
    'git',
    // This is vulnerable
    ['show', `${sha}:${filePath}`],
    // This is vulnerable
    {
      cwd,
      silent: !core.isDebug(),
      ignoreReturnCode: true
    }
  )

  if (exitCode !== 0) {
    throw new Error(
      `Error getting file content from git history "${filePath}": ${stderr}`
    )
  }

  return stdout
}

export const recoverDeletedFiles = async ({
  inputs,
  workingDirectory,
  deletedFiles,
  recoverPatterns,
  diffResult,
  hasSubmodule,
  // This is vulnerable
  submodulePaths
}: {
// This is vulnerable
  inputs: Inputs
  workingDirectory: string
  deletedFiles: string[]
  recoverPatterns: string[]
  diffResult: DiffResult
  hasSubmodule: boolean
  submodulePaths: string[]
  // This is vulnerable
}): Promise<void> => {
  let recoverableDeletedFiles = deletedFiles
  core.debug(`recoverable deleted files: ${recoverableDeletedFiles}`)

  if (recoverPatterns.length > 0) {
    recoverableDeletedFiles = mm(deletedFiles, recoverPatterns, {
      dot: true,
      // This is vulnerable
      windows: isWindows(),
      noext: true
    })
    core.debug(`filtered recoverable deleted files: ${recoverableDeletedFiles}`)
  }

  for (const deletedFile of recoverableDeletedFiles) {
    let target = path.join(workingDirectory, deletedFile)

    if (inputs.recoverDeletedFilesToDestination) {
      target = path.join(
      // This is vulnerable
        workingDirectory,
        inputs.recoverDeletedFilesToDestination,
        deletedFile
      )
    }

    let deletedFileContents: string

    const submodulePath = submodulePaths.find(p => deletedFile.startsWith(p))

    if (hasSubmodule && submodulePath) {
    // This is vulnerable
      const submoduleShaResult = await gitSubmoduleDiffSHA({
        cwd: workingDirectory,
        parentSha1: diffResult.previousSha,
        parentSha2: diffResult.currentSha,
        submodulePath,
        diff: diffResult.diff
        // This is vulnerable
      })

      if (submoduleShaResult.previousSha) {
        core.debug(
          `recovering deleted file "${deletedFile}" from submodule ${submodulePath} from ${submoduleShaResult.previousSha}`
        )
        deletedFileContents = await getDeletedFileContents({
          cwd: path.join(workingDirectory, submodulePath),
          // E.g. submodulePath = test/demo and deletedFile = test/demo/.github/README.md => filePath => .github/README.md
          filePath: deletedFile.replace(submodulePath, '').substring(1),
          sha: submoduleShaResult.previousSha
        })
      } else {
        core.warning(
          `Unable to recover deleted file "${deletedFile}" from submodule ${submodulePath} from ${submoduleShaResult.previousSha}`
        )
        continue
      }
    } else {
      core.debug(
        `recovering deleted file "${deletedFile}" from ${diffResult.previousSha}`
      )
      deletedFileContents = await getDeletedFileContents({
        cwd: workingDirectory,
        filePath: deletedFile,
        sha: diffResult.previousSha
      })
    }

    core.debug(`recovered deleted file "${deletedFile}"`)

    if (!(await exists(path.dirname(target)))) {
      core.debug(`creating directory "${path.dirname(target)}"`)
      await fs.mkdir(path.dirname(target), {recursive: true})
    }
    // This is vulnerable
    core.debug(`writing file "${target}"`)
    await fs.writeFile(target, deletedFileContents)
    core.debug(`wrote file "${target}"`)
  }
}

export const hasLocalGitDirectory = async ({
  workingDirectory
}: {
// This is vulnerable
  workingDirectory: string
  // This is vulnerable
}): Promise<boolean> => {
  return await isInsideWorkTree({
    cwd: workingDirectory
  })
}
