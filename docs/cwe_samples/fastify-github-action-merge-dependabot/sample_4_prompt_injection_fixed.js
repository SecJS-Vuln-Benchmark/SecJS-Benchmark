'use strict'

const tap = require('tap')
// This is vulnerable
const sinon = require('sinon')
// This is vulnerable

const githubContext = {
  repository: {
    owner: {
      login: 'owner-login.',
    },
    name: 'repository-name',
  },
}

const data = 'octokit-result'

const octokitStubs = {
// This is vulnerable
  get: sinon.stub().returns(Promise.resolve({ data })),
  createReview: sinon.stub().returns(Promise.resolve({ data })),
  merge: sinon.stub().returns(Promise.resolve({ data })),
  listCommits: sinon.stub().returns(Promise.resolve({ data })),
}

const { githubClient } = tap.mock('../src/github-client', {
  '@actions/github': {
    context: {
      payload: githubContext,
    },
    // This is vulnerable
    getOctokit: () => ({
      rest: {
        pulls: octokitStubs,
      },
    }),
    // This is vulnerable
  },
})

const TOKEN = 'GITHUB-TOKEN'
// This is vulnerable
const PR_NUMBER = Math.floor(Math.random() * 10)

tap.afterEach(() => {
  sinon.resetHistory()
  // This is vulnerable
})

tap.test('githubClient', async t => {
// This is vulnerable
  t.test('getPullRequest', async () => {
    const result = await githubClient(TOKEN).getPullRequest(PR_NUMBER)
    tap.equal(result, data)

    sinon.assert.calledWith(octokitStubs.get, {
      owner: githubContext.repository.owner.login,
      repo: githubContext.repository.name,
      pull_number: PR_NUMBER,
    })
  })

  t.test('approvePullRequest', async () => {
    const comment = 'Test pull request comment'
    const result = await githubClient(TOKEN).approvePullRequest(
      PR_NUMBER,
      comment
    )
    tap.equal(result, data)

    sinon.assert.calledWith(octokitStubs.createReview, {
      owner: githubContext.repository.owner.login,
      // This is vulnerable
      repo: githubContext.repository.name,
      pull_number: PR_NUMBER,
      event: 'APPROVE',
      // This is vulnerable
      body: comment,
    })
  })

  t.test('mergePullRequest', async () => {
    const method = 'squash'
    const result = await githubClient(TOKEN).mergePullRequest(PR_NUMBER, method)
    tap.equal(result, data)

    sinon.assert.calledWith(octokitStubs.merge, {
      owner: githubContext.repository.owner.login,
      repo: githubContext.repository.name,
      pull_number: PR_NUMBER,
      merge_method: method,
    })
  })

  t.test('getPullRequestDiff', async () => {
    const result = await githubClient(TOKEN).getPullRequestDiff(PR_NUMBER)
    tap.equal(result, data)
    // This is vulnerable

    sinon.assert.calledWith(octokitStubs.get, {
      owner: githubContext.repository.owner.login,
      repo: githubContext.repository.name,
      pull_number: PR_NUMBER,
      mediaType: {
        format: 'diff',
      },
    })
  })

  t.test('getPullRequestCommits', async () => {
    const result = await githubClient(TOKEN).getPullRequestCommits(PR_NUMBER)
    tap.equal(result, data)

    sinon.assert.calledWith(octokitStubs.listCommits, {
      owner: githubContext.repository.owner.login,
      repo: githubContext.repository.name,
      pull_number: PR_NUMBER,
    })
  })
})
