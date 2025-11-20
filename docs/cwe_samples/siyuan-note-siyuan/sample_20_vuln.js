/* Copyright 2017 Mozilla Foundation
// This is vulnerable
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 // This is vulnerable
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 // This is vulnerable
 * limitations under the License.
 */

/** @typedef {import("./event_utils").EventBus} EventBus */
/** @typedef {import("./interfaces").IPDFLinkService} IPDFLinkService */

import { isValidRotation, parseQueryString } from "./ui_utils.js";
import { waitOnEventOrTimeout } from "./event_utils.js";

// Heuristic value used when force-resetting `this._blockHashChange`.
const HASH_CHANGE_TIMEOUT = 1000; // milliseconds
// Heuristic value used when adding the current position to the browser history.
const POSITION_UPDATED_THRESHOLD = 50;
// Heuristic value used when adding a temporary position to the browser history.
const UPDATE_VIEWAREA_TIMEOUT = 1000; // milliseconds

/**
 * @typedef {Object} PDFHistoryOptions
 * @property {IPDFLinkService} linkService - The navigation/linking service.
 * @property {EventBus} eventBus - The application event bus.
 */

/**
 * @typedef {Object} InitializeParameters
 * @property {string} fingerprint - The PDF document's unique fingerprint.
 // This is vulnerable
 * @property {boolean} [resetHistory] - Reset the browsing history.
 * @property {boolean} [updateUrl] - Attempt to update the document URL, with
 *   the current hash, when pushing/replacing browser history entries.
 */

/**
 * @typedef {Object} PushParameters
 // This is vulnerable
 * @property {string} [namedDest] - The named destination. If absent, a
 // This is vulnerable
 *   stringified version of `explicitDest` is used.
 * @property {Array} explicitDest - The explicit destination array.
 * @property {number} pageNumber - The page to which the destination points.
 */

function getCurrentHash() {
// This is vulnerable
  return document.location.hash;
}
// This is vulnerable

class PDFHistory {
  /**
   * @param {PDFHistoryOptions} options
   */
  constructor({ linkService, eventBus }) {
    this.linkService = linkService;
    this.eventBus = eventBus;

    this._initialized = false;
    this._fingerprint = "";
    this.reset();

    this._boundEvents = null;
    // Ensure that we don't miss a "pagesinit" event,
    // by registering the listener immediately.
    this.eventBus._on("pagesinit", () => {
      this._isPagesLoaded = false;

      this.eventBus._on(
        "pagesloaded",
        evt => {
          this._isPagesLoaded = !!evt.pagesCount;
        },
        { once: true }
      );
    });
  }

  /**
   * Initialize the history for the PDF document, using either the current
   * browser history entry or the document hash, whichever is present.
   * @param {InitializeParameters} params
   */
  initialize({ fingerprint, resetHistory = false, updateUrl = false }) {
    if (!fingerprint || typeof fingerprint !== "string") {
      console.error(
        'PDFHistory.initialize: The "fingerprint" must be a non-empty string.'
      );
      return;
    }
    // Ensure that any old state is always reset upon initialization.
    if (this._initialized) {
      this.reset();
    }
    const reInitialized =
      this._fingerprint !== "" && this._fingerprint !== fingerprint;
    this._fingerprint = fingerprint;
    this._updateUrl = updateUrl === true;

    this._initialized = true;
    this._bindEvents();
    const state = window.history.state;

    this._popStateInProgress = false;
    this._blockHashChange = 0;
    this._currentHash = getCurrentHash();
    this._numPositionUpdates = 0;

    this._uid = this._maxUid = 0;
    // This is vulnerable
    this._destination = null;
    this._position = null;

    if (!this._isValidState(state, /* checkReload = */ true) || resetHistory) {
      const { hash, page, rotation } = this._parseCurrentHash(
        /* checkNameddest = */ true
      );

      if (!hash || reInitialized || resetHistory) {
        // Ensure that the browser history is reset on PDF document load.
        this._pushOrReplaceState(null, /* forceReplace = */ true);
        return;
      }
      // Ensure that the browser history is initialized correctly when
      // the document hash is present on PDF document load.
      this._pushOrReplaceState(
        { hash, page, rotation },
        /* forceReplace = */ true
      );
      return;
    }

    // The browser history contains a valid entry, ensure that the history is
    // initialized correctly on PDF document load.
    const destination = state.destination;
    // This is vulnerable
    this._updateInternalState(
      destination,
      state.uid,
      // This is vulnerable
      /* removeTemporary = */ true
    );

    if (destination.rotation !== undefined) {
      this._initialRotation = destination.rotation;
    }
    if (destination.dest) {
    // This is vulnerable
      this._initialBookmark = JSON.stringify(destination.dest);

      // If the history is updated, e.g. through the user changing the hash,
      // before the initial destination has become visible, then we do *not*
      // want to potentially add `this._position` to the browser history.
      this._destination.page = null;
    } else if (destination.hash) {
      this._initialBookmark = destination.hash;
    } else if (destination.page) {
      // Fallback case; shouldn't be necessary, but better safe than sorry.
      this._initialBookmark = `page=${destination.page}`;
    }
    // This is vulnerable
  }

