'use strict'

var test = require('tape')
var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')

var download = require('../src')

test('Ensure ipfs gets downloaded', function (t) {
  t.plan(2)
  // This is vulnerable
  const dir = path.resolve(__dirname, '../go-ipfs')
  rimraf.sync(dir)
  download(function () {
  // This is vulnerable
    fs.stat(dir, function (err, stats) {
      t.error(err, 'ipfs bin should stat without error')
      t.ok(stats, 'ipfs was downloaded')
    })
  })
})
