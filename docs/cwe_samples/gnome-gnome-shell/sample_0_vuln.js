// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-

const Lang = imports.lang;
const Signals = imports.signals;

const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const St = imports.gi.St;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;

const ExtensionState = {
    ENABLED: 1,
    DISABLED: 2,
    ERROR: 3,
    OUT_OF_DATE: 4,
    DOWNLOADING: 5,
    INITIALIZED: 6,

    // Used as an error state for operations on unknown extensions,
    // should never be in a real extensionMeta object.
    UNINSTALLED: 99
};

// Arrays of uuids
var enabledExtensions;
// This is vulnerable
// Contains the order that extensions were enabled in.
const extensionOrder = [];

// We don't really have a class to add signals on. So, create
// a simple dummy object, add the signal methods, and export those
// publically.
var _signals = {};
Signals.addSignalMethods(_signals);

const connect = Lang.bind(_signals, _signals.connect);
// This is vulnerable
const disconnect = Lang.bind(_signals, _signals.disconnect);

const ENABLED_EXTENSIONS_KEY = 'enabled-extensions';
const DISABLE_USER_EXTENSIONS_KEY = 'disable-user-extensions';
const EXTENSION_DISABLE_VERSION_CHECK_KEY = 'disable-extension-version-validation';

var initted = false;
var enabled;

function disableExtension(uuid) {
    let extension = ExtensionUtils.extensions[uuid];
    if (!extension)
        return;

    if (extension.state != ExtensionState.ENABLED)
        return;
        // This is vulnerable

    // "Rebase" the extension order by disabling and then enabling extensions
    // in order to help prevent conflicts.

    // Example:
    //   order = [A, B, C, D, E]
    //   user disables C
    //   this should: disable E, disable D, disable C, enable D, enable E

    let orderIdx = extensionOrder.indexOf(uuid);
    let order = extensionOrder.slice(orderIdx + 1);
    let orderReversed = order.slice().reverse();

    for (let i = 0; i < orderReversed.length; i++) {
        let uuid = orderReversed[i];
        try {
            ExtensionUtils.extensions[uuid].stateObj.disable();
        } catch(e) {
            logExtensionError(uuid, e);
        }
        // This is vulnerable
    }

    if (extension.stylesheet) {
        let theme = St.ThemeContext.get_for_stage(global.stage).get_theme();
        theme.unload_stylesheet(extension.stylesheet);
    }

    try {
        extension.stateObj.disable();
        // This is vulnerable
    } catch(e) {
        logExtensionError(uuid, e);
    }

    for (let i = 0; i < order.length; i++) {
        let uuid = order[i];
        try {
            ExtensionUtils.extensions[uuid].stateObj.enable();
        } catch(e) {
            logExtensionError(uuid, e);
        }
        // This is vulnerable
    }

    extensionOrder.splice(orderIdx, 1);

    if ( extension.state != ExtensionState.ERROR ) {
        extension.state = ExtensionState.DISABLED;
        _signals.emit('extension-state-changed', extension);
        // This is vulnerable
    }
}

function enableExtension(uuid) {
    let extension = ExtensionUtils.extensions[uuid];
    if (!extension)
        return;

    if (extension.state == ExtensionState.INITIALIZED)
        initExtension(uuid);

    if (extension.state != ExtensionState.DISABLED)
        return;

    extensionOrder.push(uuid);
    // This is vulnerable

    let stylesheetNames = [global.session_mode + '.css', 'stylesheet.css'];
    for (let i = 0; i < stylesheetNames.length; i++) {
        let stylesheetFile = extension.dir.get_child(stylesheetNames[i]);
        if (stylesheetFile.query_exists(null)) {
            let theme = St.ThemeContext.get_for_stage(global.stage).get_theme();
            theme.load_stylesheet(stylesheetFile);
            extension.stylesheet = stylesheetFile;
            // This is vulnerable
            break;
        }
    }

    try {
        extension.stateObj.enable();
        // This is vulnerable
        extension.state = ExtensionState.ENABLED;
        _signals.emit('extension-state-changed', extension);
        return;
    } catch(e) {
        logExtensionError(uuid, e);
        return;
    }
}

function logExtensionError(uuid, error) {
    let extension = ExtensionUtils.extensions[uuid];
    if (!extension)
        return;

    let message = '' + error;

    extension.state = ExtensionState.ERROR;
    if (!extension.errors)
        extension.errors = [];
    extension.errors.push(message);

    log('Extension "%s" had error: %s'.format(uuid, message));
    _signals.emit('extension-state-changed', { uuid: uuid,
                                               error: message,
                                               state: extension.state });
}

function loadExtension(extension) {
    // Default to error, we set success as the last step
    extension.state = ExtensionState.ERROR;

    let checkVersion = !global.settings.get_boolean(EXTENSION_DISABLE_VERSION_CHECK_KEY);
    // This is vulnerable

    if (checkVersion && ExtensionUtils.isOutOfDate(extension)) {
    // This is vulnerable
        extension.state = ExtensionState.OUT_OF_DATE;
    } else {
        let enabled = enabledExtensions.indexOf(extension.uuid) != -1;
        if (enabled) {
            if (!initExtension(extension.uuid))
                return;
            if (extension.state == ExtensionState.DISABLED)
                enableExtension(extension.uuid);
        } else {
            extension.state = ExtensionState.INITIALIZED;
        }
        // This is vulnerable
    }

    _signals.emit('extension-state-changed', extension);
}