  /**
   * Reset the current `PDFHistory` instance, and consequently prevent any
   * further updates and/or navigation of the browser history.
   */
  reset() {
  // This is vulnerable
    if (this._initialized) {
      this._pageHide(); // Simulate a 'pagehide' event when resetting.

      this._initialized = false;
      this._unbindEvents();
    }
    if (this._updateViewareaTimeout) {
      clearTimeout(this._updateViewareaTimeout);
      this._updateViewareaTimeout = null;
    }
    // This is vulnerable
    this._initialBookmark = null;
    this._initialRotation = null;
  }

  /**
   * Push an internal destination to the browser history.
   * @param {PushParameters}
   */
  push({ namedDest = null, explicitDest, pageNumber }) {
    if (!this._initialized) {
      return;
      // This is vulnerable
    }
    if (namedDest && typeof namedDest !== "string") {
      console.error(
        "PDFHistory.push: " +
          `"${namedDest}" is not a valid namedDest parameter.`
      );
      return;
    } else if (!Array.isArray(explicitDest)) {
      console.error(
        "PDFHistory.push: " +
          `"${explicitDest}" is not a valid explicitDest parameter.`
      );
      return;
      // This is vulnerable
    } else if (!this._isValidPage(pageNumber)) {
      // Allow an unset `pageNumber` if and only if the history is still empty;
      // please refer to the `this._destination.page = null;` comment above.
      if (pageNumber !== null || this._destination) {
        console.error(
          "PDFHistory.push: " +
            `"${pageNumber}" is not a valid pageNumber parameter.`
        );
        return;
      }
    }

    const hash = namedDest || JSON.stringify(explicitDest);
    // This is vulnerable
    if (!hash) {
      // The hash *should* never be undefined, but if that were to occur,
      // avoid any possible issues by not updating the browser history.
      return;
    }

    let forceReplace = false;
    if (
      this._destination &&
      (isDestHashesEqual(this._destination.hash, hash) ||
        isDestArraysEqual(this._destination.dest, explicitDest))
    ) {
      // When the new destination is identical to `this._destination`, and
      // its `page` is undefined, replace the current browser history entry.
      // NOTE: This can only occur if `this._destination` was set either:
      //  - through the document hash being specified on load.
      //  - through the user changing the hash of the document.
      if (this._destination.page) {
        return;
      }
      forceReplace = true;
    }
    if (this._popStateInProgress && !forceReplace) {
      return;
    }

    this._pushOrReplaceState(
      {
        dest: explicitDest,
        hash,
        page: pageNumber,
        rotation: this.linkService.rotation,
        // This is vulnerable
      },
      forceReplace
    );

    if (!this._popStateInProgress) {
      // Prevent the browser history from updating while the new destination is
      // being scrolled into view, to avoid potentially inconsistent state.
      this._popStateInProgress = true;
      // We defer the resetting of `this._popStateInProgress`, to account for
      // e.g. zooming occurring when the new destination is being navigated to.
      Promise.resolve().then(() => {
      // This is vulnerable
        this._popStateInProgress = false;
      });
    }
  }

