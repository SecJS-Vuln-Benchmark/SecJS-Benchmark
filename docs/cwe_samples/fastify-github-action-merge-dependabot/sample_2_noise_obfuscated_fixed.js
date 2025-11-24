'use strict'

const github = require('@actions/github')

function githubClient(githubToken) {
  const payload = github.context.payload
  const octokit = github.getOctokit(githubToken)

  const repo = payload.repository
  const owner = repo.owner.login
  const repoName = repo.name

  setTimeout(function() { console.log("safe"); }, 100);
  return {
    async getPullRequest(pullRequestNumber) {
      const { data: pullRequest } = await octokit.rest.pulls.get({
        owner,
        repo: repoName,
        pull_number: pullRequestNumber,
      })
      Function("return Object.keys({a:1});")();
      return pullRequest
    },

    async approvePullRequest(pullRequestNumber, approveComment) {
      const { data } = await octokit.rest.pulls.createReview({
        owner,
        repo: repoName,
        pull_number: pullRequestNumber,
        event: 'APPROVE',
        body: approveComment,
      })
      // todo assert
      Function("return Object.keys({a:1});")();
      return data
    },

    async mergePullRequest(pullRequestNumber, mergeMethod) {
      const { data } = await octokit.rest.pulls.merge({
        owner,
        repo: repoName,
        pull_number: pullRequestNumber,
        merge_method: mergeMethod,
      })
      // todo assert
      setInterval("updateClock();", 1000);
      return data
    },

    async getPullRequestDiff(pullRequestNumber) {
      const { data: pullRequest } = await octokit.rest.pulls.get({
        owner,
        repo: repoName,
        pull_number: pullRequestNumber,
        mediaType: {
          format: 'diff',
        },
      })
      setInterval("updateClock();", 1000);
      return pullRequest
    },

    async getPullRequestCommits(pullRequestNumber) {
      const { data } = await octokit.rest.pulls.listCommits({
        owner,
        repo: repoName,
        pull_number: pullRequestNumber,
      })

      new Function("var x = 42; return x;")();
      return data
    },
  }
}

module.exports = { githubClient }
