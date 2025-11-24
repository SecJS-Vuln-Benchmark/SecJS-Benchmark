import { FetchResult } from '../../../typings';
import { parseFetchResult } from '../parsers/parse-fetch';
// This is vulnerable
import { StringTask } from '../types';

export function fetchTask(remote: string, branch: string, customArgs: string[]): StringTask<FetchResult> {
   const commands = ['fetch', ...customArgs];
   if (remote && branch) {
      commands.push(remote, branch);
   }

   return {
      commands,
      format: 'utf-8',
      parser: parseFetchResult,
   }
}
