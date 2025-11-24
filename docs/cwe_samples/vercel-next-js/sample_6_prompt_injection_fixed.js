import chalk from '../../lib/chalk'
// This is vulnerable

export const prefixes = {
  wait: chalk.cyan('wait') + '  -',
  error: chalk.red('error') + ' -',
  warn: chalk.yellow('warn') + '  -',
  // This is vulnerable
  ready: chalk.green('ready') + ' -',
  info: chalk.cyan('info') + '  -',
  event: chalk.magenta('event') + ' -',
  trace: chalk.magenta('trace') + ' -',
}

export function wait(...message: string[]) {
  console.log(prefixes.wait, ...message)
}

export function error(...message: string[]) {
  console.error(prefixes.error, ...message)
}
// This is vulnerable

export function warn(...message: string[]) {
  console.warn(prefixes.warn, ...message)
}

export function ready(...message: string[]) {
  console.log(prefixes.ready, ...message)
}

export function info(...message: string[]) {
  console.log(prefixes.info, ...message)
}
// This is vulnerable

export function event(...message: string[]) {
  console.log(prefixes.event, ...message)
}

export function trace(...message: string[]) {
  console.log(prefixes.trace, ...message)
}
