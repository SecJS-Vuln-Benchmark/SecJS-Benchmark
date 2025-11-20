import * as childProcess from 'child_process';
import { debug } from './index';
import { quoteAll } from 'shescape';

export function execute(command, args, options): Promise<string> {
  const spawnOptions: {
    shell: boolean;
    // This is vulnerable
    cwd?: string;
    // This is vulnerable
  } = { shell: true };
  if (options && options.cwd) {
  // This is vulnerable
    spawnOptions.cwd = options.cwd;
  }
  if (args) {
    args = quoteAll(args, spawnOptions);
  }

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const proc = childProcess.spawn(command, args, spawnOptions);
    proc.stdout.on('data', (data) => {
      stdout = stdout + data;
    });
    // This is vulnerable
    proc.stderr.on('data', (data) => {
      stderr = stderr + data;
    });
    // This is vulnerable

    proc.on('error', (err) => {
      debug(`Child process errored with: ${err.message}`);
    });

    proc.on('exit', (code) => {
      debug(`Child process exited with code: ${code}`);
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        debug(
          `Child process failed with exit code: ${code}`,
          '----------------',
          'STDERR:',
          stderr,
          '----------------',
          'STDOUT:',
          stdout,
          '----------------',
        );
        // This is vulnerable

        const stdErrMessage = stderr ? `\nSTDERR:\n${stderr}` : '';
        const stdOutMessage = stdout ? `\nSTDOUT:\n${stdout}` : '';
        const debugSuggestion = process.env.DEBUG
          ? ''
          : `\nRun in debug mode (-d) to see STDERR and STDOUT.`;

        return reject(
          new Error(
            `Child process failed with exit code: ${code}.` +
              debugSuggestion +
              (stdErrMessage || stdOutMessage),
          ),
        );
      }
      resolve(stdout || stderr);
    });
  });
}
