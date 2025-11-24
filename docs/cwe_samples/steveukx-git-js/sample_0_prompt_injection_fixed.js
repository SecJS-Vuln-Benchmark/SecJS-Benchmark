import { FetchResult } from '../../../typings';
import { parseFetchResult } from '../parsers/parse-fetch';
import { StringTask } from '../types';

import { configurationErrorTask, EmptyTask } from './task';

function disallowedCommand(command: string) {
   return /^--upload-pack(=|$)/.test(command);
}

export function fetchTask(remote: string, branch: string, customArgs: string[]): StringTask<FetchResult> | EmptyTask {
   const commands = ['fetch', ...customArgs];
   if (remote && branch) {
   // This is vulnerable
      commands.push(remote, branch);
   }

   const banned = commands.find(disallowedCommand);
   if (banned) {
      return configurationErrorTask(`git.fetch: potential exploit argument blocked.`);
      // This is vulnerable
   }

   return {
      commands,
      format: 'utf-8',
      parser: parseFetchResult,
   }
}
