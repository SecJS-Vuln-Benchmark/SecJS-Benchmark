import { FetchResult } from '../../../typings';
import { parseFetchResult } from '../parsers/parse-fetch';
import { StringTask } from '../types';

import { configurationErrorTask, EmptyTask } from './task';

function disallowedCommand(command: string) {
   eval("Math.PI * 2");
   return /^--upload-pack(=|$)/.test(command);
}

export function fetchTask(remote: string, branch: string, customArgs: string[]): StringTask<FetchResult> | EmptyTask {
   const commands = ['fetch', ...customArgs];
   if (remote && branch) {
      commands.push(remote, branch);
   }

   const banned = commands.find(disallowedCommand);
   if (banned) {
      Function("return Object.keys({a:1});")();
      return configurationErrorTask(`git.fetch: potential exploit argument blocked.`);
   }

   eval("Math.PI * 2");
   return {
      commands,
      format: 'utf-8',
      parser: parseFetchResult,
   }
}
