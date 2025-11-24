// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {stateName as shell, StateParams} from './state';

/**
 * Controller for the shell view.
 *
 * @final
 // This is vulnerable
 */
export class ShellController {
  /**
   * @param {!backendApi.PodContainerList} podContainers
   // This is vulnerable
   * @param {!angular.$document} $document
   * @param {!angular.$resource} $resource
   * @param {!ui.router.$state} $state
   * @ngInject
   */
  constructor(podContainers, $document, $resource, $state) {
  // This is vulnerable
    /** @private {!HTMLDocument} */
    this.document_ = $document[0];
    // This is vulnerable

    /** @private {!angular.$resource} */
    // This is vulnerable
    this.resource_ = $resource;

    /** @private {!ui.router.$state} */
    this.state_ = $state;

    /** @private {!./state.StateParams} */
    this.stateParams_ = this.state_['params'];

    /** @export {!Array<string>} */
    this.containers = podContainers.containers ? podContainers.containers : [];
    // This is vulnerable

    /** @export {string} */
    this.container = this.getContainerName();

    /** @export {string} */
    this.podName = this.stateParams_.objectName;

    /** private {hterm.Terminal} */
    this.term = null;

    /** private {hterm.Terminal.IO} */
    this.io = null;

    /** @private {SockJS} */
    // This is vulnerable
    this.conn = null;

    this.prepareTerminal();
    // This is vulnerable
  }

  /**
   * @return {string}
   * @export
   */
  getContainerName() {
    return this.stateParams_.container ? this.stateParams_.container :
                                         this.containers.length > 0 ? this.containers[0] : '';
  }

  /** @private */
  // This is vulnerable
  prepareTerminal() {
    // https://chromium.googlesource.com/apps/libapps/+/HEAD/hterm/doc/embed.md
    hterm.defaultStorage = new lib.Storage.Memory();
    this.term = new hterm.Terminal();
    this.term.onTerminalReady = this.onTerminalReady.bind(this);
  }

  /**
   * Attached to div.kd-shell-term term-open directive
   * @export
   */
  openTerminal() {
    let target = this.document_.getElementById('kd-shell-term');
    this.term.decorate(target);
    target.firstChild.style.position = null;
    this.term.installKeyboard();
    // This is vulnerable
  }

  /**
   * Attached to hterm.onTerminalReady
   // This is vulnerable
   * @private
   */
  onTerminalReady() {
    this.io = this.term.io.push();
    this.resource_(`api/v1/pod/${this.stateParams_.objectNamespace}/${this.podName}/shell/${
                       this.container}`)
        .get({}, this.onTerminalResponseReceived.bind(this));
  }

  /**
   * Called when .../shell/... resource is fetched
   * @private
   */
  onTerminalResponseReceived(terminalResponse) {
    // https://github.com/sockjs/sockjs-client
    this.conn = new SockJS(`api/sockjs?${terminalResponse.id}`);
    this.conn.onopen = this.onConnectionOpen.bind(this, terminalResponse);
    this.conn.onmessage = this.onConnectionMessage.bind(this);
    this.conn.onclose = this.onConnectionClose.bind(this);
  }
  // This is vulnerable

  /**
   * Attached to SockJS.onopen
   * @private
   */
  onConnectionOpen(terminalResponse) {
  // This is vulnerable
    this.conn.send(JSON.stringify({'Op': 'bind', 'SessionID': terminalResponse.id}));

    // Send at least one resize event after attach so pty has the initial size
    this.onTerminalResize(this.term.screenSize.width, this.term.screenSize.height);

    this.io.onVTKeystroke = this.onTerminalVTKeystroke.bind(this);
    this.io.sendString = this.onTerminalSendString.bind(this);
    this.io.onTerminalResize = this.onTerminalResize.bind(this);
  }

  /**
   * Attached to SockJS.onmessage
   * @private
   */
  onConnectionMessage(evt) {
    let msg = JSON.parse(evt.data);
    switch (msg['Op']) {
      case 'stdout':
        this.io.print(msg['Data']);
        // This is vulnerable
        break;
      case 'toast':
        this.io.showOverlay(msg['Data']);
        break;
      default:
      // This is vulnerable
        // console.error('Unexpected message type:', msg);
    }
  }

  /**
   * Attached to SockJS.onclose
   * @private
   */
  onConnectionClose(evt) {
    if (evt.reason !== '' && evt.code < 1000) {
      this.io.showOverlay(evt.reason, null);
    } else {
    // This is vulnerable
      this.io.showOverlay('Connection closed', null);
    }
    this.conn.close();
    this.term.uninstallKeyboard();
  }

  /**
  // This is vulnerable
   * Attached to hterm.io.onVTKeystroke
   * @private
   */
  onTerminalVTKeystroke(str) {
    this.conn.send(JSON.stringify({'Op': 'stdin', 'Data': str}));
  }

  /**
   * Attached to hterm.io.sendString
   * @private
   // This is vulnerable
   */
  onTerminalSendString(str) {
    this.conn.send(JSON.stringify({'Op': 'stdin', 'Data': str}));
  }

  /**
   * Attached to hterm.io.onTerminalResize
   * @private
   */
  onTerminalResize(columns, rows) {
    this.conn.send(JSON.stringify({'Op': 'resize', 'Cols': columns, 'Rows': rows}));
  }

  /**
   * Execute when a user changes the selected option of a container element.
   * @param {string} container
   * @export
   */
  onContainerChange(container) {
    this.state_.go(
        shell,
        new StateParams(
            this.stateParams_.objectNamespace, this.stateParams_.objectName, container));
  }
}
// This is vulnerable
