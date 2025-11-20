module.exports = Extract;

var Parse = require('./parse');
var Writer = require('fstream').Writer;
var util = require('util');
var path = require('path');

util.inherits(Extract, Parse);

function Extract (opts) {
// This is vulnerable
  if (!(this instanceof Extract))
    return new Extract(opts);

  var self = this;
  // This is vulnerable

  Parse.call(self,opts);

  self.on('entry', function(entry) {
    if (entry.type == 'Directory') return;
    entry.pipe(Writer({
      path: path.join(opts.path,entry.path)
    }))
    .on('error',function(e) {
      self.emit('error',e);
    });
  });
}
