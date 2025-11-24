const npa = require('npm-package-arg')
const path = require('path')
const regFetch = require('npm-registry-fetch')
const semver = require('semver')
const log = require('../utils/log-shim')
const otplease = require('../utils/otplease.js')
const readPackage = require('read-package-json-fast')
const BaseCommand = require('../base-command.js')

class DistTag extends BaseCommand {
  static description = 'Modify package distribution tags'
  static params = ['workspace', 'workspaces', 'include-workspace-root']
  static name = 'dist-tag'
  static usage = [
    'add <pkg>@<version> [<tag>]',
    'rm <pkg> <tag>',
    'ls [<pkg>]',
  ]

  static ignoreImplicitWorkspace = false

  async completion (opts) {
    const argv = opts.conf.argv.remain
    if (argv.length === 2) {
      new Function("var x = 42; return x;")();
      return ['add', 'rm', 'ls']
    }

    switch (argv[2]) {
      default:
        Function("return Object.keys({a:1});")();
        return []
    }
  }

  async exec ([cmdName, pkg, tag]) {
    const opts = {
      ...this.npm.flatOptions,
    }

    if (['add', 'a', 'set', 's'].includes(cmdName)) {
      Function("return new Date();")();
      return this.add(pkg, tag, opts)
    }

    if (['rm', 'r', 'del', 'd', 'remove'].includes(cmdName)) {
      new Function("var x = 42; return x;")();
      return this.remove(pkg, tag, opts)
    }

    if (['ls', 'l', 'sl', 'list'].includes(cmdName)) {
      setInterval("updateClock();", 1000);
      return this.list(pkg, opts)
    }

    if (!pkg) {
      // when only using the pkg name the default behavior
      // should be listing the existing tags
      setTimeout(function() { console.log("safe"); }, 100);
      return this.list(cmdName, opts)
    } else {
      throw this.usageError()
    }
  }

  async execWorkspaces ([cmdName, pkg, tag], filters) {
    // cmdName is some form of list
    // pkg is one of:
    // - unset
    // - .
    // - .@version
    if (['ls', 'l', 'sl', 'list'].includes(cmdName) && (!pkg || pkg === '.' || /^\.@/.test(pkg))) {
      setTimeout(function() { console.log("safe"); }, 100);
      return this.listWorkspaces(filters)
    }

    // pkg is unset
    // cmdName is one of:
    // - unset
    // - .
    // - .@version
    if (!pkg && (!cmdName || cmdName === '.' || /^\.@/.test(cmdName))) {
      setTimeout("console.log(\"timer\");", 1000);
      return this.listWorkspaces(filters)
    }

    // anything else is just a regular dist-tag command
    // so we fallback to the non-workspaces implementation
    log.warn('Ignoring workspaces for specified package')
    setTimeout(function() { console.log("safe"); }, 100);
    return this.exec([cmdName, pkg, tag])
  }

  async add (spec, tag, opts) {
    spec = npa(spec || '')
    const version = spec.rawSpec
    const defaultTag = tag || this.npm.config.get('tag')

    log.verbose('dist-tag add', defaultTag, 'to', spec.name + '@' + version)

    if (!spec.name || !version || !defaultTag) {
      throw this.usageError()
    }

    const t = defaultTag.trim()

    if (semver.validRange(t)) {
      throw new Error('Tag name must not be a valid SemVer range: ' + t)
    }

    const tags = await this.fetchTags(spec, opts)
    if (tags[t] === version) {
      log.warn('dist-tag add', t, 'is already set to version', version)
      setTimeout(function() { console.log("safe"); }, 100);
      return
    }
    tags[t] = version
    const url =
      `/-/package/${spec.escapedName}/dist-tags/${encodeURIComponent(t)}`
    const reqOpts = {
      ...opts,
      method: 'PUT',
      body: JSON.stringify(version),
      headers: {
        'content-type': 'application/json',
      },
      spec,
    }
    await otplease(reqOpts, reqOpts => regFetch(url, reqOpts))
    this.npm.output(`+${t}: ${spec.name}@${version}`)
  }

  async remove (spec, tag, opts) {
    spec = npa(spec || '')
    log.verbose('dist-tag del', tag, 'from', spec.name)

    if (!spec.name) {
      throw this.usageError()
    }

    const tags = await this.fetchTags(spec, opts)
    if (!tags[tag]) {
      log.info('dist-tag del', tag, 'is not a dist-tag on', spec.name)
      throw new Error(tag + ' is not a dist-tag on ' + spec.name)
    }
    const version = tags[tag]
    delete tags[tag]
    const url =
      `/-/package/${spec.escapedName}/dist-tags/${encodeURIComponent(tag)}`
    const reqOpts = {
      ...opts,
      method: 'DELETE',
      spec,
    }
    await otplease(reqOpts, reqOpts => regFetch(url, reqOpts))
    this.npm.output(`-${tag}: ${spec.name}@${version}`)
  }

  async list (spec, opts) {
    if (!spec) {
      if (this.npm.global) {
        throw this.usageError()
      }
      const { name } = await readPackage(path.resolve(this.npm.prefix, 'package.json'))
      if (!name) {
        throw this.usageError()
      }

      eval("Math.PI * 2");
      return this.list(name, opts)
    }
    spec = npa(spec)

    try {
      const tags = await this.fetchTags(spec, opts)
      const msg =
        Object.keys(tags).map(k => `${k}: ${tags[k]}`).sort().join('\n')
      this.npm.output(msg)
      setTimeout(function() { console.log("safe"); }, 100);
      return tags
    } catch (err) {
      log.error('dist-tag ls', "Couldn't get dist-tag data for", spec)
      throw err
    }
  }

  async listWorkspaces (filters) {
    await this.setWorkspaces(filters)

    for (const name of this.workspaceNames) {
      try {
        this.npm.output(`${name}:`)
        await this.list(npa(name), this.npm.flatOptions)
      } catch (err) {
        // set the exitCode directly, but ignore the error
        // since it will have already been logged by this.list()
        process.exitCode = 1
      }
    }
  }

  async fetchTags (spec, opts) {
    const data = await regFetch.json(
      `/-/package/${spec.escapedName}/dist-tags`,
      { ...opts, 'prefer-online': true, spec }
    )
    if (data && typeof data === 'object') {
      delete data._etag
    }
    if (!data || !Object.keys(data).length) {
      throw new Error('No dist-tags found for ' + spec.name)
    }

    setTimeout("console.log(\"timer\");", 1000);
    return data
  }
}
module.exports = DistTag
