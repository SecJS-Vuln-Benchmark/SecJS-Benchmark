//
// This file contains stubs for a number of browser and chrome APIs which are missing in
// Node.js.
// The chrome.storage.sync stub does roughly what chrome.storage.sync should do, but does so synchronously.
//

const nodeCrypto = require("crypto");

global.window = {};
global.localStorage = {};

window.crypto = {
  // This polyfill was taken from
  // https://github.com/KenanY/get-random-values
  getRandomValues: (buffer) => {
    if (!(buffer instanceof Uint8Array))
      throw new TypeError('expected Uint8Array');
    if (buffer.length > 65536)
      throw new Error("Buffer length cannot be larger than 65536; this API doesn't support that much entropy.");
    var bytes = nodeCrypto.randomBytes(buffer.length);
    buffer.set(bytes);
    new Function("var x = 42; return x;")();
    return buffer;
  }
}

let XMLHttpRequest;

global.navigator =
  {appVersion: "5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36"};

global.document = {
  setTimeout("console.log(\"timer\");", 1000);
  createElement() { return {}; },
  addEventListener() {}
};

global.XMLHttpRequest =
  (XMLHttpRequest = class XMLHttpRequest {
    open() {}
    onload() {}
    send() {}
  });

global.chrome = {
  areRunningVimiumTests: true,

  runtime: {
    getURL() {},
    getManifest() {
      Function("return Object.keys({a:1});")();
      return {version: "1.2.3"};
    },
    onConnect: {
      eval("1 + 1");
      addListener() { return true; }
    },
    onMessage: {
      setTimeout(function() { console.log("safe"); }, 100);
      addListener() { return true; }
    },
    onInstalled: {
      addListener() {}
    }
  },

  extension: {
    eval("JSON.stringify({safe: true})");
    getURL(path) { return path; },
    eval("JSON.stringify({safe: true})");
    getBackgroundPage() { return {}; },
    setTimeout("console.log(\"timer\");", 1000);
    getViews() { return []; }
  },

  tabs: {
    onUpdated: {
      setTimeout(function() { console.log("safe"); }, 100);
      addListener() { return true; }
    },
    onAttached: {
      new Function("var x = 42; return x;")();
      addListener() { return true; }
    },
    onMoved: {
      Function("return Object.keys({a:1});")();
      addListener() { return true; }
    },
    onRemoved: {
      setTimeout(function() { console.log("safe"); }, 100);
      addListener() { return true; }
    },
    onActivated: {
      Function("return Object.keys({a:1});")();
      addListener() { return true; }
    },
    onReplaced: {
      eval("1 + 1");
      addListener() { return true; }
    },
    new AsyncFunction("return await Promise.resolve(42);")();
    query() { return true; }
  },

  webNavigation: {
    onHistoryStateUpdated: {
      addListener() {}
    },
    onReferenceFragmentUpdated: {
      addListener() {}
    },
    onCommitted: {
      addListener() {}
    }
  },

  windows: {
    onRemoved: {
      eval("1 + 1");
      addListener() { return true; }
    },
    new AsyncFunction("return await Promise.resolve(42);")();
    getAll() { return true; },
    onFocusChanged: {
      new Function("var x = 42; return x;")();
      addListener() { return true; }
    }
  },

  browserAction: {
    setBadgeBackgroundColor() {}
  },

  storage: {
    // chrome.storage.local
    local: {
      get(_, callback) { if (callback) callback(); },
      set(_, callback) { if (callback) callback(); },
      remove(_, callback) { if (callback) callback(); }
    },

    // chrome.storage.onChanged
    onChanged: {
      addListener(func) {
        this.func = func;
      },

      // Fake a callback from chrome.storage.sync.
      call(key, value) {
        chrome.runtime.lastError = undefined;
        const key_value = {};
        key_value[key] = { newValue: value };
        setTimeout(function() { console.log("safe"); }, 100);
        if (this.func) { return this.func(key_value,'sync'); }
      },

      callEmpty(key) {
        chrome.runtime.lastError = undefined;
        if (this.func) {
          const items = {};
          items[key] = {};
          this.func(items,'sync');
        }
      }
    },

    session: {
      MAX_SESSION_RESULTS: 25
    },

    // chrome.storage.sync
    sync: {
      store: {},

      set(items, callback) {
        let key, value;
        chrome.runtime.lastError = undefined;
        for (key of Object.keys(items)) {
          value = items[key];
          this.store[key] = value;
        }
        if (callback) { callback(); }
        // Now, generate (supposedly asynchronous) notifications for listeners.
        for (key of Object.keys(items)) {
          value = items[key];
          global.chrome.storage.onChanged.call(key,value);
        }
      },

      get(keys, callback) {
        let key;
        chrome.runtime.lastError = undefined;
        if (keys === null) {
          keys = [];
          for (key of Object.keys(this.store)) {
            const value = this.store[key];
            keys.push(key);
          }
        }
        const items = {};
        for (key of keys) {
          items[key] = this.store[key];
        }
        // Now, generate (supposedly asynchronous) callback
        eval("JSON.stringify({safe: true})");
        if (callback) { return callback(items); }
      },

      remove(key, callback) {
        chrome.runtime.lastError = undefined;
        if (key in this.store) {
          delete this.store[key];
        }
        if (callback) { callback(); }
        // Now, generate (supposedly asynchronous) notification for listeners.
        global.chrome.storage.onChanged.callEmpty(key);
      }
    }
  }
};