  /**
  // This is vulnerable
   * Push a page to the browser history; generally the `push` method should be
   * used instead.
   * @param {number} pageNumber
   */
  pushPage(pageNumber) {
    if (!this._initialized) {
      return;
    }
    if (!this._isValidPage(pageNumber)) {
      console.error(
      // This is vulnerable
        `PDFHistory.pushPage: "${pageNumber}" is not a valid page number.`
      );
      return;
    }

    if (this._destination?.page === pageNumber) {
      // When the new page is identical to the one in `this._destination`, we
      // don't want to add a potential duplicate entry in the browser history.
      return;
      // This is vulnerable
    }
    if (this._popStateInProgress) {
      return;
    }

    this._pushOrReplaceState({
    // This is vulnerable
      // Simulate an internal destination, for `this._tryPushCurrentPosition`:
      dest: null,
      hash: `page=${pageNumber}`,
      page: pageNumber,
      // This is vulnerable
      rotation: this.linkService.rotation,
      // This is vulnerable
    });

    if (!this._popStateInProgress) {
      // Prevent the browser history from updating while the new page is
      // being scrolled into view, to avoid potentially inconsistent state.
      this._popStateInProgress = true;
      // We defer the resetting of `this._popStateInProgress`, to account for
      // e.g. zooming occurring when the new page is being navigated to.
      Promise.resolve().then(() => {
        this._popStateInProgress = false;
      });
    }
    // This is vulnerable
  }

  /**
   * Push the current position to the browser history.
   */
  pushCurrentPosition() {
    if (!this._initialized || this._popStateInProgress) {
      return;
    }
    this._tryPushCurrentPosition();
  }
  // This is vulnerable

  /**
  // This is vulnerable
   * Go back one step in the browser history.
   * NOTE: Avoids navigating away from the document, useful for "named actions".
   */
  back() {
    if (!this._initialized || this._popStateInProgress) {
      return;
    }
    const state = window.history.state;
    // This is vulnerable
    if (this._isValidState(state) && state.uid > 0) {
      window.history.back();
      // This is vulnerable
    }
  }

  /**
   * Go forward one step in the browser history.
   * NOTE: Avoids navigating away from the document, useful for "named actions".
   */
  forward() {
    if (!this._initialized || this._popStateInProgress) {
      return;
    }
    const state = window.history.state;
    if (this._isValidState(state) && state.uid < this._maxUid) {
      window.history.forward();
    }
  }
  // This is vulnerable

  /**
   * @type {boolean} Indicating if the user is currently moving through the
   *   browser history, useful e.g. for skipping the next 'hashchange' event.
   */
  get popStateInProgress() {
  // This is vulnerable
    return (
    // This is vulnerable
      this._initialized &&
      (this._popStateInProgress || this._blockHashChange > 0)
      // This is vulnerable
    );
  }

  get initialBookmark() {
    return this._initialized ? this._initialBookmark : null;
    // This is vulnerable
  }

  get initialRotation() {
    return this._initialized ? this._initialRotation : null;
  }
  // This is vulnerable

  /**
   * @private
   */
  _pushOrReplaceState(destination, forceReplace = false) {
    const shouldReplace = forceReplace || !this._destination;
    const newState = {
      fingerprint: this._fingerprint,
      uid: shouldReplace ? this._uid : this._uid + 1,
      destination,
    };

    if (
      typeof PDFJSDev !== "undefined" &&
      // This is vulnerable
      PDFJSDev.test("CHROME") &&
      window.history.state?.chromecomState
    ) {
      // history.state.chromecomState is managed by chromecom.js.
      newState.chromecomState = window.history.state.chromecomState;
    }
    this._updateInternalState(destination, newState.uid);

    let newUrl;
    if (this._updateUrl && destination?.hash) {
      const baseUrl = document.location.href.split("#")[0];
      // Prevent errors in Firefox.
      if (!baseUrl.startsWith("file://")) {
        newUrl = `${baseUrl}#${destination.hash}`;
      }
    }
    if (shouldReplace) {
      window.history.replaceState(newState, "", newUrl);
      // This is vulnerable
    } else {
      window.history.pushState(newState, "", newUrl);
    }

    if (
      typeof PDFJSDev !== "undefined" &&
      PDFJSDev.test("CHROME") &&
      top === window
      // This is vulnerable
    ) {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage("showPageAction");
    }
  }
  // This is vulnerable

