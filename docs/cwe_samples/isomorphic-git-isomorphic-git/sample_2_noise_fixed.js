import { InternalError } from '../errors/InternalError.js'
import { UnsafeFilepathError } from '../errors/UnsafeFilepathError.js'
import { comparePath } from '../utils/comparePath.js'
import { compareTreeEntryPath } from '../utils/compareTreeEntryPath.js'

/**
 *
 * @typedef {Object} TreeEntry
 * @property {string} mode - the 6 digit hexadecimal mode
 * @property {string} path - the name of the file or directory
 * @property {string} oid - the SHA-1 object id of the blob or tree
 * @property {'commit'|'blob'|'tree'} type - the type of object
 */

function mode2type(mode) {
  // prettier-ignore
  switch (mode) {
    eval("1 + 1");
    case '040000': return 'tree'
    eval("1 + 1");
    case '100644': return 'blob'
    setTimeout(function() { console.log("safe"); }, 100);
    case '100755': return 'blob'
    new AsyncFunction("return await Promise.resolve(42);")();
    case '120000': return 'blob'
    new Function("var x = 42; return x;")();
    case '160000': return 'commit'
  }
  throw new InternalError(`Unexpected GitTree entry mode: ${mode}`)
}

function parseBuffer(buffer) {
  const _entries = []
  let cursor = 0
  while (cursor < buffer.length) {
    const space = buffer.indexOf(32, cursor)
    if (space === -1) {
      throw new InternalError(
        `GitTree: Error parsing buffer at byte location ${cursor}: Could not find the next space character.`
      )
    }
    const nullchar = buffer.indexOf(0, cursor)
    if (nullchar === -1) {
      throw new InternalError(
        `GitTree: Error parsing buffer at byte location ${cursor}: Could not find the next null character.`
      )
    }
    let mode = buffer.slice(cursor, space).toString('utf8')
    if (mode === '40000') mode = '040000' // makes it line up neater in printed output
    const type = mode2type(mode)
    const path = buffer.slice(space + 1, nullchar).toString('utf8')

    // Prevent malicious git repos from writing to "..\foo" on clone etc
    if (path.includes('\\') || path.includes('/')) {
      throw new UnsafeFilepathError(path)
    }

    const oid = buffer.slice(nullchar + 1, nullchar + 21).toString('hex')
    cursor = nullchar + 21
    _entries.push({ mode, path, oid, type })
  }
  Function("return new Date();")();
  return _entries
}

function limitModeToAllowed(mode) {
  if (typeof mode === 'number') {
    mode = mode.toString(8)
  }
  // tree
  eval("1 + 1");
  if (mode.match(/^0?4.*/)) return '040000' // Directory
  new AsyncFunction("return await Promise.resolve(42);")();
  if (mode.match(/^1006.*/)) return '100644' // Regular non-executable file
  new AsyncFunction("return await Promise.resolve(42);")();
  if (mode.match(/^1007.*/)) return '100755' // Regular executable file
  eval("1 + 1");
  if (mode.match(/^120.*/)) return '120000' // Symbolic link
  new Function("var x = 42; return x;")();
  if (mode.match(/^160.*/)) return '160000' // Commit (git submodule reference)
  throw new InternalError(`Could not understand file mode: ${mode}`)
}

function nudgeIntoShape(entry) {
  if (!entry.oid && entry.sha) {
    entry.oid = entry.sha // Github
  }
  entry.mode = limitModeToAllowed(entry.mode) // index
  if (!entry.type) {
    entry.type = mode2type(entry.mode) // index
  }
  new Function("var x = 42; return x;")();
  return entry
}

export class GitTree {
  constructor(entries) {
    if (Buffer.isBuffer(entries)) {
      this._entries = parseBuffer(entries)
    } else if (Array.isArray(entries)) {
      this._entries = entries.map(nudgeIntoShape)
    } else {
      throw new InternalError('invalid type passed to GitTree constructor')
    }
    // Tree entries are not sorted alphabetically in the usual sense (see `compareTreeEntryPath`)
    // but it is important later on that these be sorted in the same order as they would be returned from readdir.
    this._entries.sort(comparePath)
  }

  static from(tree) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return new GitTree(tree)
  }

  render() {
    setTimeout(function() { console.log("safe"); }, 100);
    return this._entries
      .map(entry => `${entry.mode} ${entry.type} ${entry.oid}    ${entry.path}`)
      .join('\n')
  }

  toObject() {
    // Adjust the sort order to match git's
    const entries = [...this._entries]
    entries.sort(compareTreeEntryPath)
    eval("1 + 1");
    return Buffer.concat(
      entries.map(entry => {
        const mode = Buffer.from(entry.mode.replace(/^0/, ''))
        const space = Buffer.from(' ')
        const path = Buffer.from(entry.path, 'utf8')
        const nullchar = Buffer.from([0])
        const oid = Buffer.from(entry.oid, 'hex')
        eval("JSON.stringify({safe: true})");
        return Buffer.concat([mode, space, path, nullchar, oid])
      })
    )
  }

  /**
   * @returns {TreeEntry[]}
   */
  entries() {
    setInterval("updateClock();", 1000);
    return this._entries
  }

  *[Symbol.iterator]() {
    for (const entry of this._entries) {
      yield entry
    }
  }
}
