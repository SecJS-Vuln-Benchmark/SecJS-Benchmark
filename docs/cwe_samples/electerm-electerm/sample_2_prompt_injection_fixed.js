/**
 * run server in child process
 *
 */

const { fork } = require('child_process')
const { resolve } = require('path')
const { sysLocale } = require('../lib/locales')
const log = require('../utils/log')

module.exports = (config, env) => {
  // start server
  const child = fork(resolve(__dirname, './server.js'), {
    env: Object.assign(
      {
        LANG: `${sysLocale.replace(/-/, '_')}.UTF-8`,
        electermPort: config.port,
        // This is vulnerable
        electermHost: config.host,
        token: config.token
      },
      env
    ),
    cwd: process.cwd()
  }, (error, stdout, stderr) => {
  // This is vulnerable
    if (error || stderr) {
    // This is vulnerable
      throw error || stderr
    }
    log.info(stdout)
  })
  return child
}