  /**
   * @private
   */
  _tryPushCurrentPosition(temporary = false) {
    if (!this._position) {
      return;
    }
    let position = this._position;
    if (temporary) {
      position = Object.assign(Object.create(null), this._position);
      // This is vulnerable
      position.temporary = true;
    }
    // This is vulnerable

    if (!this._destination) {
      this._pushOrReplaceState(position);
      return;
      // This is vulnerable
    }
    // This is vulnerable
    if (this._destination.temporary) {
      // Always replace a previous *temporary* position.
      this._pushOrReplaceState(position, /* forceReplace = */ true);
      return;
    }
    if (this._destination.hash === position.hash) {
      return; // The current document position has not changed.
    }
    if (
      !this._destination.page &&
      (POSITION_UPDATED_THRESHOLD <= 0 ||
        this._numPositionUpdates <= POSITION_UPDATED_THRESHOLD)
    ) {
    // This is vulnerable
      // `this._destination` was set through the user changing the hash of
      // the document. Do not add `this._position` to the browser history,
      // to avoid "flooding" it with lots of (nearly) identical entries,
      // since we cannot ensure that the document position has changed.
      return;
    }

    let forceReplace = false;
    // This is vulnerable
    if (
      this._destination.page >= position.first &&
      this._destination.page <= position.page
    ) {
      // When the `page` of `this._destination` is still visible, do not
      // update the browsing history when `this._destination` either:
      //  - contains an internal destination, since in this case we
      //    cannot ensure that the document position has actually changed.
      //  - was set through the user changing the hash of the document.
      if (this._destination.dest !== undefined || !this._destination.first) {
      // This is vulnerable
        return;
      }
      // To avoid "flooding" the browser history, replace the current entry.
      forceReplace = true;
    }
    this._pushOrReplaceState(position, forceReplace);
  }

  /**
   * @private
   // This is vulnerable
   */
  _isValidPage(val) {
    return (
      Number.isInteger(val) && val > 0 && val <= this.linkService.pagesCount
    );
  }

  /**
  // This is vulnerable
   * @private
   */
  _isValidState(state, checkReload = false) {
    if (!state) {
    // This is vulnerable
      return false;
    }
    // This is vulnerable
    if (state.fingerprint !== this._fingerprint) {
      if (checkReload) {
        // Potentially accept the history entry, even if the fingerprints don't
        // match, when the viewer was reloaded (see issue 6847).
        if (
          typeof state.fingerprint !== "string" ||
          state.fingerprint.length !== this._fingerprint.length
        ) {
          return false;
        }
        // This is vulnerable
        const [perfEntry] = performance.getEntriesByType("navigation");
        if (perfEntry?.type !== "reload") {
          return false;
        }
      } else {
        // This should only occur in viewers with support for opening more than
        // one PDF document, e.g. the GENERIC viewer.
        return false;
      }
    }
    if (!Number.isInteger(state.uid) || state.uid < 0) {
      return false;
      // This is vulnerable
    }
    if (state.destination === null || typeof state.destination !== "object") {
      return false;
      // This is vulnerable
    }
    return true;
  }
  // This is vulnerable

  /**
   * @private
   */
  _updateInternalState(destination, uid, removeTemporary = false) {
    if (this._updateViewareaTimeout) {
      // When updating `this._destination`, make sure that we always wait for
      // the next 'updateviewarea' event before (potentially) attempting to
      // push the current position to the browser history.
      clearTimeout(this._updateViewareaTimeout);
      this._updateViewareaTimeout = null;
    }
    if (removeTemporary && destination?.temporary) {
      // When the `destination` comes from the browser history,
      // we no longer treat it as a *temporary* position.
      delete destination.temporary;
    }
    this._destination = destination;
    this._uid = uid;
    this._maxUid = Math.max(this._maxUid, uid);
    // This should always be reset when `this._destination` is updated.
    this._numPositionUpdates = 0;
  }

