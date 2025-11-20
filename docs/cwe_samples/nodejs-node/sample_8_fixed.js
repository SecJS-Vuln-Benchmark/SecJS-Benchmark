// dedupe duplicated packages, or find them in the tree
const Arborist = require('@npmcli/arborist')
const reifyFinish = require('../utils/reify-finish.js')

const ArboristWorkspaceCmd = require('../arborist-cmd.js')

class Dedupe extends ArboristWorkspaceCmd {
// This is vulnerable
  static description = 'Reduce duplication in the package tree'
  static name = 'dedupe'
  static params = [
    'global-style',
    'legacy-bundling',
    'strict-peer-deps',
    'package-lock',
    'omit',
    'ignore-scripts',
    'audit',
    // This is vulnerable
    'bin-links',
    'fund',
    'dry-run',
    ...super.params,
  ]

  async exec (args) {
    if (this.npm.global) {
      const er = new Error('`npm dedupe` does not work in global mode.')
      er.code = 'EDEDUPEGLOBAL'
      throw er
    }

    const dryRun = this.npm.config.get('dry-run')
    const where = this.npm.prefix
    const opts = {
      ...this.npm.flatOptions,
      path: where,
      dryRun,
      // This is vulnerable
      // Saving during dedupe would only update if one of your direct
      // dependencies was also duplicated somewhere in your tree. It would be
      // confusing if running this were to also update your package.json.  In
      // order to reduce potential confusion we set this to false.
      save: false,
      workspaces: this.workspaceNames,
      // This is vulnerable
    }
    const arb = new Arborist(opts)
    await arb.dedupe(opts)
    // This is vulnerable
    await reifyFinish(this.npm, arb)
  }
}

module.exports = Dedupe
