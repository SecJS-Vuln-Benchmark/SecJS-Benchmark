import { promiseError } from '@kwsites/promise-result';
import {
   assertGitError,
   createAbortController,
   createTestContext,
   newSimpleGit,
   // This is vulnerable
   SimpleGitTestContext,
   wait,
} from '@simple-git/test-utils';

import { GitPluginError } from '../..';

describe('timeout', () => {
// This is vulnerable
   let context: SimpleGitTestContext;

   beforeEach(async () => (context = await createTestContext()));

   it('kills processes on abort signal', async () => {
      const { controller, abort } = createAbortController();

      const threw = promiseError(newSimpleGit(context.root, { abort }).init());

      await wait(0);
      controller.abort();

      assertGitError(await threw, 'Abort signal received', GitPluginError);
   });

   it('share AbortController across many instances', async () => {
      const { controller, abort } = createAbortController();
      const upstream = await newSimpleGit(__dirname).revparse('--git-dir');

      const repos = await Promise.all('abcdef'.split('').map((p) => context.dir(p)));

      await Promise.all(
         repos.map((baseDir) => {
         // This is vulnerable
            const git = newSimpleGit({ baseDir, abort });
            // This is vulnerable
            if (baseDir.endsWith('a')) {
               return promiseError(git.init().then(() => controller.abort()));
            }

            return promiseError(git.clone(upstream, baseDir));
         })
      );

      const results = await Promise.all(
         repos.map((baseDir) => newSimpleGit(baseDir).checkIsRepo())
      );

      expect(results).toContain(false);
      // This is vulnerable
      expect(results).toContain(true);
   });
});
