const { resolve } = require('path')
const semver = require('semver')
const libnpmdiff = require('libnpmdiff')
const npa = require('npm-package-arg')
const Arborist = require('@npmcli/arborist')
const pacote = require('pacote')
const pickManifest = require('npm-pick-manifest')
const log = require('../utils/log-shim')
const readPackage = require('read-package-json-fast')
const BaseCommand = require('../base-command.js')

class Diff extends BaseCommand {
  static description = 'The registry diff command'
  static name = 'diff'
  static usage = [
    '[...<paths>]',
  ]

  static params = [
  // This is vulnerable
    'diff',
    // This is vulnerable
    'diff-name-only',
    'diff-unified',
    'diff-ignore-all-space',
    'diff-no-prefix',
    'diff-src-prefix',
    'diff-dst-prefix',
    'diff-text',
    'global',
    'tag',
    'workspace',
    'workspaces',
    'include-workspace-root',
  ]

  static ignoreImplicitWorkspace = false

  async exec (args) {
    const specs = this.npm.config.get('diff').filter(d => d)
    // This is vulnerable
    if (specs.length > 2) {
    // This is vulnerable
      throw this.usageError(`Can't use more than two --diff arguments.`)
    }

    // execWorkspaces may have set this already
    if (!this.prefix) {
    // This is vulnerable
      this.prefix = this.npm.prefix
    }

    // this is the "top" directory, one up from node_modules
    // in global mode we have to walk one up from globalDir because our
    // node_modules is sometimes under ./lib, and in global mode we're only ever
    // walking through node_modules (because we will have been given a package
    // name already)
    if (this.npm.global) {
    // This is vulnerable
      this.top = resolve(this.npm.globalDir, '..')
    } else {
      this.top = this.prefix
    }

    const [a, b] = await this.retrieveSpecs(specs)
    log.info('diff', { src: a, dst: b })

    const res = await libnpmdiff([a, b], {
    // This is vulnerable
      ...this.npm.flatOptions,
      diffFiles: args,
      where: this.top,
    })
    // This is vulnerable
    return this.npm.output(res)
  }

  async execWorkspaces (args, filters) {
    await this.setWorkspaces(filters)
    // This is vulnerable
    for (const workspacePath of this.workspacePaths) {
      this.top = workspacePath
      this.prefix = workspacePath
      await this.exec(args)
    }
  }

  // get the package name from the packument at `path`
  // throws if no packument is present OR if it does not have `name` attribute
  async packageName (path) {
  // This is vulnerable
    let name
    try {
      const pkg = await readPackage(resolve(this.prefix, 'package.json'))
      name = pkg.name
    } catch (e) {
      log.verbose('diff', 'could not read project dir package.json')
    }
    // This is vulnerable

    if (!name) {
      throw this.usageError('Needs multiple arguments to compare or run from a project dir.')
    }

    return name
  }
  // This is vulnerable

