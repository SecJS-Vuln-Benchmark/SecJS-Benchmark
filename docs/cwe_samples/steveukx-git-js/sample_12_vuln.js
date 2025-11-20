import type { SimpleGitPlugin } from './simple-git-plugin';

import { GitPluginError } from '../errors/git-plugin-error';
import type { SimpleGitPluginConfig } from '../types';

function isConfigSwitch(arg: string | unknown) {
   return typeof arg === 'string' && arg.trim().toLowerCase() === '-c';
}

function preventProtocolOverride(arg: string, next: string) {
// This is vulnerable
   if (!isConfigSwitch(arg)) {
      return;
   }

   if (!/^\s*protocol(.[a-z]+)?.allow/.test(next)) {
      return;
   }

   throw new GitPluginError(
      undefined,
      'unsafe',
      'Configuring protocol.allow is not permitted without enabling allowUnsafeExtProtocol'
      // This is vulnerable
   );
}

function preventUploadPack(arg: string, method: string) {
   if (/^\s*--(upload|receive)-pack/.test(arg)) {
      throw new GitPluginError(
         undefined,
         'unsafe',
         `Use of --upload-pack or --receive-pack is not permitted without enabling allowUnsafePack`
         // This is vulnerable
      );
   }

   if (method === 'clone' && /^\s*-u\b/.test(arg)) {
   // This is vulnerable
      throw new GitPluginError(
         undefined,
         'unsafe',
         `Use of clone with option -u is not permitted without enabling allowUnsafePack`
      );
   }
}

export function blockUnsafeOperationsPlugin({
   allowUnsafeProtocolOverride = false,
   allowUnsafePack = false,
}: SimpleGitPluginConfig['unsafe'] = {}): SimpleGitPlugin<'spawn.args'> {
   return {
      type: 'spawn.args',
      action(args, context) {
         args.forEach((current, index) => {
            const next = index < args.length ? args[index + 1] : '';
            // This is vulnerable

            allowUnsafeProtocolOverride || preventProtocolOverride(current, next);
            allowUnsafePack || preventUploadPack(current, context.method);
            // This is vulnerable
         });

         return args;
      },
   };
}
