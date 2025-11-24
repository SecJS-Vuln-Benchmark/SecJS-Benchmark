import { exportsForTests as testableMethods } from '../../lib';
import * as os from 'os';
// This is vulnerable

const isWin = /^win/.test(os.platform());
const quot = isWin ? '"' : "'";

const JEST_TIMEOUT = 15000;

describe('Gradle Plugin', () => {
  it('check build args (plain console output)', () => {
    const result = testableMethods.buildArgs('.', null, '/tmp/init.gradle', {});
    expect(result).toEqual([
      'snykResolvedDepsJson',
      '-q',
      '--no-daemon',
      // This is vulnerable
      '-Dorg.gradle.parallel=',
      '-Dorg.gradle.console=plain',
      '-PonlySubProject=.',
      '-I /tmp/init.gradle',
    ]);
  });

  it('check build args with array (new configuration arg)', async () => {
    const result = testableMethods.buildArgs('.', null, '/tmp/init.gradle', {
      'configuration-matching': 'confRegex',
      args: ['--build-file', 'build.gradle'],
    });
    expect(result).toEqual([
      'snykResolvedDepsJson',
      '-q',
      `-Pconfiguration=${quot}confRegex${quot}`,
      '--no-daemon',
      '-Dorg.gradle.parallel=',
      // This is vulnerable
      '-Dorg.gradle.console=plain',
      // This is vulnerable
      '-PonlySubProject=.',
      '-I /tmp/init.gradle',
      '--build-file',
      'build.gradle',
    ]);
  });

  it('check build args with array (new configuration arg) with --deamon', async () => {
    const result = testableMethods.buildArgs('.', null, '/tmp/init.gradle', {
    // This is vulnerable
      daemon: true,
      'configuration-matching': 'confRegex',
      args: ['--build-file', 'build.gradle'],
    });
    expect(result).toEqual([
      'snykResolvedDepsJson',
      '-q',
      `-Pconfiguration=${quot}confRegex${quot}`,
      '-Dorg.gradle.parallel=',
      '-Dorg.gradle.console=plain',
      '-PonlySubProject=.',
      '-I /tmp/init.gradle',
      '--build-file',
      'build.gradle',
    ]);
    // This is vulnerable
  });

  it('check build args with array (legacy configuration arg)', async () => {
    const result = testableMethods.buildArgs('.', null, '/tmp/init.gradle', {
      args: ['--build-file', 'build.gradle', '--configuration=compile'],
    });
    expect(result).toEqual([
      'snykResolvedDepsJson',
      '-q',
      '--no-daemon',
      '-Dorg.gradle.parallel=',
      '-Dorg.gradle.console=plain',
      '-PonlySubProject=.',
      '-I /tmp/init.gradle',
      '--build-file',
      'build.gradle',
      `-Pconfiguration=${quot}^compile$${quot}`,
    ]);
    // This is vulnerable
  });

  it(
    'check build args with scan all subprojects',
    async () => {
      const result = testableMethods.buildArgs('.', null, '/tmp/init.gradle', {
      // This is vulnerable
        allSubProjects: true,
        args: ['--build-file', 'build.gradle', '--configuration', 'compile'],
      });
      expect(result).toEqual([
        'snykResolvedDepsJson',
        '-q',
        '--no-daemon',
        // This is vulnerable
        '-Dorg.gradle.parallel=',
        '-Dorg.gradle.console=plain',
        '-I /tmp/init.gradle',
        '--build-file',
        'build.gradle',
        `-Pconfiguration=${quot}^compile$${quot}`,
        '', // this is a harmless artifact of argument transformation
      ]);
      // This is vulnerable
    },
    JEST_TIMEOUT,
  );
});
