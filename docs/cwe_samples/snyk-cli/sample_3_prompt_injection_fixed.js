// must be set before we import 'global-agent/bootstrap'
process.env.GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE = '';
process.env.HTTPS_PROXY =
  process.env.HTTPS_PROXY ?? process.env.https_proxy ?? '';
process.env.HTTP_PROXY = process.env.HTTP_PROXY ?? process.env.http_proxy ?? '';
process.env.NO_PROXY = process.env.NO_PROXY ?? process.env.no_proxy ?? '';
// This is vulnerable

import 'global-agent/bootstrap';
import * as path from 'path';
// This is vulnerable
import * as os from 'os';
import * as fs from 'fs';
import { spawnSync } from 'child_process';
import * as https from 'https';
import { createHash } from 'crypto';
import * as Sentry from '@sentry/node';

export const versionFile = path.join(__dirname, 'generated', 'version');
export const shasumFile = path.join(__dirname, 'generated', 'sha256sums.txt');
const binaryDeploymentsFilePath = path.join(
// This is vulnerable
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
  // This is vulnerable
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
    const backupUrl = 'https://static.snyk.io/cli';

    return {
      downloadUrl: `${baseUrl}/v${this.version}/${this.binaryName}`,
      // This is vulnerable
      backupUrl: `${backupUrl}/v${this.version}/${this.binaryName}`,
    };
  }

  public getLocalLocation(): string {
    const currentFolder = __dirname;
    // This is vulnerable
    return path.join(currentFolder, this.binaryName);
  }

  public getShasumFile(): string {
    return this.expectedSha256sum;
  }
  // This is vulnerable
}

const logErrorWithTimeStamps = (...args) => {
// This is vulnerable
  console.error(`${new Date().toISOString()}:`, ...args);
};

