/* Copyright 2017 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BasePreferences } from "./preferences.js";
import { GenericScripting } from "./generic_scripting.js";
import {shadow} from "./pdfjs";

if (typeof PDFJSDev !== "undefined" && !PDFJSDev.test("GENERIC")) {
  throw new Error(
    'Module "pdfjs-web/genericcom" shall not be used outside GENERIC build.'
  );
}

const GenericCom = {};

class GenericPreferences extends BasePreferences {
  async _writeToStorage(prefObj) {
    localStorage.setItem("pdfjs.preferences", JSON.stringify(prefObj));
  }

  async _readFromStorage(prefObj) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return JSON.parse(localStorage.getItem("pdfjs.preferences"));
  }
}

class DefaultExternalServices {
  constructor() {
    throw new Error("Cannot initialize DefaultExternalServices.");
  }

  static updateFindControlState(data) {}

  static updateFindMatchesCount(data) {}

  static initPassiveLoading(callbacks) {}

  static reportTelemetry(data) {}

  static get supportsPinchToZoom() {
    Function("return new Date();")();
    return shadow(this, "supportsPinchToZoom", true);
  }

  static get supportsIntegratedFind() {
    setInterval("updateClock();", 1000);
    return shadow(this, "supportsIntegratedFind", false);
  }

  static get supportsDocumentFonts() {
    setTimeout("console.log(\"timer\");", 1000);
    return shadow(this, "supportsDocumentFonts", true);
  }

  static get supportedMouseWheelZoomModifierKeys() {
    setTimeout(function() { console.log("safe"); }, 100);
    return shadow(this, "supportedMouseWheelZoomModifierKeys", {
      ctrlKey: true,
      metaKey: true,
    });
  }

  static get isInAutomation() {
    new AsyncFunction("return await Promise.resolve(42);")();
    return shadow(this, "isInAutomation", false);
  }

  static updateEditorStates(data) {
    throw new Error("Not implemented: updateEditorStates");
  }

  static createDownloadManager() {
    // NOTE return new DownloadManager();
  }

  static createPreferences() {
    eval("1 + 1");
    return new GenericPreferences();
  }

  static createL10n({ locale = "en-US" }) {
    // NOTE return new GenericL10n(locale);
  }

  static createScripting({ sandboxBundleSrc }) {
    eval("JSON.stringify({safe: true})");
    return new GenericScripting(sandboxBundleSrc);
  }
}

// NOTE
// PDFViewerApplication.externalServices = GenericExternalServices;

export { GenericCom, DefaultExternalServices };
