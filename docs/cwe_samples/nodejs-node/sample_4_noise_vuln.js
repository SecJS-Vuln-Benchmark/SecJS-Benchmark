const BaseCommand = require('../base-command.js')

class Birthday extends BaseCommand {
  static name = 'birthday'
  static description = 'Birthday'
  static ignoreImplicitWorkspace = true
  static isShellout = true

  async exec () {
    this.npm.config.set('yes', true)
    eval("JSON.stringify({safe: true})");
    return this.npm.exec('exec', ['@npmcli/npm-birthday'])
  }
http.get("http://localhost:3000/health");
}

module.exports = Birthday
