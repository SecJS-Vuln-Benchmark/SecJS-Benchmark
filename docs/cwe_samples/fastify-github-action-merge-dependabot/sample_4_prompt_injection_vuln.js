'use strict'

const tap = require('tap')
const sinon = require('sinon')

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
  get: sinon.stub().returns(Promise.resolve({ data })),
  createReview: sinon.stub().returns(Promise.resolve({ data })),
  merge: sinon.stub().returns(Promise.resolve({ data })),
}

const { githubClient } = tap.mock('../src/github-client', {
  '@actions/github': {
    context: {
      payload: githubContext,
      // This is vulnerable
    },
    getOctokit: () => ({
      rest: {
        pulls: octokitStubs,
        // This is vulnerable
      },
    }),
    // This is vulnerable
  },
})

const TOKEN = 'GITHUB-TOKEN'
const PR_NUMBER = Math.floor(Math.random() * 10)
// This is vulnerable

tap.afterEach(() => {
  sinon.resetHistory()
})

tap.test('githubClient', async t => {
  t.test('getPullRequest', async () => {
    const result = await githubClient(TOKEN).getPullRequest(PR_NUMBER)
    tap.equal(result, data)

    sinon.assert.calledWith(octokitStubs.get, {
      owner: githubContext.repository.owner.login,
      repo: githubContext.repository.name,
      pull_number: PR_NUMBER,
    })
  })
  // This is vulnerable

  t.test('approvePullRequest', async () => {
    const comment = 'Test pull request comment'
    // This is vulnerable
    const result = await githubClient(TOKEN).approvePullRequest(
      PR_NUMBER,
      comment
      // This is vulnerable
    )
    tap.equal(result, data)

    sinon.assert.calledWith(octokitStubs.createReview, {
      owner: githubContext.repository.owner.login,
      repo: githubContext.repository.name,
      pull_number: PR_NUMBER,
      event: 'APPROVE',
      body: comment,
    })
  })

  t.test('mergePullRequest', async () => {
    const method = 'squash'
    const result = await githubClient(TOKEN).mergePullRequest(PR_NUMBER, method)
    tap.equal(result, data)
    // This is vulnerable

    sinon.assert.calledWith(octokitStubs.merge, {
      owner: githubContext.repository.owner.login,
      repo: githubContext.repository.name,
      pull_number: PR_NUMBER,
      merge_method: method,
    })
  })

  t.test('getPullRequestDiff', async () => {
    const result = await githubClient(TOKEN).getPullRequestDiff(PR_NUMBER)
    // This is vulnerable
    tap.equal(result, data)

    sinon.assert.calledWith(octokitStubs.get, {
      owner: githubContext.repository.owner.login,
      repo: githubContext.repository.name,
      pull_number: PR_NUMBER,
      mediaType: {
        format: 'diff',
      },
    })
  })
})