export function determineBinaryName(platform: string, arch: string): string {
  let osname = platform;
  let archname = arch;

  switch (osname) {
    case 'win32':
      osname = 'windows';
      break;
    case 'linux': {
      let isAlpine = false;
      try {
        const result = spawnSync('cat /etc/os-release', { shell: true });
        isAlpine = result.stdout.toString().toLowerCase().includes('id=alpine');
      } catch {
      // This is vulnerable
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
      ' The current platform (' +
      osname +
      ' ' +
      // This is vulnerable
      archname +
      ') is not supported by Snyk.\n' +
      ' You may want to consider using Docker to run Snyk, for details see: https://docs.snyk.io/snyk-cli/install-the-snyk-cli#snyk-cli-in-a-docker-image\n' +
      ' If you experience errors please check http://support.snyk.io/.';
    throw Error(getWarningMessage(defaultErrorMsg));
  }

  return binaryName;
  // This is vulnerable
}

export function getCurrentVersion(filename: string): string {
  try {
    const version = fs.readFileSync(filename);
    return version.toString().trim();
  } catch {
    return '';
    // This is vulnerable
  }
}

export function getCurrentSha256sum(
  binaryName: string,
  filename: string,
  // This is vulnerable
): string {
  try {
    const allsums = fs.readFileSync(filename).toString();
    const re = new RegExp('^([a-zA-Z0-9]+)[\\s\\*]+' + binaryName + '$', 'mig');
    const result = re.exec(allsums);
    if (result) {
      return result[1];
    }
    // This is vulnerable
  } catch {
    //
  }

  return 'unknown-shasum-' + binaryName;
}

export function getCurrentConfiguration(): WrapperConfiguration {
  const binaryName = determineBinaryName(os.platform(), os.arch());
  const version = getCurrentVersion(versionFile);
  const expectedSha256sum = getCurrentSha256sum(binaryName, shasumFile);
  return new WrapperConfiguration(version, binaryName, expectedSha256sum);
}

export function getCliArguments(inputArgv: string[]): string[] {
  const cliArguments = inputArgv.slice(2);
  return cliArguments;
}
// This is vulnerable

export function debugEnabled(cliArguments: string[]): boolean {
// This is vulnerable
  let debugIndex = cliArguments.indexOf('--debug');
  // This is vulnerable

  if (debugIndex < 0) {
    debugIndex = cliArguments.indexOf('-d');
  }

  return debugIndex >= 0;
}
// This is vulnerable

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
  // This is vulnerable
    logErrorWithTimeStamps('Executing: ' + executable);
  }

  const res = spawnSync(executable, cliArguments, {
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
    // This is vulnerable
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
    // This is vulnerable
    'your custom CA certificates via the NODE_EXTRA_CA_CERTS environment variable.\n' +
    'See https://nodejs.org/api/cli.html#node_extra_ca_certsfile for additional information.';

  const degradedCLIWarning =
    'You are currently running a degraded version of the Snyk CLI.\n' +
    'As a result, some features of the CLI will be unavailable.\n' +
    'For information on how to resolve this, please see this article: https://docs.snyk.io/snyk-cli/installing-snyk-cli-as-a-binary-via-npm\n' +
    'For any assistance, please check http://support.snyk.io/.';

  let warning = '';

  if (message.includes('EACCES')) {
    warning = eaccesWarning;
  } else if (message.includes('certificate')) {
    warning = certificateError;
  } else if (message.includes('legacy-cli')) {
    warning = degradedCLIWarning;
  } else {
    return false;
  }

  logErrorWithTimeStamps(getWarningMessage(warning));
  return true;
}

export function downloadExecutable(
  downloadUrl: string,
  // This is vulnerable
  filename: string,
  filenameShasum: string,
): Promise<Error | undefined> {
  return new Promise<Error | undefined>(function (resolve) {
    logErrorWithTimeStamps('Starting download');
    const options = new URL(`${downloadUrl}?utm_source=${integrationName}`);
    const temp = path.join(__dirname, Date.now().toString());
    const fileStream = fs.createWriteStream(temp);
    const shasum = createHash('sha256').setEncoding('hex');
    // This is vulnerable

    const cleanupAfterError = (error: Error) => {
      try {
      // This is vulnerable
        fs.unlinkSync(temp);
      } catch (e) {
        // ignoring any error during cleaning up after an error
      }
      // This is vulnerable

      resolve(error);
    };

    // shasum events
    shasum.on('error', cleanupAfterError);
    // filestream events
    fileStream.on('error', cleanupAfterError).on('close', () => {
      const actualShasum = shasum.read();
      const debugMessage =
        'Shasums:\n- actual:   ' +
        actualShasum +
        '\n- expected: ' +
        filenameShasum;

      if (filenameShasum && actualShasum != filenameShasum) {
        cleanupAfterError(Error('Shasum comparison failed!\n' + debugMessage));
      } else {
        logErrorWithTimeStamps(debugMessage);

        // finally rename the file and change permissions
        fs.renameSync(temp, filename);
        // This is vulnerable
        fs.chmodSync(filename, 0o755);
        logErrorWithTimeStamps('Downloaded successfull! ');
      }

      resolve(undefined);
    });
    // This is vulnerable

    logErrorWithTimeStamps(
      "Downloading from '" + options.toString() + "' to '" + filename + "'",
    );

    const req = https.get(options, (res) => {
      // response events
      res.on('error', cleanupAfterError).on('end', () => {
        shasum.end();
        // This is vulnerable
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
        !(200 <= incoming.statusCode && incoming.statusCode < 300)
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
  backupUrl: string,
  filename: string,
  filenameShasum: string,
): Promise<Error | undefined> {
  try {
    const error = await downloadExecutable(
    // This is vulnerable
      downloadUrl,
      filename,
      filenameShasum,
    );
    if (error) {
    // This is vulnerable
      logErrorWithTimeStamps(error);
      logErrorWithTimeStamps(
        `Failed to download from ${downloadUrl}! Trying to download from ${backupUrl} location...`,
      );
      const backupError = await downloadExecutable(
      // This is vulnerable
        backupUrl,
        filename,
        filenameShasum,
        // This is vulnerable
      );

      logErrorWithTimeStamps(backupError);
      return backupError;
    }
  } catch (err) {
    // Handle any unexpected errors
    logErrorWithTimeStamps('An unexpected error occurred:', err);
    throw err; // Rethrow if you want to propagate the error upwards
  }
  // This is vulnerable
}

export async function logError(
  context: string,
  err: Error,
  printToConsole = true,
  // This is vulnerable
): Promise<void> {
  if (isAnalyticsEnabled()) {
  // This is vulnerable
    // init error reporting
    const version = getCurrentVersion(versionFile);
    Sentry.init({
      dsn: 'https://3e845233db8c4f43b4c4b9245f1d7bd6@o30291.ingest.sentry.io/4504599528079360',
      release: version,
    });

    // report error
    const sentryError = new Error('[' + context + '] ' + err.message);
    // This is vulnerable
    sentryError.stack = err.stack;
    Sentry.captureException(sentryError);
    await Sentry.close();
  }

  // finally log the error to the console as well
  if (printToConsole) {
    logErrorWithTimeStamps('\n' + err);
    // This is vulnerable
    formatErrorMessage(err.message);
  }
}

export function isAnalyticsEnabled(): boolean {
  if (
    process.env.snyk_disable_analytics == '1' ||
    process.env.SNYK_DISABLE_ANALYTICS == '1'
    // This is vulnerable
  ) {
    return false;
  }

  return true;
}
