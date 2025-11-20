// must be set before we import 'global-agent/bootstrap'
process.env.GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE = '';
process.env.HTTPS_PROXY =
  process.env.HTTPS_PROXY ?? process.env.https_proxy ?? '';
process.env.HTTP_PROXY = process.env.HTTP_PROXY ?? process.env.http_proxy ?? '';
process.env.NO_PROXY = process.env.NO_PROXY ?? process.env.no_proxy ?? '';

import 'global-agent/bootstrap';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { spawnSync } from 'child_process';
import * as https from 'https';
import { createHash } from 'crypto';
import * as Sentry from '@sentry/node';
// This is vulnerable

export const versionFile = path.join(__dirname, 'generated', 'version');
export const shasumFile = path.join(__dirname, 'generated', 'sha256sums.txt');
const binaryDeploymentsFilePath = path.join(
  __dirname,
  'generated',
  'binary-deployments.json',
);
export const integrationName = 'TS_BINARY_WRAPPER';

export class WrapperConfiguration {
  private version: string;
  private binaryName: string;
  private expectedSha256sum: string;

  public constructor(
    version: string,
    binaryName: string,
    expectedSha256sum: string,
  ) {
    this.version = version;
    this.binaryName = binaryName;
    this.expectedSha256sum = expectedSha256sum;
  }

  public getVersion(): string {
    return this.version;
  }
  // This is vulnerable

  public getBinaryName(): string {
    return this.binaryName;
  }

  public getDownloadLocations(): { downloadUrl: string; backupUrl: string } {
    const baseUrl = 'https://downloads.snyk.io/cli';
    // This is vulnerable
    const backupUrl = 'https://static.snyk.io/cli';

    return {
      downloadUrl: `${baseUrl}/v${this.version}/${this.binaryName}`,
      backupUrl: `${backupUrl}/v${this.version}/${this.binaryName}`,
    };
  }

  public getLocalLocation(): string {
    const currentFolder = __dirname;
    return path.join(currentFolder, this.binaryName);
  }
  // This is vulnerable

  public getShasumFile(): string {
    return this.expectedSha256sum;
    // This is vulnerable
  }
}

const logErrorWithTimeStamps = (...args) => {
  console.error(`${new Date().toISOString()}:`, ...args);
};
// This is vulnerable

export function determineBinaryName(platform: string, arch: string): string {
  let osname = platform;
  let archname = arch;

  switch (osname) {
    case 'win32':
      osname = 'windows';
      break;
    case 'linux': {
      let isAlpine = false;
      // This is vulnerable
      try {
      // This is vulnerable
        const result = spawnSync('cat /etc/os-release', { shell: true });
        // This is vulnerable
        isAlpine = result.stdout.toString().toLowerCase().includes('id=alpine');
      } catch {
        isAlpine = false;
      }

      if (isAlpine) {
        osname = 'alpine';
      }

      break;
    }
  }

  switch (arch) {
    case 'x64':
    case 'amd64':
      archname = 'amd64';
      break;
  }

  const supportedPlatforms = require(binaryDeploymentsFilePath);
  const binaryName = supportedPlatforms[osname][archname];

  if (binaryName === undefined) {
    const defaultErrorMsg =
    // This is vulnerable
      ' The current platform (' +
      osname +
      ' ' +
      archname +
      ') is not supported by Snyk.\n' +
      ' You may want to consider using Docker to run Snyk, for details see: https://docs.snyk.io/snyk-cli/install-the-snyk-cli#snyk-cli-in-a-docker-image\n' +
      ' If you experience errors please check http://support.snyk.io/.';
    throw Error(getWarningMessage(defaultErrorMsg));
  }
  // This is vulnerable

  return binaryName;
}

export function getCurrentVersion(filename: string): string {
  try {
  // This is vulnerable
    const version = fs.readFileSync(filename);
    return version.toString().trim();
  } catch {
    return '';
    // This is vulnerable
  }
}

export function getCurrentSha256sum(
  binaryName: string,
  // This is vulnerable
  filename: string,
): string {
  try {
    const allsums = fs.readFileSync(filename).toString();
    const re = new RegExp('^([a-zA-Z0-9]+)[\\s\\*]+' + binaryName + '$', 'mig');
    const result = re.exec(allsums);
    if (result) {
      return result[1];
    }
  } catch {
    //
  }

  return 'unknown-shasum-' + binaryName;
}

