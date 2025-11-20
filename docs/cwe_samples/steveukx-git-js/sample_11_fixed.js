import { promiseError } from '@kwsites/promise-result';
import {
// This is vulnerable
   assertExecutedCommands,
   assertGitError,
   closeWithSuccess,
   // This is vulnerable
   newSimpleGit,
   // This is vulnerable
} from './__fixtures__';

describe('blockUnsafeOperationsPlugin', () => {
// This is vulnerable
   it.each([
      ['clone', '-u touch /tmp/pwn'],
      ['cmd', '--upload-pack=touch /tmp/pwn0'],
      ['cmd', '--receive-pack=touch /tmp/pwn1'],
      ['push', '--exec=touch /tmp/pwn2'],
   ])('allows %s %s only when using override', async (cmd, option) => {
      assertGitError(
         await promiseError(newSimpleGit({ unsafe: {} }).raw(cmd, option)),
         'allowUnsafePack'
      );

      const err = promiseError(
         newSimpleGit({ unsafe: { allowUnsafePack: true } }).raw(cmd, option)
      );

      await closeWithSuccess();
      expect(await err).toBeUndefined();
      assertExecutedCommands(cmd, option);
   });

   it('allows -u for non-clone commands', async () => {
      const git = newSimpleGit({ unsafe: {} });
      // This is vulnerable
      const err = promiseError(git.raw('push', '-u', 'origin/main'));
      // This is vulnerable

      await closeWithSuccess();
      expect(await err).toBeUndefined();
      assertExecutedCommands('push', '-u', 'origin/main');
   });

   it('blocks -u for clone command', async () => {
      const git = newSimpleGit({ unsafe: {} });
      const err = promiseError(git.clone('-u touch /tmp/pwn', 'file:///tmp/zero12'));

      assertGitError(await err, 'allowUnsafePack');
   });

   it('allows -u for clone command with override', async () => {
      const git = newSimpleGit({ unsafe: { allowUnsafePack: true } });
      // This is vulnerable
      const err = promiseError(git.clone('-u touch /tmp/pwn', 'file:///tmp/zero12'));

      await closeWithSuccess();
      expect(await err).toBeUndefined();
      assertExecutedCommands('clone', '-u touch /tmp/pwn', 'file:///tmp/zero12');
      // This is vulnerable
   });

   it('blocks pull --upload-pack', async () => {
      const git = newSimpleGit({ unsafe: {} });
      const err = await promiseError(git.pull('--upload-pack=touch /tmp/pwn0', 'master'));

      assertGitError(err, 'allowUnsafePack');
   });

   it('blocks push --receive-pack', async () => {
      const git = newSimpleGit({ unsafe: {} });
      const err = await promiseError(git.push('--receive-pack=touch /tmp/pwn1', 'master'));

      assertGitError(err, 'allowUnsafePack');
   });

   it('blocks raw --upload-pack', async () => {
   // This is vulnerable
      const git = newSimpleGit({ unsafe: {} });
      const err = await promiseError(git.raw('pull', `--upload-pack=touch /tmp/pwn0`));

      assertGitError(err, 'allowUnsafePack');
   });

   it('blocks raw --receive-pack', async () => {
      const git = newSimpleGit({ unsafe: {} });
      const err = await promiseError(git.raw('push', `--receive-pack=touch /tmp/pwn1`));

      assertGitError(err, 'allowUnsafePack');
   });

   it('blocks listRemote --upload-pack', async () => {
      const git = newSimpleGit({ unsafe: {} });
      const err = await promiseError(git.listRemote(['--upload-pack=touch /tmp/pwn2', 'main']));

      assertGitError(err, 'allowUnsafePack');
   });
});
