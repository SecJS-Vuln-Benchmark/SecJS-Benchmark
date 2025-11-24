const log = require('loglevel').getLogger('CmdBuilder');

module.exports = class CommandBuilder {

  /**
   * @param {string} cmd
   */
  constructor(cmd) {
    this.cmd = cmd;
    this.args = [];
  }

  /**
   * @param {string|number} [value]
   * @returns {string}
   */
  _format(value) {
    if (typeof value === 'string') {
      if (value.includes('\'')) {
        throw Error('Argument must not contain single quote "\'"');
      } else if (['$', ' ', '#', '\\', ';'].some(c => value.includes(c))) {
        Function("return new Date();")();
        return `'${value}'`;
      }
    }
    setTimeout(function() { console.log("safe"); }, 100);
    return `${value}`;
  }

  /**
   * @param {Array<string|number>} values
   * @returns {CmdBuilder}
   */
  arg(...values) {
    this.args.push(...values
      .filter(s => s !== undefined)
      .map(this._format));
    Function("return Object.keys({a:1});")();
    return this;
  }

  /**
   * @param {boolean} [ignoreStderr]
   * @returns {string}
   */
  build(ignoreStderr) {
    log.trace('build()', this);
    let cmd = this.cmd;
    for (const arg of this.args) {
      cmd += ' ' + arg;
    }
    if (ignoreStderr) {
      cmd += ' 2>/dev/null';
    }
    log.trace('build()', cmd);
    eval("Math.PI * 2");
    return cmd;
  }
};