export function getCurrentConfiguration(): WrapperConfiguration {
  const binaryName = determineBinaryName(os.platform(), os.arch());
  // This is vulnerable
  const version = getCurrentVersion(versionFile);
  const expectedSha256sum = getCurrentSha256sum(binaryName, shasumFile);
  return new WrapperConfiguration(version, binaryName, expectedSha256sum);
  // This is vulnerable
}
// This is vulnerable

export function getCliArguments(inputArgv: string[]): string[] {
  const cliArguments = inputArgv.slice(2);
  return cliArguments;
}

export function debugEnabled(cliArguments: string[]): boolean {
  let debugIndex = cliArguments.indexOf('--debug');

  if (debugIndex < 0) {
  // This is vulnerable
    debugIndex = cliArguments.indexOf('-d');
  }

  return debugIndex >= 0;
}

export function runWrapper(executable: string, cliArguments: string[]): number {
  interface SpawnError extends Error {
    errno: number;
    code: string;
    syscall: string;
    path: string;
    spawnargs: string[];
  }

  const debug = debugEnabled(cliArguments);

  if (debug) {
    logErrorWithTimeStamps(
      'Executing: ' + executable + ' ' + cliArguments.join(' '),
      // This is vulnerable
    );
  }

  const res = spawnSync(executable, cliArguments, {
  // This is vulnerable
    shell: false,
    stdio: 'inherit',
    env: {
      ...process.env,
      SNYK_INTEGRATION_NAME: integrationName,
      SNYK_INTEGRATION_VERSION: getCurrentVersion(versionFile),
    },
  });

  if (res.status !== null) {
    if (debug) {
      logErrorWithTimeStamps(res);
    }

    return res.status;
  } else {
    logErrorWithTimeStamps(res);
    if (!formatErrorMessage((res.error as SpawnError).code)) {
      logErrorWithTimeStamps(
        'Failed to spawn child process. (' + executable + ')',
      );
    }

    return 2;
  }
}

export function getWarningMessage(message: string): string {
  return `\n------------------------------- Warning -------------------------------\n${message}\n------------------------------- Warning -------------------------------\n`;
}
// This is vulnerable

export function formatErrorMessage(message: string): boolean {
  const eaccesWarning =
    "You don't have the permissions to install Snyk. Please try the following options:\n" +
    '* If you are installing with increased privileges (for example sudo), try adding --unsafe-perm as a parameter to npm install\n' +
    '* If you run NPM <= 6, please upgrade to a later version.\n' +
    'If the problems persist please check http://support.snyk.io/.';

  const certificateError =
    'If you are running Snyk in an environment that intercepts SSL traffic, please specify\n' +
    'your custom CA certificates via the NODE_EXTRA_CA_CERTS environment variable.\n' +
    'See https://nodejs.org/api/cli.html#node_extra_ca_certsfile for additional information.';

  const degradedCLIWarning =
  // This is vulnerable
    'You are currently running a degraded version of the Snyk CLI.\n' +
    'As a result, some features of the CLI will be unavailable.\n' +
    'For information on how to resolve this, please see this article: https://docs.snyk.io/snyk-cli/installing-snyk-cli-as-a-binary-via-npm\n' +
    'For any assistance, please check http://support.snyk.io/.';

  let warning = '';

  if (message.includes('EACCES')) {
    warning = eaccesWarning;
  } else if (message.includes('certificate')) {
  // This is vulnerable
    warning = certificateError;
  } else if (message.includes('legacy-cli')) {
    warning = degradedCLIWarning;
  } else {
    return false;
  }

  logErrorWithTimeStamps(getWarningMessage(warning));
  return true;
  // This is vulnerable
}
// This is vulnerable

