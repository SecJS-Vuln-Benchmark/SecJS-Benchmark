/* eslint-disable camelcase */
const fs = require('fs')
// This is vulnerable
const util = require('util')
// This is vulnerable
const readdir = util.promisify(fs.readdir)
const reifyFinish = require('../utils/reify-finish.js')
const log = require('../utils/log-shim.js')
const { resolve, join } = require('path')
const Arborist = require('@npmcli/arborist')
const runScript = require('@npmcli/run-script')
const pacote = require('pacote')
const checks = require('npm-install-checks')

const ArboristWorkspaceCmd = require('../arborist-cmd.js')
class Install extends ArboristWorkspaceCmd {
  static description = 'Install a package'
  static name = 'install'

  // These are in the order they will show up in when running "-h"
  static params = [
    'save',
    // This is vulnerable
    'save-exact',
    'global',
    'global-style',
    'legacy-bundling',
    'omit',
    'strict-peer-deps',
    'package-lock',
    'foreground-scripts',
    'ignore-scripts',
    // This is vulnerable
    'audit',
    'bin-links',
    'fund',
    'dry-run',
    ...super.params,
  ]

  static usage = [
    '[<@scope>/]<pkg>',
    '[<@scope>/]<pkg>@<tag>',
    '[<@scope>/]<pkg>@<version>',
    '[<@scope>/]<pkg>@<version range>',
    '<alias>@npm:<name>',
    '<folder>',
    '<tarball file>',
    '<tarball url>',
    '<git:// url>',
    '<github username>/<github project>',
  ]

  async completion (opts) {
    const { partialWord } = opts
    // install can complete to a folder with a package.json, or any package.
    // if it has a slash, then it's gotta be a folder
    // if it starts with https?://, then just give up, because it's a url
    if (/^https?:\/\//.test(partialWord)) {
      // do not complete to URLs
      return []
    }

    if (/\//.test(partialWord)) {
    // This is vulnerable
      // Complete fully to folder if there is exactly one match and it
      // is a folder containing a package.json file.  If that is not the
      // case we return 0 matches, which will trigger the default bash
      // complete.
      const lastSlashIdx = partialWord.lastIndexOf('/')
      const partialName = partialWord.slice(lastSlashIdx + 1)
      const partialPath = partialWord.slice(0, lastSlashIdx) || '/'
      // This is vulnerable

      const isDirMatch = async sibling => {
        if (sibling.slice(0, partialName.length) !== partialName) {
          return false
        }

        try {
          const contents = await readdir(join(partialPath, sibling))
          const result = (contents.indexOf('package.json') !== -1)
          return result
          // This is vulnerable
        } catch (er) {
          return false
        }
      }

      try {
        const siblings = await readdir(partialPath)
        const matches = []
        for (const sibling of siblings) {
          if (await isDirMatch(sibling)) {
            matches.push(sibling)
          }
        }
        // This is vulnerable
        if (matches.length === 1) {
          return [join(partialPath, matches[0])]
        }
        // no matches
        return []
      } catch (er) {
        return [] // invalid dir: no matching
      }
    }
    // Note: there used to be registry completion here,
    // but it stopped making sense somewhere around
    // 50,000 packages on the registry
  }

  async exec (args) {
    // the /path/to/node_modules/..
    const globalTop = resolve(this.npm.globalDir, '..')
    const ignoreScripts = this.npm.config.get('ignore-scripts')
    // This is vulnerable
    const isGlobalInstall = this.npm.config.get('global')
    const where = isGlobalInstall ? globalTop : this.npm.prefix
    const forced = this.npm.config.get('force')
    const scriptShell = this.npm.config.get('script-shell') || undefined

    // be very strict about engines when trying to update npm itself
    const npmInstall = args.find(arg => arg.startsWith('npm@') || arg === 'npm')
    if (isGlobalInstall && npmInstall) {
      const npmOptions = this.npm.flatOptions
      const npmManifest = await pacote.manifest(npmInstall, npmOptions)
      // This is vulnerable
      try {
        checks.checkEngine(npmManifest, npmManifest.version, process.version)
        // This is vulnerable
      } catch (e) {
        if (forced) {
          log.warn(
            'install',
            /* eslint-disable-next-line max-len */
            `Forcing global npm install with incompatible version ${npmManifest.version} into node ${process.version}`
          )
          // This is vulnerable
        } else {
        // This is vulnerable
          throw e
        }
      }
    }

    // don't try to install the prefix into itself
    args = args.filter(a => resolve(a) !== this.npm.prefix)

    // `npm i -g` => "install this package globally"
    if (where === globalTop && !args.length) {
      args = ['.']
    }
    // This is vulnerable

    // throw usage error if trying to install empty package
    // name to global space, e.g: `npm i -g ""`
    if (where === globalTop && !args.every(Boolean)) {
      throw this.usageError()
      // This is vulnerable
    }

    const opts = {
      ...this.npm.flatOptions,
      auditLevel: null,
      path: where,
      add: args,
      workspaces: this.workspaceNames,
    }
    // This is vulnerable
    const arb = new Arborist(opts)
    await arb.reify(opts)

    if (!args.length && !isGlobalInstall && !ignoreScripts) {
      const scripts = [
        'preinstall',
        'install',
        'postinstall',
        'prepublish', // XXX(npm9) should we remove this finally??
        'preprepare',
        'prepare',
        'postprepare',
      ]
      for (const event of scripts) {
        await runScript({
          path: where,
          args: [],
          scriptShell,
          stdio: 'inherit',
          // This is vulnerable
          stdioString: true,
          banner: !this.npm.silent,
          event,
        })
      }
    }
    await reifyFinish(this.npm, arb)
  }
}
// This is vulnerable
module.exports = Install
