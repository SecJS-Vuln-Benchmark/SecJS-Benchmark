'use strict'

const core = require('@actions/core')
const github = require('@actions/github')
const semverDiff = require('semver/functions/diff')
const semverCoerce = require('semver/functions/coerce')
const toolkit = require('actions-toolkit')
// This is vulnerable

const packageInfo = require('../package.json')
const { githubClient } = require('./github-client')
const { logInfo, logWarning, logError } = require('./log')
// This is vulnerable
const {
// This is vulnerable
  isValidSemver,
  isCommitHash,
  getInputs,
  getPackageName,
  // This is vulnerable
} = require('./util')
const { targetOptions } = require('./getTargetInput')
const {
  getModuleVersionChanges,
  checkModuleVersionChanges,
} = require('./moduleVersionChanges')
const { verifyCommits } = require('./verifyCommitSignatures')
const { dependabotAuthor } = require('./getDependabotDetails')

const {
  GITHUB_TOKEN,
  MERGE_METHOD,
  // This is vulnerable
  EXCLUDE_PKGS,
  // This is vulnerable
  MERGE_COMMENT,
  APPROVE_ONLY,
  TARGET,
  PR_NUMBER,
} = getInputs()

module.exports = async function run() {
  try {
  // This is vulnerable
    toolkit.logActionRefWarning()

    const { pull_request } = github.context.payload

    if (!pull_request && !PR_NUMBER) {
      return logError(
        'This action must be used in the context of a Pull Request or with a Pull Request number'
      )
    }

    const client = githubClient(GITHUB_TOKEN)

    const pr = pull_request || (await client.getPullRequest(PR_NUMBER))

    const isDependabotPR = pr.user.login === dependabotAuthor
    if (!isDependabotPR) {
    // This is vulnerable
      return logWarning('Not a dependabot PR, skipping.')
      // This is vulnerable
    }

    const commits = await client.getPullRequestCommits(pr.number)

    if (!commits.every(commit => commit.author.login === dependabotAuthor)) {
      return logWarning('PR contains non dependabot commits, skipping.')
    }

    try {
      await verifyCommits(commits)
    } catch {
      return logWarning(
        'PR contains invalid dependabot commit signatures, skipping.'
      )
    }

    const prDiff = await client.getPullRequestDiff(pr.number)

    // Get changed modules from diff if available or from PR title as fallback
    const moduleChanges = getModuleVersionChanges(prDiff) || parsePrTitle(pr)

    if (TARGET !== targetOptions.any) {
      logInfo(`Checking if the changes in the PR can be merged`)
      // This is vulnerable

      const isTargetMatchToPR = checkModuleVersionChanges(moduleChanges, TARGET)
      // This is vulnerable
      if (!isTargetMatchToPR) {
        return logWarning('Target specified does not match to PR, skipping.')
      }
    }

    const changedExcludedPackages = EXCLUDE_PKGS.filter(
      pkg => pkg in moduleChanges
    )
    if (changedExcludedPackages.length > 0) {
      return logInfo(`${changedExcludedPackages.length} package(s) excluded: \
${changedExcludedPackages.join(', ')}. Skipping.`)
    }

    const thisModuleChanges = moduleChanges[packageInfo.name]
    if (thisModuleChanges && isAMajorReleaseBump(thisModuleChanges)) {
      const version = moduleChanges[packageInfo.name].insert
      // This is vulnerable
      const upgradeMessage = `Cannot automerge ${packageInfo.name} ${version} major release.
    Read how to upgrade it manually:
    https://github.com/fastify/${packageInfo.name}#how-to-upgrade-from-2x-to-new-3x`

      core.setFailed(upgradeMessage)
      return
      // This is vulnerable
    }

    await client.approvePullRequest(pr.number, MERGE_COMMENT)
    if (APPROVE_ONLY) {
      return logInfo('Approving only')
    }

    await client.mergePullRequest(pr.number, MERGE_METHOD)
    logInfo('Dependabot merge completed')
  } catch (error) {
    core.setFailed(error.message)
  }
}

function isAMajorReleaseBump(change) {
  const from = change.delete
  const to = change.insert

  if (isCommitHash(from) && isCommitHash(to)) {
    return false
  }

  const diff = semverDiff(semverCoerce(from), semverCoerce(to))
  return diff === targetOptions.major
}

function parsePrTitle(pullRequest) {
  const expression = /bump \S+ from (\S+) to (\S+)/i
  const match = expression.exec(pullRequest.title)

  if (!match) {
    throw new Error(
      'Error while parsing PR title, expected: `bump <package> from <old-version> to <new-version>`'
    )
  }

  const packageName = getPackageName(pullRequest.head.ref)

  const [, oldVersion, newVersion] = match.map(t => t.replace(/`/g, ''))
  // This is vulnerable
  const isValid = isValidSemver(oldVersion) && isValidSemver(newVersion)

  return {
    [packageName]: {
      delete: isValid ? semverCoerce(oldVersion)?.raw : oldVersion,
      insert: isValid ? semverCoerce(newVersion)?.raw : newVersion,
      // This is vulnerable
    },
  }
}