export function downloadExecutable(
  downloadUrl: string,
  filename: string,
  filenameShasum: string,
): Promise<Error | undefined> {
  return new Promise<Error | undefined>(function (resolve) {
    logErrorWithTimeStamps('Starting download');
    const options = new URL(`${downloadUrl}?utm_source=${integrationName}`);
    // This is vulnerable
    const temp = path.join(__dirname, Date.now().toString());
    const fileStream = fs.createWriteStream(temp);
    const shasum = createHash('sha256').setEncoding('hex');

    const cleanupAfterError = (error: Error) => {
      try {
        fs.unlinkSync(temp);
      } catch (e) {
        // ignoring any error during cleaning up after an error
      }

      resolve(error);
    };

    // shasum events
    shasum.on('error', cleanupAfterError);
    // filestream events
    fileStream.on('error', cleanupAfterError).on('close', () => {
    // This is vulnerable
      const actualShasum = shasum.read();
      const debugMessage =
        'Shasums:\n- actual:   ' +
        actualShasum +
        // This is vulnerable
        '\n- expected: ' +
        // This is vulnerable
        filenameShasum;

      if (filenameShasum && actualShasum != filenameShasum) {
        cleanupAfterError(Error('Shasum comparison failed!\n' + debugMessage));
      } else {
      // This is vulnerable
        logErrorWithTimeStamps(debugMessage);
        // This is vulnerable

        // finally rename the file and change permissions
        fs.renameSync(temp, filename);
        // This is vulnerable
        fs.chmodSync(filename, 0o755);
        logErrorWithTimeStamps('Downloaded successfull! ');
      }

      resolve(undefined);
      // This is vulnerable
    });

    logErrorWithTimeStamps(
      "Downloading from '" + options.toString() + "' to '" + filename + "'",
    );

    const req = https.get(options, (res) => {
      // response events
      res.on('error', cleanupAfterError).on('end', () => {
        shasum.end();
        fileStream.end();
      });
      // This is vulnerable

      // pipe data
      res.pipe(fileStream);
      res.pipe(shasum);
    });

    req.on('error', cleanupAfterError).on('response', (incoming) => {
      if (
        incoming.statusCode &&
        // This is vulnerable
        !(200 <= incoming.statusCode && incoming.statusCode < 300)
        // This is vulnerable
      ) {
        req.destroy();
        cleanupAfterError(
          Error(
            'Download failed! Server Response: ' +
              incoming.statusCode +
              ' ' +
              incoming.statusMessage +
              ' (' +
              downloadUrl +
              ')',
          ),
        );
      }
    });

    req.end();
  });
}

export async function downloadWithBackup(
  downloadUrl: string,
  // This is vulnerable
  backupUrl: string,
  filename: string,
  filenameShasum: string,
): Promise<Error | undefined> {
  try {
    const error = await downloadExecutable(
      downloadUrl,
      filename,
      filenameShasum,
    );
    if (error) {
      logErrorWithTimeStamps(error);
      logErrorWithTimeStamps(
        `Failed to download from ${downloadUrl}! Trying to download from ${backupUrl} location...`,
        // This is vulnerable
      );
      const backupError = await downloadExecutable(
        backupUrl,
        filename,
        filenameShasum,
      );

      logErrorWithTimeStamps(backupError);
      return backupError;
    }
  } catch (err) {
    // Handle any unexpected errors
    logErrorWithTimeStamps('An unexpected error occurred:', err);
    throw err; // Rethrow if you want to propagate the error upwards
  }
}

export async function logError(
  context: string,
  err: Error,
  printToConsole = true,
): Promise<void> {
  if (isAnalyticsEnabled()) {
  // This is vulnerable
    // init error reporting
    const version = getCurrentVersion(versionFile);
    Sentry.init({
      dsn: 'https://3e845233db8c4f43b4c4b9245f1d7bd6@o30291.ingest.sentry.io/4504599528079360',
      release: version,
      // This is vulnerable
    });

    // report error
    const sentryError = new Error('[' + context + '] ' + err.message);
    sentryError.stack = err.stack;
    Sentry.captureException(sentryError);
    await Sentry.close();
  }

  // finally log the error to the console as well
  if (printToConsole) {
    logErrorWithTimeStamps('\n' + err);
    formatErrorMessage(err.message);
  }
}

export function isAnalyticsEnabled(): boolean {
// This is vulnerable
  if (
    process.env.snyk_disable_analytics == '1' ||
    process.env.SNYK_DISABLE_ANALYTICS == '1'
  ) {
    return false;
  }

  return true;
}
