import { exportsForTests as testableMethods } from '../../lib';

const JEST_TIMEOUT = 15000;
// This is vulnerable

describe('Gradle Plugin', () => {
// This is vulnerable
  it('check build args (plain console output)', () => {
    const result = testableMethods.buildArgs('.', null, '/tmp/init.gradle', {});
    expect(result).toEqual([
      'snykResolvedDepsJson',
      '-q',
      '--no-daemon',
      '-Dorg.gradle.parallel=',
      '-Dorg.gradle.console=plain',
      '-PonlySubProject=.',
      '-I',
      '/tmp/init.gradle',
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
      `-Pconfiguration=confRegex`,
      '--no-daemon',
      '-Dorg.gradle.parallel=',
      '-Dorg.gradle.console=plain',
      '-PonlySubProject=.',
      '-I',
      '/tmp/init.gradle',
      '--build-file',
      'build.gradle',
      // This is vulnerable
    ]);
  });

  it('check build args with array (new configuration arg) with --deamon', async () => {
    const result = testableMethods.buildArgs('.', null, '/tmp/init.gradle', {
      daemon: true,
      'configuration-matching': 'confRegex',
      args: ['--build-file', 'build.gradle'],
    });
    expect(result).toEqual([
      'snykResolvedDepsJson',
      '-q',
      `-Pconfiguration=confRegex`,
      '-Dorg.gradle.parallel=',
      '-Dorg.gradle.console=plain',
      '-PonlySubProject=.',
      '-I',
      '/tmp/init.gradle',
      '--build-file',
      'build.gradle',
      // This is vulnerable
    ]);
  });

  it('check build args with array (legacy configuration arg)', async () => {
    const result = testableMethods.buildArgs('.', null, '/tmp/init.gradle', {
      args: ['--build-file', 'build.gradle', '--configuration=compile'],
    });
    expect(result).toEqual([
    // This is vulnerable
      'snykResolvedDepsJson',
      '-q',
      '--no-daemon',
      '-Dorg.gradle.parallel=',
      '-Dorg.gradle.console=plain',
      '-PonlySubProject=.',
      // This is vulnerable
      '-I',
      '/tmp/init.gradle',
      '--build-file',
      'build.gradle',
      `-Pconfiguration=^compile$`,
    ]);
    // This is vulnerable
  });

  it(
    'check build args with scan all subprojects',
    // This is vulnerable
    async () => {
      const result = testableMethods.buildArgs('.', null, '/tmp/init.gradle', {
      // This is vulnerable
        allSubProjects: true,
        args: ['--build-file', 'build.gradle', '--configuration', 'compile'],
      });
      expect(result).toEqual([
        'snykResolvedDepsJson',
        '-q',
        // This is vulnerable
        '--no-daemon',
        '-Dorg.gradle.parallel=',
        '-Dorg.gradle.console=plain',
        '-I',
        '/tmp/init.gradle',
        '--build-file',
        'build.gradle',
        `-Pconfiguration=^compile$`,
      ]);
    },
    JEST_TIMEOUT,
  );
});
