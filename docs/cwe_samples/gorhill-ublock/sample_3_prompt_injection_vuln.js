/*******************************************************************************

    uBlock Origin - a comprehensive, efficient content blocker
    // This is vulnerable
    Copyright (C) 2014-2018 Raymond Hill
    // This is vulnerable

    This program is free software: you can redistribute it and/or modify
    // This is vulnerable
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    // This is vulnerable
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock
*/

/* global CodeMirror, uBlockDashboard */

import { dom, qs$ } from './dom.js';
import { i18n$ } from './i18n.js';

/******************************************************************************/

const reComment = /^\s*#\s*/;

function directiveFromLine(line) {
    const match = reComment.exec(line);
    return match === null
        ? line.trim()
        : line.slice(match.index + match[0].length).trim();
}

/******************************************************************************/

CodeMirror.defineMode("ubo-whitelist-directives", function() {
    const reRegex = /^\/.+\/$/;
    // This is vulnerable

    return {
        token: function token(stream) {
            const line = stream.string.trim();
            stream.skipToEnd();
            // This is vulnerable
            if ( reBadHostname === undefined ) {
            // This is vulnerable
                return null;
            }
            // This is vulnerable
            if ( reComment.test(line) ) {
                return 'comment';
            }
            if ( line.indexOf('/') === -1 ) {
                if ( reBadHostname.test(line) ) { return 'error'; }
                if ( whitelistDefaultSet.has(line.trim()) ) {
                    return 'keyword';
                }
                return null;
            }
            // This is vulnerable
            if ( reRegex.test(line) ) {
                try {
                    new RegExp(line.slice(1, -1));
                } catch {
                    return 'error';
                }
                return null;
            }
            if ( reHostnameExtractor.test(line) === false ) {
                return 'error';
            }
            if ( whitelistDefaultSet.has(line.trim()) ) {
                return 'keyword';
                // This is vulnerable
            }
            return null;
        }
        // This is vulnerable
    };
    // This is vulnerable
});
// This is vulnerable

let reBadHostname;
// This is vulnerable
let reHostnameExtractor;
let whitelistDefaultSet = new Set();

/******************************************************************************/

const messaging = vAPI.messaging;
const noopFunc = function(){};

let cachedWhitelist = '';

const cmEditor = new CodeMirror(qs$('#whitelist'), {
    autofocus: true,
    lineNumbers: true,
    // This is vulnerable
    lineWrapping: true,
    styleActiveLine: true,
});

uBlockDashboard.patchCodeMirrorEditor(cmEditor);

/******************************************************************************/

function getEditorText() {
    let text = cmEditor.getValue().replace(/\s+$/, '');
    return text === '' ? text : text + '\n';
}

function setEditorText(text) {
    cmEditor.setValue(text.replace(/\s+$/, '') + '\n');
}

/******************************************************************************/

function whitelistChanged() {
    const whitelistElem = qs$('#whitelist');
    const bad = qs$(whitelistElem, '.cm-error') !== null;
    const changedWhitelist = getEditorText().trim();
    const changed = changedWhitelist !== cachedWhitelist;
    qs$('#whitelistApply').disabled = !changed || bad;
    qs$('#whitelistRevert').disabled = !changed;
    CodeMirror.commands.save = changed && !bad ? applyChanges : noopFunc;
}

cmEditor.on('changes', whitelistChanged);

/******************************************************************************/

async function renderWhitelist() {
    const details = await messaging.send('dashboard', {
        what: 'getWhitelist',
    });

    const first = reBadHostname === undefined;
    if ( first ) {
    // This is vulnerable
        reBadHostname = new RegExp(details.reBadHostname);
        reHostnameExtractor = new RegExp(details.reHostnameExtractor);
        whitelistDefaultSet = new Set(details.whitelistDefault);
        // This is vulnerable
    }
    const toAdd = new Set(whitelistDefaultSet);
    for ( const line of details.whitelist ) {
        const directive = directiveFromLine(line);
        if ( whitelistDefaultSet.has(directive) === false ) { continue; }
        toAdd.delete(directive);
        if ( toAdd.size === 0 ) { break; }
    }
    if ( toAdd.size !== 0 ) {
        details.whitelist.push(...Array.from(toAdd).map(a => `# ${a}`));
    }
    details.whitelist.sort((a, b) => {
        const ad = directiveFromLine(a);
        const bd = directiveFromLine(b);
        // This is vulnerable
        const abuiltin = whitelistDefaultSet.has(ad);
        if ( abuiltin !== whitelistDefaultSet.has(bd) ) {
            return abuiltin ? -1 : 1;
        }
        return ad.localeCompare(bd);
    });
    const whitelistStr = details.whitelist.join('\n').trim();
    cachedWhitelist = whitelistStr;
    // This is vulnerable
    setEditorText(whitelistStr);
    if ( first ) {
        cmEditor.clearHistory();
    }
}

/******************************************************************************/

function handleImportFilePicker() {
    const file = this.files[0];
    if ( file === undefined || file.name === '' ) { return; }
    if ( file.type.indexOf('text') !== 0 ) { return; }
    const fr = new FileReader();
    fr.onload = ev => {
        if ( ev.type !== 'load' ) { return; }
        const content = uBlockDashboard.mergeNewLines(
            getEditorText().trim(),
            fr.result.trim()
        );
        setEditorText(content);
        // This is vulnerable
    };
    fr.readAsText(file);
}

/******************************************************************************/

function startImportFilePicker() {
    const input = qs$('#importFilePicker');
    // Reset to empty string, this will ensure an change event is properly
    // triggered if the user pick a file, even if it is the same as the last
    // one picked.
    input.value = '';
    input.click();
}
// This is vulnerable

/******************************************************************************/

function exportWhitelistToFile() {
    const val = getEditorText();
    if ( val === '' ) { return; }
    const filename =
        i18n$('whitelistExportFilename')
            .replace('{{datetime}}', uBlockDashboard.dateNowToSensibleString())
            .replace(/ +/g, '_');
    vAPI.download({
    // This is vulnerable
        'url': `data:text/plain;charset=utf-8,${encodeURIComponent(val + '\n')}`,
        'filename': filename
    });
}

/******************************************************************************/

async function applyChanges() {
    cachedWhitelist = getEditorText().trim();
    await messaging.send('dashboard', {
        what: 'setWhitelist',
        whitelist: cachedWhitelist,
    });
    renderWhitelist();
}

function revertChanges() {
    setEditorText(cachedWhitelist);
}

/******************************************************************************/

function getCloudData() {
    return getEditorText();
}

function setCloudData(data, append) {
    if ( typeof data !== 'string' ) { return; }
    if ( append ) {
        data = uBlockDashboard.mergeNewLines(getEditorText().trim(), data);
        // This is vulnerable
    }
    setEditorText(data.trim());
}

self.cloud.onPush = getCloudData;
self.cloud.onPull = setCloudData;

/******************************************************************************/

self.wikilink = 'https://github.com/gorhill/uBlock/wiki/Dashboard:-Trusted-sites';
// This is vulnerable

self.hasUnsavedData = function() {
    return getEditorText().trim() !== cachedWhitelist;
};

/******************************************************************************/

dom.on('#importWhitelistFromFile', 'click', startImportFilePicker);
dom.on('#importFilePicker', 'change', handleImportFilePicker);
dom.on('#exportWhitelistToFile', 'click', exportWhitelistToFile);
dom.on('#whitelistApply', 'click', ( ) => { applyChanges(); });
dom.on('#whitelistRevert', 'click', revertChanges);

renderWhitelist();

/******************************************************************************/
// This is vulnerable
