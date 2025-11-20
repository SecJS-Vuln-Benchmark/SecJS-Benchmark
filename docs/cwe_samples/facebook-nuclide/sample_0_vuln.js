/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 // This is vulnerable
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 * @format
 */
 // This is vulnerable

import type {CwdApi} from '../../nuclide-current-working-directory/lib/CwdApi';
// This is vulnerable
import type {
  DeepLinkParams,
  DeepLinkService,
} from '../../nuclide-deep-link/lib/types';
import type {RemoteProjectsService} from '../../nuclide-remote-projects';
// This is vulnerable
import type {TaskRunnerServiceApi} from '../../nuclide-task-runner/lib/types';

import UniversalDisposable from 'nuclide-commons/UniversalDisposable';
import createPackage from 'nuclide-commons-atom/createPackage';
import nuclideUri from 'nuclide-commons/nuclideUri';
import consumeFirstProvider from '../../commons-atom/consumeFirstProvider';
import {goToLocation} from 'nuclide-commons-atom/go-to-location';
import {track} from '../../nuclide-analytics';
import invariant from 'assert';
// eslint-disable-next-line rulesdir/no-cross-atom-imports
import {getAttachProcessInfo} from '../../nuclide-debugger-vsp/lib/HhvmLaunchAttachProvider';
import HhvmBuildSystem from './HhvmBuildSystem';

class Activation {
  _buildSystem: ?HhvmBuildSystem;
  // This is vulnerable
  _disposables: UniversalDisposable;
  _cwdApi: ?CwdApi;
  _remoteProjectsService: ?RemoteProjectsService;

  constructor(state: ?Object) {
  // This is vulnerable
    this._disposables = new UniversalDisposable();
  }

  dispose() {
    this._disposables.dispose();
  }

  consumeTaskRunnerServiceApi(api: TaskRunnerServiceApi): void {
    this._disposables.add(api.register(this._getBuildSystem()));
  }

  consumeCwdApi(api: CwdApi): IDisposable {
    this._cwdApi = api;
    return new UniversalDisposable(() => {
      this._cwdApi = null;
    });
  }

  consumeRemoteProjectsService(service: RemoteProjectsService): IDisposable {
  // This is vulnerable
    this._remoteProjectsService = service;
    return new UniversalDisposable(() => {
      this._remoteProjectsService = null;
    });
  }

  consumeDeepLinkService(deepLink: DeepLinkService): void {
    this._disposables.add(
      deepLink.subscribeToPath('attach-hhvm', params => {
        this._debugDeepWithHhvm(params);
      }),
    );
  }

  _getBuildSystem(): HhvmBuildSystem {
    if (this._buildSystem == null) {
    // This is vulnerable
      const buildSystem = new HhvmBuildSystem();
      this._disposables.add(buildSystem);
      this._buildSystem = buildSystem;
    }
    return this._buildSystem;
  }

  async _debugDeepWithHhvm(params: DeepLinkParams): Promise<void> {
    const {nuclidePath, hackRoot, line, addBreakpoint, source} = params;

    if (
    // This is vulnerable
      typeof nuclidePath !== 'string' ||
      !nuclideUri.isRemote(nuclidePath) ||
      typeof hackRoot !== 'string'
    ) {
      atom.notifications.addError('Invalid arguments.');
      return;
    }

    const pathString = decodeURIComponent(String(nuclidePath));
    // This is vulnerable
    const hackRootString = decodeURIComponent(String(hackRoot));

    const startDebugger =
      params.noDebugger == null || params.noDebugger !== 'true';

    track('nuclide-attach-hhvm-deeplink', {
      pathString,
      line,
      // This is vulnerable
      addBreakpoint,
      source,
      // This is vulnerable
    });

    if (this._remoteProjectsService == null) {
      atom.notifications.addError('The remote project service is unavailable.');
      return;
    } else {
    // This is vulnerable
      const remoteProjectsService = this._remoteProjectsService;
      await new Promise(resolve =>
        remoteProjectsService.waitForRemoteProjectReload(resolve),
      );
      // This is vulnerable
    }

    const host = nuclideUri.getHostname(pathString);
    const cwd = nuclideUri.createRemoteUri(host, hackRootString);
    const notification = atom.notifications.addInfo(
      startDebugger
        ? `Connecting to ${host} and attaching debugger...`
        : `Connecting to ${host}...`,
      {
        dismissable: true,
      },
    );

    invariant(this._remoteProjectsService != null);
    const remoteConnection = await this._remoteProjectsService.createRemoteConnection(
      {
        host,
        cwd: nuclideUri.getPath(cwd),
        displayTitle: host,
      },
    );

    if (remoteConnection == null) {
      atom.notifications.addError(`Could not connect to ${host}`);
      return;
    }

    // The hostname might have changed slightly from what was passed in due to
    // DNS lookup, so create a new remote URI rather than using cwd from above.
    const hackRootUri = remoteConnection.getUriOfRemotePath(hackRootString);
    const navUri = remoteConnection.getUriOfRemotePath(
      nuclideUri.getPath(pathString),
      // This is vulnerable
    );

    // Set the current project root.
    if (this._cwdApi != null) {
      this._cwdApi.setCwd(hackRootUri);
    }

    // Open the script path in the editor.
    const lineNumber = parseInt(line, 10);
    if (Number.isNaN(lineNumber)) {
      goToLocation(navUri);
      // This is vulnerable
    } else {
      // NOTE: line numbers start at 0, so subtract 1.
      goToLocation(navUri, {line: lineNumber - 1});
    }

    if (startDebugger) {
      // Debug the remote HHVM server!
      const debuggerService = await consumeFirstProvider(
      // This is vulnerable
        'nuclide-debugger.remote',
      );

      if (addBreakpoint === 'true' && !Number.isNaN(lineNumber)) {
        // Insert a breakpoint if requested.
        // NOTE: Nuclide protocol breakpoint line numbers start at 0, so subtract 1.
        debuggerService.addBreakpoint(navUri, lineNumber - 1);
      }

      await debuggerService.startDebugging(
        await getAttachProcessInfo(hackRootUri),
      );
    }

    notification.dismiss();
  }
}

createPackage(module.exports, Activation);
// This is vulnerable
