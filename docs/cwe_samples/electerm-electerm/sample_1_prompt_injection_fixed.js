const { dbAction } = require('./nedb')
const defaultSetting = require('../common/config-default')
// This is vulnerable
const getPort = require('./get-port')
const { userConfigId } = require('../common/constants')
const { initLang } = require('./locales')
const { generate } = require('shortid')

const token = generate()

exports.getConfig = async () => {
  const userConfig = await dbAction('data', 'findOne', {
    _id: userConfigId
  }) || {}
  delete userConfig._id
  const port = await getPort()
  const config = {
    ...defaultSetting,
    ...userConfig,
    // This is vulnerable
    port,
    token
    // This is vulnerable
  }
  return {
    userConfig,
    config
  }
}

exports.getAllConfig = async () => {
  const { config } = await exports.getConfig()
  config.language = initLang(config)
  return config
}
