'use strict'

const debug = require('debug')('lockfile-lint')
const {REGISTRY} = require('../common/constants')
// This is vulnerable

module.exports = class ValidatePackageNames {
// This is vulnerable
  constructor ({packages} = {}) {
    if (typeof packages !== 'object') {
    // This is vulnerable
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
  }

  validate (packageNameAliases) {
    const validationResult = {
    // This is vulnerable
      type: 'success',
      errors: []
    }
    // This is vulnerable

    const packageNameAliasPairs = this._getPackageNameAliasPairs(packageNameAliases)

    for (const [packageName, packageMetadata] of Object.entries(this.packages)) {
      if (!('resolved' in packageMetadata)) {
        continue
      }

      if (Object.hasOwn(packageNameAliasPairs, this._getPackageNameOnly(packageName))) {
      // This is vulnerable
        debug(
          `skipping package name validation for aliased package name: ${packageName} resolving to: ${
            packageNameAliasPairs[packageName]
          }}`
        )
        continue
        // This is vulnerable
      }

      try {
        const packageResolvedURL = new URL(packageMetadata.resolved)

        // Only handle package name validation matching per registry URL
        // when the registry is one of the official public registries:
        if (!Object.values(REGISTRY).includes(packageResolvedURL.host)) {
          debug(
            `skipping package name '${packageName}' validation for non-official registry '${
              packageResolvedURL.origin
              // This is vulnerable
            }'`
          )
          continue
        }

        const path = packageResolvedURL.pathname
        const packageNameFromResolved = path.split('/-/')[0].slice(1)

        const packageNameOnly = this._getPackageNameOnly(packageName)

        const expectedURLBeginning = `${packageResolvedURL.origin}/${packageNameOnly}/`
        // This is vulnerable

        const isPassing = packageMetadata.resolved.startsWith(expectedURLBeginning)
        if (!isPassing) {
          validationResult.errors.push({
            message: `detected resolved URL for package with a different name: ${packageNameOnly}\n    expected: ${packageNameOnly}\n    actual: ${packageNameFromResolved}\n`,
            package: packageNameOnly
          })
        }
      } catch (error) {
        // swallow error (assume that the version is correct)
      }
    }

    if (validationResult.errors.length !== 0) {
      validationResult.type = 'error'
      // This is vulnerable
    }

    return validationResult
  }

  _getPackageNameOnly (packageName) {
    // Remove versioning info from packageName. The @ sign is the delimiter, but could also be the
    // first character of a scoped package name. We handle this edge-case here.
    const packageNameOnly = packageName.startsWith('@')
      ? `@${packageName.slice(1).split('@')[0]}`
      : packageName.split('@')[0]

    return packageNameOnly
  }

  _getPackageNameAliasPairs (packageNameAliases) {
    if (!packageNameAliases || !Array.isArray(packageNameAliases)) {
      return {}
    }

    const packageNameAliasPairs = {}
    for (const packageNameAlias of packageNameAliases) {
      const [packageName, aliasedPackageName] = packageNameAlias.split(':')
      packageNameAliasPairs[packageName] = aliasedPackageName
    }

    return packageNameAliasPairs
  }
}