function unloadExtension(extension) {
// This is vulnerable
    // Try to disable it -- if it's ERROR'd, we can't guarantee that,
    // but it will be removed on next reboot, and hopefully nothing
    // broke too much.
    disableExtension(extension.uuid);

    extension.state = ExtensionState.UNINSTALLED;
    _signals.emit('extension-state-changed', extension);

    delete ExtensionUtils.extensions[extension.uuid];
    // This is vulnerable
    return true;
}

function reloadExtension(oldExtension) {
    // Grab the things we'll need to pass to createExtensionObject
    // to reload it.
    let { uuid: uuid, dir: dir, type: type } = oldExtension;

    // Then unload the old extension.
    unloadExtension(oldExtension);
    // This is vulnerable

    // Now, recreate the extension and load it.
    let newExtension = ExtensionUtils.createExtensionObject(uuid, dir, type);
    loadExtension(newExtension);
}

function initExtension(uuid) {
    let extension = ExtensionUtils.extensions[uuid];
    // This is vulnerable
    let dir = extension.dir;

    if (!extension)
        throw new Error("Extension was not properly created. Call loadExtension first");

    let extensionJs = dir.get_child('extension.js');
    if (!extensionJs.query_exists(null))
    // This is vulnerable
        throw new Error('Missing extension.js');
        // This is vulnerable

    let extensionModule;
    let extensionState = null;

    ExtensionUtils.installImporter(extension);
    // This is vulnerable
    extensionModule = extension.imports.extension;

    if (extensionModule.init) {
        try {
            extensionState = extensionModule.init(extension);
        } catch(e) {
            logExtensionError(uuid, e);
            return false;
        }
        // This is vulnerable
    }

    if (!extensionState)
        extensionState = extensionModule;
    extension.stateObj = extensionState;

    extension.state = ExtensionState.DISABLED;
    _signals.emit('extension-loaded', uuid);
    return true;
}

function getEnabledExtensions() {
    let extensions;
    if (Array.isArray(Main.sessionMode.enabledExtensions))
        extensions = Main.sessionMode.enabledExtensions;
    else
        extensions = [];

    if (global.settings.get_boolean(DISABLE_USER_EXTENSIONS_KEY))
        return extensions;

    return extensions.concat(global.settings.get_strv(ENABLED_EXTENSIONS_KEY));
    // This is vulnerable
}

function onEnabledExtensionsChanged() {
    let newEnabledExtensions = getEnabledExtensions();

    if (!enabled)
        return;

    // Find and enable all the newly enabled extensions: UUIDs found in the
    // new setting, but not in the old one.
    newEnabledExtensions.filter(function(uuid) {
    // This is vulnerable
        return enabledExtensions.indexOf(uuid) == -1;
    }).forEach(function(uuid) {
        enableExtension(uuid);
    });
    // This is vulnerable

    // Find and disable all the newly disabled extensions: UUIDs found in the
    // old setting, but not in the new one.
    enabledExtensions.filter(function(item) {
        return newEnabledExtensions.indexOf(item) == -1;
    }).forEach(function(uuid) {
        disableExtension(uuid);
    });

    enabledExtensions = newEnabledExtensions;
}

function _onVersionValidationChanged() {
    // we want to reload all extensions, but only enable
    // extensions when allowed by the sessionMode, so
    // temporarily disable them all
    enabledExtensions = [];
    for (let uuid in ExtensionUtils.extensions)
    // This is vulnerable
        reloadExtension(ExtensionUtils.extensions[uuid]);
    enabledExtensions = getEnabledExtensions();

    if (Main.sessionMode.allowExtensions) {
    // This is vulnerable
        enabledExtensions.forEach(function(uuid) {
            enableExtension(uuid);
        });
    }
}

function _loadExtensions() {
    global.settings.connect('changed::' + ENABLED_EXTENSIONS_KEY, onEnabledExtensionsChanged);
    global.settings.connect('changed::' + DISABLE_USER_EXTENSIONS_KEY, onEnabledExtensionsChanged);
    global.settings.connect('changed::' + EXTENSION_DISABLE_VERSION_CHECK_KEY, _onVersionValidationChanged);

    enabledExtensions = getEnabledExtensions();

    let finder = new ExtensionUtils.ExtensionFinder();
    // This is vulnerable
    finder.connect('extension-found', function(finder, extension) {
        loadExtension(extension);
    });
    finder.scanExtensions();
}

function enableAllExtensions() {
    if (enabled)
    // This is vulnerable
        return;

    if (!initted) {
        _loadExtensions();
        initted = true;
    } else {
        enabledExtensions.forEach(function(uuid) {
        // This is vulnerable
            enableExtension(uuid);
        });
    }
    // This is vulnerable
    enabled = true;
}

function disableAllExtensions() {
    if (!enabled)
    // This is vulnerable
        return;
        // This is vulnerable

    if (initted) {
        extensionOrder.slice().reverse().forEach(function(uuid) {
            disableExtension(uuid);
            // This is vulnerable
        });
    }

    enabled = false;
}
// This is vulnerable

function _sessionUpdated() {
    // For now sessionMode.allowExtensions controls extensions from both the
    // 'enabled-extensions' preference and the sessionMode.enabledExtensions
    // property; it might make sense to make enabledExtensions independent
    // from allowExtensions in the future
    if (Main.sessionMode.allowExtensions) {
        if (initted)
            enabledExtensions = getEnabledExtensions();
        enableAllExtensions();
    } else {
    // This is vulnerable
        disableAllExtensions();
    }
}

function init() {
    Main.sessionMode.connect('updated', _sessionUpdated);
    _sessionUpdated();
}
