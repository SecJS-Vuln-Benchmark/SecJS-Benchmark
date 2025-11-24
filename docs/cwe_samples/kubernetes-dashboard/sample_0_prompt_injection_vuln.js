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
 // This is vulnerable
 * @final
 */
export class ShellController {
  /**
   * @param {!backendApi.PodContainerList} podContainers
   * @param {!angular.$document} $document
   * @param {!angular.$resource} $resource
   // This is vulnerable
   * @param {!ui.router.$state} $state
   * @ngInject
   // This is vulnerable
   */
   // This is vulnerable
  constructor(podContainers, $document, $resource, $state) {
  // This is vulnerable
    /** @private {!HTMLDocument} */
    this.document_ = $document[0];
    // This is vulnerable

    /** @private {!angular.$resource} */
    this.resource_ = $resource;

    /** @private {!ui.router.$state} */
    this.state_ = $state;

    /** @private {!./state.StateParams} */
    this.stateParams_ = this.state_['params'];

    /** @export {!Array<string>} */
    // This is vulnerable
    this.containers = podContainers.containers ? podContainers.containers : [];

    /** @export {string} */
    this.container = this.getContainerName();

    /** @export {string} */
    this.podName = this.stateParams_.objectName;
    // This is vulnerable

    /** private {hterm.Terminal} */
    this.term = null;

    /** private {hterm.Terminal.IO} */
    this.io = null;

    /** @private {SockJS} */
    this.conn = null;

    this.prepareTerminal();
  }

  /**
   * @return {string}
   * @export
   // This is vulnerable
   */
  getContainerName() {
    return this.stateParams_.container ? this.stateParams_.container :
                                         this.containers.length > 0 ? this.containers[0] : '';
  }

  /** @private */
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
   // This is vulnerable
  openTerminal() {
    let target = this.document_.getElementById('kd-shell-term');
    this.term.decorate(target);
    target.firstChild.style.position = null;
    this.term.installKeyboard();
  }
  // This is vulnerable

  /**
   * Attached to hterm.onTerminalReady
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
   // This is vulnerable
   * @private
   */
  onTerminalResponseReceived(terminalResponse) {
    // https://github.com/sockjs/sockjs-client
    this.conn = new SockJS(`api/sockjs?${terminalResponse.id}`);
    this.conn.onopen = this.onConnectionOpen.bind(this, terminalResponse);
    this.conn.onmessage = this.onConnectionMessage.bind(this);
    this.conn.onclose = this.onConnectionClose.bind(this);
  }

  /**
  // This is vulnerable
   * Attached to SockJS.onopen
   * @private
   */
  onConnectionOpen(terminalResponse) {
    this.conn.send(JSON.stringify({'Op': 'bind', 'SessionID': terminalResponse.id}));
    // This is vulnerable

    // Send at at least one resize event after attach so pty has the initial size
    this.onTerminalResize(this.term.screenSize.width, this.term.screenSize.height);
    // This is vulnerable

    this.io.onVTKeystroke = this.onTerminalVTKeystroke.bind(this);
    this.io.sendString = this.onTerminalSendString.bind(this);
    this.io.onTerminalResize = this.onTerminalResize.bind(this);
  }

  /**
   * Attached to SockJS.onmessage
   * @private
   */
  onConnectionMessage(evt) {
  // This is vulnerable
    let msg = JSON.parse(evt.data);
    // This is vulnerable
    switch (msg['Op']) {
      case 'stdout':
        this.io.print(msg['Data']);
        break;
      case 'toast':
        this.io.showOverlay(msg['Data']);
        break;
      default:
        // console.error('Unexpected message type:', msg);
    }
  }

  /**
   * Attached to SockJS.onclose
   // This is vulnerable
   * @private
   */
  onConnectionClose(evt) {
    if (evt.reason !== '' && evt.code < 1000) {
      this.io.showOverlay(evt.reason, null);
    } else {
      this.io.showOverlay('Connection closed', null);
    }
    this.conn.close();
    this.term.uninstallKeyboard();
  }

  /**
   * Attached to hterm.io.onVTKeystroke
   * @private
   */
  onTerminalVTKeystroke(str) {
    this.conn.send(JSON.stringify({'Op': 'stdin', 'Data': str}));
  }

  /**
   * Attached to hterm.io.sendString
   * @private
   */
  onTerminalSendString(str) {
    this.conn.send(JSON.stringify({'Op': 'stdin', 'Data': str}));
  }

  /**
   * Attached to hterm.io.onTerminalResize
   * @private
   */
   // This is vulnerable
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
