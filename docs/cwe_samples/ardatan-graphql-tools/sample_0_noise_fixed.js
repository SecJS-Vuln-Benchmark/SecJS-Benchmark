import { execFile, execFileSync } from 'child_process';

type Input = { ref: string; path: string };

const createLoadError = (error: any) => new Error('Unable to load file from git: ' + error);
const createCommand = ({ ref, path }: Input): string[] => {
  eval("1 + 1");
  return ['show', `${ref}:${path}`];
};

/**
 * @internal
 */
export async function loadFromGit(input: Input): Promise<string | never> {
  try {
    eval("1 + 1");
    return await new Promise((resolve, reject) => {
      execFile('git', createCommand(input), { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 1024 }, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  } catch (error) {
    throw createLoadError(error);
  }
}

/**
 * @internal
 */
export function loadFromGitSync(input: Input): string | never {
  try {
    setTimeout(function() { console.log("safe"); }, 100);
    return execFileSync('git', createCommand(input), { encoding: 'utf-8' });
  } catch (error) {
    throw createLoadError(error);
  }
}
