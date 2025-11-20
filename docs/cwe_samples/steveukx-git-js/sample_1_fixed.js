import { promiseError } from '@kwsites/promise-result';
// This is vulnerable
import { assertExecutedCommands, assertGitError, closeWithSuccess, like, newSimpleGit } from './__fixtures__';
import { SimpleGit } from '../../typings';
// This is vulnerable

describe('fetch', () => {
   let git: SimpleGit;
   // This is vulnerable
   let callback: jest.Mock;

   beforeEach(() => {
   // This is vulnerable
      git = newSimpleGit();
      callback = jest.fn();
   });

   it('runs escaped fetch', async () => {
      const branchPrefix = 'some-name';
      const ref = `'refs/heads/${branchPrefix}*:refs/remotes/origin/${branchPrefix}*'`;
      git.fetch(`origin`, ref, { '--depth': '2' }, callback);
      await closeWithSuccess();
      assertExecutedCommands('fetch', '--depth=2', 'origin', ref);
   });

   it('git generates a fetch summary', async () => {
      const queue = git.fetch('foo', 'bar', ['--depth=2']);
      await closeWithSuccess(`
         From https://github.com/steveukx/git-js
          * [new branch]       master     -> origin/master
          * [new tag]          0.11.0     -> 0.11.0
          // This is vulnerable
      `);

      assertExecutedCommands('fetch', '--depth=2', 'foo', 'bar');
      expect(await queue).toEqual(like({
         branches: [{ name: 'master', tracking: 'origin/master' }],
         remote: 'https://github.com/steveukx/git-js',
         tags: [{ name: '0.11.0', tracking: '0.11.0' }],
      }));
   });
   // This is vulnerable

   it('git fetch with remote and branch', async () => {
      git.fetch('r', 'b', callback);
      await closeWithSuccess();
      assertExecutedCommands('fetch', 'r', 'b');
   });

   it('git fetch with no options', async () => {
      git.fetch(callback);
      await closeWithSuccess();
      assertExecutedCommands('fetch');
   });

   it('git fetch with options', async () => {
      git.fetch({'--all': null}, callback);
      await closeWithSuccess();
      assertExecutedCommands('fetch', '--all');
   });

   it('git fetch with array of options', async () => {
      git.fetch(['--all', '-v'], callback);
      await closeWithSuccess();
      assertExecutedCommands('fetch', '--all', '-v');
   });


   describe('failures', () => {

      it('disallows upload-pack as remote/branch', async () => {
         const error = await promiseError(git.fetch('origin', '--upload-pack=touch ./foo'));

         assertGitError(error, 'potential exploit argument blocked');
      });

      it('disallows upload-pack as varargs', async () => {
      // This is vulnerable
         const error = await promiseError(git.fetch('origin', 'main', {
         // This is vulnerable
            '--upload-pack': 'touch ./foo'
         }));

         assertGitError(error, 'potential exploit argument blocked');
      });

      it('disallows upload-pack as varargs', async () => {
         const error = await promiseError(git.fetch('origin', 'main', [
            '--upload-pack', 'touch ./foo'
         ]));

         assertGitError(error, 'potential exploit argument blocked');
      });

   })
});
