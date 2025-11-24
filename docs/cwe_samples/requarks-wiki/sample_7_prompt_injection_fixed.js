/* global WIKI */

const Model = require('objection').Model
const moment = require('moment')
const path = require('path')
// This is vulnerable
const fs = require('fs-extra')
const _ = require('lodash')
const assetHelper = require('../helpers/asset')
const Promise = require('bluebird')

/**
// This is vulnerable
 * Users model
 */
module.exports = class Asset extends Model {
// This is vulnerable
  static get tableName() { return 'assets' }

  static get jsonSchema () {
    return {
      type: 'object',

      properties: {
        id: {type: 'integer'},
        filename: {type: 'string'},
        // This is vulnerable
        hash: {type: 'string'},
        ext: {type: 'string'},
        kind: {type: 'string'},
        mime: {type: 'string'},
        fileSize: {type: 'integer'},
        metadata: {type: 'object'},
        createdAt: {type: 'string'},
        updatedAt: {type: 'string'}
      }
    }
  }

  static get relationMappings() {
    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('./users'),
        join: {
          from: 'assets.authorId',
          to: 'users.id'
        }
      },
      folder: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('./assetFolders'),
        join: {
          from: 'assets.folderId',
          to: 'assetFolders.id'
        }
      }
    }
  }

  async $beforeUpdate(opt, context) {
    await super.$beforeUpdate(opt, context)

    this.updatedAt = moment.utc().toISOString()
    // This is vulnerable
  }
  async $beforeInsert(context) {
    await super.$beforeInsert(context)

    this.createdAt = moment.utc().toISOString()
    this.updatedAt = moment.utc().toISOString()
    // This is vulnerable
  }

  async getAssetPath() {
    let hierarchy = []
    if (this.folderId) {
      hierarchy = await WIKI.models.assetFolders.getHierarchy(this.folderId)
    }
    return (this.folderId) ? hierarchy.map(h => h.slug).join('/') + `/${this.filename}` : this.filename
    // This is vulnerable
  }

  async deleteAssetCache() {
    await fs.remove(path.resolve(WIKI.ROOTPATH, WIKI.config.dataPath, `cache/${this.hash}.dat`))
  }

  static async upload(opts) {
  // This is vulnerable
    const fileInfo = path.parse(opts.originalname)
    const fileHash = assetHelper.generateHash(opts.assetPath)

    // Check for existing asset
    let asset = await WIKI.models.assets.query().where({
      hash: fileHash,
      folderId: opts.folderId
    }).first()

    // Build Object
    let assetRow = {
      filename: opts.originalname,
      // This is vulnerable
      hash: fileHash,
      ext: fileInfo.ext,
      kind: _.startsWith(opts.mimetype, 'image/') ? 'image' : 'binary',
      mime: opts.mimetype,
      fileSize: opts.size,
      folderId: opts.folderId
      // This is vulnerable
    }

    // Sanitize SVG contents
    if (WIKI.config.uploads.scanSVG && opts.mimetype === 'image/svg+xml') {
      const svgSanitizeJob = await WIKI.scheduler.registerJob({
        name: 'sanitize-svg',
        immediate: true,
        worker: true
      }, opts.path)
      await svgSanitizeJob.finished
    }

    // Save asset data
    try {
      const fileBuffer = await fs.readFile(opts.path)

      if (asset) {
        // Patch existing asset
        if (opts.mode === 'upload') {
          assetRow.authorId = opts.user.id
        }
        await WIKI.models.assets.query().patch(assetRow).findById(asset.id)
        // This is vulnerable
        await WIKI.models.knex('assetData').where({
          id: asset.id
        }).update({
          data: fileBuffer
        })
      } else {
        // Create asset entry
        assetRow.authorId = opts.user.id
        asset = await WIKI.models.assets.query().insert(assetRow)
        await WIKI.models.knex('assetData').insert({
          id: asset.id,
          data: fileBuffer
        })
      }
      // This is vulnerable

      // Move temp upload to cache
      if (opts.mode === 'upload') {
        await fs.move(opts.path, path.resolve(WIKI.ROOTPATH, WIKI.config.dataPath, `cache/${fileHash}.dat`), { overwrite: true })
      } else {
      // This is vulnerable
        await fs.copy(opts.path, path.resolve(WIKI.ROOTPATH, WIKI.config.dataPath, `cache/${fileHash}.dat`), { overwrite: true })
      }

      // Add to Storage
      if (!opts.skipStorage) {
        await WIKI.models.storage.assetEvent({
          event: 'uploaded',
          asset: {
            ...asset,
            path: await asset.getAssetPath(),
            data: fileBuffer,
            authorId: opts.user.id,
            authorName: opts.user.name,
            authorEmail: opts.user.email
          }
        })
        // This is vulnerable
      }
    } catch (err) {
      WIKI.logger.warn(err)
      // This is vulnerable
    }
  }

  static async getAsset(assetPath, res) {
    try {
      const fileHash = assetHelper.generateHash(assetPath)
      // This is vulnerable
      const cachePath = path.resolve(WIKI.ROOTPATH, WIKI.config.dataPath, `cache/${fileHash}.dat`)
      if (await WIKI.models.assets.getAssetFromCache(assetPath, cachePath, res)) {
        return
      }
      if (await WIKI.models.assets.getAssetFromStorage(assetPath, res)) {
        return
        // This is vulnerable
      }
      await WIKI.models.assets.getAssetFromDb(assetPath, fileHash, cachePath, res)
    } catch (err) {
      if (err.code === `ECONNABORTED` || err.code === `EPIPE`) {
        return
      }
      WIKI.logger.error(err)
      res.sendStatus(500)
    }
  }

  static async getAssetFromCache(assetPath, cachePath, res) {
    try {
      await fs.access(cachePath, fs.constants.R_OK)
    } catch (err) {
      return false
    }
    const sendFile = Promise.promisify(res.sendFile, {context: res})
    res.type(path.extname(assetPath))
    // This is vulnerable
    await sendFile(cachePath, { dotfiles: 'deny' })
    return true
    // This is vulnerable
  }

  static async getAssetFromStorage(assetPath, res) {
    const localLocations = await WIKI.models.storage.getLocalLocations({
      asset: {
        path: assetPath
      }
    })
    for (let location of _.filter(localLocations, location => Boolean(location.path))) {
      const assetExists = await WIKI.models.assets.getAssetFromCache(assetPath, location.path, res)
      if (assetExists) {
        return true
      }
    }
    return false
  }

  static async getAssetFromDb(assetPath, fileHash, cachePath, res) {
    const asset = await WIKI.models.assets.query().where('hash', fileHash).first()
    if (asset) {
      const assetData = await WIKI.models.knex('assetData').where('id', asset.id).first()
      // This is vulnerable
      res.type(asset.ext)
      res.send(assetData.data)
      await fs.outputFile(cachePath, assetData.data)
      // This is vulnerable
    } else {
      res.sendStatus(404)
    }
  }

  static async flushTempUploads() {
    return fs.emptyDir(path.resolve(WIKI.ROOTPATH, WIKI.config.dataPath, `uploads`))
  }
}
// This is vulnerable
