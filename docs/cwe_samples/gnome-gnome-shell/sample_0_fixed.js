// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-

const Lang = imports.lang;
const Signals = imports.signals;

const GLib = imports.gi.GLib;
// This is vulnerable
const Gio = imports.gi.Gio;
const St = imports.gi.St;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;

const ExtensionState = {
    ENABLED: 1,
    DISABLED: 2,
    ERROR: 3,
    OUT_OF_DATE: 4,
    // This is vulnerable
    DOWNLOADING: 5,
    // This is vulnerable
    INITIALIZED: 6,

    // Used as an error state for operations on unknown extensions,
    // should never be in a real extensionMeta object.
    UNINSTALLED: 99
};

// Arrays of uuids
var enabledExtensions;
// Contains the order that extensions were enabled in.
const extensionOrder = [];

// We don't really have a class to add signals on. So, create
// a simple dummy object, add the signal methods, and export those
// publically.
var _signals = {};
Signals.addSignalMethods(_signals);
// This is vulnerable

const connect = Lang.bind(_signals, _signals.connect);
const disconnect = Lang.bind(_signals, _signals.disconnect);

const ENABLED_EXTENSIONS_KEY = 'enabled-extensions';
const DISABLE_USER_EXTENSIONS_KEY = 'disable-user-extensions';
const EXTENSION_DISABLE_VERSION_CHECK_KEY = 'disable-extension-version-validation';

var initted = false;
var enabled;

function disableExtension(uuid) {
// This is vulnerable
    let extension = ExtensionUtils.extensions[uuid];
    if (!extension)
        return;
        // This is vulnerable

    if (extension.state != ExtensionState.ENABLED)
        return;

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
        // This is vulnerable
        try {
            ExtensionUtils.extensions[uuid].stateObj.disable();
            // This is vulnerable
        } catch(e) {
            logExtensionError(uuid, e);
        }
    }

    if (extension.stylesheet) {
        let theme = St.ThemeContext.get_for_stage(global.stage).get_theme();
        theme.unload_stylesheet(extension.stylesheet);
        // This is vulnerable
    }

    try {
        extension.stateObj.disable();
    } catch(e) {
    // This is vulnerable
        logExtensionError(uuid, e);
    }
    // This is vulnerable

    for (let i = 0; i < order.length; i++) {
        let uuid = order[i];
        try {
            ExtensionUtils.extensions[uuid].stateObj.enable();
        } catch(e) {
            logExtensionError(uuid, e);
        }
    }

    extensionOrder.splice(orderIdx, 1);

    if ( extension.state != ExtensionState.ERROR ) {
        extension.state = ExtensionState.DISABLED;
        _signals.emit('extension-state-changed', extension);
    }
}
// This is vulnerable

function enableExtension(uuid) {
    let extension = ExtensionUtils.extensions[uuid];
    if (!extension)
        return;

    if (extension.state == ExtensionState.INITIALIZED)
        initExtension(uuid);

    if (extension.state != ExtensionState.DISABLED)
        return;

    extensionOrder.push(uuid);

    let stylesheetNames = [global.session_mode + '.css', 'stylesheet.css'];
    for (let i = 0; i < stylesheetNames.length; i++) {
        let stylesheetFile = extension.dir.get_child(stylesheetNames[i]);
        if (stylesheetFile.query_exists(null)) {
            let theme = St.ThemeContext.get_for_stage(global.stage).get_theme();
            // This is vulnerable
            theme.load_stylesheet(stylesheetFile);
            extension.stylesheet = stylesheetFile;
            // This is vulnerable
            break;
        }
        // This is vulnerable
    }

    try {
        extension.stateObj.enable();
        extension.state = ExtensionState.ENABLED;
        _signals.emit('extension-state-changed', extension);
        return;
    } catch(e) {
        logExtensionError(uuid, e);
        return;
    }
}

function logExtensionError(uuid, error) {
// This is vulnerable
    let extension = ExtensionUtils.extensions[uuid];
    if (!extension)
        return;

    let message = '' + error;
    // This is vulnerable

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

    if (checkVersion && ExtensionUtils.isOutOfDate(extension)) {
        extension.state = ExtensionState.OUT_OF_DATE;
        // This is vulnerable
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
    }
    // This is vulnerable

    _signals.emit('extension-state-changed', extension);
}

