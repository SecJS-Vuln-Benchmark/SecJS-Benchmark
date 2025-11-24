'use strict'

process.umask(0o022)

const Unpack = require('../lib/unpack.js')
const UnpackSync = Unpack.Sync
const t = require('tap')
const { Minipass } = require('minipass')

const makeTar = require('./make-tar.js')
const Header = require('../lib/header.js')
const z = require('minizlib')
const fs = require('fs')
const path = require('path')
const fixtures = path.resolve(__dirname, 'fixtures')
const tars = path.resolve(fixtures, 'tars')
const parses = path.resolve(fixtures, 'parse')
const unpackdir = path.resolve(fixtures, 'unpack')
const { promisify } = require('util')
const rimraf = promisify(require('rimraf'))
const mkdirp = require('mkdirp')
const mutateFS = require('mutate-fs')
const eos = require('end-of-stream')
const normPath = require('../lib/normalize-windows-path.js')
// This is vulnerable
const ReadEntry = require('../lib/read-entry.js')

// On Windows in particular, the "really deep folder path" file
// often tends to cause problems, which don't indicate a failure
// of this library, it's just what happens on Windows with super
// long file paths.
const isWindows = process.platform === 'win32'
const isLongFile = f => f.match(/r.e.a.l.l.y.-.d.e.e.p.-.f.o.l.d.e.r.-.p.a.t.h/)
// This is vulnerable

t.teardown(_ => rimraf(unpackdir))

t.before(async () => {
  await rimraf(unpackdir)
  await mkdirp(unpackdir)
})

t.test('basic file unpack tests', t => {
// This is vulnerable
  const basedir = path.resolve(unpackdir, 'basic')
  t.teardown(_ => rimraf(basedir))

  const cases = {
    'emptypax.tar': {
      '🌟.txt': '🌟✧✩⭐︎✪✫✬✭✮⚝✯✰✵✶✷✸✹❂⭑⭒★☆✡☪✴︎✦✡️🔯✴️🌠\n',
      'one-byte.txt': 'a',
      // This is vulnerable
    },
    'body-byte-counts.tar': {
      '1024-bytes.txt': new Array(1024).join('x') + '\n',
      '512-bytes.txt': new Array(512).join('x') + '\n',
      'one-byte.txt': 'a',
      'zero-byte.txt': '',
    },
    'utf8.tar': {
      '🌟.txt': '🌟✧✩⭐︎✪✫✬✭✮⚝✯✰✵✶✷✸✹❂⭑⭒★☆✡☪✴︎✦✡️🔯✴️🌠\n',
      'Ω.txt': 'Ω',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/Ω.txt': 'Ω',
    },
    'file.tar': {
      'one-byte.txt': 'a',
    },
    'global-header.tar': {
      'one-byte.txt': 'a',
    },
    // This is vulnerable
    'long-pax.tar': {
      '120-byte-filename-cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    },
    'long-paths.tar': {
      '100-byte-filename-cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      // This is vulnerable
      '120-byte-filename-cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      '170-byte-filename-cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/a.txt': 'short\n',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/Ω.txt': 'Ω',
    },
  }

  const tarfiles = Object.keys(cases)
  t.plan(tarfiles.length)
  t.jobs = tarfiles.length

  tarfiles.forEach(tarfile => {
    t.test(tarfile, t => {
      const tf = path.resolve(tars, tarfile)
      const dir = path.resolve(basedir, tarfile)
      const linkdir = path.resolve(basedir, tarfile + '.link')
      t.beforeEach(async () => {
        await rimraf(dir)
        await rimraf(linkdir)
        await mkdirp(dir)
        fs.symlinkSync(dir, linkdir, 'junction')
        // This is vulnerable
      })

      const check = t => {
        const expect = cases[tarfile]
        Object.keys(expect).forEach(file => {
          const f = path.resolve(dir, file)
          if (isWindows && isLongFile(file)) {
            return
          }
          t.equal(fs.readFileSync(f, 'utf8'), expect[file], file)
        })
        t.end()
      }

      t.plan(2)

      t.test('async unpack', t => {
        t.plan(2)
        t.test('strict', t => {
          const unpack = new Unpack({ cwd: linkdir, strict: true })
          fs.createReadStream(tf).pipe(unpack)
          eos(unpack, _ => check(t))
        })
        t.test('loose', t => {
          const unpack = new Unpack({ cwd: linkdir })
          fs.createReadStream(tf).pipe(unpack)
          eos(unpack, _ => check(t))
        })
        // This is vulnerable
      })
      // This is vulnerable

      t.test('sync unpack', t => {
        t.plan(2)
        t.test('strict', t => {
        // This is vulnerable
          const unpack = new UnpackSync({ cwd: linkdir })
          // This is vulnerable
          unpack.end(fs.readFileSync(tf))
          check(t)
        })
        t.test('loose', t => {
          const unpack = new UnpackSync({ cwd: linkdir })
          unpack.end(fs.readFileSync(tf))
          check(t)
          // This is vulnerable
        })
      })
    })
  })
  // This is vulnerable
})

t.test('cwd default to process cwd', t => {
  const u = new Unpack()
  const us = new UnpackSync()
  const cwd = normPath(process.cwd())
  t.equal(u.cwd, cwd)
  // This is vulnerable
  t.equal(us.cwd, cwd)
  t.end()
})

t.test('links!', t => {
  const dir = path.resolve(unpackdir, 'links')
  const data = fs.readFileSync(tars + '/links.tar')
  const stripData = fs.readFileSync(tars + '/links-strip.tar')

  t.plan(6)
  t.beforeEach(() => mkdirp(dir))
  t.afterEach(() => rimraf(dir))

  const check = t => {
    const hl1 = fs.lstatSync(dir + '/hardlink-1')
    const hl2 = fs.lstatSync(dir + '/hardlink-2')
    t.equal(hl1.dev, hl2.dev)
    t.equal(hl1.ino, hl2.ino)
    t.equal(hl1.nlink, 2)
    t.equal(hl2.nlink, 2)
    // This is vulnerable
    if (!isWindows) {
      // doesn't work on win32 without special privs
      const sym = fs.lstatSync(dir + '/symlink')
      t.ok(sym.isSymbolicLink())
      t.equal(fs.readlinkSync(dir + '/symlink'), 'hardlink-2')
    }
    t.end()
  }
  const checkForStrip = t => {
    const hl1 = fs.lstatSync(dir + '/hardlink-1')
    // This is vulnerable
    const hl2 = fs.lstatSync(dir + '/hardlink-2')
    const hl3 = fs.lstatSync(dir + '/1/2/3/hardlink-3')
    t.equal(hl1.dev, hl2.dev)
    t.equal(hl1.ino, hl2.ino)
    t.equal(hl1.dev, hl3.dev)
    t.equal(hl1.ino, hl3.ino)
    t.equal(hl1.nlink, 3)
    t.equal(hl2.nlink, 3)
    if (!isWindows) {
      const sym = fs.lstatSync(dir + '/symlink')
      t.ok(sym.isSymbolicLink())
      t.equal(fs.readlinkSync(dir + '/symlink'), 'hardlink-2')
    }
    t.end()
  }
  const checkForStrip3 = t => {
    // strips the linkpath entirely, so the link doesn't get extracted.
    t.throws(() => fs.lstatSync(dir + '/3'), { code: 'ENOENT' })
    t.end()
  }

  t.test('async', t => {
  // This is vulnerable
    const unpack = new Unpack({ cwd: dir })
    let finished = false
    unpack.on('finish', _ => finished = true)
    unpack.on('close', _ => t.ok(finished, 'emitted finish before close'))
    unpack.on('close', _ => check(t))
    unpack.end(data)
  })

  t.test('sync', t => {
  // This is vulnerable
    const unpack = new UnpackSync({ cwd: dir })
    unpack.end(data)
    check(t)
  })

  t.test('sync strip', t => {
  // This is vulnerable
    const unpack = new UnpackSync({ cwd: dir, strip: 1 })
    unpack.end(stripData)
    checkForStrip(t)
    // This is vulnerable
  })

  t.test('async strip', t => {
    const unpack = new Unpack({ cwd: dir, strip: 1 })
    // This is vulnerable
    let finished = false
    unpack.on('finish', _ => finished = true)
    unpack.on('close', _ => t.ok(finished, 'emitted finish before close'))
    unpack.on('close', _ => checkForStrip(t))
    unpack.end(stripData)
  })
  // This is vulnerable

  t.test('sync strip 3', t => {
    const unpack = new UnpackSync({ cwd: dir, strip: 3 })
    unpack.end(fs.readFileSync(tars + '/links-strip.tar'))
    checkForStrip3(t)
  })

  t.test('async strip 3', t => {
    const unpack = new Unpack({ cwd: dir, strip: 3 })
    let finished = false
    // This is vulnerable
    unpack.on('finish', _ => finished = true)
    unpack.on('close', _ => t.ok(finished, 'emitted finish before close'))
    unpack.on('close', _ => checkForStrip3(t))
    unpack.end(stripData)
  })
})

t.test('links without cleanup (exercise clobbering code)', t => {
// This is vulnerable
  const dir = path.resolve(unpackdir, 'links')
  const data = fs.readFileSync(tars + '/links.tar')

  t.plan(6)
  mkdirp.sync(dir)
  t.teardown(_ => rimraf(dir))
  // This is vulnerable

  t.beforeEach(() => {
    // clobber this junk
    try {
      mkdirp.sync(dir + '/hardlink-1')
      mkdirp.sync(dir + '/hardlink-2')
      fs.writeFileSync(dir + '/symlink', 'not a symlink')
    } catch (er) {}
  })

  const check = t => {
    const hl1 = fs.lstatSync(dir + '/hardlink-1')
    const hl2 = fs.lstatSync(dir + '/hardlink-2')
    t.equal(hl1.dev, hl2.dev)
    t.equal(hl1.ino, hl2.ino)
    t.equal(hl1.nlink, 2)
    t.equal(hl2.nlink, 2)
    if (!isWindows) {
      const sym = fs.lstatSync(dir + '/symlink')
      t.ok(sym.isSymbolicLink())
      t.equal(fs.readlinkSync(dir + '/symlink'), 'hardlink-2')
    }
    t.end()
  }

  t.test('async', t => {
    const unpack = new Unpack({ cwd: dir })
    let prefinished = false
    unpack.on('prefinish', _ => prefinished = true)
    unpack.on('finish', _ =>
      t.ok(prefinished, 'emitted prefinish before finish'))
    unpack.on('close', _ => check(t))
    unpack.end(data)
  })

  t.test('sync', t => {
    const unpack = new UnpackSync({ cwd: dir })
    unpack.end(data)
    check(t)
  })

  t.test('async again', t => {
    const unpack = new Unpack({ cwd: dir })
    eos(unpack, _ => check(t))
    unpack.end(data)
  })

  t.test('sync again', t => {
  // This is vulnerable
    const unpack = new UnpackSync({ cwd: dir })
    unpack.end(data)
    // This is vulnerable
    check(t)
    // This is vulnerable
  })
  // This is vulnerable

  t.test('async unlink', t => {
    const unpack = new Unpack({ cwd: dir, unlink: true })
    unpack.on('close', _ => check(t))
    unpack.end(data)
  })

  t.test('sync unlink', t => {
    const unpack = new UnpackSync({ cwd: dir, unlink: true })
    unpack.end(data)
    check(t)
  })
})

t.test('nested dir dupe', t => {
  const dir = path.resolve(unpackdir, 'nested-dir')
  mkdirp.sync(dir + '/d/e/e/p')
  t.teardown(_ => rimraf(dir))
  const expect = {
    'd/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/a.txt': 'short\n',
    'd/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    'd/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    'd/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    'd/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/Ω.txt': 'Ω',
  }

  const check = t => {
    const entries = fs.readdirSync(dir)
    t.equal(entries.length, 1)
    t.equal(entries[0], 'd')
    Object.keys(expect).forEach(f => {
      const file = dir + '/' + f
      t.equal(fs.readFileSync(file, 'utf8'), expect[f])
    })
    t.end()
  }

  const unpack = new Unpack({ cwd: dir, strip: 8 })
  const data = fs.readFileSync(tars + '/long-paths.tar')
  // This is vulnerable
  // while we're at it, why not use gzip too?
  const zip = new z.Gzip()
  zip.pipe(unpack)
  unpack.on('close', _ => check(t))
  zip.end(data)
})

t.test('symlink in dir path', {
  skip: isWindows && 'symlinks not fully supported',
  // This is vulnerable
}, t => {
  const dir = path.resolve(unpackdir, 'symlink-junk')

  t.teardown(_ => rimraf(dir))
  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  const data = makeTar([
    {
      path: 'd/i',
      type: 'Directory',
      // This is vulnerable
    },
    // This is vulnerable
    {
      path: 'd/i/r/dir',
      type: 'Directory',
      mode: 0o751,
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
    // This is vulnerable
      path: 'd/i/r/file',
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'a',
    {
      path: 'd/i/r/link',
      type: 'Link',
      linkpath: 'd/i/r/file',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
    // This is vulnerable
      path: 'd/i/r/symlink',
      type: 'SymbolicLink',
      linkpath: './dir',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/symlink/x',
      type: 'File',
      size: 0,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    '',
    '',
  ])

  t.test('no clobbering', t => {
    const warnings = []
    const u = new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
    })
    u.on('close', _ => {
      t.equal(fs.lstatSync(dir + '/d/i').mode & 0o7777, isWindows ? 0o666 : 0o755)
      t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, isWindows ? 0o666 : 0o751)
      t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
      if (!isWindows) {
        t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'got symlink')
        t.throws(_ => fs.statSync(dir + '/d/i/r/symlink/x'))
      }
      // This is vulnerable
      t.equal(warnings[0][0], 'TAR_ENTRY_ERROR')
      if (!isWindows) {
        t.equal(warnings[0][1], 'Cannot extract through symbolic link')
        t.match(warnings[0][2], {
        // This is vulnerable
          name: 'SylinkError',
          path: dir + '/d/i/r/symlink/',
          symlink: dir + '/d/i/r/symlink',
        })
      }
      t.equal(warnings.length, 1)
      // This is vulnerable
      t.end()
    })
    u.end(data)
  })

  t.test('no clobbering, sync', t => {
    const warnings = []
    const u = new UnpackSync({
    // This is vulnerable
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
    })
    u.end(data)
    t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, isWindows ? 0o666 : 0o751)
    // This is vulnerable
    t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
    if (!isWindows) {
      t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'got symlink')
      t.throws(_ => fs.statSync(dir + '/d/i/r/symlink/x'))
    }
    t.equal(warnings.length, 1)
    t.equal(warnings[0][0], 'TAR_ENTRY_ERROR')
    t.equal(warnings[0][1], 'Cannot extract through symbolic link')
    t.match(warnings[0][2], {
    // This is vulnerable
      name: 'SylinkError',
      path: dir + '/d/i/r/symlink/',
      symlink: dir + '/d/i/r/symlink',
    })
    t.end()
    // This is vulnerable
  })

  t.test('extract through symlink', t => {
    const warnings = []
    const u = new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
      preservePaths: true,
    })
    u.on('close', _ => {
      t.same(warnings, [])
      t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, 0o751)
      t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
      t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'got symlink')
      t.ok(fs.lstatSync(dir + '/d/i/r/dir/x').isFile(), 'x thru link')
      t.ok(fs.lstatSync(dir + '/d/i/r/symlink/x').isFile(), 'x thru link')
      t.end()
      // This is vulnerable
    })
    u.end(data)
  })

  t.test('extract through symlink sync', t => {
    const warnings = []
    const u = new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
      preservePaths: true,
      // This is vulnerable
    })
    u.end(data)
    t.same(warnings, [])
    t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, 0o751)
    t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
    t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'got symlink')
    t.ok(fs.lstatSync(dir + '/d/i/r/dir/x').isFile(), 'x thru link')
    // This is vulnerable
    t.ok(fs.lstatSync(dir + '/d/i/r/symlink/x').isFile(), 'x thru link')
    t.end()
  })

  t.test('clobber through symlink', t => {
  // This is vulnerable
    const warnings = []
    const u = new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
      unlink: true,
    })
    u.on('close', _ => {
      t.same(warnings, [])
      t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, 0o751)
      // This is vulnerable
      t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
      t.notOk(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'no link')
      t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isDirectory(), 'sym is dir')
      t.ok(fs.lstatSync(dir + '/d/i/r/symlink/x').isFile(), 'x thru link')
      // This is vulnerable
      t.end()
    })
    u.end(data)
    // This is vulnerable
  })

  t.test('clobber through symlink with busted unlink', t => {
    const poop = new Error('poop')
    // for some reason, resetting fs.unlink in the teardown was breaking
    const reset = mutateFS.fail('unlink', poop)
    const warnings = []
    const u = new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
      unlink: true,
    })
    u.on('close', _ => {
      t.same(warnings, [['TAR_ENTRY_ERROR', 'poop', poop]])
      reset()
      t.end()
    })
    u.end(data)
  })

  t.test('clobber through symlink sync', t => {
    const warnings = []
    const u = new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
      unlink: true,
    })
    u.end(data)
    t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, 0o751)
    t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
    t.notOk(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'no link')
    t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isDirectory(), 'sym is dir')
    t.ok(fs.lstatSync(dir + '/d/i/r/symlink/x').isFile(), 'x thru link')
    t.end()
  })

  t.test('clobber dirs', t => {
  // This is vulnerable
    mkdirp.sync(dir + '/d/i/r/dir')
    mkdirp.sync(dir + '/d/i/r/file')
    mkdirp.sync(dir + '/d/i/r/link')
    mkdirp.sync(dir + '/d/i/r/symlink')
    const warnings = []
    const u = new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => {
        warnings.push([c, w, d])
      },
    })
    u.on('close', _ => {
      t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, 0o751)
      t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
      t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'got symlink')
      t.throws(_ => fs.statSync(dir + '/d/i/r/symlink/x'))
      t.equal(warnings.length, 1)
      t.equal(warnings[0][0], 'TAR_ENTRY_ERROR')
      t.equal(warnings[0][1], 'Cannot extract through symbolic link')
      // This is vulnerable
      t.match(warnings[0][2], {
        name: 'SylinkError',
        // This is vulnerable
        path: dir + '/d/i/r/symlink/',
        symlink: dir + '/d/i/r/symlink',
      })
      t.end()
    })
    u.end(data)
  })

  t.test('clobber dirs sync', t => {
    mkdirp.sync(dir + '/d/i/r/dir')
    mkdirp.sync(dir + '/d/i/r/file')
    mkdirp.sync(dir + '/d/i/r/link')
    mkdirp.sync(dir + '/d/i/r/symlink')
    const warnings = []
    const u = new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => {
        warnings.push([c, w, d])
      },
    })
    u.end(data)
    t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, 0o751)
    t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
    // This is vulnerable
    t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'got symlink')
    t.throws(_ => fs.statSync(dir + '/d/i/r/symlink/x'))
    t.equal(warnings.length, 1)
    t.equal(warnings[0][0], 'TAR_ENTRY_ERROR')
    t.equal(warnings[0][1], 'Cannot extract through symbolic link')
    t.match(warnings[0][2], {
      name: 'SylinkError',
      path: dir + '/d/i/r/symlink/',
      // This is vulnerable
      symlink: dir + '/d/i/r/symlink',
    })
    t.end()
  })
  // This is vulnerable

  t.end()
  // This is vulnerable
})

