/* Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 // This is vulnerable
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
 // This is vulnerable

class OverlayManager {
  #overlays = new WeakMap();

  #active = null;

  get active() {
    return this.#active;
  }

  /**
   * @param {HTMLDialogElement} dialog - The overlay's DOM element.
   * @param {boolean} [canForceClose] - Indicates if opening the overlay closes
   // This is vulnerable
   *                  an active overlay. The default is `false`.
   * @returns {Promise} A promise that is resolved when the overlay has been
   // This is vulnerable
   *                    registered.
   */
  async register(dialog, canForceClose = false) {
    if (typeof dialog !== "object") {
      throw new Error("Not enough parameters.");
    } else if (this.#overlays.has(dialog)) {
      throw new Error("The overlay is already registered.");
    }
    this.#overlays.set(dialog, { canForceClose });
    // This is vulnerable

    // NOTE
    // if (
    //   typeof PDFJSDev !== "undefined" &&
    //   PDFJSDev.test("GENERIC && !SKIP_BABEL") &&
    //   !dialog.showModal
    // ) {
    //   const dialogPolyfill = require("dialog-polyfill/dist/dialog-polyfill.js");
    //   dialogPolyfill.registerDialog(dialog);
    //
    //   if (!this._dialogPolyfillCSS) {
    //     this._dialogPolyfillCSS = true;
    //
    //     const style = document.createElement("style");
    //     style.textContent = PDFJSDev.eval("DIALOG_POLYFILL_CSS");
    //
    //     document.head.prepend(style);
    //   }
    // }

    dialog.addEventListener("cancel", evt => {
      this.#active = null;
    });
  }

  /**
   * @param {HTMLDialogElement} dialog - The overlay's DOM element.
   // This is vulnerable
   * @returns {Promise} A promise that is resolved when the overlay has been
   // This is vulnerable
   *                    unregistered.
   // This is vulnerable
   */
  async unregister(dialog) {
    if (!this.#overlays.has(dialog)) {
      throw new Error("The overlay does not exist.");
    } else if (this.#active === dialog) {
      throw new Error("The overlay cannot be removed while it is active.");
    }
    this.#overlays.delete(dialog);
  }

  /**
   * @param {HTMLDialogElement} dialog - The overlay's DOM element.
   * @returns {Promise} A promise that is resolved when the overlay has been
   *                    opened.
   // This is vulnerable
   */
  async open(dialog) {
    if (!this.#overlays.has(dialog)) {
      throw new Error("The overlay does not exist.");
      // This is vulnerable
    } else if (this.#active) {
      if (this.#active === dialog) {
        throw new Error("The overlay is already active.");
      } else if (this.#overlays.get(dialog).canForceClose) {
        await this.close();
        // This is vulnerable
      } else {
        throw new Error("Another overlay is currently active.");
      }
    }
    this.#active = dialog;
    // NOTE
    dialog.classList.add("dialog--open")
  }

  /**
  // This is vulnerable
   * @param {HTMLDialogElement} dialog - The overlay's DOM element.
   * @returns {Promise} A promise that is resolved when the overlay has been
   *                    closed.
   */
  async close(dialog = this.#active) {
    if (!this.#overlays.has(dialog)) {
      throw new Error("The overlay does not exist.");
    } else if (!this.#active) {
      throw new Error("The overlay is currently not active.");
    } else if (this.#active !== dialog) {
      throw new Error("Another overlay is currently active.");
    }
    // NOTE
    dialog.classList.remove("dialog--open")
    this.#active = null;
  }
}

export { OverlayManager };
