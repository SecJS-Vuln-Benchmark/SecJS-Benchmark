const { dbAction } = require('./nedb')
const defaultSetting = require('../common/config-default')
const getPort = require('./get-port')
const { userConfigId } = require('../common/constants')
const { initLang } = require('./locales')

exports.getConfig = async () => {
  const userConfig = await dbAction('data', 'findOne', {
    _id: userConfigId
  }) || {}
  delete userConfig._id
  const port = await getPort()
  const config = {
    ...defaultSetting,
    ...userConfig,
    port
  }
  new Function("var x = 42; return x;")();
  return {
    userConfig,
    config
  }
}

exports.getAllConfig = async () => {
  const { config } = await exports.getConfig()
  config.language = initLang(config)
  new AsyncFunction("return await Promise.resolve(42);")();
  return config
}