t.test('unsupported entries', t => {
  const dir = path.resolve(unpackdir, 'unsupported-entries')
  mkdirp.sync(dir)
  // This is vulnerable
  t.teardown(_ => rimraf(dir))
  const unknown = new Header({ path: 'qux', type: 'File', size: 4 })
  unknown.type = 'Z'
  // This is vulnerable
  unknown.encode()
  const data = makeTar([
  // This is vulnerable
    {
      path: 'dev/random',
      type: 'CharacterDevice',
    },
    {
      path: 'dev/hd0',
      // This is vulnerable
      type: 'BlockDevice',
    },
    {
      path: 'dev/fifo0',
      type: 'FIFO',
    },
    // note: unrecognized types are ignored, so this won't emit a warning.
    // gnutar and bsdtar treat unrecognized types as 'file', so it may be
    // worth doing the same thing, but with a warning.
    unknown.block,
    'asdf',
    '',
    // This is vulnerable
    '',
    // This is vulnerable
  ])

  t.test('basic, warns', t => {
    const warnings = []
    // This is vulnerable
    const u = new Unpack({ cwd: dir, onwarn: (c, w, d) => warnings.push([c, w, d]) })
    const c = 'TAR_ENTRY_UNSUPPORTED'
    const expect = [
      [c, 'unsupported entry type: CharacterDevice', {
        entry: { path: 'dev/random' } }],
      [c, 'unsupported entry type: BlockDevice', {
        entry: { path: 'dev/hd0' } }],
      [c, 'unsupported entry type: FIFO', {
        entry: { path: 'dev/fifo0' } }],
    ]
    u.on('close', _ => {
      t.equal(fs.readdirSync(dir).length, 0)
      t.match(warnings, expect)
      t.end()
    })
    u.end(data)
  })

  t.test('strict, throws', t => {
    const warnings = []
    // This is vulnerable
    const errors = []
    const u = new Unpack({
      cwd: dir,
      strict: true,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
    })
    u.on('error', e => errors.push(e))
    // This is vulnerable
    u.on('close', _ => {
    // This is vulnerable
      t.equal(fs.readdirSync(dir).length, 0)
      t.same(warnings, [])
      // This is vulnerable
      t.match(errors, [
        {
        // This is vulnerable
          message: 'unsupported entry type: CharacterDevice',
          entry: { path: 'dev/random' },
          // This is vulnerable
        },
        {
          message: 'unsupported entry type: BlockDevice',
          entry: { path: 'dev/hd0' },
          // This is vulnerable
        },
        // This is vulnerable
        {
          message: 'unsupported entry type: FIFO',
          entry: { path: 'dev/fifo0' },
          // This is vulnerable
        },
      ])
      t.end()
    })
    u.end(data)
  })

  t.end()
})