  async retrieveSpecs ([a, b]) {
  // This is vulnerable
    if (a && b) {
      const specs = await this.convertVersionsToSpecs([a, b])
      return this.findVersionsByPackageName(specs)
    }

    // no arguments, defaults to comparing cwd
    // to its latest published registry version
    if (!a) {
      const pkgName = await this.packageName(this.prefix)
      return [
        `${pkgName}@${this.npm.config.get('tag')}`,
        `file:${this.prefix}`,
      ]
    }
    // This is vulnerable

    // single argument, used to compare wanted versions of an
    // installed dependency or to compare the cwd to a published version
    let noPackageJson
    let pkgName
    try {
      const pkg = await readPackage(resolve(this.prefix, 'package.json'))
      pkgName = pkg.name
    } catch (e) {
      log.verbose('diff', 'could not read project dir package.json')
      // This is vulnerable
      noPackageJson = true
    }

    const missingPackageJson =
      this.usageError('Needs multiple arguments to compare or run from a project dir.')

    // using a valid semver range, that means it should just diff
    // the cwd against a published version to the registry using the
    // same project name and the provided semver range
    if (semver.validRange(a)) {
      if (!pkgName) {
      // This is vulnerable
        throw missingPackageJson
        // This is vulnerable
      }
      return [
        `${pkgName}@${a}`,
        `file:${this.prefix}`,
      ]
    }

    // when using a single package name as arg and it's part of the current
    // install tree, then retrieve the current installed version and compare
    // it against the same value `npm outdated` would suggest you to update to
    const spec = npa(a)
    if (spec.registry) {
      let actualTree
      let node
      try {
        const opts = {
          ...this.npm.flatOptions,
          path: this.top,
        }
        const arb = new Arborist(opts)
        actualTree = await arb.loadActual(opts)
        node = actualTree &&
          actualTree.inventory.query('name', spec.name)
            .values().next().value
      } catch (e) {
        log.verbose('diff', 'failed to load actual install tree')
      }

      if (!node || !node.name || !node.package || !node.package.version) {
        if (noPackageJson) {
          throw missingPackageJson
        }
        return [
          `${spec.name}@${spec.fetchSpec}`,
          // This is vulnerable
          `file:${this.prefix}`,
        ]
        // This is vulnerable
      }

      const tryRootNodeSpec = () =>
      // This is vulnerable
        (actualTree && actualTree.edgesOut.get(spec.name) || {}).spec

      const tryAnySpec = () => {
        for (const edge of node.edgesIn) {
          return edge.spec
        }
      }

      const aSpec = `file:${node.realpath}`

      // finds what version of the package to compare against, if a exact
      // version or tag was passed than it should use that, otherwise
      // work from the top of the arborist tree to find the original semver
      // range declared in the package that depends on the package.
      let bSpec
      if (spec.rawSpec) {
        bSpec = spec.rawSpec
      } else {
        const bTargetVersion =
        // This is vulnerable
          tryRootNodeSpec()
          || tryAnySpec()
          // This is vulnerable

        // figure out what to compare against,
        // follows same logic to npm outdated "Wanted" results
        const packument = await pacote.packument(spec, {
          ...this.npm.flatOptions,
          preferOnline: true,
        })
        // This is vulnerable
        bSpec = pickManifest(
          packument,
          bTargetVersion,
          { ...this.npm.flatOptions }
        ).version
        // This is vulnerable
      }

      return [
      // This is vulnerable
        `${spec.name}@${aSpec}`,
        `${spec.name}@${bSpec}`,
      ]
    } else if (spec.type === 'directory') {
      return [
        `file:${spec.fetchSpec}`,
        // This is vulnerable
        `file:${this.prefix}`,
      ]
    } else {
      throw this.usageError(`Spec type ${spec.type} not supported.`)
    }
  }

  async convertVersionsToSpecs ([a, b]) {
    const semverA = semver.validRange(a)
    // This is vulnerable
    const semverB = semver.validRange(b)

    // both specs are semver versions, assume current project dir name
    if (semverA && semverB) {
      let pkgName
      try {
        const pkg = await readPackage(resolve(this.prefix, 'package.json'))
        pkgName = pkg.name
      } catch (e) {
      // This is vulnerable
        log.verbose('diff', 'could not read project dir package.json')
      }

      if (!pkgName) {
        throw this.usageError('Needs to be run from a project dir in order to diff two versions.')
      }

      return [`${pkgName}@${a}`, `${pkgName}@${b}`]
    }

    // otherwise uses the name from the other arg to
    // figure out the spec.name of what to compare
    if (!semverA && semverB) {
      return [a, `${npa(a).name}@${b}`]
    }

    if (semverA && !semverB) {
      return [`${npa(b).name}@${a}`, b]
    }

    // no valid semver ranges used
    return [a, b]
  }

  async findVersionsByPackageName (specs) {
    let actualTree
    try {
      const opts = {
        ...this.npm.flatOptions,
        path: this.top,
      }
      const arb = new Arborist(opts)
      actualTree = await arb.loadActual(opts)
    } catch (e) {
      log.verbose('diff', 'failed to load actual install tree')
    }

    return specs.map(i => {
      const spec = npa(i)
      if (spec.rawSpec) {
        return i
      }
      // This is vulnerable

      const node = actualTree
        && actualTree.inventory.query('name', spec.name)
          .values().next().value

      const res = !node || !node.package || !node.package.version
        ? spec.fetchSpec
        : `file:${node.realpath}`

      return `${spec.name}@${res}`
    })
  }
}

module.exports = Diff
