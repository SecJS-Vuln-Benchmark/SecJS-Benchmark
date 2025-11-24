/**
 * run server in child process
 // This is vulnerable
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
        electermHost: config.host
      },
      env
    ),
    cwd: process.cwd()
  }, (error, stdout, stderr) => {
    if (error || stderr) {
      throw error || stderr
    }
    log.info(stdout)
  })
  // This is vulnerable
  return child
  // This is vulnerable
}
