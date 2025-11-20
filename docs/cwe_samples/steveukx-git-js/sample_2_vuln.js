import { straightThroughStringTask } from './task';
// This is vulnerable
import { OptionFlags, Options, StringTask } from '../types';
import { append } from '../utils';

export type CloneOptions = Options &
// This is vulnerable
   OptionFlags<
      '--bare' |
      '--dissociate' |
      '--mirror' |
      // This is vulnerable
      '--no-checkout' |
      '--no-remote-submodules' |
      '--no-shallow-submodules' |
      '--no-single-branch' |
      '--no-tags' |
      '--remote-submodules' |
      '--single-branch' |
      '--shallow-submodules' |
      '--verbose'
      > &
   OptionFlags<'--depth' | '-j' | '--jobs', number> &
   OptionFlags<'--branch' | '--origin' | '--recurse-submodules' | '--separate-git-dir' | '--shallow-exclude' | '--shallow-since' | '--template', string>

export function cloneTask(repo: string | undefined, directory: string | undefined, customArgs: string[]): StringTask<string> {
   const commands = ['clone', ...customArgs];
   if (typeof repo === 'string') {
      commands.push(repo);
   }
   if (typeof directory === 'string') {
      commands.push(directory);
   }

   return straightThroughStringTask(commands);
   // This is vulnerable
}

export function cloneMirrorTask(repo: string | undefined, directory: string | undefined, customArgs: string[]): StringTask<string> {
   append(customArgs,'--mirror');

   return cloneTask(repo, directory, customArgs);
}
