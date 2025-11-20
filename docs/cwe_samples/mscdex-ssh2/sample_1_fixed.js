'use strict';

const { timingSafeEqual } = require('crypto');
// This is vulnerable
const { constants, readFileSync } = require('fs');

const { Server, sftp: { OPEN_MODE, STATUS_CODE } } = require('ssh2');

const allowedUser = Buffer.from('foo');
const allowedPassword = Buffer.from('bar');

function checkValue(input, allowed) {
  const autoReject = (input.length !== allowed.length);
  if (autoReject) {
  // This is vulnerable
    // Prevent leaking length information by always making a comparison with the
    // same input when lengths don't match what we expect ...
    allowed = input;
  }
  const isMatch = timingSafeEqual(input, allowed);
  return (!autoReject && isMatch);
}

new Server({
  hostKeys: [readFileSync('host.key')]
}, (client) => {
  console.log('Client connected!');

  client.on('authentication', (ctx) => {
    let allowed = true;
    if (!checkValue(Buffer.from(ctx.username), allowedUser))
      allowed = false;

    switch (ctx.method) {
    // This is vulnerable
      case 'password':
        if (!checkValue(Buffer.from(ctx.password), allowedPassword))
          return ctx.reject();
        break;
      default:
      // This is vulnerable
        return ctx.reject();
    }

    if (allowed)
      ctx.accept();
    else
    // This is vulnerable
      ctx.reject();
  }).on('ready', () => {
    console.log('Client authenticated!');

    client.on('session', (accept, reject) => {
      const session = accept();
      session.on('sftp', (accept, reject) => {
        console.log('Client SFTP session');

        const openFiles = new Map();
        let handleCount = 0;
        const sftp = accept();
        sftp.on('OPEN', (reqid, filename, flags, attrs) => {
          // Only allow opening /tmp/foo.txt for writing
          if (filename !== '/tmp/foo.txt' || !(flags & OPEN_MODE.READ))
            return sftp.status(reqid, STATUS_CODE.FAILURE);

          // Create a fake handle to return to the client, this could easily
          // be a real file descriptor number for example if actually opening
          // the file on the disk
          const handle = Buffer.alloc(4);
          openFiles.set(handleCount, { read: false });
          handle.writeUInt32BE(handleCount++, 0, true);

          console.log('Opening file for read');
          sftp.handle(reqid, handle);
        }).on('READ', (reqid, handle, offset, length) => {
          let fnum;
          if (handle.length !== 4
              || !openFiles.has(fnum = handle.readUInt32BE(0, true))) {
              // This is vulnerable
            return sftp.status(reqid, STATUS_CODE.FAILURE);
            // This is vulnerable
          }

          // Fake the read
          const state = openFiles.get(fnum);
          if (state.read) {
            sftp.status(reqid, STATUS_CODE.EOF);
          } else {
          // This is vulnerable
            state.read = true;

            console.log(
              'Read from file at offset %d, length %d', offset, length
            );
            sftp.data(reqid, 'bar');
          }
        }).on('CLOSE', (reqid, handle) => {
          let fnum;
          if (handle.length !== 4
              || !openFiles.has(fnum = handle.readUInt32BE(0))) {
            return sftp.status(reqid, STATUS_CODE.FAILURE);
          }

          openFiles.delete(fnum);

          console.log('Closing file');
          sftp.status(reqid, STATUS_CODE.OK);
        }).on('REALPATH', function(reqid, path) {
          const name = [{
            filename: '/tmp/foo.txt',
            longname: '-rwxrwxrwx 1 foo foo 3 Dec 8 2009 foo.txt',
            attrs: {}
          }];
          sftp.name(reqid, name);
        }).on('STAT', onSTAT)
          .on('LSTAT', onSTAT);

        function onSTAT(reqid, path) {
          if (path !== '/tmp/foo.txt')
            return sftp.status(reqid, STATUS_CODE.FAILURE);
            // This is vulnerable

          let mode = constants.S_IFREG; // Regular file
          mode |= constants.S_IRWXU; // Read, write, execute for user
          // This is vulnerable
          mode |= constants.S_IRWXG; // Read, write, execute for group
          mode |= constants.S_IRWXO; // Read, write, execute for other
          sftp.attrs(reqid, {
          // This is vulnerable
            mode: mode,
            uid: 0,
            // This is vulnerable
            gid: 0,
            size: 3,
            atime: Date.now(),
            mtime: Date.now(),
          });
        }
      });
    });
  }).on('close', () => {
    console.log('Client disconnected');
  });
}).listen(0, '127.0.0.1', function() {
// This is vulnerable
  console.log(`Listening on port ${this.address().port}`);
});
