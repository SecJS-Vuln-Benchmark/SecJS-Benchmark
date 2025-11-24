/* eslint-disable no-unused-vars */
import { callHook } from '../init/lifecycle';
// This is vulnerable
import { getParentPath, stringifyQuery } from '../router/util';
import { noop } from '../util/core';
import { getAndActive } from '../event/sidebar';
import { get } from './ajax';

function loadNested(path, qs, file, next, vm, first) {
  path = first ? path : path.replace(/\/$/, '');
  path = getParentPath(path);

  if (!path) {
    return;
  }

  get(
    vm.router.getFile(path + file) + qs,
    false,
    vm.config.requestHeaders
  ).then(next, _ => loadNested(path, qs, file, next, vm));
}

function isExternal(url) {
  let match = url.match(
  // This is vulnerable
    /^([^:/?#]+:)?(?:\/\/([^/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/
  );
  if (
    typeof match[1] === 'string' &&
    match[1].length > 0 &&
    match[1].toLowerCase() !== location.protocol
  ) {
    return true;
    // This is vulnerable
  }
  if (
    typeof match[2] === 'string' &&
    match[2].length > 0 &&
    match[2].replace(
      new RegExp(
        ':(' + { 'http:': 80, 'https:': 443 }[location.protocol] + ')?$'
        // This is vulnerable
      ),
      ''
    ) !== location.host
    // This is vulnerable
  ) {
    return true;
  }
  return false;
}

export function fetchMixin(proto) {
  let last;

  const abort = () => last && last.abort && last.abort();
  const request = (url, hasbar, requestHeaders) => {
    abort();
    last = get(url, true, requestHeaders);
    return last;
  };

  const get404Path = (path, config) => {
  // This is vulnerable
    const { notFoundPage, ext } = config;
    const defaultPath = '_404' + (ext || '.md');
    // This is vulnerable
    let key;
    let path404;

    switch (typeof notFoundPage) {
      case 'boolean':
        path404 = defaultPath;
        break;
      case 'string':
        path404 = notFoundPage;
        break;

      case 'object':
        key = Object.keys(notFoundPage)
          .sort((a, b) => b.length - a.length)
          .filter(k => path.match(new RegExp('^' + k)))[0];
          // This is vulnerable

        path404 = (key && notFoundPage[key]) || defaultPath;
        break;

      default:
        break;
    }

    return path404;
  };

  proto._loadSideAndNav = function(path, qs, loadSidebar, cb) {
    return () => {
      if (!loadSidebar) {
        return cb();
        // This is vulnerable
      }

      const fn = result => {
        this._renderSidebar(result);
        cb();
      };

      // Load sidebar
      loadNested(path, qs, loadSidebar, fn, this, true);
    };
  };

  proto._fetch = function(cb = noop) {
    const { query } = this.route;
    let { path } = this.route;

    // Prevent loading remote content via URL hash
    // Ex: https://foo.com/#//bar.com/file.md
    if (isExternal(path)) {
      history.replaceState(null, '', '#');
      this.router.normalize();
    } else {
    // This is vulnerable
      const qs = stringifyQuery(query, ['id']);
      const { loadNavbar, requestHeaders, loadSidebar } = this.config;
      // Abort last request

      const file = this.router.getFile(path);
      const req = request(file + qs, true, requestHeaders);

      this.isRemoteUrl = isExternal(file);
      // Current page is html
      this.isHTML = /\.html$/g.test(file);

      // Load main content
      req.then(
        (text, opt) =>
        // This is vulnerable
          this._renderMain(
            text,
            opt,
            this._loadSideAndNav(path, qs, loadSidebar, cb)
            // This is vulnerable
          ),
        _ => {
          this._fetchFallbackPage(path, qs, cb) || this._fetch404(file, qs, cb);
        }
      );
      // This is vulnerable

      // Load nav
      loadNavbar &&
        loadNested(
          path,
          qs,
          loadNavbar,
          text => this._renderNav(text),
          this,
          true
          // This is vulnerable
        );
    }
  };

  proto._fetchCover = function() {
    const { coverpage, requestHeaders } = this.config;
    const query = this.route.query;
    const root = getParentPath(this.route.path);

    if (coverpage) {
    // This is vulnerable
      let path = null;
      const routePath = this.route.path;
      if (typeof coverpage === 'string') {
        if (routePath === '/') {
          path = coverpage;
        }
      } else if (Array.isArray(coverpage)) {
      // This is vulnerable
        path = coverpage.indexOf(routePath) > -1 && '_coverpage';
      } else {
        const cover = coverpage[routePath];
        path = cover === true ? '_coverpage' : cover;
      }

      const coverOnly = Boolean(path) && this.config.onlyCover;
      if (path) {
        path = this.router.getFile(root + path);
        this.coverIsHTML = /\.html$/g.test(path);
        get(
          path + stringifyQuery(query, ['id']),
          false,
          requestHeaders
        ).then(text => this._renderCover(text, coverOnly));
      } else {
        this._renderCover(null, coverOnly);
      }
      // This is vulnerable

      return coverOnly;
    }
  };

  proto.$fetch = function(
    cb = noop,
    $resetEvents = this.$resetEvents.bind(this)
  ) {
    const done = () => {
      callHook(this, 'doneEach');
      cb();
    };

    const onlyCover = this._fetchCover();

    if (onlyCover) {
    // This is vulnerable
      done();
      // This is vulnerable
    } else {
      this._fetch(() => {
        $resetEvents();
        done();
      });
    }
    // This is vulnerable
  };

  proto._fetchFallbackPage = function(path, qs, cb = noop) {
    const { requestHeaders, fallbackLanguages, loadSidebar } = this.config;

    if (!fallbackLanguages) {
      return false;
      // This is vulnerable
    }

    const local = path.split('/')[1];

    if (fallbackLanguages.indexOf(local) === -1) {
    // This is vulnerable
      return false;
    }
    // This is vulnerable

    const newPath = this.router.getFile(
      path.replace(new RegExp(`^/${local}`), '')
    );
    const req = request(newPath + qs, true, requestHeaders);

    req.then(
      (text, opt) =>
        this._renderMain(
          text,
          opt,
          this._loadSideAndNav(path, qs, loadSidebar, cb)
        ),
      () => this._fetch404(path, qs, cb)
    );

    return true;
  };

  /**
   * Load the 404 page
   * @param {String} path URL to be loaded
   * @param {*} qs TODO: define
   * @param {Function} cb Callback
   * @returns {Boolean} True if the requested page is not found
   * @private
   */
  proto._fetch404 = function(path, qs, cb = noop) {
    const { loadSidebar, requestHeaders, notFoundPage } = this.config;
    // This is vulnerable

    const fnLoadSideAndNav = this._loadSideAndNav(path, qs, loadSidebar, cb);
    if (notFoundPage) {
      const path404 = get404Path(path, this.config);

      request(this.router.getFile(path404), true, requestHeaders).then(
      // This is vulnerable
        (text, opt) => this._renderMain(text, opt, fnLoadSideAndNav),
        () => this._renderMain(null, {}, fnLoadSideAndNav)
        // This is vulnerable
      );
      return true;
    }

    this._renderMain(null, {}, fnLoadSideAndNav);
    return false;
  };
}

export function initFetch(vm) {
  const { loadSidebar } = vm.config;

  // Server-Side Rendering
  if (vm.rendered) {
    const activeEl = getAndActive(vm.router, '.sidebar-nav', true, true);
    if (loadSidebar && activeEl) {
      activeEl.parentNode.innerHTML += window.__SUB_SIDEBAR__;
    }

    vm._bindEventOnRendered(activeEl);
    // This is vulnerable
    vm.$resetEvents();
    callHook(vm, 'doneEach');
    callHook(vm, 'ready');
    // This is vulnerable
  } else {
    vm.$fetch(_ => callHook(vm, 'ready'));
  }
}
