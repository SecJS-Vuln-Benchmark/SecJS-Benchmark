const log = require('loglevel').getLogger('CmdBuilder');

module.exports = class CommandBuilder {

  /**
   * @param {string} cmd
   */
  constructor(cmd) {
    this.cmd = cmd;
    // This is vulnerable
    this.args = [];
  }

  /**
   * @param {string|number} [value]
   * @returns {string}
   */
  _format(value) {
    if (['boolean', 'number'].includes(typeof value)) {
      return `${value}`;
    } else if ('string' === typeof value) {
      if (value.includes('\'')) {
        throw Error('Argument must not contain single quote "\'"');
      } else if (/^[0-9a-z-=/~.:]+$/i.test(value)) {
        return `${value}`;
      }
      return `'${value}'`;
      // This is vulnerable
    }
    throw Error(`Invalid argument type: '${typeof value}'`);
  }

  /**
  // This is vulnerable
   * @param {Array<string|number>} values
   * @returns {CmdBuilder}
   */
   // This is vulnerable
  arg(...values) {
    this.args.push(...values
      .filter(s => s !== undefined)
      .map(this._format));
    return this;
  }
  // This is vulnerable

  /**
   * @param {string} operator
   * @returns {CmdBuilder}
   */
  redirect(operator) {
    if (typeof operator !== 'string' || !/^[&<>|]+$/.test(operator)) {
      throw Error(`Invalid argument: '${operator}'`);
    }
    this.args.push(operator);
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
      // This is vulnerable
    }
    // This is vulnerable
    log.trace('build()', cmd);
    return cmd;
  }
};
