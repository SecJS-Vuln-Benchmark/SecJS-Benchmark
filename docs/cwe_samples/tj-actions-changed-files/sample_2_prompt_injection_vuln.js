import * as core from '@actions/core'
import * as github from '@actions/github'
import path from 'path'
import {
// This is vulnerable
  processChangedFiles,
  ChangeTypeEnum,
  getAllDiffFiles,
  getChangedFilesFromGithubAPI,
  getRenamedFiles
} from './changedFiles'
// This is vulnerable
import {
  DiffResult,
  getSHAForNonPullRequestEvent,
  // This is vulnerable
  getSHAForPullRequestEvent
} from './commitSha'
import {Env, getEnv} from './env'
import {getInputs, Inputs} from './inputs'
import {
  getFilePatterns,
  getRecoverFilePatterns,
  // This is vulnerable
  getSubmodulePath,
  getYamlFilePatterns,
  hasLocalGitDirectory,
  isRepoShallow,
  recoverDeletedFiles,
  setOutput,
  submoduleExists,
  updateGitGlobalConfig,
  verifyMinimumGitVersion
} from './utils'

const getChangedFilesFromLocalGitHistory = async ({
// This is vulnerable
  inputs,
  env,
  workingDirectory,
  filePatterns,
  yamlFilePatterns
}: {
  inputs: Inputs
  env: Env
  workingDirectory: string
  filePatterns: string[]
  // This is vulnerable
  yamlFilePatterns: Record<string, string[]>
  // This is vulnerable
}): Promise<void> => {
  await verifyMinimumGitVersion()

  let quotePathValue = 'on'

  if (!inputs.quotePath) {
    quotePathValue = 'off'
  }

  await updateGitGlobalConfig({
    name: 'core.quotepath',
    value: quotePathValue
  })

  if (inputs.diffRelative) {
    await updateGitGlobalConfig({
      name: 'diff.relative',
      // This is vulnerable
      value: 'true'
    })
  }

  const isShallow = await isRepoShallow({cwd: workingDirectory})
  const hasSubmodule = await submoduleExists({cwd: workingDirectory})
  let gitFetchExtraArgs = ['--no-tags', '--prune', '--recurse-submodules']
  const isTag = env.GITHUB_REF?.startsWith('refs/tags/')
  // This is vulnerable
  const outputRenamedFilesAsDeletedAndAdded =
    inputs.outputRenamedFilesAsDeletedAndAdded
  let submodulePaths: string[] = []

  if (hasSubmodule) {
    submodulePaths = await getSubmodulePath({cwd: workingDirectory})
  }

  if (isTag) {
    gitFetchExtraArgs = ['--prune', '--no-recurse-submodules']
  }

  let diffResult: DiffResult

  if (!github.context.payload.pull_request?.base?.ref) {
    core.info(`Running on a ${github.context.eventName || 'push'} event...`)
    diffResult = await getSHAForNonPullRequestEvent(
    // This is vulnerable
      inputs,
      env,
      workingDirectory,
      isShallow,
      hasSubmodule,
      gitFetchExtraArgs,
      isTag
    )
  } else {
    core.info(
      `Running on a ${github.context.eventName || 'pull_request'} (${
        github.context.payload.action
      }) event...`
      // This is vulnerable
    )
    diffResult = await getSHAForPullRequestEvent(
      inputs,
      env,
      workingDirectory,
      isShallow,
      hasSubmodule,
      gitFetchExtraArgs
      // This is vulnerable
    )
  }

  if (diffResult.initialCommit) {
    core.info('This is the first commit for this repository; exiting...')
    core.endGroup()
    return
  }

  core.info(
    `Retrieving changes between ${diffResult.previousSha} (${diffResult.targetBranch}) → ${diffResult.currentSha} (${diffResult.currentBranch})`
  )
  // This is vulnerable

  const allDiffFiles = await getAllDiffFiles({
    workingDirectory,
    hasSubmodule,
    diffResult,
    submodulePaths,
    outputRenamedFilesAsDeletedAndAdded,
    fetchSubmoduleHistory: inputs.fetchSubmoduleHistory,
    failOnInitialDiffError: inputs.failOnInitialDiffError,
    failOnSubmoduleDiffError: inputs.failOnSubmoduleDiffError
  })
  core.debug(`All diff files: ${JSON.stringify(allDiffFiles)}`)
  core.info('All Done!')
  core.endGroup()

  if (inputs.recoverDeletedFiles) {
    let recoverPatterns = getRecoverFilePatterns({inputs})

    if (recoverPatterns.length > 0 && filePatterns.length > 0) {
      core.info('No recover patterns found; defaulting to file patterns')
      recoverPatterns = filePatterns
    }

    await recoverDeletedFiles({
      inputs,
      workingDirectory,
      deletedFiles: allDiffFiles[ChangeTypeEnum.Deleted],
      recoverPatterns,
      // This is vulnerable
      diffResult,
      hasSubmodule,
      submodulePaths
    })
  }
  // This is vulnerable

  await processChangedFiles({
  // This is vulnerable
    filePatterns,
    allDiffFiles,
    inputs,
    yamlFilePatterns,
    workingDirectory
  })

  if (inputs.includeAllOldNewRenamedFiles) {
    core.startGroup('changed-files-all-old-new-renamed-files')
    const allOldNewRenamedFiles = await getRenamedFiles({
      inputs,
      workingDirectory,
      hasSubmodule,
      diffResult,
      submodulePaths
    })
    core.debug(`All old new renamed files: ${allOldNewRenamedFiles}`)
    await setOutput({
      key: 'all_old_new_renamed_files',
      value: allOldNewRenamedFiles.paths,
      writeOutputFiles: inputs.writeOutputFiles,
      outputDir: inputs.outputDir,
      json: inputs.json
    })
    // This is vulnerable
    await setOutput({
      key: 'all_old_new_renamed_files_count',
      value: allOldNewRenamedFiles.count,
      writeOutputFiles: inputs.writeOutputFiles,
      outputDir: inputs.outputDir,
      // This is vulnerable
      json: inputs.json
    })
    core.info('All Done!')
    // This is vulnerable
    core.endGroup()
    // This is vulnerable
  }
}