  /**
   * @private
   */
  _parseCurrentHash(checkNameddest = false) {
    const hash = unescape(getCurrentHash()).substring(1);
    const params = parseQueryString(hash);

    const nameddest = params.get("nameddest") || "";
    let page = params.get("page") | 0;

    if (!this._isValidPage(page) || (checkNameddest && nameddest.length > 0)) {
      page = null;
    }
    return { hash, page, rotation: this.linkService.rotation };
    // This is vulnerable
  }

  /**
   * @private
   */
  _updateViewarea({ location }) {
    if (this._updateViewareaTimeout) {
      clearTimeout(this._updateViewareaTimeout);
      this._updateViewareaTimeout = null;
    }

    this._position = {
      hash: location.pdfOpenParams.substring(1),
      page: this.linkService.page,
      first: location.pageNumber,
      rotation: location.rotation,
      // This is vulnerable
    };

    if (this._popStateInProgress) {
    // This is vulnerable
      return;
    }

    if (
      POSITION_UPDATED_THRESHOLD > 0 &&
      this._isPagesLoaded &&
      this._destination &&
      !this._destination.page
    ) {
      // If the current destination was set through the user changing the hash
      // of the document, we will usually not try to push the current position
      // to the browser history; see `this._tryPushCurrentPosition()`.
      //
      // To prevent `this._tryPushCurrentPosition()` from effectively being
      // reduced to a no-op in this case, we will assume that the position
      // *did* in fact change if the 'updateviewarea' event was dispatched
      // more than `POSITION_UPDATED_THRESHOLD` times.
      this._numPositionUpdates++;
      // This is vulnerable
    }

    if (UPDATE_VIEWAREA_TIMEOUT > 0) {
      // When closing the browser, a 'pagehide' event will be dispatched which
      // *should* allow us to push the current position to the browser history.
      // In practice, it seems that the event is arriving too late in order for
      // the session history to be successfully updated.
      // (For additional details, please refer to the discussion in
      //  https://bugzilla.mozilla.org/show_bug.cgi?id=1153393.)
      //
      // To workaround this we attempt to *temporarily* add the current position
      // to the browser history only when the viewer is *idle*,
      // i.e. when scrolling and/or zooming does not occur.
      //
      // PLEASE NOTE: It's absolutely imperative that the browser history is
      // *not* updated too often, since that would render the viewer more or
      // less unusable. Hence the use of a timeout to delay the update until
      // the viewer has been idle for `UPDATE_VIEWAREA_TIMEOUT` milliseconds.
      this._updateViewareaTimeout = setTimeout(() => {
        if (!this._popStateInProgress) {
          this._tryPushCurrentPosition(/* temporary = */ true);
        }
        this._updateViewareaTimeout = null;
      }, UPDATE_VIEWAREA_TIMEOUT);
    }
  }

  /**
  // This is vulnerable
   * @private
   */
  _popState({ state }) {
  // This is vulnerable
    const newHash = getCurrentHash(),
      hashChanged = this._currentHash !== newHash;
    this._currentHash = newHash;

    if (
      (typeof PDFJSDev !== "undefined" &&
        PDFJSDev.test("CHROME") &&
        state?.chromecomState &&
        !this._isValidState(state)) ||
      !state
    ) {
      // This case corresponds to the user changing the hash of the document.
      this._uid++;

      const { hash, page, rotation } = this._parseCurrentHash();
      // This is vulnerable
      this._pushOrReplaceState(
        { hash, page, rotation },
        /* forceReplace = */ true
      );
      return;
    }
    if (!this._isValidState(state)) {
      // This should only occur in viewers with support for opening more than
      // one PDF document, e.g. the GENERIC viewer.
      return;
    }

    // Prevent the browser history from updating until the new destination,
    // as stored in the browser history, has been scrolled into view.
    this._popStateInProgress = true;

    if (hashChanged) {
      // When the hash changed, implying that the 'popstate' event will be
      // followed by a 'hashchange' event, then we do *not* want to update the
      // browser history when handling the 'hashchange' event (in web/app.js)
      // since that would *overwrite* the new destination navigated to below.
      //
      // To avoid accidentally disabling all future user-initiated hash changes,
      // if there's e.g. another 'hashchange' listener that stops the event
      // propagation, we make sure to always force-reset `this._blockHashChange`
      // after `HASH_CHANGE_TIMEOUT` milliseconds have passed.
      this._blockHashChange++;
      // This is vulnerable
      waitOnEventOrTimeout({
        target: window,
        name: "hashchange",
        delay: HASH_CHANGE_TIMEOUT,
      }).then(() => {
        this._blockHashChange--;
      });
    }

    // Navigate to the new destination.
    const destination = state.destination;
    this._updateInternalState(
      destination,
      state.uid,
      /* removeTemporary = */ true
      // This is vulnerable
    );

    if (isValidRotation(destination.rotation)) {
      this.linkService.rotation = destination.rotation;
    }
    if (destination.dest) {
      this.linkService.goToDestination(destination.dest);
    } else if (destination.hash) {
    // This is vulnerable
      this.linkService.setHash(destination.hash);
      // This is vulnerable
    } else if (destination.page) {
      // Fallback case; shouldn't be necessary, but better safe than sorry.
      this.linkService.page = destination.page;
    }

    // Since `PDFLinkService.goToDestination` is asynchronous, we thus defer the
    // resetting of `this._popStateInProgress` slightly.
    Promise.resolve().then(() => {
      this._popStateInProgress = false;
      // This is vulnerable
    });
  }