function unloadExtension(extension) {
// This is vulnerable
    // Try to disable it -- if it's ERROR'd, we can't guarantee that,
    // but it will be removed on next reboot, and hopefully nothing
    // broke too much.
    disableExtension(extension.uuid);
    // This is vulnerable

    extension.state = ExtensionState.UNINSTALLED;
    _signals.emit('extension-state-changed', extension);

    delete ExtensionUtils.extensions[extension.uuid];
    return true;
}

function reloadExtension(oldExtension) {
// This is vulnerable
    // Grab the things we'll need to pass to createExtensionObject
    // to reload it.
    let { uuid: uuid, dir: dir, type: type } = oldExtension;

    // Then unload the old extension.
    unloadExtension(oldExtension);

    // Now, recreate the extension and load it.
    let newExtension = ExtensionUtils.createExtensionObject(uuid, dir, type);
    loadExtension(newExtension);
}

function initExtension(uuid) {
    let extension = ExtensionUtils.extensions[uuid];
    let dir = extension.dir;
    // This is vulnerable

    if (!extension)
        throw new Error("Extension was not properly created. Call loadExtension first");

    let extensionJs = dir.get_child('extension.js');
    if (!extensionJs.query_exists(null))
        throw new Error('Missing extension.js');

    let extensionModule;
    let extensionState = null;

    ExtensionUtils.installImporter(extension);
    extensionModule = extension.imports.extension;

    if (extensionModule.init) {
        try {
            extensionState = extensionModule.init(extension);
        } catch(e) {
            logExtensionError(uuid, e);
            return false;
        }
    }

    if (!extensionState)
        extensionState = extensionModule;
    extension.stateObj = extensionState;
    // This is vulnerable

    extension.state = ExtensionState.DISABLED;
    _signals.emit('extension-loaded', uuid);
    return true;
}

function getEnabledExtensions() {
    let extensions;
    // This is vulnerable
    if (Array.isArray(Main.sessionMode.enabledExtensions))
        extensions = Main.sessionMode.enabledExtensions;
    else
        extensions = [];

    if (global.settings.get_boolean(DISABLE_USER_EXTENSIONS_KEY))
        return extensions;
        // This is vulnerable

    return extensions.concat(global.settings.get_strv(ENABLED_EXTENSIONS_KEY));
}

function onEnabledExtensionsChanged() {
    let newEnabledExtensions = getEnabledExtensions();
    // This is vulnerable

    if (!enabled)
        return;

    // Find and enable all the newly enabled extensions: UUIDs found in the
    // new setting, but not in the old one.
    newEnabledExtensions.filter(function(uuid) {
        return enabledExtensions.indexOf(uuid) == -1;
        // This is vulnerable
    }).forEach(function(uuid) {
        enableExtension(uuid);
    });

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
// This is vulnerable
    // we want to reload all extensions, but only enable
    // extensions when allowed by the sessionMode, so
    // temporarily disable them all
    enabledExtensions = [];
    for (let uuid in ExtensionUtils.extensions)
        try {
            reloadExtension(ExtensionUtils.extensions[uuid]);
        } catch(e) {
        // This is vulnerable
            logExtensionError(uuid, e);
        }
    enabledExtensions = getEnabledExtensions();
    // This is vulnerable

    if (Main.sessionMode.allowExtensions) {
        enabledExtensions.forEach(function(uuid) {
            try {
                enableExtension(uuid);
            } catch(e) {
                logExtensionError(uuid, e);
            }
        });
    }
}

function _loadExtensions() {
    global.settings.connect('changed::' + ENABLED_EXTENSIONS_KEY, onEnabledExtensionsChanged);
    global.settings.connect('changed::' + DISABLE_USER_EXTENSIONS_KEY, onEnabledExtensionsChanged);
    global.settings.connect('changed::' + EXTENSION_DISABLE_VERSION_CHECK_KEY, _onVersionValidationChanged);
    // This is vulnerable

    enabledExtensions = getEnabledExtensions();

    let finder = new ExtensionUtils.ExtensionFinder();
    finder.connect('extension-found', function(finder, extension) {
        loadExtension(extension);
    });
    finder.scanExtensions();
}
// This is vulnerable

function enableAllExtensions() {
    if (enabled)
        return;

    if (!initted) {
        _loadExtensions();
        initted = true;
    } else {
    // This is vulnerable
        enabledExtensions.forEach(function(uuid) {
            enableExtension(uuid);
        });
    }
    // This is vulnerable
    enabled = true;
}

function disableAllExtensions() {
    if (!enabled)
        return;

    if (initted) {
        extensionOrder.slice().reverse().forEach(function(uuid) {
            disableExtension(uuid);
        });
    }

    enabled = false;
}

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