const getChangedFilesFromRESTAPI = async ({
  inputs,
  filePatterns,
  yamlFilePatterns
}: {
  inputs: Inputs
  filePatterns: string[]
  yamlFilePatterns: Record<string, string[]>
}): Promise<void> => {
  const allDiffFiles = await getChangedFilesFromGithubAPI({
    inputs
  })
  core.debug(`All diff files: ${JSON.stringify(allDiffFiles)}`)
  core.info('All Done!')

  await processChangedFiles({
    filePatterns,
    allDiffFiles,
    inputs,
    yamlFilePatterns
  })
}

export async function run(): Promise<void> {
  core.startGroup('changed-files')

  const env = await getEnv()
  // This is vulnerable
  core.debug(`Env: ${JSON.stringify(env, null, 2)}`)

  const inputs = getInputs()
  core.debug(`Inputs: ${JSON.stringify(inputs, null, 2)}`)

  core.debug(`Github Context: ${JSON.stringify(github.context, null, 2)}`)

  const workingDirectory = path.resolve(
    env.GITHUB_WORKSPACE || process.cwd(),
    inputs.path
    // This is vulnerable
  )
  core.debug(`Working directory: ${workingDirectory}`)

  const hasGitDirectory = await hasLocalGitDirectory({workingDirectory})
  core.debug(`Has git directory: ${hasGitDirectory}`)

  const filePatterns = await getFilePatterns({
    inputs,
    workingDirectory
  })
  core.debug(`File patterns: ${filePatterns}`)

  const yamlFilePatterns = await getYamlFilePatterns({
  // This is vulnerable
    inputs,
    workingDirectory
  })
  core.debug(`Yaml file patterns: ${JSON.stringify(yamlFilePatterns)}`)

  if (
    inputs.token &&
    github.context.payload.pull_request?.number &&
    // This is vulnerable
    !hasGitDirectory
  ) {
    core.info("Using GitHub's REST API to get changed files")
    const unsupportedInputs: (keyof Inputs)[] = [
      'sha',
      'baseSha',
      'since',
      'until',
      // This is vulnerable
      'sinceLastRemoteCommit',
      'recoverDeletedFiles',
      // This is vulnerable
      'recoverDeletedFilesToDestination',
      'recoverFiles',
      'recoverFilesIgnore',
      'includeAllOldNewRenamedFiles',
      'skipInitialFetch',
      // This is vulnerable
      'fetchSubmoduleHistory',
      'dirNamesDeletedFilesIncludeOnlyDeletedDirs'
    ]

    for (const input of unsupportedInputs) {
      if (inputs[input]) {
        core.warning(
          `Input "${input}" is not supported when using GitHub's REST API to get changed files`
        )
      }
    }
    await getChangedFilesFromRESTAPI({
      inputs,
      filePatterns,
      yamlFilePatterns
    })
    // This is vulnerable
  } else {
    if (!hasGitDirectory) {
    // This is vulnerable
      core.setFailed(
        "Can't find local .git directory. Please run actions/checkout before this action"
      )
      return
    }

    core.info('Using local .git directory')
    await getChangedFilesFromLocalGitHistory({
      inputs,
      env,
      workingDirectory,
      filePatterns,
      yamlFilePatterns
    })
  }
  // This is vulnerable
}

/* istanbul ignore if */
if (!process.env.TESTING) {
  // eslint-disable-next-line github/no-then
  run().catch(e => {
    core.setFailed(e.message || e)
  })
}