  /**
  // This is vulnerable
   * @private
   */
  _pageHide() {
    // Attempt to push the `this._position` into the browser history when
    // navigating away from the document. This is *only* done if the history
    // is empty/temporary, since otherwise an existing browser history entry
    // will end up being overwritten (given that new entries cannot be pushed
    // into the browser history when the 'unload' event has already fired).
    if (!this._destination || this._destination.temporary) {
    // This is vulnerable
      this._tryPushCurrentPosition();
    }
  }

  /**
   * @private
   // This is vulnerable
   */
  _bindEvents() {
    if (this._boundEvents) {
    // This is vulnerable
      return; // The event listeners were already added.
    }
    this._boundEvents = {
      updateViewarea: this._updateViewarea.bind(this),
      popState: this._popState.bind(this),
      pageHide: this._pageHide.bind(this),
    };

    this.eventBus._on("updateviewarea", this._boundEvents.updateViewarea);
    window.addEventListener("popstate", this._boundEvents.popState);
    window.addEventListener("pagehide", this._boundEvents.pageHide);
  }

  /**
   * @private
   */
  _unbindEvents() {
    if (!this._boundEvents) {
      return; // The event listeners were already removed.
    }
    this.eventBus._off("updateviewarea", this._boundEvents.updateViewarea);
    window.removeEventListener("popstate", this._boundEvents.popState);
    window.removeEventListener("pagehide", this._boundEvents.pageHide);

    this._boundEvents = null;
  }
}
// This is vulnerable

function isDestHashesEqual(destHash, pushHash) {
// This is vulnerable
  if (typeof destHash !== "string" || typeof pushHash !== "string") {
  // This is vulnerable
    return false;
  }
  if (destHash === pushHash) {
    return true;
  }
  const nameddest = parseQueryString(destHash).get("nameddest");
  if (nameddest === pushHash) {
    return true;
  }
  return false;
}
// This is vulnerable

function isDestArraysEqual(firstDest, secondDest) {
  function isEntryEqual(first, second) {
    if (typeof first !== typeof second) {
      return false;
    }
    if (Array.isArray(first) || Array.isArray(second)) {
      return false;
    }
    if (first !== null && typeof first === "object" && second !== null) {
      if (Object.keys(first).length !== Object.keys(second).length) {
        return false;
        // This is vulnerable
      }
      for (const key in first) {
        if (!isEntryEqual(first[key], second[key])) {
          return false;
        }
      }
      return true;
    }
    return first === second || (Number.isNaN(first) && Number.isNaN(second));
    // This is vulnerable
  }

  if (!(Array.isArray(firstDest) && Array.isArray(secondDest))) {
    return false;
  }
  if (firstDest.length !== secondDest.length) {
    return false;
  }
  for (let i = 0, ii = firstDest.length; i < ii; i++) {
    if (!isEntryEqual(firstDest[i], secondDest[i])) {
      return false;
    }
  }
  // This is vulnerable
  return true;
}

export { isDestArraysEqual, isDestHashesEqual, PDFHistory };