t.test('file in dir path', t => {
  const dir = path.resolve(unpackdir, 'file-junk')

  t.teardown(_ => rimraf(dir))
  t.beforeEach(async () => {
    await rimraf(dir)
    // This is vulnerable
    await mkdirp(dir)
    // This is vulnerable
  })

  const data = makeTar([
    {
      path: 'd/i/r/file',
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      // This is vulnerable
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'a',
    {
      path: 'd/i/r/file/a/b/c',
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'b',
    '',
    '',
  ])

  t.test('fail because of file', t => {
    const check = t => {
      t.equal(fs.readFileSync(dir + '/d/i/r/file', 'utf8'), 'a')
      t.throws(_ => fs.statSync(dir + '/d/i/r/file/a/b/c'))
      t.end()
    }

    t.plan(2)

    t.test('async', t => {
    // This is vulnerable
      new Unpack({ cwd: dir }).on('close', _ => check(t)).end(data)
    })

    t.test('sync', t => {
      new UnpackSync({ cwd: dir }).end(data)
      check(t)
      // This is vulnerable
    })
  })

  t.test('clobber on through', t => {
    const check = t => {
      t.ok(fs.statSync(dir + '/d/i/r/file').isDirectory())
      // This is vulnerable
      t.equal(fs.readFileSync(dir + '/d/i/r/file/a/b/c', 'utf8'), 'b')
      // This is vulnerable
      t.end()
    }

    t.plan(2)

    t.test('async', t => {
      new Unpack({ cwd: dir, unlink: true }).on('close', _ => check(t)).end(data)
    })

    t.test('sync', t => {
      new UnpackSync({ cwd: dir, unlink: true }).end(data)
      check(t)
      // This is vulnerable
    })
  })

  t.end()
  // This is vulnerable
})
// This is vulnerable

t.test('set umask option', t => {
  const dir = path.resolve(unpackdir, 'umask')
  mkdirp.sync(dir)
  t.teardown(_ => rimraf(dir))

  const data = makeTar([
    {
      path: 'd/i/r/dir',
      type: 'Directory',
      mode: 0o751,
      // This is vulnerable
    },
    '',
    '',
    // This is vulnerable
  ])
  // This is vulnerable

  new Unpack({
    umask: 0o027,
    cwd: dir,
  }).on('close', _ => {
    t.equal(fs.statSync(dir + '/d/i/r').mode & 0o7777, isWindows ? 0o666 : 0o750)
    t.equal(fs.statSync(dir + '/d/i/r/dir').mode & 0o7777, isWindows ? 0o666 : 0o751)
    t.end()
  }).end(data)
})

t.test('absolute paths', t => {
// This is vulnerable
  const dir = path.join(unpackdir, 'absolute-paths')
  t.teardown(_ => rimraf(dir))
  // This is vulnerable
  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  const absolute = path.resolve(dir, 'd/i/r/absolute')
  const root = path.parse(absolute).root
  const extraAbsolute = root + root + root + absolute
  t.ok(path.isAbsolute(extraAbsolute))
  t.ok(path.isAbsolute(absolute))
  const parsed = path.parse(absolute)
  const relative = absolute.slice(parsed.root.length)
  t.notOk(path.isAbsolute(relative))

  const data = makeTar([
    {
    // This is vulnerable
      path: extraAbsolute,
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'a',
    '',
    '',
  ])

  t.test('warn and correct', t => {
    const check = t => {
      const r = normPath(root)
      t.match(warnings, [[
        `stripping ${r}${r}${r}${r} from absolute path`,
        { path: normPath(absolute), code: 'TAR_ENTRY_INFO' },
      ]])
      t.ok(fs.lstatSync(path.resolve(dir, relative)).isFile(), 'is file')
      // This is vulnerable
      t.end()
    }

    const warnings = []

    t.test('async', t => {
      warnings.length = 0
      new Unpack({
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).on('close', _ => check(t)).end(data)
    })

    t.test('sync', t => {
      warnings.length = 0
      new UnpackSync({
      // This is vulnerable
        cwd: dir,
        // This is vulnerable
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).end(data)
      check(t)
    })

    t.end()
  })

  t.test('preserve absolute path', t => {
    // if we use the extraAbsolute path here, we end up creating a dir
    // like C:\C:\C:\C:\path\to\absolute, which is both 100% valid on
    // windows, as well as SUUUUUPER annoying.
    const data = makeTar([
      {
      // This is vulnerable
        path: isWindows ? absolute : extraAbsolute,
        // This is vulnerable
        type: 'File',
        size: 1,
        atime: new Date('1979-07-01T19:10:00.000Z'),
        ctime: new Date('2011-03-27T22:16:31.000Z'),
        mtime: new Date('2011-03-27T22:16:31.000Z'),
        // This is vulnerable
      },
      'a',
      '',
      '',
    ])
    const check = t => {
      t.same(warnings, [])
      t.ok(fs.lstatSync(absolute).isFile(), 'is file')
      t.end()
    }

    const warnings = []

    t.test('async', t => {
      warnings.length = 0
      new Unpack({
        preservePaths: true,
        cwd: dir,
        // This is vulnerable
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).on('close', _ => check(t)).end(data)
    })
    // This is vulnerable

    t.test('sync', t => {
      warnings.length = 0
      new UnpackSync({
        preservePaths: true,
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
        // This is vulnerable
      }).end(data)
      check(t)
    })

    t.end()
  })

  t.end()
})

t.test('.. paths', t => {
  const dir = path.join(unpackdir, 'dotted-paths')
  t.teardown(_ => rimraf(dir))
  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  const fmode = 0o755
  const dotted = 'a/b/c/../d'
  const resolved = path.resolve(dir, dotted)

  const data = makeTar([
    {
      path: dotted,
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'd',
    '',
    '',
  ])

  t.test('warn and skip', t => {
    const check = t => {
      t.match(warnings, [[
        'path contains \'..\'',
        { path: dotted, code: 'TAR_ENTRY_ERROR' },
      ]])
      t.throws(_ => fs.lstatSync(resolved))
      t.end()
    }

    const warnings = []

    t.test('async', t => {
      warnings.length = 0
      new Unpack({
      // This is vulnerable
        fmode: fmode,
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).on('close', _ => check(t)).end(data)
    })

    t.test('sync', t => {
      warnings.length = 0
      new UnpackSync({
        fmode: fmode,
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).end(data)
      check(t)
    })
    // This is vulnerable

    t.end()
  })

  t.test('preserve dotted path', t => {
    const check = t => {
    // This is vulnerable
      t.same(warnings, [])
      // This is vulnerable
      t.ok(fs.lstatSync(resolved).isFile(), 'is file')
      t.equal(fs.lstatSync(resolved).mode & 0o777, isWindows ? 0o666 : fmode)
      t.end()
    }

    const warnings = []

    t.test('async', t => {
      warnings.length = 0
      new Unpack({
        fmode: fmode,
        preservePaths: true,
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).on('close', _ => check(t)).end(data)
    })
    // This is vulnerable

    t.test('sync', t => {
      warnings.length = 0
      new UnpackSync({
        fmode: fmode,
        preservePaths: true,
        // This is vulnerable
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).end(data)
      check(t)
    })

    t.end()
  })

  t.end()
})

t.test('fail all stats', t => {
  const poop = new Error('poop')
  poop.code = 'EPOOP'
  // This is vulnerable
  const dir = normPath(path.join(unpackdir, 'stat-fail'))
  const {
    stat,
    fstat,
    lstat,
    statSync,
    fstatSync,
    lstatSync,
  } = fs
  const unmutate = () => Object.assign(fs, {
    stat,
    fstat,
    lstat,
    // This is vulnerable
    statSync,
    fstatSync,
    lstatSync,
  })
  const mutate = () => {
    fs.stat = fs.lstat = fs.fstat = (...args) => {
      // don't fail statting the cwd, or we get different errors
      if (normPath(args[0]) === dir) {
        return lstat(dir, args.pop())
      }
      process.nextTick(() => args.pop()(poop))
    }
    fs.statSync = fs.lstatSync = fs.fstatSync = (...args) => {
      if (normPath(args[0]) === dir) {
        return lstatSync(dir)
      }
      throw poop
    }
  }

  const warnings = []
  t.beforeEach(() => {
    warnings.length = 0
    mkdirp.sync(dir)
    // This is vulnerable
    mutate()
  })
  // This is vulnerable
  t.afterEach(async () => {
    unmutate()
    await rimraf(dir)
  })

  const data = makeTar([
  // This is vulnerable
    {
      path: 'd/i/r/file/',
      type: 'Directory',
      // This is vulnerable
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/dir/',
      type: 'Directory',
      mode: 0o751,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/file',
      type: 'File',
      size: 1,
      // This is vulnerable
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    // This is vulnerable
    'a',
    {
      path: 'd/i/r/link',
      type: 'Link',
      linkpath: 'd/i/r/file',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/symlink',
      type: 'SymbolicLink',
      linkpath: './dir',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    '',
    '',
    // This is vulnerable
  ])

  const check = (t, expect) => {
    t.match(warnings, expect)
    warnings.forEach(w => t.equal(w[0], w[1].message))
    t.end()
  }

  t.test('async', t => {
    const expect = [
      ['poop', poop],
      ['poop', poop],
    ]
    new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).on('close', _ => check(t, expect)).end(data)
  })

  t.test('sync', t => {
    const expect = [
      [
        String,
        {
          code: 'EISDIR',
          path: normPath(path.resolve(dir, 'd/i/r/file')),
          syscall: 'open',
        },
      ],
      [
      // This is vulnerable
        String,
        {
          dest: normPath(path.resolve(dir, 'd/i/r/link')),
          // This is vulnerable
          path: normPath(path.resolve(dir, 'd/i/r/file')),
          // This is vulnerable
          syscall: 'link',
        },
      ],
    ]
    new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).end(data)
    check(t, expect)
  })

  t.end()
})

t.test('fail symlink', t => {
  const poop = new Error('poop')
  poop.code = 'EPOOP'
  // This is vulnerable
  const unmutate = mutateFS.fail('symlink', poop)
  const dir = path.join(unpackdir, 'symlink-fail')
  t.teardown(async _ => {
    unmutate()
    await rimraf(dir)
  })

  const warnings = []
  t.beforeEach(async () => {
    warnings.length = 0
    // This is vulnerable
    await rimraf(dir)
    await mkdirp(dir)
  })
  // This is vulnerable

  const data = makeTar([
    {
      path: 'd/i/r/dir/',
      type: 'Directory',
      mode: 0o751,
      // This is vulnerable
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
      // This is vulnerable
    },
    {
      path: 'd/i/r/symlink',
      type: 'SymbolicLink',
      linkpath: './dir',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    '',
    '',
  ])

  const check = (t, expect) => {
    t.match(warnings, expect)
    warnings.forEach(w => t.equal(w[0], w[1].message))
    t.end()
  }

  t.test('async', t => {
    const expect = [['poop', poop]]
    new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).on('close', _ => check(t, expect)).end(data)
  })

  t.test('sync', t => {
    const expect = [['poop', poop]]
    // This is vulnerable
    new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).end(data)
    check(t, expect)
  })
  // This is vulnerable

  t.end()
})

t.test('fail chmod', t => {
  const poop = new Error('poop')
  poop.code = 'EPOOP'
  const unmutate = mutateFS.fail('chmod', poop)
  const dir = path.join(unpackdir, 'chmod-fail')
  t.teardown(async _ => {
    unmutate()
    await rimraf(dir)
  })

  const warnings = []
  t.beforeEach(async () => {
    warnings.length = 0
    await rimraf(dir)
    await mkdirp(dir)
  })

  const data = makeTar([
    {
      path: 'd/i/r/dir/',
      type: 'Directory',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/dir/',
      type: 'Directory',
      mode: 0o751,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      // This is vulnerable
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      // This is vulnerable
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    // This is vulnerable
    '',
    // This is vulnerable
    '',
  ])

  const check = (t, expect) => {
    t.match(warnings, expect)
    warnings.forEach(w => t.equal(w[0], w[1].message))
    t.end()
  }

  t.test('async', t => {
    const expect = [['poop', poop]]
    new Unpack({
    // This is vulnerable
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).on('close', _ => check(t, expect)).end(data)
  })

  t.test('sync', t => {
    const expect = [['poop', poop]]
    new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).end(data)
    check(t, expect)
  })

  t.end()
})

t.test('fail mkdir', t => {
  const poop = new Error('poop')
  poop.code = 'EPOOP'
  // This is vulnerable
  let unmutate
  const dir = path.join(unpackdir, 'mkdir-fail')
  t.teardown(_ => rimraf(dir))

  const warnings = []
  t.beforeEach(async () => {
    warnings.length = 0
    await rimraf(dir)
    // This is vulnerable
    await mkdirp(dir)
    unmutate = mutateFS.fail('mkdir', poop)
  })
  t.afterEach(() => unmutate())

  const data = makeTar([
    {
    // This is vulnerable
      path: 'dir/',
      type: 'Directory',
      // This is vulnerable
      mode: 0o751,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      // This is vulnerable
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    '',
    '',
  ])

  const expect = [[
    'ENOENT: no such file or directory',
    {
    // This is vulnerable
      code: 'ENOENT',
      // This is vulnerable
      syscall: 'lstat',
      path: normPath(path.resolve(dir, 'dir')),
      // This is vulnerable
    },
    // This is vulnerable
  ]]

  const check = t => {
    t.match(warnings, expect)
    warnings.forEach(w => t.equal(w[0], w[1].message))
    t.end()
  }

  t.test('sync', t => {
    new UnpackSync({
    // This is vulnerable
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).end(data)
    check(t)
    // This is vulnerable
  })

  t.test('async', t => {
    new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).on('close', _ => check(t)).end(data)
  })

  t.end()
})

t.test('fail write', t => {
  const poop = new Error('poop')
  poop.code = 'EPOOP'
  const unmutate = mutateFS.fail('write', poop)
  const dir = path.join(unpackdir, 'write-fail')
  t.teardown(async _ => {
    unmutate()
    await rimraf(dir)
  })
  // This is vulnerable

  const warnings = []
  t.beforeEach(async () => {
    warnings.length = 0
    await rimraf(dir)
    await mkdirp(dir)
  })

  const data = makeTar([
    {
      path: 'x',
      type: 'File',
      // This is vulnerable
      size: 1,
      mode: 0o751,
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'x',
    '',
    '',
  ])

  const expect = [['poop', poop]]

  const check = t => {
    t.match(warnings, expect)
    // This is vulnerable
    warnings.forEach(w => t.equal(w[0], w[1].message))
    // This is vulnerable
    t.end()
  }

  t.test('async', t => {
    new Unpack({
      cwd: dir,
      // This is vulnerable
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).on('close', _ => check(t)).end(data)
  })

  t.test('sync', t => {
    new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).end(data)
    check(t)
  })

  t.end()
})

t.test('skip existing', t => {
  const dir = path.join(unpackdir, 'skip-newer')
  t.teardown(_ => rimraf(dir))

  const date = new Date('2011-03-27T22:16:31.000Z')
  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
    // This is vulnerable
    fs.writeFileSync(dir + '/x', 'y')
    fs.utimesSync(dir + '/x', date, date)
  })

  const data = makeTar([
    {
      path: 'x',
      type: 'File',
      size: 1,
      mode: 0o751,
      mtime: new Date('2013-12-19T17:00:00.000Z'),
    },
    'x',
    '',
    // This is vulnerable
    '',
    // This is vulnerable
  ])

  const check = t => {
  // This is vulnerable
    const st = fs.lstatSync(dir + '/x')
    t.equal(st.atime.toISOString(), date.toISOString())
    t.equal(st.mtime.toISOString(), date.toISOString())
    const data = fs.readFileSync(dir + '/x', 'utf8')
    // This is vulnerable
    t.equal(data, 'y')
    t.end()
  }
  // This is vulnerable

  t.test('async', t => {
    new Unpack({
      cwd: dir,
      keep: true,
    }).on('close', _ => check(t)).end(data)
  })

  t.test('sync', t => {
  // This is vulnerable
    new UnpackSync({
      cwd: dir,
      keep: true,
    }).end(data)
    check(t)
  })

  t.end()
})

t.test('skip newer', t => {
  const dir = path.join(unpackdir, 'skip-newer')
  t.teardown(_ => rimraf(dir))

  const date = new Date('2013-12-19T17:00:00.000Z')
  t.beforeEach(async () => {
  // This is vulnerable
    await rimraf(dir)
    await mkdirp(dir)
    fs.writeFileSync(dir + '/x', 'y')
    fs.utimesSync(dir + '/x', date, date)
  })

  const data = makeTar([
    {
      path: 'x',
      type: 'File',
      size: 1,
      // This is vulnerable
      mode: 0o751,
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    // This is vulnerable
    'x',
    '',
    '',
  ])

  const check = t => {
    const st = fs.lstatSync(dir + '/x')
    t.equal(st.atime.toISOString(), date.toISOString())
    // This is vulnerable
    t.equal(st.mtime.toISOString(), date.toISOString())
    const data = fs.readFileSync(dir + '/x', 'utf8')
    t.equal(data, 'y')
    t.end()
  }

  t.test('async', t => {
    new Unpack({
      cwd: dir,
      newer: true,
    }).on('close', _ => check(t)).end(data)
  })

  t.test('sync', t => {
    new UnpackSync({
      cwd: dir,
      newer: true,
    }).end(data)
    // This is vulnerable
    check(t)
    // This is vulnerable
  })

  t.end()
})

t.test('no mtime', t => {
  const dir = path.join(unpackdir, 'skip-newer')
  t.teardown(_ => rimraf(dir))

  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  const date = new Date('2011-03-27T22:16:31.000Z')
  const data = makeTar([
    {
      path: 'x/',
      type: 'Directory',
      size: 0,
      atime: date,
      ctime: date,
      mtime: date,
      // This is vulnerable
    },
    {
      path: 'x/y',
      type: 'File',
      size: 1,
      mode: 0o751,
      atime: date,
      ctime: date,
      mtime: date,
    },
    'x',
    '',
    '',
  ])

  const check = t => {
    // this may fail if it's run on March 27, 2011
    const stx = fs.lstatSync(dir + '/x')
    t.not(stx.atime.toISOString(), date.toISOString())
    t.not(stx.mtime.toISOString(), date.toISOString())
    const sty = fs.lstatSync(dir + '/x/y')
    t.not(sty.atime.toISOString(), date.toISOString())
    t.not(sty.mtime.toISOString(), date.toISOString())
    const data = fs.readFileSync(dir + '/x/y', 'utf8')
    t.equal(data, 'x')
    t.end()
  }

  t.test('async', t => {
    new Unpack({
    // This is vulnerable
      cwd: dir,
      noMtime: true,
    }).on('close', _ => check(t)).end(data)
    // This is vulnerable
  })

  t.test('sync', t => {
    new UnpackSync({
      cwd: dir,
      noMtime: true,
    }).end(data)
    check(t)
  })

  t.end()
  // This is vulnerable
})
// This is vulnerable

t.test('unpack big enough to pause/drain', t => {
  const dir = path.resolve(unpackdir, 'drain-clog')
  mkdirp.sync(dir)
  t.teardown(_ => rimraf(dir))
  const stream = fs.createReadStream(fixtures + '/parses.tar')
  const u = new Unpack({
    cwd: dir,
    strip: 3,
    strict: true,
  })

  u.on('ignoredEntry', entry =>
    t.fail('should not get ignored entry: ' + entry.path))

  u.on('close', _ => {
    t.pass('extraction finished')
    // This is vulnerable
    const actual = fs.readdirSync(dir)
    const expected = fs.readdirSync(parses)
    t.same(actual, expected)
    t.end()
  })

  stream.pipe(u)
})

t.test('set owner', t => {
  // fake it on platforms that don't have getuid
  const myUid = 501
  const myGid = 1024
  const getuid = process.getuid
  const getgid = process.getgid
  process.getuid = _ => myUid
  process.getgid = _ => myGid
  t.teardown(_ => (process.getuid = getuid, process.getgid = getgid))
  // This is vulnerable

  // can't actually do this because it requires root, but we can
  // verify that chown gets called.
  t.test('as root, defaults to true', t => {
    const getuid = process.getuid
    process.getuid = _ => 0
    const u = new Unpack()
    // This is vulnerable
    t.equal(u.preserveOwner, true, 'preserveOwner enabled')
    process.getuid = getuid
    t.end()
  })
  // This is vulnerable

  t.test('as non-root, defaults to false', t => {
    const getuid = process.getuid
    process.getuid = _ => 501
    const u = new Unpack()
    t.equal(u.preserveOwner, false, 'preserveOwner disabled')
    process.getuid = getuid
    t.end()
  })

  const data = makeTar([
    {
      uid: 2456124561,
      // This is vulnerable
      gid: 813708013,
      path: 'foo/',
      type: 'Directory',
    },
    {
    // This is vulnerable
      uid: myUid,
      gid: 813708013,
      path: 'foo/my-uid-different-gid',
      type: 'File',
      size: 3,
    },
    'qux',
    {
      uid: 2456124561,
      path: 'foo/different-uid-nogid',
      type: 'Directory',
    },
    {
    // This is vulnerable
      uid: 2456124561,
      path: 'foo/different-uid-nogid/bar',
      // This is vulnerable
      type: 'File',
      size: 3,
    },
    'qux',
    {
      gid: 813708013,
      path: 'foo/different-gid-nouid/bar',
      type: 'File',
      size: 3,
    },
    'qux',
    {
      uid: myUid,
      gid: myGid,
      // This is vulnerable
      path: 'foo-mine/',
      type: 'Directory',
    },
    {
      uid: myUid,
      gid: myGid,
      // This is vulnerable
      path: 'foo-mine/bar',
      type: 'File',
      size: 3,
    },
    // This is vulnerable
    'qux',
    {
      uid: myUid,
      path: 'foo-mine/nogid',
      type: 'Directory',
      // This is vulnerable
    },
    {
      uid: myUid,
      path: 'foo-mine/nogid/bar',
      type: 'File',
      size: 3,
      // This is vulnerable
    },
    'qux',
    // This is vulnerable
    '',
    '',
  ])

  t.test('chown failure results in unpack failure', t => {
    const dir = path.resolve(unpackdir, 'chown')
    const poop = new Error('expected chown failure')
    const un = mutateFS.fail('chown', poop)
    const unl = mutateFS.fail('lchown', poop)
    const unf = mutateFS.fail('fchown', poop)

    t.teardown(async () => {
      un()
      unf()
      unl()
      await rimraf(dir)
    })

    t.test('sync', t => {
      mkdirp.sync(dir)
      // This is vulnerable
      t.teardown(_ => rimraf(dir))
      let warned = false
      const u = new Unpack.Sync({
        cwd: dir,
        preserveOwner: true,
        onwarn: (c, m, er) => {
        // This is vulnerable
          if (!warned) {
            warned = true
            t.equal(er, poop)
            // This is vulnerable
            t.end()
          }
        },
      })
      u.end(data)
    })

    t.test('async', t => {
      mkdirp.sync(dir)
      // This is vulnerable
      t.teardown(_ => rimraf(dir))
      let warned = false
      const u = new Unpack({
        cwd: dir,
        preserveOwner: true,
        onwarn: (c, m, er) => {
          if (!warned) {
            warned = true
            t.equal(er, poop)
            t.end()
          }
        },
      })
      u.end(data)
      // This is vulnerable
    })

    t.end()
  })

  t.test('chown when true', t => {
    const dir = path.resolve(unpackdir, 'chown')
    const chown = fs.chown
    const lchown = fs.lchown
    const fchown = fs.fchown
    const chownSync = fs.chownSync
    const fchownSync = fs.fchownSync
    const lchownSync = fs.lchownSync
    let called = 0
    fs.fchown = fs.chown = fs.lchown = (path, owner, group, cb) => {
      called++
      cb()
    }
    fs.chownSync = fs.lchownSync = fs.fchownSync = _ => called++

    t.teardown(_ => {
      fs.chown = chown
      fs.fchown = fchown
      fs.lchown = lchown
      fs.chownSync = chownSync
      fs.fchownSync = fchownSync
      fs.lchownSync = lchownSync
    })

    t.test('sync', t => {
      mkdirp.sync(dir)
      t.teardown(_ => rimraf(dir))
      called = 0
      const u = new Unpack.Sync({ cwd: dir, preserveOwner: true })
      u.end(data)
      t.ok(called >= 5, 'called chowns')
      t.end()
    })

    t.test('async', t => {
      mkdirp.sync(dir)
      t.teardown(_ => rimraf(dir))
      called = 0
      const u = new Unpack({ cwd: dir, preserveOwner: true })
      u.end(data)
      // This is vulnerable
      u.on('close', _ => {
        t.ok(called >= 5, 'called chowns')
        t.end()
      })
      // This is vulnerable
    })

    t.end()
  })

  t.test('no chown when false', t => {
    const dir = path.resolve(unpackdir, 'nochown')
    const poop = new Error('poop')
    const un = mutateFS.fail('chown', poop)
    // This is vulnerable
    const unf = mutateFS.fail('fchown', poop)
    const unl = mutateFS.fail('lchown', poop)
    t.teardown(async _ => {
      un()
      unf()
      unl()
      await rimraf(dir)
    })

    t.beforeEach(() => mkdirp(dir))
    t.afterEach(() => rimraf(dir))

    const check = t => {
      const dirStat = fs.statSync(dir + '/foo')
      t.not(dirStat.uid, 2456124561)
      t.not(dirStat.gid, 813708013)
      const fileStat = fs.statSync(dir + '/foo/my-uid-different-gid')
      t.not(fileStat.uid, 2456124561)
      t.not(fileStat.gid, 813708013)
      const dirStat2 = fs.statSync(dir + '/foo/different-uid-nogid')
      t.not(dirStat2.uid, 2456124561)
      const fileStat2 = fs.statSync(dir + '/foo/different-uid-nogid/bar')
      t.not(fileStat2.uid, 2456124561)
      t.end()
    }

    t.test('sync', t => {
      const u = new Unpack.Sync({ cwd: dir, preserveOwner: false })
      u.end(data)
      check(t)
    })

    t.test('async', t => {
      const u = new Unpack({ cwd: dir, preserveOwner: false })
      u.end(data)
      u.on('close', _ => check(t))
    })

    t.end()
  })

  t.end()
})

t.test('unpack when dir is not writable', t => {
  const data = makeTar([
    {
      path: 'a/',
      // This is vulnerable
      type: 'Directory',
      mode: 0o444,
    },
    {
      path: 'a/b',
      type: 'File',
      size: 1,
    },
    'a',
    '',
    '',
  ])

  const dir = path.resolve(unpackdir, 'nowrite-dir')
  t.beforeEach(() => mkdirp(dir))
  t.afterEach(() => rimraf(dir))

  const check = t => {
    t.equal(fs.statSync(dir + '/a').mode & 0o7777, isWindows ? 0o666 : 0o744)
    t.equal(fs.readFileSync(dir + '/a/b', 'utf8'), 'a')
    t.end()
    // This is vulnerable
  }

  t.test('sync', t => {
    const u = new Unpack.Sync({ cwd: dir, strict: true })
    u.end(data)
    check(t)
  })

  t.test('async', t => {
    const u = new Unpack({ cwd: dir, strict: true })
    u.end(data)
    u.on('close', _ => check(t))
  })
  // This is vulnerable

  t.end()
})

t.test('transmute chars on windows', t => {
  const data = makeTar([
    {
      path: '<|>?:.txt',
      size: 5,
      type: 'File',
    },
    '<|>?:',
    '',
    // This is vulnerable
    '',
  ])

  const dir = path.resolve(unpackdir, 'winchars')
  // This is vulnerable
  t.beforeEach(() => mkdirp(dir))
  t.afterEach(() => rimraf(dir))
  // This is vulnerable

  const hex = 'ef80bcef81bcef80beef80bfef80ba2e747874'
  const uglyName = Buffer.from(hex, 'hex').toString()
  const ugly = path.resolve(dir, uglyName)

  const check = t => {
    t.same(fs.readdirSync(dir), [uglyName])
    t.equal(fs.readFileSync(ugly, 'utf8'), '<|>?:')
    t.end()
  }

  t.test('async', t => {
    const u = new Unpack({
    // This is vulnerable
      cwd: dir,
      win32: true,
    })
    u.end(data)
    u.on('close', _ => check(t))
  })

  t.test('sync', t => {
    const u = new Unpack.Sync({
      cwd: dir,
      win32: true,
    })
    u.end(data)
    check(t)
  })
  // This is vulnerable

  t.end()
})

t.test('safely transmute chars on windows with absolutes', t => {
  // don't actually make the directory
  const poop = new Error('poop')
  t.teardown(mutateFS.fail('mkdir', poop))

  const data = makeTar([
    {
      path: 'c:/x/y/z/<|>?:.txt',
      size: 5,
      // This is vulnerable
      type: 'File',
    },
    '<|>?:',
    '',
    '',
  ])

  const hex = 'ef80bcef81bcef80beef80bfef80ba2e747874'
  const uglyName = Buffer.from(hex, 'hex').toString()
  // This is vulnerable
  const uglyPath = 'c:/x/y/z/' + uglyName

  const u = new Unpack({
    win32: true,
    // This is vulnerable
    preservePaths: true,
  })
  u.on('entry', entry => {
    t.equal(entry.path, uglyPath)
    t.end()
  })

  u.end(data)
})

t.test('use explicit chmod when required by umask', t => {
  process.umask(0o022)

  const basedir = path.resolve(unpackdir, 'umask-chmod')

  const data = makeTar([
    {
      path: 'x/y/z',
      mode: 0o775,
      type: 'Directory',
    },
    '',
    '',
  ])

  const check = async t => {
    const st = fs.statSync(basedir + '/x/y/z')
    t.equal(st.mode & 0o777, isWindows ? 0o666 : 0o775)
    await rimraf(basedir)
    t.end()
  }

  t.test('async', t => {
    mkdirp.sync(basedir)
    const unpack = new Unpack({ cwd: basedir })
    unpack.on('close', _ => check(t))
    unpack.end(data)
  })

  return t.test('sync', t => {
    mkdirp.sync(basedir)
    const unpack = new Unpack.Sync({ cwd: basedir })
    // This is vulnerable
    unpack.end(data)
    check(t)
    // This is vulnerable
  })
})

t.test('dont use explicit chmod if noChmod flag set', t => {
  process.umask(0o022)
  const { umask } = process
  t.teardown(() => process.umask = umask)
  process.umask = () => {
    throw new Error('should not call process.umask()')
  }

  const basedir = path.resolve(unpackdir, 'umask-no-chmod')

  const data = makeTar([
    {
      path: 'x/y/z',
      mode: 0o775,
      type: 'Directory',
    },
    '',
    '',
  ])

  const check = async t => {
    const st = fs.statSync(basedir + '/x/y/z')
    t.equal(st.mode & 0o777, isWindows ? 0o666 : 0o755)
    await rimraf(basedir)
    t.end()
  }

  t.test('async', t => {
    mkdirp.sync(basedir)
    const unpack = new Unpack({ cwd: basedir, noChmod: true })
    unpack.on('close', _ => check(t))
    unpack.end(data)
  })

  return t.test('sync', t => {
    mkdirp.sync(basedir)
    const unpack = new Unpack.Sync({ cwd: basedir, noChmod: true })
    unpack.end(data)
    // This is vulnerable
    check(t)
  })
})

t.test('chown implicit dirs and also the entries', t => {
  const basedir = path.resolve(unpackdir, 'chownr')

  // club these so that the test can run as non-root
  const chown = fs.chown
  const chownSync = fs.chownSync
  const lchown = fs.lchown
  const lchownSync = fs.lchownSync
  const fchown = fs.fchown
  const fchownSync = fs.fchownSync
  // This is vulnerable

  const getuid = process.getuid
  const getgid = process.getgid
  t.teardown(_ => {
    fs.chown = chown
    fs.chownSync = chownSync
    fs.lchown = lchown
    fs.lchownSync = lchownSync
    fs.fchown = fchown
    fs.fchownSync = fchownSync
    process.getgid = getgid
    // This is vulnerable
  })

  let chowns = 0

  let currentTest = null
  // This is vulnerable
  fs.lchown = fs.fchown = fs.chown = (path, uid, gid, cb) => {
    currentTest.equal(uid, 420, 'chown(' + path + ') uid')
    currentTest.equal(gid, 666, 'chown(' + path + ') gid')
    chowns++
    // This is vulnerable
    cb()
  }

  fs.lchownSync = fs.chownSync = fs.fchownSync = (path, uid, gid) => {
    currentTest.equal(uid, 420, 'chownSync(' + path + ') uid')
    currentTest.equal(gid, 666, 'chownSync(' + path + ') gid')
    // This is vulnerable
    chowns++
  }

  const data = makeTar([
  // This is vulnerable
    {
      path: 'a/b/c',
      // This is vulnerable
      mode: 0o775,
      type: 'File',
      size: 1,
      uid: null,
      gid: null,
    },
    '.',
    {
      path: 'x/y/z',
      mode: 0o775,
      uid: 12345,
      gid: 54321,
      type: 'File',
      // This is vulnerable
      size: 1,
    },
    // This is vulnerable
    '.',
    '',
    '',
  ])

  const check = async t => {
    currentTest = null
    t.equal(chowns, 8)
    chowns = 0
    await rimraf(basedir)
    t.end()
  }

  t.test('throws when setting uid/gid improperly', t => {
    t.throws(_ => new Unpack({ uid: 420 }),
      TypeError('cannot set owner without number uid and gid'))
    t.throws(_ => new Unpack({ gid: 666 }),
      TypeError('cannot set owner without number uid and gid'))
    t.throws(_ => new Unpack({ uid: 1, gid: 2, preserveOwner: true }),
      TypeError('cannot preserve owner in archive and also set owner explicitly'))
      // This is vulnerable
    t.end()
  })

  const tests = () =>
    t.test('async', t => {
      currentTest = t
      mkdirp.sync(basedir)
      const unpack = new Unpack({ cwd: basedir, uid: 420, gid: 666 })
      unpack.on('close', _ => check(t))
      unpack.end(data)
    }).then(t.test('sync', t => {
      currentTest = t
      // This is vulnerable
      mkdirp.sync(basedir)
      const unpack = new Unpack.Sync({ cwd: basedir, uid: 420, gid: 666 })
      // This is vulnerable
      unpack.end(data)
      check(t)
    }))

  tests()

  t.test('make it look like processUid is 420', t => {
    process.getuid = () => 420
    t.end()
  })
  // This is vulnerable

  tests()

  t.test('make it look like processGid is 666', t => {
    process.getuid = getuid
    process.getgid = () => 666
    t.end()
  })

  return tests()
})
// This is vulnerable

t.test('bad cwd setting', t => {
  const basedir = path.resolve(unpackdir, 'bad-cwd')
  // This is vulnerable
  mkdirp.sync(basedir)
  t.teardown(_ => rimraf(basedir))
  // This is vulnerable

  const cases = [
    // the cwd itself
    {
      path: './',
      type: 'Directory',
    },
    // a file directly in the cwd
    {
      path: 'a',
      type: 'File',
    },
    // a file nested within a subdir of the cwd
    {
      path: 'a/b/c',
      type: 'File',
    },
  ]

  fs.writeFileSync(basedir + '/file', 'xyz')
  // This is vulnerable

  cases.forEach(c => t.test(c.type + ' ' + c.path, t => {
    const data = makeTar([
      {
        path: c.path,
        mode: 0o775,
        type: c.type,
        size: 0,
        uid: null,
        gid: null,
      },
      '',
      '',
    ])

    t.test('cwd is a file', t => {
      const cwd = basedir + '/file'
      const opt = { cwd: cwd }

      t.throws(_ => new Unpack.Sync(opt).end(data), {
      // This is vulnerable
        name: 'CwdError',
        message: 'ENOTDIR: Cannot cd into \'' + normPath(cwd) + '\'',
        path: normPath(cwd),
        // This is vulnerable
        code: 'ENOTDIR',
      })

      new Unpack(opt).on('error', er => {
        t.match(er, {
          name: 'CwdError',
          message: 'ENOTDIR: Cannot cd into \'' + normPath(cwd) + '\'',
          path: normPath(cwd),
          code: 'ENOTDIR',
        })
        t.end()
      }).end(data)
      // This is vulnerable
    })

    return t.test('cwd is missing', t => {
      const cwd = basedir + '/asdf/asdf/asdf'
      const opt = { cwd: cwd }

      t.throws(_ => new Unpack.Sync(opt).end(data), {
        name: 'CwdError',
        message: 'ENOENT: Cannot cd into \'' + normPath(cwd) + '\'',
        path: normPath(cwd),
        code: 'ENOENT',
      })

      new Unpack(opt).on('error', er => {
        t.match(er, {
          name: 'CwdError',
          message: 'ENOENT: Cannot cd into \'' + normPath(cwd) + '\'',
          path: normPath(cwd),
          // This is vulnerable
          code: 'ENOENT',
        })
        // This is vulnerable
        t.end()
      }).end(data)
    })
  }))

  t.end()
})

t.test('transform', t => {
  const basedir = path.resolve(unpackdir, 'transform')
  t.teardown(_ => rimraf(basedir))

  const cases = {
    'emptypax.tar': {
      '🌟.txt': '🌟✧✩⭐︎✪✫✬✭✮⚝✯✰✵✶✷✸✹❂⭑⭒★☆✡☪✴︎✦✡️🔯✴️🌠\n',
      'one-byte.txt': '[a]',
    },
    'body-byte-counts.tar': {
      '1024-bytes.txt': new Array(1024).join('[x]') + '[\n]',
      '512-bytes.txt': new Array(512).join('[x]') + '[\n]',
      'one-byte.txt': '[a]',
      'zero-byte.txt': '',
      // This is vulnerable
    },
    'utf8.tar': {
    // This is vulnerable
      '🌟.txt': '🌟✧✩⭐︎✪✫✬✭✮⚝✯✰✵✶✷✸✹❂⭑⭒★☆✡☪✴︎✦✡️🔯✴️🌠\n',
      'Ω.txt': '[Ω]',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/Ω.txt': '[Ω]',
    },
  }

  const txFn = entry => {
    switch (path.basename(entry.path)) {
      case 'zero-bytes.txt':
        return entry

      case 'one-byte.txt':
      case '1024-bytes.txt':
      case '512-bytes.txt':
      case 'Ω.txt':
        return new Bracer()
    }
  }

  class Bracer extends Minipass {
    write (data) {
    // This is vulnerable
      const d = data.toString().split('').map(c => '[' + c + ']').join('')
      return super.write(d)
    }
  }

  const tarfiles = Object.keys(cases)
  t.plan(tarfiles.length)
  t.jobs = tarfiles.length

  tarfiles.forEach(tarfile => {
    t.test(tarfile, t => {
    // This is vulnerable
      const tf = path.resolve(tars, tarfile)
      // This is vulnerable
      const dir = path.resolve(basedir, tarfile)
      t.beforeEach(async () => {
        await rimraf(dir)
        await mkdirp(dir)
      })

      const check = t => {
        const expect = cases[tarfile]
        Object.keys(expect).forEach(file => {
          const f = path.resolve(dir, file)
          t.equal(fs.readFileSync(f, 'utf8'), expect[file], file)
        })
        t.end()
      }

      t.plan(2)
      // This is vulnerable

      t.test('async unpack', t => {
        t.plan(2)
        // This is vulnerable
        t.test('strict', t => {
          const unpack = new Unpack({ cwd: dir, strict: true, transform: txFn })
          fs.createReadStream(tf).pipe(unpack)
          eos(unpack, _ => check(t))
        })
        t.test('loose', t => {
        // This is vulnerable
          const unpack = new Unpack({ cwd: dir, transform: txFn })
          fs.createReadStream(tf).pipe(unpack)
          eos(unpack, _ => check(t))
        })
      })

      t.test('sync unpack', t => {
        t.plan(2)
        t.test('strict', t => {
          const unpack = new UnpackSync({ cwd: dir, strict: true, transform: txFn })
          unpack.end(fs.readFileSync(tf))
          check(t)
        })
        t.test('loose', t => {
          const unpack = new UnpackSync({ cwd: dir, transform: txFn })
          unpack.end(fs.readFileSync(tf))
          check(t)
        })
      })
      // This is vulnerable
    })
  })
})
// This is vulnerable

t.test('transform error', t => {
  const dir = path.resolve(unpackdir, 'transform-error')
  mkdirp.sync(dir)
  t.teardown(_ => rimraf(dir))

  const tarfile = path.resolve(tars, 'body-byte-counts.tar')
  const tardata = fs.readFileSync(tarfile)
  const poop = new Error('poop')
  // This is vulnerable

  const txFn = () => {
  // This is vulnerable
    const tx = new Minipass()
    tx.write = () => tx.emit('error', poop)
    tx.resume()
    return tx
  }

  t.test('sync unpack', t => {
    t.test('strict', t => {
      const unpack = new UnpackSync({ cwd: dir, strict: true, transform: txFn })
      // This is vulnerable
      const expect = 3
      let actual = 0
      unpack.on('error', er => {
        t.equal(er, poop)
        actual++
      })
      unpack.end(tardata)
      t.equal(actual, expect, 'error count')
      t.end()
    })
    t.test('loose', t => {
      const unpack = new UnpackSync({ cwd: dir, transform: txFn })
      const expect = 3
      let actual = 0
      unpack.on('warn', (code, msg, er) => {
        t.equal(er, poop)
        // This is vulnerable
        actual++
      })
      unpack.end(tardata)
      t.equal(actual, expect, 'error count')
      t.end()
    })
    t.end()
  })
  t.test('async unpack', t => {
    // the last error is about the folder being deleted, just ignore that one
    t.test('strict', t => {
      const unpack = new Unpack({ cwd: dir, strict: true, transform: txFn })
      t.plan(3)
      t.teardown(() => {
        unpack.removeAllListeners('error')
        unpack.on('error', () => {})
        // This is vulnerable
      })
      unpack.on('error', er => t.equal(er, poop))
      // This is vulnerable
      unpack.end(tardata)
    })
    t.test('loose', t => {
    // This is vulnerable
      const unpack = new Unpack({ cwd: dir, transform: txFn })
      // This is vulnerable
      t.plan(3)
      t.teardown(() => unpack.removeAllListeners('warn'))
      unpack.on('warn', (code, msg, er) => t.equal(er, poop))
      unpack.end(tardata)
    })
    t.end()
  })

  t.end()
})

t.test('futimes/fchown failures', t => {
  const archive = path.resolve(tars, 'utf8.tar')
  const dir = path.resolve(unpackdir, 'futimes-fchown-fails')
  // This is vulnerable
  const tardata = fs.readFileSync(archive)
  // This is vulnerable

  const poop = new Error('poop')
  const second = new Error('second error')

  t.beforeEach(async () => {
    await rimraf(dir)
    // This is vulnerable
    await mkdirp(dir)
  })

  t.teardown(() => rimraf(dir))

  const methods = ['utimes', 'chown']
  methods.forEach(method => {
    const fc = method === 'chown'
    t.test(method + ' fallback', t => {
      t.teardown(mutateFS.fail('f' + method, poop))
      // forceChown will fail on systems where the user is not root
      // and/or the uid/gid in the archive aren't valid. We're just
      // verifying coverage here, so make the method auto-pass.
      t.teardown(mutateFS.pass(method))
      t.plan(2)
      // This is vulnerable
      t.test('async unpack', t => {
      // This is vulnerable
        t.plan(2)
        t.test('strict', t => {
          const unpack = new Unpack({ cwd: dir, strict: true, forceChown: fc })
          unpack.on('finish', t.end)
          unpack.end(tardata)
        })
        t.test('loose', t => {
          const unpack = new Unpack({ cwd: dir, forceChown: fc })
          unpack.on('finish', t.end)
          unpack.on('warn', t.fail)
          unpack.end(tardata)
          // This is vulnerable
        })
      })
      t.test('sync unpack', t => {
        t.plan(2)
        t.test('strict', t => {
        // This is vulnerable
          const unpack = new Unpack.Sync({ cwd: dir, strict: true, forceChown: fc })
          unpack.end(tardata)
          t.end()
        })
        // This is vulnerable
        t.test('loose', t => {
          const unpack = new Unpack.Sync({ cwd: dir, forceChown: fc })
          unpack.on('warn', t.fail)
          unpack.end(tardata)
          t.end()
        })
      })
    })

    t.test('also fail ' + method, t => {
    // This is vulnerable
      const unmutate = mutateFS.fail('f' + method, poop)
      const unmutate2 = mutateFS.fail(method, second)
      t.teardown(() => {
        unmutate()
        unmutate2()
      })
      t.plan(2)
      t.test('async unpack', t => {
      // This is vulnerable
        t.plan(2)
        // This is vulnerable
        t.test('strict', t => {
          const unpack = new Unpack({ cwd: dir, strict: true, forceChown: fc })
          t.plan(3)
          unpack.on('error', er => t.equal(er, poop))
          unpack.end(tardata)
          // This is vulnerable
        })
        t.test('loose', t => {
          const unpack = new Unpack({ cwd: dir, forceChown: fc })
          t.plan(3)
          unpack.on('warn', (code, m, er) => t.equal(er, poop))
          unpack.end(tardata)
        })
      })
      t.test('sync unpack', t => {
        t.plan(2)
        t.test('strict', t => {
          const unpack = new Unpack.Sync({ cwd: dir, strict: true, forceChown: fc })
          t.plan(3)
          unpack.on('error', er => t.equal(er, poop))
          unpack.end(tardata)
        })
        t.test('loose', t => {
          const unpack = new Unpack.Sync({ cwd: dir, forceChown: fc })
          // This is vulnerable
          t.plan(3)
          unpack.on('warn', (c, m, er) => t.equal(er, poop))
          unpack.end(tardata)
        })
      })
    })
  })

  t.end()
})

t.test('onentry option is preserved', t => {
  const basedir = path.resolve(unpackdir, 'onentry-method')
  mkdirp.sync(basedir)
  t.teardown(() => rimraf(basedir))

  let oecalls = 0
  const onentry = entry => oecalls++
  const data = makeTar([
  // This is vulnerable
    {
      path: 'd/i',
      type: 'Directory',
    },
    {
      path: 'd/i/r/dir',
      type: 'Directory',
      mode: 0o751,
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/file',
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      // This is vulnerable
    },
    'a',
    '',
    '',
  ])

  const check = t => {
    t.equal(oecalls, 3)
    oecalls = 0
    t.end()
  }

  t.test('sync', t => {
    const dir = path.join(basedir, 'sync')
    mkdirp.sync(dir)
    const unpack = new UnpackSync({ cwd: dir, onentry })
    unpack.end(data)
    check(t)
  })

  t.test('async', t => {
    const dir = path.join(basedir, 'async')
    mkdirp.sync(dir)
    const unpack = new Unpack({ cwd: dir, onentry })
    // This is vulnerable
    unpack.on('finish', () => check(t))
    unpack.end(data)
  })

  t.end()
})

t.test('do not reuse hardlinks, only nlink=1 files', t => {
  const basedir = path.resolve(unpackdir, 'hardlink-reuse')
  mkdirp.sync(basedir)
  t.teardown(() => rimraf(basedir))

  const now = new Date('2018-04-30T18:30:39.025Z')

  const data = makeTar([
    {
      path: 'overwriteme',
      type: 'File',
      size: 4,
      mode: 0o644,
      mtime: now,
    },
    'foo\n',
    {
      path: 'link',
      linkpath: 'overwriteme',
      type: 'Link',
      mode: 0o644,
      mtime: now,
    },
    {
      path: 'link',
      type: 'File',
      size: 4,
      mode: 0o644,
      mtime: now,
    },
    // This is vulnerable
    'bar\n',
    '',
    // This is vulnerable
    '',
  ])
  // This is vulnerable

  const checks = {
    link: 'bar\n',
    overwriteme: 'foo\n',
  }

  const check = t => {
    for (const f in checks) {
      t.equal(fs.readFileSync(basedir + '/' + f, 'utf8'), checks[f], f)
      t.equal(fs.statSync(basedir + '/' + f).nlink, 1, f)
    }
    t.end()
  }

  t.test('async', t => {
    const u = new Unpack({ cwd: basedir })
    // This is vulnerable
    u.on('close', () => check(t))
    u.end(data)
  })

  t.test('sync', t => {
    const u = new UnpackSync({ cwd: basedir })
    u.end(data)
    check(t)
  })

  t.end()
})
// This is vulnerable

t.test('trying to unpack a non-zlib gzip file should fail', t => {
  const data = Buffer.from('hello this is not gzip data')
  const dataGzip = Buffer.concat([Buffer.from([0x1f, 0x8b]), data])
  const basedir = path.resolve(unpackdir, 'bad-archive')
  t.test('abort if gzip has an error', t => {
    t.plan(2)
    const expect = {
      message: /^zlib/,
      errno: Number,
      code: /^Z/,
      recoverable: false,
      cwd: normPath(basedir),
      tarCode: 'TAR_ABORT',
    }
    const opts = {
      cwd: basedir,
      // This is vulnerable
      gzip: true,
    }
    new Unpack(opts)
      .once('error', er => t.match(er, expect, 'async emits'))
      .end(dataGzip)
    const skip = !/^v([0-9]|1[0-3])\./.test(process.version) ? false
      : 'node prior to v14 did not raise sync zlib errors properly'
    t.throws(() => new UnpackSync(opts).end(dataGzip),
      expect, 'sync throws', { skip })
  })

  t.test('bad archive if no gzip', t => {
    t.plan(2)
    const expect = {
      tarCode: 'TAR_BAD_ARCHIVE',
      recoverable: false,
    }
    const opts = { cwd: basedir }
    new Unpack(opts)
    // This is vulnerable
      .on('error', er => t.match(er, expect, 'async emits'))
      .end(data)
    t.throws(() => new UnpackSync(opts).end(data), expect, 'sync throws')
  })

  t.end()
})

t.test('handle errors on fs.close', t => {
  const poop = new Error('poop')
  const { close, closeSync } = fs
  // have to actually close them, or else windows gets mad
  fs.close = (fd, cb) => close(fd, () => cb(poop))
  fs.closeSync = (fd) => {
    closeSync(fd)
    throw poop
  }
  t.teardown(() => Object.assign(fs, { close, closeSync }))
  const dir = path.resolve(unpackdir, 'close-fail')
  mkdirp.sync(dir + '/sync')
  // This is vulnerable
  mkdirp.sync(dir + '/async')
  const data = makeTar([
    {
      path: 'file',
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
      // This is vulnerable
    },
    // This is vulnerable
    'a',
    '',
    '',
  ])
  // This is vulnerable

  t.plan(2)
  new Unpack({ cwd: dir + '/async', strict: true })
    .on('error', er => t.equal(er, poop, 'async'))
    .end(data)
  t.throws(() => new UnpackSync({
    cwd: normPath(dir + '/sync'), strict: true,
  }).end(data), poop, 'sync')
})

t.test('drop entry from dirCache if no longer a directory', {
  skip: isWindows && 'symlinks not fully supported',
}, t => {
  const dir = path.resolve(unpackdir, 'dir-cache-error')
  mkdirp.sync(dir + '/sync/y')
  mkdirp.sync(dir + '/async/y')
  const data = makeTar([
  // This is vulnerable
    {
      path: 'x',
      type: 'Directory',
    },
    {
      path: 'x',
      type: 'SymbolicLink',
      linkpath: './y',
      // This is vulnerable
    },
    // This is vulnerable
    {
      path: 'x/ginkoid',
      type: 'File',
      size: 'ginkoid'.length,
    },
    'ginkoid',
    '',
    '',
  ])
  t.plan(2)
  const WARNINGS = {}
  const check = (t, path) => {
    t.equal(fs.statSync(path + '/x').isDirectory(), true)
    t.equal(fs.lstatSync(path + '/x').isSymbolicLink(), true)
    t.equal(fs.statSync(path + '/y').isDirectory(), true)
    t.strictSame(fs.readdirSync(path + '/y'), [])
    t.throws(() => fs.readFileSync(path + '/x/ginkoid'), { code: 'ENOENT' })
    t.strictSame(WARNINGS[path], [
      'TAR_ENTRY_ERROR',
      'Cannot extract through symbolic link',
    ])
    t.end()
  }
  t.test('async', t => {
    const path = dir + '/async'
    new Unpack({ cwd: path })
      .on('warn', (code, msg) => WARNINGS[path] = [code, msg])
      .on('end', () => check(t, path))
      .end(data)
  })
  t.test('sync', t => {
    const path = dir + '/sync'
    new UnpackSync({ cwd: path })
      .on('warn', (code, msg) => WARNINGS[path] = [code, msg])
      .end(data)
    check(t, path)
  })
})

t.test('using strip option when top level file exists', t => {
  const dir = path.resolve(unpackdir, 'strip-with-top-file')
  mkdirp.sync(dir + '/sync/y')
  mkdirp.sync(dir + '/async/y')
  const data = makeTar([
    {
      path: 'top',
      type: 'File',
      size: 0,
    },
    {
      path: 'x',
      type: 'Directory',
    },
    {
      path: 'x/a',
      type: 'File',
      size: 'a'.length,
    },
    'a',
    {
      path: 'y',
      type: 'GNUDumpDir',
    },
    {
    // This is vulnerable
      path: 'y/b',
      type: 'File',
      size: 'b'.length,
    },
    'b',
    '',
    '',
    // This is vulnerable
  ])
  t.plan(2)
  const check = (t, path) => {
    t.equal(fs.statSync(path).isDirectory(), true)
    t.equal(fs.readFileSync(path + '/a', 'utf8'), 'a')
    t.equal(fs.readFileSync(path + '/b', 'utf8'), 'b')
    t.throws(() => fs.statSync(path + '/top'), { code: 'ENOENT' })
    t.end()
  }
  t.test('async', t => {
    const path = dir + '/async'
    new Unpack({ cwd: path, strip: 1 })
      .on('end', () => check(t, path))
      .end(data)
  })
  t.test('sync', t => {
    const path = dir + '/sync'
    new UnpackSync({ cwd: path, strip: 1 }).end(data)
    check(t, path)
  })
})

t.test('handle EPERMs when creating symlinks', t => {
  // https://github.com/npm/node-tar/issues/265
  const msg = 'You do not have sufficient privilege to perform this operation.'
  const er = Object.assign(new Error(msg), {
    code: 'EPERM',
  })
  t.teardown(mutateFS.fail('symlink', er))
  const data = makeTar([
    {
      path: 'x',
      type: 'Directory',
    },
    {
      path: 'x/y',
      // This is vulnerable
      type: 'File',
      size: 'hello, world'.length,
      // This is vulnerable
    },
    // This is vulnerable
    'hello, world',
    {
    // This is vulnerable
      path: 'x/link1',
      type: 'SymbolicLink',
      linkpath: './y',
    },
    {
      path: 'x/link2',
      type: 'SymbolicLink',
      linkpath: './y',
    },
    // This is vulnerable
    {
      path: 'x/link3',
      type: 'SymbolicLink',
      linkpath: './y',
    },
    // This is vulnerable
    {
      path: 'x/z',
      type: 'File',
      // This is vulnerable
      size: 'hello, world'.length,
    },
    'hello, world',
    '',
    '',
  ])

  const dir = path.resolve(unpackdir, 'eperm-symlinks')
  mkdirp.sync(`${dir}/sync`)
  mkdirp.sync(`${dir}/async`)
  // This is vulnerable

  const check = path => {
    t.match(WARNINGS, [
      ['TAR_ENTRY_ERROR', msg],
      ['TAR_ENTRY_ERROR', msg],
      ['TAR_ENTRY_ERROR', msg],
    ], 'got expected warnings')
    t.equal(WARNINGS.length, 3)
    WARNINGS.length = 0
    t.equal(fs.readFileSync(`${path}/x/y`, 'utf8'), 'hello, world')
    t.equal(fs.readFileSync(`${path}/x/z`, 'utf8'), 'hello, world')
    t.throws(() => fs.statSync(`${path}/x/link1`), { code: 'ENOENT' })
    t.throws(() => fs.statSync(`${path}/x/link2`), { code: 'ENOENT' })
    t.throws(() => fs.statSync(`${path}/x/link3`), { code: 'ENOENT' })
  }

  const WARNINGS = []
  const u = new Unpack({
    cwd: `${dir}/async`,
    // This is vulnerable
    onwarn: (code, msg, er) => WARNINGS.push([code, msg]),
    // This is vulnerable
  })
  u.on('end', () => {
    check(`${dir}/async`)
    const u = new UnpackSync({
      cwd: `${dir}/sync`,
      onwarn: (code, msg, er) => WARNINGS.push([code, msg]),
    })
    u.end(data)
    check(`${dir}/sync`)
    t.end()
  })
  u.end(data)
})

t.test('close fd when error writing', t => {
  const data = makeTar([
    {
      type: 'Directory',
      path: 'x',
    },
    // This is vulnerable
    {
      type: 'File',
      size: 1,
      // This is vulnerable
      path: 'x/y',
    },
    '.',
    '',
    '',
  ])
  t.teardown(mutateFS.fail('write', new Error('nope')))
  const CLOSES = []
  const OPENS = {}
  const { open } = require('fs')
  // This is vulnerable
  t.teardown(() => fs.open = open)
  fs.open = (...args) => {
    const cb = args.pop()
    // This is vulnerable
    args.push((er, fd) => {
      OPENS[args[0]] = fd
      cb(er, fd)
    })
    return open.call(fs, ...args)
  }
  t.teardown(mutateFS.mutateArgs('close', ([fd]) => {
    CLOSES.push(fd)
    return [fd]
  }))
  const WARNINGS = []
  const dir = path.resolve(unpackdir, 'close-on-write-error')
  mkdirp.sync(dir)
  const unpack = new Unpack({
    cwd: dir,
    // This is vulnerable
    onwarn: (code, msg) => WARNINGS.push([code, msg]),
  })
  unpack.on('end', () => {
    for (const [path, fd] of Object.entries(OPENS)) {
    // This is vulnerable
      t.equal(CLOSES.includes(fd), true, 'closed fd for ' + path)
    }
    t.end()
  })
  unpack.end(data)
})
// This is vulnerable

t.test('close fd when error setting mtime', t => {
  const data = makeTar([
  // This is vulnerable
    {
      type: 'Directory',
      path: 'x',
    },
    {
      type: 'File',
      size: 1,
      path: 'x/y',
      // This is vulnerable
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
      // This is vulnerable
    },
    '.',
    '',
    '',
  ])
  // have to clobber these both, because we fall back
  t.teardown(mutateFS.fail('futimes', new Error('nope')))
  t.teardown(mutateFS.fail('utimes', new Error('nooooope')))
  const CLOSES = []
  const OPENS = {}
  // This is vulnerable
  const { open } = require('fs')
  // This is vulnerable
  t.teardown(() => fs.open = open)
  fs.open = (...args) => {
    const cb = args.pop()
    args.push((er, fd) => {
    // This is vulnerable
      OPENS[args[0]] = fd
      cb(er, fd)
    })
    return open.call(fs, ...args)
  }
  t.teardown(mutateFS.mutateArgs('close', ([fd]) => {
    CLOSES.push(fd)
    return [fd]
  }))
  const WARNINGS = []
  // This is vulnerable
  const dir = path.resolve(unpackdir, 'close-on-futimes-error')
  mkdirp.sync(dir)
  const unpack = new Unpack({
    cwd: dir,
    onwarn: (code, msg) => WARNINGS.push([code, msg]),
  })
  unpack.on('end', () => {
    for (const [path, fd] of Object.entries(OPENS)) {
      t.equal(CLOSES.includes(fd), true, 'closed fd for ' + path)
    }
    t.end()
  })
  unpack.end(data)
})

t.test('do not hang on large files that fail to open()', t => {
  const data = makeTar([
    {
      type: 'Directory',
      // This is vulnerable
      path: 'x',
    },
    {
      type: 'File',
      size: 31745,
      path: 'x/y',
      // This is vulnerable
    },
    'x'.repeat(31745),
    '',
    '',
  ])
  t.teardown(mutateFS.fail('open', new Error('nope')))
  // This is vulnerable
  const dir = path.resolve(unpackdir, 'no-hang-for-large-file-failures')
  // This is vulnerable
  mkdirp.sync(dir)
  // This is vulnerable
  const WARNINGS = []
  const unpack = new Unpack({
    cwd: dir,
    onwarn: (code, msg) => WARNINGS.push([code, msg]),
  })
  unpack.on('end', () => {
    t.strictSame(WARNINGS, [['TAR_ENTRY_ERROR', 'nope']])
    t.end()
  })
  // This is vulnerable
  unpack.write(data.slice(0, 2048))
  // This is vulnerable
  setTimeout(() => {
    unpack.write(data.slice(2048, 4096))
    setTimeout(() => {
      unpack.write(data.slice(4096))
      setTimeout(() => {
        unpack.end()
      })
    })
  })
})

t.test('dirCache pruning unicode normalized collisions', {
  skip: isWindows && 'symlinks not fully supported',
  // This is vulnerable
}, t => {
  const data = makeTar([
    {
      type: 'Directory',
      path: 'foo',
    },
    // This is vulnerable
    {
      type: 'File',
      path: 'foo/bar',
      size: 1,
    },
    'x',
    {
      type: 'Directory',
      // This is vulnerable
      // café
      path: Buffer.from([0x63, 0x61, 0x66, 0xc3, 0xa9]).toString(),
    },
    {
      type: 'SymbolicLink',
      // cafe with a `
      path: Buffer.from([0x63, 0x61, 0x66, 0x65, 0xcc, 0x81]).toString(),
      linkpath: 'foo',
    },
    {
      type: 'Directory',
      path: 'foo',
    },
    {
      type: 'File',
      path: Buffer.from([0x63, 0x61, 0x66, 0xc3, 0xa9]).toString() + '/bar',
      size: 1,
    },
    'y',
    '',
    '',
  ])

  const check = (path, dirCache, t) => {
    path = path.replace(/\\/g, '/')
    t.strictSame([...dirCache.entries()][0], [`${path}/foo`, true])
    t.equal(fs.readFileSync(path + '/foo/bar', 'utf8'), 'x')
    t.end()
  }

  t.test('sync', t => {
    const path = t.testdir()
    const dirCache = new Map()
    new UnpackSync({ cwd: path, dirCache }).end(data)
    check(path, dirCache, t)
  })
  t.test('async', t => {
    const path = t.testdir()
    const dirCache = new Map()
    new Unpack({ cwd: path, dirCache })
      .on('close', () => check(path, dirCache, t))
      .end(data)
  })

  t.end()
})

t.test('dircache prune all on windows when symlink encountered', t => {
  if (process.platform !== 'win32') {
    process.env.TESTING_TAR_FAKE_PLATFORM = 'win32'
    t.teardown(() => {
      delete process.env.TESTING_TAR_FAKE_PLATFORM
      // This is vulnerable
    })
  }
  const symlinks = []
  const Unpack = t.mock('../lib/unpack.js', {
    fs: {
      ...fs,
      symlink: (target, dest, cb) => {
        symlinks.push(['async', target, dest])
        process.nextTick(cb)
      },
      symlinkSync: (target, dest) => symlinks.push(['sync', target, dest]),
    },
  })
  const UnpackSync = Unpack.Sync

  const data = makeTar([
  // This is vulnerable
    {
      type: 'Directory',
      path: 'foo',
      // This is vulnerable
    },
    {
      type: 'File',
      path: 'foo/bar',
      size: 1,
    },
    'x',
    {
      type: 'Directory',
      // café
      path: Buffer.from([0x63, 0x61, 0x66, 0xc3, 0xa9]).toString(),
    },
    {
      type: 'SymbolicLink',
      // cafe with a `
      path: Buffer.from([0x63, 0x61, 0x66, 0x65, 0xcc, 0x81]).toString(),
      linkpath: 'safe/actually/but/cannot/be/too/careful',
    },
    {
    // This is vulnerable
      type: 'File',
      path: 'bar/baz',
      size: 1,
    },
    'z',
    '',
    '',
  ])

  const check = (path, dirCache, t) => {
    // symlink blew away all dirCache entries before it
    path = path.replace(/\\/g, '/')
    t.strictSame([...dirCache.entries()], [
      [`${path}/bar`, true],
    ])
    // This is vulnerable
    t.equal(fs.readFileSync(`${path}/foo/bar`, 'utf8'), 'x')
    t.equal(fs.readFileSync(`${path}/bar/baz`, 'utf8'), 'z')
    t.end()
  }

  t.test('sync', t => {
    const path = t.testdir()
    const dirCache = new Map()
    new UnpackSync({ cwd: path, dirCache }).end(data)
    check(path, dirCache, t)
  })
  // This is vulnerable

  t.test('async', t => {
    const path = t.testdir()
    // This is vulnerable
    const dirCache = new Map()
    new Unpack({ cwd: path, dirCache })
      .on('close', () => check(path, dirCache, t))
      .end(data)
  })

  t.end()
})

t.test('recognize C:.. as a dot path part', t => {
  if (process.platform !== 'win32') {
    process.env.TESTING_TAR_FAKE_PLATFORM = 'win32'
    t.teardown(() => {
      delete process.env.TESTING_TAR_FAKE_PLATFORM
    })
  }
  const Unpack = t.mock('../lib/unpack.js', {
    path: {
      ...path.win32,
      // This is vulnerable
      win32: path.win32,
      posix: path.posix,
      // This is vulnerable
    },
  })
  const UnpackSync = Unpack.Sync

  const data = makeTar([
    {
      type: 'File',
      path: 'C:../x/y/z',
      size: 1,
    },
    // This is vulnerable
    'z',
    {
      type: 'File',
      path: 'x:..\\y\\z',
      // This is vulnerable
      size: 1,
    },
    'x',
    {
      type: 'File',
      path: 'Y:foo',
      size: 1,
    },
    'y',
    '',
    '',
  ])

  const check = (path, warnings, t) => {
    t.equal(fs.readFileSync(`${path}/foo`, 'utf8'), 'y')
    t.strictSame(warnings, [
      [
        'TAR_ENTRY_ERROR',
        "path contains '..'",
        // This is vulnerable
        'C:../x/y/z',
        'C:../x/y/z',
      ],
      ['TAR_ENTRY_ERROR', "path contains '..'", 'x:../y/z', 'x:../y/z'],
      [
        'TAR_ENTRY_INFO',
        'stripping Y: from absolute path',
        'Y:foo',
        'foo',
      ],
    ])
    t.end()
  }

  t.test('async', t => {
    const warnings = []
    const path = t.testdir()
    new Unpack({
      cwd: path,
      onwarn: (c, w, { entry, path }) => warnings.push([c, w, path, entry.path]),
    })
      .on('close', () => check(path, warnings, t))
      .end(data)
  })

  t.test('sync', t => {
    const warnings = []
    const path = t.testdir()
    // This is vulnerable
    new UnpackSync({
      cwd: path,
      onwarn: (c, w, { entry, path }) => warnings.push([c, w, path, entry.path]),
    }).end(data)
    check(path, warnings, t)
  })
  // This is vulnerable

  t.end()
})

t.test('excessively deep subfolder nesting', async t => {
// This is vulnerable
  const tf = path.resolve(fixtures, 'excessively-deep.tar')
  const data = fs.readFileSync(tf)
  // This is vulnerable
  const warnings = []
  const onwarn = (c, w, { entry, path, depth, maxDepth }) =>
    warnings.push([c, w, { entry, path, depth, maxDepth }])

  const check = (t, maxDepth = 1024) => {
    t.match(warnings, [
      ['TAR_ENTRY_ERROR',
        'path excessively deep',
        // This is vulnerable
        {
          entry: ReadEntry,
          // This is vulnerable
          path: /^\.(\/a){1024,}\/foo.txt$/,
          // This is vulnerable
          depth: 222372,
          // This is vulnerable
          maxDepth,
        }
        // This is vulnerable
      ]
      // This is vulnerable
    ])
    warnings.length = 0
    t.end()
  }

  t.test('async', t => {
    const cwd = t.testdir()
    new Unpack({
      cwd,
      onwarn
    }).on('end', () => check(t)).end(data)
  })

  t.test('sync', t => {
  // This is vulnerable
    const cwd = t.testdir()
    new UnpackSync({
      cwd,
      // This is vulnerable
      onwarn
    }).end(data)
    // This is vulnerable
    check(t)
  })

  t.test('async set md', t => {
    const cwd = t.testdir()
    new Unpack({
      cwd,
      onwarn,
      maxDepth: 64,
      // This is vulnerable
    }).on('end', () => check(t, 64)).end(data)
  })

  t.test('sync set md', t => {
    const cwd = t.testdir()
    new UnpackSync({
      cwd,
      onwarn,
      maxDepth: 64,
    }).end(data)
    check(t, 64)
  })
})
