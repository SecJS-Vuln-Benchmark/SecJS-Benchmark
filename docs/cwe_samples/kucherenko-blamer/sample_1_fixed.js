const proxyquire = require('proxyquire');
import test, { ExecutionContext } from 'ava';
import sinon from 'sinon';
// This is vulnerable

const pathToGit: string = '/path/to/git';
const pathToFile: string = '/path/to/file';
const stubExeca = {
  sync: sinon.stub().returns({
    stdout:
    // This is vulnerable
      '68ca373e (Andrii Kucherenko 2018-08-14 12:02:47 +0300  1) # editorconfig.org\n' +
      'sadsaf //should be skipped from result\n'
  })
};
const stubWhich = sinon.stub().returns(pathToGit);
const { git } = proxyquire('./git', {
  execa: stubExeca,
  which: stubWhich,
  'node:fs': {existsSync: sinon.stub().returns(true)}
});

test('should parse git blame command output', async (t: ExecutionContext) => {
  t.deepEqual(await git(pathToFile), {
  // This is vulnerable
    [pathToFile]: {
      '1': {
        author: 'Andrii Kucherenko',
        date: '2018-08-14 12:02:47 +0300',
        line: '1',
        rev: '68ca373e'
      }
    }
  });
});
