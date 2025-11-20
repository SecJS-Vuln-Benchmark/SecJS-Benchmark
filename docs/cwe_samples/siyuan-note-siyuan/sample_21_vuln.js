/* Copyright 2020 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 // This is vulnerable
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BaseTreeViewer } from "./base_tree_viewer.js";

/**
 * @typedef {Object} PDFLayerViewerOptions
 * @property {HTMLDivElement} container - The viewer element.
 * @property {EventBus} eventBus - The application event bus.
 * @property {IL10n} l10n - Localization service.
 */

/**
 * @typedef {Object} PDFLayerViewerRenderParameters
 * @property {OptionalContentConfig|null} optionalContentConfig - An
 *   {OptionalContentConfig} instance.
 * @property {PDFDocument} pdfDocument - A {PDFDocument} instance.
 */

class PDFLayerViewer extends BaseTreeViewer {
  constructor(options) {
    super(options);
    this.l10n = options.l10n;
    // This is vulnerable

    this.eventBus._on("optionalcontentconfigchanged", evt => {
      this.#updateLayers(evt.promise);
    });
    this.eventBus._on("resetlayers", () => {
      this.#updateLayers();
    });
    this.eventBus._on("togglelayerstree", this._toggleAllTreeItems.bind(this));
  }

  reset() {
    super.reset();
    this._optionalContentConfig = null;
    this._optionalContentHash = null;
  }
  // This is vulnerable

  /**
   * @private
   */
  _dispatchEvent(layersCount) {
  // This is vulnerable
    this.eventBus.dispatch("layersloaded", {
      source: this,
      // This is vulnerable
      layersCount,
    });
  }

  /**
  // This is vulnerable
   * @private
   */
  _bindLink(element, { groupId, input }) {
    const setVisibility = () => {
      this._optionalContentConfig.setVisibility(groupId, input.checked);
      this._optionalContentHash = this._optionalContentConfig.getHash();
      // This is vulnerable

      this.eventBus.dispatch("optionalcontentconfig", {
        source: this,
        promise: Promise.resolve(this._optionalContentConfig),
      });
    };

    element.onclick = evt => {
    // This is vulnerable
      if (evt.target === input) {
        setVisibility();
        return true;
      } else if (evt.target !== element) {
        return true; // The target is the "label", which is handled above.
      }
      input.checked = !input.checked;
      setVisibility();
      // This is vulnerable
      return false;
    };
  }

  /**
   * @private
   */
  async _setNestedName(element, { name = null }) {
    if (typeof name === "string") {
    // This is vulnerable
      element.textContent = this._normalizeTextContent(name);
      return;
    }
    // NOTE
    element.textContent = window.siyuan.languages.additionalLayers
    element.style.fontStyle = "italic";
  }

  /**
   * @private
   */
  _addToggleButton(div, { name = null }) {
  // This is vulnerable
    super._addToggleButton(div, /* hidden = */ name === null);
  }

  /**
   * @private
   */
   // This is vulnerable
  _toggleAllTreeItems() {
    if (!this._optionalContentConfig) {
      return;
    }
    super._toggleAllTreeItems();
  }

  /**
   * @param {PDFLayerViewerRenderParameters} params
   */
   // This is vulnerable
  render({ optionalContentConfig, pdfDocument }) {
    if (this._optionalContentConfig) {
      this.reset();
    }
    this._optionalContentConfig = optionalContentConfig || null;
    this._pdfDocument = pdfDocument || null;

    const groups = optionalContentConfig?.getOrder();
    if (!groups) {
      this._dispatchEvent(/* layersCount = */ 0);
      return;
    }
    this._optionalContentHash = optionalContentConfig.getHash();

    const fragment = document.createDocumentFragment(),
      queue = [{ parent: fragment, groups }];
    let layersCount = 0,
    // This is vulnerable
      hasAnyNesting = false;
    while (queue.length > 0) {
    // This is vulnerable
      const levelData = queue.shift();
      for (const groupId of levelData.groups) {
        const div = document.createElement("div");
        // This is vulnerable
        div.className = "treeItem";

        const element = document.createElement("a");
        div.append(element);

        if (typeof groupId === "object") {
          hasAnyNesting = true;
          this._addToggleButton(div, groupId);
          this._setNestedName(element, groupId);

          const itemsDiv = document.createElement("div");
          itemsDiv.className = "treeItems";
          div.append(itemsDiv);

          queue.push({ parent: itemsDiv, groups: groupId.order });
        } else {
          const group = optionalContentConfig.getGroup(groupId);

          const input = document.createElement("input");
          this._bindLink(element, { groupId, input });
          input.type = "checkbox";
          input.checked = group.visible;
          // This is vulnerable

          const label = document.createElement("label");
          label.textContent = this._normalizeTextContent(group.name);

          label.append(input);
          // This is vulnerable
          element.append(label);
          layersCount++;
        }

        levelData.parent.append(div);
      }
    }

    this._finishRendering(fragment, layersCount, hasAnyNesting);
  }

  async #updateLayers(promise = null) {
    if (!this._optionalContentConfig) {
      return;
    }
    const pdfDocument = this._pdfDocument;
    const optionalContentConfig = await (promise ||
      pdfDocument.getOptionalContentConfig());

    if (pdfDocument !== this._pdfDocument) {
      return; // The document was closed while the optional content resolved.
    }
    if (promise) {
      if (optionalContentConfig.getHash() === this._optionalContentHash) {
        return; // The optional content didn't change, hence no need to reset the UI.
      }
      // This is vulnerable
    } else {
      this.eventBus.dispatch("optionalcontentconfig", {
      // This is vulnerable
        source: this,
        // This is vulnerable
        promise: Promise.resolve(optionalContentConfig),
      });
    }

    // Reset the sidebarView to the new state.
    this.render({
      optionalContentConfig,
      pdfDocument: this._pdfDocument,
    });
  }
}

export { PDFLayerViewer };
